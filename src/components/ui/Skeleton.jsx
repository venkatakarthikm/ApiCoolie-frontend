import React from 'react';

/**
 * Standard Skeleton pulse placeholder.
 */
export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/30 ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton loader representing a Job List page.
 */
export function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-border/40 rounded-xl bg-card">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton loader representing the Dashboard analytics.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border border-border/40 rounded-xl bg-card space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-border/40 rounded-xl bg-card space-y-4 md:col-span-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="p-6 border border-border/40 rounded-xl bg-card space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
