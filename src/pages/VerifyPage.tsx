import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Search, QrCode, CheckCircle2, AlertCircle, Camera, RefreshCw, Sparkles, Check, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { IdCard } from '../components/IdCard';
import { IdCardRecord } from '../types';
import { supabase, isSupabaseConfigured, mapRowToCard } from '../lib/supabase';

export const VerifyPage: React.FC = () => {
  const { getCardByNumber, idCards } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [searchedCard, setSearchedCard] = useState<IdCardRecord | null | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get('card') || params.get('id');
    const path = window.location.pathname;
    const cardFromPath = path.startsWith('/verify/') ? decodeURIComponent(path.replace('/verify/', '')) : null;
    const targetCard = cardParam || cardFromPath;

    if (targetCard) {
      setSearchInput(targetCard);
      const found = getCardByNumber(targetCard);
      if (found) {
        setSearchedCard(found);
        setHasSearched(true);
      } else if (isSupabaseConfigured()) {
        const fetchCard = async () => {
          try {
            const { data, error } = await supabase
              .from('id_cards')
              .select('*')
              .ilike('card_number', targetCard.trim())
              .limit(1);
            if (!error && data && data.length > 0) {
              setSearchedCard(mapRowToCard(data[0]));
            } else {
              setSearchedCard(null);
            }
          } catch {
            setSearchedCard(null);
          } finally {
            setHasSearched(true);
          }
        };
        fetchCard();
      } else {
        setSearchedCard(null);
        setHasSearched(true);
      }
    }
  }, [idCards]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const card = getCardByNumber(searchInput);
    if (card) {
      setSearchedCard(card);
      setHasSearched(true);
    } else if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('id_cards')
          .select('*')
          .or(`card_number.ilike.${searchInput.trim()},matric_number.ilike.${searchInput.trim()}`)
          .limit(1);
        if (!error && data && data.length > 0) {
          setSearchedCard(mapRowToCard(data[0]));
        } else {
          setSearchedCard(null);
        }
      } catch {
        setSearchedCard(null);
      } finally {
        setHasSearched(true);
      }
    } else {
      setSearchedCard(null);
      setHasSearched(true);
    }
  };

  const handleSimulateScan = (cardNo: string) => {
    setIsScanning(true);
    setSearchInput(cardNo);
    setTimeout(() => {
      const card = getCardByNumber(cardNo);
      setSearchedCard(card);
      setHasSearched(true);
      setIsScanning(false);
    }, 800);
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>REAL-TIME VERIFICATION REGISTRY</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Verify Digital <span className="text-[#B5F438]">Sports ID Card</span>
          </h1>

          <p className="text-base sm:text-lg text-[#CBD5E1] max-w-3xl leading-relaxed font-normal">
            Real-time institutional database lookup for match referees, game commissioners, and university security to validate student-athlete credentials and combat mercenary entries.
          </p>
        </div>
      </section>

      {/* 2. VERIFICATION SEARCH & SCANNER INTERFACE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="space-y-1 border-b border-[#E2E8F0] pb-4">
            <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
              CARD QUERY CONSOLE
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-[#0B1220] mt-2">
              Instant Barcode & Credential Registry
            </h2>
            <p className="text-xs text-[#64748B]">
              Enter Card ID (e.g. <code className="text-[#071E10] font-bold">GICS/2026/0001</code>) or student matriculation number.
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Card Number (GICS/2026/0001) or Matric No."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-[#0B1220] font-mono text-sm placeholder-[#94A3B8] outline-none shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="px-8 py-4 rounded-2xl bg-[#071E10] hover:bg-[#0B2A18] text-[#B5F438] font-heading font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#B5F438]" />
                  <span>Scanning Registry...</span>
                </>
              ) : (
                <>
                  <span>Verify Credentials</span>
                  <ShieldCheck className="w-4 h-4 text-[#B5F438]" />
                </>
              )}
            </button>
          </form>

          {/* SIMULATED SCANNER PRESET BADGES */}
          {idCards.length > 0 && (
            <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#64748B]">
                <span className="flex items-center gap-2 text-[#071E10] font-bold">
                  <Camera className="w-4 h-4 text-[#15803D]" />
                  RECENTLY ACCREDITED CARDS:
                </span>
                <span>Tap to verify registered card</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {idCards.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSimulateScan(c.cardNumber)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#B5F438] text-xs font-mono font-bold text-[#0B1220] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>{c.cardNumber}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. VERIFICATION OUTCOME */}
        {hasSearched && (
          <div className="space-y-6 animate-in fade-in">
            {searchedCard ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Result Status & Official Clearance Breakdown */}
                <div className="lg:col-span-6 p-7 rounded-3xl bg-[#F8FAF6] border-2 border-[#16A34A] space-y-6 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBFCD0] border border-[#B5F438] text-[#15803D] flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="px-3 py-0.5 rounded-full bg-[#EBFCD0] text-[#15803D] text-[11px] font-mono font-bold">
                        STATUS: VERIFIED & ACTIVE
                      </span>
                      <h3 className="font-heading text-2xl font-extrabold text-[#0B1220] mt-1">
                        Athlete Officially Cleared
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Card Number:</span>
                      <strong className="font-mono text-[#071E10]">{searchedCard.cardNumber}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Full Name:</span>
                      <strong className="text-[#071E10]">{searchedCard.fullName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Matric Number:</span>
                      <strong className="font-mono text-[#071E10]">{searchedCard.matricNumber}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Faculty:</span>
                      <strong className="text-[#071E10]">{searchedCard.faculty}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Department:</span>
                      <strong className="text-[#071E10]">{searchedCard.department}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                      <span className="text-[#64748B]">Sport Discipline:</span>
                      <strong className="text-[#15803D] font-bold">{searchedCard.sport}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748B]">Issuing Body:</span>
                      <strong className="text-[#071E10]">GISU Sports Council, OAU</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#15803D] bg-[#EBFCD0] p-3 rounded-xl border border-[#B5F438]/50">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>Eligible to participate in all 2026 Inter-Faculty & Varsity Games fixtures.</span>
                  </div>
                </div>

                {/* Live Card Render */}
                <div className="lg:col-span-6 flex justify-center">
                  <IdCard card={searchedCard} />
                </div>

              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-[#FEF2F2] border-2 border-[#EF4444] space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto shadow-sm">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-[#991B1B]">
                  Unverified / Inactive Credential
                </h3>
                <p className="text-xs sm:text-sm text-[#7F1D1D] max-w-md mx-auto leading-relaxed">
                  No active accreditation record was found for "{searchInput}". This individual is not cleared for official competition.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="px-6 py-2.5 rounded-full bg-[#991B1B] text-white text-xs font-bold font-mono hover:bg-[#7F1D1D] transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
};
