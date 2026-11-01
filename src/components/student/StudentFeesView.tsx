import React from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { StudentFeesSkeleton } from '../common/Skeleton';
import {
  CreditCard,
  Printer,
  Download
} from 'lucide-react';

interface StudentFeesViewProps {
  isLoading?: boolean;
}

export const StudentFeesView: React.FC<StudentFeesViewProps> = ({ isLoading }) => {
  const { currentStudent, getStudentFees, departments, addToast, isDataLoading } = useUniversity();

  if (isLoading || isDataLoading) {
    return <StudentFeesSkeleton />;
  }

  if (!currentStudent) return null;

  const fee = getStudentFees(currentStudent.id);
  const studentDept = departments.find(d => d.id === currentStudent.departmentId);

  const totalFees = fee?.totalFees ?? 0;
  const feesPaid = fee?.feesPaid || 0;
  const feesRemaining = fee?.feesRemaining ?? Math.max(0, totalFees - feesPaid);
  const percentagePaid = totalFees > 0 ? Math.round((feesPaid / totalFees) * 100) : 0;
  const paymentStatus = fee?.paymentStatus ?? (totalFees === 0 ? 'Unpaid' : feesRemaining === 0 ? 'Fully Paid' : feesPaid > 0 ? 'Partially Paid' : 'Unpaid');

  const history = fee?.paymentHistory || [];

  const handlePrint = () => {
    addToast('Print fee statement is an upcoming feature.', 'info');
  };

  const handleDownloadDocument = () => {
    addToast('Document download is an upcoming feature.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Institutional Bursar
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Tuition Ledger & Payments
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Roll: <strong className="text-zinc-800">{currentStudent.rollNumber}</strong> • Academic Year {fee?.academicYear || currentStudent.academicYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <span className={`px-2.5 py-1 rounded text-xs font-mono font-medium uppercase tracking-wide border mr-1 ${
            paymentStatus === 'Fully Paid'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : paymentStatus === 'Partially Paid'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {paymentStatus}
          </span>

          {/* Only Print button kept; clicks notify that it is upcoming */}
          <button
            type="button"
            id="print-invoice-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-700" />
            <span>Print</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              Upcoming
            </span>
          </button>
        </div>
      </div>

      {/* Main Fee Cards Banner (Progress bar line removed) */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Assessed Fee</span>
            <span className="text-2xl font-mono font-semibold text-zinc-900 block mt-1">
              ₹{totalFees.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">{studentDept?.name || 'Apex Computer Classes'}</span>
          </div>

          <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Cleared Amount</span>
            <span className="text-2xl font-mono font-semibold text-zinc-900 block mt-1">
              ₹{feesPaid.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">{percentagePaid}% Completed</span>
          </div>

          <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Outstanding Due</span>
            <span className="text-2xl font-mono font-semibold text-zinc-900 block mt-1">
              ₹{feesRemaining.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">Due: {fee?.dueDate || 'Not set'}</span>
          </div>

          <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Audit Clearance</span>
            <span className="text-sm font-medium text-zinc-900 block mt-2">
              {paymentStatus}
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5 block">Bursar Central Registry</span>
          </div>
        </div>
      </div>

      {/* Payment History Table (Verified register, semester, receipt # removed; document download shows upcoming) */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4.5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-serif font-semibold text-zinc-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-zinc-500" />
              Payment Records
            </h2>
            <p className="text-[11px] text-zinc-500">Transaction logs generated by Finance Administration</p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {history.length} Record{history.length === 1 ? '' : 's'}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-10 text-center text-zinc-400 text-xs font-mono">
            No payments recorded yet. For tuition payments, contact the Bursar’s Office or pay online.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-14rem)] overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-500 font-mono font-semibold border-b border-zinc-200 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Academic Year</th>
                  <th className="py-3 px-4 text-right">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
                {history.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-700 text-[11px]">
                      {item.paymentDate}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-zinc-900">
                      {item.transactionRef}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-zinc-900">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {item.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500">
                      {item.academicYear}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={handleDownloadDocument}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 transition cursor-pointer shadow-2xs"
                        title="Download Document"
                      >
                        <Download className="w-3 h-3 text-zinc-600" />
                        <span>Download</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                          Upcoming
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
