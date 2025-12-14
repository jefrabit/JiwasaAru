import { X } from 'lucide-react';

interface YunguyoCardProps {
    onClose: () => void;
}

export default function YunguyoCard({ onClose }: YunguyoCardProps) {
    return (
        <div className="absolute bottom-4 left-4 z-[1000] w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-400 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-purple-400 p-3 flex justify-between items-center">
                <h3 className="font-bold text-purple-900 text-sm">YUNGUYO, Encanto al Sur del Titicaca</h3>
                <button onClick={onClose} className="text-purple-900 hover:bg-purple-500/20 rounded-full p-1">
                    <X size={16} />
                </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="rounded-xl overflow-hidden mb-4 h-40 w-full shadow-md">
                    <img
                        src="/yunguyo-teck/yunguyo.jpg"
                        alt="Yunguyo"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
                        <div className="flex items-start gap-2">
                            <span className="text-base">🎉</span>
                            <div>
                                <span className="font-bold text-gray-800 text-xs block mb-1">Fiesta de San Francisco de Borja ("Tata Pancho")</span>
                                <span className="text-xs text-gray-600 block mb-2">(10 de octubre)</span>
                                <p className="text-xs text-gray-600 mb-2">
                                    Es su fiesta patronal principal, declarada Patrimonio Cultural de la Nación, con una gran concentración de sikuris y danzas folclóricas.
                                </p>
                                <div className="rounded-lg overflow-hidden h-32 w-full">
                                    <img
                                        src="/yunguyo-teck/tata pancho yunguyo.jpg"
                                        alt="Tata Pancho"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
                        <div className="flex items-start gap-2">
                            <span className="text-base">☀️</span>
                            <div>
                                <span className="font-bold text-gray-800 text-xs block mb-1">Año Nuevo Aymara</span>
                                <span className="text-xs text-gray-600 block mb-2">(21 de junio)</span>
                                <div className="rounded-lg overflow-hidden h-32 w-full">
                                    <img
                                        src="/yunguyo-teck/año nuevo aymara yunguyo.jpg"
                                        alt="Año Nuevo Aymara"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
