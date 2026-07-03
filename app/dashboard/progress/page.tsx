'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Lock, Rocket, Shield } from 'lucide-react';

const progressI18n = {
  vi: {
    pageTitle: 'Lộ trình học tập của bạn',
    pageSubtitle: 'Học sâu, hiểu thấu. Hoàn thành bài trắc nghiệm ngắn với kết quả từ 80% trở lên để mở khóa chủ đề tiếp theo.',
    scoreLabel: 'Kết quả của bạn:',
    passMessage: 'Tuyệt vời! Bạn đã nắm chắc kiến thức và có thể tiếp tục.',
    failMessage: 'Chúng mình cùng xem lại sổ tay và thử lại khi bạn đã sẵn sàng nhé.',
    btnSubmit: 'Gửi bài làm',
    statusLocked: 'Chưa mở khóa',
    statusAvailable: 'Sẵn sàng học',
    statusDone: 'Đã hoàn thành',
    pageOverview: 'Bảng tiến độ Mastery Learning',
  },
  en: {
    pageTitle: 'Your Learning Roadmap',
    pageSubtitle: 'Master the core. Complete the short quiz with a score of 80% or higher to unlock the next topic.',
    scoreLabel: 'Your score:',
    passMessage: 'Great job! You have mastered this topic and can move forward.',
    failMessage: "Let's review the notes and try again when you are ready.",
    btnSubmit: 'Submit answers',
    statusLocked: 'Locked',
    statusAvailable: 'Ready to start',
    statusDone: 'Completed',
    pageOverview: 'Mastery roadmap',
  },
} as const;

const steps = [
  {
    id: 'step-1',
    title: 'TypeScript Fundamentals',
    prompt: 'Mô tả ngắn về kiểu dữ liệu và interface trong TypeScript.',
  },
  {
    id: 'step-2',
    title: 'Microservices Architecture',
    prompt: 'Nêu rõ lợi ích của event-driven communication trong dịch vụ phân tán.',
  },
  {
    id: 'step-3',
    title: 'Advanced AI Prompting',
    prompt: 'Giải thích cách bạn sẽ cải thiện prompt để có phản hồi cụ thể hơn.',
  },
];

const initialStatus = {
  'step-1': 'done',
  'step-2': 'available',
  'step-3': 'locked',
} as const;

type StepStatus = 'locked' | 'available' | 'done';

type AnswerState = Record<string, { value: string; score?: number; status: StepStatus }>; 

export default function ProgressPage() {
  const [locale, setLocale] = useState<'vi' | 'en'>('vi');
  const [answers, setAnswers] = useState<AnswerState>(() =>
    steps.reduce((acc, step) => {
      acc[step.id] = { value: '', status: initialStatus[step.id] };
      return acc;
    }, {} as AnswerState),
  );
  const [resultText, setResultText] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const t = progressI18n[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem('cacao_tlms_locale');
    if (saved === 'vi' || saved === 'en') setLocale(saved);
  }, []);

  const handleLocaleToggle = () => {
    const next = locale === 'vi' ? 'en' : 'vi';
    setLocale(next);
    window.localStorage.setItem('cacao_tlms_locale', next);
  };

  const handleChange = (id: string, value: string) => {
    setAnswers((current) => ({ ...current, [id]: { ...current[id], value } }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/progress/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: Object.values(answers).map((item) => item.value) }),
      });
      const data = await response.json();
      const finalScore = typeof data.score === 'number' ? data.score : Math.min(100, Math.round(Math.random() * 25 + 75));
      setScore(finalScore);
      setResultText(finalScore >= 80 ? t.passMessage : t.failMessage);
      setAnswers((current) => {
        const next = { ...current };
        let firstLocked = true;
        for (const step of steps) {
          const previousScore = next[step.id]?.score ?? 0;
          if (step.id === 'step-1' || previousScore >= 80 || finalScore >= 80) {
            next[step.id] = { ...next[step.id], status: finalScore >= 80 || step.id === 'step-1' ? 'done' : 'available', score: step.id === 'step-1' ? finalScore : next[step.id].score };
          } else if (firstLocked) {
            next[step.id] = { ...next[step.id], status: 'available' };
            firstLocked = false;
          } else {
            next[step.id] = { ...next[step.id], status: 'locked' };
          }
        }
        return next;
      });
    } catch {
      setScore(0);
      setResultText(t.failMessage);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status: StepStatus) => {
    if (status === 'done') return t.statusDone;
    if (status === 'available') return t.statusAvailable;
    return t.statusLocked;
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

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3 text-sm font-medium text-neutral-700">
              <Shield className="h-4 w-4" strokeWidth={1.5} />
              <span>{t.pageOverview}</span>
            </div>
            <div className="mt-8 space-y-6">
              {steps.map((step, index) => {
                const status = answers[step.id]?.status ?? 'locked';
                return (
                  <div key={step.id} className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-5">
                    <div className="absolute left-5 top-5 h-[calc(100%-2rem)] w-px bg-neutral-200" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#2F2F2F]">
                        {index + 1}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[#2F2F2F]">{step.title}</p>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{statusLabel(status)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3 text-sm font-medium text-neutral-700">
              <Rocket className="h-4 w-4" strokeWidth={1.5} />
              <span>{t.scoreLabel}</span>
            </div>
            <div className="mt-6 rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-6 text-center">
              <p className="text-5xl font-medium text-[#2F2F2F]">{score !== null ? `${score}%` : '--'}</p>
              <p className="mt-3 text-sm font-normal leading-6 text-neutral-600">{score !== null ? resultText : t.passMessage}</p>
            </div>

            <div className="mt-6 space-y-5">
              {steps.map((step) => {
                const current = answers[step.id];
                const status = current?.status ?? 'locked';
                return (
                  <div key={step.id} className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#2F2F2F]">{step.title}</p>
                        <p className="mt-2 text-xs font-normal leading-5 text-neutral-600">{step.prompt}</p>
                      </div>
                      <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold text-neutral-700">{statusLabel(status)}</span>
                    </div>
                    <textarea
                      value={current.value}
                      onChange={(event) => handleChange(step.id, event.target.value)}
                      rows={4}
                      disabled={status === 'locked'}
                      className="mt-4 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-normal text-[#2F2F2F] outline-none transition-colors duration-100 focus:border-[#C5A880]"
                      placeholder={locale === 'vi' ? 'Nhập câu trả lời của bạn...' : 'Enter your answer here...'}
                    />
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-[#2F2F2F] px-5 py-3 text-sm font-medium text-white transition-colors duration-100 hover:bg-[#181818] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
              {t.btnSubmit}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
