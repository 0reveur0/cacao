import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase'; // Corrected import

// Placeholder components (assuming they are defined elsewhere)
const DailyQuests = () => <div>Daily Quests Content</div>;
const CacaoLounge = ({ currentUserRole }) => <div>Cacao Lounge Content</div>;
const UpcomingEvents = () => <div>Upcoming Events Content</div>;
const ChocoQuizLobby = ({ onStartQuiz }) => <div>Choco Quiz Lobby Content</div>;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({ name: 'Học Sinh A', role: 'student', avatar: '👩‍🎓', cacaoBeans: 100 });
  const [activeTab, setActiveTab] = useState('quests');
  const [isQuizActive, setIsQuizActive] = useState(false);

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    console.log('Quiz Started!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const tabs = [
    { id: 'quests', name: 'Hộp Quà Cacao', icon: '🎁' },
    { id: 'lounge', name: 'Cacao Lounge', icon: '💬' },
    { id: 'events', name: 'Sự kiện', icon: '📅' },
    { id: 'quiz', name: 'Choco-Quiz', icon: '🏆' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'quests':
        return <DailyQuests />;
      case 'lounge':
        return <CacaoLounge currentUserRole={userProfile.role} />;
      case 'events':
        return <UpcomingEvents />;
      case 'quiz':
        return isQuizActive ? <div>Bắt đầu làm Quiz!</div> : <ChocoQuizLobby onStartQuiz={handleStartQuiz} />;
      default:
        return <DailyQuests />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-300 font-['Space_Grotesk'] p-8">
      <div className="flex justify-between items-center mb-8 p-5 bg-white/50 rounded-3xl shadow-md backdrop-blur-sm border border-orange-200">
        <h1 className="text-4xl font-bold font-['Kanit'] text-orange-800">
          Bảng Điều Khiển Học Sinh
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 p-3 bg-orange-200 rounded-full shadow">
            <span className="text-2xl">{userProfile.avatar}</span>
            <span className="font-bold text-orange-800">{userProfile.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-4 rounded-2xl shadow-inner transition-all duration-300 font-bold space-grotesk
                ${activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-orange-700 scale-105'
                  : 'bg-white/50 hover:bg-orange-200 text-orange-800 hover:shadow-md'}`}
            >
              <span className="text-2xl mr-3">{tab.icon}</span> {tab.name}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
