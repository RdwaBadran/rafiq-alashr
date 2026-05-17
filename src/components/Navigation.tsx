'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, CheckSquare, Heart, Users, Sparkles, UserCircle } from 'lucide-react';

const items = [
  { path: '/', icon: Home, label: 'الرئيسية' },
  { path: '/guidance', icon: BookOpen, label: 'اليومي' },
  { path: '/habits', icon: CheckSquare, label: 'العبادات' },
  { path: '/duas', icon: Heart, label: 'الأدعية' },
  { path: '/community', icon: Users, label: 'تأمّلات' },
  { path: '/learn', icon: Sparkles, label: 'تعلّم' },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden">
        <div className="glass-card rounded-none border-x-0 border-b-0 px-2 py-1">
          <div className="flex items-center justify-around">
            {items.map(({ path, icon: Icon, label }) => {
              const active = pathname === path;
              return (
                <Link key={path} href={path} className="relative flex flex-col items-center gap-0.5 py-2 px-3">
                  <motion.div whileTap={{ scale: 0.9 }} className="relative">
                    {active && (
                      <motion.div layoutId="mob-nav" className="absolute -inset-2 rounded-xl bg-primary-600/20"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                    )}
                    <Icon size={20} className={`relative z-10 transition-colors ${active ? 'text-gold-400' : 'text-sand-400'}`} />
                  </motion.div>
                  <span className={`text-[10px] font-medium ${active ? 'text-gold-400' : 'text-sand-500'}`}>{label}</span>
                </Link>
              );
            })}
            <Link href="/login" className={`flex flex-col items-center gap-0.5 py-2 px-3 ${pathname === '/login' ? 'text-gold-400' : 'text-sand-400'}`}>
              <UserCircle size={20} />
              <span className="text-[10px] font-medium">حسابي</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Desktop sidebar (RTL: right side) */}
      <nav className="hidden md:flex fixed right-0 top-0 bottom-0 z-50 w-20 lg:w-64 flex-col">
        <div className="glass-card rounded-none border-y-0 border-r-0 h-full flex flex-col py-8 px-3 lg:px-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-bold">ر</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-sand-100">رفيق العشر</h1>
              <p className="text-xs text-sand-500">رفيقك في ذي الحجة</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            {items.map(({ path, icon: Icon, label }) => {
              const active = pathname === path;
              return (
                <Link key={path} href={path}
                  className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${active ? 'text-gold-400' : 'text-sand-400 hover:text-sand-200 hover:bg-primary-700/20'}`}>
                  {active && (
                    <motion.div layoutId="desk-nav" className="absolute inset-0 rounded-xl bg-primary-600/20 border border-primary-500/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                  <Icon size={20} className="relative z-10 flex-shrink-0" />
                  <span className="relative z-10 hidden lg:block text-sm font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-auto px-2">
            <Link href="/login" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sand-400 hover:text-gold-400 hover:bg-gold-500/10 transition-all">
              <UserCircle size={20} />
              <span className="hidden lg:block text-sm font-medium">تسجيل الدخول</span>
            </Link>
            <p className="hidden lg:block text-xs text-sand-600 text-center mt-4">بسم الله الرحمن الرحيم</p>
          </div>
        </div>
      </nav>
    </>
  );
}
