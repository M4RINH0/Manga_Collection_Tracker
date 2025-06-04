
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
      const maxScroll = Math.max(0, mangaSeries.find(s => s.id === seriesId)!.volumes.length - 6);
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
            <h1 className="text-2xl font-bold text-crimson-red">MANGA VAULT</h1>
            <nav className="hidden md:flex gap-6">
              <button className="text-white hover:text-gray-300 transition-colors">Início</button>
              <button className="text-white hover:text-gray-300 transition-colors">Minha Lista</button>
              <button className="text-white hover:text-gray-300 transition-colors">Categorias</button>
            </nav>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/20 transition-all duration-300"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Featured Content */}
        <div className="relative z-10 flex items-center h-full px-6 pb-20">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">{featuredSeries.title}</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-crimson-red px-2 py-1 text-sm font-bold">★ {featuredSeries.rating}</span>
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
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Ver Coleção
              </button>
              <button className="flex items-center gap-2 bg-gray-600/80 text-white px-8 py-3 rounded font-bold hover:bg-gray-600 transition-colors">
                <Info className="w-5 h-5" />
                Mais Info
              </button>
            </div>
            <div className="mt-6">
              <div className="text-sm text-gray-400 mb-2">Progresso da Coleção</div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-crimson-red h-2 rounded-full transition-all duration-500"
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
              className={`w-2 h-2 rounded-full transition-all ${
                index === featuredIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative z-10 bg-black -mt-20 pt-20">
        {mangaSeries.map((series) => {
          const scrollPos = volumeScrollPositions[series.id] || 0;
          const ownedVolumes = series.volumes.filter(v => v.owned).length;
          
          return (
            <div key={series.id} className="mb-12">
              <div className="px-6 mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">{series.title}</h3>
                <button 
                  onClick={() => setSelectedSeries(series.id)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Ver todos →
                </button>
              </div>
              
              <div className="relative group">
                <button
                  onClick={() => scrollVolumes(series.id, 'left')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                  disabled={scrollPos === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => scrollVolumes(series.id, 'right')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                  disabled={scrollPos >= Math.max(0, series.volumes.length - 6)}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="overflow-hidden px-6">
                  <div 
                    className="flex gap-2 transition-transform duration-300"
                    style={{ transform: `translateX(-${scrollPos * 16.67}%)` }}
                  >
                    {series.volumes.map((volume) => (
                      <div
                        key={volume.id}
                        className="flex-shrink-0 w-48 group/item cursor-pointer"
                        onClick={() => setSelectedSeries(series.id)}
                      >
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 group-hover/item:scale-105 transition-transform duration-200">
                          <img
                            src={volume.coverUrl}
                            alt={volume.title}
                            className={`w-full h-full object-cover ${!volume.owned ? 'grayscale opacity-60' : ''}`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors" />
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            {volume.owned ? (
                              <div className="bg-green-600 p-1 rounded-full">
                                <Check className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="bg-gray-600 p-1 rounded-full">
                                <Plus className="w-3 h-3" />
                              </div>
                            )}
                          </div>

                          {/* Volume Number */}
                          <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-xs font-bold">
                            #{volume.number}
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 group-hover/item:text-white transition-colors">
                          Volume {volume.number}
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
    </div>
  );
};

export default MangaCarousel;
