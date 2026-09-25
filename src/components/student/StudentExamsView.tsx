import React from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { Clock, AlertCircle, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { StudentExamsSkeleton } from '../common/Skeleton';

interface StudentExamsViewProps {
  isLoading?: boolean;
}

export const StudentExamsView: React.FC<StudentExamsViewProps> = ({ isLoading }) => {
  const { currentStudent, exams, subjects, courses, isDataLoading } = useUniversity();

  if (isLoading || isDataLoading) {
    return <StudentExamsSkeleton />;
  }

  if (!currentStudent) return null;

  const currentCourse = courses.find(c => c.id === currentStudent.courseId);
  const courseName = currentCourse?.courseName || 'Java Full Stack Development';

  // Filter exams for student's course
  const relevantExams = exams.filter(
    e => (e.courseId === currentStudent.courseId || !e.courseId) && e.isPublished
  );

  const today = new Date().toISOString().split('T')[0];

  const upcomingExams = relevantExams
    .filter(e => e.examDate >= today)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Technical Assessment
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Examination Timetable & Schedule
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Evaluation timeline for Roll: <strong className="text-zinc-800">{currentStudent.rollNumber}</strong> • {courseName} (Java & OOPs)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200">
            {upcomingExams.length} Scheduled
          </span>
        </div>
      </div>

      {/* Upcoming Exams Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-serif font-semibold text-zinc-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-500" />
            Scheduled Examination Slots
          </h2>
        </div>

        {upcomingExams.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border border-zinc-200 text-center text-xs text-zinc-400 font-mono">
            No upcoming exams scheduled for this module track.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-18rem)] overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth">
            {upcomingExams.map(exam => {
              const subject = subjects.find(s => s.id === exam.subjectId);
              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl p-5 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-zinc-300 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {subject?.subjectCode || (exam.subjectId?.length <= 8 ? exam.subjectId : 'EXAM')}
                        </span>
                        <h3 className="text-base font-serif font-semibold text-zinc-900 mt-1.5">
                          {exam.examName}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {subject?.subjectName || exam.subjectId}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {exam.examType}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                      </div>
                    </div>

                    {/* Schedule Grid without designated hall */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs font-mono">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Exam Date</div>
                        <div className="text-zinc-900 font-medium mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {exam.examDate}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Window</div>
                        <div className="text-zinc-900 font-medium mt-0.5 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {exam.startTime} – {exam.endTime}
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    {exam.instructions && (
                      <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed">
                          <strong>Note:</strong> {exam.instructions}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Previous Exams Archive */}
      <div className="space-y-4 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-serif font-semibold text-zinc-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-500" />
            Completed Examinations Ledger
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            Archived Records
          </span>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-18rem)] overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-500 font-mono font-semibold border-b border-zinc-200 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Exam</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Date Held</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
                <tr className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-medium text-zinc-900">
                    Java OOPs Architecture & Design Patterns Comprehensive Evaluation
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    Object-Oriented Programming with Java (OOPs)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-500">2025-12-18</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-mono text-[10px]">
                      Theory
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Complete
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-medium text-zinc-900">
                    Java Multi-threading, Collections & JDBC Hands-on Lab Exam
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    Java Backend & Database Concurrency Lab
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-500">2025-12-12</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-mono text-[10px]">
                      Practical
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Complete
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
