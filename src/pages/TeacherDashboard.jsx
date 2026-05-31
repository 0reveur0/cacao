import React from 'react'
import { supabase } from '../supabase'

const Sidebar = ({ onSignOut }) => (
  <aside className="w-72 bg-amber-950 text-amber-50 min-h-screen p-6">
    <div className="mb-8">
      <div className="text-4xl">🍫</div>
      <h2 className="text-lg font-bold mt-2">CACAO TLMS</h2>
      <p className="text-sm text-amber-200/80">Bảng điều khiển Giáo Viên</p>
    </div>

    <nav className="space-y-3">
      <button className="w-full text-left px-3 py-2 rounded-md bg-amber-800/40 hover:bg-amber-800/60">Quản lý Lớp</button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20">Quản lý Bài giảng</button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20">Danh sách Học sinh</button>
      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-800/20">Báo cáo & Điểm</button>
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

const TeacherDashboard = () => {
  const handleSignOut = async () => {
    localStorage.removeItem('userRole')
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <Sidebar onSignOut={handleSignOut} />

      <main className="flex-1 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-amber-950 font-serif">Bảng điều khiển Giáo Viên</h1>
          <p className="text-stone-700 mt-1">Quản lý lớp học, bài giảng và học sinh</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-amber-700">
            <div className="text-3xl font-bold text-amber-700">12</div>
            <div className="text-stone-700 font-semibold">Khóa học đang quản lý</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-amber-700">
            <div className="text-3xl font-bold text-amber-700">348</div>
            <div className="text-stone-700 font-semibold">Tổng học sinh</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-amber-700">
            <div className="text-3xl font-bold text-amber-700">52</div>
            <div className="text-stone-700 font-semibold">Bài tập cần chấm</div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6 border-2 border-amber-200">
          <h2 className="text-xl font-bold text-amber-950 mb-3">Quản lý lớp học</h2>
          <p className="text-stone-700">Danh sách lớp, phân công giáo viên và quản lý sinh hoạt lớp sẽ xuất hiện ở đây.</p>
        </section>
      </main>
    </div>
  )
}

export default TeacherDashboard
