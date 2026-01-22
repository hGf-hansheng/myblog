import Link from 'next/link';
import { getPosts } from '@/lib/posts';
import { ArrowLeft, X } from 'lucide-react';
import { PostCard } from '@/components/ui/PostCard';

interface CategoriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const posts = await getPosts();
  const params = await searchParams;
  const selectedCategory = params.category;
  
  // Group posts by category
  const categories: Record<string, number> = {};
  posts.forEach(post => {
    const cat = post.category || 'Uncategorized';
    // If a category is selected, only count posts for that category
    if (!selectedCategory || cat === selectedCategory) {
      categories[cat] = (categories[cat] || 0) + 1;
    }
  });

  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12">
      <header className="space-y-4 pt-6 sm:pt-10">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link>
          {selectedCategory && (
             <Link 
              href="/categories"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full"
            >
              Clear Filter
              <X size={14} className="ml-1" />
            </Link>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100">
          {selectedCategory ? `${selectedCategory}` : 'Categories'}
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          {selectedCategory 
            ? `Browsing articles in ${selectedCategory}` 
            : 'Browse articles by topic.'}
        </p>
      </header>

      <div className="grid gap-6 sm:gap-8">
        {Object.entries(categories).length > 0 ? (
          Object.entries(categories).map(([category, count]) => {
            const categoryPosts = posts.filter(p => (p.category || 'Uncategorized') === category);
            
            return (
              <section key={category} id={category} className="scroll-mt-24 space-y-6">
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
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts found in this category.</p>
            <Link href="/categories" className="text-orange-600 hover:underline mt-2 inline-block">
              View all categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
