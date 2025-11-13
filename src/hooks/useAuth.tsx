import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../config/api';

interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  grade?: string;
  department?: string;
  school?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string, grade?: string, school?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper funkcija za prijevod error poruka
const translateError = (error: string): string => {
  const errorMap: Record<string, string> = {
    'email is required': 'Email adresa je obavezna',
    'password is required': 'Lozinka je obavezna',
    'Email already in use': 'Email adresa je već registrovana',
    'Email in use': 'Email adresa je već registrovana',
    'email already exists': 'Email adresa je već registrovana',
    'Invalid email or password': 'Pogrešan email ili lozinka',
    'Invalid credentials': 'Pogrešan email ili lozinka',
    'User not found': 'Korisnik nije pronađen',
    'Network request failed': 'Greška u vezi sa internetom',
    'Failed to fetch': 'Nije moguće povezati se sa serverom. Provjerite internet konekciju.',
    'Internal server error': 'Greška na serveru',
    'Bad request': 'Neispravni podaci',
    'Unauthorized': 'Neovlašćeni pristup',
    'Method Not Allowed': 'Pogrešna metoda. Provjerite endpoint.'
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return error;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const safeParseJson = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: text || `${res.status} ${res.statusText}` };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeParseJson(response);

      if (!response.ok) {
        let msg = data.error || data.message || `${response.status} ${response.statusText}`;
        if (response.status === 404) msg = 'Endpoint nije pronađen (404).';
        if (response.status === 405) msg = 'Method Not Allowed';
        throw new Error(translateError(msg));
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      throw new Error(translateError(error.message || String(error)));
    }
  };

  const signup = async (email: string, password: string, name?: string, grade?: string, school?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName: name, department: grade, school }),
      });

      const data = await safeParseJson(response);

      if (!response.ok) {
        let msg = data.error || data.message || `${response.status} ${response.statusText}`;
        if (response.status === 404) msg = 'Endpoint nije pronađen (404).';
        if (response.status === 405) msg = 'Method Not Allowed';
        throw new Error(translateError(msg));
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      throw new Error(translateError(error.message || String(error)));
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { API_BASE_URL };