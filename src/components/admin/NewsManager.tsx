import React, { useState } from 'react';
import { NewsArticle, PageId } from '../../types';
import { useCMS } from '../../services/cmsStore';
import { ImageUploadField } from './ImageUploadField';
import {
  Newspaper,
  Plus,
  Edit3,
  Trash2,
  Search,
  ExternalLink,
  X,
  Clock,
  Calendar,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';

interface NewsManagerProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

export const NewsManager: React.FC<NewsManagerProps> = ({ onNavigate, showToast }) => {
  const { news, addNewsArticle, updateNewsArticle, deleteNewsArticle } = useCMS();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const categories: NewsArticle['category'][] = [
    'Philosophy',
    'Career',
    'Youth Stories',
    'Announcements',
  ];

  const initialForm: Omit<NewsArticle, 'id'> = {
    title: '',
    category: 'Announcements',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: '3 min read',
    author: 'Jain Genius Editorial Wing',
    excerpt: '',
    fullBody: [''],
    imageUrl: '',
  };

  const [formData, setFormData] = useState<Omit<NewsArticle, 'id'>>(initialForm);
  const [bodyText, setBodyText] = useState('');

  const filteredNews = news.filter((art) => {
    const matchesCat = categoryFilter === 'All' || art.category === categoryFilter;
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      art.author.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingArticleId(null);
    setFormData(initialForm);
    setBodyText('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: NewsArticle) => {
    setEditingArticleId(art.id);
    setFormData({
      title: art.title,
      category: art.category,
      date: art.date,
      readTime: art.readTime,
      author: art.author,
      excerpt: art.excerpt,
      fullBody: art.fullBody ? [...art.fullBody] : [],
      imageUrl: art.imageUrl || '',
    });
    setBodyText(art.fullBody ? art.fullBody.join('\n\n') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      alert('Title and Excerpt are mandatory.');
      return;
    }

    const paragraphs = bodyText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const articleData = {
      ...formData,
      fullBody: paragraphs.length > 0 ? paragraphs : [formData.excerpt],
    };

    if (editingArticleId) {
      updateNewsArticle(editingArticleId, articleData);
      showToast(`Updated news article: "${formData.title}"`);
    } else {
      addNewsArticle(articleData);
      showToast(`Published news article: "${formData.title}"`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the article "${title}"?`)) {
      deleteNewsArticle(id);
      showToast(`Deleted article: "${title}"`);
    }
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
              placeholder="Search news, announcements, author..."
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
            onClick={() => onNavigate('news')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Public News View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 flex flex-col sm:flex-row items-start justify-between gap-6 transition-all"
          >
            <div className="space-y-2.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#B8780E] border border-amber-200/60">
                  {art.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {art.date}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readTime}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  By {art.author}
                </span>
              </div>

              <h4 className="text-base font-bold text-[#0C1B2A] font-display">
                {art.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {art.excerpt}
              </p>

              {art.fullBody && art.fullBody.length > 0 && (
                <div className="text-[11px] text-slate-400">
                  <span>{art.fullBody.length} paragraph(s) in full article</span>
                </div>
              )}
            </div>

            {art.imageUrl && (
              <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleOpenEdit(art)}
                title="Edit article"
                className="p-2 rounded-xl text-slate-500 hover:text-[#0C1B2A] hover:bg-slate-100 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(art.id, art.title)}
                title="Delete article"
                className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <Newspaper className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No articles found.</p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#0C1B2A] text-white text-xs font-semibold"
          >
            Write an Article or Announcement
          </button>
        </div>
      )}

      {/* Publish / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-[#0C1B2A]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#E59A1E]" />
                <h3 className="text-lg font-bold font-display text-[#0C1B2A]">
                  {editingArticleId ? 'Edit News / Announcement' : 'Publish New Article'}
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
                  Article / Announcement Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. First Batch of 6 CA Firm Interns Successfully Placed"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as NewsArticle['category'],
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
                    Publication Date
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 12 Sep 2026"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 3 min read"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author / Directorate Desk *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Jain Genius Editorial Wing"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary Excerpt (Teaser) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief 1-2 sentence preview displayed on cards..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Article Body (Separate paragraphs with double Enter)
                </label>
                <textarea
                  rows={6}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Write the full message, discourse notes, or announcement here..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>

              {/* Banner Photo Upload */}
              <ImageUploadField
                label="Article Feature Image (Optional)"
                value={formData.imageUrl}
                onChange={(val) => setFormData({ ...formData, imageUrl: val })}
                aspectHint="Recommended landscape banner: 16:9"
              />

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
                  {editingArticleId ? 'Save Changes' : 'Publish to News'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
