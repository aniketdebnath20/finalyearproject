import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
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
import { apiRequest, authenticate, clearAuthToken, createCertificateId, createClientId, fetchPortalData, getAuthToken, setAuthToken } from '../services/api';

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
  loginAsStudent: (name: string, rollNumber: string) => Promise<boolean>;
  loginAsStaff: (staffId: string, name: string) => Promise<boolean>;
  loginAsAdmin: (usernameOrEmail: string, pass: string) => Promise<boolean>;
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
  addStudent: (student: Omit<Student, 'id'> & { password: string }) => { success: boolean; message: string };
  updateStudent: (studentIdOrStudent: string | Student, studentUpdate?: Partial<Student> & { password?: string }) => void;
  deleteStudent: (studentId: string) => void;

  // Staff Actions
  addStaff: (staff: Omit<Staff, 'id'> & { password: string }) => { success: boolean; message: string };
  updateStaff: (staffIdOrStaff: string | Staff, staffUpdate?: Partial<Staff> & { password?: string }) => void;
  deleteStaff: (staffId: string) => void;

  // Department & Course Actions
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (deptIdOrDept: string | Department, update?: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (courseIdOrCourse: string | Course, update?: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;

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
  refreshData: () => Promise<void>;

}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('portal_auth_user');
    return getAuthToken() && storedUser ? JSON.parse(storedUser) as User : null;
  } catch {
    return null;
  }
}

export const UniversityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Collections
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendanceRecord[]>([]);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>([]);
  const [fees, setFees] = useState<StudentFeeRecord[]>([]);
  const [results, setResults] = useState<AcademicResult[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const applyPortalData = (data: Awaited<ReturnType<typeof fetchPortalData>>) => {
    setDepartments(data.departments || []);
    setCourses(data.courses || []);
    setSubjects(data.subjects || []);
    setStudents(data.students || []);
    setStaffList(data.staff || []);
    setStudentAttendance(data.studentAttendance || []);
    setStaffAttendance(data.staffAttendance || []);
    setFees(data.fees || []);
    setResults(data.results || []);
    setExams(data.exams || []);
    setCertificates(data.certificates || []);
    setNotifications(data.notifications || []);
  };

  // Derived current user profiles
  const currentStudent = currentUser?.role === 'student' ? students.find(s => s.id === currentUser.id) || null : null;
  const currentStaff = currentUser?.role === 'staff' ? staffList.find(s => s.id === currentUser.id) || null : null;
  const activeRole = currentUser?.role || null;
  const isAuthenticated = !!currentUser;

  // Toast notification system
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = createClientId('toast');
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const [isDataLoading, setIsDataLoading] = useState<boolean>(() => Boolean(getStoredUser()));

  const loadPortalData = async () => applyPortalData(await fetchPortalData());
  const currentUserId = currentUser?.id;

  useEffect(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('apex_univ_')) localStorage.removeItem(key);
    }
    if (!currentUserId || !getAuthToken()) return;

    let active = true;
    fetchPortalData()
      .then(data => { if (active) applyPortalData(data); })
      .catch(error => {
        if (!active) return;
        clearAuthToken();
        localStorage.removeItem('portal_auth_user');
        setCurrentUser(null);
        addToast(error instanceof Error ? error.message : 'Could not load records from the API.', 'error');
      })
      .finally(() => { if (active) setIsDataLoading(false); });

    return () => { active = false; };
  }, [currentUserId]);

  const refreshData = async (): Promise<void> => {
    if (!currentUser) return;
    setIsDataLoading(true);
    try {
      await loadPortalData();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Could not refresh records.', 'error');
    } finally {
      setIsDataLoading(false);
    }
  };

  const persistUpserts = async <T extends { id: string }>(resource: string, records: T[]) => {
    if (records.length === 0) return;
    try {
      await apiRequest(`/${resource}/bulk`, { method: 'POST', body: JSON.stringify(records) });
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Could not save the record.', 'error');
      try { await loadPortalData(); } catch { /* Keep the last known UI state when the API is unavailable. */ }
    }
  };

  const persistDelete = async (resource: string, id: string) => {
    try {
      await apiRequest(`/${resource}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Could not delete the record.', 'error');
      try { await loadPortalData(); } catch { /* Keep the last known UI state when the API is unavailable. */ }
    }
  };

  const signIn = async (credentials: Parameters<typeof authenticate>[0]): Promise<boolean> => {
    try {
      const response = await authenticate(credentials);
      setAuthToken(response.token);
      localStorage.setItem('portal_auth_user', JSON.stringify(response.user));
      setIsDataLoading(true);
      setCurrentUser(response.user);
      addToast(`Welcome back, ${response.user.name}.`, 'success');
      return true;
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Sign-in failed.', 'error');
      return false;
    }
  };

  const loginAsStudent = (name: string, rollNumber: string) => signIn({ role: 'student', name, rollNumber });
  const loginAsStaff = (staffId: string, name: string) => signIn({ role: 'staff', identifier: staffId, name });
  const loginAsAdmin = (usernameOrEmail: string, pass: string) => signIn({ role: 'admin', identifier: usernameOrEmail, password: pass });

  const logout = () => {
    clearAuthToken();
    localStorage.removeItem('portal_auth_user');
    setCurrentUser(null);
    setDepartments([]); setCourses([]); setSubjects([]); setStudents([]); setStaffList([]);
    setStudentAttendance([]); setStaffAttendance([]); setFees([]); setResults([]); setExams([]);
    setCertificates([]); setNotifications([]);
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
    const subjectDetails: AttendanceSubjectDetail[] = relevantSubjects.map(sub => {
      let total = 0;
      let attended = 0;
      let missed = 0;

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
      return { gpa: 0, cgpa: 0, passStatus: 'Pass' as const, totalSubjects: 0 };
    }

    const totalPts = studentResults.reduce((acc, r) => acc + (r.gradePoints ?? 0), 0);
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
  const addStudent = (newStudentData: Omit<Student, 'id'> & { password: string }) => {
    const existing = students.find(s => s.rollNumber.toUpperCase() === newStudentData.rollNumber.trim().toUpperCase());
    if (existing) {
      return { success: false, message: `Roll Number "${newStudentData.rollNumber}" is already registered.` };
    }
    const id = createClientId('stu');
    const { password, ...studentProfile } = newStudentData;
    const newStudent: Student = {
      ...studentProfile,
      id,
      rollNumber: studentProfile.rollNumber.trim().toUpperCase()
    };

    setStudents(prev => [newStudent, ...prev]);
    void persistUpserts('students', [{ ...newStudent, password }]);

    const initialFeeRecord: StudentFeeRecord = {
      id: `fee-${id}`,
      studentId: id,
      academicYear: newStudent.academicYear,
      semester: newStudent.semester,
      totalFees: 0,
      feesPaid: 0,
      feesRemaining: 0,
      paymentStatus: 'Unpaid',
      dueDate: '',
      paymentHistory: []
    };
    setFees(prev => [initialFeeRecord, ...prev]);
    void persistUpserts('fees', [initialFeeRecord]);

    addToast(`Student "${newStudent.fullName}" enrolled successfully with Roll No ${newStudent.rollNumber}.`);
    return { success: true, message: 'Student registered successfully' };
  };

  const updateStudent = (studentIdOrStudent: string | Student, studentUpdate?: Partial<Student> & { password?: string }) => {
    const { password, ...studentChanges } = studentUpdate || {};
    const updated = typeof studentIdOrStudent === 'string'
      ? students.find(s => s.id === studentIdOrStudent) && { ...students.find(s => s.id === studentIdOrStudent)!, ...studentChanges }
      : studentIdOrStudent;
    if (!updated) return;
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    void persistUpserts('students', [password ? { ...updated, password } : updated]);
    addToast('Student profile updated.');
  };

  const deleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setStudentAttendance(prev => prev.filter(record => record.studentId !== studentId));
    setFees(prev => prev.filter(record => record.studentId !== studentId));
    setResults(prev => prev.filter(record => record.studentId !== studentId));
    setCertificates(prev => prev.filter(record => record.studentId !== studentId));
    setNotifications(prev => prev.filter(record => record.targetUserId !== studentId));
    void persistDelete('students', studentId);
    addToast(`Student ${student ? student.fullName : ''} removed.`);
  };

  // Staff CRUD
  const addStaff = (newStaffData: Omit<Staff, 'id'> & { password: string }) => {
    const existing = staffList.find(s => s.staffId.toUpperCase() === newStaffData.staffId.trim().toUpperCase());
    if (existing) {
      return { success: false, message: `Faculty ID "${newStaffData.staffId}" already exists.` };
    }
    const id = createClientId('staff');
    const { password, ...staffProfile } = newStaffData;
    const newStaff: Staff = {
      ...staffProfile,
      id,
      staffId: staffProfile.staffId.trim().toUpperCase()
    };
    setStaffList(prev => [newStaff, ...prev]);
    void persistUpserts('staff', [{ ...newStaff, password }]);
    addToast(`Faculty member "${newStaff.staffName}" added successfully.`);
    return { success: true, message: 'Staff member added successfully' };
  };

  const updateStaff = (staffIdOrStaff: string | Staff, staffUpdate?: Partial<Staff> & { password?: string }) => {
    const { password, ...staffChanges } = staffUpdate || {};
    const updated = typeof staffIdOrStaff === 'string'
      ? staffList.find(s => s.id === staffIdOrStaff) && { ...staffList.find(s => s.id === staffIdOrStaff)!, ...staffChanges }
      : staffIdOrStaff;
    if (!updated) return;
    setStaffList(prev => prev.map(s => s.id === updated.id ? updated : s));
    void persistUpserts('staff', [password ? { ...updated, password } : updated]);
    addToast('Staff details updated.');
  };

  const deleteStaff = (staffId: string) => {
    const s = staffList.find(x => x.id === staffId);
    setStaffList(prev => prev.filter(x => x.id !== staffId));
    void persistDelete('staff', staffId);
    addToast(`Staff member ${s ? s.staffName : ''} deleted.`);
  };

  // Department & Course
  const addDepartment = (deptData: Omit<Department, 'id'>) => {
    const id = `dept-${Date.now()}`;
    const added = { ...deptData, id };
    setDepartments(prev => [...prev, added]);
    void persistUpserts('departments', [added]);
    addToast(`Department "${deptData.name}" created.`);
  };

  const updateDepartment = (deptIdOrDept: string | Department, update?: Partial<Department>) => {
    const updated = typeof deptIdOrDept === 'string'
      ? departments.find(d => d.id === deptIdOrDept) && { ...departments.find(d => d.id === deptIdOrDept)!, ...update }
      : deptIdOrDept;
    if (!updated) return;
    setDepartments(prev => prev.map(d => d.id === updated.id ? updated : d));
    void persistUpserts('departments', [updated]);
    addToast('Department updated.');
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    void persistDelete('departments', id);
    addToast('Department deleted.');
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const id = `course-${Date.now()}`;
    const added = { ...courseData, id };
    setCourses(prev => [...prev, added]);
    void persistUpserts('courses', [added]);
    addToast(`Course "${courseData.courseName}" created.`);
  };

  const updateCourse = (courseIdOrCourse: string | Course, update?: Partial<Course>) => {
    const updated = typeof courseIdOrCourse === 'string'
      ? courses.find(c => c.id === courseIdOrCourse) && { ...courses.find(c => c.id === courseIdOrCourse)!, ...update }
      : courseIdOrCourse;
    if (!updated) return;
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
    void persistUpserts('courses', [updated]);
    addToast('Course updated.');
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    void persistDelete('courses', id);
    addToast('Course deleted.');
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const subject = { ...subjectData, id: createClientId('subject') };
    setSubjects(prev => [...prev, subject]);
    void persistUpserts('subjects', [subject]);
    addToast(`Subject "${subject.subjectName}" created.`);
  };

  // Student Attendance
  const saveStudentAttendance = (records: Omit<StudentAttendanceRecord, 'id' | 'createdAt'>[]) => {
    const timestamp = new Date().toISOString();
    const newRecords: StudentAttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: studentAttendance.find(existing => existing.studentId === r.studentId && existing.subjectId === r.subjectId && existing.date === r.date)?.id || `att-${Date.now()}-${i}`,
      createdAt: timestamp
    }));

    // Replace any existing attendance for same student, subject, and date
    const filtered = studentAttendance.filter(
      existing => !records.some(r => r.studentId === existing.studentId && r.subjectId === existing.subjectId && r.date === existing.date)
    );
    const nextAttendance = [...filtered, ...newRecords];
    setStudentAttendance(nextAttendance);
    void persistUpserts('studentAttendance', newRecords);

    addToast(`Attendance saved for ${records.length} students successfully.`);
  };

  const markStudentAttendance = (record: { studentId: string; subjectId: string; date: string; status: AttendanceStatus; markedByStaffId: string }) => {
    saveStudentAttendance([{
      studentId: record.studentId,
      courseId: subjects.find(subject => subject.id === record.subjectId)?.courseId || '',
      subjectId: record.subjectId,
      date: record.date,
      status: record.status,
      markedByStaffId: record.markedByStaffId
    }]);
  };

  // Staff Own Attendance
  const submitStaffAttendance = (data: { staffId?: string; date: string; checkInTime: string; checkOutTime: string; status: StaffAttendanceStatus; note?: string; remarks?: string }) => {
    const submitterStaffId = data.staffId || currentUser?.id || '';
    const submitterName = currentUser?.name || 'Faculty Member';

    const newRecord: StaffAttendanceRecord = {
      id: createClientId('stf-att'),
      staffId: submitterStaffId,
      date: data.date,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      status: data.status,
      submissionDate: new Date().toISOString().split('T')[0],
      approvalStatus: 'Pending', // ALWAYS Pending Admin Approval as required!
      remarks: data.remarks || data.note,
      note: data.note,
      totalHours: Math.max(0, (() => {
        const [inHours, inMinutes] = data.checkInTime.split(':').map(Number);
        const [outHours, outMinutes] = data.checkOutTime.split(':').map(Number);
        return (outHours * 60 + outMinutes - inHours * 60 - inMinutes) / 60;
      })())
    };

    setStaffAttendance(prev => [newRecord, ...prev]);
    void persistUpserts('staffAttendance', [newRecord]);

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

    const updatedRecord = {
      ...record,
      approvalStatus,
      reviewedByAdminId: currentUser?.id,
      remarks: remarks || record.remarks
    };
    setStaffAttendance(prev => prev.map(r => r.id === recordId ? updatedRecord : r));
    void persistUpserts('staffAttendance', [updatedRecord]);

    // Send notification to staff member
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
      id: createClientId('pay')
    };

    const updatedFees = fees.map(fee => {
      if (fee.studentId === studentId) {
        const newPaid = fee.feesPaid + newPayment.amount;
        const newRemaining = Math.max(0, fee.totalFees - newPaid);
        const status: StudentFeeRecord['paymentStatus'] = newRemaining === 0 ? 'Fully Paid' : (newPaid > 0 ? 'Partially Paid' : 'Unpaid');

        return {
          ...fee,
          feesPaid: newPaid,
          feesRemaining: newRemaining,
          paymentStatus: status,
          paymentHistory: [newPayment, ...fee.paymentHistory]
        };
      }
      return fee;
    });
    setFees(updatedFees);
    void persistUpserts('fees', updatedFees.filter(fee => fee.studentId === studentId));

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
    const updated = typeof idOrFee === 'string'
      ? fees.find(f => f.id === idOrFee) && { ...fees.find(f => f.id === idOrFee)!, ...updateData }
      : idOrFee;
    if (!updated) return;
    setFees(prev => prev.map(f => f.id === updated.id ? updated : f));
    void persistUpserts('fees', [updated]);
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
      id: createClientId('res'),
      totalMarks: total,
      grade,
      gradePoints,
      resultStatus,
      createdAt: new Date().toISOString()
    };

    setResults(prev => [newResult, ...prev]);
    void persistUpserts('results', [newResult]);

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
    void persistUpserts('results', [updated]);
    addToast('Result updated.');
  };

  const deleteResult = (resultId: string) => {
    setResults(prev => prev.filter(r => r.id !== resultId));
    void persistDelete('results', resultId);
    addToast('Result entry deleted.');
  };

  // Exams
  const createExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: createClientId('exam')
    };
    setExams(prev => [newExam, ...prev]);
    void persistUpserts('exams', [newExam]);

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
    void persistUpserts('exams', [exam]);
    addToast(`Exam "${exam.examName}" updated.`);
  };

  const deleteExam = (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
    void persistDelete('exams', examId);
    addToast('Exam deleted.');
  };

  // Certificates
  const issueCertificate = (certData: Omit<Certificate, 'id' | 'certificateId'>) => {
    const certificateId = createCertificateId();

    const newCert: Certificate = {
      ...certData,
      id: createClientId('cert'),
      certificateId,
      issuedByStaffId: currentUser?.role === 'staff' ? currentUser.id : undefined,
      issuedByAdminName: currentUser?.role === 'admin' ? currentUser.name : 'University Registrar'
    };

    setCertificates(prev => [newCert, ...prev]);
    void persistUpserts('certificates', [newCert]);

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
    void persistDelete('certificates', certId);
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
      id: createClientId('notif'),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    void persistUpserts('notifications', [newNotif]);
    addToast('Notification published successfully.', 'success');
  };

  const cancelNotification = (notifId: string, reason?: string) => {
    const updated = notifications.find(n => n.id === notifId);
    if (!updated) return;
    const cancelled = {
      ...updated,
      status: 'cancelled' as const,
      cancelledAt: new Date().toISOString(),
      cancelledBy: currentUser?.name || 'University Administration',
      cancellationReason: reason || 'Retracted by publishing authority'
    };
    setNotifications(prev => prev.map(n => n.id === notifId ? cancelled : n));
    void persistUpserts('notifications', [cancelled]);
    addToast('Notification announcement has been cancelled / retracted.', 'info');
  };

  const reactivateNotification = (notifId: string) => {
    const notification = notifications.find(n => n.id === notifId);
    if (!notification) return;
    const reactivated = { ...notification, status: 'active' as const, cancelledAt: undefined, cancelledBy: undefined, cancellationReason: undefined };
    setNotifications(prev => prev.map(n => n.id === notifId ? reactivated : n));
    void persistUpserts('notifications', [reactivated]);
    addToast('Notification announcement reactivated.', 'success');
  };

  const deleteNotification = (notifId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
    void persistDelete('notifications', notifId);
    addToast('Announcement record deleted.', 'info');
  };

  const markNotificationAsRead = (notifId: string) => {
    const notification = notifications.find(n => n.id === notifId);
    if (!notification) return;
    const updated = { ...notification, isRead: true };
    setNotifications(prev => prev.map(n => n.id === notifId ? updated : n));
    void persistUpserts('notifications', [updated]);
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    void persistUpserts('notifications', updated);
    addToast('All notifications marked as read.', 'info');
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
        addSubject,

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
