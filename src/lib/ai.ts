import { providers, aiMockData } from '@/data/mockData';

export async function interpretCareRequest(query: string) {
  try {
    const res = await fetch('/api/ai/care-router', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    // Silently fall back
  }

  // Fallback to mock processing
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('vomit') || lowerQuery.includes('weak') || lowerQuery.includes('sick')) {
    return {
      species: lowerQuery.includes('cat') ? 'cat' : lowerQuery.includes('dog') ? 'dog' : 'unspecified',
      animal_type: 'Pet',
      concern: 'Digestive concern / Weakness',
      duration: lowerQuery.includes('since') ? 'Recently reported' : 'Unspecified',
      reportedSymptoms: ['weakness', 'vomiting'],
      urgencyIndicators: ['weakness', 'repeated vomiting'],
      suggestedService: 'veterinary',
      emergencyFlag: lowerQuery.includes('weak')
    };
  }

  if (lowerQuery.includes('injur') || lowerQuery.includes('bleed') || lowerQuery.includes('accident')) {
    return {
      species: lowerQuery.includes('cat') ? 'cat' : lowerQuery.includes('dog') ? 'dog' : 'unspecified',
      animal_type: 'Pet',
      concern: 'Physical trauma / Injury',
      duration: 'Immediate',
      reportedSymptoms: ['bleeding', 'injury'],
      urgencyIndicators: ['bleeding', 'injury'],
      suggestedService: 'veterinary',
      emergencyFlag: true
    };
  }

  if (lowerQuery.includes('board') || lowerQuery.includes('stay') || lowerQuery.includes('travel')) {
    return {
      species: lowerQuery.includes('cat') ? 'cat' : lowerQuery.includes('dog') ? 'dog' : 'unspecified',
      animal_type: 'Pet',
      concern: 'Care during travel/absence',
      duration: 'Upcoming',
      reportedSymptoms: [],
      urgencyIndicators: [],
      suggestedService: 'boarding',
      emergencyFlag: false
    };
  }
  
  return {
    ...aiMockData.interpretedSearch,
    emergencyFlag: false
  };
}

export async function matchProviders(interpretation: any, allProviders = providers) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let matched = [...allProviders].map(p => ({ ...p, matchReasons: [] as string[] }));
  
  if (interpretation.emergencyFlag) {
    matched = matched.filter(p => p.hasEmergency || p.hasAmbulance || p.type === 'Emergency Hospital' || p.type === 'Ambulance');
    matched.forEach(p => p.matchReasons.push('Emergency care available'));
  } else if (interpretation.suggestedService === 'boarding') {
    matched = matched.filter(p => p.type === 'Boarding');
    matched.forEach(p => p.matchReasons.push('Provides boarding services'));
  } else if (interpretation.suggestedService === 'ngo') {
    matched = matched.filter(p => p.type === 'NGO / Rescue');
    matched.forEach(p => p.matchReasons.push('NGO / Rescue service'));
  } else if (interpretation.suggestedService === 'ambulance') {
    matched = matched.filter(p => p.type === 'Ambulance' || p.hasAmbulance);
    matched.forEach(p => p.matchReasons.push('Ambulance available'));
  } else {
    // default veterinary
    matched = matched.filter(p => p.type === 'Veterinary Clinic' || p.type === 'Emergency Hospital');
  }

  if (interpretation.species && interpretation.species.toLowerCase() !== 'unspecified') {
    const speciesLower = interpretation.species.toLowerCase();
    matched = matched.filter(p => p.animals.some(a => a.toLowerCase().includes(speciesLower)));
    matched.forEach(p => {
      p.matchReasons.push(`Supports ${speciesLower}s`);
    });
  }

  // Calculate generic distance & open status
  matched.forEach(p => {
    if (p.isOpen) {
      p.matchReasons.push('Open now');
    }
    p.matchReasons.push(`${p.distance} km away`);
  });

  return matched.sort((a, b) => a.distance - b.distance);
}

export async function summarizeMedicalDocument(file: File | null) {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('text', "Veterinary Report: Patient Bruno, Golden Retriever. WBC Count 18.5 x10^9/L (Ref: 6-17). RBC 6.2 x10^12/L (Ref 5.5-8.5). Platelets 250 x10^9/L. Amoxicillin 250mg prescribed twice daily for 7 days. Recommend follow-up in 1 week. Consider probiotics.");
    }

    const res = await fetch('/api/ai/document', {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Failed to parse document');
    }
  } catch (error) {
    console.error("Document AI Error:", error);
    // Fall back below
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));
  return aiMockData.medicalReportSummary;
}

export async function generateHealthSummary(timeline: any) {
  try {
    const res = await fetch('/api/ai/passport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeline })
    });
    
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    // Silently fall back
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    summary: "Bruno experienced a mild issue marked by an elevated WBC count in January. After a 7-day course of Amoxicillin in February, clinical signs resolved. By the March follow-up, he had returned to normal health with no ongoing issues.",
    questions: [
      "Are there any specific signs of the previous infection we should watch out for?",
      "Is it necessary to run another CBC to confirm the WBC count remains stable?",
      "Should we modify his diet or add any long-term probiotics?"
    ]
  };
}
