"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";

interface DeletePostButtonProps {
  slug: string;
}

export function DeletePostButton({ slug }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const handleDelete = () => {
    setIsModalOpen(false);
    startTransition(async () => {
      try {
        const result = await deletePost(slug);
        
        if (result.error) {
          error(result.error);
          return;
        }

        success("Post deleted successfully");
        // Wait a bit for the toast to be seen, then redirect
        setTimeout(() => {
          router.push("/");
        }, 1000);
        
      } catch (err) {
        console.error("Failed to delete post:", err);
        error("An unexpected error occurred");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <Trash2 size={14} />
        {isPending ? "Deleting..." : "Delete Post"}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Post"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
