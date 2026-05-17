-- ===== RAFIQ AL-ASHR DATABASE SCHEMA =====
-- Run this in Supabase SQL Editor

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits tracking
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 10),
  habit_type TEXT NOT NULL, -- prayers, quran, dhikr, sadaqah, fasting, dua
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day, habit_type)
);

-- Daily task completion
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 10),
  task_index INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day, task_index)
);

-- Duas organizer
CREATE TABLE IF NOT EXISTS public.duas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community reflections
CREATE TABLE IF NOT EXISTS public.reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT 'grateful',
  is_anonymous BOOLEAN DEFAULT FALSE,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reflection likes
CREATE TABLE IF NOT EXISTS public.reflection_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reflection_id UUID REFERENCES public.reflections(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reflection_id)
);

-- Saved reflections
CREATE TABLE IF NOT EXISTS public.reflection_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reflection_id UUID REFERENCES public.reflections(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reflection_id)
);

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reflection_id UUID REFERENCES public.reflections(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_habits_user_day ON public.habits(user_id, day);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_day ON public.daily_tasks(user_id, day);
CREATE INDEX IF NOT EXISTS idx_duas_user ON public.duas(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_created ON public.reflections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflection_likes_reflection ON public.reflection_likes(reflection_id);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflection_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflection_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Habits: users manage own habits
CREATE POLICY "Users manage own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- Daily tasks: users manage own tasks
CREATE POLICY "Users manage own tasks" ON public.daily_tasks FOR ALL USING (auth.uid() = user_id);

-- Duas: users manage own duas
CREATE POLICY "Users manage own duas" ON public.duas FOR ALL USING (auth.uid() = user_id);

-- Reflections: anyone can read, users manage own
CREATE POLICY "Anyone can read reflections" ON public.reflections FOR SELECT USING (true);
CREATE POLICY "Users manage own reflections" ON public.reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own reflections" ON public.reflections FOR DELETE USING (auth.uid() = user_id);

-- Likes: anyone can read, users manage own
CREATE POLICY "Anyone can read likes" ON public.reflection_likes FOR SELECT USING (true);
CREATE POLICY "Users manage own likes" ON public.reflection_likes FOR ALL USING (auth.uid() = user_id);

-- Saves: users manage own
CREATE POLICY "Users manage own saves" ON public.reflection_saves FOR ALL USING (auth.uid() = user_id);

-- Reports: users can create
CREATE POLICY "Users can report" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
