import React from 'react';
import { ElementsAnalysis } from '@/types/bazi';
import { Trees, Flame, Mountain, Gem, Droplets } from 'lucide-react';

interface ElementsChartProps {
  data: ElementsAnalysis;
}

const ELEMENT_CONFIG = {
  wood: {
    label: 'Wood',
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    icon: Trees,
    description: 'Growth, flexibility, creativity',
  },
  fire: {
    label: 'Fire',
    color: 'bg-red-500',
    lightColor: 'bg-red-100',
    icon: Flame,
    description: 'Passion, transformation, energy',
  },
  earth: {
    label: 'Earth',
    color: 'bg-amber-600',
    lightColor: 'bg-amber-100',
    icon: Mountain,
    description: 'Stability, nurturing, grounding',
  },
  metal: {
    label: 'Metal',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-100',
    icon: Gem,
    description: 'Precision, determination, strength',
  },
  water: {
    label: 'Water',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    icon: Droplets,
    description: 'Wisdom, adaptability, flow',
  },
};

export function ElementsChart({ data }: ElementsChartProps) {
  const totalPercentage = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  return (
    <div className="space-y-4">
      {/* Circular Chart */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90">
            {(() => {
              let cumulativePercentage = 0;
              return Object.entries(data).map(([element, percentage]) => {
                const config = ELEMENT_CONFIG[element as keyof typeof ELEMENT_CONFIG];
                const strokeDasharray = `${(percentage / 100) * 314} 314`;
                const strokeDashoffset = -(cumulativePercentage / 100) * 314;
                cumulativePercentage += percentage;
                
                return (
                  <circle
                    key={element}
                    cx="96"
                    cy="96"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="40"
                    fill="none"
                    className={config.color.replace('bg-', 'text-')}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              });
            })()}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">Five</div>
              <div className="text-sm text-gray-600">Elements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-3">
        {Object.entries(data).map(([element, percentage]) => {
          const config = ELEMENT_CONFIG[element as keyof typeof ELEMENT_CONFIG];
          const Icon = config.icon;
          
          return (
            <div key={element} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">{config.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{percentage}%</span>
              </div>
              <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full ${config.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{config.description}</p>
            </div>
          );
        })}
      </div>

      {/* Analysis Summary */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-2">Element Balance Analysis</h4>
        <p className="text-sm text-gray-700">
          {(() => {
            const maxElement = Object.entries(data).reduce((max, [element, percentage]) =>
              percentage > max.percentage ? { element, percentage } : max,
              { element: '', percentage: 0 }
            );
            
            const minElement = Object.entries(data).reduce((min, [element, percentage]) =>
              percentage < min.percentage ? { element, percentage } : min,
              { element: '', percentage: 100 }
            );
            
            return `Your chart shows a strong ${maxElement.element} element (${maxElement.percentage}%), 
                    ${minElement.percentage === 0 
                      ? `with ${minElement.element} element completely absent.` 
                      : `with ${minElement.element} being the weakest (${minElement.percentage}%).`}
                    This suggests ${maxElement.percentage > 40 
                      ? 'an imbalanced elemental distribution that may require harmonization.' 
                      : 'a relatively balanced elemental composition.'}`;
          })()}
        </p>
      </div>
    </div>
  );
}