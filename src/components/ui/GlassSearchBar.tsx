"use client";

import { Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface GlassSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function GlassSearchBar({ value, onChange }: GlassSearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="relative group w-full max-w-md mx-auto mb-6 sm:mb-8 md:mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-gray-400 text-gray-800 dark:text-gray-200"
        />
        <div className="hidden sm:block absolute right-3 px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-md text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5">
          ⌘K
        </div>
      </div>
    </div>
  );
}
