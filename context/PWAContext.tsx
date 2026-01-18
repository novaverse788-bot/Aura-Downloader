import React, { createContext, useContext, useEffect, useState } from 'react';
import InstallPopup from '../components/InstallPopup';

interface PWAContextType {
    isInstallable: boolean;
    showInstallPrompt: () => void;
    installPrompt: any; // BeforeInstallPromptEvent
}

const PWAContext = createContext<PWAContextType | null>(null);

export const usePWA = () => {
    const context = useContext(PWAContext);
    if (!context) {
        throw new Error('usePWA must be used within a PWAProvider');
    }
    return context;
};

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
            console.log("PWA Install Prompt captured");
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstallable(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const triggerInstall = async () => {
        if (!deferredPrompt) return;

        // Hide the custom popup
        setShowPopup(false);

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    const showInstallPrompt = () => {
        if (deferredPrompt) {
            setShowPopup(true);
        }
    };

    return (
        <PWAContext.Provider value={{ isInstallable, showInstallPrompt, installPrompt: deferredPrompt }}>
            {children}
            <InstallPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                onInstall={triggerInstall}
            />
        </PWAContext.Provider>
    );
};
