import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Filter, Download, FileText, Calendar, Tag, Volume2, Eye, ArrowLeft, CheckSquare, Square, ChevronDown, Menu, ChevronUp } from 'lucide-react';
import { legislationDatabase, LegislationItem } from '../../data/legislation';

interface LegislationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  selectedDocument?: LegislationItem | null;
}

const LegislationModal: React.FC<LegislationModalProps> = ({ isOpen, onClose, isAdmin = false, selectedDocument: externalSelectedDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<LegislationItem | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'document'>('list');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ordenamento' | 'residuos'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'reference'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [showDownloadOptions, setShowDownloadOptions] = useState<false | string>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newFile, setNewFile] = useState({
    title: '',
    reference: '',
    description: '',
    category: 'ordenamento' as 'ordenamento' | 'residuos',
    tags: '',
    file: null as File | null
  });

  // Verificar se está em modo mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Carregar ficheiros personalizados adicionados pelo Administrador (via AdminDashboard)
  const STORAGE_KEY = 'customLegislationFiles';
  const getCustomLegislation = (): LegislationItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      return arr.map((it: any) => ({
        id: String(it.id || Date.now()),
        title: String(it.title || 'Documento'),
        reference: String(it.reference || ''),
        description: String(it.description || ''),
        date: String(it.date || new Date().toLocaleDateString('pt-PT')),
        category: it.category === 'residuos' ? 'residuos' : 'ordenamento',
        tags: Array.isArray(it.tags) ? it.tags : [],
        fullText: it.fullText
      })) as LegislationItem[];
    } catch {
      return [];
    }
  };
  const baseLegislation = useMemo<LegislationItem[]>(() => {
    return [...legislationDatabase, ...getCustomLegislation()];
  }, []);

  const filteredAndSortedLegislation = useMemo(() => {
    let filtered = baseLegislation.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'reference':
          comparison = a.reference.localeCompare(b.reference);
          break;
        case 'date':
          // Extract year from date string for comparison
          const yearA = parseInt(a.date.match(/\d{4}/)?.[0] || '0');
          const yearB = parseInt(b.date.match(/\d{4}/)?.[0] || '0');
          comparison = yearA - yearB;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, categoryFilter, sortBy, sortOrder]);

  if (!isOpen) return null;

  const handleDownload = (item: LegislationItem, format: 'pdf' | 'word' = 'pdf') => {
    const content = `${item.title}\n${item.reference}\n${item.date}\n\n${item.description}\n\n${item.fullText || 'Conteúdo completo não disponível.'}`;

    let mimeType = 'text/plain;charset=utf-8';
    let extension = 'txt';

    if (format === 'pdf') {
      mimeType = 'application/pdf';
      extension = 'pdf';
    } else if (format === 'word') {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      extension = 'docx';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.reference.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert(`Download concluído: ${item.reference} - ${item.title} (${format.toUpperCase()})`);
  };

  const handleBulkDownload = (format: 'pdf' | 'word') => {
    const selectedItems = Array.from(selectedDocuments).map(id =>
      baseLegislation.find(item => item.id === id)
    ).filter(Boolean);

    if (selectedItems.length === 0) {
      alert('Selecione pelo menos um documento para baixar.');
      return;
    }

    selectedItems.forEach(item => {
      if (item) handleDownload(item, format);
    });

    setShowDownloadOptions(false);
  };

  const toggleDocumentSelection = (documentId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(documentId)) {
      newSelection.delete(documentId);
    } else {
      newSelection.add(documentId);
    }
    setSelectedDocuments(newSelection);
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.size === filteredAndSortedLegislation.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(filteredAndSortedLegislation.map(item => item.id)));
    }
  };

  const handleReadAloud = (item: LegislationItem) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${item.title}. ${item.description}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-PT';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Funcionalidade de leitura em voz alta não é suportada pelo seu navegador');
    }
  };

  const handleReadFullPage = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      if (viewMode === 'document' && selectedDocument) {
        const fullText = `${selectedDocument.title}. ${selectedDocument.description}. ${selectedDocument.fullText || 'Conteúdo completo não disponível.'}`;
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'pt-PT';
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        const allText = filteredAndSortedLegislation.map(item =>
          `${item.title}. ${item.description}.`
        ).join(' ');
        const utterance = new SpeechSynthesisUtterance(allText);
        utterance.lang = 'pt-PT';
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert('Funcionalidade de leitura em voz alta não é suportada pelo seu navegador');
    }
  };

  const handleAddNewFile = () => {
    if (!newFile.title || !newFile.reference || !newFile.description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Simular adição do novo ficheiro
    const newFileData = {
      id: Date.now().toString(),
      title: newFile.title,
      reference: newFile.reference,
      description: newFile.description,
      date: new Date().toLocaleDateString('pt-PT'),
      category: newFile.category,
      tags: newFile.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      fullText: 'Conteúdo do ficheiro carregado.'
    };

    // Em uma implementação real, você enviaria para o servidor
    console.log('Novo ficheiro adicionado:', newFileData);

    // Reset form
    setNewFile({
      title: '',
      reference: '',
      description: '',
      category: 'ordenamento',
      tags: '',
      file: null
    });

    setShowAddModal(false);
    alert('Ficheiro adicionado com sucesso!');
  };

  const handleViewDocument = (item: LegislationItem) => {
    setSelectedDocument(item);
    setViewMode('document');
  };

  const handleBackToList = () => {
    setSelectedDocument(null);
    setViewMode('list');
  };
  const exportResults = (format: 'pdf' | 'excel') => {
    alert(`Exportando ${filteredAndSortedLegislation.length} resultados em formato ${format.toUpperCase()}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <div>
            <div className="flex items-center space-x-3">
              {viewMode === 'document' && (
                <button
                  onClick={handleBackToList}
                  className="text-[#2c7873] hover:text-[#1f5a56] transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <h2 className="text-lg md:text-xl font-semibold">
                {viewMode === 'list' ? 'Base de Dados Legislativa' : selectedDocument?.title}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {viewMode === 'list' 
                ? `${filteredAndSortedLegislation.length} de ${baseLegislation.length} documentos`
                : selectedDocument?.reference
              }
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Document View */}
          {viewMode === 'document' && selectedDocument && (
            <div>
              <div className="bg-[#f0f7f4] p-4 md:p-6 rounded-lg border border-[#2c7873]/20 mb-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-[#2c7873] mb-2">{selectedDocument.title}</h3>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <FileText size={14} />
                        <span className="font-medium">{selectedDocument.reference}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{selectedDocument.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedDocument.description}</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <button
                      onClick={handleReadFullPage}
                      className={`px-3 py-2 ${isSpeaking ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors flex items-center justify-center space-x-2`}
                      title={isSpeaking ? 'Parar leitura' : 'Ler página inteira'}
                    >
                      <Volume2 size={16} />
                      <span className="hidden md:inline">{isSpeaking ? 'Parar' : 'Ler Tudo'}</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowDownloadOptions(showDownloadOptions === 'document' ? false : 'document')}
                        className="px-3 md:px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                      >
                        <Download size={16} />
                        <span className="hidden md:inline">Download</span>
                        <ChevronDown size={16} />
                      </button>
                      {showDownloadOptions === 'document' && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          <button
                            onClick={() => {
                              handleDownload(selectedDocument, 'pdf');
                              setShowDownloadOptions(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg transition-colors"
                          >
                            PDF
                          </button>
                          <button
                            onClick={() => {
                              handleDownload(selectedDocument, 'word');
                              setShowDownloadOptions(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg transition-colors"
                          >
                            Word
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-sm md:text-base">
                    {selectedDocument.fullText || 'Conteúdo completo não disponível para este documento.'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          {viewMode === 'list' && (
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por título, referência, descrição ou tags..."
                  className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base"
                />
              </div>

              {/* Mobile filter toggle */}
              {isMobile && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg w-full justify-center"
                >
                  <Filter size={18} className="text-gray-500" />
                  <span>Filtros e Opções</span>
                  {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}

              <div className={`${isMobile ? (showFilters ? 'block' : 'hidden') : 'flex'} flex-wrap gap-4 items-center`}>
                <div className="flex items-center space-x-2">
                  <Filter size={18} className="text-gray-500 hidden md:block" />
                  <select
                    title='Filtrar por categoria'
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base w-full md:w-auto"
                  >
                    <option value="all">Todas as categorias</option>
                    <option value="ordenamento">Ordenamento do Território</option>
                    <option value="residuos">Resíduos Sólidos</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden md:inline">Ordenar por:</span>
                  <select
                    title='Ordenar por'
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base w-full md:w-auto"
                  >
                    <option value="date">Data</option>
                    <option value="title">Título</option>
                    <option value="reference">Referência</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 ml-auto w-full md:w-auto">
                  {isAdmin && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-3 md:px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                    >
                      <FileText size={16} />
                      <span>Adicionar Ficheiro</span>
                    </button>
                  )}
                  <button
                    onClick={handleReadFullPage}
                    className={`px-3 md:px-4 py-2 ${isSpeaking ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors flex items-center justify-center space-x-2 w-full md:w-auto`}
                    title={isSpeaking ? 'Parar leitura' : 'Ler página inteira'}
                  >
                    <Volume2 size={16} />
                    <span className="hidden md:inline">{isSpeaking ? 'Parar' : 'Ler Tudo'}</span>
                  </button>
                  {selectedDocuments.size > 0 && (
                    <div className="relative w-full md:w-auto">
                      <button
                        onClick={() => setShowDownloadOptions(showDownloadOptions === 'bulk' ? false : 'bulk')}
                        className="px-3 md:px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                      >
                        <Download size={16} />
                        <span>Baixar ({selectedDocuments.size})</span>
                        <ChevronDown size={16} />
                      </button>
                      {showDownloadOptions === 'bulk' && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                          <button
                            onClick={() => handleBulkDownload('pdf')}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg transition-colors text-sm"
                          >
                            PDF ({selectedDocuments.size})
                          </button>
                          <button
                            onClick={() => handleBulkDownload('word')}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg transition-colors text-sm"
                          >
                            Word ({selectedDocuments.size})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => exportResults('pdf')}
                    className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                  >
                    <Download size={16} />
                    <span className="hidden md:inline">Exportar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredAndSortedLegislation.length > 0 && (
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                  <button
                    onClick={selectAllDocuments}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-[#2c7873] transition-colors"
                  >
                    {selectedDocuments.size === filteredAndSortedLegislation.length ? (
                      <CheckSquare size={16} className="text-[#2c7873]" />
                    ) : (
                      <Square size={16} />
                    )}
                    <span className="text-xs md:text-sm">
                      {selectedDocuments.size === 0 ? 'Selecionar Todos' :
                       selectedDocuments.size === filteredAndSortedLegislation.length ? 'Desmarcar Todos' :
                       `${selectedDocuments.size} de ${filteredAndSortedLegislation.length} selecionados`}
                    </span>
                  </button>
                  {selectedDocuments.size > 0 && (
                    <span className="text-xs md:text-sm text-gray-600">
                      {selectedDocuments.size} documento{selectedDocuments.size > 1 ? 's' : ''} selecionado{selectedDocuments.size > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
              {filteredAndSortedLegislation.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 md:p-6 transition-colors ${
                    selectedDocuments.has(item.id)
                      ? 'border-[#2c7873] bg-[#f0f7f4]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleDocumentSelection(item.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {selectedDocuments.has(item.id) ? (
                          <CheckSquare size={20} className="text-[#2c7873]" />
                        ) : (
                          <Square size={20} className="text-gray-400 hover:text-[#2c7873] transition-colors" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <button
                            onClick={() => handleViewDocument(item)}
                            className="font-semibold text-gray-900 text-base md:text-lg hover:text-[#2c7873] transition-colors text-left"
                          >
                            {item.title}
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.category === 'ordenamento' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          } self-start`}>
                            {item.category === 'ordenamento' ? 'Ordenamento' : 'Resíduos'}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <FileText size={14} />
                            <span className="font-medium">{item.reference}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => handleViewDocument(item)}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                        title="Visualizar documento"
                      >
                        <Eye size={16} />
                        <span className="hidden md:inline">Ver</span>
                      </button>
                      <button
                        onClick={() => handleReadAloud(item)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                        title="Ler em voz alta"
                      >
                        <Volume2 size={16} />
                        <span className="hidden md:inline">Ler</span>
                      </button>
                      <div className="relative w-full md:w-auto">
                        <button
                          onClick={() => setShowDownloadOptions(showDownloadOptions === item.id ? false : item.id)}
                          className="px-3 md:px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                        >
                          <Download size={16} />
                          <span className="hidden md:inline">Download</span>
                        </button>
                        {showDownloadOptions === item.id && (
                          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
                            <button
                              onClick={() => {
                                handleDownload(item, 'pdf');
                                setShowDownloadOptions(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg transition-colors text-sm"
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => {
                                handleDownload(item, 'word');
                                setShowDownloadOptions(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg transition-colors text-sm"
                            >
                              Word
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed text-sm md:text-base">{item.description}</p>
                  
                  <div className="flex items-center space-x-2">
                    <Tag size={14} className="text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && filteredAndSortedLegislation.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento encontrado</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `Não foram encontrados documentos para "${searchTerm}"`
                  : 'Ajuste os filtros para ver os documentos disponíveis'
                }
              </p>
            </div>
          )}
        </div>

        {viewMode === 'list' && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 border-t bg-gray-50 gap-3">
            <div className="text-sm text-gray-600">
              Mostrando {filteredAndSortedLegislation.length} de {baseLegislation.length} documentos
            </div>
            <button
              onClick={onClose}
              className="px-4 md:px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto"
            >
              Fechar
            </button>
          </div>
        )}
        
        {viewMode === 'document' && (
          <div className="flex justify-end p-4 md:p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 md:px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Add New File Modal (Admin Only) */}
        {showAddModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 md:p-6 border-b">
                <h3 className="text-lg md:text-xl font-semibold">Adicionar Novo Ficheiro</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Documento *
                  </label>
                  <input
                    type="text"
                    value={newFile.title}
                    onChange={(e) => setNewFile({...newFile, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base"
                    placeholder="Ex: Lei de Bases do Ordenamento do Território"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referência Legal *
                  </label>
                  <input
                    type="text"
                    value={newFile.reference}
                    onChange={(e) => setNewFile({...newFile, reference: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base"
                    placeholder="Ex: Lei nº 44/VIII/2018"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    title='Selecionar categoria'
                    value={newFile.category}
                    onChange={(e) => setNewFile({...newFile, category: e.target.value as 'ordenamento' | 'residuos'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base"
                  >
                    <option value="ordenamento">Ordenamento do Território</option>
                    <option value="residuos">Resíduos Sólidos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={newFile.description}
                    onChange={(e) => setNewFile({...newFile, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base"
                    placeholder="Descreva o conteúdo e propósito do documento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={newFile.tags}
                    onChange={(e) => setNewFile({...newFile, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base"
                    placeholder="Ex: gestão territorial, urbanismo, planeamento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivo (PDF, DOC, DOCX)
                  </label>
                  <input
                    title='Carregar arquivo'
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setNewFile({...newFile, file: e.target.files?.[0] || null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c7873] focus:border-[#2c7873] text-sm md:text-base"
                  />
                  {newFile.file && (
                    <p className="text-sm text-gray-600 mt-1">
                      Arquivo selecionado: {newFile.file.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-4 md:p-6 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddNewFile}
                  className="px-4 py-2 bg-[#2c7873] text-white rounded-lg hover:bg-[#1f5a56] transition-colors text-sm md:text-base"
                >
                  Adicionar Ficheiro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegislationModal;