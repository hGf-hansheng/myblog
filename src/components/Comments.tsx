"use client";

import { useState, useTransition } from "react";
import { addComment, deleteCommentAction } from "@/app/actions";
import { useLanguage } from "@/context/LanguageContext";
import { Trash2, MessageSquare, User, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isAdmin: boolean;
}

interface AdminCommentsProps {
  slug: string;
  initialComments: Comment[];
  isAdmin: boolean;
}

export function Comments({ slug, initialComments, isAdmin }: AdminCommentsProps) {
  const { t, language } = useLanguage();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Optimistic updates could be added here, but for now we rely on revalidatePath
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        await addComment(slug, content);
        setContent("");
      } catch (error) {
        console.error("Failed to add comment");
        alert("Failed to add comment");
      }
    });
  };

  const handleDelete = (commentId: string) => {
    if (!confirm(language === 'zh' ? '确定要删除这条评论吗？' : 'Are you sure you want to delete this comment?')) return;
    
    startTransition(async () => {
      try {
        await deleteCommentAction(slug, commentId);
      } catch (error) {
        console.error("Failed to delete comment");
      }
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-8 font-serif flex items-center gap-2">
        <MessageSquare size={24} className="text-orange-600" />
        {language === 'zh' ? '评论' : 'Comments'}
        <span className="text-sm font-normal text-gray-400 ml-2">({initialComments.length})</span>
      </h2>

      {/* Comment List */}
      <div className="space-y-8 mb-12">
        {initialComments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8 bg-gray-50 dark:bg-white/5 rounded-xl">
            {language === 'zh' ? '暂无评论' : 'No comments yet.'}
          </p>
        ) : (
          initialComments.map((comment) => (
            <div key={comment.id} className="group flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${comment.isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                  {comment.isAdmin ? <ShieldCheck size={20} /> : <User size={20} />}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${comment.isAdmin ? 'text-orange-600' : 'text-gray-900 dark:text-gray-100'}`}>
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Public Post Form */}
      <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          {isAdmin ? <ShieldCheck size={18} className="text-orange-600" /> : <MessageSquare size={18} className="text-gray-500" />}
          {language === 'zh' 
            ? (isAdmin ? '添加管理员评论' : '发表评论') 
            : (isAdmin ? 'Add Admin Comment' : 'Leave a Comment')
          }
        </h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={language === 'zh' ? '写下你的想法...' : 'Write your thoughts...'}
            className="w-full px-4 py-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-h-[100px] mb-4 text-sm"
            disabled={isPending}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending 
                ? (language === 'zh' ? '发布中...' : 'Posting...') 
                : (language === 'zh' ? '发布评论' : 'Post Comment')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
