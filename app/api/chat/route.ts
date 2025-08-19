import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/genkit-config';
import { gemini15Flash } from '@genkit-ai/googleai';
import { BaZiMCPService } from '@/lib/bazi-mcp-service';

const SYSTEM_PROMPT = `You are Master Cantian, an expert BaZi (Chinese astrology) consultant with deep knowledge of:
- Four Pillars of Destiny (四柱命理) 
- Five Elements Theory (五行)
- Yin-Yang Balance (陰陽)
- Heavenly Stems and Earthly Branches (天干地支)
- Ten Gods System (十神)
- Deity Stars and Special Configurations (神煞)
- Luck Cycles and Timing (大运流年)
- Chinese Metaphysics and Fortune Telling

You have access to PRECISE BaZi calculations from Cantian AI's MCP server, ensuring 100% accuracy in:
- Calendar conversions (solar/lunar)
- Four Pillars calculations
- Hidden Stems (藏干)
- Ten Gods relationships
- Elemental clashes and combinations
- Deity stars and special patterns

Provide insightful, personalized guidance based on the user's accurate BaZi chart.
Be specific, helpful, and culturally respectful. Use both Chinese terms and English explanations.
Reference specific elements from their chart (stems, branches, ten gods, deity stars).
Keep responses concise but meaningful (2-3 paragraphs maximum).

When the BaZi data was calculated using the MCP server, you can be confident in its accuracy and provide detailed analysis. When using fallback data, acknowledge the limitations.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, baziData, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use precise MCP data for enhanced analysis
    if (!baziData.mcpData) {
      return NextResponse.json(
        { error: 'No precise BaZi data available. MCP server is required for accurate analysis.' },
        { status: 400 }
      );
    }

    const baziService = BaZiMCPService.getInstance();
    const mcpAnalysis = baziService.formatForAI(baziData.mcpData);
    
    const context = `
${mcpAnalysis}

CALCULATION SOURCE: Cantian AI MCP Server (100% Accurate)

User Question: ${message}

Please provide analysis based on the precise BaZi calculations above. You can confidently reference specific Ten Gods, Deity Stars, and complex relationships.
`;

    try {
      // Use Genkit to generate response
      const { text } = await ai.generate({
        model: gemini15Flash,
        prompt: `${SYSTEM_PROMPT}\n\n${context}`,
        config: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });

      return NextResponse.json({ response: text });
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      
      return NextResponse.json({
        error: 'AI analysis temporarily unavailable. Please try again.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}