import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Newspaper, Search, Plus, Calendar, User, X, Trash2, ArrowRight, Tag, Sparkles, Clock, Share2 } from 'lucide-react';
import { NewsItem } from '../types';

export const NewsPage: React.FC = () => {
  const { news, activeRole, addNewsItem, deleteNewsItem } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NewsItem['category']>('Office Update');

  const categories = ['All', 'Tournament', 'Trials', 'Office Update', 'Facilities', 'General'];
  const canPublish = activeRole === 'director' || activeRole === 'media_officer';

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addNewsItem({
      title: newTitle,
      excerpt: newExcerpt || newContent.substring(0, 120) + '...',
      content: newContent,
      category: newCategory,
      authorName: activeRole === 'director' ? 'Comrade Director of Sports' : 'Media Officer',
      authorRole: activeRole === 'director' ? 'Director of Sports' : 'Media Officer',
      imageUrl: '/player_action.jpg',
    });

    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
    setShowPublishModal(false);
  };

  return (
    <div className="space-y-16 pb-24 text-left bg-[#FFFFFF]">
      
      {/* 1. HERO HEADER BANNER (COHESIVE DEEP FOREST GREEN & LIME GREEN) */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20 bg-[#071E10] text-white overflow-hidden">
        {/* Ambient Glows & Grid */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#B5F438]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#15803D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#B5F438]/40 text-[#B5F438] text-xs font-mono font-bold uppercase tracking-wider">
                <Newspaper className="w-3.5 h-3.5" />
                <span>SPORTS OFFICE MEDIA & PRESS RELEASES</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                News & <span className="text-[#B5F438]">Announcements</span>
              </h1>

              <p className="text-base sm:text-lg text-[#CBD5E1] max-w-2xl leading-relaxed font-normal">
                Official tournament fixtures, trial notices, campus sports facility updates, and directives from the Director of Sports.
              </p>
            </div>

            {canPublish && (
              <button
                onClick={() => setShowPublishModal(true)}
                className="px-6 py-3.5 rounded-full bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Publish Announcement</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] shadow-xs">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#071E10] text-[#B5F438] shadow-sm'
                    : 'bg-[#FFFFFF] text-[#64748B] hover:text-[#0B1220] border border-[#E2E8F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news & notices..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none"
            />
          </div>
        </div>

        {/* 3. NEWS FEED GRID */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-[#B5F438] transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#071E10] border border-[#E2E8F0]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#071E10]/85 backdrop-blur-md text-[#B5F438] text-[10px] font-mono font-bold uppercase border border-[#B5F438]/30">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#64748B] font-mono mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#15803D]" />
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#15803D]" />
                        {item.authorRole}
                      </span>
                    </div>
                    <h2 className="font-heading text-xl font-extrabold text-[#0B1220] group-hover:text-[#15803D] transition-colors leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-xs text-[#64748B] leading-relaxed mt-2 line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#071E10]">
                  <span className="text-[#15803D] group-hover:underline">Read full article</span>
                  <ArrowRight className="w-4 h-4 text-[#15803D] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-[#F8FAF6] border-2 border-dashed border-[#E2E8F0] text-center space-y-3">
            <Newspaper className="w-12 h-12 text-[#94A3B8] mx-auto" />
            <h3 className="font-heading text-xl font-bold text-[#0B1220]">No Announcements Found</h3>
            <p className="text-xs text-[#64748B]">No items match your filter criteria.</p>
          </div>
        )}
      </section>

      {/* ARTICLE READER MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#F8FAF6] hover:bg-[#E2E8F0] text-[#0B1220] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-[#EBFCD0] text-[#15803D] text-xs font-mono font-bold uppercase border border-[#B5F438]/40">
                {selectedNews.category}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B1220] leading-tight">
                {selectedNews.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-[#64748B] font-mono border-b border-[#E2E8F0] pb-3">
                <span>By {selectedNews.authorName} ({selectedNews.authorRole})</span>
                <span>•</span>
                <span>{new Date(selectedNews.publishedAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="w-full h-64 rounded-2xl overflow-hidden bg-[#071E10]">
              <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-full object-cover" />
            </div>

            <div className="text-sm text-[#334155] leading-relaxed space-y-4 whitespace-pre-line font-normal">
              {selectedNews.content}
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              {canPublish && (
                <button
                  onClick={() => {
                    deleteNewsItem(selectedNews.id);
                    setSelectedNews(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Bulletin</span>
                </button>
              )}
              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 rounded-full bg-[#071E10] text-[#B5F438] text-xs font-bold font-mono cursor-pointer ml-auto"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH ANNOUNCEMENT MODAL */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowPublishModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#F8FAF6] hover:bg-[#E2E8F0] text-[#0B1220] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-heading text-2xl font-extrabold text-[#0B1220]">Publish Official Notice</h3>
              <p className="text-xs text-[#64748B]">Announcements appear live on the website news bulletin.</p>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0B1220] block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none cursor-pointer"
                >
                  <option value="Tournament">Tournament</option>
                  <option value="Trials">Trials & Screening</option>
                  <option value="Office Update">Office Update</option>
                  <option value="Facilities">Facilities Notice</option>
                  <option value="General">General Announcement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0B1220] block">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Official Inter-Faculty Fixtures Released"
                  className="w-full p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0B1220] block">Summary / Excerpt</label>
                <input
                  type="text"
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="Brief summary for preview cards..."
                  className="w-full p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0B1220] block">Full Content</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Detailed text of the official sports notice..."
                  className="w-full p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F8FAF6] text-[#64748B] hover:text-[#0B1220] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#071E10] text-[#B5F438] font-bold text-xs hover:bg-[#0B2A18] transition-colors cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
