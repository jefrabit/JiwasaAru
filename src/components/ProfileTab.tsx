import { useAuth } from '../contexts/AuthContext';
import { Calendar, Award, Heart } from 'lucide-react';

export default function ProfileTab() {
  const { profile, signOut } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="text-gray-600 text-lg">No se encontró información de perfil.</div>
        <button
          onClick={() => signOut()}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  const xpProgress = profile.xp % 100;
  const xpToNextLevel = 100 - xpProgress;

  return (
    <div className="min-h-screen p-8">
      <div className="w-full h-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-green-500">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile.username}
                </h1>
                <div className="flex items-center space-x-2 text-white text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Miembro desde {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Nivel</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">{profile.level}</div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-red-500 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Vidas</span>
                </div>
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(profile?.lives ?? 0)].map((_, i) => (
                    <img
                      key={i}
                      src="/sancallos/sancayoConRelleno.png"
                      alt="Life"
                      className="w-8 h-8 object-contain"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Progreso al Siguiente Nivel
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Nivel {profile.level}</span>
                  <span>Nivel {profile.level + 1}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 text-center">
                  {xpToNextLevel} XP para el siguiente nivel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
