import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Megaphone,
  Clock,
  Eye,
  ArrowUp
} from 'lucide-react';

export const StaffNotificationsView: React.FC = () => {
  const {
    notifications,
    currentUser,
    staffList,
    departments,
    sendNotification,
    deleteNotification
  } = useUniversity();

  // Scroll tracking for fade effect and quick scroll to top
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledTop, setIsScrolledTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsScrolledTop(el.scrollTop > 16);
    setCanScrollBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 12);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Find staff record for current logged in faculty member
  const currentStaff = useMemo(() => {
    return staffList.find(s => s.id === currentUser?.id || s.email === currentUser?.email) || staffList[0];
  }, [staffList, currentUser]);

  const currentDept = useMemo(() => {
    return departments.find(d => d.id === currentStaff?.departmentId);
  }, [departments, currentStaff]);

  // View Mode: 'list' | 'upload'
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');

  // Upload Form State - Title & Description
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Delete Confirmation State
  const [deletingNotifId, setDeletingNotifId] = useState<string | null>(null);

  // Relevant notifications for staff: all circulars targeted to staff/all, or uploaded by staff
  const staffNotifs = useMemo(() => {
    return notifications.filter(n => {
      const isStaffUpload = n.senderRole === 'staff' || n.senderId === currentStaff?.id || n.senderId === currentUser?.id;
      const isTargeted = n.targetRole === 'staff' || n.targetRole === 'all' || n.targetRole === 'student';
      return isStaffUpload || isTargeted;
    });
  }, [notifications, currentStaff, currentUser]);

  // Handle Upload Form Submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const senderName = currentStaff
      ? `${currentStaff.staffName}${currentDept ? ` (${currentDept.name})` : ''}`
      : (currentUser?.name || 'Faculty Member');

    sendNotification({
      title: title.trim(),
      message: message.trim(),
      targetRole: 'all',
      type: 'announcement',
      priority: 'normal',
      senderName,
      sender: senderName,
      senderId: currentStaff?.id || currentUser?.id,
      senderRole: 'staff',
      departmentId: currentStaff?.departmentId
    });

    setTitle('');
    setMessage('');
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setActiveTab('list');
    }, 1200);
  };

  // Confirm Delete (Only allowed if senderRole !== 'admin')
  const handleConfirmDelete = () => {
    if (!deletingNotifId) return;
    deleteNotification(deletingNotifId);
    setDeletingNotifId(null);
  };

  useEffect(() => {
    handleScroll();
  }, [staffNotifs, activeTab]);

  return (
    <div
      id="staff-notifications-container"
      className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Faculty circulars, academic notices, and university announcements
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === 'upload' ? 'list' : 'upload')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition cursor-pointer self-start sm:self-auto shadow-xs"
        >
          {activeTab === 'upload' ? (
            <>
              <Eye className="w-3.5 h-3.5" /> View Notifications
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Upload Notification
            </>
          )}
        </button>
      </div>

      {/* UPLOAD VIEW */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-xs space-y-5">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-zinc-700" />
              Upload Notification
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5 font-sans">
              Enter title and description to broadcast. You can delete notices you upload at any time.
            </p>
          </div>

          {uploadSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Notification uploaded successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Schedule for CS401 Laboratory Practical Sessions"
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 shadow-2xs font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                Description *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter complete notification details, instructions, or schedules..."
                className="w-full p-3 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed shadow-2xs font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Upload & Broadcast
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NOTIFICATIONS LIST VIEW (NO SEARCH BAR, NO CANCEL FUNCTION, NO DETAILS MODAL) */}
      {activeTab === 'list' && (
        <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden pt-3">
          {/* Top Fade Indicator */}
          <div
            className={`pointer-events-none absolute top-3 left-0 right-0 h-6 bg-gradient-to-b from-zinc-50 to-transparent z-10 transition-opacity duration-200 ${
              isScrolledTop ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 space-y-3.5 overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
          >
            {staffNotifs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 shadow-xs">
                <Megaphone className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-zinc-800">No notifications available</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Click "Upload Notification" to create your first announcement.
                </p>
              </div>
            ) : (
              staffNotifs.map(item => {
                const isAdminUpload = item.senderRole === 'admin';
                const canDelete = !isAdminUpload; // Staff can ONLY delete if NOT admin upload!

                return (
                  <div
                    key={item.id}
                    id={`staff-notice-${item.id}`}
                    className="bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 p-5 sm:p-6 transition-all shadow-xs space-y-3"
                  >
                    {/* At the top: small size text if admin upload show "Admin" */}
                    {isAdminUpload && (
                      <div className="pb-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                          Admin
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <h3 className="text-sm sm:text-base font-serif font-semibold text-zinc-900 leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      {/* Staff can delete ONLY if NOT uploaded by admin */}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setDeletingNotifId(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Message Body */}
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line font-sans">
                      {item.message}
                    </p>

                    {/* Metadata Footer */}
                    <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="text-zinc-600 font-medium">
                        Signatory: {item.sender || item.senderName || (isAdminUpload ? 'University Administration' : 'Faculty Member')}
                      </span>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(item.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Fade Indicator */}
          <div
            className={`pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-50 to-transparent z-10 transition-opacity duration-200 ${
              canScrollBottom ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Floating Quick Scroll to Top Action */}
          {isScrolledTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="absolute bottom-4 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs font-medium shadow-md transition-all backdrop-blur-xs cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[11px]">Top</span>
            </button>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingNotifId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-semibold text-zinc-900">Delete Notification</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Are you sure you want to permanently delete this notification? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                onClick={() => setDeletingNotifId(null)}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
