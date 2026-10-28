import React, { useState } from 'react';
import { X, Printer, Download } from 'lucide-react';
import { RollSession, PhotoEntry } from '../types';
import { formatDate, calculatePushPull } from '../utils/helpers';

interface PrintableSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  rolls: RollSession[];
  photos: PhotoEntry[];
  isDark?: boolean;
}

export const PrintableSheetModal: React.FC<PrintableSheetModalProps> = ({
  isOpen,
  onClose,
  rolls,
  photos,
  isDark = false
}) => {
  const [selectedRollId, setSelectedRollId] = useState<string>(rolls[0]?.id || '');

  if (!isOpen) return null;

  const selectedRoll = rolls.find(r => r.id === selectedRollId) || rolls[0];
  const rollPhotos = photos
    .filter(p => p.rollId === selectedRoll?.id)
    .sort((a, b) => Number(a.frameNumber) - Number(b.frameNumber));

  const totalCapacity = selectedRoll?.totalFrames || 36;
  const pushPull = selectedRoll ? calculatePushPull(selectedRoll.boxIso, selectedRoll.ratedIso) : { label: 'Box Speed' };

  // Fill array up to total capacity so user can also hand-write remaining frames on the printed paper!
  const rows = Array.from({ length: totalCapacity }, (_, i) => {
    const frameNum = i + 1;
    const photo = rollPhotos.find(p => Number(p.frameNumber) === frameNum);
    return { frameNum, photo };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className={`w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden border transition-all ${
        isDark 
          ? 'bg-neutral-900 border-neutral-800 text-neutral-100' 
          : 'bg-[#faf7ee] border-amber-900/20 text-neutral-900'
      }`}>
        {/* Modal Controls Bar (hidden during actual print) */}
        <div className={`no-print px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-neutral-900' : 'border-amber-900/10 bg-[#f5f1e4]'
        }`}>
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-bold">Negative Sleeve Exposure Sheet</h2>
              <p className="text-xs text-neutral-500">Archival 36-frame log for print or PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedRollId}
              onChange={e => setSelectedRollId(e.target.value)}
              className="text-xs rounded p-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            >
              {rolls.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.camera})</option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-amber-500 dark:text-neutral-950 text-xs font-bold rounded cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Content (Optimized for standard 8.5x11 paper print) */}
        <div className="p-8 max-h-[80vh] overflow-y-auto bg-white text-black font-sans print:p-0 print:max-h-none print:overflow-visible">
          {/* Sheet Header */}
          <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-end">
            <div>
              <div className="text-xl font-bold tracking-tight uppercase">
                Exposure &amp; Development Log
              </div>
              <div className="text-xs font-mono text-neutral-600 mt-1">
                Archival Negative Binder Insert Sheet · 35mm / 120
              </div>
            </div>
            <div className="text-right text-xs font-mono space-y-0.5">
              <div><strong>Roll:</strong> {selectedRoll?.name}</div>
              <div><strong>Camera:</strong> {selectedRoll?.camera}</div>
            </div>
          </div>

          {/* Roll Metadata Summary Bar */}
          <div className="grid grid-cols-4 gap-4 p-3 bg-neutral-50 border border-neutral-300 rounded mb-4 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[10px]">FILM STOCK</span>
              <span className="font-bold">{selectedRoll?.filmStock}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">BOX / RATED ISO</span>
              <span className="font-bold">{selectedRoll?.boxIso} / {selectedRoll?.ratedIso}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">LAB PROCESS</span>
              <span className="font-bold">{pushPull.label}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">DATE LOADED</span>
              <span className="font-bold">{formatDate(selectedRoll?.startDate || '')}</span>
            </div>
          </div>

          {/* Frames Table */}
          <table className="w-full text-left text-[11px] border border-neutral-300 border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-300 font-mono font-semibold">
                <th className="py-1 px-2 border-r border-neutral-300 w-12 text-center">#</th>
                <th className="py-1 px-2 border-r border-neutral-300 w-24">Date</th>
                <th className="py-1 px-2 border-r border-neutral-300 w-20">Shutter</th>
                <th className="py-1 px-2 border-r border-neutral-300 w-16">Aperture</th>
                <th className="py-1 px-2 border-r border-neutral-300 w-32">Lens</th>
                <th className="py-1 px-2 border-r border-neutral-300">Description &amp; Lighting Notes</th>
                <th className="py-1 px-2 w-20 text-center">Filter / EV</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ frameNum, photo }) => (
                <tr key={frameNum} className="border-b border-neutral-200 h-6">
                  <td className="py-1 px-2 border-r border-neutral-300 text-center font-mono font-bold">
                    {String(frameNum).padStart(2, '0')}
                  </td>
                  <td className="py-1 px-2 border-r border-neutral-300 font-mono text-[10px]">
                    {photo ? formatDate(photo.timestamp) : ''}
                  </td>
                  <td className="py-1 px-2 border-r border-neutral-300 font-mono font-medium">
                    {photo?.shutterSpeed || ''}
                  </td>
                  <td className="py-1 px-2 border-r border-neutral-300 font-mono font-medium">
                    {photo?.aperture || ''}
                  </td>
                  <td className="py-1 px-2 border-r border-neutral-300 truncate max-w-[120px]">
                    {photo?.lens || ''}
                  </td>
                  <td className="py-1 px-2 border-r border-neutral-300 truncate max-w-[280px]">
                    {photo?.notes || ''}
                  </td>
                  <td className="py-1 px-2 font-mono text-[10px] text-center">
                    {photo?.filterUsed && photo.filterUsed !== 'None' ? photo.filterUsed : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedRoll?.notes && (
            <div className="mt-4 p-2 border border-neutral-200 rounded text-xs">
              <span className="font-bold font-mono">DEVELOPER &amp; SCAN NOTES: </span>
              <span>{selectedRoll.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
