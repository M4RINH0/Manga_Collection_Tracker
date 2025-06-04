
import { X, Calendar, Check, Bookmark } from "lucide-react";
import { useEffect } from "react";

interface Volume {
  id: number;
  number: number;
  title: string;
  owned: boolean;
  coverUrl: string;
  description: string;
  releaseDate: string;
}

interface VolumeModalProps {
  volume: Volume;
  onClose: () => void;
}

const VolumeModal = ({ volume, onClose }: VolumeModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden glass-effect rounded-2xl border border-white/20 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Cover Image */}
          <div className="md:w-1/2 relative">
            <div className="aspect-[3/4] md:aspect-auto md:h-full relative overflow-hidden">
              <img
                src={volume.coverUrl}
                alt={volume.title}
                className={`w-full h-full object-cover ${
                  !volume.owned ? 'filter grayscale' : ''
                }`}
              />
              
              {/* Status Overlay */}
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
                volume.owned 
                  ? 'bg-neon-green text-black' 
                  : 'bg-red-500 text-white'
              }`}>
                {volume.owned ? (
                  <>
                    <Check className="w-4 h-4" />
                    Possuído
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Faltando
                  </>
                )}
              </div>

              {/* Volume Number */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-neon-blue px-3 py-2 rounded-lg text-lg font-bold font-cyber">
                Volume #{volume.number}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text neon-gradient mb-4 font-cyber">
                {volume.title}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-neon-blue" />
                  <span className="text-sm">
                    Lançamento: {formatDate(volume.releaseDate)}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Sinopse</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {volume.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Detalhes</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Série:</span>
                      <p className="text-white font-medium">Super Onze</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Volume:</span>
                      <p className="text-white font-medium">#{volume.number}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <p className={`font-medium ${volume.owned ? 'text-neon-green' : 'text-red-400'}`}>
                        {volume.owned ? 'Na Coleção' : 'Faltando'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Formato:</span>
                      <p className="text-white font-medium">Físico</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-300 font-cyber">
                {volume.owned ? 'Marcar como Lido' : 'Adicionar à Lista'}
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-3 glass-effect rounded-lg text-white hover:bg-white/20 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeModal;
