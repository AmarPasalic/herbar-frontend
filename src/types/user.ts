export interface User {
  id: string;
  name: string;
  grade: string; // odjeljenje (npr. "IX-2")
  school: string; // škola (npr. "Osnovna škola Hrasnica")
  email: string;
  profileImage?: string; // URL slike profila
  role: 'student' | 'teacher';
  points: number;
  level: number;
  unlockedAchievements: string[]; // IDs of unlocked achievements
}