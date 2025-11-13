import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Leaf, Trophy, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
  const { t } = useLanguage();
  const [plantNotifications, setPlantNotifications] = useState(() => {
    return localStorage.getItem('plantNotifications') !== 'false';
  });
  const [achievementNotifications, setAchievementNotifications] = useState(() => {
    return localStorage.getItem('achievementNotifications') !== 'false';
  });
  const [dailyReminders, setDailyReminders] = useState(() => {
    return localStorage.getItem('dailyReminders') !== 'false';
  });
  const [inactivityReminder, setInactivityReminder] = useState(() => {
    return localStorage.getItem('inactivityReminder') !== 'false';
  });

  const handleTogglePlantNotifications = (enabled: boolean) => {
    setPlantNotifications(enabled);
    localStorage.setItem('plantNotifications', enabled.toString());
    
    toast.success(
      enabled
        ? (t('language') === 'bs' ? 'Obavještenja o biljkama uključena' : 'Plant notifications enabled')
        : (t('language') === 'bs' ? 'Obavještenja o biljkama isključena' : 'Plant notifications disabled')
    );
  };

  const handleToggleAchievementNotifications = (enabled: boolean) => {
    setAchievementNotifications(enabled);
    localStorage.setItem('achievementNotifications', enabled.toString());
    
    toast.success(
      enabled
        ? (t('language') === 'bs' ? 'Obavještenja o dostignućima uključena' : 'Achievement notifications enabled')
        : (t('language') === 'bs' ? 'Obavještenja o dostignućima isključena' : 'Achievement notifications disabled')
    );
  };

  const handleToggleDailyReminders = (enabled: boolean) => {
    setDailyReminders(enabled);
    localStorage.setItem('dailyReminders', enabled.toString());
    
    toast.success(
      enabled
        ? (t('language') === 'bs' ? 'Dnevni podsjetnici uključeni' : 'Daily reminders enabled')
        : (t('language') === 'bs' ? 'Dnevni podsjetnici isključeni' : 'Daily reminders disabled')
    );
  };

  const handleToggleInactivityReminder = (enabled: boolean) => {
    setInactivityReminder(enabled);
    localStorage.setItem('inactivityReminder', enabled.toString());
    
    toast.success(
      enabled
        ? (t('language') === 'bs' ? 'Podsjetnik za neaktivnost uključen' : 'Inactivity reminder enabled')
        : (t('language') === 'bs' ? 'Podsjetnik za neaktivnost isključen' : 'Inactivity reminder disabled')
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('notificationsTitle')}</DialogTitle>
          <DialogDescription>
            {t('language') === 'bs' 
              ? 'Upravljajte vašim obavještenjima'
              : 'Manage your notifications'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* Plant Identifications */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full p-2 mt-0.5">
                  <Leaf className="size-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm">{t('plantIdentifications')}</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    {t('plantIdentificationsDesc')}
                  </p>
                </div>
              </div>
              <Switch
                checked={plantNotifications}
                onCheckedChange={handleTogglePlantNotifications}
              />
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-full p-2 mt-0.5">
                  <Trophy className="size-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm">{t('newAchievements')}</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    {t('newAchievementsDesc')}
                  </p>
                </div>
              </div>
              <Switch
                checked={achievementNotifications}
                onCheckedChange={handleToggleAchievementNotifications}
              />
            </div>
          </Card>

          {/* Daily Reminders */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full p-2 mt-0.5">
                  <Calendar className="size-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm">{t('dailyReminders')}</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    {t('dailyRemindersDesc')}
                  </p>
                </div>
              </div>
              <Switch
                checked={dailyReminders}
                onCheckedChange={handleToggleDailyReminders}
              />
            </div>
          </Card>

          {/* Inactivity Reminder */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-full p-2 mt-0.5">
                  <AlertCircle className="size-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm">{t('inactivityReminder')}</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    {t('inactivityReminderDesc')}
                  </p>
                </div>
              </div>
              <Switch
                checked={inactivityReminder}
                onCheckedChange={handleToggleInactivityReminder}
              />
            </div>
          </Card>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              {t('language') === 'bs'
                ? 'Obavještenja pomažu da budete informisani o vašim aktivnostima u aplikaciji.'
                : 'Notifications help you stay informed about your activities in the app.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
