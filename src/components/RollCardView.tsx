import React from 'react';
import { Film, Plus, Camera, CheckCircle2, Clock, Sparkles, Edit3, ArrowRight } from 'lucide-react';
import { RollSession, PhotoEntry } from '../types';
import { calculatePushPull, formatDate } from '../utils/helpers';

interface RollCardViewProps {
  rolls: RollSession[];
  photos: PhotoEntry[];
  onOpenNewRoll: () => void;
  onEditRoll: (roll: RollSession) => void;
  onLogFrameForRoll: (rollId: string) => void;
  onSelectPhoto: (photo: PhotoEntry) => void;
  isDark?: boolean;
}

export const RollCardView: React.FC<RollCardViewProps> = ({
  rolls,
  photos,
  onOpenNewRoll,
  onEditRoll,
  onLogFrameForRoll,
  onSelectPhoto,
  isDark = false
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Session Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Active Rolls &amp; Film Canisters</h2>
          <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Track rolls loaded in cameras, frame counts, and push/pull lab processing.
          </p>
        </div>
        <button
          onClick={onOpenNewRoll}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
            isDark 
              ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100' 
              : 'border-amber-900/20 bg-white hover:bg-amber-50 text-neutral-900 shadow-xs'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-amber-500" />
          <span>Load New Roll / Session</span>
        </button>
      </div>

      {/* Grid of Roll Canisters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rolls.map(roll => {
          const rollPhotos = photos
            .filter(p => p.rollId === roll.id)
            .sort((a, b) => Number(a.frameNumber) - Number(b.frameNumber));
          const exposedCount = rollPhotos.length;
          const totalFrames = roll.totalFrames || 36;
          const percentage = Math.min(100, Math.round((exposedCount / totalFrames) * 100));
          const pushPull = calculatePushPull(roll.boxIso, roll.ratedIso);

          return (
            <div
              key={roll.id}
              className={`rounded-lg border p-5 transition-all shadow-xs flex flex-col justify-between ${
                isDark 
                  ? 'bg-neutral-900/90 border-neutral-800 text-neutral-100 hover:border-neutral-700' 
                  : 'bg-[#faf6eb] border-amber-900/15 text-neutral-900 hover:border-amber-900/30'
              }`}
            >
              <div>
                {/* Header: Status and Edit */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      roll.status === 'in_camera' 
                        ? 'bg-emerald-500' 
                        : roll.status === 'developed' 
                          ? 'bg-neutral-400' 
                          : 'bg-amber-500'
                    }`} />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      {roll.status === 'in_camera' ? 'In Camera (Loaded)' : roll.status === 'developed' ? 'Developed & Scanned' : 'Finished / Lab'}
                    </span>
                  </div>

                  <button
                    onClick={() => onEditRoll(roll)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                    title="Edit roll details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Roll Name & Camera */}
                <h3 className="text-sm font-bold tracking-tight mb-1 line-clamp-1">
                  {roll.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{roll.camera}</span>
                  <span>·</span>
                  <span>{roll.filmStock}</span>
                </div>

                {/* ISO and Push/Pull Box */}
                <div className={`p-2.5 rounded border text-xs mb-4 font-mono ${
                  isDark ? 'bg-neutral-950/50 border-neutral-800' : 'bg-white/80 border-amber-900/10'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-neutral-500 text-[11px]">ISO / Rating:</span>
                    <span className="font-semibold">
                      {roll.boxIso} → {roll.ratedIso}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Lab Process:</span>
                    <span className={pushPull.stops !== 0 ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-neutral-500'}>
                      {pushPull.label}
                    </span>
                  </div>
                </div>

                {/* Frame Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-neutral-500">Exposed Frames:</span>
                    <span className="font-bold">
                      {exposedCount} <span className="text-neutral-400 font-normal">/ {roll.format === 'digital' ? '∞' : totalFrames}</span>
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                  }`}>
                    <div 
                      className="h-full bg-amber-500 transition-all duration-300" 
                      style={{ width: `${roll.format === 'digital' ? Math.min(100, exposedCount * 2) : percentage}%` }} 
                    />
                  </div>
                </div>

                {/* Recent Frames mini-list */}
                {rollPhotos.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Recent Frames
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rollPhotos.slice(-6).map(p => (
                        <button
                          key={p.id}
                          onClick={() => onSelectPhoto(p)}
                          className={`px-2 py-1 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                            isDark 
                              ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200' 
                              : 'bg-white hover:bg-amber-100 border-amber-900/15 text-neutral-800'
                          }`}
                          title={`Frame #${p.frameNumber}: ${p.shutterSpeed} @ ${p.aperture}`}
                        >
                          #{p.frameNumber}
                        </button>
                      ))}
                      {rollPhotos.length > 6 && (
                        <span className="text-[11px] text-neutral-400 self-center px-1">
                          +{rollPhotos.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {roll.notes && (
                  <p className="text-xs text-neutral-500 line-clamp-2 italic mb-3">
                    &quot;{roll.notes}&quot;
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onLogFrameForRoll(roll.id)}
                className={`w-full mt-2 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700' 
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Frame #{exposedCount + 1}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
