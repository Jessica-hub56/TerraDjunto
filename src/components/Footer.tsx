import React from 'react';
import { Phone, Mail, MapPin, Users, AlertTriangle, Map, BookOpen, Scale, BookUser, ScrollText, BookKey, FileQuestion } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onConsultasModal: () => void;
  onLegislacaoModal: () => void;
  onComoParticiparModal: () => void;
  onMapasModal: () => void;
  onRegistoModal: () => void;
  onFaqModal: () => void;
  onPrivacyModal: () => void;
  onTermsModal: () => void;
  onAboutModal: () => void;
  disabled?: boolean;
}

const Footer: React.FC<FooterProps> = ({ 
  onConsultasModal, 
  onLegislacaoModal, 
  onComoParticiparModal, 
  onMapasModal, 
  onRegistoModal,
  onFaqModal,
  onPrivacyModal,
  onTermsModal,
  onAboutModal,
  disabled = false,
}) => {
  const { lang } = useLanguage();
  const t = {
    pt: {
      aboutTitle: 'Sobre a Plataforma',
      aboutText: 'Terra Djunto visa promover a participação cívica no processo de tomada de decisão sobre políticas públicas em Cabo Verde.',
      emergency: 'Emergência',
      linksTitle: 'Links Rápidos',
      consultas: 'Consultas Públicas',
      registoOcorrencias: 'Registo de Ocorrências',
      legislacao: 'Legislação',
      comoParticipar: 'Como Participar',
      mapas: 'Mapas Interativos',
      instTitle: 'Institucional',
      sobreNos: 'Sobre Nós',
      termos: 'Termos e condicoes',
      privacidade: 'Politicas e privacidades',
      faq: 'Perguntas frequentes',
      contactosTitle: 'Contactos',
      telefone: 'Telefone:',
      email: 'Email:',
      addressName: 'NOSi, E.P.E',
      addressLine: 'Achada Grande Frente, Praia',
      copyright: 'Todos os direitos reservados.'
    },
    en: {
      aboutTitle: 'About the Platform',
      aboutText: 'Terra Djunto aims to promote civic participation in public policy decision-making in Cabo Verde.',
      emergency: 'Emergency',
      linksTitle: 'Quick Links',
      consultas: 'Public Consultations',
      registoOcorrencias: 'Incident Registry',
      legislacao: 'Legislation',
      comoParticipar: 'How to Participate',
      mapas: 'Interactive Maps',
      instTitle: 'Institutional',
      sobreNos: 'About Us',
      termos: 'Terms and Conditions',
      privacidade: 'Privacy Policy',
      faq: 'Frequently Asked Questions',
      contactosTitle: 'Contacts',
      telefone: 'Phone:',
      email: 'Email:',
      addressName: 'NOSi, E.P.E',
      addressLine: 'Achada Grande Frente, Praia',
      copyright: 'All rights reserved.'
    },
    fr: {
      aboutTitle: 'À propos de la Plateforme',
      aboutText: 'Terra Djunto vise à promouvoir la participation civique au processus de décision des politiques publiques au Cap-Vert.',
      emergency: 'Urgence',
      linksTitle: 'Liens Rapides',
      consultas: 'Consultations Publiques',
      registoOcorrencias: 'Registre des Incidents',
      legislacao: 'Législation',
      comoParticipar: 'Comment Participer',
      mapas: 'Cartes Interactives',
      instTitle: 'Institutionnel',
      sobreNos: 'À Propos de Nous',
      termos: 'Termes et Conditions',
      privacidade: 'Politique de Confidentialité',
      faq: 'Questions Fréquentes',
      contactosTitle: 'Contacts',
      telefone: 'Téléphone :',
      email: 'Email :',
      addressName: 'NOSi, E.P.E',
      addressLine: 'Achada Grande Frente, Praia',
      copyright: 'Tous droits réservés.'
    }
  } as const;
  const l = t[lang];
  return (
    <footer className="bg-[#004d47] text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sobre a Plataforma */}
          <div>
            <h5 className="text-lg font-semibold mb-4 border-b-2 border-[#6fb98f] pb-2 inline-block">
              {l.aboutTitle}
            </h5>
            <p className="text-gray-300 leading-relaxed mb-6">
              {l.aboutText}
            </p>
            <div className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-colors inline-block">
              <div className="flex items-center space-x-2">
                <Phone size={18} />
                <div>
                  <div className="font-semibold text-sm">{l.emergency}: 260 79 70</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Links Rápidos */}
          <div>
            <h5 className="text-lg font-semibold mb-4 border-b-2 border-[#6fb98f] pb-2 inline-block">{l.linksTitle}</h5>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onConsultasModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <Users size={16} />
                  <span>{l.consultas}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onRegistoModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <AlertTriangle size={16} />
                  <span>{l.registoOcorrencias}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onLegislacaoModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <Scale size={16} />
                  <span>{l.legislacao}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onComoParticiparModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <BookOpen size={16} />
                  <span>{l.comoParticipar}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onMapasModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <Map size={16} />
                  <span>{l.mapas}</span>
                </button>
              </li>
            </ul>
          </div>
          
          {/* Institucional */}
          <div>
            <h5 className="text-lg font-semibold mb-4 border-b-2 border-[#6fb98f] pb-2 inline-block">
              {l.instTitle}
            </h5>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={onAboutModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                <BookUser size={16} />
                <span>{l.sobreNos}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onTermsModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                <ScrollText size={16} />
                <span>{l.termos}</span>
                </button>
              </li>

              <li>
                <button 
                  onClick={onPrivacyModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                <BookKey size={16} />
                <span>{l.privacidade}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onFaqModal}
                  disabled={disabled}
                  className={`text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                <FileQuestion size={16} />
                <span>{l.faq}</span>
                </button>
              </li>
            </ul>
          </div>
          
          {/* Contactos */}
          <div>
            <h5 className="text-lg font-semibold mb-4 border-b-2 border-[#6fb98f] pb-2 inline-block">
              {l.contactosTitle}
            </h5>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#6fb98f] mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">{l.addressName}</div>
                  <div className="text-gray-300">{l.addressLine}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-[#6fb98f]" />
                <div>
                  <div className="font-semibold text-white">{l.telefone}</div>
                  <div className="text-gray-300">333 62 66</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-[#6fb98f]" />
                <div>
                  <div className="font-semibold text-white">{l.email}</div>
                  <div className="text-gray-300">terradjunto.cv@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-gray-600">
          <p className="text-gray-300">
            &copy; 2025 NOSi, E.P.E - {l.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;