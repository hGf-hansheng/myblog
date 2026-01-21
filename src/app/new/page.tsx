'use client';

import { PostForm } from '@/components/PostForm';

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#1C1C1E] text-gray-900 dark:text-gray-100">
      <PostForm mode="create" />
    </main>
  );
}
