import React, { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ onSignOut }) => (
  <aside className="w-72 bg-amber-950 text-amber-50 min-h-screen p-6 sticky top-0">
    <div className="mb-8">
      <div className="text-4xl">🍫</div>
      <h2 className="text-lg font-display font-bold mt-2">CACAO TLMS</h2>
      <p className="text-sm text-amber-200/80">Bảng Điều Khiển Học Sinh</p>
    </div>

    <nav className="space-y-3">
      <button className="w-full text-left px-3 py-2 rounded-md bg-amber-800/40 hover:bg-amber-800/60 transition-all font-medium">
        📚 Khóa Học
      </button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20 transition-all font-medium">
        📈 Tiến Độ
      </button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20 transition-all font-medium">
        📊 Bảng Điểm
      </button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20 transition-all font-medium">
        🆘 Hỗ Trợ
      </button>
    </nav>

    <div className="mt-auto pt-6 border-t border-amber-800">
      <button
        onClick={onSignOut}
        className="w-full bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-md font-bold transition-all shadow-lg"
      >
        🚪 Đăng Xuất
      </button>
    </div>
  </aside>
)

// Component Bảng Xếp Hạng
const LeaderboardSection = ({ studentCacao, onRedeemReward }) => {
  const [showRewards, setShowRewards] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)

  const leaderboard = [
    { rank: 1, name: 'Trần Minh Phương', cacaoSeeds: 285, medal: '🥇' },
    { rank: 2, name: 'Hoàng Gia Hân', cacaoSeeds: 267, medal: '🥈' },
    { rank: 3, name: 'Phan Đức Minh', cacaoSeeds: 252, medal: '🥉' },
    { rank: 4, name: 'Nguyễn Văn An', cacaoSeeds: 198, medal: '' },
    { rank: 5, name: 'Lê Thị Hương', cacaoSeeds: 175, medal: '' },
  ]

  const rewards = [
    { id: 1, name: 'Cốc Cacao Nóng', cost: 50, icon: '☕' },
    { id: 2, name: 'Bánh Socola Miễn Phí', cost: 75, icon: '🍫' },
    { id: 3, name: 'Voucher Cơm Trưa', cost: 100, icon: '🎁' },
    { id: 4, name: 'Sách Tham Khảo', cost: 150, icon: '📚' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Bảng Xếp Hạng */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border-2 border-amber-200">
        <h2 className="text-2xl font-display font-bold text-amber-950 mb-6 flex items-center gap-2">
          🏆 Bảng Xếp Hạng Top 5
        </h2>

        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                index < 3
                  ? 'bg-gradient-to-r from-amber-50 to-stone-50 border-amber-300'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{entry.medal || '🏅'}</div>
                <div>
                  <p className="font-display font-bold text-stone-900">{entry.name}</p>
                  <p className="text-sm text-stone-600"># Xếp hạng {entry.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-amber-700">
                  {entry.cacaoSeeds}
                </p>
                <p className="text-xs text-stone-600">Hạt Cacao</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cacao của Bạn & Đổi Quà */}
      <div className="space-y-4">
        {/* Thẻ Cacao của Bạn */}
        <div className="bg-gradient-to-br from-amber-100 via-stone-50 to-amber-50 rounded-2xl shadow-lg p-8 border-3 border-amber-300">
          <h3 className="text-lg font-display font-bold text-amber-950 mb-4">🌟 Hạt Cacao Của Tôi</h3>
          <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 mb-4">
            <div className="text-center">
              <p className="text-5xl font-display font-bold text-amber-700 mb-2">{studentCacao}</p>
              <p className="text-stone-600 font-medium">Hạt Cacao Thưởng</p>
            </div>
          </div>
          <button
            onClick={() => setShowRewards(!showRewards)}
            className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-amber-50 font-display font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            {showRewards ? '🎁 Đóng Menu Quà' : '🎁 Đổi Quà'}
          </button>
        </div>

        {/* Menu Đổi Quà */}
        {showRewards && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
            <h4 className="font-display font-bold text-amber-950 mb-4">Danh Sách Phần Thưởng</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  onClick={() => setSelectedReward(reward)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    studentCacao >= reward.cost
                      ? 'border-amber-300 bg-amber-50 hover:bg-amber-100'
                      : 'border-stone-300 bg-stone-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{reward.icon}</span>
                      <div>
                        <p className="font-bold text-stone-900">{reward.name}</p>
                        <p className="text-sm text-stone-600">Giá: {reward.cost} Hạt Cacao</p>
                      </div>
                    </div>
                    {studentCacao >= reward.cost && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRedeemReward(reward.id, reward.cost)
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition-all"
                      >
                        Đổi
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Component Cacao Lounge (Mạng Xã Hội)
const CacaoLounge = ({ currentUserRole }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn An',
      role: 'student',
      avatar: '👨‍🎓',
      content: 'Hôm nay tôi không hiểu bài Tích phân, có ai có thể giải thích lại không?',
      topic: 'homework',
      timestamp: '10 phút trước',
      likes: 3,
      comments: 2,
      liked: false,
    },
    {
      id: 2,
      author: 'Thầy Võ Thanh Tùng',
      role: 'teacher',
      avatar: '👨‍🏫',
      content: 'Chúng ta hãy cùng thảo luận về ứng dụng thực tế của Hàm số Logarit trong kinh tế.',
      topic: 'discussion',
      timestamp: '1 giờ trước',
      likes: 12,
      comments: 5,
      liked: false,
    },
    {
      id: 3,
      author: 'Trần Minh Phương',
      role: 'student',
      avatar: '👩‍🎓',
      content: 'Haha, ai đó vừa kịp nộp bài trước 30 giây! 😂 Deadline có sức mạnh ghê nhỉ?',
      topic: 'fun',
      timestamp: '2 giờ trước',
      likes: 24,
      comments: 8,
      liked: false,
    },
  ])

  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTopic, setNewPostTopic] = useState('homework')
  const [commentInputs, setCommentInputs] = useState({})
  const [expandedComments, setExpandedComments] = useState({})

  const handlePostSubmit = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: currentUserRole === 'teacher' ? 'Thầy/Cô Bạn' : 'Bạn',
        role: currentUserRole,
        avatar: currentUserRole === 'teacher' ? '👨‍🏫' : '👨‍🎓',
        content: newPostContent,
        topic: newPostTopic,
        timestamp: 'vừa xong',
        likes: 0,
        comments: 0,
        liked: false,
      }
      setPosts([newPost, ...posts])
      setNewPostContent('')
      setNewPostTopic('homework')
    }
  }

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
  }

  const handleAddComment = (postId) => {
    const comment = commentInputs[postId]
    if (comment?.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      )
      setCommentInputs({ ...commentInputs, [postId]: '' })
    }
  }

  const getTopicBadge = (topic) => {
    const badges = {
      homework: { color: 'bg-blue-100 text-blue-700', label: '📚 Hỏi Bài' },
      discussion: { color: 'bg-purple-100 text-purple-700', label: '💬 Thảo Luận' },
      fun: { color: 'bg-pink-100 text-pink-700', label: '🎉 Giải Trí' },
    }
    return badges[topic] || badges.homework
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-amber-200 mt-8">
      <h2 className="text-2xl font-display font-bold text-amber-950 mb-6 flex items-center gap-2">
        ☕ Cacao Lounge - Cộng Đồng
      </h2>

      {/* Ô Đăng Bài */}
      <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl p-6 border-2 border-amber-200 mb-6">
        <p className="font-display font-bold text-amber-950 mb-4">✍️ Chia Sẻ Bài Viết Của Bạn</p>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Hỏi bài tập, thảo luận hoặc chia sẻ điều thú vị... 🍫"
          className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all text-stone-900 placeholder-stone-400 font-medium resize-none h-20"
        />

        <div className="flex items-center gap-3 mt-4">
          <select
            value={newPostTopic}
            onChange={(e) => setNewPostTopic(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-amber-200 focus:ring-2 focus:ring-amber-700 focus:border-transparent text-stone-900 font-medium"
          >
            <option value="homework">📚 Hỏi Bài Tập</option>
            <option value="discussion">💬 Thảo Luận Chung</option>
            <option value="fun">🎉 Góc Giải Trí</option>
          </select>

          <button
            onClick={handlePostSubmit}
            disabled={!newPostContent.trim()}
            className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 disabled:from-stone-400 disabled:to-stone-400 text-amber-50 font-display font-bold px-6 py-2 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
          >
            📤 Đăng Bài
          </button>
        </div>
      </div>

      {/* Danh Sách Bài Viết */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-stone-50 rounded-2xl p-6 border-2 border-amber-100 hover:border-amber-300 transition-all">
            {/* Header Bài Viết */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{post.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display font-bold text-stone-900">{post.author}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${post.role === 'teacher' ? 'bg-amber-200 text-amber-900' : 'bg-blue-200 text-blue-900'}`}>
                      {post.role === 'teacher' ? '👨‍🏫 Giáo Viên' : '👨‍🎓 Học Sinh'}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">{post.timestamp}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getTopicBadge(post.topic).color}`}>
                {getTopicBadge(post.topic).label}
              </span>
            </div>

            {/* Nội Dung */}
            <p className="text-stone-700 mb-4 leading-relaxed">{post.content}</p>

            {/* Lượt Thích & Bình Luận */}
            <div className="flex items-center gap-6 pb-4 border-b border-amber-200 text-sm text-stone-600">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1 hover:text-red-500 transition-all font-medium"
              >
                {post.liked ? '❤️' : '🤍'} {post.likes} Thích
              </button>
              <button
                onClick={() => setExpandedComments({ ...expandedComments, [post.id]: !expandedComments[post.id] })}
                className="flex items-center gap-1 hover:text-amber-700 transition-all font-medium"
              >
                💬 {post.comments} Bình Luận
              </button>
            </div>

            {/* Khu Vực Bình Luận */}
            {expandedComments[post.id] && (
              <div className="mt-4 space-y-3">
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Viết bình luận..."
                      className="flex-1 px-3 py-2 rounded border border-amber-200 focus:ring-1 focus:ring-amber-700 text-sm font-medium"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 rounded font-bold transition-all text-sm"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [studentCacao, setStudentCacao] = useState(156)

  const handleSignOut = async () => {
    localStorage.removeItem('userRole')
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleRedeemReward = (rewardId, cost) => {
    if (studentCacao >= cost) {
      setStudentCacao(studentCacao - cost)
      alert('✨ Bạn đã đổi phần thưởng thành công! Vui lòng nhận tại văn phòng nhà trường.')
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <Sidebar onSignOut={handleSignOut} />

      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-display font-bold text-amber-950">🍫 Bảng Điều Khiển Học Sinh</h1>
          <p className="text-stone-700 mt-2 font-medium">Xem khóa học, tiến độ, điểm số và tương tác với cộng đồng</p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:shadow-xl transition-all">
            <div className="text-5xl mb-3">📚</div>
            <div className="text-sm text-stone-600 font-medium">Khóa Học Đang Học</div>
            <div className="text-3xl font-display font-bold text-blue-900">4</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:shadow-xl transition-all">
            <div className="text-5xl mb-3">📈</div>
            <div className="text-sm text-stone-600 font-medium">Tiến Độ Trung Bình</div>
            <div className="text-3xl font-display font-bold text-green-900">78%</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
            <div className="text-5xl mb-3">📊</div>
            <div className="text-sm text-stone-600 font-medium">Điểm Trung Bình</div>
            <div className="text-3xl font-display font-bold text-purple-900">8.6</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border-2 border-orange-200 hover:shadow-xl transition-all">
            <div className="text-5xl mb-3">🔥</div>
            <div className="text-sm text-stone-600 font-medium">Streak Ngày Học</div>
            <div className="text-3xl font-display font-bold text-orange-900">12</div>
          </div>
        </section>

        {/* Course Progress */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-amber-200 mb-8">
          <h2 className="text-2xl font-display font-bold text-amber-950 mb-6 flex items-center gap-2">
            📖 Tiến Độ Khóa Học
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Ngữ Văn Căn Bản', progress: 42, emoji: '📖' },
              { title: 'Toán 10 - Đại Số', progress: 78, emoji: '🔢' },
              { title: 'Khoa Học Tự Nhiên', progress: 16, emoji: '🧪' },
              { title: 'Tiếng Anh Giao Tiếp', progress: 95, emoji: '🗣️' },
            ].map((course, index) => (
              <div key={index} className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-xl p-6 border-2 border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{course.emoji}</span>
                    <h3 className="font-display font-bold text-stone-900">{course.title}</h3>
                  </div>
                  <div className="font-display font-bold text-amber-700">{course.progress}%</div>
                </div>
                <div className="w-full bg-stone-300 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-amber-500 to-amber-700 transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard & Rewards */}
        <LeaderboardSection studentCacao={studentCacao} onRedeemReward={handleRedeemReward} />

        {/* Cacao Lounge */}
        <CacaoLounge currentUserRole="student" />
      </main>
    </div>
  )
}

export default StudentDashboard
