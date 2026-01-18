import React, { useEffect, useState } from 'react';

interface InstallPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onInstall: () => void;
}

const InstallPopup: React.FC<InstallPopupProps> = ({ isOpen, onClose, onInstall }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            const timer = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Card */}
            <div className={`relative bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-300 border border-white/20 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Decorative Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent-purple/20 rounded-full flex items-center justify-center animate-bounce-slow">
                        <span className="material-symbols-rounded text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple">
                            install_desktop
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-3 font-display">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Oh hello there!
                        </span>
                        <span className="inline-block animate-bounce ml-2 text-2xl" style={{ animationDuration: '2s' }}>🌸</span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        It looks like you're new here. Would you like to keep <span className="font-bold text-primary">Aura Downloader</span> right on your desktop for faster downloads?
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 italic">
                        It would be our honor to be part of your workspace! ✨
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={onInstall}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent-purple text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-rounded">download</span>
                        Install Now
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPopup;
