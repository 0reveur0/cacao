import { supabase } from './supabase-config.js';

let currentUser = null;
let currentUserProfile = null;
let selectedGroupId = null;
let postSubscription = null;

// --- HELPERS ---
const showToast = (icon, title) => Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 }).fire({ icon, title });
const $ = (selector) => document.querySelector(selector);

// --- AUTH & INITIALIZATION ---
const main = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = user;

    const { data: profile, error } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (error || !profile) {
        console.error("Could not fetch user profile:", error);
        return showToast('error', 'Không thể tải hồ sơ người dùng');
    }
    currentUserProfile = profile;

    if (profile.role === 'mentor' || profile.role === 'admin') {
        $('#mentor-link').classList.remove('hidden');
    }

    const groupType = (profile.role === 'mentor' || profile.role === 'admin') ? 'mentor' : 'student';
    $('#group-list-title').textContent = `Nhóm ${groupType === 'mentor' ? 'Giảng viên' : 'Học viên'}`;

    await loadGroups(groupType);
    setupEventListeners();
};

// --- DATA LOADING & RENDERING ---
const loadGroups = async (type) => {
    const groupList = $('#group-list');
    groupList.innerHTML = `<div class="text-gray-500">Đang tải...</div>`; // Loading state
    const { data, error } = await supabase.from('groups').select('*').eq('type', type);
    if (error) {
        console.error('Error loading groups:', error); 
        return groupList.innerHTML = `<div class="text-red-500">Lỗi tải nhóm</div>`;
    }
    groupList.innerHTML = '';
    data.forEach(group => {
        const el = document.createElement('div');
        el.className = 'group-item';
        el.dataset.groupId = group.id;
        el.innerHTML = `<img src="${group.avatar_url || './assets/default-avatar.svg'}" class="w-10 h-10 rounded-md object-cover"><p class="font-bold">${group.name}</p>`;
        el.onclick = () => selectGroup(group);
        groupList.appendChild(el);
    });
    if (data.length === 0) {
        groupList.innerHTML = `<div class="text-gray-500 p-3">Chưa có nhóm nào.</div>`;
    }
};

const selectGroup = (group) => {
    selectedGroupId = group.id;
    document.querySelectorAll('.group-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-group-id='${group.id}']`).classList.add('active');

    $('#group-feed-placeholder').classList.add('hidden');
    $('#group-feed-container').classList.remove('hidden');
    $('#feed-group-name').textContent = group.name;
    subscribeToPosts(group.id);
};

const renderPost = (post, container, prepend) => {
    const postEl = document.createElement('div');
    postEl.className = 'post-item';
    const author = post.users; // Note: Changed from profiles to users
    postEl.innerHTML = `
       <div class="flex items-center gap-3 mb-3">
           <img src="${author?.avatar_url || './assets/default-avatar.svg'}" class="w-9 h-9 rounded-full object-cover">
           <div>
                <p class="font-bold text-gray-800">${author?.displayName || 'Người dùng'}</p>
                <p class="text-xs text-gray-500">${new Date(post.created_at).toLocaleString()}</p>
            </div>
       </div>
       <p class="text-gray-700">${post.content.replace(/\n/g, '<br>')}</p>
    `;
    if (prepend) container.prepend(postEl); else container.appendChild(postEl);
};

// --- REALTIME & SUBSCRIPTIONS ---
const subscribeToPosts = async (groupId) => {
    if (postSubscription) {
        await supabase.removeChannel(postSubscription);
    }
    const postsContainer = $('#posts-container');
    postsContainer.innerHTML = '<div class="text-center p-8 text-gray-500">Đang tải bài viết...</div>';

    // Fetch initial posts with user data joined
    const { data: posts, error } = await supabase
        .from('group_posts')
        .select(`*,
            users (*)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

    postsContainer.innerHTML = ''; // Clear loading
    if (error) return console.error('Error fetching posts', error);

    if (posts.length === 0) postsContainer.innerHTML = '<div class="text-center p-8 text-gray-500">Chưa có bài viết nào.</div>';
    else posts.forEach(post => renderPost(post, postsContainer, false));

    postSubscription = supabase.channel(`group-posts:${groupId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_posts', filter: `group_id=eq.${groupId}` }, async (payload) => {
            // Fetch the new post with author data again to keep it simple
            const { data: newPost, error } = await supabase.from('group_posts').select('*, users(*)').eq('id', payload.new.id).single();
            if (error) console.error('Error fetching new post:', error);
            else renderPost(newPost, postsContainer, true);
        })
        .subscribe();
};

// --- EVENT LISTENERS & FORM HANDLING ---
const setupEventListeners = () => {
    const modal = $('#create-group-modal');
    $('#create-group-modal-btn').addEventListener('click', () => modal.classList.replace('hidden', 'flex'));
    $('#cancel-create-group').addEventListener('click', () => modal.classList.replace('flex', 'hidden'));

    $('#create-group-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const description = form.description.value;
        const avatar_url = form.avatar_url.value;
        const type = (currentUserProfile.role === 'mentor' || currentUserProfile.role === 'admin') ? 'mentor' : 'student';

        const { error } = await supabase.from('groups').insert([{ name, description, avatar_url, type, creator_id: currentUser.id }]);
        if (error) {
            console.error(error);
            showToast('error', 'Tạo nhóm thất bại');
        } else {
            modal.classList.replace('flex', 'hidden');
            form.reset();
            showToast('success', 'Tạo nhóm thành công!');
            await loadGroups(type);
        }
    });

    $('#create-post-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedGroupId) return;
        const content = e.target.content.value.trim();
        if (!content) return;

        const { error } = await supabase.from('group_posts').insert([{ group_id: selectedGroupId, author_id: currentUser.id, content }]);
        if (error) {
            console.error(error);
            showToast('error', 'Đăng bài thất bại');
        } else {
            e.target.reset();
        }
    });
};

document.addEventListener('DOMContentLoaded', main);