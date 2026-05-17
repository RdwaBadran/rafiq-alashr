'use client';
import { motion } from 'framer-motion';

export default function ProgressRing({ percentage, size = 80, strokeWidth = 6, children }: {
  percentage: number; size?: number; strokeWidth?: number; children?: React.ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = r * 2 * Math.PI;
  const offset = circ - (percentage / 100) * circ;
  const color = percentage >= 80 ? '#c9a84c' : percentage >= 50 ? '#55a474' : '#254a34';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(45,90,61,0.2)" strokeWidth={strokeWidth} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || <span className="text-sm font-bold text-sand-200">{percentage}%</span>}
      </div>
    </div>
  );
}
