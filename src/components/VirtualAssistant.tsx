import React, { useEffect, useMemo, useState } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// Tipos
type Msg = { type: 'user' | 'bot'; content: string };

interface VirtualAssistantProps {
  onOpenModal?: (name: string, options?: { tab?: 'login' | 'register' }) => void;
}

const STORAGE_KEY = 'vaMessages';

const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ onOpenModal }) => {
  const { isAuthenticated } = useAuth();
  const { lang } = useLanguage();

  // Estado
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);

  // Labels por idioma
  const L = useMemo(() => {
    const base = {
      pt: {
        header: 'Assistente Virtual - Terra Djunto',
        hi: 'Olá! Sou a assistente virtual da plataforma Terra Djunto. Como posso ajudar hoje? Pode perguntar sobre:',
        placeholder: isAuthenticated ? 'Digite a sua pergunta...' : 'Faça login para acesso completo',
        suggestions: ['login', 'registar', 'suporte', 'legislação', 'mapa', 'ocorrência', 'participar'],
        clear: 'Limpar',
      },
      en: {
        header: 'Virtual Assistant - Terra Djunto',
        hi: 'Hello! I am the platform virtual assistant. How can I help? You can ask about:',
        placeholder: isAuthenticated ? 'Type your question...' : 'Login for full access',
        suggestions: ['login', 'register', 'support', 'legislation', 'map', 'incident', 'participate'],
        clear: 'Clear',
      },
      fr: {
        header: 'Assistant Virtuel - Terra Djunto',
        hi: 'Bonjour! Je suis l’assistant virtuel de la plateforme. Comment puis-je aider? Vous pouvez demander sur :',
        placeholder: isAuthenticated ? 'Saisissez votre question...' : 'Connectez-vous pour un accès complet',
        suggestions: ['login', 'inscription', 'support', 'législation', 'carte', 'incident', 'participer'],
        clear: 'Effacer',
      },
    } as const;
    return base[lang];
  }, [lang, isAuthenticated]);

  // Inicialização / persistência
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
      else setMessages([{ type: 'bot', content: L.hi }]);
    } catch {
      setMessages([{ type: 'bot', content: L.hi }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  // Atualiza saudação quando muda o idioma
  useEffect(() => {
    if (messages.length === 0 || messages[0].type !== 'bot') {
      setMessages([{ type: 'bot', content: L.hi }]);
    } else {
      setMessages(prev => [{ type: 'bot', content: L.hi }, ...prev.slice(1)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L.hi]);

  // Intenções a partir do texto
  const parseIntent = (text: string) => {
    const t = text.toLowerCase();
    const intents = [
      { name: 'login', re: /(login|entrar|iniciar sessão|sign in|connexion)/ },
      { name: 'register', re: /(registar|cadastro|criar conta|register|inscription)/ },
      { name: 'support', re: /(suporte|contactar|ajuda técnica|support)/ },
      { name: 'help', re: /(ajuda|faq|perguntas|help|aide)/ },
      { name: 'legislation', re: /(legisla[cç][aã]o|lei|normas|legislation|l[ée]gislation)/ },
      { name: 'map', re: /(mapa|map|carte|interativo|interactive)/ },
      { name: 'incident', re: /(ocorr[êe]ncia|den[uú]ncia|registo|incident)/ },
      { name: 'participation', re: /(participar|participa[cç][aã]o|consulta p[úu]blica|participate|participer)/ },
    ] as const;
    const found = intents.find(i => i.re.test(t));
    return found?.name || 'general';
  };

  const replyFor = (text: string): { reply: string; action?: { name: string; options?: { tab?: 'login' | 'register' } } } => {
    const intent = parseIntent(text);
    switch (intent) {
      case 'login':
        return {
          reply: lang === 'fr'
            ? 'Je peux ouvrir le formulaire d’accès. Si vous n’avez pas de compte, choisissez « S’inscrire ».'
            : lang === 'en'
              ? 'I can open the access form. If you do not have an account, choose "Register".'
              : 'Posso abrir o formulário de acesso. Se ainda não tem conta, escolha "Registar".',
          action: { name: 'access', options: { tab: 'login' } }
        };
      case 'register':
        return {
          reply: lang === 'fr'
            ? 'Pour créer un compte, remplissez Nom, Email, NIF et mot de passe. Ouvrir l’inscription?'
            : lang === 'en'
              ? 'To create an account, fill Name, Email, NIF and password. Open registration?'
              : 'Para criar conta, preencha Nome, Email, NIF e palavra‑passe. Abrir registo?',
          action: { name: 'access', options: { tab: 'register' } }
        };
      case 'support':
        return { reply: lang === 'fr' ? 'Ouverture du support.' : lang === 'en' ? 'Opening support.' : 'A abrir suporte.', action: { name: 'support' } };
      case 'help':
        return { reply: lang === 'fr' ? 'Ouverture de l’aide.' : lang === 'en' ? 'Opening Help.' : 'A abrir Ajuda.', action: { name: 'help' } };
      case 'legislation':
        return { reply: lang === 'fr' ? 'Ouverture de la Législation.' : lang === 'en' ? 'Opening Legislation.' : 'A abrir Legislação.', action: { name: 'legislation' } };
      case 'map':
        return { reply: lang === 'fr' ? 'Ouverture des cartes.' : lang === 'en' ? 'Opening maps.' : 'A abrir mapas.', action: { name: 'map' } };
      case 'incident':
        return { reply: lang === 'fr' ? 'Ouvrir le registre d’incident?' : lang === 'en' ? 'Open incident register?' : 'Abrir registo de ocorrência?', action: { name: 'incident' } };
      case 'participation':
        return { reply: lang === 'fr' ? 'Ouverture des consultations publiques.' : lang === 'en' ? 'Opening public consultations.' : 'A abrir consultas públicas.', action: { name: 'consultas-publicas' } };
      default:
        return {
          reply:
            lang === 'fr'
              ? "Merci pour votre message. Je peux aider avec: login, inscription, législation, carte, incident, participer, support."
              : lang === 'en'
                ? 'Thanks for your message. I can help with: login, register, legislation, map, incident, participate, support.'
                : 'Obrigado pela sua mensagem. Posso ajudar com: login, registar, legislação, mapa, ocorrência, participar, suporte.'
        };
    }
  };

  const send = (text?: string) => {
    const toSend = (text ?? message).trim();
    if (!toSend) return;
    setMessages(prev => [...prev, { type: 'user', content: toSend }]);
    setMessage('');
    setTyping(true);
    const { reply, action } = replyFor(toSend);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: reply }]);
      setTyping(false);
      if (action) onOpenModal?.(action.name, action.options);
    }, 600);
  };

  const handleSuggestion = (s: string) => send(s);

  const clearChat = () => setMessages([{ type: 'bot', content: L.hi }]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#2c7873] hover:bg-[#1f5a56] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <div className="relative">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-[#2c7873] to-[#6fb98f] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-[#2c7873] text-white p-4 flex items-center justify-between">
            <span className="font-semibold">{L.header}</span>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} title={L.clear} className="text-white hover:text-gray-200 transition-colors">
                <Trash2 size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="h-80 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-4 ${msg.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-lg max-w-xs ${msg.type === 'user' ? 'bg-[#2c7873] text-white ml-auto' : 'bg-[#f0f7f4] text-gray-800'}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {typing && (
              <div className="mb-4">
                <div className="inline-block p-3 rounded-lg max-w-xs bg-[#f0f7f4] text-gray-800">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  </span>
                </div>
              </div>
            )}

            {messages.length <= 1 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {L.suggestions.map((s, idx) => (
                    <button key={idx} onClick={() => handleSuggestion(s)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={L.placeholder}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
              />
              <button onClick={() => send()} className="bg-[#2c7873] hover:bg-[#1f5a56] text-white p-2 rounded-lg transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualAssistant;
