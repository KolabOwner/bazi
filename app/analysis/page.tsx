'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FourPillarsChart } from '@/components/FourPillarsChart';
import { ElementsChart } from '@/components/ElementsChart';
import { YinYangChart } from '@/components/YinYangChart';
import { PatternsAnalysis } from '@/components/PatternsAnalysis';
import { BaZiChatbot } from '@/components/BaZiChatbot';
import { 
  calculateFourPillars, 
  calculateElements, 
  calculateYinYang, 
  analyzeBaZiPatterns 
} from '@/lib/bazi-calculator';

function AnalysisContent() {
  const searchParams = useSearchParams();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      const analysisId = searchParams.get('id');
      
      if (!analysisId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/get-analysis?id=${analysisId}`);
        
        if (response.ok) {
          const data = await response.json();
          setAnalysisData(data);
        } else {
          console.error('Failed to fetch analysis data');
          setAnalysisData(null);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setAnalysisData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Calculating your BaZi chart...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Analysis not found or MCP server unavailable.</p>
          <p className="text-sm text-gray-500">
            This application requires the Cantian AI MCP server for accurate BaZi calculations.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Analysis Results */}
          <div className="flex-1 lg:max-w-[700px] space-y-6">
            {/* User Info Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="bg-gradient-to-r from-amber-100 to-amber-50 -m-6 mb-6 p-6 rounded-t-lg">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-amber-900">
                    {analysisData.userInfo.nickname || 'BaZi Analysis'}
                  </h2>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Cantian AI MCP ✓
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>Gender: {analysisData.userInfo.gender === 'male' ? 'Male' : 'Female'}</div>
                  <div>Birthplace: {analysisData.userInfo.birthPlace}</div>
                  <div>Solar: {analysisData.userInfo.birthDate.toLocaleString()}</div>
                  <div>Lunar: {analysisData.mcpData?.lunarCalendar || '农历甲申年三月初三戊寅时'}</div>
                  {analysisData.mcpData?.eightCharacters && (
                    <div className="col-span-2 mt-1">
                      <span className="font-medium">Eight Characters: </span>
                      <span className="font-mono text-lg">{analysisData.mcpData.eightCharacters}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Four Pillars Chart */}
              <FourPillarsChart data={analysisData.fourPillars} />
            </div>

            {/* Elements Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Five Elements Analysis</h3>
              <ElementsChart data={analysisData.elements} />
            </div>

            {/* Yin-Yang Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Yin-Yang Balance</h3>
              <YinYangChart data={analysisData.yinYang} />
            </div>

            {/* BaZi Patterns */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">BaZi Patterns Analysis</h3>
              <PatternsAnalysis patterns={analysisData.patterns} />
            </div>
          </div>

          {/* Right Column - AI Chatbot */}
          <div className="flex-1 lg:max-w-[500px] sticky top-8 h-fit">
            <BaZiChatbot baziData={analysisData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    }>
      <AnalysisContent />
    </Suspense>
  );
}