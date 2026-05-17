import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navigation from "@/components/Navigation";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "رفيق العشر - رفيقك الروحي في ذي الحجة",
  description: "تطبيق روحي يرافقك في العشر الأوائل من ذي الحجة - تتبّع العبادات، نظّم أدعيتك، واستعدّ ليوم عرفة بسكينة وطمأنينة.",
  keywords: ["ذي الحجة", "عرفة", "أدعية", "عبادات", "إسلام", "رمضان"],
  openGraph: {
    title: "رفيق العشر - رفيقك الروحي في ذي الحجة",
    description: "رفيق رقمي هادئ يساعد المسلمين على التقرّب من الله في الأيام المباركة",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-cairo)]">
        <AppProvider>
          <main className="md:mr-20 lg:mr-64 transition-all duration-300 flex-1">
            {children}
          </main>
          <Navigation />
        </AppProvider>
      </body>
    </html>
  );
}
