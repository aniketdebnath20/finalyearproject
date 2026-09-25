import React from 'react';
import {
  GraduationCap,
  ArrowRight,
  Lock,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';

interface HomePageProps {
  onGoToLogin: () => void;
  onGoToPortal: () => void;
  onQuickLogin?: (role: 'student' | 'staff' | 'admin') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onGoToLogin,
  onGoToPortal,
  onQuickLogin
}) => {
  const { currentUser, logout } = useUniversity();

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1a232f] flex flex-col font-sans selection:bg-[#e7b455] selection:text-[#18222d]">
      {/* 1. REFINED EDITORIAL HEADER */}
      <header className="sticky top-0 z-40 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-[#ded8cb]">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Institution Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="size-9 sm:size-11 rounded-lg sm:rounded-xl bg-[#141b22] text-[#deb360] flex items-center justify-center shadow-xs shrink-0">
              <GraduationCap className="size-5 sm:size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif font-bold text-base sm:text-xl tracking-tight text-[#141b22] truncate">
                  APEX CLASSES
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#f3efe6] text-zinc-700 font-bold border border-[#ded8cb] shrink-0">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium hidden sm:block truncate">
                Integrated Classes, Batches & Academic Management
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={onGoToPortal}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl bg-[#141b22] hover:bg-[#202a35] text-white transition shadow-xs cursor-pointer"
                >
                  <span className="hidden xs:inline sm:inline">Launch Dashboard</span>
                  <span className="xs:hidden sm:hidden">Portal</span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-[#deb360] text-[#141b22] font-mono font-bold uppercase">
                    {currentUser.role}
                  </span>
                  <ArrowRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-zinc-500 hover:text-rose-600 px-1.5 sm:px-2 py-1 transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onGoToLogin}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-bold rounded-xl bg-[#141b22] hover:bg-[#202a35] text-white transition shadow-xs cursor-pointer"
              >
                <Lock className="size-3.5 text-[#deb360]" />
                <span className="hidden sm:inline">Portal Sign In</span>
                <span className="sm:hidden">Sign In</span>
                <ArrowRight className="size-3.5 text-[#deb360]" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. CENTERED HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10">
          {/* Accreditation Pill */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#f3efe6] border border-[#ded8cb] text-zinc-700 text-[10px] sm:text-xs font-mono font-medium max-w-full">
            <ShieldCheck className="size-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">ACADEMIC & BATCH MANAGEMENT • CLASSES PORTAL</span>
          </div>

          {/* Centered Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#141b22] tracking-tight leading-tight sm:leading-[1.18]">
            <span className="block">Excellence in Learning.</span>
            <span className="block mt-1 sm:mt-3 text-zinc-900">Unified Classes Portal.</span>
          </h1>

          {/* Centered Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto font-normal px-2">
            Apex Classes authenticated portal connects students, faculty tutors, and administration to real-time batch curriculum, test scores, class attendance tracking, fee statements, and performance reports.
          </p>

          {/* Primary Action Button & Role Gateways */}
          <div className="pt-2 sm:pt-4 flex flex-col items-center gap-4 sm:gap-5 w-full">
            {currentUser ? (
              <button
                type="button"
                onClick={onGoToPortal}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl bg-[#141b22] hover:bg-[#202a35] text-white font-bold text-sm sm:text-base transition inline-flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer"
              >
                <Layers className="size-4 text-[#deb360]" />
                <span>Launch Classes Portal</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#deb360] text-[#141b22] font-mono font-bold uppercase">
                  {currentUser.role}
                </span>
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  id="hero-sign-in-btn"
                  onClick={onGoToLogin}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl bg-[#141b22] hover:bg-[#202a35] text-white font-bold text-sm sm:text-base transition inline-flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Lock className="size-4 text-[#deb360]" />
                  <span>Portal Single Sign-On</span>
                  <ArrowRight className="size-4 text-[#deb360]" />
                </button>

                {onQuickLogin && (
                  <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2 sm:pt-3 text-xs text-zinc-600 w-full">
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Direct Portal Access:
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onQuickLogin('student')}
                        className="px-3 py-2 sm:py-1.5 rounded-lg border border-[#ded8cb] bg-white hover:bg-[#f3efe6] text-zinc-700 font-semibold transition cursor-pointer shadow-2xs hover:border-zinc-400 text-xs"
                      >
                        Student Portal
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickLogin('staff')}
                        className="px-3 py-2 sm:py-1.5 rounded-lg border border-[#ded8cb] bg-white hover:bg-[#f3efe6] text-zinc-700 font-semibold transition cursor-pointer shadow-2xs hover:border-zinc-400 text-xs"
                      >
                        Faculty & Tutors
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickLogin('admin')}
                        className="px-3 py-2 sm:py-1.5 rounded-lg border border-[#ded8cb] bg-white hover:bg-[#f3efe6] text-zinc-700 font-semibold transition cursor-pointer shadow-2xs hover:border-zinc-400 text-xs"
                      >
                        Classes Admin
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* 3. SUBTLE MINIMAL FOOTER */}
      <footer className="py-5 sm:py-6 text-center text-xs text-zinc-400 border-t border-[#ded8cb]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] sm:text-[11px] font-mono">
          <span>© {new Date().getFullYear()} Apex Classes. All Rights Reserved.</span>
          <div className="flex items-center gap-3 sm:gap-4 text-zinc-500">
            <span>Class Regulations</span>
            <span>•</span>
            <span>Student Privacy Protection</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
