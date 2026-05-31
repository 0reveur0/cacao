import React, { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ onSignOut }) => (
  <aside className="w-72 bg-amber-950 text-amber-50 min-h-screen p-6 sticky top-0">
    <div className="mb-8">
      <div className="text-4xl">🍫</div>
      <h2 className="text-lg font-display font-bold mt-2">CACAO TLMS</h2>
      <p className="text-sm text-amber-200/80">Bảng Điều Khiển Giáo Viên</p>
    </div>

    <nav className="space-y-3">
      <button className="w-full text-left px-3 py-2 rounded-md bg-amber-800/40 hover:bg-amber-800/60 transition-all font-medium">
        📊 Quản Lý Lớp
      </button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20 transition-all font-medium">
        🎓 Quản Lý Bài Giảng
      </button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20 transition-all font-medium">
        📋 Danh Sách Học Sinh
      </button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20 transition-all font-medium">
        📈 Báo Cáo & Điểm
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

// Component Quản Lý Cộng Điểm
const RewardManagement = ({ students, onAddReward }) => {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [rewardAmount, setRewardAmount] = useState('')
  const [reason, setReason] = useState('homework')

  const handleAddReward = () => {
    if (selectedStudent && rewardAmount) {
      onAddReward(selectedStudent, parseInt(rewardAmount), reason)
      setRewardAmount('')
      setReason('homework')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-amber-200">
      <h2 className="text-2xl font-display font-bold text-amber-950 mb-6 flex items-center gap-2">
        🌟 Quản Lý Cộng Hạt Cacao Thưởng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Select Học Sinh */}
        <div>
          <label className="block text-sm font-display font-bold text-amber-950 mb-2">
            Chọn Học Sinh
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all text-stone-900 font-medium"
          >
            <option value="">-- Chọn học sinh --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Số Lượng Hạt */}
        <div>
          <label className="block text-sm font-display font-bold text-amber-950 mb-2">
            Số Lượng Hạt
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={rewardAmount}
            onChange={(e) => setRewardAmount(e.target.value)}
            placeholder="Ví dụ: 5"
            className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all text-stone-900 font-medium"
          />
        </div>

        {/* Lý Do Cộng Điểm */}
        <div>
          <label className="block text-sm font-display font-bold text-amber-950 mb-2">
            Lý Do Cộng Điểm
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all text-stone-900 font-medium"
          >
            <option value="homework">📝 Làm bài tập về nhà xuất sắc</option>
            <option value="participation">🙋 Phát biểu tích cực</option>
            <option value="competition">🏆 Đạt giải cuộc thi tuần</option>
            <option value="teamwork">👥 Hợp tác nhóm tốt</option>
            <option value="creativity">💡 Ý tưởng sáng tạo</option>
          </select>
        </div>

        {/* Nút Cộng Điểm */}
        <div className="flex items-end">
          <button
            onClick={handleAddReward}
            disabled={!selectedStudent || !rewardAmount}
            className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 disabled:from-stone-400 disabled:to-stone-400 text-amber-50 font-display font-bold py-2 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            ✨ Cộng Điểm
          </button>
        </div>
      </div>

      {/* Bảng Học Sinh Gần Đây Được Cộng */}
      <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
        <h3 className="text-lg font-display font-bold text-amber-950 mb-4">📌 Ghi Chép Gần Đây</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {students.slice(0, 3).map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between bg-white rounded-lg p-3 border-l-4 border-amber-700"
            >
              <div>
                <p className="font-bold text-stone-900">{student.name}</p>
                <p className="text-sm text-stone-600">+5 Hạt Cacao • Phát biểu tích cực</p>
              </div>
              <div className="text-2xl">🌟</div>
            </div>
          ))}
        </div>
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

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [students] = useState([
    { id: 1, name: 'Nguyễn Văn An', cacaoSeeds: 45 },
    { id: 2, name: 'Trần Minh Phương', cacaoSeeds: 38 },
    { id: 3, name: 'Hoàng Gia Hân', cacaoSeeds: 52 },
    { id: 4, name: 'Phan Đức Minh', cacaoSeeds: 41 },
    { id: 5, name: 'Lê Thị Hương', cacaoSeeds: 35 },
  ])

  const handleSignOut = async () => {
    localStorage.removeItem('userRole')
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleAddReward = (studentId, amount, reason) => {
    console.log(`Cộng ${amount} hạt cacao cho học sinh ${studentId} vì: ${reason}`)
    // Có thể thêm API call ở đây để lưu vào database
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <Sidebar onSignOut={handleSignOut} />

      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-display font-bold text-amber-950">🍫 Bảng Điều Khiển Giáo Viên</h1>
          <p className="text-stone-700 mt-2 font-medium">Quản lý lớp học, cộng điểm và tương tác với học sinh</p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-6 border-2 border-yellow-200 hover:shadow-xl transition-all">
            <div className="text-5xl mb-3">🍫</div>
            <div className="text-sm text-stone-600 font-medium">Tổng Hạt Cacao Phát</div>
            <div className="text-3xl font-display font-bold text-amber-950">412</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:shadow-xl transition-all">
            <div className="text-5xl mb-3">👨‍🎓</div>
            <div className="text-sm text-stone-600 font-medium">Tổng Học Sinh</div>
            <div className="text-3xl font-display font-bold text-blue-900">126</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:shadow-xl transition-all">
            <div className="text-5xl mb-3">📊</div>
            <div className="text-sm text-stone-600 font-medium">Bài Tập Cần Chấm</div>
            <div className="text-3xl font-display font-bold text-purple-900">18</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:shadow-xl transition-all">
            <div className="text-5xl mb-3">💬</div>
            <div className="text-sm text-stone-600 font-medium">Thảo Luận Hôm Nay</div>
            <div className="text-3xl font-display font-bold text-green-900">23</div>
          </div>
        </section>

        {/* Reward Management */}
        <RewardManagement students={students} onAddReward={handleAddReward} />

        {/* Cacao Lounge */}
        <CacaoLounge currentUserRole="teacher" />
      </main>
    </div>
  )
}

export default TeacherDashboard
