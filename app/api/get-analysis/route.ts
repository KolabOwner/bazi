import { NextRequest, NextResponse } from 'next/server';
import { BaZiMCPService } from '@/lib/bazi-mcp-service';
import { 
  calculateFourPillars, 
  calculateElements, 
  calculateYinYang, 
  analyzeBaZiPatterns 
} from '@/lib/bazi-calculator';

interface SessionData {
  id: string;
  nickname: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
  baziData: {
    fourPillars?: {
      year?: { heavenlyStem?: string; earthlyBranch?: string; fiveElements?: string; yinYang?: string; tenGods?: string };
      month?: { heavenlyStem?: string; earthlyBranch?: string; fiveElements?: string; yinYang?: string; tenGods?: string };
      day?: { heavenlyStem?: string; earthlyBranch?: string; fiveElements?: string; yinYang?: string; tenGods?: string };
      hour?: { heavenlyStem?: string; earthlyBranch?: string; fiveElements?: string; yinYang?: string; tenGods?: string };
    };
    deityStars?: string[];
    [key: string]: unknown;
  };
  createdAt: string;
}

interface PillarData {
  heavenlyStem?: string;
  earthlyBranch?: string;
  fiveElements?: string;
  yinYang?: string;
  tenGods?: string;
}

declare global {
  var baziSessions: Map<string, SessionData> | undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('id');

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Get session data from memory (in production, use a database)
    const sessions = global.baziSessions || new Map();
    const sessionData = sessions.get(analysisId);

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    if (!sessionData.baziData) {
      return NextResponse.json(
        { error: 'No BaZi calculation data found. MCP server is required.' },
        { status: 404 }
      );
    }


    // Use the accurate MCP data
    const analysisResult = {
      userInfo: {
        nickname: sessionData.nickname,
        gender: sessionData.gender,
        birthDate: new Date(sessionData.birthDate),
        birthPlace: sessionData.birthPlace,
      },
      mcpData: sessionData.baziData,
      // Use the already formatted MCP data structure
      fourPillars: {
        year: {
          heavenlyStem: sessionData.baziData.fourPillars?.year?.heavenlyStem || '',
          earthlyBranch: sessionData.baziData.fourPillars?.year?.earthlyBranch || '',
          element: sessionData.baziData.fourPillars?.year?.fiveElements || '',
        },
        month: {
          heavenlyStem: sessionData.baziData.fourPillars?.month?.heavenlyStem || '',
          earthlyBranch: sessionData.baziData.fourPillars?.month?.earthlyBranch || '',
          element: sessionData.baziData.fourPillars?.month?.fiveElements || '',
        },
        day: {
          heavenlyStem: sessionData.baziData.fourPillars?.day?.heavenlyStem || '',
          earthlyBranch: sessionData.baziData.fourPillars?.day?.earthlyBranch || '',
          element: sessionData.baziData.fourPillars?.day?.fiveElements || '',
        },
        hour: {
          heavenlyStem: sessionData.baziData.fourPillars?.hour?.heavenlyStem || '',
          earthlyBranch: sessionData.baziData.fourPillars?.hour?.earthlyBranch || '',
          element: sessionData.baziData.fourPillars?.hour?.fiveElements || '',
        },
      },
      // Calculate elements and patterns based on MCP data
      elements: calculateElementsFromMCP(sessionData.baziData),
      yinYang: calculateYinYangFromMCP(sessionData.baziData),
      patterns: generatePatternsFromMCP(sessionData.baziData),
    };


    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error retrieving analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions to convert MCP data to our format
function calculateElementsFromMCP(mcpData: SessionData['baziData']) {
  // Count elements from the four pillars using formatted data structure
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  // Mapping Chinese elements to English
  const elementMap: { [key: string]: keyof typeof elements } = {
    '木': 'wood',
    '火': 'fire', 
    '土': 'earth',
    '金': 'metal',
    '水': 'water'
  };
  
  const fourPillars = mcpData.fourPillars;
  if (fourPillars) {
    [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour]
      .forEach((pillar) => {
        if (pillar?.fiveElements) {
          const chineseElement = pillar.fiveElements;
          const englishElement = elementMap[chineseElement];
          if (englishElement) {
            elements[englishElement] += 1;
          }
        }
      });
  }
  
  // Convert to percentages
  const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
  if (total > 0) {
    Object.keys(elements).forEach(key => {
      elements[key as keyof typeof elements] = Math.round((elements[key as keyof typeof elements] / total) * 100);
    });
  }
  
  return elements;
}

function calculateYinYangFromMCP(mcpData: SessionData['baziData']) {
  let yin = 0;
  let yang = 0;
  
  const fourPillars = mcpData.fourPillars;
  if (fourPillars) {
    [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour]
      .forEach((pillar) => {
        if (pillar?.yinYang) {
          const yinYang = pillar.yinYang;
          if (yinYang === '阴') {
            yin += 1;
          } else if (yinYang === '阳') {
            yang += 1;
          }
        }
      });
  }
  
  const total = yin + yang;
  return {
    yin: total > 0 ? Math.round((yin / total) * 100) : 50,
    yang: total > 0 ? Math.round((yang / total) * 100) : 50,
  };
}

function generatePatternsFromMCP(mcpData: SessionData['baziData']): string[] {
  const patterns: string[] = [];
  
  // Add patterns based on MCP data using formatted structure
  const deityStars = mcpData.deityStars;
  if (deityStars && deityStars.length > 0) {
    patterns.push(...deityStars.slice(0, 3).map((star: string) => `${star} Pattern`));
  }
  
  // Analyze Ten Gods for patterns
  const fourPillars = mcpData.fourPillars;
  const tenGods = [
    fourPillars?.year?.tenGods,
    fourPillars?.month?.tenGods,
    fourPillars?.day?.tenGods,
    fourPillars?.hour?.tenGods,
  ].filter(Boolean);
  
  if (tenGods.includes('正财') || tenGods.includes('偏财')) {
    patterns.push('Wealth Star Pattern');
  }
  
  if (tenGods.includes('正印') || tenGods.includes('偏印')) {
    patterns.push('Academic Achievement Pattern');
  }
  
  if (tenGods.includes('正官') || tenGods.includes('七杀')) {
    patterns.push('Authority Pattern');
  }
  
  if (tenGods.includes('食神') || tenGods.includes('伤官')) {
    patterns.push('Creative Expression Pattern');
  }
  
  return patterns.length > 0 ? patterns : ['Balanced Constitution Pattern'];
}