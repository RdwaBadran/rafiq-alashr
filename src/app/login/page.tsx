'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+20');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const countryCodes = [
    { code: '+20', label: 'مصر (+20)', flag: '🇪🇬' },
    { code: '+966', label: 'السعودية (+966)', flag: '🇸🇦' },
    { code: '+971', label: 'الإمارات (+971)', flag: '🇦🇪' },
    { code: '+965', label: 'الكويت (+965)', flag: '🇰🇼' },
    { code: '+974', label: 'قطر (+974)', flag: '🇶🇦' },
    { code: '+973', label: 'البحرين (+973)', flag: '🇧🇭' },
    { code: '+968', label: 'عُمان (+968)', flag: '🇴🇲' },
    { code: '+962', label: 'الأردن (+962)', flag: '🇯🇴' },
    { code: '+970', label: 'فلسطين (+970)', flag: '🇵🇸' },
    { code: '+212', label: 'المغرب (+212)', flag: '🇲🇦' },
    { code: '+213', label: 'الجزائر (+213)', flag: '🇩🇿' },
    { code: '+216', label: 'تونس (+216)', flag: '🇹🇳' },
    { code: '+249', label: 'السودان (+249)', flag: '🇸🇩' },
    { code: '+964', label: 'العراق (+964)', flag: '🇮🇶' },
    { code: '+961', label: 'لبنان (+961)', flag: '🇱🇧' },
    { code: '+963', label: 'سوريا (+963)', flag: '🇸🇾' },
    { code: '+967', label: 'اليمن (+967)', flag: '🇾🇪' },
    { code: '+218', label: 'ليبيا (+218)', flag: '🇱🇾' },
    { code: '+222', label: 'موريتانيا (+222)', flag: '🇲🇷' },
    { code: '+252', label: 'الصومال (+252)', flag: '🇸🇴' },
    { code: '+1', label: 'أمريكا/كندا (+1)', flag: '🇺🇸' },
    { code: '+44', label: 'بريطانيا (+44)', flag: '🇬🇧' },
  ];

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 8 || !name.trim()) return;
    setIsLoading(true);
    // Mock network request
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsLoading(true);
    // Mock network request
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 1500);
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
            {step === 'phone' ? (
              <motion.form 
                key="phone-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePhoneSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sand-300 text-sm font-medium mb-2">الاسم الكامل</label>
                  <input 
                    type="text" 
                    placeholder="اكتب اسمك هنا..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field bg-dark-surface/50 focus:bg-dark-surface mb-5"
                    required
                  />

                  <label className="block text-sand-300 text-sm font-medium mb-2">رقم الهاتف</label>
                  <div className="relative flex items-center">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500 z-10">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      dir="ltr"
                      placeholder="1X XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="input-field pr-10 pl-[110px] text-left font-mono tracking-wider bg-dark-surface/50 focus:bg-dark-surface"
                      required
                    />
                    <div className="absolute left-1 top-1 bottom-1 flex items-center">
                      <select 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-full bg-transparent text-sand-200 text-sm font-mono border-r border-dark-border pr-2 pl-2 focus:outline-none appearance-none cursor-pointer"
                        dir="ltr"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code} className="bg-dark text-sand-100">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="pointer-events-none absolute right-2 text-sand-500 text-xs">▼</div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || phone.length < 8 || !name.trim()}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  ) : (
                    <>المتابعة <ArrowRight size={18} /></>
                  )}
                </button>

                <p className="text-center text-xs text-sand-500 mt-4 leading-relaxed">
                  بتسجيل الدخول، أنت توافق على <Link href="#" className="text-gold-400 hover:underline">الشروط والأحكام</Link>
                </p>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleOtpSubmit}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <ShieldCheck size={40} className="mx-auto text-primary-400 mb-2" />
                  <h3 className="text-sand-100 font-semibold mb-1">رمز التحقق</h3>
                  <p className="text-sand-400 text-xs">أرسلنا رمزًا مكوّنًا من 6 أرقام إلى رقمك</p>
                  <p className="text-gold-400 text-sm font-mono mt-1" dir="ltr">{countryCode} {phone}</p>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500">
                      <Lock size={18} />
                    </div>
                    <input 
                      type="text" 
                      dir="ltr"
                      placeholder="• • • • • •"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="input-field pr-10 text-center font-mono tracking-[0.5em] text-lg bg-dark-surface/50 focus:bg-dark-surface"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || otp.length !== 6}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-sand-50/30 border-t-sand-50 rounded-full animate-spin" />
                  ) : (
                    'تأكيد وتسجيل الدخول'
                  )}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-sand-500 hover:text-sand-300 text-xs mt-2 transition-colors"
                >
                  تعديل رقم الهاتف
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
