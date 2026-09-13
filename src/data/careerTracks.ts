import { CareerTrack } from '../types';

export const COMMON_TRACK_STRUCTURE = {
  foundation: [
    'AI Basics for Daily Productivity',
    'Professional Email Drafting & Business Communication',
    'Core Computer Tools (MS Excel, Word, PowerPoint, Canva)'
  ],
  interviewPrep: [
    'Custom Resume & Portfolio Building',
    'Interview Skills & Mock Sessions with SWOT Analysis',
    'Structured Job Application & Professional Follow-up Process'
  ],
  enrichment: [
    'Curated free high-yield YouTube instructional channels',
    'Recommended low-cost / accredited certification courses'
  ]
};

export const CAREER_TRACKS_DATA: CareerTrack[] = [
  {
    id: 1,
    title: 'Account Executive',
    coreSkills: [
      'Basic Accounting',
      'Tally Prime',
      'Practical GST',
      'Advanced Excel',
      'AI Reports & Presentation'
    ],
    foundation: COMMON_TRACK_STRUCTURE.foundation,
    interviewPrep: COMMON_TRACK_STRUCTURE.interviewPrep,
    suggestedCertifications: [
      'Tally Prime Professional Certification',
      'GST Practitioner Fundamentals',
      'Advanced Excel for Financial Analysts'
    ]
  },
  {
    id: 2,
    title: 'Administration',
    coreSkills: [
      'Record Keeping',
      'Advanced Excel / Word / PPT',
      'Email Writing with AI',
      'Attendance & Basic HR'
    ],
    foundation: COMMON_TRACK_STRUCTURE.foundation,
    interviewPrep: COMMON_TRACK_STRUCTURE.interviewPrep,
    suggestedCertifications: [
      'Executive Administrative Assistant Diploma',
      'Office Automation & Document Workflow',
      'Basic Human Resources Management'
    ]
  },
  {
    id: 3,
    title: 'Digital Marketing',
    coreSkills: [
      'Advanced Canva',
      'AI Content Creation',
      'Flyers & Banner Collateral',
      'Excel Data Analysis',
      'Social Media Management'
    ],
    foundation: COMMON_TRACK_STRUCTURE.foundation,
    interviewPrep: COMMON_TRACK_STRUCTURE.interviewPrep,
    suggestedCertifications: [
      'Meta Certified Digital Marketing Associate',
      'Google Digital Garage Certification',
      'Canva Graphic Design Proficiency'
    ]
  },
  {
    id: 4,
    title: 'E-Commerce',
    coreSkills: [
      'Inventory Control',
      'Excel Reports & Dashboards',
      'AI (Product Listings & Copy)',
      'Catalog & Product Listing'
    ],
    foundation: COMMON_TRACK_STRUCTURE.foundation,
    interviewPrep: COMMON_TRACK_STRUCTURE.interviewPrep,
    suggestedCertifications: [
      'Amazon Trained E-commerce Specialist (ATES)',
      'Shopify Store Operations Basics',
      'Supply Chain & Inventory Management'
    ]
  },
  {
    id: 5,
    title: 'Sales',
    coreSkills: [
      'CRM System Workflows',
      'Advanced Excel',
      'AI Email Sequences',
      'Sales MIS & Pipeline Tracking'
    ],
    foundation: COMMON_TRACK_STRUCTURE.foundation,
    interviewPrep: COMMON_TRACK_STRUCTURE.interviewPrep,
    suggestedCertifications: [
      'HubSpot Inbound Sales Certification',
      'Salesforce Associate Fundamentals',
      'Professional Pitching & Negotiation'
    ]
  },
  {
    id: 6,
    title: 'Content & Design',
    coreSkills: [
      'Advanced Canva & PPT',
      'AI Tools & Creative Workflows',
      'Content Writing & Copywriting',
      'Branding Basics (Colour Psychology)'
    ],
    foundation: COMMON_TRACK_STRUCTURE.foundation,
    interviewPrep: COMMON_TRACK_STRUCTURE.interviewPrep,
    suggestedCertifications: [
      'Visual Storytelling & Layout Design',
      'Brand Identity & Color Psychology',
      'Digital Copywriting Mastery'
    ]
  },
  {
    id: 7,
    title: 'Procurement',
    coreSkills: [
      'Procurement Process & RFPs',
      'Vendor Management',
      'Inventory Management',
      'Advanced Excel',
      'AI Analysis & Price Benchmarking'
    ],
    foundation: COMMON_TRACK_STRUCTURE.foundation,
    interviewPrep: COMMON_TRACK_STRUCTURE.interviewPrep,
    suggestedCertifications: [
      'Certified Procurement Operations Associate',
      'Vendor Negotiation & Cost Analysis',
      'Commercial Contract & PO Management'
    ]
  },
  {
    id: 8,
    title: 'Customer Support',
    coreSkills: [
      'CRM Ticketing Systems',
      'Professional Communication Skills',
      'AI (Faster & Empathetic Replies)',
      'Complaint Resolution & Escalations'
    ],
    foundation: COMMON_TRACK_STRUCTURE.foundation,
    interviewPrep: COMMON_TRACK_STRUCTURE.interviewPrep,
    suggestedCertifications: [
      'Zendesk / Freshdesk Customer Service Specialist',
      'Effective Business Communication & De-escalation',
      'Omnichannel Support Management'
    ]
  }
];
