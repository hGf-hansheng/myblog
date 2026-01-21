import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compareDesc, parseISO, format } from 'date-fns';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  tags: string[];
  content: string; // Raw MDX
};

export type PostMeta = Omit<Post, 'content'>;

export async function getPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      category: data.category || 'General',
      description: data.description || '',
      tags: data.tags || [],
    } as PostMeta;
  });

  return allPostsData.sort((a, b) => {
    return compareDesc(parseISO(a.date), parseISO(b.date));
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category || 'General',
    description: data.description || '',
    tags: data.tags || [],
    content,
  };
}
