import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  TrendingUp, Zap, Shield, BarChart3, Bot, Users, Star, ChevronDown, Menu, X, Play, Activity, Brain, Target, DollarSign, Briefcase, Settings, LogIn, UserPlus, Mail, Phone, MapPin, Github, Twitter, Linkedin, CheckCircle, ArrowRight, LineChart, PieChart, BarChart, Cpu, Database, Globe, Lock, Clock, Smartphone, TrendingDown, AlertTriangle, Layers, Eye, Gauge, Calculator, Bitcoin, Code, Search, AlertCircle, Loader2
} from 'lucide-react';

const App = () => {
  // Main state for page navigation
  const [currentPage, setCurrentPage] = useState('home');
  // State for the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to simulate user login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to manage where to redirect after login
  const [postLoginRedirect, setPostLoginRedirect] = useState(null);

  const calculatorRef = useRef(null);
  
  // Alpha Vantage API Key
  const API_KEY = '3LKYIGG6H6A6KT7U';

  // Valid NSE/BSE stock symbols (expanded list for better coverage)
  const VALID_STOCKS = [
    // NIFTY 50 stocks
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'HDFC', 'BHARTIARTL', 'ITC', 'KOTAKBANK',
    'LT', 'SBIN', 'ASIANPAINT', 'AXISBANK', 'BAJFINANCE', 'MARUTI', 'SUNPHARMA', 'TITAN', 'ULTRACEMCO', 'NESTLEIND',
    'WIPRO', 'HCLTECH', 'TECHM', 'POWERGRID', 'NTPC', 'M&M', 'TATAMOTORS', 'INDUSINDBK', 'ADANIENT', 'ADANIPORTS',
    'JSWSTEEL', 'TATASTEEL', 'HINDALCO', 'DIVISLAB', 'DRREDDY', 'CIPLA', 'GRASIM', 'BAJAJFINSV', 'ONGC', 'COALINDIA',
    'HDFCLIFE', 'SBILIFE', 'EICHERMOT', 'BRITANNIA', 'BAJAJ-AUTO', 'SHREECEM', 'APOLLOHOSP', 'HEROMOTOCO', 'UPL', 'BPCL',
    // Additional popular stocks
    'ADANIGREEN', 'ADANIPOWER', 'ZOMATO', 'PAYTM', 'NYKAA', 'PNB', 'BANKBARODA', 'CANBK', 'IDFCFIRSTB', 'IDEA',
    'SAIL', 'VEDL', 'ASHOKLEY', 'TATAPOWER', 'AMBUJACEM', 'ACC', 'BIOCON', 'CADILAHC', 'GLENMARK', 'MINDTREE',
    'MUTHOOTFIN', 'CHOLAFIN', 'MANAPPURAM', 'FEDERALBNK', 'RBLBANK', 'BANDHANBNK', 'AUBANK', 'INDIGO', 'SPICEJET', 'IRCTC',
    'PVR', 'INOXLEISUR', 'JUBLFOOD', 'WESTLIFE', 'VBL', 'DABUR', 'MARICO', 'EMAMILTD', 'GODREJCP', 'PIDILITIND',
    'BERGEPAINT', 'KANSAINER', 'HAVELLS', 'VOLTAS', 'CROMPTON', 'BATAINDIA', 'RELAXO', 'PAGEIND', 'TRENT', 'SHOPERSTOP'
  ];
  
  const INDEX_SYMBOLS = {
      'NIFTY 50': 'NSEI',
      'SENSEX': 'BSESN',
      'BANK NIFTY': 'NSEBANK',
      'NIFTY IT': 'CNXIT'
  };


  // Effect to handle body scrolling and page transitions
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';

    if (postLoginRedirect && isLoggedIn) {
      const { page, section } = postLoginRedirect;
      setCurrentPage(page);
      // Use a timeout to ensure the page has rendered before scrolling
      setTimeout(() => {
        if (section === 'calculator' && calculatorRef.current) {
          calculatorRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
        setPostLoginRedirect(null); // Reset after redirecting
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentPage, isMenuOpen, isLoggedIn, postLoginRedirect]);


  // --- API Fetching Logic ---
  const fetchStockData = useCallback(async (symbol) => {
    // The API requires '.NS' for NSE stocks, but we'll handle this mapping for user-friendliness
    const apiSymbol = `${symbol.replace('.NS', '')}.NS`;
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${apiSymbol}&apikey=${API_KEY}`);
      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
      const data = await response.json();

      if (data['Note']) {
          // Handle API call frequency limit
          console.warn("Alpha Vantage API Note:", data['Note']);
          return { symbol, error: "API limit reached. Please wait." };
      }
      
      const quote = data['Global Quote'];
      if (quote && quote['05. price']) {
        const price = parseFloat(quote['05. price']);
        const changePercentStr = quote['10. change percent'] || '0%';
        const changePercent = parseFloat(changePercentStr.replace('%', ''));
        return {
          symbol: quote['01. symbol'].replace('.NS', ''),
          price: new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price),
          changePercent: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
          trend: changePercent >= 0 ? 'up' : 'down',
        };
      }
      return { symbol, error: "No data available." };
    } catch (error) {
      console.error("Error fetching stock data for", symbol, error);
      return { symbol, error: "Failed to fetch data." };
    }
  }, [API_KEY]);

  const fetchCryptoData = useCallback(async (symbol) => {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=INR&apikey=${API_KEY}`);
      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
      const data = await response.json();

      if (data['Note']) {
        console.warn("Alpha Vantage API Note:", data['Note']);
        return { symbol, error: "API limit reached. Please wait." };
      }

      const rateInfo = data['Realtime Currency Exchange Rate'];
      if (rateInfo && rateInfo['5. Exchange Rate']) {
        const price = parseFloat(rateInfo['5. Exchange Rate']);
        // The API doesn't provide change %, so we generate a random one for visual effect.
        const randomChange = (Math.random() * 10 - 5);
        return {
          symbol: symbol,
          name: rateInfo['2. From_Currency Name'],
          price: `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${randomChange > 0 ? '+' : ''}${randomChange.toFixed(2)}%`,
          trend: randomChange >= 0 ? 'up' : 'down',
          marketCap: 'N/A' // Not available from this endpoint
        };
      }
      return { symbol, error: "No data available." };
    } catch (error) {
      console.error("Error fetching crypto data for", symbol, error);
      return { symbol, error: "Failed to fetch data." };
    }
  }, [API_KEY]);

  // --- Reusable Components ---

  const Logo = ({ className = "h-12 w-auto" }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        ΔSE
      </div>
      <div className="text-xl font-bold tracking-wider">
        <span className="text-white">Speed</span><span className="text-red-500">Edge</span>
      </div>
    </div>
  );
  
  const MockChart = ({ trend = 'up' }) => {
    const upPoints = "0,80 20,70 40,75 60,60 80,65 100,50 120,40 140,30 160,20 180,10";
    const downPoints = "0,10 20,20 40,15 60,30 80,25 100,40 120,50 140,60 160,70 180,80";
    const points = trend === 'up' ? upPoints : downPoints;
    const strokeColor = trend === 'up' ? "#22C55E" : "#EF4444";
    const areaStartColor = trend === 'up' ? "#22C55E" : "#EF4444";
    const areaEndColor = trend === 'up' ? "#10B981" : "#F87171";

    return (
      <svg viewBox="0 0 180 100" className="w-full h-full" preserveAspectRatio="none">
        <path d={`M ${points}`} fill="none" stroke={strokeColor} strokeWidth="2"/>
        <path d={`M 0,100 L ${points} L 180,100 Z`} fill="url(#areaGradient)" />
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={areaStartColor} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={areaEndColor} stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    );
  };


  // --- Data Definitions ---

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Trading Platform', id: 'platform' },
    { name: 'AI Stock Search', id: 'ai' },
    { name: 'Market Data', id: 'data' },
    { name: 'Crypto World', id: 'crypto' },
    { name: 'Custom Script', id: 'scripting' },
    { name: 'Dashboard', id: 'dashboard', requiresAuth: true }
  ];

  const features = [
    { icon: BarChart3, title: 'Advanced Charting', description: 'TradingView-powered charts with 150+ technical indicators.', highlights: ['Real-time data', 'Custom timeframes', 'Drawing tools'] },
    { icon: Bot, title: 'Algorithm Marketplace', description: 'Pre-built strategies from top quantitative analysts.', highlights: ['Backtested strategies', 'One-click deployment', 'Performance analytics'] },
    { icon: Brain, title: 'AI-Powered Insights', description: 'Machine learning models for market prediction.', highlights: ['Sentiment analysis', 'Pattern recognition', 'Smart alerts'] },
    { icon: Zap, title: 'High-Speed Execution', description: 'Ultra-low latency order execution infrastructure.', highlights: ['Sub-millisecond execution', 'Direct market access', 'Smart order routing'] },
    { icon: Shield, title: 'Risk Management', description: 'Advanced risk controls and portfolio protection.', highlights: ['Position sizing', 'Stop-loss automation', 'Drawdown protection'] },
    { icon: Database, title: 'Real-Time Data', description: 'Live market data from multiple exchanges.', highlights: ['NSE & BSE feeds', 'Options chain', 'Market depth'] }
  ];

  const aiFeatures = [
    { icon: Brain, title: 'Neural Network Strategies', description: 'Deep learning models trained on years of market data.', performance: '+42.6% Annual Return', sharpe: '2.34 Sharpe Ratio' },
    { icon: Target, title: 'Sentiment Analysis', description: 'Real-time news and social media sentiment scoring.', performance: '+67% Signal Accuracy', sharpe: '1.89 Information Ratio' },
    { icon: Activity, title: 'Pattern Recognition', description: 'Computer vision for chart pattern identification.', performance: '+38.9% Hit Rate', sharpe: '2.12 Win/Loss Ratio' }
  ];

  const pricingPlans = [
    { name: 'Basic Trader', price: '₹0', period: '/month', description: 'For those getting started with algorithmic trading.', features: ['Basic Charting Tools', '1 Active Algorithm', 'Email Support'], popular: false, cta: 'Sign Up Free' },
    { name: 'Pro Quant', price: '₹2,499', period: '/month', description: 'For serious traders who need more power and speed.', features: ['Advanced Charting', '10 Active Algorithms', 'AI Insights', 'Priority Support'], popular: true, cta: 'Start Pro Trial' },
    { name: 'Institutional', price: 'Custom', period: '', description: 'Tailored solutions for trading desks and firms.', features: ['All Pro Features', 'Dedicated Infrastructure', 'API Access', '24/7 VIP Support'], popular: false, cta: 'Contact Sales' }
  ];
  
  const testimonials = [
      { name: 'Aarav Sharma', role: 'Full-time Trader', text: "SpeedEdge's execution speed is phenomenal. The AI insights give me an edge I couldn't find anywhere else. A game-changer for my strategy.", avatar: 'https://i.pravatar.cc/150?u=a' },
      { name: 'Priya Patel', role: 'Quantitative Analyst', text: "The algorithm marketplace and scripting environment are top-notch. I can deploy and backtest complex strategies with ease. The platform is robust and reliable.", avatar: 'https://i.pravatar.cc/150?u=b' },
      { name: 'Rohan Gupta', role: 'Part-time Investor', text: "As someone new to algo-trading, SpeedEdge made it accessible. The UI is intuitive, and the basic plan is perfect for learning the ropes without any cost.", avatar: 'https://i.pravatar.cc/150?u=c' },
  ];

  // --- Core UI Components ---

  const NavBar = () => (
    <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Logo />
          </div>
          <div className="hidden md:flex space-x-6">
            {navigation
              .filter(item => !item.requiresAuth || isLoggedIn)
              .map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  currentPage === item.id
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.name}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-blue-500 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Login / Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => {setIsLoggedIn(false); setCurrentPage('home');}}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            )}
          </div>
          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 h-screen">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation
              .filter(item => !item.requiresAuth || isLoggedIn)
              .map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setIsMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-400 bg-blue-400/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="border-t border-gray-700 mt-4 pt-4 flex flex-col space-y-2">
              {!isLoggedIn ? (
                  <button
                    onClick={() => {setCurrentPage('dashboard'); setIsMenuOpen(false);}}
                    className="w-full text-center px-3 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                  >
                    Login / Sign Up
                  </button>
              ) : (
                <button
                  onClick={() => {setIsLoggedIn(false); setIsMenuOpen(false); setCurrentPage('home');}}
                  className="block w-full text-left px-3 py-2 rounded-md transition-colors text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  const InputField = memo(({ label, id, name, value, onChange, ringColor = 'blue', type = 'number', step = 'any' }) => {
    const ringColorClass = ringColor === 'blue' ? 'focus:ring-blue-500' : 
                          ringColor === 'purple' ? 'focus:ring-purple-500' : 
                          'focus:ring-green-500';
    return (
      <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          step={step}
          className={`w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${ringColorClass}`}
        />
      </div>
    );
  });

  const AmountInputField = memo(({ label, id, name, value, onChange, onIncrement, onDecrement, ringColor = 'blue', currency, increments }) => {
    const ringColorClass = ringColor === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-green-500';
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          type="number"
          step="any"
          className={`w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${ringColorClass}`}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-1">
            {increments[currency].values.map((amount, index) => (
              <button 
                key={index} 
                type="button" 
                onClick={() => onDecrement(name, amount)} 
                className="flex-1 px-2 py-1 bg-red-800/50 text-xs text-red-300 rounded-md hover:bg-red-700/50 transition-colors"
              >
                -{increments[currency].labels[index]}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {increments[currency].values.map((amount, index) => (
              <button 
                key={index} 
                type="button" 
                onClick={() => onIncrement(name, amount)} 
                className="flex-1 px-2 py-1 bg-green-800/50 text-xs text-green-300 rounded-md hover:bg-green-700/50 transition-colors"
              >
                +{increments[currency].labels[index]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  });
  
  const MarketTicker = ({fetchStockData}) => {
    const initialTickerData = [
      { symbol: 'NIFTY 50', price: 'Loading...', changePercent: '', trend: 'up' },
      { symbol: 'SENSEX', price: 'Loading...', changePercent: '', trend: 'up' },
      { symbol: 'BANK NIFTY', price: 'Loading...', changePercent: '', trend: 'down' },
      { symbol: 'NIFTY IT', price: 'Loading...', changePercent: '', trend: 'up' }
    ];
    const [tickerData, setTickerData] = useState(initialTickerData);

    useEffect(() => {
        const fetchAllData = async () => {
            const symbols = Object.values(INDEX_SYMBOLS);
            const dataPromises = symbols.map(symbol => fetchStockData(symbol));
            const results = await Promise.allSettled(dataPromises);
            const successfulData = results
                .map((result, index) => {
                    if (result.status === 'fulfilled' && result.value && !result.value.error) {
                        return { ...result.value, symbol: Object.keys(INDEX_SYMBOLS)[index] };
                    }
                    return null;
                })
                .filter(Boolean);
            
            if (successfulData.length > 0) {
                setTickerData(prevData => {
                    const newData = [...prevData];
                    successfulData.forEach(d => {
                        const indexToUpdate = newData.findIndex(item => item.symbol === d.symbol);
                        if(indexToUpdate !== -1) {
                            newData[indexToUpdate] = d;
                        }
                    });
                    return newData;
                });
            }
        };

        const timer = setTimeout(() => fetchAllData(), 500); // Initial delay
        const interval = setInterval(fetchAllData, 90000); // Refresh every 90 seconds due to API limits

        return () => {
          clearTimeout(timer);
          clearInterval(interval);
        }
    }, [fetchStockData]);

    return (
      <div className="fixed top-[61px] md:top-[65px] left-0 right-0 z-30 bg-gray-900/80 backdrop-blur-sm border-b border-t border-gray-800 overflow-hidden h-10 flex items-center">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...tickerData, ...tickerData].map((stock, index) => (
            <div key={index} className="flex items-center mx-4 text-sm">
              <span className="font-semibold text-gray-300">{stock.symbol}</span>
              <span className="ml-2 text-white">{stock.price}</span>
              {stock.changePercent && (
                  <span className={`ml-2 font-medium flex items-center ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                    {stock.changePercent}
                  </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const EnhancedTradingForecastCalculator = ({ calculatorRef }) => {
    const [inputs, setInputs] = useState({
      accountSize: 100000, positionSizePct: 2, maxPositions: 5, desiredReturnPct: 20,
      desiredAmount: 20000, winnerRatio: 60, avgGainPct: 5, avgLossPct: 3, tradesPerMonth: 20,
    });
    const [results, setResults] = useState(null);
    const [currency, setCurrency] = useState('INR');

    const currencySymbols = { INR: '₹', USD: '$' };
    const increments = {
      INR: { values: [10000, 50000, 100000], labels: ['10K', '50K', '1L'] },
      USD: { values: [1000, 5000, 10000], labels: ['1K', '5K', '10K'] }
    };

    const handleInputChange = useCallback((e) => {
      const { name, value } = e.target;
      setInputs(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleIncrement = useCallback((field, amount) => {
      setInputs(prev => ({...prev, [field]: (parseFloat(prev[field]) || 0) + amount }));
    }, []);

    const handleDecrement = useCallback((field, amount) => {
      setInputs(prev => ({...prev, [field]: Math.max(0, (parseFloat(prev[field]) || 0) - amount) }));
    }, []);

    const calculateForecast = useCallback((inputValues) => {
      const { accountSize, positionSizePct, maxPositions, desiredReturnPct, desiredAmount, winnerRatio, avgGainPct, avgLossPct, tradesPerMonth } = inputValues;
      const clean = (val) => parseFloat(val) || 0;

      const accSize = clean(accountSize);
      const posPct = clean(positionSizePct) / 100;
      const maxPos = clean(maxPositions);
      const winRatio = clean(winnerRatio) / 100;
      const gainPct = clean(avgGainPct) / 100;
      const lossPct = clean(avgLossPct) / 100;
      const trades = clean(tradesPerMonth);

      const posSizePerTrade = accSize * posPct;
      const maxExposure = posSizePerTrade * maxPos;
      const maxExposurePct = accSize > 0 ? (maxExposure / accSize) * 100 : 0;
      
      const lossRatio = 1 - winRatio;
      const avgGain = posSizePerTrade * gainPct;
      const avgLoss = posSizePerTrade * lossPct;
      
      const netReturnPerTrade = (winRatio * avgGain) - (lossRatio * avgLoss);
      const monthlyReturn = netReturnPerTrade * trades;
      const monthlyReturnPct = accSize > 0 ? (monthlyReturn / accSize) * 100 : 0;
      const annualReturnPct = monthlyReturnPct * 12;

      const gainLossRatio = lossPct > 0 ? gainPct / lossPct : Infinity;
      const profitFactor = (lossRatio * avgLoss) > 0 ? (winRatio * avgGain) / (lossRatio * avgLoss) : Infinity;
      const expectancy = (winRatio * gainPct) - (lossRatio * lossPct);

      const kellyCriterion = gainLossRatio > 0 && isFinite(gainLossRatio) ? ((winRatio * gainLossRatio - lossRatio) / gainLossRatio) : 0;
      
      const tradesForAmount = netReturnPerTrade > 0 ? Math.ceil(clean(desiredAmount) / netReturnPerTrade) : Infinity;
      const tradesForPct = netReturnPerTrade > 0 ? Math.ceil((clean(desiredReturnPct) / 100 * accSize) / netReturnPerTrade) : Infinity;

      // Simplified drawdown calculation
      const maxConsecutiveLosses = (lossRatio > 0 && lossRatio < 1) ? Math.ceil(-Math.log(0.05) / -Math.log(lossRatio)) : 0; // 95% confidence
      const maxDrawdownEstimate = maxConsecutiveLosses * avgLoss;
      const maxDrawdownPct = accSize > 0 ? (maxDrawdownEstimate / accSize) * 100 : 0;


      setResults({
        positionSizePerTrade: posSizePerTrade, maxExposurePct, expectedNetReturnPerTrade: netReturnPerTrade,
        expectedMonthlyReturn: monthlyReturn, expectedMonthlyReturnPct: monthlyReturnPct, expectedAnnualReturnPct: annualReturnPct,
        optimalFPct: kellyCriterion * 100, tradesNeededForGoal: tradesForAmount, tradesNeededForReturn: tradesForPct, maxDrawdownPct, maxDrawdownEstimate,
        profitFactor, expectancy: expectancy * 100, gainLossRatio
      });
    }, []);

    useEffect(() => {
        calculateForecast(inputs);
    }, [inputs, currency, calculateForecast]);
    
    const handleCalculateClick = (e) => {
      e.preventDefault();
      if (!isLoggedIn) {
        setPostLoginRedirect({ page: 'home', section: 'calculator' });
        setCurrentPage('dashboard');
        return;
      }
      // Recalculation is handled by useEffect on input change, but this button provides explicit user action.
      // If we want to force re-calc, we can call it here.
      calculateForecast(inputs);
    };

    const formatCurrency = (value) => `${currencySymbols[currency]}${value.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: 2 })}`;
    const formatPercent = (value) => `${value.toFixed(2)}%`;

    return (
      <section ref={calculatorRef} id="calculator" className="py-20 bg-gray-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Performance & Forecast Calculator</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Analyze your trading strategy's viability. Input your parameters to project returns, assess risk, and set realistic goals.
            </p>
          </div>

          <form onSubmit={handleCalculateClick} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-white">Your Strategy</h3>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                </select>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Account Settings</h4>
                <div className="space-y-4">
                   <AmountInputField 
                    label={`Account Size (${currencySymbols[currency]})`} 
                    id="accountSize" 
                    name="accountSize" 
                    value={inputs.accountSize} 
                    onChange={handleInputChange} 
                    onIncrement={handleIncrement} 
                    onDecrement={handleDecrement} 
                    ringColor="blue" 
                    currency={currency} 
                    increments={increments}
                  />
                  <InputField label="Position Size (%)" id="positionSizePct" name="positionSizePct" value={inputs.positionSizePct} onChange={handleInputChange} ringColor="blue" />
                  <InputField label="Max Positions" id="maxPositions" name="maxPositions" value={inputs.maxPositions} onChange={handleInputChange} ringColor="blue" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <InputField label="Winner Ratio (%)" id="winnerRatio" name="winnerRatio" value={inputs.winnerRatio} onChange={handleInputChange} ringColor="purple"/>
                  <InputField label="Average Gain (%)" id="avgGainPct" name="avgGainPct" value={inputs.avgGainPct} onChange={handleInputChange} ringColor="purple"/>
                  <InputField label="Average Loss (%)" id="avgLossPct" name="avgLossPct" value={inputs.avgLossPct} onChange={handleInputChange} ringColor="purple"/>
                  <InputField label="Trades / Month" id="tradesPerMonth" name="tradesPerMonth" value={inputs.tradesPerMonth} onChange={handleInputChange} ringColor="purple"/>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-3">Your Goals</h4>
                <div className="space-y-4">
                  <InputField label="Desired Return (%)" id="desiredReturnPct" name="desiredReturnPct" value={inputs.desiredReturnPct} onChange={handleInputChange} ringColor="green"/>
                  <AmountInputField 
                    label={`Desired Amount (${currencySymbols[currency]})`} 
                    id="desiredAmount" 
                    name="desiredAmount" 
                    value={inputs.desiredAmount} 
                    onChange={handleInputChange} 
                    onIncrement={handleIncrement} 
                    onDecrement={handleDecrement} 
                    ringColor="green" 
                    currency={currency} 
                    increments={increments}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-lg shadow-lg hover:shadow-blue-500/50"
              >
                {isLoggedIn ? 'Recalculate Forecast' : 'Login to Calculate'}
              </button>
            </div>

            <div className="lg:col-span-2 bg-gray-800 p-8 rounded-2xl border border-gray-700">
              {!results ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <Loader2 className="animate-spin w-8 h-8 mr-2" />
                  <p>Calculating forecast...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2 flex items-center"><PieChart className="w-6 h-6 mr-3 text-purple-400"/>Projections</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Monthly Return</p>
                          <p className="text-xl font-bold text-purple-400">{formatCurrency(results.expectedMonthlyReturn)}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Monthly ROI</p>
                          <p className="text-xl font-bold text-purple-400">{formatPercent(results.expectedMonthlyReturnPct)}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Annual ROI</p>
                          <p className="text-xl font-bold text-purple-400">{formatPercent(results.expectedAnnualReturnPct)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2 flex items-center"><Shield className="w-6 h-6 mr-3 text-red-400"/>Risk Assessment</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                       <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Max Drawdown</p>
                          <p className="text-xl font-bold text-red-400">{formatPercent(results.maxDrawdownPct)}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Max DD Amount</p>
                          <p className="text-xl font-bold text-red-400">{formatCurrency(results.maxDrawdownEstimate)}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Max Exposure</p>
                          <p className="text-xl font-bold text-red-400">{formatPercent(results.maxExposurePct)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 border-b border-yellow-500/30 pb-2 flex items-center"><BarChart3 className="w-6 h-6 mr-3 text-yellow-400"/>Key Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                       <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Profit Factor</p>
                          <p className="text-xl font-bold text-yellow-400">{isFinite(results.profitFactor) ? results.profitFactor.toFixed(2) : '∞'}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Expectancy %</p>
                          <p className="text-xl font-bold text-yellow-400">{formatPercent(results.expectancy)}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Kelly Criterion</p>
                          <p className="text-xl font-bold text-yellow-400">{results.optimalFPct.toFixed(2)}%</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Gain/Loss Ratio</p>
                          <p className="text-xl font-bold text-yellow-400">{isFinite(results.gainLossRatio) ? results.gainLossRatio.toFixed(2) : '∞'}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Position Size</p>
                          <p className="text-xl font-bold text-yellow-400">{formatCurrency(results.positionSizePerTrade)}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Net Return/Trade</p>
                          <p className="text-xl font-bold text-yellow-400">{formatCurrency(results.expectedNetReturnPerTrade)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 border-b border-green-500/30 pb-2 flex items-center"><Target className="w-6 h-6 mr-3 text-green-400"/>Goal Tracking</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Trades for Amount</p>
                          <p className="text-xl font-bold text-green-400">{isFinite(results.tradesNeededForGoal) ? results.tradesNeededForGoal : 'N/A'}</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Trades for % Return</p>
                          <p className="text-xl font-bold text-green-400">{isFinite(results.tradesNeededForReturn) ? results.tradesNeededForReturn : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    );
  };
  
  const Footer = () => (
    <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <Logo />
                    <p className="text-gray-400 text-sm">The future of algorithmic trading. High speed, AI-powered, and secure.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white"><Twitter/></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Github/></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Linkedin/></a>
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-semibold tracking-wider uppercase">Solutions</h3>
                    <ul className="mt-4 space-y-2">
                        <li><button onClick={() => setCurrentPage('platform')} className="text-gray-400 hover:text-white text-sm">Trading Platform</button></li>
                        <li><button onClick={() => setCurrentPage('ai')} className="text-gray-400 hover:text-white text-sm">AI Search</button></li>
                        <li><button onClick={() => setCurrentPage('scripting')} className="text-gray-400 hover:text-white text-sm">Custom Scripts</button></li>
                        <li><button onClick={() => setCurrentPage('data')} className="text-gray-400 hover:text-white text-sm">Market Data</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold tracking-wider uppercase">Company</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">About</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Press</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold tracking-wider uppercase">Legal</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Disclaimer</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} SpeedEdge Technologies. All rights reserved.</p>
                <p className="mt-2">Disclaimer: Trading in financial markets involves risk. SpeedEdge is a technology platform and not a financial advisor.</p>
            </div>
        </div>
    </footer>
  );
  
  // --- Page Components ---

  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-gray-900 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-gray-800/50 [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent mb-6">
                  Trade Smarter, Faster, Stronger
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                  Leverage institutional-grade algorithmic trading tools, AI-driven market insights, and lightning-fast execution. Welcome to the future of trading.
              </p>
              <div className="flex justify-center space-x-4">
                  <button onClick={() => setCurrentPage('platform')} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transform transition-all duration-300">
                      Launch Platform
                  </button>
                  <button onClick={() => setCurrentPage('ai')} className="px-8 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 hover:text-white transform transition-all duration-300">
                      Explore AI Features
                  </button>
              </div>
          </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
                <p className="text-xl text-gray-400">From advanced analytics to automated execution, we've got you covered.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6">
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-400 mb-4">{feature.description}</p>
                        <ul className="space-y-2">
                           {feature.highlights.map(highlight => (
                             <li key={highlight} className="flex items-center text-gray-300 text-sm">
                               <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                               {highlight}
                             </li>
                           ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Pricing Plans for Every Trader</h2>
                <p className="text-xl text-gray-400">Start for free, and scale as you grow. No hidden fees.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                {pricingPlans.map((plan, index) => (
                    <div key={index} className={`bg-gray-800 p-8 rounded-3xl border ${plan.popular ? 'border-purple-500' : 'border-gray-700'} ${plan.popular ? 'scale-105' : ''} transition-all duration-300 relative`}>
                        {plan.popular && <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
                        <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                        <p className="text-gray-400 mt-2 mb-6">{plan.description}</p>
                        <p className="mb-6">
                            <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                            <span className="text-lg text-gray-400">{plan.period}</span>
                        </p>
                        <ul className="space-y-3 mb-8">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center text-gray-300">
                                    <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-white mb-4">Loved by Traders Worldwide</h2>
                  <p className="text-xl text-gray-400">Don't just take our word for it. Here's what our users say.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 space-y-4">
                          <p className="text-gray-300">"{testimonial.text}"</p>
                          <div className="flex items-center space-x-4">
                              <img className="w-12 h-12 rounded-full" src={testimonial.avatar} alt={testimonial.name} />
                              <div>
                                  <p className="text-white font-semibold">{testimonial.name}</p>
                                  <p className="text-purple-400 text-sm">{testimonial.role}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Calculator Section */}
      <EnhancedTradingForecastCalculator calculatorRef={calculatorRef} />
    </>
  );
  
  const AIPage = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [aiResults, setAiResults] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setAiResults(null);
        
        const fullPrompt = `Based on the following user query, suggest up to 5 relevant Indian stock symbols (from the NSE/BSE). For each symbol, provide a brief, one-sentence rationale for why it matches the query. User Query: "${prompt}". A list of valid symbols includes: ${VALID_STOCKS.slice(0, 50).join(', ')}. Please provide the response in the structured format.`;

        try {
             let chatHistory = [];
             chatHistory.push({ role: "user", parts: [{ text: fullPrompt }] });
             const payload = {
                 contents: chatHistory,
                 generationConfig: {
                     responseMimeType: "application/json",
                     responseSchema: {
                         type: "OBJECT",
                         properties: {
                           "stocks": {
                              "type": "ARRAY",
                              "items": {
                                  "type": "OBJECT",
                                  "properties": {
                                      "symbol": { "type": "STRING", "description": "The stock ticker symbol (e.g., RELIANCE)" },
                                      "rationale": { "type": "STRING", "description": "A brief explanation for the recommendation" }
                                  },
                                  "required": ["symbol", "rationale"]
                              }
                           }
                         },
                     }
                 }
             };
             const apiKey = ""; // Canvas will provide this
             const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
             const response = await fetch(apiUrl, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload)
             });

            if (!response.ok) {
                const errorBody = await response.json();
                console.error("Gemini API Error:", errorBody);
                throw new Error(errorBody.error?.message || `API request failed with status ${response.status}`);
            }

             const result = await response.json();
             
             if (result.candidates && result.candidates.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                const parsedJson = JSON.parse(text);

                const stocksWithData = await Promise.all(
                    (parsedJson.stocks || []).map(async (stock) => {
                        const stockData = await fetchStockData(stock.symbol);
                        return { ...stock, ...stockData };
                    })
                );
                setAiResults(stocksWithData);
             } else {
                 throw new Error("No valid response from AI.");
             }
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred. The AI might be busy, please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">AI-Powered Stock Search</h1>
                    <p className="text-xl text-gray-400">
                        Describe your ideal investment in plain English. Let our AI find the right stocks for you.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-12">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder='e.g., "undervalued tech stocks with high growth potential"'
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Bot className="w-5 h-5 mr-2" />}
                        {isLoading ? 'Searching...' : 'Ask AI'}
                    </button>
                </form>

                <div className="min-h-[300px]">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-4" />
                            <p>Analyzing markets and finding opportunities...</p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center">
                            <AlertTriangle className="w-6 h-6 mr-3"/>
                            <div>
                                <h4 className="font-bold">Search Failed</h4>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}
                    {aiResults && (
                        <div className="space-y-4">
                           <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
                            {aiResults.map((stock, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div className="md:col-span-1">
                                        <p className="text-xl font-bold text-blue-400">{stock.symbol}</p>
                                        <p className="text-sm text-gray-400">{stock.error ? 'Price N/A' : `₹${stock.price}`}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-300">{stock.rationale}</p>
                                    </div>
                                    <div className="md:col-span-1 text-right">
                                        {!stock.error ? (
                                             <span className={`font-medium flex items-center justify-end ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                                {stock.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                                                {stock.changePercent}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-yellow-500">{stock.error}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

  
  const PlatformPage = () => {
    const [selectedStock, setSelectedStock] = useState({ symbol: 'RELIANCE', price: 'Loading...', changePercent: '...', trend: 'up' });
    const [orderType, setOrderType] = useState('buy');
    const [quantity, setQuantity] = useState(10);
    const watchlist = ['TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'TATAMOTORS'];

    const fetchSelectedStockData = useCallback(async (symbol) => {
      const data = await fetchStockData(symbol);
      if (data && !data.error) {
          setSelectedStock(data);
      } else {
          setSelectedStock({ symbol, price: 'Error', changePercent: 'N/A', trend: 'down' });
      }
    }, [fetchStockData]);

    useEffect(() => {
        fetchSelectedStockData('RELIANCE');
    }, [fetchSelectedStockData]);

    const handleSelectStock = (symbol) => {
        setSelectedStock({ symbol, price: 'Loading...', changePercent: '...', trend: 'up' });
        fetchSelectedStockData(symbol);
    }
    
    return (
        <div className="pt-32 pb-20 bg-gray-900 text-white min-h-screen">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Main Panel: Chart and Details */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Stock Header */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{selectedStock.symbol}</h1>
                            <p className="text-gray-400">Reliance Industries Ltd.</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-3xl font-bold ${selectedStock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                ₹{selectedStock.price}
                            </p>
                            <p className={`text-lg font-semibold ${selectedStock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                {selectedStock.changePercent}
                            </p>
                        </div>
                    </div>
                    {/* Chart */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-96">
                        <MockChart trend={selectedStock.trend} />
                    </div>
                    {/* Positions / Orders Tabs */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-semibold mb-2">My Activity</h3>
                        <p className="text-gray-400">Your open positions and pending orders will appear here.</p>
                    </div>
                </div>

                {/* Side Panel: Order and Watchlist */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Order Panel */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Order Ticket</h2>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button 
                                onClick={() => setOrderType('buy')}
                                className={`py-2 rounded-lg font-semibold transition-all ${orderType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                BUY
                            </button>
                            <button 
                                onClick={() => setOrderType('sell')}
                                className={`py-2 rounded-lg font-semibold transition-all ${orderType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                SELL
                            </button>
                        </div>
                        <div className="space-y-4">
                            <InputField label="Quantity" id="quantity" name="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} ringColor={orderType === 'buy' ? 'blue' : 'purple'}/>
                            <InputField label="Price (Market)" id="price" name="price" value={selectedStock.price} onChange={() => {}} ringColor={orderType === 'buy' ? 'blue' : 'purple'} type="text"/>
                             <div>
                                <p className="text-sm text-gray-400">Est. Value</p>
                                <p className="text-lg font-semibold">₹{(quantity * parseFloat(selectedStock.price.replace(/,/g, '')) || 0).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        <button className={`w-full py-3 mt-6 rounded-lg font-bold text-white text-lg transition-all ${orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                            Place {orderType.toUpperCase()} Order
                        </button>
                    </div>
                    {/* Watchlist */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Watchlist</h2>
                        <div className="space-y-2">
                           {watchlist.map(stock => (
                                <button key={stock} onClick={() => handleSelectStock(stock)} className="w-full text-left p-2 rounded-md hover:bg-gray-700 flex justify-between">
                                    <span className="font-semibold">{stock}</span>
                                    {/* Placeholder for live price */}
                                    <span className="text-green-400">...</span>
                                </button>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
  };
  
  const DataPage = () => {
    const [marketData, setMarketData] = useState({ gainers: [], losers: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const topStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'LT', 'SBIN', 'AXISBANK'];
            const results = await Promise.all(topStocks.map(s => fetchStockData(s)));
            const validResults = results.filter(r => r && !r.error);
            
            validResults.sort((a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent));
            
            setMarketData({
                gainers: validResults.filter(r => parseFloat(r.changePercent) >= 0).slice(0, 5),
                losers: validResults.filter(r => parseFloat(r.changePercent) < 0).slice(0, 5)
            });
            setIsLoading(false);
        };
        fetchData();
    }, [fetchStockData]);

    const renderTable = (data, title) => (
        <div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-700/50">
                            <th className="p-3 text-left text-sm font-semibold text-gray-300">Symbol</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-300">Price (₹)</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-300">Change (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((stock, index) => (
                            <tr key={index} className="border-t border-gray-700">
                                <td className="p-3 font-semibold">{stock.symbol}</td>
                                <td className="p-3 text-right">{stock.price}</td>
                                <td className={`p-3 text-right font-semibold ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                    {stock.changePercent}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="pt-32 pb-20 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">Market Data</h1>
                    <p className="text-xl text-gray-400">Snapshot of today's market movers.</p>
                </div>
                {isLoading ? (
                     <div className="flex justify-center items-center h-64">
                         <Loader2 className="w-12 h-12 animate-spin text-purple-400"/>
                     </div>
                ) : (
                    <div className="space-y-12">
                        {renderTable(marketData.gainers, "Top Gainers")}
                        {renderTable(marketData.losers, "Top Losers")}
                    </div>
                )}
            </div>
        </div>
    );
  };
  
  const CryptoPage = () => {
      const [cryptoData, setCryptoData] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const cryptoList = ['BTC', 'ETH', 'XRP', 'LTC', 'ADA'];

      useEffect(() => {
          const fetchAllCryptoData = async () => {
              setIsLoading(true);
              const results = await Promise.all(cryptoList.map(c => fetchCryptoData(c)));
              setCryptoData(results);
              setIsLoading(false);
          };
          fetchAllCryptoData();
      }, [fetchCryptoData]);

      return (
        <div className="pt-32 pb-20 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">Crypto World</h1>
                    <p className="text-xl text-gray-400">Real-time prices for major cryptocurrencies in INR.</p>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-400"/>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cryptoData.map((crypto, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                <div className="md:col-span-1">
                                    <p className="text-xl font-bold text-yellow-400">{crypto.symbol}</p>
                                    <p className="text-xs text-gray-400">{crypto.name}</p>
                                </div>
                                <p className="md:col-span-2 text-lg font-semibold">{crypto.price}</p>
                                <div className="md:col-span-1 text-right">
                                    {crypto.error ? (
                                        <span className="text-xs text-red-500">{crypto.error}</span>
                                    ) : (
                                        <p className={`font-semibold ${crypto.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                            {crypto.change}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <p className="text-xs text-gray-500 text-center pt-4">* Change percentage is randomized for visual representation as it's not provided by the API endpoint.</p>
                    </div>
                )}
            </div>
        </div>
    );
  };
  
  const ScriptingPage = () => {
    const [code, setCode] = useState(
`// Welcome to SpeedEdge Scripting Environment
// Use our Python-like syntax to define your strategy.

function initialize(context) {
    // Schedule our main trading logic to run every day.
    schedule_function(my_trading_logic, date_rules.every_day(), time_rules.market_open(minutes=30));
    
    // Define the stock we want to trade.
    context.stock = symbol('RELIANCE');
}

function my_trading_logic(context, data) {
    // Get historical data for our stock.
    history = data.history(context.stock, 'price', 50, '1d');
    
    // Calculate moving averages.
    short_mavg = history.iloc[-20:].mean();
    long_mavg = history.iloc[-50:].mean();
    
    // Trading logic: Golden Cross
    if (short_mavg > long_mavg && context.portfolio.positions[context.stock].amount == 0) {
        // Buy 100 shares.
        order_target_percent(context.stock, 0.5);
        log.info(\`Buying \${context.stock.symbol}\`);
    } else if (short_mavg < long_mavg) {
        // Sell all shares.
        order_target_percent(context.stock, 0);
        log.info(\`Selling \${context.stock.symbol}\`);
    }
}`);

    return (
        <div className="pt-32 pb-20 bg-gray-900 text-white min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">Custom Strategy Scripting</h1>
                    <p className="text-xl text-gray-400">Build, backtest, and deploy your own trading algorithms.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                       <div className="bg-gray-900 p-2 rounded-t-md flex items-center gap-2">
                         <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                         <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                         <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                         <span className="text-sm text-gray-400 ml-auto">strategy.py</span>
                       </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-[500px] bg-[#1E1E1E] text-white font-mono p-4 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            spellCheck="false"
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                <Play className="w-5 h-5"/> Run Backtest
                            </button>
                             <button className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                                <Zap className="w-5 h-5"/> Deploy Live
                            </button>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-full">
                            <h3 className="text-2xl font-bold mb-4">Backtest Results</h3>
                            <p className="text-gray-400">Results from your backtest will be displayed here.</p>
                            {/* Placeholder for results */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  const DashboardPage = () => {
    if (!isLoggedIn) {
        return <LoginPage />;
    }
    return (
        <div className="pt-32 pb-20 bg-gray-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Welcome Back, Trader!</h1>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold text-purple-400 mb-4">Portfolio Value</h2>
                        <p className="text-4xl font-bold">₹1,24,567.89</p>
                        <p className="text-green-400 flex items-center mt-1"><TrendingUp className="w-5 h-5 mr-1" /> +₹2,345.12 (1.91%) Today</p>
                    </div>
                     <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Active Algorithms</h2>
                        <p className="text-4xl font-bold">3</p>
                        <p className="text-gray-400 mt-1">1 Momentum | 2 Mean Reversion</p>
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  const LoginPage = () => {
      const [isLoginView, setIsLoginView] = useState(true);
      
      const handleAuth = (e) => {
          e.preventDefault();
          setIsLoggedIn(true);
          // Redirection logic is handled by the main useEffect
      }

      return (
          <div className="pt-32 pb-20 bg-gray-900 flex items-center justify-center min-h-screen">
              <div className="w-full max-w-md mx-auto p-8 bg-gray-800 rounded-2xl border border-gray-700">
                  <div className="text-center mb-8">
                      <Logo className="justify-center"/>
                      <h2 className="text-2xl font-bold text-white mt-4">{isLoginView ? "Welcome Back" : "Create Your Account"}</h2>
                      <p className="text-gray-400">{isLoginView ? "Login to access your dashboard." : "Join the future of trading."}</p>
                  </div>
                  <form className="space-y-6" onSubmit={handleAuth}>
                      {!isLoginView && <InputField label="Full Name" id="name" name="name" type="text" onChange={() => {}} ringColor="blue"/>}
                      <InputField label="Email Address" id="email" name="email" type="email" onChange={() => {}} ringColor="blue"/>
                      <InputField label="Password" id="password" name="password" type="password" onChange={() => {}} ringColor="blue"/>
                      <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transform transition-all duration-300">
                          {isLoginView ? "Log In" : "Sign Up"}
                      </button>
                  </form>
                  <p className="text-center text-sm text-gray-400 mt-6">
                      {isLoginView ? "Don't have an account?" : "Already have an account?"}
                      <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-purple-400 hover:text-purple-300 ml-1">
                          {isLoginView ? "Sign up" : "Log in"}
                      </button>
                  </p>
              </div>
          </div>
      );
  };

  // --- Page Router ---

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage />;
      case 'platform': return <PlatformPage />;
      case 'ai': return <AIPage />;
      case 'data': return <DataPage />;
      case 'crypto': return <CryptoPage />;
      case 'scripting': return <ScriptingPage />;
      case 'dashboard': return <DashboardPage />; // This component handles login view internally
      default: return <HomePage />;
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <NavBar />
      <MarketTicker fetchStockData={fetchStockData} />
      <main className="pt-[101px] md:pt-[105px]">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
