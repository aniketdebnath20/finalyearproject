import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Bell,
  AlertTriangle,
  Clock,
  ArrowUp
} from 'lucide-react';
import { StudentNotificationsSkeleton } from '../common/Skeleton';

interface StudentNotificationsViewProps {
  isLoading?: boolean;
}

export const StudentNotificationsView: React.FC<StudentNotificationsViewProps> = ({ isLoading }) => {
  const { notifications, currentUser, isDataLoading } = useUniversity();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledTop, setIsScrolledTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);

  // Notifications targeted to student or campus-wide or specifically to current student
  const studentNotifs = useMemo(() => {
    return notifications.filter(n => {
      const isForStudent =
        n.targetRole === 'student' ||
        n.targetRole === 'all' ||
        (n.targetUserId && n.targetUserId === currentUser?.id);
      return isForStudent;
    });
  }, [notifications, currentUser]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsScrolledTop(el.scrollTop > 12);
    setCanScrollBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 12);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    handleScroll();
  }, [studentNotifs]);

  if (isLoading || isDataLoading) {
    return <StudentNotificationsSkeleton />;
  }

  return (
    <div
      id="student-notifications-container"
      className="h-[calc(100vh-9rem)] max-h-[calc(100vh-9rem)] flex flex-col max-w-4xl mx-auto overflow-hidden"
    >
      {/* Pinned Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Official campus announcements, academic circulars, and directives
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700">
          {studentNotifs.length} Notice{studentNotifs.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Scrollable Container with Screen-View Height & Fade Scroll Effects */}
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
          id="student-notifications-list"
          className="flex-1 overflow-y-auto overscroll-contain pr-1.5 pb-6 space-y-3.5 custom-scrollbar scroll-smooth"
        >
          {studentNotifs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 shadow-xs mt-2">
              <Bell className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-zinc-800">No active notifications</h3>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                There are currently no new circulars or notices posted.
              </p>
            </div>
          ) : (
            studentNotifs.map(item => (
              <div
                key={item.id}
                id={`notice-item-${item.id}`}
                className="bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 p-5 sm:p-6 transition-all shadow-xs space-y-3"
              >
                <div className="space-y-1">
                  {item.priority === 'urgent' && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-bold mb-1">
                      <AlertTriangle className="w-3 h-3" /> Urgent
                    </div>
                  )}

                  <h3 className="text-sm sm:text-base font-serif font-semibold text-zinc-900 leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* Message Body */}
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
            ))
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
    </div>
  );
};
