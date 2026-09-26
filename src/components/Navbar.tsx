import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowUpRight, LogOut, ShieldCheck, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { activeRole, setRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isExecutive = activeRole !== 'athlete';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'livescore', label: 'Live Scores', isComingSoon: true },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'community', label: 'Athlete Roster' },
    { id: 'news', label: 'News' },
  ];

  if (isExecutive) {
    navItems.push({ id: 'console', label: 'Admin Console' });
  }

  const handleLogout = () => {
    setRole('athlete');
    setActiveTab('home');
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#071E10]/95 backdrop-blur-xl border-b border-white/10 shadow-xl py-0'
          : 'bg-[#071E10]/80 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-white/10 py-0.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Official GISU & OAU Brand Logos */}
          <div
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group text-left"
          >
            <div className="flex items-center -space-x-1.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#B5F438]/50 shadow-md group-hover:scale-105 transition-transform shrink-0 bg-[#4A0E17] z-10">
                <img
                  src="/gisu_logo.jpg"
                  alt="Great Ife Students' Union Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-md group-hover:scale-105 transition-transform shrink-0 bg-white z-0">
                <img
                  src="/oau_logo.jpg"
                  alt="Obafemi Awolowo University Crest"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base sm:text-xl text-[#FFFFFF] tracking-tight leading-none">
                Great Ife <span className="text-[#B5F438]">Sports</span>.
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-white/60 tracking-wider uppercase mt-0.5">
                Students' Union • OAU
              </span>
            </div>
          </div>

          {/* Public Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-[13px] lg:text-[14px] transition-all cursor-pointer relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#B5F438] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#B5F438]'
                      : 'text-white/80 font-medium hover:text-[#FFFFFF]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isComingSoon && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] lg:text-[9px] font-mono font-bold bg-[#B5F438]/20 text-[#B5F438] border border-[#B5F438]/30 tracking-tight">
                      SOON
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Public CTA Button or Executive Active Scope (Visible on md and up) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* If executive is logged in: show active scope and exit button */}
            {isExecutive && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0B2A18] border border-[#B5F438]/40 text-[11px] font-mono text-[#B5F438]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B5F438]" />
                  <span className="capitalize font-bold">{activeRole.replace(/_/g, ' ')}</span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Exit Executive Mode"
                  className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-rose-950/80 hover:border-rose-500/50 hover:text-rose-300 text-white text-[11px] font-mono font-semibold transition-all border border-white/15 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            )}

            {/* Public CTA Button */}
            <button
              onClick={() => setActiveTab('sport-id')}
              className="bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-extrabold text-xs px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer group"
            >
              <span>Apply for ID</span>
              <div className="w-5 h-5 rounded-full bg-[#071E10] text-[#B5F438] flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </div>
            </button>

          </div>

          {/* Mobile Right Controls: Compact Apply Button + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => { setActiveTab('sport-id'); setMobileMenuOpen(false); }}
              className="bg-[#B5F438] text-[#071E10] font-heading font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <span>Apply</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-[#FFFFFF] cursor-pointer backdrop-blur-md min-w-[40px] min-h-[40px] flex items-center justify-center border border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#B5F438]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071E10]/98 backdrop-blur-2xl border-b border-white/15 px-4 pt-3 pb-6 space-y-1.5 text-left shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full py-3 px-3.5 rounded-xl text-left font-bold text-sm cursor-pointer flex items-center justify-between transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-[#B5F438]/15 text-[#B5F438] border-l-4 border-[#B5F438] pl-3'
                    : 'text-white/90 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {item.isComingSoon && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#B5F438]/20 text-[#B5F438] border border-[#B5F438]/30">
                    ANTICIPATE
                  </span>
                )}
              </button>
            );
          })}

          {isExecutive && (
            <button
              onClick={handleLogout}
              className="w-full py-3 px-3.5 rounded-xl text-left font-mono font-bold text-xs text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 min-h-[44px]"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Exit Executive Session</span>
            </button>
          )}

          <div className="pt-2">
            <button
              onClick={() => { setActiveTab('sport-id'); setMobileMenuOpen(false); }}
              className="w-full py-3.5 rounded-xl bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-extrabold text-sm cursor-pointer shadow-lg flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>Apply for Sports ID Card</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
