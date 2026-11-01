import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type { UserRole} from '../../types';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginPageProps {
  onBackToHome?: () => void;
} 

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome }) => {
  const { loginAsStudent, loginAsStaff, loginAsAdmin } = useUniversity();

  const [activeTab, setActiveTab] = useState<UserRole> ('student');

  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');

  const [staffUsername, setStaffUsername] = useState('');
  const [staffName, setStaffName] = useState('');

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const success = activeTab === 'student'
      ? await loginAsStudent(studentName, studentRoll)
      : activeTab === 'staff'
      ? await loginAsStaff(staffUsername, staffName)
      : await loginAsAdmin(adminUsername, adminPassword);
    if (!success) setErrorMsg('Sign-in failed. Check your credentials and try again.');
    setIsLoading(false);
  };

  return (
    <div className="grid min-h-[100dvh] bg-[#f6f3eb] lg:grid-cols-[.9fr_1.1fr]">
      {/* LEFT COLUMN: Deep Slate Academic Pavilion with Registrar Note */}
      <div className="hidden bg-[#222f3b] p-10 text-[#f7f4eb] lg:flex lg:flex-col lg:justify-between">
        {/* Top Logo */}
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-3 text-left cursor-pointer group w-fit"
          data-testid="link-auth-logo"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9bd68] text-[#222f3b] transition-transform group-hover:scale-105">
            <GraduationCap className="size-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#f7f4eb]">
            Apex Classes
          </span>
        </button>

        {/* Middle Registrar Quote */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#a9b4b4]">
            A note from the registrar
          </p>
          <p className="font-serif mt-5 max-w-md text-5xl leading-[1.05] text-[#f7f4eb]">
            “Good records make brave futures.”
          </p>
          <p className="mt-6 text-sm text-[#a9b4b4]">
            — Dr. Miriam Cole, Registrar
          </p>
        </div>

        {/* Bottom Tag */}
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#849398]">
          Secure academic access
        </p>
      </div>

      {/* RIGHT COLUMN: Interactive Authentication Area */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px]">
          {/* Mobile Logo (shown only on mobile screens) */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-3 text-left cursor-pointer"
              data-testid="link-mobile-auth-logo"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#222f3b] text-[#e9bd68]">
                <GraduationCap className="size-5" />
              </div>
              <span className="font-extrabold text-lg text-[#222f3b]">Apex Classes</span>
            </button>
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="flex items-center gap-1 text-xs text-[#78827e] hover:text-[#222f3b] transition font-medium"
              >
                <ArrowLeft className="size-3.5" />
                <span>Home</span>
              </button>
            )}
          </div>

          {/* Main Card Box matching Replit design */}
          <div className="rounded-2xl border border-[#e1ddd3] bg-[#fbfaf6] p-6 sm:p-7 shadow-xs">
            <div>
              <h1 className="text-xl font-extrabold text-[#222f3b]">
                Sign in to Apex Classes
              </h1>
              <p className="mt-1 text-xs text-[#78827e]">Sign in with your registered account credentials.</p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl border border-[#d8d3c7] bg-[#f6f3eb] p-1 text-xs font-semibold">
              <button
                type="button"
                id="role-tab-student"
                onClick={() => {
                  setActiveTab('student');
                  setErrorMsg('');
                }}
                className={`rounded-lg py-2 px-2.5 font-bold transition cursor-pointer text-center ${
                  activeTab === 'student'
                    ? 'bg-[#2f766d] text-[#f7f4eb] shadow-xs'
                    : 'text-[#78827e] hover:text-[#222f3b]'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                id="role-tab-staff"
                onClick={() => {
                  setActiveTab('staff');
                  setErrorMsg('');
                }}
                className={`rounded-lg py-2 px-2.5 font-bold transition cursor-pointer text-center ${
                  activeTab === 'staff'
                    ? 'bg-[#2f766d] text-[#f7f4eb] shadow-xs'
                    : 'text-[#78827e] hover:text-[#222f3b]'
                }`}
              >
                Faculty
              </button>
              <button
                type="button"
                id="role-tab-admin"
                onClick={() => {
                  setActiveTab('admin');
                  setErrorMsg('');
                }}
                className={`rounded-lg py-2 px-2.5 font-bold transition cursor-pointer text-center ${
                  activeTab === 'admin'
                    ? 'bg-[#2f766d] text-[#f7f4eb] shadow-xs'
                    : 'text-[#78827e] hover:text-[#222f3b]'
                }`}
              >
                Admin
              </button>
            </div>

            <div className="mt-3 text-[11px] text-[#78827e]">
              <span>
                Signing in as: <strong className="text-[#222f3b] font-bold capitalize">{activeTab === 'staff' ? 'Faculty / Staff' : activeTab}</strong>
              </span>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {errorMsg && (
                <div className="rounded-xl border border-[#e8c6bd] bg-[#fff5f1] p-3 text-xs font-semibold text-[#b05245] flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#b05245] shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Student Fields */}
              {activeTab === 'student' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#222f3b] mb-1.5">
                      Student Full Name
                    </label>
                    <input
                      id="student-name-input"
                      type="text"
                      required
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      placeholder="Your registered full name"
                      className="w-full rounded-xl border border-[#d8d3c7] bg-[#f6f3eb] px-3.5 py-2.5 text-sm text-[#222f3b] placeholder-[#78827e] focus:border-[#2f766d] focus:outline-none focus:ring-1 focus:ring-[#2f766d] transition"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#222f3b]">
                        Roll Number / Scholar ID
                      </label>
                    </div>
                    <input
                      id="student-roll-input"
                      type="text"
                      required
                      value={studentRoll}
                      onChange={e => setStudentRoll(e.target.value)}
                      placeholder="Your student roll number"
                      className="w-full rounded-xl border border-[#d8d3c7] bg-[#f6f3eb] px-3.5 py-2.5 text-sm font-mono text-[#222f3b] placeholder-[#78827e] focus:border-[#2f766d] focus:outline-none focus:ring-1 focus:ring-[#2f766d] transition"
                    />
                  </div>
                </>
              )}

              {/* Staff Fields */}
              {activeTab === 'staff' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#222f3b] mb-1.5">
                      Faculty ID
                    </label>
                    <input
                      id="staff-id-input"
                      type="text"
                      required
                      value={staffUsername}
                      onChange={e => setStaffUsername(e.target.value)}
                      placeholder="Your faculty ID"
                      className="w-full rounded-xl border border-[#d8d3c7] bg-[#f6f3eb] px-3.5 py-2.5 text-sm font-mono text-[#222f3b] placeholder-[#78827e] focus:border-[#2f766d] focus:outline-none focus:ring-1 focus:ring-[#2f766d] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#222f3b] mb-1.5">
                      Faculty Full Name
                    </label>
                    <div>
                      <input
                        id="staff-name-input"
                        type="text"
                        required
                        value={staffName}
                        onChange={e => setStaffName(e.target.value)}
                        placeholder="Your registered full name"
                        className="w-full rounded-xl border border-[#d8d3c7] bg-[#f6f3eb] px-3.5 py-2.5 text-sm text-[#222f3b] placeholder-[#78827e] focus:border-[#2f766d] focus:outline-none focus:ring-1 focus:ring-[#2f766d] transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Admin Fields */}
              {activeTab === 'admin' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#222f3b] mb-1.5">
                      Administrator Email or ID
                    </label>
                    <input
                      id="admin-email-input"
                      type="text"
                      required
                      value={adminUsername}
                      onChange={e => setAdminUsername(e.target.value)}
                      placeholder="Administrator email"
                      className="w-full rounded-xl border border-[#d8d3c7] bg-[#f6f3eb] px-3.5 py-2.5 text-sm text-[#222f3b] placeholder-[#78827e] focus:border-[#2f766d] focus:outline-none focus:ring-1 focus:ring-[#2f766d] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#222f3b] mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="admin-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-[#d8d3c7] bg-[#f6f3eb] pl-3.5 pr-10 py-2.5 text-sm text-[#222f3b] placeholder-[#78827e] focus:border-[#2f766d] focus:outline-none focus:ring-1 focus:ring-[#2f766d] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#78827e] hover:text-[#222f3b] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Primary Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 rounded-xl bg-[#2f766d] hover:bg-[#28675f] text-[#f7f4eb] py-2.5 px-4 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isLoading ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Return to home link */}
          {onBackToHome && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 text-xs text-[#78827e] hover:text-[#222f3b] transition cursor-pointer font-medium"
              >
                <ArrowLeft className="size-3.5" />
                <span>Return to public campus website</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
