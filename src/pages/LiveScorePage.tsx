import React, { useState } from 'react';
import {
  Trophy,
  Radio,
  Clock,
  Calendar,
  ShieldCheck,
  Activity,
  Sparkles,
  ArrowRight,
  Zap,
  BarChart3,
  UserCheck,
  CheckCircle2,
  Mail,
  Send,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface LiveScorePageProps {
  setActiveTab?: (tab: string) => void;
}

export const LiveScorePage: React.FC<LiveScorePageProps> = ({ setActiveTab }) => {
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;
    setEmailSubscribed(true);
    setTimeout(() => {
      setNotifyEmail('');
    }, 4000);
  };

  const upcomingFeatures = [
    {
      icon: Activity,
      title: 'Minute-by-Minute Match Commentary',
      badge: 'REAL-TIME TELEMETRY',
      description:
        'Pitch-side digital telemetry feeding instant whistle alerts, goal notifications, penalty decisions, yellow/red cards, and injury-time updates directly from the Main Bowl and SUB Sports Arena.',
    },
    {
      icon: UserCheck,
      title: 'Official Starting XIs & Verified Rosters',
      badge: '100% ACCREDITED SQUADS',
      description:
        'Lineups verified against the Great Ife Digital Sports ID central database. Review team formations, player jersey numbers, and faculty eligibility before every kickoff.',
    },
    {
      icon: BarChart3,
      title: 'Automated Inter-Faculty League Tables (Coming Soon)',
      badge: 'COMING SOON • ANTICIPATE',
      description:
        'Dynamic group stage standings, head-to-head records, goal differentials, and the official Golden Boot top scorer race calculated in real time across all 13 OAU faculties when tournament matches begin.',
    },
    {
      icon: Trophy,
      title: 'Multi-Sport Varsity Championship Coverage',
      badge: 'ALL DISCIPLINES',
      description:
        'Comprehensive live tracking covering all 15 sanctioned sports: Football, Volleyball, Basketball, Handball, Badminton, Squash, Table Tennis, Lawn Tennis, Hockey, Cricket, Track and Field Athletics, Taekwondo, Swimming, Chess and Scrabble, and Judo.',
    },
  ];

  const tournamentTimeline = [
    {
      phase: 'Phase 01',
      title: 'Athlete Accreditation & Roster Minting',
      status: 'Active Now',
      isCurrent: true,
      desc: 'Students and varsity players applying for tamper-proof Digital Sports IDs.',
    },
    {
      phase: 'Phase 02',
      title: 'Referee Digital Console Staging',
      status: 'In Testing',
      isCurrent: false,
      desc: 'Field match commissioners and officiating referees onboarded with barcode scanners.',
    },
    {
      phase: 'Phase 03',
      title: 'Inter-Faculty Kickoff & LiveScore Launch',
      status: 'Anticipate',
      isCurrent: false,
      desc: 'Real-time live scoring engine activates for the 2025/2026 championship matchday.',
    },
  ];

  return (
    <div className="space-y-16 pb-28 text-left bg-[#071E10] min-h-screen text-white">
      
      {/* =========================================================================
          HERO SECTION: COMING SOON • ANTICIPATE
      ========================================================================= */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden border-b border-white/10">
        
        {/* Atmospheric ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B5F438]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-12 left-10 w-80 h-80 bg-[#15803D]/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center space-y-8">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#B5F438]/15 border border-[#B5F438]/40 text-[#B5F438] text-xs font-mono font-bold tracking-widest uppercase shadow-lg shadow-[#B5F438]/10 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#B5F438]" />
            <span>OFFICIAL MATCHDAY TRACKER • COMING SOON</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Great Ife <span className="text-[#B5F438]">LiveScore</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold text-[#B5F438] tracking-tight">
              Coming Soon • Anticipate the Matchday Pulse
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed font-normal pt-2">
              We are finalizing the real-time matchday scoring infrastructure for Obafemi Awolowo University sports. Experience minute-by-minute updates, starting lineups, and live faculty standings when the championship whistle blows.
            </p>
          </div>

          {/* Anticipate CTA Deck */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            {setActiveTab && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('sports-id')}
                  className="px-8 py-4 rounded-2xl bg-[#B5F438] hover:bg-[#A3E62B] text-[#071E10] font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#B5F438]/20 flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Apply for Sports ID First</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all border border-white/15 flex items-center gap-2 cursor-pointer"
                >
                  <span>Return to Home</span>
                  <ArrowRight className="w-4 h-4 text-[#B5F438]" />
                </button>
              </>
            )}
          </div>

          {/* Official Executive Directive Notice */}
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-[#94A3B8] flex items-center justify-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#B5F438] shrink-0" />
            <span>Mandated by Office of the Director of Sports • Big Pope & Executive Council</span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: WHAT TO ANTICIPATE (UPCOMING CAPABILITIES)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3.5 py-1 rounded-full border border-[#B5F438]/40">
            CHAMPIONSHIP ENGINE PREVIEW
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What to Anticipate
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            Here is a first look at the advanced sports technology arriving on the Great Ife Sports Platform for the 2025/2026 season.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingFeatures.map((f, idx) => {
            const IconComponent = f.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#030D06] border border-white/10 hover:border-[#B5F438]/50 transition-all space-y-4 shadow-lg group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#071E10] border border-[#B5F438]/40 text-[#B5F438] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B5F438] bg-[#B5F438]/10 px-2.5 py-1 rounded-md border border-[#B5F438]/25">
                    {f.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-xl text-white group-hover:text-[#B5F438] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-normal">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TOURNAMENT LAUNCH ROADMAP
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#030D06] border border-white/10 shadow-2xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#B5F438] uppercase tracking-wider">
                COMPETITION ROADMAP
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Launch Progression Timeline
              </h3>
            </div>
            <div className="text-xs font-mono text-white/60">
              Session: 2025/2026 Academic Calendar
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tournamentTimeline.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all space-y-3 text-left ${
                  item.isCurrent
                    ? 'bg-[#071E10] border-[#B5F438] shadow-lg shadow-[#B5F438]/10'
                    : 'bg-black/30 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#B5F438]">
                    {item.phase}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      item.isCurrent
                        ? 'bg-[#B5F438] text-[#071E10]'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-base text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: NOTIFY ME / GET READY BANNER
      ========================================================================= */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B2A18] to-[#071E10] border-2 border-[#B5F438]/50 shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-2xl bg-[#B5F438] text-[#071E10] mx-auto flex items-center justify-center shadow-lg shadow-[#B5F438]/30">
            <Radio className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Be the First to Know When We Go Live
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              Enter your student email address to receive an official dispatch notification the moment the live match tracker launches.
            </p>
          </div>

          {emailSubscribed ? (
            <div className="p-4 rounded-2xl bg-[#EBFCD0] text-[#15803D] font-heading font-extrabold text-sm max-w-md mx-auto flex items-center justify-center gap-2 border border-[#B5F438] animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
              <span>You're subscribed! We'll notify you on matchday kickoff.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                required
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="athlete@student.oauife.edu.ng"
                className="flex-1 p-3.5 rounded-xl bg-[#030D06] border border-white/15 focus:border-[#B5F438] text-xs sm:text-sm text-white outline-none font-mono"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-[#B5F438] hover:bg-[#A3E62B] text-[#071E10] font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notify Me</span>
              </button>
            </form>
          )}

          <p className="text-[11px] font-mono text-[#94A3B8]">
            No spam. Strictly varsity athletics updates from the GISU Sports Council Secretariat.
          </p>

        </div>
      </section>

    </div>
  );
};
