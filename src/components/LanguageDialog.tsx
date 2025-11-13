import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card } from './ui/card';
import { Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../hooks/useLanguage';

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languages = [
  { code: 'bs' as const, name: 'Bosanski', flag: '🇧🇦' },
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
];

export function LanguageDialog({ open, onOpenChange }: LanguageDialogProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleSelectLanguage = (code: 'bs' | 'en') => {
    setLanguage(code);
    toast.success(t('languageChanged'), {
      description: code === 'bs' 
        ? 'Aplikacija je sada na bosanskom jeziku.' 
        : 'Application is now in English.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('languageTitle')}</DialogTitle>
          <DialogDescription>
            {language === 'bs' 
              ? 'Promijenite jezik aplikacije' 
              : 'Change application language'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {languages.map((lang) => {
            const isSelected = language === lang.code;

            return (
              <Card
                key={lang.code}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/50'
                    : 'hover:bg-accent'
                }`}
                onClick={() => handleSelectLanguage(lang.code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <h4 className="text-sm">{lang.name}</h4>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-green-600 text-white rounded-full p-1">
                      <Check className="size-4" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
