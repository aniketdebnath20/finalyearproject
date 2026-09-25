import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldAlert, Clock, LogOut, CheckCircle2 } from 'lucide-react';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  onStaySignedIn: () => void;
  onLogoutNow: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  remainingSeconds,
  onStaySignedIn,
  onLogoutNow
}) => {
  if (!isOpen) return null;

  // Format MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const percentLeft = Math.max(0, Math.min(100, (remainingSeconds / 60) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-md rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-[#141b22] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="size-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="size-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block truncate">
              Institutional Security Protocol
            </span>
            <h3 className="font-serif font-bold text-white text-base truncate">
              Session Inactivity Warning
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            We noticed you have been inactive for a while. To safeguard academic records, student transcripts, and administrative privacy, your session will automatically expire.
          </p>

          {/* Countdown Display Card */}
          <div className="bg-[#f7f4ed] rounded-xl p-4 border border-[#ded8cb] flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 uppercase tracking-wider">
              <Clock className="size-4 text-amber-600 animate-pulse" />
              <span>Automatic Termination In</span>
            </div>

            <div className="font-mono font-bold text-4xl sm:text-5xl text-[#141b22] tracking-tight">
              {formattedTime}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${percentLeft}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              Press Stay Signed In to extend your authenticated access
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              id="stay-signed-in-btn"
              onClick={onStaySignedIn}
              className="w-full py-3 px-4 rounded-xl bg-[#141b22] hover:bg-[#222c37] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="size-4 text-[#deb360]" />
              <span>Stay Signed In</span>
            </button>

            <button
              type="button"
              id="logout-now-btn"
              onClick={onLogoutNow}
              className="w-full py-3 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="size-4 text-zinc-500" />
              <span>Log Out Now</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-2.5 bg-zinc-50 border-t border-zinc-100 text-center">
          <span className="text-[10px] font-mono text-zinc-400">
            FERPA & ISO/IEC 27001 Certified Session Management
          </span>
        </div>
      </div>
    </div>
  );
};
