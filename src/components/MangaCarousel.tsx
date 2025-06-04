
import { useState } from "react";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import MangaCollection from "./MangaCollection";

interface MangaSeries {
  id: string;
  title: string;
  totalVolumes: number;
  coverImage: string;
  description: string;
  year: string;
}

const mangaSeries: MangaSeries[] = [
  {
    id: "super-onze",
    title: "Super Onze",
    totalVolumes: 34,
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&auto=format&q=80",
    description: "A épica jornada de futebol que conquistou uma geração",
    year: "2000-2014"
  },
  {
    id: "naruto",
    title: "Naruto",
    totalVolumes: 72,
    coverImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=600&fit=crop&auto=format&q=80",
    description: "A história do ninja que sonha em ser Hokage",
    year: "1999-2014"
  },
  {
    id: "one-piece",
    title: "One Piece",
    totalVolumes: 105,
    coverImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=600&fit=crop&auto=format&q=80",
    description: "A aventura dos Piratas do Chapéu de Palha",
    year: "1997-presente"
  }
];

const MangaCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mangaSeries.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mangaSeries.length) % mangaSeries.length);
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

      {/* Carousel */}
      <div className="relative h-[70vh] flex items-center justify-center">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-8 z-20 p-4 glass-effect rounded-full text-white hover:bg-crimson-red/30 transition-all duration-300 group"
        >
          <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-8 z-20 p-4 glass-effect rounded-full text-white hover:bg-crimson-red/30 transition-all duration-300 group"
        >
          <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>

        {/* Carousel Container */}
        <div className="relative w-full max-w-5xl mx-auto perspective-1000">
          <div className="flex items-center justify-center">
            {mangaSeries.map((series, index) => {
              const offset = index - currentIndex;
              const isActive = offset === 0;
              
              return (
                <div
                  key={series.id}
                  className={`absolute transition-all duration-700 ease-in-out cursor-pointer ${
                    isActive 
                      ? 'z-10 scale-110' 
                      : Math.abs(offset) === 1 
                        ? 'z-5 scale-90 opacity-70' 
                        : 'z-0 scale-75 opacity-30'
                  }`}
                  style={{
                    transform: `translateX(${offset * 300}px) ${
                      !isActive ? `rotateY(${offset > 0 ? -25 : 25}deg)` : ''
                    }`,
                  }}
                  onClick={() => {
                    if (isActive) {
                      setSelectedSeries(series.id);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                >
                  <div className="card-3d group">
                    <div className={`relative w-80 h-96 rounded-2xl overflow-hidden glass-effect transition-all duration-500 ${
                      isActive 
                        ? 'shadow-2xl shadow-crimson-red/50 border-2 border-crimson-red/50' 
                        : 'hover:shadow-xl hover:shadow-fire-red/30'
                    }`}>
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${series.coverImage})` }}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-coal-black via-coal-black/60 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-cyber font-bold mb-2 text-transparent bg-clip-text bg-fire-gradient">
                          {series.title}
                        </h3>
                        <p className="text-sm text-gray-300 mb-2">
                          {series.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>{series.totalVolumes} volumes</span>
                          <span>{series.year}</span>
                        </div>
                        
                        {isActive && (
                          <div className="mt-4 animate-pulse">
                            <div className="text-center text-crimson-red font-semibold">
                              Clique para abrir →
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Glow Effect */}
                      {isActive && (
                        <div className="absolute inset-0 opacity-50 animate-glow-red rounded-2xl pointer-events-none" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {mangaSeries.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-crimson-red shadow-lg shadow-crimson-red/50' 
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-gray-400 text-sm">
        <p>Use as setas ou clique nas coleções para navegar</p>
      </div>
    </div>
  );
};

export default MangaCarousel;
