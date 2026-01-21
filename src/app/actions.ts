'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveComment, deleteComment as removeComment } from '@/lib/comments';
import { isAuthenticated } from '@/lib/auth';

export async function addComment(slug: string, content: string) {
  // Public comments allowed
  // const isAuth = await isAuthenticated(); 
  
  if (!content || !content.trim()) {
    throw new Error('Comment cannot be empty');
  }

  const isAuth = await isAuthenticated();

  await saveComment(slug, {
    content: content.trim(),
    author: isAuth ? 'Admin' : 'Visitor',
    isAdmin: isAuth,
  });

  revalidatePath(`/posts/${slug}`);
}

export async function deleteCommentAction(slug: string, commentId: string) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    throw new Error('Unauthorized');
  }

  await removeComment(slug, commentId);
  revalidatePath(`/posts/${slug}`);
}

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const tagsStr = formData.get('tags') as string;
  const content = formData.get('content') as string;
  
  // Basic validation
  if (!title || !content) {
    throw new Error('Title and Content are required');
  }

  // Generate slug
  let slug = formData.get('slug') as string;
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  } else {
    // Sanitize custom slug just in case
    slug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Format tags
  const tags = tagsStr
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `"${t}"`)
    .join(', ');

  const date = new Date().toISOString().split('T')[0];

  const mdxContent = `---
title: "${title}"
date: "${date}"
category: "${category}"
description: "${description}"
tags: [${tags}]
---

${content}`;

  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`);

  try {
    await fs.writeFile(filePath, mdxContent, 'utf-8');
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('Failed to save post');
  }

  revalidatePath('/');
  redirect('/');
}

export async function updatePost(formData: FormData) {
  const originalSlug = formData.get('originalSlug') as string;
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const tagsStr = formData.get('tags') as string;
  const content = formData.get('content') as string;
  const slug = formData.get('slug') as string;
  
  // Basic validation
  if (!title || !content) {
    throw new Error('Title and Content are required');
  }

  // Format tags
  const tags = tagsStr
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `"${t}"`)
    .join(', ');

  // Read original file to keep date
  const originalPath = path.join(process.cwd(), 'content', 'posts', `${originalSlug}.mdx`);
  let date = new Date().toISOString().split('T')[0];
  
  try {
    const fileContent = await fs.readFile(originalPath, 'utf8');
    const match = fileContent.match(/date: "(.*?)"/);
    if (match) {
      date = match[1];
    }
  } catch (error) {
    console.warn('Could not read original file date, using today.');
  }

  const mdxContent = `---
title: "${title}"
date: "${date}"
category: "${category}"
description: "${description}"
tags: [${tags}]
---

${content}`;

  const newPath = path.join(process.cwd(), 'content', 'posts', `${slug}.mdx`);

  try {
    // If slug changed, delete old file
    if (originalSlug && originalSlug !== slug) {
      await fs.unlink(originalPath);
    }
    await fs.writeFile(newPath, mdxContent, 'utf-8');
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }

  revalidatePath('/');
  revalidatePath(`/posts/${slug}`);
  redirect(`/posts/${slug}`);
}
