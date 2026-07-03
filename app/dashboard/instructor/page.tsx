'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Cpu, FileSignature, FileText, RotateCcw, UserCheck } from 'lucide-react';

const instructorI18n = {
  vi: {
    pageTitle: 'Không gian Giảng viên',
    pageSubtitle: 'Đánh giá bài làm của học viên. Hỗ trợ học viên thấu hiểu kiến thức qua nhận xét chi tiết, không áp đặt điểm số.',
    filterPending: 'Chờ đánh giá',
    filterReviewed: 'Đã hoàn thành',
    studentName: 'Học viên',
    assignmentTitle: 'Bài tập',
    submittedAt: 'Thời điểm nộp',
    statusUnreviewed: 'Cần nhận xét',
    statusApproved: 'Đã đạt (Mastered)',
    statusRevisionNeeded: 'Cần cải thiện',
    btnReview: 'Xem bài làm',
    reviewPanelTitle: 'Đánh giá bài làm của',
    feedbackPlaceholder: 'Viết nhận xét chi tiết, chỉ ra điểm mạnh và hướng cải thiện cụ cụ thể cho học viên...',
    btnDraftWithAi: 'Tạo nháp nhận xét bằng AI',
    btnSubmitReview: 'Gửi nhận xét & Cập nhật kết quả',
    resultLabel: 'Kết quả đánh giá:',
    optMastered: 'Đã nắm vững (Mastered - Đạt trên 80%)',
    optRevision: 'Cần xem lại bài học (Revision Needed)',
    btnGenerate: 'Tạo nháp bằng AI',
  },
  en: {
    pageTitle: 'Instructor Workspace',
    pageSubtitle: 'Review student submissions. Help students master core concepts through descriptive feedback instead of rigid letter grades.',
    filterPending: 'Awaiting Review',
    filterReviewed: 'Completed',
    studentName: 'Student',
    assignmentTitle: 'Assignment',
    submittedAt: 'Submitted At',
    statusUnreviewed: 'Needs Review',
    statusApproved: 'Mastered',
    statusRevisionNeeded: 'Revision Needed',
    btnReview: 'Review work',
    reviewPanelTitle: 'Reviewing submission from',
    feedbackPlaceholder: 'Write detailed feedback, highlighting strengths and specific steps for improvement...',
    btnDraftWithAi: 'Draft feedback with AI',
    btnSubmitReview: 'Submit feedback & update status',
    resultLabel: 'Assessment Result:',
    optMastered: 'Mastered (Accredited ≥ 80%)',
    optRevision: 'Revision Needed',
    btnGenerate: 'Generate draft with AI',
  },
} as const;

const defaultSubmissions = [
  {
    id: 's1',
    student: 'Mai Tran',
    assignment: 'Bài tập React Composition',
    submittedAt: '1 giờ trước',
    status: 'pending',
    summary: 'Nộp bài tập component tree và state sharing.',
  },
  {
    id: 's2',
    student: 'Hung Nguyen',
    assignment: 'Bài tập TypeScript',
    submittedAt: '2 ngày trước',
    status: 'reviewed',
    summary: 'Bài hoàn chỉnh, chờ kiểm tra AI nhận xét.',
  },
];

type SubmissionStatus = 'pending' | 'reviewed';

type Submission = typeof defaultSubmissions[number];

export default function InstructorPage() {
  const [locale, setLocale] = useState<'vi' | 'en'>('vi');
  const [submissions, setSubmissions] = useState<Submission[]>(defaultSubmissions);
  const [selectedId, setSelectedId] = useState<string | null>('s1');
  const [feedback, setFeedback] = useState('');
  const [result, setResult] = useState<'approved' | 'revision'>('approved');
  const [loading, setLoading] = useState(false);
  const t = instructorI18n[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem('cacao_tlms_locale');
    if (saved === 'vi' || saved === 'en') setLocale(saved);

    const loadSubmissions = async () => {
      try {
        const response = await fetch('/api/instructor/submissions');
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setSubmissions(data.submissions ?? defaultSubmissions);
      } catch {
        setSubmissions(defaultSubmissions);
      }
    };

    loadSubmissions();
  }, []);

  const handleLocaleToggle = () => {
    const next = locale === 'vi' ? 'en' : 'vi';
    setLocale(next);
    window.localStorage.setItem('cacao_tlms_locale', next);
  };

  const selectedSubmission = submissions.find((item) => item.id === selectedId) ?? submissions[0];

  const handleDraftWithAI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/instructor/submissions/${selectedSubmission.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: true }),
      });
      const data = await response.json();
      setFeedback(data.feedback ?? 'Bài trình bày rõ ràng, hãy nhấn mạnh điểm cải thiện cụ thể và gợi ý thêm nguồn học cho học viên.');
    } catch {
      setFeedback('Bài trình bày khá tốt. Hãy tập trung vào điểm mạnh và hướng cải thiện chi tiết hơn.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedSubmission) return;
    setLoading(true);
    try {
      await fetch(`/api/instructor/submissions/${selectedSubmission.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, result }),
      });
      setSubmissions((current) =>
        current.map((item) =>
          item.id === selectedSubmission.id ? { ...item, status: 'reviewed' } : item,
        ),
      );
    } catch {
      // ignore
    } finally {
      setLoading(false);
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

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <section className="space-y-5">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <UserCheck className="h-4 w-4" strokeWidth={1.5} />
                <span>{t.filterPending}</span>
              </div>
              <div className="mt-5 space-y-4">
                {submissions.map((submission) => (
                  <button
                    key={submission.id}
                    type="button"
                    onClick={() => setSelectedId(submission.id)}
                    className={`w-full rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-4 text-left transition-colors duration-100 ${selectedId === submission.id ? 'border-neutral-900' : 'hover:bg-[#F1F1EF]'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#2F2F2F]">{submission.assignment}</p>
                        <p className="mt-1 text-xs font-normal text-neutral-600">{t.studentName}: {submission.student}</p>
                      </div>
                      <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                        {submission.status === 'pending' ? t.statusUnreviewed : t.statusApproved}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-neutral-600">{t.submittedAt} {submission.submittedAt}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-700">{t.reviewPanelTitle} {selectedSubmission?.student}</p>
                <p className="mt-1 text-xs text-neutral-600">{selectedSubmission?.assignment}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-[#FAFAFA] px-3 py-1 text-xs font-semibold text-neutral-700">
                <FileText className="h-4 w-4" strokeWidth={1.5} />
                {selectedSubmission?.status === 'pending' ? t.statusUnreviewed : t.statusApproved}
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder={t.feedbackPlaceholder}
                rows={8}
                className="w-full resize-none rounded-3xl border border-neutral-200 bg-[#FAFAFA] px-4 py-4 text-sm font-normal text-[#2F2F2F] outline-none transition-colors duration-100 focus:border-[#C5A880]"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>{t.resultLabel}</span>
                  <select
                    value={result}
                    onChange={(event) => setResult(event.target.value as 'approved' | 'revision')}
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-normal text-[#2F2F2F] outline-none transition-colors duration-100 focus:border-[#C5A880]"
                  >
                    <option value="approved">{t.optMastered}</option>
                    <option value="revision">{t.optRevision}</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDraftWithAI}
                  disabled={!selectedSubmission || loading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-[#2F2F2F] transition-colors duration-100 hover:bg-[#F1F1EF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Cpu className="h-4 w-4" strokeWidth={1.5} />
                  {t.btnDraftWithAi}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={!selectedSubmission || loading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-[#2F2F2F] px-4 py-3 text-sm font-medium text-white transition-colors duration-100 hover:bg-[#181818] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FileSignature className="h-4 w-4" strokeWidth={1.5} />
                  {t.btnSubmitReview}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
