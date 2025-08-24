import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, GeoJSON, useMap } from 'react-leaflet';
import ScaleControl from './ScaleControl';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  height?: string;
  center?: [number, number];
  zoom?: number;
  draggableMarker?: boolean;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  markerPosition?: [number, number] | null;
  layers?: 'base' | 'incidents' | 'waste' | 'projects';
  showGetLocationButton?: boolean;
  geojsonLayers?: any[]; // pode ser FeatureCollection simples ou { data, style }
  fitBounds?: any; // LatLngBoundsLike
}

// Custom draggable marker component
const DraggableMarker: React.FC<{
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}> = ({ position, onDragEnd }) => {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const { lat, lng } = marker.getLatLng();
        onDragEnd(lat, lng);
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
};

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // Simulate reverse geocoding
      const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      onLocationSelect(lat, lng, address);
    },
  });
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  height = '400px',
  center = [15.1200, -23.6000], // Cape Verde coordinates
  zoom = 10,
  draggableMarker = false,
  onLocationSelect,
  markerPosition,
  layers = 'base',
  showGetLocationButton = false,
  geojsonLayers = [],
  fitBounds
}) => {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(markerPosition ?? null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setCurrentPosition(markerPosition ?? null);
  }, [markerPosition]);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setCurrentPosition([lat, lng]);
    onLocationSelect?.(lat, lng, address);
  };

  const handleMarkerDragEnd = (lat: number, lng: number) => {
    setCurrentPosition([lat, lng]);
    const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    onLocationSelect?.(lat, lng, address);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentPosition([lat, lng]);
        const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        onLocationSelect?.(lat, lng, address);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        let errorMessage = 'Erro ao obter localização';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização não disponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite para obter localização';
            break;
        }
        alert(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const startFollowing = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }
    setIsGettingLocation(true);
    try {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentPosition([lat, lng]);
          const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
          onLocationSelect?.(lat, lng, address);
          setIsGettingLocation(false);
          setIsFollowing(true);
        },
        (error) => {
          console.error('Erro ao seguir localiza��ão:', error);
          let errorMessage = 'Erro ao obter localização';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização não disponível';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite para obter localização';
              break;
          }
          alert(errorMessage);
          setIsGettingLocation(false);
          setIsFollowing(false);
          if (watchId != null) {
            try { navigator.geolocation.clearWatch(watchId); } catch {}
            setWatchId(null);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 5000
        }
      );
      setWatchId(id as unknown as number);
    } catch (e) {
      console.error('Falha ao iniciar watchPosition', e);
      setIsGettingLocation(false);
    }
  };

  const stopFollowing = () => {
    if (watchId != null) {
      try { navigator.geolocation.clearWatch(watchId); } catch {}
      setWatchId(null);
    }
    setIsFollowing(false);
  };

  useEffect(() => {
    return () => {
      if (watchId != null) {
        try { navigator.geolocation.clearWatch(watchId); } catch {}
      }
    };
  }, [watchId]);

  // Different tile layers based on functionality
  const getTileLayer = () => {
    switch (layers) {
      case 'incidents':
        return (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        );
      case 'waste':
        return (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        );
      case 'projects':
        return (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        );
      default:
        return (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        );
    }
  };

  return (
      <div className="relative w-full" style={{ height }}>
        <MapContainer
          center={center}
          zoom={zoom}
          className="w-full h-full"
          scrollWheelZoom={true}
        >
 
        <CenterUpdater center={center} zoom={zoom} />
        {currentPosition && <PanToMarker position={currentPosition} />}
        {getTileLayer()}

        {fitBounds && <FitBounds bounds={fitBounds} />}

        {geojsonLayers && geojsonLayers.map((g, idx) => {
          const data = (g as any)?.data ?? g;
          const style = (g as any)?.style ?? { color: '#2c7873', weight: 2, opacity: 1 };
          return <GeoJSON key={idx} data={data} style={style} />
        })}
        
        {onLocationSelect && !draggableMarker && (
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        )}
        
        {currentPosition && draggableMarker && (
          <DraggableMarker
            position={currentPosition}
            onDragEnd={handleMarkerDragEnd}
          />
        )}
        
        {currentPosition && !draggableMarker && (
          <Marker position={currentPosition} />
        )}
      <ScaleControl />
      </MapContainer>
      
      {showGetLocationButton && (
        <button
          onClick={isFollowing ? stopFollowing : startFollowing}
          disabled={isGettingLocation}
          className={`absolute top-3 right-3 z-[1000] ${isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-[#2c7873] hover:bg-[#1f5a56]'} text-white px-3 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isGettingLocation ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Obtendo...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{isFollowing ? 'Parar' : 'Minha Localização'}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

const CenterUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    try { map.setView(center, zoom, { animate: true }); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom]);
  return null;
};

const PanToMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    try { map.panTo(position); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position[0], position[1]]);
  return null;
};

const FitBounds: React.FC<{ bounds: any }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      try { map.fitBounds(bounds, { padding: [20, 20] }); } catch {}
    }
  }, [bounds]);
  return null;
};

export default MapComponent;