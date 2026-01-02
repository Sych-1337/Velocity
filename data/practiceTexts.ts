
import { TextItem, DifficultyLevel } from '../types';

const generateMockContent = (title: string, topic: string) => {
  return `This protocol focuses on ${title}. In the realm of ${topic}, practitioners often encounter complex patterns that require rapid neural processing. Speed reading isn't just about moving eyes faster; it's about shifting the cognitive load from subvocalization to direct visual-semantic mapping. When you engage with ${topic} data streams, your brain must categorize information hierarchically. The foundational concepts often lead to emergent properties that are only visible at higher reading velocities. By bypassing the inner voice, you unlock the ability to see the "architecture" of the argument rather than just the sequence of words. This specific training module is designed to push your WPM limits by utilizing familiar terminology in dense structural formats. Maintain your focus on the center pivot point and let the context bleed into your peripheral awareness. The speed of light is the limit, and your mind is the vessel.`;
};

const difficulties: DifficultyLevel[] = ['Apprentice', 'Competent', 'Skilled', 'Advanced', 'Expert', 'Master', 'Elite'];
const categories: any[] = ['philosophy', 'business', 'fiction', 'motivation', 'random', 'random', 'random'];

export const PRACTICE_TEXTS: TextItem[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `txt-${i + 1}`,
  title: [
    'Neural Plasticity 101', 'Stoic Foundations', 'Quantum Mechanics Intro', 
    'The Art of War: Modernized', 'Deep Work Principles', 'Financial Freedom',
    'The Hero’s Journey', 'Cybernetic Evolution', 'Minimalist Living', 
    'The Martian Chronicles', 'Beyond Good and Evil', 'Atomic Habits',
    'Flow State Mastery', 'The Silicon Valley Era', 'Space Exploration',
    'Ancient Rome', 'Biohacking Your Sleep', 'Digital Sovereignty',
    'The AI Revolution', 'Creative Confidence'
  ][i % 20] + ` (V${Math.floor(i/20) + 1})`,
  category: categories[i % categories.length],
  difficulty: difficulties[i % difficulties.length],
  length: i % 3 === 0 ? 'short' : i % 3 === 1 ? 'medium' : 'long',
  content: generateMockContent(
    `Training Session #${i + 1}`, 
    ['Science', 'Philosophy', 'Business', 'Literature', 'Technology'][i % 5]
  ),
  language: 'en',
  votes: Math.floor(Math.random() * 100),
  userVote: null
}));
