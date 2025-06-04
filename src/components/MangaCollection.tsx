
import { useState } from "react";
import { Moon, Sun, Filter, Search } from "lucide-react";
import VolumeCard from "./VolumeCard";
import VolumeModal from "./VolumeModal";
import FilterBar from "./FilterBar";

// Dados simulados dos volumes
const volumes = Array.from({ length: 34 }, (_, index) => ({
  id: index + 1,
  number: index + 1,
  title: `Super Onze - Volume ${index + 1}`,
  owned: Math.random() > 0.3, // Simula que você possui ~70% dos volumes
  coverUrl: `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80&${index}`,
  description: `Volume ${index + 1} da série Super Onze, repleto de ação e aventuras emocionantes no mundo do futebol.`,
  releaseDate: `202${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}-01`
}));

const MangaCollection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'owned' | 'missing'>('all');
  const [selectedVolume, setSelectedVolume] = useState<typeof volumes[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const filteredVolumes = volumes.filter(volume => {
    const matchesFilter = filter === 'all' || 
      (filter === 'owned' && volume.owned) || 
      (filter === 'missing' && !volume.owned);
    
    const matchesSearch = volume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volume.number.toString().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  const ownedCount = volumes.filter(v => v.owned).length;
  const totalCount = volumes.length;
  const completionPercentage = Math.round((ownedCount / totalCount) * 100);

  return (
    <div className="min-h-screen transition-all duration-500">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl lg:text-5xl font-cyber font-bold text-transparent bg-clip-text neon-gradient animate-glow">
                SUPER ONZE
              </h1>
              <p className="text-lg text-gray-300 mt-2 font-anime">
                Coleção Digital de Mangás
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-sm text-neon-blue font-medium">
                  {ownedCount}/{totalCount} volumes ({completionPercentage}%)
                </div>
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full neon-gradient transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar volumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none transition-colors"
                />
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-neon-blue group-hover:rotate-180 transition-transform duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-neon-purple group-hover:rotate-180 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Filter Bar */}
        <FilterBar 
          currentFilter={filter} 
          onFilterChange={setFilter}
          ownedCount={ownedCount}
          missingCount={totalCount - ownedCount}
        />

        {/* Volume Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mt-8">
          {filteredVolumes.map((volume, index) => (
            <VolumeCard
              key={volume.id}
              volume={volume}
              onClick={() => setSelectedVolume(volume)}
              animationDelay={index * 0.1}
            />
          ))}
        </div>

        {filteredVolumes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Nenhum volume encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedVolume && (
        <VolumeModal
          volume={selectedVolume}
          onClose={() => setSelectedVolume(null)}
        />
      )}
    </div>
  );
};

export default MangaCollection;
