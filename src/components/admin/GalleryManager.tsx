import React, { useState } from 'react';
import { GalleryItem, PageId } from '../../types';
import { useCMS } from '../../services/cmsStore';
import { ImageUploadField } from './ImageUploadField';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Camera,
  Plus,
  Edit3,
  Trash2,
  Search,
  ExternalLink,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

interface GalleryManagerProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ onNavigate, showToast }) => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useCMS();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const categories: GalleryItem['category'][] = [
    'Youth Session',
    'Discourse',
    'Workshop',
    'Shivir',
  ];

  const initialForm: Omit<GalleryItem, 'id'> = {
    title: '',
    year: '2026',
    category: 'Youth Session',
    caption: '',
    url: '',
    type: 'image',
    event: 'Bangalore Youth Assembly',
  };

  const [formData, setFormData] = useState<Omit<GalleryItem, 'id'>>(initialForm);

  const filteredItems = gallery.filter((item) => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.caption.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingItemId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItemId(item.id);
    setFormData({
      title: item.title,
      year: item.year,
      category: item.category,
      caption: item.caption,
      url: item.url || '',
      type: item.type || 'image',
      event: item.event || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.caption.trim()) {
      alert('Title and Caption are required.');
      return;
    }

    if (editingItemId) {
      updateGalleryItem(editingItemId, formData);
      showToast(`Updated gallery photo: "${formData.title}"`);
    } else {
      addGalleryItem(formData);
      showToast(`Uploaded new photo to gallery: "${formData.title}"`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteGalleryItem(deleteTarget.id);
    showToast(`Removed photo: "${deleteTarget.title}"`);
    setDeleteTarget(null);
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
              placeholder="Search gallery by title or caption..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 w-64 focus:outline-none focus:border-[#E59A1E]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white text-[#0C1B2A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('gallery')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Public Gallery</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Media Preview Container */}
              <div className="relative aspect-video bg-gradient-to-br from-[#0C1B2A] to-[#1A365D] overflow-hidden group">
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-2">
                    <ImageIcon className="w-8 h-8 text-[#E59A1E]/80" />
                    <span className="text-xs font-semibold text-white/90 line-clamp-2 px-2">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded">
                      Archive Graphic
                    </span>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#0C1B2A]/80 backdrop-blur-xs text-[#F3A628] text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit details"
                    className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Delete item"
                    className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-2 right-2 text-[10px] text-white/70 bg-black/60 px-2 py-0.5 rounded">
                  Year {item.year}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-[#0C1B2A] font-display line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E59A1E]" />
                {item.event || 'Pathshala Hall, Chickpet'}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Live on Gallery
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <Camera className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No gallery items in this category.</p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#0C1B2A] text-white text-xs font-semibold"
          >
            Upload a Photo Now
          </button>
        </div>
      )}

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-[#0C1B2A]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E59A1E]" />
                <h3 className="text-lg font-bold font-display text-[#0C1B2A]">
                  {editingItemId ? 'Edit Gallery Photo Record' : 'Upload Gallery Photo'}
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo Title / Assembly Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Desh To Aazad Ho Gaya, Hum Kab? — Youth Assembly"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>

              {/* Photo Upload Component */}
              <ImageUploadField
                label="Photo Image File (Click or Drag & Drop)"
                value={formData.url}
                onChange={(val) => setFormData({ ...formData, url: val })}
                aspectHint="Recommended 16:9 or 4:3 assembly photo"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as GalleryItem['category'],
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assembly Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Caption / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Provide context on attendees, activities, Sahebji's discourse, or learnings..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event / Location Tag
                </label>
                <input
                  type="text"
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  placeholder="e.g. Pathshala Hall, Chickpet Jain Temple, Bangalore"
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
                  {editingItemId ? 'Save Changes' : 'Upload to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Remove Photo from Gallery?"
        message="Are you sure you want to remove this photo from the public gallery?"
        itemTitle={deleteTarget?.title}
        confirmLabel="Remove Photo"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
