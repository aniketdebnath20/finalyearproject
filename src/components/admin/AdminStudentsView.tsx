import React, { useState, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type{ Student } from '../../types';
import { truncateEmail } from '../../utils/formatters';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  ArrowUp
} from 'lucide-react';

interface AdminStudentsViewProps {
  onSelectStudent: (studentId: string) => void;
}

export const AdminStudentsView: React.FC<AdminStudentsViewProps> = ({ onSelectStudent }) => {
  const { students, departments, courses, addStudent, updateStudent, deleteStudent } = useUniversity();

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

  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [academicYear, setAcademicYear] = useState('2025-2029');
  const [dateOfBirth, setDateOfBirth] = useState('2004-05-12');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState('100 University Avenue');
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');

  const openAddModal = () => {
    setEditingStudent(null);
    setFullName('');
    setRollNumber(`CS2025-00${students.length + 1}`);
    setEmail('');
    setPhone('+1 (555) 234-5678');
    setDepartmentId(departments[0]?.id || '');
    setCourseId(courses[0]?.id || '');
    setAcademicYear('2025-2029');
    setDateOfBirth('2005-06-15');
    setGender('Male');
    setAddress('Apex Campus Dormitory, Block B');
    setProfilePhoto('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFullName(student.fullName);
    setRollNumber(student.rollNumber);
    setEmail(student.email);
    setPhone(student.phone);
    setDepartmentId(student.departmentId);
    setCourseId(student.courseId);
    setAcademicYear(student.academicYear);
    setDateOfBirth(student.dateOfBirth);
    setGender(student.gender);
    setAddress(student.address);
    setProfilePhoto(student.profilePhoto);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        fullName,
        rollNumber,
        email,
        phone,
        departmentId,
        courseId,
        semester: editingStudent.semester,
        academicYear,
        dateOfBirth,
        gender,
        address,
        profilePhoto,
        accountStatus: editingStudent.accountStatus
      });
    } else {
      addStudent({
        fullName,
        rollNumber,
        email,
        phone,
        departmentId,
        courseId,
        semester: 1,
        academicYear,
        admissionDate: new Date().toISOString().split('T')[0],
        dateOfBirth,
        gender,
        address,
        profilePhoto,
        accountStatus: 'Active'
      });
    }

    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(s => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.studentId && s.studentId.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    handleScroll();
  }, [filteredStudents]);

  return (
    <div
      id="admin-students-view"
      className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Classes Registry
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Student Directory & Enrollment
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Manage enrolled students, class batches, contact details, and records ({filteredStudents.length} Students)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Register Student
        </button>
      </div>

      {/* Only Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs shrink-0 my-3">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search students by name, roll number, email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
          />
        </div>
      </div>

      {/* Students Table with Scroll Effect */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
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
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs text-zinc-400 font-mono font-medium border-b border-zinc-200 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 min-w-[180px]">Student</th>
                <th className="py-3 px-4 min-w-[100px]">Roll</th>
                <th className="py-3 px-4 min-w-[160px]">Program & Dept</th>
                <th className="py-3 px-4 min-w-[120px]">Contact</th>
                <th className="py-3 px-4 text-right min-w-[90px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
              {filteredStudents.map(student => {
                const dept = departments.find(d => d.id === student.departmentId);
                const course = courses.find(c => c.id === student.courseId);

                return (
                  <tr key={student.id} className="hover:bg-zinc-50/60 transition-colors">
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

                    <td className="py-3 px-4 font-mono text-zinc-800 text-[11px]">
                      {student.rollNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-zinc-900 font-medium">{course?.courseName}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{dept?.name}</div>
                    </td>

                    <td className="py-3 px-4 text-zinc-600 font-mono text-[11px]">
                      {student.phone}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectStudent(student.id)}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${student.fullName}?`)) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-500 shrink-0">
          <span>
            Showing {filteredStudents.length} of {students.length} enrolled students
          </span>
          <span className="text-[11px] text-zinc-400">Institutional Registrar Record</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden my-4 sm:my-6 max-h-[92vh] flex flex-col">
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <h2 className="font-serif font-semibold text-zinc-900 text-sm">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Department</label>
                  <select
                    value={departmentId}
                    onChange={e => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Program</label>
                  <select
                    value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 font-medium cursor-pointer"
                >
                  {editingStudent ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
