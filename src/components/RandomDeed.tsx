'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Sparkles } from 'lucide-react';
import { randomDeeds } from '@/lib/content';
import { getRandomItem } from '@/lib/hijri';

export default function RandomDeedGenerator() {
  const [deed, setDeed] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const generate = () => {
    setShow(false);
    setTimeout(() => { setDeed(getRandomItem(randomDeeds)); setShow(true); }, 200);
  };

  return (
    <div className="glass-card p-6 text-center">
      <Sparkles className="w-6 h-6 text-gold-400 mx-auto mb-2" />
      <h3 className="text-sand-200 font-semibold text-lg">لا تعرف ماذا تفعل؟</h3>
      <p className="text-sand-500 text-sm mt-1">دعنا نقترح لك شيئًا صغيرًا وجميلًا</p>
      <AnimatePresence mode="wait">
        {show && deed && (
          <motion.div key={deed} initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }} className="glass-card-light p-5 my-4">
            <p className="text-sand-100 text-base leading-relaxed font-medium">{deed}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={generate} className="btn-gold inline-flex items-center gap-2">
        <Shuffle size={16} />
        {show ? 'اقتراح آخر' : 'لا أعرف ماذا أفعل الآن'}
      </motion.button>
    </div>
  );
}
