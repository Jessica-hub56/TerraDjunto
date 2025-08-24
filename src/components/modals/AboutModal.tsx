import React from 'react';
import { X, Users, Target, History, Handshake } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Sobre a Plataforma Terra Djunto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#2c7873] mb-4">Unidos pelo nosso território</h3>
            <p className="text-lg text-gray-600">Participação cidadã no ordenamento territorial</p>
          </div>

          {/* Missão */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">Nossa Missão</h4>
            </div>
            <div className="bg-[#f0f7f4] p-4 rounded-lg border-l-4 border-[#ff7e33] mb-4">
              <p className="text-gray-800">
                A Terra Djunto nasceu para <strong>democratizar o acesso à gestão territorial</strong> em Cabo Verde, 
                conectando cidadãos, governo e especialistas em um espaço colaborativo de tomada de decisão.
              </p>
            </div>
            
            <h5 className="font-semibold text-gray-800 mb-3">Objetivos Principais:</h5>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-[#2c7873] mt-1">•</span>
                <span>Promover transparência no ordenamento do território</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#2c7873] mt-1">•</span>
                <span>Facilitar a participação pública em projetos municipais</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#2c7873] mt-1">•</span>
                <span>Melhorar a gestão de resíduos sólidos</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#2c7873] mt-1">•</span>
                <span>Fortalecer a governação local participativa</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#2c7873] mt-1">•</span>
                <span>Digitalizar processos de consulta pública</span>
              </li>
            </ul>
          </section>

          {/* História */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <History className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">Nossa História</h4>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">Origem</h5>
                <p className="text-gray-700">
                  A plataforma "Terra Djunto" foi concebida em 2025 pela estagiária Jéssica dos Santos, 
                  da NOSi E.P.E (Núcleo Operacional Para a Sociedade de Informação), como solução 
                  inovadora para os desafios críticos de Cabo Verde.
                </p>
              </div>

              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">Preocupações em Cabo Verde</h5>
                <ul className="space-y-1 text-gray-700">
                  <li>• A urbanização acelerada e o crescimento desordenado representam uma ameaça crescente para ecossistemas frágeis</li>
                  <li>• Baixo envolvimento dos munícipes nos processos de planeamento e decisão urbanística</li>
                  <li>• Problemas recorrentes de gestão de resíduos (despejos ilegais, falta de informação, pouca fiscalização)</li>
                  <li>• Falta de uma plataforma unificada e pública com acesso a mapas, legislação e serviços municipais</li>
                </ul>
              </div>

              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">Benefícios da Plataforma</h5>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>🗣️ <strong>Voz Ativa:</strong> Participação direta em projetos de urbanismo e ambiente</div>
                  <div>📍 <strong>Denúncias com GeoLocalização:</strong> Reportar problemas urbanos com fotos e localização exata</div>
                  <div>⏰ <strong>Consulta de Serviços:</strong> Horários de recolha de lixo por bairro</div>
                  <div>📚 <strong>Acesso à Legislação:</strong> Leis sobre ordenamento territorial em linguagem simples</div>
                  <div>🛠️ <strong>Gestão Eficiente:</strong> Mapeamento em tempo real de problemas e priorização de ações</div>
                  <div>📊 <strong>Dados para Decisões:</strong> Relatórios automáticos sobre participação cidadã</div>
                  <div>♻️ <strong>Menos Lixo Ilegal:</strong> Denúncias rápidas reduzem a poluição</div>
                  <div>🌱 <strong>Projetos Sustentáveis:</strong> Consultas públicas para obras com impacto ambiental</div>
                </div>
              </div>
            </div>
          </section>

          {/* Parceiros */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Handshake className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">Parceiros</h4>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <h5 className="font-semibold text-[#2c7873] mb-2">Governo de Cabo Verde</h5>
                <p className="text-sm text-gray-600">Parceiro institucional</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <h5 className="font-semibold text-[#2c7873] mb-2">Municípios</h5>
                <p className="text-sm text-gray-600">22 municípios participantes</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <h5 className="font-semibold text-[#2c7873] mb-2">ONGs Ambientais</h5>
                <p className="text-sm text-gray-600">Todas as ONGs nacionais e internacionais</p>
              </div>
            </div>

            <h5 className="font-semibold text-gray-800 mb-3">Futuros Parceiros Estratégicos:</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Programa das Nações Unidas para o Desenvolvimento</li>
              <li>• Universidades de Cabo Verde</li>
            </ul>
          </section>
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

export default AboutModal;