'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { learnContent, avoidItems } from '@/lib/content';
import RandomDeed from '@/components/RandomDeed';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function LearnPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedAvoid, setExpandedAvoid] = useState<number | null>(null);
  const [tab, setTab] = useState<'learn' | 'avoid'>('learn');

  return (
    <div className="page-wrapper relative">
      <div className="bg-orb w-80 h-80 bg-primary-600/15 top-0 left-0" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-6">
        <div><p className="text-sand-500 text-xs uppercase tracking-wider">المعرفة</p>
          <h1 className="text-2xl font-bold text-sand-50 mt-1">تعلّم وانمُ ✨</h1>
          <p className="text-sand-400 text-sm mt-1">معرفة بسيطة وسهلة لهذه الأيام المباركة.</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab('learn')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'learn' ? 'bg-primary-600/30 text-gold-400 border border-primary-500/30' : 'text-sand-400 hover:bg-primary-700/20'}`}>📚 تعلّم</button>
          <button onClick={() => setTab('avoid')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'avoid' ? 'bg-primary-600/30 text-gold-400 border border-primary-500/30' : 'text-sand-400 hover:bg-primary-700/20'}`}>🛡️ تجنّب</button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'learn' && (
            <motion.div key="learn" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-3">
              {learnContent.map(item => {
                const isExp = expanded === item.id;
                return (
                  <motion.div key={item.id} variants={fadeUp} className="glass-card overflow-hidden">
                    <button onClick={() => setExpanded(isExp ? null : item.id)} className="w-full p-5 text-right flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div><span className="text-primary-400 text-[10px] uppercase tracking-wider font-medium">{item.category}</span>
                            <h3 className="text-sand-200 font-semibold text-base mt-0.5">{item.title}</h3></div>
                          <motion.div animate={{ rotate: isExp ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={18} className="text-sand-500 flex-shrink-0" /></motion.div>
                        </div>
                      </div>
                    </button>
                    <AnimatePresence>{isExp && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5 pr-16"><p className="text-sand-400 text-sm leading-relaxed">{item.content}</p></div>
                      </motion.div>
                    )}</AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          {tab === 'avoid' && (
            <motion.div key="avoid" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-3">
              <motion.div variants={fadeUp} className="glass-card p-5 text-center border-r-2 border-gold-500/30">
                <p className="text-sand-400 text-sm leading-relaxed">تذكيرات لطيفة لحماية طاقتك الروحية. بدون إحراج — فقط وعي وبدائل عملية 💚</p>
              </motion.div>
              {avoidItems.map((item, idx) => {
                const isExp = expandedAvoid === idx;
                return (
                  <motion.div key={idx} variants={fadeUp} className="glass-card overflow-hidden">
                    <button onClick={() => setExpandedAvoid(isExp ? null : idx)} className="w-full p-5 text-right flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sand-200 font-semibold text-base">{item.title}</h3>
                          <motion.div animate={{ rotate: isExp ? 180 : 0 }}><ChevronDown size={18} className="text-sand-500" /></motion.div>
                        </div>
                        <p className="text-sand-500 text-xs mt-1 line-clamp-1">{item.description}</p>
                      </div>
                    </button>
                    <AnimatePresence>{isExp && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5 pr-16 space-y-3">
                          <p className="text-sand-400 text-sm leading-relaxed">{item.description}</p>
                          <div className="glass-card-light p-3"><p className="text-xs text-primary-400 font-medium mb-1">💡 جرّب هذا بدلاً من ذلك:</p>
                            <p className="text-sand-300 text-sm leading-relaxed">{item.alternative}</p></div>
                        </div>
                      </motion.div>
                    )}</AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <RandomDeed />
      </div>
    </div>
  );
}
