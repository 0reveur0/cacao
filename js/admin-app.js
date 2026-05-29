import { supabase } from './supabase-config.js';
import { initLanguage, changeLanguage, translations, currentLang } from './lang.js';

window.changeLanguage = changeLanguage;

const whenDomReady = (callback) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
    else callback();
};

// --- UTILITIES & HELPERS ---
const createAuditLog = async (userId, userEmail, action, details = {}) => {
    const { error } = await supabase.from('logs').insert([{ action, user_id: userId, user_email: userEmail, details }]);
    if (error) console.error('Error creating audit log:', action, error);
};

const showToast = (icon, title) => {
    Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true }).fire({ icon, title });
};

// --- AUTH & PAGE GUARD ---
const guardAdminPage = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
        window.location.replace('./login.html');
        return null;
    }
    const { data: profile, error: profileError } = await supabase.from('users').select('*').eq('id', session.user.id).single();
    if (profileError || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        window.location.replace('./login.html');
        return null;
    }
    return { ...session, profile };
};

// --- UI INITIALIZATION ---
const initializeUI = (session) => {
    document.getElementById('admin-guard-screen').style.display = 'none';
    document.getElementById('admin-app-body').classList.remove('hidden');
    const userMenu = document.getElementById('user-menu');
    userMenu.classList.remove('hidden');
    userMenu.classList.add('flex');
    document.getElementById('user-name').textContent = session.profile.displayName || session.user.email;
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await createAuditLog(session.user.id, session.user.email, 'admin_logout');
        await supabase.auth.signOut();
        window.location.replace('./login.html');
    });
    initDashboard(session);
};

// --- DASHBOARD COMPONENTS ---
const initDashboard = (session) => {
    initStats();
    // initRevenueChart(); // Disabled as there's no real data source
    initPendingCourses(session);
    initReports(session);
    initSystemToggles(session);
    initAuditLogs();
    setupRealtimeListeners();
};

// 1. STATS
const updateStats = async () => {
    const { count: userCount } = await supabase.from('users').select('', { count: 'exact', head: true });
    const { count: mentorCount } = await supabase.from('users').select('', { count: 'exact' }).in('role', ['mentor', 'admin']);
    const { count: pendingCount } = await supabase.from('courses').select('', { count: 'exact' }).eq('status', 'pending');
    document.getElementById('total-users-stat').textContent = userCount || 0;
    document.getElementById('total-mentors-stat').textContent = mentorCount || 0;
    document.getElementById('pending-courses-stat').textContent = pendingCount || 0;
};

const initStats = () => updateStats();

// 2. PENDING COURSES
const renderCourses = (courses, listEl) => {
    if (!courses || courses.length === 0) {
        listEl.innerHTML = `<p class="text-gray-500 font-medium" data-i18n="admin.approval.empty">Không có bài giảng nào chờ duyệt.</p>`;
    } else {
        listEl.innerHTML = courses.map(course => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                    <p class="font-bold text-gray-800">${course.title}</p>
                    <p class="text-sm text-gray-500"><span data-i18n="text.by">bởi</span> ${course.instructorName || 'N/A'}</p>
                </div>
                <div class="flex space-x-2 flex-shrink-0">
                    <button data-id="${course.id}" class="approve-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase">Duyệt</button>
                    <button data-id="${course.id}" class="reject-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase">Từ chối</button>
                </div>
            </div>`).join('');
    }
    initLanguage();
};

const fetchPendingCourses = async (listEl) => {
    const { data, error } = await supabase.from('courses').select('*').eq('status', 'pending');
    if (error) console.error('Error fetching pending courses:', error);
    else renderCourses(data, listEl);
};

const initPendingCourses = (session) => {
    const listEl = document.getElementById('pending-courses-list');
    if (!listEl) return;
    listEl.addEventListener('click', async (e) => {
        const courseId = e.target.dataset.id;
        if (!courseId) return;
        if (e.target.classList.contains('approve-btn')) {
            const { error } = await supabase.from('courses').update({ status: 'approved' }).eq('id', courseId);
            if (error) { showToast('error', 'Lỗi khi duyệt bài'); } 
            else { 
                showToast('success', 'Đã duyệt bài giảng');
                createAuditLog(session.user.id, session.user.email, 'course_approved', { courseId });
            }
        }
        if (e.target.classList.contains('reject-btn')) {
            const { error } = await supabase.from('courses').delete().eq('id', courseId);
            if (error) { showToast('error', 'Lỗi khi từ chối'); } 
            else { 
                showToast('success', 'Đã từ chối bài giảng');
                createAuditLog(session.user.id, session.user.email, 'course_rejected', { courseId });
            }
        }
    });
    fetchPendingCourses(listEl);
};

// 3. REPORTS
const renderReports = (reports, listEl) => {
    if (!reports || reports.length === 0) {
        listEl.innerHTML = `<p class="text-gray-500 font-medium" data-i18n="admin.reports.empty">Hòm thư sạch.</p>`;
    } else {
        listEl.innerHTML = reports.map(report => `
            <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p class="font-bold text-yellow-800">[${report.contentType.toUpperCase()}]</p>
                <p class="text-sm text-gray-700 mt-1"><b>Lý do:</b> ${report.reason}</p>
                <p class="text-xs text-gray-500 mt-2">Báo cáo bởi: ${report.reporterEmail}</p>
                <div class="flex space-x-2 mt-3">
                    <button data-id="${report.id}" class="resolve-btn bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase">Bỏ qua</button>
                </div>
            </div>`).join('');
    }
    initLanguage();
};

const fetchReports = async (listEl) => {
    const { data, error } = await supabase.from('reports').select('*').eq('status', 'pending');
    if (error) console.error('Error fetching reports:', error);
    else renderReports(data, listEl);
}

const initReports = (session) => {
    const listEl = document.getElementById('reports-list');
    if (!listEl) return;
    listEl.addEventListener('click', async (e) => {
        const reportId = e.target.dataset.id;
        if (reportId && e.target.classList.contains('resolve-btn')) {
            const { error } = await supabase.from('reports').update({ status: 'resolved_ignored' }).eq('id', reportId);
             if (error) { showToast('error', 'Lỗi khi xử lý'); } 
             else { 
                showToast('info', 'Đã bỏ qua báo cáo');
                createAuditLog(session.user.id, session.user.email, 'report_ignored', { reportId });
            }
        }
    });
    fetchReports(listEl);
};

// 4. SYSTEM TOGGLES
const initSystemToggles = (session) => {
    const maintenanceToggle = document.getElementById('maintenance-mode-toggle');
    const approvalToggle = document.getElementById('approval-mode-toggle');
    if (!maintenanceToggle || !approvalToggle) return;

    const applySettings = (settings) => {
        maintenanceToggle.checked = !!settings.isMaintenanceModeEnabled;
        approvalToggle.checked = !!settings.isCourseApprovalRequired;
    };

    const fetchSettings = async () => {
        const { data, error } = await supabase.from('system_settings').select('*').eq('id', 1).single();
        if (error) console.error('Error fetching settings:', error);
        else if (data) applySettings(data);
    };

    const createHandler = (column, logName) => async (e) => {
        const value = e.target.checked;
        const { error } = await supabase.from('system_settings').update({ [column]: value }).eq('id', 1);
        if (error) { showToast('error', 'Lỗi cập nhật cấu hình'); }
        else {
            showToast('success', 'Cấu hình đã được cập nhật');
            createAuditLog(session.user.id, session.user.email, 'setting_change', { setting: logName, value });
        }
    };

    maintenanceToggle.addEventListener('change', createHandler('isMaintenanceModeEnabled', 'maintenance_mode'));
    approvalToggle.addEventListener('change', createHandler('isCourseApprovalRequired', 'approval_mode'));
    
    fetchSettings();
};


// 5. AUDIT LOGS
const renderLogs = (logs) => {
    const timelineEl = document.getElementById('audit-log-timeline');
    if (!timelineEl) return;
    if (!logs || logs.length === 0) {
        timelineEl.innerHTML = `<p class="text-gray-500 font-medium" data-i18n="admin.logs.empty">Chưa có hoạt động nào.</p>`;
    } else {
        timelineEl.innerHTML = logs.map(log => `
            <div class="relative pl-8 border-l border-gray-200">
                <div class="absolute w-3 h-3 bg-gray-400 rounded-full mt-1.5 -left-[6.5px] border-2 border-white"></div>
                <p class="text-gray-500 text-xs">${new Date(log.created_at).toLocaleString()}</p>
                <p class="font-bold text-sm text-gray-800">${log.action}</p>
                <p class="text-xs text-gray-600">${log.user_email || 'N/A'}</p>
            </div>`).join('');
    }
    initLanguage();
};

const fetchAuditLogs = async () => {
    const { data, error } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(40);
    if (error) console.error('Error fetching logs:', error);
    else renderLogs(data);
};

const initAuditLogs = () => fetchAuditLogs();

// --- REALTIME SUBSCRIPTIONS ---
const setupRealtimeListeners = () => {
    supabase.channel('admin-dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => updateStats())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
            updateStats();
            fetchPendingCourses(document.getElementById('pending-courses-list'));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
             fetchReports(document.getElementById('reports-list'));
        })
        .on('postgres_changes', { event: 'insert', schema: 'public', table: 'logs' }, (payload) => fetchAuditLogs())
        .on('postgres_changes', { event: 'update', schema: 'public', table: 'system_settings', filter: 'id=eq.1' }, (payload) => {
            const toggles = {
                 maintenance: document.getElementById('maintenance-mode-toggle'),
                 approval: document.getElementById('approval-mode-toggle')
            };
            if(toggles.maintenance) toggles.maintenance.checked = !!payload.new.isMaintenanceModeEnabled;
            if(toggles.approval) toggles.approval.checked = !!payload.new.isCourseApprovalRequired;
        })
        .subscribe();
};

// --- APP KICK-OFF ---
whenDomReady(() => {
    initLanguage();
    guardAdminPage().then(session => {
        if (session) initializeUI(session);
    }).catch(error => {
        console.error('Fatal: Admin panel failed to initialize.', error);
        document.getElementById('admin-guard-screen').innerHTML = `<p class="text-red-500 font-bold">Failed to verify admin status. Please try again.</p>`;
    });
});
