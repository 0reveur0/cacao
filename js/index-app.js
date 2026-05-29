import { supabase } from './supabase-config.js';
import { initLanguage, changeLanguage, applyTranslations } from './lang.js';

// Make changeLanguage globally accessible for HTML inline event handlers
window.changeLanguage = changeLanguage;

// --- STATE MANAGEMENT ---
const appState = {
    currentUser: null,
    currentUserProfile: null,
    courses: [],
    userLikes: new Set(),
    systemSettings: { isCourseApprovalRequired: false },
};

// --- UTILS ---
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const showLoading = (isLoading) => {
    $('#loading-indicator').style.display = isLoading ? 'block' : 'none';
    $('#main-content').style.display = isLoading ? 'none' : 'grid';
};

// --- AUTH & INITIALIZATION ---
const handleAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        window.location.replace('./login.html');
        return;
    }

    appState.currentUser = session.user;
    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (profileError || !profile) {
        console.error('Error fetching user profile:', profileError);
        // Maybe sign out and redirect?
        return;
    }
    appState.currentUserProfile = profile;
    
    // Proceed to initialize the app
    initializeAppUI();
};

const initializeAppUI = () => {
    showLoading(false);
    renderUserMenu();
    renderNavigationCard();
    renderUserProgressCard(appState.currentUserProfile.id);
    fetchDataAndRenderFeed();
    setupEventListeners();
    setupRealtimeSubscriptions();
};


// --- UI RENDERING ---
const renderUserMenu = () => {
    const { currentUserProfile } = appState;
    $('#user-menu').classList.remove('hidden');
    $('#user-menu').classList.add('flex');
    $('#user-name').textContent = currentUserProfile.displayName;
    $('#user-avatar').src = currentUserProfile.avatar_url || './assets/default-avatar.svg';
    if (currentUserProfile.role === 'admin') {
        $('#admin-link').classList.remove('hidden');
    }
};

const renderNavigationCard = () => {
    const card = $('#navigation-card');
    if (!card) return;
    const { role } = appState.currentUserProfile;
    let mentorHTML = '';
    if(role === 'mentor' || role === 'admin') {
        mentorHTML = `<a href="./mentor.html" class="nav-link">Kênh Mentor</a>`;
    }

    card.innerHTML = `
        <h3 class="font-display font-black text-xl uppercase text-gray-700 mb-4">Điều hướng</h3>
        <div class="flex flex-col space-y-2">
            <a href="./community.html" class="nav-link">Cộng đồng</a>
            ${mentorHTML}
            <a href="#" class="nav-link">Hồ sơ</a>
            <a href="#" class="nav-link">Cài đặt</a>
        </div>
    `;
    // Add styles for .nav-link if needed, e.g., in the main HTML style block
    $$('.nav-link').forEach(el => {
        el.classList.add('font-bold', 'text-gray-600', 'hover:text-orange-500', 'p-2', 'rounded-md', 'hover:bg-gray-100');
    });
};

const renderUserProgressCard = async (userId) => {
    const card = $('#user-progress-card');
    if (!card) return;

    // Fetch user's own progress summary
    const { data: user, error } = await supabase.from('users').select('xp, streak').eq('id', userId).single();
    if (error) return console.error('Could not fetch user progress', error);

    card.innerHTML = `
        <h3 class="font-display font-black text-xl uppercase text-gray-700 mb-4">Tiến độ</h3>
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <span class="font-bold text-gray-600">Điểm kinh nghiệm (XP)</span>
                <span class="font-display font-black text-2xl text-orange-500">${user.xp || 0}</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="font-bold text-gray-600">Chuỗi ngày học</span>
                <span class="font-display font-black text-2xl text-blue-500">${user.streak || 0}</span>
            </div>
        </div>
    `;
};

const renderCourseCard = (course) => {
    const { currentUserProfile, userLikes } = appState;
    const isLiked = userLikes.has(course.id);
    
    // Safe HTML escaping might be needed if content is user-generated and not sanitized on input
    return `
        <article class="cacao-card p-5 sm:p-6" data-course-id="${course.id}">
            <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-center min-w-0">
                    <img src="${course.users.avatar_url || './assets/default-avatar.svg'}" alt="Avatar" class="w-11 h-11 rounded-full object-cover mr-3">
                    <div>
                        <p class="font-bold text-gray-800 truncate">${course.users.displayName || 'Mentor'}</p>
                        <p class="text-sm text-gray-500">${new Date(course.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <h2 class="text-xl sm:text-2xl font-display font-black mb-2 uppercase tracking-wide leading-tight text-gray-800">${course.title}</h2>
            <p class="text-gray-600 text-base leading-relaxed mb-4">${course.description}</p>
            
            <div class="flex items-center justify-between gap-3 text-gray-500">
                 <button class="like-btn action-btn ${isLiked ? 'text-red-500' : 'hover:text-red-500'}" data-course-id="${course.id}">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                    <span class="font-bold text-sm ml-1">${course.like_count || 0}</span>
                </button>
                <button class="start-learning-btn bg-orange-500 text-white font-bold uppercase text-sm px-6 py-2 rounded-full hover:bg-orange-600 transition-colors" data-course-id="${course.id}">
                    Học ngay
                </button>
            </div>
        </article>
    `;
};

const renderFeed = () => {
    const feedContainer = $('#feed-container');
    if (appState.courses.length === 0) {
        feedContainer.innerHTML = `<div class="cacao-card text-center p-10"><p class="text-gray-500">Chưa có bài giảng nào.</p></div>`;
        return;
    }
    feedContainer.innerHTML = appState.courses.map(renderCourseCard).join('');
};


// --- DATA FETCHING ---
const fetchDataAndRenderFeed = async () => {
    // Fetch system settings first
    const { data: settings } = await supabase.from('system_settings').select('*').eq('id', 1).single();
    if (settings) appState.systemSettings = settings;

    let query = supabase.from('courses').select(`
        *,
        users (displayName, avatar_url)
    `).order('created_at', { ascending: false });

    if (appState.systemSettings.isCourseApprovalRequired) {
        query = query.eq('status', 'approved');
    }

    const { data: courses, error } = await query;
    if (error) return console.error('Error fetching courses:', error);

    appState.courses = courses;

    // Fetch user's likes for the loaded courses
    const courseIds = courses.map(c => c.id);
    const { data: likes } = await supabase.from('likes').select('course_id').eq('user_id', appState.currentUser.id).in('course_id', courseIds);
    if (likes) appState.userLikes = new Set(likes.map(l => l.course_id));

    renderFeed();
};


// --- EVENT LISTENERS ---
const handleLikeClick = async (courseId) => {
    const isLiked = appState.userLikes.has(courseId);
    const course = appState.courses.find(c => c.id === courseId);
    if(!course) return;

    if (isLiked) {
        // Unlike
        appState.userLikes.delete(courseId);
        course.like_count = (course.like_count || 1) - 1;
        const { error } = await supabase.from('likes').delete().match({ user_id: appState.currentUser.id, course_id: courseId });
        if (error) console.error('Error unliking:', error);
    } else {
        // Like
        appState.userLikes.add(courseId);
        course.like_count = (course.like_count || 0) + 1;
        const { error } = await supabase.from('likes').insert([{ user_id: appState.currentUser.id, course_id: courseId }]);
        if (error) console.error('Error liking:', error);
    }
    
    // Re-render just the feed for simplicity, can be optimized to update only the specific card
    renderFeed(); 
};

const setupEventListeners = () => {
    $('#logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.replace('./login.html');
    });

    // Event delegation for feed actions
    $('#feed-container').addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            const courseId = likeBtn.dataset.courseId;
            handleLikeClick(Number(courseId));
        }
    });
};

// --- REALTIME ---
const setupRealtimeSubscriptions = () => {
    const courseChannel = supabase.channel('public:courses');
    courseChannel
        .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, (payload) => {
            // Refetch all data on any change for simplicity
            fetchDataAndRenderFeed();
        })
        .subscribe();
};


// --- APP KICK-OFF ---
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    handleAuth();
});
