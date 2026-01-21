"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function Comments() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-8 font-serif">
        {language === 'zh' ? '评论' : 'Comments'}
      </h2>
      {process.env.NEXT_PUBLIC_GISCUS_REPO ? (
        <Giscus
          id="comments"
          repo={process.env.NEXT_PUBLIC_GISCUS_REPO as any}
          repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string}
          category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY as string}
          categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string}
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang={language === 'zh' ? 'zh-CN' : 'en'}
          loading="lazy"
        />
      ) : (
        <div className="p-8 text-center bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500">
            {language === 'zh' 
              ? '评论系统未配置。请在 .env.local 中设置 Giscus 变量。' 
              : 'Comments not configured. Please set Giscus variables in .env.local.'}
          </p>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2 text-center italic">
        * Comments are powered by GitHub Discussions.
      </p>
    </div>
  );
}
