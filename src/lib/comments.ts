import fs from 'fs/promises';
import path from 'path';

const COMMENTS_DIR = path.join(process.cwd(), 'data', 'comments');

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isAdmin: boolean;
}

async function ensureDir() {
  try {
    await fs.access(COMMENTS_DIR);
  } catch {
    await fs.mkdir(COMMENTS_DIR, { recursive: true });
  }
}

export async function getComments(slug: string): Promise<Comment[]> {
  await ensureDir();
  const filePath = path.join(COMMENTS_DIR, `${slug}.json`);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveComment(slug: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
  await ensureDir();
  const filePath = path.join(COMMENTS_DIR, `${slug}.json`);
  const comments = await getComments(slug);

  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);
  await fs.writeFile(filePath, JSON.stringify(comments, null, 2));
  return newComment;
}

export async function deleteComment(slug: string, commentId: string): Promise<void> {
  await ensureDir();
  const filePath = path.join(COMMENTS_DIR, `${slug}.json`);
  const comments = await getComments(slug);
  
  const filtered = comments.filter(c => c.id !== commentId);
  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
}
