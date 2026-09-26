import React from 'react';
import { ArrowRight, CreditCard, ShieldCheck, Users, MessageSquare, Sparkles, CheckCircle2, ArrowUpRight, Award, Zap, HelpCircle } from 'lucide-react';

interface ServicesPageProps {
  setActiveTab: (tab: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setActiveTab }) => {
  const sportsServices = [
    {
      id: 'sport-id',
      title: 'Digital Sports ID Accreditation',
      category: 'ATHLETE REGISTRATION',
      desc: 'Complete athlete biodata submission, photo upload, date-of-birth verification with automatic age computation, and instant scannable CODE128 barcode badge generation.',
      details: 'Designed for official university games, NUGA trial screenings, and inter-faculty competitions. Every card includes student matriculation details, faculty, department, sport discipline, and security watermark.',
      icon: CreditCard,
      image: '/icon_seo.jpg',
      features: ['Auto-Calculated Age from DOB', 'CODE128 Barcode Generation', 'High-Res PNG Card Export', 'Official Watermark & Seal'],
    },
    {
      id: 'livescore',
      title: 'Real-Time Matchday LiveScores & Faculty Standings (Coming Soon)',
      category: 'COMING SOON • ANTICIPATE',
      desc: 'Coming Soon • Anticipate: Live university tournament scoreboard, minute-by-minute goal updates, fixtures schedules, and verified faculty standings across all 15 sports disciplines.',
      details: 'Currently in final pre-season staging for the 2025/2026 Inter-Faculty Games kickoff. Anticipate real-time match tracking, goal alerts, disciplinary cards, and automated faculty standings.',
      icon: ShieldCheck,
      image: '/icon_ppc.jpg',
      features: ['Coming Soon for Matchday Kickoff', 'Minute-by-Minute Goal Alerts (Anticipate)', 'Interactive Head-to-Head Stats', 'Faculty Standings Table (Anticipate)'],
    },
    {
      id: 'community',
      title: 'Inter-Faculty Community Roster',
      category: 'PUBLIC ATHLETE DIRECTORY',
      desc: 'Publicly accessible, searchable directory of verified student-athletes across all 15 OAU faculties and 15 competitive sports disciplines.',
      details: 'Enables faculty sports directors, captains, and varsity scouts to filter athletes by discipline, faculty, department, and gender.',
      icon: Users,
      image: '/icon_social.jpg',
      features: ['15 OAU Faculties Directory', '15 Sports Discipline Filter', 'Live Athlete Matric Search', 'Team Squad Listings'],
    },
    {
      id: 'feedback',
      title: 'Athlete Feedback & Complaint System',
      category: 'TRANSPARENCY & GOVERNANCE',
      desc: 'Direct communication portal connecting student-athletes directly with the Director of Sports and Faculty Sports Officers.',
      details: 'Submit maintenance notices for sports complex pitches, equipment requests, officiating complaints, or general suggestions with live status tracking.',
      icon: MessageSquare,
      image: '/icon_email.jpg',
      features: ['Direct Executive Delivery', 'Pitch Repair Notifications', 'Officiating Grievances', 'Live Resolution Tracking'],
    },
  ];

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
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTEGRATED SPORTS PLATFORM CAPABILITIES</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Sports Office <span className="text-[#B5F438]">Services</span>
          </h1>

          <p className="text-base sm:text-lg text-[#CBD5E1] max-w-3xl leading-relaxed font-normal">
            Digital tools designed for Great Ife student-athletes, match officials, and faculty sports executives to power accreditation, verification, and competitive games.
          </p>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sportsServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => setActiveTab(srv.id)}
                className="p-8 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-6 cursor-pointer group hover:shadow-xl hover:border-[#B5F438] transition-all flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#15803D] bg-[#EBFCD0] px-3.5 py-1 rounded-full border border-[#B5F438]/40">
                      {srv.category}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#071E10] text-[#B5F438] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#B5F438] group-hover:text-[#071E10] transition-all shadow-sm">
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                      <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-extrabold text-[#0B1220] leading-tight group-hover:text-[#15803D] transition-colors">
                        {srv.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mt-2">{srv.desc}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#0B1220] bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#E2E8F0] leading-relaxed">
                    {srv.details}
                  </p>

                  <div className="space-y-2 pt-1">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#0B1220]">
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between font-bold text-xs text-[#071E10]">
                  <span className="font-heading text-sm">{srv.id === 'livescore' ? 'Matchday Tracker Status' : 'Launch Service Module'}</span>
                  <div className="flex items-center gap-1.5 text-[#15803D] font-mono group-hover:translate-x-1 transition-transform">
                    <span>{srv.id === 'livescore' ? 'ANTICIPATE' : 'GET STARTED'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. STEP-BY-STEP PARTICIPATION WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-widest bg-[#EBFCD0] px-3.5 py-1 rounded-full border border-[#B5F438]/40">
            HOW IT WORKS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0B1220] tracking-tight">
            Athlete Participation Workflow
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            From online registration to match-day entry, here is how athletes get verified for tournament fixtures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Apply for Sports ID', desc: 'Submit matric details, faculty, DOB, and high-res passport photo online.' },
            { step: '02', title: 'Accreditation Review', desc: 'Automated matric validation & Sports Council verification of eligibility.' },
            { step: '03', title: 'Download Digital Card', desc: 'Receive instant scannable CODE128 digital badge ready for mobile or print.' },
            { step: '04', title: 'Game-Day Verification', desc: 'Match officials scan barcode in seconds to clear athlete for competition.' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-3 relative hover:border-[#B5F438] transition-all">
              <span className="font-heading font-extrabold text-4xl text-[#B5F438] block">{item.step}</span>
              <h3 className="font-heading text-lg font-bold text-[#0B1220]">{item.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BOTTOM ACTION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#071E10] text-white border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-mono font-bold text-[#B5F438] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-[#B5F438]/30">
              GET ACCREDITED TODAY
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Represent Your Faculty or Varsity Squad?
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              Complete your Digital Sports ID application in under 3 minutes and receive your official barcode accreditation.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('sport-id')}
            className="px-8 py-4 rounded-full bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center gap-3 shrink-0 cursor-pointer"
          >
            <span>Apply for Sports ID</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </section>

    </div>
  );
};
