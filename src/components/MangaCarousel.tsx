import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Plus, Check, Github, Instagram } from "lucide-react";
import MangaCollection from "./MangaCollection";
import { Volume } from 'src/types/Volume.ts';
import logo from '../assets/logo_1.png';
import background from '../assets/background_super11.jpeg';
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
      coverUrl: `/images/super11/${num}.jpg`, // <-- Caminho correto para produção
      description: `Volume ${index + 1} da série Super Onze, repleto de ação e aventuras emocionantes no mundo do futebol.`,
      releaseDate: `2010-${String((index % 12) + 1).padStart(2, '0')}-01`
    };
  });

const MangaCarousel = () => {
  // Ajuste o state inicial de volumes para vazio
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const [selectedCollection, setSelectedCollection] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  const ownedCount = volumes.filter(v => v.owned).length;

  const scrollVolumes = (direction: 'left' | 'right') => {
    const maxScroll = Math.max(0, volumes.length - 4);
    setScrollPos(pos =>
      direction === 'right'
        ? Math.min(pos + 1, maxScroll)
        : Math.max(pos - 1, 0)
    );
  };

  const toggleOwned = (volumeId: number) => {
    setVolumes(vols =>
      vols.map(v =>
        v.id === volumeId ? { ...v, owned: !v.owned } : v
      )
    );
  };

  // Estados para drag
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Largura de cada card (ajuste se necessário)
  const CARD_WIDTH = 112; // 28 * 4px (tailwind w-28) = 112px

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStartX.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Quantos cards o usuário tentou arrastar
    const movedCards = Math.round(dragOffset / CARD_WIDTH * -1);

    if (movedCards !== 0) {
      setScrollPos(pos => {
        const maxScroll = Math.max(0, volumes.length - 4);
        let next = pos + movedCards;
        if (next < 0) next = 0;
        if (next > maxScroll) next = maxScroll;
        return next;
      });
    }
    setDragOffset(0);
    touchStartX.current = null;
  };

  const [isAdmin, setIsAdmin] = useState(false);

  // Função para ativar admin
  const handleAdminLogin = () => {
    const senha = prompt("Digite a senha de admin:");
    if (senha === "dodax123") {
      setIsAdmin(true);
      alert("Modo admin ativado!");
    } else if (senha !== null) {
      alert("Senha incorreta!");
    }
  };

  // Função para salvar coleção no Firestore
  async function saveCollectionToFirebase(userId: string, volumes: Volume[]) {
    await setDoc(doc(db, "collections", userId), { volumes });
  }

  // Função para carregar coleção do Firestore
  async function loadCollectionFromFirebase(userId: string): Promise<Volume[] | null> {
    const docSnap = await getDoc(doc(db, "collections", userId));
    if (docSnap.exists()) {
      return docSnap.data().volumes;
    }
    return null;
  }

  const [userId] = useState<string>("admin-colecao");

  useEffect(() => {
    // Carrega do Firebase ao iniciar, se não existir nada, usa generateVolumes() como fallback
    loadCollectionFromFirebase(userId).then(data => {
      if (data) {
        setVolumes(data);
      } else {
        setVolumes(generateVolumes());
      }
    });
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    if (isAdmin) {
      saveCollectionToFirebase(userId, volumes);
    }
  }, [volumes, userId, isAdmin]);

  if (selectedCollection) {
    return (
      <MangaCollection
        volumes={volumes}
        setVolumes={setVolumes}
        onBack={() => setSelectedCollection(false)}
        isAdmin={isAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Logo no canto superior direito */}
      <img
        src={logo}
        alt="Logo Super Onze"
        className="absolute top-2 right-2 w-20 sm:w-24 md:w-28 h-auto z-50"
        style={{ objectFit: "contain" }}
      />

      {/* Hero Section */}
      <div
        className="relative h-[60vh] sm:h-[70vh] flex items-center justify-start bg-cover bg-center px-3 sm:px-6 pt-20 sm:pt-32"
        style={{
          backgroundImage: `url(${background})`,
          backgroundPosition: "center 30%"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="relative z-10 max-w-full sm:max-w-[50vw] mr-auto text-left">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4 bg-red-gradient bg-clip-text text-transparent">
            Super Onze
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-4 justify-start text-xs sm:text-base">
            <span className="bg-crimson-red px-2 py-1 text-xs font-bold rounded animate-glow-red">★★★★★</span>
            <span className="text-gray-300">2008-2011</span>
            <span className="text-gray-300">Esporte, Ação</span>
            <span className="text-gray-300">34 vols</span>
          </div>
          <p className="text-sm sm:text-lg text-gray-300 mb-4 sm:mb-8 leading-relaxed max-w-full sm:max-w-[50vw] mr-auto">
            Super Onze mistura futebol e aventura. Mamoru Endo tenta reviver o time da Escola Raimon com jogadores desmotivados, enfrentando desafios e técnicas especiais.
          </p>
          <div className="flex justify-start">
            <button
              onClick={() => setSelectedCollection(true)}
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
                    style={{ width: `${(ownedCount / volumes.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-gray-300">{ownedCount}/{volumes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative z-10 bg-black pt-6 sm:pt-10 pb-6 sm:pb-10">
        <div className="mb-8 sm:mb-16">
          <div className="px-3 sm:px-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Super Onze</h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="bg-crimson-red px-2 py-1 text-xs font-bold rounded">★★★★★</span>
                <span className="text-gray-400 text-xs sm:text-sm">2008-2011</span>
                <span className="text-gray-400 text-xs sm:text-sm">Esporte, Ação</span>
                <div className="bg-gray-700 rounded-full h-1 w-16 sm:w-24">
                  <div
                    className="bg-crimson-red h-1 rounded-full transition-all duration-500"
                    style={{ width: `${(ownedCount / volumes.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{ownedCount}/{volumes.length}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCollection(true)}
              className="text-crimson-red hover:text-white text-xs sm:text-sm transition-colors font-semibold"
            >
              Ver todos →
            </button>
          </div>
          <div className="relative group perspective-1000">
            <button
              onClick={() => scrollVolumes('left')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 p-2 sm:p-3 rounded-full
    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300
    hover:bg-crimson-red/80 hover:scale-110 disabled:opacity-0"
              disabled={scrollPos === 0}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => scrollVolumes('right')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 p-2 sm:p-3 rounded-full
    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300
    hover:bg-crimson-red/80 hover:scale-110 disabled:opacity-0"
              disabled={scrollPos >= Math.max(0, volumes.length - 4)}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="overflow-hidden px-2 sm:px-6"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex gap-3 sm:gap-6 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${scrollPos * 25}% + ${dragOffset}px))`
                }}
              >
                {volumes.map((volume, index) => (
                  <div
                    key={volume.id}
                    className="flex-shrink-0 w-28 sm:w-40 group/item cursor-pointer card-3d"
                    onClick={isAdmin ? () => toggleOwned(volume.id) : undefined}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 sm:mb-4 group-hover:item:scale-110 transition-all duration-500 shadow-2xl">
                      <img
                        src={volume.coverUrl}
                        alt={volume.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          !volume.owned ? 'grayscale opacity-60' : 'group-hover:item:brightness-110'
                        }`}
                      />
                      {/* 3D Hexagonal Overlay Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-crimson-red/0 via-transparent to-crimson-red/20 opacity-0 group-hover:item:opacity-100 transition-all duration-500" />
                      {/* Animated Border */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:item:border-crimson-red transition-all duration-500 rounded-xl"
                        style={{
                          boxShadow: volume.owned ? '0 0 30px rgba(220, 20, 60, 0.3)' : 'none'
                        }} />
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 transform group-hover/item:scale-110 transition-all duration-300">
                        {volume.owned ? (
                          <div className="bg-green-600 p-1 sm:p-2 rounded-full shadow-lg animate-glow-red">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                        ) : (
                          <div className="bg-gray-600/80 p-1 sm:p-2 rounded-full shadow-lg backdrop-blur-sm">
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                        )}
                      </div>
                      {/* Volume Number */}
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 transform group-hover/item:scale-110 transition-all duration-300">
                        <div className="bg-black/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border border-crimson-red/50 backdrop-blur-sm">
                          #{volume.number}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:item:opacity-100 transition-all duration-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-semibold text-white group-hover:item:text-crimson-red transition-colors duration-300 truncate">
                        Vol. {volume.number}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {volume.owned ? 'Na Coleção' : 'Adicionar'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé simples */}
      <footer className="w-full py-4 bg-black text-gray-500 text-xs border-t border-crimson-red/20 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
        {/* Centro: texto e botão */}
        <div className="flex-1 flex flex-col items-center">
          <div className="text-center font-semibold mb-1">
            © 2025 Manga Collection Tracker - Douglas Marinho Martins
          </div>
          {!isAdmin && (
            <button
              className="mt-1 px-3 py-1 rounded bg-crimson-red text-white text-xs font-bold hover:bg-red-700 transition"
              onClick={handleAdminLogin}
            >
              Entrar como admin
            </button>
          )}
          {isAdmin && (
            <span className="mt-1 text-green-400 text-xs font-bold">Modo admin ativo</span>
          )}
        </div>
        {/* Direita: ícones */}
        <div className="flex gap-4 items-center mt-3 sm:mt-0">
          <a
            href="https://github.com/M4RINH0/Manga_Collection_Tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            title="GitHub do Projeto"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/dmmartins_13"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </footer>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .card-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default MangaCarousel;
