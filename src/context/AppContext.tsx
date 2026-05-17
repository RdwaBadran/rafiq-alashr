'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { store } from '@/lib/store';
import { getDhulHijjahDay } from '@/lib/hijri';
import { habitCategories } from '@/lib/content';

interface Dua { id: string; text: string; title?: string; category: string; isFavorite: boolean; createdAt: number; }
interface Reflection { id: string; text: string; mood: string; timestamp: number; likes: number; liked?: boolean; isAnonymous: boolean; author: string; }

interface AppState {
  currentDay: number;
  setDay: (d: number) => void;
  habits: Record<number, Record<string, boolean>>;
  toggleHabit: (day: number, id: string) => void;
  getHabitStatus: (day: number, id: string) => boolean;
  getDayCompletion: (day: number) => number;
  getStreak: () => number;
  completedTasks: Record<number, number[]>;
  toggleTask: (day: number, idx: number) => void;
  isTaskCompleted: (day: number, idx: number) => boolean;
  duas: Dua[];
  addDua: (d: Dua) => void;
  updateDua: (id: string, u: Partial<Dua>) => void;
  deleteDua: (id: string) => void;
  toggleDuaFavorite: (id: string) => void;
  reflections: Reflection[];
  addReflection: (r: Reflection) => void;
  toggleReflectionLike: (id: string) => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentDay, setCurrentDay] = useState(1);
  const [habits, setHabits] = useState<Record<number, Record<string, boolean>>>({});
  const [duas, setDuas] = useState<Dua[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<number, number[]>>({});
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCurrentDay(getDhulHijjahDay());
    setHabits(store.get('habits', {}));
    setDuas(store.get('duas', []));
    setReflections(store.get('reflections', []));
    setBookmarks(store.get('bookmarks', []));
    setCompletedTasks(store.get('tasks', {}));
    setHydrated(true);
  }, []);

  // Persist changes
  useEffect(() => { if (hydrated) store.set('habits', habits); }, [habits, hydrated]);
  useEffect(() => { if (hydrated) store.set('duas', duas); }, [duas, hydrated]);
  useEffect(() => { if (hydrated) store.set('reflections', reflections); }, [reflections, hydrated]);
  useEffect(() => { if (hydrated) store.set('bookmarks', bookmarks); }, [bookmarks, hydrated]);
  useEffect(() => { if (hydrated) store.set('tasks', completedTasks); }, [completedTasks, hydrated]);

  const toggleHabit = useCallback((day: number, id: string) => {
    setHabits(p => ({ ...p, [day]: { ...p[day], [id]: !p[day]?.[id] } }));
  }, []);

  const getHabitStatus = useCallback((day: number, id: string) => habits[day]?.[id] || false, [habits]);

  const getDayCompletion = useCallback((day: number) => {
    if (!habits[day]) return 0;
    const total = habitCategories.length;
    const done = Object.values(habits[day]).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }, [habits]);

  const getStreak = useCallback(() => {
    let s = 0;
    for (let d = currentDay; d >= 1; d--) { if (getDayCompletion(d) >= 50) s++; else break; }
    return s;
  }, [currentDay, getDayCompletion]);

  const toggleTask = useCallback((day: number, idx: number) => {
    setCompletedTasks(p => {
      const arr = p[day] || [];
      return { ...p, [day]: arr.includes(idx) ? arr.filter(i => i !== idx) : [...arr, idx] };
    });
  }, []);

  const isTaskCompleted = useCallback((day: number, idx: number) => (completedTasks[day] || []).includes(idx), [completedTasks]);

  const addDua = useCallback((d: Dua) => setDuas(p => [d, ...p]), []);
  const updateDua = useCallback((id: string, u: Partial<Dua>) => setDuas(p => p.map(d => d.id === id ? { ...d, ...u } : d)), []);
  const deleteDua = useCallback((id: string) => setDuas(p => p.filter(d => d.id !== id)), []);
  const toggleDuaFavorite = useCallback((id: string) => setDuas(p => p.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)), []);

  const addReflection = useCallback((r: Reflection) => setReflections(p => [r, ...p]), []);
  const toggleReflectionLike = useCallback((id: string) => {
    setReflections(p => p.map(r => r.id === id ? { ...r, likes: r.liked ? r.likes - 1 : r.likes + 1, liked: !r.liked } : r));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(p => p.includes(id) ? p.filter(b => b !== id) : [...p, id]);
  }, []);
  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  const setDay = useCallback((d: number) => setCurrentDay(Math.max(1, Math.min(10, d))), []);

  return (
    <AppContext.Provider value={{
      currentDay, setDay, habits, toggleHabit, getHabitStatus, getDayCompletion, getStreak,
      completedTasks, toggleTask, isTaskCompleted,
      duas, addDua, updateDua, deleteDua, toggleDuaFavorite,
      reflections, addReflection, toggleReflectionLike,
      bookmarks, toggleBookmark, isBookmarked,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
