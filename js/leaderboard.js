import { supabase } from './supabase-config.js';

const fetchLeaderboard = async () => {
    const leaderboardContainer = document.getElementById('leaderboard-container');
    if (!leaderboardContainer) return;

    leaderboardContainer.innerHTML = '<p class="text-gray-500">Đang tải bảng xếp hạng...</p>';

    // Fetch users ordered by their XP. 
    // Assumes a 'xp' column exists on the 'users' table.
    const { data: users, error } = await supabase
        .from('users')
        .select('displayName, avatar_url, xp')
        .order('xp', { ascending: false })
        .limit(7);

    if (error || !users || users.length === 0) {
        console.error('Error fetching leaderboard:', error);
        leaderboardContainer.innerHTML = '<p class="text-gray-500">Không có dữ liệu.</p>';
        return;
    }

    leaderboardContainer.innerHTML = users.map((user, index) => `
        <div class="leaderboard-item">
            <div class="flex items-center gap-3">
                <span class="font-bold text-gray-400 w-5">#${index + 1}</span>
                <img src="${user.avatar_url || './assets/default-avatar.svg'}" class="w-9 h-9 rounded-full object-cover"/>
                <span class="font-bold text-gray-700">${user.displayName}</span>
            </div>
            <div class="font-display font-black text-2xl text-orange-500">${user.xp || 0}</div>
        </div>
    `).join('');
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', fetchLeaderboard);
