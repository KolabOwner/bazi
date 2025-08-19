export interface BirthChartFormData {
  nickname?: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
}

export interface FourPillarsData {
  year: {
    heavenlyStem: string;
    earthlyBranch: string;
    element: string;
  };
  month: {
    heavenlyStem: string;
    earthlyBranch: string;
    element: string;
  };
  day: {
    heavenlyStem: string;
    earthlyBranch: string;
    element: string;
  };
  hour: {
    heavenlyStem: string;
    earthlyBranch: string;
    element: string;
  };
}

export interface ElementsAnalysis {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface YinYangAnalysis {
  yin: number;
  yang: number;
}

export interface BaZiAnalysis {
  fourPillars: FourPillarsData;
  elements: ElementsAnalysis;
  yinYang: YinYangAnalysis;
  patterns: string[];
}