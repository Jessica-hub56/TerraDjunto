import React, { useState } from 'react';
import { X, Clock, Truck, AlertTriangle, BookOpen, MapPin, Upload, Play, ChevronLeft, ChevronRight, Camera, FileText } from 'lucide-react';
import { getAllMunicipalities, getNeighborhoods } from '../../data/municipalities';
import MapComponent from '../MapComponent';
import { videoOverlay } from 'leaflet';
import { version } from 'react-dom/server';

interface WasteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WasteModal: React.FC<WasteModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('collection');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bulkyLocation, setBulkyLocation] = useState<[number, number] | null>(null);
  const [bulkyAddress, setBulkyAddress] = useState('');
  const [illegalLocation, setIllegalLocation] = useState<[number, number] | null>(null);
  const [illegalAddress, setIllegalAddress] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  // Divisão da recolha de volumosos em dois tipos
  const [bulkyType, setBulkyType] = useState<'residential' | 'construction'>('residential');
  const [resBulkyLocation, setResBulkyLocation] = useState<[number, number] | null>(null);
  const [resBulkyAddress, setResBulkyAddress] = useState('');
  const [workBulkyLocation, setWorkBulkyLocation] = useState<[number, number] | null>(null);
  const [workBulkyAddress, setWorkBulkyAddress] = useState('');
  // Campos de formulário — Volumosos
  const [bulkyName, setBulkyName] = useState('');
  const [bulkyPhone, setBulkyPhone] = useState('');
  const [bulkyItems, setBulkyItems] = useState('');
  const [bulkyDate, setBulkyDate] = useState('');
  // Campos de formulário — Denúncia
  const [illegalAnonymous, setIllegalAnonymous] = useState(false);
  const [illegalName, setIllegalName] = useState('');
  const [illegalPhone, setIllegalPhone] = useState('');
  const [illegalDesc, setIllegalDesc] = useState('');
  const [illegalPlate, setIllegalPlate] = useState('');
  // Registos do utilizador (acompanhamento)
  const STORAGE_WASTE = 'wasteRequests';
  const [myFilter, setMyFilter] = useState('');
  const [myRecords, setMyRecords] = useState<any[]>([]);
  const refreshMyRecords = () => {
    try { const raw = localStorage.getItem(STORAGE_WASTE); setMyRecords(raw ? JSON.parse(raw) : []); } catch { setMyRecords([]); }
  };

  if (!isOpen) return null;

  const municipalities = getAllMunicipalities();

  const serviceTypes = [
    { id: 'porta-porta', name: 'Porta a Porta', description: 'Recolha domiciliária regular' },
    { id: 'contentores', name: 'Pontos de Contentores', description: 'Contentores comunitários' },
    { id: 'comercial', name: 'Comercial', description: 'Estabelecimentos comerciais' },
    { id: 'institucional', name: 'Institucional', description: 'Instituições públicas e privadas' }
  ];

  const tabs = [
    { id: 'collection', label: 'Consulta de Serviços', icon: Clock },
    { id: 'bulky', label: 'Recolha de Volumosos', icon: Truck },
    { id: 'illegal', label: 'Denúncia de Depósito Ilegal', icon: AlertTriangle },
    { id: 'my', label: 'Meus Registos', icon: FileText },
    { id: 'awareness', label: 'Material de Conscientização', icon: BookOpen }
  ];

  const awarenessContent = [
      {
    type: 'image',
      title: 'Separação Correta de Resíduos',
      description: 'Em cabo verde podemos contribuir separando os residuos secos dos residuos organicos.',
      thumbnail: 'imagens/lixos.jpg'
    },
    {
      type: 'video',
      title: 'Como Separar Corretamente os Resíduos',
      description: 'Tutorial prático sobre como fazer a separação adequada dos diferentes tipos de resíduos para reciclagem.',
      thumbnail: 'https://img.youtube.com/vi/1f3_BDxiuNw/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/1f3_BDxiuNw',
      duration: '6:30'
    },
    
    {
      type: 'image',
      title: 'Guia de despejo dos residuos sólidos volumosos',
      description: 'Recolha de volumosos.',
      thumbnail: 'imagens/rv.png'
    },
    {
      type: 'video',
      title: 'Recolha de residuos volumosos',
      description: 'Como fazer o descarte dos residuos volumosos, contribuindo para um Municipio mais limpo!',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '5:20'
    },
    {
      type: 'image',
      title: 'Impacto dos Resíduos no Ambiente',
      description: 'A maioria dos residuos mal gerida vão parar no mar.',
      thumbnail: 'imagens/rio.png'
    },
    {
      type: 'video',
      title: 'Impacto Ambiental dos Resíduos Sólidos',
      description: 'Vídeo educativo sobre os impactos dos resíduos sólidos no meio ambiente e ecossistemas.',
      thumbnail: 'https://img.youtube.com/vi/mJ8nISBlqvE/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/mJ8nISBlqvE',
      duration: '1:23'
    },
    {
      type: 'image',
      title: 'Reciclagem dos residuos solidos',
      description: 'A maioria dos residuos podem ser reciclados.',
      thumbnail: 'imagens/resiclagem.jpg'
    },
    {
      type: 'video',
      title: 'Processo de Reciclagem em Cabo Verde',
      description: 'Vídeo educativo sobre como funciona o processo de reciclagem dos resíduos sólidos em Cabo Verde.',
      thumbnail: 'https://img.youtube.com/vi/PckAgY6stqU/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/PckAgY6stqU?start=9',
      duration: '10:30'
    },
    
  ];

  const handleMunicipalityChange = (municipality: string) => {
    setSelectedMunicipality(municipality);
    setSelectedNeighborhood('');
    setSelectedServiceType('');
    setShowSchedule(false);
  };

  const checkSchedule = () => {
    if (selectedMunicipality && selectedNeighborhood && selectedServiceType) {
      setShowSchedule(true);
    }
  };

  const getScheduleData = () => {
    const schedules = {
      'porta-porta': {
        days: 'Segunda, Quarta, Sexta',
        hours: '07:00 - 13:00',
        notes: '⚠️ Não coloca os sacos de lixo na rua, aguarda a nossa chegada!'
      },
      'contentores': {
        days: 'Diariamente',
        hours: '24 horas',
        notes: '⚠️ Deposite o seu saco apanas em contentores, e nunca nos arredores!'
      },
      'comercial': {
        days: 'Terça, Quinta, Sábado',
        hours: '18:00 - 00:00',
        notes: '⚠️ Agendamento obrigatório para grandes volumes.'
      },
      'institucional': {
        days: 'Segunda a Sexta',
        hours: '07:00 - 16:00',
        notes: '⚠️ Protocolo específico necessário.'
      }
    };

    return schedules[selectedServiceType as keyof typeof schedules];
  };


  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + awarenessContent.length) % awarenessContent.length);
    setIsVideoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % awarenessContent.length);
    setIsVideoPlaying(false);
  };

  const handlePlayVideo = () => {
    console.log('Play button clicked!');
    console.log('Current slide:', currentSlide);
    console.log('Current content:', awarenessContent[currentSlide]);
    console.log('Is video?', awarenessContent[currentSlide].type === 'video');

    if (awarenessContent[currentSlide].type === 'video') {
      console.log('Setting video playing to true');
      setIsVideoPlaying(true);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Alguns arquivos foram rejeitados. Apenas imagens (JPG, PNG) até 5MB são aceitos.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 3)); // Max 3 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submissão — Recolha de Volumosos
  const handleBulkySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const STORAGE_WASTE = 'wasteRequests';
      const raw = localStorage.getItem(STORAGE_WASTE);
      const arr = raw ? JSON.parse(raw) : [];
      const isResidential = bulkyType === 'residential';
      const address = isResidential ? resBulkyAddress : workBulkyAddress;
      const loc = isResidential ? resBulkyLocation : workBulkyLocation;
      const record = {
        id: Date.now().toString(),
        kind: 'bulky' as const,
        subtype: bulkyType,
        name: bulkyName,
        phone: bulkyPhone,
        address: address || '',
        location: loc || null,
        items: bulkyItems,
        preferredDate: bulkyDate,
        createdAt: new Date().toISOString(),
        status: 'enviado',
        attachments: [] as { name: string; size: number }[],
      };
      localStorage.setItem(STORAGE_WASTE, JSON.stringify([record, ...arr]));
      alert('Pedido de recolha de volumosos submetido com sucesso!');
      refreshMyRecords();
      setActiveTab('my');
      setBulkyName(''); setBulkyPhone(''); setBulkyItems(''); setBulkyDate('');
      setResBulkyLocation(null); setResBulkyAddress(''); setWorkBulkyLocation(null); setWorkBulkyAddress('');
    } catch (err) {
      console.error('Falha ao gravar pedido de volumosos:', err);
      alert('Não foi possível submeter o pedido.');
    }
  };

  // Submissão — Denúncia de Depósito Ilegal
  const handleIllegalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const STORAGE_WASTE = 'wasteRequests';
      const raw = localStorage.getItem(STORAGE_WASTE);
      const arr = raw ? JSON.parse(raw) : [];
      const record = {
        id: Date.now().toString(),
        kind: 'illegal' as const,
        name: illegalAnonymous ? '' : illegalName,
        phone: illegalAnonymous ? '' : illegalPhone,
        address: illegalAddress || '',
        location: illegalLocation || null,
        items: illegalDesc,
        preferredDate: '',
        createdAt: new Date().toISOString(),
        status: 'enviado',
        attachments: selectedFiles.map(f => ({ name: f.name, size: f.size })),
        raw: { plate: illegalPlate, anonymous: illegalAnonymous }
      };
      localStorage.setItem(STORAGE_WASTE, JSON.stringify([record, ...arr]));
      alert('Denúncia submetida com sucesso!');
      refreshMyRecords();
      setActiveTab('my');
      setIllegalAnonymous(false); setIllegalName(''); setIllegalPhone(''); setIllegalDesc(''); setIllegalPlate('');
      setIllegalAddress(''); setIllegalLocation(null); setSelectedFiles([]);
    } catch (err) {
      console.error('Falha ao gravar denúncia:', err);
      alert('Não foi possível submeter a denúncia.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Gestão de Resíduos Sólidos</h2>
          <button title='Gestão de Resíduos Sólidos' onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex border-b mb-6 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#2c7873] text-[#2c7873]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Collection Schedule Tab */}
          {activeTab === 'collection' && (
            <div>
              <h5 className="text-lg font-semibold mb-6">Consulta de Serviços de Recolha</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Município
                  </label>
                  <select
                    title='Selecione o município'
                    value={selectedMunicipality}
                    onChange={(e) => handleMunicipalityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  >
                    <option value="">Selecione o município...</option>
                    {municipalities.map((municipality) => (
                      <option key={municipality} value={municipality}>
                        {municipality}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <select
                    title='Selecione o bairro'
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    disabled={!selectedMunicipality}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] disabled:bg-gray-100"
                  >
                    <option value="">
                      {selectedMunicipality ? 'Selecione o bairro...' : 'Selecione primeiro o município'}
                    </option>
                    {selectedMunicipality && getNeighborhoods(selectedMunicipality).map((neighborhood) => (
                      <option key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Serviço
                  </label>
                  <select
                    title='Selecione o tipo de serviço'
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                    disabled={!selectedNeighborhood}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] disabled:bg-gray-100"
                  >
                    <option value="">
                      {selectedNeighborhood ? 'Selecione o tipo...' : 'Selecione primeiro o bairro'}
                    </option>
                    {serviceTypes.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={checkSchedule}
                disabled={!selectedMunicipality || !selectedNeighborhood || !selectedServiceType}
                className="bg-[#2c7873] hover:bg-[#1f5a56] text-white px-6 py-3 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-6"
              >
                Consultar Horários
              </button>

              {showSchedule && (
                <div className="bg-gradient-to-r from-[#f0f7f4] to-[#e8f5e8] p-6 rounded-lg border border-[#2c7873]/20">
                  <h6 className="font-semibold text-[#2c7873] mb-4 text-lg">
                    Horários de Recolha - {serviceTypes.find(s => s.id === selectedServiceType)?.name}
                  </h6>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-medium text-gray-800 mb-3">Informações do Serviço:</h6>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <MapPin size={16} className="text-[#2c7873]" />
                          <span className="text-sm"><strong>Local:</strong> {selectedNeighborhood}, {selectedMunicipality}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock size={16} className="text-[#2c7873]" />
                          <span className="text-sm"><strong>Dias:</strong> {getScheduleData()?.days}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock size={16} className="text-[#2c7873]" />
                          <span className="text-sm"><strong>Horário:</strong> {getScheduleData()?.hours}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-800 mb-3">Observações:</h6>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded border-l-4 border-[#2c7873]">
                        {getScheduleData()?.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bulky Waste Collection Tab */}
          {activeTab === 'bulky' && (
            <div>
              <h5 className="text-lg font-semibold mb-2">Recolha de Volumosos</h5>
              {/* Sub-aba: Residenciais vs Obras */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setBulkyType('residential')}
                  className={`px-3 py-1 rounded border text-sm ${bulkyType==='residential' ? 'bg-[#2c7873] text-white border-[#2c7873]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Volumosos Residenciais
                </button>
                <button
                  type="button"
                  onClick={() => setBulkyType('construction')}
                  className={`px-3 py-1 rounded border text-sm ${bulkyType==='construction' ? 'bg-[#2c7873] text-white border-[#2c7873]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Volumosos de Obras
                </button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Serviço especial para móveis, eletrodomésticos e outros objetos grandes. 
                  Agendamento obrigatório com antecedência mínima de 48 horas.
                </p>
              </div>
              
              <form onSubmit={handleBulkySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input 
                    title='Nome Completo'
                    type="text" 
                    value={bulkyName}
                    onChange={(e) => setBulkyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contacto telefonico</label>
                  <input 
                    type="tel" 
                    value={bulkyPhone}
                    onChange={(e) => setBulkyPhone(e.target.value)}
                    pattern="(\+238[-\s]?)?(9[1,2,5,6,7][0-9]{6}|2[0-9]{6,7})"
                    placeholder="Ex: 991 23 45 ou 261 23 45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localização no Mapa</label>
                  <div className="h-64 rounded-lg border border-gray-300 overflow-hidden mb-3">
                    <MapComponent
                      height="100%"
                      center={[15.1200, -23.6000]}
                      zoom={12}
                      draggableMarker={true}
                      markerPosition={bulkyType==='residential' ? resBulkyLocation : workBulkyLocation}
                      onLocationSelect={(lat, lng, address) => {
                        if (bulkyType==='residential') {
                          setResBulkyLocation([lat, lng]);
                          setResBulkyAddress(address);
                        } else {
                          setWorkBulkyLocation([lat, lng]);
                          setWorkBulkyAddress(address);
                        }
                      }}
                      layers="waste"
                     showGetLocationButton={true}
                    />
                  </div>
                  <input 
                    type="text" 
                    value={bulkyType==='residential' ? resBulkyAddress : workBulkyAddress}
                    onChange={(e) => bulkyType==='residential' ? setResBulkyAddress(e.target.value) : setWorkBulkyAddress(e.target.value)}
                    placeholder="Clique no mapa ou digite o endereço" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Itens para Recolha</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                    rows={4} 
                    placeholder="Descreva detalhadamente os itens: ex. sofá de 3 lugares, geladeira duplex, mesa de jantar com 6 cadeiras..." 
                    value={bulkyItems}
                    onChange={(e) => setBulkyItems(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Preferencial</label>
                  <input 
                    title='Data Preferencial'
                    type="date" 
                    min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    value={bulkyDate}
                    onChange={(e) => setBulkyDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#2c7873] hover:bg-[#1f5a56] text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Agendar Recolha
                </button>
              </form>
            </div>
          )}

          {/* Illegal Dumping Report Tab */}
          {activeTab === 'illegal' && (
            <div>
              <h5 className="text-lg font-semibold mb-4">Denúncia de Depósito Ilegal</h5>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-red-800">
                  <strong>Importante:</strong> Use este formulário para reportar depósitos ilegais de resíduos. 
                  Sua denúncia é importante para manter nosso ambiente limpo e saudável.
                </p>
              </div>
              
              <form onSubmit={handleIllegalSubmit} className="space-y-6">
                <div className="flex items-center mb-6">
                  <input type="checkbox" id="anonymous" className="mr-3 w-4 h-4" checked={illegalAnonymous} onChange={(e)=> setIllegalAnonymous(e.target.checked)} />
                  <label htmlFor="anonymous" className="text-sm text-gray-700 font-medium">
                    Desejo permanecer anónimo
                  </label>
                </div>

                <div id="contactInfo" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <input 
                      title='Nome Completo'
                      type="text" 
                      value={illegalName}
                      onChange={(e) => setIllegalName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <input 
                      title='Telefone'
                      type="tel" 
                      value={illegalPhone}
                      onChange={(e) => setIllegalPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localização do Depósito Ilegal</label>
                  <div className="h-64 rounded-lg border border-red-300 overflow-hidden mb-3">
                    <MapComponent
                      height="100%"
                      center={[15.1200, -23.6000]}
                      zoom={12}
                      draggableMarker={true}
                      markerPosition={illegalLocation}
                      onLocationSelect={(lat, lng, address) => {
                        setIllegalLocation([lat, lng]);
                        setIllegalAddress(address);
                      }}
                      layers="incidents"
                      showGetLocationButton={true}
                    />
                  </div>
                  <input 
                    type="text" 
                    value={illegalAddress}
                    onChange={(e) => setIllegalAddress(e.target.value)}
                    placeholder="Clique no mapa ou digite o endereço" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Problema</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                    rows={4} 
                    placeholder="Descreva detalhadamente o tipo de resíduos, quantidade aproximada, há quanto tempo está no local..." 
                    value={illegalDesc}
                    onChange={(e) => setIllegalDesc(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Matrícula do Veículo (se aplicável)</label>
                  <input 
                    type="text" 
                    value={illegalPlate}
                    onChange={(e) => setIllegalPlate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]" 
                    placeholder="Ex: CV-12-34-AB" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Anexar Fotos (opcional)</label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2c7873] transition-colors cursor-pointer"
                    onClick={() => document.getElementById('illegal-file-input')?.click()}
                  >
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Camera className="text-gray-400" size={24} />
                      <Upload className="text-gray-400" size={24} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Clique para selecionar ou arraste as fotos</span>
                    <p className="text-xs text-gray-500 mt-1">Máximo 3 fotos (JPG, PNG - máx. 5MB cada)</p>
                    <input
                      title='Anexar Fotos'
                      id="illegal-file-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600 font-medium">
                        Fotos selecionadas ({selectedFiles.length}/3):
                      </p>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                          </div>
                          <button
                            title='Remover Foto'
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Enviar Denúncia
                </button>
              </form>
            </div>
          )}

          {/* My Records Tab */}
          {activeTab === 'my' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">Meus Registos</h5>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={myFilter}
                    onChange={(e)=> setMyFilter(e.target.value)}
                    placeholder="Filtrar por ID, nome, telefone..."
                    className="px-3 py-2 border rounded text-sm"
                  />
                  <button onClick={refreshMyRecords} className="px-3 py-2 border rounded hover:bg-gray-50 text-sm">Atualizar</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                {myRecords.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">Sem registos encontrados.</div>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3">ID</th>
                        <th className="text-left py-2 px-3">Nome</th>
                        <th className="text-left py-2 px-3">Telefone</th>
                        <th className="text-left py-2 px-3">Endereço</th>
                        <th className="text-left py-2 px-3">Status</th>
                        <th className="text-left py-2 px-3">Criado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myRecords
                        .filter(r => {
                          if (!myFilter) return true;
                          const t = myFilter.toLowerCase();
                          return (
                            String(r.id).toLowerCase().includes(t) ||
                            String(r.name || '').toLowerCase().includes(t) ||
                            String(r.phone || '').toLowerCase().includes(t) ||
                            String(r.address || '').toLowerCase().includes(t) ||
                            String(r.items || '').toLowerCase().includes(t)
                          );
                        })
                        .map((r) => (
                        <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 font-mono text-xs">{r.id}</td>
                          <td className="py-2 px-3">{r.name || '-'}</td>
                          <td className="py-2 px-3">{r.phone || '-'}</td>
                          <td className="py-2 px-3 truncate max-w-[200px]" title={r.address}>{r.address || '-'}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${r.status==='enviado' ? 'bg-yellow-100 text-yellow-800' : r.status==='em-analise' ? 'bg-blue-100 text-blue-800' : r.status==='resolvido' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              {r.status || 'enviado'}
                            </span>
                          </td>
                          <td className="py-2 px-3">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Awareness Material Tab */}
          {activeTab === 'awareness' && (
            <div>
              <h5 className="text-lg font-semibold mb-6">Material de Conscientização</h5>
              
              <div className="relative">
                <div className="overflow-hidden rounded-xl">
                  <div className="relative h-96 bg-gray-900 rounded-xl overflow-hidden">
                    {(() => {
                      console.log('Rendering video player - isVideoPlaying:', isVideoPlaying);
                      console.log('Current slide type:', awarenessContent[currentSlide].type);
                      console.log('Should show video?', isVideoPlaying && awarenessContent[currentSlide].type === 'video');
                      return null;
                    })()}
                    {isVideoPlaying && awarenessContent[currentSlide].type === 'video' ? (
                      <div className="w-full h-full">
                        {awarenessContent[currentSlide].videoUrl?.includes('youtube.com') || awarenessContent[currentSlide].videoUrl?.includes('youtu.be') || awarenessContent[currentSlide].videoUrl?.includes('embed') ? (
                          <iframe
                            src={awarenessContent[currentSlide].videoUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={awarenessContent[currentSlide].title}
                          />
                        ) : (
                          <video
                            src={awarenessContent[currentSlide].videoUrl}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            onEnded={() => setIsVideoPlaying(false)}
                          />
                        )}
                        <button
                          title='Fechar Vídeo'
                          onClick={() => setIsVideoPlaying(false)}
                          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <img
                          src={awarenessContent[currentSlide].thumbnail}
                          alt={awarenessContent[currentSlide].title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />

                        {awarenessContent[currentSlide].type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              title='Reproduzir Vídeo'
                              onClick={handlePlayVideo}
                              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                              <Play className="text-white ml-1" size={32} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          awarenessContent[currentSlide].type === 'video' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          {awarenessContent[currentSlide].type === 'video' ? 'Vídeo' : 'Imagem'}
                        </span>
                        {awarenessContent[currentSlide].duration && (
                          <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                            {awarenessContent[currentSlide].duration}
                          </span>
                        )}
                      </div>
                      <h6 className="text-xl font-bold text-white mb-2">
                        {awarenessContent[currentSlide].title}
                      </h6>
                      <p className="text-gray-200 text-sm">
                        {awarenessContent[currentSlide].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <button
                  title='Slide Anterior'
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  title='Próximo Slide'
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Indicators */}
                <div className="flex justify-center space-x-2 mt-4">
                  {awarenessContent.map((_, index) => (
                    <button
                      title={`Ir para slide ${index + 1}`}
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-[#2c7873]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                {awarenessContent.map((content, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentSlide 
                        ? 'border-[#2c7873] shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="relative h-32">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                      {content.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="text-white" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h6 className="font-medium text-sm mb-1">{content.title}</h6>
                      <p className="text-xs text-gray-600 line-clamp-2">{content.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasteModal;
