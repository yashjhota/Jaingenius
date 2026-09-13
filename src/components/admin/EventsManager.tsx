import React, { useState } from 'react';
import { EventItem, PageId } from '../../types';
import { useCMS } from '../../services/cmsStore';
import { ImageUploadField } from './ImageUploadField';
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  ExternalLink,
  X,
  Sparkles,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface EventsManagerProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

export const EventsManager: React.FC<EventsManagerProps> = ({ onNavigate, showToast }) => {
  const { events, addEvent, updateEvent, deleteEvent } = useCMS();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State
  const initialForm: Omit<EventItem, 'id'> = {
    title: '',
    subtitle: '',
    date: '',
    time: '2:30 PM – 4:00 PM',
    venue: 'Pathshala Hall, Chickpet Jain Temple, Bangalore',
    ageGroup: 'Age 15–30',
    entry: 'Free Entry (Registration Required)',
    conductor: 'Param Pujya Muniraj Shri Bhuvanbhushanvijayji Maharajsaheb',
    status: 'upcoming',
    description: '',
    keyTopics: ['Youth Mindset & Focus', 'Jain Principles in Daily Life'],
    posterImage: '',
    recap: '',
  };

  const [formData, setFormData] = useState<Omit<EventItem, 'id'>>(initialForm);
  const [topicInput, setTopicInput] = useState('');

  const filteredEvents = events.filter((ev) => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'upcoming' ? ev.status === 'upcoming' : ev.status === 'past';
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.conductor.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingEventId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: EventItem) => {
    setEditingEventId(ev.id);
    setFormData({
      title: ev.title,
      subtitle: ev.subtitle || '',
      date: ev.date,
      time: ev.time,
      venue: ev.venue,
      ageGroup: ev.ageGroup,
      entry: ev.entry,
      conductor: ev.conductor,
      status: ev.status,
      description: ev.description,
      keyTopics: ev.keyTopics ? [...ev.keyTopics] : [],
      posterImage: ev.posterImage || '',
      recap: ev.recap || '',
    });
    setIsModalOpen(true);
  };

  const handleAddTopic = () => {
    if (topicInput.trim() && !formData.keyTopics?.includes(topicInput.trim())) {
      setFormData({
        ...formData,
        keyTopics: [...(formData.keyTopics || []), topicInput.trim()],
      });
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (index: number) => {
    const updated = [...(formData.keyTopics || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, keyTopics: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date.trim()) {
      alert('Title and Date are mandatory.');
      return;
    }

    if (editingEventId) {
      updateEvent(editingEventId, formData);
      showToast(`Updated event: "${formData.title}"`);
    } else {
      addEvent(formData);
      showToast(`Created new event: "${formData.title}"`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the event "${title}"? This will remove it from the public website.`)) {
      deleteEvent(id);
      showToast(`Deleted event: "${title}"`);
    }
  };

  const handleToggleStatus = (ev: EventItem) => {
    const nextStatus = ev.status === 'upcoming' ? 'past' : 'upcoming';
    updateEvent(ev.id, { status: nextStatus });
    showToast(`Marked "${ev.title}" as ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events by title, venue, conductor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 w-64 focus:outline-none focus:border-[#E59A1E]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'upcoming', 'past'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilter(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === m ? 'bg-white text-[#0C1B2A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m} ({m === 'all' ? events.length : events.filter((e) => e.status === m).length})
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('events')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Public Events View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ev.status === 'upcoming'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {ev.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E59A1E]" />
                    {ev.date}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleStatus(ev)}
                    title={ev.status === 'upcoming' ? 'Mark as past' : 'Mark as upcoming'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(ev)}
                    title="Edit Event"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#0C1B2A] hover:bg-slate-100"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id, ev.title)}
                    title="Delete Event"
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {ev.posterImage && (
                <div className="rounded-xl overflow-hidden aspect-21/9 bg-slate-100 border border-slate-200">
                  <img
                    src={ev.posterImage}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h4 className="text-base font-bold text-[#0C1B2A] font-display line-clamp-1">
                  {ev.title}
                </h4>
                {ev.subtitle && (
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ev.subtitle}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ev.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ev.ageGroup}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ev.venue}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {ev.description}
              </p>

              {ev.keyTopics && ev.keyTopics.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {ev.keyTopics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-[#B8780E] border border-amber-200/60"
                    >
                      {topic}
                    </span>
                  ))}
                  {ev.keyTopics.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400">
                      +{ev.keyTopics.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate max-w-[200px]">By: {ev.conductor}</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {ev.entry}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <Calendar className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No events found matching your filter.</p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#0C1B2A] text-white text-xs font-semibold"
          >
            Create Your First Event
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-[#0C1B2A]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E59A1E]" />
                <h3 className="text-lg font-bold font-display text-[#0C1B2A]">
                  {editingEventId ? 'Edit Event Details' : 'Create New Event'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Desh To Aazad Ho Gaya, Hum Kab?"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. A youth session on overcoming PAIN: Possessiveness, Attitude, Inferiority..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 24 September 2026"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 2:30 PM – 4:00 PM"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Pathshala Hall, Chickpet Jain Temple, Bangalore"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'upcoming' | 'past' })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  >
                    <option value="upcoming">Upcoming Event</option>
                    <option value="past">Past / Archived Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age Group
                  </label>
                  <input
                    type="text"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    placeholder="e.g. Age 15–30"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Entry Details
                  </label>
                  <input
                    type="text"
                    value={formData.entry}
                    onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
                    placeholder="e.g. Free Entry (Registration Required)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Speaker / Conductor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.conductor}
                    onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}
                    placeholder="e.g. Param Pujya Muniraj Shri Bhuvanbhushanvijayji Maharajsaheb"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed explanation of the assembly theme, importance, and practical relevance..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                {/* Key Topics Tag Input */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Key Topics Covered (Tags)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopic();
                        }
                      }}
                      placeholder="Type topic and click Add (e.g. 'Overcoming Procrastination')"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTopic}
                      className="px-4 py-2 rounded-xl bg-[#0C1B2A] text-white text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.keyTopics?.map((topic, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs"
                      >
                        <span>{topic}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(i)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Poster Image Upload */}
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Event Banner / Poster"
                    value={formData.posterImage}
                    onChange={(val) => setFormData({ ...formData, posterImage: val })}
                    aspectHint="Recommended landscape banner: 16:9"
                  />
                </div>

                {/* Recap (for past events) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Recap / Turnout Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.recap}
                    onChange={(e) => setFormData({ ...formData, recap: e.target.value })}
                    placeholder="e.g. Over 180 youth attended. Daily Activity Cards distributed."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>
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
                  {editingEventId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
