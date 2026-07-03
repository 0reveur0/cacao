'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, FileText, Play, Save } from 'lucide-react';
import { useParams } from 'next/navigation';

const lessonI18n = {
  vi: {
    addTimestamp: 'Ghi lại mốc thời gian',
    saveNotes: 'Lưu sổ tay',
    readingMaterial: 'Tài liệu đọc bổ trợ',
    downloadPdf: 'Tải tệp PDF',
    placeholderText: 'Nhập nội dung ghi chú của bạn tại đây...',
  },
  en: {
    addTimestamp: 'Add timestamp',
    saveNotes: 'Save notes',
    readingMaterial: 'Supplementary Reading',
    downloadPdf: 'Download PDF',
    placeholderText: 'Type your lecture notes here...',
  },
} as const;

type NoteItem = {
  timestamp: number;
  text: string;
};

const formatTimestamp = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params?.id ?? 'lesson-1';
  const [locale, setLocale] = useState<'vi' | 'en'>('vi');
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const t = lessonI18n[locale];

  useEffect(() => {
    const savedLocale = window.localStorage.getItem('cacao_tlms_locale');
    if (savedLocale === 'vi' || savedLocale === 'en') setLocale(savedLocale);

    const loadNotes = async () => {
      try {
        const response = await fetch(`/api/lesson-notes/${lessonId}`);
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setNotes(data.notes ?? []);
      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [lessonId]);

  const handleAddTimestamp = () => {
    const current = videoRef.current?.currentTime ?? 0;
    if (!draft.trim()) return;
    const item = { timestamp: current, text: draft.trim() };
    setNotes((currentNotes) => [...currentNotes, item]);
    setDraft('');
  };

  const handleSeek = (timestamp: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timestamp;
    videoRef.current.play();
  };

  const handleSaveNotes = async () => {
    try {
      await fetch(`/api/lesson-notes/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    }
  };

  const transcript = useMemo(
    () =>
      notes.map((note) => `${formatTimestamp(note.timestamp)} - ${note.text}`),
    [notes],
  );

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-10 text-[#2F2F2F]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-700">{lessonId}</p>
              <h1 className="mt-2 text-2xl font-medium text-[#2F2F2F]">Lesson details</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-2 text-sm font-medium text-neutral-700">
              <Clock className="h-4 w-4" strokeWidth={1.5} />
              {locale === 'vi' ? 'Theo dõi ghi chú' : 'Track your notes'}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="aspect-video overflow-hidden rounded-3xl border border-neutral-200 bg-black">
              <video
                ref={videoRef}
                controls
                className="h-full w-full object-cover"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="/video-poster.png"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-neutral-700">
              <div className="inline-flex items-center gap-2">
                <Play className="h-4 w-4" strokeWidth={1.5} />
                <span>{t.addTimestamp}</span>
              </div>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-sm font-medium transition-colors duration-100 hover:bg-[#F1F1EF]"
              >
                <Save className="h-4 w-4" strokeWidth={1.5} />
                {t.saveNotes}
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t.placeholderText}
                rows={5}
                className="w-full resize-none rounded-3xl border border-neutral-200 bg-[#FAFAFA] px-4 py-4 text-sm font-normal text-[#2F2F2F] outline-none transition-colors duration-100 focus:border-[#C5A880]"
              />
              <button
                type="button"
                onClick={handleAddTimestamp}
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-[#2F2F2F] px-5 py-3 text-sm font-medium text-white transition-colors duration-100 hover:bg-[#181818]"
              >
                <Clock className="h-4 w-4" strokeWidth={1.5} />
                {t.addTimestamp}
              </button>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <FileText className="h-4 w-4" strokeWidth={1.5} />
                <span>{t.readingMaterial}</span>
              </div>
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-4 text-sm text-neutral-700">
                  <p className="font-medium text-[#2F2F2F]">{t.downloadPdf}</p>
                  <p className="mt-2 text-sm text-neutral-600">PDF hướng dẫn bài học và đề bài chi tiết.</p>
                </div>
                <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-4 text-sm text-neutral-700">
                  <p className="font-medium text-[#2F2F2F]">{t.downloadPdf}</p>
                  <p className="mt-2 text-sm text-neutral-600">Bản ghi ngắn nội dung bài học để tham khảo.</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <span>Notebook</span>
              </div>
              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] px-4 py-5 text-sm text-neutral-500">Loading notes...</div>
                ) : notes.length === 0 ? (
                  <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] px-4 py-5 text-sm text-neutral-600">No notes yet.</div>
                ) : (
                  notes.map((note, index) => (
                    <button
                      key={`${note.timestamp}-${index}`}
                      type="button"
                      onClick={() => handleSeek(note.timestamp)}
                      className="w-full rounded-3xl border border-neutral-200 bg-white px-4 py-4 text-left text-sm font-normal text-neutral-700 transition-colors duration-100 hover:bg-[#F1F1EF]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-[#2F2F2F]">{formatTimestamp(note.timestamp)}</span>
                        <span className="text-xs text-neutral-500">Jump</span>
                      </div>
                      <p className="mt-2 text-sm text-neutral-600">{note.text}</p>
                    </button>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
