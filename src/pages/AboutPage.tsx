import React, { useState } from 'react';
import { EXECUTIVE_OFFICERS, FACILITIES_LIST, OAU_OFFICE_EMAIL } from '../data/sportsData';
import { Shield, Trophy, Building2, Mail, Phone, MapPin, Sparkles, CheckCircle2, Clock, Calendar, ArrowRight, ExternalLink, Award, Compass, Activity } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [aerialView, setAerialView] = useState<'arena' | 'boulevard'>('boulevard');
  return (
    <div className="space-y-16 pb-24 text-left bg-[#FFFFFF]">
      
      {/* 1. HERO HEADER BANNER (COHESIVE DEEP FOREST GREEN & LIME GREEN) */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20 bg-[#071E10] text-white overflow-hidden">
        {/* Soft Ambient Glows & Grid */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#B5F438]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#15803D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#B5F438]/40 text-[#B5F438] text-xs font-mono font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL MANDATE & GOVERNANCE</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center -space-x-3 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#B5F438] shadow-2xl bg-[#4A0E17] z-10">
                <img
                  src="/gisu_logo.jpg"
                  alt="Great Ife Students' Union Official Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/50 shadow-2xl bg-white z-0 p-1.5">
                <img
                  src="/oau_logo.jpg"
                  alt="Obafemi Awolowo University Crest"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Office of the <span className="text-[#B5F438]">Director of Sports</span>
              </h1>
              <span className="text-xs font-mono text-[#B5F438] font-bold block mt-1">
                Great Ife Students' Union • Obafemi Awolowo University
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg text-[#CBD5E1] max-w-3xl leading-relaxed font-normal">
            Great Ife Students' Union, Obafemi Awolowo University (OAU), Ile-Ife. Dedicated to varsity athletic excellence, official digital accreditation, modern sports infrastructure, and transparent sports governance.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
            {[
              { value: '15', label: 'OAU Faculties' },
              { value: '15', label: 'Sports Disciplines' },
              { value: '8+', label: 'Sports Facilities' },
              { value: '100%', label: 'Digital Accreditation' },
            ].map((stat, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#B5F438] block">
                  {stat.value}
                </span>
                <span className="text-xs text-[#94A3B8] font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THREE PILLARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-widest bg-[#EBFCD0] px-3.5 py-1 rounded-full border border-[#B5F438]/40">
            OUR CORE MANDATES
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0B1220] tracking-tight">
            Pillars of Great Ife Sports Administration
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Guiding our mission to nurture champions, verify legitimate participants, and upgrade campus sports facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Digital Sports Accreditation',
              desc: 'Issuing tamper-proof Digital Sports ID cards with scannable CODE128 barcodes to safeguard athlete eligibility across university games and national tournament screening.',
              icon: Shield,
              highlights: ['Anti-Mercenary Screening', 'Instant Barcode Verification', 'Faculty Roster Integration'],
            },
            {
              title: 'Inter-Faculty & Varsity Competition',
              desc: 'Organizing the annual Great Ife Inter-Faculty Games across 15 sports disciplines, and fielding elite OAU Giants varsity teams for NUGA, WAUG, and FASU.',
              icon: Trophy,
              highlights: ['15 Faculty Championship', 'Varsity Athlete Scouting', 'Medal Fixtures & Standings (Coming Soon • Anticipate)'],
            },
            {
              title: 'Facility Modernization & Welfare',
              desc: 'Maintaining OAU Sports Complex infrastructure, managing sports gear allocation, and responding transparently to student-athlete feedback and grants.',
              icon: Building2,
              highlights: ['Main Bowl Pitch Care', 'Equipment Allocation', '24/7 Grievance Tracking'],
            },
          ].map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-5 hover:shadow-lg hover:border-[#B5F438] transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#071E10] text-[#B5F438] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7 stroke-[2]" />
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-[#0B1220] leading-snug">{pil.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{pil.desc}</p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  {pil.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#0B1220]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. EXECUTIVE OFFICERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-widest bg-[#EBFCD0] px-3.5 py-1 rounded-full border border-[#B5F438]/40">
              OFFICE LEADERSHIP
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-[#0B1220] tracking-tight">Executive Officers & Advisors</h2>
          </div>
          <p className="text-xs text-[#64748B] max-w-md leading-relaxed">
            The dedicated student leaders and administrative directors coordinating sports operations across Great Ife.
          </p>
        </div>

        {/* 3A: PROMINENT DIRECTOR OF SPORTS SPOTLIGHT SHOWCASE */}
        {(() => {
          const director = EXECUTIVE_OFFICERS[0];
          const otherOfficers = EXECUTIVE_OFFICERS.slice(1);
          return (
            <div className="space-y-10">
              {/* Director of Sports Marquee Showcase Card */}
              <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-[#071E10] text-white border-2 border-[#B5F438]/40 shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Director's Large 4K Portrait */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[440px] sm:h-[480px] rounded-3xl overflow-hidden border-3 border-[#B5F438] shadow-2xl bg-[#0B2A18] group">
                      <img
                        src={director.photo}
                        alt={director.name}
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedFallback) {
                            target.dataset.triedFallback = 'true';
                            target.src = '/director_sports.jpg';
                          }
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Director's Profile & Mandate */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#B5F438] text-xs font-mono font-bold uppercase tracking-wider border border-[#B5F438]/30">
                      <Award className="w-3.5 h-3.5 text-[#B5F438]" />
                      <span>HEAD OF SPORTS OFFICE • GREAT IFE STUDENTS' UNION</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {director.name}
                      </h3>
                      <p className="text-sm font-mono text-[#B5F438] font-bold">
                        {director.role}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                      {director.bio}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-1">
                        <span className="text-[10px] font-mono text-[#B5F438] uppercase font-bold block">DIRECT OFFICIAL EMAIL</span>
                        <a href={`mailto:${director.email}`} className="text-xs font-mono text-white hover:text-[#B5F438] transition-colors flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-[#B5F438] shrink-0" />
                          <span className="truncate">{director.email}</span>
                        </a>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-1">
                        <span className="text-[10px] font-mono text-[#B5F438] uppercase font-bold block">SECRETARIAT HOTLINE</span>
                        <a href={`tel:${director.phone}`} className="text-xs font-mono text-white hover:text-[#B5F438] transition-colors flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#B5F438] shrink-0" />
                          <span>{director.phone}</span>
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#94A3B8]">
                      <span className="w-2 h-2 rounded-full bg-[#B5F438] animate-pulse" />
                      <span>Accreditation Authority • GISU Sports Secretariat, OAU Campus</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* 3B: SUPPORTING EXECUTIVE OFFICERS & ADVISORS WITH LARGE PHOTO CARDS */}
              <div className="space-y-4">
                <h3 className="font-heading font-extrabold text-xl text-[#0B1220] tracking-tight">
                  Executive Directorate & Secretariat Leadership
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {otherOfficers.map((off, idx) => (
                    <div key={idx} className="rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] overflow-hidden hover:shadow-xl hover:border-[#B5F438] transition-all flex flex-col justify-between group">
                      <div>
                        {/* 100% Unobscured High-Visibility Portrait */}
                        <div className="w-full h-72 sm:h-80 overflow-hidden bg-[#F1F5F9] relative border-b border-[#E2E8F0]">
                          <img
                            src={off.photo}
                            alt={off.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Officer Info Cleanly Positioned Below Image */}
                        <div className="p-5 sm:p-6 space-y-3 text-left">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBFCD0] text-[#15803D] font-mono font-bold text-[10px] uppercase tracking-wider border border-[#B5F438]/40">
                            {off.title}
                          </span>
                          
                          <div>
                            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#0B1220] leading-snug">
                              {off.name}
                            </h3>
                            <p className="text-xs text-[#15803D] font-mono font-bold mt-1">
                              {off.role}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-1">
                            {off.bio}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 pt-4 border-t border-[#E2E8F0] flex flex-col gap-2 text-xs font-mono text-[#0B1220]">
                        <a href={`mailto:${off.email}`} className="flex items-center gap-2 hover:text-[#15803D] transition-colors truncate">
                          <Mail className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                          <span className="truncate">{off.email}</span>
                        </a>
                        <a href={`tel:${off.phone}`} className="flex items-center gap-2 hover:text-[#15803D] transition-colors shrink-0">
                          <Phone className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                          <span>{off.phone}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })()}
      </section>

      {/* 4. CAMPUS FACILITIES DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-widest bg-[#EBFCD0] px-3.5 py-1 rounded-full border border-[#B5F438]/40">
              CAMPUS INFRASTRUCTURE
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-[#0B1220] tracking-tight">OAU Sports Complex Facilities</h2>
          </div>
          <p className="text-xs text-[#64748B] max-w-md leading-relaxed">
            Explore our competition and training venues located inside the university campus.
          </p>
        </div>

        {/* 4K AERIAL PANORAMA SHOWCASE */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#B5F438]/30 shadow-2xl bg-[#030D06] group text-left">
          
          {/* Unobstructed Aerial Viewport Canvas */}
          <div className="relative w-full h-[420px] sm:h-[500px] md:h-[560px] overflow-hidden bg-black">
            <img
              key={aerialView}
              src={aerialView === 'arena' ? '/oau_sports_complex_aerial.jpg' : '/oau_campus_boulevard_aerial.jpg'}
              alt={aerialView === 'arena' ? '4K Aerial Panorama of OAU Sports Complex Grounds' : '4K Aerial View of OAU Central Boulevard & Sports Complex'}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40 pointer-events-none" />

            {/* Corner Framing Brackets */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#B5F438] pointer-events-none z-20" />
            <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#B5F438] pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#B5F438] pointer-events-none z-20" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#B5F438] pointer-events-none z-20" />

            {/* Top Bar with View Switcher */}
            <div className="absolute top-5 left-5 right-5 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071E10]/90 backdrop-blur-md border border-[#B5F438]/40 text-[#B5F438] text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
                <Compass className="w-3.5 h-3.5 text-[#B5F438]" />
                <span>
                  {aerialView === 'arena' ? 'CAMPUS AERIAL OVERVIEW • SPORTS COMPLEX ARENA' : 'CAMPUS AERIAL OVERVIEW • CENTRAL BOULEVARD (ROAD 1)'}
                </span>
              </span>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-xl">
                <button
                  type="button"
                  onClick={() => setAerialView('boulevard')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    aerialView === 'boulevard'
                      ? 'bg-[#B5F438] text-[#071E10] shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Main Road & Corridor
                </button>
                <button
                  type="button"
                  onClick={() => setAerialView('arena')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    aerialView === 'arena'
                      ? 'bg-[#B5F438] text-[#071E10] shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Sports Complex Arena
                </button>
              </div>
            </div>

            {/* Bottom Subtle Overlay Strip */}
            <div className="absolute bottom-3 left-5 right-5 z-20 flex items-center justify-between text-[11px] font-mono text-white/80 pointer-events-none">
              <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B5F438] animate-pulse" />
                4K ULTRA HIGH DEFINITION // OAU ILE-IFE
              </span>
            </div>

          </div>

          {/* Dedicated Lower Console Deck (Positioned CLEANLY BELOW Image) */}
          <div className="p-6 sm:p-8 bg-[#071E10] border-t border-[#B5F438]/30 text-white space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B5F438] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5F438] font-bold">
                  {aerialView === 'arena' ? 'ATHLETIC COMPLEX SECTOR' : 'CENTRAL ROAD & CAMPUS NEXUS'}
                </span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {aerialView === 'arena'
                  ? 'The Historic Grounds of Great Ife Champions'
                  : 'The Grand Entrance Boulevard & Sports Corridor'}
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-3xl font-normal leading-relaxed">
                {aerialView === 'arena'
                  ? 'Panoramic drone perspective highlighting the 400-meter all-weather tartan oval, championship soccer arena, Olympic swimming pavilion, and multi-sport hardcourts set against the iconic rolling hills of Ile-Ife.'
                  : 'Aerial perspective along the main university dual carriageway (Road 1)—capturing the iconic campus entrance, flanked by the OAU Sports Complex on the left and the academic core and amphitheatre beyond.'}
              </p>
            </div>

            {/* Facility Highlights Pills */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
              {aerialView === 'arena' ? (
                <>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B2A18] border border-white/15 text-white flex items-center gap-1.5 shadow-xs">
                    <Building2 className="w-3.5 h-3.5 text-[#B5F438]" />
                    Main Stadium (10,000 Cap.)
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B2A18] border border-white/15 text-white flex items-center gap-1.5 shadow-xs">
                    <Activity className="w-3.5 h-3.5 text-[#B5F438]" />
                    400m Tartan Track
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B2A18] border border-white/15 text-white flex items-center gap-1.5 shadow-xs">
                    <Trophy className="w-3.5 h-3.5 text-[#B5F438]" />
                    Olympic Swimming Pavilion
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B2A18] border border-white/15 text-white flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#B5F438]" />
                    SUB Hardcourts
                  </span>
                </>
              ) : (
                <>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B2A18] border border-white/15 text-white flex items-center gap-1.5 shadow-xs">
                    <Compass className="w-3.5 h-3.5 text-[#B5F438]" />
                    Central Boulevard (Road 1)
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B2A18] border border-white/15 text-white flex items-center gap-1.5 shadow-xs">
                    <Trophy className="w-3.5 h-3.5 text-[#B5F438]" />
                    Sports Complex West Flank
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B2A18] border border-white/15 text-white flex items-center gap-1.5 shadow-xs">
                    <Building2 className="w-3.5 h-3.5 text-[#B5F438]" />
                    University Academic Core
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#0B2A18] border border-white/15 text-white flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#B5F438]" />
                    Ile-Ife Hills Horizon
                  </span>
                </>
              )}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FACILITIES_LIST.map((fac) => (
            <div key={fac.id} className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] hover:shadow-lg transition-all flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-44 h-40 rounded-2xl overflow-hidden bg-[#071E10] shrink-0 border border-[#E2E8F0] shadow-sm">
                <img src={fac.image} alt={fac.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#EBFCD0] text-[#15803D] text-[11px] font-mono font-bold">
                    {fac.status}
                  </span>
                  <span className="text-[11px] font-mono text-[#64748B]">Capacity: {fac.capacity}</span>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-[#0B1220]">{fac.name}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{fac.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-[#0B1220] font-semibold pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>{fac.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. OFFICIAL SECRETARIAT & CONTACT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#071E10] text-white border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-mono font-bold text-[#B5F438] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-[#B5F438]/30">
              OFFICIAL SECRETARIAT
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Have Questions or Inquiries for the Sports Office?
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              Visit the Sports Council Secretariat at the OAU Sports Complex, or reach out to our official desk directly via email.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#B5F438] pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {OAU_OFFICE_EMAIL}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Mon - Fri, 8:00 AM - 5:00 PM
              </span>
            </div>
          </div>

          <a
            href={`mailto:${OAU_OFFICE_EMAIL}`}
            className="px-8 py-4 rounded-full bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center gap-3 shrink-0"
          >
            <span>Send Email Inquiries</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>
      </section>

    </div>
  );
};
