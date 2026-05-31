import React from 'react'
import { supabase } from '../supabase'

const Sidebar = ({ onSignOut }) => (
  <aside className="w-72 bg-amber-950 text-amber-50 min-h-screen p-6">
    <div className="mb-8">
      <div className="text-4xl">🍫</div>
      <h2 className="text-lg font-bold mt-2">CACAO TLMS</h2>
      <p className="text-sm text-amber-200/80">Bảng điều khiển Học Sinh</p>
    </div>

    <nav className="space-y-3">
      <button className="w-full text-left px-3 py-2 rounded-md bg-amber-800/40 hover:bg-amber-800/60">Khóa Học</button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20">Tiến Độ</button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20">Bảng Điểm</button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20">Hỗ trợ</button>
    </nav>

    <div className="mt-auto pt-6">
      <button
        onClick={onSignOut}
        className="w-full bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-md font-semibold"
      >
        Đăng Xuất
      </button>
    </div>
  </aside>
)

const CourseCard = ({ title, progress }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-amber-900">{title}</h3>
      <div className="text-sm font-bold text-amber-700">{progress}%</div>
    </div>
    <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
      <div className="h-3 bg-amber-700" style={{ width: `${progress}%` }} />
    </div>
  </div>
)

const StudentDashboard = () => {
  const handleSignOut = async () => {
    localStorage.removeItem('userRole')
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const courses = [
    { title: 'Ngữ văn căn bản', progress: 42 },
    { title: 'Toán 10 - Đại số', progress: 78 },
    { title: 'Khoa học tự nhiên', progress: 16 },
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <Sidebar onSignOut={handleSignOut} />

      <main className="flex-1 p-10">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-amber-950 font-serif">Bảng điều khiển Học Sinh</h1>
          <p className="text-stone-700 mt-1">Xem khóa học, tiến độ và điểm số của bạn</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-amber-700">
            <div className="text-3xl font-bold text-amber-700">4</div>
            <div className="text-stone-700 font-semibold">Khóa học đang học</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-amber-700">
            <div className="text-3xl font-bold text-amber-700">78%</div>
            <div className="text-stone-700 font-semibold">Tiến độ trung bình</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-amber-700">
            <div className="text-3xl font-bold text-amber-700">8.6</div>
            <div className="text-stone-700 font-semibold">Điểm trung bình</div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <CourseCard key={c.title} title={c.title} progress={c.progress} />
          ))}
        </section>
      </main>
    </div>
  )
}

export default StudentDashboard
