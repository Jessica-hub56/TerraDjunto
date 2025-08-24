import React, { useState } from 'react';
import { X, MapPin, Truck, Phone, User } from 'lucide-react';
import MapComponent from '../MapComponent';

interface BulkyWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkyWasteModal: React.FC<BulkyWasteModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    items: '',
    preferredDate: ''
  });
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.contact || !location) {
      alert('Por favor, preencha todos os campos obrigatórios e defina a localização no mapa.');
      return;
    }
    alert('Solicitação de recolha enviada com sucesso! Entraremos em contacto em breve.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Truck className="text-[#2c7873]" size={24} />
              <span>Solicitar Recolha de Volumosos</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">Agende a recolha de móveis e eletrodomésticos</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Serviço especial para móveis, eletrodomésticos e outros objetos grandes. 
              Agendamento obrigatório com antecedência mínima de 48 horas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacto *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  placeholder="Telefone ou email para contacto"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização no Mapa *
              </label>
              <div className="h-64 rounded-lg border border-gray-300 overflow-hidden mb-3">
                <MapComponent
                  height="100%"
                  center={[15.1200, -23.6000]}
                  zoom={12}
                  draggableMarker={true}
                  markerPosition={location}
                  onLocationSelect={(lat, lng, addr) => {
                    setLocation([lat, lng]);
                    setAddress(addr);
                  }}
                  layers="waste"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Arraste o marcador no mapa para definir sua localização"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Itens para Recolha
              </label>
              <textarea
                value={formData.items}
                onChange={(e) => handleInputChange('items', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                placeholder="Descreva os itens: ex. sofá de 3 lugares, geladeira duplex, mesa de jantar..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Preferencial
              </label>
              <input
                title='Data Preferencial'
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#2c7873] hover:bg-[#1f5a56] text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Truck size={18} />
                <span>Solicitar Recolha</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkyWasteModal;