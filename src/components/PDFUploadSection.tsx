import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'portal_legislation_pdfs';

interface PDFFile {
  name: string;
  url: string;
  uploadedAt: string;
}

const PDFUploadSection: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setPdfs(JSON.parse(raw));
      } catch {
        setPdfs([]);
      }
    }
  }, []);

  const savePdfs = (arr: PDFFile[]) => {
    setPdfs(arr);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('Apenas ficheiros PDF são permitidos.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      const newPdf: PDFFile = {
        name: file.name,
        url,
        uploadedAt: new Date().toISOString(),
      };
      savePdfs([newPdf, ...pdfs]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (idx: number) => {
    const arr = pdfs.slice();
    arr.splice(idx, 1);
    savePdfs(arr);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Carregar PDF</label>
      <input title='Caregar PDF' type="file" accept="application/pdf" onChange={handleUpload} />
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      <div className="mt-4">
        <h4 className="font-semibold mb-2">PDFs carregados</h4>
        {pdfs.length === 0 ? (
          <div className="text-gray-500 text-sm">Nenhum PDF carregado.</div>
        ) : (
          <ul className="space-y-2">
            {pdfs.map((pdf, idx) => (
              <li key={pdf.uploadedAt} className="flex items-center justify-between bg-gray-50 rounded p-2">
                <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="text-[#2c7873] underline">{pdf.name}</a>
                <button onClick={() => handleRemove(idx)} className="text-red-600 text-xs ml-4">Remover</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PDFUploadSection;
