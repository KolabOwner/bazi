import React from 'react';
import { TrendingUp, Star, Zap, Shield, Heart, Brain } from 'lucide-react';

interface PatternsAnalysisProps {
  patterns: string[];
}

const PATTERN_ICONS: { [key: string]: any } = {
  'Wealth': TrendingUp,
  'Academic': Brain,
  'Strong': Shield,
  'Missing': Zap,
  'Star': Star,
  'Achievement': Star,
};

function getPatternIcon(pattern: string) {
  for (const [key, icon] of Object.entries(PATTERN_ICONS)) {
    if (pattern.includes(key)) {
      return icon;
    }
  }
  return Heart;
}

function getPatternDescription(pattern: string): string {
  const descriptions: { [key: string]: string } = {
    'Strong Wood Element Pattern': 'Strong creativity and growth potential. Natural leadership in innovation and new ventures.',
    'Strong Fire Element Pattern': 'Passionate and transformative energy. Excellent communication and inspirational abilities.',
    'Strong Earth Element Pattern': 'Stable and nurturing personality. Natural mediator with strong organizational skills.',
    'Strong Metal Element Pattern': 'Disciplined and detail-oriented. Strong sense of justice and analytical abilities.',
    'Strong Water Element Pattern': 'Highly adaptable and wise. Deep intuition and excellent strategic thinking.',
    'Missing Wood Element': 'May benefit from developing creativity and flexibility. Consider activities that promote growth.',
    'Missing Fire Element': 'Could enhance passion and enthusiasm. Engaging in social activities may bring balance.',
    'Missing Earth Element': 'Might need more grounding and stability. Routine and organization can be beneficial.',
    'Missing Metal Element': 'Could strengthen discipline and precision. Structured learning may be helpful.',
    'Missing Water Element': 'May benefit from developing intuition and adaptability. Meditation could be valuable.',
    'Wealth Star Pattern': 'Natural affinity for financial success and material abundance. Good business acumen.',
    'Academic Achievement Pattern': 'Strong intellectual capabilities and learning potential. Success in scholarly pursuits.',
  };
  
  return descriptions[pattern] || 'A unique pattern in your BaZi chart that influences your life path.';
}

function getPatternType(pattern: string): 'positive' | 'neutral' | 'attention' {
  if (pattern.includes('Missing')) return 'attention';
  if (pattern.includes('Strong') || pattern.includes('Star') || pattern.includes('Achievement')) return 'positive';
  return 'neutral';
}

export function PatternsAnalysis({ patterns }: PatternsAnalysisProps) {
  return (
    <div className="space-y-4">
      {/* Pattern Cards */}
      <div className="grid gap-3">
        {patterns.map((pattern, index) => {
          const Icon = getPatternIcon(pattern);
          const type = getPatternType(pattern);
          const borderColor = type === 'positive' ? 'border-green-200' : 
                            type === 'attention' ? 'border-yellow-200' : 'border-gray-200';
          const bgColor = type === 'positive' ? 'bg-green-50' : 
                         type === 'attention' ? 'bg-yellow-50' : 'bg-gray-50';
          const iconColor = type === 'positive' ? 'text-green-600' : 
                           type === 'attention' ? 'text-yellow-600' : 'text-gray-600';
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${borderColor} ${bgColor} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-white ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{pattern}</h4>
                  <p className="text-sm text-gray-600">{getPatternDescription(pattern)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-2">Pattern Summary</h4>
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            Your BaZi chart reveals {patterns.length} significant patterns that shape your destiny and personality.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {patterns.filter(p => getPatternType(p) === 'positive').length > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {patterns.filter(p => getPatternType(p) === 'positive').length} Strength Patterns
              </span>
            )}
            {patterns.filter(p => getPatternType(p) === 'attention').length > 0 && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                {patterns.filter(p => getPatternType(p) === 'attention').length} Areas for Growth
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          {patterns.some(p => p.includes('Missing')) && (
            <li>• Consider activities that strengthen your missing elements for better balance.</li>
          )}
          {patterns.some(p => p.includes('Strong')) && (
            <li>• Leverage your dominant elements in career and personal development.</li>
          )}
          {patterns.some(p => p.includes('Wealth')) && (
            <li>• Your chart favors financial ventures - consider investment opportunities.</li>
          )}
          {patterns.some(p => p.includes('Academic')) && (
            <li>• Continuous learning and education will bring significant benefits.</li>
          )}
          <li>• Regular consultation with BaZi AI can provide personalized guidance.</li>
        </ul>
      </div>
    </div>
  );
}