import { Programme } from '../types';

export const PROGRAMMES_DATA: Programme[] = [
  // Category A - Career, Finance & Professional Skills
  {
    id: 'prog-banking',
    title: 'Banking — Practical Sessions',
    titleHi: 'बैंकिंग — व्यावहारिक सत्र',
    category: 'CAREER / FINANCE / PROFESSIONAL',
    whatWasCovered: 'Banking explained in a hands-on, practical way (real operations, clearances, branch protocols, and live institutional interfaces, not just theory).',
    formatReach: 'Series of 3 sessions',
    duration: '3 Intensive Sessions',
    status: 'Ongoing',
    imagePlaceholderText: 'Practical Banking Lab & Financial Desk',
    outcomes: [
      'Understanding internal clearing house mechanisms and NEFT/RTGS/IMPS audit trails',
      'Hands-on KYC verification and commercial loan documentation fundamentals',
      'Practical banking compliance knowledge for corporate desks'
    ]
  },
  {
    id: 'prog-gst',
    title: 'GST for Graduates',
    titleHi: 'जीएसटी प्रशिक्षण (स्नातकों हेतु)',
    category: 'CAREER / FINANCE / PROFESSIONAL',
    whatWasCovered: 'Practical GST concepts taught along with live GST entries, tax code classifications, and return reconciliation directly in Tally Prime.',
    formatReach: 'Session(s) for graduates',
    duration: 'Multi-week Cohort',
    status: 'Ongoing',
    imagePlaceholderText: 'Live GST Filing & Tally Prime Lab',
    outcomes: [
      'GSTR-1, GSTR-3B preparation & input tax credit verification',
      'Error debugging in Tally Prime data entries',
      'Real-world invoice generation and e-way bill workflows'
    ]
  },
  {
    id: 'prog-accounting',
    title: 'Accounting (Practical)',
    titleHi: 'प्रैक्टिकल अकाउंटिंग एवं बही-खाता',
    category: 'CAREER / FINANCE / PROFESSIONAL',
    whatWasCovered: 'Practical accounting concepts, daily journalizing, ledger posting, inventory evaluation, and commercial book-keeping entries.',
    formatReach: 'Hands-on Sessions',
    duration: 'Ongoing Weekly Track',
    status: 'Ongoing',
    imagePlaceholderText: 'General Ledger & Financial Accounting Workshop',
    outcomes: [
      'Double-entry book-keeping for commercial businesses',
      'Bank reconciliation statement (BRS) preparation',
      'Trial balance generation and financial statement basics'
    ]
  },
  {
    id: 'prog-ca-internship',
    title: 'CA Firm Internship',
    titleHi: 'सीए फर्म में व्यावहारिक इंटर्नशिप',
    category: 'CAREER / FINANCE / PROFESSIONAL',
    whatWasCovered: 'Students placed at a Chartered Accountancy firm (alongside their college studies) to learn practical CA audit modules through real work.',
    formatReach: '6 students placed',
    duration: '3–6 Months On-Site',
    participants: '6 Members Placed',
    status: 'Ongoing',
    imagePlaceholderText: 'On-site CA Office Audit & Client Advisory',
    outcomes: [
      'Real audit client file preparation and voucher testing',
      'Direct mentorship from practicing Chartered Accountants',
      'Tangible work experience documented on the member\'s resume'
    ]
  },

  // Category B - Digital & Creative Skills
  {
    id: 'prog-ai-poster',
    title: 'AI Poster Making',
    titleHi: 'एआई पोस्टर मेकिंग व विजुअल डिज़ाइन',
    category: 'DIGITAL / CREATIVE',
    whatWasCovered: 'Designing posters using modern AI tools, taught step by step. Session topics include the "Edit & Upgrade Your Poster" activity with downloadable worksheets.',
    formatReach: 'Series of 7–8 sessions',
    duration: '8 Structured Sessions',
    status: 'Completed',
    imagePlaceholderText: 'Generative AI Prompting & Visual Layout Suite',
    outcomes: [
      'Mastery of prompt engineering for graphic layouts and event flyers',
      'Iterative refinement via the "Edit & Upgrade Your Poster" protocol',
      'Exporting print-ready and social-ready creative assets'
    ]
  },
  {
    id: 'prog-video-editing',
    title: 'Video Editing',
    titleHi: 'वीडियो एडिटिंग व डिजिटल स्टोरीटेलिंग',
    category: 'DIGITAL / CREATIVE',
    whatWasCovered: 'Practical video-editing skills: timeline management, b-roll sequencing, audio balancing, subtitles, and short-form video assembly.',
    formatReach: 'Coming Soon',
    duration: 'Upcoming 6-Week Cohort',
    status: 'Coming Soon',
    imagePlaceholderText: 'Video Timeline & Creative Suite Post-Production',
    outcomes: [
      'Timeline assembly and storytelling rhythm',
      'Color correction, audio cleanup and subtitle synchronization',
      'High-impact vertical video production for community channels'
    ]
  },

  // Category C - Health & Wellness
  {
    id: 'prog-yoga',
    title: 'Yoga Sessions',
    titleHi: 'दैनिक योग व समग्र फिटनेस',
    category: 'HEALTH / WELLNESS',
    whatWasCovered: 'Yoga conducted for members\' physical health, breath alignment, metabolic vitality, and mental concentration.',
    formatReach: 'Ongoing sessions',
    duration: 'Weekly Morning Routine',
    status: 'Ongoing',
    imagePlaceholderText: 'Morning Yogic Asanas & Pranayama Gathering',
    outcomes: [
      'Disciplined morning alignment and postural correction',
      'Pranayama techniques for nervous system calm',
      'Sustained mental concentration for academic and career rigor'
    ]
  },

  // Category D - Spiritual & Personal Growth
  {
    id: 'prog-leadership',
    title: 'Leadership Skills',
    titleHi: 'नेतृत्व क्षमता व टीम भावना',
    category: 'SPIRITUAL / PERSONAL GROWTH',
    whatWasCovered: 'Developing ethical leadership qualities, initiative taking, self-management, and empathy rooted in Jain values.',
    formatReach: 'Sessions',
    duration: 'Modular Series',
    status: 'Ongoing',
    imagePlaceholderText: 'Youth Leadership & Collaborative Problem Solving',
    outcomes: [
      'Ethical decision-making and accountability',
      'Empathetic teamwork and conflict de-escalation',
      'Leading community initiatives with selfless commitment'
    ]
  },
  {
    id: 'prog-public-speaking',
    title: 'Group Presentation',
    titleHi: 'सार्वजनिक वक्तृत्व व ग्रुप प्रेजेंटेशन',
    category: 'SPIRITUAL / PERSONAL GROWTH',
    whatWasCovered: 'Public speaking, overcoming stage hesitation, crafting persuasive visual presentations, and voice modulation.',
    formatReach: 'Activity Workshops',
    duration: 'Hands-on Exercises',
    status: 'Ongoing',
    imagePlaceholderText: 'Podium Presentation & Audience Engagement',
    outcomes: [
      'Overcoming stage anxiety through structured rehearsals',
      'Clear articulation of complex ideas under time limits',
      'Professional posture, body language, and Q&A handling'
    ]
  }
];
