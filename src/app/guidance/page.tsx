'use client';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, BookOpen, Shield, Repeat } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { dailyGuidance } from '@/lib/content';
import DaySelector from '@/components/DaySelector';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function GuidancePage() {
  const { currentDay, setDay, isTaskCompleted, toggleTask } = useApp();
  const g = dailyGuidance[currentDay - 1];

  return (
    <div className="page-wrapper relative">
      <div className="bg-orb w-80 h-80 bg-primary-500/20 top-10 left-0" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sand-500 text-xs uppercase tracking-wider">الإرشاد اليومي</p>
              <h1 className="text-2xl font-bold text-sand-50 mt-1">{g.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDay(currentDay + 1)} disabled={currentDay >= 10} className="p-2 rounded-lg glass-card-light disabled:opacity-30"><ChevronRight size={18} className="text-sand-300" /></motion.button>
              <span className="text-gold-400 font-bold text-lg min-w-[2.5rem] text-center">{currentDay}</span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDay(currentDay - 1)} disabled={currentDay <= 1} className="p-2 rounded-lg glass-card-light disabled:opacity-30"><ChevronLeft size={18} className="text-sand-300" /></motion.button>
            </div>
          </div>
          <DaySelector />
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card p-5 gold-glow text-center">
          <p className="text-gold-400/80 text-base mb-1">﴿{g.verse.arabic}﴾</p>
          <p className="text-sand-600 text-xs">{g.verse.reference}</p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="glass-card p-5">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-primary-400" />
            <h2 className="text-sand-200 font-semibold text-base">أهداف العبادة اليوم</h2>
          </motion.div>
          <div className="space-y-3">
            {g.worship.map((task, i) => {
              const done = isTaskCompleted(currentDay, i);
              return (
                <motion.label key={i} variants={fadeUp} whileHover={{ x: -4 }} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="habit-checkbox" checked={done} onChange={() => toggleTask(currentDay, i)} />
                  <span className={`text-sm leading-relaxed transition-all ${done ? 'text-sand-500 line-through' : 'text-sand-200 group-hover:text-sand-100'}`}>{task}</span>
                </motion.label>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 border-r-2 border-gold-500/30">
          <div className="flex items-center gap-2 mb-3"><Shield size={18} className="text-gold-400" /><h2 className="text-sand-200 font-semibold text-base">احمِ يومك</h2></div>
          <p className="text-sand-400 text-sm leading-relaxed">{g.avoid}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3"><Repeat size={18} className="text-primary-400" /><h2 className="text-sand-200 font-semibold text-base">ذكر اليوم</h2></div>
          <div className="glass-card-light p-4 text-center space-y-2">
            <p className="text-gold-400 text-2xl leading-loose">{g.dhikr.arabic}</p>
            {g.dhikr.count > 0 && <p className="text-sand-400 text-sm">{g.dhikr.count} مرة</p>}
            <p className="text-sand-600 text-xs">{g.dhikr.source}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5 text-center">
          <span className="text-2xl mb-2 block"></span>
          <h2 className="text-sand-200 font-semibold text-base mb-2">تذكير اليوم</h2>
          <p className="text-sand-400 text-sm leading-relaxed max-w-md mx-auto">{g.reminder}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h2 className="text-sand-200 font-semibold text-base mb-3 text-center"> دعاء اليوم</h2>
          <div className="glass-card-light p-5 text-center space-y-3">
            <p className="text-gold-300 text-xl leading-relaxed">{g.dua.arabic}</p>
            {g.dua.source && <p className="text-sand-500 text-xs">{g.dua.source}</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
