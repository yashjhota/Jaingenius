import React, { useState } from 'react';
import { TestimonialSlot, PageId } from '../../types';
import { useCMS } from '../../services/cmsStore';
import { ImageUploadField } from './ImageUploadField';
import { ConfirmDialog } from './ConfirmDialog';
import {
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  User,
  Sparkles,
  Quote,
} from 'lucide-react';

interface TestimonialsManagerProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

export const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({
  onNavigate,
  showToast,
}) => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ slotId: number; name: string } | null>(null);

  const initialForm: Omit<TestimonialSlot, 'slotId'> = {
    label: 'Student Graduate',
    gender: 'boy',
    status: 'ready',
    studentName: '',
    trackOrProgramme: 'Account Executive Track / Banking',
    experienceText: '',
    avatarUrl: '',
    cohort: 'Cohort 01',
  };

  const [formData, setFormData] = useState<Omit<TestimonialSlot, 'slotId'>>(initialForm);

  const handleOpenCreate = () => {
    setEditingSlotId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot: TestimonialSlot) => {
    setEditingSlotId(slot.slotId);
    setFormData({
      label: slot.label,
      gender: slot.gender,
      status: slot.status,
      studentName: slot.studentName || '',
      trackOrProgramme: slot.trackOrProgramme || '60-Session Master Track',
      experienceText: slot.experienceText || '',
      avatarUrl: slot.avatarUrl || '',
      cohort: slot.cohort || 'Cohort 01',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.status === 'ready' && !formData.studentName?.trim()) {
      alert('Please provide student name when status is set to Ready.');
      return;
    }

    if (editingSlotId !== null) {
      updateTestimonial(editingSlotId, formData);
      showToast(`Updated testimonial for ${formData.studentName || formData.label}`);
    } else {
      addTestimonial(formData);
      showToast(`Added new testimonial for ${formData.studentName || formData.label}`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (slotId: number, name: string) => {
    setDeleteTarget({ slotId, name });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteTestimonial(deleteTarget.slotId);
    showToast(`Deleted testimonial slot #${deleteTarget.slotId}`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-[#0C1B2A] font-display">
            Student Transformations & Testimonial Slots
          </h3>
          <p className="text-xs text-slate-500">
            Publish completed student stories, photos, and track outcomes directly to the public Impact page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('impact')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Public Impact View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student Story</span>
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((slot) => {
          const isReady = slot.status === 'ready' && !!slot.studentName;

          return (
            <div
              key={slot.slotId}
              className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                isReady
                  ? 'bg-white border-slate-200/90 shadow-xs hover:border-[#E59A1E]/60'
                  : 'bg-slate-50/70 border-dashed border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                      isReady
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isReady ? 'Live Story' : 'In-Training Slot'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(slot)}
                      title="Edit slot"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#0C1B2A] hover:bg-slate-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(slot.slotId, slot.studentName || slot.label)}
                      title="Delete slot"
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isReady ? (
                  <div className="flex items-center gap-3 pt-1">
                    {slot.avatarUrl ? (
                      <img
                        src={slot.avatarUrl}
                        alt={slot.studentName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E59A1E]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E59A1E] to-[#B8780E] text-[#0C1B2A] font-bold flex items-center justify-center text-sm shadow-xs">
                        {slot.studentName?.charAt(0) || 'S'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-[#0C1B2A] font-display">
                        {slot.studentName}
                      </h4>
                      <p className="text-[11px] text-[#B8780E] font-medium">
                        {slot.trackOrProgramme}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 font-display">
                      Slot #{slot.slotId} • {slot.gender === 'boy' ? 'Boy Candidate' : 'Girl Candidate'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Reserved for graduate completion
                    </p>
                  </div>
                )}

                {isReady ? (
                  <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4">
                    "{slot.experienceText}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    [Click edit above to fill this slot with the student's name, photo, and verified testimony]
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{slot.label}</span>
                <span className="font-semibold text-[#E59A1E]">{slot.cohort || 'Cohort 01'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-[#0C1B2A]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#E59A1E]" />
                <h3 className="text-lg font-bold font-display text-[#0C1B2A]">
                  {editingSlotId ? `Edit Slot #${editingSlotId}` : 'Add Student Testimonial'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Slot Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'ready' | 'to_supply',
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  >
                    <option value="ready">Live Published Story</option>
                    <option value="to_supply">In-Training Placeholder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Candidate Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as 'boy' | 'girl',
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  >
                    <option value="boy">Boy Candidate</option>
                    <option value="girl">Girl Candidate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name {formData.status === 'ready' && '*'}
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Paras Kothari"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Label / Tag
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g. Student 1 (Boy)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Career Track / Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.trackOrProgramme}
                    onChange={(e) => setFormData({ ...formData, trackOrProgramme: e.target.value })}
                    placeholder="e.g. Account Executive Track / Banking"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cohort / Batch
                  </label>
                  <input
                    type="text"
                    value={formData.cohort}
                    onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                    placeholder="Cohort 01"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>
              </div>

              {/* Student Photo Upload */}
              <ImageUploadField
                label="Student Photo (Optional)"
                value={formData.avatarUrl}
                onChange={(val) => setFormData({ ...formData, avatarUrl: val })}
                aspectHint="Square photo recommended: 1:1"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Testimonial / Experience Text
                </label>
                <textarea
                  rows={4}
                  value={formData.experienceText}
                  onChange={(e) => setFormData({ ...formData, experienceText: e.target.value })}
                  placeholder="Describe how the 60-session track, 5:45 AM discipline, or Sahebji's guidance transformed their perspective and career..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] text-[#0C1B2A] text-xs font-bold shadow-xs hover:shadow"
                >
                  {editingSlotId ? 'Save Changes' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Testimonial Slot?"
        message="Are you sure you want to delete this testimonial? It will be removed from public display."
        itemTitle={deleteTarget ? `Slot #${deleteTarget.slotId}: ${deleteTarget.name}` : undefined}
        confirmLabel="Delete Testimonial"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
