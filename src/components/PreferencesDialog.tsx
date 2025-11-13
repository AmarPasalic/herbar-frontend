import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Palette, Monitor, Zap, Type, Maximize } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesDialog({ open, onOpenChange }: PreferencesDialogProps) {
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [animations, setAnimations] = useState(() => {
    return localStorage.getItem('animations') !== 'false';
  });
  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem('autoSave') !== 'false';
  });
  const [compactView, setCompactView] = useState(() => {
    return localStorage.getItem('compactView') === 'true';
  });

  useEffect(() => {
    // Apply animations setting
    if (animations) {
      document.documentElement.style.setProperty('--animation-duration', '200ms');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0ms');
    }
  }, [animations]);

  useEffect(() => {
    // Apply compact view setting
    if (compactView) {
      document.documentElement.classList.add('compact-view');
    } else {
      document.documentElement.classList.remove('compact-view');
    }
  }, [compactView]);

  const handleToggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('darkMode', enabled.toString());
    
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const message = enabled ? 'Tamni režim uključen' : 'Tamni režim isključen';
    const description = 'Tema aplikacije je promijenjena';

    toast.success(message, { description });
  };

  const handleToggleAnimations = (enabled: boolean) => {
    setAnimations(enabled);
    localStorage.setItem('animations', enabled.toString());
    
    if (enabled) {
      document.documentElement.style.setProperty('--animation-duration', '200ms');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0ms');
    }
    
    const message = enabled ? 'Animacije uključene' : 'Animacije isključene';
    const description = enabled ? 'Animacije su sada aktivne' : 'Animacije su isključene';

    toast.success(message, { description });
  };

  const handleToggleAutoSave = (enabled: boolean) => {
    setAutoSave(enabled);
    localStorage.setItem('autoSave', enabled.toString());
    
    const message = enabled ? 'Automatsko sačuvaj uključeno' : 'Automatsko sačuvaj isključeno';
    const description = enabled ? 'Promjene će biti automatski sačuvane' : 'Promjene neće biti automatski sačuvane';

    toast.success(message, { description });
  };

  const handleToggleCompactView = (enabled: boolean) => {
    setCompactView(enabled);
    localStorage.setItem('compactView', enabled.toString());
    
    if (enabled) {
      document.documentElement.classList.add('compact-view');
    } else {
      document.documentElement.classList.remove('compact-view');
    }
    
    const message = enabled ? 'Kompaktni prikaz uključen' : 'Kompaktni prikaz isključen';
    const description = enabled ? 'Prikaz je sada kompaktniji' : 'Prikaz je standardan';

    toast.success(message, { description });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('preferencesTitle')}</DialogTitle>
          <DialogDescription>
            Prilagodite postavke aplikacije prema svojim preferencijama
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* Dark Mode */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Palette className="size-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm">{t('darkMode')}</h4>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Uključite tamni režim za ugodniji prikaz noću
                  </p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleToggleDarkMode}
              />
            </div>
          </Card>

          {/* Animations */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Zap className="size-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm">
                    Animacije
                  </h4>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Prikazuj animacije pri interakciji sa aplikacijom
                  </p>
                </div>
              </div>
              <Switch
                checked={animations}
                onCheckedChange={handleToggleAnimations}
              />
            </div>
          </Card>

          {/* Auto Save */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Monitor className="size-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm">
                    Automatsko sačuvaj
                  </h4>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Automatski sačuvaj promjene bez potvrde
                  </p>
                </div>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={handleToggleAutoSave}
              />
            </div>
          </Card>

          {/* Compact View */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Maximize className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm">
                    Kompaktni prikaz
                  </h4>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Prikaži više sadržaja na ekranu
                  </p>
                </div>
              </div>
              <Switch
                checked={compactView}
                onCheckedChange={handleToggleCompactView}
              />
            </div>
          </Card>

          {/* Display Info */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Type className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm text-blue-900 dark:text-blue-200">
                  Postavke prikaza
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
                  Prilagodite izgled aplikacije prema svojim preferencijama.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
