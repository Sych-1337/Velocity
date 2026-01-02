
export type Category = 'philosophy' | 'business' | 'fiction' | 'motivation' | 'random' | 'custom' | 'community';

export type Language = 'en' | 'es' | 'ru' | 'uk';

export type DifficultyLevel = 
  | 'Noob' 
  | 'Rookie' 
  | 'Apprentice' 
  | 'Competent' 
  | 'Skilled' 
  | 'Advanced' 
  | 'Expert' 
  | 'Master' 
  | 'Elite' 
  | 'Legendary';

export interface TextItem {
  id: string;
  title: string;
  category: Category;
  content: string;
  difficulty: DifficultyLevel;
  length: 'short' | 'medium' | 'long';
  estimatedWpm?: number;
  author?: string;
  votes?: number;
  userVote?: 'up' | 'down' | null;
  language: Language;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface UserStats {
  bestWpm: number;
  averageWpm: number;
  totalWordsRead: number;
  comprehensionRate: number;
  level: PlayerLevel;
  experience: number;
  dailyStreak: number;
  accountLevel: number;
  language: Language;
  history: ReadingSession[];
  isPremium?: boolean;
  isStrictMode: boolean;
  hasSeenStrictModeWarning: boolean;
  idCode: string;
  friendCodes: string[];
  hasAcceptedCommunityRules: boolean;
}

export enum PlayerLevel {
  NOVICE = 'Novice',
  READER = 'Reader',
  SPEEDSTER = 'Speed Reader',
  MASTER = 'Master',
  LEGEND = 'Legend'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  dateUnlocked?: string;
}

export interface ReadingSession {
  textId: string;
  wpm: number;
  accuracy: number;
  score: number;
  timestamp: number;
  category: Category;
  isStrict?: boolean;
}
