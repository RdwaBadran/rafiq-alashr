'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, FileText, BarChart3, Settings, AlertTriangle } from 'lucide-react';

/** Admin panel - content management, report review, analytics overview */
export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'content' | 'reports' | 'users'>('overview');

  const stats = [
    { label: 'المستخدمون', value: '-', icon: Users, color: 'text-primary-400' },
    { label: 'التأمّلات', value: '-', icon: FileText, color: 'text-gold-400' },
    { label: 'البلاغات', value: '-', icon: AlertTriangle, color: 'text-red-400' },
    { label: 'الأدعية', value: '-', icon: BarChart3, color: 'text-sand-300' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: BarChart3 },
    { id: 'content' as const, label: 'المحتوى', icon: FileText },
    { id: 'reports' as const, label: 'البلاغات', icon: AlertTriangle },
    { id: 'users' as const, label: 'المستخدمون', icon: Users },
  ];

  return (
    <div className="page-wrapper relative">
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6 pb-8 space-y-6">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-gold-400" />
          <div>
            <h1 className="text-2xl font-bold text-sand-50">لوحة الإدارة</h1>
            <p className="text-sand-500 text-sm">إدارة المحتوى والمستخدمين والبلاغات</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-primary-600/30 text-gold-400 border border-primary-500/30' : 'text-sand-400 hover:bg-primary-700/20'}`}>
              <t.icon size={16} />{t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map(s => (
                <div key={s.label} className="glass-card p-4 text-center">
                  <s.icon size={20} className={`mx-auto mb-2 ${s.color}`} />
                  <p className="text-2xl font-bold text-sand-200">{s.value}</p>
                  <p className="text-sand-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="glass-card p-6 text-center">
              <Settings size={32} className="mx-auto text-sand-600 mb-3" />
              <h3 className="text-sand-300 font-semibold mb-2">قريبًا</h3>
              <p className="text-sand-500 text-sm max-w-md mx-auto">
                لوحة الإدارة الكاملة ستكون متاحة بعد ربط Supabase. ستتمكّن من إدارة المحتوى الإسلامي، مراجعة البلاغات، والاطلاع على الإحصائيات.
              </p>
            </div>
          </motion.div>
        )}

        {tab === 'content' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 text-center">
            <FileText size={32} className="mx-auto text-sand-600 mb-3" />
            <h3 className="text-sand-300 font-semibold mb-2">إدارة المحتوى الإسلامي</h3>
            <p className="text-sand-500 text-sm">تعديل الأذكار اليومية، الأدعية، والإرشادات. يتطلب ربط قاعدة البيانات.</p>
          </motion.div>
        )}

        {tab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 text-center">
            <AlertTriangle size={32} className="mx-auto text-sand-600 mb-3" />
            <h3 className="text-sand-300 font-semibold mb-2">مراجعة البلاغات</h3>
            <p className="text-sand-500 text-sm">لا توجد بلاغات حاليًا. ستظهر هنا عند ورود بلاغات من المستخدمين.</p>
          </motion.div>
        )}

        {tab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 text-center">
            <Users size={32} className="mx-auto text-sand-600 mb-3" />
            <h3 className="text-sand-300 font-semibold mb-2">إدارة المستخدمين</h3>
            <p className="text-sand-500 text-sm">عرض وإدارة حسابات المستخدمين. يتطلب ربط Supabase Auth.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
