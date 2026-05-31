import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase'; // Corrected import

// --- Helper Components ---
const StatCard = ({ title, value, icon, color = 'orange' }) => {
  const bgColor = color === 'orange' ? 'bg-orange-400' : color === 'green' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className={`text-4xl p-3 rounded-full text-white ${bgColor}`}>{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-orange-800 font-['Kanit']">{title}</h3>
        <p className="text-3xl font-extrabold text-orange-600 space-grotesk">{value}</p>
      </div>
    </div>
  );
};

const AdminSectionCard = ({ title, children, icon }) => (
  <div className="bg-white rounded-3xl p-8 shadow-lg border border-orange-200">
    <div className="flex items-center mb-6">
      <span className="text-4xl mr-4 p-3 bg-orange-400 rounded-full text-white">{icon}</span>
      <h3 className="text-3xl font-bold font-['Kanit'] text-orange-800">{title}</h3>
    </div>
    {children}
  </div>
);

// --- Feature Components ---

// 1. Mint & Burn Cacao Token Component
const MintBurnCacao = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const findUser = async () => {
    setMessage('');
    setUserStats(null);
    if (!searchQuery) return;

    console.log(`Searching for user: ${searchQuery}`);
    // Replace with actual Supabase query
    const simulatedUserData = {
      id: 'user123',
      name: 'Nguyễn Văn B',
      email: 'student.b@example.com',
      role: 'student',
      cacaoBeans: 500,
    };
    setUserStats(simulatedUserData);
  };

  const handleMintBurn = async (action) => {
    if (!userStats || !amount || !reason) {
      setMessage('Vui lòng nhập số lượng và lý do.');
      return;
    }
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setMessage('Số lượng không hợp lệ.');
      return;
    }

    let operation = '';
    let updatedBeans = userStats.cacaoBeans;

    if (action === 'mint') {
      operation = 'Bơm thêm';
      updatedBeans = userStats.cacaoBeans + numericAmount;
    } else { // burn
      operation = 'Tịch thu';
      if (numericAmount > userStats.cacaoBeans) {
        setMessage('Số hạt muốn tịch thu vượt quá số hạt hiện có.');
        return;
      }
      updatedBeans = userStats.cacaoBeans - numericAmount;
    }

    console.log(`${operation} ${numericAmount} hạt Cacao cho ${userStats.name} (Lý do: ${reason})`);
    // Replace with actual Supabase update logic
    setUserStats({ ...userStats, cacaoBeans: updatedBeans });
    setMessage(`Đã ${action === 'mint' ? 'bơm thêm' : 'tịch thu'} ${numericAmount} hạt Cacao.`);
    setAmount('');
    setReason('');
  };

  return (
    <AdminSectionCard title="Trung Tâm Điều Phối Dòng Chảy Cacao" icon="💸">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
          <h4 className="text-xl font-bold text-orange-800 font-['Kanit'] mb-4">Tra cứu & Hành động</h4>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Nhập tên hoặc email học sinh..." className="flex-grow p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 space-grotesk" />
            <button onClick={findUser} className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow transition-colors duration-200 space-grotesk">Tìm kiếm</button>
          </div>
          {userStats && (
            <div className="mt-4 p-4 bg-orange-100 rounded-lg border border-orange-200 space-grotesk">
              <p className="font-semibold text-orange-800">Tên: {userStats.name}</p>
              <p className="text-orange-700">Email: {userStats.email}</p>
              <p className="font-bold text-lg text-orange-900 mt-2">Số Hạt Cacao Hiện tại: {userStats.cacaoBeans} 🌰</p>
            </div>
          )}
          {message && <p className={`mt-3 text-sm font-semibold ${message.includes('thành công') || message.includes('bơm thêm') ? 'text-green-600' : 'text-red-600'} space-grotesk`}>{message}</p>}
        </div>

        {userStats && (
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
            <h4 className="text-xl font-bold text-orange-800 font-['Kanit'] mb-4">Thao tác Cacao</h4>
            <div className="flex flex-col md:flex-row gap-3 mb-3">
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Số lượng hạt" className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 space-grotesk w-full md:w-1/2" />
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Lý do (bắt buộc)" className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 space-grotesk w-full h-24 md:h-auto resize-none" rows="2"></textarea>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleMintBurn('mint')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors duration-200 space-grotesk font-bold flex-1">Bơm thêm hạt</button>
              <button onClick={() => handleMintBurn('burn')} className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow transition-colors duration-200 space-grotesk font-bold flex-1">Tịch thu hạt</button>
            </div>
          </div>
        )}
      </div>
    </AdminSectionCard>
  );
};

// 2. Cacao Lounge Moderation Component
const CacaoLoungeModeration = () => {
  const [reportedPosts, setReportedPosts] = useState([
    { id: 1, author: 'Người dùng A', content: 'Bài đăng này chứa nội dung không phù hợp...', timestamp: '2 giờ trước', reportReason: 'Nội dung xấu', reportedBy: 'Người dùng X' },
    { id: 2, author: 'Người dùng B', content: 'Bình luận spam quảng cáo', timestamp: '5 phút trước', reportReason: 'Spam', reportedBy: 'Người dùng Y' },
    { id: 3, author: 'Người dùng C', content: 'Nội dung gây hiểu lầm nghiêm trọng', timestamp: '1 ngày trước', reportReason: 'Thông tin sai lệch', reportedBy: 'Người dùng Z' },
  ]);

  const handleAction = (postId, action) => {
    console.log(`Action: ${action} on post ID: ${postId}`);
    if (action === 'delete') {
      alert('Đã xóa bài viết và cấm người dùng này 3 ngày.');
    } else {
      alert('Đã giữ lại bài viết.');
    }
    setReportedPosts(reportedPosts.filter(post => post.id !== postId));
  };

  return (
    <AdminSectionCard title="Tòa Án Cacao Lounge" icon="⚖️">
      {reportedPosts.length === 0 ? (
        <p className="text-center text-orange-600 text-lg space-grotesk">Không có bài đăng nào đang chờ kiểm duyệt.</p>
      ) : (
        <div className="space-y-4">
          {reportedPosts.map(post => (
            <div key={post.id} className="bg-orange-50 rounded-xl p-4 shadow border border-orange-100 space-grotesk">
              <p className="font-semibold text-orange-800 mb-2">Bài đăng từ: {post.author}</p>
              <p className="text-sm text-orange-700 mb-2 italic">"{post.content}"</p>
              <p className="text-xs text-orange-500 mb-2">Báo cáo bởi: {post.reportedBy} ({post.reportReason}) - {post.timestamp}</p>
              <div className="flex space-x-3 mt-3">
                <button onClick={() => handleAction(post.id, 'keep')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition-colors duration-200">Giữ lại bài viết</button>
                <button onClick={() => handleAction(post.id, 'delete')} className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg shadow transition-colors duration-200 font-bold">Xóa & Cấm 3 ngày</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminSectionCard>
  );
};

// 3. Metrics Lab Component (Visual Reports)
const MetricsLab = () => {
  const chartContainerRef = useRef(null);
  const [chartData] = useState({
    hourlyTraffic: [150, 200, 250, 300, 400, 500, 600, 700, 650, 600, 550, 500, 450, 400, 350, 300, 350, 400, 450, 500, 550, 600, 500, 400],
    popularSubjects: [
      { name: 'Toán học', value: 70, color: '#D97706' },
      { name: 'Vật lý', value: 55, color: '#B45309' },
      { name: 'Hóa học', value: 48, color: '#92400E' },
      { name: 'Tiếng Anh', value: 62, color: '#7C3A0F' },
      { name: 'Lịch sử', value: 30, color: '#A16207' },
    ],
    activeClasses: [
      { name: '10A1', value: 85, color: '#EA580C' },
      { name: '11B3', value: 92, color: '#D97706' },
      { name: '12C2', value: 78, color: '#B45309' },
      { name: '9C1', value: 65, color: '#92400E' },
    ],
  });

  useEffect(() => { /* Fetch data */ }, []);

  const maxTraffic = Math.max(...chartData.hourlyTraffic);
  const maxSubjectValue = Math.max(...chartData.popularSubjects.map(s => s.value));
  const maxClassValue = Math.max(...chartData.activeClasses.map(c => c.value));

  return (
    <AdminSectionCard title="Phòng Thí Nghiệm Metrics" icon="📈">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-orange-50 rounded-xl p-6 shadow border border-orange-100">
          <h4 className="text-xl font-bold text-orange-800 font-['Kanit'] mb-4">Lượng Truy Cập Theo Giờ</h4>
          <div ref={chartContainerRef} className="flex items-end justify-between h-64 space-grotesk relative">
            {chartData.hourlyTraffic.map((value, index) => (
              <div key={index} className="flex flex-col items-center w-10">
                <div className="w-full bg-orange-200 rounded-t-lg" style={{ height: `${(value / maxTraffic) * 100}%` }}>
                  <div className={`w-full absolute bottom-0 transition-all duration-500 bg-orange-500 hover:bg-orange-600`} style={{ height: `${(value / maxTraffic) * 100}%` }}></div>
                </div>
                <span className={`text-xs mt-1 ${value === maxTraffic ? 'font-bold text-orange-700' : 'text-orange-500'}`}>{index < 10 ? `0${index}` : index}h</span>
              </div>
            ))}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-orange-500 pr-2">
              <span>Max</span><span></span><span></span><span>0</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 shadow border border-orange-100">
          <h4 className="text-xl font-bold text-orange-800 font-['Kanit'] mb-4">Môn Học Phổ Biến</h4>
          <div className="space-y-3">
            {chartData.popularSubjects.map((subject) => (
              <div key={subject.name} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: subject.color }}></div>
                <p className="flex-grow text-orange-800 space-grotesk">{subject.name}</p>
                <span className="font-bold text-orange-700 space-grotesk">{subject.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-orange-50 rounded-xl p-6 shadow border border-orange-100">
        <h4 className="text-xl font-bold text-orange-800 font-['Kanit'] mb-4">Lớp học Hoạt Động Nhất Tuần</h4>
        <div className="flex justify-around items-end h-40 space-grotesk">
          {chartData.activeClasses.map((cls) => (
            <div key={cls.name} className="flex flex-col items-center w-1/5">
              <div className="w-full relative rounded-t-lg transition-all duration-500" style={{ height: `${(cls.value / maxClassValue) * 100}%`, backgroundColor: cls.color }}>
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-orange-700">{cls.value}</span>
              </div>
              <p className="text-xs text-orange-600 mt-2">{cls.name}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminSectionCard>
  );
};

// 4. System Settings Component
const SystemSettings = () => {
  const [settings, setSettings] = useState({
    exchangeRate: { homeworkToBeans: 2, quizToBeans: 5 },
    chocoQuizEnabled: true,
    enrollmentPeriod: { start: '2024-09-01', end: '2024-09-15' },
    maxRewardCost: 500,
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (key.includes('.')) {
        const [parentKey, childKey] = key.split('.');
        newSettings[parentKey] = { ...newSettings[parentKey], [childKey]: value };
      } else {
        newSettings[key] = value;
      }
      return newSettings;
    });
  };

  const saveSettings = () => {
    console.log('Saving settings:', settings);
    alert('Cài đặt hệ thống đã được lưu!');
  };

  return (
    <AdminSectionCard title="Cấu hình Mùa Giải Cacao" icon="⚙️">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50 rounded-xl p-5 shadow border border-orange-100">
          <h4 className="text-xl font-bold text-orange-800 font-['Kanit'] mb-4">Tỷ lệ Đổi Điểm</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between space-grotesk">
              <label className="text-orange-700">Bài tập về nhà ➔ Hạt Cacao</label>
              <div className="flex items-center space-x-2">
                <input type="number" value={settings.exchangeRate.homeworkToBeans} onChange={(e) => handleSettingChange('exchangeRate.homeworkToBeans', parseInt(e.target.value, 10) || 0)} className="p-2 w-20 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center space-grotesk" />
                <span> Hạt/Bài</span>
              </div>
            </div>
            <div className="flex items-center justify-between space-grotesk">
              <label className="text-orange-700">Quiz ➔ Hạt Cacao</label>
              <div className="flex items-center space-x-2">
                <input type="number" value={settings.exchangeRate.quizToBeans} onChange={(e) => handleSettingChange('exchangeRate.quizToBeans', parseInt(e.target.value, 10) || 0)} className="p-2 w-20 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center space-grotesk" />
                <span> Hạt/Quiz</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-5 shadow border border-orange-100 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-orange-800 font-['Kanit'] mb-2">Đấu Trường Choco-Quiz</h4>
            <p className="text-sm text-orange-600 space-grotesk">Bật/Tắt tính năng thi đấu.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={settings.chocoQuizEnabled} onChange={(e) => handleSettingChange('chocoQuizEnabled', e.target.checked)} className="sr-only peer" />
            <div className="w-14 h-7 bg-orange-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="md:col-span-2 bg-orange-50 rounded-xl p-5 shadow border border-orange-100">
          <h4 className="text-xl font-bold text-orange-800 font-['Kanit'] mb-4">Cổng Đăng Ký Học Kỳ</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-grotesk">
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Ngày Bắt Đầu</label>
              <input type="date" value={settings.enrollmentPeriod.start} onChange={(e) => handleSettingChange('enrollmentPeriod.start', e.target.value)} className="p-3 w-full border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">Ngày Kết Thúc</label>
              <input type="date" value={settings.enrollmentPeriod.end} onChange={(e) => handleSettingChange('enrollmentPeriod.end', e.target.value)} className="p-3 w-full border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <button onClick={saveSettings} className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow transition-colors duration-200 space-grotesk text-lg">Lưu Cài Đặt Toàn Cục</button>
      </div>
    </AdminSectionCard>
  );
};

// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({ name: 'Quản Trị Viên', role: 'admin', avatar: '👑' });
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const sidebarLinks = [
    { id: 'overview', name: 'Tổng quan', icon: '📊' },
    { id: 'mintburn', name: 'Dòng Chảy Cacao', icon: '💸' },
    { id: 'moderation', name: 'Tòa Án Lounge', icon: '⚖️' },
    { id: 'metrics', name: 'Metrics Lab', icon: '📈' },
    { id: 'settings', name: 'Cấu hình Mùa Giải', icon: '⚙️' },
    { id: 'approvals', name: 'Duyệt GV', icon: '✅' },
    { id: 'rewards', name: 'Kho Quà Tặng', icon: '🎁' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <SystemOverview />;
      case 'mintburn':
        return <MintBurnCacao />;
      case 'moderation':
        return <CacaoLoungeModeration />;
      case 'metrics':
        return <MetricsLab />;
      case 'settings':
        return <SystemSettings />;
      case 'approvals':
        return <ApprovalManager />;
      case 'rewards':
        return <RewardManager />;
      default:
        return <SystemOverview />;
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    if (storedRole) setUserProfile(prev => ({ ...prev, role: storedRole }));
    if (storedName) setUserProfile(prev => ({ ...prev, name: storedName }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-100 to-orange-100 font-['Space_Grotesk'] flex">
      <div className="w-72 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-lg flex flex-col space-y-6 p-5">
        <div className="text-center py-5">
          <h1 className="text-3xl font-bold font-['Kanit'] text-orange-400 tracking-wide">Cacao Admin</h1>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-4xl mb-2">{userProfile.avatar}</span>
            <p className="font-bold text-lg">{userProfile.name}</p>
            <p className="text-sm text-orange-300 capitalize">{userProfile.role}</p>
          </div>
        </div>
        <nav className="flex-grow overflow-y-auto pr-2">
          {sidebarLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-300 font-semibold space-grotesk flex items-center
                ${activeTab === link.id
                  ? 'bg-orange-500 text-white shadow-orange-700 scale-105'
                  : 'hover:bg-gray-700 hover:text-orange-300'}`}
            >
              <span className="text-2xl mr-3">{link.icon}</span>
              {link.name}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button onClick={handleLogout} className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition-colors duration-200 font-bold space-grotesk flex items-center justify-center">
            <span className="mr-2">🔒</span> Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-beige-100 p-8 overflow-y-auto">
        <header className="mb-8 p-5 bg-white rounded-3xl shadow-md border border-orange-200 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-4xl font-bold font-['Kanit'] text-orange-800 capitalize">
            {sidebarLinks.find(link => link.id === activeSection)?.name || 'Tổng quan'}
          </h2>
        </header>

        <main>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

// --- Existing Components (Copied for completeness) ---
const ApprovalManager = () => {
  const [pendingTeachers, setPendingTeachers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'teacher.a@example.com', appliedDate: '2023-10-26' },
    { id: 2, name: 'Trần Thị B', email: 'teacher.b@example.com', appliedDate: '2023-10-25' },
    { id: 3, name: 'Lê Văn C', email: 'teacher.c@example.com', appliedDate: '2023-10-24' },
  ]);
  const approveTeacher = (teacherId) => { console.log(`Phê duyệt giáo viên ID: ${teacherId}`); setPendingTeachers(pendingTeachers.filter(t => t.id !== teacherId)); alert('Đã phê duyệt hồ sơ giáo viên!'); };
  const rejectTeacher = (teacherId) => { console.log(`Từ chối giáo viên ID: ${teacherId}`); setPendingTeachers(pendingTeachers.filter(t => t.id !== teacherId)); alert('Đã từ chối hồ sơ giáo viên.'); };
  return (
    <AdminSectionCard title="Duyệt Hồ Sơ Giáo Viên" icon="✅">
      {pendingTeachers.length === 0 ? (<p className="text-center text-orange-600 text-lg space-grotesk">Không có hồ sơ giáo viên nào đang chờ xử lý.</p>) : (<div className="space-y-4">{pendingTeachers.map(teacher => (<div key={teacher.id} className="bg-orange-50 rounded-xl p-4 shadow border border-orange-100 flex flex-col md:flex-row md:items-center justify-between space-grotesk"><div><p className="font-bold text-orange-800">{teacher.name}</p><p className="text-sm text-orange-600">Email: {teacher.email}</p><p className="text-sm text-orange-500">Ngày đăng ký: {teacher.appliedDate}</p></div><div className="flex space-x-3 mt-3 md:mt-0"><button onClick={() => approveTeacher(teacher.id)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors duration-200 flex items-center space-x-1"><span className="font-bold">✓</span> <span>Phê duyệt</span></button><button onClick={() => rejectTeacher(teacher.id)} className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow transition-colors duration-200 flex items-center space-x-1"><span className="font-bold">✕</span> <span>Từ chối</span></button></div></div>))}</div>)}
    </AdminSectionCard>
  );
};

const RewardManager = () => {
  const [rewards, setRewards] = useState([{ id: 1, name: 'Ly Cacao Nóng', cost: 50, imageUrl: '☕' },{ id: 2, name: 'Sổ Tay Cacao', cost: 75, imageUrl: '✍️' },{ id: 3, name: 'Voucher Học Tập', cost: 100, imageUrl: '📜' }]);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardCost, setNewRewardCost] = useState('');
  const [newRewardImage, setNewRewardImage] = useState('');
  const addReward = () => { if (newRewardName.trim() === '' || newRewardCost.trim() === '') return; const cost = parseInt(newRewardCost, 10); if (isNaN(cost) || cost <= 0) return; const newReward = { id: rewards.length + 1, name: newRewardName, cost: cost, imageUrl: newRewardImage || '🎁' }; setRewards([...rewards, newReward]); setNewRewardName(''); setNewRewardCost(''); setNewRewardImage(''); };
  const deleteReward = (rewardId) => { setRewards(rewards.filter(reward => reward.id !== rewardId)); };
  return (
    <AdminSectionCard title="Kho Quà Tặng" icon="🎁">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">{rewards.map(reward => (<div key={reward.id} className="bg-orange-50 rounded-xl p-5 shadow border border-orange-100 flex items-center justify-between space-grotesk"><div className="flex items-center space-x-3"><span className="text-3xl">{reward.imageUrl}</span><div><p className="font-semibold text-orange-800">{reward.name}</p><p className="text-sm text-orange-600">{reward.cost} Hạt Cacao</p></div></div><button onClick={() => deleteReward(reward.id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors duration-200">Xóa</button></div>))}</div>
      <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-1"><label className="block text-sm font-medium text-orange-700 mb-1 space-grotesk">Tên Quà Tặng</label><input type="text" value={newRewardName} onChange={(e) => setNewRewardName(e.target.value)} placeholder="Ví dụ: Ly Cacao Sữa" className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 space-grotesk" /></div>
        <div className="sm:col-span-1"><label className="block text-sm font-medium text-orange-700 mb-1 space-grotesk">Số Hạt Cacao</label><input type="number" value={newRewardCost} onChange={(e) => setNewRewardCost(e.target.value)} placeholder="100" className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 space-grotesk" /></div>
        <div className="sm:col-span-1"><label className="block text-sm font-medium text-orange-700 mb-1 space-grotesk">Icon (Emoji)</label><input type="text" value={newRewardImage} onChange={(e) => setNewRewardImage(e.target.value)} placeholder="🎁" className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 space-grotesk" /></div>
        <div className="sm:col-span-3"><button onClick={addReward} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md space-grotesk">Thêm Quà Tặng Vào Kho</button></div>
      </div>
    </AdminSectionCard>
  );
};

const SystemOverview = () => {
  const [stats, setStats] = useState({ teachers: 150, students: 1200, totalCacaoBeans: 58000 });
  useEffect(() => { /* Fetch stats */ }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Giáo Viên" value={stats.teachers} icon="👨‍🏫" />
      <StatCard title="Học Sinh" value={stats.students} icon="👩‍🎓" />
      <StatCard title="Tổng Hạt Cacao" value={stats.totalCacaoBeans} icon="🌰" />
    </div>
  );
};

export default AdminDashboard;
