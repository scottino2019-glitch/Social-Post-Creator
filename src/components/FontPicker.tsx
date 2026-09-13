import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Upload,
  Sparkles,
  Check,
  X,
  Trash2,
  PlusCircle,
  FolderOpen,
  Info,
} from 'lucide-react';
import { FontDefinition, FONT_LIST } from '../data/fonts';
import {
  loadCustomFontFromFile,
  loadGoogleFontDynamically,
  removeCustomFontFromStorage,
} from '../utils/fontManager';

interface FontPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: string;
  onSelectFont: (fontFamily: string) => void;
  customFonts: FontDefinition[];
  onAddCustomFont: (font: FontDefinition) => void;
  onRemoveCustomFont: (family: string) => void;
  sampleText?: string;
}

export const FontPicker: React.FC<FontPickerProps> = ({
  isOpen,
  onClose,
  currentFont,
  onSelectFont,
  customFonts,
  onAddCustomFont,
  onRemoveCustomFont,
  sampleText = 'Creatività & Stile ✨ 123',
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [customGoogleInput, setCustomGoogleInput] = useState('');
  const [isAddingGoogle, setIsAddingGoogle] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine default fonts + custom fonts
  const allFonts = useMemo(() => {
    // Custom fonts first so they are easily accessible
    return [...customFonts, ...FONT_LIST];
  }, [customFonts]);

  // Filtered fonts
  const filteredFonts = useMemo(() => {
    return allFonts.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.family.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (category === 'all') return true;
      if (category === 'custom') return f.isCustom;
      return f.category === category;
    });
  }, [allFonts, search, category]);

  // Handle local font upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt) {
      setUploadError('Seleziona un file font valido (.ttf, .otf, .woff, .woff2)');
      return;
    }

    try {
      const newFont = await loadCustomFontFromFile(file);
      if (newFont) {
        onAddCustomFont(newFont);
        onSelectFont(newFont.family);
        setCategory('custom');
      } else {
        setUploadError('Impossibile caricare il font. Verifica che il file non sia protetto.');
      }
    } catch {
      setUploadError('Errore durante la lettura del file font.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Google Font import
  const handleAddGoogleFont = async (e: React.FormEvent) => {
    e.preventDefault();
    const familyName = customGoogleInput.trim();
    if (!familyName) return;

    setIsAddingGoogle(true);
    setUploadError(null);

    try {
      const ok = await loadGoogleFontDynamically(familyName);
      if (ok) {
        const newFont: FontDefinition = {
          family: familyName,
          name: familyName,
          category: 'display',
          description: 'Google Font aggiunto da te',
          isCustom: true,
        };
        onAddCustomFont(newFont);
        onSelectFont(familyName);
        setCustomGoogleInput('');
        setCategory('custom');
      } else {
        setUploadError(`Font "${familyName}" non trovato su Google Fonts.`);
      }
    } catch {
      setUploadError('Errore durante il caricamento del Google Font.');
    } finally {
      setIsAddingGoogle(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Caratteri & Font Personali
                {customFonts.length > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {customFonts.length} Personali
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                Scegli tra i font curati oppure carica i tuoi font personali (.ttf, .otf, .woff)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload & Add Bar */}
        <div className="p-3.5 bg-slate-800/40 border-b border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Upload File button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileUpload}
                className="hidden"
                id="font-file-upload-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Carica Font dal Computer (.ttf, .otf)</span>
              </button>
            </div>

            {/* Add Google Font input */}
            <form onSubmit={handleAddGoogleFont} className="flex space-x-1.5">
              <input
                type="text"
                placeholder="Es. Lora, Anton, Lobster..."
                value={customGoogleInput}
                onChange={(e) => setCustomGoogleInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isAddingGoogle || !customGoogleInput.trim()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors shrink-0 flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Aggiungi</span>
              </button>
            </form>
          </div>

          {uploadError && (
            <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Search and Categories */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between pt-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca font per nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'Tutti' },
                { id: 'custom', label: `⭐ Personali (${customFonts.length})` },
                { id: 'handwriting', label: '✍️ Corsivi' },
                { id: 'serif', label: '👑 Serif' },
                { id: 'display', label: '⚡ Display' },
                { id: 'sans', label: '💼 Sans' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    category === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Font List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredFonts.length === 0 ? (
            <div className="text-center py-10">
              <FolderOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Nessun font trovato in questa categoria.</p>
              {category === 'custom' && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Usa il pulsante in alto per caricare un file font dal tuo computer (.ttf o .otf).
                </p>
              )}
            </div>
          ) : (
            filteredFonts.map((font) => {
              const isSelected = currentFont.toLowerCase() === font.family.toLowerCase();
              return (
                <div
                  key={font.family}
                  onClick={() => {
                    onSelectFont(font.family);
                    onClose();
                  }}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/70 hover:border-slate-600'
                  }`}
                >
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {font.name}
                      </span>
                      {font.isCustom && (
                        <span className="text-[9px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                          Personale
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400 bg-slate-700/60 px-1.5 py-0.2 rounded capitalize">
                        {font.category}
                      </span>
                    </div>

                    {/* Live Font Sample rendering */}
                    <div
                      className="text-lg text-slate-100 mt-1 truncate"
                      style={{ fontFamily: font.family }}
                    >
                      {sampleText || 'Anteprima testo con questo stile'}
                    </div>

                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {font.description}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {font.isCustom && (
                      <button
                        type="button"
                        title="Rimuovi font personale"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomFontFromStorage(font.family);
                          onRemoveCustomFont(font.family);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-700/60 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700/40 group-hover:bg-indigo-600/30 text-transparent group-hover:text-indigo-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{allFonts.length} font tipografici disponibili</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
