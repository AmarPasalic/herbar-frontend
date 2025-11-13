import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Leaf, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner@2.0.3';

interface LoginScreenProps {
  onLogin: (email: string) => void;
  onNavigateToSignUp: () => void;
}

export function LoginScreen({ onLogin, onNavigateToSignUp }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Molimo unesite email i lozinku');
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

    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Uspješna prijava', {
        description: 'Dobrodošli nazad!',
        icon: '🌿',
      });
      onLogin(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Greška pri prijavi';
      setError(errorMessage);
      toast.error('Greška', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
      <Card className="w-full max-w-md p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-green-600 rounded-full p-3">
              <Leaf className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-green-900">Eko Explorer</h1>
          <p className="text-muted-foreground">
            Prijavite se na svoj nalog
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="password">Lozinka</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Unesite lozinku"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Prijavljujem...
              </>
            ) : (
              'Prijavite se'
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
              Nemate nalog?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          onClick={onNavigateToSignUp}
          disabled={isLoading}
        >
          Registrujte se
        </Button>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Digitalni Herbarijum v1.0.0
        </div>
        
        {/* Server Info */}
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
          <p className="text-xs text-green-900 dark:text-green-200 text-center">
            <strong>✅ Backend povezan!</strong><br />
            <code className="bg-green-100 dark:bg-green-900 px-1 py-0.5 rounded text-[10px]">
              Vercel Production
            </code>
          </p>
        </div>
      </Card>
    </div>
  );
}