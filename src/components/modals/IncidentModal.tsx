import React, { useState } from 'react';
import { X, Upload, MapPin, AlertTriangle, Camera, FileText } from 'lucide-react';
import MapComponent from '../MapComponent';

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IncidentModal: React.FC<IncidentModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
    name: '',
    phone: '',
    email: '',
    anonymous: false,
    urgency: 'normal'
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [incidentLocation, setIncidentLocation] = useState<[number, number] | null>(null);
  const [incidentAddress, setIncidentAddress] = useState('');

  interface IncidentRecord { id: string; title?: string; description?: string; createdAt?: string; status?: string; address?: string; }
  const [activeTab, setActiveTab] = useState<'report' | 'my'>('report');
  const [myFilter, setMyFilter] = useState('');
  const [myRecords, setMyRecords] = useState<IncidentRecord[]>([]);
  const refreshMyRecords = () => {
    try {
      const STORAGE_KEY = 'registoOcorrencias';
      const raw = localStorage.getItem(STORAGE_KEY);
      setMyRecords(raw ? JSON.parse(raw) : []);
    } catch {
      setMyRecords([]);
    }
  };
  const getStatusClasses = (status?: string) => {
    switch (status) {
      case 'novo': return 'bg-yellow-100 text-yellow-800';
      case 'enviado': return 'bg-yellow-100 text-yellow-800';
      case 'em-analise': return 'bg-blue-100 text-blue-800';
      case 'encaminhado': return 'bg-indigo-100 text-indigo-800';
      case 'em-resolucao': return 'bg-purple-100 text-purple-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      alert('Alguns arquivos foram rejeitados. Apenas imagens (JPG, PNG) e PDFs até 10MB são aceitos.');
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const STORAGE_KEY = 'registoOcorrencias';
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const typeDef = (
        [
          { value: 'infraestrutura', label: 'Degradação de infraestrutura' },
          { value: 'ocupacao-ilegal', label: 'Ocupação ilegal do espaço público' },
          { value: 'drenagem', label: 'Problemas de drenagem' },
          { value: 'risco-desabamento', label: 'Risco de desabamento' },
          { value: 'poluicao', label: 'Poluição ambiental' },
          { value: 'iluminacao', label: 'Problemas de iluminação pública' },
          { value: 'sinalizacao', label: 'Sinalização danificada' },
          { value: 'outro', label: 'Outro' }
        ] as const
      ).find(t => t.value === formData.type);
      const record = {
        id: Date.now().toString(),
        title: typeDef?.label || 'Ocorrência',
        description: formData.description,
        userName: formData.anonymous ? '' : formData.name,
        email: formData.anonymous ? '' : formData.email,
        phone: formData.anonymous ? '' : formData.phone,
        createdAt: new Date().toISOString(),
        status: 'novo',
        type: formData.type,
        urgency: formData.urgency,
        address: incidentAddress,
        location: incidentLocation,
        attachments: selectedFiles.map(f => ({ name: f.name, size: f.size })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...arr]));
    } catch (err) {
      console.error('Falha ao gravar ocorrência:', err);
    }
    alert('Ocorrência reportada com sucesso! Número de protocolo: #2024-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    onClose();
  };

  const incidentTypes = [
    { value: 'infraestrutura', label: 'Degradação de infraestrutura', icon: '🏗️' },
    { value: 'ocupacao-ilegal', label: 'Ocupação ilegal do espaço público', icon: '🚫' },
    { value: 'drenagem', label: 'Problemas de drenagem', icon: '💧' },
    { value: 'risco-desabamento', label: 'Risco de desabamento', icon: '⚠️' },
    { value: 'poluicao', label: 'Poluição ambiental', icon: '🌍' },
    { value: 'iluminacao', label: 'Problemas de iluminação pública', icon: '💡' },
    { value: 'sinalizacao', label: 'Sinalização danificada', icon: '🚦' },
    { value: 'outro', label: 'Outro', icon: '📝' }
  ];

  const urgencyLevels = [
    { value: 'baixa', label: 'Baixa', color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'normal', label: 'Normal', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'alta', label: 'Alta', color: 'text-orange-600', bg: 'bg-orange-50' },
    { value: 'urgente', label: 'Urgente', color: 'text-red-600', bg: 'bg-red-50' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <AlertTriangle className="text-orange-500" size={24} />
              <span>Registo de Ocorrência</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">Reporte problemas relacionados ao território</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex border-b mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center space-x-2 px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'report'
                  ? 'border-[#2c7873] text-[#2c7873]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertTriangle className="text-orange-500" size={18} />
              <span>Reportar Ocorrência</span>
            </button>
            <button
              onClick={() => { setActiveTab('my'); refreshMyRecords(); }}
              className={`flex items-center space-x-2 px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'my'
                  ? 'border-[#2c7873] text-[#2c7873]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText size={18} />
              <span>Meus Registos</span>
            </button>
          </div>
          {activeTab === 'report' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Ocorrência *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {incidentTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === type.value
                        ? 'border-[#2c7873] bg-[#f0f7f4]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-lg mr-3">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nível de Urgência *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {urgencyLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.urgency === level.value
                        ? `border-current ${level.color} ${level.bg}`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${level.color}`}>{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Detalhada *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                placeholder="Descreva detalhadamente o problema, incluindo quando foi observado, possíveis causas, riscos envolvidos..."
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização *
              </label>
              <div className="h-48 rounded-lg border border-gray-300 overflow-hidden mb-3">
                <MapComponent
                  height="100%"
                  center={[15.1200, -23.6000]}
                  zoom={12}
                  draggableMarker={true}
                  markerPosition={incidentLocation}
                  onLocationSelect={(lat, lng, address) => {
                    setIncidentLocation([lat, lng]);
                    setIncidentAddress(address);
                  }}
                  layers="incidents"
                  showGetLocationButton={true}
                />
              </div>
              <input
                type="text"
                value={incidentAddress}
                onChange={(e) => setIncidentAddress(e.target.value)}
                placeholder="Clique no mapa ou digite o endereço"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anexar Fotos/Documentos (opcional)
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2c7873] transition-colors cursor-pointer"
                onClick={() => document.getElementById('incident-file-input')?.click()}
              >
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Camera className="text-gray-400" size={24} />
                  <Upload className="text-gray-400" size={24} />
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
                        <span className="text-sm text-gray-700">{file.name}</span>
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

            {/* Anonymous Option */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.anonymous}
                onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                className="mr-3 w-4 h-4"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700 font-medium">
                Manter anonimato (não será possível receber atualizações sobre a ocorrência)
              </label>
            </div>

            {/* Contact Information */}
            {!formData.anonymous && (
              <div className="space-y-4 pt-4 border-t">
                <h6 className="font-medium text-gray-800">Informações de Contacto</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seu Nome
                    </label>
                    <input
                      title='Seu Nome'
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      title='Telefone'
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    title='Email'
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#2c7873] hover:bg-[#1f5a56] text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <AlertTriangle size={18} />
              <span>Reportar Ocorrência</span>
            </button>
          </form>
          )}
          {activeTab === 'my' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">Meus Registos</h5>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={myFilter}
                    onChange={(e) => setMyFilter(e.target.value)}
                    placeholder="Filtrar por ID, título, endereço..."
                    className="px-3 py-2 border rounded text-sm"
                  />
                  <button onClick={refreshMyRecords} className="px-3 py-2 border rounded hover:bg-gray-50 text-sm">Atualizar</button>
                </div>
              </div>
              {myRecords.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">Sem registos encontrados.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3">ID</th>
                        <th className="text-left py-2 px-3">Título</th>
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
                            String(r.id || '').toLowerCase().includes(t) ||
                            String(r.title || '').toLowerCase().includes(t) ||
                            String(r.address || '').toLowerCase().includes(t) ||
                            String(r.description || '').toLowerCase().includes(t)
                          );
                        })
                        .map((r) => (
                        <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 font-mono text-xs">{r.id}</td>
                          <td className="py-2 px-3">{r.title || '-'}</td>
                          <td className="py-2 px-3 truncate max-w-[240px]" title={r.address}>{r.address || '-'}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClasses(r.status)}`}>
                              {r.status || 'novo'}
                            </span>
                          </td>
                          <td className="py-2 px-3">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentModal;