import { supabase } from \'./supabase-config.js\';

// --- UTILS ---
const $ = (selector) => document.querySelector(selector);
const showSuccessToast = (title) => Swal.fire({ icon: \'success\', title, toast: true, position: \'top-end\', showConfirmButton: false, timer: 3000 });
const showErrorToast = (title) => Swal.fire({ icon: \'error\', title, toast: true, position: \'top-end\', showConfirmButton: false, timer: 4000 });


// --- AUTH & PAGE GUARD ---
const guardMentorPage = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    // Nếu không có session, chuyển về trang đăng nhập
    if (!session) {
        window.location.replace(\'./login.html\');
        return null;
    }

    // Lấy thông tin role của người dùng
    const { data: profile, error } = await supabase
        .from(\'users\')
        .select(\'role\')
        .eq(\'id\', session.user.id)
        .single();

    // Nếu có lỗi hoặc role không phải mentor/admin, báo lỗi và chuyển về index
    if (error || (profile.role !== \'mentor\' && profile.role !== \'admin\')) {
        await Swal.fire({
            title: \'Truy cập bị từ chối\',
            text: \'Bạn phải là Mentor hoặc Admin để vào trang này.\',
            icon: \'error\'
        });
        window.location.replace(\'./index.html\');
        return null;
    }
    
    // Trả về user nếu hợp lệ
    return session.user;
};


// --- COURSE CREATION ---
const handleCreateCourse = async (e, user) => {
    e.preventDefault();
    const form = $(\'#create-course-form\');
    const submitBtn = $(\'#submit-btn\');
    const title = form.title.value.trim();
    const description = form.description.value.trim();

    if (!title || !description) {
        showErrorToast(\'Vui lòng điền đủ tiêu đề và mô tả.\');
        return;
    }

    // Vô hiệu hóa nút bấm để tránh spam
    submitBtn.disabled = true;
    submitBtn.textContent = \'Đang đăng...\';

    // Lấy thông tin cài đặt hệ thống (có cần admin duyệt bài hay không)
    const { data: settings, error: settingsError } = await supabase
        .from(\'system_settings\')
        .select(\'isCourseApprovalRequired\')
        .eq(\'id\', 1)
        .single();

    if (settingsError) {
        console.error(\'Error fetching settings:\', settingsError);
        showErrorToast(\'Không thể lấy cài đặt hệ thống\');
        submitBtn.disabled = false;
        submitBtn.textContent = \'Đăng bài\';
        return;
    }

    // Mặc định status là \'approved\', trừ khi hệ thống yêu cầu duyệt
    const status = settings.isCourseApprovalRequired ? \'pending\' : \'approved\';

    const { error } = await supabase.from(\'courses\').insert([{
        title,
        description,
        mentor_id: user.id,
        status: status
    }]);

    if (error) {
        console.error(\'Error creating course:\', error);
        showErrorToast(\'Đăng bài thất bại! Vui lòng thử lại.\');
        submitBtn.disabled = false;
        submitBtn.textContent = \'Đăng bài\';
    } else {
        // Đăng bài thành công
        showSuccessToast(status === \'approved\' ? \'Đăng bài thành công!\' : \'Gửi bài chờ duyệt thành công!\');
        form.reset(); // Xóa các trường trong form
        submitBtn.disabled = false;
        submitBtn.textContent = \'Đăng bài\';
    }
};

// --- INITIALIZATION ---
const init = async () => {
    const user = await guardMentorPage();
    // Nếu user hợp lệ (là mentor/admin) thì mới thêm event listener cho form
    if (user) {
        $(\'#create-course-form\').addEventListener(\'submit\', (e) => handleCreateCourse(e, user));
    }
};

document.addEventListener(\'DOMContentLoaded\', init);
