import React from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { StudentAttendanceSkeleton } from '../common/Skeleton';

interface StudentAttendanceViewProps {
  isLoading?: boolean;
}

export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({ isLoading }) => {
  const { currentStudent, getStudentAttendanceSummary, isDataLoading } = useUniversity();

  if (isLoading || isDataLoading) {
    return <StudentAttendanceSkeleton />;
  }

  if (!currentStudent) return null;

  const attendance = getStudentAttendanceSummary(currentStudent.id);

  // Prepare chart data
  const chartData = attendance.subjects.map(s => ({
    name: s.subjectCode,
    fullName: s.subjectName,
    percentage: s.percentage,
    attended: s.classesAttended,
    total: s.totalClasses
  }));

  const getBarColor = (pct: number) => {
    if (pct >= 85) return '#18181b'; // zinc-900
    if (pct >= 75) return '#71717a'; // zinc-500
    return '#dc2626'; // rose-600
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Institutional Biometric
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Attendance Log & Register
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Roll: <strong className="text-zinc-800">{currentStudent.rollNumber}</strong> • Minimum threshold: 75% required for exam clearance
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-xs self-start sm:self-auto font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
            <span className="text-zinc-600">≥85% Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
            <span className="text-zinc-600">75–84% Threshold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span className="text-zinc-600">&lt;75% Shortage</span>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Aggregate Metric</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-semibold text-zinc-900">
              {attendance.overallPercentage}%
            </span>
            <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
              attendance.overallPercentage >= 85 ? 'bg-zinc-100 text-zinc-800' : attendance.overallPercentage >= 75 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
            }`}>
              {attendance.overallPercentage >= 75 ? 'Cleared' : 'Deficit'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">Across enrolled curriculum</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Scheduled Lectures</span>
          <span className="text-3xl font-mono font-semibold text-zinc-900 block mt-2">
            {attendance.totalClasses}
          </span>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">All semester contact hours</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Attended Lectures</span>
          <span className="text-3xl font-mono font-semibold text-zinc-900 block mt-2">
            {attendance.totalAttended}
          </span>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">Verified present by faculty</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Unexcused Absences</span>
          <span className={`text-3xl font-mono font-semibold block mt-2 ${attendance.totalMissed > 5 ? 'text-rose-600' : 'text-zinc-900'}`}>
            {attendance.totalMissed}
          </span>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">Absences logged to record</p>
        </div>
      </div>

      {/* Graphical Attendance Chart */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <h2 className="text-sm font-serif font-semibold text-zinc-900 mb-0.5">Subject Attendance Distribution (%)</h2>
        <p className="text-xs text-zinc-500 mb-5 font-mono">Biometric compliance by course module</p>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="#71717a" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontFamily: 'monospace' }} stroke="#71717a" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-zinc-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1">
                        <div className="font-semibold text-zinc-200">{data.fullName} ({data.name})</div>
                        <div className="font-mono">Attendance: <strong>{data.percentage}%</strong></div>
                        <div className="text-zinc-400 font-mono text-[11px]">{data.attended} attended / {data.total} lectures</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Subject List with Progress Bars */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4.5 border-b border-zinc-100">
          <h2 className="text-sm font-serif font-semibold text-zinc-900">Module Contact Hours Breakdown</h2>
          <p className="text-[11px] text-zinc-500 font-mono">Real-time attendance registry verified by instructors</p>
        </div>

        <div className="divide-y divide-zinc-100 max-h-[calc(100vh-20rem)] overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth">
          {attendance.subjects.map(sub => (
            <div key={sub.subjectId} className="p-4.5 hover:bg-zinc-50/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {sub.subjectCode}
                    </span>
                    <h3 className="text-xs font-semibold text-zinc-900">{sub.subjectName}</h3>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-1">
                    Scheduled: <strong className="text-zinc-800">{sub.totalClasses}</strong> &nbsp;|&nbsp;
                    Attended: <strong className="text-zinc-800">{sub.classesAttended}</strong> &nbsp;|&nbsp;
                    Missed: <strong className="text-zinc-800">{sub.classesMissed}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-mono font-semibold text-zinc-900">
                    {sub.percentage}%
                  </span>

                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                    sub.percentage >= 75
                      ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {sub.percentage >= 75 ? (
                      <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Eligible</>
                    ) : (
                      <><XCircle className="w-3 h-3 text-rose-600" /> Shortage</>
                    )}
                  </span>
                </div>
              </div>

              {/* Progress Bar with Color Indicator */}
              <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sub.percentage >= 75 ? 'bg-zinc-900' : 'bg-rose-600'
                  }`}
                  style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
