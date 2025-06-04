
import { useState } from "react";
import { Check, X } from "lucide-react";

interface Volume {
  id: number;
  number: number;
  title: string;
  owned: boolean;
  coverUrl: string;
  description: string;
  releaseDate: string;
}

interface VolumeCardProps {
  volume: Volume;
  onClick: () => void;
  animationDelay?: number;
}

const VolumeCard = ({ volume, onClick, animationDelay = 0 }: VolumeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 animate-slide-in"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onClick}
    >
      <div className={`relative rounded-xl overflow-hidden glass-effect transition-all duration-300 ${
        volume.owned 
          ? 'group-hover:shadow-2xl group-hover:shadow-crimson-red/50 border-crimson-red/30 hover:border-crimson-red/60' 
          : 'group-hover:shadow-2xl group-hover:shadow-fire-red/30 border-gray-600/30 hover:border-fire-red/60 grayscale group-hover:grayscale-0'
      }`}>
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
          volume.owned 
            ? 'bg-crimson-red text-white shadow-lg shadow-crimson-red/50' 
            : 'bg-fire-red text-white shadow-lg shadow-fire-red/50'
        }`}>
          {volume.owned ? (
            <Check className="w-3 h-3" />
          ) : (
            <X className="w-3 h-3" />
          )}
        </div>

        {/* Volume Number Badge */}
        <div className="absolute top-2 left-2 z-10 bg-coal-black/80 text-crimson-red px-2 py-1 rounded-md text-xs font-bold font-cyber border border-crimson-red/30">
          #{volume.number}
        </div>

        {/* Cover Image */}
        <div className="aspect-[3/4] relative overflow-hidden">
          {!imageError ? (
            <img
              src={volume.coverUrl}
              alt={volume.title}
              className={`w-full h-full object-cover transition-all duration-500 ${
                !volume.owned ? 'filter grayscale group-hover:grayscale-0' : ''
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-coal-black to-shadow-black flex items-center justify-center border border-crimson-red/20">
              <div className="text-center">
                <div className="text-4xl mb-2">📖</div>
                <div className="text-xs text-gray-400">Volume {volume.number}</div>
              </div>
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-coal-black animate-pulse flex items-center justify-center">
              <div className="text-crimson-red">📖</div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-coal-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-3 w-full">
              <h3 className="text-white text-sm font-semibold truncate">
                Volume {volume.number}
              </h3>
              <p className={`text-xs ${volume.owned ? 'text-crimson-red' : 'text-fire-red'}`}>
                {volume.owned ? 'Na coleção' : 'Faltando'}
              </p>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        {volume.owned && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-crimson-red/20 to-fire-red/20 animate-glow-red rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VolumeCard;
