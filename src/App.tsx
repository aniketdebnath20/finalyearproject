import React, { useState, useEffect, useCallback } from 'react';
import { UniversityProvider, useUniversity } from './context/UniversityContext';
import { LoginPage } from './components/auth/LoginPage';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { SwitchPortalModal } from './components/common/SwitchPortalModal';
import { ToastContainer } from './components/common/ToastContainer';
import { CertificateModal } from './components/common/CertificateModal';
import { StudentProfileModal } from './components/common/StudentProfileModal';
import { SessionTimeoutModal } from './components/common/SessionTimeoutModal';
import { useAutoLogout } from './hooks/useAutoLogout';
import { HomePage } from './components/home/HomePage';

// Student views
import { StudentDashboardView } from './components/student/StudentDashboardView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { StudentCoursesView } from './components/student/StudentCoursesView';
import { StudentFeesView } from './components/student/StudentFeesView';
import { StudentResultsView } from './components/student/StudentResultsView';
import { StudentAttendanceView } from './components/student/StudentAttendanceView';
import { StudentCertificatesView } from './components/student/StudentCertificatesView';
import { StudentExamsView } from './components/student/StudentExamsView';
import { StudentNotificationsView } from './components/student/StudentNotificationsView';

// Staff views
import { StaffDashboardView } from './components/staff/StaffDashboardView';
import { StaffProfileView } from './components/staff/StaffProfileView';
import { StaffStudentsView } from './components/staff/StaffStudentsView';
import { StaffStudentAttendanceView } from './components/staff/StaffStudentAttendanceView';
import { StaffMyAttendanceView } from './components/staff/StaffMyAttendanceView';
import { StaffUploadExamView } from './components/staff/StaffUploadExamView';
import { StaffUploadResultsView } from './components/staff/StaffUploadResultsView';
import { StaffCertificatesView } from './components/staff/StaffCertificatesView';
import { StaffNotificationsView } from './components/staff/StaffNotificationsView';

// Admin views
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminStudentsView } from './components/admin/AdminStudentsView';
import { AdminStaffView } from './components/admin/AdminStaffView';
import { AdminCoursesDepartmentsView } from './components/admin/AdminCoursesDepartmentsView';
import { AdminFeesView } from './components/admin/AdminFeesView';
import { AdminStaffApprovalView } from './components/admin/AdminStaffApprovalView';
import { AdminNotificationsView } from './components/admin/AdminNotificationsView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { AdminCertificatesView } from './components/admin/AdminCertificatesView';
import { AdminExamsView } from './components/admin/AdminExamsView';
import { AdminResultsView } from './components/admin/AdminResultsView';
import { AdminAttendanceView } from './components/admin/AdminAttendanceView';
import { MasterViewSkeleton } from './components/common/Skeleton';

const MainApplication: React.FC = () => {
  const { currentUser, certificates, students, logout, addToast, isDataLoading } = useUniversity();

  const [pageView, setPageView] = useState<'home' | 'login' | 'portal'>('home');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSwitchPortalOpen, setIsSwitchPortalOpen] = useState<boolean>(false);
  const [isTabTransitioning, setIsTabTransitioning] = useState<boolean>(false);

  // Trigger perceived loading skeleton when switching views
  useEffect(() => {
    setIsTabTransitioning(true);
    const timer = setTimeout(() => {
      setIsTabTransitioning(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Auto-logout for inactive user sessions (15 min inactivity, 60s warning countdown)
  const handleAutoLogout = useCallback(() => {
    logout();
    setPageView('login');
    addToast('Session expired due to inactivity. Please sign in again.', 'info');
  }, [logout, addToast]);

  const handleSessionExtended = useCallback(() => {
    addToast('Session refreshed. You remain securely signed in.', 'success');
  }, [addToast]);

  const { isWarningOpen, remainingSeconds, staySignedIn, simulateWarning } = useAutoLogout({
    enabled: !!currentUser && pageView === 'portal',
    timeoutSeconds: 900,
    warningSeconds: 60,
    onLogout: handleAutoLogout,
    onSessionExtended: handleSessionExtended
  });

  // Global modals
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [selectedProfileStudentId, setSelectedProfileStudentId] = useState<string | null>(null);

  // Reset tab to 'dashboard' when user or role changes
  useEffect(() => {
    setActiveTab('dashboard');
    setIsMobileSidebarOpen(false);
    if (currentUser) {
      setPageView('portal');
    }
  }, [currentUser?.role, currentUser?.id]);

  // 1. PUBLIC HOME PAGE
  if (pageView === 'home') {
    return (
      <div className="min-h-screen bg-[#f7f4ed]">
        <HomePage
          onGoToLogin={() => setPageView('login')}
          onGoToPortal={() => {
            if (currentUser) {
              setPageView('portal');
            } else {
              setPageView('login');
            }
          }}
        />
        <ToastContainer />
      </div>
    );
  }

  // 2. AUTHENTICATION LOGIN PAGE
  if (pageView === 'login' || !currentUser) {
    return (
      <div className="min-h-screen bg-[#f7f4ed]">
        <LoginPage onBackToHome={() => setPageView('home')} />
        <ToastContainer />
      </div>
    );
  }

  const renderContent = () => {
    // Render high-fidelity skeleton during tab switching or data refresh
    if (isTabTransitioning || isDataLoading) {
      return (
        <div id="view-skeleton-container" className="animate-in fade-in duration-150">
          <MasterViewSkeleton role={currentUser.role} activeTab={activeTab} />
        </div>
      );
    }

    // 1. STUDENT ROLE ROUTING
    if (currentUser.role === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <StudentDashboardView
              onNavigate={setActiveTab}
              onViewCertificate={setSelectedCertificateId}
            />
          );
        case 'profile':
          return <StudentProfileView />;
        case 'courses':
          return <StudentCoursesView />;
        case 'fees':
          return <StudentFeesView />;
        case 'results':
          return <StudentResultsView />;
        case 'attendance':
          return <StudentAttendanceView />;
        case 'certificates':
          return <StudentCertificatesView onViewCertificate={setSelectedCertificateId} />;
        case 'exams':
          return <StudentExamsView />;
        case 'notifications':
          return <StudentNotificationsView />;
        default:
          return (
            <StudentDashboardView
              onNavigate={setActiveTab}
              onViewCertificate={setSelectedCertificateId}
            />
          );
      }
    }

    // 2. STAFF / FACULTY ROLE ROUTING
    if (currentUser.role === 'staff') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <StaffDashboardView
              onNavigate={setActiveTab}
              onSelectStudent={setSelectedProfileStudentId}
            />
          );
        case 'profile':
          return <StaffProfileView />;
        case 'students':
          return <StaffStudentsView onSelectStudent={setSelectedProfileStudentId} />;
        case 'attendance-mark':
          return <StaffStudentAttendanceView />;
        case 'my-attendance':
          return <StaffMyAttendanceView />;
        case 'exams-manage':
          return <StaffUploadExamView />;
        case 'results-upload':
          return <StaffUploadResultsView />;
        case 'certificates':
          return <StaffCertificatesView onViewCertificate={setSelectedCertificateId} />;
        case 'notifications':
          return <StaffNotificationsView />;
        default:
          return (
            <StaffDashboardView
              onNavigate={setActiveTab}
              onSelectStudent={setSelectedProfileStudentId}
            />
          );
      }
    }

    // 3. ADMIN ROLE ROUTING
    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <AdminDashboardView
              onNavigate={setActiveTab}
              onSelectStudent={setSelectedProfileStudentId}
            />
          );
        case 'students':
          return <AdminStudentsView onSelectStudent={setSelectedProfileStudentId} />;
        case 'staff':
          return <AdminStaffView />;
        case 'courses':
        case 'departments':
          return <AdminCoursesDepartmentsView onSelectStudent={setSelectedProfileStudentId} />;
        case 'fees':
          return <AdminFeesView />;
        case 'results':
          return <AdminResultsView onSelectStudent={setSelectedProfileStudentId} />;
        case 'attendance':
          return <AdminAttendanceView onSelectStudent={setSelectedProfileStudentId} />;
        case 'staff-approval':
          return <AdminStaffApprovalView />;
        case 'exams':
          return <AdminExamsView />;
        case 'certificates':
          return (
            <AdminCertificatesView
              onViewCertificate={setSelectedCertificateId}
              onSelectStudent={setSelectedProfileStudentId}
            />
          );
        case 'notifications':
          return <AdminNotificationsView />;
        case 'reports':
          return <AdminReportsView />;
        case 'settings':
          return <AdminSettingsView onSimulateInactivityWarning={simulateWarning} />;
        default:
          return (
            <AdminDashboardView
              onNavigate={setActiveTab}
              onSelectStudent={setSelectedProfileStudentId}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex font-sans text-[#18222d] antialiased selection:bg-[#f4be5c] selection:text-[#1a232d]">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenSwitchPortal={() => setIsSwitchPortalOpen(true)}
        onGoToHome={() => setPageView('home')}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden flex flex-col custom-scrollbar min-w-0">
        {/* Top Header Bar */}
        <TopBar
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onNavigate={setActiveTab}
          onOpenSwitchPortal={() => setIsSwitchPortalOpen(true)}
          onGoToHome={() => setPageView('home')}
        />

        {/* Page View Body */}
        <main className="flex-1 px-3.5 sm:px-6 lg:px-8 pb-6 flex flex-col min-h-0">
          <div className="max-w-7xl mx-auto w-full flex-1 min-h-0 flex flex-col">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Switch Portal Dialog */}
      <SwitchPortalModal
        isOpen={isSwitchPortalOpen}
        onClose={() => setIsSwitchPortalOpen(false)}
        onSwitchPortal={() => setActiveTab('dashboard')}
      />

      {/* Global Modals */}
      {selectedCertificateId && (
        <CertificateModal
          certificate={certificates.find(c => c.id === selectedCertificateId) || null}
          onClose={() => setSelectedCertificateId(null)}
        />
      )}

      {selectedProfileStudentId && (
        <StudentProfileModal
          student={students.find(s => s.id === selectedProfileStudentId) || null}
          onClose={() => setSelectedProfileStudentId(null)}
        />
      )}

      {/* Auto-logout Inactivity Security Warning Modal */}
      <SessionTimeoutModal
        isOpen={isWarningOpen}
        remainingSeconds={remainingSeconds}
        onStaySignedIn={staySignedIn}
        onLogoutNow={() => {
          logout();
          setPageView('login');
        }}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <UniversityProvider>
      <MainApplication />
    </UniversityProvider>
  );
}
