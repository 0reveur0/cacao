import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen">Đang tải...</div>

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole) {
    const userRole = localStorage.getItem('userRole')
    if (userRole !== requiredRole) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Teacher Dashboard */}
        <Route
          path="/dashboard-teacher"
          element={
            <ProtectedRoute requiredRole="teacher">
              <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
                <header className="bg-amber-950 text-amber-50 py-6 shadow-lg">
                  <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold font-serif">🍫 CACAO TLMS - Dashboard Giáo Viên</h1>
                    <button
                      onClick={async () => {
                        localStorage.removeItem('userRole')
                        await supabase.auth.signOut()
                        window.location.href = '/login'
                      }}
                      className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg font-semibold"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-700">
                      <div className="text-4xl font-bold text-amber-700 mb-2">12</div>
                      <p className="text-stone-700 font-semibold">Khóa Học</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-700">
                      <div className="text-4xl font-bold text-amber-700 mb-2">348</div>
                      <p className="text-stone-700 font-semibold">Học Sinh</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-700">
                      <div className="text-4xl font-bold text-amber-700 mb-2">52</div>
                      <p className="text-stone-700 font-semibold">Bài Tập Cần Chấm</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-amber-200">
                    <h2 className="text-2xl font-bold text-amber-950 mb-4">Quản Lý Khóa Học</h2>
                    <p className="text-stone-700">Tính năng quản lý khóa học, bài tập, và đánh giá sẽ được thêm sớm.</p>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/dashboard-student"
          element={
            <ProtectedRoute requiredRole="student">
              <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
                <header className="bg-amber-950 text-amber-50 py-6 shadow-lg">
                  <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold font-serif">🍫 CACAO TLMS - Dashboard Học Sinh</h1>
                    <button
                      onClick={async () => {
                        localStorage.removeItem('userRole')
                        await supabase.auth.signOut()
                        window.location.href = '/login'
                      }}
                      className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg font-semibold"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-700">
                      <div className="text-4xl font-bold text-amber-700 mb-2">4</div>
                      <p className="text-stone-700 font-semibold">Khóa Học Đang Học</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-700">
                      <div className="text-4xl font-bold text-amber-700 mb-2">78%</div>
                      <p className="text-stone-700 font-semibold">Điểm Trung Bình</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-700">
                      <div className="text-4xl font-bold text-amber-700 mb-2">3</div>
                      <p className="text-stone-700 font-semibold">Bài Tập Chưa Làm</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-amber-200">
                    <h2 className="text-2xl font-bold text-amber-950 mb-4">Khóa Học Của Tôi</h2>
                    <p className="text-stone-700">Danh sách khóa học và bài tập sẽ được thêm sớm.</p>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
