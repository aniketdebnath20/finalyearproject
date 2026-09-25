import React, { useState, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { getTimeGreeting } from '../../utils/formatters';
import {
  Bell,
  Menu,
  LogOut,
  User as UserIcon,
  Sparkles,
  Building2,
  Settings,
  RotateCw
} from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  onNavigate: (tab: string) => void;
  onOpenSwitchPortal: () => void;
  onGoToHome?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  onNavigate,
  onOpenSwitchPortal,
  onGoToHome
}) => {
  const {
    currentUser,
    activeRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isDataLoading,
    refreshData,
    logout
  } = useUniversity();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Formatted date matching image format: "TUESDAY, 14 OCTOBER 2025"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  // Role-relevant notifications
  const roleNotifs = notifications.filter(
    n => n.targetRole === 'all' ||
    n.targetRole === activeRole ||
    (n.targetUserId && n.targetUserId === currentUser?.id)
  );
  const unreadCount = roleNotifs.filter(n => !n.isRead).length;

  // Live dynamic clock string
  const [currentTimeStr, setCurrentTimeStr] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic greeting calculation
  const firstName = currentUser?.name?.split(' ')[0] || (activeRole === 'admin' ? 'Registrar' : 'Alex');
  const greeting = `${getTimeGreeting()}, ${firstName}`;

  // Avatar initials
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : (activeRole === 'admin' ? 'RG' : 'AM');

  return (
    <header className="px-3.5 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-3 sm:pb-4 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Left: Mobile hamburger & Date + Greeting */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-white border border-[#e5dfd4] text-zinc-700 hover:text-zinc-900 shadow-2xs transition-colors cursor-pointer shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <div className="text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-zinc-400 uppercase font-medium flex items-center gap-1.5 truncate max-w-[140px] xs:max-w-[220px] sm:max-w-none">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="text-zinc-500 font-semibold">{currentTimeStr}</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#1a232d] mt-0.5 flex items-center gap-2 truncate max-w-[140px] xs:max-w-[220px] sm:max-w-none">
            <span>{greeting}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* Right: Notification bell, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Refresh Data Action with Loading Spinner */}
        <button
          id="topbar-refresh-data-btn"
          onClick={() => refreshData(450)}
          disabled={isDataLoading}
          className="p-2 rounded-full bg-white border border-[#e5dfd4] text-zinc-600 hover:text-zinc-900 shadow-2xs transition-colors relative cursor-pointer disabled:opacity-50"
          title="Refresh view data & synchronize"
          aria-label="Refresh view data"
        >
          <RotateCw className={`w-4 h-4 transition-transform ${isDataLoading ? 'animate-spin text-zinc-900' : ''}`} />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-full bg-white border border-[#e5dfd4] text-zinc-600 hover:text-zinc-900 shadow-2xs transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#ea580c] absolute top-1.5 right-1.5 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-xl border border-[#e4dfd5] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#1a232d]">Announcements & Notices</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#f4be5c] text-[#1a232d] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 custom-scrollbar">
                {roleNotifs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-400 font-mono">
                    No active notices for your account.
                  </div>
                ) : (
                  roleNotifs.slice(0, 6).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        setShowNotifications(false);
                        onNavigate('notifications');
                      }}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                        n.isRead ? 'bg-white hover:bg-zinc-50/70' : 'bg-amber-50/30 hover:bg-amber-50/60'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                        n.isRead ? 'bg-zinc-300' : 'bg-[#ea580c]'
                      }`} />
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-[#1a232d] truncate">{n.title}</h4>
                          <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                            {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-zinc-50/70 border-t border-zinc-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('notifications');
                  }}
                  className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 cursor-pointer"
                >
                  View full noticeboard →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Circle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full bg-[#d5e5dd] text-[#22483d] font-bold text-xs flex items-center justify-center border border-[#c4d7cd] shadow-2xs hover:scale-105 transition-all cursor-pointer"
            aria-label="User profile menu"
          >
            {initials}
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-[#e4dfd5] z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-zinc-100">
                <p className="text-xs font-bold text-[#1a232d] truncate">
                  {currentUser?.name || 'Alex Vance'}
                </p>
                <p className="text-[11px] text-zinc-400 font-mono truncate">
                  {currentUser?.email || 'alex@apexclasses.edu'}
                </p>
                <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4be5c]/30 text-[#1a232d] font-semibold">
                  {activeRole === 'admin' ? 'Classes Admin' : activeRole === 'staff' ? 'Tutor / Faculty' : 'Enrolled Student'}
                </span>
              </div>

              <div className="p-1 space-y-0.5 text-xs text-zinc-700">
                {activeRole === 'student' && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 text-left transition cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>My Profile</span>
                  </button>
                )}

                {activeRole === 'staff' && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 text-left transition cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Tutor Profile</span>
                  </button>
                )}

                {activeRole === 'admin' && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 text-left transition cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-zinc-400" />
                    <span>System Settings & Roadmap</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenSwitchPortal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 text-left transition cursor-pointer font-medium text-amber-900"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#f4be5c]" />
                  <span>Switch Workspace</span>
                </button>

                {onGoToHome && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onGoToHome();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 text-left transition cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Classes Portal Home</span>
                  </button>
                )}

                <div className="border-t border-zinc-100 my-1" />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-700 text-left transition cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
