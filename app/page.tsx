'use client';

import React, { useState } from 'react';
import { CalendarDays, Info } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthPlace, setBirthPlace] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!birthDate || !birthPlace) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    const formData = {
      nickname,
      gender,
      birthDate: birthDate.toISOString(),
      birthPlace,
    };

    try {
      const response = await fetch('/api/submit-birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/analysis?id=${data.id}`);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-[600px]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">BaZi AI</h1>
            <p className="text-gray-600">Discover Your Destiny Through Chinese Astrology</p>
          </div>

          <Tabs.Root defaultValue="solar" className="w-full">
            <Tabs.List className="grid grid-cols-2 rounded-lg border border-amber-600 bg-white p-1">
              <Tabs.Trigger
                value="solar"
                className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                Birthday (Solar)
              </Tabs.Trigger>
              <Tabs.Trigger
                value="bazi"
                className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              >
                BaZi (八字)
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="solar" className="mt-4">
              <div className="rounded-lg bg-white shadow-xl p-8">
                <div className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Please enter a nickname (optional)"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full border-b border-gray-300 pb-2 outline-none focus:border-amber-600 transition-colors text-gray-900 placeholder:text-gray-600"
                      maxLength={100}
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex rounded-full bg-gray-100 p-1">
                      <button
                        onClick={() => setGender('male')}
                        className={`px-6 py-2 rounded-full transition-all ${
                          gender === 'male'
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => setGender('female')}
                        className={`px-6 py-2 rounded-full transition-all ${
                          gender === 'female'
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setIsDatePickerOpen(true)}
                      className="w-full flex items-center border-b border-gray-300 pb-2 text-left hover:border-amber-600 transition-colors"
                    >
                      <CalendarDays className="w-4 h-4 mr-2 text-gray-600" />
                      <span className={birthDate ? 'text-gray-900' : 'text-gray-400'}>
                        {birthDate
                          ? format(birthDate, 'yyyy-MM-dd HH:mm:ss')
                          : 'Please select the Solar (Gregorian) birth date'}
                      </span>
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Please enter birthplace (e.g., city or region)"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      className="w-full border-b border-gray-300 pb-2 outline-none focus:border-amber-600 transition-colors text-gray-900 placeholder:text-gray-600"
                      maxLength={300}
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Based on NOAA standard, the most accurate true solar time.
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !birthDate || !birthPlace}
                    className="w-full py-4 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Start Exploring'}
                  </button>

                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>For entertainment purposes only!</span>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="bazi" className="mt-4">
              <div className="rounded-lg bg-white shadow-xl p-8">
                <p className="text-center text-gray-600">BaZi input coming soon...</p>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>

      <DatePicker
        value={birthDate}
        onChange={setBirthDate}
        open={isDatePickerOpen}
        onOpenChange={setIsDatePickerOpen}
      />
    </div>
  );
}
