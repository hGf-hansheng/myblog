"use client";

import Link from 'next/link';
import { Home, Grid, Plus, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export function GlassNavbarClient({ isAuth }: { isAuth: boolean }) {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-auto">
      <div className={cn(
        "flex items-center gap-1 p-2",
        "bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-xl",
        "border border-black/5 dark:border-white/5",
        "rounded-full shadow-sm shadow-black/5"
      )}>
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
        >
          <Home size={16} />
          <span className="hidden sm:inline">{t('home')}</span>
        </Link>

        <Link 
          href="/categories" 
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
        >
          <Grid size={16} />
          <span className="hidden sm:inline">{t('categories')}</span>
        </Link>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Toggle Language"
        >
          <Globe size={16} />
          <span className="text-xs font-bold uppercase">{language}</span>
        </button>

        <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />

        {isAuth ? (
          <Link 
            href="/new"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">{t('newPost')}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Admin Login"
          >
            <Lock size={14} />
          </Link>
        )}
      </div>
    </nav>
  );
}
