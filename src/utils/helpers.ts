import { PhotoEntry, RollSession, CameraGear, LensGear } from '../types';

export function calculatePushPull(boxIso: number, ratedIso: number): { stops: number; label: string } {
  if (!boxIso || !ratedIso || boxIso === ratedIso) {
    return { stops: 0, label: 'Box Speed (Normal)' };
  }
  const ratio = ratedIso / boxIso;
  const stops = Math.log2(ratio);
  const roundedStops = Math.round(stops * 10) / 10;

  if (roundedStops > 0) {
    return {
      stops: roundedStops,
      label: `+${roundedStops} stop${Math.abs(roundedStops) === 1 ? '' : 's'} (Push)`
    };
  } else {
    return {
      stops: roundedStops,
      label: `${roundedStops} stop${Math.abs(roundedStops) === 1 ? '' : 's'} (Pull)`
    };
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })} · ${d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })}`;
  } catch {
    return isoString;
  }
}

export function exportToCSV(photos: PhotoEntry[], rolls: RollSession[]): void {
  const rollMap = new Map(rolls.map(r => [r.id, r]));

  const headers = [
    'Frame / ID',
    'Roll Name',
    'Date & Time',
    'Camera Body',
    'Lens',
    'Film Stock / Sensor',
    'Box ISO',
    'Rated ISO',
    'Push / Pull',
    'Shutter Speed',
    'Aperture',
    'Exp Comp',
    'Metering',
    'Filter',
    'Location',
    'Description & Notes'
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = photos.map(p => {
    const roll = rollMap.get(p.rollId);
    const pushPull = calculatePushPull(p.boxIso, p.ratedIso).label;
    return [
      escapeCSV(`#${String(p.frameNumber).padStart(2, '0')}`),
      escapeCSV(roll ? roll.name : 'Unknown Roll'),
      escapeCSV(formatDateTime(p.timestamp)),
      escapeCSV(p.camera),
      escapeCSV(p.lens),
      escapeCSV(p.filmStock),
      escapeCSV(p.boxIso),
      escapeCSV(p.ratedIso),
      escapeCSV(pushPull),
      escapeCSV(p.shutterSpeed),
      escapeCSV(p.aperture),
      escapeCSV(p.exposureCompensation || '0'),
      escapeCSV(p.meteringMode || 'center-weighted'),
      escapeCSV(p.filterUsed || 'None'),
      escapeCSV(p.location || ''),
      escapeCSV(p.notes)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `exposure_log_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(
  photos: PhotoEntry[], 
  rolls: RollSession[], 
  cameras?: CameraGear[], 
  lenses?: LensGear[]
): void {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.1',
    rolls,
    photos,
    cameras: cameras || [],
    lenses: lenses || []
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `camera_log_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
