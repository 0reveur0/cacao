'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, FileText, UploadCloud } from 'lucide-react';

const assignmentI18n = {
  vi: {
    taskTodo: 'Chưa làm',
    taskDoing: 'Đang làm',
    taskReview: 'Chờ chấm bài',
    taskDone: 'Hoàn thành',
    dragDropFile: 'Nhấp để chọn tệp hoặc kéo thả bài làm vào đây (PDF, ZIP)',
    viewFeedback: 'Xem nhận xét từ AI hoặc Giảng viên',
    dueDate: 'Hạn nộp',
    pageTitle: 'Bài tập Kanban',
    pageSubtitle: 'Quản lý tiến độ và nộp bài theo từng trạng thái rõ ràng.',
    btnSubmit: 'Nộp bài',
    btnViewFeedback: 'Xem phản hồi',
  },
  en: {
    taskTodo: 'To Do',
    taskDoing: 'In progress',
    taskReview: 'Under Review',
    taskDone: 'Completed',
    dragDropFile: 'Click to upload or drag your file here (PDF, ZIP)',
    viewFeedback: 'View AI or Mentor feedback',
    dueDate: 'Due date',
    pageTitle: 'Kanban Assignments',
    pageSubtitle: 'Track your project workload in a clean board view.',
    btnSubmit: 'Submit work',
    btnViewFeedback: 'View feedback',
  },
} as const;

const statusLabels = ['todo', 'doing', 'review', 'done'] as const;

type AssignmentStatus = (typeof statusLabels)[number];

type AssignmentItem = {
  id: string;
  title: string;
  status: AssignmentStatus;
  due: string;
  summary: string;
  feedback?: string;
};

const defaultAssignments: AssignmentItem[] = [
  {
    id: 'task-1',
    title: 'Thiết kế module lịch học',
    status: 'todo',
    due: 'Hôm nay',
    summary: 'Chuẩn bị đề bài và tài liệu cho buổi học tiếp theo.',
  },
  {
    id: 'task-2',
    title: 'Nộp báo cáo React',
    status: 'doing',
    due: 'Ngày mai',
    summary: 'Hoàn thành form upload và kiểm thử chức năng.',
    feedback: 'Giữ nội dung rõ ràng, tập trung vào flow chính.',
  },
  {
    id: 'task-3',
    title: 'Kiểm tra học phần AI Prompting',
    status: 'review',
    due: 'Hôm qua',
    summary: 'Đã gửi bài, chờ Mentor và AI phản hồi.',
  },
  {
    id: 'task-4',
    title: 'Tổng kết kiến thức TypeScript',
    status: 'done',
    due: 'Tuần trước',
    summary: 'Bài tập đã hoàn thành và được chấm lại.',
    feedback: 'Tốt, tiếp tục giữ nhịp học ổn định.',
  },
];

const statusStyles: Record<AssignmentStatus, string> = {
  todo: 'bg-[#FFF2CC] text-[#7F6000]',
  doing: 'bg-[#E2F0D9] text-[#385723]',
  review: 'bg-[#FBECD9] text-[#92400E]',
  done: 'bg-[#E2F0D9] text-[#385723]',
};

export default function AssignmentsPage() {
  const [locale, setLocale] = useState<'vi' | 'en'>('vi');
  const [assignments, setAssignments] = useState<AssignmentItem[]>(defaultAssignments);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const t = assignmentI18n[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem('cacao_tlms_locale');
    if (saved === 'vi' || saved === 'en') setLocale(saved);

    const loadAssignments = async () => {
      try {
        const response = await fetch('/api/assignments');
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setAssignments(data.assignments ?? defaultAssignments);
      } catch {
        setAssignments(defaultAssignments);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const columns = useMemo(
    () =>
      statusLabels.map((status) => ({
        status,
        title:
          status === 'todo'
            ? t.taskTodo
            : status === 'doing'
            ? t.taskDoing
            : status === 'review'
            ? t.taskReview
            : t.taskDone,
        items: assignments.filter((item) => item.status === status),
      })),
    [assignments, t],
  );

  const handleLocaleToggle = () => {
    const next = locale === 'vi' ? 'en' : 'vi';
    setLocale(next);
    window.localStorage.setItem('cacao_tlms_locale', next);
  };

  const handleSubmitWork = async (id: string) => {
    setSubmitting((current) => ({ ...current, [id]: true }));
    try {
      await fetch(`/api/assignments/${id}/submit`, { method: 'POST' });
      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === id ? { ...assignment, status: 'review', feedback: assignment.feedback ?? '' } : assignment,
        ),
      );
    } catch {
      // ignore for minimal interface
    } finally {
      setSubmitting((current) => ({ ...current, [id]: false }));
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

        <div className="grid gap-5 lg:grid-cols-4">
          {columns.map((column) => (
            <section key={column.status} className="rounded-3xl border border-neutral-200 bg-white p-5">
              <div className="mb-5 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-neutral-700">{column.title}</span>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusStyles[column.status]}`}>
                  {column.items.length}
                </span>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] px-4 py-5 text-sm text-neutral-500">Loading...</div>
                ) : column.items.length === 0 ? (
                  <div className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] px-4 py-5 text-sm text-neutral-600">—</div>
                ) : (
                  column.items.map((item) => (
                    <article key={item.id} className="rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-sm font-medium text-[#2F2F2F]">{item.title}</h2>
                          <p className="mt-2 text-xs font-normal leading-5 text-neutral-600">{item.summary}</p>
                        </div>
                        <span className="text-xs font-semibold text-neutral-600">{t.dueDate}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-neutral-700">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 border border-neutral-200">
                          <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {item.due}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSubmitWork(item.id)}
                          disabled={item.status !== 'todo' || submitting[item.id]}
                          className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-3 py-2 text-xs font-medium transition-colors duration-100 hover:bg-[#F1F1EF] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <UploadCloud className="h-4 w-4" strokeWidth={1.5} />
                          {t.btnSubmit}
                        </button>
                      </div>
                      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" strokeWidth={1.5} />
                          <span>{t.dragDropFile}</span>
                        </div>
                        {item.feedback ? (
                          <p className="mt-3 text-xs font-normal text-neutral-600">{t.viewFeedback}: {item.feedback}</p>
                        ) : null}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
