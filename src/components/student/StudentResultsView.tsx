import React, { useMemo } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { StudentResultsSkeleton } from '../common/Skeleton';
import {
  CheckCircle2,
  XCircle,
  FileCheck2
} from 'lucide-react';

interface StudentResultsViewProps {
  isLoading?: boolean;
}

export const StudentResultsView: React.FC<StudentResultsViewProps> = ({ isLoading }) => {
  const { currentStudent, results, subjects, courses, exams, isDataLoading } = useUniversity();

  const studentResults = useMemo(() => {
    if (!currentStudent) return [];

    const rawResults = results.filter(r => r.studentId === currentStudent.id);

    return rawResults.map(result => {
      const subject = subjects.find(item => item.id === result.subjectId);
      const exam = exams.find(item => item.id === result.examId || item.subjectId === result.subjectId);
      const course = courses.find(item => item.id === (exam?.courseId || subject?.courseId || currentStudent.courseId));
      const obtainedMarks = result.totalMarks ?? result.internalMarks + result.externalMarks + result.practicalMarks;
      return {
        id: result.id,
        courseName: course?.courseName || 'Unassigned course',
        examName: exam?.examName || 'Assessment result',
        topicName: subject?.subjectName || 'Unassigned subject',
        examDate: exam?.examDate || result.createdAt.slice(0, 10),
        totalMarks: exam?.totalMarks ?? 100,
        obtainedMarks,
        status: result.resultStatus || (obtainedMarks >= (exam?.passingMarks ?? 40) ? 'Pass' as const : 'Fail' as const)
      };
    });
  }, [results, currentStudent, subjects, exams, courses]);

  if (isLoading || isDataLoading) {
    return <StudentResultsSkeleton />;
  }

  if (!currentStudent) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="student-results-container" className="space-y-6 w-full animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-2.5">
          <FileCheck2 className="w-6 h-6 text-zinc-700" />
          Exam Results
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-sans">
          Assessment scores, course exam topics, marks obtained, and pass/fail standing.
        </p>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        {studentResults.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-xs font-mono">
            No exam results available at this time.
          </div>
        ) : (
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
              <thead className="bg-zinc-50/90 text-zinc-500 font-mono font-semibold border-b border-zinc-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Course</th>
                  <th className="py-3.5 px-4 sm:px-6">Exam Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Topic</th>
                  <th className="py-3.5 px-4 sm:px-6">Date</th>
                  <th className="py-3.5 px-4 text-center">Total Mark</th>
                  <th className="py-3.5 px-4 text-center">Obtained Mark</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {studentResults.map(row => (
                  <tr key={row.id} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Course */}
                    <td className="py-4 px-4 sm:px-6 font-semibold text-zinc-900">
                      {row.courseName}
                    </td>

                    {/* Exam Name */}
                    <td className="py-4 px-4 sm:px-6 font-medium text-zinc-800">
                      {row.examName}
                    </td>

                    {/* Topic */}
                    <td className="py-4 px-4 sm:px-6 text-zinc-600">
                      {row.topicName}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 sm:px-6 font-mono text-zinc-600 text-xs whitespace-nowrap">
                      {formatDate(row.examDate)}
                    </td>

                    {/* Total Mark */}
                    <td className="py-4 px-4 text-center font-mono text-zinc-700 font-semibold">
                      {row.totalMarks}
                    </td>

                    {/* Obtained Mark */}
                    <td className="py-4 px-4 text-center font-mono font-bold text-zinc-900">
                      {row.obtainedMarks}
                    </td>

                    {/* Pass or Fail */}
                    <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          row.status === 'Pass'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {row.status === 'Pass' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{row.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
