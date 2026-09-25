import React from 'react';

interface AdminReportsViewProps {
  isLoading?: boolean;
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = () => {
  return (
    <div
      id="admin-reports-container"
      className="max-w-4xl mx-auto py-24 sm:py-32 px-6 sm:px-8 flex items-center justify-center min-h-[65vh]"
    >
      <div
        id="admin-reports-card"
        className="text-center py-16 px-8 sm:py-24 sm:px-16 bg-white rounded-3xl border border-[#ded8cb] shadow-xs w-full"
      >
        <p
          id="admin-reports-upcoming-text"
          className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium text-[#141b22] tracking-normal leading-relaxed"
        >
          This is an upcoming user work
        </p>
      </div>
    </div>
  );
};
