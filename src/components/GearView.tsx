import React, { useState } from 'react';
import { Camera, Plus, Edit3, Trash2, Star, Sparkles, Sliders, Check, X, Shield, Info, ArrowRight } from 'lucide-react';
import { CameraGear, LensGear, COMMON_CAMERA_TYPES, COMMON_MOUNTS, PhotoEntry, RollSession } from '../types';

interface GearViewProps {
  cameras: CameraGear[];
  lenses: LensGear[];
  photos: PhotoEntry[];
  rolls: RollSession[];
  onSaveCamera: (camera: CameraGear) => void;
  onDeleteCamera: (id: string) => void;
  onSaveLens: (lens: LensGear) => void;
  onDeleteLens: (id: string) => void;
  onQuickLogWithGear: (cameraName: string, lensName?: string) => void;
  isDark?: boolean;
}

export const GearView: React.FC<GearViewProps> = ({
  cameras,
  lenses,
  photos,
  rolls,
  onSaveCamera,
  onDeleteCamera,
  onSaveLens,
  onDeleteLens,
  onQuickLogWithGear,
  isDark = false
}) => {
  const [activeGearTab, setActiveGearTab] = useState<'cameras' | 'lenses'>('cameras');
  
  // Camera Modal state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<CameraGear | null>(null);

  // Lens Modal state
  const [isLensModalOpen, setIsLensModalOpen] = useState(false);
  const [editingLens, setEditingLens] = useState<LensGear | null>(null);

  // Camera form state
  const [camName, setCamName] = useState('');
  const [camType, setCamType] = useState<CameraGear['type']>('35mm Rangefinder');
  const [camMount, setCamMount] = useState('Leica M');
  const [camDefaultLens, setCamDefaultLens] = useState('');
  const [camSerial, setCamSerial] = useState('');
  const [camYear, setCamYear] = useState('');
  const [camNotes, setCamNotes] = useState('');
  const [camFavorite, setCamFavorite] = useState(false);

  // Lens form state
  const [lensName, setLensName] = useState('');
  const [lensMount, setLensMount] = useState('Leica M');
  const [lensFocal, setLensFocal] = useState('50mm');
  const [lensAperture, setLensAperture] = useState('f/2.0');
  const [lensFilter, setLensFilter] = useState('');
  const [lensNotes, setLensNotes] = useState('');
  const [lensFavorite, setLensFavorite] = useState(false);

  // Open Add Camera
  const handleOpenAddCamera = () => {
    setEditingCamera(null);
    setCamName('');
    setCamType('35mm Rangefinder');
    setCamMount('Leica M');
    setCamDefaultLens(lenses[0]?.name || '');
    setCamSerial('');
    setCamYear('');
    setCamNotes('');
    setCamFavorite(false);
    setIsCameraModalOpen(true);
  };

  // Open Edit Camera
  const handleOpenEditCamera = (cam: CameraGear) => {
    setEditingCamera(cam);
    setCamName(cam.name);
    setCamType(cam.type);
    setCamMount(cam.mount);
    setCamDefaultLens(cam.defaultLens || '');
    setCamSerial(cam.serialNumber || '');
    setCamYear(cam.year || '');
    setCamNotes(cam.notes || '');
    setCamFavorite(!!cam.isFavorite);
    setIsCameraModalOpen(true);
  };

  const handleSaveCameraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!camName.trim()) return;

    const cameraToSave: CameraGear = {
      id: editingCamera ? editingCamera.id : `cam-${Date.now()}`,
      name: camName.trim(),
      type: camType,
      mount: camMount,
      defaultLens: camDefaultLens.trim() || undefined,
      serialNumber: camSerial.trim() || undefined,
      year: camYear.trim() || undefined,
      notes: camNotes.trim() || undefined,
      isFavorite: camFavorite
    };

    onSaveCamera(cameraToSave);
    setIsCameraModalOpen(false);
  };

  // Open Add Lens
  const handleOpenAddLens = () => {
    setEditingLens(null);
    setLensName('');
    setLensMount(cameras[0]?.mount || 'Leica M');
    setLensFocal('50mm');
    setLensAperture('f/2.0');
    setLensFilter('');
    setLensNotes('');
    setLensFavorite(false);
    setIsLensModalOpen(true);
  };

  // Open Edit Lens
  const handleOpenEditLens = (lens: LensGear) => {
    setEditingLens(lens);
    setLensName(lens.name);
    setLensMount(lens.mount);
    setLensFocal(lens.focalLength);
    setLensAperture(lens.maxAperture);
    setLensFilter(lens.filterSize || '');
    setLensNotes(lens.notes || '');
    setLensFavorite(!!lens.isFavorite);
    setIsLensModalOpen(true);
  };

  const handleSaveLensSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lensName.trim()) return;

    const lensToSave: LensGear = {
      id: editingLens ? editingLens.id : `lens-${Date.now()}`,
      name: lensName.trim(),
      mount: lensMount,
      focalLength: lensFocal.trim() || '50mm',
      maxAperture: lensAperture.trim() || 'f/2.0',
      filterSize: lensFilter.trim() || undefined,
      notes: lensNotes.trim() || undefined,
      isFavorite: lensFavorite
    };

    onSaveLens(lensToSave);
    setIsLensModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Segmented Tab Switcher */}
      <div className={`p-4 rounded-lg border backdrop-blur-xs flex flex-wrap items-center justify-between gap-4 ${
        isDark 
          ? 'bg-neutral-900/80 border-neutral-800' 
          : 'bg-white/80 border-amber-900/15 shadow-xs'
      }`}>
        <div>
          <h2 className="text-lg font-bold tracking-tight">Camera Bag &amp; Optics Gear</h2>
          <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Pre-configure your camera bodies, lens mounts, and preferred lens pairs for instant one-click logging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented control for Cameras vs Lenses */}
          <div className={`p-1 rounded-md border flex items-center gap-1 text-xs ${
            isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
          }`}>
            <button
              onClick={() => setActiveGearTab('cameras')}
              className={`px-3 py-1.5 rounded font-medium transition-all cursor-pointer ${
                activeGearTab === 'cameras'
                  ? isDark 
                    ? 'bg-neutral-800 text-amber-400 shadow-xs font-semibold' 
                    : 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
              }`}
            >
              Camera Bodies ({cameras.length})
            </button>
            <button
              onClick={() => setActiveGearTab('lenses')}
              className={`px-3 py-1.5 rounded font-medium transition-all cursor-pointer ${
                activeGearTab === 'lenses'
                  ? isDark 
                    ? 'bg-neutral-800 text-amber-400 shadow-xs font-semibold' 
                    : 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
              }`}
            >
              Lenses &amp; Primes ({lenses.length})
            </button>
          </div>

          {activeGearTab === 'cameras' ? (
            <button
              onClick={handleOpenAddCamera}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' 
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Camera</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddLens}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' 
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lens</span>
            </button>
          )}
        </div>
      </div>

      {/* Cameras View */}
      {activeGearTab === 'cameras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cameras.length === 0 ? (
            <div className={`col-span-full p-12 text-center rounded-lg border ${
              isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-[#faf6eb] border-amber-900/15'
            }`}>
              <Camera className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
              <div className="text-sm font-semibold">No cameras in your gear bag yet</div>
              <p className="text-xs text-neutral-500 mt-1 mb-4">Add your camera bodies to quickly select them in the exposure log.</p>
              <button
                onClick={handleOpenAddCamera}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold cursor-pointer"
              >
                + Add Your First Camera
              </button>
            </div>
          ) : (
            cameras.map(cam => {
              const shotsCount = photos.filter(p => p.camera.toLowerCase() === cam.name.toLowerCase()).length;
              const activeRollsCount = rolls.filter(r => r.camera.toLowerCase() === cam.name.toLowerCase() && r.status === 'in_camera').length;

              return (
                <div
                  key={cam.id}
                  className={`rounded-lg border p-5 transition-all shadow-xs flex flex-col justify-between ${
                    isDark 
                      ? 'bg-neutral-900/90 border-neutral-800 text-neutral-100 hover:border-neutral-700' 
                      : 'bg-[#faf6eb] border-amber-900/15 text-neutral-900 hover:border-amber-900/30'
                  }`}
                >
                  <div>
                    {/* Header: Type and Actions */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        {cam.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSaveCamera({ ...cam, isFavorite: !cam.isFavorite })}
                          className={`p-1 rounded cursor-pointer ${
                            cam.isFavorite ? 'text-amber-500' : 'text-neutral-400 hover:text-amber-500'
                          }`}
                          title="Toggle Favorite"
                        >
                          <Star className={`w-3.5 h-3.5 ${cam.isFavorite ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleOpenEditCamera(cam)}
                          className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded cursor-pointer"
                          title="Edit camera"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${cam.name} from your gear bag?`)) {
                              onDeleteCamera(cam.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                          title="Delete camera"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Camera Title */}
                    <h3 className="text-base font-bold tracking-tight mb-1 flex items-baseline gap-2">
                      <span>{cam.name}</span>
                      {cam.year && (
                        <span className="text-xs font-mono font-normal text-neutral-500">
                          ({cam.year})
                        </span>
                      )}
                    </h3>

                    {/* Specs Box */}
                    <div className={`p-2.5 rounded border text-xs mb-3 space-y-1 font-mono ${
                      isDark ? 'bg-neutral-950/50 border-neutral-800' : 'bg-white/80 border-amber-900/10'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Lens Mount:</span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{cam.mount}</span>
                      </div>
                      {cam.defaultLens && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500">Default Lens:</span>
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[150px]">
                            {cam.defaultLens}
                          </span>
                        </div>
                      )}
                      {cam.serialNumber && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500">Serial No.:</span>
                          <span className="text-neutral-500">{cam.serialNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Usage Stats (Clean text separators) */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                      <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                        {shotsCount} logged frames
                      </span>
                      <span>·</span>
                      <span className={activeRollsCount > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
                        {activeRollsCount > 0 ? `${activeRollsCount} loaded roll` : 'No loaded roll'}
                      </span>
                    </div>

                    {cam.notes && (
                      <p className="text-xs text-neutral-500 line-clamp-2 italic mb-3">
                        &quot;{cam.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Quick Action */}
                  <button
                    onClick={() => onQuickLogWithGear(cam.name, cam.defaultLens)}
                    className={`w-full mt-2 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700' 
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Exposure with {cam.name}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Lenses View */}
      {activeGearTab === 'lenses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lenses.length === 0 ? (
            <div className={`col-span-full p-12 text-center rounded-lg border ${
              isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-[#faf6eb] border-amber-900/15'
            }`}>
              <div className="text-sm font-semibold">No lenses in your gear bag yet</div>
              <p className="text-xs text-neutral-500 mt-1 mb-4">Add your prime or zoom lenses with their focal lengths and filter threads.</p>
              <button
                onClick={handleOpenAddLens}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold cursor-pointer"
              >
                + Add Your First Lens
              </button>
            </div>
          ) : (
            lenses.map(lens => {
              const shotsCount = photos.filter(p => p.lens.toLowerCase() === lens.name.toLowerCase()).length;
              const compatibleCams = cameras.filter(c => c.mount.toLowerCase() === lens.mount.toLowerCase());

              return (
                <div
                  key={lens.id}
                  className={`rounded-lg border p-5 transition-all shadow-xs flex flex-col justify-between ${
                    isDark 
                      ? 'bg-neutral-900/90 border-neutral-800 text-neutral-100 hover:border-neutral-700' 
                      : 'bg-[#faf6eb] border-amber-900/15 text-neutral-900 hover:border-amber-900/30'
                  }`}
                >
                  <div>
                    {/* Header: Mount and Actions */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        {lens.mount}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSaveLens({ ...lens, isFavorite: !lens.isFavorite })}
                          className={`p-1 rounded cursor-pointer ${
                            lens.isFavorite ? 'text-amber-500' : 'text-neutral-400 hover:text-amber-500'
                          }`}
                          title="Toggle Favorite"
                        >
                          <Star className={`w-3.5 h-3.5 ${lens.isFavorite ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleOpenEditLens(lens)}
                          className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded cursor-pointer"
                          title="Edit lens"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${lens.name} from your gear bag?`)) {
                              onDeleteLens(lens.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                          title="Delete lens"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Lens Title */}
                    <h3 className="text-base font-bold tracking-tight mb-1">
                      {lens.name}
                    </h3>

                    {/* Specs Box */}
                    <div className={`p-2.5 rounded border text-xs mb-3 space-y-1 font-mono ${
                      isDark ? 'bg-neutral-950/50 border-neutral-800' : 'bg-white/80 border-amber-900/10'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Focal Length:</span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{lens.focalLength}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Max Aperture:</span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{lens.maxAperture}</span>
                      </div>
                      {lens.filterSize && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500">Filter Thread:</span>
                          <span className="text-neutral-500">{lens.filterSize}</span>
                        </div>
                      )}
                    </div>

                    {/* Compatible Bodies */}
                    {compatibleCams.length > 0 && (
                      <div className="text-[11px] text-neutral-500 mb-2">
                        <span>Mounts on: </span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                          {compatibleCams.map(c => c.name).join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Logged stats */}
                    <div className="text-xs text-neutral-500 mb-3">
                      <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                        {shotsCount} logged frames
                      </span>
                    </div>

                    {lens.notes && (
                      <p className="text-xs text-neutral-500 line-clamp-2 italic mb-3">
                        &quot;{lens.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Quick Action */}
                  <button
                    onClick={() => onQuickLogWithGear(compatibleCams[0]?.name || cameras[0]?.name || '', lens.name)}
                    className={`w-full mt-2 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700' 
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Frame with {lens.name.split(' ')[0]} {lens.focalLength}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal: Add/Edit Camera */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className={`w-full max-w-lg rounded-lg shadow-2xl overflow-hidden border transition-all ${
            isDark 
              ? 'bg-neutral-900 border-neutral-800 text-neutral-100' 
              : 'bg-[#faf7ee] border-amber-900/20 text-neutral-900'
          }`}>
            <div className={`h-2 w-full ${isDark ? 'bg-amber-600/40' : 'bg-amber-800/60'}`} />

            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark ? 'border-neutral-800 bg-neutral-900/90' : 'border-amber-900/10 bg-[#f5f1e4]'
            }`}>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold">
                  {editingCamera ? 'Edit Camera Body' : 'Add Camera Body'}
                </h3>
              </div>
              <button
                onClick={() => setIsCameraModalOpen(false)}
                className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCameraSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                  Camera Model &amp; Body Name *
                </label>
                <input
                  type="text"
                  required
                  value={camName}
                  onChange={e => setCamName(e.target.value)}
                  placeholder="e.g. Leica M6, Hasselblad 500 C/M, Nikon FM2"
                  className={`w-full text-xs font-medium rounded p-2.5 border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                    Camera Type / Format
                  </label>
                  <select
                    value={camType}
                    onChange={e => setCamType(e.target.value as CameraGear['type'])}
                    className={`w-full text-xs rounded p-2 border ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                    }`}
                  >
                    {COMMON_CAMERA_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                    Lens Mount
                  </label>
                  <input
                    list="mount-options"
                    type="text"
                    value={camMount}
                    onChange={e => setCamMount(e.target.value)}
                    placeholder="e.g. Leica M, Canon FD"
                    className={`w-full text-xs rounded p-2 border ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                    }`}
                  />
                  <datalist id="mount-options">
                    {COMMON_MOUNTS.map(m => <option key={m} value={m} />)}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                    Default / Attached Lens
                  </label>
                  <input
                    list="saved-lenses-list"
                    type="text"
                    value={camDefaultLens}
                    onChange={e => setCamDefaultLens(e.target.value)}
                    placeholder="e.g. 50mm f/2"
                    className={`w-full text-xs rounded p-2 border ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                    }`}
                  />
                  <datalist id="saved-lenses-list">
                    {lenses.map(l => <option key={l.id} value={l.name} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                    Production Year (Optional)
                  </label>
                  <input
                    type="text"
                    value={camYear}
                    onChange={e => setCamYear(e.target.value)}
                    placeholder="e.g. 1958, 1984"
                    className={`w-full text-xs font-mono rounded p-2 border ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  value={camSerial}
                  onChange={e => setCamSerial(e.target.value)}
                  placeholder="e.g. 928411"
                  className={`w-full text-xs font-mono rounded p-2 border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                  Personal Notes &amp; Features
                </label>
                <textarea
                  rows={2}
                  value={camNotes}
                  onChange={e => setCamNotes(e.target.value)}
                  placeholder="e.g. Mechanical shutter, 1/1000s top speed, CLA performed by DAG."
                  className={`w-full text-xs rounded p-2 border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cam-fav-check"
                  checked={camFavorite}
                  onChange={e => setCamFavorite(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="cam-fav-check" className="text-xs font-medium cursor-pointer">
                  Mark as Primary / Favorite Camera
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold rounded transition-colors cursor-pointer ${
                    isDark ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {editingCamera ? 'Update Camera' : 'Save Camera'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Lens */}
      {isLensModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className={`w-full max-w-lg rounded-lg shadow-2xl overflow-hidden border transition-all ${
            isDark 
              ? 'bg-neutral-900 border-neutral-800 text-neutral-100' 
              : 'bg-[#faf7ee] border-amber-900/20 text-neutral-900'
          }`}>
            <div className={`h-2 w-full ${isDark ? 'bg-amber-600/40' : 'bg-amber-800/60'}`} />

            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark ? 'border-neutral-800 bg-neutral-900/90' : 'border-amber-900/10 bg-[#f5f1e4]'
            }`}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">
                  {editingLens ? 'Edit Lens' : 'Add Lens'}
                </h3>
              </div>
              <button
                onClick={() => setIsLensModalOpen(false)}
                className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLensSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                  Lens Name *
                </label>
                <input
                  type="text"
                  required
                  value={lensName}
                  onChange={e => setLensName(e.target.value)}
                  placeholder="e.g. Leica Summicron 50mm f/2, Zeiss Planar 80mm f/2.8"
                  className={`w-full text-xs font-medium rounded p-2.5 border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                    Lens Mount
                  </label>
                  <input
                    list="lens-mount-options"
                    type="text"
                    value={lensMount}
                    onChange={e => setLensMount(e.target.value)}
                    placeholder="e.g. Leica M, Canon FD"
                    className={`w-full text-xs rounded p-2 border ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                    }`}
                  />
                  <datalist id="lens-mount-options">
                    {COMMON_MOUNTS.map(m => <option key={m} value={m} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                    Focal Length
                  </label>
                  <input
                    type="text"
                    value={lensFocal}
                    onChange={e => setLensFocal(e.target.value)}
                    placeholder="e.g. 50mm, 35mm, 80mm"
                    className={`w-full text-xs font-mono rounded p-2 border ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                    Max Aperture
                  </label>
                  <input
                    type="text"
                    value={lensAperture}
                    onChange={e => setLensAperture(e.target.value)}
                    placeholder="e.g. f/1.4, f/2.0, f/2.8"
                    className={`w-full text-xs font-mono rounded p-2 border ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                    Filter Thread Size (Optional)
                  </label>
                  <input
                    type="text"
                    value={lensFilter}
                    onChange={e => setLensFilter(e.target.value)}
                    placeholder="e.g. 39mm, 49mm, 52mm, Bay 50"
                    className={`w-full text-xs font-mono rounded p-2 border ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                  Notes &amp; Optical Character
                </label>
                <textarea
                  rows={2}
                  value={lensNotes}
                  onChange={e => setLensNotes(e.target.value)}
                  placeholder="e.g. Sharp center wide open, lovely bokeh, flares easily in direct back light."
                  className={`w-full text-xs rounded p-2 border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lens-fav-check"
                  checked={lensFavorite}
                  onChange={e => setLensFavorite(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="lens-fav-check" className="text-xs font-medium cursor-pointer">
                  Mark as Favorite Lens
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLensModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold rounded transition-colors cursor-pointer ${
                    isDark ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {editingLens ? 'Update Lens' : 'Save Lens'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
