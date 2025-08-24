import React, { useEffect, useState } from 'react';

interface IncidentRecord {
  id: string;
  title?: string;
  description?: string;
  userName?: string;
  email?: string;
  createdAt?: string;
  status?: string;
  [key: string]: any;
}

const STORAGE_KEY = 'registoOcorrencias';

interface Props {
  onClose: () => void;
}

const IncidentRecordsModal: React.FC<Props> = ({ onClose }) => {
  const [records, setRecords] = useState<IncidentRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<IncidentRecord | null>(null);

  const loadRecords = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setRecords(raw ? JSON.parse(raw) : []);
    } catch {
      setRecords([]);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const getStatusClasses = (status?: string) => {
    switch (status) {
      case 'novo': return 'bg-yellow-100 text-yellow-800';
      case 'enviado': return 'bg-yellow-100 text-yellow-800';
      case 'em-analise': return 'bg-blue-100 text-blue-800';
      case 'encaminhado': return 'bg-indigo-100 text-indigo-800';
      case 'em-resolucao': return 'bg-purple-100 text-purple-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const setIncidentStatus = (id: string, status: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const updated = Array.isArray(arr) ? arr.map((r: any) => r.id === id ? { ...r, status } : r) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      loadRecords();
    } catch {}
  };

  const exportCSV = () => {
    const headers = ['ID','Título','Descrição','Nome','Email','Criado em','Status'];
    const rows = records.map(r => [
      r.id || '',
      r.title || '',
      (r.description || '').replace(/\n/g,' '),
      r.userName || '',
      r.email || '',
      r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
      r.status || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registos_ocorrencias.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Registo de Ocorrências</h3>
          <div className="flex items-center gap-2">
            <button onClick={loadRecords} className="px-3 py-2 border rounded hover:bg-gray-50">Atualizar</button>
            <button onClick={exportCSV} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Exportar CSV</button>
            <button onClick={onClose} className="px-3 py-2 border rounded hover:bg-gray-50">Fechar</button>
          </div>
        </div>
        <div className="p-4">
          {records.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">Sem registos encontrados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3">ID</th>
                    <th className="text-left py-2 px-3">Título</th>
                    <th className="text-left py-2 px-3">Descrição</th>
                    <th className="text-left py-2 px-3">Nome</th>
                    <th className="text-left py-2 px-3">Email</th>
                    <th className="text-left py-2 px-3">Criado em</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-mono text-xs">{r.id}</td>
                      <td className="py-2 px-3">{r.title || '-'}</td>
                      <td className="py-2 px-3 max-w-[240px] truncate" title={r.description}>{r.description || '-'}</td>
                      <td className="py-2 px-3">{r.userName || '-'}</td>
                      <td className="py-2 px-3">{r.email || '-'}</td>
                      <td className="py-2 px-3">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClasses(r.status)}`}>
                          {r.status || 'novo'}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <select
                            title='Alterar Status'
                            value={r.status || 'novo'}
                            onChange={(e) => setIncidentStatus(r.id, e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option value="novo">Novo</option>
                            <option value="em-analise">Em Análise</option>
                            <option value="encaminhado">Encaminhado</option>
                            <option value="em-resolucao">Em Resolução</option>
                            <option value="resolvido">Resolvido</option>
                            <option value="rejeitado">Rejeitado</option>
                          </select>
                          <button onClick={() => setSelectedRecord(r)} className="px-3 py-1 text-sm bg-[#2c7873] text-white rounded hover:bg-[#1f5a56]">Ver</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Detalhes da Ocorrência</h3>
                <button onClick={() => setSelectedRecord(null)} className="px-3 py-1 border rounded hover:bg-gray-50">Fechar</button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="text-gray-500">ID:</span> <span className="font-mono text-xs">{selectedRecord.id}</span></div>
                  <div><span className="text-gray-500">Criado em:</span> <span className="font-medium">{selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString() : '-'}</span></div>
                  <div><span className="text-gray-500">Título:</span> <span className="font-medium">{selectedRecord.title || '-'}</span></div>
                  <div><span className="text-gray-500">Status:</span> <span className="font-medium capitalize">{selectedRecord.status || '-'}</span></div>
                  <div><span className="text-gray-500">Nome:</span> <span className="font-medium">{selectedRecord.userName || '-'}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedRecord.email || '-'}</span></div>
                  <div><span className="text-gray-500">Urgência:</span> <span className="font-medium capitalize">{(selectedRecord as any).urgency || '-'}</span></div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Descrição</div>
                  <div className="p-3 border rounded bg-gray-50 whitespace-pre-wrap">{selectedRecord.description || '-'}</div>
                </div>
                {(selectedRecord as any).address && (
                  <div><span className="text-gray-500">Endereço:</span> <span className="font-medium">{(selectedRecord as any).address}</span></div>
                )}
                {(selectedRecord as any).location && Array.isArray((selectedRecord as any).location) && (
                  <div><span className="text-gray-500">Localização:</span> <span className="font-medium">{(selectedRecord as any).location[0]?.toFixed?.(5)}, {(selectedRecord as any).location[1]?.toFixed?.(5)}</span></div>
                )}
                {(selectedRecord as any).attachments && (selectedRecord as any).attachments.length > 0 && (
                  <div>
                    <div className="text-gray-500 mb-1">Anexos</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {(selectedRecord as any).attachments.map((a: any, idx: number) => (
                        <li key={idx} className="text-gray-700">{a.name} <span className="text-xs text-gray-500">({Math.round((a.size || 0)/1024)} KB)</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button onClick={() => {
                  try {
                    const blob = new Blob([JSON.stringify(selectedRecord, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ocorrencia_${selectedRecord.id}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch {}
                }} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Exportar JSON</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentRecordsModal;
