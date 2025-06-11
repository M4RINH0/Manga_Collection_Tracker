import { useState } from "react";
import { Volume } from "../types/Volume";
import { ArrowLeft, Moon, Sun, Search } from "lucide-react";
import VolumeCard from "./VolumeCard";
import VolumeModal from "./VolumeModal";
import FilterBar from "./FilterBar";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface PokemonCollectionProps {
  volumes: Volume[];
  setVolumes: React.Dispatch<React.SetStateAction<Volume[]>>;
  onBack: () => void;
  isAdmin?: boolean;
}

const PokemonCollection = ({ volumes, setVolumes, onBack, isAdmin = false }: PokemonCollectionProps) => {
  const [darkMode, setDarkMode] = useState(true);
  const [filter, setFilter] = useState<'all' | 'owned' | 'missing'>('all');
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [admin, setAdmin] = useState(isAdmin);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleAdminLogin = () => {
    const senha = prompt("Digite a senha de admin:");
    if (senha === "dodax123") {
      setAdmin(true);
      alert("Modo admin ativado!");
    } else if (senha !== null) {
      alert("Senha incorreta!");
    }
  };

  const toggleOwned = (volumeId: number) => {
    if (!admin) return;
    setVolumes((vols) => {
      const updated = vols.map((v) =>
        v.id === volumeId ? { ...v, owned: !v.owned } : v
      );
      saveCollectionToFirebase("admin-pokemon", updated);
      return updated;
    });
  };

  async function saveCollectionToFirebase(userId: string, vols: Volume[]) {
    await setDoc(doc(db, "collections", userId), { volumes: vols });
  }

  const filteredVolumes = volumes.filter(volume => {
    const matchesFilter = filter === 'all'
      || (filter === 'owned' && volume.owned)
      || (filter === 'missing' && !volume.owned);

    const matchesSearch = volume.title.toLowerCase().includes(searchTerm.toLowerCase())
      || volume.number.toString().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  const ownedCount = volumes.filter(v => v.owned).length;
  const totalCount = volumes.length;
  const completionPercentage = Math.round((ownedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-dark-gradient transition-all duration-500 flex flex-col">
      {/* Header */}
      <header className="glass-effect border-b border-crimson-red/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-3 glass-effect rounded-xl hover:bg-crimson-red/20 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 text-crimson-red group-hover:scale-110 transition-transform" />
              </button>

              <div className="flex flex-col">
                <h1 className="text-4xl lg:text-5xl font-cyber font-bold text-transparent bg-clip-text bg-fire-gradient animate-glow-red">
                  Pokémon Adventures
                </h1>
                <p className="text-lg text-gray-300 mt-2 font-anime">
                  Minha coleção de Pokémon Adventures
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="text-sm text-crimson-red font-medium">
                    {ownedCount}/{totalCount} volumes ({completionPercentage}%)
                  </div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-fire-gradient transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
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
                  className="pl-10 pr-4 py-2 bg-coal-black/50 border border-crimson-red/30 rounded-lg text-white placeholder-gray-400 focus:border-crimson-red focus:outline-none transition-colors"
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 glass-effect rounded-xl hover:bg-crimson-red/20 transition-all duration-300 group"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-fire-red group-hover:rotate-180 transition-transform duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-crimson-red group-hover:rotate-180 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 flex-1 w-full">
        <FilterBar
          currentFilter={filter}
          onFilterChange={setFilter}
          ownedCount={ownedCount}
          missingCount={totalCount - ownedCount}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mt-8">
          {filteredVolumes.map((volume, index) => (
            <div className="relative" key={volume.id}>
              <VolumeCard
                volume={volume}
                onClick={admin ? () => toggleOwned(volume.id) : undefined}
                animationDelay={index * 0.1}
              />
            </div>
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

      {selectedVolume && (
        <VolumeModal
          volume={selectedVolume}
          onClose={() => setSelectedVolume(null)}
        />
      )}

      <footer className="w-full py-4 bg-black text-gray-500 text-xs border-t border-crimson-red/20 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
        <div className="flex-1 flex flex-col items-center">
          <div className="text-center font-semibold mb-1">
            © 2025 Manga Collection Tracker - Douglas Marinho Martins
          </div>
          {!admin && (
            <button
              className="mt-1 px-3 py-1 rounded bg-crimson-red text-white text-xs font-bold hover:bg-red-700 transition"
              onClick={handleAdminLogin}
            >
              Entrar como admin
            </button>
          )}
          {admin && (
            <span className="mt-1 text-green-400 text-xs font-bold">Modo admin ativo</span>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PokemonCollection;