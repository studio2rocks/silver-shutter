import React, { useState, useEffect } from 'react';
import { X, Camera, Aperture, Clock, Calendar, MapPin, Tag, Plus, Check, Image as ImageIcon, Sliders, Briefcase } from 'lucide-react';
import { 
  PhotoEntry, 
  RollSession, 
  CameraGear, 
  LensGear, 
  COMMON_CAMERAS, 
  COMMON_LENSES, 
  COMMON_FILM_STOCKS, 
  SHUTTER_SPEEDS, 
  APERTURES, 
  ISO_VALUES 
} from '../types';
import { calculatePushPull } from '../utils/helpers';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<PhotoEntry, 'id'>, andNext?: boolean) => void;
  rolls: RollSession[];
  photos: PhotoEntry[];
  cameras?: CameraGear[];
  lenses?: LensGear[];
  onOpenGearTab?: () => void;
  editingPhoto?: PhotoEntry | null;
  initialRollId?: string;
  isDark?: boolean;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  rolls,
  photos,
  cameras = [],
  lenses = [],
  onOpenGearTab,
  editingPhoto,
  initialRollId,
  isDark = false
}) => {
  const activeRolls = rolls.filter(r => r.status === 'in_camera' || r.status === 'developed' || r.status === 'completed');
  const defaultRoll = rolls.find(r => r.id === initialRollId) || activeRolls[0] || rolls[0];

  const [rollId, setRollId] = useState<string>(defaultRoll?.id || '');
  const [frameNumber, setFrameNumber] = useState<number>(1);
  const [camera, setCamera] = useState<string>(defaultRoll?.camera || cameras[0]?.name || 'Leica M3');
  const [lens, setLens] = useState<string>('Leica Summicron 50mm f/2');
  const [filmStock, setFilmStock] = useState<string>(defaultRoll?.filmStock || 'Kodak Portra 400');
  const [boxIso, setBoxIso] = useState<number>(defaultRoll?.boxIso || 400);
  const [ratedIso, setRatedIso] = useState<number>(defaultRoll?.ratedIso || 400);
  const [shutterSpeed, setShutterSpeed] = useState<string>('1/250s');
  const [aperture, setAperture] = useState<string>('f/4.0');
  const [exposureCompensation, setExposureCompensation] = useState<string>('0');
  const [meteringMode, setMeteringMode] = useState<PhotoEntry['meteringMode']>('center-weighted');
  const [filterUsed, setFilterUsed] = useState<string>('None');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString().slice(0, 16));
  const [imageUrl, setImageUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'film' | 'digital' | 'instant'>('film');

  // Compute next frame when selected roll changes
  useEffect(() => {
    if (editingPhoto) {
      setRollId(editingPhoto.rollId);
      setFrameNumber(editingPhoto.frameNumber);
      setCamera(editingPhoto.camera);
      setLens(editingPhoto.lens);
      setFilmStock(editingPhoto.filmStock);
      setBoxIso(editingPhoto.boxIso);
      setRatedIso(editingPhoto.ratedIso);
      setShutterSpeed(editingPhoto.shutterSpeed);
      setAperture(editingPhoto.aperture);
      setExposureCompensation(editingPhoto.exposureCompensation || '0');
      setMeteringMode(editingPhoto.meteringMode || 'center-weighted');
      setFilterUsed(editingPhoto.filterUsed || 'None');
      setLocation(editingPhoto.location || '');
      setNotes(editingPhoto.notes || '');
      setTimestamp(editingPhoto.timestamp.slice(0, 16));
      setImageUrl(editingPhoto.imageUrl || '');
      setMediaType(editingPhoto.mediaType || 'film');
    } else {
      const selected = rolls.find(r => r.id === rollId) || defaultRoll;
      if (selected) {
        setCamera(selected.camera);
        setFilmStock(selected.filmStock);
        setBoxIso(selected.boxIso);
        setRatedIso(selected.ratedIso);
        setMediaType(selected.format === 'digital' ? 'digital' : 'film');

        // Look for matching camera gear to set default lens
        const matchedCam = cameras.find(c => c.name.toLowerCase() === selected.camera.toLowerCase());
        if (matchedCam && matchedCam.defaultLens) {
          setLens(matchedCam.defaultLens);
        }

        // calculate next frame for this roll
        const rollPhotos = photos.filter(p => p.rollId === selected.id);
        const maxExisting = rollPhotos.reduce((max, p) => Math.max(max, Number(p.frameNumber) || 0), 0);
        setFrameNumber(maxExisting + 1);
      }
      setTimestamp(new Date().toISOString().slice(0, 16));
    }
  }, [isOpen, editingPhoto, rollId]);

  if (!isOpen) return null;

  const pushPullInfo = calculatePushPull(boxIso, ratedIso);

  const handleRollChange = (newRollId: string) => {
    setRollId(newRollId);
    const r = rolls.find(item => item.id === newRollId);
    if (r) {
      setCamera(r.camera);
      setFilmStock(r.filmStock);
      setBoxIso(r.boxIso);
      setRatedIso(r.ratedIso);
      const matchedCam = cameras.find(c => c.name.toLowerCase() === r.camera.toLowerCase());
      if (matchedCam && matchedCam.defaultLens) {
        setLens(matchedCam.defaultLens);
      }
      const rollPhotos = photos.filter(p => p.rollId === r.id);
      const maxExisting = rollPhotos.reduce((max, p) => Math.max(max, Number(p.frameNumber) || 0), 0);
      setFrameNumber(maxExisting + 1);
    }
  };

  const handleSelectCamera = (selectedCameraName: string) => {
    setCamera(selectedCameraName);
    const matchedCam = cameras.find(c => c.name.toLowerCase() === selectedCameraName.toLowerCase());
    if (matchedCam?.defaultLens) {
      setLens(matchedCam.defaultLens);
    }
  };

  // Find compatible lenses for current camera
  const currentCameraGear = cameras.find(c => c.name.toLowerCase() === camera.toLowerCase());
  const compatibleLenses = currentCameraGear 
    ? lenses.filter(l => l.mount.toLowerCase() === currentCameraGear.mount.toLowerCase())
    : lenses;

  const handleFilmStockChange = (stockName: string) => {
    setFilmStock(stockName);
    const found = COMMON_FILM_STOCKS.find(s => s.name === stockName);
    if (found) {
      setBoxIso(found.defaultIso);
      setRatedIso(found.defaultIso);
      setMediaType(found.type === 'Digital' ? 'digital' : 'film');
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (andNext: boolean = false) => {
    const entry: Omit<PhotoEntry, 'id'> = {
      rollId,
      frameNumber: Number(frameNumber) || 1,
      timestamp: new Date(timestamp).toISOString(),
      camera,
      lens,
      mediaType,
      filmStock,
      boxIso: Number(boxIso) || 400,
      ratedIso: Number(ratedIso) || 400,
      shutterSpeed,
      aperture,
      exposureCompensation,
      meteringMode,
      filterUsed,
      location,
      notes,
      imageUrl: imageUrl || undefined,
      rating: editingPhoto?.rating || 4,
      isFavorite: editingPhoto?.isFavorite || false
    };

    onSave(entry, andNext);

    if (andNext) {
      setFrameNumber(prev => prev + 1);
      setNotes('');
      setImageUrl('');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden border transition-all ${
          isDark 
            ? 'bg-neutral-900 border-neutral-800 text-neutral-100' 
            : 'bg-[#faf7ee] border-amber-900/20 text-neutral-900'
        }`}
      >
        {/* Notebook top spiral / header stripe */}
        <div className={`h-2 w-full ${isDark ? 'bg-amber-600/40' : 'bg-amber-800/60'}`} />

        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-neutral-900/90' : 'border-amber-900/10 bg-[#f5f1e4]'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
              isDark 
                ? 'bg-neutral-800 border-neutral-700 text-amber-400' 
                : 'bg-white border-amber-200 text-amber-900'
            }`}>
              FRAME #{String(frameNumber).padStart(2, '0')}
            </span>
            <h2 className="text-base font-bold tracking-tight">
              {editingPhoto ? 'Edit Exposure Entry' : 'Log New Exposure'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-amber-200/50 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Roll & Frame Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Roll or Session
              </label>
              <select
                value={rollId}
                onChange={e => handleRollChange(e.target.value)}
                className={`w-full text-xs font-medium rounded p-2 border transition-colors ${
                  isDark 
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-100' 
                    : 'bg-white border-neutral-300 text-neutral-900'
                }`}
              >
                {rolls.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.camera} · {r.filmStock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Frame Number
              </label>
              <input
                type="number"
                min="0"
                max="999"
                value={frameNumber}
                onChange={e => setFrameNumber(parseInt(e.target.value) || 1)}
                className={`w-full text-xs font-mono font-bold rounded p-2 border ${
                  isDark 
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-100' 
                    : 'bg-white border-neutral-300 text-neutral-900'
                }`}
              />
            </div>
          </div>

          {/* Camera Body Selection with Quick Gear Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Camera Body</span>
              </label>
              {onOpenGearTab && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGearTab();
                  }}
                  className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Manage Gear Bag</span>
                </button>
              )}
            </div>

            {/* Quick-pick saved camera bodies buttons */}
            {cameras.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {cameras.map(c => {
                  const isSelected = camera.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCamera(c.name)}
                      className={`px-2.5 py-1 text-xs rounded border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? isDark 
                            ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-xs' 
                            : 'bg-neutral-900 text-white font-bold border-neutral-900 shadow-xs'
                          : isDark 
                            ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700' 
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-amber-50'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative">
              <input
                list="camera-list"
                type="text"
                value={camera}
                onChange={e => handleSelectCamera(e.target.value)}
                placeholder="e.g., Leica M3, Canon AE-1"
                className={`w-full text-xs rounded p-2 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              />
              <datalist id="camera-list">
                {cameras.map(c => <option key={c.id} value={c.name} />)}
                {COMMON_CAMERAS.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* Lens Selection with Saved Gear & Mount Compatibility */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                <Aperture className="w-3.5 h-3.5" />
                <span>Lens &amp; Focal Length</span>
              </label>
              {currentCameraGear && (
                <span className="text-[11px] font-mono text-neutral-500">
                  {currentCameraGear.mount} Mount
                </span>
              )}
            </div>

            {/* Compatible saved lenses quick-pick buttons */}
            {compatibleLenses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {compatibleLenses.map(l => {
                  const isSelected = lens.toLowerCase() === l.name.toLowerCase();
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLens(l.name)}
                      className={`px-2.5 py-1 text-xs rounded border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? isDark 
                            ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-xs' 
                            : 'bg-neutral-900 text-white font-bold border-neutral-900 shadow-xs'
                          : isDark 
                            ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700' 
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-amber-50'
                      }`}
                      title={`${l.name} (${l.maxAperture})`}
                    >
                      {l.name}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative">
              <input
                list="lens-list"
                type="text"
                value={lens}
                onChange={e => setLens(e.target.value)}
                placeholder="e.g., 50mm f/1.4, 80mm f/2.8"
                className={`w-full text-xs rounded p-2 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              />
              <datalist id="lens-list">
                {lenses.map(l => <option key={l.id} value={l.name} />)}
                {COMMON_LENSES.map(l => <option key={l} value={l} />)}
              </datalist>
            </div>
          </div>

          {/* Film Stock & ISO Rating with Push/Pull calculation */}
          <div className="p-3.5 rounded-md border bg-neutral-500/5 dark:bg-neutral-800/40 border-neutral-300 dark:border-neutral-700 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                  Film Stock / Medium
                </label>
                <input
                  list="film-list"
                  type="text"
                  value={filmStock}
                  onChange={e => handleFilmStockChange(e.target.value)}
                  placeholder="e.g. Kodak Portra 400"
                  className={`w-full text-xs rounded p-2 border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                  }`}
                />
                <datalist id="film-list">
                  {COMMON_FILM_STOCKS.map(s => <option key={s.name} value={s.name} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                  Box ISO
                </label>
                <select
                  value={boxIso}
                  onChange={e => setBoxIso(Number(e.target.value))}
                  className={`w-full text-xs font-mono rounded p-2 border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                  }`}
                >
                  {ISO_VALUES.map(iso => (
                    <option key={`box-${iso}`} value={iso}>{iso}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                  Rated / Metered ISO
                </label>
                <select
                  value={ratedIso}
                  onChange={e => setRatedIso(Number(e.target.value))}
                  className={`w-full text-xs font-mono rounded p-2 border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                  }`}
                >
                  {ISO_VALUES.map(iso => (
                    <option key={`rated-${iso}`} value={iso}>{iso}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Push / Pull status badge */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-300/60 dark:border-neutral-700/60">
              <span className="text-neutral-500 dark:text-neutral-400">Development Rating:</span>
              <span className={`font-mono font-semibold ${
                pushPullInfo.stops > 0 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : pushPullInfo.stops < 0 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-neutral-600 dark:text-neutral-300'
              }`}>
                {pushPullInfo.label}
              </span>
            </div>
          </div>

          {/* Exposure Parameters: Shutter Speed & Aperture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shutter Speed */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Shutter Speed</span>
                </label>
                <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                  {shutterSpeed}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 mb-2">
                {['1/1000s', '1/500s', '1/250s', '1/125s', '1/60s', '1/30s', '1/15s', 'Bulb'].map(speed => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setShutterSpeed(speed)}
                    className={`py-1 px-1.5 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                      shutterSpeed === speed
                        ? isDark 
                          ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' 
                          : 'bg-neutral-900 text-white font-bold border-neutral-900'
                        : isDark 
                          ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700' 
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
              <select
                value={shutterSpeed}
                onChange={e => setShutterSpeed(e.target.value)}
                className={`w-full text-xs font-mono rounded p-1.5 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              >
                {SHUTTER_SPEEDS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Aperture */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                  <Aperture className="w-3.5 h-3.5" />
                  <span>Aperture</span>
                </label>
                <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                  {aperture}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 mb-2">
                {['f/1.4', 'f/2.0', 'f/2.8', 'f/4.0', 'f/5.6', 'f/8.0', 'f/11', 'f/16'].map(ap => (
                  <button
                    key={ap}
                    type="button"
                    onClick={() => setAperture(ap)}
                    className={`py-1 px-1.5 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                      aperture === ap
                        ? isDark 
                          ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' 
                          : 'bg-neutral-900 text-white font-bold border-neutral-900'
                        : isDark 
                          ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700' 
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {ap}
                  </button>
                ))}
              </div>
              <select
                value={aperture}
                onChange={e => setAperture(e.target.value)}
                className={`w-full text-xs font-mono rounded p-1.5 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              >
                {APERTURES.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Exposure Fine-tuning: Compensation, Metering, Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Exposure Comp
              </label>
              <select
                value={exposureCompensation}
                onChange={e => setExposureCompensation(e.target.value)}
                className={`w-full text-xs font-mono rounded p-2 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              >
                {['-2.0 EV', '-1.5 EV', '-1.0 EV', '-0.5 EV', '0', '+0.5 EV', '+1.0 EV', '+1.5 EV', '+2.0 EV'].map(ev => (
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Metering Method
              </label>
              <select
                value={meteringMode}
                onChange={e => setMeteringMode(e.target.value as PhotoEntry['meteringMode'])}
                className={`w-full text-xs rounded p-2 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              >
                <option value="center-weighted">Center-Weighted</option>
                <option value="spot">Spot Meter</option>
                <option value="incident">Handheld Incident</option>
                <option value="sunny-16">Sunny 16 Rule</option>
                <option value="evaluative">Matrix / Evaluative</option>
                <option value="manual-guess">Eye / Guess</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Filter Used
              </label>
              <input
                type="text"
                value={filterUsed}
                onChange={e => setFilterUsed(e.target.value)}
                placeholder="e.g. Yellow K2, Polarizer"
                className={`w-full text-xs rounded p-2 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              />
            </div>
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  Date &amp; Time Captured
                </label>
                <button
                  type="button"
                  onClick={() => setTimestamp(new Date().toISOString().slice(0, 16))}
                  className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Set to Now
                </button>
              </div>
              <input
                type="datetime-local"
                value={timestamp}
                onChange={e => setTimestamp(e.target.value)}
                className={`w-full text-xs rounded p-2 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Location / Scene
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Rue de Rivoli, Downtown Studio"
                className={`w-full text-xs rounded p-2 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              />
            </div>
          </div>

          {/* Personal Notes / Description */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
              Brief Description &amp; Personal Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Golden hour backlight, subject leaned against pillar. Lens wide open at f/2.0 for soft background bokeh."
              className={`w-full text-xs rounded p-2.5 border font-sans ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700 placeholder-neutral-500' 
                  : 'bg-white border-neutral-300 placeholder-neutral-400'
              }`}
            />
          </div>

          {/* Optional Photo Attachment / Scan upload */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
              Photo / Scan Thumbnail (Optional)
            </label>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <div className="relative w-16 h-16 rounded border overflow-hidden shrink-0">
                  <img src={imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-0 right-0 p-0.5 bg-black/70 text-white hover:bg-red-600 rounded-bl cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className={`w-16 h-16 rounded border border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 ${
                  isDark ? 'border-neutral-700 hover:border-amber-400 text-neutral-400' : 'border-neutral-300 hover:border-neutral-900 text-neutral-500'
                }`}>
                  <ImageIcon className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">Add</span>
                  <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                </label>
              )}
              <div className="text-xs text-neutral-500 leading-relaxed">
                <span>Upload a scan, contact sheet frame, or mobile reference snapshot.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-neutral-800 bg-neutral-900/90' : 'border-amber-900/10 bg-[#f5f1e4]'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!editingPhoto && (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className={`px-4 py-2 text-xs font-semibold rounded border transition-all cursor-pointer ${
                  isDark 
                    ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200' 
                    : 'border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 shadow-xs'
                }`}
                title="Saves this frame and prepares the next frame immediately"
              >
                Save &amp; Next (#{frameNumber + 1})
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded transition-all shadow-sm cursor-pointer ${
                isDark 
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' 
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingPhoto ? 'Update Frame' : 'Save Frame'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
