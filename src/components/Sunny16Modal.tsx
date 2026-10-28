import React, { useState } from 'react';
import { X, Sun, Cloud, CloudSun, CloudFog, Umbrella, Check } from 'lucide-react';
import { ISO_VALUES } from '../types';

interface Sunny16ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySettings: (shutter: string, aperture: string, iso: number) => void;
  isDark?: boolean;
}

const LIGHTING_SCENARIOS = [
  {
    name: 'Direct Bright Sunlight / Snow / Sand',
    aperture: 'f/16',
    icon: Sun,
    description: 'Sharp, distinct dark shadows under direct sun.',
    accent: 'text-amber-500'
  },
  {
    name: 'Hazy Sunlight / Soft Sun',
    aperture: 'f/11',
    icon: CloudSun,
    description: 'Soft shadows with blurred edges; slight cloud veil.',
    accent: 'text-amber-400'
  },
  {
    name: 'Overcast / Bright Cloudy',
    aperture: 'f/8.0',
    icon: Cloud,
    description: 'Diffused light, barely discernible faint shadows.',
    accent: 'text-neutral-400'
  },
  {
    name: 'Heavy Overcast / Open Shade',
    aperture: 'f/5.6',
    icon: CloudFog,
    description: 'In the shadow of a building or under dense sky canopy.',
    accent: 'text-blue-400'
  },
  {
    name: 'Deep Shade / Golden Hour Sunset',
    aperture: 'f/4.0',
    icon: Umbrella,
    description: 'Dense forest, deep alleys, or twilight dusk.',
    accent: 'text-indigo-400'
  }
];

export const Sunny16Modal: React.FC<Sunny16ModalProps> = ({
  isOpen,
  onClose,
  onApplySettings,
  isDark = false
}) => {
  const [selectedIso, setSelectedIso] = useState<number>(400);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!isOpen) return null;

  // Base shutter speed corresponds to 1 / ISO
  const calculateBaseShutter = (iso: number): string => {
    if (iso <= 50) return '1/60s';
    if (iso <= 125) return '1/125s';
    if (iso <= 250) return '1/250s';
    if (iso <= 500) return '1/500s';
    if (iso <= 1000) return '1/1000s';
    if (iso <= 2000) return '1/2000s';
    return '1/4000s';
  };

  const currentScenario = LIGHTING_SCENARIOS[selectedIndex];
  const recommendedShutter = calculateBaseShutter(selectedIso);
  const recommendedAperture = currentScenario.aperture;

  // Reciprocal exposure pairs
  const equivalentPairs = [
    { ap: 'f/2.8', shutter: selectedIso >= 400 ? '1/4000s' : '1/2000s' },
    { ap: 'f/4.0', shutter: selectedIso >= 400 ? '1/2000s' : '1/1000s' },
    { ap: 'f/5.6', shutter: selectedIso >= 400 ? '1/1000s' : '1/500s' },
    { ap: 'f/8.0', shutter: selectedIso >= 400 ? '1/500s' : '1/250s' },
    { ap: 'f/11', shutter: selectedIso >= 400 ? '1/250s' : '1/125s' },
    { ap: 'f/16', shutter: selectedIso >= 400 ? '1/125s' : '1/60s' }
  ];

  const handleApply = (shutter: string, aperture: string) => {
    onApplySettings(shutter, aperture, selectedIso);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className={`w-full max-w-xl rounded-lg shadow-2xl overflow-hidden border transition-all ${
        isDark 
          ? 'bg-neutral-900 border-neutral-800 text-neutral-100' 
          : 'bg-[#faf7ee] border-amber-900/20 text-neutral-900'
      }`}>
        <div className={`h-2 w-full ${isDark ? 'bg-amber-600/40' : 'bg-amber-800/60'}`} />

        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-neutral-900/90' : 'border-amber-900/10 bg-[#f5f1e4]'
        }`}>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold tracking-tight">
              Sunny 16 Rule &amp; Exposure Calculator
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

        <div className="px-6 py-5 space-y-5">
          {/* Film ISO Selector */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-neutral-600 dark:text-neutral-300">
              Loaded Film ISO:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[50, 100, 200, 400, 800, 1600, 3200].map(iso => (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedIso(iso)}
                  className={`px-3 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                    selectedIso === iso
                      ? isDark 
                        ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400' 
                        : 'bg-neutral-900 text-white font-bold border-neutral-900'
                      : isDark 
                        ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700' 
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  ISO {iso}
                </button>
              ))}
            </div>
          </div>

          {/* Lighting Conditions Grid */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-neutral-600 dark:text-neutral-300">
              Ambient Lighting Condition:
            </label>
            <div className="space-y-2">
              {LIGHTING_SCENARIOS.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? isDark 
                          ? 'bg-amber-500/10 border-amber-500 text-white' 
                          : 'bg-amber-100/60 border-amber-800/40 text-neutral-900 shadow-xs'
                        : isDark 
                          ? 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800' 
                          : 'bg-white/80 border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${item.accent}`} />
                      <div>
                        <div className="text-xs font-bold">{item.name}</div>
                        <div className="text-[11px] text-neutral-500">{item.description}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
                      {item.aperture}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Box */}
          <div className={`p-4 rounded-lg border text-center ${
            isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-amber-900/15 shadow-xs'
          }`}>
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Calculated Sunny 16 Setting
            </div>
            <div className="font-mono font-bold text-2xl text-neutral-900 dark:text-amber-400">
              {recommendedShutter} · {recommendedAperture}
            </div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">
              with ISO {selectedIso} film stock
            </div>

            <button
              type="button"
              onClick={() => handleApply(recommendedShutter, recommendedAperture)}
              className={`mt-3 px-4 py-2 text-xs font-bold rounded transition-colors inline-flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' 
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Apply to New Exposure Log</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
