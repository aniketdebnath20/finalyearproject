import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

const { Schema } = mongoose;
const idField = { id: { type: String, default: () => randomUUID(), unique: true, index: true } };
const schemaOptions = { versionKey: false, strict: true };

function makeModel(name, fields, indexes = []) {
  const schema = new Schema({ ...idField, ...fields }, schemaOptions);
  for (const index of indexes) schema.index(index.fields, index.options);
  return mongoose.models[name] || mongoose.model(name, schema);
}

const paymentSchema = new Schema({
  id: { type: String, default: () => randomUUID() }, transactionRef: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 }, paymentDate: { type: String, required: true },
  paymentMethod: { type: String, enum: ['Net Banking', 'UPI', 'Credit Card', 'Demand Draft', 'Cash'], required: true },
  receiptNumber: { type: String, required: true }, academicYear: { type: String, required: true }, semester: { type: Number, required: true }
}, { _id: false });

export const models = {
  departments: makeModel('Department', {
    name: { type: String, required: true, trim: true }, code: { type: String, required: true, trim: true },
    headOfDepartment: { type: String, required: true }, description: { type: String, default: '' }, totalStudents: Number, totalFaculty: Number
  }, [{ fields: { code: 1 }, options: { unique: true } }]),
  courses: makeModel('Course', {
    courseCode: { type: String, required: true, trim: true }, courseName: { type: String, required: true, trim: true },
    departmentId: { type: String, required: true, index: true }, duration: { type: String, required: true }, semester: Number,
    credits: Number, assignedStaffId: String, description: String, skillsCovered: [String], careerRoles: [String], totalSemesters: Number
  }, [{ fields: { courseCode: 1 }, options: { unique: true } }]),
  subjects: makeModel('Subject', {
    subjectCode: { type: String, required: true, trim: true }, subjectName: { type: String, required: true, trim: true },
    courseId: { type: String, required: true, index: true }, departmentId: { type: String, required: true, index: true },
    semester: { type: Number, required: true }, credits: { type: Number, required: true }, staffId: { type: String, required: true, index: true },
    syllabus: String, durationHours: String, learningObjectives: [String], handsOnProjects: [String], toolsUsed: [String]
  }, [{ fields: { subjectCode: 1 }, options: { unique: true } }]),
  students: makeModel('Student', {
    fullName: { type: String, required: true, trim: true }, rollNumber: { type: String, required: true, trim: true, uppercase: true },
    studentId: { type: String, trim: true }, email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true }, dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }, address: { type: String, required: true },
    courseId: { type: String, required: true, index: true }, departmentId: { type: String, required: true, index: true },
    semester: { type: Number, required: true }, academicYear: { type: String, required: true }, admissionDate: { type: String, required: true },
    profilePhoto: { type: String, default: '' }, accountStatus: { type: String, enum: ['Active', 'Suspended', 'Alumni', 'Inactive'], default: 'Active' },
    passwordHash: { type: String, required: true, select: false }
  }, [{ fields: { rollNumber: 1 }, options: { unique: true } }, { fields: { email: 1 }, options: { unique: true } }]),
  staff: makeModel('Staff', {
    staffName: { type: String, required: true, trim: true }, staffId: { type: String, required: true, trim: true, uppercase: true },
    email: { type: String, required: true, trim: true, lowercase: true }, phone: { type: String, required: true },
    departmentId: { type: String, required: true, index: true }, designation: { type: String, required: true }, qualification: String,
    assignedCourseIds: [String], assignedSubjectIds: [String], joiningDate: { type: String, required: true }, profilePhoto: { type: String, default: '' },
    accountStatus: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' }, passwordHash: { type: String, required: true, select: false }
  }, [{ fields: { staffId: 1 }, options: { unique: true } }, { fields: { email: 1 }, options: { unique: true } }]),
  studentAttendance: makeModel('StudentAttendance', {
    studentId: { type: String, required: true, index: true }, courseId: { type: String, required: true },
    subjectId: { type: String, required: true, index: true }, date: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], required: true }, markedByStaffId: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  }, [{ fields: { studentId: 1, subjectId: 1, date: 1 }, options: { unique: true } }]),
  staffAttendance: makeModel('StaffAttendance', {
    staffId: { type: String, required: true, index: true }, date: { type: String, required: true }, checkInTime: String, checkOutTime: String,
    status: { type: String, enum: ['Present', 'Late', 'Half Day', 'Half-Day', 'Work From Home', 'Leave'], required: true },
    submissionDate: String, approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reviewedByAdminId: String, remarks: String, adminRemarks: String, totalHours: Number, note: String
  }),
  fees: makeModel('StudentFeeRecord', {
    studentId: { type: String, required: true, index: true }, academicYear: { type: String, required: true },
    semester: { type: Number, required: true }, totalFees: { type: Number, required: true, min: 0 }, feesPaid: { type: Number, default: 0, min: 0 },
    feesRemaining: { type: Number, required: true, min: 0 }, paymentStatus: { type: String, enum: ['Fully Paid', 'Partially Paid', 'Unpaid'], required: true },
    dueDate: String, paymentHistory: { type: [paymentSchema], default: [] }, lastPaymentDate: String, paymentMode: String, remarks: String
  }, [{ fields: { studentId: 1, academicYear: 1, semester: 1 }, options: { unique: true } }]),
  results: makeModel('AcademicResult', {
    studentId: { type: String, required: true, index: true }, subjectId: { type: String, required: true, index: true }, examId: String,
    semester: { type: Number, required: true }, academicYear: { type: String, required: true },
    internalMarks: { type: Number, required: true, min: 0, max: 30 }, externalMarks: { type: Number, required: true, min: 0, max: 50 },
    practicalMarks: { type: Number, required: true, min: 0, max: 20 }, totalMarks: Number, grade: String, gradePoints: Number,
    resultStatus: { type: String, enum: ['Pass', 'Fail'] }, evaluatedByStaffId: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  }),
  exams: makeModel('Exam', {
    examName: { type: String, required: true }, subjectId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true }, departmentId: { type: String, required: true, index: true },
    semester: { type: Number, required: true }, examDate: { type: String, required: true }, startTime: { type: String, required: true }, endTime: { type: String, required: true },
    roomHall: String, examType: { type: String, enum: ['Theory', 'Practical', 'Midterm', 'Final', 'Viva'], required: true },
    instructions: String, examFileUrl: String, isPublished: { type: Boolean, default: true }, createdByStaffId: { type: String, required: true }, totalMarks: Number, passingMarks: Number
  }),
  certificates: makeModel('Certificate', {
    certificateId: { type: String, required: true, unique: true }, studentId: { type: String, required: true, index: true },
    certificateTitle: { type: String, required: true }, certificateType: { type: String, enum: ['Degree', 'Merit', 'Course Completion', 'Participation', 'Achievement', 'Appreciation', 'Internship'], required: true },
    issueDate: String, issuedByStaffId: String, issuedByAdminName: String, description: { type: String, default: '' }, downloadUrl: String
  }),
  notifications: makeModel('Notification', {
    title: { type: String, required: true }, message: { type: String, required: true }, targetRole: { type: String, enum: ['all', 'student', 'staff', 'admin'], required: true },
    targetUserId: { type: String, index: true }, type: String, priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
    createdAt: { type: String, default: () => new Date().toISOString() }, isRead: { type: Boolean, default: false }, readByUserIds: { type: [String], default: [] }, senderName: String, sender: String,
    senderId: String, senderRole: String, departmentId: String, status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    cancelledAt: String, cancelledBy: String, cancellationReason: String
  }),
  admins: makeModel('Administrator', {
    name: { type: String, required: true }, email: { type: String, required: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false }, role: { type: String, default: 'admin' }
  })
};
