import React from 'react';

// Base pulse block
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
      {...props}
    />
  );
};

// Skeleton loader for 4 KPI Cards (used in Dashboard & Tabs)
export const SkeletonKPICards = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
};

// Skeleton loader for Data Tables
export const SkeletonTable = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex justify-between items-center">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton loader for Charts (Bar & Doughnut)
export const SkeletonChartsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <Skeleton className="h-4 w-48" />
        <div className="h-56 w-full flex items-center justify-center">
          <Skeleton className="h-44 w-44 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for Checklist (Mark Attendance)
export const SkeletonChecklist = ({ count = 5 }) => {
  return (
    <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-5 w-24 rounded" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
