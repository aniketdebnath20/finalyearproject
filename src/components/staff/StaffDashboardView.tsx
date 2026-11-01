import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Users,
  Calendar,
  BarChart3,
  CalendarCheck2,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import {
  DashboardMetricSkeleton,
  DashboardUpcomingExamsSkeleton,
  DashboardLatestNoticesSkeleton
} from '../common/Skeleton';

interface StaffDashboardViewProps {
  onNavigate: (tab: string) => void;
  onSelectStudent?: (studentId: string) => void;
  loading?: boolean;
}

export const StaffDashboardView: React.FC<StaffDashboardViewProps> = ({
  onNavigate,
  loading = false
}) => {
  const { currentStaff, students, subjects, exams, results, studentAttendance, notifications, isDataLoading, refreshData } = useUniversity();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const isDataFetching = loading || isDataLoading || isRefreshing;
  const departmentStudents = students.filter(student => student.departmentId === currentStaff?.departmentId);
  const today = new Date().toISOString().slice(0, 10);
  const upcomingExams = exams
    .filter(exam => exam.examDate >= today)
    .sort((a, b) => a.examDate.localeCompare(b.examDate))
    .slice(0, 3)
    .map(exam => {
      const date = new Date(`${exam.examDate}T00:00:00`);
      const subject = subjects.find(item => item.id === exam.subjectId);
      return {
        id: exam.id,
        month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
        day: String(date.getDate()),
        title: exam.examName,
        details: `${subject?.subjectName || 'Subject'} · ${exam.startTime}–${exam.endTime} · ${exam.roomHall || 'Venue to be confirmed'}`,
        badge: exam.examType,
        badgeBg: 'bg-[#fef3c7] text-[#92400e]'
      };
    });
  const latestNotices = notifications.filter(item => item.status !== 'cancelled').slice(0, 3);
  const monthExams = exams.filter(exam => exam.examDate.slice(0, 7) === today.slice(0, 7)).length;
  const pendingResults = exams.filter(exam => exam.examDate < today && !results.some(result => result.examId === exam.id)).length;
  const markedCount = studentAttendance.length;
  const attendanceRate = markedCount
    ? Math.round(studentAttendance.filter(record => record.status === 'Present' || record.status === 'Late').length / markedCount * 100)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title Row with Kicker & Refresh View */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-500 font-semibold">
            TUTOR & FACULTY WORKSPACE &nbsp;/&nbsp; PULSE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18222d] tracking-tight mt-1 font-sans">
            Your teaching & classes desk.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-sans">
            Class schedules, student attendance, and batch progress for today.
          </p>
        </div>

        <div>
          <button
            onClick={handleRefresh}
            disabled={isDataFetching}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#e5dfd4] text-xs font-semibold text-[#18222d] shadow-2xs hover:bg-zinc-50 transition cursor-pointer disabled:opacity-60"
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 text-zinc-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing desk...' : 'Refresh view'}</span>
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
          {/* 1. Assigned students Card */}
          <div
            onClick={() => onNavigate('students')}
            className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] hover:border-[#d9d3c7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Assigned students</span>
              <div className="w-7 h-7 rounded-lg bg-[#e6f4f2] text-[#0d9488] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#18222d] tracking-tight">
                {departmentStudents.length}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">in your department</div>
            </div>
          </div>

          {/* 2. Next exam Card */}
          <div
            onClick={() => onNavigate('exams-manage')}
            className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] hover:border-[#d9d3c7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Next exam</span>
              <div className="w-7 h-7 rounded-lg bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#18222d] tracking-tight">
                {monthExams}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">scheduled this month</div>
            </div>
          </div>

          {/* 3. Pending results Card */}
          <div
            onClick={() => onNavigate('results-upload')}
            className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] hover:border-[#d9d3c7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Pending results</span>
              <div className="w-7 h-7 rounded-lg bg-[#fde8e8] text-[#e11d48] flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#18222d] tracking-tight">
                {pendingResults}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">awaiting submission</div>
            </div>
          </div>

          {/* 4. Attendance Card */}
          <div
            onClick={() => onNavigate('attendance-mark')}
            className="bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px] hover:border-[#d9d3c7] transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Attendance</span>
              <div className="w-7 h-7 rounded-lg bg-[#eff3f8] text-[#0d9488] flex items-center justify-center">
                <CalendarCheck2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#18222d] tracking-tight">
                {attendanceRate}%
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">department average</div>
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
                onClick={() => onNavigate('exams-manage')}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingExams.length === 0 ? (
                <p className="py-6 text-center text-xs text-zinc-400">No upcoming exams have been scheduled.</p>
              ) : upcomingExams.map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('exams-manage')}
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
              {latestNotices.length === 0 ? (
                <p className="py-6 text-center text-xs text-zinc-400">There are no active notices.</p>
              ) : latestNotices.map(notice => (
                <div
                  key={notice.id}
                  onClick={() => onNavigate('notifications')}
                  className="flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-zinc-50/70 transition cursor-pointer"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                      notice.priority === 'urgent' || notice.priority === 'important' ? 'bg-[#ea580c]' : 'bg-[#cbd5e1]'
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
