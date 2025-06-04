
import { useState } from "react";
import { ChevronLeft, ChevronRight, Moon, Sun, ChevronUp, ChevronDown } from "lucide-react";
import MangaCollection from "./MangaCollection";

interface Volume {
  id: number;
  number: number;
  title: string;
  owned: boolean;
  coverUrl: string;
}

interface MangaSeries {
  id: string;
  title: string;
  totalVolumes: number;
  coverImage: string;
  description: string;
  year: string;
  volumes: Volume[];
}

const generateVolumes = (seriesId: string, totalVolumes: number, baseImageUrl: string): Volume[] => {
  return Array.from({ length: Math.min(totalVolumes, 8) }, (_, index) => ({
    id: index + 1,
    number: index + 1,
    title: `Volume ${index + 1}`,
    owned: Math.random() > 0.3,
    coverUrl: `${baseImageUrl}&${index}`
  }));
};

const mangaSeries: MangaSeries[] = [
  {
    id: "super-onze",
    title: "Super Onze",
    totalVolumes: 34,
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&auto=format&q=80",
    description: "A épica jornada de futebol que conquistou uma geração",
    year: "2000-2014",
    volumes: generateVolumes("super-onze", 34, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=280&fit=crop&auto=format&q=80")
  },
  {
    id: "naruto",
    title: "Naruto",
    totalVolumes: 72,
    coverImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=600&fit=crop&auto=format&q=80",
    description: "A história do ninja que sonha em ser Hokage",
    year: "1999-2014",
    volumes: generateVolumes("naruto", 72, "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=280&fit=crop&auto=format&q=80")
  },
  {
    id: "one-piece",
    title: "One Piece",
    totalVolumes: 105,
    coverImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=600&fit=crop&auto=format&q=80",
    description: "A aventura dos Piratas do Chapéu de Palha",
    year: "1997-presente",
    volumes: generateVolumes("one-piece", 105, "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&h=280&fit=crop&auto=format&q=80")
  },
  {
    id: "dragon-ball",
    title: "Dragon Ball",
    totalVolumes: 42,
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop&auto=format&q=80",
    description: "A lendária saga de Goku e as Esferas do Dragão",
    year: "1984-1995",
    volumes: generateVolumes("dragon-ball", 42, "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&h=280&fit=crop&auto=format&q=80")
  },
  {
    id: "attack-titan",
    title: "Attack on Titan",
    totalVolumes: 34,
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&auto=format&q=80&sig=2",
    description: "A humanidade luta pela sobrevivência contra os titãs",
    year: "2009-2021",
    volumes: generateVolumes("attack-titan", 34, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=280&fit=crop&auto=format&q=80&sig=2")
  }
];

const MangaCarousel = () => {
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [volumeScrollPositions, setVolumeScrollPositions] = useState<{ [key: string]: number }>({});

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const nextSeries = () => {
    setCurrentSeriesIndex((prev) => (prev + 1) % mangaSeries.length);
  };

  const prevSeries = () => {
    setCurrentSeriesIndex((prev) => (prev - 1 + mangaSeries.length) % mangaSeries.length);
  };

  const scrollVolumes = (seriesId: string, direction: 'left' | 'right') => {
    setVolumeScrollPositions(prev => {
      const currentPos = prev[seriesId] || 0;
      const newPos = direction === 'right' 
        ? Math.min(currentPos + 1, mangaSeries.find(s => s.id === seriesId)!.volumes.length - 4)
        : Math.max(currentPos - 1, 0);
      return { ...prev, [seriesId]: newPos };
    });
  };

  if (selectedSeries) {
    return (
      <MangaCollection 
        seriesId={selectedSeries}
        onBack={() => setSelectedSeries(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark-gradient relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-cyber font-bold text-transparent bg-clip-text bg-fire-gradient animate-glow-red">
              MANGA VAULT
            </h1>
            <p className="text-lg text-gray-300 mt-2 font-anime">
              Sua Coleção Digital de Mangás
            </p>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-3 glass-effect rounded-xl hover:bg-crimson-red/20 transition-all duration-300 group"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-fire-red group-hover:rotate-180 transition-transform duration-300" />
            ) : (
              <Moon className="w-6 h-6 text-crimson-red group-hover:rotate-180 transition-transform duration-300" />
            )}
          </button>
        </div>
      </header>

      {/* Main Carousel Container */}
      <div className="relative flex-1 px-6">
        {/* Vertical Navigation */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-4">
          <button
            onClick={prevSeries}
            className="p-3 glass-effect rounded-full text-white hover:bg-crimson-red/30 transition-all duration-300 group"
          >
            <ChevronUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="flex flex-col gap-2">
            {mangaSeries.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSeriesIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSeriesIndex 
                    ? 'bg-crimson-red shadow-lg shadow-crimson-red/50' 
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSeries}
            className="p-3 glass-effect rounded-full text-white hover:bg-crimson-red/30 transition-all duration-300 group"
          >
            <ChevronDown className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Manga Series Vertical Stack */}
        <div className="max-w-7xl mx-auto space-y-12 py-8">
          {mangaSeries.map((series, seriesIndex) => {
            const scrollPos = volumeScrollPositions[series.id] || 0;
            const ownedCount = series.volumes.filter(v => v.owned).length;
            const completionPercentage = Math.round((ownedCount / series.totalVolumes) * 100);
            
            return (
              <div
                key={series.id}
                className={`transition-all duration-700 ${
                  seriesIndex === currentSeriesIndex 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-60 scale-95'
                }`}
              >
                {/* Series Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <div 
                      className="w-20 h-28 rounded-lg bg-cover bg-center glass-effect border-2 border-crimson-red/50 cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundImage: `url(${series.coverImage})` }}
                      onClick={() => setSelectedSeries(series.id)}
                    />
                    
                    <div>
                      <h2 className="text-3xl font-cyber font-bold text-transparent bg-clip-text bg-fire-gradient">
                        {series.title}
                      </h2>
                      <p className="text-gray-300 text-sm mb-2">{series.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-crimson-red font-medium">
                          {ownedCount}/{series.totalVolumes} volumes ({completionPercentage}%)
                        </span>
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-fire-gradient transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedSeries(series.id)}
                    className="px-6 py-2 glass-effect rounded-lg text-crimson-red hover:bg-crimson-red/20 transition-all duration-300 font-medium"
                  >
                    Ver Coleção →
                  </button>
                </div>

                {/* Volume Carousel */}
                <div className="relative">
                  {/* Horizontal scroll buttons */}
                  <button
                    onClick={() => scrollVolumes(series.id, 'left')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 glass-effect rounded-full text-white hover:bg-crimson-red/30 transition-all duration-300"
                    disabled={scrollPos === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => scrollVolumes(series.id, 'right')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 glass-effect rounded-full text-white hover:bg-crimson-red/30 transition-all duration-300"
                    disabled={scrollPos >= series.volumes.length - 4}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Volumes Grid */}
                  <div className="overflow-hidden px-12">
                    <div 
                      className="flex gap-4 transition-transform duration-500"
                      style={{ transform: `translateX(-${scrollPos * 25}%)` }}
                    >
                      {series.volumes.map((volume, index) => (
                        <div
                          key={volume.id}
                          className={`flex-shrink-0 w-32 h-44 rounded-lg glass-effect border transition-all duration-300 cursor-pointer group ${
                            volume.owned 
                              ? 'border-crimson-red/50 hover:border-crimson-red hover:scale-105' 
                              : 'border-gray-600 grayscale hover:grayscale-0 hover:scale-105'
                          }`}
                          style={{
                            backgroundImage: `url(${volume.coverUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                          onClick={() => setSelectedSeries(series.id)}
                        >
                          <div className="w-full h-full bg-gradient-to-t from-coal-black/80 via-transparent to-transparent rounded-lg flex items-end p-3">
                            <div className="text-white">
                              <div className="text-xs font-cyber text-crimson-red">#{volume.number}</div>
                              <div className="text-xs">{volume.title}</div>
                              <div className={`text-xs mt-1 ${volume.owned ? 'text-green-400' : 'text-gray-400'}`}>
                                {volume.owned ? '✓ Possuo' : '✗ Faltando'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Show more indicator if there are more volumes */}
                      {series.totalVolumes > 8 && (
                        <div
                          className="flex-shrink-0 w-32 h-44 rounded-lg glass-effect border border-crimson-red/30 flex items-center justify-center cursor-pointer hover:bg-crimson-red/20 transition-all duration-300"
                          onClick={() => setSelectedSeries(series.id)}
                        >
                          <div className="text-center text-gray-300">
                            <div className="text-2xl mb-2">+</div>
                            <div className="text-xs">
                              +{series.totalVolumes - 8} volumes
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-gray-400 text-sm">
        <p>Use as setas laterais para navegar e clique nas séries para explorar</p>
      </div>
    </div>
  );
};

export default MangaCarousel;
