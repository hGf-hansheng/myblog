"use client";

import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle Warm Gradient 1 */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-orange-100/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-overlay dark:bg-orange-900/10 opacity-50" />
      
      {/* Subtle Cool Gradient 2 */}
      <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-stone-200/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-overlay dark:bg-stone-800/10 opacity-50" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
      />
    </div>
  );
}
