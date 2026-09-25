export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
  rollNumber?: string; // for student
  staffId?: string; // for staff
  departmentId?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  description: string;
  totalStudents?: number;
  totalFaculty?: number;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  departmentId: string;
  duration: string; // e.g. "4 Years", "2 Years"
  semester?: number;
  credits?: number;
  totalSemesters?: number;
  assignedStaffId?: string;
  description?: string;
  skillsCovered?: string[];
  careerRoles?: string[];
}

export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  courseId: string;
  departmentId: string;
  semester: number;
  credits: number;
  staffId: string; // faculty teaching this subject
  syllabus?: string;
  durationHours?: string;
  learningObjectives?: string[];
  handsOnProjects?: string[];
  toolsUsed?: string[];
}

export interface Student {
  id: string;
  fullName: string;
  rollNumber: string; // Unique
  studentId?: string; // e.g. STU-2024-001
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  courseId: string;
  departmentId: string;
  semester: number;
  academicYear: string; // e.g. "2023-2027"
  admissionDate: string;
  profilePhoto: string;
  accountStatus: 'Active' | 'Suspended' | 'Alumni' | 'Inactive';
}

export interface Staff {
  id: string;
  staffName: string;
  staffId: string; // Unique, e.g. STF-101
  email: string;
  phone: string;
  departmentId: string;
  designation: string; // e.g. Professor, Assistant Professor, Department Chair
  qualification?: string;
  assignedCourseIds?: string[];
  assignedSubjectIds?: string[];
  joiningDate: string;
  profilePhoto: string;
  accountStatus: 'Active' | 'On Leave' | 'Inactive';
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day';

export interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedByStaffId: string;
  createdAt: string;
}

export type StaffApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type StaffAttendanceStatus = 'Present' | 'Late' | 'Half Day' | 'Half-Day' | 'Work From Home' | 'Leave';

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: StaffAttendanceStatus;
  submissionDate: string;
  approvalStatus: StaffApprovalStatus;
  reviewedByAdminId?: string;
  remarks?: string;
  adminRemarks?: string;
  totalHours?: number;
  note?: string;
}

export interface FeePayment {
  id: string;
  transactionRef: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Net Banking' | 'UPI' | 'Credit Card' | 'Demand Draft' | 'Cash';
  receiptNumber: string;
  academicYear: string;
  semester: number;
}

export type FeePaymentStatus = 'Fully Paid' | 'Partially Paid' | 'Unpaid';

export interface StudentFeeRecord {
  id: string;
  studentId: string;
  academicYear: string;
  semester: number;
  totalFees: number;
  feesPaid: number;
  feesRemaining: number;
  paymentStatus: FeePaymentStatus;
  dueDate: string;
  paymentHistory: FeePayment[];
  lastPaymentDate?: string;
  paymentMode?: string;
  remarks?: string;
}

export type FeeRecord = StudentFeeRecord;

export interface AcademicResult {
  id: string;
  studentId: string;
  subjectId: string;
  examId?: string;
  semester: number;
  academicYear: string;
  internalMarks: number; // max 30
  externalMarks: number; // max 50
  practicalMarks: number; // max 20
  totalMarks?: number; // max 100
  grade?: string; // A+, A, B+, B, C, F
  gradePoints?: number; // 10, 9, 8, etc.
  resultStatus?: 'Pass' | 'Fail';
  evaluatedByStaffId: string;
  createdAt: string;
}

export type ExamType = 'Theory' | 'Practical' | 'Midterm' | 'Final' | 'Viva';

export interface Exam {
  id: string;
  examName: string; // e.g. "End Semester Examination 2026"
  subjectId: string;
  courseId: string;
  departmentId: string;
  semester: number;
  examDate: string;
  startTime: string;
  endTime: string;
  roomHall?: string;
  examType: ExamType;
  instructions?: string;
  examFileUrl?: string;
  isPublished?: boolean;
  createdByStaffId: string;
  totalMarks?: number;
  passingMarks?: number;
}

export type CertificateType = 'Degree' | 'Merit' | 'Course Completion' | 'Participation' | 'Achievement' | 'Appreciation' | 'Internship';

export interface Certificate {
  id: string;
  certificateId: string; // Unique, e.g. CERT-CSE-2026-042
  studentId: string;
  certificateTitle: string;
  certificateType: CertificateType;
  issueDate?: string;
  issuedByStaffId?: string;
  issuedByAdminName?: string;
  description: string;
  downloadUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | 'student' | 'staff' | 'admin';
  targetUserId?: string; // Optional specific student or staff
  type?: 'announcement' | 'exam' | 'result' | 'fee' | 'attendance' | 'approval' | 'general';
  priority?: 'normal' | 'important' | 'urgent';
  createdAt: string;
  isRead: boolean;
  senderName?: string;
  sender?: string;
  senderId?: string;
  senderRole?: 'student' | 'staff' | 'admin';
  departmentId?: string;
  status?: 'active' | 'cancelled';
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
}
