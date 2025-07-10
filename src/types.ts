import { Icon as LucideIcon } from 'lucide-react';
import React from 'react';

export interface Stats {
  intelligence: number;
  willpower: number;
  stamina: number;
  charm: number;
}

export interface Streaks {
  diary: number;
  exercise: number;
  reading: number;
  study: number;
}

export interface User {
  name: string;
  level: number;
  experience: number;
  experienceToNext: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
  stats: Stats;
  titles: string[];
  streaks: Streaks;
}

export interface DailyQuest {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
  stat: keyof Stats;
  iconName: string;
  isAuthenticating?: boolean; // 인증 중 상태
  isAuthenticated?: boolean; // 인증 완료 상태
  authXpReceived?: boolean; // 인증 XP 수령 여부
}

export interface Reward {
  type: 'quest';
  title: string;
  xp: number;
  stat: keyof Stats;
}

export interface TierColors {
  [key: string]: string;
}
