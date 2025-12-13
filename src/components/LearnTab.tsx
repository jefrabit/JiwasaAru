import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Lesson, UserProgress } from '../lib/supabase';
import { Heart, Star, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function LearnTab() {
  const { profile, refreshProfile } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index');

      if (lessonsError) throw lessonsError;

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*');

      if (progressError) throw progressError;

      setLessons(lessonsData || []);
      setProgress(progressData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = async (lesson: Lesson) => {
    if (!profile) return;

    if (profile.lives <= 0) {
      alert('¡No tienes vidas! Espera a que se recuperen.');
      return;
    }

    const lessonProgress = progress.find((p) => p.lesson_id === lesson.id);
    const isCompleted = lessonProgress?.completed || false;

    if (isCompleted) {
      alert('¡Ya completaste esta lección!');
      return;
    }

    const earnedStars = Math.floor(Math.random() * 3) + 1;
    const success = Math.random() > 0.3;

    if (success) {
      const newXp = profile.xp + lesson.xp_reward;
      const newLevel = Math.floor(newXp / 100) + 1;

      await supabase
        .from('profiles')
        .update({ xp: newXp, level: newLevel })
        .eq('id', profile.id);

      if (lessonProgress) {
        await supabase
          .from('user_progress')
          .update({
            completed: true,
            stars: earnedStars,
            completed_at: new Date().toISOString(),
          })
          .eq('id', lessonProgress.id);
      } else {
        await supabase.from('user_progress').insert({
          user_id: profile.id,
          lesson_id: lesson.id,
          completed: true,
          stars: earnedStars,
          completed_at: new Date().toISOString(),
        });
      }

      alert(`¡Excelente! Ganaste ${earnedStars} estrellas y ${lesson.xp_reward} XP`);
      await refreshProfile();
      await fetchData();
    } else {
      const newLives = Math.max(0, profile.lives - 1);
      await supabase
        .from('profiles')
        .update({ lives: newLives })
        .eq('id', profile.id);

      alert('¡Intenta de nuevo! Perdiste una vida.');
      await refreshProfile();
    }
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    if (lesson.order_index === 1) return true;

    const previousLesson = lessons.find(
      (l) => l.order_index === lesson.order_index - 1
    );
    if (!previousLesson) return false;

    const previousProgress = progress.find(
      (p) => p.lesson_id === previousLesson.id
    );
    return previousProgress?.completed || false;
  };

  const getLessonIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[
      iconName.charAt(0).toUpperCase() + iconName.slice(1)
    ] as React.ComponentType<any>;
    return Icon || LucideIcons.BookOpen;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-8">
      <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center space-x-3">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <span className="text-2xl font-bold text-gray-800">{profile?.lives || 0}</span>
      </div>

      <div className="max-w-4xl mx-auto pt-20">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Tu Camino de Aprendizaje
        </h2>

        <div className="space-y-6">
          {lessons.map((lesson, index) => {
            const lessonProgress = progress.find((p) => p.lesson_id === lesson.id);
            const isUnlocked = isLessonUnlocked(lesson);
            const isCompleted = lessonProgress?.completed || false;
            const Icon = getLessonIcon(lesson.icon);

            return (
              <div
                key={lesson.id}
                className={`flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <button
                  onClick={() => isUnlocked && handleLessonClick(lesson)}
                  disabled={!isUnlocked}
                  className={`relative group ${
                    !isUnlocked ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <div
                    className={`w-24 h-24 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                        : isUnlocked
                        ? `bg-gradient-to-br from-${lesson.color}-400 to-${lesson.color}-600 hover:scale-110`
                        : 'bg-gray-400'
                    }`}
                  >
                    {isUnlocked ? (
                      <Icon className="w-12 h-12 text-white" />
                    ) : (
                      <Lock className="w-12 h-12 text-white" />
                    )}
                  </div>

                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                      <div className="flex space-x-1">
                        {[...Array(lessonProgress?.stars || 0)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64">
                    <h3 className="font-bold text-gray-800 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                    <div className="text-xs text-gray-500">
                      Recompensa: {lesson.xp_reward} XP
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
