import React, { useState, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { Search, Filter, ArrowUpRight, ArrowUp } from 'lucide-react';
import { truncateEmail } from '../../utils/formatters';

interface StaffStudentsViewProps {
  onSelectStudent: (studentId: string) => void;
}

export const StaffStudentsView: React.FC<StaffStudentsViewProps> = ({ onSelectStudent }) => {
  const { currentStaff, students, courses, getStudentAttendanceSummary, getStudentGPA } = useUniversity();

  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');

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

  if (!currentStaff) return null;

  // Filter students under this faculty member's department
  const myDeptStudents = students.filter(s => s.departmentId === currentStaff.departmentId);

  const filteredStudents = myDeptStudents.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.studentId || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSemester = semesterFilter === 'all' || s.semester.toString() === semesterFilter;

    return matchesSearch && matchesSemester;
  });

  useEffect(() => {
    handleScroll();
  }, [filteredStudents]);

  return (
    <div className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full space-y-3">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Department Roster
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Enrolled Department Scholars
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Undergraduate & postgraduate candidates registered under academic faculty oversight
          </p>
        </div>
        <div>
          <span className="text-xs font-mono text-zinc-600 bg-zinc-100 px-3 py-1 rounded-md border border-zinc-200">
            {filteredStudents.length} Scholars
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={semesterFilter}
            onChange={e => setSemesterFilter(e.target.value)}
            className="w-full sm:w-44 py-2 px-3 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
          >
            <option value="all">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="6">Semester 6</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Top Fade Indicator */}
        <div
          className={`pointer-events-none absolute top-10 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
            isScrolledTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 font-mono text-xs">
            No scholars found matching current search criteria.
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
          >
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs text-zinc-400 font-mono font-medium border-b border-zinc-200 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Term</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
                {filteredStudents.map(student => {
                  const course = courses.find(c => c.id === student.courseId);
                  const att = getStudentAttendanceSummary(student.id);
                  const gpa = getStudentGPA(student.id);

                  return (
                    <tr key={student.id} className="hover:bg-zinc-50/60 transition-colors">
                      {/* Photo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.profilePhoto}
                            alt={student.fullName}
                            className="w-8 h-8 rounded-md object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                          />
                          <div>
                            <div className="font-medium text-zinc-900">{student.fullName}</div>
                            <div className="text-[10px] text-zinc-400 font-mono" title={student.email}>
                              {truncateEmail(student.email, 24)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-3 px-4 font-mono text-zinc-800 text-[11px]">
                        {student.rollNumber}
                      </td>

                      {/* Course */}
                      <td className="py-3 px-4 text-zinc-600 max-w-xs truncate">
                        {course?.courseName || 'Computer Science'}
                      </td>

                      {/* Semester */}
                      <td className="py-3 px-4 font-mono text-zinc-700">
                        Term {student.semester}
                      </td>

                      {/* Attendance % */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-semibold text-zinc-900">
                            {att.overallPercentage}%
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                            att.overallPercentage >= 85
                              ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                              : att.overallPercentage >= 75
                              ? 'border-amber-200 text-amber-700 bg-amber-50'
                              : 'border-rose-200 text-rose-700 bg-rose-50'
                          }`}>
                            {att.overallPercentage >= 85 ? 'Adequate' : att.overallPercentage >= 75 ? 'Notice' : 'Critical'}
                          </span>
                        </div>
                      </td>

                      {/* Academic Performance / GPA */}
                      <td className="py-3 px-4">
                        <div className="flex items-baseline gap-1 font-mono">
                          <span className="font-semibold text-zinc-900">{gpa.gpa}</span>
                          <span className="text-[10px] text-zinc-400">/ 10</span>
                        </div>
                      </td>

                      {/* Action to view full profile */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectStudent(student.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          View <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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
        <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/90 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
          <span>
            Showing {filteredStudents.length} of {myDeptStudents.length} enrolled scholars
          </span>
          <span className="text-[11px] text-zinc-400">
            Department of {currentStaff.departmentId || 'Academic Faculty'}
          </span>
        </div>
      </div>
    </div>
  );
};
