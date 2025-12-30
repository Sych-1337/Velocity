
import React from 'react';
import { TextItem, Achievement, Category } from './types';
import { Book, Zap, Target, Award, Brain, Rocket, Trophy, Flame, Users } from 'lucide-react';

export const INITIAL_TEXTS: TextItem[] = [
  // PHILOSOPHY
  {
    id: 'p1',
    title: 'The Stoic Mindset',
    category: 'philosophy',
    difficulty: 'medium',
    length: 'medium',
    content: "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control. Where then do I look for good and evil? Not to uncontrollable externals, but within myself to the choices that are my own."
  },
  {
    id: 'p2',
    title: 'The Cave Allegory',
    category: 'philosophy',
    difficulty: 'hard',
    length: 'long',
    content: "Imagine prisoners in a cave, chained since childhood. They see only shadows on the wall, thinking these are reality. When one is freed and sees the sun, he realizes the truth. This is the journey of the soul to the realm of intellect. Plato suggests that our perceived world is but a shadow of higher forms."
  },
  {
    id: 'p3',
    title: 'Existential Freedom',
    category: 'philosophy',
    difficulty: 'hard',
    length: 'medium',
    content: "Existence precedes essence. This means that man first of all exists, encounters himself, surges up in the world—and defines himself afterwards. If man as the existentialist sees him is not definable, it is because to begin with he is nothing. He will not be anything until later, and then he will be what he makes of himself."
  },
  {
    id: 'p4',
    title: 'The Golden Mean',
    category: 'philosophy',
    difficulty: 'medium',
    length: 'short',
    content: "Virtue is a state of character concerned with choice, lying in a mean. Aristotle argues that excellence is not an act but a habit. We are what we repeatedly do. Courage is the mean between cowardice and recklessness. Generosity is the mean between stinginess and wastefulness."
  },
  {
    id: 'p5',
    title: 'Beyond Good and Evil',
    category: 'philosophy',
    difficulty: 'hard',
    length: 'long',
    content: "He who fights with monsters should look to it that he himself does not become a monster. And if you gaze long into an abyss, the abyss also gazes into you. Nietzsche challenged traditional morality, suggesting that the will to power is the fundamental drive of human life and creativity."
  },

  // BUSINESS
  {
    id: 'b1',
    title: 'The Lean Startup Strategy',
    category: 'business',
    difficulty: 'hard',
    length: 'long',
    content: "A startup is a human institution designed to create a new product or service under conditions of extreme uncertainty. The goal of a startup is to figure out the right thing to build—the thing customers want and will pay for—as quickly as possible. This requires a process of validated learning through the Build-Measure-Learn feedback loop."
  },
  {
    id: 'b2',
    title: 'Zero to One',
    category: 'business',
    difficulty: 'medium',
    length: 'medium',
    content: "The next Bill Gates will not build an operating system. The next Larry Page or Sergey Brin won’t make a search engine. If you are copying these guys, you aren’t learning from them. It’s easier to copy a model than to make something new. Doing what we already know how to do takes the world from 1 to n, adding more of something familiar."
  },
  {
    id: 'b3',
    title: 'Marketing Warfare',
    category: 'business',
    difficulty: 'medium',
    length: 'short',
    content: "Marketing is like a game of chess. You must know your opponent's moves before they make them. The battlefield is the consumer's mind. Positioning is not what you do to a product; it's what you do to the mind of the prospect. You must find a niche and defend it with superior communication."
  },
  {
    id: 'b4',
    title: 'The Innovator\'s Dilemma',
    category: 'business',
    difficulty: 'hard',
    length: 'long',
    content: "Good companies can fail because they do everything right. They listen to customers, invest in high-performance products, and follow the data. But disruptive technology often starts as low-quality alternatives in small markets. By the time the incumbents realize the threat, the disruptor has improved enough to take the main market."
  },
  {
    id: 'b5',
    title: 'Blue Ocean Strategy',
    category: 'business',
    difficulty: 'medium',
    length: 'medium',
    content: "Don't compete in overcrowded red oceans where profits are shrinking. Create blue oceans of uncontested market space. Value innovation is the simultaneous pursuit of differentiation and low cost. By making the competition irrelevant, you can unlock new demand and grow exponentially without the bloody battle for market share."
  },

  // FICTION
  {
    id: 'f1',
    title: 'A Galaxy Far Away',
    category: 'fiction',
    difficulty: 'easy',
    length: 'short',
    content: "The stars twinkled like diamonds scattered across a velvet cloth. Captain Aris stood on the bridge of the Nebulous, staring into the void. Somewhere out there, the transmission was waiting. A message from a civilization that had supposedly vanished centuries ago. 'Prepare for jump,' Aris ordered."
  },
  {
    id: 'f2',
    title: 'The Clockwork City',
    category: 'fiction',
    difficulty: 'medium',
    length: 'long',
    content: "The gears of Aethelgard never stopped grinding. Above, the copper sun cast long, metallic shadows across the cobblestones. Elias adjusted his goggles, the steam from the vents dampening his face. He held the crystal shard tight. If the legends were true, this tiny piece of light could restart the Great Engine and save the city from the Cold Silence."
  },
  {
    id: 'f3',
    title: 'The Whispering Woods',
    category: 'fiction',
    difficulty: 'easy',
    length: 'medium',
    content: "Elara knew she shouldn't enter the woods after dusk. The trees didn't just sway; they spoke in a language of rustling leaves and creaking wood. 'Further,' they hissed. She followed the trail of glowing mushrooms, her heart thumping against her ribs. At the center of the clearing stood a deer with antlers made of pure moonlight."
  },
  {
    id: 'f4',
    title: 'Digital Horizon',
    category: 'fiction',
    difficulty: 'medium',
    length: 'medium',
    content: "In the year 2088, data was the only currency that mattered. Jax jacked into the neural net, his vision blurring into a stream of neon code. He was a Ghost—a hacker who didn't exist in the physical registries. His mission was simple: bypass the mainframe of the Orion Corp and release the memory files before the tracers found his uplink."
  },
  {
    id: 'f5',
    title: 'The Last Librarian',
    category: 'fiction',
    difficulty: 'medium',
    length: 'long',
    content: "Books were forbidden artifacts in the era of Total Stream. Thomas guarded the hidden vault, a sanctuary of paper and ink. He opened a worn copy of 'The Odyssey', the scent of old paper filling his lungs. 'They don't know what they've lost,' he whispered. Every page turned was a small act of rebellion against the digital amnesia of the world."
  },

  // MOTIVATION
  {
    id: 'm1',
    title: 'The Power of Habit',
    category: 'motivation',
    difficulty: 'easy',
    length: 'medium',
    content: "Habits are the compound interest of self-improvement. Small changes in your daily routine can lead to massive results over time. The cue, the routine, and the reward form a loop that governs our behavior. To change a habit, you must keep the old cue and reward but insert a new, healthier routine."
  },
  {
    id: 'm2',
    title: 'Grit and Perseverance',
    category: 'motivation',
    difficulty: 'medium',
    length: 'short',
    content: "Talent is overrated. Grit is the passion and persistence for long-term goals. It's about falling down seven times and getting up eight. Success isn't a sprint; it's a marathon. Those who succeed are not always the smartest, but the ones who refuse to quit when things get difficult."
  },
  {
    id: 'm3',
    title: 'The Flow State',
    category: 'motivation',
    difficulty: 'medium',
    length: 'medium',
    content: "Flow is the state of total immersion in an activity. Time seems to disappear, and your skills are perfectly matched to the challenge. To enter flow, you need clear goals, immediate feedback, and a balance between the difficulty of the task and your ability. It is in flow that we find our greatest happiness and productivity."
  },
  {
    id: 'm4',
    title: 'Mindset for Success',
    category: 'motivation',
    difficulty: 'easy',
    length: 'short',
    content: "Your beliefs about yourself determine your destiny. A fixed mindset believes traits are carved in stone, while a growth mindset believes abilities can be developed. View failures as opportunities to learn rather than evidence of stupidity. The word 'yet' is the most powerful tool in your vocabulary."
  },
  {
    id: 'm5',
    title: 'Atomic Progress',
    category: 'motivation',
    difficulty: 'easy',
    length: 'medium',
    content: "Don't focus on the goal; focus on the system. If you get 1% better every day, you will be 37 times better by the end of the year. Small, consistent actions beat large, occasional bursts of effort. Environment design is the secret to making good habits easy and bad habits impossible. Identity-based habits last forever."
  }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { id: '1', title: 'First Sprint', description: 'Read 1000 words without errors', icon: 'zap', isUnlocked: true },
  { id: '2', title: 'Sonic Reader', description: 'Reach 300 WPM with 80%+ accuracy', icon: 'rocket', isUnlocked: false },
  { id: '3', title: 'Deep Thinker', description: 'Complete 10 philosophy texts', icon: 'brain', isUnlocked: false },
  { id: '4', title: 'Consistent', description: 'Maintain a 7-day reading streak', icon: 'flame', isUnlocked: false }
];

// Added missing 'community' category icon
export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  philosophy: <Brain size={18} />,
  business: <Award size={18} />,
  fiction: <Book size={18} />,
  motivation: <Zap size={18} />,
  random: <Target size={18} />,
  custom: <Rocket size={18} />,
  community: <Users size={18} />
};
