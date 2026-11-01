import React, { useState, useEffect, useRef } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Save,
  CheckCircle2,
  ArrowUp
} from 'lucide-react';
import { truncateEmail } from '../../utils/formatters';

interface MarksRow {
  studentId: string;
  internal: number;
  external: number;
  practical: number;
}

export const StaffUploadResultsView: React.FC = () => {
  const {
    currentUser,
    courses,
    subjects,
    exams,
    students,
    results,
    saveStudentResult
  } = useUniversity();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [selectedSemester, setSelectedSemester] = useState(6);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [savedMarksKey, setSavedMarksKey] = useState('');

  // Scroll tracking for fade effect and quick scroll to top
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledTop, setIsScrolledTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsScrolledTop(el.scrollTop > 16);
    setCanScrollBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 12);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Available subjects matching course & semester
  const availableSubjects = subjects.filter(
    s => (!selectedCourseId || s.courseId === selectedCourseId) &&
         (!selectedSemester || s.semester === selectedSemester)
  );

  // Target students
  const targetStudents = students.filter(
    s => (!selectedCourseId || s.courseId === selectedCourseId) &&
         (!selectedSemester || s.semester === selectedSemester)
  );

  const marksKey = `${selectedCourseId}:${selectedSemester}:${selectedSubjectId}`;
  const [marksOverrides, setMarksOverrides] = useState<{ key: string; rows: Record<string, MarksRow> }>({ key: '', rows: {} });
  const marksData: Record<string, MarksRow> = Object.fromEntries(targetStudents.map(student => {
    const existing = results.find(result => result.studentId === student.id && result.subjectId === selectedSubjectId);
    const savedMarks: MarksRow = existing
      ? { studentId: student.id, internal: existing.internalMarks, external: existing.externalMarks, practical: existing.practicalMarks }
      : { studentId: student.id, internal: 0, external: 0, practical: 0 };
    return [student.id, marksOverrides.key === marksKey ? marksOverrides.rows[student.id] || savedMarks : savedMarks];
  }));
  const isSaved = savedMarksKey === marksKey;

  useEffect(() => {
    handleScroll();
  }, [targetStudents.length]);

  const handleMarkChange = (studentId: string, field: 'internal' | 'external' | 'practical', value: number) => {
    const updatedRow = { ...marksData[studentId], [field]: Math.max(0, value) };
    setMarksOverrides(previous => ({
      key: marksKey,
      rows: { ...(previous.key === marksKey ? previous.rows : {}), [studentId]: updatedRow }
    }));
    setSavedMarksKey('');
  };

  // Grade calculation helper
  const computeEvaluation = (internal: number, external: number, practical: number) => {
    const total = internal + external + practical;
    const grade = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B+' : total >= 60 ? 'B' : total >= 50 ? 'C' : total >= 40 ? 'D' : 'F';
    const gradePoints = total >= 90 ? 10 : total >= 80 ? 9 : total >= 70 ? 8 : total >= 60 ? 7 : total >= 50 ? 6 : total >= 40 ? 5 : 0;

    const passStatus = total >= 40 ? 'Pass' : 'Fail';

    return { total, grade, gradePoints, passStatus };
  };

  const handleSaveAndPublish = () => {
    (Object.values(marksData) as MarksRow[]).forEach(row => {
      const { total, grade, gradePoints, passStatus } = computeEvaluation(row.internal, row.external, row.practical);
      saveStudentResult({
        studentId: row.studentId,
        subjectId: selectedSubjectId,
        examId: selectedExamId,
        semester: selectedSemester,
        academicYear: targetStudents.find(student => student.id === row.studentId)?.academicYear || String(new Date().getFullYear()),
        internalMarks: row.internal,
        externalMarks: row.external,
        practicalMarks: row.practical,
        totalMarks: total,
        grade,
        gradePoints,
        resultStatus: passStatus as 'Pass' | 'Fail',
        evaluatedByStaffId: currentUser?.id || ''
      });
    });

    setSavedMarksKey(marksKey);
    setTimeout(() => setSavedMarksKey(''), 5000);
  };

  return (
    <div className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Grade Evaluation
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Academic Grading & Assessment Entry
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Input continuous internal assessments, external papers, and lab practicals
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAndPublish}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors self-start sm:self-auto cursor-pointer shadow-2xs shrink-0"
        >
          <Save className="w-3.5 h-3.5" /> Commit & Publish Grades
        </button>
      </div>

      {isSaved && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Examination scores and grade points computed, committed, and updated across student dossiers.
        </div>
      )}

      {/* Filter Selectors */}
      <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        {/* Course */}
        <div>
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Program</label>
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.courseName}</option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Term / Semester</label>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(Number(e.target.value))}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Curriculum Module</label>
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            {availableSubjects.map(s => (
              <option key={s.id} value={s.id}>{s.subjectCode} — {s.subjectName}</option>
            ))}
          </select>
        </div>

        {/* Exam */}
        <div>
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Exam Cycle</label>
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.examName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Upload Table */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Top Fade Indicator */}
        <div
          className={`pointer-events-none absolute top-14 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
            isScrolledTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="p-3.5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-serif font-semibold text-zinc-900">
              Grade Entry Matrix ({targetStudents.length} Candidates)
            </h2>
            <p className="text-[11px] text-zinc-500 font-mono">
              Weight distribution: Internal (30) + External (50) + Practical (20) = 100 max
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
            Term Evaluation
          </span>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
        >
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs text-zinc-400 font-mono font-medium border-b border-zinc-200 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 min-w-[80px]">Roll</th>
                <th className="py-3 px-4 min-w-[160px]">Student</th>
                <th className="py-3 px-3 text-center min-w-[90px]">Internal (/30)</th>
                <th className="py-3 px-3 text-center min-w-[90px]">External (/50)</th>
                <th className="py-3 px-3 text-center min-w-[90px]">Practical (/20)</th>
                <th className="py-3 px-3 text-center min-w-[80px]">Total (/100)</th>
                <th className="py-3 px-3 text-center min-w-[70px]">Grade</th>
                <th className="py-3 px-3 text-center min-w-[70px]">Points</th>
                <th className="py-3 px-3 text-center min-w-[80px]">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
              {targetStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-400 text-xs font-mono">
                    No scholars enrolled under the selected program and semester.
                  </td>
                </tr>
              ) : (
                targetStudents.map(student => {
                  const row = marksData[student.id] || { internal: 0, external: 0, practical: 0, studentId: student.id };
                  const evalData = computeEvaluation(row.internal, row.external, row.practical);

                  return (
                    <tr key={student.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-zinc-700 text-[11px]">
                        {student.rollNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900">{student.fullName}</div>
                        <div className="text-[10px] text-zinc-400 font-mono" title={student.email}>
                          {truncateEmail(student.email, 24)}
                        </div>
                      </td>

                      {/* Internal marks input */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={row.internal}
                          onChange={e => handleMarkChange(student.id, 'internal', Number(e.target.value))}
                          className="w-14 px-2 py-1 text-center font-mono text-xs font-semibold text-zinc-900 rounded bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                      </td>

                      {/* External marks input */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={row.external}
                          onChange={e => handleMarkChange(student.id, 'external', Number(e.target.value))}
                          className="w-14 px-2 py-1 text-center font-mono text-xs font-semibold text-zinc-900 rounded bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                      </td>

                      {/* Practical marks input */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={row.practical}
                          onChange={e => handleMarkChange(student.id, 'practical', Number(e.target.value))}
                          className="w-14 px-2 py-1 text-center font-mono text-xs font-semibold text-zinc-900 rounded bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                      </td>

                      {/* Total */}
                      <td className="py-3 px-3 text-center font-mono font-semibold text-xs text-zinc-900">
                        {evalData.total}
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded font-mono font-semibold text-xs bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {evalData.grade}
                        </span>
                      </td>

                      {/* Grade points */}
                      <td className="py-3 px-3 text-center font-mono text-xs text-zinc-700">
                        {evalData.gradePoints}
                      </td>

                      {/* Standing */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          evalData.passStatus === 'Pass'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {evalData.passStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Fade Indicator */}
        <div
          className={`pointer-events-none absolute bottom-12 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 transition-opacity duration-200 ${
            canScrollBottom ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Floating Quick Scroll to Top Action when scrolled */}
        {isScrolledTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="absolute bottom-14 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs font-medium shadow-md transition-all backdrop-blur-xs cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px]">Top</span>
          </button>
        )}

        {/* Footer */}
        <div className="px-4 py-3 bg-zinc-50/90 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
          <span>{targetStudents.length} Candidate Records Evaluated</span>
          <span className="text-[11px] text-zinc-400">Department Grading Council</span>
        </div>
      </div>
    </div>
  );
};
