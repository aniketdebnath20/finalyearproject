import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { BookOpen, Search, ExternalLink, Users, ArrowUp } from 'lucide-react';
import { MasterViewSkeleton } from '../common/Skeleton';
import { truncateEmail } from '../../utils/formatters';

interface AdminCoursesDepartmentsViewProps {
  onSelectStudent?: (studentId: string) => void;
  isLoading?: boolean;
}

export const AdminCoursesDepartmentsView: React.FC<AdminCoursesDepartmentsViewProps> = ({
  onSelectStudent,
  isLoading
}) => {
  const { students, courses, isDataLoading } = useUniversity();
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter students and their taken courses based solely on the search bar
  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;

    return students.filter(student => {
      const course = courses.find(c => c.id === student.courseId);
      const studentName = student.fullName.toLowerCase();
      const rollNo = student.rollNumber.toLowerCase();
      const studentId = (student.studentId || '').toLowerCase();
      const email = student.email.toLowerCase();
      const courseName = (course?.courseName || '').toLowerCase();
      const courseCode = (course?.courseCode || '').toLowerCase();

      return (
        studentName.includes(q) ||
        rollNo.includes(q) ||
        studentId.includes(q) ||
        email.includes(q) ||
        courseName.includes(q) ||
        courseCode.includes(q)
      );
    });
  }, [students, courses, searchTerm]);

  useEffect(() => {
    handleScroll();
  }, [filteredStudents]);

  if (isLoading || isDataLoading) {
    return <MasterViewSkeleton role="admin" activeTab="courses" />;
  }

  return (
    <div
      id="admin-courses-view"
      className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full"
    >
      {/* Header */}
      <div id="courses-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Academic Courses
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" /> {students.length} Total Scholars
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Student Course Enrollments
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Directory of enrolled students and their assigned academic courses
          </p>
        </div>
      </div>

      {/* Only Search Bar */}
      <div id="search-container" className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs shrink-0 my-3">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
          <input
            id="course-students-search-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, student ID, or course taken..."
            className="w-full pl-9 pr-12 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans placeholder:text-zinc-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-700 px-1 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table: Only Student and Course Taken with Standardized Scroll Effect */}
      <div id="course-students-table-card" className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Top Fade Indicator */}
        <div
          className={`pointer-events-none absolute top-10 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
            isScrolledTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
        >
          <table id="course-students-table" className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs">
              <tr className="border-b border-zinc-200 text-[10px] font-mono uppercase text-zinc-400">
                <th className="py-3 px-4 font-semibold min-w-[200px]">Student</th>
                <th className="py-3 px-4 font-semibold min-w-[200px]">Course Taken</th>
                <th className="py-3 px-4 font-semibold text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-zinc-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                    <p className="text-xs font-medium text-zinc-600">No students found</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      No student or course matches your search query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const course = courses.find(c => c.id === student.courseId);

                  return (
                    <tr key={student.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Student Column */}
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
                            <div className="text-[10px] text-zinc-400 font-mono" title={student.email}>
                              {truncateEmail(student.email, 24)}
                            </div>
                            <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                              <span>Roll: {student.rollNumber}</span>
                              {student.studentId && <span>• ID: {student.studentId}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Course Taken Column */}
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

                      {/* Action Column */}
                      <td className="py-3 px-4 text-right">
                        {onSelectStudent && (
                          <button
                            type="button"
                            onClick={() => onSelectStudent(student.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer shadow-2xs"
                            title="View Student Profile"
                          >
                            <span>Profile</span>
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                          </button>
                        )}
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
          className={`pointer-events-none absolute bottom-9 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 transition-opacity duration-200 ${
            canScrollBottom ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Floating Quick Scroll to Top Action when scrolled */}
        {isScrolledTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="absolute bottom-12 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs font-medium shadow-md transition-all backdrop-blur-xs cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px]">Top</span>
          </button>
        )}

        {/* Results summary footer */}
        <div className="px-4 py-2.5 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-[11px] font-mono text-zinc-500 shrink-0">
          <span>
            Showing {filteredStudents.length} of {students.length} students
          </span>
          {searchTerm && (
            <span className="text-zinc-400">
              Filtered by: &ldquo;{searchTerm}&rdquo;
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
