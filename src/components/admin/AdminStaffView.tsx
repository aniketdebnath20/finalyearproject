import React, { useState, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type{ Staff } from '../../types';
import { truncateEmail } from '../../utils/formatters';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowUp
} from 'lucide-react';

export const AdminStaffView: React.FC = () => {
  const { staffList, departments, addStaff, updateStaff, deleteStaff } = useUniversity();

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

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form states
  const [staffName, setStaffName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [initialPassword, setInitialPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [designation, setDesignation] = useState('Associate Professor');
  const [qualification, setQualification] = useState('');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [profilePhoto, setProfilePhoto] = useState('');

  const openAddModal = () => {
    setEditingStaff(null);
    setStaffName('');
    setStaffId(`STF-${100 + staffList.length + 1}`);
    setInitialPassword('');
    setEmail('');
    setPhone('');
    setDepartmentId(departments[0]?.id || '');
    setDesignation('Assistant Professor');
    setQualification('');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setProfilePhoto('');
    setIsModalOpen(true);
  };

  const openEditModal = (stf: Staff) => {
    setEditingStaff(stf);
    setStaffName(stf.staffName);
    setStaffId(stf.staffId);
    setInitialPassword('');
    setEmail(stf.email);
    setPhone(stf.phone);
    setDepartmentId(stf.departmentId);
    setDesignation(stf.designation);
    setQualification(stf.qualification || 'Ph.D.');
    setJoiningDate(stf.joiningDate);
    setProfilePhoto(stf.profilePhoto || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        staffName,
        staffId,
        email,
        phone,
        departmentId,
        designation,
        qualification,
        joiningDate,
        profilePhoto,
        accountStatus: editingStaff.accountStatus,
        ...(initialPassword ? { password: initialPassword } : {})
      });
    } else {
      addStaff({
        staffName,
        staffId,
        email,
        phone,
        departmentId,
        designation,
        qualification,
        joiningDate,
        profilePhoto,
        accountStatus: 'Active',
        password: initialPassword
      });
    }

    setIsModalOpen(false);
  };

  const filteredStaff = staffList.filter(stf => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      stf.staffName.toLowerCase().includes(q) ||
      stf.staffId.toLowerCase().includes(q) ||
      stf.email.toLowerCase().includes(q) ||
      stf.designation.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    handleScroll();
  }, [filteredStaff]);

  return (
    <div
      id="admin-staff-view"
      className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Academic Senate
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Faculty & Academic Staff Registry
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            University professorial chairs, lecturers, and departmental researchers ({filteredStaff.length} Members)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Appoint Faculty Member
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
            placeholder="Search by faculty name, staff ID, email, designation..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
          />
        </div>
      </div>

      {/* Staff Table with Scroll Effect */}
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
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation & Rank</th>
                <th className="py-3 px-4">Qualification</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
              {filteredStaff.map(stf => {
                const dept = departments.find(d => d.id === stf.departmentId);

                return (
                  <tr key={stf.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stf.profilePhoto}
                          alt={stf.staffName}
                          className="w-8 h-8 rounded-md object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                        />
                        <div>
                          <div className="font-medium text-zinc-900">{stf.staffName}</div>
                          <div className="text-[10px] text-zinc-400 font-mono" title={stf.email}>
                            {truncateEmail(stf.email, 24)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-800 text-[11px]">
                      {stf.staffId}
                    </td>

                    <td className="py-3 px-4 font-medium text-zinc-800">
                      {dept?.name}
                    </td>

                    <td className="py-3 px-4 text-zinc-900 font-medium">
                      {stf.designation}
                    </td>

                    <td className="py-3 px-4 text-zinc-600">
                      {stf.qualification}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(stf)}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                          title="Edit Faculty Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${stf.staffName}?`)) {
                              deleteStaff(stf.id);
                            }
                          }}
                          className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                          title="Delete Faculty"
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
            Showing {filteredStaff.length} of {staffList.length} faculty members
          </span>
          <span className="text-[11px] text-zinc-400">Institutional Faculty Registry Audited</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="font-serif font-semibold text-zinc-900 text-sm">
                {editingStaff ? 'Edit Faculty Record' : 'Appoint Faculty Member'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Full Name & Honorific</label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={e => setStaffName(e.target.value)}
                    placeholder="e.g. Dr. Alan Roberts"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Staff ID</label>
                  <input
                    type="text"
                    required
                    value={staffId}
                    onChange={e => setStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    {editingStaff ? 'Set New Password (optional)' : 'Initial Password'}
                  </label>
                  <input
                    type="password"
                    required={!editingStaff}
                    minLength={8}
                    autoComplete="new-password"
                    value={initialPassword}
                    onChange={e => setInitialPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Phone Number</label>
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
                    required
                    value={departmentId}
                    onChange={e => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="">Select department</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    placeholder="e.g. Professor & Chair"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={e => setQualification(e.target.value)}
                    placeholder="e.g. Ph.D. in Computer Science"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
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
                  {editingStaff ? 'Update Appointment' : 'Confirm Faculty Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
