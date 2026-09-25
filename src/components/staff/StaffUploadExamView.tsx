import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type { ExamType } from '../../types';
import {
  Calendar,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  X,
  Clock,
  MapPin,
  FileText,
  ArrowUp
} from 'lucide-react';

export const StaffUploadExamView: React.FC = () => {
  const { currentStaff, departments, courses, subjects, exams, createExam, deleteExam } = useUniversity();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states for creating exam
  const [examName, setExamName] = useState('Java OOPs Module Assessment');
  const [departmentId, setDepartmentId] = useState(currentStaff?.departmentId || departments[0]?.id || '');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [semester, setSemester] = useState(6);
  const [examDate, setExamDate] = useState('2026-05-18');
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('12:30');
  const [roomHall, setRoomHall] = useState('Hall C-204, Academic Block');
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(40);
  const [examType, setExamType] = useState<ExamType>('Theory');
  const [instructions, setInstructions] = useState('Calculators permitted for Section B. No electronic personal devices.');
  const [isSuccess, setIsSuccess] = useState(false);

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

  // Filter subjects by course & semester inside modal
  const availableSubjects = subjects.filter(
    s => (!courseId || s.courseId === courseId) && (!semester || s.semester === semester)
  );

  // Filtered exams for main table
  const filteredExams = useMemo(() => {
    return exams.filter(ex => {
      const sub = subjects.find(s => s.id === ex.subjectId);
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.examName.toLowerCase().includes(q) ||
        (sub?.subjectName || '').toLowerCase().includes(q) ||
        (sub?.subjectCode || '').toLowerCase().includes(q) ||
        ex.roomHall.toLowerCase().includes(q);

      const matchesCourse = !selectedCourseFilter || ex.courseId === selectedCourseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [exams, subjects, searchTerm, selectedCourseFilter]);

  useEffect(() => {
    handleScroll();
  }, [filteredExams.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createExam({
      examName,
      subjectId: subjectId || availableSubjects[0]?.id || subjects[0]?.id,
      departmentId,
      courseId,
      semester: Number(semester),
      examDate,
      startTime,
      endTime,
      roomHall,
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      examType,
      instructions,
      createdByStaffId: currentStaff?.id || 'STF-101'
    });

    setIsSuccess(true);
    setIsCreateModalOpen(false);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Senate Timetable
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Examination Timetable & Seating
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Publish assessment timetables, hall seating allocations, and candidate instructions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white shadow-2xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule Examination
        </button>
      </div>

      {isSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Examination scheduled and broadcast to student and faculty timetables.
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3 shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search examinations by title, subject name, code, venue..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCourseFilter}
            onChange={e => setSelectedCourseFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="">All Academic Programs</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.courseName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Published Exams Table */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Top Fade Indicator */}
        <div
          className={`pointer-events-none absolute top-14 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
            isScrolledTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/50">
          <div>
            <h2 className="text-sm font-serif font-semibold text-zinc-900">Current Active Examinations</h2>
            <p className="text-[11px] text-zinc-500 font-mono">Live roster of university examination sessions</p>
          </div>
          <span className="text-xs font-mono text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
            {filteredExams.length} Sessions
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
                <th className="py-3 px-4 min-w-[160px]">Exam Name</th>
                <th className="py-3 px-4 min-w-[160px]">Subject</th>
                <th className="py-3 px-4 min-w-[140px]">Date & Time</th>
                <th className="py-3 px-4 min-w-[140px]">Venue</th>
                <th className="py-3 px-4 min-w-[80px]">Category</th>
                <th className="py-3 px-4 min-w-[110px]">Score Metric</th>
                <th className="py-3 px-4 text-right min-w-[60px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 text-xs font-mono">
                    No examination sessions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredExams.map(exam => {
                  const sub = subjects.find(s => s.id === exam.subjectId);
                  return (
                    <tr key={exam.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-zinc-900">
                        {exam.examName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-zinc-800">{sub?.subjectName || 'General Exam'}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{sub?.subjectCode || '—'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                        <div className="text-zinc-900 font-medium">{exam.examDate}</div>
                        <div className="text-[10px] text-zinc-500">{exam.startTime} – {exam.endTime}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        {exam.roomHall}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {exam.examType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-800 text-[11px] whitespace-nowrap">
                        Pass: {exam.passingMarks} / {exam.totalMarks}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteExam(exam.id)}
                          className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
          <span>Official University Assessment Schedule</span>
          <span className="text-[11px] text-zinc-400">{filteredExams.length} Active Records</span>
        </div>
      </div>

      {/* Schedule Exam Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-zinc-200 shadow-xl overflow-hidden my-8">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-700" />
                <h3 className="font-serif font-semibold text-sm text-zinc-900">
                  Schedule Examination Session
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {/* Exam Name */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Exam Title</label>
                  <input
                    type="text"
                    required
                    value={examName}
                    onChange={e => setExamName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* Exam Type */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Category</label>
                  <select
                    value={examType}
                    onChange={e => setExamType(e.target.value as ExamType)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="Theory">Theory Exam</option>
                    <option value="Practical">Practical Lab</option>
                    <option value="Viva">Oral Viva</option>
                    <option value="Project">Project Defense</option>
                  </select>
                </div>

                {/* Course */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Degree Course</label>
                  <select
                    value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value))}
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
                    value={subjectId}
                    onChange={e => setSubjectId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    {availableSubjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.subjectCode} — {s.subjectName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Examination Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* Room */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Venue / Hall Allocation</label>
                  <input
                    type="text"
                    required
                    value={roomHall}
                    onChange={e => setRoomHall(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* Total Marks */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalMarks}
                    onChange={e => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* Passing Marks */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={passingMarks}
                    onChange={e => setPassingMarks(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Candidate Directives</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Candidate rules, permitted items..."
                  className="w-full p-2.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5" /> Publish Examination Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
