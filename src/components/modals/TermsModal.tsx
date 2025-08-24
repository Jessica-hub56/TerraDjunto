import React from 'react';
import { X, FileCheck, UserCheck, Shield, Copyright, Edit, AlertTriangle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Termos e Condições de Uso</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">Conheça as regras que regem a utilização da Plataforma Terra Djunto</p>
          </div>

          {/* Aceitação */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileCheck className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">1. Aceitação dos Termos</h4>
            </div>
            <div className="bg-[#f0f7f4] p-4 rounded-lg border-l-4 border-[#ff7e33]">
              <p className="text-gray-800">
                Ao aceder e utilizar a Plataforma Terra Djunto, o utilizador declara ter lido, 
                compreendido e aceito integralmente estes Termos e Condições.
              </p>
            </div>
          </section>

          {/* Cadastro */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <UserCheck className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">2. Cadastro e Autenticação</h4>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">2.1 Requisitos</h5>
                <ul className="space-y-1 text-gray-700">
                  <li>• Dados pessoais válidos e atualizados</li>
                  <li>• NIF cabo-verdiano válido para validação</li>
                  <li>• E-mail pessoal ativo</li>
                </ul>
              </div>

              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">2.2 Responsabilidades</h5>
                <ul className="space-y-1 text-gray-700">
                  <li>• Manter a confidencialidade dos dados de acesso</li>
                  <li>• Notificar acesso não autorizado imediatamente</li>
                  <li>• Não criar contas falsas ou múltiplas</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Participação */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">3. Participação Pública</h4>
            </div>
            
            <div className="bg-[#f0f7f4] p-4 rounded-lg border-l-4 border-[#ff7e33] mb-4">
              <p className="text-gray-800">
                As contribuições dos utilizadores devem seguir princípios de civilidade e 
                relevância para o ordenamento territorial.
              </p>
            </div>

            <h5 className="font-semibold text-gray-800 mb-3">Proibições:</h5>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Conteúdo discriminatório ou ofensivo</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Spam ou conteúdo comercial</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Informação falsa ou enganosa</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Violação de direitos autorais</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Dados pessoais de terceiros sem consentimento</span>
              </li>
            </ul>
          </section>

          {/* Propriedade Intelectual */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Copyright className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">4. Propriedade Intelectual</h4>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">4.1 Direitos da Plataforma</h5>
                <p className="text-gray-700">
                  Todos os elementos da plataforma (design, software, documentação) são propriedade 
                  do Governo de Cabo Verde ou licenciados para uso exclusivo.
                </p>
              </div>

              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">4.2 Contribuições dos Utilizadores</h5>
                <p className="text-gray-700">
                  As contribuições públicas tornam-se automaticamente licenciadas para fins de 
                  gestão territorial, mantendo os direitos morais do autor.
                </p>
              </div>
            </div>
          </section>

          {/* Privacidade */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">5. Privacidade e Proteção de Dados</h4>
            </div>
            
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Os dados são tratados conforme a Lei de Proteção de Dados cabo-verdiana</li>
              <li>Informações públicas podem ser divulgadas em relatórios oficiais</li>
              <li>Dados sensíveis são criptografados</li>
              <li>O utilizador pode solicitar exclusão de dados pessoais</li>
            </ol>
          </section>

          {/* Alterações */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Edit className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">6. Alterações aos Termos</h4>
            </div>
            
            <div className="bg-[#f0f7f4] p-4 rounded-lg border-l-4 border-[#ff7e33]">
              <p className="text-gray-800">
                Estes termos podem ser atualizados periodicamente. Alterações significativas serão 
                comunicadas por e-mail e através de aviso na plataforma.
              </p>
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <p>Versão 2.1 dos Termos e Condições</p>
            <p>Última atualização: 15 de Agosto de 2025</p>
          </div>
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

export default TermsModal;