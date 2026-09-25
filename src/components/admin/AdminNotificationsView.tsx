import React, { useState, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Megaphone,
  Clock,
  Eye,
  UserCheck,
  ArrowUp
} from 'lucide-react';

export const AdminNotificationsView: React.FC = () => {
  const {
    notifications,
    sendNotification,
    deleteNotification,
    currentUser
  } = useUniversity();

  // View Mode: 'list' | 'upload'
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');

  // Upload Form State - Title & Description
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Delete Modal State
  const [deletingNotifId, setDeletingNotifId] = useState<string | null>(null);

  // Scroll tracking for fade effect and scroll to top button
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

  useEffect(() => {
    handleScroll();
  }, [notifications, activeTab]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendNotification({
      title: title.trim(),
      message: message.trim(),
      targetRole: 'all',
      type: 'announcement',
      priority: 'normal',
      senderName: currentUser?.name || 'Office of the Vice Chancellor',
      sender: currentUser?.name || 'Office of the Vice Chancellor',
      senderRole: 'admin'
    });

    setTitle('');
    setMessage('');
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setActiveTab('list');
    }, 1200);
  };

  const handleConfirmDelete = () => {
    if (!deletingNotifId) return;
    deleteNotification(deletingNotifId);
    setDeletingNotifId(null);
  };

  return (
    <div
      id="admin-notifications-container"
      className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col max-w-4xl mx-auto overflow-hidden w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Campus announcements, academic directives, and institutional notices
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
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar scroll-smooth pr-1 mt-3">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-xs space-y-5">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-zinc-700" />
                Upload Notification
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5 font-sans">
                Enter title and description to broadcast across the institution.
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
                  placeholder="e.g. Annual Convocation & Academic Robing Protocol"
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
                  placeholder="Enter official statement, guidelines, deadlines, or instructions..."
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
        </div>
      )}

      {/* NOTIFICATIONS LIST VIEW */}
      {activeTab === 'list' && (
        <div className="relative flex-1 min-h-0 mt-3 flex flex-col overflow-hidden">
          {/* Top Fade Scroll Indicator */}
          <div
            className={`pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#f7f4ed] to-transparent z-10 transition-opacity duration-200 ${
              isScrolledTop ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Scrollable Notifications List */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            id="admin-notifications-list"
            className="flex-1 overflow-y-auto overscroll-contain pr-1.5 pb-6 space-y-3.5 custom-scrollbar scroll-smooth"
          >
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 shadow-xs">
                <Megaphone className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-zinc-800">No notifications available</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Click "Upload Notification" to create your first announcement.
                </p>
              </div>
            ) : (
              notifications.map(item => {
                const isStaffOrigin = item.senderRole === 'staff';

                return (
                  <div
                    key={item.id}
                    id={`admin-notice-${item.id}`}
                    className="bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 p-5 sm:p-6 transition-all shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        {isStaffOrigin ? (
                          <div className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium mb-1">
                            <UserCheck className="w-3 h-3 text-zinc-500" /> Uploaded by Staff
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium mb-1">
                            Admin Broadcast
                          </div>
                        )}

                        <h3 className="text-sm sm:text-base font-serif font-semibold text-zinc-900 leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      {/* Admin can delete ANY notification */}
                      <button
                        type="button"
                        onClick={() => setDeletingNotifId(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                        title="Permanently delete announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Message Statement */}
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line font-sans">
                      {item.message}
                    </p>

                    {/* Metadata Footer */}
                    <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="text-zinc-600 font-medium">
                        Signatory: {item.sender || item.senderName || 'University Administration'}
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

          {/* Bottom Fade Scroll Indicator */}
          <div
            className={`pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#f7f4ed] to-transparent z-10 transition-opacity duration-200 ${
              canScrollBottom ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Floating Quick Scroll to Top Action when scrolled */}
          {isScrolledTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="absolute bottom-3 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs font-medium shadow-md transition-all backdrop-blur-xs cursor-pointer"
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
                <h3 className="text-base font-semibold text-zinc-900">Delete Announcement</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Are you sure you want to permanently purge this announcement? It will be removed from all student, faculty, and administrative dashboards.
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
