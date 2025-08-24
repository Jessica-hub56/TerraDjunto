import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, HelpCircle, UserPlus, Users, Trash2, Headphones } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const faqSections = [
    {
      title: 'Registo e Acesso',
      icon: UserPlus,
      items: [
        {
          question: 'Como posso criar uma conta na plataforma?',
          answer: (
            <div>
              <p className="mb-2">Para se registrar:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Clique no botão <strong>"Aceder"</strong> no canto superior direito</li>
                <li>Selecione a opção <strong>"Registar"</strong></li>
                <li>Preencha o formulário com:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Nome completo</li>
                    <li>E-mail válido</li>
                    <li>NIF cabo-verdiano</li>
                  </ul>
                </li>
                <li>Clique em <strong>"Criar Conta"</strong></li>
                <li>Confirme seu e-mail através do link enviado</li>
              </ol>
            </div>
          )
        },
        {
          question: 'Por que preciso fornecer meu NIF?',
          answer: (
            <div>
              <p className="mb-2">O NIF é necessário para:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Validar sua identidade como cidadão/empresa cabo-verdiana</li>
                <li>Garantir que cada usuário tenha apenas uma conta</li>
                <li>Assegurar a autenticidade das participações públicas</li>
                <li>Facilitar a comunicação oficial quando necessário</li>
              </ul>
              <div className="bg-[#f0f7f4] p-3 rounded-lg border-l-4 border-[#ff7e33] mt-3">
                <p className="text-sm">Seu NIF <strong>não será divulgado publicamente</strong> e é tratado conforme nossa Política de Privacidade.</p>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Participação Pública',
      icon: Users,
      items: [
        {
          question: 'Como posso participar de um projeto de ordenamento territorial?',
          answer: (
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Acesse a seção <strong>"Participe"</strong> no menu principal</li>
              <li>Escolha entre <strong>"Projetos"</strong> ou <strong>"Programas"</strong></li>
              <li>Selecione um item da lista (use filtros se necessário)</li>
              <li>Clique em <strong>"Participar"</strong></li>
              <li>Preencha:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Seu comentário (mínimo 50 caracteres)</li>
                  <li>Classificação (Concordo/Discordo/Sugestão)</li>
                  <li>Anexos opcionais (fotos, documentos)</li>
                </ul>
              </li>
              <li>Marque se autoriza publicação pública</li>
              <li>Clique em <strong>"Enviar Contribuição"</strong></li>
            </ol>
          )
        },
        {
          question: 'Posso acompanhar o status da minha participação?',
          answer: (
            <div>
              <p className="mb-2">Sim! Após enviar uma contribuição:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Você receberá um <strong>número de protocolo</strong></li>
                <li>Pode acompanhar na seção <strong>"Minhas Participações"</strong></li>
                <li>Status possíveis:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>🟡 Em análise</li>
                    <li>🟢 Incorporado</li>
                    <li>🔴 Não aceite</li>
                    <li>🔵 Em implementação</li>
                  </ul>
                </li>
              </ul>
              <div className="bg-[#f0f7f4] p-3 rounded-lg border-l-4 border-[#ff7e33] mt-3">
                <p className="text-sm">O prazo médio de análise é de <strong>15 dias úteis</strong> para projetos municipais.</p>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Gestão de Resíduos',
      icon: Trash2,
      items: [
        {
          question: 'Como consultar os horários de recolha no meu bairro?',
          answer: (
            <div>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Acesse <strong>"Gestão de Resíduos"</strong> no menu</li>
                <li>Selecione <strong>"Consultar Horários"</strong></li>
                <li>Escolha:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Seu <strong>município</strong></li>
                    <li>Seu <strong>bairro</strong></li>
                  </ul>
                </li>
                <li>Visualize os dias e horários para:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>🗑️ Recolha porta-a-porta</li>
                    <li>♻️ Pontos de contentores</li>
                    <li>🏢 Serviço comercial/institucional</li>
                  </ul>
                </li>
              </ol>
              <div className="bg-[#f0f7f4] p-3 rounded-lg border-l-4 border-[#ff7e33] mt-3">
                <p className="text-sm">Você pode <strong>baixar o calendário em PDF</strong> ou cadastrar seu e-mail para receber lembretes.</p>
              </div>
            </div>
          )
        },
        {
          question: 'Como denunciar um depósito ilegal de lixo?',
          answer: (
            <div>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Acesse <strong>"Gestão de Resíduos"</strong></li>
                <li>Selecione <strong>"Denunciar Depósito Ilegal"</strong></li>
                <li>Preencha:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>📍 Localização (arraste o pin no mapa)</li>
                    <li>📸 Foto clara do local (obrigatória)</li>
                    <li>📝 Descrição do problema (opcional)</li>
                  </ul>
                </li>
                <li>Escolha:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>🔒 Manter anonimato</li>
                    <li>👤 Identificar-se (recomendado para acompanhamento)</li>
                  </ul>
                </li>
                <li>Clique em <strong>"Enviar Denúncia"</strong></li>
              </ol>
              <div className="bg-[#f0f7f4] p-3 rounded-lg border-l-4 border-[#ff7e33] mt-3">
                <p className="text-sm">Denúncias com foto têm <strong>prioridade</strong> e são atendidas em até <strong>72h</strong>.</p>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Suporte Técnico',
      icon: Headphones,
      items: [
        {
          question: 'Esqueci minha senha. Como recuperar?',
          answer: (
            <div>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Na página de login, clique em <strong>"Esqueci a senha"</strong></li>
                <li>Digite o e-mail cadastrado</li>
                <li>Clique no link recebido por e-mail</li>
                <li>Crie uma nova senha segura</li>
              </ol>
              <div className="bg-[#f0f7f4] p-3 rounded-lg border-l-4 border-[#ff7e33] mt-3">
                <p className="text-sm mb-2">Se não receber o e-mail em 15 minutos:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Verifique sua pasta de <strong>spam/lixo eletrônico</strong></li>
                  <li>Confirme se digitou o e-mail corretamente</li>
                  <li>Caso persista, contate nosso suporte</li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Perguntas Frequentes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">Encontre respostas rápidas sobre a Plataforma Terra Djunto</p>
          </div>

          {faqSections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <section key={sectionIndex} className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <IconComponent className="text-[#2c7873]" size={24} />
                  <h4 className="text-xl font-semibold text-[#2c7873]">{section.title}</h4>
                </div>
                
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => {
                    const accordionIndex = sectionIndex * 100 + itemIndex;
                    const isOpen = openAccordion === accordionIndex;
                    
                    return (
                      <div key={itemIndex} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleAccordion(accordionIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{item.question}</span>
                          {isOpen ? (
                            <ChevronDown size={20} className="text-gray-500" />
                          ) : (
                            <ChevronRight size={20} className="text-gray-500" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-gray-600 border-t border-gray-200">
                            <div className="pt-4">{item.answer}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Contact Box */}
          <div className="bg-[#2c7873] text-white p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <HelpCircle size={20} />
              <span>Não encontrou sua resposta?</span>
            </h4>
            <p className="mb-4">Entre em contato com nossa equipe:</p>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span><strong>E-mail:</strong> terradjunto@nosi.cv</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span><strong>Telefone:</strong> 333 62 66 (8h-17h, dias úteis)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>💬</span>
                <span><strong>Chat Online:</strong> Disponível na plataforma (canto inferior direito)</span>
              </li>
            </ul>
            <div className="bg-white/20 p-3 rounded-lg mt-4">
              <p className="text-sm">Tempo médio de resposta: <strong>24h úteis</strong></p>
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

export default FaqModal;