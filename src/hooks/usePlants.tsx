import { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from './useAuth';

export interface Plant {
  id: string;
  name: string;
  description: string;
  photoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export function usePlants() {
  const { token } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/plants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Greška pri učitavanju biljaka');
      }

      const data = await response.json();
      setPlants(data.plants || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching plants:', err);
      const errorMessage = err instanceof Error ? err.message : 'Greška pri učitavanju';
      setError(errorMessage);
      setPlants([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [token]);

  return {
    plants,
    isLoading,
    error,
    refetch: fetchPlants,
  };
}
