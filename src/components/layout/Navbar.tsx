import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Bell,
  LogOut,
  GraduationCap,
  ChevronDown,
  Menu,
  Check,
  UserCheck,
  ExternalLink,
  Building2
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate }) => {
  const {
    currentUser,
    activeRole,
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    quickLogin,
    students,
    staffList
  } = useUniversity();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Filter notifications relevant to current role
  const roleNotifs = notifications.filter(
    n => n.targetRole === 'all' ||
    n.targetRole === activeRole ||
    (n.targetUserId && n.targetUserId === currentUser?.id)
  );
  const unreadCount = roleNotifs.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 text-zinc-900 select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="px-4 sm:px-6 flex items-center justify-between h-15">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs group-hover:bg-zinc-800 transition-colors">
              <Building2 className="w-4 h-4 text-zinc-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-semibold text-sm tracking-tight text-zinc-900">
                  APEX UNIVERSITY
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 font-medium">
                  UMS
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-sans tracking-tight leading-none hidden sm:block">
                Academic Management Console
              </div>
            </div>
          </div>
        </div>

        {/* Center: Active Role Badge & Quick Demo Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => {
                setShowRoleSwitcher(!showRoleSwitcher);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-xs font-medium text-zinc-800 transition-all cursor-pointer"
            >
              <span className="text-zinc-400 text-[11px] hidden sm:inline">Role:</span>
              <span className={`px-2 py-0.5 rounded font-mono font-medium text-[10px] uppercase tracking-wide ${
                activeRole === 'admin'
                  ? 'bg-zinc-900 text-white'
                  : activeRole === 'staff'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {activeRole}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {/* Quick Demo Role Switcher Menu */}
            {showRoleSwitcher && (
              <div className="absolute right-0 sm:left-0 mt-2 w-72 rounded-xl bg-white border border-zinc-200 shadow-xl p-2 z-50 animate-in fade-in-50">
                <div className="px-3 py-1.5 text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 mb-1">
                  Switch Active Persona
                </div>
                <div className="p-0.5 space-y-1">
                  <button
                    onClick={() => {
                      quickLogin('student', students[0]?.id);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      activeRole === 'student' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-zinc-900">{students[0]?.fullName || 'Alexander Wright'}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">Student • {students[0]?.rollNumber || 'CS2024-001'}</div>
                    </div>
                    {activeRole === 'student' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      quickLogin('staff', staffList[0]?.id);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      activeRole === 'staff' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-zinc-900">{staffList[0]?.staffName || 'Dr. Alan Roberts'}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">Faculty • {staffList[0]?.staffId || 'STF-101'}</div>
                    </div>
                    {activeRole === 'staff' && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      quickLogin('admin');
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      activeRole === 'admin' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-zinc-900">Dean Vance</div>
                      <div className="text-[10px] text-zinc-500 font-mono">Central Administrator</div>
                    </div>
                    {activeRole === 'admin' && <Check className="w-4 h-4 text-zinc-900" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
                setShowRoleSwitcher(false);
              }}
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-zinc-900 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-zinc-200 shadow-xl overflow-hidden z-50 animate-in fade-in-50">
                <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 uppercase font-mono tracking-wider">
                      Notifications
                    </h4>
                    <p className="text-[11px] text-zinc-500">Official Campus Bulletins</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 custom-scrollbar">
                  {roleNotifs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-400">
                      No notifications at this time.
                    </div>
                  ) : (
                    roleNotifs.slice(0, 5).map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          onNavigate('notifications');
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-zinc-50 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-zinc-50/60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-semibold ${!n.isRead ? 'text-zinc-900' : 'text-zinc-700'}`}>
                            {n.title}
                          </span>
                          {!n.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 font-mono">
                          <span>{n.senderName || 'University Office'}</span>
                          <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 text-center">
                  <button
                    onClick={() => {
                      onNavigate('notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs font-medium text-zinc-700 hover:text-zinc-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    View bulletin board <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowRoleSwitcher(false);
              }}
              className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-zinc-100 transition-colors border border-transparent hover:border-zinc-200 cursor-pointer"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-md object-cover border border-zinc-200"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium text-zinc-900 truncate max-w-[120px]">
                  {currentUser?.name || 'Logged User'}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono leading-none">
                  {currentUser?.rollNumber || currentUser?.staffId || 'Administrator'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white border border-zinc-200 shadow-xl p-1.5 z-50 animate-in fade-in-50">
                <div className="p-2.5 border-b border-zinc-100">
                  <div className="text-xs font-semibold text-zinc-900">{currentUser?.name}</div>
                  <div className="text-[11px] text-zinc-500 truncate font-mono">{currentUser?.email}</div>
                  <div className="mt-1.5 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-zinc-100 text-zinc-700 font-semibold">
                    {activeRole} Account
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-zinc-500" />
                    Account Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
