import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';
import type { PostMeta } from '@/lib/posts';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <article className="relative h-full flex flex-col p-5 sm:p-6 md:p-8 rounded-2xl bg-white dark:bg-[#2C2C2E] border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        
        {/* Category & Date */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            {post.category}
          </span>
          <time className="text-xs text-gray-400 font-mono">
            {format(parseISO(post.date), 'MMMM d, yyyy')}
          </time>
        </div>
        
        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {post.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-4 sm:mb-6 md:mb-8 flex-grow">
          {post.description}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5 mt-auto">
          <div className="flex gap-2">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </article>
    </Link>
  );
}
