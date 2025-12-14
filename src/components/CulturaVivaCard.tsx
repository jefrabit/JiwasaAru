import { X } from 'lucide-react';

interface CulturaVivaCardProps {
    onClose: () => void;
}



export default function CulturaVivaCard({ onClose }: CulturaVivaCardProps) {
    return (
        <div className="absolute bottom-4 left-4 z-[1000] w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-yellow-400 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-yellow-400 p-3 flex justify-between items-center">
                <h3 className="font-bold text-yellow-900 text-sm">DESAGUADERO</h3>
                <button onClick={onClose} className="text-yellow-900 hover:bg-yellow-500/20 rounded-full p-1">
                    <X size={16} />
                </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="rounded-xl overflow-hidden mb-4 h-40 w-full shadow-md">
                    <img
                        src="/desaguadero-teck/desaguadero.jpg"
                        alt="Desaguadero"
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    Desaguadero es el corazón vivo de la nación aimara, donde la frontera política se borra ante una herencia ancestral compartida por Perú y Bolivia. Antiguo paso incaico, su identidad cultural brilla en la fastuosa devoción a la Virgen de la Natividad y en una profunda espiritualidad andina que convive diariamente con el comercio.
                </p>

                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
                        <div className="flex items-start gap-2">
                            <span className="text-base"></span>
                            <div>
                                <span className="font-bold text-gray-800 text-xs block mb-1">Festividad de la Virgen de la Natividad (Patrona)</span>
                                <span className="text-xs text-gray-600 block mb-2">(Septiembre, alrededor del 8)</span>
                                <p className="text-xs text-gray-600 mb-2">
                                    Se celebra con misas, procesiones, bandas de música y concursos de danzas como la Diablada y Caporales.
                                </p>
                                <div className="rounded-lg overflow-hidden h-32 w-full">
                                    <img
                                        src="/desaguadero-teck/virgen natividad desaguadero.jpg"
                                        alt="Virgen de la Natividad"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
                        <div className="flex items-start gap-2">
                            <span className="text-base"></span>
                            <div>
                                <span className="font-bold text-gray-800 text-xs block mb-1">Procesión del Señor de los Milagros</span>
                                <span className="text-xs text-gray-600 block mb-2">(Octubre)</span>
                                <div className="rounded-lg overflow-hidden h-32 w-full">
                                    <img
                                        src="/desaguadero-teck/señor de los milagros desaguadero.jpg"
                                        alt="Señor de los Milagros"
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
