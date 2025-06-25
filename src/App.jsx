import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Bot,
  Users,
  Star,
  ChevronDown,
  Menu,
  X,
  Play,
  Activity,
  Brain,
  Target,
  DollarSign,
  Briefcase,
  Settings,
  LogIn,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  CheckCircle,
  ArrowRight,
  LineChart,
  PieChart,
  BarChart,
  Cpu,
  Database,
  Globe,
  Lock,
  Clock,
  Smartphone,
  TrendingDown,
  AlertTriangle,
  Layers,
  Eye,
  Gauge,
  Calculator,
  Bitcoin,
  Code,
  Search,
  AlertCircle
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
    'BERGEPAINT', 'KANSAINER', 'HAVELLS', 'VOLTAS', 'CROMPTON', 'BATAINDIA', 'RELAXO', 'PAGEIND', 'TRENT', 'SHOPERSTOP',
    'NIFTY', 'SENSEX', 'BANKNIFTY', 'FINNIFTY', 'NIFTYBEES', 'BANKBEES', 'GOLDBEES', 'JUNIORBEES', 'LIQUIDBEES', 'NIFTYMIDCAP'
  ];

  // Effect to handle body scrolling when mobile menu is open and scroll to top on page change
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Scroll to the top of the page whenever the currentPage or menu state changes
    if (!postLoginRedirect) {
      window.scrollTo(0, 0);
    }
  }, [currentPage, isMenuOpen, postLoginRedirect]);

  // --- API Fetching Logic ---
  const fetchStockData = useCallback(async (symbol) => {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      const quote = data['Global Quote'];
      if (quote && quote['05. price']) {
        const price = parseFloat(quote['05. price']).toFixed(2);
        const changePercent = parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2);
        return {
          symbol: quote['01. symbol'],
          price: new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(price),
          changePercent: `${changePercent > 0 ? '+' : ''}${changePercent}%`,
          trend: parseFloat(changePercent) >= 0 ? 'up' : 'down',
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching stock data for", symbol, error);
      return null;
    }
  }, [API_KEY]);

  const fetchCryptoData = useCallback(async (symbol) => {
      try {
          const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=INR&apikey=${API_KEY}`);
          const data = await response.json();
          const rateInfo = data['Realtime Currency Exchange Rate'];
          if(rateInfo) {
             const price = parseFloat(rateInfo['5. Exchange Rate']);
             // We can't get change % directly from this endpoint, so we will generate a random one for visual effect
             const randomChange = (Math.random() * 10 - 5).toFixed(2);
             return {
                symbol: symbol,
                name: rateInfo['2. From_Currency Name'],
                price: `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
                change: `${randomChange > 0 ? '+' : ''}${randomChange}%`,
                trend: randomChange >= 0 ? 'up' : 'down',
                marketCap: 'N/A' // Not available from this endpoint
             }
          }
          return null;
      } catch (error) {
          console.error("Error fetching crypto data for", symbol, error);
          return null;
      }
  }, [API_KEY]);

  // --- Reusable Components ---

  // Logo Component
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
  
  // A simple SVG Chart for demonstration
  const MockChart = () => {
    const points = "0,40 20,30 40,50 60,40 80,60 100,50 120,70 140,60 160,80 180,70";
    return (
      <svg viewBox="0 0 180 100" className="w-full h-full" preserveAspectRatio="none">
        <path d={`M ${points}`} fill="none" stroke="url(#gradient)" strokeWidth="2"/>
        <path d={`M 0,100 L ${points} L 180,100 Z`} fill="url(#areaGradient)" />
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // --- Data Definitions ---

  // Navigation Data - Updated
  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Trading Platform', id: 'platform' },
    { name: 'AI Stock Search', id: 'ai' }, // RENAMED FROM "AI & Algorithms"
    { name: 'Market Data', id: 'data' },
    { name: 'Crypto World', id: 'crypto' },
    { name: 'Custom Script', id: 'scripting' },
    { name: 'Dashboard', id: 'dashboard', requiresAuth: true }
  ];

  // Features Data
  const features = [
    { icon: BarChart3, title: 'Advanced Charting', description: 'TradingView-powered charts with 150+ technical indicators', highlights: ['Real-time data', 'Custom timeframes', 'Drawing tools'] },
    { icon: Bot, title: 'Algorithm Marketplace', description: 'Pre-built strategies from top quantitative analysts', highlights: ['Backtested strategies', 'One-click deployment', 'Performance analytics'] },
    { icon: Brain, title: 'AI-Powered Insights', description: 'Machine learning models for market prediction', highlights: ['Sentiment analysis', 'Pattern recognition', 'Smart alerts'] },
    { icon: Zap, title: 'High-Speed Execution', description: 'Ultra-low latency order execution infrastructure', highlights: ['Sub-millisecond execution', 'Direct market access', 'Smart order routing'] },
    { icon: Shield, title: 'Risk Management', description: 'Advanced risk controls and portfolio protection', highlights: ['Position sizing', 'Stop-loss automation', 'Drawdown protection'] },
    { icon: Database, title: 'Real-Time Data', description: 'Live market data from multiple exchanges', highlights: ['NSE & BSE feeds', 'Options chain', 'Market depth'] }
  ];

  // AI Features Data
  const aiFeatures = [
    { icon: Brain, title: 'Neural Network Strategies', description: 'Deep learning models trained on years of market data', performance: '+42.6% Annual Return', sharpe: '2.34 Sharpe Ratio' },
    { icon: Target, title: 'Sentiment Analysis', description: 'Real-time news and social media sentiment scoring', performance: '+67% Signal Accuracy', sharpe: '1.89 Information Ratio' },
    { icon: Activity, title: 'Pattern Recognition', description: 'Computer vision for chart pattern identification', performance: '+38.9% Hit Rate', sharpe: '2.12 Win/Loss Ratio' }
  ];

  // Pricing plans
  const pricingPlans = [
    { name: 'Basic Trader', price: '₹0', period: '/month', description: 'For those getting started with algorithmic trading.', features: ['Basic Charting Tools', '1 Active Algorithm', 'Email Support'], popular: false, cta: 'Sign Up Free' },
    { name: 'Pro Quant', price: '₹2,499', period: '/month', description: 'For serious traders who need more power and speed.', features: ['Advanced Charting', '10 Active Algorithms', 'AI Insights', 'Priority Support'], popular: true, cta: 'Start Pro Trial' },
    { name: 'Institutional', price: 'Custom', period: '', description: 'Tailored solutions for trading desks and firms.', features: ['All Pro Features', 'Dedicated Infrastructure', 'API Access', '24/7 VIP Support'], popular: false, cta: 'Contact Sales' }
  ];
  
  // --- Core UI Components ---

  // Navigation Bar Component
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-400 bg-blue-400/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
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

  // Helper component for simple numeric input fields
  const InputField = memo(({ label, id, name, value, onChange, ringColor = 'blue' }) => {
    // Define ring color classes based on the prop
    const ringColorClass = ringColor === 'blue' ? 'focus:ring-blue-500' : 
                          ringColor === 'purple' ? 'focus:ring-purple-500' : 
                          ringColor === 'green' ? 'focus:ring-green-500' : 'focus:ring-blue-500';
    
    return (
      <div className="space-y-1">
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
      </div>
    );
  });

  // Helper component for currency fields with increment/decrement buttons
  const AmountInputField = memo(({ label, id, name, value, onChange, onIncrement, onDecrement, ringColor = 'blue', currency, increments }) => {
    // Define ring color classes based on the prop
    const ringColorClass = ringColor === 'blue' ? 'focus:ring-blue-500' : 
                          ringColor === 'green' ? 'focus:ring-green-500' : 'focus:ring-blue-500';
    
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
  
  // Market Ticker Component
  const MarketTicker = ({fetchStockData}) => {
    const mockTickerData = [
        { symbol: 'NIFTY 50', price: '23,537.85', changePercent: '+0.74%', trend: 'up' },
        { symbol: 'SENSEX', price: '77,478.93', changePercent: '+0.72%', trend: 'up' },
        { symbol: 'BANK NIFTY', price: '51,057.40', changePercent: '-0.17%', trend: 'down' },
        { symbol: 'NIFTY IT', price: '35,123.45', changePercent: '+1.20%', trend: 'up' }
    ];
    const [tickerData, setTickerData] = useState(mockTickerData);

    useEffect(() => {
        const symbols = ['NSEI', 'BSESN', 'NSEBANK', 'IT'];
        const fetchAllData = async () => {
            const dataPromises = symbols.map(symbol => fetchStockData(symbol));
            const results = await Promise.allSettled(dataPromises);
            const successfulData = results
                .filter(result => result.status === 'fulfilled' && result.value)
                .map(result => result.value);
            
            if (successfulData.length > 0) {
              const formattedData = successfulData.map(d => {
                  let name = d.symbol;
                  if (name === 'NSEI') name = 'NIFTY 50';
                  if (name === 'BSESN') name = 'SENSEX';
                  if (name === 'NSEBANK') name = 'BANK NIFTY';
                  if (name === 'IT') name = 'NIFTY IT';
                  return {...d, symbol: name};
              });
              setTickerData(formattedData);
            }
        };

        const timer = setTimeout(() => fetchAllData(), 1000); // Initial delay
        const interval = setInterval(fetchAllData, 60000); // Refresh every minute

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
              <span className="ml-2 text-white">₹{stock.price}</span>
              <span className={`ml-2 font-medium flex items-center ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stock.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                {stock.changePercent}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Enhanced Trading Forecast Calculator
  const EnhancedTradingForecastCalculator = ({ calculatorRef }) => {
    const [inputs, setInputs] = useState({
      accountSize: 100000,
      positionSizePct: 2,
      maxPositions: 5,
      desiredReturnPct: 20,
      desiredAmount: 20000,
      winnerRatio: 60,
      avgGainPct: 5,
      avgLossPct: 3,
      tradesPerMonth: 20,
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
      // Sanitize inputs for calculation
      const accountSize = parseFloat(inputValues.accountSize) || 0;
      const positionSizePct = parseFloat(inputValues.positionSizePct) || 0;
      const maxPositions = parseFloat(inputValues.maxPositions) || 0;
      const desiredReturnPct = parseFloat(inputValues.desiredReturnPct) || 0;
      const desiredAmount = parseFloat(inputValues.desiredAmount) || 0;
      const winnerRatio = parseFloat(inputValues.winnerRatio) || 0;
      const avgGainPct = parseFloat(inputValues.avgGainPct) || 0;
      const avgLossPct = parseFloat(inputValues.avgLossPct) || 0;
      const tradesPerMonth = parseFloat(inputValues.tradesPerMonth) || 0;

      const positionSizePerTrade = accountSize * (positionSizePct / 100);
      const maxExposure = positionSizePerTrade * maxPositions;
      const maxExposurePct = accountSize > 0 ? (maxExposure / accountSize) * 100 : 0;
      const loserRatio = 100 - winnerRatio;
      const avgLossOnLosingTrade = positionSizePerTrade * (avgLossPct / 100);
      const avgGainOnWinningTrade = positionSizePerTrade * (avgGainPct / 100);
      const gainLossRatio = avgLossPct > 0 ? avgGainPct / avgLossPct : Infinity;

      const winRate = winnerRatio / 100;
      const lossRate = loserRatio / 100;
      const expectedGainPerTrade = winRate * avgGainOnWinningTrade;
      const expectedLossPerTrade = lossRate * avgLossOnLosingTrade;
      const expectedNetReturnPerTrade = expectedGainPerTrade - expectedLossPerTrade;

      const expectedMonthlyReturn = expectedNetReturnPerTrade * tradesPerMonth;
      const expectedMonthlyReturnPct = accountSize > 0 ? (expectedMonthlyReturn / accountSize) * 100 : 0;
      const expectedAnnualReturnPct = expectedMonthlyReturnPct * 12;

      const winLossRatio = avgLossPct > 0 ? avgGainPct / avgLossPct : Infinity;
      const optimalF = winLossRatio > 0 && isFinite(winLossRatio) ? (winRate * winLossRatio - lossRate) / winLossRatio : 0;
      const optimalFPct = optimalF * 100;
      
      const tradesNeededForGoal = expectedNetReturnPerTrade > 0 ? Math.ceil(desiredAmount / expectedNetReturnPerTrade) : Infinity;
      const tradesNeededForReturn = expectedNetReturnPerTrade > 0 ? Math.ceil(((desiredReturnPct / 100) * accountSize) / expectedNetReturnPerTrade) : Infinity;
      
      const maxConsecutiveLosses = (lossRate > 0 && lossRate < 1) ? Math.ceil(-Math.log(0.01) / Math.log(lossRate)) : (lossRate === 1 ? Infinity : 0);
      const maxDrawdownEstimate = maxConsecutiveLosses * avgLossOnLosingTrade;
      const maxDrawdownPct = accountSize > 0 ? (maxDrawdownEstimate / accountSize) * 100 : 0;

      const profitFactor = (lossRate * avgLossPct) > 0 ? (winRate * avgGainPct) / (lossRate * avgLossPct) : Infinity;
      const expectancy = (winRate * avgGainPct) - (lossRate * avgLossPct);

      setResults({
        positionSizePerTrade, maxExposurePct, expectedNetReturnPerTrade,
        expectedMonthlyReturn, expectedMonthlyReturnPct, expectedAnnualReturnPct,
        optimalFPct, tradesNeededForGoal, tradesNeededForReturn, maxDrawdownPct, maxDrawdownEstimate,
        profitFactor, expectancy, gainLossRatio
      });
    }, []);

    const handleCalculateClick = (e) => {
      if (e) e.preventDefault();
      
      if (!isLoggedIn) {
        setPostLoginRedirect({ page: 'home', section: 'calculator' });
        setCurrentPage('dashboard');
        return;
      }

      calculateForecast(inputs);
    };
    
    useEffect(() => {
      calculateForecast(inputs);
    }, []);

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
                  <InputField 
                    label="Position Size (%)" 
                    id="positionSizePct" 
                    name="positionSizePct" 
                    value={inputs.positionSizePct} 
                    onChange={handleInputChange} 
                    ringColor="blue"
                  />
                  <InputField 
                    label="Max Positions" 
                    id="maxPositions" 
                    name="maxPositions" 
                    value={inputs.maxPositions} 
                    onChange={handleInputChange} 
                    ringColor="blue"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <InputField 
                    label="Winner Ratio (%)" 
                    id="winnerRatio" 
                    name="winnerRatio" 
                    value={inputs.winnerRatio} 
                    onChange={handleInputChange} 
                    ringColor="purple"
                  />
                  <InputField 
                    label="Average Gain (%)" 
                    id="avgGainPct" 
                    name="avgGainPct" 
                    value={inputs.avgGainPct} 
                    onChange={handleInputChange} 
                    ringColor="purple"
                  />
                  <InputField 
                    label="Average Loss (%)" 
                    id="avgLossPct" 
                    name="avgLossPct" 
                    value={inputs.avgLossPct} 
                    onChange={handleInputChange} 
                    ringColor="purple"
                  />
                  <InputField 
                    label="Trades / Month" 
                    id="tradesPerMonth" 
                    name="tradesPerMonth" 
                    value={inputs.tradesPerMonth} 
                    onChange={handleInputChange} 
                    ringColor="purple"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-3">Your Goals</h4>
                <div className="space-y-4">
                  <InputField 
                    label="Desired Return (%)" 
                    id="desiredReturnPct" 
                    name="desiredReturnPct" 
                    value={inputs.desiredReturnPct} 
                    onChange={handleInputChange} 
                    ringColor="green"
                  />
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
                className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-lg"
              >
                Calculate Forecast
              </button>
            </div>

            <div className="lg:col-span-2 bg-gray-800 p-8 rounded-2xl border border-gray-700">
              {!results ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Calculating initial forecast...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">Projections</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-400">Monthly Return</p>
                        <p className="text-xl font-bold text-purple-400">{formatCurrency(results.expectedMonthlyReturn)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Monthly ROI</p>
                        <p className="text-xl font-bold text-purple-400">{formatPercent(results.expectedMonthlyReturnPct)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Annual ROI</p>
                        <p className="text-xl font-bold text-purple-400">{formatPercent(results.expectedAnnualReturnPct)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">Risk Assessment</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-400">Max Drawdown</p>
                        <p className="text-xl font-bold text-red-400">{formatPercent(results.maxDrawdownPct)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Max DD Amount</p>
                        <p className="text-xl font-bold text-red-400">{formatCurrency(results.maxDrawdownEstimate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Max Exposure</p>
                        <p className="text-xl font-bold text-red-400">{formatPercent(results.maxExposurePct)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 border-b border-yellow-500/30 pb-2">Key Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-400">Profit Factor</p>
                        <p className="text-xl font-bold text-yellow-400">{isFinite(results.profitFactor) ? results.profitFactor.toFixed(2) : '∞'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Expectancy %</p>
                        <p className="text-xl font-bold text-yellow-400">{formatPercent(results.expectancy)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Kelly Criterion</p>
                        <p className="text-xl font-bold text-yellow-400">{formatPercent(results.optimalFPct)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Gain/Loss Ratio</p>
                        <p className="text-xl font-bold text-yellow-400">{isFinite(results.gainLossRatio) ? results.gainLossRatio.toFixed(2) : '∞'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Position Size</p>
                        <p className="text-xl font-bold text-yellow-400">{formatCurrency(results.positionSizePerTrade)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Net Return/Trade</p>
                        <p className="text-xl font-bold text-yellow-400">{formatCurrency(results.expectedNetReturnPerTrade)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4 border-b border-green-500/30 pb-2">Goal Tracking</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-400">Trades for Amount</p>
                        <p className="text-xl font-bold text-green-400">{isFinite(results.tradesNeededForGoal) ? results.tradesNeededForGoal : 'N/A'}</p>
                      </div>
                      <div>
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