import React from 'react';
import { YinYangAnalysis } from '@/types/bazi';

interface YinYangChartProps {
  data: YinYangAnalysis;
}

export function YinYangChart({ data }: YinYangChartProps) {
  return (
    <div className="space-y-6">
      {/* Yin-Yang Symbol Visual */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer circle */}
            <circle cx="50" cy="50" r="48" fill="white" stroke="#d97706" strokeWidth="2"/>
            
            {/* Yang (light) half */}
            <path
              d="M 50,2 A 48,48 0 0,1 50,98 A 24,24 0 0,0 50,50 A 24,24 0 0,1 50,2"
              fill="#fbbf24"
            />
            
            {/* Yin (dark) half */}
            <path
              d="M 50,2 A 48,48 0 0,0 50,98 A 24,24 0 0,1 50,50 A 24,24 0 0,0 50,2"
              fill="#1f2937"
            />
            
            {/* Yang dot */}
            <circle cx="50" cy="26" r="6" fill="#1f2937"/>
            
            {/* Yin dot */}
            <circle cx="50" cy="74" r="6" fill="#fbbf24"/>
          </svg>
          
          {/* Percentage overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 rounded-lg p-2 shadow-lg">
              <div className="text-center">
                <div className="flex gap-2">
                  <span className="text-sm">Yang: <span className="font-bold">{data.yang}%</span></span>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm">Yin: <span className="font-bold">{data.yin}%</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Comparison */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Yang (陽) - Active, Bright, Masculine</span>
            <span className="text-sm font-bold text-gray-800">{data.yang}%</span>
          </div>
          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
              style={{ width: `${data.yang}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Yin (陰) - Passive, Dark, Feminine</span>
            <span className="text-sm font-bold text-gray-800">{data.yin}%</span>
          </div>
          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-700 to-gray-900 transition-all duration-500"
              style={{ width: `${data.yin}%` }}
            />
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Balance Interpretation</h4>
        <p className="text-sm text-gray-700">
          {(() => {
            const difference = Math.abs(data.yang - data.yin);
            if (difference <= 10) {
              return `Your Yin-Yang balance is remarkably harmonious with only a ${difference}% difference. 
                      This indicates a well-balanced personality with both active and receptive qualities.`;
            } else if (data.yang > data.yin) {
              return `Your chart shows Yang dominance (${difference}% higher than Yin). 
                      This suggests an active, outgoing nature with strong leadership qualities and initiative.`;
            } else {
              return `Your chart shows Yin dominance (${difference}% higher than Yang). 
                      This suggests a receptive, intuitive nature with strong empathetic and nurturing qualities.`;
            }
          })()}
        </p>
      </div>

      {/* Characteristics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-yellow-50 rounded-lg">
          <h5 className="font-semibold text-yellow-900 mb-1">Yang Qualities</h5>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Active and dynamic</li>
            <li>• Logical thinking</li>
            <li>• External focus</li>
            <li>• Assertive nature</li>
          </ul>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-1">Yin Qualities</h5>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Receptive and calm</li>
            <li>• Intuitive wisdom</li>
            <li>• Internal focus</li>
            <li>• Nurturing nature</li>
          </ul>
        </div>
      </div>
    </div>
  );
}