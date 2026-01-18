import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
    const location = useLocation();
    const isMetadataPage = location.pathname === '/metadata';

    return (
        <nav className="fixed top-0 w-full h-16 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
            <Link to="/" className="flex items-center gap-2 cursor-pointer no-underline">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-white">
                    <span className="material-symbols-rounded text-xl">download</span>
                </div>
                <span className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Aura Downloader</span>
            </Link>

            <div className="flex items-center gap-4">
                {isMetadataPage ? (
                    <Link to="/" className="hidden md:block font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Video Downloader</Link>
                ) : (
                    <Link to="/metadata" className="hidden md:block font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Metadata Tool</Link>
                )}

                <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-rounded text-gray-700 dark:text-white">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
