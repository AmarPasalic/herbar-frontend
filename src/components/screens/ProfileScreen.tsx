import { useState } from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { getCurrentUser } from '../../data/mockUser';
import { allAchievements, getCurrentLevel, getNextLevel, getProgressToNextLevel } from '../../data/achievements';
import { usePoints } from '../../hooks/usePoints';
import { useLanguage } from '../../hooks/useLanguage';
import { GuidelinesDialog } from '../GuidelinesDialog';
import { NotificationsDialog } from '../NotificationsDialog';
import { LanguageDialog } from '../LanguageDialog';
import { PreferencesDialog } from '../PreferencesDialog';
import { HelpDialog } from '../HelpDialog';
import { EditProfileDialog } from '../EditProfileDialog';
import { useDarkMode } from '../../hooks/useDarkMode';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import {
  User,
  Settings,
  Bell,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  Target,
  GraduationCap,
  Trophy,
  Star,
  BookOpen
} from 'lucide-react';

interface ProfileScreenProps {
  onLogout: () => void;
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t, language } = useLanguage();
  const currentUser = getCurrentUser();
  const totalPoints = usePoints();

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    toast.success(
      isDarkMode ? t('lightModeEnabled') : t('darkModeEnabled'),
      {
        description: isDarkMode
          ? t('lightModeEnabledDesc')
          : t('darkModeEnabledDesc'),
      }
    );
  };

  const handleProfileUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const currentLevel = getCurrentLevel(totalPoints);
  const nextLevel = getNextLevel(currentLevel.level);
  const progress = getProgressToNextLevel(totalPoints, currentLevel, nextLevel);

  const unlockedAchievements = allAchievements.filter(a =>
    currentUser.unlockedAchievements.includes(a.id)
  );

  return (
    <div className="space-y-6 pb-6" key={refreshKey}>
      <div className="space-y-2">
        <h1>{t('profileTitle')}</h1>
        <p className="text-muted-foreground">
          {t('profileDescription')}
        </p>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            <AvatarFallback className="bg-green-600 text-white">
              <User className="size-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2>{currentUser.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <GraduationCap className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('department')} {currentUser.grade}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{currentUser.email}</p>
            <Button
              variant="link"
              className="px-0 h-auto mt-1"
              onClick={() => setEditProfileOpen(true)}
            >
              {t('editProfile')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Level & Points Card */}
      <Card className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full size-12 flex items-center justify-center">
                {currentLevel.level}
              </div>
              <div>
                <h3 className="text-blue-900 dark:text-blue-200">{currentLevel.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="size-4 text-yellow-600" />
                  <span className="text-sm">{totalPoints} {t('points')}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGuidelinesOpen(true)}
            >
              <BookOpen className="size-4 mr-2" />
              {t('guidelines')}
            </Button>
          </div>

          {nextLevel && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('progressTo')} {nextLevel.level}
                </span>
                <span className="text-muted-foreground">
                  {totalPoints}/{nextLevel.minPoints}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </Card>

      {/* Achievements Card */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-purple-600 dark:text-purple-400" />
            <h3>{t('achievements')}</h3>
          </div>
          <Badge variant="secondary">
            {unlockedAchievements.length}/{allAchievements.length}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {allAchievements.slice(0, 4).map((achievement) => {
            const isUnlocked = currentUser.unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border ${isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-yellow-200 dark:border-yellow-800'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-50'
                  }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <h4 className="text-sm">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>

        <Button
          variant="link"
          className="w-full mt-3"
          onClick={() => setGuidelinesOpen(true)}
        >
          {t('viewAll')}
          <ChevronRight className="size-4 ml-1" />
        </Button>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Award className="size-5" />
            <span className="text-sm">{t('totalAchievements')}</span>
          </div>
          <div>{unlockedAchievements.length}/{allAchievements.length}</div>
        </Card>
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Target className="size-5" />
            <span className="text-sm">{t('totalPlantsFound')}</span>
          </div>
          <div>{allAchievements.length} {t('plantsCount')}</div>
        </Card>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <h3>{t('settings')}</h3>

        <Card className="divide-y">
          <button
            className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
            onClick={() => setNotificationsOpen(true)}
          >
            <div className="flex items-center gap-3">
              <Bell className="size-5 text-muted-foreground" />
              <span>{t('notifications')}</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="size-5 text-muted-foreground" />
              <span>{t('darkMode')}</span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>

          <button
            className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
            onClick={() => setLanguageOpen(true)}
          >
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-muted-foreground" />
              <span>{t('language')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {language === 'bs' ? 'Bosanski' : 'English'}
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>
          </button>

          <button
            className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
            onClick={() => setPreferencesOpen(true)}
          >
            <div className="flex items-center gap-3">
              <Settings className="size-5 text-muted-foreground" />
              <span>{t('preferences')}</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        </Card>
      </div>

      {/* Support */}
      <div className="space-y-3">
        <h3>{t('help')}</h3>

        <Card className="divide-y">
          <button
            className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
            onClick={() => setHelpOpen(true)}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="size-5 text-muted-foreground" />
              <span>{t('helpTitle')}</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>

          <button
            className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors text-destructive"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <div className="flex items-center gap-3">
              <LogOut className="size-5" />
              <span>{t('logout')}</span>
            </div>
          </button>
        </Card>
      </div>

      <div className="text-center text-xs text-muted-foreground pt-4">
        Digitalni Herbarijum v1.0.0
      </div>

      <GuidelinesDialog
        open={guidelinesOpen}
        onOpenChange={setGuidelinesOpen}
      />

      <NotificationsDialog
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />

      <LanguageDialog
        open={languageOpen}
        onOpenChange={setLanguageOpen}
      />

      <PreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
      />

      <HelpDialog
        open={helpOpen}
        onOpenChange={setHelpOpen}
      />

      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        onUpdate={handleProfileUpdate}
      />

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('logout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('logoutConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={onLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}