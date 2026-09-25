import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type{
  User,
  UserRole,
  Student,
  Staff,
  Department,
  Course,
  Subject,
  StudentAttendanceRecord,
  StaffAttendanceRecord,
  StudentFeeRecord,
  FeePayment,
  AcademicResult,
  Exam,
  Certificate,
  NotificationItem,
  StaffApprovalStatus,
  AttendanceStatus,
  StaffAttendanceStatus
} from '../types';
import {
  initialDepartments,
  initialStaff,
  initialCourses,
  initialSubjects,
  initialStudents,
  initialFees,
  initialAttendanceRecords,
  initialStaffAttendance,
  initialResults,
  initialExams,
  initialCertificates,
  initialNotifications,
  studentBaseAttendanceMap
} from '../services/seedData';

interface AttendanceSubjectDetail {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  classesAttended: number;
  classesMissed: number;
  percentage: number;
  status: 'Good' | 'Warning' | 'Low';
}

interface StudentAttendanceSummary {
  overallPercentage: number;
  totalClasses: number;
  totalAttended: number;
  totalMissed: number;
  subjects: AttendanceSubjectDetail[];
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UniversityContextType {
  // Auth state
  currentUser: User | null;
  currentStudent: Student | null;
  currentStaff: Staff | null;
  activeRole: UserRole | null;
  isAuthenticated: boolean;
  loginAsStudent: (name: string, rollNumber: string) => boolean;
  loginAsStaff: (staffIdOrUser: string, pass: string) => boolean;
  loginAsAdmin: (usernameOrEmail: string, pass: string) => boolean;
  quickLogin: (role: UserRole, id?: string) => void;
  logout: () => void;

  // Data collections
  students: Student[];
  staffList: Staff[];
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  studentAttendance: StudentAttendanceRecord[];
  staffAttendance: StaffAttendanceRecord[];
  fees: StudentFeeRecord[];
  feeRecords: StudentFeeRecord[];
  results: AcademicResult[];
  exams: Exam[];
  certificates: Certificate[];
  notifications: NotificationItem[];

  // Helper getters
  getStudentAttendanceSummary: (studentId: string) => StudentAttendanceSummary;
  getStudentGPA: (studentId: string) => { gpa: number; cgpa: number; passStatus: 'Pass' | 'Fail'; totalSubjects: number };
  getStudentFees: (studentId: string) => StudentFeeRecord | undefined;
  getStudentCourses: (studentId: string) => Subject[];

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => { success: boolean; message: string };
  updateStudent: (studentIdOrStudent: string | Student, studentUpdate?: Partial<Student>) => void;
  deleteStudent: (studentId: string) => void;

  // Staff Actions
  addStaff: (staff: Omit<Staff, 'id'>) => { success: boolean; message: string };
  updateStaff: (staffIdOrStaff: string | Staff, staffUpdate?: Partial<Staff>) => void;
  deleteStaff: (staffId: string) => void;

  // Department & Course Actions
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (deptIdOrDept: string | Department, update?: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (courseIdOrCourse: string | Course, update?: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Attendance Actions
  saveStudentAttendance: (records: Omit<StudentAttendanceRecord, 'id' | 'createdAt'>[]) => void;
  markStudentAttendance: (record: { studentId: string; subjectId: string; date: string; status: AttendanceStatus; markedByStaffId: string }) => void;
  submitStaffAttendance: (data: { staffId?: string; date: string; checkInTime: string; checkOutTime: string; status: StaffAttendanceStatus; note?: string; remarks?: string }) => void;
  reviewStaffAttendance: (recordId: string, approvalStatus: StaffApprovalStatus, remarks?: string) => void;

  // Fees Actions
  recordFeePayment: (studentId: string, payment: Omit<FeePayment, 'id'>) => void;
  updateFeeRecord: (idOrFee: string | StudentFeeRecord, updateData?: Partial<StudentFeeRecord>) => void;

  // Results Actions
  saveResult: (result: Omit<AcademicResult, 'id' | 'createdAt'>) => { success: boolean; message: string };
  saveStudentResult: (result: Omit<AcademicResult, 'id' | 'createdAt'>) => { success: boolean; message: string };
  updateResult: (result: AcademicResult) => void;
  deleteResult: (resultId: string) => void;

  // Exams Actions
  createExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;

  // Certificates Actions
  issueCertificate: (cert: Omit<Certificate, 'id' | 'certificateId'>) => void;
  deleteCertificate: (certId: string) => void;

  // Notification Actions
  sendNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;
  cancelNotification: (notifId: string, reason?: string) => void;
  reactivateNotification: (notifId: string) => void;
  deleteNotification: (notifId: string) => void;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;

  // Toast UI
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Data Loading Lifecycle & Perceived Performance
  isDataLoading: boolean;
  refreshData: (durationMs?: number) => Promise<void>;

  // Reset database to demo
  resetToDemoData: () => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

const STORAGE_PREFIX = 'apex_univ_';

function getInitialData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);

    // Auto-migrate to new Computer Classes data if old data is detected in cache
    if (key === 'courses' && Array.isArray(parsed)) {
      const hasOldCourse = parsed.some((c: any) => 
        c.courseName?.includes('B.Tech') || 
        c.courseName?.includes('MBA in Technology') ||
        !c.courseName?.includes('Java Full Stack')
      );
      if (hasOldCourse) return fallback;
    }
    if (key === 'subjects' && Array.isArray(parsed)) {
      const hasOldSubject = parsed.some((s: any) => 
        s.subjectName?.includes('VLSI Circuit') || 
        s.subjectName?.includes('Robotics & Mechatronics') ||
        !s.learningObjectives ||
        s.learningObjectives.length === 0
      );
      if (hasOldSubject) return fallback;
    }
    if (key === 'departments' && Array.isArray(parsed)) {
      const hasOldDept = parsed.some((d: any) => 
        d.name?.includes('Electronics & Communication') || 
        d.name?.includes('Mechanical')
      );
      if (hasOldDept) return fallback;
    }
    if (key === 'staff' && Array.isArray(parsed)) {
      const hasOldStaff = parsed.some((s: any) => 
        s.designation?.includes('Department Chair')
      );
      if (hasOldStaff) return fallback;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

export const UniversityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialData('auth_user', null));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Collections
  const [departments, setDepartments] = useState<Department[]>(() => getInitialData('departments', initialDepartments));
  const [courses, setCourses] = useState<Course[]>(() => getInitialData('courses', initialCourses));
  const [subjects, setSubjects] = useState<Subject[]>(() => getInitialData('subjects', initialSubjects));
  const [students, setStudents] = useState<Student[]>(() => getInitialData('students', initialStudents));
  const [staffList, setStaffList] = useState<Staff[]>(() => getInitialData('staff', initialStaff));
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendanceRecord[]>(() => getInitialData('student_attendance', initialAttendanceRecords));
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>(() => getInitialData('staff_attendance', initialStaffAttendance));
  const [fees, setFees] = useState<StudentFeeRecord[]>(() => getInitialData('fees', initialFees));
  const [results, setResults] = useState<AcademicResult[]>(() => getInitialData('results', initialResults));
  const [exams, setExams] = useState<Exam[]>(() => getInitialData('exams', initialExams));
  const [certificates, setCertificates] = useState<Certificate[]>(() => getInitialData('certificates', initialCertificates));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getInitialData('notifications', initialNotifications));

  // Sync to local storage
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'staff', JSON.stringify(staffList)); }, [staffList]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'student_attendance', JSON.stringify(studentAttendance)); }, [studentAttendance]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'staff_attendance', JSON.stringify(staffAttendance)); }, [staffAttendance]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'fees', JSON.stringify(fees)); }, [fees]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'results', JSON.stringify(results)); }, [results]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'certificates', JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'auth_user', JSON.stringify(currentUser)); }, [currentUser]);

  // Derived current user profiles
  const currentStudent = currentUser?.role === 'student' ? students.find(s => s.id === currentUser.id) || null : null;
  const currentStaff = currentUser?.role === 'staff' ? staffList.find(s => s.id === currentUser.id) || null : null;
  const activeRole = currentUser?.role || null;
  const isAuthenticated = !!currentUser;

  // Toast notification system
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Data loading state for perceived performance & skeletons
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const refreshData = async (durationMs = 380): Promise<void> => {
    setIsDataLoading(true);
    await new Promise(resolve => setTimeout(resolve, durationMs));
    setIsDataLoading(false);
  };

  // Auth Handlers
  const loginAsStudent = (name: string, rollNumber: string): boolean => {
    const trimmedName = name.trim().toLowerCase();
    const trimmedRoll = rollNumber.trim().toUpperCase();

    const student = students.find(
      s => s.rollNumber.toUpperCase() === trimmedRoll &&
      (s.fullName.toLowerCase().includes(trimmedName) || trimmedName.includes(s.fullName.toLowerCase().split(' ')[0]))
    );

    if (student) {
      const user: User = {
        id: student.id,
        role: 'student',
        name: student.fullName,
        email: student.email,
        avatar: student.profilePhoto,
        rollNumber: student.rollNumber,
        departmentId: student.departmentId
      };
      setCurrentUser(user);
      addToast(`Welcome back, ${student.fullName}!`, 'success');
      return true;
    } else {
      addToast('Invalid Student credentials. Check your Name and Roll Number.', 'error');
      return false;
    }
  };

  const loginAsStaff = (staffIdOrUser: string, pass: string): boolean => {
    const query = staffIdOrUser.trim().toLowerCase();
    const staff = staffList.find(
      s => s.staffId.toLowerCase() === query ||
      s.email.toLowerCase() === query ||
      s.staffName.toLowerCase().includes(query)
    );

    if (staff && pass.length >= 4) {
      const user: User = {
        id: staff.id,
        role: 'staff',
        name: staff.staffName,
        email: staff.email,
        avatar: staff.profilePhoto,
        staffId: staff.staffId,
        departmentId: staff.departmentId
      };
      setCurrentUser(user);
      addToast(`Welcome back, ${staff.staffName}!`, 'success');
      return true;
    } else {
      addToast('Invalid Faculty ID or password.', 'error');
      return false;
    }
  };

  const loginAsAdmin = (usernameOrEmail: string, pass: string): boolean => {
    const q = usernameOrEmail.trim().toLowerCase();
    if ((q === 'admin' || q === 'admin@apex.univ.edu' || q.includes('admin')) && pass.length >= 4) {
      const user: User = {
        id: 'admin-1',
        role: 'admin',
        name: 'Dean Eleanor Vance',
        email: 'admin@apex.univ.edu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
      };
      setCurrentUser(user);
      addToast('Welcome Administrator to Central Management Console.', 'success');
      return true;
    } else {
      addToast('Invalid Administrator credentials. Use admin@apex.univ.edu / password123.', 'error');
      return false;
    }
  };

  const quickLogin = (role: UserRole, id?: string) => {
    if (role === 'student') {
      const target = id ? students.find(s => s.id === id) : students[0];
      if (target) {
        setCurrentUser({
          id: target.id,
          role: 'student',
          name: target.fullName,
          email: target.email,
          avatar: target.profilePhoto,
          rollNumber: target.rollNumber,
          departmentId: target.departmentId
        });
        addToast(`Logged in as Student: ${target.fullName}`, 'info');
      }
    } else if (role === 'staff') {
      const target = id ? staffList.find(s => s.id === id) : staffList[0];
      if (target) {
        setCurrentUser({
          id: target.id,
          role: 'staff',
          name: target.staffName,
          email: target.email,
          avatar: target.profilePhoto,
          staffId: target.staffId,
          departmentId: target.departmentId
        });
        addToast(`Logged in as Faculty: ${target.staffName}`, 'info');
      }
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin-1',
        role: 'admin',
        name: 'Dean Eleanor Vance (Chief Administrator)',
        email: 'admin@apex.univ.edu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
      });
      addToast('Logged in as University Administrator', 'info');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('You have been logged out securely.', 'info');
  };

  // Helper Getters
  const getStudentCourses = (studentId: string): Subject[] => {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];
    return subjects.filter(sub => sub.courseId === student.courseId && sub.semester === student.semester);
  };

  const getStudentAttendanceSummary = (studentId: string): StudentAttendanceSummary => {
    const student = students.find(s => s.id === studentId);
    if (!student) {
      return { overallPercentage: 0, totalClasses: 0, totalAttended: 0, totalMissed: 0, subjects: [] };
    }

    const relevantSubjects = subjects.filter(sub => sub.courseId === student.courseId && sub.semester === student.semester);
    const baseStats = studentBaseAttendanceMap[studentId] || [];

    const subjectDetails: AttendanceSubjectDetail[] = relevantSubjects.map(sub => {
      const base = baseStats.find(b => b.subjectId === sub.id);
      let total = base ? base.totalClasses : 25;
      let attended = base ? base.attended : 22;
      let missed = base ? base.missed : 3;

      // Add dynamic records marked in this session
      const studentRecords = studentAttendance.filter(r => r.studentId === studentId && r.subjectId === sub.id);
      for (const rec of studentRecords) {
        total += 1;
        if (rec.status === 'Present' || rec.status === 'Late') {
          attended += 1;
        } else {
          missed += 1;
        }
      }

      const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
      let status: 'Good' | 'Warning' | 'Low' = 'Good';
      if (pct < 75) status = 'Low';
      else if (pct < 85) status = 'Warning';

      return {
        subjectId: sub.id,
        subjectCode: sub.subjectCode,
        subjectName: sub.subjectName,
        totalClasses: total,
        classesAttended: attended,
        classesMissed: missed,
        percentage: pct,
        status
      };
    });

    const sumTotal = subjectDetails.reduce((acc, s) => acc + s.totalClasses, 0);
    const sumAttended = subjectDetails.reduce((acc, s) => acc + s.classesAttended, 0);
    const sumMissed = subjectDetails.reduce((acc, s) => acc + s.classesMissed, 0);
    const overallPct = sumTotal > 0 ? Math.round((sumAttended / sumTotal) * 100) : 0;

    return {
      overallPercentage: overallPct,
      totalClasses: sumTotal,
      totalAttended: sumAttended,
      totalMissed: sumMissed,
      subjects: subjectDetails
    };
  };

  const getStudentGPA = (studentId: string) => {
    const studentResults = results.filter(r => r.studentId === studentId);
    if (studentResults.length === 0) {
      return { gpa: 8.8, cgpa: 8.9, passStatus: 'Pass' as const, totalSubjects: 0 };
    }

    const totalPts = studentResults.reduce((acc, r) => acc + r.gradePoints, 0);
    const gpa = Number((totalPts / studentResults.length).toFixed(2));
    const hasFailed = studentResults.some(r => r.resultStatus === 'Fail');

    return {
      gpa,
      cgpa: Number((gpa * 0.95 + 0.3).toFixed(2)),
      passStatus: hasFailed ? ('Fail' as const) : ('Pass' as const),
      totalSubjects: studentResults.length
    };
  };

  const getStudentFees = (studentId: string): StudentFeeRecord | undefined => {
    return fees.find(f => f.studentId === studentId);
  };

  // Student CRUD
  const addStudent = (newStudentData: Omit<Student, 'id'>) => {
    const existing = students.find(s => s.rollNumber.toUpperCase() === newStudentData.rollNumber.trim().toUpperCase());
    if (existing) {
      return { success: false, message: `Roll Number "${newStudentData.rollNumber}" is already registered.` };
    }
    const id = `stu-${Date.now()}`;
    const newStudent: Student = {
      ...newStudentData,
      id,
      rollNumber: newStudentData.rollNumber.trim().toUpperCase()
    };

    setStudents(prev => [newStudent, ...prev]);

    // Create initial fee record for new student
    const newFee: StudentFeeRecord = {
      id: `fee-${id}`,
      studentId: id,
      academicYear: newStudent.academicYear,
      semester: newStudent.semester,
      totalFees: 80000,
      feesPaid: 0,
      feesRemaining: 80000,
      paymentStatus: 'Unpaid',
      dueDate: '2026-10-31',
      paymentHistory: []
    };
    setFees(prev => [...prev, newFee]);

    addToast(`Student "${newStudent.fullName}" enrolled successfully with Roll No ${newStudent.rollNumber}.`);
    return { success: true, message: 'Student registered successfully' };
  };

  const updateStudent = (studentIdOrStudent: string | Student, studentUpdate?: Partial<Student>) => {
    if (typeof studentIdOrStudent === 'string') {
      setStudents(prev => prev.map(s => s.id === studentIdOrStudent ? { ...s, ...studentUpdate } : s));
    } else {
      setStudents(prev => prev.map(s => s.id === studentIdOrStudent.id ? studentIdOrStudent : s));
    }
    addToast('Student profile updated.');
  };

  const deleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    addToast(`Student ${student ? student.fullName : ''} removed.`);
  };

  // Staff CRUD
  const addStaff = (newStaffData: Omit<Staff, 'id'>) => {
    const existing = staffList.find(s => s.staffId.toUpperCase() === newStaffData.staffId.trim().toUpperCase());
    if (existing) {
      return { success: false, message: `Faculty ID "${newStaffData.staffId}" already exists.` };
    }
    const id = `staff-${Date.now()}`;
    const newStaff: Staff = {
      ...newStaffData,
      id,
      staffId: newStaffData.staffId.trim().toUpperCase()
    };
    setStaffList(prev => [newStaff, ...prev]);
    addToast(`Faculty member "${newStaff.staffName}" added successfully.`);
    return { success: true, message: 'Staff member added successfully' };
  };

  const updateStaff = (staffIdOrStaff: string | Staff, staffUpdate?: Partial<Staff>) => {
    if (typeof staffIdOrStaff === 'string') {
      setStaffList(prev => prev.map(s => s.id === staffIdOrStaff ? { ...s, ...staffUpdate } : s));
    } else {
      setStaffList(prev => prev.map(s => s.id === staffIdOrStaff.id ? staffIdOrStaff : s));
    }
    addToast('Staff details updated.');
  };

  const deleteStaff = (staffId: string) => {
    const s = staffList.find(x => x.id === staffId);
    setStaffList(prev => prev.filter(x => x.id !== staffId));
    addToast(`Staff member ${s ? s.staffName : ''} deleted.`);
  };

  // Department & Course
  const addDepartment = (deptData: Omit<Department, 'id'>) => {
    const id = `dept-${Date.now()}`;
    setDepartments(prev => [...prev, { ...deptData, id }]);
    addToast(`Department "${deptData.name}" created.`);
  };

  const updateDepartment = (deptIdOrDept: string | Department, update?: Partial<Department>) => {
    if (typeof deptIdOrDept === 'string') {
      setDepartments(prev => prev.map(d => d.id === deptIdOrDept ? { ...d, ...update } : d));
    } else {
      setDepartments(prev => prev.map(d => d.id === deptIdOrDept.id ? deptIdOrDept : d));
    }
    addToast('Department updated.');
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    addToast('Department deleted.');
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const id = `course-${Date.now()}`;
    setCourses(prev => [...prev, { ...courseData, id }]);
    addToast(`Course "${courseData.courseName}" created.`);
  };

  const updateCourse = (courseIdOrCourse: string | Course, update?: Partial<Course>) => {
    if (typeof courseIdOrCourse === 'string') {
      setCourses(prev => prev.map(c => c.id === courseIdOrCourse ? { ...c, ...update } : c));
    } else {
      setCourses(prev => prev.map(c => c.id === courseIdOrCourse.id ? courseIdOrCourse : c));
    }
    addToast('Course updated.');
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    addToast('Course deleted.');
  };

  // Student Attendance
  const saveStudentAttendance = (records: Omit<StudentAttendanceRecord, 'id' | 'createdAt'>[]) => {
    const timestamp = new Date().toISOString();
    const newRecords: StudentAttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `att-${Date.now()}-${i}`,
      createdAt: timestamp
    }));

    // Replace any existing attendance for same student, subject, and date
    setStudentAttendance(prev => {
      const filtered = prev.filter(
        existing => !records.some(r => r.studentId === existing.studentId && r.subjectId === existing.subjectId && r.date === existing.date)
      );
      return [...filtered, ...newRecords];
    });

    addToast(`Attendance saved for ${records.length} students successfully.`);
  };

  const markStudentAttendance = (record: { studentId: string; subjectId: string; date: string; status: AttendanceStatus; markedByStaffId: string }) => {
    saveStudentAttendance([{
      studentId: record.studentId,
      courseId: '',
      subjectId: record.subjectId,
      date: record.date,
      status: record.status,
      markedByStaffId: record.markedByStaffId
    }]);
  };

  // Staff Own Attendance
  const submitStaffAttendance = (data: { staffId?: string; date: string; checkInTime: string; checkOutTime: string; status: StaffAttendanceStatus; note?: string; remarks?: string }) => {
    const submitterStaffId = data.staffId || currentUser?.id || 'STF-101';
    const submitterName = currentUser?.name || 'Faculty Member';

    const newRecord: StaffAttendanceRecord = {
      id: `stf-att-${Date.now()}`,
      staffId: submitterStaffId,
      date: data.date,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      status: data.status,
      submissionDate: new Date().toISOString().split('T')[0],
      approvalStatus: 'Pending', // ALWAYS Pending Admin Approval as required!
      remarks: data.remarks || data.note,
      note: data.note,
      totalHours: 8
    };

    setStaffAttendance(prev => [newRecord, ...prev]);

    // Send notification to Admin
    sendNotification({
      title: 'New Staff Attendance Submission',
      message: `${submitterName} submitted attendance for ${data.date} (${data.status}). Pending your approval.`,
      targetRole: 'admin',
      type: 'approval',
      senderName: submitterName
    });

    addToast('Attendance submitted! Status: Pending Admin Approval.', 'info');
  };

  const reviewStaffAttendance = (recordId: string, approvalStatus: StaffApprovalStatus, remarks?: string) => {
    const record = staffAttendance.find(r => r.id === recordId);
    if (!record) return;

    setStaffAttendance(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          approvalStatus,
          reviewedByAdminId: currentUser?.id || 'admin-1',
          remarks: remarks || r.remarks
        };
      }
      return r;
    }));

    // Send notification to staff member
    const staff = staffList.find(s => s.id === record.staffId);
    sendNotification({
      title: `Attendance ${approvalStatus}`,
      message: `Your attendance submission for ${record.date} was marked as ${approvalStatus} by University Administration.`,
      targetRole: 'staff',
      targetUserId: record.staffId,
      type: 'attendance',
      senderName: 'University Administration'
    });

    addToast(`Staff attendance marked as ${approvalStatus}.`, 'success');
  };

  // Fees
  const recordFeePayment = (studentId: string, paymentData: Omit<FeePayment, 'id'>) => {
    const newPayment: FeePayment = {
      ...paymentData,
      id: `pay-${Date.now()}`
    };

    setFees(prev => prev.map(fee => {
      if (fee.studentId === studentId) {
        const newPaid = fee.feesPaid + newPayment.amount;
        const newRemaining = Math.max(0, fee.totalFees - newPaid);
        const status = newRemaining === 0 ? 'Fully Paid' : (newPaid > 0 ? 'Partially Paid' : 'Unpaid');

        return {
          ...fee,
          feesPaid: newPaid,
          feesRemaining: newRemaining,
          paymentStatus: status,
          paymentHistory: [newPayment, ...fee.paymentHistory]
        };
      }
      return fee;
    }));

    const student = students.find(s => s.id === studentId);
    if (student) {
      sendNotification({
        title: 'Fee Payment Received',
        message: `Payment of ₹${paymentData.amount.toLocaleString()} has been received and verified. Reference: ${paymentData.transactionRef}`,
        targetRole: 'student',
        targetUserId: studentId,
        type: 'fee',
        senderName: 'Bursar & Finance Office'
      });
    }

    addToast(`Fee payment of ₹${paymentData.amount.toLocaleString()} recorded successfully.`);
  };

  const updateFeeRecord = (idOrFee: string | StudentFeeRecord, updateData?: Partial<StudentFeeRecord>) => {
    if (typeof idOrFee === 'string') {
      setFees(prev => prev.map(f => f.id === idOrFee ? { ...f, ...updateData } : f));
    } else {
      setFees(prev => prev.map(f => f.id === idOrFee.id ? idOrFee : f));
    }
    addToast('Fee record updated.');
  };

  // Results
  const saveResult = (resultData: Omit<AcademicResult, 'id' | 'createdAt'>) => {
    // Validation
    if (resultData.internalMarks > 30) return { success: false, message: 'Internal marks cannot exceed 30.' };
    if (resultData.externalMarks > 50) return { success: false, message: 'External marks cannot exceed 50.' };
    if (resultData.practicalMarks > 20) return { success: false, message: 'Practical marks cannot exceed 20.' };

    const total = resultData.internalMarks + resultData.externalMarks + resultData.practicalMarks;
    if (total > 100) return { success: false, message: 'Total marks cannot exceed 100.' };

    let grade = 'F';
    let gradePoints = 0;
    let resultStatus: 'Pass' | 'Fail' = 'Fail';

    if (total >= 90) { grade = 'A+'; gradePoints = 10; resultStatus = 'Pass'; }
    else if (total >= 80) { grade = 'A'; gradePoints = 9; resultStatus = 'Pass'; }
    else if (total >= 70) { grade = 'B+'; gradePoints = 8; resultStatus = 'Pass'; }
    else if (total >= 60) { grade = 'B'; gradePoints = 7; resultStatus = 'Pass'; }
    else if (total >= 50) { grade = 'C'; gradePoints = 6; resultStatus = 'Pass'; }
    else if (total >= 40) { grade = 'P'; gradePoints = 4; resultStatus = 'Pass'; }

    const newResult: AcademicResult = {
      ...resultData,
      id: `res-${Date.now()}`,
      totalMarks: total,
      grade,
      gradePoints,
      resultStatus,
      createdAt: new Date().toISOString()
    };

    setResults(prev => [newResult, ...prev]);

    // Notify student
    const student = students.find(s => s.id === resultData.studentId);
    const subject = subjects.find(s => s.id === resultData.subjectId);
    if (student) {
      sendNotification({
        title: 'New Examination Result Published',
        message: `Your result for ${subject?.subjectName || 'Course'} has been published with Grade ${grade}.`,
        targetRole: 'student',
        targetUserId: student.id,
        type: 'result',
        senderName: currentUser?.name || 'Academic Faculty'
      });
    }

    addToast(`Result uploaded for ${student?.fullName || 'student'}. Grade: ${grade}.`);
    return { success: true, message: 'Result uploaded successfully' };
  };

  const updateResult = (updated: AcademicResult) => {
    setResults(prev => prev.map(r => r.id === updated.id ? updated : r));
    addToast('Result updated.');
  };

  const deleteResult = (resultId: string) => {
    setResults(prev => prev.filter(r => r.id !== resultId));
    addToast('Result entry deleted.');
  };

  // Exams
  const createExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}`
    };
    setExams(prev => [newExam, ...prev]);

    const subject = subjects.find(s => s.id === examData.subjectId);
    sendNotification({
      title: `New Exam Scheduled: ${examData.examName}`,
      message: `${subject?.subjectName || 'Subject'} exam has been scheduled on ${examData.examDate} at ${examData.startTime} in ${examData.roomHall}.`,
      targetRole: 'student',
      type: 'exam',
      senderName: currentUser?.name || 'Examination Cell'
    });

    addToast(`Exam "${examData.examName}" scheduled and published.`);
  };

  const updateExam = (exam: Exam) => {
    setExams(prev => prev.map(e => e.id === exam.id ? exam : e));
    addToast(`Exam "${exam.examName}" updated.`);
  };

  const deleteExam = (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
    addToast('Exam deleted.');
  };

  // Certificates
  const issueCertificate = (certData: Omit<Certificate, 'id' | 'certificateId'>) => {
    const certNum = Math.floor(1000 + Math.random() * 9000);
    const certificateId = `CERT-APEX-${new Date().getFullYear()}-${certNum}`;

    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      certificateId,
      issuedByStaffId: currentUser?.role === 'staff' ? currentUser.id : undefined,
      issuedByAdminName: currentUser?.role === 'admin' ? currentUser.name : 'University Registrar'
    };

    setCertificates(prev => [newCert, ...prev]);

    const student = students.find(s => s.id === certData.studentId);
    if (student) {
      sendNotification({
        title: 'New Official Certificate Issued',
        message: `Congratulations! Your certificate "${certData.certificateTitle}" (ID: ${certificateId}) is now available for download.`,
        targetRole: 'student',
        targetUserId: student.id,
        type: 'announcement',
        senderName: 'Office of the Registrar'
      });
    }

    addToast(`Certificate issued to ${student?.fullName || 'student'} with ID ${certificateId}.`);
  };

  const deleteCertificate = (certId: string) => {
    setCertificates(prev => prev.filter(c => c.id !== certId));
    addToast('Certificate record removed.');
  };

  // Notifications
  const sendNotification = (notifData: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      status: 'active',
      senderId: currentUser?.id,
      senderRole: currentUser?.role,
      senderName: notifData.senderName || currentUser?.name || 'University Administration',
      sender: notifData.sender || notifData.senderName || currentUser?.name || 'University Administration',
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast('Notification published successfully.', 'success');
  };

  const cancelNotification = (notifId: string, reason?: string) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === notifId) {
          return {
            ...n,
            status: 'cancelled' as const,
            cancelledAt: new Date().toISOString(),
            cancelledBy: currentUser?.name || (currentUser?.role === 'admin' ? 'University Administration' : 'Faculty Member'),
            cancellationReason: reason || 'Retracted by publishing authority'
          };
        }
        return n;
      })
    );
    addToast('Notification announcement has been cancelled / retracted.', 'info');
  };

  const reactivateNotification = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === notifId) {
          return {
            ...n,
            status: 'active' as const,
            cancelledAt: undefined,
            cancelledBy: undefined,
            cancellationReason: undefined
          };
        }
        return n;
      })
    );
    addToast('Notification announcement reactivated.', 'success');
  };

  const deleteNotification = (notifId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
    addToast('Announcement record deleted.', 'info');
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    addToast('All notifications marked as read.', 'info');
  };

  // Reset database back to default seed
  const resetToDemoData = () => {
    setDepartments(initialDepartments);
    setCourses(initialCourses);
    setSubjects(initialSubjects);
    setStudents(initialStudents);
    setStaffList(initialStaff);
    setStudentAttendance(initialAttendanceRecords);
    setStaffAttendance(initialStaffAttendance);
    setFees(initialFees);
    setResults(initialResults);
    setExams(initialExams);
    setCertificates(initialCertificates);
    setNotifications(initialNotifications);
    addToast('Database has been reset to original university demo data.', 'info');
  };

  return (
    <UniversityContext.Provider
      value={{
        currentUser,
        currentStudent,
        currentStaff,
        activeRole,
        isAuthenticated,
        loginAsStudent,
        loginAsStaff,
        loginAsAdmin,
        quickLogin,
        logout,

        students,
        staffList,
        departments,
        courses,
        subjects,
        studentAttendance,
        staffAttendance,
        fees,
        feeRecords: fees,
        results,
        exams,
        certificates,
        notifications,

        getStudentAttendanceSummary,
        getStudentGPA,
        getStudentFees,
        getStudentCourses,

        addStudent,
        updateStudent,
        deleteStudent,

        addStaff,
        updateStaff,
        deleteStaff,

        addDepartment,
        updateDepartment,
        deleteDepartment,
        addCourse,
        updateCourse,
        deleteCourse,

        saveStudentAttendance,
        markStudentAttendance,
        submitStaffAttendance,
        reviewStaffAttendance,

        recordFeePayment,
        updateFeeRecord,

        saveResult,
        saveStudentResult: saveResult,
        updateResult,
        deleteResult,

        createExam,
        updateExam,
        deleteExam,

        issueCertificate,
        deleteCertificate,

        sendNotification,
        cancelNotification,
        reactivateNotification,
        deleteNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        toasts,
        addToast,
        removeToast,

        isDataLoading,
        refreshData,

        resetToDemoData
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
};
