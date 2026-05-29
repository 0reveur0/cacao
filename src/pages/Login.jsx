import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // 'student' hoặc 'teacher'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Form đăng nhập bằng email/password
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email || !password) {
        throw new Error('Vui lòng nhập Email và Password')
      }

      // Đăng nhập thực tế với Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      // Lưu role vào localStorage
      localStorage.setItem('userRole', role)

      // Điều hướng theo role
      if (role === 'teacher') {
        navigate('/dashboard-teacher')
      } else {
        navigate('/dashboard-student')
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  // OAuth đăng nhập (Google, Facebook, GitHub)
  const handleOAuthLogin = async (provider) => {
    setLoading(true)
    setError('')

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider, // 'google', 'facebook', 'github'
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
        },
      })

      if (oauthError) {
        throw oauthError
      }

      // Lưu role vào localStorage (sẽ được lấy lại ở trang callback)
      localStorage.setItem('userRole', role)
    } catch (err) {
      setError(err.message || 'Đăng nhập OAuth thất bại')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 inline-block">🍫</div>
          <h1 className="text-4xl font-bold font-serif text-amber-950 mb-2">CACAO TLMS</h1>
          <p className="text-stone-600 text-lg">Đăng Nhập Vào Hệ Thống</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 border-2 border-amber-200">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700 text-sm">
              <p className="font-semibold">⚠️ Lỗi</p>
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {!error && (
            <div className="bg-amber-50 border-l-4 border-amber-700 rounded-lg p-4 text-stone-700 text-sm">
              <p className="font-semibold">ℹ️ Hướng dẫn</p>
              <p>Hãy chọn vai trò của bạn, nhập Email, Password, rồi đăng nhập.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-amber-950 mb-3">
                Chọn Vai Trò
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 rounded-lg border-2 border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors" style={{ borderColor: role === 'student' ? '#b45309' : '#fcd34d' }}>
                  <input
                    type="radio"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-amber-700"
                  />
                  <span className="ml-3 font-semibold text-stone-700">👨‍🎓 Học Sinh</span>
                </label>
                <label className="flex items-center p-3 rounded-lg border-2 border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors" style={{ borderColor: role === 'teacher' ? '#b45309' : '#fcd34d' }}>
                  <input
                    type="radio"
                    value="teacher"
                    checked={role === 'teacher'}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-amber-700"
                  />
                  <span className="ml-3 font-semibold text-stone-700">👨‍🏫 Giáo Viên</span>
                </label>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-amber-950 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all text-stone-900 placeholder-stone-400 font-medium"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-amber-950 mb-2">
                Mật Khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all text-stone-900 placeholder-stone-400 font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 text-amber-50 font-bold py-3 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
            >
              {loading ? '⏳ Đang Xử Lý...' : '🔓 Đăng Nhập'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-amber-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm font-semibold text-stone-600">HOẶC ĐĂNG NHẬP VỚI</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-amber-200 rounded-lg hover:bg-amber-50 transition-colors font-semibold text-stone-700 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-amber-200 rounded-lg hover:bg-amber-50 transition-colors font-semibold text-stone-700 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-amber-200 rounded-lg hover:bg-amber-50 transition-colors font-semibold text-stone-700 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-stone-600 text-sm">
            Chưa có tài khoản?{' '}
            <a href="#" className="text-amber-700 hover:text-amber-800 font-bold">
              Đăng ký tại đây
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
