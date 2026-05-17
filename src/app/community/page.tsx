'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Send, Flag, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { moodTags, sampleReflections, reflectionPrompts, communityGuidelines } from '@/lib/content';
import { generateId, timeAgo, getRandomItem, isContentSafe } from '@/lib/hijri';

export default function CommunityPage() {
  const { reflections, addReflection, toggleReflectionLike, toggleBookmark, isBookmarked } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [text, setText] = useState('');
  const [mood, setMood] = useState('grateful');
  const [anon, setAnon] = useState(false);
  const [err, setErr] = useState('');

  const all = useMemo(() => [...reflections, ...sampleReflections].sort((a, b) => b.timestamp - a.timestamp), [reflections]);
  const prompt = useMemo(() => getRandomItem(reflectionPrompts), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!isContentSafe(text)) { setErr('يرجى الالتزام بإرشادات المجتمع 💚'); return; }
    addReflection({ id: generateId(), text: text.trim(), mood, timestamp: Date.now(), likes: 0, liked: false, isAnonymous: anon, author: anon ? 'مجهول' : 'أنت' });
    setText(''); setMood('grateful'); setErr(''); setShowForm(false);
  };

  return (
    <div className="page-wrapper relative">
      <div className="bg-orb w-72 h-72 bg-primary-500/15 top-0 left-0" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-6">
        <div><p className="text-sand-500 text-xs uppercase tracking-wider">المجتمع</p>
          <h1 className="text-2xl font-bold text-sand-50">تأمّلات 🕊️</h1>
          <p className="text-sand-400 text-sm">مساحة هادئة لمشاركة أفكارك في الأيام المباركة.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 text-center gold-glow">
          <p className="text-gold-300 text-sm italic">"{prompt}"</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(!showForm)} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <MessageCircle size={16} /> شارك تأمّلاً
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowGuide(!showGuide)} className="p-3 rounded-xl glass-card-light text-sand-400 hover:text-sand-300"><Flag size={16} /></motion.button>
        </div>

        <AnimatePresence>
          {showGuide && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card p-5 overflow-hidden">
              <h3 className="text-sand-200 font-semibold text-base mb-3">إرشادات المجتمع 💚</h3>
              <ul className="space-y-2">{communityGuidelines.map((g, i) => <li key={i} className="flex items-start gap-2 text-sand-400 text-sm"><span className="text-primary-400 mt-0.5">•</span>{g}</li>)}</ul>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={submit} className="glass-card p-5 space-y-4 overflow-hidden">
              <textarea value={text} onChange={e => { setText(e.target.value); setErr(''); }} placeholder="شارك فكرة أو تأمّلاً أو لحظة امتنان..." className="input-field min-h-[100px] resize-y" maxLength={500} required />
              {err && <p className="text-red-400 text-xs">{err}</p>}
              <div><p className="text-sand-400 text-xs mb-2">كيف تشعر؟</p>
                <div className="flex flex-wrap gap-2">
                  {moodTags.map(t => <button key={t.id} type="button" onClick={() => setMood(t.id)}
                    className={`mood-tag transition-all ${mood === t.id ? `${t.color} border border-primary-500/30` : 'bg-dark-surface/50 text-sand-400 hover:bg-primary-700/20'}`}>{t.emoji} {t.label}</button>)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} className="habit-checkbox !w-5 !h-5" /><span className="text-sand-400 text-sm">نشر مجهول</span></label>
                <span className="text-sand-600 text-xs">{text.length}/500</span>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-gold w-full flex items-center justify-center gap-2"><Send size={16} /> شارك التأمّل</motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {all.map((r, i) => {
            const m = moodTags.find(x => x.id === r.mood);
            const saved = isBookmarked(r.id);
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center"><span className="text-sm">{r.isAnonymous ? '🕊️' : '💚'}</span></div>
                    <div><p className="text-sand-300 text-xs font-medium">{r.author}</p><p className="text-sand-600 text-[10px]">{timeAgo(r.timestamp)}</p></div>
                  </div>
                  {m && <span className={`mood-tag ${m.color}`}>{m.emoji} {m.label}</span>}
                </div>
                <p className="text-sand-200 text-sm leading-relaxed">{r.text}</p>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-dark-border/30">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleReflectionLike(r.id)}
                    className={`flex items-center gap-1.5 text-xs ${('liked' in r && r.liked) ? 'text-gold-400' : 'text-sand-500 hover:text-gold-400'}`}>
                    <Heart size={14} fill={('liked' in r && r.liked) ? 'currentColor' : 'none'} /><span>{r.likes}</span>
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleBookmark(r.id)}
                    className={`flex items-center gap-1.5 text-xs ${saved ? 'text-gold-400' : 'text-sand-500 hover:text-gold-400'}`}>
                    <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} /><span>{saved ? 'محفوظ' : 'حفظ'}</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-sand-600 text-xs text-center py-6">مساحة رقمية هادئة للتأمّلات الصادقة في الأيام المباركة 🕊️</p>
      </div>
    </div>
  );
}
