import React, { useState, useEffect } from 'react';
import { Star, Trophy, Target, Brain, Zap, Heart, Sparkles, BookOpen, Dumbbell, PenTool, Coffee, Award, TrendingUp } from 'lucide-react';
import { User, DailyQuest, Reward, Stats, Streaks, TierColors } from './types';

const App = () => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('lifeManagerUser');
    return savedUser ? JSON.parse(savedUser) : {
      name: '플레이어',
      level: 1,
      experience: 0,
      experienceToNext: 100,
      tier: 'Bronze',
      stats: {
        intelligence: 12,
        willpower: 8,
        stamina: 10,
        charm: 7
      },
      titles: [],
      streaks: {
        diary: 0,
        exercise: 0,
        reading: 0,
        study: 0
      }
    };
  });

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    const savedQuests = localStorage.getItem('lifeManagerDailyQuests');
    if (savedQuests) {
      return JSON.parse(savedQuests);
    }
    return [
      { id: 1, title: '일기 쓰기', description: '오늘 하루를 한 줄로 기록하기', completed: false, xp: 15, stat: 'charm', iconName: 'PenTool', isAuthenticating: false, isAuthenticated: false, authXpReceived: false },
    { id: 2, title: '10분 독서', description: '책을 읽고 새로운 지식 습득하기', completed: false, xp: 20, stat: 'intelligence', iconName: 'BookOpen', isAuthenticating: false, isAuthenticated: false, authXpReceived: false },
    { id: 3, title: '운동 5분', description: '푸쉬업이나 간단한 운동하기', completed: false, xp: 25, stat: 'stamina', iconName: 'Dumbbell', isAuthenticating: false, isAuthenticated: false, authXpReceived: false },
    { id: 4, title: '새로운 것 배우기', description: '오늘의 퀴즈나 새로운 기술 익히기', completed: false, xp: 30, stat: 'intelligence', iconName: 'Brain', isAuthenticating: false, isAuthenticated: false, authXpReceived: false },
    { id: 5, title: '명상/휴식', description: '5분간 명상하거나 깊은 호흡하기', completed: false, xp: 18, stat: 'willpower', iconName: 'Coffee', isAuthenticating: false, isAuthenticated: false, authXpReceived: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('lifeManagerDailyQuests', JSON.stringify(dailyQuests));
  }, [dailyQuests]);

  useEffect(() => {
    localStorage.setItem('lifeManagerUser', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lifeManagerUser', JSON.stringify(user));
  }, [user]);

  const [showReward, setShowReward] = useState<Reward | null>(null);
  const [currentTab, setCurrentTab] = useState('quests');
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [currentAuthQuestId, setCurrentAuthQuestId] = useState<number | null>(null);

  const tierColors: TierColors = {
    Bronze: 'from-amber-600 to-amber-800',
    Silver: 'from-gray-400 to-gray-600',
    Gold: 'from-yellow-400 to-yellow-600',
    Platinum: 'from-cyan-400 to-cyan-600',
    Diamond: 'from-blue-400 to-blue-600',
    Master: 'from-purple-400 to-purple-600'
  };

  const iconMap: { [key: string]: React.ElementType } = {
    PenTool,
    BookOpen,
    Dumbbell,
    Brain,
    Coffee,
    Trophy,
    Target,
    Zap,
    Heart,
    Sparkles,
    Award,
    TrendingUp,
    Star
  };

  const completeQuest = (questId: number) => {
    const quest = dailyQuests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      // 퀘스트 완료 처리
      setDailyQuests(prev => prev.map(q => 
        q.id === questId ? { ...q, completed: true, isAuthenticating: false, isAuthenticated: true } : q
      ));

      // 사용자 스탯 업데이트
      setUser(prev => {
        const newStats: Stats = { ...prev.stats };
        newStats[quest.stat] += Math.floor(Math.random() * 3) + 1;
        
        let newExperience = prev.experience + quest.xp;
        let newLevel = prev.level;
        let newExperienceToNext = prev.experienceToNext;
        
        // 레벨업 체크
        if (newExperience >= prev.experienceToNext) {
          newLevel += 1;
          newExperienceToNext = newLevel * 100;
        }

        // 스트릭 업데이트
        const newStreaks: Streaks = { ...prev.streaks };
        if (quest.title.includes('일기')) newStreaks.diary += 1;
        if (quest.title.includes('운동')) newStreaks.exercise += 1;
        if (quest.title.includes('독서')) newStreaks.reading += 1;
        if (quest.title.includes('배우기')) newStreaks.study += 1;

        return {
          ...prev,
          stats: newStats,
          experience: newExperience,
          level: newLevel,
          experienceToNext: newExperienceToNext,
          streaks: newStreaks
        };
      });

      // 보상 애니메이션
      setShowReward({
        type: 'quest',
        title: quest.title,
        xp: quest.xp,
        stat: quest.stat
      });

      setTimeout(() => setShowReward(null), 1000);
    }
  };

  const handleAuthenticateClick = (questId: number) => {
    setCurrentAuthQuestId(questId);
    setShowAuthOptions(true);
  };

  const handleAuthOptionSelect = (option: 'sns' | 'file', snsType?: string, fileType?: 'mobile' | 'pc') => {
    if (currentAuthQuestId === null) return;

    setShowAuthOptions(false);
    setDailyQuests(prev => prev.map(q =>
      q.id === currentAuthQuestId ? { ...q, isAuthenticating: true } : q
    ));

    // Simulate authentication process
    setTimeout(() => {
      setDailyQuests(prev => prev.map(q =>
        q.id === currentAuthQuestId ? { ...q, isAuthenticating: false, isAuthenticated: true } : q
      ));
      // Optionally, provide initial XP for authentication submission
      setUser(prev => ({
        ...prev,
        experience: prev.experience + 5, // Small XP for submission
        experienceToNext: prev.experienceToNext // Keep same for now
      }));
      alert(`퀘스트 ${currentAuthQuestId} 인증 제출 완료!`);
      setShowAuthOptions(false); // 인증 시뮬레이션 완료 후 모달 닫기
    }, 2000); // 2초 후 인증 완료 시뮬레이션
  };

  const handleAuthComplete = (questId: number) => {
    setDailyQuests(prev => prev.map(q =>
      q.id === questId ? { ...q, authXpReceived: true } : q
    ));
    setUser(prev => ({
      ...prev,
      experience: prev.experience + 10, // Additional XP for final authentication
      experienceToNext: prev.experienceToNext // Keep same for now
    }));
    alert(`퀘스트 ${questId} 인증 완료 XP 수령!`);
  };

  const getStatColor = (stat: keyof Stats) => {
    const colors: { [key in keyof Stats]: string } = {
      intelligence: 'text-blue-500',
      willpower: 'text-purple-500',
      stamina: 'text-green-500',
      charm: 'text-pink-500'
    };
    return colors[stat] || 'text-gray-500';
  };

  const getStatIcon = (stat: keyof Stats) => {
    const icons: { [key in keyof Stats]: React.ElementType } = {
      intelligence: Brain,
      willpower: Zap,
      stamina: Heart,
      charm: Sparkles
    };
    return icons[stat] || Target;
  };

  const completedQuests = dailyQuests.filter(q => q.completed).length;
  const totalQuests = dailyQuests.length;
  const progressPercentage = (completedQuests / totalQuests) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* 상단 헤더 */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-300">Level {user.level} • {user.tier}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">EXP</div>
            <div className="text-lg font-bold">{user.experience}/{user.experienceToNext}</div>
          </div>
        </div>
        
        {/* 경험치 바 */}
        <div className="mt-3 bg-black/30 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(user.experience / user.experienceToNext) * 100}%` }}
          />
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex bg-black/20 backdrop-blur-sm border-b border-white/10">
        <button
          onClick={() => setCurrentTab('quests')}
          className={`flex-1 py-3 px-4 text-center ${currentTab === 'quests' ? 'border-b-2 border-yellow-400' : ''}`}
        >
          오늘의 퀘스트
        </button>
        <button
          onClick={() => setCurrentTab('stats')}
          className={`flex-1 py-3 px-4 text-center ${currentTab === 'stats' ? 'border-b-2 border-yellow-400' : ''}`}
        >
          능력치
        </button>
        <button
          onClick={() => setCurrentTab('progress')}
          className={`flex-1 py-3 px-4 text-center ${currentTab === 'progress' ? 'border-b-2 border-yellow-400' : ''}`}
        >
          성장 기록
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-4">
        {currentTab === 'quests' && (
          <div className="space-y-4">
            {/* 일일 진행도 */}
            <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">오늘의 진행도</h3>
                <span className="text-sm text-gray-300">{completedQuests}/{totalQuests}</span>
              </div>
              <div className="bg-black/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-300 mt-2">
                {completedQuests === totalQuests ? '🎉 모든 퀘스트 완료!' : `${totalQuests - completedQuests}개 남음`}
              </p>
            </div>

            {/* 퀘스트 목록 */}
            <div className="space-y-3">
              {dailyQuests.map((quest) => {
                const IconComponent = iconMap[quest.iconName];
                return (
                  <div
                    key={quest.id}
                    className={`bg-black/30 rounded-xl p-4 backdrop-blur-sm border ${
                      quest.completed 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : 'border-white/10 hover:border-white/20'
                    } transition-all duration-300`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        quest.completed ? 'bg-green-500' : 'bg-white/10'
                      }`}>
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{quest.title}</h4>
                        <p className="text-sm text-gray-300">{quest.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            +{quest.xp} XP
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatColor(quest.stat)} bg-current/20`}>
                            {quest.stat}
                          </span>
                        </div>
                      </div>
                      {!quest.completed && (
                        <button
                          onClick={() => completeQuest(quest.id)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          완료
                        </button>
                      )}
                      {quest.completed && !quest.isAuthenticated && (
                        <button
                          onClick={() => handleAuthenticateClick(quest.id)}
                          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          인증하기
                        </button>
                      )}
                      {quest.completed && quest.isAuthenticating && (
                        <div className="text-yellow-400 font-bold">인증 중...</div>
                      )}
                      {quest.completed && quest.isAuthenticated && !quest.authXpReceived && (
                        <button
                          onClick={() => handleAuthComplete(quest.id)}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 animate-pulse"
                        >
                          인증 완료! (XP 수령)
                        </button>
                      )}
                      {quest.completed && quest.isAuthenticated && quest.authXpReceived && (
                        <div className="text-green-400 font-bold">인증 완료 ✓</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentTab === 'stats' && (
          <div className="space-y-4">
            {/* 티어 표시 */}
            <div className={`bg-gradient-to-r ${tierColors[user.tier]} rounded-xl p-4 text-center`}>
              <Award className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-xl font-bold">{user.tier} Tier</h3>
              <p className="text-sm opacity-90">꾸준한 성장으로 티어를 올려보세요!</p>
            </div>

            {/* 능력치 */}
            <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4">능력치</h3>
              <div className="space-y-3">
                {Object.entries(user.stats).map(([stat, value]) => {
                  const IconComponent = getStatIcon(stat as keyof Stats);
                  const statNames: { [key in keyof Stats]: string } = {
                    intelligence: '지능',
                    willpower: '의지력',
                    stamina: '체력',
                    charm: '매력'
                  };
                  return (
                    <div key={stat} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-current/20 ${getStatColor(stat as keyof Stats)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{statNames[stat as keyof Stats]}</span>
                          <span className="font-bold">{value}</span>
                        </div>
                        <div className="bg-black/30 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getStatColor(stat as keyof Stats).replace('text-', 'bg-')}`}
                            style={{ width: `${Math.min(value * 2, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 연속 기록 */}
            <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4">연속 기록</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(user.streaks).map(([type, count]) => {
                  const streakNames: { [key in keyof Streaks]: string } = {
                    diary: '일기 쓰기',
                    exercise: '운동',
                    reading: '독서',
                    study: '공부'
                  };
                  return (
                    <div key={type} className="bg-black/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-400">{count}</div>
                      <div className="text-sm text-gray-300">{streakNames[type as keyof Streaks]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'progress' && (
          <div className="space-y-4">
            {/* 성장 차트 */}
            <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4">성장 그래프</h3>
              <div className="h-40 bg-black/30 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <p>성장 데이터가 쌓이면 여기에 표시됩니다</p>
                </div>
              </div>
            </div>

            {/* 획득한 칭호 */}
            <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4">획득한 칭호</h3>
              <div className="text-center text-gray-400 py-8">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <p>첫 번째 칭호를 획득해보세요!</p>
                <p className="text-sm">7일 연속 퀘스트 완료 시 '끈기의 전사' 칭호 획득</p>
              </div>
            </div>

            {/* AI 코치 피드백 */}
            <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4">AI 코치 피드백</h3>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                <p className="text-sm">
                  🤖 "<span className="font-medium">훌륭한 시작이에요!</span> 꾸준히 퀘스트를 완료하면서 
                  균형 잡힌 성장을 보여주고 있습니다. 특히 {Object.entries(user.stats).sort((a, b) => b[1] - a[1])[0][0]} 
                  능력치가 눈에 띄게 향상되었네요!"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 보상 애니메이션 */}
      {showReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-center transform animate-pulse">
            <Star className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-bold text-white mb-2">퀘스트 완료!</h3>
            <p className="text-white/90">"{showReward.title}"</p>
            <p className="text-white/90 mt-2">+{showReward.xp} XP 획득</p>
            <p className="text-white/90">{showReward.stat} 능력치 상승!</p>
          </div>
        </div>
      )}

      {showAuthOptions && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">인증 방식 선택</h3>
            <div className="space-y-4">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
                onClick={() => handleAuthOptionSelect('sns')}
              >
                SNS 연동
              </button>
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
                onClick={() => handleAuthOptionSelect('file')}
              >
                내 파일 선택
              </button>
              <button
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
                onClick={() => setShowAuthOptions(false)}
              >
                취소
              </button>
            </div>

            {/* SNS 선택지 (간단한 시뮬레이션) */}
            {currentAuthQuestId && (
              <div className="mt-6 space-y-3">
                <h4 className="text-xl font-bold text-white mb-3">SNS 선택</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md" onClick={() => { handleAuthOptionSelect('sns', 'facebook'); }}>페이스북</button>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md" onClick={() => { handleAuthOptionSelect('sns', 'instagram'); }}>인스타</button>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md" onClick={() => { handleAuthOptionSelect('sns', 'threads'); }}>스레드</button>
                  <button className="bg-black hover:bg-gray-800 text-white py-2 rounded-md" onClick={() => { handleAuthOptionSelect('sns', 'x'); }}>X</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-md" onClick={() => { handleAuthOptionSelect('sns', 'youtube'); }}>유튜브</button>
                </div>
                <h4 className="text-xl font-bold text-white mt-6 mb-3">파일 선택</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md" onClick={() => { handleAuthOptionSelect('file', undefined, 'mobile'); }}>모바일</button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md" onClick={() => { handleAuthOptionSelect('file', undefined, 'pc'); }}>PC</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;