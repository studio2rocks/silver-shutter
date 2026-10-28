import React, { useState } from 'react';
import { Camera, Aperture, Clock, Calendar, Edit3, Trash2, MapPin, ZoomIn } from 'lucide-react';
import { PhotoEntry, RollSession } from '../types';
import { formatDateTime } from '../utils/helpers';

interface FrameGridViewProps {
  photos: PhotoEntry[];
  rolls: RollSession[];
  onEditPhoto: (photo: PhotoEntry) => void;
  onDeletePhoto: (id: string) => void;
  isDark?: boolean;
}

export const FrameGridView: React.FC<FrameGridViewProps> = ({
  photos,
  rolls,
  onEditPhoto,
  onDeletePhoto,
  isDark = false
}) => {
  const [filterRollId, setFilterRollId] = useState<string>('all');
  const [selectedPhotoForZoom, setSelectedPhotoForZoom] = useState<PhotoEntry | null>(null);

  const filteredPhotos = filterRollId === 'all' 
    ? photos 
    : photos.filter(p => p.rollId === filterRollId);

  return (
    <div className="space-y-6">
      {/* Contact Sheet Filter Header */}
      <div className={`p-4 rounded-lg border backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 ${
        isDark 
          ? 'bg-neutral-900/80 border-neutral-800' 
          : 'bg-white/80 border-amber-900/15 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Contact Sheet View
          </span>
          <span className="text-xs font-mono text-neutral-400">·</span>
          <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300">
            {filteredPhotos.length} Frames
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">Filter by Roll:</label>
          <select
            value={filterRollId}
            onChange={e => setFilterRollId(e.target.value)}
            className={`text-xs rounded px-2.5 py-1.5 border ${
              isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-200' : 'bg-[#fcfaf3] border-neutral-300 text-neutral-800'
            }`}
          >
            <option value="all">All Rolls ({rolls.length})</option>
            {rolls.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Film Strip / Contact Sheet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredPhotos.map(photo => {
          return (
            <div
              key={photo.id}
              className={`group rounded-lg border overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700' 
                  : 'bg-[#faf6ea] border-amber-900/15 hover:border-amber-900/30 shadow-xs'
              }`}
            >
              {/* Film Sprocket / Frame Header Stripe */}
              <div className={`px-3 py-1.5 border-b flex items-center justify-between font-mono text-[11px] ${
                isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-[#f0ebda] border-amber-900/15 text-neutral-600'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 dark:text-amber-400">
                    ▲ {String(photo.frameNumber).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {photo.filmStock.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono-numbers">
                  {formatDateTime(photo.timestamp).split('·')[0]}
                </div>
              </div>

              {/* Photo Image Area or Stylized Film Emulsion Box */}
              <div className="relative aspect-4/3 w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
                {photo.imageUrl ? (
                  <>
                    <img
                      src={photo.imageUrl}
                      alt={`Frame #${photo.frameNumber} - ${photo.notes}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                    <button
                      onClick={() => setSelectedPhotoForZoom(photo)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                      title="Zoom photo preview"
                    >
                      <ZoomIn className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-neutral-400 border-y border-neutral-800">
                    <div className="flex items-center justify-between text-[10px] font-mono opacity-60">
                      <span>{photo.filmStock}</span>
                      <span>ISO {photo.ratedIso}</span>
                    </div>
                    <div className="text-center my-auto">
                      <div className="text-xs font-mono font-semibold text-neutral-300 mb-1">
                        {photo.shutterSpeed} · {photo.aperture}
                      </div>
                      <div className="text-[11px] text-neutral-500 line-clamp-2 italic px-2">
                        {photo.notes || 'Unscanned frame'}
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-neutral-500">
                      {photo.camera}
                    </div>
                  </div>
                )}
              </div>

              {/* Exposure Settings & Notes Box */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  {/* Primary Exposure Figures */}
                  <div className="flex items-center justify-between font-mono font-bold text-xs pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{photo.shutterSpeed}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
                      <Aperture className="w-3.5 h-3.5 text-amber-500" />
                      <span>{photo.aperture}</span>
                    </div>
                    <div className="text-neutral-500 font-normal">
                      ISO {photo.ratedIso}
                    </div>
                  </div>

                  {/* Gear line */}
                  <div className="text-xs pt-2 font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {photo.camera} · {photo.lens}
                  </div>

                  {/* Notes snippet */}
                  {photo.notes && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {photo.notes}
                    </p>
                  )}

                  {photo.location && (
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-1.5">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{photo.location}</span>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {photo.filterUsed && photo.filterUsed !== 'None' ? `Filter: ${photo.filterUsed}` : 'No Filter'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditPhoto(photo)}
                      className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                      title="Edit exposure notes"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete frame #${photo.frameNumber}?`)) {
                          onDeletePhoto(photo.id);
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors cursor-pointer"
                      title="Delete frame"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Preview Modal */}
      {selectedPhotoForZoom && (
        <div 
          onClick={() => setSelectedPhotoForZoom(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={e => e.stopPropagation()} 
            className="max-w-4xl max-h-[90vh] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 text-white flex flex-col"
          >
            <div className="p-3 border-b border-neutral-800 flex items-center justify-between font-mono text-xs">
              <span>FRAME #{selectedPhotoForZoom.frameNumber} · {selectedPhotoForZoom.filmStock}</span>
              <span>{selectedPhotoForZoom.shutterSpeed} @ {selectedPhotoForZoom.aperture} (ISO {selectedPhotoForZoom.ratedIso})</span>
            </div>
            <div className="overflow-auto flex-1 flex items-center justify-center p-2 bg-black">
              <img
                src={selectedPhotoForZoom.imageUrl}
                alt="Enlarged preview"
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="p-3 bg-neutral-900 text-xs text-neutral-300">
              <div className="font-semibold text-white mb-0.5">{selectedPhotoForZoom.camera} with {selectedPhotoForZoom.lens}</div>
              <p>{selectedPhotoForZoom.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
