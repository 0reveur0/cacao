'use client';

import { useEffect, useMemo, useState } from 'react';
import { Cpu, MessageSquare, User } from 'lucide-react';

const discussionI18n = {
  vi: {
    pageTitle: 'Không gian thảo luận',
    pageSubtitle: 'Nơi bạn trao đổi về bài học. Mỗi câu hỏi đều được Mentor và AI hỗ trợ giải đáp.',
    searchPlaceholder: 'Tìm kiếm câu hỏi hoặc chủ đề...',
    btnAsk: 'Đặt câu hỏi mới',
    labelTitle: 'Tiêu đề câu hỏi',
    labelContent: 'Nội dung chi tiết',
    inputContentPlaceholder: 'Viết câu hỏi của bạn tại đây...',
    tagLesson: 'Bài học liên quan',
    responseAi: 'Phản hồi từ AI',
    responseMentor: 'Phản hồi từ Mentor',
    statusResolved: 'Đã giải đáp',
    statusPending: 'Chờ phản hồi',
  },
  en: {
    pageTitle: 'Discussion Workspace',
    pageSubtitle: 'A space to discuss your lessons. Every question is supported by Mentors and AI.',
    searchPlaceholder: 'Search questions or topics...',
    btnAsk: 'Ask a new question',
    labelTitle: 'Question title',
    labelContent: 'Detailed content',
    inputContentPlaceholder: 'Write your question here...',
    tagLesson: 'Related lesson',
    responseAi: 'AI Response',
    responseMentor: 'Mentor Response',
    statusResolved: 'Resolved',
    statusPending: 'Pending',
  },
} as const;

const initialThreads = [
  {
    id: 'd1',
    title: 'Làm sao để gộp state trong React?',
    content: 'Em muốn lưu nhiều trường vào cùng một object và cập nhật chúng cùng lúc.',
    lesson: 'React Composition',
    status: 'pending',
    replies: [
      { type: 'ai', text: 'Bạn có thể dùng state object và cập nhật với spread operator.' },
    ],
  },
  {
    id: 'd2',
    title: 'Tối ưu hóa ghi chú thời gian thực với video',
    content: 'Nghe video và ghi chú đồng bộ, em nên tổ chức nội dung thế nào để dễ theo dõi?',
    lesson: 'TypeScript Fundamentals',
    status: 'resolved',
    replies: [
      { type: 'mentor', text: 'Tách mỗi mốc thời gian thành một ghi chú và sử dụng tiêu đề ngắn.' },
    ],
  },
];

type Thread = typeof initialThreads[number];

type Reply = { type: 'ai' | 'mentor'; text: string };

export default function DiscussionsPage() {
  const [locale, setLocale] = useState<'vi' | 'en'>('vi');
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [expanded, setExpanded] = useState<string | null>('d1');
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lesson, setLesson] = useState('TypeScript Fundamentals');
  const t = discussionI18n[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem('cacao_tlms_locale');
    if (saved === 'vi' || saved === 'en') setLocale(saved);

    const loadDiscussions = async () => {
      try {
        const response = await fetch('/api/discussions');
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setThreads(data.threads ?? initialThreads);
      } catch {
        setThreads(initialThreads);
      }
    };

    loadDiscussions();
  }, []);

  const filteredThreads = useMemo(
    () => threads.filter((thread) => thread.title.toLowerCase().includes(query.toLowerCase()) || thread.content.toLowerCase().includes(query.toLowerCase())),
    [query, threads],
  );

  const handleLocaleToggle = () => {
    const next = locale === 'vi' ? 'en' : 'vi';
    setLocale(next);
    window.localStorage.setItem('cacao_tlms_locale', next);
  };

  const handleSubmit = async () => {
    const newThread = {
      id: `d-${Date.now()}`,
      title: title || t.btnAsk,
      content,
      lesson,
      status: 'pending',
      replies: [],
    } as Thread;
    try {
      await fetch('/api/discussions/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newThread),
      });
      setThreads((current) => [newThread, ...current]);
      setTitle('');
      setContent('');
    } catch {
      setThreads((current) => [newThread, ...current]);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-10 text-[#2F2F2F]">
      <div className="mx-auto max-w-7xl space-y-6">
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

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-5">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <label className="block text-sm font-medium text-neutral-700">{t.searchPlaceholder}</label>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="mt-3 w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-sm font-normal text-[#2F2F2F] outline-none transition-colors duration-100 focus:border-[#C5A880]"
              />
            </div>

            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div key={thread.id} className="rounded-3xl border border-neutral-200 bg-white p-5">
                  <button
                    type="button"
                    onClick={() => setExpanded((current) => (current === thread.id ? null : thread.id))}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#2F2F2F]">{thread.title}</p>
                        <p className="mt-2 text-xs font-normal text-neutral-600">{thread.lesson}</p>
                      </div>
                      <span className="rounded-full border border-neutral-200 bg-[#FAFAFA] px-3 py-1 text-[11px] font-semibold text-neutral-700">
                        {thread.status === 'resolved' ? t.statusResolved : t.statusPending}
                      </span>
                    </div>
                  </button>

                  {expanded === thread.id ? (
                    <div className="mt-5 space-y-4 rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-4">
                      <p className="text-sm font-normal text-neutral-700">{thread.content}</p>
                      {thread.replies.map((reply, index) => (
                        <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                            {reply.type === 'ai' ? <Cpu className="h-4 w-4" strokeWidth={1.5} /> : <User className="h-4 w-4" strokeWidth={1.5} />}
                            <span>{reply.type === 'ai' ? t.responseAi : t.responseMentor}</span>
                          </div>
                          <p className="mt-3 text-sm text-neutral-700">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                <span>{t.btnAsk}</span>
              </div>
              <div className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-neutral-700">
                  {t.labelTitle}
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-sm font-normal text-[#2F2F2F] outline-none transition-colors duration-100 focus:border-[#C5A880]"
                    placeholder={t.labelTitle}
                  />
                </label>
                <label className="block text-sm font-medium text-neutral-700">
                  {t.labelContent}
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={5}
                    className="mt-3 w-full resize-none rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-sm font-normal text-[#2F2F2F] outline-none transition-colors duration-100 focus:border-[#C5A880]"
                    placeholder={t.inputContentPlaceholder}
                  />
                </label>
                <label className="block text-sm font-medium text-neutral-700">
                  {t.tagLesson}
                  <input
                    value={lesson}
                    onChange={(event) => setLesson(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-sm font-normal text-[#2F2F2F] outline-none transition-colors duration-100 focus:border-[#C5A880]"
                    placeholder={t.tagLesson}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-[#2F2F2F] px-4 py-3 text-sm font-medium text-white transition-colors duration-100 hover:bg-[#181818]"
                >
                  <span>{t.btnAsk}</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
