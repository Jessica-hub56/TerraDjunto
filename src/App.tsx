import React, { useState } from 'react';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import SearchBar from './components/SearchBar';
import QuickAccess from './components/QuickAccess';
import VirtualAssistant from './components/VirtualAssistant';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import { useLanguage } from './context/LanguageContext';

// Modals
import InteractiveMapModal from './components/modals/InteractiveMapModal';
import AccessModal from './components/modals/AccessModal';
import MapModal from './components/modals/MapModal';
import LegislationModal from './components/modals/LegislationModal';
import IncidentModal from './components/modals/IncidentModal';
import WasteModal from './components/modals/WasteModal';
import HelpModal from './components/modals/HelpModal';
import BulkyWasteModal from './components/modals/BulkyWasteModal';
import ConsultasPublicasModal from './components/modals/ConsultasPublicasModal';
import LegislacaoInfoModal from './components/modals/LegislacaoInfoModal';
import ComoParticiparModal from './components/modals/ComoParticiparModal';
import MapasInterativosModal from './components/modals/MapasInterativosModal';
import RegistoOcorrenciasModal from './components/modals/RegistoOcorrenciasModal';
import ParticipationModal from './components/modals/ParticipationModal';
import AboutModal from './components/modals/AboutModal';
import FaqModal from './components/modals/FaqModal';
import TermsModal from './components/modals/TermsModal';
import PrivacyModal from './components/modals/PrivacyModal';
import SupportModal from './components/modals/SupportModal';

function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLegislation, setSelectedLegislation] = useState<import('./data/legislation').LegislationItem | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { refreshTranslations, lang } = useLanguage();

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
    // Aplicar tradução no próximo frame para garantir que o conteúdo do modal já foi montado
    requestAnimationFrame(() => refreshTranslations());
  };
  const closeModal = () => {
    setActiveModal(null);
    setSelectedLegislation(null);
  };

  // Reaplica traduções quando o modal ativo muda ou quando o idioma muda
  React.useEffect(() => {
    requestAnimationFrame(() => refreshTranslations());
  }, [activeModal, lang, refreshTranslations]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header fixo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Header
          onAccessModal={() => openModal('access')}
          onHelpModal={() => openModal('help')}
          onInteractiveMapModal={() => openModal('interactive-map')}
          onMapModal={() => openModal('map')}
          onLegislationModal={() => openModal('legislation')}
          onIncidentModal={() => openModal('incident')}
          onWasteModal={() => openModal('waste')}
          onParticipationModal={() => openModal('participation')}
        />
      </div>

      {/* Conteúdo rolável com padding para compensar o header fixo */}
      <div className="flex-1 pt-16 mt-16 overflow-y-auto"> {/* pt-16 assume que o header tem 4rem (64px) de altura */}
        <main>
          {isAuthenticated && user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <>
              <HeroCarousel />
              {isAuthenticated && (
                <SearchBar
                  onMapModal={() => openModal('map')}
                  onLegislationModal={() => openModal('legislation')}
                  onIncidentModal={() => openModal('incident')}
                  onWasteModal={() => openModal('waste')}
                  onHelpModal={() => openModal('help')}
                  onParticipationModal={() => openModal('participation')}
                  openModal={openModal}
                  onLegislationSelect={item => {
                    setSelectedLegislation(item);
                    openModal('legislation');
                  }}
                />
              )}
              {isAuthenticated && (
                <QuickAccess
                  onMapModal={() => openModal('map')}
                  onLegislationModal={() => openModal('legislation')}
                  onIncidentModal={() => openModal('incident')}
                  onWasteModal={() => openModal('waste')}
                  onHelpModal={() => openModal('help')}
                  onParticipationModal={() => openModal('participation')}
                  openModal={openModal}
                />
              )}
            </>
          )}
        </main>

        <Footer
          onConsultasModal={() => openModal('consultas-publicas')}
          onLegislacaoModal={() => openModal('legislacao-info')}
          onComoParticiparModal={() => openModal('como-participar')}
          onMapasModal={() => openModal('mapas-interativos')}
          onRegistoModal={() => openModal('registo-ocorrencias')}
          onAboutModal={() => openModal('about')} 
          onFaqModal={ () => openModal ('faq')} 
          onPrivacyModal={ () => openModal('privacy')}
          onTermsModal={ () => openModal('terms') }
          disabled={!isAuthenticated}
          />
      </div>

      {/* Virtual Assistant (pode precisar de ajuste de posição) */}
      <VirtualAssistant onOpenModal={openModal} />

      {/* Modals */}
      <AccessModal
        isOpen={activeModal === 'access'}
        onClose={closeModal}
      />
      <MapModal
        isOpen={activeModal === 'map'}
        onClose={closeModal}
      />
      <LegislationModal
        isOpen={activeModal === 'legislation'}
        onClose={closeModal}
        isAdmin={false}
        selectedDocument={selectedLegislation}
      />
      <IncidentModal
        isOpen={activeModal === 'incident'}
        onClose={closeModal}
      />
      <WasteModal
        isOpen={activeModal === 'waste'}
        onClose={closeModal}
      />
      <HelpModal
        isOpen={activeModal === 'help'}
        onClose={closeModal}
        onSupportModal={() => openModal('support')}
      />
      <ParticipationModal
        isOpen={activeModal === 'participation'}
        onClose={closeModal}
      />
      <BulkyWasteModal
        isOpen={activeModal === 'bulky-waste'}
        onClose={closeModal}
      />
      <ConsultasPublicasModal
        isOpen={activeModal === 'consultas-publicas'}
        onClose={closeModal}
      />
      <LegislacaoInfoModal
        isOpen={activeModal === 'legislacao-info'}
        onClose={closeModal}
      />
      <ComoParticiparModal
        isOpen={activeModal === 'como-participar'}
        onClose={closeModal}
      />
      <MapasInterativosModal
        isOpen={activeModal === 'mapas-interativos'}
        onClose={closeModal}
      />
      <RegistoOcorrenciasModal
        isOpen={activeModal === 'registo-ocorrencias'}
        onClose={closeModal}
      />
      <InteractiveMapModal
        isOpen={activeModal === 'interactive-map'}
        onClose={closeModal}
      />
      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={closeModal}
      />
      <FaqModal
        isOpen={activeModal === 'faq'}
        onClose={closeModal}
      />
      <TermsModal
        isOpen={activeModal === 'terms'}
        onClose={closeModal}
      />
      <PrivacyModal
        isOpen={activeModal === 'privacy'}
        onClose={closeModal}
      />
      <SupportModal
        isOpen={activeModal === 'support'}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;
