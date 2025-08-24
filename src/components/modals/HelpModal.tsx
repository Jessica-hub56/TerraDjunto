import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupportModal?: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onSupportModal }) => {
  const [openAccordion, setOpenAccordion] = useState(0);

  if (!isOpen) return null;

  const faqItems = [
    {
      question: 'Como me registar na plataforma?',
      answer: 'Para se registar, clique no botão "Aceder" no canto superior direito e selecione o separador "Registar". Preencha o formulário com o seu nome completo, email e NIF. O nome completo e NIF são campos obrigatórios. Após o registo, receberá um email de confirmação.'
    },
    {
      question: 'Como participar num projeto?',
      answer: 'Aceda à secção "Participe" e selecione "Projetos". Escolha um projeto ativo e clique em "Participar". Pode deixar o seu comentário, classificar o projeto e anexar documentos ou imagens. Não se esqueça de indicar se autoriza a publicação do seu comentário no relatório final.'
    },
    {
      question: 'Como consultar os horários de recolha de resíduos?',
      answer: 'Na secção "Gestão de Resíduos", selecione o seu município e bairro. O sistema mostrará os horários de recolha para os diferentes tipos de serviço (porta a porta, pontos de contentores, etc.) na sua área.'
    },
    {
      question: 'Como reportar um depósito ilegal de resíduos?',
      answer: 'Na secção "Gestão de Resíduos", selecione o separador "Denúncia de Depósito Ilegal". Preencha o formulário com a localização e descrição do problema. Pode anexar fotos e escolher permanecer anónimo se desejar.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? -1 : index);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Ajuda</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  {openAccordion === index ? (
                    <ChevronDown size={20} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-500" />
                  )}
                </button>
                {openAccordion === index && (
                  <div className="px-4 pb-4 text-gray-600 border-t border-gray-200">
                    <div className="pt-4">{item.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          <button onClick={onSupportModal} className="px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors">
            Contactar Suporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;