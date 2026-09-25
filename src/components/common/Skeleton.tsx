import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
  shimmer?: boolean;
}

/**
 * Base atomic Skeleton component with smooth shimmer effect
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  shimmer = true,
  ...props
}) => {
  const variantClasses = {
    rectangular: 'rounded-none',
    rounded: 'rounded-md',
    circular: 'rounded-full'
  };

  return (
    <div
      aria-hidden="true"
      className={`bg-zinc-200/80 ${variantClasses[variant]} ${
        shimmer ? 'animate-shimmer' : 'animate-pulse'
      } ${className}`}
      {...props}
    />
  );
};

/**
 * Skeleton for single Metric Card (Matches 130px dashboard cards)
 */
export const DashboardMetricSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] ${className}`}
    >
      {/* Top row: Label + Icon */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="w-7 h-7 rounded-lg" />
      </div>

      {/* Bottom: Big Stat Number + Subtitle */}
      <div>
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-3 w-20 rounded mt-1.5" />
      </div>
    </div>
  );
};

/**
 * Skeleton for the Upcoming Exams section on Dashboards
 */
export const DashboardUpcomingExamsSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-16 rounded" />
      </div>

      {/* 3 Exam rows */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 p-2.5 -mx-2.5 rounded-xl"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {/* Date Box */}
              <Skeleton className="w-11 h-12 rounded-lg shrink-0" />

              {/* Title & Details */}
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="h-3.5 w-40 max-w-full rounded" />
                <Skeleton className="h-3 w-64 max-w-full rounded" />
              </div>
            </div>

            {/* Badge */}
            <Skeleton className="h-5 w-16 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for the Latest Notices section on Dashboards
 */
export const DashboardLatestNoticesSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-3.5 w-16 rounded" />
      </div>

      {/* 3 Notice rows */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-start gap-3 p-2 -mx-2">
            <Skeleton className="w-2 h-2 rounded-full shrink-0 mt-1.5" variant="circular" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3.5 w-44 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for Dashboard Header row (Kicker, Title, Desc, Refresh Button)
 */
export const DashboardHeaderSkeleton: React.FC<{
  kickerWidth?: string;
  titleWidth?: string;
}> = ({ kickerWidth = 'w-36', titleWidth = 'w-64' }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className={`h-3 ${kickerWidth} rounded`} />
        <Skeleton className={`h-8 sm:h-9 ${titleWidth} rounded-lg`} />
        <Skeleton className="h-3.5 w-72 sm:w-96 rounded" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
};

/**
 * Complete Full-Screen Structured Skeleton for Student Dashboard
 */
export const StudentDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardHeaderSkeleton
        kickerWidth="w-44"
        titleWidth="w-72"
      />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
      </div>

      {/* Row 2: Upcoming Exams (7 cols) + Latest Notices (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <DashboardUpcomingExamsSkeleton />
        </div>
        <div className="lg:col-span-5">
          <DashboardLatestNoticesSkeleton />
        </div>
      </div>
    </div>
  );
};

/**
 * Complete Full-Screen Structured Skeleton for Staff / Faculty Dashboard
 */
export const StaffDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardHeaderSkeleton
        kickerWidth="w-48"
        titleWidth="w-64"
      />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
      </div>

      {/* Row 2: Upcoming Exams (7 cols) + Latest Notices (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <DashboardUpcomingExamsSkeleton />
        </div>
        <div className="lg:col-span-5">
          <DashboardLatestNoticesSkeleton />
        </div>
      </div>
    </div>
  );
};

/**
 * Complete Full-Screen Structured Skeleton for Admin Dashboard
 */
export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardHeaderSkeleton
        kickerWidth="w-40"
        titleWidth="w-80"
      />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
        <DashboardMetricSkeleton />
      </div>

      {/* Row 2: Upcoming Exams (7 cols) + Latest Notices (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <DashboardUpcomingExamsSkeleton />
        </div>
        <div className="lg:col-span-5">
          <DashboardLatestNoticesSkeleton />
        </div>
      </div>
    </div>
  );
};

/**
 * Reusable Structured Table Skeleton Placeholder
 */
export const TableListSkeleton: React.FC<{
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <Skeleton className="h-9 w-full sm:w-64 rounded-xl" />
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 py-2 border-b border-zinc-100 px-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-20 rounded" />
        ))}
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-4 gap-4 items-center p-2.5 rounded-xl bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" variant="circular" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-2.5 w-16 rounded" />
              </div>
            </div>
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-3.5 w-20 rounded" />
            <div className="flex justify-end">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Reusable Card Grid Skeleton (for Courses, Certificates, or Catalog)
 */
export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between h-[210px]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
            <Skeleton className="h-5 w-44 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * ============================================================================
 * SPECIALIZED VIEW SKELETON LOADERS (STUDENT, STAFF, ADMIN)
 * ============================================================================
 */

/**
 * Student Results View Skeleton
 */
export const StudentResultsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200 space-y-2">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-3.5 w-80 rounded" />
      </div>

      {/* Results Table Skeleton */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex justify-between">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="divide-y divide-zinc-100 p-2 space-y-1">
          {[1, 2, 3, 4].map(r => (
            <div key={r} className="flex items-center justify-between py-4 px-4 sm:px-6">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3.5 w-60 rounded" />
              </div>
              <div className="flex items-center gap-8">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Student Courses View Skeleton
 */
export const StudentCoursesSkeleton: React.FC = () => {
  return (
    <div className="w-full py-2 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <Skeleton className="h-3.5 w-80 rounded" />
        </div>
        <Skeleton className="h-7 w-32 rounded-xl" />
      </div>

      {/* Responsive Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-5 w-28 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-52 rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
              <Skeleton className="h-3 w-32 rounded" />
              <div className="space-y-1.5 pt-1">
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Student Fees View Skeleton
 */
export const StudentFeesSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200 space-y-2">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-7 w-60 rounded-lg" />
        <Skeleton className="h-3.5 w-72 rounded" />
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-7 w-28 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        ))}
      </div>

      {/* Official Statements & Documents */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
        <Skeleton className="h-4 w-36 rounded" />
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-44 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

/**
 * Student Attendance View Skeleton
 */
export const StudentAttendanceSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-zinc-200 space-y-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-7 w-64 rounded-lg" />
        <Skeleton className="h-3.5 w-80 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-4">
        <Skeleton className="h-4 w-44 rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(r => (
            <div key={r} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Student Exams View Skeleton
 */
export const StudentExamsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-3.5 w-80 rounded" />
        </div>
        <Skeleton className="h-7 w-28 rounded-md" />
      </div>

      {/* Scheduled Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-5 w-44 rounded" />
                <Skeleton className="h-3.5 w-36 rounded" />
              </div>
              <Skeleton className="h-5 w-16 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <Skeleton className="h-8 rounded" />
              <Skeleton className="h-8 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Completed Examinations Ledger */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 space-y-3">
        <Skeleton className="h-4 w-44 rounded" />
        <div className="divide-y divide-zinc-100">
          {[1, 2].map(r => (
            <div key={r} className="py-3 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-56 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Student Notifications View Skeleton (Screen Height Bound)
 */
export const StudentNotificationsSkeleton: React.FC = () => {
  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col max-w-4xl mx-auto overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 shrink-0">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-36 rounded-lg" />
          <Skeleton className="h-3.5 w-64 rounded" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex-1 overflow-hidden mt-3 space-y-3.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-5 w-56 rounded" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
            </div>
            <div className="pt-3 border-t border-zinc-100 flex justify-between">
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Student Certificates View Skeleton
 */
export const StudentCertificatesSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-3.5 w-72 rounded" />
        </div>
        <Skeleton className="h-7 w-28 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-10 rounded-full" variant="circular" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-52 rounded" />
              <Skeleton className="h-3.5 w-40 rounded" />
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Student Profile View Skeleton
 */
export const StudentProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex items-center gap-5">
        <Skeleton className="w-20 h-20 rounded-full shrink-0" variant="circular" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-3.5 w-56 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-4">
            <Skeleton className="h-4 w-36 rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map(j => (
                <div key={j} className="flex justify-between py-1.5 border-b border-zinc-100">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3.5 w-32 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Master View Skeleton Loader
 * Automatically resolves and renders the appropriate specialized skeleton based on role and active tab.
 */
export const MasterViewSkeleton: React.FC<{
  role: string;
  activeTab: string;
}> = ({ role, activeTab }) => {
  // Student views
  if (role === 'student') {
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboardSkeleton />;
      case 'results':
        return <StudentResultsSkeleton />;
      case 'courses':
        return <StudentCoursesSkeleton />;
      case 'fees':
        return <StudentFeesSkeleton />;
      case 'attendance':
        return <StudentAttendanceSkeleton />;
      case 'exams':
        return <StudentExamsSkeleton />;
      case 'notifications':
        return <StudentNotificationsSkeleton />;
      case 'certificates':
        return <StudentCertificatesSkeleton />;
      case 'profile':
        return <StudentProfileSkeleton />;
      default:
        return <StudentDashboardSkeleton />;
    }
  }

  // Staff views
  if (role === 'staff') {
    switch (activeTab) {
      case 'dashboard':
        return <StaffDashboardSkeleton />;
      case 'students':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-36" titleWidth="w-56" />
            <TableListSkeleton rows={6} columns={5} />
          </div>
        );
      case 'attendance-mark':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-40" titleWidth="w-64" />
            <div className="p-4 rounded-xl bg-white border border-zinc-200 flex gap-3">
              <Skeleton className="h-9 w-44 rounded-lg" />
              <Skeleton className="h-9 w-44 rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
            <TableListSkeleton rows={5} columns={4} />
          </div>
        );
      case 'my-attendance':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-36" titleWidth="w-60" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DashboardMetricSkeleton />
              <DashboardMetricSkeleton />
              <DashboardMetricSkeleton />
            </div>
            <TableListSkeleton rows={5} columns={4} />
          </div>
        );
      case 'exams-manage':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-40" titleWidth="w-60" />
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 space-y-4">
              <Skeleton className="h-4 w-44 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-9 rounded-lg" />
                <Skeleton className="h-9 rounded-lg" />
                <Skeleton className="h-9 rounded-lg" />
                <Skeleton className="h-9 rounded-lg" />
              </div>
            </div>
            <TableListSkeleton rows={4} columns={4} />
          </div>
        );
      case 'results-upload':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-40" titleWidth="w-64" />
            <div className="p-4 rounded-xl bg-white border border-zinc-200 flex gap-3">
              <Skeleton className="h-9 w-48 rounded-lg" />
              <Skeleton className="h-9 w-48 rounded-lg" />
            </div>
            <TableListSkeleton rows={6} columns={5} />
          </div>
        );
      case 'certificates':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-36" titleWidth="w-56" />
            <TableListSkeleton rows={5} columns={4} />
          </div>
        );
      case 'notifications':
        return <StudentNotificationsSkeleton />;
      case 'profile':
        return <StudentProfileSkeleton />;
      default:
        return <StaffDashboardSkeleton />;
    }
  }

  // Admin views
  if (role === 'admin') {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardSkeleton />;
      case 'students':
      case 'staff':
      case 'staff-approval':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-40" titleWidth="w-64" />
            <TableListSkeleton rows={6} columns={5} />
          </div>
        );
      case 'courses':
      case 'departments':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-40" titleWidth="w-72" />
            <CardGridSkeleton count={4} />
          </div>
        );
      case 'fees':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-40" titleWidth="w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DashboardMetricSkeleton />
              <DashboardMetricSkeleton />
              <DashboardMetricSkeleton />
            </div>
            <TableListSkeleton rows={5} columns={5} />
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <DashboardHeaderSkeleton kickerWidth="w-36" titleWidth="w-60" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs space-y-3">
                  <Skeleton className="h-5 w-44 rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <div className="pt-2 flex justify-end">
                    <Skeleton className="h-8 w-28 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'notifications':
        return <StudentNotificationsSkeleton />;
      case 'settings':
        return (
          <div className="space-y-6 max-w-4xl">
            <DashboardHeaderSkeleton kickerWidth="w-36" titleWidth="w-56" />
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 space-y-4">
              <Skeleton className="h-5 w-40 rounded" />
              <div className="space-y-3">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          </div>
        );
      default:
        return <AdminDashboardSkeleton />;
    }
  }

  return <TableListSkeleton rows={5} columns={4} />;
};

