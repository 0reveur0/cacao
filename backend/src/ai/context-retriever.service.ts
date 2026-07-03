import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContextRetrieverService {
  constructor(private prisma: PrismaService) {}

  async getLessonContext(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true,
        notes: {
          where: { userId },
          select: { content: true },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Bài học không tồn tại');
    }

    const noteContent = lesson.notes.length
      ? lesson.notes.map((note) => note.content).join('\n\n')
      : null;

    const contextSections = [
      `Khóa học: ${lesson.course.title}`,
      `Tiêu đề bài học: ${lesson.title}`,
      `Nội dung chính:`,
      `- Video bài học: ${lesson.videoUrl}`,
      lesson.pdfUrl ? `- Tài liệu PDF: ${lesson.pdfUrl}` : '- Tài liệu PDF: không có',
      noteContent ? `Ghi chú của bạn:\n${noteContent}` : 'Ghi chú của bạn: không có ghi chú.',
    ];

    return {
      lessonId: lesson.id,
      courseTitle: lesson.course.title,
      lessonTitle: lesson.title,
      pdfUrl: lesson.pdfUrl,
      videoUrl: lesson.videoUrl,
      notes: lesson.notes.map((note) => note.content),
      markdown: contextSections.join('\n\n'),
    };
  }
}
