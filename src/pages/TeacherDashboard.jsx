import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabase'; // Make sure supabase client is correctly imported

// Placeholder components for future sections
const UpcomingEvents = () => <div>Sự kiện sắp tới</div>;
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
      likes: 7,
      comments: 1,
      liked: false,
    },
  ]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTopic, setNewPostTopic] = useState('discussion');
  const postsEndRef = useRef(null);

  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  const addPost = () => {
    if (newPostContent.trim() === '') return;
    const newPost = {
      id: posts.length + 1,
      author: 'Bạn', // This should be dynamically set to the logged-in user
      role: currentUserRole,
      avatar: currentUserRole === 'teacher' ? '👨‍🏫' : '👩‍🎓',
      content: newPostContent,
      topic: newPostTopic,
      timestamp: 'Ngay bây giờ',
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostTopic('discussion');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  return (
    <div className="bg-gradient-to-b from-orange-100 to-white p-6 rounded-3xl shadow-lg border border-orange-300">
      <h3 className="text-3xl font-bold mb-5 text-center font-['Kanit'] text-orange-800">Cacao Lounge</h3>
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-white rounded-xl border border-orange-200 space-y-4">
        {posts.map(post => (
          <div key={post.id} className="p-4 rounded-xl border border-orange-200 bg-orange-50 shadow hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3 p-2 bg-orange-300 rounded-full">{post.avatar}</span>
              <div>
                <p className="font-bold text-orange-800">{post.author}</p>
                <p className="text-xs text-orange-600">{post.role.charAt(0).toUpperCase() + post.role.slice(1)} - {post.timestamp}</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 space-grotesk mb-3">{post.content}</p>
            <div className="flex justify-between items-center text-sm">
              <button onClick={() => handleLike(post.id)} className={`font-semibold ${post.liked ? 'text-red-500' : 'text-orange-600'} hover:text-red-600 transition-colors duration-200`}>
                {post.liked ? 'Unlike' : 'Like'} ({post.likes})
              </button>
              <span className="text-orange-700">💬 {post.comments} Comments</span>
            </div>
          </div>
        ))}
        <div ref={postsEndRef} />
      </div>
      <div className="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-xl border border-orange-200">
        <div className="flex-grow flex items-center gap-3">
          <span className="text-2xl p-2 bg-orange-300 rounded-full">{currentUserRole === 'teacher' ? '👨‍🏫' : '👩‍🎓'}</span>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Chia sẻ suy nghĩ của bạn..."
            className="flex-grow p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none space-grotesk"
            rows="3"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <select
            value={newPostTopic}
            onChange={(e) => setNewPostTopic(e.target.value)}
            className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-orange-800 space-grotesk"
          >
            <option value="discussion">Thảo luận</option>
            <option value="homework">Bài tập</option>
            <option value="question">Câu hỏi</option>
            <option value="fun">Vui vẻ</option>
          </select>
          <button
            onClick={addPost}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg space-grotesk"
          >
            Đăng bài
          </button>
        </div>
      </div>
    </div>
  );
};

// Daily Quests Component (for StudentDashboard)
const DailyQuests = () => {
  const [quests, setQuests] = useState([
    { id: 1, task: 'Đọc 1 bài viết trong Cacao Lounge', progress: 0, target: 1, completed: false, claimed: false },
    { id: 2, task: 'Hoàn thành bài tập về nhà', progress: 0, target: 1, completed: false, claimed: false },
    { id: 3, task: 'Xem trước bài giảng mới', progress: 0, target: 1, completed: false, claimed: false },
    { id: 4, task: 'Giúp 1 bạn giải bài', progress: 0, target: 1, completed: false, claimed: false },
  ]);
  const [cacaoBeans, setCacaoBeans] = useState(parseInt(localStorage.getItem('cacaoBeans'), 10) || 100);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    localStorage.setItem('cacaoBeans', cacaoBeans);
  }, [cacaoBeans]);

  const updateQuestProgress = (questId, increment = 1) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId && !quest.completed && !quest.claimed
          ? { ...quest, progress: Math.min(quest.progress + increment, quest.target), completed: quest.progress + increment >= quest.target }
          : quest
      )
    );
  };

  const claimReward = (questId) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId && quest.completed && !quest.claimed
          ? { ...quest, claimed: true } // Mark as claimed, visually disabled
          : quest
      )
    );
    setCacaoBeans(prevBeans => prevBeans + 50); // Add reward
    setShowEffect(true);
    setTimeout(() => setShowEffect(false), 1500); // Effect duration
  };

  // Simulate quest completion progress - replace with actual logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Only update quests that are not completed or claimed
      if (quests.some(q => !q.completed && !q.claimed)) {
        setQuests(prevQuests =>
          prevQuests.map(quest => {
            if (quest.completed || quest.claimed) return quest;
            // Simulate progress for demo purposes
            const newProgress = Math.min(quest.progress + Math.random() * 0.5, quest.target);
            return { ...quest, progress: newProgress, completed: newProgress >= quest.target };
          })
        );
      }
    }, 5000); // Update progress every 5 seconds
    return () => clearInterval(interval);
  }, [quests]); // Depend on quests to re-evaluate the condition

  return (
    <div className="bg-gradient-to-b from-orange-100 to-white p-6 rounded-3xl shadow-lg border border-orange-300">
      <h3 className="text-3xl font-bold mb-5 text-center font-['Kanit'] text-orange-800">
        <span className="relative inline-block">
          Hộp Quà Cacao 🎁
          {showEffect && (
            <span className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
              ✨
            </span>
          )}
        </span>
      </h3>
      <div className="space-y-4">
        {quests.map(quest => (
          <div key={quest.id} className={`bg-white p-4 rounded-2xl shadow border border-orange-200 flex items-center justify-between space-grotesk ${quest.claimed ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex-grow mr-4">
              <p className={`text-lg font-semibold text-orange-800 mb-1 ${quest.completed ? 'line-through text-orange-500' : ''}`}>
                {quest.task}
              </p>
              <div className="w-full bg-orange-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${quest.completed ? 'bg-green-500' : 'bg-orange-500'}`}
                  style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => claimReward(quest.id)}
              disabled={!quest.completed || quest.claimed}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-md 
                ${quest.completed && !quest.claimed ? 'bg-yellow-500 hover:bg-yellow-600 text-orange-900' 
                                                    : 'bg-orange-400 text-orange-700 cursor-not-allowed'}`}
            >
              {quest.claimed ? 'Đã nhận' : 'Nhận thưởng'}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-xl font-bold text-orange-800 space-grotesk">
          Số Hạt Cacao:
          <span className="text-orange-600 ml-2 animate-pulse">
            {cacaoBeans} 🌰
          </span>
        </p>
      </div>
    </div>
  );
};

// Choco-Quiz Lobby Component (for both dashboards)
const ChocoQuizLobby = ({ onStartQuiz }) => {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Bạn', avatar: '👩‍💻' }, // Changed avatar for variety
    { id: 2, name: 'Minh Anh', avatar: '👨‍💻' },
    { id: 3, name: 'Thùy Linh', avatar: '👩‍💻' },
    { id: 4, name: 'Quang Huy', avatar: '👨‍💻' },
    { id: 5, name: 'Gia Bảo', avatar: '👨‍💻' },
    { id: 6, name: 'Tú Quyên', avatar: '👩‍💻' },
  ]);
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown

  useEffect(() => {
    if (countdown <= 0) {
      onStartQuiz(); // Trigger quiz start when countdown finishes
      return;
    }
    const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timerId); // Cleanup timer
  }, [countdown, onStartQuiz]);

  return (
    <div className="bg-gradient-to-br from-pink-400 to-orange-600 p-8 rounded-3xl shadow-xl border-2 border-orange-400 text-white">
      <h3 className="text-4xl font-bold mb-6 text-center font-['Kanit'] text-white tracking-wide">
        Đấu Trường Choco-Quiz 🏆
      </h3>
      <div className="text-center mb-8">
        <p className="text-6xl font-bold text-white animate-pulse countdown-text">{countdown}</p>
        <p className="text-lg text-white/90 font-semibold space-grotesk">Trận đấu sắp bắt đầu!</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {players.map(player => (
          <div key={player.id} className="flex flex-col items-center p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-orange-300 shadow">
            <span className="text-4xl mb-2">{player.avatar}</span>
            <p className="font-bold text-lg space-grotesk text-white/90">{player.name}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button
          onClick={onStartQuiz}
          className="px-8 py-4 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 space-grotesk border-2 border-white"
        >
          Bắt đầu ngay!
        </button>
      </div>
    </div>
  );
};

// Lesson Creation Area Component (for TeacherDashboard)
const LessonCreationArea = () => {
  const [lessonRecipes, setLessonRecipes] = useState([
    { id: 1, title: 'Công thức: Phân tích đa thức thành nhân tử', materials: ['Slide_Factoring.pdf', 'video_intro.mp4'], quizzes: 3 },
    { id: 2, title: 'Công thức: Phương trình bậc hai', materials: ['Notes_Quadratic.docx'], quizzes: 5 },
  ]);
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [materialFiles, setMaterialFiles] = useState([]);
  const [quizCount, setQuizCount] = useState(0);

  const addMaterialFile = (e) => {
    // In a real app, handle file upload and store file info
    if (e.target.files.length > 0) {
      setMaterialFiles([...materialFiles, e.target.files[0].name]);
    }
  };

  const createLessonRecipe = () => {
    if (newRecipeTitle.trim() === '') return;
    const newRecipe = {
      id: lessonRecipes.length + 1,
      title: newRecipeTitle,
      materials: materialFiles,
      quizzes: quizCount,
    };
    setLessonRecipes([newRecipe, ...lessonRecipes]);
    // Reset form
    setNewRecipeTitle('');
    setMaterialFiles([]);
    setQuizCount(0);
  };

  const addQuizToRecipe = (recipeId) => {
    // Logic to add a quiz to an existing recipe
    console.log(`Adding quiz to recipe ${recipeId}`);
    setLessonRecipes(prev => prev.map(recipe => recipe.id === recipeId ? { ...recipe, quizzes: recipe.quizzes + 1 } : recipe));
  };

  return (
    <div className="bg-gradient-to-b from-brown-100 to-white p-6 rounded-3xl shadow-lg border border-brown-300">
      <h3 className="text-3xl font-bold mb-5 text-center font-['Kanit'] text-brown-800">
        Xưởng Chế Biến Bài Giảng 🍳
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create New Recipe */}
        <div className="bg-white p-5 rounded-xl shadow border border-brown-200">
          <h4 className="text-xl font-bold mb-4 text-brown-700 font-['Kanit']">Tạo Công Thức Mới</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tên công thức bài giảng..."
              value={newRecipeTitle}
              onChange={(e) => setNewRecipeTitle(e.target.value)}
              className="w-full p-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500 space-grotesk"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 space-grotesk">Tài liệu đính kèm</label>
              <div className="flex items-center gap-2">
                <input type="file" onChange={addMaterialFile} className="hidden" id="material-upload" />
                <label htmlFor="material-upload" className="cursor-pointer px-4 py-2 bg-brown-500 hover:bg-brown-600 text-white rounded-lg shadow space-grotesk">
                  Chọn File
                </label>
                <span className="text-sm text-brown-700 space-grotesk">
                  {materialFiles.length > 0 ? `${materialFiles.length} file đã chọn` : 'Chưa có file nào'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="quiz-count" className="block text-sm font-medium text-gray-700 space-grotesk">Số lượng Quiz</label>
                <input
                    type="number"
                    id="quiz-count"
                    value={quizCount}
                    onChange={(e) => setQuizCount(parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className="w-20 p-2 border border-brown-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-brown-500 space-grotesk"
                />
            </div>
            <button
              onClick={createLessonRecipe}
              className="w-full bg-brown-600 hover:bg-brown-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md space-grotesk"
            >
              Tạo Công Thức
            </button>
          </div>
        </div>

        {/* Existing Recipes List */}
        <div className="space-y-4">
          {lessonRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white p-5 rounded-xl shadow border border-brown-200 hover:shadow-lg transition-shadow duration-200">
              <h4 className="text-xl font-bold mb-3 text-brown-700 font-['Kanit']">{recipe.title}</h4>
              <p className="text-sm text-brown-600 mb-2 space-grotesk">Tài liệu: {recipe.materials.join(', ')}</p>
              <div className="flex justify-between items-center">
                <span className="text-md font-semibold text-brown-800 space-grotesk">Quiz: {recipe.quizzes}</span>
                <div className="flex space-x-2">
                  <button onClick={() => addQuizToRecipe(recipe.id)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm space-grotesk">
                    + Thêm Quiz
                  </button>
                  <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm space-grotesk">
                    Xem Bài
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// TeacherDashboard Component
const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({ name: 'Giáo Viên A', role: 'teacher', avatar: '👨‍🏫' });
  const [activeTab, setActiveTab] = useState('creation'); // Default active tab
  const [isQuizActive, setIsQuizActive] = useState(false);

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    // In a real app, navigate to a quiz screen or load quiz questions
    console.log('Quiz Started!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole'); // Clear role as well
    navigate('/login');
  };

  // Dummy data for tabs/menu - replace with actual data fetching if needed
  const tabs = [
    { id: 'creation', name: 'Xưởng Bài Giảng', icon: '🍳' },
    { id: 'lounge', name: 'Cacao Lounge', icon: '💬' },
    { id: 'events', name: 'Sự kiện', icon: '📅' },
    { id: 'quiz', name: 'Choco-Quiz', icon: '🏆' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'creation':
        return <LessonCreationArea />;
      case 'lounge':
        return <CacaoLounge currentUserRole={userProfile.role} />;
      case 'events':
        return <UpcomingEvents />;
      case 'quiz':
        return isQuizActive ? <div>Bắt đầu làm Quiz!</div> : <ChocoQuizLobby onStartQuiz={handleStartQuiz} />;
      default:
        return <LessonCreationArea />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-300 font-['Space_Grotesk'] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 p-5 bg-white/50 rounded-3xl shadow-md backdrop-blur-sm border border-orange-200">
        <h1 className="text-4xl font-bold font-['Kanit'] text-orange-800">
          Bảng Điều Khiển Giáo Viên
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabs/Menu Navigation */}
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

        {/* Content Area */}
        <div className="lg:col-span-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
