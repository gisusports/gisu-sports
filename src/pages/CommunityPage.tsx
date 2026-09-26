import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Search, ShieldCheck, Sparkles, Filter, CheckCircle2, ChevronRight, RefreshCw, Trophy, BookOpen, RotateCcw } from 'lucide-react';
import { OAU_FACULTIES, SPORTS_LIST } from '../data/sportsData';

export const CommunityPage: React.FC = () => {
  const { idCards, refreshCardsFromCloud } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh registry from Supabase on mount
  useEffect(() => {
    refreshCardsFromCloud();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshCardsFromCloud();
    setIsRefreshing(false);
  };

  const normalizeFaculty = (f?: string) => (f || '').replace(/^Faculty of\s+/i, '').trim().toLowerCase();

  const filteredAthletes = idCards.filter((athlete) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      athlete.fullName.toLowerCase().includes(q) ||
      athlete.matricNumber.toLowerCase().includes(q) ||
      athlete.department.toLowerCase().includes(q) ||
      (athlete.cardNumber && athlete.cardNumber.toLowerCase().includes(q));
    const matchesFaculty =
      selectedFaculty === 'All' ||
      normalizeFaculty(athlete.faculty) === normalizeFaculty(selectedFaculty);
    const matchesSport = selectedSport === 'All' || athlete.sport === selectedSport;

    return matchesSearch && matchesFaculty && matchesSport;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFaculty('All');
    setSelectedSport('All');
  };

  return (
    <div className="space-y-16 pb-24 text-left bg-[#FFFFFF]">
      
      {/* 1. HERO HEADER BANNER (COHESIVE DEEP FOREST GREEN & LIME GREEN) */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20 bg-[#071E10] text-white overflow-hidden">
        {/* Ambient Glows & Grid */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#B5F438]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#15803D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#B5F438]/40 text-[#B5F438] text-xs font-mono font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>OFFICIAL OAU ATHLETE REGISTRY</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Verified Athlete <span className="text-[#B5F438]">Roster</span>
          </h1>

          <p className="text-base sm:text-lg text-[#CBD5E1] max-w-3xl leading-relaxed font-normal">
            Official public directory of accredited student-athletes representing Great Ife across all 15 OAU faculties and 15 varsity sports disciplines.
          </p>

          {/* Quick Counter Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#CBD5E1]">
            <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-white">
              Total Accredited: <strong className="text-[#B5F438]">{idCards.length}</strong>
            </span>
            <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-white">
              Showing Matches: <strong className="text-[#B5F438]">{filteredAthletes.length}</strong>
            </span>
            <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-white">
              Faculties: <strong className="text-[#B5F438]">{OAU_FACULTIES.length}</strong>
            </span>
            <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-white">
              Sports: <strong className="text-[#B5F438]">{SPORTS_LIST.length}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTERS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#071E10] uppercase">
              <Filter className="w-4 h-4 text-[#15803D]" />
              <span>FILTER ATHLETE DIRECTORY</span>
            </div>
            <div className="flex items-center gap-3">
              {(searchQuery || selectedFaculty !== 'All' || selectedSport !== 'All') && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-mono font-bold text-[#15803D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                title="Sync roster with latest verified registrations from cloud database"
                className="text-xs font-mono font-bold text-[#071E10] hover:text-[#15803D] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#15803D] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Registry'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athlete name, matric, department..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-xs sm:text-sm text-[#0B1220] outline-none transition-all shadow-xs"
              />
            </div>

            {/* Faculty Dropdown */}
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="py-3 px-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-xs sm:text-sm text-[#0B1220] outline-none transition-all shadow-xs cursor-pointer"
            >
              <option value="All">All 15 Faculties</option>
              {OAU_FACULTIES.map((fac) => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
            </select>

            {/* Sport Dropdown */}
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="py-3 px-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-xs sm:text-sm text-[#0B1220] outline-none transition-all shadow-xs cursor-pointer"
            >
              <option value="All">All 15 Sports Disciplines</option>
              {SPORTS_LIST.map((sport) => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. ATHLETE ROSTER GRID */}
        {filteredAthletes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-[#B5F438] transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Photo Container */}
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-[#071E10] border border-[#E2E8F0]">
                    <img
                      src={athlete.photoUrl}
                      alt={athlete.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#071E10]/80 backdrop-blur-md text-[#B5F438] border border-[#B5F438]/40 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3 h-3 text-[#B5F438]" />
                      <span>{athlete.status.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Athlete Info */}
                  <div>
                    <span className="text-[10px] font-mono text-[#15803D] font-bold block uppercase bg-[#EBFCD0] px-2.5 py-0.5 rounded-full w-fit mb-1.5">
                      {athlete.sport}
                    </span>
                    <h3 className="font-heading text-lg font-extrabold text-[#0B1220] leading-snug truncate">
                      {athlete.fullName}
                    </h3>
                  </div>

                  {/* Academic Details */}
                  <div className="p-3 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-1 text-xs text-[#64748B]">
                    <p className="truncate"><strong className="text-[#0B1220]">Faculty:</strong> {athlete.faculty}</p>
                    <p className="truncate"><strong className="text-[#0B1220]">Dept:</strong> {athlete.department}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-center text-xs font-mono font-bold text-[#15803D]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-[#F8FAF6] border-2 border-dashed border-[#E2E8F0] text-center space-y-4">
            <Users className="w-12 h-12 text-[#94A3B8] mx-auto" />
            <h3 className="font-heading text-xl font-bold text-[#0B1220]">No Athletes Found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              No registered athletes match your search query "{searchQuery}" or selected faculty/sport filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-[#071E10] text-[#B5F438] text-xs font-bold font-mono hover:bg-[#0B2A18] transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
