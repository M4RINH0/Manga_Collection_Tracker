import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Plus, Check, Github, Instagram } from "lucide-react";
import MangaCollection from "./MangaCollection";
import PokemonCollection from "./PokemonCollection";
import { Volume } from 'src/types/Volume.ts';
import logo from '../assets/logo_1.png';
import backgroundSuper11 from '../assets/background_super11.jpeg';
import backgroundPokemon from '../assets/background_pokemon.jpeg';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

const generateVolumes = (): Volume[] =>
  Array.from({ length: 34 }, (_, index) => {
    const num = String(index + 1).padStart(2, "0");
    return {
      id: index + 1,
      number: index + 1,
      title: `Volume ${index + 1}`,
      owned: false,
      coverUrl: `/images/super11/${num}.jpg`,
      description: `Volume ${index + 1} da série Super Onze, repleto de ação e aventuras emocionantes no mundo do futebol.`,
      releaseDate: `2010-${String((index % 12) + 1).padStart(2, '0')}-01`
    };
  });

function generatePokemonVolumes(): Volume[] {
  return Array.from({ length: 52 }, (_, index) => {
    const num = String(index + 1).padStart(2, "0");
    return {
      id: index + 1,
      number: index + 1,
      title: `Pokémon Adventures Vol. ${index + 1}`,
      owned: false,
      coverUrl: `/images/pokemon/${num}.jpeg`,
      description: `Capítulo ${index + 1} de Pokémon Adventures.`,
      releaseDate: `2010-${String((index % 12) + 1).padStart(2, '0')}-01`
    };
  });
}

const backgrounds = [
  {
    image: backgroundSuper11,
    title: "Super Onze",
    subtitle: "2008-2011",
    meta: "Esporte, Ação",
    desc: "Super Onze, também conhecido como Inazuma Eleven, é um mangá e anime que combina futebol e fantasia. A história acompanha Mamoru Endo, que reúne e treina jogadores para encarar partidas acirradas, todas repletas de técnicas especiais e desafios surpreendentes.",
  },
  {
    image: backgroundPokemon,
    title: "Pokémon Adventures",
    subtitle: "1997-Presente",
    meta: "Aventura",
    desc: "Pokémon Adventures é o principal mangá da franquia Pokémon. Foi lançado em março de 1997 e continua sendo produzido até os dias atuais. Diferente do anime, o mangá sofre muito mais influencia dos jogos principais tendo suas séries todas intituladas com os nomes dos jogos, inclusive com destaque para os seus personagens.",
  },
];

const MangaCarousel = () => {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [pokemonVolumes, setPokemonVolumes] = useState<Volume[]>([]);
  const [selectedCollection, setSelectedCollection] = useState(false);
  const [selectedPokemonCollection, setSelectedPokemonCollection] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [pokemonScrollPos, setPokemonScrollPos] = useState(0);
  const [currentHero, setCurrentHero] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const [isAdmin, setIsAdmin] = useState(false);

  // Efeito para o carrossel do Hero com fade mais rápido
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeClass("opacity-0");
      setTimeout(() => {
        setCurrentHero(prev => (prev + 1) % backgrounds.length);
        setFadeClass("opacity-100");
      }, 500); // <-- ALTERADO: Duração do fade reduzida para 500ms
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const [userId] = useState<string>("admin-colecao");

  // Carrega dados do Firebase e coleções iniciais
  useEffect(() => {
    // Super Onze
    loadCollectionFromFirebase(userId).then(data => {
      if (data) setVolumes(data);
      else setVolumes(generateVolumes());
    });

    // Pokémon (sem Firebase por enquanto, pode ser adaptado)
    setPokemonVolumes(generatePokemonVolumes());
    // eslint-disable-next-line
  }, [userId]);

  // Salva coleção Super Onze no Firebase quando alterada
  useEffect(() => {
    if (isAdmin && volumes.length > 0) {
      saveCollectionToFirebase(userId, volumes);
    }
  }, [volumes, userId, isAdmin]);

  const toggleOwned = (volumeId: number, collection: 'super11' | 'pokemon') => {
    if (collection === 'super11') {
      setVolumes(vols =>
        vols.map(v =>
          v.id === volumeId ? { ...v, owned: !v.owned } : v
        )
      );
    } else if (collection === 'pokemon') {
      setPokemonVolumes(vols =>
        vols.map(v =>
          v.id === volumeId ? { ...v, owned: !v.owned } : v
        )
      );
    }
  };
  
  // --- Lógica de Carrossel Super Onze ---
  const ownedCount = volumes.filter(v => v.owned).length;
  const scrollVolumes = (direction: 'left' | 'right') => {
    const maxScroll = Math.max(0, volumes.length - 4);
    setScrollPos(pos => direction === 'right' ? Math.min(pos + 1, maxScroll) : Math.max(pos - 1, 0));
  };
  
  // --- Lógica de Carrossel Pokémon ---
  const pokemonOwnedCount = pokemonVolumes.filter(v => v.owned).length;
  const scrollPokemon = (direction: 'left' | 'right') => {
    const maxScroll = Math.max(0, pokemonVolumes.length - 4);
    setPokemonScrollPos(pos => direction === 'right' ? Math.min(pos + 1, maxScroll) : Math.max(pos - 1, 0));
  };

  // --- Funções de Admin e Firebase ---
  const handleAdminLogin = () => {
    const senha = prompt("Digite a senha de admin:");
    if (senha === "dodax123") {
      setIsAdmin(true);
      alert("Modo admin ativado!");
    } else if (senha !== null) {
      alert("Senha incorreta!");
    }
  };

  async function saveCollectionToFirebase(userId: string, volumesToSave: Volume[]) {
    await setDoc(doc(db, "collections", userId), { volumes: volumesToSave });
  }

  async function loadCollectionFromFirebase(userId: string): Promise<Volume[] | null> {
    const docSnap = await getDoc(doc(db, "collections", userId));
    return docSnap.exists() ? docSnap.data().volumes : null;
  }

  // Lógica para Drag (Touch) permanece a mesma...
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const CARD_WIDTH = 112;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStartX.current === null) return;
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const movedCards = Math.round(dragOffset / CARD_WIDTH * -1);
    if (movedCards !== 0) {
      const maxScroll = Math.max(0, volumes.length - 4);
      setScrollPos(pos => Math.max(0, Math.min(pos + movedCards, maxScroll)));
    }
    setDragOffset(0);
    touchStartX.current = null;
  };

  const [pokemonDragOffset, setPokemonDragOffset] = useState(0);
  const [pokemonIsDragging, setPokemonIsDragging] = useState(false);
  const pokemonTouchStartX = useRef<number | null>(null);

  const handlePokemonTouchStart = (e: React.TouchEvent) => {
    pokemonTouchStartX.current = e.touches[0].clientX;
    setPokemonIsDragging(true);
  };
  const handlePokemonTouchMove = (e: React.TouchEvent) => {
    if (!pokemonIsDragging || pokemonTouchStartX.current === null) return;
    setPokemonDragOffset(e.touches[0].clientX - pokemonTouchStartX.current);
  };
  const handlePokemonTouchEnd = () => {
    if (!pokemonIsDragging) return;
    setPokemonIsDragging(false);
    const movedCards = Math.round(pokemonDragOffset / CARD_WIDTH * -1);
    if (movedCards !== 0) {
      const maxScroll = Math.max(0, pokemonVolumes.length - 4);
      setPokemonScrollPos(pos => Math.max(0, Math.min(pos + movedCards, maxScroll)));
    }
    setPokemonDragOffset(0);
    pokemonTouchStartX.current = null;
  };

  // --- ALTERADO: Lógica para conteúdo dinâmico do Hero ---
  const currentBackground = backgrounds[currentHero];
  let progressOwned = 0;
  let progressTotal = 0;
  let totalVolsText = '';

  if (currentBackground.title === "Super Onze") {
    progressOwned = ownedCount;
    progressTotal = volumes.length;
    totalVolsText = `${volumes.length} vols`;
  } else if (currentBackground.title === "Pokémon Adventures") {
    progressOwned = pokemonOwnedCount;
    progressTotal = pokemonVolumes.length;
    totalVolsText = `${pokemonVolumes.length} vols`;
  }

  const progressPercentage = progressTotal > 0 ? (progressOwned / progressTotal) * 100 : 0;

  // --- ALTERADO: Função para direcionar para a coleção correta ---
  const handleViewCollection = () => {
    if (currentBackground.title === "Super Onze") {
      setSelectedCollection(true);
    } else if (currentBackground.title === "Pokémon Adventures") {
      setSelectedPokemonCollection(true);
    }
  };

  // --- Renderização das coleções em tela cheia ---
  if (selectedCollection) {
    return <MangaCollection volumes={volumes} setVolumes={setVolumes} onBack={() => setSelectedCollection(false)} isAdmin={isAdmin} />;
  }
  if (selectedPokemonCollection) {
    return <PokemonCollection volumes={pokemonVolumes} setVolumes={setPokemonVolumes} onBack={() => setSelectedPokemonCollection(false)} isAdmin={isAdmin} />;
  }

  // --- Renderização da página principal ---
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <img src={logo} alt="Logo" className="absolute top-2 right-2 w-20 sm:w-24 md:w-28 h-auto z-50" style={{ objectFit: "contain" }} />

      {/* Hero Section */}
      <div
        className={`relative h-[60vh] sm:h-[70vh] flex items-center justify-start bg-cover bg-center transition-opacity duration-500 ease-in-out ${fadeClass}`} // <-- ALTERADO: Duração do fade
        style={{ backgroundImage: `url(${currentBackground.image})`, backgroundPosition: "center 30%" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="relative z-10 max-w-full sm:max-w-[50vw] mr-auto text-left px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4 bg-red-gradient bg-clip-text text-transparent">
            {currentBackground.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-4 justify-start text-xs sm:text-base">
            <span className="bg-crimson-red px-2 py-1 text-xs font-bold rounded animate-glow-red">★★★★★</span>
            <span className="text-gray-300">{currentBackground.subtitle}</span>
            <span className="text-gray-300">{currentBackground.meta}</span>
            <span className="text-gray-300">{totalVolsText}</span> {/* <-- ALTERADO: Contagem dinâmica */}
          </div>
          <p className="text-sm sm:text-lg text-gray-300 mb-4 sm:mb-8 leading-relaxed max-w-full sm:max-w-[50vw] mr-auto">
            {currentBackground.desc}
          </p>
          <div className="flex justify-start">
            <button
              onClick={handleViewCollection} // <-- ALTERADO: Função de clique dinâmica
              className="flex items-center gap-2 bg-red-gradient text-white px-5 sm:px-8 py-2 sm:py-3 rounded font-bold hover:scale-105 transition-all duration-1500 animate-glow-red text-sm sm:text-base"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
              Ver Coleção
            </button>
          </div>
          <div className="mt-2 sm:mt-3 flex justify-start">
            <div>
              <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Progresso</div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex-1 bg-gray-700 rounded-full h-2 w-24 sm:w-40">
                  <div
                    className="bg-red-gradient h-2 rounded-full transition-all duration-500 animate-glow-red"
                    style={{ width: `${progressPercentage}%` }} // <-- ALTERADO: Porcentagem dinâmica
                  />
                </div>
                <span className="text-xs sm:text-sm text-gray-300">{progressOwned}/{progressTotal}</span> {/* <-- ALTERADO: Contagem dinâmica */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carrossel Super Onze */}
      <div className="relative z-10 bg-black pt-2 sm:pt-4 pb-4 sm:pb-6">
        <div className="mb-4 sm:mb-8">
          <div className="px-3 sm:px-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Super Onze</h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="bg-crimson-red px-2 py-1 text-xs font-bold rounded">★★★★★</span>
                <span className="text-gray-400 text-xs sm:text-sm">2008-2011</span>
                <span className="text-gray-400 text-xs sm:text-sm">Esporte, Ação</span>
                <div className="bg-gray-700 rounded-full h-1 w-16 sm:w-24">
                  <div className="bg-crimson-red h-1 rounded-full transition-all duration-500" style={{ width: `${volumes.length > 0 ? (ownedCount / volumes.length) * 100 : 0}%` }} />
                </div>
                <span className="text-xs text-gray-400">{ownedCount}/{volumes.length}</span>
              </div>
            </div>
            <button onClick={() => setSelectedCollection(true)} className="text-crimson-red hover:text-white text-xs sm:text-sm transition-colors font-semibold">
              Ver todos →
            </button>
          </div>
          <div className="relative group perspective-1000">
            <button onClick={() => scrollVolumes('left')} disabled={scrollPos === 0} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-crimson-red/80 hover:scale-110 disabled:opacity-0">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button onClick={() => scrollVolumes('right')} disabled={scrollPos >= Math.max(0, volumes.length - 4)} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-crimson-red/80 hover:scale-110 disabled:opacity-0">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="overflow-hidden px-2 sm:px-6" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div className="flex gap-3 sm:gap-6 transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(calc(-${scrollPos * 25}% + ${dragOffset}px))` }}>
                {volumes.map((volume, index) => (
                  <div key={volume.id} className="flex-shrink-0 w-28 sm:w-40 group/item cursor-pointer card-3d" onClick={isAdmin ? () => toggleOwned(volume.id, 'super11') : undefined}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 sm:mb-4 group-hover:item:scale-110 transition-all duration-700 ease-in-out shadow-2xl">
                      <img src={volume.coverUrl} alt={volume.title} className={`w-full h-full object-cover transition-all duration-500 ${!volume.owned ? 'grayscale opacity-60' : 'group-hover:item:brightness-110'}`} />
                      <div className="absolute inset-0 bg-gradient-to-br from-crimson-red/0 via-transparent to-crimson-red/20 opacity-0 group-hover:item:opacity-100 transition-all duration-700 ease-in-out" />
                      <div className="absolute inset-0 border-2 border-transparent group-hover:item:border-crimson-red transition-all duration-500 rounded-xl" style={{ boxShadow: volume.owned ? '0 0 30px rgba(220, 20, 60, 0.3)' : 'none' }} />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 transform group-hover:item:scale-110 transition-all duration-300">
                        {volume.owned ? <div className="bg-green-600 p-1 sm:p-2 rounded-full shadow-lg animate-glow-red"><Check className="w-3 h-3 sm:w-4 sm:h-4" /></div> : <div className="bg-gray-600/80 p-1 sm:p-2 rounded-full shadow-lg backdrop-blur-sm"><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></div>}
                      </div>
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 transform group-hover:item:scale-110 transition-all duration-300">
                        <div className="bg-black/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border border-crimson-red/50 backdrop-blur-sm">#{volume.number}</div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:item:opacity-100 transition-all duration-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-semibold text-white group-hover:item:text-crimson-red transition-colors duration-300 truncate">Vol. {volume.number}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{volume.owned ? 'Na Coleção' : 'Adicionar'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Carrossel Pokémon */}
      <div className="relative z-10 bg-black pt-2 sm:pt-0 pb-2 sm:pb-3">
        <div className="mb-2 sm:mb-4">
          <div className="px-3 sm:px-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Pokémon Adventures</h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="bg-crimson-red px-2 py-1 text-xs font-bold rounded">★★★★★</span>
                <span className="text-gray-400 text-xs sm:text-sm">1997-Presente</span>
                <span className="text-gray-400 text-xs sm:text-sm">Aventura</span>
                <div className="bg-gray-700 rounded-full h-1 w-16 sm:w-24">
                  <div className="bg-crimson-red h-1 rounded-full transition-all duration-500" style={{ width: `${pokemonVolumes.length > 0 ? (pokemonOwnedCount / pokemonVolumes.length) * 100 : 0}%` }}/>
                </div>
                <span className="text-xs text-gray-400">{pokemonOwnedCount}/{pokemonVolumes.length}</span>
              </div>
            </div>
            <button onClick={() => setSelectedPokemonCollection(true)} className="text-crimson-red hover:text-white text-xs sm:text-sm transition-colors font-semibold">
              Ver todos →
            </button>
          </div>
          <div className="relative group perspective-1000">
            <button onClick={() => scrollPokemon('left')} disabled={pokemonScrollPos === 0} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-crimson-red/80 hover:scale-110 disabled:opacity-0">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button onClick={() => scrollPokemon('right')} disabled={pokemonScrollPos >= Math.max(0, pokemonVolumes.length - 4)} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-crimson-red/80 hover:scale-110 disabled:opacity-0">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="overflow-hidden px-2 sm:px-6" onTouchStart={handlePokemonTouchStart} onTouchMove={handlePokemonTouchMove} onTouchEnd={handlePokemonTouchEnd}>
              <div className="flex gap-3 sm:gap-6 transition-transform duration-700 ease-in-out" style={{ transform: `translateX(calc(-${pokemonScrollPos * 25}% + ${pokemonDragOffset}px))` }}>
                {pokemonVolumes.map((volume) => (
                  <div key={volume.id} className="flex-shrink-0 w-28 sm:w-40 group/item cursor-pointer card-3d" onClick={isAdmin ? () => toggleOwned(volume.id, 'pokemon') : undefined}>
                     <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 sm:mb-4 group-hover:item:scale-110 transition-all duration-700 ease-in-out shadow-2xl">
                      <img src={volume.coverUrl} alt={volume.title} className={`w-full h-full object-cover transition-all duration-500 ${!volume.owned ? 'grayscale opacity-60' : 'group-hover:item:brightness-110'}`} />
                      <div className="absolute inset-0 bg-gradient-to-br from-crimson-red/0 via-transparent to-crimson-red/20 opacity-0 group-hover:item:opacity-100 transition-all duration-700 ease-in-out" />
                      <div className="absolute inset-0 border-2 border-transparent group-hover:item:border-crimson-red transition-all duration-500 rounded-xl" style={{ boxShadow: volume.owned ? '0 0 30px rgba(220, 20, 60, 0.3)' : 'none' }} />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 transform group-hover:item:scale-110 transition-all duration-300">
                        {volume.owned ? <div className="bg-green-600 p-1 sm:p-2 rounded-full shadow-lg animate-glow-red"><Check className="w-3 h-3 sm:w-4 sm:h-4" /></div> : <div className="bg-gray-600/80 p-1 sm:p-2 rounded-full shadow-lg backdrop-blur-sm"><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></div>}
                      </div>
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 transform group-hover:item:scale-110 transition-all duration-300">
                        <div className="bg-black/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border border-crimson-red/50 backdrop-blur-sm">#{volume.number}</div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:item:opacity-100 transition-all duration-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-semibold text-white group-hover:item:text-crimson-red transition-colors duration-300 truncate">Vol. {volume.number}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{volume.owned ? 'Na Coleção' : 'Adicionar'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rodapé */}
      <footer className="w-full py-4 bg-black text-gray-500 text-xs border-t border-crimson-red/20 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
        <div className="flex-1 flex flex-col items-center">
          <div className="text-center font-semibold mb-1">© 2025 Manga Collection Tracker - Douglas Marinho Martins</div>
          {!isAdmin && <button className="mt-1 px-3 py-1 rounded bg-crimson-red text-white text-xs font-bold hover:bg-red-700 transition" onClick={handleAdminLogin}>Entrar como admin</button>}
          {isAdmin && <span className="mt-1 text-green-400 text-xs font-bold">Modo admin ativo</span>}
        </div>
        <div className="flex gap-4 items-center mt-3 sm:mt-0">
          <a href="https://github.com/M4RINH0/Manga_Collection_Tracker" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="GitHub do Projeto"><Github className="w-5 h-5" /></a>
          <a href="https://instagram.com/dmmartins_13" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Instagram"><Instagram className="w-5 h-5" /></a>
        </div>
      </footer>

      <style>{`.perspective-1000 { perspective: 1000px; } .card-3d { transform-style: preserve-3d; }`}</style>
    </div>
  );
};

export default MangaCarousel;