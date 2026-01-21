import { PostForm } from '@/components/PostForm';
import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const initialData = {
    title: post.title,
    slug: post.slug,
    category: post.category,
    tags: post.tags.join(', '),
    description: post.description,
    content: post.content.split('---').slice(2).join('---').trim(), // Remove frontmatter
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1C1C1E] text-gray-900 dark:text-gray-100">
      <PostForm initialData={initialData} mode="edit" />
    </main>
  );
}
