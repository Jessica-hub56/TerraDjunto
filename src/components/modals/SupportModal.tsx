import React, { useState } from 'react';
import { X, Paperclip, UploadCloud, Trash2 } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TicketAttachmentMeta {
  name: string;
  size: number;
  type: string;
}

interface SupportTicket {
  id: string;
  createdAt: string;
  subject: string;
  email: string;
  message: string;
  attachments: TicketAttachmentMeta[];
}

const STORAGE_KEY = 'supportTickets';

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const loadTickets = (): SupportTicket[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveTickets = (tickets: SupportTicket[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  };

  const validEmail = (val: string) => /.+@.+\..+/.test(val);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const maxFiles = 10;
    const maxSize = 10 * 1024 * 1024; // 10MB cada
    const next: File[] = [];
    for (let i = 0; i < list.length; i++) {
      const f = list.item(i)!;
      if (f.size > maxSize) {
        setError(`O ficheiro "${f.name}" excede 10MB e foi ignorado.`);
        continue;
      }
      next.push(f);
    }
    const merged = [...files, ...next].slice(0, maxFiles);
    setFiles(merged);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSubject('');
    setEmail('');
    setMessage('');
    setFiles([]);
    setError(null);
    setSending(false);
    setSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim()) return setError('Indique o assunto do pedido.');
    if (!validEmail(email)) return setError('Indique um email válido.');
    if (!message.trim()) return setError('Descreva o seu pedido.');

    setSending(true);
    try {
      const attachments: TicketAttachmentMeta[] = files.map(f => ({ name: f.name, size: f.size, type: f.type }));
      const newTicket: SupportTicket = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        subject: subject.trim(),
        email: email.trim(),
        message: message.trim(),
        attachments,
      };
      const current = loadTickets();
      saveTickets([newTicket, ...current]);

      // Preparar email para terradjunto@nosi.cv usando o cliente de email do utilizador
      try {
        const mailSubject = `[Terra Djunto] Pedido de Suporte: ${newTicket.subject}`;
        const bodyLines = [
          `ID: ${newTicket.id}`,
          `Criado em: ${new Date(newTicket.createdAt).toLocaleString()}`,
          `Remetente: ${newTicket.email}`,
          `Assunto: ${newTicket.subject}`,
          '',
          'Mensagem:',
          newTicket.message,
          '',
          'Anexos:',
          attachments.length ? attachments.map(a => `- ${a.name} (${Math.round(a.size / 1024)} KB)`).join('\n') : 'Nenhum',
          '',
          '— Enviado via Terra Djunto'
        ].join('\n');
        const mailtoUrl = `mailto:terradjunto.cv@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(bodyLines)}`;
        window.location.href = mailtoUrl;
      } catch {}

      setSent(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } catch (err) {
      setError('Falha ao enviar o pedido. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Contactar Suporte</h2>
          <button onClick={() => { resetForm(); onClose(); }} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>}
          {sent && <div className="p-2 rounded bg-green-100 text-green-700 text-sm">Pedido enviado com sucesso!</div>}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                placeholder="Ex.: Problemas de acesso"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email de contacto</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
                placeholder="nome@exemplo.cv"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do pedido</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] min-h-[120px]"
              placeholder="Descreva o problema, incluindo passos para reproduzir, mensagens de erro, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Paperclip size={16} /> Anexos (opcional)
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer text-gray-700">
                <UploadCloud size={16} /> Selecionar ficheiros
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
              </label>
              <span className="text-xs text-gray-500">Até 10 ficheiros, 10MB cada</span>
            </div>

            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="text-sm text-gray-700 truncate">
                      {f.name} <span className="text-gray-400">({(f.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={sending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors disabled:opacity-60"
              disabled={sending}
            >
              {sending ? 'A enviar...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportModal;
