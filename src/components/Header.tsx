import type React from "react"
import { useState, useEffect } from "react"
import { Globe, Eye, HelpCircle, User, ChevronDown, LogOut, MapPin, Trash2, AlertTriangle, Gavel, Handshake, Menu, MapPinned, LogIn, Lock, X
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useLanguage } from "../context/LanguageContext"

interface HeaderProps {
  onAccessModal: () => void
  onHelpModal: () => void
  onInteractiveMapModal: () => void
  onMapModal?: () => void
  onLegislationModal?: () => void
  onIncidentModal?: () => void
  onWasteModal?: () => void
  onParticipationModal?: () => void
}

const Header: React.FC<HeaderProps> = ({
  onAccessModal,
  onHelpModal,
  onInteractiveMapModal,
  onMapModal,
  onLegislationModal,
  onIncidentModal,
  onWasteModal,
  onParticipationModal,
}) => {
  const [languageOpen, setLanguageOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const [servicesPreviewOpen, setServicesPreviewOpen] = useState(false)
  const { lang, setLanguage } = useLanguage()
  const [speaking, setSpeaking] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Verificar se está em modo mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  const menu = {
    pt: {
      quick: "Acesso Rápido",
      map: "Eco Pontos",
      participate: "Participe",
      tools: "Ferramentas de Gestão Territórial",
      waste: "Gestão de Resíduos",
      incident: "Registo de Ocorrência",
      help: "Ajuda",
    },
    en: {
      quick: "Quick Access",
      map: "Eco Points Map",
      participate: "Participate",
      tools: "Territorial Management Tools",
      waste: "Waste Management",
      incident: "Incident Report",
      help: "Help",
    },
    fr: {
      quick: "Accès Rapide",
      map: "Carte ÉcoPoints",
      participate: "Participer",
      tools: "Outils de Gestion Territoriale",
      waste: "Gestion des Déchets",
      incident: "Enregistrement d’Incident",
      help: "Aide",
    },
  }[lang]

  const services = [
    {
      id: "map",
      title: "Mapas de Projetos",
      description: "Explore mapas detalhados do território",
      icon: <MapPin size={16} />,
      category: "Navegação",
    },
    {
      id: "legislation",
      title: "Legislação",
      description: "Consulte leis e regulamentos",
      icon: <Gavel size={16} />,
      category: "Documentos",
    },
    {
      id: "incident",
      title: "Registo de Ocorrências",
      description: "Reporte problemas no território",
      icon: <AlertTriangle size={16} />,
      category: "Serviços",
    },
    {
      id: "waste",
      title: "Gestão de Resíduos",
      description: "Informações sobre recolha de lixo",
      icon: <Trash2 size={16} />,
      category: "Ambiente",
    },
    {
      id: "participation",
      title: "Participação Cidadã",
      description: "Participe nas decisões públicas",
      icon: <Handshake size={16} />,
      category: "Participação",
    },
    {
      id: "help",
      title: "Ajuda e Suporte",
      description: "Obtenha ajuda e suporte técnico",
      icon: <HelpCircle size={16} />,
      category: "Suporte",
    },
  ]

  const increaseFontSize = () => {
    const currentSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    document.documentElement.style.fontSize = `${currentSize + 1}px`
  }

  const decreaseFontSize = () => {
    const currentSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    if (currentSize > 12) {
      document.documentElement.style.fontSize = `${currentSize - 1}px`
    }
  }

  const readAloud = () => {
    const synth = window.speechSynthesis
    if (!synth) {
      alert("Leitura em voz alta não suportada neste navegador.")
      return
    }
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      return
    }
    const selection = window.getSelection?.()?.toString()
    const text = selection && selection.trim().length > 0 ? selection : document.body.innerText
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "pt-PT"
    utter.onend = () => setSpeaking(false)
    setSpeaking(true)
    synth.speak(utter)
  }

  // Função para fechar o menu mobile quando um item é clicado
  const handleMobileMenuItemClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-gray-200 text-white py-4 shadow-lg mb-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Botão do menu hamburguer para mobile */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center space-x-2 p-2 text-white bg-[#004d47] hover:bg-[#00332f] rounded transition-colors"
                title="Menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
            
            {/* Menu lateral para mobile */}
            {isMobile && mobileMenuOpen && (
              <div className="fixed inset-0 z-50 flex">
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setMobileMenuOpen(false)}
                ></div>
                <div className="relative bg-white w-80 max-w-full h-full overflow-y-auto z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  </div>
                  
                  {/* Conteúdo do menu mobile */}
                  <div className="p-4">
                    {/* Botões de idioma e acessibilidade para mobile */}
                    {isAuthenticated && (
                      <>
                        <div className="mb-4">
                          <button
                            onClick={() => setLanguageOpen(!languageOpen)}
                            className="flex items-center justify-between w-full p-3 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <div className="flex items-center">
                              <Globe size={18} className="mr-2" />
                              <span>Idioma</span>
                            </div>
                            <ChevronDown size={14} className={`transform ${languageOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {languageOpen && (
                            <div className="mt-2 ml-4 bg-white rounded-lg shadow-md py-2">
                              <button
                                onClick={() => { setLanguage("pt"); handleMobileMenuItemClick(); }}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                              >
                                <img src="https://flagcdn.com/w20/pt.png" alt="PT" className="w-5" />
                                <span>Português</span>
                              </button>
                              <button
                                onClick={() => { setLanguage("en"); handleMobileMenuItemClick(); }}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                              >
                                <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5" />
                                <span>English</span>
                              </button>
                              <button
                                onClick={() => { setLanguage("fr"); handleMobileMenuItemClick(); }}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                              >
                                <img src="https://flagcdn.com/w20/fr.png" alt="FR" className="w-5" />
                                <span>Français</span>
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <button
                            onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                            className="flex items-center justify-between w-full p-3 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <div className="flex items-center">
                              <Eye size={18} className="mr-2" />
                              <span>Acessibilidade</span>
                            </div>
                            <ChevronDown size={14} className={`transform ${accessibilityOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {accessibilityOpen && (
                            <div className="mt-2 ml-4 bg-white rounded-lg shadow-md py-2">
                              <div className="px-4 py-2 text-sm font-semibold text-gray-600 border-b">Tamanho do texto</div>
                              <button
                                onClick={() => { increaseFontSize(); handleMobileMenuItemClick(); }}
                                className="w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                              >
                                Aumentar letra
                              </button>
                              <button
                                onClick={() => { decreaseFontSize(); handleMobileMenuItemClick(); }}
                                className="w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                              >
                                Diminuir letra
                              </button>
                              <div className="border-t">
                                <button
                                  onClick={() => { readAloud(); handleMobileMenuItemClick(); }}
                                  className="w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                                >
                                  {speaking ? "Parar leitura" : "Ler em voz alta"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <button
                            onClick={() => { onInteractiveMapModal(); handleMobileMenuItemClick(); }}
                            className="flex items-center w-full p-3 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <MapPinned size={18} className="mr-2" />
                            <span>{menu.map}</span>
                          </button>
                        </div>
                      </>
                    )}
                    
                    {/* Menu de serviços para não autenticados */}
                    {!isAuthenticated && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Serviços Disponíveis</h3>
                        <p className="text-sm text-gray-600 mb-3">Faça login para aceder aos serviços</p>
                        
                        {services.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => { onAccessModal(); handleMobileMenuItemClick(); }}
                            className="relative px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 group"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-gray-400 mt-1">{service.icon}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">{service.title}</h4>
                                  <Lock size={12} className="text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">{service.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          title="Fazer Login"
                          onClick={() => { onAccessModal(); handleMobileMenuItemClick(); }}
                          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                        >
                          Fazer Login para Aceder
                        </button>
                      </div>
                    )}
                    
                    {/* Menu rápido para autenticados */}
                    {isAuthenticated && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Rápido</h3>
                        
                        <button
                          title="Mapas de Projetos"
                          onClick={() => { onMapModal?.() || onInteractiveMapModal(); handleMobileMenuItemClick(); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 mb-2 rounded text-gray-800"
                        >
                          <MapPin size={16} />
                          Mapas de Projetos
                        </button>
                        
                        <button
                          title="Participe"
                          onClick={() => { onParticipationModal?.(); handleMobileMenuItemClick(); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 mb-2 rounded text-gray-800"
                        >
                          <Handshake size={16} />
                          {menu.participate}
                        </button>
                        
                        <button
                          title="Ferramentas de Gestão Territória"
                          onClick={() => { onLegislationModal?.(); handleMobileMenuItemClick(); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 mb-2 rounded text-gray-800"
                        >
                          <Gavel size={16} />
                          {menu.tools}
                        </button>
                        
                        <button
                          title="Gestão de Resíduos"
                          onClick={() => { onWasteModal?.(); handleMobileMenuItemClick(); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 mb-2 rounded text-gray-800"
                        >
                          <Trash2 size={16} />
                          {menu.waste}
                        </button>
                        
                        <button
                          title="Registo de Ocorrência"
                          onClick={() => { onIncidentModal?.(); handleMobileMenuItemClick(); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 mb-2 rounded text-gray-800"
                        >
                          <AlertTriangle size={16} />
                          {menu.incident}
                        </button>
                        
                        <button
                          title="Ajuda"
                          onClick={() => { onHelpModal(); handleMobileMenuItemClick(); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 mb-2 rounded text-gray-800"
                        >
                          <HelpCircle size={16} />
                          {menu.help}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Menu de serviços para desktop (não autenticado) */}
            {!isAuthenticated && !isMobile && (
              <div className="relative" onMouseLeave={() => setServicesPreviewOpen(false)}>
                <button
                  onClick={() => setServicesPreviewOpen(!servicesPreviewOpen)}
                  className="flex items-center space-x-2 p-2 text-white bg-[#004d47] hover:bg-[#00332f] rounded transition-colors"
                  title="Ver Serviços Disponíveis"
                >
                  <Menu size={18} />
                </button>
                {servicesPreviewOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-4 z-50 text-gray-800">
                    <div className="px-4 pb-3 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Serviços Disponíveis</h3>
                      <p className="text-sm text-gray-600">Faça login para aceder aos serviços</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={onAccessModal}
                          className="relative px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-gray-400 mt-1">{service.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{service.title}</h4>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {service.category}
                                  </span>
                                  <Lock size={12} className="text-gray-400" />
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">{service.description}</p>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                              Clique para fazer login
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 pt-3 border-t border-gray-200">
                      <button
                        title="Fazer Login"
                        onClick={onAccessModal}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                      >
                        Fazer Login para Aceder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Menu rápido para desktop (autenticado) */}
            {isAuthenticated && !isMobile && (
              <div className="relative" onMouseLeave={() => setQuickOpen(false)}>
                <button
                  onClick={() => setQuickOpen(!quickOpen)}
                  className="flex items-center space-x-2 p-2 text-white bg-[#004d47] hover:bg-[#00332f] rounded transition-colors"
                  title={menu.quick}
                >
                  <Menu size={18} />
                </button>
                {quickOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50 text-gray-800">
                    <button
                      title="Mapas de Projetos"
                      onClick={onMapModal ?? onInteractiveMapModal}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <MapPin size={16} />
                      Mapas de Projetos
                    </button>
                    <button
                      title="Participe"
                      onClick={onParticipationModal}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Handshake size={16} />
                      {menu.participate}
                    </button>
                    <button
                      title="Ferramentas de Gestão Territória"
                      onClick={onLegislationModal}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Gavel size={16} />
                      {menu.tools}
                    </button>
                    <button
                      title="Gestão de Resíduos"
                      onClick={onWasteModal}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      {menu.waste}
                    </button>
                    <button
                      title="Registo de Ocorrência"
                      onClick={onIncidentModal}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <AlertTriangle size={16} />
                      {menu.incident}
                    </button>
                    <button
                      title="Ajuda"
                      onClick={onHelpModal}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <HelpCircle size={16} />
                      {menu.help}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <a href="/" aria-label="Ir para a página inicial">
              <img src="imagens/logot.png" alt="Terra Djunto Logo" className="w-45 h-20 object-contain rounded" />
            </a>
            
          </div>
          
          {/* Elementos do lado direito (incluindo ícone de perfil em mobile) */}
          <div className="flex items-center space-x-4">
            {/* Elementos visíveis apenas em desktop */}
            <div className={`items-center space-x-4 ${isMobile ? 'hidden' : 'flex'}`}>
              {isAuthenticated && (
                <div className="relative" onMouseLeave={() => setLanguageOpen(false)}>
                  <button
                    onClick={() => setLanguageOpen(!languageOpen)}
                    className="flex items-center space-x-1 p-2 text-white bg-[#004d47] hover:bg-[#00332f] rounded transition-colors"
                  >
                    <Globe size={18} />
                    <ChevronDown size={14} />
                  </button>
                  {languageOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={() => setLanguage("pt")}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <img src="https://flagcdn.com/w20/pt.png" alt="PT" className="w-5" />
                        <span>Português</span>
                      </button>
                      <button
                        onClick={() => setLanguage("en")}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5" />
                        <span>English</span>
                      </button>
                      <button
                        onClick={() => setLanguage("fr")}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <img src="https://flagcdn.com/w20/fr.png" alt="FR" className="w-5" />
                        <span>Français</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
              {isAuthenticated && (
                <div className="relative" onMouseLeave={() => setAccessibilityOpen(false)}>
                  <button
                    onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                    className="flex items-center space-x-1 p-2 text-white bg-[#004d47] hover:bg-[#00332f] rounded transition-colors"
                  >
                    <Eye size={18} />
                    <ChevronDown size={14} />
                  </button>
                  {accessibilityOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 text-sm font-semibold text-gray-600 border-b">Tamanho do texto</div>
                      <button
                        onClick={increaseFontSize}
                        className="w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                      >
                        Aumentar letra
                      </button>
                      <button
                        onClick={decreaseFontSize}
                        className="w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                      >
                        Diminuir letra
                      </button>
                      <div className="border-t">
                        <button
                          onClick={readAloud}
                          className="w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                        >
                          {speaking ? "Parar leitura" : "Ler em voz alta"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {isAuthenticated && (
                <div className="flex flex-row items-center gap-2">
                  <button
                    onClick={onInteractiveMapModal}
                    className="flex items-center p-2 text-white text-xs bg-[#004d47] hover:bg-[#00332f] rounded transition-colors"
                    title={menu.map}
                  >
                    <MapPinned size={18} />
                    <span className="ml-2 text-[13px] text-white font-semibold">{menu.map}</span>
                  </button>
                </div>
              )}
              {!isAuthenticated ? (
                <button
                  onClick={onAccessModal}
                  className="bg-[#004d47] hover:bg-[#00332f] p-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <LogIn size={16} className="text-white" />
                  <span className="text-white">Entrar</span>
                </button>
              ) : (
                <div className="relative" onMouseLeave={() => setUserMenuOpen(false)}>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="bg-[#004d47] hover:bg-[#00332f] mt-5 w-9 h-9 rounded-full transition-colors relative focus:outline-none flex items-center justify-center shadow-md"
                      title="Conta do utilizador"
                    >
                      <User size={25} className="text-white" />
                    </button>
                    <span className="truncate text-[11px] mt-1 w-15 text-center whitespace-normal break-words text-[#004d47] font-semibold">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-3 border-b">
                        <div className="text-sm font-semibold text-gray-800 truncate">{user?.name}</div>
                        <div className="text-xs text-gray-500 break-all">{user?.email}</div>
                        {!!user?.nif && <div className="text-xs text-gray-500">NIF: {user?.nif}</div>}
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        <span>Terminar sessão</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Ícone de perfil visível também em mobile */}
            {isMobile && isAuthenticated && (
              <div className="relative">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="bg-[#004d47] hover:bg-[#00332f] mt-5 w-9 h-9 rounded-full transition-colors relative focus:outline-none flex items-center justify-center shadow-md"
                    title="Conta do utilizador"
                  >
                    <User size={25} className="text-white" />
                  </button>
                  <span className="truncate text-[11px] mt-1 w-15 text-center whitespace-normal break-words text-[#004d47] font-semibold">
                    {user?.name || user?.email}
                  </span>
                </div>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <div className="text-sm font-semibold text-gray-800 truncate">{user?.name}</div>
                      <div className="text-xs text-gray-500 break-all">{user?.email}</div>
                      {!!user?.nif && <div className="text-xs text-gray-500">NIF: {user?.nif}</div>}
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      <span>Terminar sessão</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Botão de login para mobile (visível apenas em mobile para não autenticados) */}
            {isMobile && !isAuthenticated && (
              <button
                onClick={onAccessModal}
                className="bg-[#004d47] hover:bg-[#00332f] p-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <LogIn size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Adicionando estilos para garantir a visibilidade do texto */}
      <style>{`
        @media (max-width: 768px) {
          .text-gray-800 {
            color: #374151 !important;
          }
        }
      `}</style>
    </header>
  )
}

export default Header