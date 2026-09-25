import React, { useState, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { getTimeGreeting } from '../../utils/formatters';
import {
  Users,
  BookOpen,
  CreditCard,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import {
  DashboardMetricSkeleton,
  DashboardUpcomingExamsSkeleton,
  DashboardLatestNoticesSkeleton
} from '../common/Skeleton';

interface AdminDashboardViewProps {
  onNavigate: (tab: string) => void;
  onSelectStudent?: (studentId: string) => void;
  loading?: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigate,
  loading = false
}) => {
  const { students, staffList, courses, currentUser } = useUniversity();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dynamicGreeting = getTimeGreeting();
  const adminDisplayName = currentUser?.name?.split(' ')[0] || 'Admin';

  // Initial simulated fetch on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
    }, 650);
  };

  const isDataFetching = loading || isLoading || isRefreshing;

  // Upcoming exams list matching image 2
  const upcomingExams = [
    {
      id: 'ex-1',
      month: 'SEP',
      day: '8',
      title: 'Data Structures',
      details: 'B.Tech Computer Science · 10:00 AM - 12:00 PM · Hall A-204',
      badge: 'midterm',
      badgeBg: 'bg-[#fef3c7] text-[#92400e]'
    },
    {
      id: 'ex-2',
      month: 'SEP',
      day: '11',
      title: 'Database Systems',
      details: 'B.Tech Computer Science · 02:00 PM - 04:00 PM · Lab C-102',
      badge: 'practical',
      badgeBg: 'bg-[#ffedd5] text-[#9a3412]'
    },
    {
      id: 'ex-3',
      month: 'NOV',
      day: '24',
      title: 'Computer Networks',
      details: 'B.Tech Computer Science · 10:00 AM - 01:00 PM · Main Auditorium',
      badge: 'final',
      badgeBg: 'bg-[#fef9c3] text-[#854d0e]'
    }
  ];

  // Latest notices list matching image 2
  const latestNotices = [
    {
      id: 'notif-1',
      title: 'Mid-semester schedule published',
      message: 'Your September examination schedule is now available.',
      isUrgent: true
    },
    {
      id: 'notif-2',
      title: 'Fee payment reminder',
      message: 'Your second semester installment is due on September 15.',
      isUrgent: true
    },
    {
      id: 'notif-3',
      title: 'Certificate ready to download',
      message: 'Your Academic Excellence Award certificate has been issued.',
      isUrgent: false
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title Row with Kicker & Refresh View */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-500 font-semibold flex items-center gap-2">
            <span>CLASSES ADMINISTRATION</span>
            <span>/</span>
            <span>PULSE</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Pulse
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18222d] tracking-tight mt-1 font-sans">
            {dynamicGreeting}, Classes {adminDisplayName}.
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-1.5 text-xs text-zinc-500 font-sans">
            <span className="font-mono text-zinc-800 font-semibold">{students.length} Scholars Enrolled</span>
            <span>•</span>
            <span className="font-mono text-zinc-800 font-semibold">{staffList.length} Faculty Members</span>
            <span>•</span>
            <span className="font-mono text-zinc-800 font-semibold">{courses.length} Active Courses</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-zinc-500 font-mono">Academic Term: Fall 2026</span>
          </div>
        </div>

        <div>
          <button
            onClick={handleRefresh}
            disabled={isDataFetching}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#e5dfd4] text-xs font-semibold text-[#18222d] shadow-2xs hover:bg-zinc-50 transition cursor-pointer disabled:opacity-60"
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 text-zinc-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing records...' : 'Refresh view'}</span>
          </button>
        </div>
      </div>

      {/* Row 1: The 4 Metric Cards or Skeleton Placeholders */}
      {isDataFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <DashboardMetricSkeleton />
          <DashboardMetricSkeleton />
          <DashboardMetricSkeleton />
          <DashboardMetricSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Students Card */}
          <div
            onClick={() => onNavigate('students')}
            className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] hover:border-[#d9d3c7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Students</span>
              <div className="w-7 h-7 rounded-lg bg-[#e6f4f2] text-[#0d9488] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#18222d] tracking-tight">
                24
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">enrolled this year</div>
            </div>
          </div>

          {/* 2. Staff Card */}
          <div
            onClick={() => onNavigate('staff')}
            className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] hover:border-[#d9d3c7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Staff</span>
              <div className="w-7 h-7 rounded-lg bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#18222d] tracking-tight">
                6
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">active faculty members</div>
            </div>
          </div>

          {/* 3. Courses Card */}
          <div
            onClick={() => onNavigate('courses')}
            className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] hover:border-[#d9d3c7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Courses</span>
              <div className="w-7 h-7 rounded-lg bg-[#eff3f8] text-[#64748b] flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#18222d] tracking-tight">
                5
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">across departments</div>
            </div>
          </div>

          {/* 4. Collected Card */}
          <div
            onClick={() => onNavigate('fees')}
            className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] hover:border-[#d9d3c7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Collected</span>
              <div className="w-7 h-7 rounded-lg bg-[#fde8e8] text-[#e11d48] flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#18222d] tracking-tight">
                $177.0k
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">this academic year</div>
            </div>
          </div>
        </div>
      )}

      {/* Row 2: Upcoming exams & Latest notices or Skeleton Placeholders */}
      {isDataFetching ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <DashboardUpcomingExamsSkeleton />
          </div>
          <div className="lg:col-span-5">
            <DashboardLatestNoticesSkeleton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Upcoming Exams Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-sm font-bold text-[#18222d]">Upcoming exams</h2>
              <button
                onClick={() => onNavigate('exams')}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingExams.map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('exams')}
                  className="flex items-center justify-between gap-4 p-2.5 -mx-2.5 rounded-xl hover:bg-zinc-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Date square */}
                    <div className="w-11 h-12 rounded-lg bg-[#eef4f1] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold uppercase text-[#0f766e] tracking-wider leading-none">
                        {item.month}
                      </span>
                      <span className="text-sm font-extrabold text-[#18222d] mt-1 leading-none">
                        {item.day}
                      </span>
                    </div>

                    {/* Course info */}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#18222d] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 truncate font-sans">
                        {item.details}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="shrink-0">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${item.badgeBg}`}>
                      {item.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Latest Notices Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-sm font-bold text-[#18222d]">Latest notices</h2>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition flex items-center gap-1 cursor-pointer"
              >
                <span>All notices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {latestNotices.map(notice => (
                <div
                  key={notice.id}
                  onClick={() => onNavigate('notifications')}
                  className="flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-zinc-50/70 transition cursor-pointer"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                      notice.isUrgent ? 'bg-[#ea580c]' : 'bg-[#cbd5e1]'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold text-[#18222d]">
                      {notice.title}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed font-sans">
                      {notice.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
