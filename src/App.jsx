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
  Calculator
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
  }, [currentPage, isMenuOpen]);

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

  // Navigation Data
  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Trading Platform', id: 'platform' },
    { name: 'AI & Algorithms', id: 'ai' },
    { name: 'Market Data', id: 'data' },
    { name: 'Our Plan', id: 'pricing' },
    { name: 'Contact', id: 'contact' },
    { name: 'Dashboard', id: 'dashboard', requiresAuth: true }
  ];

  // Mock Market Data
  const marketData = [
    { symbol: 'NIFTY 50', price: '23,537.85', change: '+172.35', changePercent: '+0.74%', trend: 'up' },
    { symbol: 'SENSEX', price: '77,478.93', change: '+558.52', changePercent: '+0.72%', trend: 'up' },
    { symbol: 'BANKNIFTY', price: '51,057.40', change: '-89.25', changePercent: '-0.17%', trend: 'down' },
    { symbol: 'RELIANCE', price: '2,847.65', change: '+23.40', changePercent: '+0.83%', trend: 'up' }
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
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage('pricing')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                >
                  Sign Up Free
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
                <>
                  <button
                    onClick={() => {setCurrentPage('dashboard'); setIsMenuOpen(false);}}
                    className="block w-full text-left px-3 py-2 rounded-md transition-colors text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {setCurrentPage('pricing'); setIsMenuOpen(false);}}
                    className="w-full text-center px-3 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                  >
                    Sign Up Free
                  </button>
                </>
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
  const MarketTicker = () => {
    const tickerData = [
      { symbol: 'NIFTY 50', price: '23,537.85', changePercent: '+0.74%', trend: 'up' },
      { symbol: 'SENSEX', price: '77,478.93', changePercent: '+0.72%', trend: 'up' },
      { symbol: 'BANKNIFTY', price: '51,057.40', changePercent: '-0.17%', trend: 'down' },
      { symbol: 'RELIANCE', price: '2,847.65', changePercent: '+0.83%', trend: 'up' },
      { symbol: 'TCS', price: '3,821.50', changePercent: '+0.55%', trend: 'up' },
      { symbol: 'HDFCBANK', price: '1,698.20', changePercent: '-0.21%', trend: 'down' },
      { symbol: 'INFY', price: '1,630.10', changePercent: '+1.15%', trend: 'up' },
      { symbol: 'ICICIBANK', price: '1,125.80', changePercent: '+0.98%', trend: 'up' },
      { symbol: 'BHARTIARTL', price: '1,389.45', changePercent: '-0.50%', trend: 'down' },
      { symbol: 'LT', price: '3,578.00', changePercent: '+1.50%', trend: 'up' },
      { symbol: 'USD/INR', price: '83.55', changePercent: '+0.08%', trend: 'up' },
    ];

    return (
      <div className="fixed top-[61px] md:top-[65px] left-0 right-0 z-30 bg-gray-900/80 backdrop-blur-sm border-b border-t border-gray-800 overflow-hidden h-10 flex items-center">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...tickerData, ...tickerData].map((stock, index) => (
            <div key={index} className="flex items-center mx-4 text-sm">
              <span className="font-semibold text-gray-300">{stock.symbol}</span>
              <span className="ml-2 text-white">{stock.price}</span>
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
  
  const Footer = () => (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="text-gray-400 mt-4 text-sm">Next-gen algorithmic trading for the Indian markets.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              {['platform', 'ai', 'data', 'pricing'].map(id => {
                const navItem = navigation.find(item => item.id === id);
                return (
                  <li key={id}><button onClick={() => setCurrentPage(id)} className="text-gray-400 hover:text-white transition-colors text-sm">{navItem.name}</button></li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Press</a></li>
              <li><button onClick={() => setCurrentPage('contact')} className="text-gray-400 hover:text-white transition-colors text-sm">Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Disclosures</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} SpeedEdge Securities. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white"><Github className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );

  // --- Page Components ---

  // Home Page Component
  const HomePage = () => {
    const calculatorRef = useRef(null);

    useEffect(() => {
      if (postLoginRedirect && postLoginRedirect.page === 'home' && postLoginRedirect.section === 'calculator') {
        calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setPostLoginRedirect(null);
      }
    }, [currentPage]);

    return (
      <div className="pt-10">
        <section className="min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden pt-16 md:pt-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(128,128,128,0.1)_1px,_transparent_1px)] [background-size:2rem_2rem] opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Algorithmic Trading
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Redefined
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Experience the next generation of trading with AI-powered algorithms, institutional-grade data, and lightning-fast execution. Built for the sophisticated Indian trader.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentPage('platform')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Launch Platform
                </button>
                <button
                  onClick={() => setCurrentPage('ai')}
                  className="px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
                >
                  Explore AI Strategies
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">25,000+</div>
                  <div className="text-gray-400">Active Traders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">₹2,500Cr+</div>
                  <div className="text-gray-400">Daily Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.99%</div>
                  <div className="text-gray-400">Uptime SLA</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Live Market Watch</h3>
                  <Globe className="w-6 h-6 text-blue-400"/>
                </div>
                <div className="space-y-4">
                  {marketData.map(stock => (
                    <div key={stock.symbol} className="grid grid-cols-3 items-center gap-4">
                      <div className="font-semibold text-white">{stock.symbol}</div>
                      <div className="text-right text-white">{stock.price}</div>
                      <div className={`text-right font-medium flex justify-end items-center ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                        {stock.changePercent}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white">Your Unfair Advantage</h2>
              <p className="mt-4 text-xl text-gray-400">
                A complete suite of tools designed for performance, speed, and precision.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">AI-Powered Trading</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                Outsmart the Market with Machine Intelligence
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
                Leverage our proprietary AI models to gain predictive insights and automate complex trading strategies.
              </p>
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {aiFeatures.map((item, index) => (
                <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-start">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-10 text-white mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-white">{item.title}</h3>
                  <p className="mt-2 text-base text-gray-400">{item.description}</p>
                  <div className="mt-4 flex w-full justify-between items-center">
                    <span className="text-sm font-semibold text-green-400">{item.performance}</span>
                    <span className="text-sm font-semibold text-yellow-400">{item.sharpe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <EnhancedTradingForecastCalculator calculatorRef={calculatorRef} />

        <section className="bg-black py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-extrabold text-white">Ready to Elevate Your Trading?</h2>
            <p className="text-xl text-gray-400 mt-4">Join thousands of traders who are leveraging SpeedEdge to build their wealth. Get started for free, no credit card required.</p>
            <button onClick={() => setCurrentPage('pricing')} className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
              View Pricing & Plans
            </button>
          </div>
        </section>
      </div>
    );
  };
  
  // Trading Platform Page
  const TradingPlatformPage = () => (
    <div className="pt-24 min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">The Ultimate Trading Cockpit</h1>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">A professional-grade environment built for speed, precision, and deep market analysis.</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 lg:p-6 grid grid-cols-12 gap-4 h-[70vh]">
          <div className="col-span-12 lg:col-span-3 bg-gray-800/50 rounded-lg p-3 space-y-2 overflow-y-auto">
            <h3 className="text-lg font-bold p-1">Watchlist</h3>
            {marketData.concat([
              { symbol: 'TCS', price: '3,815.10', change: '-12.05', changePercent: '-0.32%', trend: 'down' },
              { symbol: 'INFY', price: '1,622.75', change: '+1.40', changePercent: '+0.09%', trend: 'up' },
              { symbol: 'HDFCBANK', price: '1,695.50', change: '+25.80', changePercent: '+1.55%', trend: 'up' },
            ]).map(stock => (
              <div key={stock.symbol} className="grid grid-cols-3 gap-2 p-2 rounded-md hover:bg-gray-700/50 cursor-pointer text-sm">
                <span className="font-semibold col-span-1">{stock.symbol}</span>
                <span className="text-right">{stock.price}</span>
                <span className={`text-right font-medium ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>{stock.changePercent}</span>
              </div>
            ))}
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            <div className="flex-grow bg-gray-800/50 rounded-lg p-3 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">NIFTY 50</h4>
                <div className="flex items-center space-x-2 text-sm bg-gray-900 p-1 rounded-md">
                  <button className="px-2 py-1 rounded bg-blue-500/20">1D</button>
                  <button className="px-2 py-1 rounded hover:bg-gray-700">5D</button>
                  <button className="px-2 py-1 rounded hover:bg-gray-700">1M</button>
                  <button className="px-2 py-1 rounded hover:bg-gray-700">6M</button>
                </div>
              </div>
              <div className="flex-1"><MockChart/></div>
            </div>
            <div className="h-1/3 bg-gray-800/50 rounded-lg p-3">
              <h3 className="text-lg font-bold mb-2">Positions</h3>
              <p className="text-gray-400 text-sm">No active positions.</p>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 bg-gray-800/50 rounded-lg p-3">
            <h3 className="text-lg font-bold mb-4">Order Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block">Symbol</label>
                <input type="text" defaultValue="NIFTYBEES" className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="text-sm text-gray-400 block">Quantity</label>
                <input type="number" defaultValue="100" className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
              </div>
              <div className="flex space-x-2">
                <button className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors">BUY</button>
                <button className="w-full py-3 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition-colors">SELL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // AI Page
  const AIPage = () => (
    <div className="pt-24 min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight">Intelligence Amplified</h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Deploy sophisticated, pre-built AI strategies or use our AI toolkit to build your own.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiFeatures.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-purple-500/20 flex flex-col">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white mb-6">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 flex-grow">{item.description}</p>
              <div className="mt-6 border-t border-gray-700 pt-4 space-y-2">
                <p className="flex justify-between text-green-400 font-semibold"><span>Backtested Return:</span> <span>{item.performance}</span></p>
                <p className="flex justify-between text-yellow-400 font-semibold"><span>Risk/Reward Metric:</span> <span>{item.sharpe}</span></p>
              </div>
              <button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
                Deploy Strategy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Market Data Page
  const MarketDataPage = () => (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Institutional-Grade Market Data</h1>
          <p className="mt-4 text-lg text-gray-400">Access the same high-quality data used by professional funds.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <Database className="h-12 w-12 mx-auto text-blue-400"/>
            <h3 className="mt-6 text-xl font-semibold text-white">Real-Time Feeds</h3>
            <p className="mt-2 text-gray-400">Direct, low-latency data feeds from NSE, BSE, and MCX for equities, F&O, and commodities.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <Clock className="h-12 w-12 mx-auto text-blue-400"/>
            <h3 className="mt-6 text-xl font-semibold text-white">Historical Data</h3>
            <p className="mt-2 text-gray-400">20+ years of tick-by-tick historical data for robust backtesting and model training.</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <Layers className="h-12 w-12 mx-auto text-blue-400"/>
            <h3 className="mt-6 text-xl font-semibold text-white">Options Analytics</h3>
            <p className="mt-2 text-gray-400">Live options chain, greeks, and implied volatility data to inform your options strategies.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Pricing Page
  const PricingPage = () => (
    <div className="pt-24 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white">Choose Your Edge</h1>
          <p className="mt-4 text-xl text-gray-400">Simple, transparent pricing. No hidden fees.</p>
        </div>
        <div className="mt-16 grid lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map(plan => (
            <div key={plan.name} className={`rounded-xl border ${plan.popular ? 'border-purple-500' : 'border-gray-700'} p-8 flex flex-col relative bg-gray-800`}>
              {plan.popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">Most Popular</div>}
              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-4 text-gray-400 flex-grow">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-lg font-medium text-gray-400">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mr-3" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-8 w-full py-3 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Contact Page
  const ContactPage = () => (
    <div className="pt-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-start">
        <div className="text-white">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="mt-3 text-lg text-gray-400">We're here to help. Whether you're a current user or just have a question, reach out to us.</p>
          <div className="mt-8 space-y-6">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Email</h3>
                <a href="mailto:support@speededge.dev" className="text-gray-300 hover:text-blue-400">support@speededge.dev</a>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Phone</h3>
                <p className="text-gray-300">+91 (022) 1234-5678</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Address</h3>
                <p className="text-gray-300">SpeedEdge Towers, BKC, Mumbai,<br/> Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
              <input type="text" id="name" className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
              <input type="email" id="email" className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
              <textarea id="message" rows="4" className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
  
  // Dashboard Page (Handles Login and Logged-in View)
  const DashboardPage = () => {
    
    // Login form submit handler
    const handleLogin = (e) => {
      e.preventDefault();
      setIsLoggedIn(true);

      if (postLoginRedirect) {
        setCurrentPage(postLoginRedirect.page);
      }
    };

    // If not logged in, show the login/signup form
    if (!isLoggedIn) {
      return (
        <div className="pt-20 min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
            <div className="text-center mb-8">
              <Logo className="mx-auto" />
              <h2 className="mt-6 text-3xl font-bold text-white">Welcome Back</h2>
              <p className="mt-2 text-gray-400">Login to access your trading dashboard.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <input type="email" required className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="trader@example.com"/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input type="password" required className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="password"/>
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-lg">
                <LogIn className="inline-block w-5 h-5 mr-2" /> Secure Login
              </button>
              <p className="text-center text-sm text-gray-400">
                Don't have an account? <button onClick={() => setCurrentPage('pricing')} className="font-medium text-blue-400 hover:text-blue-300">Sign up</button>
              </p>
            </form>
          </div>
        </div>
      );
    }
    
    // If logged in, show the actual dashboard
    return (
      <div className="pt-24 min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Trader Dashboard</h1>
            <p className="text-gray-400">Welcome back, Alex.</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-2 space-y-8">
              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-gray-400 text-sm font-medium">Portfolio Value</h3>
                  <p className="text-3xl font-bold text-white mt-2">₹1,24,567.89</p>
                  <p className="text-sm text-green-400 mt-1 flex items-center"><TrendingUp className="w-4 h-4 mr-1"/>+2.34% Today</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-gray-400 text-sm font-medium">Today's P&L</h3>
                  <p className="text-3xl font-bold text-green-400 mt-2">₹2,845.12</p>
                  <p className="text-sm text-gray-400 mt-1">Realized + Unrealized</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-gray-400 text-sm font-medium">Available Funds</h3>
                  <p className="text-3xl font-bold text-white mt-2">₹45,210.50</p>
                  <p className="text-sm text-gray-400 mt-1">Ready to deploy</p>
                </div>
              </div>
              {/* Portfolio Holdings */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Holdings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 font-medium text-gray-400">Symbol</th>
                        <th className="py-2 font-medium text-gray-400 text-right">Quantity</th>
                        <th className="py-2 font-medium text-gray-400 text-right">Avg. Price</th>
                        <th className="py-2 font-medium text-gray-400 text-right">Current Value</th>
                        <th className="py-2 font-medium text-gray-400 text-right">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[{sym: 'RELIANCE', qty: 10, avg: '2800.00', val: '28476.50', pnl: '+476.50', up: true},
                        {sym: 'TCS', qty: 5, avg: '3900.00', val: '19075.50', pnl: '-424.50', up: false},
                        {sym: 'NIFTYBEES', qty: 100, avg: '240.00', val: '26500.00', pnl: '+2500.00', up: true}].map(h => (
                        <tr key={h.sym} className="border-b border-gray-800">
                          <td className="py-3 font-semibold">{h.sym}</td>
                          <td className="py-3 text-right">{h.qty}</td>
                          <td className="py-3 text-right">{h.avg}</td>
                          <td className="py-3 text-right">₹{h.val}</td>
                          <td className={`py-3 text-right font-semibold ${h.up ? 'text-green-400' : 'text-red-400'}`}>₹{h.pnl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Active Algorithms</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="font-semibold">Momentum Scalper v2</p>
                    <p className="text-sm text-gray-400">RELIANCE | 5min</p>
                    <p className="text-sm text-green-400 font-bold mt-1">P&L: +₹1,230.15</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="font-semibold">Mean Reversion Bot</p>
                    <p className="text-sm text-gray-400">BANKNIFTY | 15min</p>
                    <p className="text-sm text-red-400 font-bold mt-1">P&L: -₹845.60</p>
                  </div>
                  <button className="w-full text-center py-2 text-blue-400 hover:text-white transition-colors">Manage Algorithms</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  };
  

  // --- Main App Logic to Render Pages ---

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'platform':
        return <TradingPlatformPage />;
      case 'ai':
        return <AIPage />;
      case 'data':
        return <MarketDataPage />;
      case 'pricing':
        return <PricingPage />;
      case 'contact':
        return <ContactPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <style>
        {`
          @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
        `}
      </style>
      <NavBar />
      {currentPage === 'home' && <MarketTicker />}
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
};

export default App;