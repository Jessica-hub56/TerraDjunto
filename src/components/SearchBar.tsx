import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { legislationDatabase, LegislationItem } from '../data/legislation';
import { municipalities } from '../data/municipalities';

const quickAccessItems = [
  {
    title: 'Mapa Interativo',
    description: 'Visualize as intervenções planeadas e em curso no território',
    type: 'map',
    modal: 'map',
  },
  {
    title: 'Participe',
    description: 'Envolva-se nos projetos e programas do seu município',
    type: 'participation',
    modal: 'participation',
  },
  {
    title: 'Ferramentas de Gestão Territórial',
    description: 'Consulte toda a legislação sobre ordenamento do território',
    type: 'legislation',
    modal: 'legislation',
  },
  {
    title: 'Gestão de Resíduos',
    description: 'Informações sobre recolha e serviços relacionados',
    type: 'waste',
    modal: 'waste',
  },
  {
    title: 'Registo de Ocorrência',
    description: 'Reporte problemas no seu bairro ou comunidade',
    type: 'incident',
    modal: 'incident',
  },
  {
    title: 'Ajuda',
    description: 'Tire suas dúvidas sobre a plataforma e serviços',
    type: 'help',
    modal: 'help',
  },
];

interface MunicipalityResult {
  municipality: string;
  neighborhood?: string;
}

type SuggestionType =
  | { type: 'legislation'; item: LegislationItem }
  | { type: 'municipality'; item: MunicipalityResult }
  | { type: 'quick'; item: typeof quickAccessItems[0] };

function normalize(str: string): string {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

interface SearchBarProps {
  onMapModal: () => void;
  onLegislationModal: () => void;
  onIncidentModal: () => void;
  onWasteModal: () => void;
  onHelpModal: () => void;
  onParticipationModal: () => void;
  openModal: (modalName: string) => void;
  onLegislationSelect?: (item: LegislationItem) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onMapModal,
  onLegislationModal,
  onIncidentModal,
  onWasteModal,
  onHelpModal,
  onParticipationModal,
  openModal,
  onLegislationSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const query = normalize(searchQuery.trim());
    const filteredLegislation = legislationDatabase
      .filter(item =>
        normalize(item.title).includes(query) ||
        normalize(item.reference).includes(query) ||
        normalize(item.description).includes(query) ||
        item.tags.some(tag => normalize(tag).includes(query))
      )
      .map(item => ({ type: 'legislation' as const, item }));

    const muniResults: MunicipalityResult[] = [];
    Object.entries(municipalities).forEach(([municipality, neighborhoods]) => {
      if (normalize(municipality).includes(query)) {
        muniResults.push({ municipality });
      }
      neighborhoods.forEach(n => {
        if (normalize(n).includes(query)) {
          muniResults.push({ municipality, neighborhood: n });
        }
      });
    });
    const filteredMunicipalities = muniResults.map(item => ({ type: 'municipality' as const, item }));

    const filteredQuick = quickAccessItems
      .filter(item =>
        normalize(item.title).includes(query) ||
        normalize(item.description).includes(query)
      )
      .map(item => ({ type: 'quick' as const, item }));

    setSuggestions([
      ...filteredLegislation,
      ...filteredMunicipalities,
      ...filteredQuick
    ]);
  }, [searchQuery]);

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: SuggestionType) => {
    setShowSuggestions(false);
    if (suggestion.type === 'legislation') {
      if (onLegislationSelect) {
        onLegislationSelect(suggestion.item);
      } else {
        onLegislationModal();
      }
    } else if (suggestion.type === 'municipality') {
      // Abrir mapa para o município/bairro
      onMapModal();
    } else if (suggestion.type === 'quick') {
      switch (suggestion.item.modal) {
        case 'map':
          onMapModal();
          break;
        case 'legislation':
          if (onLegislationSelect) {
            onLegislationSelect(legislationDatabase[0]); // fallback para o primeiro item
          } else {
            onLegislationModal();
          }
          break;
        case 'incident':
          onIncidentModal();
          break;
        case 'waste':
          onWasteModal();
          break;
        case 'help':
          onHelpModal();
          break;
        case 'participation':
          onParticipationModal();
          break;
        default:
          openModal(suggestion.item.modal);
      }
    }
    // Futuro: para município/bairro, pode passar dados específicos para o modal de mapa ou ocorrência
  };

  return (
    <section className="mb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto relative">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Pesquise por legislação, municípios, bairros, atalhos..."
              className="flex-1 px-6 py-4 text-lg border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
              autoComplete="off"
            />
            <button
              className="bg-[#2c7873] hover:bg-[#1f5a56] text-white px-8 py-4 rounded-r-lg transition-colors flex items-center space-x-2"
              tabIndex={-1}
              type="button"
            >
              <Search size={20} />
              <span>Pesquisar</span>
            </button>
          </div>
          {showSuggestions && searchQuery.trim() && (
            <div className="absolute left-0 right-0 z-50 bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 max-h-80 overflow-y-auto">
              {suggestions.length === 0 ? (
                <div className="p-4 text-gray-500">Nenhuma sugestão encontrada.</div>
              ) : (
                <ul>
                  {suggestions.map((suggestion, idx) => {
                    if (suggestion.type === 'legislation') {
                      const item = suggestion.item;
                      return (
                        <li
                          key={`legislation-${item.id}`}
                          className="px-4 py-3 cursor-pointer hover:bg-[#e8f5e8] border-b last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <span className="font-semibold text-[#2c7873]">{item.title}</span>
                          <span className="block text-xs text-gray-500">Legislação &middot; {item.reference}</span>
                        </li>
                      );
                    }
                    if (suggestion.type === 'municipality') {
                      const item = suggestion.item;
                      return (
                        <li
                          key={`municipality-${item.municipality}-${item.neighborhood || ''}-${idx}`}
                          className="px-4 py-3 cursor-pointer hover:bg-[#e8f5e8] border-b last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <span className="font-semibold text-[#2c7873]">{item.municipality}</span>
                          {item.neighborhood && (
                            <span className="text-gray-700"> &rarr; {item.neighborhood}</span>
                          )}
                          <span className="block text-xs text-gray-500">Município/Bairro</span>
                        </li>
                      );
                    }
                    if (suggestion.type === 'quick') {
                      const item = suggestion.item;
                      return (
                        <li
                          key={`quick-${item.title}`}
                          className="px-4 py-3 cursor-pointer hover:bg-[#e8f5e8] border-b last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <span className="font-semibold text-[#2c7873]">{item.title}</span>
                          <span className="block text-xs text-gray-500">Acesso Rápido</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
