import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'pt' | 'en' | 'fr';

type LanguageContextType = {
  lang: Lang;
  setLanguage: (l: Lang) => void;
  refreshTranslations: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_KEY = 'appLang';

const translations: Record<Lang, Record<string, string>> = {
  pt: {},
  en: {
    // Header / Menus / Quick Access
    'Acesso Rápido': 'Quick Access',
    'Mapa Interativo': 'Interactive Map',
    'Participe': 'Participate',
    'Ferramentas de Gestão Territórial': 'Territorial Management Tools',
    'Gestão de Resíduos': 'Waste Management',
    'Registo de Ocorrência': 'Incident Report',
    'Ajuda': 'Help',
    'Aceder': 'Access',
    'Conta do utilizador': 'User account',
    'Terminar sessão': 'Sign out',

    // Assistant / Titles
    'Assistente Virtual - Terra Djunto': 'Virtual Assistant - Terra Djunto',
    'Painel de Administração': 'Administration Dashboard',
    'Relatórios de Participação': 'Participation Reports',

    // Export / Email
    'Opções de Exportação:': 'Export Options:',
    'Enviar por Email': 'Send by Email',
    'Pré-visualização do Email': 'Email Preview',
    'Email do remetente (destinatário)': 'Recipient email',
    'Conteúdo': 'Content',

    // Language names
    'Português': 'Portuguese',
    'English': 'English',
    'Français': 'French',

    // Buttons / Common
    'Fechar': 'Close',
    'Enviar': 'Send',
    'Cancelar': 'Cancel',
    'PDF': 'PDF',
    'Excel': 'Excel',
    'Zoom': 'Zoom',
    'Cima': 'Up',
    'Baixo': 'Down',
    'Pré-visualização': 'Preview',
    'Renomear': 'Rename',
    'Remover': 'Remove',
    'Ativo': 'Active',
    'Ativar': 'Activate',

    // Geospatial section
    'Dados Geoespaciais': 'Geospatial Data',
    'Carregar ficheiros': 'Upload files',
    'Camadas carregadas': 'Loaded layers',

    // Accessibility
    'Tamanho do texto': 'Text size',
    'Aumentar letra': 'Increase text',
    'Diminuir letra': 'Decrease text',
    'Ler em voz alta': 'Read aloud',
    'Parar leitura': 'Stop reading',

    // Access / Auth
    'Aceder à Plataforma': 'Access the Platform',
    'Login': 'Login',
    'Registar': 'Register',
    'Email': 'Email',
    'Palavra-passe': 'Password',
    'Confirmar Palavra-passe': 'Confirm Password',
    'Lembrar-me': 'Remember me',
    'Entrar': 'Sign in',

    // Support modal
    'Contactar Suporte': 'Contact Support',
    'Assunto': 'Subject',
    'Email de contacto': 'Contact email',
    'Descrição do pedido': 'Request description',
    'Selecionar ficheiros': 'Select files',

    // Quick access title/button
    'Voltar ao Topo': 'Back to Top',
  },
  fr: {
    // Header / Menus / Quick Access
    'Acesso Rápido': 'Accès Rapide',
    'Mapa Interativo': 'Carte Interactive',
    'Participe': 'Participer',
    'Ferramentas de Gestão Territórial': 'Outils de Gestion Territoriale',
    'Gestão de Resíduos': 'Gestion des Déchets',
    'Registo de Ocorrência': 'Enregistrement d’Incident',
    'Ajuda': 'Aide',
    'Aceder': 'Accéder',
    'Conta do utilizador': 'Compte utilisateur',
    'Terminar sessão': 'Déconnexion',

    // Assistant / Titles
    'Assistente Virtual - Terra Djunto': 'Assistant Virtuel - Terra Djunto',
    'Painel de Administração': 'Tableau de Bord d’Administration',
    'Relatórios de Participação': 'Rapports de Participation',

    // Export / Email
    'Opções de Exportação:': 'Options d’Exportation :',
    'Enviar por Email': 'Envoyer par Email',
    'Pré-visualização do Email': 'Aperçu de l’Email',
    'Email do remetente (destinatário)': 'Email du destinataire',
    'Conteúdo': 'Contenu',

    // Language names
    'Português': 'Portugais',
    'English': 'Anglais',
    'Français': 'Français',

    // Buttons / Common
    'Fechar': 'Fermer',
    'Enviar': 'Envoyer',
    'Cancelar': 'Annuler',
    'PDF': 'PDF',
    'Excel': 'Excel',
    'Zoom': 'Zoom',
    'Cima': 'Haut',
    'Baixo': 'Bas',
    'Pré-visualização': 'Aperçu',
    'Renomear': 'Renommer',
    'Remover': 'Supprimer',
    'Ativo': 'Actif',
    'Ativar': 'Activer',

    // Geospatial section
    'Dados Geoespaciais': 'Données géospatiales',
    'Carregar ficheiros': 'Téléverser des fichiers',
    'Camadas carregadas': 'Couches chargées',

    // Accessibility
    'Tamanho do texto': 'Taille du texte',
    'Aumentar letra': 'Augmenter le texte',
    'Diminuir letra': 'Diminuer le texte',
    'Ler em voz alta': 'Lire à voix haute',
    'Parar leitura': 'Arrêter la lecture',

    // Access / Auth
    'Aceder à Plataforma': 'Accéder à la Plateforme',
    'Login': 'Connexion',
    'Registar': 'S’inscrire',
    'Email': 'E-mail',
    'Palavra-passe': 'Mot de passe',
    'Confirmar Palavra-passe': 'Confirmer le mot de passe',
    'Lembrar-me': 'Se souvenir de moi',
    'Entrar': 'Se connecter',

    // Support modal
    'Contactar Suporte': 'Contacter le Support',
    'Assunto': 'Objet',
    'Email de contacto': 'Email de contact',
    'Descrição do pedido': 'Description de la demande',
    'Selecionar ficheiros': 'Sélectionner des fichiers',

    // Quick access title/button
    'Voltar ao Topo': 'Retour en Haut',
  }
};

function applyLanguage(lang: Lang) {
  document.documentElement.setAttribute('lang', lang);
  const map = translations[lang];

  if (!map || Object.keys(map).length === 0) return; // pt mantém original

  const elements = Array.from(document.querySelectorAll('body *')) as HTMLElement[];
  for (const el of elements) {
    // Apenas elementos de folha (sem filhos) para não destruir estrutura
    if (el.children.length > 0) continue;
    const original = el.getAttribute('data-i18n-original') ?? el.textContent?.trim() ?? '';
    if (!el.getAttribute('data-i18n-original')) {
      el.setAttribute('data-i18n-original', original);
    }
    const source = lang === 'pt' ? (el.getAttribute('data-i18n-original') || '') : original;
    if (!source) continue;
    const translated = map[source];
    if (lang === 'pt') {
      // Reverter sempre para o original quando PT
      el.textContent = el.getAttribute('data-i18n-original') || el.textContent || '';
    } else if (translated) {
      // Correspondência exata
      el.textContent = translated;
    } else {
      // Tradução parcial por substituição de substrings conhecidas
      let transformed = source;
      for (const [k, v] of Object.entries(map)) {
        if (!k) continue;
        if (transformed.includes(k)) {
          transformed = transformed.split(k).join(v);
        }
      }
      if (transformed !== source) {
        el.textContent = transformed;
      }
    }
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = (localStorage.getItem(LANG_KEY) as Lang) || 'pt';
    return saved;
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    // aplica tradução uma vez após a mudança de idioma
    const id = window.requestAnimationFrame(() => applyLanguage(lang));
    return () => window.cancelAnimationFrame(id);
  }, [lang]);

  const setLanguage = (l: Lang) => setLang(l);
  const refreshTranslations = () => applyLanguage(lang);

  const value = useMemo(() => ({ lang, setLanguage, refreshTranslations }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage deve ser usado dentro de LanguageProvider');
  return ctx;
};
