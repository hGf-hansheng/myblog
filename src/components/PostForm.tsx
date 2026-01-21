"use client";

import { createPost, updatePost } from '@/app/actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  const { t } = useLanguage();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
    >
      <Save size={18} />
      {pending 
        ? t('saving') 
        : (isEditing ? t('updatePost') : t('publishPost'))
      }
    </button>
  );
}

interface PostFormProps {
  initialData?: {
    title: string;
    slug: string;
    category: string;
    tags: string;
    description: string;
    content: string;
  };
  mode: 'create' | 'edit';
}

export function PostForm({ initialData, mode }: PostFormProps) {
  const { t } = useLanguage();
  const isEditing = mode === 'edit';
  const action = isEditing ? updatePost : createPost;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-10">
        <Link 
          href={isEditing ? `/posts/${initialData?.slug}` : "/"} 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {isEditing ? t('backToPosts') : t('backToHome')}
        </Link>
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
          {isEditing ? t('editPostTitle') : t('writePost')}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {isEditing ? t('editPostDesc') : t('writePostDesc')}
        </p>
      </div>

      <form action={action} className="space-y-8">
        {isEditing && <input type="hidden" name="originalSlug" value={initialData?.slug} />}
        
        {/* Metadata Section */}
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
          <h2 className="text-lg font-serif font-semibold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            {t('metadata')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('title')}</label>
              <input 
                name="title"
                type="text"
                required
                defaultValue={initialData?.title}
                placeholder="The Art of Clean Code"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-serif text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('category')}</label>
              <input 
                name="category"
                type="text"
                required
                defaultValue={initialData?.category}
                placeholder="Engineering"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('slug')}</label>
              <input 
                name="slug"
                type="text"
                defaultValue={initialData?.slug}
                placeholder="custom-url-slug"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono text-sm"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('tags')}</label>
              <input 
                name="tags"
                type="text"
                defaultValue={initialData?.tags}
                placeholder="react, typescript, design"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('description')}</label>
              <textarea 
                name="description"
                rows={3}
                required
                defaultValue={initialData?.description}
                placeholder="A brief summary..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
          <h2 className="text-lg font-serif font-semibold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            {t('content')}
          </h2>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('mdxBody')}</label>
          <textarea 
            name="content"
            required
            defaultValue={initialData?.content}
            placeholder="# Introduction\n\nStart writing..."
            className="w-full px-4 py-4 min-h-[400px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono text-sm leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton isEditing={isEditing} />
        </div>
      </form>
    </div>
  );
}
