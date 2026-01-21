"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PostMeta } from '@/lib/posts';
import { PostCard } from './ui/PostCard';
import { GlassSearchBar } from './ui/GlassSearchBar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export function PostList({ posts }: { posts: PostMeta[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  // Get params
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  
  const [search, setSearch] = useState(searchQuery);

  // Sync state with URL when URL changes (e.g. back button)
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);
  
  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [posts]);

  const handleCategoryClick = (cat: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set('category', cat);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (term: string) => {
    setSearch(term);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, selectedCategory]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search and Filter Section */}
      <div className="flex flex-col items-center gap-6">
        <GlassSearchBar value={search} onChange={handleSearchChange} />
        
        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              selectedCategory === null 
                ? "bg-gray-900 text-white shadow-lg shadow-black/10 dark:bg-white dark:text-black" 
                : "bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5"
            )}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "bg-gray-900 text-white shadow-lg shadow-black/10 dark:bg-white dark:text-black" 
                  : "bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

        {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 font-serif text-lg italic">{t('noPosts')}</p>
            <button 
              onClick={() => { 
                handleSearchChange(''); 
                handleCategoryClick(null); 
              }}
              className="mt-2 text-sm text-orange-600 hover:underline"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

