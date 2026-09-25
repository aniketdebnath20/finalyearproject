import { jsPDF } from 'jspdf';
import type { Student, Subject, AcademicResult, StudentFeeRecord, FeePayment, Department, Staff, StudentAttendanceRecord } from '../types';

/**
 * Formats currency in INR format (e.g. ₹80,000)
 */
function formatCurrency(amount: number): string {
  return `INR ${amount.toLocaleString('en-IN')}`;
}

/**
 * Generates an official Northbridge University Academic Transcript & Grade Report PDF
 */
export function generateTranscriptPDF({
  student,
  departmentName,
  results,
  subjects,
  gpaStats
}: {
  student: Student;
  departmentName: string;
  results: AcademicResult[];
  subjects: Subject[];
  gpaStats: { gpa: number; cgpa: number; passStatus: 'Pass' | 'Fail'; totalSubjects: number };
}): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Decorative border
  doc.setDrawColor(216, 211, 199);
  doc.setLineWidth(0.4);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, 275);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 271);

  // University Header Banner
  doc.setFillColor(34, 47, 59); // #222f3b
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  // University Name & Crest Text
  doc.setTextColor(233, 189, 104); // #e9bd68
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('NORTHBRIDGE UNIVERSITY', margin + 8, y + 9);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(247, 244, 235);
  doc.text('OFFICE OF THE REGISTRAR & SENATE OF EXAMINATIONS', margin + 8, y + 15);
  doc.setFontSize(7.5);
  doc.setTextColor(169, 180, 180);
  doc.text('ESTD 1892 • ACCREDITED GRADE A++ • CENTRAL CAMPUS', margin + 8, y + 20);

  // Right-aligned official document mark
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(233, 189, 104);
  doc.text('OFFICIAL RECORD', pageWidth - margin - 8, y + 10, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(247, 244, 235);
  doc.text(`REF: TRN-${student.rollNumber}`, pageWidth - margin - 8, y + 16, { align: 'right' });
  doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin - 8, y + 20, { align: 'right' });

  y += 30;

  // Document Title
  doc.setTextColor(34, 47, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('SEMESTER GRADE REPORT & ACADEMIC TRANSCRIPT', pageWidth / 2, y, { align: 'center' });
  y += 2;
  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 45, y, pageWidth / 2 + 45, y);
  y += 6;

  // Student Profile Card Box
  doc.setFillColor(251, 250, 246); // #fbfaf6
  doc.setDrawColor(225, 221, 211); // #e1ddd3
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'FD');

  const col1 = margin + 5;
  const col2 = margin + 70;
  const col3 = margin + 130;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('STUDENT FULL NAME', col1, y + 6);
  doc.text('ROLL NUMBER', col2, y + 6);
  doc.text('SCHOLAR ID', col3, y + 6);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text(student.fullName, col1, y + 11);
  doc.text(student.rollNumber, col2, y + 11);
  doc.text(student.studentId || `STU-${student.rollNumber}`, col3, y + 11);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('ACADEMIC DEPARTMENT', col1, y + 18);
  doc.text('SEMESTER & TERM', col2, y + 18);
  doc.text('ACADEMIC YEAR', col3, y + 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text(departmentName || 'Computer Science & Engineering', col1, y + 23);
  doc.text(`Semester ${student.semester}`, col2, y + 23);
  doc.text(student.academicYear || '2023–2027', col3, y + 23);

  y += 31;

  // GPA Summary Indicators (3 Cards)
  const cardW = (contentWidth - 6) / 3;

  // SGPA Card
  doc.setFillColor(246, 243, 235);
  doc.roundedRect(margin, y, cardW, 17, 1.5, 1.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('SEMESTER GPA (SGPA)', margin + 4, y + 5);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text(`${gpaStats.gpa.toFixed(2)}`, margin + 4, y + 13);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('/ 10.0 scale', margin + 26, y + 13);

  // CGPA Card
  doc.setFillColor(246, 243, 235);
  doc.roundedRect(margin + cardW + 3, y, cardW, 17, 1.5, 1.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('CUMULATIVE CGPA', margin + cardW + 7, y + 5);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text(`${gpaStats.cgpa.toFixed(2)}`, margin + cardW + 7, y + 13);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('Weighted', margin + cardW + 29, y + 13);

  // Standing Card
  doc.setFillColor(gpaStats.passStatus === 'Pass' ? 240 : 254, gpaStats.passStatus === 'Pass' ? 249 : 242, gpaStats.passStatus === 'Pass' ? 244 : 242);
  doc.roundedRect(margin + (cardW + 3) * 2, y, cardW, 17, 1.5, 1.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(gpaStats.passStatus === 'Pass' ? 47 : 176, gpaStats.passStatus === 'Pass' ? 118 : 82, gpaStats.passStatus === 'Pass' ? 109 : 69);
  doc.text('ACADEMIC STANDING', margin + (cardW + 3) * 2 + 4, y + 5);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(gpaStats.passStatus === 'Pass' ? 'PASS (CLEARED)' : 'ARREARS REMAIN', margin + (cardW + 3) * 2 + 4, y + 13);

  y += 22;

  // Table Section Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(34, 47, 59);
  doc.text('COURSE ASSESSMENT BREAKDOWN', margin, y + 3);
  y += 6;

  // Table Header Row
  doc.setFillColor(34, 47, 59);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');
  doc.setTextColor(247, 244, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);

  const cols = {
    code: margin + 3,
    title: margin + 24,
    int: margin + 96,
    ext: margin + 114,
    lab: margin + 131,
    tot: margin + 148,
    grd: margin + 163,
    pts: margin + 174
  };

  doc.text('CODE', cols.code, y + 4.5);
  doc.text('COURSE SUBJECT', cols.title, y + 4.5);
  doc.text('INTERNAL(30)', cols.int, y + 4.5, { align: 'center' });
  doc.text('THEORY(50)', cols.ext, y + 4.5, { align: 'center' });
  doc.text('LAB(20)', cols.lab, y + 4.5, { align: 'center' });
  doc.text('TOTAL', cols.tot, y + 4.5, { align: 'center' });
  doc.text('GRADE', cols.grd, y + 4.5, { align: 'center' });
  doc.text('PTS', cols.pts, y + 4.5, { align: 'center' });

  y += 7;

  // Table Body Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  results.forEach((r, idx) => {
    const sub = subjects.find(s => s.id === r.subjectId);
    const rowH = 7;
    const isEven = idx % 2 === 0;

    if (isEven) {
      doc.setFillColor(251, 250, 246);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }

    doc.setDrawColor(235, 232, 224);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowH, margin + contentWidth, y + rowH);

    doc.setTextColor(80, 90, 88);
    doc.setFont('helvetica', 'bold');
    doc.text(sub?.subjectCode || 'SUB-101', cols.code, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(34, 47, 59);
    const titleText = sub?.subjectName || 'Course Subject';
    const truncatedTitle = titleText.length > 38 ? `${titleText.substring(0, 36)}...` : titleText;
    doc.text(truncatedTitle, cols.title, y + 4.8);

    doc.setTextColor(60, 70, 68);
    doc.text(String(r.internalMarks), cols.int, y + 4.8, { align: 'center' });
    doc.text(String(r.externalMarks), cols.ext, y + 4.8, { align: 'center' });
    doc.text(String(r.practicalMarks), cols.lab, y + 4.8, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 47, 59);
    doc.text(String(r.totalMarks), cols.tot, y + 4.8, { align: 'center' });

    doc.setTextColor(47, 118, 109);
    doc.text(String(r.grade ?? 'F'), cols.grd, y + 4.8, { align: 'center' });

    doc.setTextColor(34, 47, 59);
    doc.text(String(r.gradePoints), cols.pts, y + 4.8, { align: 'center' });

    y += rowH;
  });

  // Grading Scale Key
  y += 5;
  doc.setFillColor(246, 243, 235);
  doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'F');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 130, 126);
  doc.text('GRADING BENCHMARK KEY:', margin + 4, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.text('O (Outstanding: 10) | A+ (Excellent: 9) | A (Very Good: 8) | B+ (Good: 7) | B (Above Average: 6) | C (Satisfactory: 5) | F (Re-appear: 0)', margin + 4, y + 8.5);

  y += 18;

  // Signatures & Endorsement Block
  const sigW = contentWidth / 3;

  doc.setDrawColor(180, 175, 165);
  doc.setLineWidth(0.3);

  // Signature 1
  doc.line(margin + 5, y + 14, margin + sigW - 10, y + 14);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text('Prof. Alan Roberts', margin + 5, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('Head of Department', margin + 5, y + 21.5);

  // Signature 2 (Seal)
  doc.setFillColor(246, 243, 235);
  doc.circle(margin + sigW + sigW / 2, y + 10, 8, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 155, 60);
  doc.text('NORTHBRIDGE', margin + sigW + sigW / 2, y + 9, { align: 'center' });
  doc.text('SENATE SEAL', margin + sigW + sigW / 2, y + 12, { align: 'center' });

  // Signature 3
  doc.line(margin + sigW * 2 + 10, y + 14, margin + contentWidth - 5, y + 14);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text('Dr. Miriam Cole', margin + sigW * 2 + 10, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('University Registrar & Controller', margin + sigW * 2 + 10, y + 21.5);

  y += 28;

  // Security Verification Footer
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 148, 146);
  doc.text(
    'Digitally verified and securely generated by the Northbridge University Student Information System. To authenticate this document, verify credential ref code with the Office of the Registrar.',
    pageWidth / 2,
    y,
    { align: 'center', maxWidth: contentWidth }
  );

  const filename = `Northbridge_Transcript_${student.rollNumber}.pdf`;
  doc.save(filename);
  return filename;
}

/**
 * Generates an official Northbridge University Tuition Fee Statement & Invoice PDF
 */
export function generateFeeInvoicePDF({
  student,
  departmentName,
  fee
}: {
  student: Student;
  departmentName: string;
  fee: StudentFeeRecord;
}): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const totalFees = fee.totalFees || 80000;
  const feesPaid = fee.feesPaid || 0;
  const feesRemaining = fee.feesRemaining || Math.max(0, totalFees - feesPaid);
  const paymentStatus = fee.paymentStatus || (feesRemaining === 0 ? 'Fully Paid' : feesPaid > 0 ? 'Partially Paid' : 'Unpaid');
  const invoiceNo = `INV-${new Date().getFullYear()}-${student.rollNumber.replace(/[^A-Za-z0-9]/g, '')}`;

  // Decorative border
  doc.setDrawColor(216, 211, 199);
  doc.setLineWidth(0.4);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, 275);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 271);

  // University Header Banner
  doc.setFillColor(34, 47, 59); // #222f3b
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  // University Name & Bursar Text
  doc.setTextColor(233, 189, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('NORTHBRIDGE UNIVERSITY', margin + 8, y + 9);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(247, 244, 235);
  doc.text('OFFICE OF THE BURSAR & STUDENT FINANCIAL SERVICES', margin + 8, y + 15);
  doc.setFontSize(7.5);
  doc.setTextColor(169, 180, 180);
  doc.text('CENTRAL TREASURY • FINANCIAL REGISTRY • ADMISSIONS HALL', margin + 8, y + 20);

  // Right-aligned official invoice mark
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(233, 189, 104);
  doc.text('FEE INVOICE', pageWidth - margin - 8, y + 10, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(247, 244, 235);
  doc.text(`INVOICE: ${invoiceNo}`, pageWidth - margin - 8, y + 16, { align: 'right' });
  doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin - 8, y + 20, { align: 'right' });

  y += 30;

  // Document Title
  doc.setTextColor(34, 47, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('OFFICIAL TUITION INVOICE & STATEMENT OF ACCOUNT', pageWidth / 2, y, { align: 'center' });
  y += 2;
  doc.setDrawColor(47, 118, 109);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 50, y, pageWidth / 2 + 50, y);
  y += 6;

  // Student & Billing Details Box
  doc.setFillColor(251, 250, 246);
  doc.setDrawColor(225, 221, 211);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'FD');

  const col1 = margin + 5;
  const col2 = margin + 70;
  const col3 = margin + 130;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('BILLED SCHOLAR', col1, y + 6);
  doc.text('ROLL NUMBER', col2, y + 6);
  doc.text('ACADEMIC YEAR', col3, y + 6);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text(student.fullName, col1, y + 11);
  doc.text(student.rollNumber, col2, y + 11);
  doc.text(fee.academicYear || '2025–2026', col3, y + 11);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('PROGRAM & DEPARTMENT', col1, y + 18);
  doc.text('BILLING SEMESTER', col2, y + 18);
  doc.text('DUE DATE', col3, y + 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text(departmentName || 'Computer Science & Engineering', col1, y + 23);
  doc.text(`Semester ${student.semester}`, col2, y + 23);
  doc.text(fee.dueDate || '30 Sep 2026', col3, y + 23);

  y += 31;

  // Financial Standing Metric Cards
  const cardW = (contentWidth - 6) / 3;

  // Assessed Fee Card
  doc.setFillColor(246, 243, 235);
  doc.roundedRect(margin, y, cardW, 17, 1.5, 1.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('TOTAL ASSESSED TUITION', margin + 4, y + 5);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text(formatCurrency(totalFees), margin + 4, y + 13);

  // Cleared Amount Card
  doc.setFillColor(240, 249, 244);
  doc.roundedRect(margin + cardW + 3, y, cardW, 17, 1.5, 1.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(47, 118, 109);
  doc.text('CLEARED & RECORDED', margin + cardW + 7, y + 5);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(feesPaid), margin + cardW + 7, y + 13);

  // Balance Remaining Card
  const hasRemaining = feesRemaining > 0;
  doc.setFillColor(hasRemaining ? 254 : 246, hasRemaining ? 242 : 243, hasRemaining ? 242 : 235);
  doc.roundedRect(margin + (cardW + 3) * 2, y, cardW, 17, 1.5, 1.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(hasRemaining ? 176 : 120, hasRemaining ? 82 : 130, hasRemaining ? 69 : 126);
  doc.text('OUTSTANDING DUE', margin + (cardW + 3) * 2 + 4, y + 5);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(feesRemaining), margin + (cardW + 3) * 2 + 4, y + 13);

  y += 22;

  // Itemized Fee Assessment Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(34, 47, 59);
  doc.text('ITEMIZED FEE STRUCTURE & DUES', margin, y + 3);
  y += 6;

  // Table Header
  doc.setFillColor(34, 47, 59);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');
  doc.setTextColor(247, 244, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);

  doc.text('ITEM DESCRIPTION', margin + 4, y + 4.8);
  doc.text('CATEGORY', margin + 105, y + 4.8);
  doc.text('ASSESSED (INR)', pageWidth - margin - 4, y + 4.8, { align: 'right' });

  y += 7;

  // Fee breakdown line items (proportional to total fee)
  const tuitionPortion = Math.round(totalFees * 0.65);
  const labPortion = Math.round(totalFees * 0.18);
  const libraryPortion = Math.round(totalFees * 0.06);
  const examPortion = Math.round(totalFees * 0.06);
  const amenityPortion = totalFees - (tuitionPortion + labPortion + libraryPortion + examPortion);

  const feeItems = [
    { name: 'Core Academic Tuition & Instruction', category: 'Instructional', amount: tuitionPortion },
    { name: 'Computing Lab & Laboratory Research Facilities', category: 'Laboratory', amount: labPortion },
    { name: 'University Digital Library & Subscriptions', category: 'Academic Resources', amount: libraryPortion },
    { name: 'Examination Senate Evaluation & Assessment', category: 'Examinations', amount: examPortion },
    { name: 'Student Campus Amenities & Athletic Fund', category: 'Campus Services', amount: amenityPortion }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  feeItems.forEach((item, idx) => {
    const rowH = 6.5;
    if (idx % 2 === 0) {
      doc.setFillColor(251, 250, 246);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }

    doc.setDrawColor(235, 232, 224);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowH, margin + contentWidth, y + rowH);

    doc.setTextColor(34, 47, 59);
    doc.text(item.name, margin + 4, y + 4.5);
    doc.setTextColor(120, 130, 126);
    doc.text(item.category, margin + 105, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 47, 59);
    doc.text(formatCurrency(item.amount), pageWidth - margin - 4, y + 4.5, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += rowH;
  });

  // Table Total Row
  doc.setFillColor(246, 243, 235);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(34, 47, 59);
  doc.text('TOTAL ASSESSED CHARGES', margin + 4, y + 4.8);
  doc.text(formatCurrency(totalFees), pageWidth - margin - 4, y + 4.8, { align: 'right' });

  y += 12;

  // Verified Payment Transactions Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(34, 47, 59);
  doc.text('VERIFIED PAYMENT TRANSACTIONS & RECEIPTS', margin, y + 3);
  y += 6;

  // Transaction Table Header
  doc.setFillColor(34, 47, 59);
  doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'F');
  doc.setTextColor(247, 244, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);

  doc.text('DATE', margin + 4, y + 4.3);
  doc.text('TRANSACTION REF', margin + 30, y + 4.3);
  doc.text('PAYMENT CHANNEL', margin + 85, y + 4.3);
  doc.text('RECEIPT #', margin + 130, y + 4.3);
  doc.text('AMOUNT', pageWidth - margin - 4, y + 4.3, { align: 'right' });

  y += 6.5;

  const history = fee.paymentHistory || [];

  if (history.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 148, 146);
    doc.text('No payment transactions recorded yet. Please settle pending dues before the deadline.', margin + 4, y + 6);
    y += 10;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    history.forEach((h, idx) => {
      const rowH = 6;
      if (idx % 2 === 0) {
        doc.setFillColor(251, 250, 246);
        doc.rect(margin, y, contentWidth, rowH, 'F');
      }

      doc.setDrawColor(235, 232, 224);
      doc.setLineWidth(0.2);
      doc.line(margin, y + rowH, margin + contentWidth, y + rowH);

      doc.setTextColor(100, 110, 108);
      doc.text(h.paymentDate, margin + 4, y + 4.2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 47, 59);
      doc.text(h.transactionRef, margin + 30, y + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.text(h.paymentMethod, margin + 85, y + 4.2);
      doc.text(h.receiptNumber, margin + 130, y + 4.2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(47, 118, 109);
      doc.text(formatCurrency(h.amount), pageWidth - margin - 4, y + 4.2, { align: 'right' });

      y += rowH;
    });
  }

  y += 6;

  // Status & Bursar Stamp Block
  doc.setFillColor(246, 243, 235);
  doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text('BURSAR CLEARANCE STATUS:', margin + 6, y + 6);

  doc.setFontSize(9);
  doc.setTextColor(
    paymentStatus === 'Fully Paid' ? 47 : paymentStatus === 'Partially Paid' ? 180 : 176,
    paymentStatus === 'Fully Paid' ? 118 : paymentStatus === 'Partially Paid' ? 120 : 82,
    paymentStatus === 'Fully Paid' ? 109 : paymentStatus === 'Partially Paid' ? 40 : 69
  );
  doc.text(paymentStatus.toUpperCase(), margin + 6, y + 11);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text(
    paymentStatus === 'Fully Paid'
      ? 'All semester tuition obligations are fulfilled. Student holds active examination and semester registration clearance.'
      : 'Partial or pending settlement. Please submit remaining balance to avoid late fee penalties or examination holds.',
    margin + 6,
    y + 16,
    { maxWidth: contentWidth - 45 }
  );

  // Seal badge
  doc.setFillColor(34, 47, 59);
  doc.roundedRect(pageWidth - margin - 35, y + 3, 30, 14, 1, 1, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(233, 189, 104);
  doc.text('AUDITED & CLEARED', pageWidth - margin - 20, y + 8, { align: 'center' });
  doc.setTextColor(247, 244, 235);
  doc.setFont('helvetica', 'normal');
  doc.text('FINANCE REGISTRY', pageWidth - margin - 20, y + 13, { align: 'center' });

  y += 26;

  // Security Verification Footer
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 148, 146);
  doc.text(
    'This invoice and statement of account is an officially certified electronic document produced by Northbridge University Central Bursar. No physical signature is required. Direct queries to bursar@northbridge.edu.',
    pageWidth / 2,
    y,
    { align: 'center', maxWidth: contentWidth }
  );

  const filename = `Northbridge_Fee_Invoice_${student.rollNumber}.pdf`;
  doc.save(filename);
  return filename;
}

/**
 * Generates an official payment receipt voucher PDF for a single transaction
 */
export function generatePaymentReceiptPDF({
  student,
  departmentName,
  payment,
  fee
}: {
  student: Student;
  departmentName: string;
  payment: FeePayment;
  fee: StudentFeeRecord;
}): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5' // A5 is perfect for a receipt voucher
  });

  const pageWidth = 148;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  let y = 10;

  // Decorative border
  doc.setDrawColor(216, 211, 199);
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 194);

  // Header Banner
  doc.setFillColor(34, 47, 59);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'F');

  doc.setTextColor(233, 189, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('NORTHBRIDGE UNIVERSITY', margin + 6, y + 7);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(247, 244, 235);
  doc.text('OFFICE OF THE BURSAR • OFFICIAL PAYMENT VOUCHER', margin + 6, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(233, 189, 104);
  doc.text('RECEIPT', pageWidth - margin - 6, y + 8, { align: 'right' });
  doc.setTextColor(247, 244, 235);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.receiptNumber, pageWidth - margin - 6, y + 13, { align: 'right' });

  y += 24;

  // Document Title
  doc.setTextColor(34, 47, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('FEE PAYMENT ACKNOWLEDGMENT RECEIPT', pageWidth / 2, y, { align: 'center' });
  y += 2;
  doc.setDrawColor(47, 118, 109);
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - 35, y, pageWidth / 2 + 35, y);
  y += 5;

  // Details Grid
  doc.setFillColor(251, 250, 246);
  doc.setDrawColor(225, 221, 211);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, y, contentWidth, 54, 1.5, 1.5, 'FD');

  const leftCol = margin + 5;
  const rightCol = margin + 70;

  const rows = [
    { label: 'STUDENT NAME', val: student.fullName, rLabel: 'ROLL NUMBER', rVal: student.rollNumber },
    { label: 'DEPARTMENT', val: departmentName || 'Computer Science & Engineering', rLabel: 'SEMESTER', rVal: `Semester ${payment.semester || student.semester}` },
    { label: 'TRANSACTION REF', val: payment.transactionRef, rLabel: 'PAYMENT DATE', rVal: payment.paymentDate },
    { label: 'PAYMENT CHANNEL', val: payment.paymentMethod, rLabel: 'ACADEMIC YEAR', rVal: payment.academicYear || fee.academicYear }
  ];

  let gridY = y + 5;
  rows.forEach(r => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 130, 126);
    doc.text(r.label, leftCol, gridY);
    doc.text(r.rLabel, rightCol, gridY);

    gridY += 4;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 47, 59);
    doc.text(r.val, leftCol, gridY);
    doc.text(r.rVal, rightCol, gridY);

    gridY += 7;
  });

  y += 58;

  // Amount Block
  doc.setFillColor(240, 249, 244);
  doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(47, 118, 109);
  doc.text('AMOUNT RECEIVED IN FULL SETTLEMENT', margin + 6, y + 6);

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(payment.amount), margin + 6, y + 14);

  // Cleared badge
  doc.setFillColor(47, 118, 109);
  doc.roundedRect(pageWidth - margin - 36, y + 4, 30, 12, 1, 1, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(247, 244, 235);
  doc.text('STATUS: CLEARED', pageWidth - margin - 21, y + 11.5, { align: 'center' });

  y += 26;

  // Signatures
  doc.setDrawColor(180, 175, 165);
  doc.setLineWidth(0.3);
  doc.line(margin + 5, y + 15, margin + 45, y + 15);
  doc.line(pageWidth - margin - 45, y + 15, pageWidth - margin - 5, y + 15);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text('Student Depositor', margin + 5, y + 19);
  doc.text('Authorized University Cashier', pageWidth - margin - 45, y + 19);

  y += 26;

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 148, 146);
  doc.text(
    'Official Northbridge digital payment voucher. Retain this receipt for academic clearance and examination hall ticket issuance.',
    pageWidth / 2,
    y,
    { align: 'center', maxWidth: contentWidth }
  );

  const filename = `Northbridge_Receipt_${payment.receiptNumber}.pdf`;
  doc.save(filename);
  return filename;
}

/**
 * Generates an official Northbridge University Institutional Audit & Summary Report PDF
 */
export function generateAdminAuditReportPDF({
  students,
  staffList,
  departments,
  feeRecords,
  studentAttendance,
  getStudentGPA
}: {
  students: Student[];
  staffList: Staff[];
  departments: Department[];
  feeRecords: StudentFeeRecord[];
  studentAttendance: StudentAttendanceRecord[];
  getStudentGPA: (id: string) => { gpa: number; cgpa: number; passStatus: 'Pass' | 'Fail'; totalSubjects: number };
}): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const totalFees = feeRecords.reduce((sum, f) => sum + (f.totalFees || 0), 0);
  const collectedFees = feeRecords.reduce((sum, f) => sum + (f.feesPaid || 0), 0);
  const pendingFees = feeRecords.reduce((sum, f) => sum + (f.feesRemaining || 0), 0);
  const recoveryRate = totalFees > 0 ? Math.round((collectedFees / totalFees) * 100) : 0;

  const totalStudents = students.length;
  const totalFaculty = staffList.length;
  const facultyRatio = totalFaculty > 0 ? (totalStudents / totalFaculty).toFixed(1) : 'N/A';

  const totalAttLogs = studentAttendance.length;
  const presentLogs = studentAttendance.filter(a => a.status === 'Present').length;
  const overallAttRate = totalAttLogs ? Math.round((presentLogs / totalAttLogs) * 100) : 85;

  let totalGpaSum = 0;
  let clearedCount = 0;
  students.forEach(s => {
    const { gpa, passStatus } = getStudentGPA(s.id);
    totalGpaSum += gpa;
    if (passStatus === 'Pass') clearedCount++;
  });
  const meanGpa = totalStudents > 0 ? (totalGpaSum / totalStudents).toFixed(2) : '0.00';
  const passRate = totalStudents > 0 ? Math.round((clearedCount / totalStudents) * 100) : 0;

  // --- PAGE 1: Letterhead, KPIs & Financial Treasury ---
  // Border
  doc.setDrawColor(216, 211, 199);
  doc.setLineWidth(0.4);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, 275);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 271);

  // Header Banner
  doc.setFillColor(34, 47, 59); // #222f3b
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  doc.setTextColor(233, 189, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('NORTHBRIDGE UNIVERSITY', margin + 8, y + 9);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(247, 244, 235);
  doc.text('OFFICE OF THE REGISTRAR & SENATE OF FINANCIAL PLANNING', margin + 8, y + 15);
  doc.setFontSize(7);
  doc.setTextColor(169, 180, 180);
  doc.text('ESTD 1892 • NAAC GRADE A++ ACCREDITED • CENTRAL RESEARCH PARK', margin + 8, y + 20);

  // Right-aligned official document mark
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(233, 189, 104);
  doc.text('EXECUTIVE AUDIT', pageWidth - margin - 8, y + 9, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(247, 244, 235);
  doc.text('REF: AUD-REG-2026-FAS', pageWidth - margin - 8, y + 15, { align: 'right' });
  doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin - 8, y + 20, { align: 'right' });

  y += 29;

  // Title
  doc.setTextColor(34, 47, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ANNUAL INSTITUTIONAL AUDIT & EXECUTIVE SUMMARY', pageWidth / 2, y, { align: 'center' });
  y += 2;
  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.7);
  doc.line(pageWidth / 2 - 50, y, pageWidth / 2 + 50, y);
  y += 5;

  // 4 KPI Cards
  const kpiW = (contentWidth - 6) / 4;
  const kpis = [
    { label: 'TOTAL SCHOLARS', val: `${totalStudents}`, sub: `${departments.length} Departments` },
    { label: 'FACULTY APPOINTMENTS', val: `${totalFaculty}`, sub: `${facultyRatio}:1 Student/Staff` },
    { label: 'REALIZED REVENUE', val: formatCurrency(collectedFees), sub: `${recoveryRate}% of Total` },
    { label: 'CAMPUS ATTENDANCE', val: `${overallAttRate}%`, sub: `${passRate}% pass rate • Avg GPA ${meanGpa}` }
  ];

  kpis.forEach((kpi, idx) => {
    const kx = margin + idx * (kpiW + 2);
    doc.setFillColor(248, 246, 240);
    doc.roundedRect(kx, y, kpiW, 16, 1, 1, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 130, 126);
    doc.text(kpi.label, kx + 3, y + 4.5);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 47, 59);
    doc.text(kpi.val, kx + 3, y + 10.5);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 110, 108);
    doc.text(kpi.sub, kx + 3, y + 14.5);
  });

  y += 21;

  // SECTION 1: FINANCIAL TREASURY
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(34, 47, 59);
  doc.text('SECTION 01: TUITION TREASURY & DEPARTMENTAL RECOVERY', margin, y + 3);
  y += 6;

  // Table Header
  doc.setFillColor(34, 47, 59);
  doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'F');
  doc.setTextColor(247, 244, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);

  doc.text('DEPARTMENT', margin + 3, y + 4.3);
  doc.text('CODE', margin + 65, y + 4.3, { align: 'center' });
  doc.text('SCHOLARS', margin + 85, y + 4.3, { align: 'center' });
  doc.text('ASSESSED (INR)', margin + 115, y + 4.3, { align: 'right' });
  doc.text('REALIZED (INR)', margin + 145, y + 4.3, { align: 'right' });
  doc.text('OUTSTANDING (INR)', margin + 175, y + 4.3, { align: 'right' });
  doc.text('RATE', pageWidth - margin - 3, y + 4.3, { align: 'right' });

  y += 6.5;

  // Table Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  departments.forEach((d, idx) => {
    const rowH = 6;
    if (idx % 2 === 0) {
      doc.setFillColor(251, 250, 246);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }

    doc.setDrawColor(235, 232, 224);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowH, margin + contentWidth, y + rowH);

    const dStudents = students.filter(s => s.departmentId === d.id);
    const dIds = new Set(dStudents.map(s => s.id));
    const dFees = feeRecords.filter(f => dIds.has(f.studentId));
    const dAssessed = dFees.reduce((sum, f) => sum + (f.totalFees || 0), 0);
    const dRealized = dFees.reduce((sum, f) => sum + (f.feesPaid || 0), 0);
    const dPending = dFees.reduce((sum, f) => sum + (f.feesRemaining || 0), 0);
    const dRate = dAssessed > 0 ? Math.round((dRealized / dAssessed) * 100) : 0;

    doc.setTextColor(34, 47, 59);
    doc.text(d.name, margin + 3, y + 4.2);
    doc.text(d.code, margin + 65, y + 4.2, { align: 'center' });
    doc.text(String(dStudents.length), margin + 85, y + 4.2, { align: 'center' });
    doc.text(formatCurrency(dAssessed), margin + 115, y + 4.2, { align: 'right' });
    doc.text(formatCurrency(dRealized), margin + 145, y + 4.2, { align: 'right' });
    doc.text(formatCurrency(dPending), margin + 175, y + 4.2, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`${dRate}%`, pageWidth - margin - 3, y + 4.2, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += rowH;
  });

  // Table Total
  doc.setFillColor(246, 243, 235);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(34, 47, 59);
  doc.text('CAMPUS TREASURY TOTALS', margin + 3, y + 4.3);
  doc.text(String(totalStudents), margin + 85, y + 4.3, { align: 'center' });
  doc.text(formatCurrency(totalFees), margin + 115, y + 4.3, { align: 'right' });
  doc.text(formatCurrency(collectedFees), margin + 145, y + 4.3, { align: 'right' });
  doc.text(formatCurrency(pendingFees), margin + 175, y + 4.3, { align: 'right' });
  doc.text(`${recoveryRate}%`, pageWidth - margin - 3, y + 4.3, { align: 'right' });

  y += 12;

  // SECTION 2: ACADEMIC STANDING & COHORTS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(34, 47, 59);
  doc.text('SECTION 02: ACADEMIC STANDING & COHORT DISTRIBUTION', margin, y + 3);
  y += 6;

  // GPA Spectrum summary table
  doc.setFillColor(34, 47, 59);
  doc.roundedRect(margin, y, contentWidth, 6, 1, 1, 'F');
  doc.setTextColor(247, 244, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('ACADEMIC STANDING TIER', margin + 3, y + 4.2);
  doc.text('GRADE BENCHMARK', margin + 80, y + 4.2);
  doc.text('SCHOLAR COUNT', margin + 135, y + 4.2, { align: 'center' });
  doc.text('% OF TOTAL COHORT', pageWidth - margin - 3, y + 4.2, { align: 'right' });

  y += 6;

  const gpaTiers = [
    { name: 'High Honors (GPA 9.0 – 10.0)', grade: 'O (Outstanding)', min: 9.0, max: 10.0 },
    { name: 'First Class with Distinction (GPA 8.0 – 8.9)', grade: 'A+ (Distinction)', min: 8.0, max: 8.99 },
    { name: 'First Class (GPA 7.0 – 7.9)', grade: 'A (Very Good)', min: 7.0, max: 7.99 },
    { name: 'Second Class / Academic Caution (GPA < 7.0)', grade: 'B/C (Passing/Review)', min: 0, max: 6.99 }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  gpaTiers.forEach((tier, idx) => {
    const count = students.filter(s => {
      const { gpa } = getStudentGPA(s.id);
      return gpa >= tier.min && gpa <= tier.max;
    }).length;
    const pct = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) : '0.0';

    const rowH = 5.5;
    if (idx % 2 === 0) {
      doc.setFillColor(251, 250, 246);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }

    doc.setDrawColor(235, 232, 224);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowH, margin + contentWidth, y + rowH);

    doc.setTextColor(34, 47, 59);
    doc.text(tier.name, margin + 3, y + 3.8);
    doc.setTextColor(120, 130, 126);
    doc.text(tier.grade, margin + 80, y + 3.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 47, 59);
    doc.text(String(count), margin + 135, y + 3.8, { align: 'center' });
    doc.text(`${pct}%`, pageWidth - margin - 3, y + 3.8, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += rowH;
  });

  y += 9;

  // Signatures & Endorsements
  const sigColW = contentWidth / 3;
  doc.setDrawColor(180, 175, 165);
  doc.setLineWidth(0.3);

  // Sig 1
  doc.line(margin + 5, y + 13, margin + sigColW - 10, y + 13);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text('Dr. Eleanor Vance', margin + 5, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('Dean of Academic Affairs & Senate', margin + 5, y + 20.5);

  // Seal (Center)
  doc.setFillColor(246, 243, 235);
  doc.circle(margin + sigColW + sigColW / 2, y + 10, 8, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 155, 60);
  doc.text('NORTHBRIDGE', margin + sigColW + sigColW / 2, y + 9, { align: 'center' });
  doc.text('AUDIT SEAL', margin + sigColW + sigColW / 2, y + 12, { align: 'center' });

  // Sig 2
  doc.line(margin + sigColW * 2 + 10, y + 13, margin + contentWidth - 5, y + 13);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 47, 59);
  doc.text('Marcus Thorne, CPA', margin + sigColW * 2 + 10, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 126);
  doc.text('University Comptroller & Chief Bursar', margin + sigColW * 2 + 10, y + 20.5);

  y += 26;

  // Security Note
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 148, 146);
  doc.text(
    'Official Northbridge University Institutional Audit & Performance Summary. Digitally certified for academic regulatory bodies, statutory submissions, and internal senate records.',
    pageWidth / 2,
    y,
    { align: 'center', maxWidth: contentWidth }
  );

  const filename = `Northbridge_Institutional_Audit_Report_${new Date().getFullYear()}.pdf`;
  doc.save(filename);
  return filename;
}
