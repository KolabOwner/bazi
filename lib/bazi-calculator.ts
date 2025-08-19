import { FourPillarsData, ElementsAnalysis, YinYangAnalysis } from '@/types/bazi';

const HEAVENLY_STEMS = {
  jia: { chinese: '甲', pinyin: 'Jia', element: 'wood', yin_yang: 'yang' },
  yi: { chinese: '乙', pinyin: 'Yi', element: 'wood', yin_yang: 'yin' },
  bing: { chinese: '丙', pinyin: 'Bing', element: 'fire', yin_yang: 'yang' },
  ding: { chinese: '丁', pinyin: 'Ding', element: 'fire', yin_yang: 'yin' },
  wu: { chinese: '戊', pinyin: 'Wu', element: 'earth', yin_yang: 'yang' },
  ji: { chinese: '己', pinyin: 'Ji', element: 'earth', yin_yang: 'yin' },
  geng: { chinese: '庚', pinyin: 'Geng', element: 'metal', yin_yang: 'yang' },
  xin: { chinese: '辛', pinyin: 'Xin', element: 'metal', yin_yang: 'yin' },
  ren: { chinese: '壬', pinyin: 'Ren', element: 'water', yin_yang: 'yang' },
  gui: { chinese: '癸', pinyin: 'Gui', element: 'water', yin_yang: 'yin' },
};

const EARTHLY_BRANCHES = {
  zi: { chinese: '子', pinyin: 'Zi', element: 'water', yin_yang: 'yang' },
  chou: { chinese: '丑', pinyin: 'Chou', element: 'earth', yin_yang: 'yin' },
  yin: { chinese: '寅', pinyin: 'Yin', element: 'wood', yin_yang: 'yang' },
  mao: { chinese: '卯', pinyin: 'Mao', element: 'wood', yin_yang: 'yin' },
  chen: { chinese: '辰', pinyin: 'Chen', element: 'earth', yin_yang: 'yang' },
  si: { chinese: '巳', pinyin: 'Si', element: 'fire', yin_yang: 'yin' },
  wu: { chinese: '午', pinyin: 'Wu', element: 'fire', yin_yang: 'yang' },
  wei: { chinese: '未', pinyin: 'Wei', element: 'earth', yin_yang: 'yin' },
  shen: { chinese: '申', pinyin: 'Shen', element: 'metal', yin_yang: 'yang' },
  you: { chinese: '酉', pinyin: 'You', element: 'metal', yin_yang: 'yin' },
  xu: { chinese: '戌', pinyin: 'Xu', element: 'earth', yin_yang: 'yang' },
  hai: { chinese: '亥', pinyin: 'Hai', element: 'water', yin_yang: 'yin' },
};

// Simplified BaZi calculation (for demonstration purposes)
// In reality, this would involve complex astronomical calculations
export function calculateFourPillars(birthDate: Date): FourPillarsData {
  // This is a simplified example - real BaZi calculation is much more complex
  const stems = Object.values(HEAVENLY_STEMS);
  const branches = Object.values(EARTHLY_BRANCHES);
  
  // Simplified calculation based on date components
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth();
  const day = birthDate.getDate();
  const hour = birthDate.getHours();
  
  return {
    year: {
      heavenlyStem: stems[year % 10].chinese,
      earthlyBranch: branches[year % 12].chinese,
      element: stems[year % 10].element,
    },
    month: {
      heavenlyStem: stems[month % 10].chinese,
      earthlyBranch: branches[month % 12].chinese,
      element: stems[month % 10].element,
    },
    day: {
      heavenlyStem: stems[day % 10].chinese,
      earthlyBranch: branches[day % 12].chinese,
      element: stems[day % 10].element,
    },
    hour: {
      heavenlyStem: stems[Math.floor(hour / 2) % 10].chinese,
      earthlyBranch: branches[Math.floor(hour / 2) % 12].chinese,
      element: stems[Math.floor(hour / 2) % 10].element,
    },
  };
}

export function calculateElements(fourPillars: FourPillarsData): ElementsAnalysis {
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  // Count elements from all pillars
  Object.values(fourPillars).forEach(pillar => {
    const element = pillar.element as keyof ElementsAnalysis;
    elements[element] += 1;
  });
  
  // Convert to percentages
  const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
  Object.keys(elements).forEach(key => {
    elements[key as keyof ElementsAnalysis] = Math.round((elements[key as keyof ElementsAnalysis] / total) * 100);
  });
  
  return elements;
}

export function calculateYinYang(fourPillars: FourPillarsData): YinYangAnalysis {
  let yin = 0;
  let yang = 0;
  
  // This would need proper calculation based on stems and branches
  // For now, simplified version
  Object.values(fourPillars).forEach((_, index) => {
    if (index % 2 === 0) {
      yang += 1;
    } else {
      yin += 1;
    }
  });
  
  const total = yin + yang;
  return {
    yin: Math.round((yin / total) * 100),
    yang: Math.round((yang / total) * 100),
  };
}

export function analyzeBaZiPatterns(fourPillars: FourPillarsData): string[] {
  // Simplified pattern analysis
  const patterns = [];
  const elements = calculateElements(fourPillars);
  
  // Check for dominant elements
  Object.entries(elements).forEach(([element, percentage]) => {
    if (percentage > 40) {
      patterns.push(`Strong ${element.charAt(0).toUpperCase() + element.slice(1)} Element Pattern`);
    }
  });
  
  // Check for missing elements
  Object.entries(elements).forEach(([element, percentage]) => {
    if (percentage === 0) {
      patterns.push(`Missing ${element.charAt(0).toUpperCase() + element.slice(1)} Element`);
    }
  });
  
  // Add some generic patterns for demonstration
  patterns.push('Wealth Star Pattern');
  patterns.push('Academic Achievement Pattern');
  
  return patterns;
}