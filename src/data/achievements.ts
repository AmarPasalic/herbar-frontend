import { Achievement, Level, PointsRule } from '../types/achievement';

export const allAchievements: Achievement[] = [
  {
    id: 'first-step',
    name: 'Prvi korak',
    description: 'Prva fotografirana biljka',
    icon: '🌿',
    points: 10,
    unlocked: true,
    unlockedAt: new Date('2024-10-15')
  },
  {
    id: 'botanist',
    name: 'Botaničar',
    description: '50 različitih vrsta',
    icon: '🏆',
    points: 200,
    unlocked: false
  },
  {
    id: 'explorer',
    name: 'Istraživač',
    description: 'Fotografirano u 10+ lokacija',
    icon: '📍',
    points: 150,
    unlocked: false
  },
  {
    id: 'spring-hunter',
    name: 'Proljetni lovac',
    description: '20 proljetnih biljaka',
    icon: '🌸',
    points: 100,
    unlocked: false
  },
  {
    id: 'mountaineer',
    name: 'Planinac',
    description: 'Fotografirano iznad 800m nadmorske visine',
    icon: '⛰️',
    points: 150,
    unlocked: false
  }
];

export const levels: Level[] = [
  {
    level: 1,
    name: 'Početnik',
    minPoints: 0,
    maxPoints: 100
  },
  {
    level: 2,
    name: 'Istraživač',
    minPoints: 101,
    maxPoints: 300
  },
  {
    level: 3,
    name: 'Botaničar',
    minPoints: 301,
    maxPoints: 600
  },
  {
    level: 4,
    name: 'Ekolog',
    minPoints: 601,
    maxPoints: 1000
  },
  {
    level: 5,
    name: 'Prirodnjak',
    minPoints: 1000,
    maxPoints: Infinity
  }
];

export const pointsRules: PointsRule[] = [
  {
    action: 'basic-photo',
    points: 10,
    description: 'Osnovno fotografiranje'
  },
  {
    action: 'new-species-student',
    points: 50,
    description: 'Nova vrsta za učenika'
  },
  {
    action: 'rare-species',
    points: 100,
    description: 'Rijetka vrsta'
  }
];

export function getCurrentLevel(points: number): Level {
  return levels.find(level => 
    points >= level.minPoints && points <= level.maxPoints
  ) || levels[0];
}

export function getNextLevel(currentLevel: number): Level | null {
  return levels.find(level => level.level === currentLevel + 1) || null;
}

export function getProgressToNextLevel(points: number, currentLevel: Level, nextLevel: Level | null): number {
  if (!nextLevel) return 100;
  
  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
  
  return Math.min(100, (pointsInCurrentLevel / pointsNeededForNextLevel) * 100);
}
