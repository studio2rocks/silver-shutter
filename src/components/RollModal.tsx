import React, { useState, useEffect } from 'react';
import { X, Film, Check, AlertCircle } from 'lucide-react';
import { RollSession, CameraGear, COMMON_CAMERAS, COMMON_FILM_STOCKS, FORMAT_DETAILS, ISO_VALUES } from '../types';
import { calculatePushPull } from '../utils/helpers';

interface RollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roll: RollSession) => void;
  cameras?: CameraGear[];
  editingRoll?: RollSession | null;
  isDark?: boolean;
}

export const RollModal: React.FC<RollModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cameras = [],
  editingRoll,
  isDark = false
}) => {
  const [name, setName] = useState('');
  const [camera, setCamera] = useState(cameras[0]?.name || 'Leica M3');
  const [filmStock, setFilmStock] = useState('Kodak Portra 400');
  const [boxIso, setBoxIso] = useState(400);
  const [ratedIso, setRatedIso] = useState(400);
  const [format, setFormat] = useState<RollSession['format']>('35mm-36');
  const [status, setStatus] = useState<RollSession['status']>('in_camera');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingRoll) {
      setName(editingRoll.name);
      setCamera(editingRoll.camera);
      setFilmStock(editingRoll.filmStock);
      setBoxIso(editingRoll.boxIso);
      setRatedIso(editingRoll.ratedIso);
      setFormat(editingRoll.format);
      setStatus(editingRoll.status);
      setNotes(editingRoll.notes || '');
    } else {
      setName(`Roll #${Math.floor(Math.random() * 89 + 10)}`);
      setCamera(cameras[0]?.name || 'Leica M3');
      setFilmStock('Kodak Portra 400');
      setBoxIso(400);
      setRatedIso(400);
      setFormat('35mm-36');
      setStatus('in_camera');
      setNotes('');
    }
  }, [isOpen, editingRoll]);

  if (!isOpen) return null;

  const pushPull = calculatePushPull(boxIso, ratedIso);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roll: RollSession = {
      id: editingRoll ? editingRoll.id : `roll-${Date.now()}`,
      name: name.trim() || 'Untitled Roll',
      camera,
      filmStock,
      boxIso,
      ratedIso,
      format,
      totalFrames: FORMAT_DETAILS[format]?.frames || 36,
      status,
      startDate: editingRoll ? editingRoll.startDate : new Date().toISOString(),
      completedDate: status === 'developed' || status === 'completed' ? (editingRoll?.completedDate || new Date().toISOString()) : undefined,
      notes: notes.trim()
    };
    onSave(roll);
    onClose();
  };

  return (
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
            <Film className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold tracking-tight">
              {editingRoll ? 'Edit Film Roll / Session' : 'Load New Roll'}
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
              Roll / Session Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Roll #04 — Paris Autumn Street"
              className={`w-full text-xs font-medium rounded p-2.5 border ${
                isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
              Camera Body
            </label>
            {cameras.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {cameras.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCamera(c.name)}
                    className={`px-2 py-0.5 text-xs rounded border transition-colors cursor-pointer ${
                      camera === c.name
                        ? isDark ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' : 'bg-neutral-900 text-white font-bold border-neutral-900'
                        : isDark ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
            <input
              list="camera-opts"
              type="text"
              value={camera}
              onChange={e => setCamera(e.target.value)}
              placeholder="e.g. Leica M3"
              className={`w-full text-xs rounded p-2 border ${
                isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
              }`}
            />
            <datalist id="camera-opts">
              {cameras.map(c => <option key={c.id} value={c.name} />)}
              {COMMON_CAMERAS.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
              Format &amp; Frame Capacity
            </label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value as RollSession['format'])}
              className={`w-full text-xs rounded p-2 border ${
                isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
              }`}
            >
              {Object.entries(FORMAT_DETAILS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
              Film Stock
            </label>
            <input
              list="stock-opts"
              type="text"
              value={filmStock}
              onChange={e => {
                setFilmStock(e.target.value);
                const match = COMMON_FILM_STOCKS.find(s => s.name === e.target.value);
                if (match) {
                  setBoxIso(match.defaultIso);
                  setRatedIso(match.defaultIso);
                }
              }}
              placeholder="e.g. Kodak Portra 400"
              className={`w-full text-xs rounded p-2 border ${
                isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
              }`}
            />
            <datalist id="stock-opts">
              {COMMON_FILM_STOCKS.map(s => <option key={s.name} value={s.name} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                {ISO_VALUES.map(iso => <option key={`b-${iso}`} value={iso}>{iso}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
                Rated / Shooting ISO
              </label>
              <select
                value={ratedIso}
                onChange={e => setRatedIso(Number(e.target.value))}
                className={`w-full text-xs font-mono rounded p-2 border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
                }`}
              >
                {ISO_VALUES.map(iso => <option key={`r-${iso}`} value={iso}>{iso}</option>)}
              </select>
            </div>
          </div>

          {/* Push / Pull readout */}
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>Development Plan:</span>
            <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
              {pushPull.label}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
              Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as RollSession['status'])}
              className={`w-full text-xs rounded p-2 border ${
                isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
              }`}
            >
              <option value="in_camera">In Camera (Currently Shooting)</option>
              <option value="completed">Finished / Exposed (Ready for Lab)</option>
              <option value="sent_to_lab">Sent to Lab / Processing</option>
              <option value="developed">Developed &amp; Scanned</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
              Notes &amp; Lab Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Push +1 stop in D-76 developer. Scanned at 2400 DPI."
              className={`w-full text-xs rounded p-2 border ${
                isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-300'
              }`}
            />
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded transition-all shadow-sm cursor-pointer ${
                isDark 
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' 
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingRoll ? 'Update Roll' : 'Create Roll'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
