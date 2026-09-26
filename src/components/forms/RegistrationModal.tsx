import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { SITE_CONFIG } from '../../data/siteConfig';
import { CAREER_TRACKS_DATA } from '../../data/careerTracks';
import { Language } from '../../types';
import {
  submitContactDetailsToGoogleForm,
  getGoogleFormViewUrl,
  SubmissionResult,
} from '../../services/googleFormService';
import {
  X,
  CheckCircle2,
  Phone,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  defaultTrack?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  lang,
  defaultTrack = '',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    age: '',
    city: '',
    category: 'Student', // Student | Individual | Family
    careerTrack: defaultTrack || 'Account Executive',
    whyJoin: '',
    agreesToDAC: true,
  });

  const formUrl = getGoogleFormViewUrl();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // 1. Submit to Google Form
      const result = await submitContactDetailsToGoogleForm({
        name: formData.fullName,
        phone: formData.phone || formData.whatsappNumber,
        email: formData.email,
        category: formData.careerTrack,
        subject: `Membership Registration - ${formData.careerTrack}`,
        message: formData.whyJoin,
        source: 'registration_modal',
        metadata: {
          age: formData.age,
          city: formData.city,
          category: formData.category,
          whatsapp: formData.whatsappNumber || formData.phone,
          dacAgreed: formData.agreesToDAC ? 'Yes' : 'No',
        },
      });
      if (!result.success) {
        throw new Error(result.error || 'Registration submission was not accepted.');
      }
      setSubmissionResult(result);

      try {
        const stored = JSON.parse(localStorage.getItem('jg_registrations') || '[]');
        stored.unshift({
          ...formData,
          submittedAt: new Date().toISOString(),
          googleFormStatus: 'submitted',
        });
        localStorage.setItem('jg_registrations', JSON.stringify(stored.slice(0, 50)));
      } catch (storageError) {
        console.warn('Could not cache registration locally:', storageError);
      }

      setSubmitted(true);
    } catch (err) {
      console.warn('Registration submission note:', err);
      setSubmissionError('We could not send your registration. Please retry or use Open Form to submit directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Jai Jinendra Gaurav ji,\n\nI have submitted my registration for Jain Genius - The Change Makers.\n\nName: ${formData.fullName}\nAge: ${formData.age}\nCity: ${formData.city}\nTrack: ${formData.careerTrack}\nCategory: ${formData.category}\nPhone: ${formData.phone}\n\nPlease guide me on the ₹1,000 membership deposit and onboarding steps.`
  );

  const directWhatsAppUrl = `https://wa.me/91${SITE_CONFIG.contact.phone}?text=${whatsappMessage}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#081320]/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6"
    >
      <div className="relative w-full max-w-2xl bg-[#0C1B2A] border border-[#E59A1E]/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#081320]">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h3 id="registration-modal-title" className="text-base sm:text-lg font-bold text-[#FAF8F5] font-display">
                {lang === 'en' ? 'Membership Registration' : 'सदस्यता पंजीकरण'}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#E59A1E] font-medium">
                {SITE_CONFIG.name} — {SITE_CONFIG.tagline} • Age 15–30
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close registration dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 max-h-[82vh] sm:max-h-[78vh] overflow-y-auto">
          {submitted ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Registration request sent</span>
                </div>
                <h4 className="text-2xl font-bold text-[#FAF8F5] font-display">
                  {lang === 'en' ? 'Registration Received!' : 'पंजीकरण प्राप्त हुआ!'}
                </h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {lang === 'en'
                    ? `Thank you, ${formData.fullName || 'Member'}. Your details have been submitted to the official Google Form registry for the ${formData.careerTrack} track.`
                    : `धन्यवाद, ${formData.fullName || 'सदस्य'}। आपके आवेदन का विवरण आधिकारिक गूगल फॉर्म में दर्ज कर लिया गया है।`}
                </p>
              </div>

              {/* Next Steps: WhatsApp & Coordinator */}
              <div className="bg-[#112438] border border-[#E59A1E]/30 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F3A628] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Next Step: Onboarding & ₹1,000 Deposit</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To complete your verification and receive access to the Daily Activity Card (DAC) and member portal, please connect directly with our coordinator:
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0C1B2A] text-xs font-bold transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Details on WhatsApp</span>
                  </a>
                  <a
                    href={submissionResult?.prefilledUrl || formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#F3A628]" />
                    <span>View on Google Forms</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Close this window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Membership Key Information Banner */}
              <div className="bg-[#112438] border border-[#E59A1E]/30 rounded-2xl p-4 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#F3A628] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-[#FAF8F5] block">
                      Membership Deposit: {SITE_CONFIG.membershipDeposit} (Refundable / Security)
                    </span>
                    <span className="text-slate-300 block">
                      Includes 60-session career track, shivir participation, Daily Activity Card (DAC), and live mentorship. Open to youth aged 15–30.
                    </span>
                  </div>
                </div>
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#F3A628] hover:text-white shrink-0 font-medium transition-colors"
                >
                  <span>Open Form</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Field Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Priyansh Shah"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-sm text-[#FAF8F5] placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Age (Target 15–30) *
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="35"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 21"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-sm text-[#FAF8F5] placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-sm text-[#FAF8F5] placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bangalore / Ahmedabad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-sm text-[#FAF8F5] placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-sm text-[#FAF8F5] placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Career Track
                  </label>
                  <select
                    value={formData.careerTrack}
                    onChange={(e) => setFormData({ ...formData, careerTrack: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#E59A1E]"
                  >
                    {CAREER_TRACKS_DATA.map((t) => (
                      <option key={t.id} value={t.title} className="bg-[#081320]">
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Membership Category (for record keeping, no fee variation) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Membership Record Category (Deposit ₹1,000 applies across all categories)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Student', 'Individual', 'Family'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        formData.category === cat
                          ? 'border-[#E59A1E] bg-[#E59A1E]/15 text-[#F3A628]'
                          : 'border-white/10 bg-[#081320] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* DAC Commitment checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="dac-agreement"
                  checked={formData.agreesToDAC}
                  onChange={(e) => setFormData({ ...formData, agreesToDAC: e.target.checked })}
                  required
                  className="mt-0.5 rounded border-white/20 text-[#E59A1E] focus:ring-[#E59A1E]"
                />
                <label htmlFor="dac-agreement" className="text-xs text-slate-300 cursor-pointer">
                  I commit to following the 14-task Daily Activity Card (DAC) under the theme <em>"Refine to Superfine"</em> and participating in youth sessions.
                </label>
              </div>

              {submissionError && (
                <p role="alert" className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
                  {submissionError}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-400 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Direct Google Form Sync</span>
                  </div>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <div>
                    Need help? Contact Gaurav at{' '}
                    <a href={`tel:${SITE_CONFIG.contact.phone}`} className="text-[#F3A628] underline">
                      {SITE_CONFIG.contact.phoneDisplay}
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] disabled:opacity-60 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0C1B2A]" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
