import React from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { LogOut, X } from 'lucide-react';

interface SwitchPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchPortal?: () => void;
}

export const SwitchPortalModal: React.FC<SwitchPortalModalProps> = ({ isOpen, onClose, onSwitchPortal }) => {
  const { activeRole, logout } = useUniversity();

  if (!isOpen) return null;

  const handleSignOut = () => {
    logout();
    onSwitchPortal?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm text-zinc-900">Switch account</h2>
            <p className="text-xs text-zinc-500 mt-1">Signed in as {activeRole || 'unknown'}.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-xs text-zinc-600 mb-4">Sign out before using another account or portal role.</p>
          <button onClick={handleSignOut} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign out and switch account
          </button>
        </div>
      </div>
    </div>
  );
};
