import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const LandingPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra nếu user đã login
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Nếu đã login, lấy role từ localStorage và redirect
        const role = localStorage.getItem('userRole')
        navigate(role === 'teacher' ? '/dashboard-teacher' : '/dashboard-student')
      }
      setIsLoading(false)
    }
    checkUser()
  }, [navigate])

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold font-serif text-amber-950">🍫</div>
            <h1 className="text-3xl font-bold font-serif text-amber-950">CACAO TLMS</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-amber-700 hover:bg-amber-800 text-amber-50 font-bold px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Đăng Nhập
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold font-serif text-amber-950 mb-4">
                Hệ Thống Quản Lý Học Tập Cacao
              </h2>
              <p className="text-xl text-stone-700 leading-relaxed">
                Một nền tảng hiện đại, ấm áp như vị cacao, kết nối giáo viên và học sinh trong một hành trình học tập trọn vẹn và hiệu quả.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-amber-700 hover:bg-amber-800 text-amber-50 font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Bắt Đầu Ngay
              </button>
              <button className="border-2 border-amber-700 text-amber-950 hover:bg-amber-50 font-bold px-8 py-3 rounded-full transition-all duration-300">
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center">
            <div className="text-center space-y-4">
              <div className="text-9xl">🍫</div>
              <p className="text-2xl font-serif text-amber-900">Hương Vị Học Tập</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-amber-100/50 py-20 border-y-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold font-serif text-amber-950 text-center mb-16">
            Tính Năng Nổi Bật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-700 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">📚</div>
              <h4 className="text-2xl font-bold text-amber-950 mb-3">Quản Lý Khóa Học</h4>
              <p className="text-stone-700 leading-relaxed">
                Tạo, sửa, và quản lý các khóa học một cách dễ dàng. Chia sẻ tài liệu học tập hiệu quả.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-700 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">✅</div>
              <h4 className="text-2xl font-bold text-amber-950 mb-3">Bài Tập & Chấm Điểm</h4>
              <p className="text-stone-700 leading-relaxed">
                Giao bài tập, theo dõi tiến độ, và chấm điểm một cách tập trung và minh bạch.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-700 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">📊</div>
              <h4 className="text-2xl font-bold text-amber-950 mb-3">Phân Tích Tiến Độ</h4>
              <p className="text-stone-700 leading-relaxed">
                Xem báo cáo chi tiết, đồ thị tiến độ, và nhận xét phản hồi từ giáo viên.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-700 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">💬</div>
              <h4 className="text-2xl font-bold text-amber-950 mb-3">Tương Tác Trực Tiếp</h4>
              <p className="text-stone-700 leading-relaxed">
                Gửi tin nhắn, hỏi đáp, và trao đổi với giáo viên và bạn cùng lớp.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-700 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🏆</div>
              <h4 className="text-2xl font-bold text-amber-950 mb-3">Bảng Xếp Hạng</h4>
              <p className="text-stone-700 leading-relaxed">
                Cạnh tranh lành mạnh, xem ranking của bạn, và nhận badge thành tích.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-700 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🔒</div>
              <h4 className="text-2xl font-bold text-amber-950 mb-3">Bảo Mật Cao Cấp</h4>
              <p className="text-stone-700 leading-relaxed">
                Tất cả dữ liệu được mã hóa, bảo mật tuân theo chuẩn quốc tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 rounded-3xl shadow-2xl p-12 text-center text-amber-50">
          <h3 className="text-4xl font-bold font-serif mb-4">Sẵn Sàng Bắt Đầu?</h3>
          <p className="text-xl mb-8 opacity-90">
            Tham gia cộng đồng học tập Cacao ngay hôm nay
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-amber-50 hover:bg-stone-50 text-amber-950 font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Đăng Nhập Ngay
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-950 text-amber-50 border-t-2 border-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Về CACAO</h4>
              <p className="opacity-80">Hệ thống quản lý học tập hiện đại, ấm áp, và hiệu quả.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Tính Năng</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:text-amber-200">Khóa Học</a></li>
                <li><a href="#" className="hover:text-amber-200">Bài Tập</a></li>
                <li><a href="#" className="hover:text-amber-200">Phân Tích</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:text-amber-200">Trung Tâm Trợ Giúp</a></li>
                <li><a href="#" className="hover:text-amber-200">Liên Hệ</a></li>
                <li><a href="#" className="hover:text-amber-200">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Pháp Lý</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:text-amber-200">Điều Khoản</a></li>
                <li><a href="#" className="hover:text-amber-200">Riêng Tư</a></li>
                <li><a href="#" className="hover:text-amber-200">Cookie</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800 pt-8 text-center opacity-80">
            <p>&copy; 2026 CACAO TLMS. Tất cả quyền được bảo lưu. 🍫</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
