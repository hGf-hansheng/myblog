import { getPosts } from '@/lib/posts';
import { PostList } from '@/components/PostList';
import { Suspense } from 'react';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="space-y-12">
      <header className="text-center space-y-6 pt-16 pb-8">
        <h1 className="text-5xl font-serif font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Sisyphus Blog
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-sans font-light leading-relaxed">
          Thoughts on software architecture, clean code, and the art of engineering.
        </p>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <PostList posts={posts} />
      </Suspense>
    </div>
  );
}
