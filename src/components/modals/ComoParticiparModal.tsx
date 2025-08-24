import React, { useState } from 'react';
import { X, Users, Trash2, MessageSquare, CheckCircle, Play, ChevronRight } from 'lucide-react';

interface ComoParticiparModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComoParticiparModal: React.FC<ComoParticiparModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('consultas');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#2c7873]">Como Participar na Plataforma</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-[#f0f7f4] p-6 rounded-lg border border-[#2c7873]/20 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              Esta plataforma permite sua participação ativa em dois eixos fundamentais para o desenvolvimento sustentável de Cabo Verde: <strong>Consultas Públicas</strong> sobre políticas e projetos, e a <strong>Gestão Comunitária de Resíduos Sólidos</strong>.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('consultas')}
              className={`flex items-center space-x-2 px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'consultas'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} />
              <span>Consultas Públicas</span>
            </button>
            <button
              onClick={() => setActiveTab('residuos')}
              className={`flex items-center space-x-2 px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'residuos'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Trash2 size={18} />
              <span>Gestão de Resíduos</span>
            </button>
          </div>

          {/* Consultas Públicas Tab */}
          {activeTab === 'consultas' && (
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-6">Como participar nas Consultas Públicas</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Registo na Plataforma</h4>
                    <p className="text-gray-600">Crie sua conta com email e dados básicos. A confirmação é feita por SMS ou email.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Acesso às Consultas Ativas</h4>
                    <p className="text-gray-600 mb-3">Navegue pelo menu "Consultas Públicas" para ver os temas em discussão:</p>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center"><ChevronRight size={16} className="mr-2 text-blue-600" />Planos urbanísticos</li>
                      <li className="flex items-center"><ChevronRight size={16} className="mr-2 text-blue-600" />Projetos de infraestrutura</li>
                      <li className="flex items-center"><ChevronRight size={16} className="mr-2 text-blue-600" />Políticas ambientais</li>
                      <li className="flex items-center"><ChevronRight size={16} className="mr-2 text-blue-600" />Legislação municipal</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Análise dos Documentos</h4>
                    <p className="text-gray-600 mb-3">Para cada consulta, você encontra:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <ul className="space-y-1 text-gray-600">
                        <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Exposição de motivos</li>
                        <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Documentos técnicos</li>
                      </ul>
                      <ul className="space-y-1 text-gray-600">
                        <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Mapas interativos</li>
                        <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Formulário de participação</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Envio de Contribuições</h4>
                    <p className="text-gray-600 mb-3">Participe através de:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-2">Recursos Disponíveis</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Notificações sobre novas consultas</li>
                          <li>• Fórum de discussão por tema</li>
                          <li>• Histórico de suas participações</li>
                          <li>• Acompanhamento do status</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-medium text-green-800 mb-2">Dicas para Boas Contribuições</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Seja claro e objetivo</li>
                          <li>• Referencie pontos específicos</li>
                          <li>• Apresente alternativas</li>
                          <li>• Inclua exemplos locais</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gestão de Resíduos Tab */}
          {activeTab === 'residuos' && (
            <div>
              <h3 className="text-xl font-semibold text-green-800 mb-6">Como participar na Gestão de Resíduos Sólidos</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Registo como Agente Comunitário</h4>
                    <p className="text-gray-600 mb-3">Complete seu perfil com:</p>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center"><ChevronRight size={16} className="mr-2 text-green-600" />Dados de localização (bairro/comunidade)</li>
                      <li className="flex items-center"><ChevronRight size={16} className="mr-2 text-green-600" />Áreas de interesse (reciclagem, compostagem, etc.)</li>
                      <li className="flex items-center"><ChevronRight size={16} className="mr-2 text-green-600" />Disponibilidade para ações voluntárias</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Funcionalidades Principais</h4>
                    <p className="text-gray-600 mb-3">Na seção de Resíduos Sólidos, você pode:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <ul className="space-y-1 text-gray-600">
                        <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Reportar problemas</li>
                        <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Mapear pontos críticos</li>
                      </ul>
                      <ul className="space-y-1 text-gray-600">
                        <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Registrar iniciativas</li>
                        <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Acompanhar indicadores</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Reportar Ocorrências</h4>
                    <p className="text-gray-600 mb-3">Para reportar um problema:</p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <ol className="space-y-2 text-sm text-gray-700">
                        <li>1. Selecione "Novo Reporte"</li>
                        <li>2. Escolha a categoria (lixo acumulado, queimada, etc.)</li>
                        <li>3. Marque a localização no mapa</li>
                        <li>4. Adicione fotos e descrição</li>
                        <li>5. Envie e acompanhe o status</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Participar em Projetos</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-medium text-green-800 mb-2">Recursos Disponíveis</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Mapa interativo de pontos de coleta</li>
                          <li>• Calendário de coleta por zona</li>
                          <li>• Guia de separação de resíduos</li>
                          <li>• Ranking de comunidades ativas</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-2">Benefícios da Participação</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Melhoria direta do seu ambiente</li>
                          <li>• Reconhecimento como agente ambiental</li>
                          <li>• Acesso a cursos e capacitações</li>
                          <li>• Descontos em serviços municipais</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aplicativo Móvel Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="mr-2" size={24} />
              Aplicativo Móvel
            </h3>
            <p className="text-gray-600 mb-4">Participe em qualquer lugar através do nosso aplicativo:</p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Notificações instantâneas sobre novas consultas</li>
                <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Reporte de problemas com geolocalização automática</li>
              </ul>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Acesso offline aos documentos principais</li>
                <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" />Integração com câmera para envio de fotos</li>
              </ul>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-3">Disponível na Google Play e App Store</p>
              <div className="space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Android
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  iOS
                </button>
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

export default ComoParticiparModal;