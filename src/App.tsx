/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header, NotepadStyle } from './components/Header';
import { QuickLogModal } from './components/QuickLogModal';
import { RollModal } from './components/RollModal';
import { LogTableView } from './components/LogTableView';
import { RollCardView } from './components/RollCardView';
import { FrameGridView } from './components/FrameGridView';
import { GearView } from './components/GearView';
import { Sunny16Modal } from './components/Sunny16Modal';
import { PrintableSheetModal } from './components/PrintableSheetModal';
import { PhotoEntry, RollSession, CameraGear, LensGear } from './types';
import { INITIAL_PHOTOS, INITIAL_ROLLS, INITIAL_CAMERAS, INITIAL_LENSES } from './data/initialData';
import { exportToCSV, exportToJSON } from './utils/helpers';
import { Plus, Camera, Film, Layers, BookOpen, RotateCcw, Briefcase } from 'lucide-react';

const STORAGE_KEY_PHOTOS = 'silver_shutter_photos_v1';
const STORAGE_KEY_ROLLS = 'silver_shutter_rolls_v1';
const STORAGE_KEY_CAMERAS = 'silver_shutter_cameras_v1';
const STORAGE_KEY_LENSES = 'silver_shutter_lenses_v1';
const STORAGE_KEY_NOTEPAD_STYLE = 'silver_shutter_notepad_style_v1';

export default function App() {
  const [photos, setPhotos] = useState<PhotoEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
    } catch {
      return INITIAL_PHOTOS;
    }
  });

  const [rolls, setRolls] = useState<RollSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLLS);
      return saved ? JSON.parse(saved) : INITIAL_ROLLS;
    } catch {
      return INITIAL_ROLLS;
    }
  });

  const [cameras, setCameras] = useState<CameraGear[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMERAS);
      return saved ? JSON.parse(saved) : INITIAL_CAMERAS;
    } catch {
      return INITIAL_CAMERAS;
    }
  });

  const [lenses, setLenses] = useState<LensGear[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LENSES);
      return saved ? JSON.parse(saved) : INITIAL_LENSES;
    } catch {
      return INITIAL_LENSES;
    }
  });

  const [notepadStyle, setNotepadStyle] = useState<NotepadStyle>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTEPAD_STYLE) as NotepadStyle;
      return saved || 'ruled';
    } catch {
      return 'ruled';
    }
  });

  const [currentView, setCurrentView] = useState<'rolls' | 'grid' | 'table' | 'gear'>('rolls');
  
  // Modals state
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isRollModalOpen, setIsRollModalOpen] = useState(false);
  const [isSunny16Open, setIsSunny16Open] = useState(false);
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);

  const [editingPhoto, setEditingPhoto] = useState<PhotoEntry | null>(null);
  const [editingRoll, setEditingRoll] = useState<RollSession | null>(null);
  const [quickLogRollId, setQuickLogRollId] = useState<string | undefined>(undefined);

  // Hidden JSON import file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
    } catch (e) {
      console.error('Failed to save photos to localStorage:', e);
    }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROLLS, JSON.stringify(rolls));
    } catch (e) {
      console.error('Failed to save rolls to localStorage:', e);
    }
  }, [rolls]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CAMERAS, JSON.stringify(cameras));
    } catch (e) {
      console.error('Failed to save cameras to localStorage:', e);
    }
  }, [cameras]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LENSES, JSON.stringify(lenses));
    } catch (e) {
      console.error('Failed to save lenses to localStorage:', e);
    }
  }, [lenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTEPAD_STYLE, notepadStyle);
    } catch (e) {
      console.error('Failed to save notepad style:', e);
    }
  }, [notepadStyle]);

  // Photo handlers
  const handleSavePhoto = (entry: Omit<PhotoEntry, 'id'>) => {
    if (editingPhoto) {
      setPhotos(prev => prev.map(p => p.id === editingPhoto.id ? { ...entry, id: editingPhoto.id } : p));
      setEditingPhoto(null);
    } else {
      const newPhoto: PhotoEntry = {
        ...entry,
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      };
      setPhotos(prev => [newPhoto, ...prev]);
    }
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  // Roll handlers
  const handleSaveRoll = (roll: RollSession) => {
    if (editingRoll) {
      setRolls(prev => prev.map(r => r.id === roll.id ? roll : r));
      setEditingRoll(null);
    } else {
      setRolls(prev => [roll, ...prev]);
    }
  };

  // Gear handlers
  const handleSaveCamera = (camera: CameraGear) => {
    setCameras(prev => {
      const exists = prev.some(c => c.id === camera.id);
      return exists ? prev.map(c => c.id === camera.id ? camera : c) : [camera, ...prev];
    });
  };

  const handleDeleteCamera = (id: string) => {
    setCameras(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveLens = (lens: LensGear) => {
    setLenses(prev => {
      const exists = prev.some(l => l.id === lens.id);
      return exists ? prev.map(l => l.id === lens.id ? lens : l) : [lens, ...prev];
    });
  };

  const handleDeleteLens = (id: string) => {
    setLenses(prev => prev.filter(l => l.id !== id));
  };

  const handleQuickLogWithGear = (cameraName: string, lensName?: string) => {
    setEditingPhoto(null);
    // Find active roll that uses this camera, or fallback
    const matchedRoll = rolls.find(r => r.camera.toLowerCase() === cameraName.toLowerCase() && r.status === 'in_camera');
    setQuickLogRollId(matchedRoll?.id);
    setIsQuickLogOpen(true);
  };

  // Action helpers
  const handleOpenQuickLogForRoll = (rollId: string) => {
    setEditingPhoto(null);
    setQuickLogRollId(rollId);
    setIsQuickLogOpen(true);
  };

  const handleEditPhoto = (photo: PhotoEntry) => {
    setEditingPhoto(photo);
    setQuickLogRollId(photo.rollId);
    setIsQuickLogOpen(true);
  };

  const handleEditRoll = (roll: RollSession) => {
    setEditingRoll(roll);
    setIsRollModalOpen(true);
  };

  // Sunny 16 settings handler
  const handleApplySunny16 = (shutter: string, aperture: string, iso: number) => {
    setEditingPhoto(null);
    setIsQuickLogOpen(true);
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed.photos && Array.isArray(parsed.photos)) {
            setPhotos(parsed.photos);
          }
          if (parsed.rolls && Array.isArray(parsed.rolls)) {
            setRolls(parsed.rolls);
          }
          if (parsed.cameras && Array.isArray(parsed.cameras)) {
            setCameras(parsed.cameras);
          }
          if (parsed.lenses && Array.isArray(parsed.lenses)) {
            setLenses(parsed.lenses);
          }
        } catch {
          alert('Could not parse JSON backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetToSample = () => {
    if (confirm('Reset to initial photographer sample rolls, gear, and frames?')) {
      setPhotos(INITIAL_PHOTOS);
      setRolls(INITIAL_ROLLS);
      setCameras(INITIAL_CAMERAS);
      setLenses(INITIAL_LENSES);
    }
  };

  const isDark = notepadStyle === 'dark';

  // Determine notepad paper CSS class
  const notepadBgClass = 
    notepadStyle === 'grid' 
      ? 'notepad-grid-bg' 
      : notepadStyle === 'dark' 
        ? 'notepad-dark-bg' 
        : 'notepad-paper-bg';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${notepadBgClass}`}>
      {/* Top Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenQuickLog={() => {
          setEditingPhoto(null);
          setIsQuickLogOpen(true);
        }}
        onOpenSunny16={() => setIsSunny16Open(true)}
        onOpenPrintSheet={() => setIsPrintSheetOpen(true)}
        onExportCSV={() => exportToCSV(photos, rolls)}
        onExportJSON={() => exportToJSON(photos, rolls, cameras, lenses)}
        onImportJSON={() => fileInputRef.current?.click()}
        notepadStyle={notepadStyle}
        setNotepadStyle={setNotepadStyle}
        totalPhotosCount={photos.length}
        totalRollsCount={rolls.length}
        totalCamerasCount={cameras.length}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJSON}
        className="hidden"
      />

      {/* Main Field Notepad Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Notepad Page Header Bar with Spiral Bindings / Perforations */}
        <div className={`mb-6 p-5 rounded-xl border relative overflow-hidden transition-all shadow-xs ${
          isDark 
            ? 'bg-neutral-900/90 border-neutral-800 text-neutral-100' 
            : 'bg-[#faf6eb]/95 border-amber-900/20 text-neutral-900'
        }`}>
          {/* Notebook Spiral Accent Marks on Left */}
          <div className="absolute left-2 top-0 bottom-0 w-2 flex flex-col justify-around py-2 opacity-30 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            ))}
          </div>

          <div className="pl-4 sm:pl-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                <span>Field Exposure Journal</span>
                <span>·</span>
                <span>Analog &amp; Manual Cameras</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Camera &amp; Exposure Logbook
              </h1>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Manual frame-by-frame tracker for film stock, shutter speeds, f-stops, ISO push/pull, and darkroom notes.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono">
              <div className="text-right">
                <span className="block text-[10px] text-neutral-500">EXPOSURES</span>
                <span className="font-bold text-base text-neutral-900 dark:text-amber-400">
                  {photos.length}
                </span>
              </div>
              <div className="w-px h-8 bg-neutral-300 dark:bg-neutral-800" />
              <div className="text-right">
                <span className="block text-[10px] text-neutral-500">ACTIVE ROLLS</span>
                <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {rolls.length}
                </span>
              </div>
              <div className="w-px h-8 bg-neutral-300 dark:bg-neutral-800" />
              <div className="text-right">
                <span className="block text-[10px] text-neutral-500">GEAR BAG</span>
                <span className="font-bold text-base text-neutral-900 dark:text-amber-400">
                  {cameras.length}
                </span>
              </div>
              <div className="w-px h-8 bg-neutral-300 dark:bg-neutral-800" />
              <button
                onClick={() => {
                  setEditingPhoto(null);
                  setIsQuickLogOpen(true);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 ${
                  isDark 
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' 
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Log Frame</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {currentView === 'rolls' && (
          <RollCardView
            rolls={rolls}
            photos={photos}
            onOpenNewRoll={() => {
              setEditingRoll(null);
              setIsRollModalOpen(true);
            }}
            onEditRoll={handleEditRoll}
            onLogFrameForRoll={handleOpenQuickLogForRoll}
            onSelectPhoto={handleEditPhoto}
            isDark={isDark}
          />
        )}

        {currentView === 'grid' && (
          <FrameGridView
            photos={photos}
            rolls={rolls}
            onEditPhoto={handleEditPhoto}
            onDeletePhoto={handleDeletePhoto}
            isDark={isDark}
          />
        )}

        {currentView === 'table' && (
          <LogTableView
            photos={photos}
            rolls={rolls}
            onEditPhoto={handleEditPhoto}
            onDeletePhoto={handleDeletePhoto}
            onExportCSV={() => exportToCSV(photos, rolls)}
            isDark={isDark}
          />
        )}

        {currentView === 'gear' && (
          <GearView
            cameras={cameras}
            lenses={lenses}
            photos={photos}
            rolls={rolls}
            onSaveCamera={handleSaveCamera}
            onDeleteCamera={handleDeleteCamera}
            onSaveLens={handleSaveLens}
            onDeleteLens={handleDeleteLens}
            onQuickLogWithGear={handleQuickLogWithGear}
            isDark={isDark}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-auto py-5 border-t text-xs transition-colors ${
        isDark ? 'border-neutral-800/80 text-neutral-500 bg-neutral-950/70' : 'border-amber-900/10 text-neutral-500 bg-[#f8f4e6]/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Silver &amp; Shutter Field Notepad</span>
            <span>·</span>
            <span>All entries stored locally in browser</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetToSample}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
              title="Reset data to sample entries"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Samples</span>
            </button>
            <span>·</span>
            <button
              onClick={() => exportToCSV(photos, rolls)}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer"
            >
              Download CSV
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => {
          setIsQuickLogOpen(false);
          setEditingPhoto(null);
        }}
        onSave={handleSavePhoto}
        rolls={rolls}
        photos={photos}
        cameras={cameras}
        lenses={lenses}
        onOpenGearTab={() => setCurrentView('gear')}
        editingPhoto={editingPhoto}
        initialRollId={quickLogRollId}
        isDark={isDark}
      />

      <RollModal
        isOpen={isRollModalOpen}
        onClose={() => {
          setIsRollModalOpen(false);
          setEditingRoll(null);
        }}
        onSave={handleSaveRoll}
        cameras={cameras}
        editingRoll={editingRoll}
        isDark={isDark}
      />

      <Sunny16Modal
        isOpen={isSunny16Open}
        onClose={() => setIsSunny16Open(false)}
        onApplySettings={handleApplySunny16}
        isDark={isDark}
      />

      <PrintableSheetModal
        isOpen={isPrintSheetOpen}
        onClose={() => setIsPrintSheetOpen(false)}
        rolls={rolls}
        photos={photos}
        isDark={isDark}
      />
    </div>
  );
}
