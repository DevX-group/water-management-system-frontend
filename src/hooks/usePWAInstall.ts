import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

// Module-level variable to capture beforeinstallprompt if it fires before React mounts
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export const usePWAInstall = () => {
  const { user } = useAuth();
  const isMeterReader = user?.role === 'METER_READER';

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => (isMeterReader ? globalDeferredPrompt : null)
  );

  // Check if running in standalone mode (installed PWA)
  const checkIsStandalone = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }, []);

  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return checkIsStandalone() || localStorage.getItem('pwa_installed') === 'true';
  });
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showHelpInstructions, setShowHelpInstructions] = useState(false);

  useEffect(() => {
    if (!isMeterReader) {
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
      return;
    }

    // If standalone is detected, mark as installed and persist
    if (checkIsStandalone()) {
      setIsInstalled(true);
      localStorage.setItem('pwa_installed', 'true');
    }

    // Query browser for installed related web apps (Chrome/Edge/Android)
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps()
        .then((relatedApps: any[]) => {
          if (relatedApps && relatedApps.length > 0) {
            setIsInstalled(true);
            localStorage.setItem('pwa_installed', 'true');
          }
        })
        .catch(() => {});
    }

    // Listen to media query changes for display-mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        localStorage.setItem('pwa_installed', 'true');
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    // Detect iOS device (iPhone/iPad/iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    setIsIOS(iosDevice);

    // Browser fires beforeinstallprompt when PWA criteria are satisfied and app is NOT installed
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (!isMeterReader) return;

      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      // If browser fires beforeinstallprompt, Chrome confirms app is not installed (or was uninstalled)
      if (!checkIsStandalone()) {
        setIsInstalled(false);
        localStorage.removeItem('pwa_installed');
      }
    };

    // Browser fires appinstalled after installation completes
    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('pwa_installed', 'true');
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkIsStandalone, isMeterReader]);

  const installApp = useCallback(async () => {
    if (!isMeterReader) return;

    // 1. Trigger Native Prompt (Chrome, Edge, Android, Opera)
    const promptToUse = deferredPrompt || globalDeferredPrompt;
    if (promptToUse) {
      try {
        await promptToUse.prompt();
        const choiceResult = await promptToUse.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          localStorage.setItem('pwa_installed', 'true');
        }
      } catch (err) {
        console.error('Error triggering PWA install prompt:', err);
      } finally {
        setDeferredPrompt(null);
        globalDeferredPrompt = null;
      }
      return;
    }

    // 2. Display iOS Safari manual instructions modal
    if (isIOS && !isInstalled) {
      setShowIOSInstructions(true);
      return;
    }

    // 3. Fallback help instructions modal when prompt is not deferred
    setShowHelpInstructions(true);
  }, [deferredPrompt, isIOS, isInstalled, isMeterReader]);

  return {
    canInstall: isMeterReader && !isInstalled,
    isInstalled,
    isIOS,
    deferredPromptAvailable: isMeterReader && (deferredPrompt || globalDeferredPrompt) !== null,
    installApp,
    showIOSInstructions,
    setShowIOSInstructions,
    showHelpInstructions,
    setShowHelpInstructions,
  };
};