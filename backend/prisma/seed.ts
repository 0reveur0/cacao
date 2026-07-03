import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Khởi tạo dữ liệu mẫu cho Cacao TLMS...');

  const passwordHashAdmin = await bcrypt.hash('AdminPass123!', 10);
  const passwordHashInstructor = await bcrypt.hash('InstructorPass123!', 10);
  const passwordHashStudent1 = await bcrypt.hash('StudentPass123!', 10);
  const passwordHashStudent2 = await bcrypt.hash('StudentPass123!', 10);
  const passwordHashStudent3 = await bcrypt.hash('StudentPass123!', 10);

  console.log('Tạo tài khoản người dùng...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cacao.local' },
    update: {},
    create: {
      email: 'admin@cacao.local',
      passwordHash: passwordHashAdmin,
      fullName: 'Nguyễn Anh Quân',
      role: 'ADMIN',
      locale: 'vi',
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: 'giangvien@cacao.local' },
    update: {},
    create: {
      email: 'giangvien@cacao.local',
      passwordHash: passwordHashInstructor,
      fullName: 'Lê Thị Mai',
      role: 'INSTRUCTOR',
      locale: 'vi',
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'huy@cacao.local' },
    update: {},
    create: {
      email: 'huy@cacao.local',
      passwordHash: passwordHashStudent1,
      fullName: 'Phạm Huy',
      role: 'STUDENT',
      locale: 'vi',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'lan@cacao.local' },
    update: {},
    create: {
      email: 'lan@cacao.local',
      passwordHash: passwordHashStudent2,
      fullName: 'Đặng Lan',
      role: 'STUDENT',
      locale: 'vi',
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'an@cacao.local' },
    update: {},
    create: {
      email: 'an@cacao.local',
      passwordHash: passwordHashStudent3,
      fullName: 'Trần Văn An',
      role: 'STUDENT',
      locale: 'vi',
    },
  });

  console.log('Tạo khóa học và bài học...');
  const course = await prisma.course.upsert({
    where: { title: 'Kien thuc lap trinh hien dai' },
    update: {},
    create: {
      title: 'Kien thuc lap trinh hien dai',
      description: 'Khoa hoc co ban phu hop cho nguoi muon xay dung nen tang cong nghe hien dai.',
    },
  });

  const lesson1 = await prisma.lesson.upsert({
    where: { id: 'lesson-1' },
    update: {},
    create: {
      id: 'lesson-1',
      courseId: course.id,
      title: 'Lap trinh TypeScript co ban',
      videoUrl: 'https://example.com/video/typescript.mp4',
      pdfUrl: 'https://example.com/pdf/typescript.pdf',
      sequence: 1,
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { id: 'lesson-2' },
    update: {},
    create: {
      id: 'lesson-2',
      courseId: course.id,
      title: 'Xay dung kien truc Microservices',
      videoUrl: 'https://example.com/video/microservices.mp4',
      pdfUrl: 'https://example.com/pdf/microservices.pdf',
      sequence: 2,
    },
  });

  const lesson3 = await prisma.lesson.upsert({
    where: { id: 'lesson-3' },
    update: {},
    create: {
      id: 'lesson-3',
      courseId: course.id,
      title: 'Lap trinh AI Prompting nang cao',
      videoUrl: 'https://example.com/video/ai-prompting.mp4',
      pdfUrl: 'https://example.com/pdf/ai-prompting.pdf',
      sequence: 3,
    },
  });

  console.log('Tạo MilestoneQuiz cho bài học 1...');
  await prisma.milestoneQuiz.upsert({
    where: { lessonId: lesson1.id },
    update: {},
    create: {
      lessonId: lesson1.id,
      questions: [
        {
          question: 'TypeScript cho phép bạn khai báo kiểu cho biến như thế nào?',
          choices: ['var x = 10', 'let x: number = 10', 'x := 10'],
          correctIndex: 1,
        },
        {
          question: 'Interface trong TypeScript được sử dụng để?',
          choices: ['Định nghĩa kiểu cấu trúc đối tượng', 'Tạo component React', 'Cấu hình máy chủ'],
          correctIndex: 0,
        },
        {
          question: 'Khi nào bạn dùng union type?',
          choices: ['Khi giá trị có nhiều kiểu có thể xảy ra', 'Khi muốn tạo hàm async', 'Khi định nghĩa route'],
          correctIndex: 0,
        },
      ],
    },
  });

  console.log('Tạo các thảo luận mẫu...');
  const discussion1 = await prisma.discussion.upsert({
    where: { title: 'Làm sao để sử dụng type guard trong TypeScript?' },
    update: {},
    create: {
      userId: student1.id,
      title: 'Làm sao để sử dụng type guard trong TypeScript?',
      content: 'Em muon biet cach kiem tra kieu cua mot bien khi su dung union type trong TypeScript.',
      resolved: false,
    },
  });

  await prisma.discussionReply.upsert({
    where: { id: 'reply-1' },
    update: {},
    create: {
      id: 'reply-1',
      discussionId: discussion1.id,
      userId: instructor.id,
      content: 'Em co the dung bang toan kieu va ham is để kiem tra. Neu can, anh se gui them vi du.',
      isAiResponse: false,
    },
  });

  const discussion2 = await prisma.discussion.upsert({
    where: { title: 'Nên chuẩn bị những gì trước khi học Microservices?' },
    update: {},
    create: {
      userId: student2.id,
      title: 'Nên chuẩn bị những gì trước khi học Microservices?',
      content: 'Em muon hieu ro tai sao phai co kien thuc ve API va co che giao tiep truoc.',
      resolved: false,
    },
  });

  await prisma.discussionReply.upsert({
    where: { id: 'reply-2' },
    update: {},
    create: {
      id: 'reply-2',
      discussionId: discussion2.id,
      userId: instructor.id,
      content: 'Tien to la ban can thong thao HTTP, REST, va cach thiet ke API de tao microservices ben vung.',
      isAiResponse: false,
    },
  });

  console.log('Dữ liệu mẫu đã được tạo xong.');
  console.log('Người dùng mẫu: admin@cacao.local / AdminPass123!');
  console.log('Giảng viên mẫu: giangvien@cacao.local / InstructorPass123!');
  console.log('Học viên mẫu: huy@cacao.local / StudentPass123!');
}

main()
  .catch((error) => {
    console.error('Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
