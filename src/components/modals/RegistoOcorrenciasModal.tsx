import React, { useState } from 'react';
import { X, AlertTriangle, Phone, MapPin, Camera, FileText, CheckCircle, Clock, Users } from 'lucide-react';
import MapComponent from '../MapComponent';

interface RegistoOcorrenciasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistoOcorrenciasModal: React.FC<RegistoOcorrenciasModalProps> = ({ isOpen, onClose }) => {
  const [demoLocation, setDemoLocation] = useState<[number, number] | null>([15.1200, -23.6000]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#2c7873] flex items-center">
            <AlertTriangle className="mr-3 text-orange-500" size={28} />
            Registro de Ocorrências
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              O <strong>registro de ocorrências</strong> é um serviço que permite aos cidadãos reportar problemas urbanos e ambientais diretamente à administração municipal, agilizando a identificação e solução de questões que afetam a qualidade de vida na comunidade.
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Phone size={24} />
              <div>
                <div className="font-bold text-lg">Emergências: 132 (Polícia) | 131 (Bombeiros) | 130 (Médicas)</div>
                <div className="text-sm opacity-90">Para situações que requerem ação imediata</div>
              </div>
            </div>
          </div>

          {/* Como Registrar */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Como Registrar uma Ocorrência</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#2c7873] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Acesse a Plataforma</h4>
                  <p className="text-gray-600">Entre na plataforma <strong>"Terra Djunto"</strong> através do site ou aplicativo móvel. Faça login com sua conta ou registre-se rapidamente.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#2c7873] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Selecione o Tipo de Ocorrência</h4>
                  <p className="text-gray-600 mb-3">Escolha a categoria que melhor descreve o problema:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <ul className="space-y-1 text-gray-600">
                      <li>• <strong>Resíduos Sólidos:</strong> Lixo acumulado, coleta irregular</li>
                      <li>• <strong>Infraestrutura Urbana:</strong> Buracos na via, iluminação</li>
                      <li>• <strong>Meio Ambiente:</strong> Poluição, queimadas ilegais</li>
                    </ul>
                    <ul className="space-y-1 text-gray-600">
                      <li>• <strong>Saúde Pública:</strong> Focos de dengue, animais abandonados</li>
                      <li>• <strong>Outros:</strong> Problemas não listados</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#2c7873] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Preencha os Detalhes</h4>
                  <p className="text-gray-600 mb-3">Forneça informações precisas sobre a ocorrência:</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                      <MapPin className="mr-2" size={18} />
                      Localização exata
                    </h5>
                    <div className="h-48 rounded border border-gray-300 overflow-hidden mb-2">
                      <MapComponent
                        height="100%"
                        center={[15.1200, -23.6000]}
                        zoom={12}
                        draggableMarker={true}
                        markerPosition={demoLocation}
                        onLocationSelect={(lat, lng, address) => {
                          setDemoLocation([lat, lng]);
                        }}
                        layers="incidents"
                        showGetLocationButton={true}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Arraste o marcador para o local exato do problema</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                        <FileText className="mr-2" size={18} />
                        Descrição detalhada
                      </h5>
                      <p className="text-sm text-gray-600">Descreva o problema com detalhes, incluindo horários específicos se aplicável</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2 flex items-center">
                        <Camera className="mr-2" size={18} />
                        Anexar fotos (opcional)
                      </h5>
                      <p className="text-sm text-gray-600">Fotos ajudam na rápida identificação do problema</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#2c7873] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Envie e Acompanhe</h4>
                  <p className="text-gray-600 mb-3">Após revisar as informações, envie seu registro. Você receberá:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                      <CheckCircle className="text-yellow-600 mb-2" size={20} />
                      <p className="text-sm text-gray-700">Um número de protocolo para acompanhamento</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                      <Clock className="text-blue-600 mb-2" size={20} />
                      <p className="text-sm text-gray-700">Notificações sobre o status da sua ocorrência</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                      <CheckCircle className="text-green-600 mb-2" size={20} />
                      <p className="text-sm text-gray-700">Alertas quando o problema for resolvido</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-[#f0f7f4] p-6 rounded-lg border border-[#2c7873]/20 mb-6">
            <h3 className="text-xl font-semibold text-[#2c7873] mb-4">Dicas para um Registro Eficaz</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Seja específico na localização (use pontos de referência)
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Descreva o problema com detalhes objetivos
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Inclua fotos claras que mostrem a situação
                </li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Registre no momento em que identificar o problema
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Verifique se a ocorrência já foi reportada por outros
                </li>
              </ul>
            </div>
          </div>

          {/* Importância */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Users className="mr-2" size={20} />
                Para o Poder Público
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Identificação rápida de problemas</li>
                <li>• Otimização de recursos e prioridades</li>
                <li>• Dados para planejamento urbano</li>
                <li>• Transparência na gestão municipal</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <Users className="mr-2" size={20} />
                Para a Comunidade
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Agilidade na resolução de problemas</li>
                <li>• Melhoria da qualidade de vida</li>
                <li>• Fortalecimento do controle social</li>
                <li>• Promoção da cidadania ativa</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <MapPin className="mr-2" size={20} />
                Para o Meio Ambiente
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Combate a focos de poluição</li>
                <li>• Gestão eficiente de resíduos</li>
                <li>• Preservação de áreas verdes</li>
                <li>• Redução de impactos ambientais</li>
              </ul>
            </div>
          </div>

          {/* Acompanhamento */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Acompanhamento das Ocorrências</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Status da Ocorrência</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span><strong>Registrada:</strong> Recebida pela plataforma</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span><strong>Em análise:</strong> Sendo avaliada pelo setor responsável</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span><strong>Em atendimento:</strong> Solução em andamento</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span><strong>Resolvida:</strong> Problema solucionado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span><strong>Arquivada:</strong> Quando não for de competência municipal</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Como Acompanhar</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• No seu painel de usuário na plataforma "Terra Djunto"</li>
                  <li>• Recebendo notificações por email ou SMS</li>
                  <li>• Consultando com o número de protocolo</li>
                  <li>• No aplicativo móvel da plataforma</li>
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

export default RegistoOcorrenciasModal;