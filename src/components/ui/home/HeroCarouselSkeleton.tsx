import React from "react";

export default function HeroCarouselSkeleton() {
  return (
    <div className="w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[340px] xl:h-[360px] bg-slate-200 dark:bg-slate-800/80 animate-pulse relative overflow-hidden flex items-end p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-2xl w-full space-y-2 sm:space-y-3">
        {/* Badge shimmer */}
        <div className="w-20 sm:w-28 h-5 bg-slate-300 dark:bg-slate-700/80 rounded-full" />
        {/* Title shimmer */}
        <div className="w-3/4 sm:w-1/2 h-6 sm:h-8 bg-slate-300 dark:bg-slate-700/80 rounded-lg" />
        {/* Button shimmer */}
        <div className="w-24 sm:w-28 h-7 sm:h-9 bg-slate-300 dark:bg-slate-700/80 rounded-lg" />
      </div>
      {/* Dots shimmer */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-300/40 dark:bg-slate-700/40">
        <div className="w-6 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
      </div>
    </div>
  );
}
