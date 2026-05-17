'use client';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

export default function DaySelector() {
  const { currentDay, setDay, getDayCompletion } = useApp();
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 px-1" dir="ltr">
      {Array.from({ length: 10 }, (_, i) => i + 1).map(day => {
        const active = day === currentDay;
        const comp = getDayCompletion(day);
        return (
          <motion.button key={day} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setDay(day)}
            className={`relative flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${active ? 'bg-primary-600/30 border border-primary-500/30' : 'hover:bg-primary-700/20'}`}>
            {active && <motion.div layoutId="day-sel" className="absolute inset-0 rounded-xl bg-primary-600/20 border border-gold-500/20" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span className={`relative z-10 text-[10px] font-medium ${active ? 'text-gold-400' : 'text-sand-500'}`}>
              {day === 9 ? '' : day === 10 ? '' : 'يوم'}
            </span>
            <span className={`relative z-10 text-sm font-bold ${active ? 'text-sand-100' : 'text-sand-300'}`}>{day}</span>
            {comp > 0 && <div className={`relative z-10 w-1.5 h-1.5 rounded-full ${comp >= 80 ? 'bg-gold-400' : comp >= 50 ? 'bg-primary-400' : 'bg-primary-700'}`} />}
          </motion.button>
        );
      })}
    </div>
  );
}
