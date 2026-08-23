import React from 'react';
import { Smartphone, Share, PlusSquare, Info, Monitor, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

interface PWAInstallButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  className?: string;
  requireMeterReaderRole?: boolean;
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  size = 'sm',
  variant = 'default',
  className = '',
  requireMeterReaderRole = true,
  label = 'Install App',
}) => {
  const { user } = useAuth();
  const { currentAdmin } = useAdmin();
  const {
    isInstalled,
    installApp,
    showIOSInstructions,
    setShowIOSInstructions,
    showHelpInstructions,
    setShowHelpInstructions,
  } = usePWAInstall();

  // Role check: If required, restrict to METER_READER role
  const userRole = user?.role || currentAdmin?.role || '';
  const isMeterReader = userRole.toUpperCase() === 'METER_READER' || userRole === 'meter_reader';

  if (requireMeterReaderRole && !isMeterReader) {
    return null;
  }

  // Hide button completely once app is already installed / running in standalone mode
  if (isInstalled) {
    return null;
  }

  const defaultClasses =
    variant === 'default'
      ? 'group relative inline-flex items-center gap-2 rounded-xl gradient-primary text-white shadow-sm hover:shadow hover:opacity-95 transition-all duration-200 border-0'
      : '';

  return (
    <>
      <Button
        size={size}
        variant={variant}
        onClick={installApp}
        className={`${defaultClasses} ${className}`}
      >
        <Smartphone className="w-4 h-4 text-current opacity-90 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium text-xs sm:text-sm">{label}</span>
      </Button>

      {/* iOS Instruction Modal */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Smartphone className="w-5 h-5" />
              Install on iOS Device
            </DialogTitle>
            <DialogDescription>
              Follow these simple steps in Safari to add the Water Management app to your home screen:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3 p-3 bg-secondary/60 rounded-xl">
              <div className="p-2 bg-background rounded-lg shadow-sm">
                <Share className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Step 1: Tap Share</p>
                <p className="text-xs text-muted-foreground">Tap the Share icon at the bottom or top of Safari.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary/60 rounded-xl">
              <div className="p-2 bg-background rounded-lg shadow-sm">
                <PlusSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Step 2: Add to Home Screen</p>
                <p className="text-xs text-muted-foreground">Scroll down and tap <span className="font-semibold text-foreground">"Add to Home Screen"</span>.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowIOSInstructions(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Desktop / Fallback Instructions Modal */}
      <Dialog open={showHelpInstructions} onOpenChange={setShowHelpInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Monitor className="w-5 h-5" />
              How to Install Water Management App
            </DialogTitle>
            <DialogDescription>
              Your browser allows installing this application directly to your desktop or mobile device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-foreground">
            <div className="flex items-start gap-3 p-3 bg-secondary/60 rounded-xl">
              <Download className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Desktop (Chrome / Edge / Brave):</p>
                <p className="text-xs text-muted-foreground">
                  Look for the <span className="font-semibold text-foreground">Install</span> icon on the right end of your browser's address bar (URL bar).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary/60 rounded-xl">
              <Smartphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Mobile Device (Android / iOS):</p>
                <p className="text-xs text-muted-foreground">
                  Open this website in your mobile browser and select <span className="font-semibold text-foreground">"Install app"</span> or <span className="font-semibold text-foreground">"Add to Home Screen"</span> from your browser menu.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHelpInstructions(false)}>Understood</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

