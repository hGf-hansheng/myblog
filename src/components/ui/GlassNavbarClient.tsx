"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Home, Grid, Plus, Globe, Lock, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface GlassNavbarClientProps {
  isAuth: boolean;
  categories: string[];
}

export function GlassNavbarClient({ isAuth, categories }: GlassNavbarClientProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw]">
      <div className={cn(
        "flex items-center gap-1 p-2",
        "bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-xl",
        "border border-black/5 dark:border-white/5",
        "rounded-full shadow-sm shadow-black/5"
      )}>
        <Link 
          href="/" 
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
        >
          <Home size={16} />
          <span className="hidden sm:inline">{t('home')}</span>
        </Link>

        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link 
            href="/categories" 
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Grid size={16} />
            <span className="hidden sm:inline">{t('categories')}</span>
            <ChevronDown size={14} className={cn("hidden sm:block transition-transform duration-200", isHovered && "rotate-180")} />
          </Link>

          {/* Dropdown Menu Wrapper with Bridge */}
          <div className={cn(
            "absolute top-full left-0 pt-4 w-48", // pt-4 creates invisible bridge
            "transition-all duration-200 origin-top-left",
            isHovered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}>
            <div className={cn(
              "py-1 rounded-xl overflow-hidden",
              "bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl",
              "border border-black/5 dark:border-white/5",
              "shadow-lg shadow-black/10"
            )}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories?category=${encodeURIComponent(category)}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    {category}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500 italic">
                  {language === 'en' ? 'No categories' : '暂无分类'}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Toggle Language"
        >
          <Globe size={16} />
          <span className="text-xs font-bold uppercase">{language}</span>
        </button>

        <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />

        {isAuth ? (
          <>
            <Link 
              href="/new"
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-all shadow-sm active:scale-95"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">{t('newPost')}</span>
            </Link>
            <a 
              href="/api/logout"
              className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </a>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Admin Login"
          >
            <Lock size={14} />
          </Link>
        )}
      </div>
    </nav>
  );
}
