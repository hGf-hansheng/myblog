import { getPostBySlug, getPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Comments } from '@/components/Comments';
import { Edit } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { getComments } from '@/lib/comments';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const isAuth = await isAuthenticated();
  const comments = await getComments(slug);

  if (!post) {
    notFound();
  }

  const mdxOptions = {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            keepBackground: true,
            onVisitLine(node: any) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }];
              }
            },
          },
        ],
      ],
    },
  };

  return (
    <main>
      <div className="flex justify-between items-center mb-8">
        <Link 
          href="/" 
          className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        >
          ← Back to posts
        </Link>
        {isAuth && (
          <Link
            href={`/edit/${slug}`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Edit size={14} />
            Edit Post
          </Link>
        )}
      </div>

      <article>
        <header className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
            <time dateTime={post.date}>
              {format(parseISO(post.date), 'MMMM d, yyyy')}
            </time>
            <span>•</span>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none prose-lg prose-headings:font-serif prose-p:font-sans prose-p:leading-relaxed prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-white/10">
          {/* @ts-expect-error Server Component Async Issues */}
          <MDXRemote source={post.content} options={mdxOptions} />
        </div>

        <Comments slug={slug} initialComments={comments} isAdmin={isAuth} />
      </article>
    </main>
  );
}
