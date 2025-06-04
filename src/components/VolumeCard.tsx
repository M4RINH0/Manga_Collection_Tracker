
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
      <div className={`relative rounded-xl overflow-hidden glass-effect transition-all duration-300 group-hover:shadow-2xl ${
        volume.owned 
          ? 'group-hover:shadow-neon-blue/30 border-neon-blue/30' 
          : 'group-hover:shadow-red-500/30 border-red-500/30 grayscale group-hover:grayscale-0'
      }`}>
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
          volume.owned 
            ? 'bg-neon-green text-black' 
            : 'bg-red-500 text-white'
        }`}>
          {volume.owned ? (
            <Check className="w-3 h-3" />
          ) : (
            <X className="w-3 h-3" />
          )}
        </div>

        {/* Volume Number Badge */}
        <div className="absolute top-2 left-2 z-10 bg-black/70 text-neon-blue px-2 py-1 rounded-md text-xs font-bold font-cyber">
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
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📖</div>
                <div className="text-xs text-gray-400">Volume {volume.number}</div>
              </div>
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-600">📖</div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-3 w-full">
              <h3 className="text-white text-sm font-semibold truncate">
                Volume {volume.number}
              </h3>
              <p className="text-gray-300 text-xs">
                {volume.owned ? 'Na coleção' : 'Faltando'}
              </p>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        {volume.owned && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 animate-glow rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VolumeCard;
