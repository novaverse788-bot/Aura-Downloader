import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
    const location = useLocation();
    const isMetadataPage = location.pathname === '/metadata';

    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // Scroll to top when clicking links
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            className="w-full relative z-10 mt-auto overflow-hidden group"
            onMouseMove={handleMouseMove}
        >
            {/* Gradient Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 cursor-default group">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">

                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start transition-transform duration-500 group-hover:scale-[1.01]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-white text-[10px]">
                                <span className="material-symbols-rounded text-sm">download</span>
                            </div>
                            <span className="text-lg font-bold font-display tracking-tight text-gray-900 dark:text-white">Aura Downloader</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Premium Tool for Content Creators
                        </p>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8">
                        {isMetadataPage ? (
                            <Link
                                to="/"
                                onClick={handleScrollTop}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                            >
                                Video Downloader
                            </Link>
                        ) : (
                            <Link
                                to="/metadata"
                                onClick={handleScrollTop}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                            >
                                Metadata
                            </Link>
                        )}
                        <Link
                            to="/about"
                            onClick={handleScrollTop}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                        >
                            About
                        </Link>
                        <Link
                            to="/terms"
                            onClick={handleScrollTop}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                        >
                            Terms
                        </Link>
                        <Link
                            to="/privacy"
                            onClick={handleScrollTop}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                        >
                            Privacy
                        </Link>
                        <Link
                            to="/help"
                            onClick={handleScrollTop}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                        >
                            Help & Support
                        </Link>
                        <a
                            href="mailto:aryanraut53@gmail.com?subject=Feature Request / Bug Report&body=Hi Aryan, I would like to report a bug or request a feature:%0D%0A%0D%0A"
                            className="hidden md:inline-block text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple hover:opacity-80 transition-opacity animate-pulse"
                        >
                            Request Feature / Report Bug
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 relative z-10">
                    &copy; {new Date().getFullYear()} Aura Downloader. Designed for educational purposes.
                </div>

                {/* Cursor-reactive Glow */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(62, 166, 255, 0.06), transparent 40%)`
                    }}
                ></div>
            </div>
        </footer>
    );
};

export default Footer;
