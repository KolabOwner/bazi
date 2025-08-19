import React from 'react';
import { FourPillarsData } from '@/types/bazi';
import { Trees, Flame, Mountain, Gem, Droplets } from 'lucide-react';

interface FourPillarsChartProps {
  data: FourPillarsData;
}

const ELEMENT_COLORS = {
  wood: 'text-green-600',
  fire: 'text-red-600',
  earth: 'text-amber-700',
  metal: 'text-yellow-600',
  water: 'text-blue-600',
  '木': 'text-green-600',
  '火': 'text-red-600', 
  '土': 'text-amber-700',
  '金': 'text-yellow-600',
  '水': 'text-blue-600',
};

const ELEMENT_ICONS = {
  wood: Trees,
  fire: Flame,
  earth: Mountain,
  metal: Gem,
  water: Droplets,
  '木': Trees,
  '火': Flame,
  '土': Mountain,
  '金': Gem,
  '水': Droplets,
};

export function FourPillarsChart({ data }: FourPillarsChartProps) {
  const pillars = [
    { title: 'Year', data: data.year },
    { title: 'Month', data: data.month },
    { title: 'Day', data: data.day },
    { title: 'Hour', data: data.hour },
  ];

  return (
    <div>
      {/* Header Row */}
      <div className="grid grid-cols-5 gap-0 mb-0">
        <div className="bg-amber-700 text-white p-2 text-center text-sm font-medium"></div>
        {pillars.map((pillar) => (
          <div key={pillar.title} className="bg-amber-700 text-white p-2 text-center text-sm font-medium">
            {pillar.title}
          </div>
        ))}
      </div>

      {/* Heavenly Stems Row */}
      <div className="grid grid-cols-5 gap-0 border-x border-gray-300">
        <div className="bg-amber-50 p-3 text-center text-sm font-medium border-b border-gray-300">
          <div>Heavenly Stems</div>
          <div className="text-xs text-gray-600">(天干)</div>
        </div>
        {pillars.map((pillar) => {
          const elementKey = (typeof pillar.data.element === 'string' ? pillar.data.element : 'wood') as keyof typeof ELEMENT_ICONS;
          const ElementIcon = ELEMENT_ICONS[elementKey] || Trees; // Default fallback
          const colorClass = ELEMENT_COLORS[elementKey] || 'text-gray-600'; // Default fallback
          
          return (
            <div key={`stem-${pillar.title}`} className="bg-white p-3 text-center border-b border-gray-300">
              <div className={`text-2xl font-bold ${colorClass}`}>
                {typeof pillar.data.heavenlyStem === 'string' ? pillar.data.heavenlyStem : '?'}
              </div>
              <ElementIcon className={`w-5 h-5 mx-auto mt-1 ${colorClass}`} />
              <div className="text-xs text-gray-600 mt-1 capitalize">{typeof pillar.data.element === 'string' ? pillar.data.element : 'unknown'}</div>
            </div>
          );
        })}
      </div>

      {/* Earthly Branches Row */}
      <div className="grid grid-cols-5 gap-0 border-x border-b border-gray-300">
        <div className="bg-amber-100 p-3 text-center text-sm font-medium">
          <div>Earthly Branches</div>
          <div className="text-xs text-gray-600">(地支)</div>
        </div>
        {pillars.map((pillar) => {
          const elementKey = (typeof pillar.data.element === 'string' ? pillar.data.element : 'wood') as keyof typeof ELEMENT_COLORS;
          const colorClass = ELEMENT_COLORS[elementKey] || 'text-gray-600'; // Default fallback
          
          return (
            <div key={`branch-${pillar.title}`} className="bg-amber-50 p-3 text-center">
              <div className={`text-2xl font-bold ${colorClass}`}>
                {typeof pillar.data.earthlyBranch === 'string' ? pillar.data.earthlyBranch : '?'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}