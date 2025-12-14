import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Lock, Share2, X, Copy } from 'lucide-react';

const FROG_STAGES = [
  { stage: 0, image: '/cria tu rana/huevo.png', name: 'Huevo' },
  { stage: 1, image: '/cria tu rana/embriones.png', name: 'Embriones' },
  { stage: 2, image: '/cria tu rana/renacuajo2patas.png', name: 'Renacuajo (2 patas)' },
  { stage: 3, image: '/cria tu rana/renacuajo4patas.png', name: 'Renacuajo (4 patas)' },
  { stage: 4, image: '/cria tu rana/rana.png', name: 'Rana Adulta' },
];

export default function FrogTab() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewingStage, setViewingStage] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    checkFrogStatus();
  }, []);

  useEffect(() => {
    if (profile?.frog_stage !== undefined) {
      setViewingStage(profile.frog_stage);
    }
  }, [profile?.frog_stage]);

  const checkFrogStatus = async () => {
    if (!profile) return;

    try {
      const now = new Date();
      const lastVisit = profile.last_frog_visit ? new Date(profile.last_frog_visit) : null;
      // Default to stage 1 (Embriones) if undefined, simulating 2 days progress
      let newStage = profile.frog_stage ?? 1;

      if (lastVisit) {
        const diffTime = Math.abs(now.getTime() - lastVisit.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Check if it's a different calendar day
        const isSameDay = now.getDate() === lastVisit.getDate() &&
          now.getMonth() === lastVisit.getMonth() &&
          now.getFullYear() === lastVisit.getFullYear();

        if (!isSameDay) {
          if (diffDays === 1 || (diffDays === 0 && !isSameDay)) {
            // Consecutive day (or next calendar day)
            if (newStage < 4) {
              newStage++;
            }
          } else if (diffDays > 1) {
            // Missed a day
            newStage = 0;
          }
        }
      }

      // Update DB if stage changed or to update last_visit
      // Only update if it's a new visit or stage changed
      if (!lastVisit || newStage !== profile.frog_stage) {
        const { error } = await supabase
          .from('profiles')
          .update({
            frog_stage: newStage,
            last_frog_visit: now.toISOString(),
          })
          .eq('id', profile.id);

        if (error) throw error;
        await refreshProfile();
      }

      setViewingStage(newStage);

    } catch (error) {
      console.error('Error updating frog status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const currentStage = FROG_STAGES[viewingStage] || FROG_STAGES[0];
    const text = `¡Mi rana en Jilatanaka Tech ha crecido! Ahora está en la etapa: ${currentStage.name}. ¡Ven a cuidar la tuya! 🐸✨`;
    const url = window.location.origin;

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Enlace copiado al portapapeles');
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <img src="/carga.gif" alt="Cargando..." className="w-24 h-24" />
      </div>
    );
  }

  const currentStageInfo = FROG_STAGES[viewingStage] || FROG_STAGES[0];
  const currentProfileStage = profile?.frog_stage ?? 1;
  const isLocked = viewingStage > currentProfileStage;

  const handlePrev = () => {
    setViewingStage(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setViewingStage(prev => Math.min(4, prev + 1));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-100 to-green-100 p-6 overflow-auto relative">
      <div className="max-w-md mx-auto w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Cria tu Rana</h1>
          <p className="text-gray-600 mb-6">Visítala todos los días para verla crecer.</p>

          <div className="relative mb-6">
            <div className="aspect-square w-full bg-gradient-to-br from-blue-200 to-green-200 rounded-2xl flex items-center justify-center relative overflow-hidden group">
              {isLocked && (
                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center backdrop-blur-sm">
                  <Lock className="w-16 h-16 text-white/80" />
                </div>
              )}

              <img
                src={currentStageInfo.image}
                alt={currentStageInfo.name}
                className={`w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-500 ${!isLocked && 'hover:scale-110'} z-10`}
              />
            </div>

            <button
              onClick={handlePrev}
              disabled={viewingStage === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors z-30"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              disabled={viewingStage === 4}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors z-30"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isLocked ? '???' : currentStageInfo.name}
          </h2>
          <p className="text-gray-500">Etapa {viewingStage + 1} de 5</p>

          <div className="mt-8 flex justify-center space-x-2">
            {FROG_STAGES.map((s) => (
              <div
                key={s.stage}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${s.stage === viewingStage
                  ? 'bg-green-600 scale-125'
                  : s.stage <= currentProfileStage
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>

          {!isLocked && (
            <button
              onClick={() => setShowShareModal(true)}
              className="mt-6 flex items-center justify-center space-x-2 w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Share2 size={20} />
              <span>Compartir Progreso</span>
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Compartir Logro</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-6 text-center border border-green-100">
              <img
                src={currentStageInfo.image}
                alt={currentStageInfo.name}
                className="w-32 h-32 object-contain mx-auto mb-4 drop-shadow-lg"
              />
              <p className="font-bold text-green-800 text-lg mb-1">¡Mi rana está creciendo!</p>
              <p className="text-gray-600">Etapa actual: {currentStageInfo.name}</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Share2 size={20} />
                </div>
                <span className="text-xs font-medium text-gray-600">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600">X</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Share2 size={20} />
                </div>
                <span className="text-xs font-medium text-gray-600">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Copy size={20} />
                </div>
                <span className="text-xs font-medium text-gray-600">Copiar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
