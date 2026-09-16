export const providers = [
  {
    id: 'happy-paws-veterinary-hospital',
    name: 'Happy Paws Veterinary Hospital',
    type: 'Veterinary Clinic',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 124,
    distance: 1.8,
    address: '14th Main Rd, HSR Layout, Bengaluru, Karnataka 560102',
    isOpen: true,
    hours: '9:00 AM - 9:00 PM',
    services: ['Consultation', 'Emergency care', 'Diagnostics', 'Surgery', 'Vaccination'],
    animals: ['Dogs', 'Cats', 'Birds'],
    hasEmergency: true,
    hasAmbulance: true,
    contact: '+91 9876543210'
  },
  {
    id: 'cupa-animal-rescue-center',
    name: 'CUPA Animal Rescue Center',
    type: 'NGO / Rescue',
    image: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 312,
    distance: 4.2,
    address: 'Koramangala, Bengaluru, Karnataka 560034',
    isOpen: true,
    hours: '24/7',
    services: ['Rescue', 'Shelter', 'Emergency care', 'Adoption'],
    animals: ['Dogs', 'Cats', 'Cows', 'Birds'],
    hasEmergency: true,
    hasAmbulance: true,
    contact: '+91 8765432109'
  },
  {
    id: 'indiranagar-pet-clinic',
    name: 'Indiranagar Pet Clinic',
    type: 'Veterinary Clinic',
    image: 'https://images.unsplash.com/photo-1628009368231-7710bfb72a6b?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 89,
    distance: 5.6,
    address: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
    isOpen: false,
    hours: '10:00 AM - 8:00 PM',
    services: ['Consultation', 'Vaccination', 'Grooming'],
    animals: ['Dogs', 'Cats'],
    hasEmergency: false,
    hasAmbulance: false,
    contact: '+91 7654321098'
  },
  {
    id: 'blue-cross-veterinary-emergency',
    name: 'Blue Cross Veterinary Emergency',
    type: 'Emergency Hospital',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 201,
    distance: 3.1,
    address: 'Jayanagar 4th Block, Bengaluru, Karnataka 560011',
    isOpen: true,
    hours: '24/7',
    services: ['Emergency care', 'Surgery', 'Diagnostics', 'ICU'],
    animals: ['Dogs', 'Cats', 'Small Pets'],
    hasEmergency: true,
    hasAmbulance: true,
    contact: '+91 9988776655'
  },
  {
    id: 'pawz-boarding-daycare',
    name: 'Pawz Boarding & Daycare',
    type: 'Boarding',
    image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaaa7?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 67,
    distance: 2.4,
    address: 'BTM Layout, Bengaluru, Karnataka 560068',
    isOpen: true,
    hours: '8:00 AM - 8:00 PM',
    services: ['Boarding', 'Daycare', 'Grooming'],
    animals: ['Dogs', 'Cats'],
    hasEmergency: false,
    hasAmbulance: false,
    contact: '+91 8877665544'
  },
  {
    id: 'quick-response-pet-ambulance',
    name: 'Quick Response Pet Ambulance',
    type: 'Ambulance',
    image: 'https://images.unsplash.com/photo-1517677122409-e85d1e2f89bb?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 145,
    distance: 0.5,
    address: 'Serving all Bengaluru (Based in Koramangala)',
    isOpen: true,
    hours: '24/7',
    services: ['Transport', 'Emergency Transport', 'Oxygen Support'],
    animals: ['Dogs', 'Cats', 'Large Animals'],
    hasEmergency: true,
    hasAmbulance: true,
    contact: '+91 7766554433'
  }
];

export const aiMockData = {
  interpretedSearch: {
    species: 'Dog',
    animal_type: 'Pet',
    concern: 'General health concern',
    duration: 'Unspecified',
    reportedSymptoms: [],
    urgencyIndicators: [],
    suggestedService: 'veterinary'
  },
  medicalReportSummary: {
    pet: { name: 'Bruno', species: 'Dog', breed: 'Golden Retriever', age: '4 years' },
    documentType: 'Blood Test Report',
    reportedFacts: [
      'Complete Blood Count (CBC) and Chemistry Panel performed.',
      'WBC count recorded at 18.5 x10^9/L (Reference: 6.0 - 17.0 x10^9/L).',
      'RBC, Platelets, and BUN within normal limits.',
      'Amoxicillin 250mg prescribed twice daily for 7 days.'
    ],
    labResults: [
      { test: 'WBC Count', value: '18.5', unit: 'x10^9/L', referenceRange: '6.0 - 17.0 x10^9/L', status: 'above_range' },
      { test: 'RBC Count', value: '6.2', unit: 'x10^12/L', referenceRange: '5.5 - 8.5 x10^12/L', status: 'within_range' },
      { test: 'Platelets', value: '250', unit: 'x10^9/L', referenceRange: '200 - 500 x10^9/L', status: 'within_range' },
      { test: 'BUN', value: '15', unit: 'mg/dL', referenceRange: '7 - 27 mg/dL', status: 'within_range' }
    ],
    medications: [
      { name: 'Amoxicillin', dose: '250mg', frequency: 'Twice daily', duration: '7 days' }
    ],
    symptoms: [],
    followUpItems: ['Recommend follow-up in 1 week', 'Consider probiotics'],
    aiExplanation: [
      'WBC (White Blood Cells) are part of the immune system. An elevated WBC count can sometimes indicate inflammation, stress, or an infection.',
      'Amoxicillin is a common antibiotic used to treat bacterial infections.',
      'Probiotics are sometimes recommended alongside antibiotics to help maintain healthy gut bacteria.'
    ],
    questionsForVet: [
      'What are the most common causes for an elevated WBC count in this context?',
      'Are there any further diagnostics or follow-up tests recommended?',
      'Should we monitor for any specific clinical signs at home?'
    ]
  },
  passportTimeline: {
    petProfile: {
      name: 'Bruno',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '4 years',
      sex: 'Male (Neutered)'
    },
    events: [
      {
        id: 'doc-1',
        date: 'Jan 12, 2026',
        title: 'Blood Test',
        type: 'Laboratory Report',
        extracted: {
          facts: [
            'CBC (Complete Blood Count) performed.',
            'WBC count recorded at 18.5 x10^9/L (Reference: 6.0 - 17.0).',
            'RBC, Platelets, and BUN within normal limits.'
          ]
        }
      },
      {
        id: 'doc-2',
        date: 'Feb 03, 2026',
        title: 'Prescription',
        type: 'Medication',
        extracted: {
          facts: [
            'Amoxicillin (250mg) prescribed.',
            'Dosage: Twice daily.',
            'Duration: 7 days.',
            'Probiotics recommended.'
          ]
        }
      },
      {
        id: 'doc-3',
        date: 'Mar 21, 2026',
        title: 'Follow-up Report',
        type: 'Clinical Notes',
        extracted: {
          facts: [
            'Follow-up observations: Symptoms resolved, appetite returned.',
            'Recommended follow-up: Continue standard tick/flea prevention.',
            'No further diagnostic tests requested.'
          ]
        }
      }
    ]
  }
};
