import { getGoogleFormViewUrl } from '../services/googleFormService';

export const SITE_CONFIG = {
  name: 'Jain Genius',
  tagline: 'The Change Makers',
  subTagline: 'Build a generation of Jain change-makers who lead with values.',
  initiativeOf: 'Param Pujya Muniraj Shri Bhuvanbhushanvijayji Maharajsaheb',
  targetAge: 'Youth (Age 15–30)',
  contact: {
    name: 'Gaurav',
    phone: '9480052108',
    phoneDisplay: '+91 94800 52108',
    whatsappUrl: 'https://wa.me/919480052108?text=Jai%20Jinendra%2C%20I%20am%20interested%20in%20joining%20Jain%20Genius%20-%20The%20Change%20Makers.',
    email: 'jaingeniustcm@gmail.com',
    whatsappGroupText: 'Jain G WhatsApp Group',
    whatsappGroupUrl: 'https://chat.whatsapp.com/invite/jaingenius-tcm',
  },
  social: {
    instagram: 'https://www.instagram.com/yashjhota',
    youtube: 'https://www.youtube.com/@jaingenius',
    whatsappCommunity: 'https://chat.whatsapp.com/invite/jaingenius-tcm',
    telegram: 'https://t.me/jaingeniusorg',
    twitter: 'https://x.com/jaingeniustcm',
  },
  memberPortalUrl: 'https://jaingeniusorg.lovable.app/',
  membershipDeposit: '₹1,000',
  membershipDepositNote: 'Refundable / Security Deposit towards learning resources & materials',
  currentTraineesCount: 24,
  programsCount: '9+',
  eventsCount: '12+',
  googleFormUrl: getGoogleFormViewUrl(),
};

export const NAV_ITEMS = [
  { id: 'home', labelEn: 'Home', labelHi: 'होम' },
  { id: 'about', labelEn: 'About', labelHi: 'परिचय' },
  { id: 'what-we-do', labelEn: 'What We Do', labelHi: 'कार्यक्षेत्र' },
  { id: 'programmes', labelEn: 'Programmes', labelHi: 'कार्यक्रम' },
  { id: 'events', labelEn: 'Events', labelHi: 'आयोजन' },
  { id: 'gallery', labelEn: 'Gallery', labelHi: 'गैलरी' },
  { id: 'impact', labelEn: 'Impact', labelHi: 'प्रभाव व अनुभव' },
  { id: 'membership', labelEn: 'Membership', labelHi: 'सदस्यता' },
  { id: 'news', labelEn: 'News', labelHi: 'समाचार' },
  { id: 'contact', labelEn: 'Contact', labelHi: 'संपर्क' },
] as const;
