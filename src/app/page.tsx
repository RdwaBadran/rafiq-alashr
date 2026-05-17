'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckSquare, Heart, Flame, Star } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { dailyGuidance, quotes } from '@/lib/content';
import { getRandomItem, getOrdinalAr } from '@/lib/hijri';
import CountdownTimer from '@/components/CountdownTimer';
import ProgressRing from '@/components/ProgressRing';
import DaySelector from '@/components/DaySelector';
import RandomDeed from '@/components/RandomDeed';
import { useMemo } from 'react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

export default function HomePage() {
  const { currentDay, getDayCompletion, getStreak, isTaskCompleted, toggleTask } = useApp();
  const g = dailyGuidance[currentDay - 1];
  const comp = getDayCompletion(currentDay);
  const streak = getStreak();
  const quote = useMemo(() => getRandomItem(quotes), [currentDay]);

  return (
    <div className="page-wrapper relative">
      <div className="bg-orb w-72 h-72 bg-primary-600/30 top-0 left-0" />
      <div className="bg-orb w-96 h-96 bg-gold-500/10 bottom-20 right-0" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-6">
        {/* Header */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="text-center space-y-2">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card-light">
            <Star size={14} className="text-gold-400" />
            <span className="text-xs text-sand-300 font-medium">اليوم {getOrdinalAr(currentDay)} من ذي الحجة</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-sand-50">{g.title}</motion.h1>
          <motion.p variants={fadeUp} className="text-sand-400 text-sm max-w-md mx-auto leading-relaxed">{g.reminder}</motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}><DaySelector /></motion.div>

        {/* Countdowns */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4"><CountdownTimer targetDay={9} label="حتى عرفة" compact /></div>
          <div className="glass-card p-4"><CountdownTimer targetDay={10} label="حتى العيد" compact /></div>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sand-200 font-semibold text-base mb-1">تقدّم اليوم</h3>
              <p className="text-sand-500 text-sm">
                {comp === 0 ? 'ابدأ رحلتك اليوم' : comp < 50 ? 'أنت في الطريق الصحيح!' : comp < 100 ? 'ماشاء الله! أوشكت!' : 'سبحان الله! أكملت الكل! 🌟'}
              </p>
              {streak > 0 && <div className="flex items-center gap-1.5 mt-2"><Flame size={14} className="text-gold-400" /><span className="text-gold-400 text-xs font-medium">{streak} أيام متتالية</span></div>}
            </div>
            <ProgressRing percentage={comp} size={72} strokeWidth={5} />
          </div>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sand-200 font-semibold text-base">أعمال اليوم المستحبة</h3>
            <Link href="/guidance" className="text-gold-400 text-xs flex items-center gap-1 hover:text-gold-300">المزيد <ArrowLeft size={12} /></Link>
          </div>
          <div className="space-y-3">
            {g.worship.map((task, i) => {
              const done = isTaskCompleted(currentDay, i);
              return (
                <motion.label key={i} whileHover={{ x: -4 }} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="habit-checkbox" checked={done} onChange={() => toggleTask(currentDay, i)} />
                  <span className={`text-sm transition-all ${done ? 'text-sand-500 line-through' : 'text-sand-200 group-hover:text-sand-100'}`}>{task}</span>
                </motion.label>
              );
            })}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-5 gold-glow text-center">
          <p className="text-gold-300 text-sm italic leading-relaxed">"{quote}"</p>
        </motion.div>

        {/* Dhikr */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="glass-card p-5">
          <h3 className="text-sand-200 font-semibold text-base mb-3">ذكر اليوم</h3>
          <div className="text-center space-y-1">
            <p className="text-gold-400 text-2xl leading-relaxed">{g.dhikr.arabic}</p>
            {g.dhikr.count > 0 && <p className="text-sand-400 text-sm">{g.dhikr.count} مرة</p>}
            <p className="text-sand-600 text-xs">{g.dhikr.source}</p>
          </div>
        </motion.div>

        {/* Dua */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-5">
          <h3 className="text-sand-200 font-semibold text-base mb-3 text-center">🤲 دعاء اليوم</h3>
          <div className="glass-card-light p-4 text-center space-y-2">
            <p className="text-gold-300 text-xl leading-relaxed">{g.dua.arabic}</p>
            {g.dua.source && <p className="text-sand-500 text-xs">{g.dua.source}</p>}
          </div>
        </motion.div>

        {/* Avoid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="glass-card p-5 border-r-2 border-gold-500/30">
          <h3 className="text-sand-200 font-semibold text-base mb-2 flex items-center gap-2"><span className="text-lg">🛡️</span> تذكير لطيف</h3>
          <p className="text-sand-400 text-sm leading-relaxed">{g.avoid}</p>
        </motion.div>

        {/* Verse */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="text-center py-4">
          <p className="text-gold-400/70 text-base mb-1">﴿{g.verse.arabic}﴾</p>
          <p className="text-sand-600 text-xs">{g.verse.reference}</p>
        </motion.div>

        {/* Quick Access */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }} className="grid grid-cols-3 gap-3">
          {[
            { href: '/guidance', icon: BookOpen, label: 'الإرشاد', color: 'from-primary-600 to-primary-700' },
            { href: '/habits', icon: CheckSquare, label: 'العبادات', color: 'from-primary-700 to-primary-800' },
            { href: '/duas', icon: Heart, label: 'أدعيتي', color: 'from-gold-600/80 to-gold-700/80' },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link key={href} href={href}>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className={`bg-gradient-to-br ${color} p-4 rounded-xl text-center space-y-2 border border-white/5`}>
                <Icon size={22} className="mx-auto text-sand-200" />
                <p className="text-sand-200 text-xs font-medium">{label}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}><RandomDeed /></motion.div>
      </div>
    </div>
  );
}
