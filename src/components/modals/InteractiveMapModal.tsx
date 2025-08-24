import React, { useState, useEffect } from 'react';
import { X, Layers, ChevronDown, ChevronUp, MapPin, Square, Minus, Trash2, Crosshair, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { MapContainer, TileLayer, WMSTileLayer, Marker, useMap, useMapEvents, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../../context/LanguageContext';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WMSService {
  id: string;
  name: string;
  url: string;
  layers: string;
  enabled: boolean;
  type: 'WMS' | 'WFS';
  description: string;
}

// Custom hook for drawing functionality
const DrawingControls: React.FC<{
  onDrawingModeChange: (mode: string | null) => void;
  drawingMode: string | null;
}> = ({ onDrawingModeChange, drawingMode }) => {
  const map = useMap();
  const [drawnItems, setDrawnItems] = useState<L.Layer[]>([]);

  useMapEvents({
    click(e) {
      if (drawingMode === 'marker') {
        const marker = L.marker(e.latlng).addTo(map);
        setDrawnItems(prev => [...prev, marker]);
        onDrawingModeChange(null);
      }
    }
  });

  const clearAll = () => {
    drawnItems.forEach(item => map.removeLayer(item));
    setDrawnItems([]);
  };

  // Expose clearAll function to parent
  useEffect(() => {
    (window as any).clearMapDrawings = clearAll;
  }, [drawnItems]);

  return null;
};

// Scale control component
const ScaleControl: React.FC = () => {
  const map = useMap();
  const [scale, setScale] = useState('');

  useEffect(() => {
    const updateScale = () => {
      const zoom = map.getZoom();
      const center = map.getCenter();
      
      // Calculate approximate scale based on zoom level and latitude
      const metersPerPixel = 40075016.686 * Math.abs(Math.cos(center.lat * Math.PI / 180)) / Math.pow(2, zoom + 8);
      const scale = Math.round(metersPerPixel * 100); // 100 pixels reference
      
      if (scale > 1000) {
        setScale(`${(scale / 1000).toFixed(1)} km`);
      } else {
        setScale(`${scale} m`);
      }
    };

    map.on('zoomend moveend', updateScale);
    updateScale();

    return () => {
      map.off('zoomend moveend', updateScale);
    };
  }, [map]);

  return (
    <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded shadow-lg border text-sm font-medium z-[1000]">
      <div className="flex items-center space-x-2">
        <div className="w-16 h-0.5 bg-black"></div>
        <span>{scale}</span>
      </div>
    </div>
  );
};

// Ajusta a vista do mapa aos limites das camadas GeoJSON fornecidas
const FitToAdminLayers: React.FC<{ layers: any[] }> = ({ layers }) => {
  const map = useMap();
  useEffect(() => {
    if (!layers || layers.length === 0) return;
    try {
      const coords: [number, number][] = [];
      layers.forEach((l: any) => {
        const fc = (l?.data ?? l) as any;
        const features = fc?.features || [];
        features.forEach((f: any) => {
          const g = f.geometry;
          if (!g) return;
          const pushCoord = (c: any) => { if (Array.isArray(c) && typeof c[0] === 'number') coords.push([c[1], c[0]]); };
          if (g.type === 'Point') pushCoord(g.coordinates);
          if (g.type === 'MultiPoint') g.coordinates.forEach(pushCoord);
          if (g.type === 'LineString') g.coordinates.forEach(pushCoord);
          if (g.type === 'MultiLineString') g.coordinates.flat(1).forEach(pushCoord);
          if (g.type === 'Polygon') g.coordinates.flat(1).forEach(pushCoord);
          if (g.type === 'MultiPolygon') g.coordinates.flat(2).forEach(pushCoord);
        });
      });
      if (!coords.length) return;
      const lats = coords.map(c => c[0]);
      const lngs = coords.map(c => c[1]);
      const bounds: any = [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];
      map.fitBounds(bounds, { padding: [20, 20] });
    } catch {}
  }, [layers, map]);
  return null;
};

// User location component
const UserLocationControl: React.FC<{ onLocationFound: (lat: number, lng: number) => void }> = ({ onLocationFound }) => {
  const map = useMap();

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 15);
          onLocationFound(latitude, longitude);
        },
        (error) => {
          alert(`Não foi possível obter sua localização: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  useEffect(() => {
    (window as any).locateMapUser = locateUser;
  }, []);

  return null;
};

const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [wmsServices, setWmsServices] = useState<WMSService[]>([
    {
      id: 'eco_pontos',
      name: 'Eco Pontos',
      url: 'https://gis-teste.nosi.cv/geoserver/Work_Jessica/wms',
      layers: 'Work_Jessica:Eco_pontos_jms',
      enabled: false,
      type: 'WMS',
      description: 'Pontos ecológicos do shapefile - dados de teste'
    },
   
  ]);

  const [legendOpen, setLegendOpen] = useState(true);
  const [adminLayers, setAdminLayers] = useState<any[]>([]);

  // Carrega camadas GeoJSON do administrador (escopo header)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('adminDatasets');
      const arr = raw ? JSON.parse(raw) : [];
      const layers = Array.isArray(arr)
        ? arr
            .filter((d: any) => d && d.active && d.features && (d.scope || 'header') === 'header')
            .map((d: any) => ({ id: d.id, name: d.name, data: d.features, style: { color: '#2c7873', weight: 2, opacity: 1 }, visible: true }))
        : [];
      setAdminLayers(layers);
    } catch {
      setAdminLayers([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleService = (serviceId: string) => {
    setWmsServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, enabled: !service.enabled }
        : service
    ));
  };

  const toggleAdminLayer = (id: string) => {
    setAdminLayers(prev => prev.map((l: any) => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const handleDrawingMode = (mode: string) => {
    setDrawingMode(drawingMode === mode ? null : mode);
  };

  const clearAllDrawings = () => {
    if ((window as any).clearMapDrawings) {
      (window as any).clearMapDrawings();
    }
  };

  const locateUser = () => {
    if ((window as any).locateMapUser) {
      (window as any).locateMapUser();
    }
  };

  // Zoom controls usando useMap
  const ZoomControls: React.FC = () => {
    const map = useMap();
    return (
      <div className="absolute bottom-16 left-4 z-[1001] bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => map.zoomIn()}
          className="block w-10 h-10 bg-white hover:bg-gray-100 text-gray-700 border-b border-gray-200 flex items-center justify-center transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="block w-10 h-10 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
      </div>
    );
  };

  // Versões anteriores inativas
  // const zoomIn = () => {};
  // const zoomOut = () => {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="relative w-[95%] h-[95%] bg-white rounded-xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-[1001] bg-white hover:bg-gray-100 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-[1001] bg-white rounded-lg shadow-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDrawingMode('polygon')}
              className={`p-2 rounded transition-colors flex items-center justify-center ${
                drawingMode === 'polygon' 
                  ? 'bg-[#2c7873] text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Desenhar Polígono"
            >
              <Square size={16} />
            </button>
            <button
              onClick={() => handleDrawingMode('line')}
              className={`p-2 rounded transition-colors flex items-center justify-center ${
                drawingMode === 'line' 
                  ? 'bg-[#2c7873] text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Desenhar Linha"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => handleDrawingMode('marker')}
              className={`p-2 rounded transition-colors flex items-center justify-center ${
                drawingMode === 'marker' 
                  ? 'bg-[#2c7873] text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Adicionar Marcador"
            >
              <MapPin size={16} />
            </button>
            <button
              onClick={clearAllDrawings}
              className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-700 transition-colors flex items-center justify-center"
              title="Limpar Tudo"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="border-t pt-2 space-y-2">
            <button
              onClick={locateUser}
              className="w-full p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors flex items-center justify-center"
              title="Minha Localização"
            >
              <Crosshair size={16} />
            </button>
          </div>
        </div>

        {/* Services Menu */}
        <div className="absolute top-4 left-20 z-[1001]">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
              className="flex items-center space-x-2 px-4 py-3 bg-[#2c7873] text-white hover:bg-[#1f5a56] transition-colors w-full"
            >
              <Layers size={18} />
              <span className="font-medium">Serviços</span>
              {servicesMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {servicesMenuOpen && (
              <div className="bg-white max-h-80 overflow-y-auto">
                <div className="p-3 border-b bg-gray-50">
                  <h6 className="text-sm font-semibold text-gray-700">Camadas Disponíveis</h6>
                </div>
                {wmsServices.map((service) => (
                  <div key={service.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={service.id}
                        checked={service.enabled}
                        onChange={() => toggleService(service.id)}
                        className="mt-1 w-4 h-4 text-[#2c7873] rounded focus:ring-[#2c7873]"
                      />
                      <div className="flex-1 min-w-0">
                        <label htmlFor={service.id} className="block text-sm font-medium text-gray-900 cursor-pointer">
                          {service.name}
                        </label>
                        <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            service.type === 'WMS' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {service.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend - Interactive */}
        <div className="absolute bottom-4 right-4 z-[1001] bg-white rounded-lg shadow-lg p-3 max-w-md w-70">
          <div className="flex items-center justify-between mb-1">
            <h6 className="font-semibold text-gray-900 mr-20">
              {lang === "fr" ? "Légende" : lang === "en" ? "Legend" : "Legenda"}
            </h6>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLegendOpen((o) => !o)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                title={
                  legendOpen
                    ? lang === "fr"
                      ? "Réduire"
                      : lang === "en"
                        ? "Collapse"
                        : "Recolher"
                    : lang === "fr"
                      ? "Développer"
                      : lang === "en"
                        ? "Expand"
                        : "Expandir"
                }
              >
                {legendOpen ? <ChevronUp size={14} /> :  <ChevronDown size={14} />}
              </button>         
            </div>
          </div>

          

          <div className={`space-y-2 ${legendOpen ? "" : "hidden"}`}>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-[#0817f3ff] rounded-full border-2 border-white shadow"></div>
              <span className="text-sm text-gray-700">
                {lang === "fr" ? "Votre position" : lang === "en" ? "Your location" : "Sua localização"}
              </span>
            </div>

            <div className="pt-2 border-t">

              <div className={` ${legendOpen ? "text-xs text-gray-500 mb-1" : "hidden"}`}>
                {lang === "fr" ? "Couches disponibles" : lang === "en" ? "Available Layers" : "Camadas Disponíveis"}
            </div>
                
              
                

              <div className="max-h-48 overflow-y-auto pr-1">
                {wmsServices.map((s) => (
                  <label key={s.id} className="flex items-center justify-between gap-2 py-1">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-3 h-3 rounded bg-center bg-cover"
                        style={{
                          backgroundImage: s.id.includes("eco")
                            ? "url('imagens/reciclagem.png')" // caminho da imagem
                            : "none",
                          backgroundColor: s.id.includes("residu")
                            ? "#16a34a"
                            : s.id.includes("orden") || s.id.includes("uso")
                              ? "#2563eb"
                              : s.id.includes("infra")
                                ? "#9333ea"
                                : s.id.includes("area")
                                  ? "#ef4444"
                                  : "#0ea5e9",
                        }}
                      ></span>

                      <span className="text-sm text-gray-700 truncate" title={s.name}>
                        {s.name}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={() => toggleService(s.id)}
                      className="w-4 h-4"
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t mt-2">
              <div className="text-xs text-gray-500 mb-1">Camadas recentes</div>
              <div className="max-h-48 overflow-y-auto pr-1">
                {adminLayers.length === 0 ? (
                  <div className="text-xs text-gray-400">Sem camadas.</div>
                ) : (
                  adminLayers.map((l: any) => (
                    <label key={l.id} className="flex items-center justify-between gap-2 py-1">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: l.style?.color || "#2c7873" }}
                        ></span>
                        <span className="text-sm text-gray-700 truncate" title={l.name}>
                          {l.name}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!l.visible}
                        onChange={() => toggleAdminLayer(l.id)}
                        className="w-4 h-4"
                      />
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-full">
          <MapContainer
            center={[15.1200, -23.6000]} // Cape Verde coordinates
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false} // We'll add custom zoom controls
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* WMS Layers */}
            {wmsServices.filter(service => service.enabled).map((service) => (
              <WMSTileLayer
                key={service.id}
                url={service.url}
                params={{
                  layers: service.layers,
                  format: 'image/png',
                  transparent: true,
                  
                  styles: ''
                }}
                version="1.1.1"
                crossOrigin={true}
                attribution={`&copy; ${service.name}`}
              />
            ))}

            {/* Admin GeoJSON Layers (escopo header) */}
            <FitToAdminLayers layers={adminLayers.filter((l: any) => l.visible)} />
            {adminLayers.filter((l: any) => l.visible).map((l: any) => (
              <GeoJSON
                key={`admin-${l.id}`}
                data={l.data}
                style={l.style}
                pointToLayer={(feature: any, latlng: any) => L.marker(latlng)}
                onEachFeature={(feature: any, layer: any) => {
                  try {
                    const props = feature?.properties || {};
                    const name = props.name || props.title || 'Ponto';
                    const desc = props.description || props.desc || '';
                    const html = `<div><strong>${name}</strong>${desc ? `<br/><span style="font-size:12px;color:#555">${desc}</span>` : ''}</div>`;
                    layer.bindPopup(html);
                  } catch {}
                }}
              />
            ))}
            
            {/* Custom Controls */}
            <DrawingControls 
              onDrawingModeChange={setDrawingMode}
              drawingMode={drawingMode}
            />
            <ScaleControl />
            <UserLocationControl 
              onLocationFound={(lat, lng) => setUserLocation([lat, lng])}
            />
            
            {/* User Location Marker */}
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
            <ZoomControls />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapModal;