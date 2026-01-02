
import React from 'react';
import { TextItem, Achievement, Category } from './types';
import { 
  Book, Zap, Target, Award, Brain, Rocket, Trophy, Flame, Users, 
  Crown, Cpu, Globe, Star, ShieldCheck, Heart, Moon, Sun, 
  BookOpen, Coffee, Gauge, Pencil
} from 'lucide-react';

export const ICON_MAP: Record<string, any> = {
  award: Award,
  zap: Zap,
  rocket: Rocket,
  brain: Brain,
  flame: Flame,
  gauge: Gauge,
  cpu: Cpu,
  book: Book,
  bookOpen: BookOpen,
  star: Star,
  sun: Sun,
  moon: Moon,
  coffee: Coffee,
  target: Target,
  shieldCheck: ShieldCheck,
  crown: Crown,
  globe: Globe,
  users: Users,
  heart: Heart,
  trophy: Trophy,
  pencil: Pencil
};

export const GLOBAL_LEADERS = [
    { id: 'u1', name: 'SpeedDemon', points: 42100, wpm: 850, avatar: 'SD', code: '12345', level: 12 },
    { id: 'u2', name: 'LibraryGhost', points: 38500, wpm: 720, avatar: 'LG', code: '54321', level: 8 },
    { id: 'u3', name: 'ReadFastDieYoung', points: 35000, wpm: 910, avatar: 'RF', code: '99887', level: 15 },
    { id: 'u4', name: 'BookWorm99', points: 29800, wpm: 540, avatar: 'BW', code: '11223', level: 5 },
    { id: 'u5', name: 'FastThinker', points: 25000, wpm: 600, avatar: 'FT', code: '44556', level: 7 },
    { id: 'u6', name: 'NeuroHacker', points: 50000, wpm: 1200, avatar: 'NH', code: '00001', level: 25 }
];

export const INITIAL_TEXTS: TextItem[] = [
  {
    id: 'p1',
    title: 'The Stoic Mindset',
    category: 'philosophy',
    difficulty: 'Apprentice',
    length: 'medium',
    language: 'en',
    content: "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control. Where then do I look for good and evil? Not to uncontrollable externals, but within myself to the choices that are my own. Epictetus taught that we should never be surprised by the behavior of others or the occurrence of natural events, as these are outside our sphere of influence. By focusing exclusively on our own judgments and actions, we attain a state of 'ataraxia' or tranquility. This inner fortress remains unshakeable regardless of the storms raging outside. Stoicism is not about suppressing emotions but about transforming them through reason. When we realize that our suffering stems from our perceptions rather than events themselves, we reclaim our power. Life is short, and our attention is our most valuable asset. To waste it on the trivialities of others' opinions or the cruelty of fortune is the only true tragedy. Stand tall, act with virtue, and accept the rest with indifference."
  }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { id: '1', title: 'First Sprint', description: 'Read 1,000 words without errors', icon: 'zap', isUnlocked: true },
  { id: '2', title: 'Sonic Reader', description: 'Reach 300 WPM with 80%+ accuracy', icon: 'rocket', isUnlocked: true },
  { id: '3', title: 'Deep Thinker', description: 'Complete 10 philosophy texts', icon: 'brain', isUnlocked: true },
  { id: '4', title: 'Consistent', description: 'Maintain a 7-day reading streak', icon: 'flame', isUnlocked: false },
  { id: '5', title: 'Night Owl', description: 'Complete a session after midnight', icon: 'moon', isUnlocked: true },
  { id: '6', title: 'Caffeine Rush', description: 'Read 3 texts in 15 minutes', icon: 'coffee', isUnlocked: false },
  { id: '7', title: 'Speed Demon', description: 'Hit 800 WPM in any protocol', icon: 'gauge', isUnlocked: false },
  { id: '8', title: 'Data Devourer', description: 'Read a total of 50,000 words', icon: 'cpu', isUnlocked: false },
  { id: '9', title: 'Globalist', description: 'Read texts in 3 different languages', icon: 'globe', isUnlocked: false },
  { id: '10', title: 'Perfect Vision', description: '100% accuracy on an Elite text', icon: 'target', isUnlocked: false },
  { id: '11', title: 'Legacy Builder', description: 'Earn 10,000 total XP', icon: 'trophy', isUnlocked: false },
  { id: '12', title: 'Library Ghost', description: 'Read for 2 hours straight', icon: 'bookOpen', isUnlocked: false },
  { id: '13', title: 'Early Bird', description: 'Train before 7:00 AM', icon: 'sun', isUnlocked: false },
  { id: '14', title: 'Social Speedster', description: 'Add 5 friends to your squad', icon: 'users', isUnlocked: true },
  { id: '15', title: 'Neural Architect', description: 'Complete all Skills categories', icon: 'shieldCheck', isUnlocked: false },
  { id: '16', title: 'Golden Heart', description: 'Upvote 20 community protocols', icon: 'heart', isUnlocked: true },
  { id: '17', title: 'Philosopher', description: 'Master the Philosophy category', icon: 'crown', isUnlocked: false },
  { id: '18', title: 'Sprint Legend', description: 'Maintain 500 WPM for 10 mins', icon: 'star', isUnlocked: false },
  { id: '19', title: 'Author', description: 'Publish your first community text', icon: 'pencil', isUnlocked: false },
  { id: '20', title: 'Unstoppable', description: '30-day training streak', icon: 'flame', isUnlocked: false },
  { id: '21', title: 'Mach One', description: 'Reach 1200 WPM speed', icon: 'zap', isUnlocked: false },
  { id: '22', title: 'Scholar', description: 'Unlock 50 library protocols', icon: 'book', isUnlocked: false },
  { id: '23', title: 'Elite Mind', description: 'Complete 5 Legendary protocols', icon: 'award', isUnlocked: false },
  { id: '24', title: 'The Chosen One', description: 'Reach Player Level 100', icon: 'crown', isUnlocked: false }
];

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  philosophy: <Brain size={18} />,
  business: <Award size={18} />,
  fiction: <Book size={18} />,
  motivation: <Zap size={18} />,
  random: <Target size={18} />,
  custom: <Rocket size={18} />,
  community: <Users size={18} />
};
