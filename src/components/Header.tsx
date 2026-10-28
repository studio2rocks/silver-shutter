import React from 'react';
import { Camera, Plus, FileSpreadsheet, Film, Grid, Sun, Printer, Download, Upload, Briefcase } from 'lucide-react';

export type NotepadStyle = 'ruled' | 'grid' | 'dark';

interface HeaderProps {
  currentView: 'rolls' | 'grid' | 'table' | 'gear';
  setCurrentView: (view: 'rolls' | 'grid' | 'table' | 'gear') => void;
  onOpenQuickLog: () => void;
  onOpenSunny16: () => void;
  onOpenPrintSheet: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  notepadStyle: NotepadStyle;
  setNotepadStyle: (style: NotepadStyle) => void;
  totalPhotosCount: number;
  totalRollsCount: number;
  totalCamerasCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenQuickLog,
  onOpenSunny16,
  onOpenPrintSheet,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  notepadStyle,
  setNotepadStyle,
  totalCamerasCount
}) => {
  const isDark = notepadStyle === 'dark';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
      isDark 
        ? 'bg-neutral-950/90 border-neutral-800 text-neutral-100' 
        : 'bg-[#faf6e9]/95 border-amber-900/15 text-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
    }`}>
      {/* Top Perforation / Binder Strip Styling */}
      <div className={`h-1.5 w-full ${
        isDark 
          ? 'bg-amber-600/40' 
          : 'bg-gradient-to-r from-amber-700/60 via-amber-800/80 to-amber-700/60'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${
              isDark 
                ? 'bg-neutral-900 border-neutral-700 text-amber-400' 
                : 'bg-amber-100/80 border-amber-300 text-amber-900 shadow-xs'
            }`}>
              <Camera className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tracking-tight whitespace-nowrap">
                Silver &amp; Shutter
              </span>
              <span className={`text-xs font-mono hidden sm:inline ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Field Log
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean single line typography) */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={() => setCurrentView('rolls')}
              className={`flex items-center gap-1.5 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'rolls'
                  ? isDark ? 'border-amber-400 text-neutral-100 font-semibold' : 'border-neutral-900 text-neutral-900 font-semibold'
                  : isDark ? 'border-transparent text-neutral-400 hover:text-neutral-200' : 'border-transparent text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Rolls &amp; Sessions</span>
            </button>

            <button
              onClick={() => setCurrentView('grid')}
              className={`flex items-center gap-1.5 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'grid'
                  ? isDark ? 'border-amber-400 text-neutral-100 font-semibold' : 'border-neutral-900 text-neutral-900 font-semibold'
                  : isDark ? 'border-transparent text-neutral-400 hover:text-neutral-200' : 'border-transparent text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Contact Sheet</span>
            </button>

            <button
              onClick={() => setCurrentView('table')}
              className={`flex items-center gap-1.5 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'table'
                  ? isDark ? 'border-amber-400 text-neutral-100 font-semibold' : 'border-neutral-900 text-neutral-900 font-semibold'
                  : isDark ? 'border-transparent text-neutral-400 hover:text-neutral-200' : 'border-transparent text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Log Sheet Table</span>
            </button>

            <button
              onClick={() => setCurrentView('gear')}
              className={`flex items-center gap-1.5 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'gear'
                  ? isDark ? 'border-amber-400 text-neutral-100 font-semibold' : 'border-neutral-900 text-neutral-900 font-semibold'
                  : isDark ? 'border-transparent text-neutral-400 hover:text-neutral-200' : 'border-transparent text-neutral-600 hover:text-neutral-950'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Gear Bag</span>
            </button>

            <button
              onClick={onOpenSunny16}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 text-xs py-1 px-2.5 rounded border cursor-pointer ${
                isDark 
                  ? 'border-neutral-800 text-neutral-300 hover:text-amber-300 bg-neutral-900/50' 
                  : 'border-amber-900/20 text-neutral-700 hover:text-neutral-900 bg-white/70 shadow-xs'
              }`}
              title="Sunny 16 Exposure Guide"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Sunny 16</span>
            </button>

            <button
              onClick={onOpenPrintSheet}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 text-xs py-1 px-2.5 rounded border cursor-pointer ${
                isDark 
                  ? 'border-neutral-800 text-neutral-300 hover:text-neutral-100 bg-neutral-900/50' 
                  : 'border-amber-900/20 text-neutral-700 hover:text-neutral-900 bg-white/70 shadow-xs'
              }`}
              title="Printable Binder Sleeve Log"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Notepad Paper Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notepad Style Switcher */}
            <div className={`hidden lg:flex items-center p-0.5 rounded border text-xs ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-400' 
                : 'bg-amber-100/70 border-amber-300/60 text-neutral-600'
            }`}>
              <button
                onClick={() => setNotepadStyle('ruled')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-mono text-[11px] ${
                  notepadStyle === 'ruled'
                    ? isDark ? 'bg-neutral-800 text-white font-medium' : 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'hover:text-neutral-900'
                }`}
                title="Lined / Ruled Notepad Paper"
              >
                Ruled
              </button>
              <button
                onClick={() => setNotepadStyle('grid')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-mono text-[11px] ${
                  notepadStyle === 'grid'
                    ? isDark ? 'bg-neutral-800 text-white font-medium' : 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'hover:text-neutral-900'
                }`}
                title="Grid Notebook Paper"
              >
                Grid
              </button>
              <button
                onClick={() => setNotepadStyle('dark')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-mono text-[11px] ${
                  notepadStyle === 'dark'
                    ? 'bg-neutral-800 text-amber-300 font-semibold'
                    : 'hover:text-neutral-900'
                }`}
                title="Darkroom Journal Paper"
              >
                Dark
              </button>
            </div>

            {/* Quick CSV / JSON export */}
            <div className={`hidden xl:flex items-center gap-1 border-r pr-3 ${
              isDark ? 'border-neutral-800' : 'border-amber-900/15'
            }`}>
              <button
                onClick={onExportCSV}
                className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                  isDark ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900' : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                }`}
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={onExportJSON}
                className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer font-mono ${
                  isDark ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900' : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                }`}
                title="Backup JSON"
              >
                <span>JSON</span>
              </button>
              <button
                onClick={onImportJSON}
                className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer ${
                  isDark ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900' : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                }`}
                title="Restore from JSON"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onOpenQuickLog}
              className={`flex items-center gap-2 px-4 py-2 font-semibold text-xs tracking-wide rounded transition-all shadow-sm whitespace-nowrap cursor-pointer active:scale-95 ${
                isDark 
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' 
                  : 'bg-neutral-900 hover:bg-neutral-800 text-amber-50 hover:shadow-md'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log Frame</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className={`flex md:hidden items-center justify-between py-2 border-t text-xs font-medium ${
          isDark ? 'border-neutral-800/80 text-neutral-400' : 'border-amber-900/15 text-neutral-600'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('rolls')}
              className={`${currentView === 'rolls' ? 'font-bold text-neutral-900 dark:text-amber-400' : ''}`}
            >
              Rolls
            </button>
            <button
              onClick={() => setCurrentView('grid')}
              className={`${currentView === 'grid' ? 'font-bold text-neutral-900 dark:text-amber-400' : ''}`}
            >
              Contact
            </button>
            <button
              onClick={() => setCurrentView('table')}
              className={`${currentView === 'table' ? 'font-bold text-neutral-900 dark:text-amber-400' : ''}`}
            >
              Table
            </button>
            <button
              onClick={() => setCurrentView('gear')}
              className={`${currentView === 'gear' ? 'font-bold text-neutral-900 dark:text-amber-400' : ''}`}
            >
              Gear
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onOpenSunny16} className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Sun className="w-3 h-3" />
              <span>Sunny 16</span>
            </button>
            <button onClick={onExportCSV}>CSV</button>
          </div>
        </div>
      </div>
    </header>
  );
};
