import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Navigation, Clock, Truck, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ProviderCard({ provider }: { provider: any }) {
  return (
    <Link href={`/provider/${provider.id}`} className="block group">
      <Card className="h-full overflow-hidden flex flex-col bg-white border-slate-200/60 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 hover:-translate-y-1">
        
        {/* Image Area */}
        <div className="w-full h-48 bg-slate-100 relative overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={provider.image} 
            alt={provider.name}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=500&fit=crop'; e.currentTarget.onerror = null; }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {provider.isOpen ? (
               <div className="bg-emerald-500/95 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-sm tracking-wide">OPEN</div>
            ) : (
               <div className="bg-slate-800/95 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-sm tracking-wide">CLOSED</div>
            )}
          </div>
          {provider.hasEmergency && (
            <div className="absolute top-3 right-3 bg-red-600 text-white p-1.5 rounded-full shadow-sm">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-4 mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">{provider.name}</h3>
              <div className="text-xs font-bold tracking-wider text-orange-600/80 uppercase mt-1">{provider.type}</div>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md shrink-0 border border-amber-100/50">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-900">{provider.rating}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-500 font-medium mb-4 flex-1">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
              <span className="line-clamp-1">{provider.address}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {provider.services.slice(0, 2).map((service: string) => (
              <Badge key={service} variant="secondary" className="bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase tracking-wider rounded-md">
                {service}
              </Badge>
            ))}
            {provider.services.length > 2 && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-semibold text-[10px] uppercase tracking-wider rounded-md">
                +{provider.services.length - 2}
              </Badge>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100/80 flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
