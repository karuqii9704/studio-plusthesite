export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface TourStep {
  targetId: string;
  title: string;
  desc: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface CalendarItem {
  day: number;
  title: string;
  category: string;
  desc: string;
}

export interface KOL {
  id: string;
  name: string;
  handle: string;
  category: string;
  /** ERD v2: numeric columns (legacy text followers/er dropped). */
  followers_int: number | null;
  er_num: number | null;
  price: number;
  tags: string[];
  verified: boolean;
}

export interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
  tag?: string;
  color: string;
}

export interface ClassItem {
  id: number;
  title: string;
  mentor: string;
  role: string;
  date: string;
  time: string;
  rating: number;
  students: number;
  price: string;
  image: string;
}

export interface AnalysisResult {
  score: number;
  hook: string;
  fit: string;
  format: string;
  improvements: string;
}

export interface VoiceFormFields {
  name: string;
  industry: string;
  market: string;
  idea: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
}

export interface FAQItem {
  q: string;
  a: string;
}