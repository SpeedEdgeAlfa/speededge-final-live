<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SpeedEdge Algorithmic Trading Platform</title>
    
    <!-- Tailwind CSS for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- React and ReactDOM for component rendering -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- Babel for in-browser JSX transpilation -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        /* Applying the Inter font as the default sans-serif font, as used by Tailwind */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #000; /* Default dark background */
        }
        
        /* Custom animation for the market ticker */
        @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .animate-scroll {
            animation: scroll 40s linear infinite;
        }

        /* Minor adjustments for better scrollbar aesthetics in dark mode */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
        }
    </style>
</head>
<body>
    <!-- The React app will be rendered inside this div -->
    <div id="root"></div>

    <script type="text/babel">
        // Since we can't import from 'lucide-react', we'll define the used icons as SVG components.
        // This is a common practice for creating self-contained HTML previews.
        const createLucideIcon = (svgContent) => (props) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                {...props} // This allows passing className, size, etc.
            >
                {svgContent}
            </svg>
        );

        // --- ALL ICON DEFINITIONS ---
        // We define all icons used in the application here to prevent "undefined" errors.
        const TrendingUp = createLucideIcon(<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>);
        const TrendingDown = createLucideIcon(<><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></>);
        const Zap = createLucideIcon(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />);
        const Shield = createLucideIcon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />);
        const BarChart3 = createLucideIcon(<><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></>);
        const Bot = createLucideIcon(<><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></>);
        const Brain = createLucideIcon(<><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h-3A2.5 2.5 0 0 1 4 4.5v0A2.5 2.5 0 0 1 6.5 2h3Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 7h3A2.5 2.5 0 0 0 20 4.5v0A2.5 2.5 0 0 0 17.5 2h-3Z" /><path d="M5 8.5A2.5 2.5 0 0 1 7.5 11h9a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 11 13.5v0A2.5 2.5 0 0 1 8.5 11h-1A2.5 2.5 0 0 0 5 8.5Z" /><path d="M5 16.5A2.5 2.5 0 0 1 7.5 19h9a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5h-3a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1-2.5-2.5h-1A2.5 2.5 0 0 0 5 16.5Z" /></>);
        const Target = createLucideIcon(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>);
        const Activity = createLucideIcon(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />);
        const Menu = createLucideIcon(<><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></>);
        const X = createLucideIcon(<><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></>);
        const Play = createLucideIcon(<polygon points="6 3 20 12 6 21 6 3" />);
        const Globe = createLucideIcon(<><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>);
        const CheckCircle = createLucideIcon(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>);
        const Database = createLucideIcon(<><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></>);
        const Clock = createLucideIcon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>);
        const Layers = createLucideIcon(<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>);
        const Mail = createLucideIcon(<><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>);
        const Phone = createLucideIcon(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />);
        const MapPin = createLucideIcon(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>);
        const Github = createLucideIcon(<><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></>);
        const Twitter = createLucideIcon(<path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-2.1 1.4H28V_a" />);
        const Linkedin = createLucideIcon(<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>);
        const LogIn = createLucideIcon(<><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></>);
        const Calculator = createLucideIcon(<><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="12" x2="12" y1="10" y2="18" /><line x1="8" x2="16" y1="14" y2="14" /></>);
        const Users = createLucideIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
        const Star = createLucideIcon(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />);
        const ChevronDown = createLucideIcon(<polyline points="6 9 12 15 18 9" />);
        const DollarSign = createLucideIcon(<><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>);
        const Briefcase = createLucideIcon(<><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>);
        const Settings = createLucideIcon(<><path d="M12.22 2h.01" /><path d="M6.35 3.9l.01.01" /><path d="m2.15 8.36.01.01" /><path d="M2 12.88l.01.01" /><path d="M6.35 19.74l.01.01" /><path d="M12.22 21.5h.01" /><path d="M18.1 19.74l.01.01" /><path d="M22.3 15.24l-.01-.01" /><path d="M22.3 8.36l-.01-.01" /><path d="M18.1 3.9l-.01-.01" /><circle cx="12" cy="12" r="4.5" /><path d="m12 16.5-2.2-1.2" /><path d="M12 7.5l2.2 1.2" /><path d="m14.2 14.8-.5-2.6" /><path d="m9.8 9.2.5 2.6" /><path d="M7.8 14.8l2.5-.5" /><path d="m13.7 9.2-2.5.5" /></>);
        const UserPlus = createLucideIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></>);
        const ArrowRight = createLucideIcon(<><line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" /></>);
        const AlertTriangle = createLucideIcon(<><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></>);
        const Bitcoin = createLucideIcon(<><path d="M11.8 12.5c.4-2.3 2.8-3.4 5.2-3.4h.1c.5 0 .9.4.8.9l-.3 1.5c0 .5-.4.8-.9.8h-.1c-1.3 0-2.4.7-2.9 1.9l-1.8 8.2c-.5 2.3-2.8 3.4-5.2 3.4h-.1c-.5 0-.9-.4-.8-.9l.3-1.5c0-.5.4-.8.9-.8h.1c1.3 0 2.4-.7 2.9-1.9l1.8-8.2z"/><path d="M8.2 6.5c.4-2.3 2.8-3.4 5.2-3.4h.1c.5 0 .9.4.8.9l-.3 1.5c0 .5-.4.8-.9.8h-.1c-1.3 0-2.4.7-2.9 1.9L8.3 16c-.5 2.3-2.8 3.4-5.2 3.4h-.1c-.5 0-.9-.4-.8-.9l.3-1.5c0-.5.4-.8.9-.8h.1c1.3 0 2.4-.7 2.9-1.9l1.8-8.2z"/></>);

        // --- CUSTOM SVG ICONS ---
        const GoogleIcon = (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
        );


        const { useState, useEffect, useCallback, useRef } = React;

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
            document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
            if (!postLoginRedirect) {
               window.scrollTo(0, 0);
            }
          }, [currentPage, isMenuOpen, postLoginRedirect]);

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
          const MockChart = ({gradientId="gradient"}) => {
            const points = "0,40 20,30 40,50 60,40 80,60 100,50 120,70 140,60 160,80 180,70";
            return (
                <svg viewBox="0 0 180 100" className="w-full h-full" preserveAspectRatio="none">
                    <path d={`M ${points}`} fill="none" stroke={`url(#${gradientId})`} strokeWidth="2"/>
                    <path d={`M 0,100 L ${points} L 180,100 Z`} fill={`url(#${gradientId}-area)`} />
                    <defs>
                        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" />
                            <stop offset="100%" stopColor="#A78BFA" />
                        </linearGradient>
                        <linearGradient id={`${gradientId}-area`} x1="0" x2="0" y1="0" y2="1">
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
            { name: 'AI & Algorithms', id: 'ai' },
            { name: 'Market Data', id: 'data' },
            { name: 'Crypto World', id: 'crypto' },
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
            { icon: Bitcoin, title: 'Crypto Ready', description: 'Seamlessly trade top cryptocurrencies alongside traditional assets.', highlights: ['24/7 market access', 'Secure cold storage', 'Real-time crypto data'] }
          ];

          // AI Features Data
          const aiFeatures = [
            { icon: Brain, title: 'Neural Network Strategies', description: 'Deep learning models trained on years of market data', performance: '+42.6% Annual Return', sharpe: '2.34 Sharpe Ratio' },
            { icon: Target, title: 'Sentiment Analysis', description: 'Real-time news and social media sentiment scoring', performance: '+67% Signal Accuracy', sharpe: '1.89 Information Ratio' },
            { icon: Activity, title: 'Pattern Recognition', description: 'Computer vision for chart pattern identification', performance: '+38.9% Hit Rate', sharpe: '2.12 Win/Loss Ratio' }
          ];
          

          // --- Core UI Components ---

          // Navigation Bar Component - Updated
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
                      <button
                        onClick={() => setCurrentPage('dashboard')}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                      >
                        Login / Sign Up
                      </button>
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

          // Helper component for simple numeric input fields, wrapped in React.memo
          const InputField = React.memo(({ label, id, name, value, onChange, ringColor = 'blue' }) => (
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-sm font-medium text-gray-300 flex-1">{label}</label>
                <input
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    type="number"
                    className={`w-1/2 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-${ringColor}-500 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
            </div>
          ));

          // Helper component for currency fields with increment/decrement buttons, wrapped in React.memo
          const AmountInputField = React.memo(({ label, id, name, value, onChange, onIncrement, onDecrement, ringColor = 'blue', currency, increments }) => (
              <div className="space-y-2">
                  <div className="flex items-center justify-between">
                      <label htmlFor={id} className="text-sm font-medium text-gray-300 flex-1">{label}</label>
                      <input
                          id={id}
                          name={name}
                          value={value}
                          onChange={onChange}
                          type="number"
                          className={`w-1/2 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-${ringColor}-500 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-end space-x-2">
                          {increments[currency].values.map((amount, index) => (
                              <button key={index} type="button" onClick={() => onDecrement(name, amount)} className="px-2 py-0.5 bg-red-800/50 text-xs text-red-300 rounded-md hover:bg-red-700/50 w-full">
                                  -{increments[currency].labels[index]}
                              </button>
                          ))}
                      </div>
                       <div className="flex justify-end space-x-2">
                          {increments[currency].values.map((amount, index) => (
                              <button key={index} type="button" onClick={() => onIncrement(name, amount)} className="px-2 py-0.5 bg-green-800/50 text-xs text-green-300 rounded-md hover:bg-green-700/50 w-full">
                                  +{increments[currency].labels[index]}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          ));
          
          // Market Ticker Component
          const MarketTicker = () => {
            const tickerData = [
              { symbol: 'NIFTY 50', price: '23,537.85', changePercent: '+0.74%', trend: 'up' },
              { symbol: 'SENSEX', price: '77,478.93', changePercent: '+0.72%', trend: 'up' },
              { symbol: 'BTC/USD', price: '68,420.10', changePercent: '+2.15%', trend: 'up' },
              { symbol: 'RELIANCE', price: '2,847.65', changePercent: '+0.83%', trend: 'up' },
              { symbol: 'ETH/USD', price: '3,551.80', changePercent: '+1.58%', trend: 'up' },
              { symbol: 'HDFCBANK', price: '1,698.20', changePercent: '-0.21%', trend: 'down' },
              { symbol: 'SOL/USD', price: '168.45', changePercent: '+5.80%', trend: 'up' },
              { symbol: 'ICICIBANK', price: '1,125.80', changePercent: '+0.98%', trend: 'up' },
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
                // Sanitize inputs
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
                if(isLoggedIn) {
                    calculateForecast(inputs);
                } else {
                    setResults(null); // Clear results when logged out
                }
            }, [isLoggedIn, inputs, calculateForecast]);


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
                            <AmountInputField label={`Account Size (${currencySymbols[currency]})`} id="accountSize" name="accountSize" value={inputs.accountSize} onChange={handleInputChange} onIncrement={handleIncrement} onDecrement={handleDecrement} ringColor="blue" currency={currency} increments={increments}/>
                            <InputField label="Position Size (%)" id="positionSizePct" name="positionSizePct" value={inputs.positionSizePct} onChange={handleInputChange} ringColor="blue"/>
                            <InputField label="Max Positions" id="maxPositions" name="maxPositions" value={inputs.maxPositions} onChange={handleInputChange} ringColor="blue"/>
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
                            <AmountInputField label={`Desired Amount (${currencySymbols[currency]})`} id="desiredAmount" name="desiredAmount" value={inputs.desiredAmount} onChange={handleInputChange} onIncrement={handleIncrement} onDecrement={handleDecrement} ringColor="green" currency={currency} increments={increments}/>
                        </div>
                      </div>

                       <button 
                        type="submit" 
                        className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-lg flex items-center justify-center"
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate Forecast
                      </button>
                    </div>

                    <div className="lg:col-span-2 bg-gray-800 p-8 rounded-2xl border border-gray-700">
                      {!results ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-gray-400">
                              <AlertTriangle className="mx-auto w-12 h-12 text-yellow-500 mb-4" />
                              <h3 className="text-xl font-semibold text-white">Login to Calculate</h3>
                              <p className="mt-2">Please log in to use the forecast calculator and view your results.</p>
                               <button onClick={handleCalculateClick} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                   Login / Sign Up
                               </button>
                          </div>
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
          
          // Footer Component - Updated
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
                                {['platform', 'ai', 'data', 'crypto'].map(id => {
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
            }, [currentPage, postLoginRedirect]);

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
                            Experience the next generation of trading with AI-powered algorithms, institutional-grade data, and lightning-fast execution for stocks and crypto.
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
                      <p className="text-xl text-gray-400 mt-4">Join thousands of traders who are leveraging SpeedEdge to build their wealth.</p>
                      <button onClick={() => setCurrentPage('dashboard')} className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                        Get Started Now
                      </button>
                    </div>
                  </section>
                </div>
            );
          }
          
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
                                <div className="flex-1"><MockChart gradientId="niftyChart"/></div>
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
          
          // Crypto World Page - NEW
          const CryptoWorldPage = () => {
              const cryptoData = [
                  { name: 'Bitcoin', symbol: 'BTC', price: '68,420.10', change: '+2.15%', trend: 'up', marketCap: '1.35T' },
                  { name: 'Ethereum', symbol: 'ETH', price: '3,551.80', change: '+1.58%', trend: 'up', marketCap: '426.7B' },
                  { name: 'Solana', symbol: 'SOL', price: '168.45', change: '+5.80%', trend: 'up', marketCap: '77.8B' },
                  { name: 'BNB', symbol: 'BNB', price: '601.50', change: '-0.50%', trend: 'down', marketCap: '88.7B' },
                  { name: 'Ripple', symbol: 'XRP', price: '0.525', change: '+0.85%', trend: 'up', marketCap: '29.1B' },
              ];

              return (
                 <div className="pt-24 min-h-screen bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Welcome to the Crypto World</h1>
                            <p className="mt-4 text-lg text-gray-400">Trade the future of finance, 24/7.</p>
                        </div>
                        <div className="mt-12 bg-gray-900 rounded-2xl border border-gray-800 p-4 lg:p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="py-3 px-4 font-medium text-gray-400">Name</th>
                                            <th className="py-3 px-4 font-medium text-gray-400 text-right">Price (USD)</th>
                                            <th className="py-3 px-4 font-medium text-gray-400 text-right">24h Change</th>
                                            <th className="py-3 px-4 font-medium text-gray-400 text-right hidden md:table-cell">Market Cap</th>
                                            <th className="py-3 px-4 font-medium text-gray-400 text-center">Trade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                     {cryptoData.map(crypto => (
                                         <tr key={crypto.symbol} className="border-b border-gray-800 hover:bg-gray-800/50">
                                             <td className="py-4 px-4 font-semibold flex items-center">
                                                 <Bitcoin className="w-6 h-6 mr-3 text-orange-400"/>
                                                 <div>
                                                     <div>{crypto.name}</div>
                                                     <div className="text-sm text-gray-500">{crypto.symbol}</div>
                                                 </div>
                                             </td>
                                             <td className="py-4 px-4 text-right font-mono">{crypto.price}</td>
                                             <td className={`py-4 px-4 text-right font-semibold ${crypto.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>{crypto.change}</td>
                                             <td className="py-4 px-4 text-right hidden md:table-cell font-mono">{crypto.marketCap}</td>
                                             <td className="py-4 px-4 text-center">
                                                 <button onClick={() => setCurrentPage('platform')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Trade</button>
                                             </td>
                                         </tr>
                                     ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                 </div>
              );
          };
          
          // Dashboard/Login Page - Updated
          const DashboardPage = () => {
            
            // Login form submit handler
            const handleLogin = (e) => {
                e.preventDefault();
                setIsLoggedIn(true);

                if (postLoginRedirect) {
                    setCurrentPage(postLoginRedirect.page);
                }
            };

            // If not logged in, show the unified login/signup form
            if (!isLoggedIn) {
              return (
                <div className="pt-20 min-h-screen bg-gray-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
                        <div className="text-center mb-8">
                            <Logo className="mx-auto" />
                            <h2 className="mt-6 text-3xl font-bold text-white">Access Your Account</h2>
                            <p className="mt-2 text-gray-400">Continue with Google or your email to trade.</p>
                        </div>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-center py-3 px-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                                <GoogleIcon className="w-6 h-6 mr-3" />
                                Continue with Google
                            </button>
                            <div className="relative">
                               <div className="absolute inset-0 flex items-center">
                                   <div className="w-full border-t border-gray-600" />
                               </div>
                               <div className="relative flex justify-center text-sm">
                                   <span className="bg-gray-800 px-2 text-gray-500">OR</span>
                               </div>
                            </div>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-300 sr-only">Email Address</label>
                                    <input type="email" required className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="trader@example.com"/>
                                </div>
                                 <div>
                                    <label className="text-sm font-medium text-gray-300 sr-only">Password</label>
                                    <input type="password" required className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Password"/>
                                </div>
                                <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-lg">
                                   Continue with Email
                                </button>
                            </form>
                        </div>
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
              case 'crypto':
                return <CryptoWorldPage />;
              case 'dashboard':
                return <DashboardPage />;
              default:
                return <HomePage />;
            }
          };

          return (
            <div className="bg-black min-h-screen text-gray-200">
              <NavBar />
              {currentPage === 'home' && <MarketTicker />}
              <main>{renderPage()}</main>
              <Footer />
            </div>
          );
        };

        const container = document.getElementById('root');
        const root = ReactDOM.createRoot(container);
        root.render(<App />);

    </script>
</body>
</html>
