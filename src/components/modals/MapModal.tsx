import React, { useState } from 'react';
import { X, Eye, EyeOff, ArrowLeft, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, Circle, Polyline, GeoJSON } from 'react-leaflet';
import ScaleControl from '../ScaleControl';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Intervention {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'execution' | 'completed' | 'protected' | 'incident';
  coordinates: [number, number];
  municipality: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
}

const interventions: Intervention[] = [
  {
    id: '1',
    title: 'Requalificação do Centro da Praia',
    description: 'Projeto de requalificação urbana do centro histórico da cidade da Praia',
    status: 'execution',
    coordinates: [14.9177, -23.5092],
    municipality: 'Praia',
    startDate: '2024-01-15',
    budget: '2.5M CVE'
  },
  {
    id: '2',
    title: 'Parque Urbano de Assomada',
    description: 'Criação de novo parque urbano com áreas de lazer e desporto',
    status: 'planning',
    coordinates: [15.1067, -23.6775],
    municipality: 'Santa Catarina',
    startDate: '2024-06-01',
    budget: '1.8M CVE'
  },
  {
    id: '3',
    title: 'Reabilitação da Frente Marítima - Mindelo',
    description: 'Reabilitação e modernização da frente marítima de Mindelo',
    status: 'completed',
    coordinates: [16.8866, -24.9956],
    municipality: 'São Vicente',
    endDate: '2023-12-20',
    budget: '3.2M CVE'
  },
  {
    id: '4',
    title: 'Reserva Natural de Santa Luzia',
    description: 'Área protegida para conservação da biodiversidade',
    status: 'protected',
    coordinates: [16.7667, -24.7500],
    municipality: 'São Vicente',
  },
  {
    id: '5',
    title: 'Erosão Costeira - Sal Rei',
    description: 'Problema de erosão costeira reportado pelos munícipes',
    status: 'incident',
    coordinates: [16.1833, -22.9167],
    municipality: 'Boa Vista',
  },
  {
    id: '6',
    title: 'Centro de Tratamento de Resíduos - Tarrafal',
    description: 'Construção de novo centro de tratamento de resíduos sólidos',
    status: 'planning',
    coordinates: [15.2833, -23.7500],
    municipality: 'Tarrafal',
    startDate: '2024-08-01',
    budget: '4.1M CVE'
  },
  {
    id: '7',
    title: 'Requalificação da Ribeira Grande',
    description: 'Projeto de requalificação urbana e proteção contra cheias',
    status: 'execution',
    coordinates: [17.1333, -25.0667],
    municipality: 'Ribeira Grande',
    startDate: '2024-03-10',
    budget: '2.8M CVE'
  },
  {
    id: '8',
    title: 'Parque Natural do Fogo',
    description: 'Área protegida do vulcão e caldeira do Fogo',
    status: 'protected',
    coordinates: [14.9500, -24.3500],
    municipality: 'São Filipe',
  }
];

// Custom marker icons for different statuses
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: ${color};
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const statusIcons = {
  planning: createCustomIcon('#2c7873'),
  execution: createCustomIcon('#6fb98f'),
  completed: createCustomIcon('#004d47'),
  protected: createCustomIcon('#ffc107'),
  incident: createCustomIcon('#dc3545')
};

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to fit bounds to visible markers
const FitToBounds: React.FC<{ bounds: [[number, number], [number, number]] | null }> = ({ bounds }) => {
  const map = useMap();
  React.useEffect(() => {
    if (bounds) {
      try { map.fitBounds(bounds, { padding: [20, 20] }); } catch {}
    }
  }, [bounds]);
  return null;
};

// Monitors map bounds and reports to parent
const BoundsWatcher: React.FC<{ onBounds: (b: any) => void }> = ({ onBounds }) => {
  const map = useMap();
  React.useEffect(() => {
    const handler = () => onBounds(map.getBounds());
    map.on('moveend', handler);
    handler();
    return () => { map.off('moveend', handler); };
  }, [map, onBounds]);
  return null;
};

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose }) => {
  const [visibleStatuses, setVisibleStatuses] = useState<Set<string>>(
    new Set(['planning', 'execution', 'completed', 'protected', 'incident'])
  );
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [projectView, setProjectView] = useState<Intervention | null>(null);
  const [projectLayers, setProjectLayers] = useState({ marker: true, area: true, poi: true, route: false });
  const [query, setQuery] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [base, setBase] = useState<'osm' | 'sat'>('osm');
  const [fitBoundsTarget, setFitBoundsTarget] = useState<[[number,number],[number,number]] | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [showOnlyInView, setShowOnlyInView] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [adminLayers, setAdminLayers] = useState<any[]>([]);
  const dated = interventions.filter(i => i.startDate || i.endDate);
  const minYear = dated.length ? Math.min(...dated.map(i => i.startDate ? new Date(i.startDate).getFullYear() : new Date(i.endDate as string).getFullYear())) : 0;
  const maxYear = dated.length ? Math.max(...dated.map(i => i.endDate ? new Date(i.endDate).getFullYear() : new Date(i.startDate as string).getFullYear())) : 0;
  const [year, setYear] = useState<number | null>(null);
  const municipalities = Array.from(new Set(interventions.map(i => i.municipality))).sort();
  const [visibleInterventionsOpen, setVisibleInterventionsOpen] = useState(true);

  // Carregar camadas GeoJSON do administrador (escopo 'header') ao abrir
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('adminDatasets');
      const arr = raw ? JSON.parse(raw) : [];
      const layers = Array.isArray(arr)
        ? arr
            .filter((d: any) => d && d.active && d.features && (d.scope || 'header') === 'participate')
            .map((d: any) => ({ id: d.id, name: d.name, data: d.features, style: { color: '#2c7873', weight: 2, opacity: 1 }, visible: true }))
        : [];
      setAdminLayers(layers);
    } catch {
      setAdminLayers([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const legendItems = [
    { 
      status: 'planning', 
      color: '#2c7873', 
      label: 'Projetos em planeamento',
      count: interventions.filter(i => i.status === 'planning').length
    },
    { 
      status: 'execution', 
      color: '#6fb98f', 
      label: 'Projetos em execução',
      count: interventions.filter(i => i.status === 'execution').length
    },
    { 
      status: 'completed', 
      color: '#004d47', 
      label: 'Projetos concluídos',
      count: interventions.filter(i => i.status === 'completed').length
    },
    { 
      status: 'protected', 
      color: '#ffc107', 
      label: 'Áreas protegidas',
      count: interventions.filter(i => i.status === 'protected').length
    },
    { 
      status: 'incident', 
      color: '#dc3545', 
      label: 'Ocorrências reportadas',
      count: interventions.filter(i => i.status === 'incident').length
    }
  ];

  const toggleStatus = (status: string) => {
    const newVisibleStatuses = new Set(visibleStatuses);
    if (newVisibleStatuses.has(status)) {
      newVisibleStatuses.delete(status);
    } else {
      newVisibleStatuses.add(status);
    }
    setVisibleStatuses(newVisibleStatuses);
  };

  const toggleAdminLayer = (id: string) => {
    setAdminLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const filteredInterventions = interventions.filter(intervention => {
    if (!visibleStatuses.has(intervention.status)) return false;
    if (municipality && intervention.municipality !== municipality) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!(intervention.title.toLowerCase().includes(q) || intervention.description.toLowerCase().includes(q) || intervention.municipality.toLowerCase().includes(q))) return false;
    }
    if (year !== null) {
      const sY = intervention.startDate ? new Date(intervention.startDate).getFullYear() : undefined;
      const eY = intervention.endDate ? new Date(intervention.endDate).getFullYear() : undefined;
      const inRange = (sY !== undefined && eY !== undefined) ? (sY <= year && year <= eY)
        : (sY !== undefined) ? (sY <= year)
        : (eY !== undefined) ? (year <= eY)
        : true;
      if (!inRange) return false;
    }
    if (showOnlyInView && mapBounds) {
      try {
        const latlng = L.latLng(intervention.coordinates[0], intervention.coordinates[1]);
        if (!mapBounds.contains(latlng)) return false;
      } catch {}
    }
    return true;
  });

  const getStatusLabel = (status: string) => {
    const item = legendItems.find(item => item.status === status);
    return item ? item.label : status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Mapa Interativo</h2>
          <button aria-label='Fechar' onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map */}
            <div className="lg:col-span-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">Base:</span>
                    <select aria-label='Base' value={base} onChange={(e)=>setBase(e.target.value as any)} className="border rounded px-1 py-0.5 text-sm">
                      <option value="osm">Padrão</option>
                      <option value="sat">Satélite</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-1 text-gray-700">
                    <input type="checkbox" checked={showOnlyInView} onChange={(e)=> setShowOnlyInView(e.target.checked)} />
                    <span>Em vista</span>
                  </label>
                  <label className="flex items-center gap-1 text-gray-700">
                    <input type="checkbox" checked={showLabels} onChange={(e)=> setShowLabels(e.target.checked)} />
                    <span>Rótulos</span>
                  </label>
                  <button onClick={()=>{
                    if (filteredInterventions.length>0){
                      const bounds = filteredInterventions.reduce((acc, it)=>{
                        const [lat,lng]=it.coordinates; return acc? [[Math.min(acc[0][0],lat),Math.min(acc[0][1],lng)],[Math.max(acc[1][0],lat),Math.max(acc[1][1],lng)]] : [[lat,lng],[lat,lng]];
                      }, null as any);
                      setFitBoundsTarget(bounds);
                      setTimeout(()=>setFitBoundsTarget(null), 300);
                    }
                  }} className="px-2 py-1 bg-[#2c7873] text-white rounded hover:bg-[#1f5a56]">Ajustar vista</button>
                  <button onClick={()=>{
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos)=>{
                        const { latitude, longitude } = pos.coords;
                        setUserLocation([latitude, longitude]);
                        if (mapInstance?.flyTo) mapInstance.flyTo([latitude, longitude], 13);
                      }, (err)=>{
                        alert('Não foi possível obter sua localização: ' + err.message);
                      }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
                    } else {
                      alert('Geolocalização não é suportada pelo seu navegador.');
                    }
                  }} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Minha localização</button>
                </div>
                <div className="flex items-center">
                  <button
                    disabled={!selectedIntervention}
                    onClick={()=>{ if (!selectedIntervention) { alert('Selecione um projeto primeiro.'); return; } setProjectView(selectedIntervention); }}
                    className={`px-3 py-2 rounded inline-flex items-center gap-2 ${selectedIntervention ? 'bg-gray-800 text-white hover:bg-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    title="Abrir em tela cheia"
                  >
                    <Maximize2 size={18} />
                    <span>Tela cheia</span>
                  </button>
                </div>
              </div>
              <div className="h-[28rem] rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                  center={[15.5, -23.5]}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                  whenReady={(m:any)=> { setMapInstance(m); setTimeout(()=>{ try{ m.invalidateSize(); }catch{} }, 50); }}
                  key={`map-${base}`}
                >
                  <TileLayer
                    url={base==='osm' ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}
                    attribution={base==='osm' ? '&copy; OpenStreetMap contributors' : '&copy; Esri'}
                  />
                  {fitBoundsTarget && <FitToBounds bounds={fitBoundsTarget} />}
                  <BoundsWatcher onBounds={setMapBounds} />
                  {filteredInterventions.map((intervention) => (
                    <Marker
                      key={intervention.id}
                      position={intervention.coordinates}
                      icon={statusIcons[intervention.status]}
                      eventHandlers={{
                        click: () => setSelectedIntervention(intervention)
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent={showLabels}>{intervention.title}</Tooltip>
                      <Popup>
                        <div className="min-w-[200px] max-w-[260px]">
                          <div className="font-semibold text-sm text-gray-900 mb-1">{intervention.title}</div>
                          <div className="text-xs text-gray-700 mb-2">
                            {intervention.description.length > 140 ? `${intervention.description.slice(0, 140)}...` : intervention.description}
                          </div>
                          <button
                            className="text-xs px-2 py-1 bg-[#2c7873] text-white rounded hover:bg-[#1f5a56]"
                            onClick={() => setSelectedIntervention(intervention)}
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {/* Admin layers (escopo participate) + ajuste automático de vista */}
                  {adminLayers.filter((l: any) => l.visible).length > 0 && (
                    <FitToBounds bounds={(function(){
                      try {
                        const coords: [number, number][] = [] as any;
                        adminLayers.filter((l: any) => l.visible).forEach((l: any) => {
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
                        if (!coords.length) return null as any;
                        const lats = coords.map(c => c[0]);
                        const lngs = coords.map(c => c[1]);
                        return [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]] as any;
                      } catch { return null as any; }
                    })()} />
                  )}
                  {adminLayers.filter((l: any) => l.visible).map((l: any) => (
                    <GeoJSON key={`admin-${l.id}`} data={l.data} style={l.style} />
                  ))}
                  {userLocation && (
                    <Marker 
                      position={userLocation}
                      icon={L.divIcon({
                        className: 'custom-location-marker',
                        html: '<div style="background-color: #0817f3ff; border-radius: 50%; width: 16px; height: 16px; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
                        iconSize: [22, 22],
                        iconAnchor: [11, 11]
                      })}
                    />
                  )}
                  <ScaleControl />
                </MapContainer>
              </div>
              {/* Quick Controls */}
              <div className="hidden">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Base:</span>
                  <select title='Base' value={base} onChange={(e)=>setBase(e.target.value as any)} className="border rounded px-1 py-0.5 text-sm">
                    <option value="osm">Padrão</option>
                    <option value="sat">Satélite</option>
                  </select>
                </div>
                <label className="flex items-center gap-1 text-gray-700">
                  <input type="checkbox" checked={showOnlyInView} onChange={(e)=> setShowOnlyInView(e.target.checked)} />
                  <span>Em vista</span>
                </label>
                <label className="flex items-center gap-1 text-gray-700">
                  <input type="checkbox" checked={showLabels} onChange={(e)=> setShowLabels(e.target.checked)} />
                  <span>Rótulos</span>
                </label>
                <button onClick={()=>{
                  if (filteredInterventions.length>0){
                    const bounds = filteredInterventions.reduce((acc, it)=>{
                      const [lat,lng]=it.coordinates; return acc? [[Math.min(acc[0][0],lat),Math.min(acc[0][1],lng)],[Math.max(acc[1][0],lat),Math.max(acc[1][1],lng)]] : [[lat,lng],[lat,lng]];
                    }, null as any);
                    setFitBoundsTarget(bounds);
                    setTimeout(()=>setFitBoundsTarget(null), 300);
                  }
                }} className="px-2 py-1 bg-[#2c7873] text-white rounded hover:bg-[#1f5a56]">Ajustar vista</button>
                <button onClick={()=>{
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos)=>{
                      const { latitude, longitude } = pos.coords;
                      setUserLocation([latitude, longitude]);
                      if (mapInstance?.flyTo) mapInstance.flyTo([latitude, longitude], 13);
                    }, (err)=>{
                      alert('Não foi possível obter sua localização: ' + err.message);
                    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
                  } else {
                    alert('Geolocalização não é suportada pelo seu navegador.');
                  }
                }} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Minha localização</button>
                              </div>
                          </div>

            {/* Interactive Legend */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h6 className="text-lg font-semibold mb-4 text-gray-800">Legenda </h6>
                {/* Filters */}
                <div className="mb-4 space-y-2">
                  <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Pesquisar" className="w-full px-2 py-1 border rounded text-sm" />
                  <select title='Municipio' value={municipality} onChange={(e)=>setMunicipality(e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                    <option value="">Município</option>
                    {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={showOnlyInView} onChange={(e)=> setShowOnlyInView(e.target.checked)} />
                      <span>Filtrar por área </span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={showLabels} onChange={(e)=> setShowLabels(e.target.checked)} />
                      <span>Mostrar rótulos</span>
                    </label>
                  </div>
                  {minYear && maxYear && minYear !== maxYear && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-xs">Ano:</span>
                      <input title='Ano' type="range" min={minYear} max={maxYear} value={year ?? maxYear} onChange={(e)=> setYear(parseInt((e.target as HTMLInputElement).value))} className="w-full" />
                      <span className="text-gray-700 text-xs">{year ?? 'Todos'}</span>
                      <button onClick={()=> setYear(null)} className="text-xs text-blue-600 underline">Limpar</button>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {legendItems.map((item) => (
                    <button
                      key={item.status}
                      onClick={() => toggleStatus(item.status)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        visibleStatuses.has(item.status)
                          ? 'border-gray-300 bg-white shadow-sm'
                          : 'border-gray-200 bg-gray-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-800">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.count} item{item.count !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        {visibleStatuses.has(item.status) ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Total visível:</strong> {filteredInterventions.length} de {interventions.length}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setVisibleStatuses(new Set(['planning', 'execution', 'completed', 'protected', 'incident']))}
                      className="w-full text-xs bg-[#2c7873] text-white py-2 px-3 rounded hover:bg-[#1f5a56] transition-colors"
                    >
                      Mostrar Todos
                    </button>
                    <button
                      onClick={() => setVisibleStatuses(new Set())}
                      className="w-full text-xs bg-gray-500 text-white py-2 px-3 rounded hover:bg-gray-600 transition-colors"
                    >
                      Ocultar Todos
                    </button>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-800 mb-2">Camadas Recentes</div>
                      {adminLayers.length === 0 ? (
                        <div className="text-xs text-gray-500">Sem camadas disponíveis.</div>
                      ) : (
                        <ul className="space-y-1 max-h-40 overflow-y-auto">
                          {adminLayers.map((l: any) => (
                            <li key={l.id} className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-3 h-3 rounded" style={{ backgroundColor: l.style?.color || '#2c7873' }}></span>
                                <span className="text-sm text-gray-700 truncate" title={l.name}>{l.name}</span>
                              </div>
                              <input title='Camadas' type="checkbox" className="w-4 h-4" checked={!!l.visible} onChange={()=> toggleAdminLayer(l.id)} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button onClick={()=> setVisibleInterventionsOpen(o=>!o)} className="w-full flex items-center justify-between text-left">
                      <h6 className="text-sm font-semibold text-gray-800">Intervenções visíveis</h6>
                      {visibleInterventionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <div className={`${visibleInterventionsOpen ? 'mt-2' : 'hidden'}`}>
                      <ul className="max-h-64 overflow-y-auto divide-y">
                        {filteredInterventions.map((it) => (
                          <li key={it.id} className="py-2 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{it.title}</div>
                              <div className="text-xs text-gray-500 truncate">{it.municipality} • {getStatusLabel(it.status)}</div>
                            </div>
                            <button onClick={()=>{ setSelectedIntervention(it); if (mapInstance?.flyTo) mapInstance.flyTo(it.coordinates, 13); }} className="text-xs px-2 py-1 border rounded hover:bg-gray-100">Centrar</button>
                          </li>
                          ))}
                        {filteredInterventions.length === 0 && (
                          <li className="py-2 text-xs text-gray-500">Nenhum item corresponde aos filtros.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          {/* Selected Intervention Details */}
          {selectedIntervention && (
            <div className="mt-6 p-4 bg-gradient-to-r from-[#f0f7f4] to-[#e8f5e8] rounded-lg border border-[#2c7873]/20">
              <div className="flex items-start justify-between mb-3">
                <h6 className="font-semibold text-[#2c7873] text-lg">{selectedIntervention.title}</h6>
                <button
                  title='Fechar detalhes'
                  onClick={() => setSelectedIntervention(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-gray-700 mb-3">{selectedIntervention.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-gray-800">Status:</strong>
                  <div className="flex items-center space-x-2 mt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: legendItems.find(item => item.status === selectedIntervention.status)?.color }}
                    />
                    <span>{getStatusLabel(selectedIntervention.status)}</span>
                  </div>
                </div>
                <div>
                  <strong className="text-gray-800">Município:</strong>
                  <div className="mt-1">{selectedIntervention.municipality}</div>
                </div>
                {selectedIntervention.budget && (
                  <div>
                    <strong className="text-gray-800">Orçamento:</strong>
                    <div className="mt-1">{selectedIntervention.budget}</div>
                  </div>
                )}
                {selectedIntervention.startDate && (
                  <div>
                    <strong className="text-gray-800">Data de Início:</strong>
                    <div className="mt-1">{new Date(selectedIntervention.startDate).toLocaleDateString('pt-PT')}</div>
                  </div>
                )}
                {selectedIntervention.endDate && (
                  <div>
                    <strong className="text-gray-800">Data de Conclusão:</strong>
                    <div className="mt-1">{new Date(selectedIntervention.endDate).toLocaleDateString('pt-PT')}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Project focused view overlay */}
        {projectView && (
          <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{projectView.title}</h3>
                <button onClick={()=>setProjectView(null)} className="inline-flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-100 text-gray-700"><ArrowLeft size={18}/> Voltar</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-3 h-[60vh] border-r">
                  <MapContainer
                    center={projectView.coordinates}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                    whenReady={(m:any)=> setTimeout(()=>{ try{ m.invalidateSize(); }catch{} }, 50)}
                  >
                    <TileLayer url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} attribution={'&copy; OpenStreetMap contributors'} />
                    {projectLayers.marker && (
                      <Marker position={projectView.coordinates} icon={statusIcons[projectView.status]}>
                        <Popup>
                          <div className="min-w-[200px] max-w-[260px]">
                            <div className="font-semibold text-sm text-gray-900 mb-1">{projectView.title}</div>
                            <div className="text-xs text-gray-700">
                              {projectView.description?.length > 160 ? `${projectView.description.slice(0, 160)}...` : projectView.description}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    {projectLayers.area && (
                      <Circle center={projectView.coordinates} radius={1000} pathOptions={{ color: '#2c7873', fillOpacity: 0.1 }} />
                    )}
                    {projectLayers.route && (
                      <Polyline positions={[
                        projectView.coordinates,
                        [projectView.coordinates[0]+0.01, projectView.coordinates[1]+0.01],
                        [projectView.coordinates[0]+0.02, projectView.coordinates[1]-0.005]
                      ]} pathOptions={{ color: '#2563eb' }} />
                    )}
                    {projectLayers.poi && ([
                    <Circle key="poi1" center={[projectView.coordinates[0]+0.006, projectView.coordinates[1]+0.003]} radius={80} pathOptions={{ color: '#f59e0b', fillOpacity: .2 }} />, 
                    <Circle key="poi2" center={[projectView.coordinates[0]-0.004, projectView.coordinates[1]-0.004]} radius={80} pathOptions={{ color: '#f59e0b', fillOpacity: .2 }} />
                    ])}
                    <ScaleControl />
                    </MapContainer>
                </div>
                <div className="lg:col-span-1 p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Legenda do Projeto</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <input title='Legenda' type="checkbox" checked={projectLayers.marker} onChange={(e)=>setProjectLayers(v=>({ ...v, marker: e.target.checked }))} />
                        <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#2c7873' }}></span>
                        <span>Ponto do projeto</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input title='Legenda' type="checkbox" checked={projectLayers.area} onChange={(e)=>setProjectLayers(v=>({ ...v, area: e.target.checked }))} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2c7873' }}></span>
                        <span>Área de influência (1 km)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input title='Legenda' type="checkbox" checked={projectLayers.poi} onChange={(e)=>setProjectLayers(v=>({ ...v, poi: e.target.checked }))} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></span>
                        <span>Pontos de interesse</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <input title='Legenda' type="checkbox" checked={projectLayers.route} onChange={(e)=>setProjectLayers(v=>({ ...v, route: e.target.checked }))} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2563eb' }}></span>
                        <span>Rota prevista</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border-t pt-6 text-gray-700 space-y-1">
                    <h2 className="font-semibold text-gray-800 mb-2">Detalhes do Projeto</h2>
                    <div className=" text-sm text-gray-700 space-y-1">
                      <div><strong>Status:</strong> {getStatusLabel(projectView.status)}</div>
                      <div><strong>Município:</strong> {projectView.municipality}</div>
                      {projectView.startDate && (<div><strong>Início:</strong> {new Date(projectView.startDate).toLocaleDateString('pt-PT')}</div>)}
                      {projectView.endDate && (<div><strong>Conclusão:</strong> {new Date(projectView.endDate).toLocaleDateString('pt-PT')}</div>)}
                      {projectView.budget && (<div><strong>Orçamento:</strong> {projectView.budget}</div>)}
                    </div>
                  </div>
                  <div className="pt-2">
                    <button onClick={()=>setProjectView(null)} className="w-full px-3 py-2 bg-[#2c7873] text-white rounded hover:bg-[#1f5a56]">Voltar atrás</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
