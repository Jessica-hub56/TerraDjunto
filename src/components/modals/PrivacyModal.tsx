import React from 'react';
import { X, Shield, Database, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Política de Privacidade</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">Como protegemos e utilizamos os seus dados na Plataforma Terra Djunto</p>
          </div>

          {/* Introdução */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">Introdução</h4>
            </div>
            <div className="bg-[#f0f7f4] p-4 rounded-lg border-l-4 border-[#ff7e33]">
              <p className="text-gray-800">
                A proteção dos seus dados pessoais é uma prioridade para a Terra Djunto. Esta política explica 
                como coletamos, usamos e protegemos suas informações, em conformidade com a Lei de Proteção de 
                Dados Pessoais de Cabo Verde (Lei nº 133/VIII/2021).
              </p>
            </div>
          </section>

          {/* Dados Coletados */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">Dados que Coletamos</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-[#2c7873] text-white">
                    <th className="border border-gray-300 p-3 text-left">Categoria</th>
                    <th className="border border-gray-300 p-3 text-left">Exemplos</th>
                    <th className="border border-gray-300 p-3 text-left">Finalidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="even:bg-gray-50">
                    <td className="border border-gray-300 p-3">Dados de Registro</td>
                    <td className="border border-gray-300 p-3">Nome, NIF, e-mail</td>
                    <td className="border border-gray-300 p-3">Validação de identidade, comunicação</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="border border-gray-300 p-3">Dados de Participação</td>
                    <td className="border border-gray-300 p-3">Comentários, votos, denúncias</td>
                    <td className="border border-gray-300 p-3">Processamento de contribuições públicas</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="border border-gray-300 p-3">Dados Técnicos</td>
                    <td className="border border-gray-300 p-3">IP, tipo de dispositivo, cookies</td>
                    <td className="border border-gray-300 p-3">Segurança e melhoria da plataforma</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="border border-gray-300 p-3">Dados de Localização</td>
                    <td className="border border-gray-300 p-3">Coordenadas GPS de denúncias</td>
                    <td className="border border-gray-300 p-3">Gestão territorial eficiente</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Como Utilizamos */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">Como Utilizamos Seus Dados</h4>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">Finalidades Principais</h5>
                <ul className="space-y-1 text-gray-700">
                  <li>• Validar a autenticidade das contribuições</li>
                  <li>• Processar participações em consultas públicas</li>
                  <li>• Melhorar serviços municipais</li>
                  <li>• Gerar relatórios estatísticos anônimos</li>
                  <li>• Responder a solicitações e denúncias</li>
                </ul>
              </div>

              <div className="bg-[#004d47]/10 p-4 rounded-lg">
                <h5 className="font-semibold text-[#004d47] mb-2">Compartilhamento</h5>
                <p className="text-gray-700 mb-2">Seus dados podem ser compartilhados com:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Municípios para gestão territorial</li>
                  <li>• Órgãos governamentais conforme exigido por lei</li>
                  <li>• Parceiros técnicos com contratos de confidencialidade</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Direitos */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">Seus Direitos</h4>
            </div>
            
            <div className="bg-[#f0f7f4] p-4 rounded-lg border-l-4 border-[#ff7e33] mb-4">
              <p className="text-gray-800">
                De acordo com a legislação cabo-verdiana, você tem direito a:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Acesso:</strong> Solicitar cópia dos dados armazenados</li>
                <li><strong>Retificação:</strong> Corrigir informações inexatas</li>
                <li><strong>Eliminação:</strong> Pedir exclusão de dados pessoais</li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Limitação:</strong> Restringir o processamento em certos casos</li>
                <li><strong>Portabilidade:</strong> Receber dados em formato estruturado</li>
                <li><strong>Oposição:</strong> Opor-se a tratamentos específicos</li>
              </ul>
            </div>

            <div className="bg-[#004d47]/10 p-4 rounded-lg">
              <h5 className="font-semibold text-[#004d47] mb-2">Como Exercer Seus Direitos</h5>
              <p className="text-gray-700 mb-2">Envie um e-mail para <strong>protecaodados@terradjunto.cv</strong> com:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Seu nome completo e NIF</li>
                <li>Direito que deseja exercer</li>
                <li>Descrição do pedido</li>
              </ol>
            </div>
          </section>

          {/* Segurança */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="text-[#2c7873]" size={24} />
              <h4 className="text-xl font-semibold text-[#2c7873]">Medidas de Segurança</h4>
            </div>
            
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Criptografia de dados sensíveis</li>
              <li>Acesso restrito a pessoal autorizado</li>
              <li>Auditorias regulares de segurança</li>
              <li>Backups diários</li>
              <li>Procedimentos para incidentes</li>
            </ol>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h4 className="text-xl font-semibold text-[#2c7873] mb-4">Política de Cookies</h4>
            <div className="bg-[#f0f7f4] p-4 rounded-lg border-l-4 border-[#ff7e33]">
              <p className="text-gray-800">
                Utilizamos cookies essenciais para funcionamento da plataforma e analíticos para melhorar 
                nossos serviços. Você pode gerenciar suas preferências nas configurações do navegador.
              </p>
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Para dúvidas: terradjunto@nosi.cv | 333 62 66
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

export default PrivacyModal;