'use client';

import { useState, useRef } from 'react';
import { summarizeMedicalDocument } from '@/lib/ai';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, Info, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function MedicalAssistantPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File | null) => {
    setIsUploading(true);
    setFileError('');
    setIsProcessing(true);
    
    try {
      const summary = await summarizeMedicalDocument(file);
      setResult(summary);
    } catch (e: any) {
      setFileError(e.message || 'Failed to process document');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      return;
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFileError('Unsupported file type. Please upload a PDF, JPG, or PNG.');
      return;
    }

    processFile(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 pb-20">
      <div className="text-center space-y-3 md:space-y-4 pt-4 md:pt-8 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Understand your animal's medical report</h1>
        <p className="text-base md:text-lg text-slate-600 font-medium">Upload a lab report, prescription, or discharge summary for a simplified breakdown.</p>
      </div>

      {!result && !isProcessing && (
        <Card className="border-2 border-dashed border-slate-300 bg-white shadow-sm hover:border-orange-400 hover:bg-orange-50/10 transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-20 px-4 text-center">
            {isUploading ? (
              <div className="space-y-4 flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                <p className="font-bold text-slate-700">Uploading document...</p>
              </div>
            ) : (
              <div className="space-y-6 flex flex-col items-center max-w-sm">
                <div className="bg-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100">
                  <FileText className="w-10 h-10 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-slate-900 text-xl">Upload veterinary document</p>
                  <p className="text-sm font-medium text-slate-500">PDF, JPG, or PNG &middot; Max 5MB</p>
                </div>
                {fileError && <p className="text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-md font-bold w-full">{fileError}</p>}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                
                <Button onClick={() => fileInputRef.current?.click()} className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800 rounded-xl font-bold transition-all shadow-sm">
                  Upload Document
                </Button>
                
                <button 
                  onClick={() => processFile(null)} 
                  className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors uppercase tracking-wider"
                >
                  Try Sample Report
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-900">AI is reading the document...</h3>
              <p className="text-gray-500 text-sm">Extracting key findings and translating medical terms.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-orange-50 border border-orange-200 text-orange-900 p-4 rounded-xl flex gap-3 text-sm shadow-sm">
            <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <p><strong>Disclaimer:</strong> AI-generated information is for educational purposes and does not constitute veterinary diagnosis or treatment. Always consult a qualified veterinarian.</p>
          </div>

          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-emerald-900">DOCUMENT PROCESSED</span>
            </div>
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Pet: {result.pet?.name || 'Unknown'}</h2>
                <p className="text-sm text-slate-500 font-medium">Document: {result.documentType}</p>
              </div>
              <FileText className="w-6 h-6 text-slate-400" />
            </div>
            <CardContent className="p-8 space-y-8">
              
              {result.reportedFacts && result.reportedFacts.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">2. Reported Findings</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 font-medium">
                    {result.reportedFacts.map((fact: string, idx: number) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.labResults && result.labResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">3. Lab Results</h3>
                  <div className="grid gap-3">
                    {result.labResults.map((lab: any, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div>
                          <span className="font-bold text-slate-900">{lab.test}</span>
                          <div className="text-sm text-slate-500 mt-1">
                            {lab.value} {lab.unit} <span className="text-slate-400 text-xs">(Ref: {lab.referenceRange})</span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${lab.status === 'above_range' ? 'bg-orange-100 text-orange-800' : lab.status === 'below_range' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {lab.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.medications && result.medications.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">4. Medications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.medications.map((med: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <strong className="block text-slate-800">{med.name}</strong>
                        <div className="text-sm text-slate-500 mt-1">{med.dose} • {med.frequency} • {med.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.aiExplanation && result.aiExplanation.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">5. AI Explanation</h3>
                  <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-3">
                    {result.aiExplanation.map((exp: string, idx: number) => (
                      <p key={idx} className="text-slate-700 leading-relaxed font-medium text-sm">{exp}</p>
                    ))}
                  </div>
                </div>
              )}

              {result.questionsForVet && result.questionsForVet.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">6. Questions for your vet</h3>
                  <ul className="space-y-3">
                    {result.questionsForVet.map((q: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-800 bg-orange-50/50 border border-orange-100 p-4 rounded-xl font-medium">
                        <HelpCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-center pt-6 gap-3 sm:gap-4 px-4 sm:px-0">
            <Button onClick={() => {
              // MVP local storage simulation
              const passport = JSON.parse(localStorage.getItem('pawcare_passport') || '{"events": []}');
              passport.events.push({
                id: Date.now().toString(),
                date: new Date().toLocaleDateString(),
                title: result.documentType || 'Medical Report',
                type: 'Document Extract',
                extracted: { facts: result.reportedFacts || [] }
              });
              localStorage.setItem('pawcare_passport', JSON.stringify(passport));
              
              toast.success("Document added to Care Passport");
              setTimeout(() => router.push('/passport'), 1500);
            }} className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-6 rounded-full font-semibold transition-colors shadow-none text-base">
              Add to Care Passport
            </Button>
            <Link href={`/search?category=veterinary`} className="w-full sm:w-auto text-center inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full shadow-md font-semibold transition-colors h-12 sm:h-auto">
              Find relevant care
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
