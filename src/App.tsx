import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { HomeScreen } from './components/screens/HomeScreen';
import { IdentifyScreen } from './components/screens/IdentifyScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { SignUpScreen } from './components/screens/SignUpScreen';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { Home, Camera, Book, User } from 'lucide-react';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { AuthProvider, useAuth } from './hooks/useAuth';

type AuthScreen = 'login' | 'signup' | null;

function AppContent() {
  const { t } = useLanguage();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  // Primenjuje dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogin = (email: string) => {
    // Login se već obrađuje u LoginScreen preko useAuth
    setAuthScreen(null);
  };

  const handleSignUp = (name: string, email: string, grade: string, school: string) => {
    // Signup se već obrađuje u SignUpScreen preko useAuth
    setAuthScreen(null);
  };

  const handleLogout = () => {
    logout();
    setAuthScreen('login');
    setActiveTab('home');
    toast.info(t('logoutSuccess'), {
      description: t('logoutSuccessDesc'),
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-muted-foreground">Učitavam...</p>
        </div>
      </div>
    );
  }

  // Prikaži login ili sign up screen ako korisnik nije prijavljen
  if (!user) {
    if (authScreen === 'login') {
      return (
        <LoginScreen
          onLogin={handleLogin}
          onNavigateToSignUp={() => setAuthScreen('signup')}
        />
      );
    } else {
      return (
        <SignUpScreen
          onSignUp={handleSignUp}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-background">
        {/* Mobile Container */}
        <div className="max-w-md mx-auto bg-card min-h-screen shadow-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen flex flex-col">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <TabsContent value="home" className="mt-0">
                <HomeScreen />
              </TabsContent>

              <TabsContent value="identify" className="mt-0">
                <IdentifyScreen />
              </TabsContent>

              <TabsContent value="library" className="mt-0">
                <LibraryScreen />
              </TabsContent>

              <TabsContent value="profile" className="mt-0">
                <ProfileScreen onLogout={handleLogout} />
              </TabsContent>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t bg-card">
            <TabsList className="w-full h-auto grid grid-cols-4 bg-transparent p-0 rounded-none">
              <TabsTrigger
                value="home"
                className="flex-col gap-1 py-3 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-950/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-500 rounded-none border-t-2 border-transparent data-[state=active]:border-green-600 transition-all duration-200"
              >
                <Home className="size-5 transition-transform data-[state=active]:scale-110" />
                <span className="text-xs">{t('home')}</span>
              </TabsTrigger>

              <TabsTrigger
                value="identify"
                className="flex-col gap-1 py-3 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-950/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-500 rounded-none border-t-2 border-transparent data-[state=active]:border-green-600 transition-all duration-200"
              >
                <Camera className="size-5 transition-transform data-[state=active]:scale-110" />
                <span className="text-xs">{t('identify')}</span>
              </TabsTrigger>

              <TabsTrigger
                value="library"
                className="flex-col gap-1 py-3 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-950/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-500 rounded-none border-t-2 border-transparent data-[state=active]:border-green-600 transition-all duration-200"
              >
                <Book className="size-5 transition-transform data-[state=active]:scale-110" />
                <span className="text-xs">{t('library')}</span>
              </TabsTrigger>

              <TabsTrigger
                value="profile"
                className="flex-col gap-1 py-3 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-950/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-500 rounded-none border-t-2 border-transparent data-[state=active]:border-green-600 transition-all duration-200"
              >
                <User className="size-5 transition-transform data-[state=active]:scale-110" />
                <span className="text-xs">{t('profile')}</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}