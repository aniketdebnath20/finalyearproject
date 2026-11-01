import React, { useState, useMemo } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type { Student } from '../../types';
import { truncateEmail } from '../../utils/formatters';
import {
  Search,
  Plus,
  X,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { MasterViewSkeleton } from '../common/Skeleton';

interface AdminResultsViewProps {
  onSelectStudent?: (studentId: string) => void;
  isLoading?: boolean;
}

interface CompletedExamItem {
  id: string;
  courseName: string;
  examName: string;
  topicName: string;
  examDate: string;
  totalMarks: number;
  obtainedMarks: number;
  status: 'Pass' | 'Fail';
}

export const AdminResultsView: React.FC<AdminResultsViewProps> = ({
  onSelectStudent,
  isLoading
}) => {
  const {
    students,
    courses,
    departments,
    subjects,
    exams,
    results,
    currentUser,
    saveResult,
    addToast,
    isDataLoading
  } = useUniversity();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Upload Result modal state
  const [isAddResultModalOpen, setIsAddResultModalOpen] = useState(false);
  const [formStudentId, setFormStudentId] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formInternal, setFormInternal] = useState(0);
  const [formExternal, setFormExternal] = useState(0);
  const [formPractical, setFormPractical] = useState(0);
  const [formSemester, setFormSemester] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;

    return students.filter(student => {
      const course = courses.find(c => c.id === student.courseId);
      const dept = departments.find(d => d.id === student.departmentId);
      const name = (student.fullName || '').toLowerCase();
      const roll = (student.rollNumber || '').toLowerCase();
      const studentId = (student.studentId || '').toLowerCase();
      const email = (student.email || '').toLowerCase();
      const courseName = (course?.courseName || '').toLowerCase();
      const courseCode = (course?.courseCode || '').toLowerCase();
      const deptName = (dept?.name || '').toLowerCase();
      const deptCode = (dept?.code || '').toLowerCase();

      return (
        name.includes(q) ||
        roll.includes(q) ||
        studentId.includes(q) ||
        email.includes(q) ||
        courseName.includes(q) ||
        courseCode.includes(q) ||
        deptName.includes(q) ||
        deptCode.includes(q)
      );
    });
  }, [students, courses, departments, searchTerm]);

  // Compute completed exams for a given student
  const getStudentCompletedExams = (student: Student): CompletedExamItem[] => {
    const rawResults = results.filter(r => r.studentId === student.id);
    return rawResults.map(result => {
      const subject = subjects.find(item => item.id === result.subjectId);
      const exam = exams.find(item => item.id === result.examId || item.subjectId === result.subjectId);
      const course = courses.find(item => item.id === (exam?.courseId || subject?.courseId || student.courseId));
      const obtainedMarks = result.totalMarks ?? result.internalMarks + result.externalMarks + result.practicalMarks;
      return {
        id: result.id,
        courseName: course?.courseName || 'Unassigned course',
        examName: exam?.examName || 'Assessment result',
        topicName: subject?.subjectName || 'Unassigned subject',
        examDate: exam?.examDate || result.createdAt.slice(0, 10),
        totalMarks: exam?.totalMarks ?? 100,
        obtainedMarks,
        status: result.resultStatus || (obtainedMarks >= (exam?.passingMarks ?? 40) ? 'Pass' : 'Fail')
      };
    });
  };

  const toggleStudentResult = (studentId: string) => {
    setExpandedStudentId(prev => (prev === studentId ? null : studentId));
  };

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

  const handleUploadResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = saveResult({
        studentId: formStudentId,
        subjectId: formSubjectId,
        semester: Number(formSemester),
        academicYear: students.find(student => student.id === formStudentId)?.academicYear || String(new Date().getFullYear()),
        internalMarks: Number(formInternal),
        externalMarks: Number(formExternal),
        practicalMarks: Number(formPractical),
        evaluatedByStaffId: currentUser?.id || ''
      });

      if (res.success) {
        addToast('Examination result recorded successfully.', 'success');
        setIsAddResultModalOpen(false);
      } else {
        addToast(res.message, 'error');
      }
    } catch {
      addToast('An error occurred saving examination result.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isDataLoading) {
    return <MasterViewSkeleton role="admin" activeTab="results" />;
  }

  return (
    <div id="admin-results-view" className="w-full space-y-4 pb-16 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Academic Transcripts
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Student Examination Results
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Directory of enrolled students and their completed examination details
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddResultModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141b22] text-white hover:bg-[#253341] transition-all text-xs font-semibold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Student Result</span>
        </button>
      </div>

      {/* Clean Search Bar (matches Course & Department page) */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
          <input
            id="results-students-search-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, course, or department..."
            className="w-full pl-9 pr-12 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans placeholder:text-zinc-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-700 px-1 py-0.5 rounded cursor-pointer font-mono"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Student Results Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead className="bg-zinc-50 shadow-2xs">
              <tr className="border-b border-zinc-200 text-[10px] font-mono uppercase text-zinc-500">
                <th className="py-3 px-4 font-semibold min-w-[220px]">Student</th>
                <th className="py-3 px-4 font-semibold min-w-[180px]">Course</th>
                <th className="py-3 px-4 font-semibold min-w-[180px]">Department</th>
                <th className="py-3 px-4 font-semibold text-center min-w-[120px]">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-sans">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-400 font-mono">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                    <p className="text-xs font-medium text-zinc-600">No students found</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      No student matches your search query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const course = courses.find(c => c.id === student.courseId);
                  const dept = departments.find(d => d.id === student.departmentId);
                  const isExpanded = expandedStudentId === student.id;
                  const studentExams = isExpanded ? getStudentCompletedExams(student) : [];

                  return (
                    <React.Fragment key={student.id}>
                      {/* Student Row */}
                      <tr
                        className={`transition-colors ${
                          isExpanded ? 'bg-zinc-50/80 font-medium' : 'hover:bg-zinc-50/60'
                        }`}
                      >
                        {/* Student Detail */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.profilePhoto}
                              alt={student.fullName}
                              className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200"
                            />
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => onSelectStudent && onSelectStudent(student.id)}
                                className="font-semibold text-zinc-900 hover:text-blue-600 text-left transition-colors cursor-pointer block truncate"
                              >
                                {student.fullName}
                              </button>
                              <div
                                className="text-[10px] text-zinc-400 font-mono truncate"
                                title={student.email}
                              >
                                {truncateEmail(student.email, 24)}
                              </div>
                              <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                                <span>Roll: {student.rollNumber}</span>
                                {student.studentId && <span>• ID: {student.studentId}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Course Detail */}
                        <td className="py-3 px-4">
                          {course ? (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-semibold">
                                  {course.courseCode}
                                </span>
                              </div>
                              <span className="font-medium text-zinc-900 block text-xs">
                                {course.courseName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-400 font-mono text-xs italic">
                              No Course Assigned
                            </span>
                          )}
                        </td>

                        {/* Department Detail */}
                        <td className="py-3 px-4">
                          {dept ? (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-semibold">
                                  {dept.code}
                                </span>
                              </div>
                              <span className="font-medium text-zinc-900 block text-xs">
                                {dept.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-400 font-mono text-xs italic">
                              No Department Assigned
                            </span>
                          )}
                        </td>

                        {/* Result Column Action */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleStudentResult(student.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                              isExpanded
                                ? 'bg-zinc-900 text-white shadow-xs'
                                : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 hover:border-zinc-300'
                            }`}
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Result</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Exam Detail Shown Directly Below That Student Detail */}
                      {isExpanded && (
                        <tr className="bg-zinc-50/70 border-b border-zinc-200">
                          <td colSpan={4} className="p-3 sm:p-5">
                            <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                              <div className="px-4 py-3 bg-zinc-50/90 border-b border-zinc-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4 text-zinc-700" />
                                  <span className="text-xs font-bold text-zinc-900">
                                    Exam Details for {student.fullName}
                                  </span>
                                  <span className="text-[11px] font-mono text-zinc-500">
                                    (Roll: {student.rollNumber})
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
                                  {studentExams.length} {studentExams.length === 1 ? 'Exam' : 'Exams'} Completed
                                </span>
                              </div>

                              {studentExams.length === 0 ? (
                                <div className="p-6 text-center text-zinc-400 text-xs font-mono">
                                  No completed exams found for this student.
                                </div>
                              ) : (
                                <div className="overflow-x-auto w-full custom-scrollbar">
                                  <table className="w-full text-left text-xs min-w-[650px]">
                                    <thead className="bg-zinc-50/80 text-zinc-500 font-mono font-semibold border-b border-zinc-200 text-[10px] uppercase tracking-wider">
                                      <tr>
                                        <th className="py-2.5 px-4">Course</th>
                                        <th className="py-2.5 px-4">Exam Name</th>
                                        <th className="py-2.5 px-4">Topic</th>
                                        <th className="py-2.5 px-4">Date</th>
                                        <th className="py-2.5 px-4 text-center">Total Mark</th>
                                        <th className="py-2.5 px-4 text-center">Obtained Mark</th>
                                        <th className="py-2.5 px-4 text-center">Result</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 font-sans">
                                      {studentExams.map(exam => (
                                        <tr key={exam.id} className="hover:bg-zinc-50/70 transition-colors">
                                          {/* Course */}
                                          <td className="py-3 px-4 font-semibold text-zinc-900">
                                            {exam.courseName}
                                          </td>

                                          {/* Exam Name */}
                                          <td className="py-3 px-4 font-medium text-zinc-800">
                                            {exam.examName}
                                          </td>

                                          {/* Topic */}
                                          <td className="py-3 px-4 text-zinc-600">
                                            {exam.topicName}
                                          </td>

                                          {/* Date */}
                                          <td className="py-3 px-4 font-mono text-zinc-600 text-[11px] whitespace-nowrap">
                                            {formatDate(exam.examDate)}
                                          </td>

                                          {/* Total Mark */}
                                          <td className="py-3 px-4 text-center font-mono text-zinc-700 font-semibold">
                                            {exam.totalMarks}
                                          </td>

                                          {/* Obtained Mark */}
                                          <td className="py-3 px-4 text-center font-mono font-bold text-zinc-900">
                                            {exam.obtainedMarks}
                                          </td>

                                          {/* Result: Pass or Fail */}
                                          <td className="py-3 px-4 text-center whitespace-nowrap">
                                            <span
                                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                exam.status === 'Pass'
                                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                                              }`}
                                            >
                                              {exam.status === 'Pass' ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                              ) : (
                                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                              )}
                                              <span>{exam.status}</span>
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          <span className="text-[11px] text-zinc-400">Click "Result" on any student to view completed exams</span>
        </div>
      </div>

      {/* Upload Student Result Modal */}
      {isAddResultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-zinc-900">
                    Upload Student Result
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Record academic evaluation and assessment marks
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddResultModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadResultSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                  Student Candidate <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formStudentId}
                  onChange={e => setFormStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                  Subject / Topic <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formSubjectId}
                  onChange={e => setFormSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subjectName} ({sub.subjectCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                    Internal Marks (Max 30)
                  </label>
                  <input
                    type="number"
                    value={formInternal}
                    onChange={e => setFormInternal(Number(e.target.value))}
                    min={0}
                    max={30}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                    External Marks (Max 50)
                  </label>
                  <input
                    type="number"
                    value={formExternal}
                    onChange={e => setFormExternal(Number(e.target.value))}
                    min={0}
                    max={50}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                    Practical Marks (Max 20)
                  </label>
                  <input
                    type="number"
                    value={formPractical}
                    onChange={e => setFormPractical(Number(e.target.value))}
                    min={0}
                    max={20}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                  Semester
                </label>
                <input
                  type="number"
                  value={formSemester}
                  onChange={e => setFormSemester(Number(e.target.value))}
                  min={1}
                  max={8}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddResultModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Recording...' : 'Record Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
