import React from 'react';

interface AdminSettingsViewProps {
  onSimulateInactivityWarning?: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = () => {
  return (
    <div
      id="admin-settings-container"
      className="max-w-4xl mx-auto py-24 sm:py-32 px-6 sm:px-8 flex items-center justify-center min-h-[65vh]"
    >
      <div
        id="admin-settings-card"
        className="text-center py-16 px-8 sm:py-24 sm:px-16 bg-white rounded-3xl border border-[#ded8cb] shadow-xs w-full"
      >
        <p
          id="admin-settings-upcoming-text"
          className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium text-[#141b22] tracking-normal leading-relaxed"
        >
          This is an upcoming user work
        </p>
      </div>
    </div>
  );
};
