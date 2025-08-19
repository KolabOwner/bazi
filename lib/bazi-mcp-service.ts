// BaZi MCP Service - Provides accurate BaZi calculations using Cantian AI's MCP server

interface BaZiMCPResponse {
  gender: string;
  solarCalendar: string;
  lunarCalendar: string;
  eightCharacters: string;
  zodiac: string;
  dayMaster: string;
  fourPillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  fetalElement: string;
  lifePalace: string;
  bodyPalace: string;
  deityStars: string[];
  luckCycles: LuckCycle[];
  elementalClashes: string[];
  emptyElements: string[];
  [key: string]: unknown;
}

interface PillarData {
  heavenlyStem: string;
  earthlyBranch: string;
  fiveElements: string;
  yinYang: string;
  tenGods: string;
  hiddenStems: string[];
  nayin: string;
  empty: boolean;
}

interface LuckCycle {
  age: number;
  heavenlyStem: string;
  earthlyBranch: string;
  period: string;
}

export class BaZiMCPService {
  private static instance: BaZiMCPService;
  private mcpAvailable: boolean = false;
  private initializationPromise: Promise<void>;

  private constructor() {
    this.initializationPromise = this.checkMCPAvailability();
  }

  public static getInstance(): BaZiMCPService {
    if (!BaZiMCPService.instance) {
      BaZiMCPService.instance = new BaZiMCPService();
    }
    return BaZiMCPService.instance;
  }

  private async ensureInitialized(): Promise<void> {
    await this.initializationPromise;
  }

  private async checkMCPAvailability(): Promise<void> {
    try {
      // Try to import the BaZi MCP module and check if main function exists
      const { getBaziDetail } = await import('bazi-mcp');
      if (typeof getBaziDetail === 'function') {
        this.mcpAvailable = true;
        console.log('BaZi MCP server is available');
      } else {
        throw new Error('getBaziDetail function not found');
      }
    } catch {
      console.warn('BaZi MCP server not available, using fallback calculations');
      this.mcpAvailable = false;
    }
  }

  /**
   * Calculate BaZi using solar (Gregorian) datetime
   */
  public async calculateBaZiBySolar(
    birthDate: Date,
    gender: 'male' | 'female' = 'male',
    birthPlace?: string
  ): Promise<BaZiMCPResponse | null> {
    await this.ensureInitialized();
    
    if (!this.mcpAvailable) {
      throw new Error('Cantian AI MCP server is not available. BaZi calculations cannot be performed.');
    }

    try {
      // Use the pre-formatted datetime directly (already timezone-adjusted)
      const solarDatetime = birthDate.toISOString();
      const genderCode = gender === 'male' ? 1 : 0;

      console.log('=== BaZi MCP Service Debug ===');
      console.log('Timezone-adjusted birth date for MCP:', birthDate);
      console.log('Solar datetime string:', solarDatetime);
      console.log('Birth place:', birthPlace);

      // Import and use the BaZi MCP
      const { getBaziDetail } = await import('bazi-mcp');
      
      const result = await getBaziDetail({
        solarDatetime,
        gender: genderCode,
        eightCharProviderSect: 2 // Use default setting
      });

      console.log('MCP calculated solar calendar:', result?.['阳历']);
      console.log('MCP hour pillar:', result?.['时柱']);
      console.log('==========================================');

      return this.formatMCPResponse(result);
    } catch (error) {
      console.error('Error calculating BaZi with MCP:', error);
      throw new Error('Failed to calculate BaZi using Cantian AI MCP server.');
    }
  }

  /**
   * Calculate BaZi using lunar datetime
   */
  public async calculateBaZiByLunar(
    lunarDatetime: string,
    gender: 'male' | 'female' = 'male'
  ): Promise<BaZiMCPResponse | null> {
    await this.ensureInitialized();
    
    try {
      if (!this.mcpAvailable) {
        return null;
      }

      const genderCode = gender === 'male' ? 1 : 0;
      const { getBaziDetail } = await import('bazi-mcp');
      
      const result = await getBaziDetail({
        lunarDatetime,
        gender: genderCode,
        eightCharProviderSect: 2
      });

      return this.formatMCPResponse(result);
    } catch (error) {
      console.error('Error calculating lunar BaZi with MCP:', error);
      return null;
    }
  }

  /**
   * Get possible solar dates for given BaZi
   */
  public async getSolarDatesForBaZi(baziString: string): Promise<string[] | null> {
    await this.ensureInitialized();
    
    try {
      if (!this.mcpAvailable) {
        return null;
      }

      const { getSolarTimes } = await import('bazi-mcp');
      const result = await getSolarTimes({ bazi: baziString });
      
      return result || [];
    } catch (error) {
      console.error('Error getting solar dates for BaZi:', error);
      return null;
    }
  }

  /**
   * Format the raw MCP response into our expected structure
   */
  private formatMCPResponse(rawResponse: Record<string, unknown>): BaZiMCPResponse {
    return {
      gender: (rawResponse['性别'] as string) || '',
      solarCalendar: (rawResponse['阳历'] as string) || '',
      lunarCalendar: (rawResponse['农历'] as string) || '',
      eightCharacters: (rawResponse['八字'] as string) || '',
      zodiac: (rawResponse['生肖'] as string) || '',
      dayMaster: (rawResponse['日主'] as string) || '',
      fourPillars: {
        year: this.formatPillar(rawResponse['年柱'] as Record<string, unknown>),
        month: this.formatPillar(rawResponse['月柱'] as Record<string, unknown>),
        day: this.formatPillar(rawResponse['日柱'] as Record<string, unknown>),
        hour: this.formatPillar(rawResponse['时柱'] as Record<string, unknown>),
      },
      fetalElement: (rawResponse['胎元'] as string) || '',
      lifePalace: (rawResponse['命宫'] as string) || '',
      bodyPalace: (rawResponse['身宫'] as string) || '',
      deityStars: (Object.values((rawResponse['神煞'] as Record<string, unknown>) || {}).flat() as string[]) || [],
      luckCycles: ((rawResponse['大运'] as Record<string, unknown>)?.['大运'] as LuckCycle[]) || [],
      elementalClashes: [],
      emptyElements: [],
    };
  }

  private formatPillar(pillarData: Record<string, unknown>): PillarData {
    if (!pillarData) {
      return {
        heavenlyStem: '',
        earthlyBranch: '',
        fiveElements: '',
        yinYang: '',
        tenGods: '',
        hiddenStems: [],
        nayin: '',
        empty: false,
      };
    }

    return {
      heavenlyStem: (pillarData['天干'] as string) || '',
      earthlyBranch: (pillarData['地支'] as string) || '',
      fiveElements: (pillarData['五行'] as string) || '',
      yinYang: (pillarData['阴阳'] as string) || '',
      tenGods: (pillarData['十神'] as string) || '',
      hiddenStems: [],
      nayin: (pillarData['纳音'] as string) || '',
      empty: pillarData['空亡'] ? true : false,
    };
  }

  /**
   * Check if MCP server is available
   */
  public async isMCPAvailable(): Promise<boolean> {
    await this.ensureInitialized();
    return this.mcpAvailable;
  }

  /**
   * Get comprehensive BaZi analysis text for AI prompts
   */
  public formatForAI(baziData: BaZiMCPResponse): string {
    return `
BaZi Chart Analysis (Calculated by Cantian AI MCP):

Basic Information:
- Gender: ${baziData.gender}
- Solar Calendar: ${baziData.solarCalendar}
- Lunar Calendar: ${baziData.lunarCalendar}
- Eight Characters: ${baziData.eightCharacters}
- Zodiac Animal: ${baziData.zodiac}
- Day Master: ${baziData.dayMaster}

Four Pillars Detail:
- Year Pillar: ${baziData.fourPillars.year.heavenlyStem}${baziData.fourPillars.year.earthlyBranch} (${baziData.fourPillars.year.fiveElements}, ${baziData.fourPillars.year.yinYang})
- Month Pillar: ${baziData.fourPillars.month.heavenlyStem}${baziData.fourPillars.month.earthlyBranch} (${baziData.fourPillars.month.fiveElements}, ${baziData.fourPillars.month.yinYang})
- Day Pillar: ${baziData.fourPillars.day.heavenlyStem}${baziData.fourPillars.day.earthlyBranch} (${baziData.fourPillars.day.fiveElements}, ${baziData.fourPillars.day.yinYang})
- Hour Pillar: ${baziData.fourPillars.hour.heavenlyStem}${baziData.fourPillars.hour.earthlyBranch} (${baziData.fourPillars.hour.fiveElements}, ${baziData.fourPillars.hour.yinYang})

Ten Gods Relationships:
- Year: ${baziData.fourPillars.year.tenGods}
- Month: ${baziData.fourPillars.month.tenGods}
- Day: ${baziData.fourPillars.day.tenGods}
- Hour: ${baziData.fourPillars.hour.tenGods}

Additional Elements:
- Fetal Element: ${baziData.fetalElement}
- Life Palace: ${baziData.lifePalace}
- Body Palace: ${baziData.bodyPalace}
- Deity Stars: ${baziData.deityStars.join(', ')}
- Empty Elements: ${baziData.emptyElements.join(', ')}
- Elemental Clashes: ${baziData.elementalClashes.join(', ')}

This data provides the foundation for accurate BaZi personality analysis, career guidance, relationship compatibility, and destiny forecasting.
    `.trim();
  }
}