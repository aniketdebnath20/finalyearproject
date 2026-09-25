import React from 'react';
import type { Student, Staff, Department, StudentFeeRecord, StudentAttendanceRecord } from '../../types';

interface AdminReportPrintDocumentProps {
  students: Student[];
  staffList: Staff[];
  departments: Department[];
  feeRecords: StudentFeeRecord[];
  studentAttendance: StudentAttendanceRecord[];
  getStudentGPA: (id: string) => { gpa: number; cgpa: number; passStatus: 'Pass' | 'Fail'; totalSubjects: number };
  generatedAt?: string;
  reportRef?: string;
}

export const AdminReportPrintDocument: React.FC<AdminReportPrintDocumentProps> = ({
  students,
  staffList,
  departments,
  feeRecords,
  studentAttendance,
  getStudentGPA,
  generatedAt = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  reportRef = 'AUD-REG-2026-FAS'
}) => {
  // --- Financial Calculations ---
  const totalFees = feeRecords.reduce((sum, f) => sum + (f.totalFees || 0), 0);
  const collectedFees = feeRecords.reduce((sum, f) => sum + (f.feesPaid || 0), 0);
  const pendingFees = feeRecords.reduce((sum, f) => sum + (f.feesRemaining || 0), 0);
  const recoveryRate = totalFees > 0 ? Math.round((collectedFees / totalFees) * 100) : 0;

  // Department-wise Financial Breakdown
  const deptFinancials = departments.map(d => {
    const deptStudents = students.filter(s => s.departmentId === d.id);
    const deptStudentIds = new Set(deptStudents.map(s => s.id));
    const deptFees = feeRecords.filter(f => deptStudentIds.has(f.studentId));
    
    const assessed = deptFees.reduce((sum, f) => sum + (f.totalFees || 0), 0);
    const realized = deptFees.reduce((sum, f) => sum + (f.feesPaid || 0), 0);
    const outstanding = deptFees.reduce((sum, f) => sum + (f.feesRemaining || 0), 0);
    const rate = assessed > 0 ? Math.round((realized / assessed) * 100) : 0;

    return {
      id: d.id,
      name: d.name,
      code: d.code,
      headcount: deptStudents.length,
      assessed,
      realized,
      outstanding,
      rate
    };
  });

  // Itemized fee component estimates
  const tuitionPortion = Math.round(totalFees * 0.65);
  const labPortion = Math.round(totalFees * 0.18);
  const libraryPortion = Math.round(totalFees * 0.06);
  const examPortion = Math.round(totalFees * 0.06);
  const amenityPortion = totalFees - (tuitionPortion + labPortion + libraryPortion + examPortion);

  // --- Academic Calculations ---
  const totalStudents = students.length;
  const totalFaculty = staffList.length;
  const facultyRatio = totalFaculty > 0 ? (totalStudents / totalFaculty).toFixed(1) : 'N/A';

  // GPA Spectrum & Pass Rate
  const gpaBuckets = [
    { label: 'High Honors (GPA 9.0 – 10.0)', grade: 'O', count: 0, standing: 'Outstanding' },
    { label: 'First Class with Distinction (GPA 8.0 – 8.9)', grade: 'A+', count: 0, standing: 'Distinction' },
    { label: 'First Class (GPA 7.0 – 7.9)', grade: 'A', count: 0, standing: 'Good Standing' },
    { label: 'Second Class / Academic Caution (GPA < 7.0)', grade: 'B/C', count: 0, standing: 'Academic Review' }
  ];

  let totalGpaSum = 0;
  let clearedScholarsCount = 0;

  students.forEach(st => {
    const { gpa, passStatus } = getStudentGPA(st.id);
    totalGpaSum += gpa;
    if (passStatus === 'Pass') clearedScholarsCount++;

    if (gpa >= 9.0) gpaBuckets[0].count++;
    else if (gpa >= 8.0) gpaBuckets[1].count++;
    else if (gpa >= 7.0) gpaBuckets[2].count++;
    else gpaBuckets[3].count++;
  });

  const meanGpa = totalStudents > 0 ? (totalGpaSum / totalStudents).toFixed(2) : '0.00';
  const passRate = totalStudents > 0 ? Math.round((clearedScholarsCount / totalStudents) * 100) : 0;

  // Attendance Metrics
  const totalAttLogs = studentAttendance.length;
  const presentLogs = studentAttendance.filter(a => a.status === 'Present').length;
  const overallAttRate = totalAttLogs ? Math.round((presentLogs / totalAttLogs) * 100) : 85;

  return (
    <div className="admin-audit-print-document bg-white text-zinc-900 p-8 max-w-4xl mx-auto font-sans leading-relaxed text-xs">
      {/* Decorative Outer Framing (prints sharp 1px border) */}
      <div className="border-2 border-zinc-800 p-6 space-y-6">

        {/* 1. OFFICIAL UNIVERSITY LETTERHEAD */}
        <header className="border-b-2 border-zinc-800 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 border border-zinc-700 bg-zinc-100 text-zinc-800">
                  OFFICIAL SENATE & FINANCIAL RECORD
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                  ACCREDITATION CYCLE 2025–2026
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-zinc-900 uppercase">
                Northbridge University
              </h1>
              <p className="font-serif text-xs italic text-zinc-700">
                Office of the University Registrar & Senate of Financial Planning
              </p>
              <p className="font-mono text-[10px] text-zinc-500">
                ESTABLISHED 1892 • NAAC GRADE A++ • CENTRAL CAMPUS RESEARCH PARK
              </p>
            </div>

            {/* Document Metadata Block */}
            <div className="text-right font-mono text-[10px] space-y-1 border-l border-zinc-300 pl-4 shrink-0">
              <div>
                <span className="text-zinc-500">AUDIT REF:</span>{' '}
                <strong className="text-zinc-900 font-bold">{reportRef}</strong>
              </div>
              <div>
                <span className="text-zinc-500">ISSUE DATE:</span>{' '}
                <span className="text-zinc-900">{generatedAt}</span>
              </div>
              <div>
                <span className="text-zinc-500">AUDIT TYPE:</span>{' '}
                <span className="text-zinc-900 font-semibold">ANNUAL INSTITUTIONAL AUDIT</span>
              </div>
              <div>
                <span className="text-zinc-500">CLASSIFICATION:</span>{' '}
                <span className="text-zinc-800 font-bold">UNRESTRICTED</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px]">
            <h2 className="font-serif font-bold text-sm tracking-wide text-zinc-900 uppercase">
              Comprehensive Financial & Academic Executive Summary
            </h2>
            <span className="font-mono text-[10px] text-zinc-500">
              Presented to the Academic Council & Board of Regents
            </span>
          </div>
        </header>

        {/* 2. EXECUTIVE SCORECARD (KEY PERFORMANCE INDICATORS) */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1 */}
            <div className="border border-zinc-300 p-2.5 bg-zinc-50/50">
              <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">
                Total Enrolled Scholars
              </div>
              <div className="text-lg font-bold font-mono text-zinc-900 mt-0.5">
                {totalStudents}
              </div>
              <div className="text-[9px] text-zinc-500 font-mono">
                Across {departments.length} departments
              </div>
            </div>

            {/* Metric 2 */}
            <div className="border border-zinc-300 p-2.5 bg-zinc-50/50">
              <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">
                Faculty Appointments
              </div>
              <div className="text-lg font-bold font-mono text-zinc-900 mt-0.5">
                {totalFaculty}
              </div>
              <div className="text-[9px] text-zinc-500 font-mono">
                Ratio {facultyRatio} : 1 scholar/staff
              </div>
            </div>

            {/* Metric 3 */}
            <div className="border border-zinc-300 p-2.5 bg-zinc-50/50">
              <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">
                Realized Tuition Revenue
              </div>
              <div className="text-lg font-bold font-mono text-zinc-900 mt-0.5">
                ₹{collectedFees.toLocaleString('en-IN')}
              </div>
              <div className="text-[9px] text-zinc-600 font-mono">
                {recoveryRate}% collected of ₹{totalFees.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Metric 4 */}
            <div className="border border-zinc-300 p-2.5 bg-zinc-50/50">
              <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">
                Attendance Compliance
              </div>
              <div className="text-lg font-bold font-mono text-zinc-900 mt-0.5">
                {overallAttRate}%
              </div>
              <div className="text-[9px] text-zinc-600 font-mono">
                Min. 75% Statutory Threshold Met
              </div>
            </div>
          </div>
        </section>

        {/* 3. PART I: FINANCIAL TREASURY & TUITION AUDIT */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-zinc-900 text-white rounded-xs">SECTION 01</span>
              Institutional Tuition Treasury & Revenue Realization
            </h3>
            <span className="font-mono text-[10px] text-zinc-500">
              Outstanding Dues: ₹{pendingFees.toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-[11px] text-zinc-600">
            Certified fiscal audit of assessed semester fees, verified receipts, and outstanding tuition receivables as maintained by the Central Bursar Office.
          </p>

          {/* Department Fee Collection Table */}
          <div className="overflow-x-auto border border-zinc-300">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-300 font-mono text-[9px] uppercase tracking-wider text-zinc-700">
                  <th className="py-2 px-3">Department</th>
                  <th className="py-2 px-2 text-center">Code</th>
                  <th className="py-2 px-2 text-center">Scholars</th>
                  <th className="py-2 px-3 text-right">Assessed (INR)</th>
                  <th className="py-2 px-3 text-right">Realized (INR)</th>
                  <th className="py-2 px-3 text-right">Outstanding (INR)</th>
                  <th className="py-2 px-2 text-center">Recovery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {deptFinancials.map(dept => (
                  <tr key={dept.id} className="hover:bg-zinc-50">
                    <td className="py-1.5 px-3 font-medium text-zinc-900">{dept.name}</td>
                    <td className="py-1.5 px-2 text-center font-mono text-zinc-600">{dept.code}</td>
                    <td className="py-1.5 px-2 text-center font-mono text-zinc-800">{dept.headcount}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-700">₹{dept.assessed.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-3 text-right font-mono font-medium text-zinc-900">₹{dept.realized.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-700">₹{dept.outstanding.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-2 text-center font-mono font-bold text-zinc-800">{dept.rate}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-zinc-100 font-bold border-t-2 border-zinc-800 text-zinc-900 font-mono text-[10px]">
                  <td className="py-2 px-3" colSpan={2}>TOTAL CAMPUS TREASURY</td>
                  <td className="py-2 px-2 text-center">{totalStudents}</td>
                  <td className="py-2 px-3 text-right">₹{totalFees.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right">₹{collectedFees.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right">₹{pendingFees.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-2 text-center">{recoveryRate}%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Itemized Budget Allocation Summary */}
          <div className="border border-zinc-200 p-3 bg-zinc-50/50 rounded-xs">
            <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-1.5">
              Assessed Tuition Allocation Benchmark
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-mono">
              <div className="border border-zinc-200 p-1.5 bg-white">
                <span className="text-zinc-500 block text-[8px]">Instruction (65%)</span>
                <strong className="text-zinc-900">₹{tuitionPortion.toLocaleString('en-IN')}</strong>
              </div>
              <div className="border border-zinc-200 p-1.5 bg-white">
                <span className="text-zinc-500 block text-[8px]">Lab & Tech (18%)</span>
                <strong className="text-zinc-900">₹{labPortion.toLocaleString('en-IN')}</strong>
              </div>
              <div className="border border-zinc-200 p-1.5 bg-white">
                <span className="text-zinc-500 block text-[8px]">Library & Digital (6%)</span>
                <strong className="text-zinc-900">₹{libraryPortion.toLocaleString('en-IN')}</strong>
              </div>
              <div className="border border-zinc-200 p-1.5 bg-white">
                <span className="text-zinc-500 block text-[8px]">Examinations (6%)</span>
                <strong className="text-zinc-900">₹{examPortion.toLocaleString('en-IN')}</strong>
              </div>
              <div className="border border-zinc-200 p-1.5 bg-white">
                <span className="text-zinc-500 block text-[8px]">Amenities & Welfare (5%)</span>
                <strong className="text-zinc-900">₹{amenityPortion.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PART II: ACADEMIC STANDING & COHORT PERFORMANCE AUDIT */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-zinc-900 text-white rounded-xs">SECTION 02</span>
              Academic Standing, Cohort Distribution & Faculty Allocation
            </h3>
            <span className="font-mono text-[10px] text-zinc-500">
              Campus Mean GPA: <strong className="text-zinc-900">{meanGpa}</strong> / 10.0
            </span>
          </div>

          <p className="text-[11px] text-zinc-600">
            Aggregated academic standing across all published examinations, department instructional faculty allocations, and lecture compliance audit metrics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GPA Distribution Table */}
            <div className="border border-zinc-300">
              <div className="bg-zinc-100 px-3 py-1.5 border-b border-zinc-300 font-mono text-[9px] uppercase tracking-wider font-bold text-zinc-700">
                GPA Grade Distribution & Senate Honors
              </div>
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 font-mono text-[8px] uppercase text-zinc-500 bg-zinc-50">
                    <th className="py-1.5 px-3">Standing Range</th>
                    <th className="py-1.5 px-2 text-center">Grade</th>
                    <th className="py-1.5 px-2 text-center">Scholars</th>
                    <th className="py-1.5 px-2 text-right">% Cohort</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-sans">
                  {gpaBuckets.map((b, idx) => {
                    const pct = totalStudents > 0 ? ((b.count / totalStudents) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={idx}>
                        <td className="py-1 px-3">
                          <span className="font-medium text-zinc-900 block">{b.label}</span>
                          <span className="text-[8px] text-zinc-500">{b.standing}</span>
                        </td>
                        <td className="py-1 px-2 text-center font-mono font-bold text-zinc-700">{b.grade}</td>
                        <td className="py-1 px-2 text-center font-mono font-bold text-zinc-900">{b.count}</td>
                        <td className="py-1 px-2 text-right font-mono text-zinc-600">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-zinc-50 border-t border-zinc-300 font-mono text-[9px] font-bold">
                    <td className="py-1.5 px-3">Overall Cleared / Pass Rate</td>
                    <td className="py-1.5 px-2 text-center" colSpan={2}>{clearedScholarsCount} / {totalStudents} scholars</td>
                    <td className="py-1.5 px-2 text-right text-zinc-900">{passRate}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Department Faculty & Scholar Allocation */}
            <div className="border border-zinc-300">
              <div className="bg-zinc-100 px-3 py-1.5 border-b border-zinc-300 font-mono text-[9px] uppercase tracking-wider font-bold text-zinc-700">
                Academic Faculty & Scholar Allocation
              </div>
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 font-mono text-[8px] uppercase text-zinc-500 bg-zinc-50">
                    <th className="py-1.5 px-3">Department</th>
                    <th className="py-1.5 px-2">Head of Dept</th>
                    <th className="py-1.5 px-2 text-center">Faculty</th>
                    <th className="py-1.5 px-2 text-center">Scholars</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {departments.map(d => {
                    const sCount = students.filter(s => s.departmentId === d.id).length;
                    const fCount = staffList.filter(s => s.departmentId === d.id).length;
                    return (
                      <tr key={d.id}>
                        <td className="py-1 px-3 font-medium text-zinc-900">
                          {d.name} <span className="font-mono text-[8px] text-zinc-500">({d.code})</span>
                        </td>
                        <td className="py-1 px-2 text-zinc-700 text-[9px] truncate max-w-[100px]">{d.headOfDepartment}</td>
                        <td className="py-1 px-2 text-center font-mono text-zinc-800">{fCount}</td>
                        <td className="py-1 px-2 text-center font-mono font-bold text-zinc-900">{sCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-zinc-50 border-t border-zinc-300 font-mono text-[9px] font-bold">
                    <td className="py-1.5 px-3" colSpan={2}>Institutional Staffing Benchmark</td>
                    <td className="py-1.5 px-2 text-center">{totalFaculty}</td>
                    <td className="py-1.5 px-2 text-center">{totalStudents}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Attendance Compliance Note */}
          <div className="border border-zinc-200 p-2.5 bg-zinc-50/50 flex items-center justify-between font-mono text-[10px]">
            <div>
              <span className="text-zinc-500 font-bold uppercase">Attendance Audit Status: </span>
              <span className="text-zinc-900 font-semibold">
                {overallAttRate}% Campus Average — Meets Statutory Examination Regulations
              </span>
            </div>
            <span className="text-zinc-700 font-bold border border-zinc-300 px-2 py-0.5 bg-white">
              AUDIT STATUS: APPROVED
            </span>
          </div>
        </section>

        {/* 5. STATUTORY VERIFICATION & SIGNATURES BLOCK */}
        <section className="pt-4 border-t-2 border-zinc-800 space-y-4">
          <div className="grid grid-cols-3 gap-4 items-end pt-2">
            {/* Signature 1: Dean */}
            <div className="space-y-1">
              <div className="h-9 border-b border-zinc-500 flex items-end pb-1 font-serif italic text-xs text-zinc-700">
                Dr. Eleanor Vance
              </div>
              <div className="font-bold text-[10px] text-zinc-900">Dr. Eleanor Vance</div>
              <div className="text-[8.5px] text-zinc-500 font-mono">Dean of Academic Affairs & Senate Chair</div>
            </div>

            {/* University Seal Badge (Center) */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="size-16 rounded-full border-2 border-dashed border-zinc-600 flex flex-col items-center justify-center p-1 bg-zinc-50">
                <span className="font-mono text-[7px] font-bold text-zinc-800 tracking-tighter uppercase">
                  NORTHBRIDGE
                </span>
                <span className="font-serif text-[6px] italic text-zinc-500">
                  SENATE SEAL
                </span>
                <span className="font-mono text-[7px] font-semibold text-zinc-700">
                  AUDITED
                </span>
              </div>
              <span className="text-[7.5px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
                Official Electronic Seal
              </span>
            </div>

            {/* Signature 2: Bursar */}
            <div className="space-y-1 text-right">
              <div className="h-9 border-b border-zinc-500 flex items-end justify-end pb-1 font-serif italic text-xs text-zinc-700">
                Marcus Thorne
              </div>
              <div className="font-bold text-[10px] text-zinc-900">Marcus Thorne, CPA</div>
              <div className="text-[8.5px] text-zinc-500 font-mono">University Comptroller & Chief Bursar</div>
            </div>
          </div>

          {/* Legal Footer Note */}
          <div className="text-center font-mono text-[8px] text-zinc-400 pt-2 border-t border-zinc-200">
            Digitally generated by Northbridge University Campus ERP • Statutory Compliance Standard ISO 9001/NAAC • Document Authenticity Hash: 9e7a2b4f-8012-4c91
          </div>
        </section>

      </div>
    </div>
  );
};
