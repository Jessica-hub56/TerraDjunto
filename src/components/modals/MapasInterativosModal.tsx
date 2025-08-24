import React, { useState } from 'react';
import { X, Map, Database, Globe, Layers, Info, CheckCircle, Code, Smartphone } from 'lucide-react';
import MapComponent from '../MapComponent';

interface MapasInterativosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MapasInterativosModal: React.FC<MapasInterativosModalProps> = ({ isOpen, onClose }) => {
  const [activeExample, setActiveExample] = useState('basic');

  if (!isOpen) return null;

  const mapExamples = {
    basic: { center: [15.1200, -23.6000], zoom: 10, layers: 'base' as const },
    projects: { center: [15.1200, -23.6000], zoom: 8, layers: 'projects' as const },
    incidents: { center: [15.1200, -23.6000], zoom: 12, layers: 'incidents' as const }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#2c7873] flex items-center">
            <Map className="mr-3" size={28} />
            Dados Geográficos e Mapas Interativos
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-[#f0f7f4] p-6 rounded-lg border border-[#2c7873]/20 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              <strong>Dados geográficos</strong> (ou geodados) são informações que possuem uma referência espacial explícita, permitindo sua localização na superfície terrestre e são ferramentas essenciais para consultas públicas participativas.
            </p>
          </div>

          {/* Interactive Map Example */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Globe className="mr-2" size={24} />
              Exemplo de Mapa Interativo
            </h3>
            
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setActiveExample('basic')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeExample === 'basic' 
                    ? 'bg-[#2c7873] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mapa Básico
              </button>
              <button
                onClick={() => setActiveExample('projects')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeExample === 'projects' 
                    ? 'bg-[#2c7873] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Projetos
              </button>
              <button
                onClick={() => setActiveExample('incidents')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeExample === 'incidents' 
                    ? 'bg-[#2c7873] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ocorrências
              </button>
            </div>

            <div className="h-96 rounded-lg border border-gray-300 overflow-hidden mb-4">
              <MapComponent
                height="100%"
                zoom={mapExamples[activeExample as keyof typeof mapExamples].zoom}
                layers={mapExamples[activeExample as keyof typeof mapExamples].layers}
                center={mapExamples[activeExample as keyof typeof mapExamples].center}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <Database className="mr-2" size={24} />
                Componentes dos Dados Geográficos
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  <div>
                    <strong>Localização:</strong> Coordenadas geográficas ou endereço
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  <div>
                    <strong>Atributos:</strong> Características do elemento mapeado
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  <div>
                    <strong>Temporalidade:</strong> Data/período de validade da informação
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  <div>
                    <strong>Relações espaciais:</strong> Conexões com outros elementos geográficos
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <Info className="mr-2" size={24} />
                Vantagens para Participação Cidadã
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  <div>
                    <strong>Contextualização espacial:</strong> Entendimento claro do alcance territorial
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  <div>
                    <strong>Identificação de impactos:</strong> Visualização de como projetos afetam áreas específicas
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  <div>
                    <strong>Contribuições georreferenciadas:</strong> Cidadãos apontam locais exatos
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  <div>
                    <strong>Transparência:</strong> Mostra claramente áreas de intervenção
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Formatos de Dados */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Layers className="mr-2" size={24} />
              Formatos de Dados Geográficos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Formato</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Uso Típico</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">Shapefile (.shp)</td>
                    <td className="py-3 px-4">Formato vetorial amplamente utilizado em SIG</td>
                    <td className="py-3 px-4">Análise espacial, sistemas profissionais</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">GeoJSON</td>
                    <td className="py-3 px-4">Baseado em JSON, ideal para web</td>
                    <td className="py-3 px-4">Aplicações web interativas</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">KML/KMZ</td>
                    <td className="py-3 px-4">Desenvolvido para Google Earth</td>
                    <td className="py-3 px-4">Visualização 3D, compartilhamento</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium">GeoTIFF</td>
                    <td className="py-3 px-4">Imagem raster com informações geográficas</td>
                    <td className="py-3 px-4">Imagens de satélite, modelos de elevação</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">CSV Georreferenciado</td>
                    <td className="py-3 px-4">Tabela com colunas de latitude/longitude</td>
                    <td className="py-3 px-4">Dados simples, fácil criação</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ferramentas */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <Code className="mr-2" size={20} />
                Ferramentas Profissionais
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>QGIS:</strong> Software livre para SIG</li>
                <li>• <strong>ArcGIS:</strong> Suite completa de mapeamento</li>
                <li>• <strong>Google Earth Pro:</strong> Visualização 3D</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Globe className="mr-2" size={20} />
                Plataformas Web
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Leaflet:</strong> Biblioteca JavaScript leve</li>
                <li>• <strong>OpenLayers:</strong> Biblioteca avançada</li>
                <li>• <strong>Google Maps API:</strong> Integração Google</li>
                <li>• <strong>Mapbox:</strong> Mapas customizados</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <Smartphone className="mr-2" size={20} />
                Ferramentas para Cidadãos
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Google My Maps:</strong> Criação simples</li>
                <li>• <strong>uMap:</strong> Mapas com OpenStreetMap</li>
                <li>• <strong>ArcGIS StoryMaps:</strong> Mapas narrativos</li>
              </ul>
            </div>
          </div>

          {/* Implementação */}
          <div className="bg-[#2c7873] text-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Como Implementar Mapas em Consultas Públicas?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Processo de Implementação:</h4>
                <ol className="space-y-2 text-sm">
                  <li>1. Definir objetivos do mapa</li>
                  <li>2. Selecionar dados relevantes</li>
                  <li>3. Escolher ferramentas adequadas</li>
                  <li>4. Desenhar interações</li>
                  <li>5. Testar com usuários</li>
                  <li>6. Manter atualizado</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Boas Práticas:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Fornecer legendas claras e intuitivas</li>
                  <li>• Permitir zoom e navegação fácil</li>
                  <li>• Incluir ferramentas de desenho</li>
                  <li>• Otimizar para dispositivos móveis</li>
                  <li>• Garantir acessibilidade</li>
                </ul>
              </div>
            </div>
          </div>
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

export default MapasInterativosModal;