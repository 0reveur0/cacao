import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold font-display text-gray-900">CACAO</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Navigation</h2>
              <nav className="space-y-3">
                <a href="#" className="block px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">
                  📚 Dashboard
                </a>
                <a href="#" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  📖 Courses
                </a>
                <a href="#" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  ✅ Assignments
                </a>
                <a href="#" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  📝 Notes
                </a>
                <a href="#" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  🏆 Leaderboard
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white mb-8">
              <h1 className="text-4xl font-bold mb-2">Welcome, {user.email.split('@')[0]}! 👋</h1>
              <p className="text-blue-100 text-lg">You're making great progress. Keep up the fantastic work!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">4</div>
                <p className="text-gray-700 font-medium">Active Courses</p>
                <p className="text-gray-500 text-sm">Enrolled & learning</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">12</div>
                <p className="text-gray-700 font-medium">Completed Lessons</p>
                <p className="text-gray-500 text-sm">Keep going!</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
                <p className="text-gray-700 font-medium">Average Score</p>
                <p className="text-gray-500 text-sm">Excellent performance</p>
              </div>
            </div>

            {/* Current Courses Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Card 1 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-32"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Art of Chocolate Making</h3>
                    <p className="text-gray-600 mb-4">Learn the fundamentals of chocolate tempering and molding.</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">Progress</span>
                        <span className="text-gray-600">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors">
                      Continue Learning
                    </button>
                  </div>
                </div>

                {/* Course Card 2 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 h-32"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Flavor Combinations</h3>
                    <p className="text-gray-600 mb-4">Master the art of blending flavors for unique chocolate creations.</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">Progress</span>
                        <span className="text-gray-600">62%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-colors">
                      Continue Learning
                    </button>
                  </div>
                </div>

                {/* Course Card 3 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-32"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Business of Chocolate</h3>
                    <p className="text-gray-600 mb-4">Understand packaging, branding, and marketing strategies.</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">Progress</span>
                        <span className="text-gray-600">28%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                      Continue Learning
                    </button>
                  </div>
                </div>

                {/* Course Card 4 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-pink-400 to-rose-500 h-32"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainable Chocolate Production</h3>
                    <p className="text-gray-600 mb-4">Learn eco-friendly and ethical chocolate production methods.</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">Progress</span>
                        <span className="text-gray-600">80%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition-colors">
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Assignments</h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assignment</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">Tempering Technique Quiz</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Chocolate Making</td>
                      <td className="px-6 py-4 text-sm text-gray-600">May 31, 2026</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">Flavor Pairing Analysis</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Flavor Combinations</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Jun 5, 2026</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">Marketing Campaign Plan</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Business of Chocolate</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Jun 10, 2026</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">In Progress</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
