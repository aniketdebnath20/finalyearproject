import React, { useState, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type{ FeePaymentStatus, FeeRecord } from '../../types';
import { truncateEmail } from '../../utils/formatters';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit2,
  X,
  ArrowUp
} from 'lucide-react';

type PaymentChannel = 'Online / UPI' | 'Net Banking' | 'Debit/Credit Card' | 'Bank Demand Draft' | 'Cash';

export const AdminFeesView: React.FC = () => {
  const { students, feeRecords, updateFeeRecord } = useUniversity();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FeePaymentStatus>('all');

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

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<FeeRecord | null>(null);
  const [totalFees, setTotalFees] = useState(0);
  const [feesPaid, setFeesPaid] = useState(0);
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentChannel>('Online / UPI');
  const [remarks, setRemarks] = useState('');

  const openEditModal = (rec: FeeRecord) => {
    setEditingRecord(rec);
    setTotalFees(rec.totalFees);
    setFeesPaid(rec.feesPaid);
    setPaymentDate(rec.lastPaymentDate || new Date().toISOString().split('T')[0]);
    setPaymentMode((rec.paymentMode as PaymentChannel) || 'Online / UPI');
    setRemarks(rec.remarks || '');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    updateFeeRecord(editingRecord.id, {
      totalFees: Number(totalFees),
      feesPaid: Number(feesPaid),
      lastPaymentDate: paymentDate,
      paymentMode,
      remarks
    });

    setEditingRecord(null);
  };

  const filteredRecords = feeRecords.filter(rec => {
    const student = students.find(s => s.id === rec.studentId);
    if (!student) return false;

    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || rec.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCollected = feeRecords.reduce((a, b) => a + b.feesPaid, 0);
  const totalOutstanding = feeRecords.reduce((a, b) => a + b.feesRemaining, 0);

  useEffect(() => {
    handleScroll();
  }, [filteredRecords]);

  return (
    <div
      id="admin-fees-view"
      className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Bursar Treasury
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Tuition Ledger & Collections
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Fee billing records, reconciliation receipts, and outstanding student balances
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
            Collected: <strong>₹{totalCollected.toLocaleString()}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-800">
            Receivables: <strong>₹{totalOutstanding.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 my-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | FeePaymentStatus)}
            className="w-full sm:w-52 py-1.5 px-2.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Fully Paid">Fully Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid Only</option>
          </select>
        </div>
      </div>

      {/* Fee Table with Scroll Effect */}
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
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Settled</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
              {filteredRecords.map(rec => {
                const student = students.find(s => s.id === rec.studentId);
                if (!student) return null;

                return (
                  <tr key={rec.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-900">{student.fullName}</div>
                      <div className="text-[10px] text-zinc-400 font-mono" title={student.email}>
                        {truncateEmail(student.email, 24)}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-800 text-[11px]">
                      {student.rollNumber}
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-900">
                      ₹{rec.totalFees.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-700 font-medium">
                      ₹{rec.feesPaid.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-rose-700 font-medium">
                      ₹{rec.feesRemaining.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                        rec.paymentStatus === 'Fully Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : rec.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {rec.paymentStatus === 'Fully Paid' && <CheckCircle2 className="w-3 h-3" />}
                        {rec.paymentStatus === 'Partially Paid' && <Clock className="w-3 h-3" />}
                        {rec.paymentStatus === 'Unpaid' && <AlertTriangle className="w-3 h-3" />}
                        {rec.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-600 font-mono text-[11px]">
                      {rec.paymentMode || '—'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEditModal(rec)}
                        className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
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
            Showing {filteredRecords.length} of {feeRecords.length} student records
          </span>
          <span className="text-[11px] text-zinc-400">Institutional Treasury Audited</span>
        </div>
      </div>

      {/* Update Fee Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="font-serif font-semibold text-zinc-900 text-sm">Update Fee Record</h2>
              <button onClick={() => setEditingRecord(null)} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Total Tuition (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={totalFees}
                    onChange={e => setTotalFees(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max={totalFees}
                    required
                    value={feesPaid}
                    onChange={e => setFeesPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 font-mono text-emerald-700 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Payment Channel</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as PaymentChannel)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
                  >
                    <option value="Online / UPI">Online / UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Debit/Credit Card">Debit/Credit Card</option>
                    <option value="Bank Demand Draft">Bank Demand Draft</option>
                    <option value="Cash">Cash at Bursar</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Reference / Audit Remarks</label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="e.g. Cleared 2nd installment via HDFC RTGS Ref #98124"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-600">Calculated Balance Due:</span>
                <span className="font-semibold text-rose-700">
                  ₹{Math.max(0, totalFees - feesPaid).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-3.5 py-1.5 rounded-lg text-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 font-medium cursor-pointer"
                >
                  Confirm & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
