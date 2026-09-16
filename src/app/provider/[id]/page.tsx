import { providers } from '@/data/mockData';
// removed notFound
import { MapPin, Phone, Clock, Star, AlertCircle, Truck, Navigation, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = providers.find(p => p.id === id);
  
  if (!provider) {
    return (
      <div className="space-y-6 pb-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-orange-100 p-4 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Provider not found</h1>
        <p className="text-slate-500 mb-6">The care provider you are looking for does not exist or has been removed.</p>
        <Link href="/search" className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-semibold transition-colors">
          Return to Find Care
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Link href="/search" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to search
      </Link>
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={provider.image} alt={provider.name} className="w-full h-64 object-cover bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=500&fit=crop'; e.currentTarget.onerror = null; }} />
        
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold tracking-wider text-orange-600 uppercase">{provider.type}</span>
                {provider.isOpen ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Open Now</Badge>
                ) : (
                  <Badge variant="secondary">Closed</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900">{provider.rating}</span>
                  <span className="text-gray-500">({provider.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {provider.distance} km away
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:min-w-48">
              <a href={`tel:${provider.contact}`} className="flex-1 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white shadow-sm h-11 px-8 rounded-lg font-medium transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.name + ' ' + provider.address)}`} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-100 text-slate-900 h-11 px-8 rounded-lg font-medium transition-colors">
                <Navigation className="w-4 h-4 mr-2" />
                Directions
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">About this location</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                    <span>{provider.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                    <span>{provider.hours}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Capabilities</h3>
                <div className="flex flex-col gap-2">
                  {provider.hasEmergency && (
                    <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-2 rounded-lg border border-red-100">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">24/7 Emergency Care Available</span>
                    </div>
                  )}
                  {provider.hasAmbulance && (
                    <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
                      <Truck className="w-4 h-4" />
                      <span className="font-medium">Ambulance Service Available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((service: string) => (
                    <Badge key={service} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Animals Supported</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.animals.map((animal: string) => (
                    <Badge key={animal} variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                      {animal}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
