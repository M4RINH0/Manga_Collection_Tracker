
import { useState } from "react";
import { ChevronLeft, ChevronRight, Moon, Sun, Play, Info, Plus, Check } from "lucide-react";
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
  genre: string;
  rating: string;
}

const generateVolumes = (seriesId: string, totalVolumes: number, baseImageUrl: string): Volume[] => {
  return Array.from({ length: Math.min(totalVolumes, 12) }, (_, index) => ({
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
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop&auto=format&q=80",
    description: "Uma épica jornada de futebol que conquistou uma geração inteira. Acompanhe Mark Evans e sua equipe enquanto lutam para se tornar os melhores do mundo.",
    year: "2000-2014",
    genre: "Esporte, Ação",
    rating: "9.2",
    volumes: generateVolumes("super-onze", 34, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80")
  },
  {
    id: "naruto",
    title: "Naruto",
    totalVolumes: 72,
    coverImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=450&fit=crop&auto=format&q=80",
    description: "A história do ninja mais determinado de todos os tempos. Naruto Uzumaki sonha em se tornar Hokage e proteger sua vila natal.",
    year: "1999-2014",
    genre: "Ação, Ninja",
    rating: "9.8",
    volumes: generateVolumes("naruto", 72, "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=400&fit=crop&auto=format&q=80")
  },
  {
    id: "one-piece",
    title: "One Piece",
    totalVolumes: 105,
    coverImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=450&fit=crop&auto=format&q=80",
    description: "Navegue pelos mares com Monkey D. Luffy e os Piratas do Chapéu de Palha em busca do tesouro lendário One Piece.",
    year: "1997-presente",
    genre: "Aventura, Piratas",
    rating: "9.9",
    volumes: generateVolumes("one-piece", 105, "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=400&fit=crop&auto=format&q=80")
  },
  {
    id: "dragon-ball",
    title: "Dragon Ball",
    totalVolumes: 42,
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=450&fit=crop&auto=format&q=80",
    description: "A lendária saga de Goku e as Esferas do Dragão que definiu uma geração de fãs de anime e mangá.",
    year: "1984-1995",
    genre: "Ação, Aventura",
    rating: "9.7",
    volumes: generateVolumes("dragon-ball", 42, "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=400&fit=crop&auto=format&q=80")
  },
  {
    id: "attack-titan",
    title: "Attack on Titan",
    totalVolumes: 34,
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop&auto=format&q=80&sig=2",
    description: "A humanidade luta pela sobrevivência contra criaturas gigantescas em uma batalha épica pela liberdade.",
    year: "2009-2021",
    genre: "Drama, Ação",
    rating: "9.5",
    volumes: generateVolumes("attack-titan", 34, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80&sig=2")
  }
];

const MangaCarousel = () => {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [volumeScrollPositions, setVolumeScrollPositions] = useState<{ [key: string]: number }>({});

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const scrollVolumes = (seriesId: string, direction: 'left' | 'right') => {
    setVolumeScrollPositions(prev => {
      const currentPos = prev[seriesId] || 0;
      const maxScroll = Math.max(0, mangaSeries.find(s => s.id === seriesId)!.volumes.length - 4);
      const newPos = direction === 'right' 
        ? Math.min(currentPos + 1, maxScroll)
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

  const featuredSeries = mangaSeries[featuredIndex];
  const ownedCount = featuredSeries.volumes.filter(v => v.owned).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Featured Manga */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredSeries.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-crimson-red animate-glow-red">MANGA VAULT</h1>
            <nav className="hidden md:flex gap-6">
              <button className="text-white hover:text-crimson-red transition-colors">Início</button>
              <button className="text-white hover:text-crimson-red transition-colors">Minha Lista</button>
              <button className="text-white hover:text-crimson-red transition-colors">Categorias</button>
            </nav>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-crimson-red/20 transition-all duration-300 animate-float"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Featured Content */}
        <div className="relative z-10 flex items-center h-full px-6 pb-20">
          <div className="max-w-2xl animate-slide-in">
            <h2 className="text-5xl md:text-7xl font-bold mb-4 bg-red-gradient bg-clip-text text-transparent">
              {featuredSeries.title}
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-crimson-red px-2 py-1 text-sm font-bold rounded animate-glow-red">★ {featuredSeries.rating}</span>
              <span className="text-gray-300">{featuredSeries.year}</span>
              <span className="text-gray-300">{featuredSeries.genre}</span>
              <span className="text-gray-300">{featuredSeries.totalVolumes} volumes</span>
            </div>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {featuredSeries.description}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedSeries(featuredSeries.id)}
                className="flex items-center gap-2 bg-red-gradient text-white px-8 py-3 rounded font-bold hover:scale-105 transition-all duration-300 animate-glow-red"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Ver Coleção
              </button>
              <button className="flex items-center gap-2 glass-effect text-white px-8 py-3 rounded font-bold hover:scale-105 transition-all duration-300">
                <Info className="w-5 h-5" />
                Mais Info
              </button>
            </div>
            <div className="mt-6">
              <div className="text-sm text-gray-400 mb-2">Progresso da Coleção</div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-gradient h-2 rounded-full transition-all duration-500 animate-glow-red"
                    style={{ width: `${(ownedCount / featuredSeries.totalVolumes) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-300">{ownedCount}/{featuredSeries.totalVolumes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Navigation Dots */}
        <div className="absolute bottom-8 left-6 z-10 flex gap-2">
          {mangaSeries.map((_, index) => (
            <button
              key={index}
              onClick={() => setFeaturedIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === featuredIndex ? 'bg-crimson-red animate-glow-red' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3D Animated Carousels */}
      <div className="relative z-10 bg-black -mt-20 pt-20">
        {mangaSeries.map((series, seriesIndex) => {
          const scrollPos = volumeScrollPositions[series.id] || 0;
          const ownedVolumes = series.volumes.filter(v => v.owned).length;
          
          return (
            <div key={series.id} className="mb-16">
              <div className="px-6 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{series.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="bg-crimson-red px-2 py-1 text-xs font-bold rounded">★ {series.rating}</span>
                    <span className="text-gray-400 text-sm">{series.year}</span>
                    <span className="text-gray-400 text-sm">{series.genre}</span>
                    <div className="bg-gray-700 rounded-full h-1 w-24">
                      <div 
                        className="bg-crimson-red h-1 rounded-full transition-all duration-500"
                        style={{ width: `${(ownedVolumes / series.totalVolumes) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{ownedVolumes}/{series.totalVolumes}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSeries(series.id)}
                  className="text-crimson-red hover:text-white text-sm transition-colors font-semibold"
                >
                  Ver todos →
                </button>
              </div>
              
              <div className="relative group perspective-1000">
                <button
                  onClick={() => scrollVolumes(series.id, 'left')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-crimson-red/80 hover:scale-110 disabled:opacity-0"
                  disabled={scrollPos === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => scrollVolumes(series.id, 'right')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-crimson-red/80 hover:scale-110 disabled:opacity-0"
                  disabled={scrollPos >= Math.max(0, series.volumes.length - 4)}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="overflow-hidden px-6">
                  <div 
                    className="flex gap-6 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${scrollPos * 25}%)` }}
                  >
                    {series.volumes.map((volume, index) => (
                      <div
                        key={volume.id}
                        className="flex-shrink-0 w-72 group/item cursor-pointer card-3d"
                        onClick={() => setSelectedSeries(series.id)}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          transform: `rotateY(${Math.sin((Date.now() / 2000) + (index * 0.5)) * 5}deg) rotateX(${Math.cos((Date.now() / 3000) + (index * 0.3)) * 3}deg)`
                        }}
                      >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 group-hover/item:scale-110 transition-all duration-500 shadow-2xl">
                          <img
                            src={volume.coverUrl}
                            alt={volume.title}
                            className={`w-full h-full object-cover transition-all duration-500 ${
                              !volume.owned ? 'grayscale opacity-60' : 'group-hover/item:brightness-110'
                            }`}
                          />
                          
                          {/* 3D Hexagonal Overlay Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-crimson-red/0 via-transparent to-crimson-red/20 opacity-0 group-hover/item:opacity-100 transition-all duration-500" />
                          
                          {/* Animated Border */}
                          <div className="absolute inset-0 border-2 border-transparent group-hover/item:border-crimson-red transition-all duration-500 rounded-xl" 
                               style={{
                                 boxShadow: volume.owned ? '0 0 30px rgba(220, 20, 60, 0.3)' : 'none'
                               }} />
                          
                          {/* Status Badge with 3D effect */}
                          <div className="absolute top-3 right-3 transform group-hover/item:scale-110 transition-all duration-300">
                            {volume.owned ? (
                              <div className="bg-green-600 p-2 rounded-full shadow-lg animate-glow-red">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="bg-gray-600/80 p-2 rounded-full shadow-lg backdrop-blur-sm">
                                <Plus className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Volume Number with hexagonal background */}
                          <div className="absolute bottom-3 left-3 transform group-hover/item:scale-110 transition-all duration-300">
                            <div className="bg-black/90 px-3 py-2 rounded-lg text-sm font-bold border border-crimson-red/50 backdrop-blur-sm">
                              #{volume.number}
                            </div>
                          </div>

                          {/* 3D Floating Effect on Hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-500" />
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white group-hover/item:text-crimson-red transition-colors duration-300">
                            Volume {volume.number}
                          </div>
                          <div className="text-sm text-gray-400">
                            {volume.owned ? 'Na Coleção' : 'Adicionar'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .card-3d {
          transform-style: preserve-3d;
        }
        
        @keyframes hexRotate {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          25% { transform: rotateY(90deg) rotateX(5deg); }
          50% { transform: rotateY(180deg) rotateX(0deg); }
          75% { transform: rotateY(270deg) rotateX(-5deg); }
          100% { transform: rotateY(360deg) rotateX(0deg); }
        }
      `}</style>
    </div>
  );
};

export default MangaCarousel;
