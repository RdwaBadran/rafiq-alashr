'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCountdown } from '@/lib/hijri';

export default function CountdownTimer({ targetDay, label, compact = false }: { targetDay: number; label: string; compact?: boolean }) {
  const [cd, setCd] = useState(getCountdown(targetDay));
  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown(targetDay)), 1000);
    return () => clearInterval(t);
  }, [targetDay]);

  if (cd.isPast) {
    return (
      <div className={`text-center ${compact ? '' : 'py-4'}`}>
        <p className="text-gold-400 font-medium text-sm">{label}</p>
        <p className="text-sand-200 text-lg font-semibold mt-1">اليوم! </p>
      </div>
    );
  }

  const units = [
    { v: cd.days, l: 'يوم' }, { v: cd.hours, l: 'ساعة' },
    { v: cd.minutes, l: 'دقيقة' }, { v: cd.seconds, l: 'ثانية' },
  ];

  if (compact) {
    return (
      <div className="text-center">
        <p className="text-sand-400 text-xs mb-1">{label}</p>
        <div className="flex items-center justify-center gap-1.5">
          {units.map(({ v, l }) => (
            <div key={l} className="flex items-center gap-0.5">
              <motion.span key={v} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="text-gold-400 font-bold text-sm tabular-nums">{String(v).padStart(2, '0')}</motion.span>
              <span className="text-sand-500 text-[10px]">{l[0]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sand-300 text-sm mb-3 font-medium">{label}</p>
      <div className="flex items-center justify-center gap-3">
        {units.map(({ v, l }, i) => (
          <div key={l} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="glass-card-light px-3 py-2 min-w-[3.5rem]">
                <motion.span key={v} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-bold text-gold-400 tabular-nums block text-center">{String(v).padStart(2, '0')}</motion.span>
              </div>
              <span className="text-sand-500 text-[10px] mt-1">{l}</span>
            </div>
            {i < units.length - 1 && <span className="text-sand-600 text-xl font-light mb-4 animate-pulse-soft">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
