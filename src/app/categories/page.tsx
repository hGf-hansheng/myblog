import Link from 'next/link';
import { getPosts } from '@/lib/posts';
import { ArrowLeft } from 'lucide-react';
import { PostCard } from '@/components/ui/PostCard';

export default async function CategoriesPage() {
  const posts = await getPosts();
  
  // Group posts by category
  const categories: Record<string, number> = {};
  posts.forEach(post => {
    const cat = post.category || 'Uncategorized';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12">
      <header className="space-y-4 pt-6 sm:pt-10">
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100">
          Categories
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          Browse articles by topic.
        </p>
      </header>

      <div className="grid gap-6 sm:gap-8">
        {Object.entries(categories).map(([category, count]) => {
          const categoryPosts = posts.filter(p => (p.category || 'Uncategorized') === category);
          
          return (
            <section key={category} className="space-y-6">
              <div className="flex items-baseline gap-3 border-b border-gray-200 dark:border-white/10 pb-2">
                <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-gray-100">
                  {category}
                </h2>
                <span className="text-sm font-mono text-gray-400">
                  {count} {count === 1 ? 'post' : 'posts'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryPosts.map(post => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
