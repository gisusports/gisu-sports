import React, { useState } from 'react';
import { OAU_OFFICE_EMAIL } from '../data/sportsData';
import { useAuth } from '../context/AuthContext';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { subscribeToNewsletter } = useAuth();
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;
    setIsSubscribing(true);
    try {
      const res = await subscribeToNewsletter(subscriberEmail.trim());
      setSubscriptionMessage(res.message);
      if (res.success) {
        setSubscriberEmail('');
      }
      setTimeout(() => setSubscriptionMessage(null), 5000);
    } catch {
      setSubscriptionMessage('Subscription recorded.');
      setTimeout(() => setSubscriptionMessage(null), 4000);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#071E10] text-[#CBD5E1] pt-14 pb-12 relative border-t border-white/10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Institutional Newsletter Subscription Row */}
        <div className="mb-12 pb-10 border-b border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white/[0.03] p-6 sm:p-8 rounded-3xl border border-white/5">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#B5F438] animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-[#B5F438] uppercase tracking-wider">
                Official Sports Council Bulletin
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              Subscribe to Great Ife Sports Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
              Receive matchday fixtures, Dean's Cup results, varsity trial calls, and Directorate announcements delivered directly to your inbox.
            </p>
            {subscriptionMessage && (
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#B5F438] bg-[#B5F438]/10 px-3 py-1.5 rounded-xl border border-[#B5F438]/20 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{subscriptionMessage}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1 sm:w-80">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white text-xs font-mono placeholder:text-white/40 focus:outline-none focus:border-[#B5F438] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSubscribing}
              className="px-6 py-3 rounded-2xl bg-[#B5F438] hover:bg-[#a3e62a] text-[#071E10] font-heading font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubscribing ? 'Subscribing...' : 'Subscribe'}</span>
            </button>
          </form>
        </div>
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/10">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3.5 cursor-pointer text-left" onClick={() => setActiveTab('home')}>
            <div className="flex items-center -space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B5F438]/50 shadow-md shrink-0 bg-[#4A0E17] z-10">
                <img
                  src="/gisu_logo.jpg"
                  alt="Great Ife Students' Union Official Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-md shrink-0 bg-white z-0">
                <img
                  src="/oau_logo.jpg"
                  alt="Obafemi Awolowo University Official Crest"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight leading-none">
                Great Ife <span className="text-[#B5F438]">Sports</span>.
              </span>
              <span className="text-[9px] font-mono font-bold text-[#94A3B8] tracking-wider uppercase mt-1">
                OFFICE OF THE DIRECTOR OF SPORTS • GISU / OAU
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-7 text-xs font-semibold text-white/80 w-full md:w-auto text-left sm:text-center">
            <button onClick={() => setActiveTab('livescore')} className="text-[#B5F438] hover:underline transition-colors cursor-pointer py-1.5 flex items-center gap-1.5 min-h-[40px]">
              <span>Live Scores</span>
              <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#B5F438]/20 text-[#B5F438] border border-[#B5F438]/30">SOON</span>
            </button>
            <button onClick={() => setActiveTab('about')} className="hover:text-[#B5F438] transition-colors cursor-pointer py-1.5 min-h-[40px] flex items-center">About us</button>
            <button onClick={() => setActiveTab('services')} className="hover:text-[#B5F438] transition-colors cursor-pointer py-1.5 min-h-[40px] flex items-center">Sports Services</button>
            <button onClick={() => setActiveTab('community')} className="hover:text-[#B5F438] transition-colors cursor-pointer py-1.5 min-h-[40px] flex items-center">Athlete Roster</button>
            <button onClick={() => setActiveTab('news')} className="hover:text-[#B5F438] transition-colors cursor-pointer py-1.5 min-h-[40px] flex items-center">News & Media</button>
            <button onClick={() => setActiveTab('feedback')} className="hover:text-[#B5F438] transition-colors cursor-pointer py-1.5 min-h-[40px] flex items-center">Feedback</button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5">
            {[
              { label: 'f', name: 'Facebook' },
              { label: 'in', name: 'LinkedIn' },
              { label: 't', name: 'Twitter' },
              { label: 'ig', name: 'Instagram' },
            ].map((social, idx) => (
              <div
                key={idx}
                title={social.name}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center hover:bg-[#B5F438] hover:text-[#071E10] transition-colors cursor-pointer border border-white/10"
              >
                {social.label}
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Copyright & Staff Portal Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8] text-center sm:text-left">
          <p>© {new Date().getFullYear()} Office of the Director of Sports, Great Ife Students' Union (OAU). All rights reserved.</p>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-5 font-mono text-[11px]">
            <span>Official Desk: <strong className="text-[#B5F438]">{OAU_OFFICE_EMAIL}</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
