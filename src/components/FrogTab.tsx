import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Info } from 'lucide-react';

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
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkFrogStatus();
    }, []);

    const checkFrogStatus = async () => {
        if (!profile) return;

        try {
            const now = new Date();
            const lastVisit = profile.last_frog_visit ? new Date(profile.last_frog_visit) : null;
            let newStage = profile.frog_stage ?? 0;
            let statusMessage = '';

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
                            statusMessage = '¡Tu rana ha evolucionado!';
                        } else {
                            statusMessage = '¡Tu rana está en su forma final! Sigue cuidándola.';
                        }
                    } else if (diffDays > 1) {
                        // Missed a day
                        newStage = 0;
                        statusMessage = '¡Oh no! No visitaste a tu rana ayer y ha vuelto a ser un huevo.';
                    }
                } else {
                    statusMessage = 'Ya visitaste a tu rana hoy. ¡Vuelve mañana para verla crecer!';
                }
            } else {
                // First visit
                statusMessage = '¡Bienvenido! Aquí comienza la vida de tu rana.';
            }

            // Update DB if stage changed or to update last_visit
            const { error } = await supabase
                .from('profiles')
                .update({
                    frog_stage: newStage,
                    last_frog_visit: now.toISOString(),
                })
                .eq('id', profile.id);

            if (error) throw error;

            setMessage(statusMessage);
            await refreshProfile();
        } catch (error) {
            console.error('Error updating frog status:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    const currentStage = FROG_STAGES[profile?.frog_stage ?? 0] || FROG_STAGES[0];

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-blue-100 to-green-100 p-6 overflow-auto">
            <div className="max-w-md mx-auto w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6 text-center">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">Cria tu Rana</h1>
                    <p className="text-gray-600 mb-6">Visítala todos los días para verla crecer.</p>

                    <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
                        <div className="flex items-start space-x-3">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700 text-left">{message}</p>
                        </div>
                    </div>

                    <div className="aspect-square w-full bg-gradient-to-br from-blue-200 to-green-200 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <img
                            src={currentStage.image}
                            alt={currentStage.name}
                            className="w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-110 z-10"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentStage.name}</h2>
                    <p className="text-gray-500">Etapa {(profile?.frog_stage ?? 0) + 1} de 5</p>

                    <div className="mt-8 flex justify-center space-x-2">
                        {FROG_STAGES.map((s) => (
                            <div
                                key={s.stage}
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${s.stage <= (profile?.frog_stage ?? 0) ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
