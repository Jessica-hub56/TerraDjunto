import React from 'react';
import { X, Users, FileText, MessageSquare, CheckCircle } from 'lucide-react';

interface ConsultasPublicasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultasPublicasModal: React.FC<ConsultasPublicasModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#2c7873]">Consultas Públicas</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-[#f0f7f4] p-6 rounded-lg border border-[#2c7873]/20 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              <strong>Consultas Públicas</strong> são mecanismos de participação cidadã que permitem aos munícipes opinar sobre propostas legislativas, projetos urbanísticos, políticas públicas ou outras iniciativas governamentais antes da sua implementação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <Users className="mr-2" size={24} />
                Para a Democracia
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Fortalecimento da governação participativa
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Maior transparência nos processos decisórios
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Legitimidade das políticas públicas
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Prevenção de conflitos sociais
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <FileText className="mr-2" size={24} />
                Para a Qualidade das Decisões
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Incorporar conhecimento diversificado
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Antecipar impactos não previstos
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Melhorar a adequação das soluções
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 mt-1 text-green-600" size={16} />
                  Identificar alternativas inovadoras
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quem pode participar?</h3>
            <div className="bg-white p-4 rounded border-l-4 border-[#2c7873] mb-4">
              <p className="text-gray-800">
                As consultas públicas são abertas a <strong>todos os cidadãos</strong>, sem exceção, mas também a:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-700">
                <li>• Associações e organizações da sociedade civil</li>
                <li>• Instituições académicas e de investigação</li>
                <li>• Empresas e associações profissionais</li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li>• Órgãos de comunicação social</li>
                <li>• Qualquer pessoa interessada no tema</li>
                <li>• Não é necessário ser especialista</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#2c7873] text-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <MessageSquare className="mr-2" size={24} />
              Como participar?
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="bg-white text-[#2c7873] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                Acompanhe os canais oficiais da câmara municipal
              </li>
              <li className="flex items-start">
                <span className="bg-white text-[#2c7873] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                Registe-se na plataforma de participação (quando aplicável)
              </li>
              <li className="flex items-start">
                <span className="bg-white text-[#2c7873] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                Leia atentamente os documentos da consulta
              </li>
              <li className="flex items-start">
                <span className="bg-white text-[#2c7873] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                Prepare a sua contribuição de forma clara e fundamentada
              </li>
              <li className="flex items-start">
                <span className="bg-white text-[#2c7873] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                Submeta dentro do prazo estabelecido
              </li>
              <li className="flex items-start">
                <span className="bg-white text-[#2c7873] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">6</span>
                Acompanhe os resultados e a implementação
              </li>
            </ol>
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

export default ConsultasPublicasModal;