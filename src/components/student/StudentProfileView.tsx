import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BadgeCheck,
  Building2,
  Hash,
  AlertCircle,
  Edit3,
  X,
  CheckCircle2,
  Save
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const {
    currentStudent,
    courses,
    departments,
    updateStudent
  } = useUniversity();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentStudent?.fullName || '');
  const [phone, setPhone] = useState(currentStudent?.phone || '');
  const [email, setEmail] = useState(currentStudent?.email || '');
  const [address, setAddress] = useState(currentStudent?.address || '');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!currentStudent) {
    return (
      <div className="p-12 text-center text-zinc-500 font-mono text-sm max-w-md mx-auto bg-white rounded-2xl border border-zinc-200 shadow-xs">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-serif font-semibold text-zinc-800">Student Record Not Found</h3>
        <p className="text-xs text-zinc-500 mt-1">Please sign in as a student to view your profile details.</p>
      </div>
    );
  }

  const course = courses.find(c => c.id === currentStudent.courseId);
  const department = departments.find(d => d.id === currentStudent.departmentId);

  const handleOpenEdit = () => {
    setFullName(currentStudent.fullName);
    setPhone(currentStudent.phone || '');
    setEmail(currentStudent.email || '');
    setAddress(currentStudent.address || '');
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(currentStudent.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim()
    });

    setIsEditing(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div id="student-profile-view" className="w-full py-2 space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Official student identity & classes enrollment record
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            id="edit-student-profile-btn"
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Batch Enrollment</span>
          </div>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile particulars updated successfully!</span>
        </div>
      )}

      {/* Main Student Profile Card (No photo, clean adjusted layout) */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        {/* Top Identity Banner */}
        <div className="p-6 sm:p-8 bg-zinc-50/70 border-b border-zinc-100">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-medium uppercase px-2.5 py-0.5 rounded-md bg-zinc-200/80 text-zinc-800 border border-zinc-300/60">
                Student Profile
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white text-zinc-700 border border-zinc-200">
                ID: {currentStudent.studentId}
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white text-zinc-700 border border-zinc-200">
                Roll No: {currentStudent.rollNumber}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
                {currentStudent.fullName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 mt-1.5">
                <span className="flex items-center gap-1.5 font-medium text-zinc-800">
                  <GraduationCap className="w-4 h-4 text-zinc-500 shrink-0" />
                  {course?.courseName || 'Class Program & Curriculum'}
                </span>
                {department && (
                  <>
                    <span className="text-zinc-300 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5 text-zinc-600">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      {department.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Personal & Academic Particulars
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              Official Classes Registry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Full Legal Name */}
            <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                Full Name
              </span>
              <p className="font-semibold text-sm text-zinc-900">
                {currentStudent.fullName}
              </p>
            </div>

            {/* Student ID */}
            <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-zinc-500" />
                Student Identification ID
              </span>
              <p className="font-mono font-semibold text-sm text-zinc-900">
                {currentStudent.studentId}
              </p>
            </div>

            {/* Roll Number */}
            <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-zinc-500" />
                Roll Number
              </span>
              <p className="font-mono font-semibold text-sm text-zinc-900">
                {currentStudent.rollNumber}
              </p>
            </div>

            {/* Department / Division */}
            <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                Academic Stream / Division
              </span>
              <p className="font-medium text-sm text-zinc-900">
                {department?.name || 'Academic Division'}
              </p>
            </div>

            {/* Course / Class Program Name */}
            <div className="sm:col-span-2 lg:col-span-2 p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                Enrolled Class Program
              </span>
              <p className="font-semibold text-sm text-zinc-900">
                {course?.courseName || 'Class Curriculum Program'}
              </p>
            </div>

            {/* Email */}
            <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                Student Email
              </span>
              <p className="font-mono text-xs sm:text-sm text-zinc-900 break-all">
                {currentStudent.email}
              </p>
            </div>

            {/* Phone Number */}
            <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                Contact Phone
              </span>
              <p className="font-mono text-xs sm:text-sm text-zinc-900">
                {currentStudent.phone || 'Not provided'}
              </p>
            </div>

            {/* Address */}
            <div className="sm:col-span-2 lg:col-span-1 p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                Residential Address
              </span>
              <p className="text-zinc-800 leading-relaxed font-sans text-xs sm:text-sm">
                {currentStudent.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT DETAILS MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-zinc-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">Edit Profile Details</h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    Update your personal and contact particulars in the classes registry
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 shadow-2xs font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 shadow-2xs font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Student Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 shadow-2xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                  Permanent Residential Address *
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed shadow-2xs font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
