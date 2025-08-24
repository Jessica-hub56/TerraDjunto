import React, { useState } from 'react';

interface LegislationFileFormProps {
  onClose: () => void;
}

const LegislationFileForm: React.FC<LegislationFileFormProps> = ({ onClose }) => {
  const [form, setForm] = useState({
    title: '',
    reference: '',
    description: '',
    category: 'ordenamento',
    tags: '',
    file: null as File | null
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const STORAGE_KEY = 'customLegislationFiles';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, file: e.target.files?.[0] || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!form.title || !form.reference || !form.description || !form.file) {
      setError('Preencha todos os campos obrigatórios e selecione um arquivo.');
      return;
    }

    // Guardar metadados do ficheiro no armazenamento local para disponibilização pública
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const item = {
        id: Date.now().toString(),
        title: form.title,
        reference: form.reference,
        description: form.description,
        date: new Date().toLocaleDateString('pt-PT'),
        category: form.category,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        fullText: 'Conteúdo do ficheiro carregado.',
        _meta: { fileName: form.file?.name, size: form.file?.size }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...list]));
    } catch (e) {
      // Em caso de erro no armazenamento, prosseguir sem bloquear a UI
      console.error('Falha ao gravar ficheiro no armazenamento local:', e);
    }

    // Simula o upload/salvamento
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título do Documento *</label>
        <input
          title='Título do Documento'
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Referência Legal *</label>
        <input
          title='Referência Legal'
          type="text"
          name="reference"
          value={form.reference}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
        <select
          title='Categoria'
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="ordenamento">Ordenamento do Território</option>
          <option value="residuos">Resíduos Sólidos</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
        <textarea
          title='Descrição'
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
        <input
          title='Tags'
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Arquivo (PDF, DOC, DOCX) *</label>
        <input
          title='Arquivo'
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
        {form.file && (
          <p className="text-xs text-gray-600 mt-1">Arquivo selecionado: {form.file.name}</p>
        )}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Ficheiro adicionado com sucesso!</div>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56]">Adicionar Ficheiro</button>
      </div>
    </form>
  );
};

export default LegislationFileForm;
