import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

const ScaleControl: React.FC = () => {
  const map = useMap();
  const [scale, setScale] = useState('');

  useEffect(() => {
    const updateScale = () => {
      const zoom = map.getZoom();
      const center = map.getCenter();
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

export default ScaleControl;
