'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, Clock } from 'lucide-react';

const feedI18n = {
  vi: {
    pageTitle: 'Bản tin & Thông báo',
    pageSubtitle: 'Cập nhật các thông báo mới nhất từ giảng viên và hệ thống của bạn.',
    filterAll: 'Tất cả',
    filterSystem: 'Hệ thống',
    filterLecturer: 'Giảng viên',
    markAllRead: 'Đánh dấu tất cả đã đọc',
    emptyFeed: 'Không có thông báo mới nào.',
    timeJustNow: 'Vừa xong',
    timeHoursAgo: 'giờ trước',
  },
  en: {
    pageTitle: 'Updates & Announcements',
    pageSubtitle: 'Stay informed with the latest updates from your instructor and the workspace.',
    filterAll: 'All',
    filterSystem: 'System',
    filterLecturer: 'Instructor',
    markAllRead: 'Mark all as read',
    emptyFeed: 'No new announcements.',
    timeJustNow: 'Just now',
    timeHoursAgo: 'hours ago',
  },
} as const;

const initialFeed = [
  { id: 'n1', title: 'Giảng viên xuất bản hướng dẫn mới', subtitle: 'Xem lại tài liệu microservices trước buổi học tiếp theo.', type: 'lecturer', time: '1', unread: true },
  { id: 'n2', title: 'Hệ thống đã cập nhật trạng thái bài tập', subtitle: 'Bài tập của bạn đang chờ đánh giá.', type: 'system', time: '2', unread: true },
  { id: 'n3', title: 'Lời nhắc không gian học', subtitle: 'Đừng quên mở lại sổ tay trước buổi kiểm tra.', type: 'lecturer', time: '4', unread: false },
];

type FeedItem = typeof initialFeed[number];

export default function FeedPage() {
  const [locale, setLocale] = useState<'vi' | 'en'>('vi');
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [filter, setFilter] = useState<'all' | 'system' | 'lecturer'>('all');
  const t = feedI18n[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem('cacao_tlms_locale');
    if (saved === 'vi' || saved === 'en') setLocale(saved);

    const loadFeed = async () => {
      try {
        const response = await fetch('/api/feed');
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setFeed(data.feed ?? initialFeed);
      } catch {
        setFeed(initialFeed);
      }
    };

    loadFeed();
  }, []);

  const filteredFeed = useMemo(
    () => (filter === 'all' ? feed : feed.filter((item) => item.type === filter)),
    [feed, filter],
  );

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/feed/read-all', { method: 'POST' });
      setFeed((current) => current.map((item) => ({ ...item, unread: false })));
    } catch {
      setFeed((current) => current.map((item) => ({ ...item, unread: false })));
    }
  };

  const formatTime = (value: string) => {
    return locale === 'vi' ? `${value} ${t.timeHoursAgo}` : `${value} ${t.timeHoursAgo}`;
  };

  const handleLocaleToggle = () => {
    const next = locale === 'vi' ? 'en' : 'vi';
    setLocale(next);
    window.localStorage.setItem('cacao_tlms_locale', next);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-10 text-[#2F2F2F]">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-neutral-200 bg-white px-6 py-6">
          <div>
            <h1 className="text-2xl font-medium text-[#2F2F2F]">{t.pageTitle}</h1>
            <p className="mt-2 text-sm font-normal leading-6 text-neutral-600">{t.pageSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleLocaleToggle}
            className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-2 text-sm font-medium transition-colors duration-100 hover:bg-[#F1F1EF]"
          >
            {locale === 'vi' ? 'English' : 'Tiếng Việt'}
          </button>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-neutral-700">
              <Bell className="h-4 w-4" strokeWidth={1.5} />
              <span>{t.pageTitle}</span>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-2 text-sm font-medium transition-colors duration-100 hover:bg-[#F1F1EF]"
            >
              {t.markAllRead}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {([
              { key: 'all', label: t.filterAll },
              { key: 'system', label: t.filterSystem },
              { key: 'lecturer', label: t.filterLecturer },
            ] as const).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-2xl border px-4 py-2 text-sm font-medium transition-colors duration-100 ${filter === item.key ? 'border-neutral-900 bg-[#FAFAFA] text-[#2F2F2F]' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-[#F1F1EF]'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 divide-y divide-neutral-200">
            {filteredFeed.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] px-6 py-8 text-center text-sm text-neutral-600">{t.emptyFeed}</div>
            ) : (
              filteredFeed.map((item) => (
                <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-5 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-[#2F2F2F]">{item.title}</p>
                    <p className="mt-2 text-sm font-normal text-neutral-600">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-neutral-600">
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                    <span>{item.unread ? t.timeJustNow : formatTime(item.time)}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
