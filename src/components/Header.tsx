'use client';

import Link from 'next/link';
import { PawPrint, MapPin, Search, User, BookOpen } from 'lucide-react';
import { toast } from "sonner";

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-tr from-orange-600 to-orange-400 p-1.5 md:p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 duration-200">
              <PawPrint className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-slate-900 font-extrabold text-lg md:text-xl tracking-tight">PawCare</span>
          </Link>

          <button 
            onClick={() => toast("Location Services", { description: "Location is fixed to Bengaluru for this MVP prototype." })}
            className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <MapPin className="w-4 h-4 text-orange-500" />
            Bengaluru
          </button>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/search" className="hidden sm:flex text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            Find Care
          </Link>
          <Link href="/medical-assistant" className="hidden sm:flex text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            Medical Assistant
          </Link>
          <Link href="/passport" className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 p-2 sm:px-4 sm:py-2 rounded-lg transition-colors">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Care Passport</span>
          </Link>
          
          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
          
          <button onClick={() => toast("Profile", { description: "User profiles are not implemented in this prototype." })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all ml-1">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
