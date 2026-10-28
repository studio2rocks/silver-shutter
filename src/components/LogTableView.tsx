import React, { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Edit3, ArrowUpDown, Download, Image as ImageIcon, CheckCircle, ExternalLink } from 'lucide-react';
import { PhotoEntry, RollSession } from '../types';
import { formatDateTime, calculatePushPull } from '../utils/helpers';

interface LogTableViewProps {
  photos: PhotoEntry[];
  rolls: RollSession[];
  onEditPhoto: (photo: PhotoEntry) => void;
  onDeletePhoto: (id: string) => void;
  onExportCSV: () => void;
  isDark?: boolean;
}

export const LogTableView: React.FC<LogTableViewProps> = ({
  photos,
  rolls,
  onEditPhoto,
  onDeletePhoto,
  onExportCSV,
  isDark = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRollFilter, setSelectedRollFilter] = useState('all');
  const [selectedCameraFilter, setSelectedCameraFilter] = useState('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState('all');
  const [sortField, setSortField] = useState<'timestamp' | 'frameNumber' | 'camera'>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  const rollMap = useMemo(() => new Map(rolls.map(r => [r.id, r])), [rolls]);

  const uniqueCameras = useMemo(() => {
    return Array.from(new Set(photos.map(p => p.camera))).filter(Boolean);
  }, [photos]);

  const uniqueStocks = useMemo(() => {
    return Array.from(new Set(photos.map(p => p.filmStock))).filter(Boolean);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      if (selectedRollFilter !== 'all' && p.rollId !== selectedRollFilter) return false;
      if (selectedCameraFilter !== 'all' && p.camera !== selectedCameraFilter) return false;
      if (selectedStockFilter !== 'all' && p.filmStock !== selectedStockFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match = 
          p.camera.toLowerCase().includes(q) ||
          p.lens.toLowerCase().includes(q) ||
          p.filmStock.toLowerCase().includes(q) ||
          p.notes.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          String(p.frameNumber).includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortField === 'timestamp') {
        cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortField === 'frameNumber') {
        cmp = Number(a.frameNumber) - Number(b.frameNumber);
      } else if (sortField === 'camera') {
        cmp = a.camera.localeCompare(b.camera);
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [photos, selectedRollFilter, selectedCameraFilter, selectedStockFilter, searchTerm, sortField, sortAsc]);

  const handleSort = (field: 'timestamp' | 'frameNumber' | 'camera') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Filters */}
      <div className={`p-4 rounded-lg border backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 ${
        isDark 
          ? 'bg-neutral-900/80 border-neutral-800' 
          : 'bg-white/80 border-amber-900/15 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search frame, lens, scene notes, location..."
              className={`w-full text-xs rounded pl-9 pr-3 py-1.5 border transition-colors ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:border-amber-400' 
                  : 'bg-[#fcfaf3] border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900'
              }`}
            />
          </div>

          {/* Roll filter */}
          <select
            value={selectedRollFilter}
            onChange={e => setSelectedRollFilter(e.target.value)}
            className={`text-xs rounded px-2.5 py-1.5 border ${
              isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-200' : 'bg-[#fcfaf3] border-neutral-300 text-neutral-800'
            }`}
          >
            <option value="all">All Rolls ({rolls.length})</option>
            {rolls.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          {/* Camera filter */}
          {uniqueCameras.length > 1 && (
            <select
              value={selectedCameraFilter}
              onChange={e => setSelectedCameraFilter(e.target.value)}
              className={`text-xs rounded px-2.5 py-1.5 border ${
                isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-200' : 'bg-[#fcfaf3] border-neutral-300 text-neutral-800'
              }`}
            >
              <option value="all">All Cameras</option>
              {uniqueCameras.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Stock filter */}
          {uniqueStocks.length > 1 && (
            <select
              value={selectedStockFilter}
              onChange={e => setSelectedStockFilter(e.target.value)}
              className={`text-xs rounded px-2.5 py-1.5 border ${
                isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-200' : 'bg-[#fcfaf3] border-neutral-300 text-neutral-800'
              }`}
            >
              <option value="all">All Film Stocks</option>
              {uniqueStocks.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-neutral-500 font-mono">
            {filteredPhotos.length} of {photos.length} frames
          </span>
          <button
            onClick={onExportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors cursor-pointer text-xs font-medium ${
              isDark 
                ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300' 
                : 'border-neutral-300 hover:bg-white text-neutral-700 shadow-xs'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet / Table Container with subtle notepad styling */}
      <div className={`rounded-lg border overflow-hidden shadow-xs ${
        isDark 
          ? 'bg-neutral-900 border-neutral-800' 
          : 'bg-[#faf6ea] border-amber-900/15'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-semibold tracking-wider uppercase ${
                isDark 
                  ? 'bg-neutral-950/80 border-neutral-800 text-neutral-400' 
                  : 'bg-[#f3eedc] border-amber-900/20 text-neutral-600'
              }`}>
                <th className="py-3 px-3 w-16 text-center">
                  <button
                    onClick={() => handleSort('frameNumber')}
                    className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    <span>Frame</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    onClick={() => handleSort('timestamp')}
                    className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    <span>Date &amp; Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    onClick={() => handleSort('camera')}
                    className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    <span>Camera Body</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">Lens</th>
                <th className="py-3 px-3">Film Stock / Sensor</th>
                <th className="py-3 px-3 font-mono">Box / Rated</th>
                <th className="py-3 px-3 font-mono">Shutter</th>
                <th className="py-3 px-3 font-mono">Aperture</th>
                <th className="py-3 px-4 min-w-[220px]">Description &amp; Personal Notes</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800/80">
              {filteredPhotos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-neutral-500">
                    No matching exposure logs found. Click &quot;Log Frame&quot; to add your first photo entry.
                  </td>
                </tr>
              ) : (
                filteredPhotos.map((p) => {
                  const roll = rollMap.get(p.rollId);
                  const pushPull = calculatePushPull(p.boxIso, p.ratedIso);

                  return (
                    <tr 
                      key={p.id}
                      className={`group transition-colors ${
                        isDark 
                          ? 'hover:bg-neutral-800/60' 
                          : 'hover:bg-amber-100/40'
                      }`}
                    >
                      {/* Frame # */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                          #{String(p.frameNumber).padStart(2, '0')}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300 font-mono-numbers">
                        {formatDateTime(p.timestamp)}
                      </td>

                      {/* Camera Body */}
                      <td className="py-3 px-3 font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        {p.camera}
                      </td>

                      {/* Lens */}
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        {p.lens}
                      </td>

                      {/* Film Stock */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {p.filmStock}
                        </div>
                        {roll && (
                          <div className="text-[10px] text-neutral-500">
                            {roll.name}
                          </div>
                        )}
                      </td>

                      {/* Box / Rated ISO */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-neutral-700 dark:text-neutral-300">
                        <span>{p.boxIso}</span>
                        <span className="text-neutral-400 mx-1">/</span>
                        <span className={pushPull.stops !== 0 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
                          {p.ratedIso}
                        </span>
                      </td>

                      {/* Shutter Speed */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        {p.shutterSpeed}
                      </td>

                      {/* Aperture */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        {p.aperture}
                      </td>

                      {/* Notes & Description */}
                      <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                        <div className="line-clamp-2 leading-relaxed">
                          {p.notes || <span className="text-neutral-400 italic">No notes</span>}
                        </div>
                        {p.location && (
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            📍 {p.location}
                          </div>
                        )}
                        {p.filterUsed && p.filterUsed !== 'None' && (
                          <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5 font-mono">
                            Filter: {p.filterUsed}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 opacity-90 group-hover:opacity-100">
                          {p.imageUrl && (
                            <a
                              href={p.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 rounded"
                              title="View full image"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => onEditPhoto(p)}
                            className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded transition-colors cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete frame #${p.frameNumber}?`)) {
                                onDeletePhoto(p.id);
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
