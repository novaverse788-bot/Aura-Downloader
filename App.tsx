import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MetadataExtractor from './pages/MetadataExtractor';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Help from './pages/Help';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { PWAProvider } from './context/PWAContext';

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(true); // Default to dark for "Pro" feel

    // Toggle Theme
    useEffect(() => {
        if (darkMode) document.body.classList.add('dark');
        else document.body.classList.remove('dark');
    }, [darkMode]);

    return (
        <PWAProvider>
            <Router>
                <ScrollToTop />
                <div className={`min-h-screen font-sans ${darkMode ? 'dark' : ''} bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white transition-colors duration-300 flex flex-col`}>

                    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

                    {/* Routes */}
                    <div className="flex-1 flex flex-col pt-16">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/metadata" element={<MetadataExtractor />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/help" element={<Help />} />
                        </Routes>
                    </div>

                    <Footer />
                </div>
            </Router>
        </PWAProvider>
    );
};

export default App;