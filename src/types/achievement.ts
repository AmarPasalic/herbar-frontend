export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Level {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
}

export interface PointsRule {
  action: string;
  points: number;
  description: string;
}
