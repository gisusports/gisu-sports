import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, CheckCircle2, Clock, Sparkles, AlertCircle, ShieldCheck, MessageCircle, ArrowRight, User } from 'lucide-react';
import { ComplaintRecord } from '../types';
import { OAU_FACULTIES } from '../data/sportsData';

export const FeedbackPage: React.FC = () => {
  const { complaints, addComplaint, currentUser } = useAuth();
  const [category, setCategory] = useState<ComplaintRecord['category']>('Facility Reservation');
  const [studentName, setStudentName] = useState(currentUser?.fullName || '');
  const [studentMatric, setStudentMatric] = useState('');
  const [studentFaculty, setStudentFaculty] = useState(OAU_FACULTIES[0]);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !details.trim()) return;

    const nameToUse = currentUser?.fullName || studentName.trim() || 'Student Athlete';
    const matricToUse = studentMatric.trim().toUpperCase() || 'GENERAL/STUDENT';

    addComplaint({
      athleteId: currentUser?.id || `student-${Date.now()}`,
      athleteName: nameToUse,
      athleteMatric: matricToUse,
      faculty: studentFaculty,
      category,
      subject,
      details,
    });

    setSubject('');
    setDetails('');
    if (!currentUser) {
      setStudentName('');
      setStudentMatric('');
    }
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const getStatusBadge = (status: ComplaintRecord['status']) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#EBFCD0] text-[#15803D] text-[10px] font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono font-bold flex items-center gap-1 border border-amber-200">
            <Clock className="w-3 h-3" /> In Review
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold flex items-center gap-1 border border-slate-200">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
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
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ATHLETE VOICE & TRANSPARENCY</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Athlete Support & <span className="text-[#B5F438]">Feedback</span>
          </h1>

          <p className="text-base sm:text-lg text-[#CBD5E1] max-w-3xl leading-relaxed font-normal">
            Direct communication channel with the Director of Sports and Faculty Sports Representatives. Submit equipment requests, pitch repairs, or officiating feedback.
          </p>
        </div>
      </section>

      {/* 2. SUBMIT FORM & LIVE STATUS TRACKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* SUBMISSION FORM */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-6 shadow-sm">
            <div className="border-b border-[#E2E8F0] pb-4">
              <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
                OFFICIAL SUBMISSION FORM
              </span>
              <h2 className="font-heading text-2xl font-extrabold text-[#0B1220] mt-2">
                Submit a Grievance or Request
              </h2>
              {currentUser ? (
                <p className="text-xs text-[#64748B] mt-1">
                  Submitting as: <strong className="text-[#071E10]">{currentUser.fullName}</strong> ({currentUser.role})
                </p>
              ) : (
                <p className="text-xs text-[#64748B] mt-1">
                  Submit official athlete feedback, pitch reservation, or maintenance request.
                </p>
              )}
            </div>

            {submittedSuccess && (
              <div className="p-4 rounded-2xl bg-[#EBFCD0] border border-[#B5F438] text-[#071E10] text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
                <span>Your report has been submitted to the Sports Council Secretariat! Tracking ID created.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {!currentUser && (
                <div className="space-y-4 p-4 rounded-2xl bg-white border border-[#E2E8F0]">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0B1220] block">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Oluwaseun Adeleke"
                      className="w-full p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">Matriculation Number</label>
                      <input
                        type="text"
                        required
                        value={studentMatric}
                        onChange={(e) => setStudentMatric(e.target.value)}
                        placeholder="e.g. CSC/2022/045"
                        className="w-full p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] text-xs font-mono uppercase font-bold text-[#0B1220] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">Faculty</label>
                      <select
                        value={studentFaculty}
                        onChange={(e) => setStudentFaculty(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none cursor-pointer"
                      >
                        {OAU_FACULTIES.map((fac) => (
                          <option key={fac} value={fac}>{fac}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0B1220] block">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none shadow-xs cursor-pointer"
                >
                  <option value="Facility Reservation">Facility Reservation & Pitch Care</option>
                  <option value="Equipment">Sports Gear & Equipment Allocation</option>
                  <option value="Allowance & Grants">Athlete Allowances & Competition Grants</option>
                  <option value="Officiating">Officiating & Refereeing Complaints</option>
                  <option value="General Suggestion">General University Sports Suggestion</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0B1220] block">Subject / Short Summary</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Broken Goal Net on Complex Pitch 2"
                  className="w-full p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0B1220] block">Detailed Explanation</label>
                <textarea
                  required
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide precise location, affected team, and recommendations..."
                  className="w-full p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none shadow-xs resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#071E10] hover:bg-[#0B2A18] text-[#B5F438] font-heading font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Submit to Sports Council</span>
                  <Send className="w-4 h-4 text-[#B5F438]" />
                </button>
              </div>
            </form>
          </div>

          {/* LIVE STATUS TRACKER */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
                    TRANSPARENT TRACKER
                  </span>
                  <h3 className="font-heading text-2xl font-extrabold text-[#0B1220] mt-2">
                    Recent Submissions & Status
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#64748B]">{complaints.length} Records</span>
              </div>

              <div className="space-y-4">
                {complaints.slice(0, 5).map((comp) => (
                  <div key={comp.id} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono text-[#64748B] font-bold uppercase bg-[#F8FAF6] px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">
                        {comp.category}
                      </span>
                      {getStatusBadge(comp.status)}
                    </div>

                    <h4 className="font-heading font-bold text-sm text-[#0B1220] leading-snug">
                      {comp.subject}
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {comp.details}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1">
                      <span>By: {comp.athleteName} ({comp.faculty})</span>
                      <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Official Response if any */}
                    {comp.officeResponse && (
                      <div className="mt-2.5 p-3 rounded-xl bg-[#EBFCD0]/60 border border-[#B5F438]/50 space-y-1 text-xs">
                        <span className="font-heading font-bold text-[#15803D] flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-[#15803D]" />
                          Official Secretariat Response:
                        </span>
                        <p className="text-[#071E10] font-normal leading-relaxed">{comp.officeResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
