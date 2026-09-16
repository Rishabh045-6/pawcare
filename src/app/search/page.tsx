'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { interpretCareRequest, matchProviders } from '@/lib/ai';
import { ProviderCard } from '@/components/ProviderCard';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { providers as mockProviders } from '@/data/mockData';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [loading, setLoading] = useState(true);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    async function loadResults() {
      setLoading(true);
      if (query) {
        const aiResult = await interpretCareRequest(query);
        setInterpretation(aiResult);
        const matches = await matchProviders(aiResult);
        setProviders(matches);
      } else if (category) {
        let matched = [...mockProviders];
        if (category === 'emergency') matched = matched.filter(p => p.hasEmergency || p.type === 'Emergency Hospital');
        if (category === 'ambulance') matched = matched.filter(p => p.type === 'Ambulance');
        if (category === 'boarding') matched = matched.filter(p => p.type === 'Boarding');
        if (category === 'ngo') matched = matched.filter(p => p.type === 'NGO / Rescue');
        setProviders(matched.sort((a, b) => a.distance - b.distance));
      } else {
        setProviders(mockProviders);
      }
      setLoading(false);
    }
    loadResults();
  }, [query, category]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {query ? `Results for "${query}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Services` : 'All Services'}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Found {providers.length} provider{providers.length === 1 ? '' : 's'} near you</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6 max-w-2xl mx-auto py-12">
          {query ? (
            <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-sm text-center space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-orange-500 animate-spin-slow" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="absolute top-0 right-0 w-4 h-4 bg-orange-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Routing your request...</h3>
                <div className="flex flex-col items-center gap-2 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-2 animate-pulse"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Understanding your request...</span>
                  <span className="flex items-center gap-2 animate-pulse" style={{ animationDelay: '500ms' }}><div className="w-2 h-2 rounded-full bg-blue-500"></div>Identifying care type...</span>
                  <span className="flex items-center gap-2 animate-pulse" style={{ animationDelay: '1000ms' }}><div className="w-2 h-2 rounded-full bg-amber-500"></div>Finding matching providers...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Finding the best care...</p>
            </div>
          )}
          {/* Skeleton Cards */}
          <div className="grid gap-4 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-48 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {interpretation && query && (
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-4 items-start mb-6">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-orange-100 shrink-0">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-sm font-bold text-orange-900 mb-4 uppercase tracking-wide">Here's what we understood:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-orange-900">
                      <div className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm flex flex-col">
                        <span className="text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-1">Animal</span>
                        <strong className="font-bold">{interpretation.species} ({interpretation.animal_type})</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm flex flex-col">
                        <span className="text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-1">Concern</span>
                        <strong className="font-bold line-clamp-2">{interpretation.concern}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm flex flex-col">
                        <span className="text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-1">Duration</span>
                        <strong className="font-bold">{interpretation.duration}</strong>
                      </div>
                      {interpretation.urgencyIndicators && interpretation.urgencyIndicators.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm flex flex-col col-span-2 md:col-span-3 bg-red-50/50">
                          <span className="text-red-600 text-[10px] font-bold uppercase tracking-wider mb-1">Urgency Indicators</span>
                          <strong className="font-bold text-red-700">{interpretation.urgencyIndicators.join(', ')}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-orange-200/50">
                  <h3 className="text-xs font-bold text-orange-900/60 mb-2 uppercase tracking-wide">Recommended Action</h3>
                  <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm">
                    {interpretation.suggestedService}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {interpretation?.emergencyFlag && (
            <div className="bg-red-50 border border-red-200 text-red-900 p-5 rounded-xl flex gap-4 text-sm shadow-sm items-start">
              <div className="bg-white p-2 rounded-lg shrink-0 text-red-600 shadow-sm">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-base mb-1">Potential Emergency Detected</strong>
                <p className="text-red-800 leading-relaxed font-medium">This sounds like an emergency. We have highlighted emergency-capable facilities below. Please call them before arriving.</p>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">No services found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
