'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Stethoscope, AlertCircle, Truck, Heart, Home, ArrowRight, MapPin, Star, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { providers } from '@/data/mockData';
import { ProviderCard } from '@/components/ProviderCard';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { icon: Stethoscope, title: 'Veterinary', desc: 'Clinics & hospitals', href: '/search?category=veterinary' },
    { icon: AlertCircle, title: 'Emergency', desc: 'Urgent 24/7 care', href: '/search?category=emergency', highlight: true },
    { icon: Truck, title: 'Ambulance', desc: 'Medical transport', href: '/search?category=ambulance' },
    { icon: Heart, title: 'NGO & Rescue', desc: 'Shelters & support', href: '/search?category=ngo' },
    { icon: Home, title: 'Boarding', desc: 'Safe pet stays', href: '/search?category=boarding' },
  ];

  const nearbyProviders = providers.slice(0, 3); // Grab top 3

  return (
    <div className="space-y-16 pb-24">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-16 pb-8 max-w-3xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          Find the right care<br />
          <span className="text-orange-600">for your animal.</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          From vets and emergency care to ambulances and boarding, find trusted animal-care services near you.
        </p>
      </section>

      {/* AI SEARCH BOX */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tell us what your animal needs...</span>
          </div>
          <form onSubmit={handleSearch} className="relative p-2 md:p-3 flex items-center bg-white transition-all focus-within:bg-orange-50/10">
            <Input 
              type="text" 
              placeholder='"My dog hurt his leg and is bleeding"' 
              className="border-0 shadow-none focus-visible:ring-0 text-lg md:text-xl py-6 md:py-8 w-full bg-transparent placeholder:text-slate-300 font-medium text-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-xl bg-slate-900 text-white px-8 py-6 hover:bg-slate-800 font-semibold shadow-sm transition-colors text-base hidden sm:inline-flex shrink-0 ml-2">
              Find Care
            </Button>
            <Button type="submit" size="icon" className="rounded-xl bg-slate-900 text-white w-14 h-14 hover:bg-slate-800 shrink-0 sm:hidden ml-2">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-orange-600/80 uppercase tracking-wider bg-orange-100/50 px-2.5 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              AI-assisted care routing
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-5 gap-4 snap-x snap-mandatory hide-scrollbar">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href} className="block group shrink-0 w-[140px] sm:w-auto snap-start">
              <Card className={`h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-slate-200/60 ${cat.highlight ? 'bg-red-50 hover:border-red-200 border-red-100' : 'bg-white hover:border-orange-200'}`}>
                <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-xl transition-colors ${cat.highlight ? 'bg-red-100 text-red-600 group-hover:bg-red-200' : 'bg-slate-50 text-slate-700 group-hover:bg-orange-50 group-hover:text-orange-600'}`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm md:text-base ${cat.highlight ? 'text-red-900' : 'text-slate-900'}`}>{cat.title}</h3>
                    <p className={`text-xs mt-1 font-medium ${cat.highlight ? 'text-red-700/80' : 'text-slate-500'}`}>{cat.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* NEARBY CARE */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Nearby care</h2>
          <Link href="/search" className="text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyProviders.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>
    </div>
  );
}
