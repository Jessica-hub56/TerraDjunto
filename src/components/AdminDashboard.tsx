import React, { useMemo, useState } from 'react';
import { BarChart3, Download, Mail, FileText, Users, AlertTriangle, Trash2, TrendingUp, UploadCloud, Eye, EyeOff, Pencil, X } from 'lucide-react';
import MapComponent from './MapComponent';
import IncidentRecordsModal from './IncidentRecordsModal';
import ParticipationBarChart from './ParticipationBarChart';
import MunicipalityBarChart from './MunicipalityBarChart';
import LegislationFileForm from './LegislationFileForm';

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('participation');
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [showPDFUpload, setShowPDFUpload] = useState(false);
  // Gestão de ficheiros de legislação (disponibilizados pelo admin)
  type CustomLegFile = {
    id: string;
    title: string;
    reference: string;
    description: string;
    date: string;
    category: 'ordenamento' | 'residuos';
    tags: string[];
    fullText?: string;
    _meta?: { fileName?: string; size?: number };
  };
  const STORAGE_CUSTOM_LEG = 'customLegislationFiles';
  const [customFiles, setCustomFiles] = useState<CustomLegFile[]>(() => {
    try { const raw = localStorage.getItem(STORAGE_CUSTOM_LEG); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const refreshCustomFiles = () => {
    try { const raw = localStorage.getItem(STORAGE_CUSTOM_LEG); setCustomFiles(raw ? JSON.parse(raw) : []); } catch { setCustomFiles([]); }
  };
  const saveCustomFiles = (arr: CustomLegFile[]) => { setCustomFiles(arr); localStorage.setItem(STORAGE_CUSTOM_LEG, JSON.stringify(arr)); };
  const removeCustomFile = (id: string) => { const arr = customFiles.filter(f => f.id !== id); saveCustomFiles(arr); };
  const [legSearch, setLegSearch] = useState('');
  const [legPreview, setLegPreview] = useState<CustomLegFile | null>(null);
  const [legEdit, setLegEdit] = useState<CustomLegFile | null>(null);

  const metrics = {
    totalParticipations: 1247,
    activeProjects: 23,
    incidentReports: 89,
    wasteReports: 156,
    monthlyGrowth: 12.5
  };

  const participationData = [
    { project: 'Requalificação do Centro da Praia', participants: 234, comments: 89, rating: 4.2 },
    { project: 'Plano de Gestão de Resíduos - Sal', participants: 187, comments: 67, rating: 4.5 },
    { project: 'Ordenamento Costeiro - Mindelo', participants: 156, comments: 45, rating: 4.1 },
    { project: 'Parque Urbano - Assomada', participants: 143, comments: 52, rating: 4.3 }
  ];

  // Estados e utilitários de relatório/exportação/email
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [reportOptionsOpen, setReportOptionsOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<Record<number, boolean>>({});
  // Registos de participações (projetos e programas)
  type ParticipationRecord = {
    id: string;
    type: 'project' | 'program';
    itemId?: string;
    title?: string;
    municipality?: string;
    userName?: string;
    email?: string;
    classification?: string;
    content?: string;
    createdAt?: string;
    status?: string;
    attachments?: { name: string; size: number }[];
    raw?: any;
  };
  const STORAGE_PART = 'participationRecords';
  const [participationModalOpen, setParticipationModalOpen] = useState(false);
  const [selectedParticipationRecord, setSelectedParticipationRecord] = useState<ParticipationRecord | null>(null);
  const [participationRecords, setParticipationRecords] = useState<ParticipationRecord[]>(() => {
    try { const raw = localStorage.getItem(STORAGE_PART); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const refreshParticipationRecords = () => {
    try { const raw = localStorage.getItem(STORAGE_PART); setParticipationRecords(raw ? JSON.parse(raw) : []); } catch { setParticipationRecords([]); }
  };
  const setParticipationStatus = (id: string, status: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_PART);
      const arr = raw ? JSON.parse(raw) : [];
      const updated = Array.isArray(arr) ? arr.map((r: any) => r.id === id ? { ...r, status } : r) : [];
      localStorage.setItem(STORAGE_PART, JSON.stringify(updated));
      refreshParticipationRecords();
    } catch {}
  };
  const exportParticipationCSV = () => {
    const headers = ['ID','Tipo','Título','Município','Nome','Email','Classificação','Conteúdo','Criado em'];
    const rows = participationRecords.map(r => [
      r.id || '',
      r.type,
      r.title || '',
      r.municipality || '',
      r.userName || '',
      r.email || '',
      r.classification || '',
      (r.content || '').replace(/\n/g,' '),
      r.createdAt || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registos_participacoes.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  // Registos de resíduos (bulky e ilegal)
  type WasteRecord = {
    id: string;
    kind: 'bulky' | 'illegal';
    subtype?: 'residential' | 'construction';
    name?: string;
    phone?: string;
    address?: string;
    location?: [number, number];
    items?: string;
    preferredDate?: string;
    createdAt?: string;
    status?: string;
    attachments?: { name: string; size: number }[];
    raw?: any;
  };
  const STORAGE_WASTE = 'wasteRequests';
  const [wasteModalOpen, setWasteModalOpen] = useState(false);
  const [selectedWasteRecord, setSelectedWasteRecord] = useState<WasteRecord | null>(null);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() => {
    try { const raw = localStorage.getItem(STORAGE_WASTE); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const refreshWasteRecords = () => {
    try { const raw = localStorage.getItem(STORAGE_WASTE); setWasteRecords(raw ? JSON.parse(raw) : []); } catch { setWasteRecords([]); }
  };
  const setWasteStatus = (id: string, status: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_WASTE);
      const arr = raw ? JSON.parse(raw) : [];
      const updated = Array.isArray(arr) ? arr.map((r: any) => r.id === id ? { ...r, status } : r) : [];
      localStorage.setItem(STORAGE_WASTE, JSON.stringify(updated));
      refreshWasteRecords();
    } catch {}
  };
  const exportWasteCSV = () => {
    const headers = ['ID','Tipo','Subtipo','Nome','Telefone','Endereço','Latitude','Longitude','Itens','Data Preferida','Criado em'];
    const rows = wasteRecords.map(r => [
      r.id || '',
      r.kind,
      r.subtype || '',
      r.name || '',
      r.phone || '',
      r.address || '',
      r.location ? String(r.location[0]) : '',
      r.location ? String(r.location[1]) : '',
      (r.items || '').replace(/\n/g,' '),
      r.preferredDate || '',
      r.createdAt || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registos_residuos.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredParticipationData = () => {
    const keys = Object.keys(selectedProjects);
    const anySelected = keys.some(k => selectedProjects[Number(k)]);
    if (!anySelected) return participationData;
    return participationData.filter((_, idx) => !!selectedProjects[idx]);
  };
const generateReportData = () => {
    const data = getFilteredParticipationData();
    return {
      title: `Relatório: ${selectedReport} (${selectedPeriod})`,
      headers: ['Projeto', 'Participantes', 'Comentários', 'Avaliação'],
      rows: data.map(p => [p.project, String(p.participants), String(p.comments), String(p.rating)])
    };
  };

  const buildReportHTML = () => {
    const { title, headers, rows } = generateReportData();
    const thead = headers.map(h => `<th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">${h}</th>`).join('');
    const tbody = rows.map(r => `<tr>${r.map(c => `<td style=\"padding:8px;border-bottom:1px solid #f0f0f0\">${c}</td>`).join('')}</tr>`).join('');
    return `
      <div style="font-family:Arial, sans-serif">
        <h2>${title}</h2>
        <table style="border-collapse:collapse;width:100%">
          <thead><tr>${thead}</tr></thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
    `;
  };

  const exportCSV = () => {
    const { title, headers, rows } = generateReportData();
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/ /g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadJsPDF = async (): Promise<any | null> => {
    if ((window as any).jspdf?.jsPDF) return (window as any).jspdf.jsPDF;
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      s.onload = () => resolve((window as any).jspdf?.jsPDF || null);
      s.onerror = () => resolve(null);
      document.body.appendChild(s);
    });
  };

  const exportPDF = async () => {
    const jsPDF = await loadJsPDF();
    const { title, headers, rows } = generateReportData();
    if (jsPDF) {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      let y = 40;
      doc.setFontSize(14);
      doc.text(title, 40, y);
      y += 20;
      doc.setFontSize(10);
      // Cabeçalhos
      const colX = [40, 250, 350, 450];
      headers.forEach((h, i) => doc.text(String(h), colX[i] || 40 + i*120, y));
      y += 14;
      doc.setLineWidth(0.5); doc.line(40, y, 555, y); y += 10;
      rows.forEach((r) => {
        r.forEach((c, i) => doc.text(String(c), colX[i] || 40 + i*120, y));
        y += 14;
        if (y > 780) { doc.addPage(); y = 40; }
      });
      doc.save(`${title.replace(/ /g, '_')}.pdf`);
    } else {
      // Fallback: abrir nova janela com pré-visualização e invocar print
      const html = buildReportHTML();
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(`<html><head><title>${title}</title></head><body>${html}<script>window.onload=() => window.print();<\/script></body></html>`);
        w.document.close();
      } else {
        alert('Não foi possível abrir a janela de impressão.');
      }
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') exportPDF();
    else exportCSV();
  };

  const toggleSelectAllProjects = () => {
    const allSelected = participationData.every((_, idx) => selectedProjects[idx]);
    if (allSelected) {
      setSelectedProjects({});
    } else {
      const sel: Record<number, boolean> = {};
      participationData.forEach((_, idx) => { sel[idx] = true; });
      setSelectedProjects(sel);
    }
  };

  const sendByEmail = () => {
    const html = buildReportHTML();
    setPreviewHtml(html);
    setEmailStatus('');
    setEmailTo('');
    setEmailModalOpen(true);
  };

  // Gestão de datasets geoespaciais
  type Dataset = {
    id: string;
    name: string;
    type: 'geojson' | 'kml' | 'csv' | 'shapefile' | 'geopackage' | 'json';
    createdAt: string;
    active: boolean;
    scope?: 'header' | 'participate';
    features?: any; // GeoJSON FeatureCollection
    meta?: { size?: number; originalName?: string };
  };

  const STORAGE_KEY = 'adminDatasets';
  const [datasets, setDatasets] = useState<Dataset[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map((d: any) => ({ ...d, scope: d.scope || 'header' })) : [];
    } catch { return []; }
  });
  const [scopeFilter, setScopeFilter] = useState<'header' | 'participate'>('header');
  const [previewVisible, setPreviewVisible] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [fitToBounds, setFitToBounds] = useState<any>(null);

  const saveDatasets = (arr: Dataset[]) => {
    setDatasets(arr);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  };
  const setDatasetScope = (id: string, scope: 'header'|'participate') => {
    const updated = datasets.map(d => d.id === id ? { ...d, scope } : d);
    saveDatasets(updated);
  };

  const parseKMLtoGeoJSON = async (text: string) => {
    // Conversão simples KML -> GeoJSON (muito básica; para produção usar tokml/togeojson)
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      const placemarks = Array.from(xml.getElementsByTagName('Placemark'));
      const features = placemarks.map((pm) => {
        const name = pm.getElementsByTagName('name')[0]?.textContent || 'Sem nome';
        const coords = pm.getElementsByTagName('coordinates')[0]?.textContent?.trim() || '';
        const [lng, lat] = coords.split(',').map(Number);
        return {
          type: 'Feature',
          properties: { name },
          geometry: { type: 'Point', coordinates: [lng, lat] }
        };
      });
      return { type: 'FeatureCollection', features };
    } catch {
      return null;
    }
  };

  const parseCSVtoGeoJSON = async (text: string) => {
    // CSV com cabeçalhos lat,lng,name
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = lines.shift()?.split(',') || [];
    const latIdx = header.findIndex(h => /lat/i.test(h));
    const lngIdx = header.findIndex(h => /lon|lng|long/i.test(h));
    const nameIdx = header.findIndex(h => /name|nome|label/i.test(h));
    if (latIdx === -1 || lngIdx === -1) return null;
    const features = lines.map(line => {
      const cols = line.split(',');
      const lat = parseFloat(cols[latIdx]);
      const lng = parseFloat(cols[lngIdx]);
      const name = nameIdx !== -1 ? cols[nameIdx] : undefined;
      return { type: 'Feature', properties: { name }, geometry: { type: 'Point', coordinates: [lng, lat] } };
    });
    return { type: 'FeatureCollection', features };
  };

  const handleUpload = async (files: FileList | null) => {
    setUploadError(null);
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.toLowerCase().split('.').pop() || '';

    try {
      if (['geojson', 'json'].includes(ext)) {
        const text = await file.text();
        const json = JSON.parse(text);
        const ds: Dataset = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          type: ext === 'geojson' ? 'geojson' : 'json',
          createdAt: new Date().toISOString(),
          active: true,
          features: json,
          meta: { size: file.size, originalName: file.name }
        };
        saveDatasets([ds, ...datasets]);
      } else if (ext === 'kml') {
        const text = await file.text();
        const geojson = await parseKMLtoGeoJSON(text);
        if (!geojson) throw new Error('Falha ao converter KML');
        const ds: Dataset = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          type: 'kml',
          createdAt: new Date().toISOString(),
          active: true,
          features: geojson,
          meta: { size: file.size, originalName: file.name }
        };
        saveDatasets([ds, ...datasets]);
      } else if (ext === 'csv') {
        const text = await file.text();
        const geojson = await parseCSVtoGeoJSON(text);
        if (!geojson) throw new Error('CSV inválido (requer colunas lat e lng)');
        const ds: Dataset = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          type: 'csv',
          createdAt: new Date().toISOString(),
          active: true,
          features: geojson,
          meta: { size: file.size, originalName: file.name }
        };
        saveDatasets([ds, ...datasets]);
      } else if (['zip', 'shp'].includes(ext)) {
        // Shapefile: sem parsing no cliente (precisa de shpjs ou backend). Guardamos metadados.
        const ds: Dataset = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          type: 'shapefile',
          createdAt: new Date().toISOString(),
          active: false,
          features: undefined,
          meta: { size: file.size, originalName: file.name }
        };
        saveDatasets([ds, ...datasets]);
        setUploadError('Shapefile carregado como metadados. Conversão para visualização requer backend ou biblioteca específica.');
      } else if (ext === 'gpkg') {
        const ds: Dataset = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          type: 'geopackage',
          createdAt: new Date().toISOString(),
          active: false,
          features: undefined,
          meta: { size: file.size, originalName: file.name }
        };
        saveDatasets([ds, ...datasets]);
        setUploadError('GeoPackage carregado como metadados. Conversão requer backend ou biblioteca específica.');
      } else {
        setUploadError('Formato não suportado. Use GeoJSON, KML, CSV, Shapefile (zip/shp) ou GeoPackage (gpkg).');
      }
    } catch (e: any) {
      setUploadError(e.message || 'Erro ao processar ficheiro');
    }
  };

  const toggleActive = (id: string) => {
    const updated = datasets.map(d => d.id === id ? { ...d, active: !d.active } : d);
    saveDatasets(updated);
  };

  const removeDataset = (id: string) => {
    const updated = datasets.filter(d => d.id !== id);
    saveDatasets(updated);
  };

  const renameDataset = (id: string) => {
    const name = prompt('Novo nome da camada:');
    if (!name) return;
    const updated = datasets.map(d => d.id === id ? { ...d, name } : d);
    saveDatasets(updated);
  };

  const computeBounds = (fc: any): any => {
    try {
      const coords: [number, number][] = [];
      (fc.features || []).forEach((f: any) => {
        const g = f.geometry;
        if (!g) return;
        const pushCoord = (c: any) => { if (Array.isArray(c) && typeof c[0] === 'number') coords.push([c[1], c[0]]); };
        if (g.type === 'Point') pushCoord(g.coordinates);
        if (g.type === 'LineString') g.coordinates.forEach(pushCoord);
        if (g.type === 'Polygon') g.coordinates.flat(1).forEach(pushCoord);
        if (g.type === 'MultiPoint') g.coordinates.forEach(pushCoord);
        if (g.type === 'MultiLineString') g.coordinates.flat(1).forEach(pushCoord);
        if (g.type === 'MultiPolygon') g.coordinates.flat(2).forEach(pushCoord);
      });
      if (!coords.length) return null;
      const lats = coords.map(c => c[0]);
      const lngs = coords.map(c => c[1]);
      return [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];
    } catch { return null; }
  };

  const activeGeoJSON = useMemo(() => datasets
    .filter(d => d.active && d.features && (d.scope || 'header') === scopeFilter)
    .map(d => ({ data: d.features, style: { color: '#2c7873', weight: 2, opacity: 1 } })), [datasets, scopeFilter]);

  return (
  <div className="min-h-screen bg-gray-50 p-6" style={{ position: 'relative', overflow: 'auto' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Administração</h1>
          <p className="text-gray-600">Métricas e relatórios da plataforma Terra Djunto</p>
        </div>

        {/* Secção de upload de PDFs para legislação */}
        {/* Removido: upload de PDFs agora está no modal de legislação */}
        {/* Ferramentas de Gestão e Botões de Registos */}
        <div className="mb-8 flex flex-row gap-6 items-start">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ferramentas de Gestão</h2>
            <button
            onClick={() => setShowPDFUpload(true)}
            className="w-full px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56]"
            >
            Adicionar ficheiros
            </button>
            <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Ficheiros disponibilizados</h3>
            <div className="flex items-center gap-2">
            <input
            type="text"
            placeholder="Pesquisar título/referência..."
            value={legSearch}
            onChange={(e)=> setLegSearch(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
            />
            <button onClick={refreshCustomFiles} className="px-2 py-1 text-sm border rounded hover:bg-gray-50">Atualizar</button>
            <span className="text-xs text-gray-500">{customFiles.length} itens</span>
            </div>
            </div>
            {customFiles.length === 0 ? (
            <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">Nenhum ficheiro adicionado.</div>
            ) : (
            <ul className="divide-y border rounded">
            {customFiles
            .filter(f => `${f.title} ${f.reference}`.toLowerCase().includes(legSearch.toLowerCase()))
            .map((f) => (
            <li key={f.id} className="px-3 py-2">
            <div className="flex items-center justify-between">
            <div className="min-w-0">
            <div className="font-medium text-gray-800 truncate" title={f.title}>{f.title}</div>
            <div className="text-xs text-gray-500 truncate">{f.reference} • {new Date(f.date).toLocaleDateString('pt-PT')} • {f.category === 'ordenamento' ? 'Ordenamento' : 'Resíduos'}</div>
            {f._meta?.fileName && (
            <div className="text-xs text-gray-400 truncate">{f._meta.fileName} • {Math.round((f._meta.size || 0)/1024)} KB</div>
            )}
            </div>
            <div className="flex items-center gap-2">
            <button onClick={() => setLegPreview(f)} className="px-2 py-1 text-sm border rounded hover:bg-gray-50">Pré-visualizar</button>
            <button onClick={() => setLegEdit(f)} className="px-2 py-1 text-sm border rounded hover:bg-gray-50">Editar</button>
            <button onClick={() => { if (confirm('Remover este ficheiro?')) removeCustomFile(f.id); }} className="px-2 py-1 text-sm border rounded hover:bg-gray-50 text-red-600">Remover</button>
            </div>
            </div>
            </li>
            ))}
            </ul>
            )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 flex flex-col items-stretch">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestão de Registos</h2>
            <button onClick={() => { refreshParticipationRecords(); setParticipationModalOpen(true); }} className="px-4 py-2 mb-2 bg-[#004d47] text-white rounded-lg hover:bg-[#003a35] w-full">Registos de Participações</button>
            <button onClick={() => { refreshWasteRecords(); setWasteModalOpen(true); }} className="px-4 py-2 mb-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] w-full">Registos de Resíduos</button>
            <button onClick={() => setIncidentModalOpen(true)} className="px-4 py-2 bg-[#e67e22] text-white rounded-lg hover:bg-[#ca6f1e] w-full">Registo de Ocorrências</button>
          </div>
        </div>
        {showPDFUpload && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Adicionar Novo Ficheiro</h3>
                <button onClick={() => setShowPDFUpload(false)} className="text-gray-600 hover:text-gray-800">✕</button>
              </div>
              <LegislationFileForm onClose={() => { setShowPDFUpload(false); refreshCustomFiles(); }} />
            </div>
          </div>
        )}

        {/* Modal de Registo de Ocorrências */}
        {incidentModalOpen && (
          <IncidentRecordsModal onClose={() => setIncidentModalOpen(false)} />
        )}

        {/* Secção de dados geoespaciais */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Dados Geoespaciais</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <label className="flex items-center gap-1">
                <span>Escopo:</span>
                <select value={scopeFilter} onChange={(e)=> setScopeFilter(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                  <option value="header">Header (Mapa Interativo)</option>
                  <option value="participate">Participar (Mapas de Projetos)</option>
                </select>
              </label>
              <div className="flex items-center gap-2">
                <Eye className="text-[#2c7873]" size={16} /> Pré-visualização
                <button onClick={() => setPreviewVisible(v => !v)} className="px-2 py-1 border rounded hover:bg-gray-50">
                  {previewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Uploader */}
            <div className="lg:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Carregar ficheiros</label>
              <div className="p-4 border-2 border-dashed rounded-lg text-center">
                <UploadCloud className="mx-auto text-gray-400" />
                <p className="text-sm text-gray-600 mt-2">Formatos: GeoJSON, JSON, KML, CSV(lat,lng), Shapefile(.zip/.shp), GeoPackage(.gpkg)</p>
                <input
                  title='Carregar ficheiro'
                  type="file"
                  className="mt-3"
                  accept=".geojson,.json,.kml,.csv,.zip,.shp,.gpkg"
                  onChange={(e) => handleUpload(e.target.files)}
                />
                {uploadError && <div className="mt-2 text-sm text-red-600">{uploadError}</div>}
              </div>
            </div>

            {/* Lista e ações */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Camadas carregadas</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Pesquisar por nome/tipo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-2 py-1 text-sm border rounded"
                  />
                  <span className="text-xs text-gray-500">{datasets.length} itens</span>
                </div>
              </div>
              {datasets.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">Nenhum dataset carregado.</div>
              ) : (
                <ul className="divide-y border rounded">
                  {datasets
                    .filter(d => (d.scope || 'header') === scopeFilter)
                    .filter(d => `${d.name} ${d.type}`.toLowerCase().includes(search.toLowerCase()))
                    .map((d, idx) => (
                    <li key={d.id} className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{d.name} <span className="text-xs text-gray-500">({d.type})</span></div>
                          <div className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleString()} • {d.meta?.originalName} • {Math.round((d.meta?.size || 0)/1024)} KB</div>
                          <div className="text-xs text-gray-500">Escopo: <span className="font-medium">{d.scope || 'header'}</span></div>
                          {!d.features && <div className="text-xs text-orange-600 mt-1">Visualização não disponível no cliente para este formato. Considere converter para GeoJSON no backend ou usar bibliotecas como shpjs/ogre.</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setDatasetScope(d.id, (d.scope || 'header') === 'header' ? 'participate' : 'header')} className="px-2 py-1 text-sm border rounded hover:bg-gray-50">Mover para {(d.scope || 'header') === 'header' ? 'Participar' : 'Header'}</button>
                          <button onClick={() => renameDataset(d.id)} className="px-2 py-1 text-sm border rounded hover:bg-gray-50 inline-flex items-center gap-1"><Pencil size={14}/>Renomear</button>
                          <button onClick={() => toggleActive(d.id)} className={`px-2 py-1 text-sm border rounded inline-flex items-center gap-1 ${d.active ? 'bg-green-50 text-green-700 border-green-300' : 'hover:bg-gray-50'}`}>{d.active ? 'Ativo' : 'Ativar'}</button>
                          <button onClick={() => removeDataset(d.id)} className="px-2 py-1 text-sm border rounded hover:bg-gray-50 text-red-600 inline-flex items-center gap-1"><X size={14}/>Remover</button>
                        </div>
                      </div>
                      {d.features && (
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <label className="text-gray-600 w-20">Cor</label>
                            <input title='Cor' type="color" defaultValue="#2c7873" onChange={() => {
                              const updated = datasets.map(x => x.id === d.id ? x : x);
                              setDatasets(updated.slice());
                            }} />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-gray-600 w-20">Opacidade</label>
                            <input title='Opacidade' type="range" min={0.1} max={1} step={0.1} defaultValue={1} onChange={() => {
                              const updated = datasets.map(x => x.id === d.id ? x : x);
                              setDatasets(updated.slice());
                            }} />
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => {
                              const b = computeBounds(d.features);
                              if (b) setFitToBounds(b);
                            }} className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50">Zoom</button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button disabled={idx===0} onClick={() => {
                              if (idx===0) return;
                              const arr = datasets.slice();
                              const [item] = arr.splice(idx,1);
                              arr.splice(idx-1,0,item);
                              saveDatasets(arr);
                            }} className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cima</button>
                            <button disabled={idx===datasets.length-1} onClick={() => {
                              if (idx===datasets.length-1) return;
                              const arr = datasets.slice();
                              const [item] = arr.splice(idx,1);
                              arr.splice(idx+1,0,item);
                              saveDatasets(arr);
                            }} className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50">Baixo</button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Pré-visualização */}
          {previewVisible && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <MapComponent height="500px" geojsonLayers={activeGeoJSON} layers="projects" fitBounds={fitToBounds} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800">Legenda Interativa</h4>
                    <span className="text-xs text-gray-500">{activeGeoJSON.length} camada{activeGeoJSON.length!==1?'s':''}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={()=>{
                      const updated = datasets.map(d => (d.scope || 'header') === scopeFilter ? { ...d, active: true } : d);
                      saveDatasets(updated);
                    }} className="text-xs px-2 py-1 border rounded hover:bg-gray-100">Ativar tudo</button>
                    <button onClick={()=>{
                      const updated = datasets.map(d => (d.scope || 'header') === scopeFilter ? { ...d, active: false } : d);
                      saveDatasets(updated);
                    }} className="text-xs px-2 py-1 border rounded hover:bg-gray-100">Desativar tudo</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y">
                    {datasets.filter(d => (d.scope || 'header') === scopeFilter).map((d) => (
                      <div key={d.id} className="py-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex items-center gap-2">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#2c7873' }}></span>
                            <div className="truncate">
                              <div className="text-sm text-gray-800 truncate" title={d.name}>{d.name}</div>
                              <div className="text-xs text-gray-500 truncate">{d.type} {d.features? '' : '• sem vista'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              title="Zoom"
                              onClick={()=>{
                                if (!d.features) return;
                                const b = computeBounds(d.features);
                                if (b) setFitToBounds(b);
                              }}
                              className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
                            >Zoom</button>
                            <input
                              title='Zonar camada'
                              type="checkbox"
                              className="w-4 h-4"
                              checked={!!d.active}
                              onChange={()=> toggleActive(d.id)}
                            />
                          </div>
                        </div>
                                              </div>
                    ))}
                    {datasets.filter(d => (d.scope || 'header') === scopeFilter).length===0 && (
                      <div className="py-6 text-xs text-gray-500">Sem camadas no escopo selecionado.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Participações</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalParticipations.toLocaleString()}</p>
              </div>
              <Users className="text-[#2c7873]" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeProjects}</p>
              </div>
              <BarChart3 className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocorrências</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.incidentReports}</p>
              </div>
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gestão de Resíduos</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.wasteReports}</p>
              </div>
              <Trash2 className="text-green-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crescimento Mensal</p>
                <p className="text-2xl font-bold text-green-600">+{metrics.monthlyGrowth}%</p>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Relatórios de Participação</h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="reportTypeSelect" className="sr-only">Tipo de Relatório</label>
              <select
                id="reportTypeSelect"
                title="Tipo de Relatório"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
              >
                <option value="participation">Participação em Projetos</option>
                <option value="incidents">Relatório de Ocorrências</option>
                <option value="waste">Gestão de Resíduos</option>
                <option value="general">Relatório Geral</option>
              </select>
             
              <select
                title="Período do Relatório"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873]"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="quarter">Último Trimestre</option>
                <option value="year">Último Ano</option>
              </select>
            </div>
          </div>

              {/* Export Options */}
          <div className="flex flex-wrap items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gren 700">Opções de Relatórios:</span>
            <button onClick={()=> setReportOptionsOpen(o=>!o)} className="flex items-center space-x-2 px-4 py-2 border rounded-lg bg-[#00514B] hover:bg-[#004c44]">
              <Download size={16} />
              <span>Download</span>
              <span>{reportOptionsOpen ? '▲' : '▼'}</span>
            </button>

              <div  className="flex flex-wrap items-center space-x-2 mb-0 p-4 bg-gray-50 rounded-lg">
              <button onClick={toggleSelectAllProjects} className="flex items-center space-x-2 px-4 py-2 border rounded-lg bg-[#2A7E7A] hover:bg-[#2c7369]">
                <span>Selecionar Todos</span>
              </button>
              <button
                onClick={sendByEmail}
                className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg bg-[#E77921] hover:bg-[#f17c2d] transition-colors"
              >
                <Mail size={16} />
                <span>Enviar por Email</span>
              </button>
            </div>
           
          </div>

           {reportOptionsOpen && (
              <div className="basis-full w-full -mt-5 bg-white border rounded-lg shadow p-2 flex flex-col gap-2">
                <button onClick={() => exportReport('pdf')} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-gray-700">
                  <Download size={14} />
                  <span>PDF</span>
                </button>
                <button onClick={() => exportReport('excel')} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-gray-700">
                  <Download size={14} />
                  <span>Excel</span>
                </button>
              </div>
            )}

          {/* Participation Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Selecionar</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Projeto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Participantes</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Comentários</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Avaliação</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {participationData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input title='qq' type="checkbox" className="w-4 h-4" checked={!!selectedProjects[index]} onChange={(e) => setSelectedProjects(prev => ({ ...prev, [index]: e.target.checked }))} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{item.project}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="font-medium">{item.participants}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-gray-400" />
                        <span>{item.comments}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{item.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-[#2c7873] hover:text-[#1f5a56] font-medium text-sm">
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {emailModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Pré-visualização do Email</h3>
                <button onClick={() => setEmailModalOpen(false)} className="text-gray-600 hover:text-gray-800">✕</button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email do remetente (destinatário)</label>
                  <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="nome@exemplo.cv" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                  <div className="border rounded p-3 text-sm overflow-auto" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
                {emailStatus && <div className="text-sm text-green-700 bg-green-100 rounded p-2">{emailStatus}</div>}
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button onClick={() => setEmailModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                <button onClick={() => {
                  if (!emailTo) { alert('Indique um email.'); return; }
                  const subject = encodeURIComponent('Relatório Terra Djunto');
                  const body = encodeURIComponent('Segue o relatório.\n\n— Terra Djunto');
                  window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
                  setEmailStatus('Email preparado no seu cliente de email.');
                }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enviar</button>
              </div>
            </div>
          </div>
        )}

        {wasteModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Registos de Resíduos (Volumosos e Denúncias)</h3>
                <div className="flex items-center gap-2">
                  <button onClick={refreshWasteRecords} className="px-3 py-2 border rounded hover:bg-gray-50">Atualizar</button>
                  <button onClick={exportWasteCSV} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Exportar CSV</button>
                  <button onClick={() => setWasteModalOpen(false)} className="px-3 py-2 border rounded hover:bg-gray-50">Fechar</button>
                </div>
              </div>
              <div className="p-4">
                {wasteRecords.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">Sem registos encontrados.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3">ID</th>
                          <th className="text-left py-2 px-3">Tipo</th>
                          <th className="text-left py-2 px-3">Subtipo</th>
                          <th className="text-left py-2 px-3">Nome</th>
                          <th className="text-left py-2 px-3">Telefone</th>
                          <th className="text-left py-2 px-3">Endereço</th>
                          <th className="text-left py-2 px-3">Localização</th>
                          <th className="text-left py-2 px-3">Itens/Descrição</th>
                          <th className="text-left py-2 px-3">Data Preferida</th>
                          <th className="text-left py-2 px-3">Status</th>
                          <th className="text-left py-2 px-3">Criado em</th>
                          <th className="text-left py-2 px-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wasteRecords.map((r) => (
                          <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3 font-mono text-xs">{r.id}</td>
                            <td className="py-2 px-3 capitalize">{r.kind}</td>
                            <td className="py-2 px-3 capitalize">{r.subtype || '-'}</td>
                            <td className="py-2 px-3">{r.name || '-'}</td>
                            <td className="py-2 px-3">{r.phone || '-'}</td>
                            <td className="py-2 px-3">{r.address || '-'}</td>
                            <td className="py-2 px-3">{r.location ? `${r.location[0].toFixed(5)}, ${r.location[1].toFixed(5)}` : '-'}</td>
                            <td className="py-2 px-3 max-w-[240px] truncate" title={r.items}>{r.items || '-'}</td>
                            <td className="py-2 px-3">{r.preferredDate || '-'}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${r.status==='enviado' ? 'bg-yellow-100 text-yellow-800' : r.status==='em-analise' ? 'bg-blue-100 text-blue-800' : r.status==='agendado' ? 'bg-indigo-100 text-indigo-800' : r.status==='em-servico' ? 'bg-purple-100 text-purple-800' : r.status==='resolvido' ? 'bg-green-100 text-green-800' : r.status==='rejeitado' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                                {r.status || 'enviado'}
                              </span>
                            </td>
                            <td className="py-2 px-3">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <select
                                  title="Alterar status do registo"
                                  value={r.status || 'enviado'}
                                  onChange={(e) => setWasteStatus(r.id, e.target.value)}
                                  className="px-2 py-1 border rounded text-sm"
                                >
                                  <option value="enviado">Enviado</option>
                                  <option value="em-analise">Em Análise</option>
                                  <option value="agendado">Agendado</option>
                                  <option value="em-servico">Em Serviço</option>
                                  <option value="resolvido">Resolvido</option>
                                  <option value="rejeitado">Rejeitado</option>
                                </select>
                                <button onClick={() => setSelectedWasteRecord(r)} className="px-3 py-1 text-sm bg-[#2c7873] text-white rounded hover:bg-[#1f5a56]">Ver</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedWasteRecord && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Detalhes do Registo de Resíduos</h3>
                <button onClick={() => setSelectedWasteRecord(null)} className="px-3 py-1 border rounded hover:bg-gray-50">Fechar</button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="text-gray-500">ID:</span> <span className="font-mono text-xs">{selectedWasteRecord.id}</span></div>
                  <div><span className="text-gray-500">Criado em:</span> <span className="font-medium">{selectedWasteRecord.createdAt ? new Date(selectedWasteRecord.createdAt).toLocaleString() : '-'}</span></div>
                  <div><span className="text-gray-500">Tipo:</span> <span className="font-medium capitalize">{selectedWasteRecord.kind}</span></div>
                  <div><span className="text-gray-500">Subtipo:</span> <span className="font-medium capitalize">{selectedWasteRecord.subtype || '-'}</span></div>
                  <div><span className="text-gray-500">Nome:</span> <span className="font-medium">{selectedWasteRecord.name || '-'}</span></div>
                  <div><span className="text-gray-500">Telefone:</span> <span className="font-medium">{selectedWasteRecord.phone || '-'}</span></div>
                  <div className="md:col-span-2"><span className="text-gray-500">Endereço:</span> <span className="font-medium">{selectedWasteRecord.address || '-'}</span></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-gray-500 mb-1">Itens/Descrição</div>
                    <div className="p-3 border rounded bg-gray-50 whitespace-pre-wrap">{selectedWasteRecord.items || '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Data Preferida</div>
                    <div className="p-3 border rounded bg-gray-50">{selectedWasteRecord.preferredDate || '-'}</div>
                  </div>
                </div>
                {selectedWasteRecord.location && (
                  <div><span className="text-gray-500">Localização:</span> <span className="font-medium">{selectedWasteRecord.location[0]?.toFixed?.(5)}, {selectedWasteRecord.location[1]?.toFixed?.(5)}</span></div>
                )}
                {selectedWasteRecord.attachments && selectedWasteRecord.attachments.length > 0 && (
                  <div>
                    <div className="text-gray-500 mb-1">Anexos</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedWasteRecord.attachments.map((a, idx) => (
                        <li key={idx} className="text-gray-700">{a.name} <span className="text-xs text-gray-500">({Math.round((a.size || 0)/1024)} KB)</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button onClick={() => {
                  try {
                    const blob = new Blob([JSON.stringify(selectedWasteRecord, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `residuo_${selectedWasteRecord.id}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch {}
                }} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Exportar JSON</button>
              </div>
            </div>
          </div>
        )}

        {participationModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Registos de Participações (Projetos e Programas)</h3>
                <div className="flex items-center gap-2">
                  <button onClick={refreshParticipationRecords} className="px-3 py-2 border rounded hover:bg-gray-50">Atualizar</button>
                  <button onClick={exportParticipationCSV} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Exportar CSV</button>
                  <button onClick={() => setParticipationModalOpen(false)} className="px-3 py-2 border rounded hover:bg-gray-50">Fechar</button>
                </div>
              </div>
              <div className="p-4">
                {participationRecords.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">Sem registos encontrados.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3">ID</th>
                          <th className="text-left py-2 px-3">Tipo</th>
                          <th className="text-left py-2 px-3">Título</th>
                          <th className="text-left py-2 px-3">Município</th>
                          <th className="text-left py-2 px-3">Nome</th>
                          <th className="text-left py-2 px-3">Email</th>
                          <th className="text-left py-2 px-3">Classificação</th>
                          <th className="text-left py-2 px-3">Conteúdo</th>
                          <th className="text-left py-2 px-3">Criado em</th>
                          <th className="text-left py-2 px-3">Status</th>
                          <th className="text-left py-2 px-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participationRecords.map((r) => (
                          <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3 font-mono text-xs">{r.id}</td>
                            <td className="py-2 px-3 capitalize">{r.type}</td>
                            <td className="py-2 px-3">{r.title || '-'}</td>
                            <td className="py-2 px-3">{r.municipality || '-'}</td>
                            <td className="py-2 px-3">{r.userName || '-'}</td>
                            <td className="py-2 px-3">{r.email || '-'}</td>
                            <td className="py-2 px-3 capitalize">{r.classification || '-'}</td>
                            <td className="py-2 px-3 max-w-[320px] truncate" title={r.content}>{r.content || '-'}</td>
                            <td className="py-2 px-3">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${r.status==='enviado' ? 'bg-yellow-100 text-yellow-800' : r.status==='em-analise' ? 'bg-blue-100 text-blue-800' : r.status==='aprovado' ? 'bg-green-100 text-green-800' : r.status==='rejeitado' ? 'bg-red-100 text-red-800' : r.status==='publicado' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                                {r.status || 'enviado'}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <select
                                  title="Alterar status da participação"
                                  value={r.status || 'enviado'}
                                  onChange={(e) => setParticipationStatus(r.id, e.target.value)}
                                  className="px-2 py-1 border rounded text-sm"
                                >
                                  <option value="enviado">Enviado</option>
                                  <option value="em-analise">Em Análise</option>
                                  <option value="aprovado">Aprovado</option>
                                  <option value="rejeitado">Rejeitado</option>
                                  <option value="publicado">Publicado</option>
                                </select>
                                <button onClick={() => setSelectedParticipationRecord(r)} className="px-3 py-1 text-sm bg-[#2c7873] text-white rounded hover:bg-[#1f5a56]">Ver</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {legPreview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Pré-visualização do Ficheiro</h3>
                <button onClick={() => setLegPreview(null)} className="px-3 py-1 border rounded hover:bg-gray-50">Fechar</button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="text-gray-500">Título:</span> <span className="font-medium">{legPreview.title}</span></div>
                  <div><span className="text-gray-500">Referência:</span> <span className="font-medium">{legPreview.reference}</span></div>
                  <div><span className="text-gray-500">Categoria:</span> <span className="font-medium capitalize">{legPreview.category === 'ordenamento' ? 'Ordenamento' : 'Resíduos'}</span></div>
                  <div><span className="text-gray-500">Data:</span> <span className="font-medium">{new Date(legPreview.date).toLocaleDateString('pt-PT')}</span></div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Descrição</div>
                  <div className="p-3 border rounded bg-gray-50 whitespace-pre-wrap">{legPreview.description}</div>
                </div>
                {legPreview.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {legPreview.tags.map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>
                    ))}
                  </div>
                )}
                <div>
                  <div className="text-gray-500 mb-1">Conteúdo</div>
                  <div className="p-3 border rounded bg-white">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm">{legPreview.fullText || 'Conteúdo do ficheiro carregado.'}</pre>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button onClick={() => setLegPreview(null)} className="px-3 py-2 border rounded hover:bg-gray-50">Fechar</button>
              </div>
            </div>
          </div>
        )}

        {legEdit && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Editar Ficheiro</h3>
                <button onClick={() => setLegEdit(null)} className="px-3 py-1 border rounded hover:bg-gray-50">Fechar</button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input title='Titulo' value={legEdit.title} onChange={(e)=> setLegEdit({ ...legEdit!, title: e.target.value })} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referência</label>
                  <input title='Referencia' value={legEdit.reference} onChange={(e)=> setLegEdit({ ...legEdit!, reference: e.target.value })} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    title="Categoria do ficheiro"
                    value={legEdit.category}
                    onChange={(e)=> setLegEdit({ ...legEdit!, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="ordenamento">Ordenamento do Território</option>
                    <option value="residuos">Resíduos Sólidos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea title='Descricao' value={legEdit.description} onChange={(e)=> setLegEdit({ ...legEdit!, description: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                  <input title='Tags' value={legEdit.tags?.join(', ') || ''} onChange={(e)=> setLegEdit({ ...legEdit!, tags: e.target.value.split(',').map(t=>t.trim()).filter(Boolean) })} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button onClick={() => setLegEdit(null)} className="px-3 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                <button onClick={() => {
                  if (!legEdit?.title || !legEdit.reference || !legEdit.description) { alert('Preencha título, referência e descrição.'); return; }
                  const arr = customFiles.map(f => f.id === legEdit!.id ? { ...f, ...legEdit } : f);
                  saveCustomFiles(arr);
                  setLegEdit(null);
                }} className="px-3 py-2 bg-[#2c7873] text-white rounded hover:bg-[#1f5a56]">Guardar</button>
              </div>
            </div>
          </div>
        )}

        {selectedParticipationRecord && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Detalhes da Participação</h3>
                <button onClick={() => setSelectedParticipationRecord(null)} className="px-3 py-1 border rounded hover:bg-gray-50">Fechar</button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="text-gray-500">Tipo:</span> <span className="font-medium capitalize">{selectedParticipationRecord.type}</span></div>
                  <div><span className="text-gray-500">Criado em:</span> <span className="font-medium">{selectedParticipationRecord.createdAt ? new Date(selectedParticipationRecord.createdAt).toLocaleString() : '-'}</span></div>
                  <div><span className="text-gray-500">Título:</span> <span className="font-medium">{selectedParticipationRecord.title || '-'}</span></div>
                  <div><span className="text-gray-500">Município:</span> <span className="font-medium">{selectedParticipationRecord.municipality || '-'}</span></div>
                  <div><span className="text-gray-500">Nome:</span> <span className="font-medium">{selectedParticipationRecord.userName || '-'}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedParticipationRecord.email || '-'}</span></div>
                  <div><span className="text-gray-500">Classificação:</span> <span className="font-medium capitalize">{selectedParticipationRecord.classification || '-'}</span></div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Conteúdo</div>
                  <div className="p-3 border rounded bg-gray-50 whitespace-pre-wrap">{selectedParticipationRecord.content || '-'}</div>
                </div>
                {selectedParticipationRecord.attachments && selectedParticipationRecord.attachments.length > 0 && (
                  <div>
                    <div className="text-gray-500 mb-1">Anexos</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedParticipationRecord.attachments.map((a, idx) => (
                        <li key={idx} className="text-gray-700">{a.name} <span className="text-xs text-gray-500">({Math.round((a.size || 0)/1024)} KB)</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 p-4 border-t">
                <button onClick={() => {
                  try {
                    const blob = new Blob([JSON.stringify(selectedParticipationRecord, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `participacao_${selectedParticipationRecord.id}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch {}
                }} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Exportar JSON</button>
              </div>
            </div>
          </div>
        )}
        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Participação por Mês */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Participação por Mês</h3>
             <div className="mt-24">
              <ParticipationBarChart />
            </div>
          </div>

          {/* Distribuição por Município */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição por Município</h3>
             <div className="mt-32">
              <MunicipalityBarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;