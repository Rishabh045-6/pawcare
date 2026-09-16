'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aiMockData } from '@/data/mockData';
import { generateHealthSummary } from '@/lib/ai';
import { Loader2, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PassportPage() {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const { petProfile } = aiMockData.passportTimeline;

  useEffect(() => {
    const saved = localStorage.getItem('pawcare_passport');
    if (saved) {
      setEvents(JSON.parse(saved).events || []);
    } else {
      setEvents(aiMockData.passportTimeline.events);
      localStorage.setItem('pawcare_passport', JSON.stringify({ events: aiMockData.passportTimeline.events }));
    }
  }, []);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const result = await generateHealthSummary({ petProfile, events });
    setSummaryData(result);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Care Passport</h1>
          <p className="text-slate-500 mt-2 font-medium">Health timeline for your animal</p>
        </div>
        <Link href="/medical-assistant" className="inline-flex items-center justify-center shrink-0 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors text-sm">
          Add Document
        </Link>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🐕</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{petProfile.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm font-medium text-slate-600">
                <span>{petProfile.breed} ({petProfile.species})</span>
                <span>&bull;</span>
                <span>{petProfile.age}</span>
                <span>&bull;</span>
                <span>{petProfile.sex}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!summaryData ? (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-blue-900 text-lg">Generate health summary</h3>
              <p className="text-blue-800 text-sm font-medium">Let AI summarize {petProfile.name}'s medical history for a quick overview.</p>
            </div>
            <Button onClick={handleGenerateSummary} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shrink-0 shadow-sm font-semibold">
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate Summary
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 shadow-sm animate-in fade-in slide-in-from-top-4">
          <CardContent className="p-6">
            <div className="flex gap-4 items-start mb-6">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-blue-100 shrink-0">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">AI Health Summary</h3>
                <p className="text-blue-900 font-medium leading-relaxed">{summaryData.summary}</p>
              </div>
            </div>
            
            <div className="pt-5 border-t border-blue-200/50">
              <h3 className="text-xs font-bold text-blue-900 mb-3 uppercase tracking-wide">Questions for your veterinarian</h3>
              <ul className="space-y-2">
                {summaryData.questions.map((q: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-blue-900 bg-white/60 p-3 rounded-lg text-sm font-medium border border-blue-100/50">
                    <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {events.map((item, idx) => (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-orange-200 transition-colors">
              <div className="flex flex-col gap-1 mb-3">
                <time className="text-xs font-bold tracking-widest text-orange-600 uppercase">{item.date}</time>
                <div className="font-bold text-slate-900 text-lg">{item.title}</div>
                <div className="text-xs font-medium text-slate-500">{item.type}</div>
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">AI Extracted Facts</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg">
                    {item.extracted.facts.map((fact: string, fIdx: number) => (
                      <li key={fIdx}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
