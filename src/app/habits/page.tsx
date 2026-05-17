'use client';
import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { habitCategories } from '@/lib/content';
import ProgressRing from '@/components/ProgressRing';
import DaySelector from '@/components/DaySelector';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };

export default function HabitsPage() {
  const { currentDay, toggleHabit, getHabitStatus, getDayCompletion, getStreak } = useApp();
  const comp = getDayCompletion(currentDay);
  const streak = getStreak();
  const overall = (() => {
    let t = 0, d = 0;
    for (let i = 1; i <= currentDay; i++) { t += habitCategories.length; habitCategories.forEach(h => { if (getHabitStatus(i, h.id)) d++; }); }
    return t > 0 ? Math.round((d / t) * 100) : 0;
  })();

  return (
    <div className="page-wrapper relative">
      <div className="bg-orb w-80 h-80 bg-primary-600/20 top-0 right-0" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-6">
        <div>
          <p className="text-sand-500 text-xs uppercase tracking-wider">متابعة العبادات</p>
          <h1 className="text-2xl font-bold text-sand-50 mt-1">رحلتك مع العبادة</h1>
          <p className="text-sand-400 text-sm mt-1">كل جهد صغير مرئيّ ومُكافأ 💚</p>
        </div>

        <DaySelector />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center"><ProgressRing percentage={comp} size={56} strokeWidth={4} /><p className="text-sand-500 text-xs mt-2">اليوم</p></div>
          <div className="glass-card p-4 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5"><Flame size={20} className="text-gold-400" /><span className="text-2xl font-bold text-gold-400">{streak}</span></div>
            <p className="text-sand-500 text-xs mt-1">أيام متتالية</p>
          </div>
          <div className="glass-card p-4 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5"><TrendingUp size={20} className="text-primary-400" /><span className="text-2xl font-bold text-primary-400">{overall}%</span></div>
            <p className="text-sand-500 text-xs mt-1">الإجمالي</p>
          </div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {habitCategories.map(h => {
            const done = getHabitStatus(currentDay, h.id);
            return (
              <motion.div key={h.id} variants={fadeUp} whileHover={{ scale: 1.01 }}
                className={`glass-card p-4 cursor-pointer transition-all ${done ? 'border-gold-500/30 gold-glow' : ''}`}
                onClick={() => toggleHabit(currentDay, h.id)}>
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="habit-checkbox" checked={done} readOnly />
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="text-lg">{h.emoji}</span>
                      <h3 className={`font-semibold text-sm ${done ? 'text-gold-400' : 'text-sand-200'}`}>{h.label}</h3>
                    </div>
                    <p className="text-sand-500 text-xs mt-0.5">{h.description}</p>
                  </div>
                  {done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gold-400 text-sm font-medium">✓ تمّ</motion.div>}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 10-Day Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sand-200 font-semibold text-base mb-4">نظرة شاملة — ١٠ أيام</h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => {
              const day = i + 1; const dc = getDayCompletion(day); const isCur = day === currentDay;
              return (
                <div key={day} className={`relative p-3 rounded-xl text-center ${isCur ? 'glass-card-light border border-gold-500/30' : 'bg-dark-surface/50'}`}>
                  <p className={`text-xs font-medium ${isCur ? 'text-gold-400' : 'text-sand-500'}`}>يوم {day}</p>
                  <div className="mt-1.5"><div className="w-full h-1.5 bg-dark-border/50 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${dc}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                      className={`h-full rounded-full ${dc >= 80 ? 'bg-gold-400' : dc >= 50 ? 'bg-primary-400' : dc > 0 ? 'bg-primary-600' : ''}`} />
                  </div></div>
                  <p className={`text-xs mt-1 ${dc >= 80 ? 'text-gold-400' : 'text-sand-600'}`}>{dc > 0 ? `${dc}%` : '—'}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center py-4">
          <p className="text-sand-500 text-sm italic">
            {comp >= 80 ? 'ماشاء الله! أداؤك رائع اليوم 🌟' : comp >= 50 ? 'تقدّم ممتاز! كل عمل يُحسب 💚' : comp > 0 ? 'بدأت — وهذا هو الأهم. واصل! 🌿' : 'خطوة بخطوة. حتى خانة واحدة هي انتصار 🤲'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
