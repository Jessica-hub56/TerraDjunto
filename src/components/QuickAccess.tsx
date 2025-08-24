import React, { useState } from 'react';
import { Map, Users, FileText, AlertTriangle, Trash2, HelpCircle, MapPin, Handshake, Gavel, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PDFUploadSection from './PDFUploadSection';
import { useAuth } from '../context/AuthContext';

interface QuickAccessProps {
  onMapModal: () => void;
  onLegislationModal: () => void;
  onIncidentModal: () => void;
  onWasteModal: () => void;
  onHelpModal: () => void;
  onParticipationModal: () => void;
  openModal: (modalName: string) => void;
}

const QuickAccess: React.FC<QuickAccessProps> = ({ 
  onMapModal, 
  onLegislationModal, 
  onIncidentModal, 
  onWasteModal, 
  onHelpModal,
  onParticipationModal,
  openModal,
}) => {
  const { lang } = useLanguage();

  const labels = {
    pt: {
      quickTitle: 'Acesso Rápido',
      backToTop: 'Voltar ao Topo',
      items: [
        { title: 'Mapa de Projetos', description: 'Visualize as intervenções planeadas e em curso no território' },
        { title: 'Participe', description: 'Envolva-se nos projetos e programas do seu município' },
        { title: 'Ferramentas de Gestão Territórial', description: 'Consulte toda a legislação sobre ordenamento do território' },
        { title: 'Gestão de Resíduos', description: 'Informações sobre recolha e serviços relacionados' },
        { title: 'Registo de Ocorrência', description: 'Reporte problemas no seu bairro ou comunidade' },
        { title: 'Ajuda', description: 'Tire suas dúvidas sobre a plataforma e serviços' },
      ],
    },
    en: {
      quickTitle: 'Quick Access',
      backToTop: 'Back to Top',
      items: [
        { title: 'Project Map', description: 'View planned and ongoing interventions in the territory' },
        { title: 'Participate', description: 'Get involved in your municipality’s projects and programs' },
        { title: 'Territorial Management Tools', description: 'Consult all legislation on land-use planning' },
        { title: 'Waste Management', description: 'Information about collection and related services' },
        { title: 'Incident Report', description: 'Report issues in your neighborhood or community' },
        { title: 'Help', description: 'Clear your doubts about the platform and services' },
      ],
    },
    fr: {
      quickTitle: 'Accès Rapide',
      backToTop: 'Retour en Haut',
      items: [
        { title: 'Carte des Projets', description: 'Visualisez les interventions prévues et en cours sur le territoire' },
        { title: 'Participer', description: 'Impliquez-vous dans les projets et programmes de votre commune' },
        { title: 'Outils de Gestion Territoriale', description: 'Consultez toute la législation sur l’aménagement du territoire' },
        { title: 'Gestion des Déchets', description: 'Informations sur la collecte et les services associés' },
        { title: 'Enregistrement d’Incident', description: 'Signalez des problèmes dans votre quartier ou communauté' },
        { title: 'Aide', description: 'Obtenez des réponses sur la plateforme et les services' },
      ],
    },
  } as const;
  const text = labels[lang];
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const accessItems = [
    {
      title: text.items[0].title,
      description: text.items[0].description,
      icon: MapPin,
      bgColor: 'bg-[#e8f5e8]',
      onClick: onMapModal
    },
   {
      title: text.items[1].title,
      description: text.items[1].description,
      icon: Handshake,
      bgColor: 'bg-[#e8f5e8]',
      onClick: onParticipationModal
    },
    {
      title: text.items[2].title,
      description: text.items[2].description,
      icon: Gavel,
      bgColor: 'bg-[#e8f5e8]',
      onClick: onLegislationModal
    },
    {
      title: text.items[3].title,
      description: text.items[3].description,
      icon: Trash2,
      bgColor: 'bg-[#e8f5e8]',
      onClick: onWasteModal
    },
    {
      title: text.items[4].title,
      description: text.items[4].description,
      icon: AlertTriangle,
      bgColor: 'bg-[#e8f5e8]',
      onClick: onIncidentModal
    },
    {
      title: text.items[5].title, 
      description: text.items[5].description,
      icon: HelpCircle,
      bgColor: 'bg-[#e8f5e8]',
      onClick: onHelpModal
    }
  ];

  return (
    <section className="mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{text.quickTitle}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={item.onClick}
                className={`${item.bgColor} rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group text-center`}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#2c7873] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-white" size={32} />
                  </div>
                </div>
                <div>
                  <h5 className="text-xl font-bold text-[#2c7873] mb-4">{item.title}</h5>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Back to Top Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToTop}
            className="bg-[#2c7873] hover:bg-[#1f5a56] text-white px-6 py-3 rounded-full shadow-lg transition-colors flex items-center space-x-2"
          >
            <ArrowUp size={20} />
            <span>{text.backToTop}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;