import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, MapPin, Calendar, Users, MessageSquare, Star, Upload, Send, Clock, CheckCircle, AlertCircle, FileText, Image, Map, Info, Camera, Filter } from 'lucide-react';
import MapComponent from '../MapComponent';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'ativo' | 'em-breve' | 'encerrado';
  municipality: string;
  startDate: string;
  endDate: string;
  participants: number;
  comments: number;
  location: [number, number];
  category: 'ordenamento' | 'infraestrutura' | 'ambiente' | 'social';
  responsibleEntities: string[];
}

interface Program {
  id: string;
  title: string;
  description: string;
  status: 'ativo' | 'em-breve' | 'encerrado';
  duration: string;
  participants: number;
  comments: number;
  category: 'educacao' | 'capacitacao' | 'sensibilizacao' | 'desenvolvimento';
  startDate: string;
  endDate: string;
  responsibleEntities: string[];
}

interface Comment {
  id: string;
  projectId: string;
  userName: string;
  content: string;
  classification: string;
  status: 'enviado' | 'em-analise' | 'aprovado' | 'rejeitado';
  date: string;
  allowPublication: boolean;
}

interface ParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ParticipationModal: React.FC<ParticipationModalProps> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'programs' | 'participate' | 'timeline' | 'project-map' | 'project-details' | 'program-details'>('home');
  const [selectedItem, setSelectedItem] = useState<Project | Program | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [projectLayers, setProjectLayers] = useState({ marker: true, area: true, poi: true, route: false, custom: false });
  const [projectGeoJSON, setProjectGeoJSON] = useState<any | null>(null);
  const [commentForm, setCommentForm] = useState({
    content: '',
    classification: '',
    allowPublication: false,
    userName: '',
    email: ''
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  type ParticipationRecord = {
    id: string;
    type: 'project' | 'program';
    title?: string;
    municipality?: string;
    userName?: string;
    email?: string;
    classification?: string;
    content?: string;
    createdAt?: string;
    status?: string;
  };
  const [commentsFilter, setCommentsFilter] = useState('');
  const [myComments, setMyComments] = useState<ParticipationRecord[]>([]);
  
  // Verificar se está em modo mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const refreshMyComments = () => {
    try {
      const raw = localStorage.getItem('participationRecords');
      setMyComments(raw ? JSON.parse(raw) : []);
    } catch {
      setMyComments([]);
    }
  };

  const statusBadge = (status?: string) => {
    switch (status) {
      case 'enviado': return 'bg-yellow-100 text-yellow-800';
      case 'em-analise': return 'bg-blue-100 text-blue-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'publicado': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!isOpen) return null;

  // Mock data
  const projects: Project[] = [
    {
      id: '1',
      title: 'Requalificação do Centro da Praia',
      description: 'Projeto de modernização e revitalização do centro histórico da cidade da Praia, incluindo melhorias na infraestrutura urbana, espaços verdes e acessibilidade.',
      status: 'ativo',
      municipality: 'Praia',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      participants: 234,
      comments: 89,
      location: [14.9177, -23.5092],
      category: 'ordenamento',
      responsibleEntities: ['Câmara Municipal da Praia', 'Ministério das Infraestruturas']
    },
    {
      id: '2',
      title: 'Plano de Gestão de Resíduos - Sal',
      description: 'Implementação de um sistema integrado de gestão de resíduos sólidos na ilha do Sal, com foco na reciclagem e economia circular.',
      status: 'ativo',
      municipality: 'Sal',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      participants: 187,
      comments: 67,
      location: [16.7644, -22.9094],
      category: 'ambiente',
      responsibleEntities: ['Câmara Municipal do Sal', 'Ministério do Ambiente']
    },
    {
      id: '3',
      title: 'Ordenamento Costeiro - Mindelo',
      description: 'Projeto de proteção e ordenamento da zona costeira de Mindelo, incluindo medidas de adaptação às mudanças climáticas.',
      status: 'em-breve',
      municipality: 'São Vicente',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      participants: 0,
      comments: 0,
      location: [16.8635, -24.9956],
      category: 'ambiente',
      responsibleEntities: ['Câmara Municipal de São Vicente', 'Instituto Nacional de Meteorologia e Geofísica']
    },
    {
      id: '4',
      title: 'Parque Urbano - Assomada',
      description: 'Criação de um parque urbano em Assomada com áreas de lazer, desporto e conservação ambiental.',
      status: 'encerrado',
      municipality: 'Santa Catarina',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      participants: 143,
      comments: 52,
      location: [15.1067, -23.6775],
      category: 'social',
      responsibleEntities: ['Câmara Municipal de Santa Catarina', 'Ministério da Agricultura e Ambiente']
    }
  ];

  const programs: Program[] = [
    {
      id: '1',
      title: 'Programa de Educação Ambiental',
      description: 'Programa nacional de sensibilização e educação ambiental para escolas e comunidades.',
      status: 'ativo',
      duration: '12 meses',
      participants: 456,
      comments: 123,
      category: 'educacao',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      responsibleEntities: ['Ministério da Educação', 'Ministério do Ambiente']
    },
    {
      id: '2',
      title: 'Capacitação em Gestão Territorial',
      description: 'Programa de formação para técnicos municipais em ferramentas de gestão territorial.',
      status: 'ativo',
      duration: '6 meses',
      participants: 89,
      comments: 34,
      category: 'capacitacao',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      responsibleEntities: ['MIOTH', 'Ministerio infraestrutura Ordenamento do Território e habitacão']
    },
    {
      id: '3',
      title: 'Sensibilização para Reciclagem',
      description: 'Campanha nacional de sensibilização para a importância da reciclagem e separação de resíduos.',
      status: 'em-breve',
      duration: '18 meses',
      participants: 0,
      comments: 0,
      category: 'sensibilizacao',
      startDate: '2024-06-01',
      endDate: '2025-11-30',
      responsibleEntities: ['Ministério do Ambiente', 'Câmaras Municipais']
    }
  ];

  const userComments: Comment[] = [
    {
      id: '1',
      projectId: '1',
      userName: 'João Silva',
      content: 'Excelente iniciativa para revitalizar o centro da cidade.',
      classification: 'concordo',
      status: 'aprovado',
      date: '2024-01-20',
      allowPublication: true
    },
    {
      id: '2',
      projectId: '2',
      userName: 'Maria Santos',
      content: 'Sugiro incluir mais pontos de reciclagem nos bairros.',
      classification: 'sugestao',
      status: 'em-analise',
      date: '2024-01-25',
      allowPublication: true
    }
  ];

  const classifications = [
    { value: 'concordo', label: 'Concordo', color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'discordo', label: 'Discordo', color: 'text-red-600', bg: 'bg-red-50' },
    { value: 'proposta-coerente', label: 'Proposta Coerente', color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'reclamacao', label: 'Reclamação', color: 'text-orange-600', bg: 'bg-orange-50' },
    { value: 'sugestao', label: 'Sugestão', color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-green-600 bg-green-50';
      case 'em-breve': return 'text-blue-600 bg-blue-50';
      case 'encerrado': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCommentStatusIcon = (status: string) => {
    switch (status) {
      case 'enviado': return <Clock className="text-yellow-500" size={16} />;
      case 'em-analise': return <AlertCircle className="text-blue-500" size={16} />;
      case 'aprovado': return <CheckCircle className="text-green-500" size={16} />;
      case 'rejeitado': return <X className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    // Persistir registo da participação para o AdminDashboard (localStorage)
    try {
      const STORAGE_PART = 'participationRecords';
      const raw = localStorage.getItem(STORAGE_PART);
      const arr = raw ? JSON.parse(raw) : [];
      const isProject = !!(selectedItem && (selectedItem as any).municipality !== undefined);
      const record = {
        id: Date.now().toString(),
        type: isProject ? 'project' as const : 'program' as const,
        itemId: (selectedItem as any)?.id,
        title: (selectedItem as any)?.title,
        municipality: isProject ? (selectedItem as any)?.municipality : undefined,
        userName: commentForm.userName,
        email: commentForm.email,
        classification: commentForm.classification,
        content: commentForm.content,
        createdAt: new Date().toISOString(),
        status: 'enviado' as const,
        attachments: selectedFiles.map(f => ({ name: f.name, size: f.size })),
        raw: { selectedItem }
      };
      localStorage.setItem(STORAGE_PART, JSON.stringify([record, ...arr]));
      refreshMyComments();
    } catch (err) {
      console.error('Falha ao gravar participação:', err);
    }

    alert('Comentário enviado com sucesso! Você pode acompanhar o status na cronologia.');
    setCurrentView('timeline');
    setCommentForm({
      content: '',
      classification: '',
      allowPublication: false,
      userName: '',
      email: ''
    });
    setSelectedFiles([]);
  };

  const handleBack = () => {
    if (currentView === 'home') {
      onClose();
    } else if (currentView === 'project-map' || currentView === 'project-details') {
      setCurrentView('projects');
    } else if (currentView === 'program-details') {
      setCurrentView('programs');
    } else {
      setCurrentView('home');
      setSelectedItem(null);
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#2c7873] mb-3">Participe</h2>
        <p className="text-gray-600">
          Sua participação é fundamental para o desenvolvimento sustentável do nosso território. 
          Escolha como deseja contribuir:
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div
          onClick={() => setCurrentView('projects')}
          className="bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#2c7873] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MapPin className="text-white" size={28} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#2c7873] mb-3">Projetos</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Participe em projetos específicos de ordenamento territorial, infraestrutura e desenvolvimento urbano.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ativos: {projects.filter(p => p.status === 'ativo').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Em breve: {projects.filter(p => p.status === 'em-breve').length}</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => setCurrentView('programs')}
          className="bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#2c7873] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="text-white" size={28} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#2c7873] mb-3">Programas</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Envolva-se em programas de educação, capacitação e sensibilização para o desenvolvimento territorial.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ativos: {programs.filter(p => p.status === 'ativo').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Em breve: {programs.filter(p => p.status === 'em-breve').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-[#2c7873]">Projetos</h3>
        <button
          onClick={() => { refreshMyComments(); setCurrentView('timeline'); }}
          className="px-3 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors flex items-center space-x-2 text-sm"
        >
          <Clock size={14} />
          <span>Meus Comentários</span>
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">{project.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} self-start`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin size={12} />
                    <span>{project.municipality}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={12} />
                    <span>{project.participants} participantes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.status === 'ativo' && (
                <button
                  onClick={() => {
                    setSelectedItem(project);
                    setCurrentView('participate');
                  }}
                  className="px-3 py-1 bg-[#2c7873] text-white rounded text-sm hover:bg-[#1f5a56] transition-colors"
                >
                  Participar
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedItem(project);
                  setCurrentView('project-map');
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors flex items-center space-x-1"
              >
                <Map size={12} />
                <span>Ver no Mapa</span>
              </button>
              <button
                onClick={() => {
                  setSelectedItem(project);
                  setCurrentView('project-details');
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors flex items-center space-x-1"
              >
                <Info size={12} />
                <span>Detalhes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectMap = () => {
    const center = (selectedItem as Project)?.location || [15.1200, -23.6000];

    // Helpers to build simple GeoJSON layers dynamically
    const toCircle = (lat: number, lng: number, radiusMeters = 800, steps = 48) => {
      const coords: [number, number][] = [];
      const earthRadius = 6378137;
      const d = radiusMeters / earthRadius;
      const latRad = (lat * Math.PI) / 180;
      const lngRad = (lng * Math.PI) / 180;
      for (let i = 0; i <= steps; i++) {
        const brng = (2 * Math.PI * i) / steps;
        const lat2 = Math.asin(Math.sin(latRad) * Math.cos(d) + Math.cos(latRad) * Math.sin(d) * Math.cos(brng));
        const lng2 = lngRad + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(latRad), Math.cos(d) - Math.sin(latRad) * Math.sin(lat2));
        coords.push([(lat2 * 180) / Math.PI, (lng2 * 180) / Math.PI]);
      }
      return {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: [coords.map(([la, lo]) => [lo, la])] }
        }]
      };
    };

    const route = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [center[1], center[0]],
            [center[1] + 0.01, center[0] + 0.01],
            [center[1] + 0.02, center[0] - 0.005]
          ]
        }
      }]
    };

    const pois = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', properties: { name: 'POI 1' }, geometry: { type: 'Point', coordinates: [center[1] + 0.006, center[0] + 0.003] } },
        { type: 'Feature', properties: { name: 'POI 2' }, geometry: { type: 'Point', coordinates: [center[1] - 0.004, center[0] - 0.004] } }
      ]
    };

    const geojsonLayers: any[] = [];
    if (projectLayers.area) geojsonLayers.push({ data: toCircle(center[0], center[1], 800, 48), style: { color: '#2c7873', weight: 1, opacity: 0.8, fillOpacity: 0.1 } });
    if (projectLayers.route) geojsonLayers.push({ data: route, style: { color: '#2563eb', weight: 3 } });
    if (projectLayers.poi) geojsonLayers.push({ data: pois, style: { color: '#f59e0b' } });
    if (projectLayers.custom && projectGeoJSON) geojsonLayers.push({ data: projectGeoJSON, style: { color: '#9333ea', weight: 2 } });

    // Acrescenta camadas GeoJSON carregadas pelo administrador (escopo 'participate')
    try {
      const raw = localStorage.getItem('adminDatasets');
      const arr = raw ? JSON.parse(raw) : [];
      const adminLayers = Array.isArray(arr)
        ? arr
            .filter((d: any) => d && d.active && d.features && (d.scope || 'header') === 'participate')
            .map((d: any) => ({ data: d.features, style: { color: '#2c7873', weight: 2, opacity: 1 } }))
        : [];
      geojsonLayers.push(...adminLayers);
      // Ajusta a vista para incluir todas as camadas (projeto + admin)
      try {
        const coords: [number, number][] = [];
        geojsonLayers.forEach((l: any) => {
          const fc = (l?.data ?? l) as any;
          const features = fc?.features || [];
          features.forEach((f: any) => {
            const g = f.geometry; if (!g) return;
            const pushCoord = (c: any) => { if (Array.isArray(c) && typeof c[0] === 'number') coords.push([c[1], c[0]]); };
            if (g.type === 'Point') pushCoord(g.coordinates);
            if (g.type === 'MultiPoint') g.coordinates.forEach(pushCoord);
            if (g.type === 'LineString') g.coordinates.forEach(pushCoord);
            if (g.type === 'MultiLineString') g.coordinates.flat(1).forEach(pushCoord);
            if (g.type === 'Polygon') g.coordinates.flat(1).forEach(pushCoord);
            if (g.type === 'MultiPolygon') g.coordinates.flat(2).forEach(pushCoord);
          });
        });
        if (coords.length) {
          const lats = coords.map(c => c[0]);
          const lngs = coords.map(c => c[1]);
          const bounds: any = [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];
          // Passa bounds para MapComponent através de prop fitBounds
          // Nota: MapComponent recebe fitBounds={bounds} logo abaixo
          (geojsonLayers as any).fitBounds = bounds;
        }
      } catch {}
    } catch {}

    return (
      <div>
        <div className="bg-[#2c7873] text-white p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-1">Localização: {selectedItem?.title}</h3>
          <p className="text-sm opacity-90">Visualize a localização do projeto no mapa</p>
        </div>

        <div className="h-80 md:h-96 rounded-lg overflow-hidden border border-gray-300 mb-4 flex flex-col md:flex-row">
          {/* Mapa ocupa 100% em mobile, 80% em desktop */}
          <div className="w-full md:w-4/5 h-full">
            <MapComponent
              height="100%"
              center={center as [number, number]}
              zoom={14}
              markerPosition={projectLayers.marker ? (center as [number, number]) : null}
              layers="projects"
              geojsonLayers={geojsonLayers}
              fitBounds={(geojsonLayers as any).fitBounds}
            />
          </div>

          {/* Legenda ocupa 100% em mobile, 20% em desktop */}
          <div className="w-full md:w-1/5 h-auto md:h-full bg-white border-t md:border-l md:border-t-0 rounded-b-lg md:rounded-r-lg p-4 overflow-y-auto">
            <h4 className="font-semibold text-gray-900 mb-3">Legenda do Projeto</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={projectLayers.marker}
                  onChange={(e) =>
                    setProjectLayers((v) => ({ ...v, marker: e.target.checked }))
                  }
                />
                <span>Ponto do projeto</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={projectLayers.area}
                  onChange={(e) =>
                    setProjectLayers((v) => ({ ...v, area: e.target.checked }))
                  }
                />
                <span>Área de influência</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={projectLayers.poi}
                  onChange={(e) =>
                    setProjectLayers((v) => ({ ...v, poi: e.target.checked }))
                  }
                />
                <span>Pontos de interesse</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Município:</span>
              <p className="text-gray-600">{(selectedItem as Project)?.municipality}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className={`capitalize ${
                (selectedItem as Project)?.status === 'ativo' ? 'text-green-600' :
                (selectedItem as Project)?.status === 'em-breve' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {(selectedItem as Project)?.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectDetails = () => (
    <div>
      <div className="bg-[#2c7873] text-white p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-1">{selectedItem?.title}</h3>
        <p className="text-sm opacity-90">Informações detalhadas do projeto</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
          <p className="text-gray-700 leading-relaxed">{selectedItem?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Informações Gerais</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Município:</span>
                <span className="font-medium">{(selectedItem as Project)?.municipality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium capitalize">{(selectedItem as Project)?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium capitalize ${
                  (selectedItem as Project)?.status === 'ativo' ? 'text-green-600' :
                  (selectedItem as Project)?.status === 'em-breve' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>
                  {(selectedItem as Project)?.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entidades responsáveis:</span>
                <div className="text-right">
                  {(selectedItem as Project)?.responsibleEntities?.map((entity, index) => (
                    <div key={index} className="font-medium text-sm">{entity}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Cronograma</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Início:</span>
                <span className="font-medium">{new Date((selectedItem as Project)?.startDate || '').toLocaleDateString('pt-PT')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fim:</span>
                <span className="font-medium">{new Date((selectedItem as Project)?.endDate || '').toLocaleDateString('pt-PT')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Participação</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-[#2c7873]" />
              <span className="text-gray-600">Participantes:</span>
              <span className="font-medium">{(selectedItem as Project)?.participants}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare size={16} className="text-[#2c7873]" />
              <span className="text-gray-600">Comentários:</span>
              <span className="font-medium">{(selectedItem as Project)?.comments}</span>
            </div>
          </div>
        </div>

        {(selectedItem as Project)?.status === 'ativo' && (
          <div className="bg-[#f0f7f4] border border-[#2c7873]/20 rounded-lg p-4">
            <h4 className="font-semibold text-[#2c7873] mb-2">Participe neste projeto</h4>
            <p className="text-gray-700 text-sm mb-3">
              Sua opinião é importante para o sucesso deste projeto. Clique no botão abaixo para deixar seu comentário.
            </p>
            <button
              onClick={() => setCurrentView('participate')}
              className="bg-[#2c7873] hover:bg-[#1f5a56] text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <MessageSquare size={16} />
              <span>Participar Agora</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPrograms = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-[#2c7873]">Programas</h3>
        <button
          onClick={() => { refreshMyComments(); setCurrentView('timeline'); }}
          className="px-3 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors flex items-center space-x-2 text-sm"
        >
          <Clock size={14} />
          <span>Meus Comentários</span>
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg">{program.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)} self-start`}>
                    {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{program.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>Duração: {program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={12} />
                    <span>{program.participants} participantes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {program.status === 'ativo' && (
                <button
                  onClick={() => {
                    setSelectedItem(program);
                    setCurrentView('participate');
                  }}
                  className="px-3 py-1 bg-[#2c7873] text-white rounded text-sm hover:bg-[#1f5a56] transition-colors"
                >
                  Participar
                </button>
              )}
              <button
                onClick={() => {
                    setSelectedItem(program);
                    setCurrentView('program-details');
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors flex items-center space-x-1"
                >
                  <Info size={12} />
                  <span>Detalhes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderProgramDetails = () => (
      <div>
        <div className="bg-[#2c7873] text-white p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-1">{selectedItem?.title}</h3>
          <p className="text-sm opacity-90">Informações detalhadas do programa</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
            <p className="text-gray-700 leading-relaxed">{selectedItem?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Informações Gerais</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{(selectedItem as Program)?.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-medium capitalize">{(selectedItem as Program)?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium capitalize ${
                    (selectedItem as Program)?.status === 'ativo' ? 'text-green-600' :
                    (selectedItem as Program)?.status === 'em-breve' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {(selectedItem as Program)?.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entidades responsáveis:</span>
                  <div className="text-right">
                    {(selectedItem as Program)?.responsibleEntities?.map((entity, index) => (
                      <div key={index} className="font-medium text-sm">{entity}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Cronograma</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Início:</span>
                  <span className="font-medium">{new Date((selectedItem as Program)?.startDate || '').toLocaleDateString('pt-PT')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fim:</span>
                  <span className="font-medium">{new Date((selectedItem as Program)?.endDate || '').toLocaleDateString('pt-PT')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Participação</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-[#2c7873]" />
                <span className="text-gray-600">Participantes:</span>
                <span className="font-medium">{(selectedItem as Program)?.participants}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare size={16} className="text-[#2c7873]" />
                <span className="text-gray-600">Comentários:</span>
                <span className="font-medium">{(selectedItem as Program)?.comments}</span>
              </div>
            </div>
          </div>

          {(selectedItem as Program)?.status === 'ativo' && (
            <div className="bg-[#f0f7f4] border border-[#2c7873]/20 rounded-lg p-4">
              <h4 className="font-semibold text-[#2c7873] mb-2">Participe neste programa</h4>
              <p className="text-gray-700 text-sm mb-3">
                Sua participação é importante para o sucesso deste programa. Clique no botão abaixo para deixar seu comentário.
              </p>
              <button
                onClick={() => setCurrentView('participate')}
                className="bg-[#2c7873] hover:bg-[#1f5a56] text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <MessageSquare size={16} />
                <span>Participar Agora</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );

    const renderParticipate = () => (
      <div>
        <div className="bg-[#2c7873] text-white p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-1">Participar em: {selectedItem?.title}</h3>
          <p className="text-sm opacity-90">Deixe seu comentário e contribua para este projeto/programa</p>
        </div>

        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome *</label>
              <input
                title='Seu Nome'
                type="text"
                value={commentForm.userName}
                onChange={(e) => setCommentForm(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                title='Email'
                type="email"
                value={commentForm.email}
                onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classificação *</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {classifications.map((classification) => (
                <label
                  key={classification.value}
                  className={`flex items-center justify-center p-2 border rounded cursor-pointer transition-colors text-xs ${
                    commentForm.classification === classification.value
                      ? `border-current ${classification.color} ${classification.bg}`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="classification"
                    value={classification.value}
                    checked={commentForm.classification === classification.value}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, classification: e.target.value }))}
                    className="sr-only"
                  />
                  <span className={`font-medium ${classification.color}`}>
                    {classification.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seu Comentário *</label>
            <textarea
              value={commentForm.content}
              onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm"
              placeholder="Compartilhe sua opinião, sugestão ou proposta..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anexar Fotos/Documentos (opcional)
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-[#2c7873] transition-colors cursor-pointer"
              onClick={() => document.getElementById('incident-file-input')?.click()}
            >
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Camera className="text-gray-400" size={20} />
                <Upload className="text-gray-400" size={20} />
              </div>
              <span className="text-sm text-gray-600 font-medium">Clique para selecionar ou arraste os arquivos</span>
              <p className="text-xs text-gray-500 mt-1">Máximo 5 arquivos (JPG, PNG, PDF - máx. 10MB cada)</p>
              <input
                title='Anexar Fotos/Documentos'
                id="incident-file-input"
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-600 font-medium">
                  Arquivos selecionados ({selectedFiles.length}/5):
                </p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith('image/') ? (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ) : (
                        <FileText size={16} className="text-gray-500" />
                      )}
                      <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                    <button
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

          <div className="flex items-center p-3 bg-[#f0f7f4] rounded border border-[#2c7873]/20">
            <input
              type="checkbox"
              id="allowPublication"
              checked={commentForm.allowPublication}
              onChange={(e) => setCommentForm(prev => ({ ...prev, allowPublication: e.target.checked }))}
              className="mr-2 w-4 h-4"
            />
            <label htmlFor="allowPublication" className="text-sm text-gray-700">
              Autorizo a publicação do meu comentário no relatório de encerramento
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2c7873] hover:bg-[#1f5a56] text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Send size={16} />
            <span>Enviar Comentário</span>
          </button>
        </form>
      </div>
    );

    const renderTimeline = () => (
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <h3 className="text-xl font-bold text-[#2c7873]">Meus Comentários</h3>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {isMobile ? (
              <>
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className="px-3 py-2 border rounded hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <Filter size={16} />
                  <span>Filtrar</span>
                </button>
                {showFilter && (
                  <input
                    type="text"
                    value={commentsFilter}
                    onChange={(e) => setCommentsFilter(e.target.value)}
                    placeholder="Filtrar..."
                    className="px-3 py-2 border rounded text-sm flex-1"
                  />
                )}
              </>
            ) : (
              <input
                type="text"
                value={commentsFilter}
                onChange={(e) => setCommentsFilter(e.target.value)}
                placeholder="Filtrar por título, classificação, conteúdo..."
                className="px-3 py-2 border rounded text-sm"
              />
            )}
            <button onClick={refreshMyComments} className="px-3 py-2 border rounded hover:bg-gray-50 text-sm">Atualizar</button>
          </div>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {myComments
            .filter(r => {
              if (!commentsFilter) return true;
              const t = commentsFilter.toLowerCase();
              return (
                String(r.title || '').toLowerCase().includes(t) ||
                String(r.classification || '').toLowerCase().includes(t) ||
                String(r.content || '').toLowerCase().includes(t) ||
                String(r.municipality || '').toLowerCase().includes(t)
              );
            })
            .map((r) => (
            <div key={r.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1 text-base md:text-lg">{r.title || (r.type === 'program' ? 'Programa' : 'Projeto')}</h4>
                  <p className="text-gray-600 text-sm mb-2">{r.content}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={12} />
                      <span className="capitalize">{(r.classification || '').replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 md:ml-3 flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge(r.status)}`}>
                    {(r.status || 'enviado').replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {myComments.length === 0 && (
            <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">Sem comentários encontrados.</div>
          )}
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 md:p-6 border-b">
            <div className="flex items-center space-x-3">
              {currentView !== 'home' && (
                <button
                  title='Voltar'
                  onClick={handleBack}
                  className="text-[#2c7873] hover:text-[#1f5a56] transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="text-lg md:text-xl font-semibold">Participação Cidadão</h2>
            </div>
            <button title='Fechar' onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 md:p-6">
            {currentView === 'home' && renderHome()}
            {currentView === 'projects' && renderProjects()}
            {currentView === 'programs' && renderPrograms()}
            {currentView === 'participate' && renderParticipate()}
            {currentView === 'timeline' && renderTimeline()}
            {currentView === 'project-map' && renderProjectMap()}
            {currentView === 'project-details' && renderProjectDetails()}
            {currentView === 'program-details' && renderProgramDetails()}
          </div>
        </div>
      </div>
    );
  };

  export default ParticipationModal;