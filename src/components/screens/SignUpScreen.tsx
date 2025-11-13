import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Leaf, Eye, EyeOff, Loader2, WifiOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner@2.0.3';

interface SignUpScreenProps {
  onSignUp: (name: string, email: string, grade: string, school: string) => void;
  onNavigateToLogin: () => void;
}

export function SignUpScreen({ onSignUp, onNavigateToLogin }: SignUpScreenProps) {
  const { signup, isOfflineMode } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !grade || !school || !password || !confirmPassword) {
      setError('Molimo popunite sva polja');
      return;
    }

    if (!email.includes('@')) {
      setError('Molimo unesite validan email');
      return;
    }

    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju');
      return;
    }

    setIsLoading(true);
    
    try {
      await signup(email, password, name, grade, school);
      
      // Spremi dodatne informacije u localStorage (ime, odjeljenje, škola)
      localStorage.setItem('user_profile', JSON.stringify({
        name,
        grade,
        school,
      }));
      
      toast.success('Uspješna registracija', {
        description: 'Dobrodošli u Digitalni Herbarijum!',
        icon: '🌿',
      });
      
      onSignUp(name, email, grade, school);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Greška pri registraciji';
      setError(errorMessage);
      toast.error('Greška', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6 animate-in fade-in duration-500 py-12">
      <Card className="w-full max-w-md p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-700 my-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-green-600 rounded-full p-3">
              <Leaf className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-green-900">Digitalni Herbarijum</h1>
          <p className="text-muted-foreground">
            Kreirajte svoj nalog
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime i prezime</Label>
            <Input
              id="name"
              type="text"
              placeholder="Marko Marković"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email adresa</Label>
            <Input
              id="email"
              type="email"
              placeholder="ime@primjer.ba"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Odjeljenje</Label>
            <Input
              id="grade"
              type="text"
              placeholder="npr. 8-A"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">Škola</Label>
            <Input
              id="school"
              type="text"
              placeholder="npr. JU OŠ Hrasnica"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Najmanje 6 karaktera"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potvrdite lozinku</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ponovite lozinku"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Registrujem...
              </>
            ) : (
              'Registrujte se'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">
              Već imate nalog?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          onClick={onNavigateToLogin}
          disabled={isLoading}
        >
          Prijavite se
        </Button>

        {/* Info */}
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-xs text-green-900 text-center">
            Registracijom dobijate pristup svim funkcijama i gamifikaciji sistema
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Digitalni Herbarijum v1.0.0
        </div>
        
        {/* Server Info */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-900 text-center">
            <strong>Napomena:</strong> Potrebno je da backend server radi na <code className="bg-amber-100 px-1 py-0.5 rounded">localhost:3001</code>
          </p>
        </div>
        
        {/* Offline Mode Info */}
        {isOfflineMode && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-xs text-red-600 text-center">
              <WifiOff className="size-4 inline-block mr-1" />
              Ne možete se registrovati jer je backend server nedostupan
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}