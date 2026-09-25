import React from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  LayoutDashboard,
  User,
  BookOpen,
  CreditCard,
  BarChart3,
  CalendarCheck2,
  Award,
  Calendar,
  Bell,
  Users,
  FileSpreadsheet,
  Settings,
  Sparkles,
  LogOut,
  GraduationCap,
  Building2,
  X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarProps {
  currentTab?: string;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  isOpen?: boolean;
  isMobileOpen?: boolean;
  onClose?: () => void;
  setIsMobileOpen?: (open: boolean) => void;
  onOpenSwitchPortal?: () => void;
  onGoToHome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  setActiveTab,
  isOpen,
  isMobileOpen,
  onClose,
  setIsMobileOpen,
  onOpenSwitchPortal,
  onGoToHome
}) => {
  const { activeRole, logout, notifications, currentUser } = useUniversity();

  const currentActiveTab = activeTab || currentTab || 'dashboard';

  const handleSelectTab = (tabId: string) => {
    if (setActiveTab) setActiveTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
    if (onClose) onClose();
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const isSidebarVisible = isMobileOpen !== undefined ? isMobileOpen : (isOpen || false);
  const handleClose = () => {
    if (onClose) onClose();
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  // Filter unread notifications
  const roleNotifs = notifications.filter(
    n => n.targetRole === 'all' ||
    n.targetRole === activeRole ||
    (n.targetUserId && n.targetUserId === currentUser?.id)
  );
  const unreadNotifs = roleNotifs.filter(n => !n.isRead).length;

  // Student Nav Items matching screenshot 1
  const studentItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My profile', icon: User },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'fees', label: 'Fees & payments', icon: CreditCard },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'exams', label: 'Exams', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined }
  ];

  // Faculty Nav Items matching screenshot 3
  const staffItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Assigned students', icon: Users },
    { id: 'attendance-mark', label: 'Mark attendance', icon: CalendarCheck2 },
    { id: 'my-attendance', label: 'My attendance', icon: Calendar },
    { id: 'exams-manage', label: 'Exam information', icon: FileSpreadsheet },
    { id: 'results-upload', label: 'Student results', icon: BarChart3 },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined }
  ];

  // Admin Nav Items matching screenshot 2
  const adminItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'staff', label: 'Staff', icon: User },
    { id: 'courses', label: 'Courses & departments', icon: BookOpen },
    { id: 'fees', label: 'Fee records', icon: CreditCard },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'staff-approval', label: 'Staff attendance approval', icon: Calendar },
    { id: 'exams', label: 'Exams', icon: FileSpreadsheet },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const items: NavItem[] = activeRole === 'admin' ? adminItems : activeRole === 'staff' ? staffItems : studentItems;

  const categoryLabel = activeRole === 'admin'
    ? 'ADMINISTRATION'
    : activeRole === 'staff'
    ? 'FACULTY WORKSPACE'
    : 'STUDENT PORTAL';

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarVisible && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] sm:w-64 bg-[#1a232d] text-white flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarVisible ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 sm:p-6 pb-4 sm:pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f4be5c] flex items-center justify-center text-[#1a232d] shadow-sm shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-white tracking-tight leading-none">
                Apex Classes
              </div>
              <div className="text-[10px] tracking-wider text-[#8e9fae] font-mono uppercase font-semibold mt-1">
                CLASSES PORTAL
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Category Title */}
        <div className="px-5 pt-3 pb-2 text-[11px] font-mono tracking-widest text-[#8e9fae] uppercase font-semibold">
          {categoryLabel}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1 custom-scrollbar">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = currentActiveTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#f5be63] text-[#18222d] font-bold shadow-xs'
                    : 'text-[#8e9fae] hover:text-white hover:bg-white/5 font-normal'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#18222d]' : 'text-[#8e9fae]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18222d] shrink-0 ml-2" />
                )}

                {!isActive && item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions: Switch portal & Sign out */}
        <div className="p-4 pt-3 border-t border-slate-800/80 space-y-1">
          {onGoToHome && (
            <button
              onClick={() => {
                onGoToHome();
                handleClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal text-[#8e9fae] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#8e9fae]" />
              <span>University Home</span>
            </button>
          )}

          <button
            onClick={() => {
              if (onOpenSwitchPortal) onOpenSwitchPortal();
              handleClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal text-[#8e9fae] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#8e9fae]" />
            <span>Switch portal</span>
          </button>

          <button
            onClick={() => {
              handleClose();
              logout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal text-[#8e9fae] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#8e9fae]" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
