'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || (!isLogin && !name.trim())) return;
    
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { data: { full_name: name } } 
        });
        if (error) throw error;
        // Proceed to login or show success message
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden bg-dark">
      {/* Background orbs */}
      <div className="bg-orb w-[500px] h-[500px] bg-primary-600/10 -top-40 -right-40" />
      <div className="bg-orb w-[400px] h-[400px] bg-gold-500/10 -bottom-20 -left-20" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-900/50">
            <span className="text-white text-3xl font-bold font-arabic">ر</span>
          </div>
          <h1 className="text-3xl font-bold text-sand-50 mb-2 font-arabic">رفيق العشر</h1>
          <p className="text-sand-400 text-sm">سجّل دخولك لمزامنة عباداتك وأدعيتك</p>
        </div>

        <div className="glass-card p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                {!isLogin && (
                  <>
                    <label className="block text-sand-300 text-sm font-medium mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      placeholder="اكتب اسمك هنا..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field bg-dark-surface/50 focus:bg-dark-surface mb-5"
                      required={!isLogin}
                    />
                  </>
                )}

                <label className="block text-sand-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
                <div className="relative flex items-center mb-5">
                  <input 
                    type="email" 
                    dir="ltr"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field text-left font-mono tracking-wider bg-dark-surface/50 focus:bg-dark-surface"
                    required
                  />
                </div>

                <label className="block text-sand-300 text-sm font-medium mb-2">كلمة المرور</label>
                <div className="relative flex items-center">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500 z-10">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    dir="ltr"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10 text-left font-mono tracking-wider bg-dark-surface/50 focus:bg-dark-surface"
                    required
                  />
                </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 p-3 rounded-xl border border-red-500/20 mb-4">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

              <button 
                type="submit" 
                disabled={isLoading || !email || !password || (!isLogin && !name.trim())}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                ) : (
                  <>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'} <ArrowRight size={18} /></>
                )}
              </button>

              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sand-400 hover:text-gold-400 text-sm transition-colors"
                >
                  {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً جديداً مجاناً' : 'لديك حساب بالفعل؟ سجّل دخولك'}
                </button>
              </div>

              <p className="text-center text-xs text-sand-500 mt-4 leading-relaxed">
                بالمتابعة، أنت توافق على <Link href="#" className="text-gold-400 hover:underline">الشروط والأحكام</Link>
              </p>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
