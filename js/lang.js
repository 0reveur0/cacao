export const translations = {
    vi: {
        'nav.lang.en': 'EN',
        'nav.lang.vi': 'VI',
        'logout': 'Thoát',
        'text.by': 'bởi',
        'text.reason': 'Lý do',
        'swal.title.error': 'Lỗi',
        'swal.title.sent': 'Đã gửi!',
        'swal.title.report': 'Gắn cờ vi phạm',
        'swal.text.report_thanks': 'Cảm ơn bạn — BQT sẽ xử lý sớm.',
        'swal.confirm.report': 'Gửi báo cáo',
        'swal.cancel': 'Hủy',
        'swal.loading.login': 'Đang đăng nhập...',
        'swal.loading.register': 'Đang tạo tài khoản...',
        'swal.loading.connecting': 'Đang kết nối với',
        'swal.loading.sending_link': 'Đang gửi link...',
        'swal.text.magic_link_sent': 'Link đăng nhập đã gửi tới',
        'login.title': 'Đăng nhập CACAO',
        'login.subtitle': 'Học tập cùng cộng đồng',
        'login.form.email': 'Email của bạn',
        'login.form.password': 'Mật khẩu',
        'login.form.button': 'Đăng nhập',
        'login.social.separator': 'hoặc đăng nhập với',
        'login.register.link': 'Chưa có tài khoản?',
        'login.register.cta': 'Đăng ký ngay',
        'register.form.title': 'Tạo tài khoản',
        'register.role.question': 'Bạn muốn tham gia với vai trò nào?',
        'register.role.learner': 'Học viên',
        'register.role.learner.desc': 'Theo dõi, học hỏi và thảo luận.',
        'register.role.mentor': 'Mentor',
        'register.role.mentor.desc': 'Chia sẻ kiến thức, đăng bài giảng.',
        'register.form.button': 'Hoàn tất đăng ký',
        'register.login.link': 'Đã có tài khoản?',
        'register.login.cta': 'Quay lại đăng nhập',
        'index.page.title': 'CACAO — Feed học tập',
        'index.header.welcome': 'Chào',
        'index.create.button': 'Đăng bài giảng',
        'admin.title': 'Bảng điều khiển Admin',
        'admin.header.user': 'Xin chào,',
        'admin.stats.total_users': 'Tổng số người dùng',
        'admin.stats.total_mentors': 'Tổng số mentor',
        'admin.stats.pending_courses': 'Bài giảng chờ duyệt',
        'admin.approval.title': 'Duyệt bài giảng',
        'admin.approval.empty': 'Không có bài giảng nào chờ duyệt.',
        'admin.approval.approve': 'Duyệt',
        'admin.approval.reject': 'Từ chối',
        'admin.reports.title': 'Hòm thư vi phạm',
        'admin.reports.empty': 'Hòm thư sạch.',
        'admin.reports.warn': 'Bỏ qua',
        'admin.toggles.title': 'Cấu hình hệ thống',
        'admin.toggles.maintenance': 'Bật chế độ bảo trì',
        'admin.toggles.approval': 'Bật duyệt bài tự động',
        'admin.logs.title': 'Nhật ký hệ thống',
        'admin.logs.empty': 'Chưa có hoạt động nào.',
        'admin.guard.loading': 'Đang xác thực quyền admin...'
    },
    en: {
        'nav.lang.en': 'EN',
        'nav.lang.vi': 'VI',
        'logout': 'Logout',
        'text.by': 'by',
        'text.reason': 'Reason',
        'swal.title.error': 'Error',
        'swal.title.sent': 'Sent!',
        'swal.title.report': 'Flag Content',
        'swal.text.report_thanks': 'Thank you — our mods will review it soon.',
        'swal.confirm.report': 'Send Report',
        'swal.cancel': 'Cancel',
        'swal.loading.login': 'Signing in...',
        'swal.loading.register': 'Creating account...',
        'swal.loading.connecting': 'Connecting to',
        'swal.loading.sending_link': 'Sending link...',
        'swal.text.magic_link_sent': 'Sign-in link sent to',
        'login.title': 'CACAO Login',
        'login.subtitle': 'Learn with the community',
        'login.form.email': 'Your email',
        'login.form.password': 'Password',
        'login.form.button': 'Sign In',
        'login.social.separator': 'or sign in with',
        'login.register.link': "Don't have an account?",
        'login.register.cta': 'Sign up now',
        'register.form.title': 'Create Account',
        'register.role.question': 'How do you want to participate?',
        'register.role.learner': 'Learner',
        'register.role.learner.desc': 'Follow, learn, and discuss.',
        'register.role.mentor': 'Mentor',
        'register.role.mentor.desc': 'Share knowledge, post lessons.',
        'register.form.button': 'Complete Registration',
        'register.login.link': 'Already have an account?',
        'register.login.cta': 'Back to Sign In',
        'index.page.title': 'CACAO — Learning Feed',
        'index.header.welcome': 'Hi',
        'index.create.button': 'Post a Lesson',
        'admin.title': 'Admin Dashboard',
        'admin.header.user': 'Welcome,',
        'admin.stats.total_users': 'Total Users',
        'admin.stats.total_mentors': 'Total Mentors',
        'admin.stats.pending_courses': 'Pending Courses',
        'admin.approval.title': 'Course Approval',
        'admin.approval.empty': 'No courses pending review.',
        'admin.approval.approve': 'Approve',
        'admin.approval.reject': 'Reject',
        'admin.reports.title': 'Reports Inbox',
        'admin.reports.empty': 'Inbox is clean.',
        'admin.reports.warn': 'Dismiss',
        'admin.toggles.title': 'System Toggles',
        'admin.toggles.maintenance': 'Enable Maintenance Mode',
        'admin.toggles.approval': 'Enable Auto-approval',
        'admin.logs.title': 'Audit Logs',
        'admin.logs.empty': 'No activities yet.',
        'admin.guard.loading': 'Verifying admin access...'
    },
};

export let currentLang = 'vi';

const normalizeLang = (lang) => {
    const l = String(lang || '').trim().toLowerCase();
    if (l.startsWith('en')) return 'en';
    return 'vi'; 
};

export const applyTranslations = (lang) => {
    const trans = translations[lang];
    if (!trans) return;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (trans[key]) {
            // Handle different element types
            if (el.hasAttribute('placeholder')) {
                el.placeholder = trans[key];
            } else if (el.hasAttribute('title')) {
                el.title = trans[key];
            } else {
                el.textContent = trans[key];
            }
        }
    });

    // Update active language button style
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('bg-gray-200', 'text-gray-900');
            btn.classList.remove('text-gray-500', 'hover:bg-gray-100');
        } else {
            btn.classList.remove('bg-gray-200', 'text-gray-900');
            btn.classList.add('text-gray-500', 'hover:bg-gray-100');
        }
    });
};

export const changeLanguage = (lang) => {
    const normalized = normalizeLang(lang);
    currentLang = normalized;
    try {
        localStorage.setItem('cacao_lang', normalized);
    } catch (e) {
        console.warn('Could not save language to localStorage', e);
    }
    applyTranslations(normalized);
};

export const initLanguage = () => {
    const savedLang = normalizeLang(localStorage.getItem('cacao_lang') || navigator.language);
    currentLang = savedLang;
    applyTranslations(savedLang);
};

// Make functions globally available for inline event handlers and legacy calls
window.changeLanguage = changeLanguage;
