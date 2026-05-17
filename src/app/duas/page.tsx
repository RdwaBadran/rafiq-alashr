'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Star, Trash2, Edit3, X, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { duaCategories } from '@/lib/content';
import { generateId } from '@/lib/hijri';

export default function DuasPage() {
  const { duas, addDua, updateDua, deleteDua, toggleDuaFavorite } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [favsOnly, setFavsOnly] = useState(false);
  const [form, setForm] = useState({ text: '', title: '', category: 'deen' });

  const reset = () => { setForm({ text: '', title: '', category: 'deen' }); setEditId(null); setShowForm(false); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    if (editId) { updateDua(editId, form); } else { addDua({ id: generateId(), ...form, isFavorite: false, createdAt: Date.now() }); }
    reset();
  };
  const startEdit = (d: typeof duas[0]) => { setEditId(d.id); setForm({ text: d.text, title: d.title || '', category: d.category }); setShowForm(true); };

  const filtered = useMemo(() => duas.filter(d => {
    const ms = !search || d.text.includes(search) || (d.title && d.title.includes(search));
    const mc = cat === 'all' || d.category === cat;
    const mf = !favsOnly || d.isFavorite;
    return ms && mc && mf;
  }), [duas, search, cat, favsOnly]);

  return (
    <div className="page-wrapper relative">
      <div className="bg-orb w-80 h-80 bg-gold-500/10 top-0 left-0" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-8 space-y-6">
        <div>
          <p className="text-sand-500 text-xs uppercase tracking-wider">منظّم أدعية عرفة</p>
          <h1 className="text-2xl font-bold text-sand-50 mt-1">أدعيتك </h1>
          <p className="text-sand-400 text-sm mt-1">جهّز قلبك ليوم عرفة. اكتب أدعيتك بصدق.</p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500" />
            <input type="text" placeholder="ابحث في أدعيتك..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pr-10" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button onClick={() => setCat('all')} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cat === 'all' ? 'bg-primary-600/30 text-gold-400 border border-primary-500/30' : 'text-sand-400 hover:bg-primary-700/20'}`}>الكل</button>
            {duaCategories.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${cat === c.id ? 'bg-primary-600/30 text-gold-400 border border-primary-500/30' : 'text-sand-400 hover:bg-primary-700/20'}`}>
                <span>{c.emoji}</span><span className="hidden sm:inline">{c.label}</span>
              </button>
            ))}
            <button onClick={() => setFavsOnly(!favsOnly)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${favsOnly ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-sand-400 hover:bg-primary-700/20'}`}>
              <Star size={12} /> المفضّلة
            </button>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { reset(); setShowForm(true); }} className="btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={18} /> أضف دعاءً جديدًا
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={submit} className="glass-card p-5 space-y-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-sand-200 font-semibold">{editId ? 'تعديل الدعاء' : 'اكتب دعاءك'}</h3>
                <button type="button" onClick={reset} className="text-sand-500 hover:text-sand-300"><X size={18} /></button>
              </div>
              <input type="text" placeholder="العنوان (اختياري)" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" />
              <textarea placeholder="اكتب دعاءك هنا... افتح قلبك لله " value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} className="input-field min-h-[120px] resize-y" required />
              <div>
                <p className="text-sand-400 text-xs mb-2">التصنيف</p>
                <div className="flex flex-wrap gap-2">
                  {duaCategories.map(c => (
                    <button key={c.id} type="button" onClick={() => setForm(p => ({ ...p, category: c.id }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.category === c.id ? 'bg-primary-600/30 text-gold-400 border border-primary-500/30' : 'text-sand-400 hover:bg-primary-700/20 border border-transparent'}`}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-gold w-full">{editId ? 'تحديث' : 'حفظ الدعاء'}</motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(d => {
              const c = duaCategories.find(x => x.id === d.category);
              return (
                <motion.div key={d.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className={`glass-card p-5 ${d.isFavorite ? 'border-gold-500/20 gold-glow' : ''}`}>
                  {c && <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mb-3 bg-primary-700/30 text-sand-300">{c.emoji} {c.label}</div>}
                  {d.title && <h3 className="text-sand-200 font-semibold text-base mb-1">{d.title}</h3>}
                  <p className="text-sand-300 text-sm leading-relaxed whitespace-pre-wrap">{d.text}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-border/30">
                    <div className="flex items-center gap-2">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleDuaFavorite(d.id)} className={`p-1.5 rounded-lg ${d.isFavorite ? 'text-gold-400' : 'text-sand-500 hover:text-gold-400'}`}><Star size={16} fill={d.isFavorite ? 'currentColor' : 'none'} /></motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => startEdit(d)} className="p-1.5 rounded-lg text-sand-500 hover:text-sand-300"><Edit3 size={16} /></motion.button>
                    </div>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteDua(d.id)} className="p-1.5 rounded-lg text-sand-600 hover:text-red-400"><Trash2 size={16} /></motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Heart size={40} className="mx-auto text-sand-600 mb-4" />
              <h3 className="text-sand-400 font-medium mb-1">{duas.length === 0 ? 'قائمة أدعيتك فارغة' : 'لا نتائج'}</h3>
              <p className="text-sand-600 text-sm">{duas.length === 0 ? 'ابدأ بكتابة أدعيتك ليوم عرفة. كل دعاء مهمّ ' : 'جرّب تعديل البحث أو الفلتر'}</p>
            </motion.div>
          )}
        </div>
        {duas.length > 0 && <p className="text-sand-500 text-sm italic text-center py-4">لديك {duas.length} دعاء جاهز ليوم عرفة. ماشاء الله! </p>}
      </div>
    </div>
  );
}
