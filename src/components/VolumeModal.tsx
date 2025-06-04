
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
        className="absolute inset-0 bg-coal-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden glass-effect rounded-2xl border border-crimson-red/30 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-coal-black/70 rounded-full text-white hover:bg-crimson-red/50 transition-colors border border-crimson-red/30"
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
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg ${
                volume.owned 
                  ? 'bg-crimson-red text-white shadow-crimson-red/50' 
                  : 'bg-fire-red text-white shadow-fire-red/50'
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
              <div className="absolute bottom-4 left-4 bg-coal-black/80 text-crimson-red px-3 py-2 rounded-lg text-lg font-bold font-cyber border border-crimson-red/30">
                Volume #{volume.number}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between bg-coal-black/50">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-fire-gradient mb-4 font-cyber">
                {volume.title}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-crimson-red" />
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
                      <span className="text-gray-400">Volume:</span>
                      <p className="text-white font-medium">#{volume.number}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <p className={`font-medium ${volume.owned ? 'text-crimson-red' : 'text-fire-red'}`}>
                        {volume.owned ? 'Na Coleção' : 'Faltando'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Formato:</span>
                      <p className="text-white font-medium">Físico</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Idioma:</span>
                      <p className="text-white font-medium">Português</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-fire-gradient text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-crimson-red/30 transition-all duration-300 font-cyber">
                {volume.owned ? 'Marcar como Lido' : 'Adicionar à Lista'}
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-3 glass-effect rounded-lg text-white hover:bg-crimson-red/20 transition-colors font-medium border border-crimson-red/30"
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
