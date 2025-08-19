import { NextRequest, NextResponse } from 'next/server';
import { BaZiMCPService } from '@/lib/bazi-mcp-service';
import { TimezoneBaziService } from '@/lib/timezone-bazi-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, gender, birthDate, birthPlace } = body;

    if (!gender || !birthDate || !birthPlace) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a simple ID for the analysis session
    const analysisId = Math.random().toString(36).substring(2, 15);

    console.log('=== Submit Birth Chart Debug ===');
    console.log('Raw birthDate from client:', birthDate);
    console.log('Birth place:', birthPlace);
    console.log('Gender:', gender);
    console.log('================================');
    
    // Use timezone service to prepare proper input
    const timezoneService = new TimezoneBaziService();
    const { date, time } = timezoneService.parseClientDateTime(birthDate);
    
    const solarDatetime = timezoneService.prepareBaziInput({
      birthDate: date,
      birthTime: time,
      birthPlace: birthPlace,
      gender: gender
    });
    
    // Get BaZi MCP service instance
    const baziService = BaZiMCPService.getInstance();
    
    // Calculate BaZi using the properly formatted datetime
    const birth = new Date(solarDatetime);
    const baziData = await baziService.calculateBaZiBySolar(birth, gender, birthPlace);
    
    if (!baziData) {
      return NextResponse.json(
        { error: 'BaZi calculation failed. MCP server is required for accurate analysis.' },
        { status: 500 }
      );
    }

    console.log('BaZi calculated using Cantian AI MCP server');

    const sessionData = {
      id: analysisId,
      nickname,
      gender,
      birthDate,
      birthPlace,
      baziData,
      createdAt: new Date().toISOString(),
    };

    // TODO: Store sessionData in database
    // For now, we'll store it in a simple in-memory cache
    (global as any).baziSessions = (global as any).baziSessions || new Map();
    (global as any).baziSessions.set(analysisId, sessionData);

    return NextResponse.json({ 
      id: analysisId, 
      success: true,
      preview: {
        eightCharacters: baziData.eightCharacters,
        zodiac: baziData.zodiac,
        dayMaster: baziData.dayMaster
      }
    });
  } catch (error) {
    console.error('Error processing birth chart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}