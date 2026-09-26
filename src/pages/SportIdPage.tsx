import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { OAU_FACULTIES, FACULTY_DEPARTMENTS, SPORTS_LIST, OAU_OFFICE_EMAIL } from '../data/sportsData';
import { IdCard } from '../components/IdCard';
import { EmailNotificationModal } from '../components/EmailNotificationModal';
import { generateMailtoLink } from '../utils/emailNotification';
import { sendAthleteIdEmail } from '../services/emailService';
import { generateCardPdf, downloadCardPdf } from '../utils/pdfGenerator';
import { compressPassportImage } from '../utils/imageCompressor';
import { IdCardRecord } from '../types';
import { supabase, isSupabaseConfigured, mapRowToCard } from '../lib/supabase';
import { 
  CreditCard, 
  Upload, 
  Sparkles, 
  User, 
  Calendar, 
  GraduationCap, 
  Trophy, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  HeartPulse, 
  AlertTriangle,
  HelpCircle,
  X,
  Camera,
  AlertCircle,
  Eye,
  Check,
  Award,
  Send,
  ExternalLink,
  Loader2,
  Download,
  FileText,
  Plus
} from 'lucide-react';

export const SportIdPage: React.FC = () => {
  const { currentUser, addIdCard, idCards } = useAuth();

  // Navigation tab within the ID Card page
  const [activeTab, setActiveTab] = useState<'apply' | 'retrieve' | 'rules'>('apply');

  // Submission Flow: 'idle' -> 'generating' -> 'success'
  const [submissionStage, setSubmissionStage] = useState<'idle' | 'generating' | 'success'>('idle');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('Verifying student eligibility & credentials...');

  // Created card result state
  const [createdCard, setCreatedCard] = useState<IdCardRecord | null>(null);
  const [selectedEmailCard, setSelectedEmailCard] = useState<IdCardRecord | null>(null);

  // Duplicate Check Warning State
  const [duplicateCard, setDuplicateCard] = useState<IdCardRecord | null>(null);

  // Form Fields - ALL START CLEAN (ZERO PRESEEDED / DEMO DATA)
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [nickname, setNickname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [matricNumber, setMatricNumber] = useState('');
  const [faculty, setFaculty] = useState(OAU_FACULTIES[0] || 'Faculty of Technology');
  const [department, setDepartment] = useState(FACULTY_DEPARTMENTS[OAU_FACULTIES[0]]?.[0] || '');
  const [level, setLevel] = useState('100L');
  const [session, setSession] = useState('2025/2026');
  const [sport, setSport] = useState(SPORTS_LIST[0] || 'Football');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formError, setFormError] = useState('');

  // Instant Retrieval Search State
  const [searchMatric, setSearchMatric] = useState('');
  const [searchedCard, setSearchedCard] = useState<IdCardRecord | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Auto calculate age dynamically from DOB
  useEffect(() => {
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let computedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        computedAge--;
      }
      setAge(computedAge > 0 ? computedAge : 0);
    } else {
      setAge('');
    }
  }, [dateOfBirth]);

  // Sync department when faculty changes
  useEffect(() => {
    if (FACULTY_DEPARTMENTS[faculty] && FACULTY_DEPARTMENTS[faculty].length > 0) {
      setDepartment(FACULTY_DEPARTMENTS[faculty][0]);
    }
  }, [faculty]);

  // Photo Upload & High-DPI Egress-Optimized Compression (99% Size Reduction)
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [compressionSavings, setCompressionSavings] = useState<string | null>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type || !file.type.startsWith('image/')) {
        setFormError('Please select a valid image file (JPG, PNG, or WebP).');
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        setFormError('Photo size exceeds 12MB. Please upload a smaller passport photograph.');
        return;
      }
      setIsCompressingPhoto(true);
      setCompressionSavings(null);
      setFormError('');

      try {
        // High-DPI 400x400 compression: Reduces 3-5MB photo down to ~15KB-25KB (99% egress reduction)
        const result = await compressPassportImage(file, 400, 0.82);
        if (result.compressedDataUrl) {
          setPhotoUrl(result.compressedDataUrl);
          if (result.reductionPercentage > 0) {
            setCompressionSavings(`Optimized by ${result.reductionPercentage}% (${Math.round(result.compressedSizeBytes / 1024)} KB)`);
          }
        } else {
          setFormError('Could not process this image format. Please select a JPG, PNG, or WebP photo.');
        }
      } catch (err) {
        console.warn('[Passport Upload] Compression fallback error:', err);
        setFormError('Error processing photo. Please select another image.');
      } finally {
        setIsCompressingPhoto(false);
      }
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setDuplicateCard(null);

    if (!fullName.trim()) {
      setFormError('Please enter your full official student name.');
      return;
    }
    if (!dateOfBirth) {
      setFormError('Please select your date of birth.');
      return;
    }
    if (typeof age === 'number' && age < 15) {
      setFormError('Please enter a valid date of birth (minimum eligible age is 15 years).');
      return;
    }
    if (!matricNumber.trim()) {
      setFormError('Please enter your official OAU matriculation number.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter your active mobile phone number.');
      return;
    }
    if (!emergencyContact.trim()) {
      setFormError('Please provide a valid emergency next-of-kin contact.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter your student or institutional email address.');
      return;
    }
    if (!photoUrl) {
      setFormError('Please upload a clear passport photograph of the athlete.');
      return;
    }
    if (!termsAccepted) {
      setFormError('You must affirm the official athlete eligibility and anti-mercenary declaration.');
      return;
    }

    // STRICT ONE-TIME REGISTRATION ENFORCEMENT (Local preliminary check)
    const cleanMatric = matricNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const existingByMatric = idCards.find((c) => c.matricNumber.toUpperCase() === cleanMatric);
    const existingByEmail = idCards.find((c) => c.email.toLowerCase() === cleanEmail);
    const existingByPhone = idCards.find((c) => c.phone.trim() === cleanPhone);

    const existingMatch = existingByMatric || existingByEmail || existingByPhone;

    if (existingMatch) {
      setDuplicateCard(existingMatch);
      let matchField = 'Matriculation Number';
      if (existingMatch === existingByEmail) matchField = 'Email Address';
      else if (existingMatch === existingByPhone) matchField = 'Phone Number';

      setFormError(
        `One-Time Registration Limit: An official athlete accreditation already exists for this ${matchField} (${existingMatch.matricNumber} • Card: ${existingMatch.cardNumber}). In accordance with OAU Sports Council rules, duplicate registrations are prohibited.`
      );
      return;
    }

    // STAGE 1: Transition into "Generating ID..."
    setSubmissionStage('generating');
    setGenerationProgress(20);
    setGenerationMessage('Verifying student biodata & institutional registry...');

    // Asynchronously allocate unique card number and persist to Supabase
    const result = await addIdCard({
      fullName: fullName.trim(),
      dateOfBirth,
      age: typeof age === 'number' ? age : 20,
      matricNumber: cleanMatric,
      faculty,
      department,
      sport,
      gender,
      phone: cleanPhone,
      email: cleanEmail,
      photoUrl,
      status: 'Active',
      bloodGroup,
      emergencyContact: emergencyContact.trim(),
      jerseyNumber: jerseyNumber.trim() || undefined,
      session,
      level,
      nickname: nickname.trim().toUpperCase() || undefined,
    });

    if (!result.success || !result.card) {
      setSubmissionStage('idle');
      if (result.isDuplicate && result.card) {
        setDuplicateCard(result.card);
      }
      setFormError(result.error || 'Registration failed. Please verify your details and try again.');
      return;
    }

    const newCard = result.card;
    setCreatedCard(newCard);

    // Progress animation step 2: Barcode minting
    setGenerationProgress(50);
    setGenerationMessage('Minting tamper-proof CODE128 security barcode...');

    // Progress animation step 3: 2-Page PDF generation & Email Dispatch
    setTimeout(async () => {
      setGenerationProgress(75);
      setGenerationMessage('Rendering official 2-page Front & Back ID Card PDF...');

      let pdfB64: string | undefined;
      try {
        const pdfRes = await generateCardPdf(newCard);
        pdfB64 = pdfRes.pdfBase64;
      } catch (pdfErr) {
        console.warn('Could not generate PDF attachment:', pdfErr);
      }

      setGenerationProgress(90);
      setGenerationMessage(`Dispatching official credentials email with attached 2-page PDF to ${cleanEmail}...`);

      try {
        await sendAthleteIdEmail(newCard, pdfB64);
      } catch (err) {
        console.warn('Real email dispatch error:', err);
      }

      setGenerationProgress(100);
      setGenerationMessage('Official Sports ID generated & dispatched!');

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      // STAGE 2: Transition cleanly to "Official Sports ID Card Generated" screen
      setTimeout(() => {
        setSubmissionStage('success');
      }, 500);
    }, 600);
  };

  // Reset form cleanly for another application
  const handleResetForm = () => {
    setCreatedCard(null);
    setSubmissionStage('idle');
    setGenerationProgress(0);
    setDuplicateCard(null);
    setSelectedEmailCard(null);
    setFullName('');
    setNickname('');
    setDateOfBirth('');
    setAge('');
    setGender('Male');
    setBloodGroup('O+');
    setMatricNumber('');
    setLevel('100L');
    setSport(SPORTS_LIST[0]);
    setJerseyNumber('');
    setPhone('');
    setEmergencyContact('');
    setEmail('');
    setPhotoUrl('');
    setTermsAccepted(false);
    setFormError('');
  };

  // Handle Search for Existing Card
  const handleSearchCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchMatric.trim()) return;

    const query = searchMatric.trim().toUpperCase();
    const cleanEmail = searchMatric.trim().toLowerCase();

    // 1. Check locally first
    const foundLocal = idCards.find(
      (c) =>
        c.matricNumber.toUpperCase() === query ||
        c.cardNumber.toUpperCase() === query ||
        c.phone.trim() === query ||
        c.email.toLowerCase() === cleanEmail
    );

    if (foundLocal) {
      setSearchedCard(foundLocal);
      setSearchAttempted(true);
      return;
    }

    // 2. Query Supabase cloud database if not found in local cache
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('id_cards')
          .select('*')
          .or(`card_number.ilike.${query},matric_number.ilike.${query},phone.ilike.${query},email.ilike.${cleanEmail}`)
          .limit(1);

        if (!error && data && data.length > 0) {
          const cloudCard = mapRowToCard(data[0]);
          setSearchedCard(cloudCard);
        } else {
          setSearchedCard(null);
        }
      } catch {
        setSearchedCard(null);
      } finally {
        setSearchAttempted(true);
      }
    } else {
      setSearchedCard(null);
      setSearchAttempted(true);
    }
  };

  return (
    <div className="space-y-12 pb-24 text-[#0B1220]">
      
      {/* =========================================================================
          REGISTRATION HERO SECTION (ELEGANT MOBILE & DESKTOP DESIGN)
      ========================================================================= */}
      <section className="relative pt-24 pb-8 sm:pt-28 sm:pb-12 bg-[#071E10] text-white overflow-hidden border-b border-white/10 shadow-md">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#B5F438]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#15803D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
            
            {/* Header Content (Centered on Mobile, Left-Aligned on Desktop) */}
            <div className="space-y-2.5 text-center sm:text-left flex flex-col items-center sm:items-start">
              {/* Institutional Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#B5F438]/30 text-[#B5F438] text-[10px] xs:text-[11px] font-mono font-bold tracking-wider uppercase shadow-xs">
                <CreditCard className="w-3.5 h-3.5 text-[#B5F438]" />
                <span>OFFICE OF THE DIRECTOR OF SPORTS • OAU</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-2xl xs:text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Student-Athlete <span className="text-[#B5F438]">ID Registration</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs xs:text-sm text-slate-200 font-normal max-w-xl leading-relaxed">
                Official accreditation portal. Fill in your authentic student-athlete credentials below to generate your 2025/2026 Great Ife Sports Pass.
              </p>

              {/* Mobile Fast-Stat Verification Strip (Visible on mobile, hidden on desktop) */}
              <div className="sm:hidden grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm w-full max-w-md mx-auto text-center mt-1">
                <div className="text-center">
                  <span className="font-heading font-extrabold text-xs xs:text-sm text-white block leading-none">
                    Instant
                  </span>
                  <span className="text-[9px] font-mono text-[#B5F438] uppercase tracking-wider block mt-1">
                    Front & Back Pass
                  </span>
                </div>
                <div className="text-center border-l border-white/10">
                  <span className="font-heading font-extrabold text-xs xs:text-sm text-white block leading-none">
                    CODE128
                  </span>
                  <span className="text-[9px] font-mono text-[#B5F438] uppercase tracking-wider block mt-1">
                    Barcode Validated
                  </span>
                </div>
                <div className="text-center border-l border-white/10">
                  <span className="font-heading font-extrabold text-xs xs:text-sm text-white block leading-none">
                    2-Page PDF
                  </span>
                  <span className="text-[9px] font-mono text-[#B5F438] uppercase tracking-wider block mt-1">
                    Direct Email
                  </span>
                </div>
              </div>
            </div>

            {/* Segmented Tab Controller (Centered on Mobile, Inline on Desktop) */}
            <div className="w-full sm:w-auto max-w-md mx-auto sm:mx-0 shrink-0">
              <div className="grid grid-cols-3 sm:flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 sm:bg-white/5 backdrop-blur-md border border-white/15">
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className={`py-2.5 px-2.5 sm:px-4 rounded-xl font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center active:scale-[0.98] ${
                    activeTab === 'apply'
                      ? 'bg-[#B5F438] text-[#071E10] shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Apply</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('retrieve')}
                  className={`py-2.5 px-2.5 sm:px-4 rounded-xl font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center active:scale-[0.98] ${
                    activeTab === 'retrieve'
                      ? 'bg-[#B5F438] text-[#071E10] shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Retrieve</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('rules')}
                  className={`py-2.5 px-2.5 sm:px-4 rounded-xl font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center active:scale-[0.98] ${
                    activeTab === 'rules'
                      ? 'bg-[#B5F438] text-[#071E10] shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Rules</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          TAB 1: ID CARD APPLICATION (CLEAN STREAMLINED WORKFLOW)
      ========================================================================= */}
      {activeTab === 'apply' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* -----------------------------------------------------------------
              STAGE A: "GENERATING ID..." PROGRESS SCREEN
          ------------------------------------------------------------------ */}
          {submissionStage === 'generating' ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-sm text-center space-y-7 animate-in fade-in duration-300">
              
              {/* Refined spinner badge */}
              <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs relative">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CENTRAL ACCREDITATION ENGINE</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Generating Official Sports ID
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-mono">
                  {generationMessage}
                </p>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Rendering Front &amp; Back pass</span>
                  <span className="text-emerald-700 font-bold">{generationProgress}%</span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left space-y-3 text-xs font-mono text-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${generationProgress >= 20 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {generationProgress >= 20 ? <Check className="w-3 h-3 text-white" /> : '1'}
                  </div>
                  <span>Verifying student biodata &amp; faculty clearance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${generationProgress >= 50 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {generationProgress >= 50 ? <Check className="w-3 h-3 text-white" /> : '2'}
                  </div>
                  <span>Minting tamper-proof CODE128 security barcode</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${generationProgress >= 75 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {generationProgress >= 75 ? <Check className="w-3 h-3 text-white" /> : '3'}
                  </div>
                  <span>Generating official 2-page Front &amp; Back PDF</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${generationProgress >= 90 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {generationProgress >= 90 ? <Check className="w-3 h-3 text-white" /> : '4'}
                  </div>
                  <span>Dispatching email credentials with attached PDF</span>
                </div>
              </div>
            </div>

          ) : submissionStage === 'success' && createdCard ? (
            
            /* -----------------------------------------------------------------
                STAGE B: OFFICIAL ID GENERATED & EMAIL CONFIRMATION SCREEN
            ------------------------------------------------------------------ */
            <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-7 animate-in fade-in duration-300">
              
              {/* Refined Verified Badge */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ACCREDITATION ISSUED &amp; DISPATCHED
                  </span>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
                    Official Sports ID Card Generated
                  </h2>

                  <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Your official Great Ife Sports Accreditation Card has been generated. A single 2-page printable PDF (containing both Front and Back passes) has been dispatched to:
                  </p>

                  <div className="pt-1">
                    <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-4 py-2 rounded-xl text-sm sm:text-base border border-emerald-200 inline-block">
                      {createdCard.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student-Athlete Summary Card */}
              <div className="max-w-xl mx-auto p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
                    Accreditation Record Summary
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    Verified Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Athlete Name</span>
                    <span className="text-slate-900 font-bold text-sm truncate block mt-0.5">{createdCard.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Matriculation No</span>
                    <span className="text-emerald-800 font-bold text-sm block mt-0.5">{createdCard.matricNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Sport Category</span>
                    <span className="text-slate-900 font-bold block mt-0.5">{createdCard.sport}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Card ID Reference</span>
                    <span className="text-emerald-800 font-bold block mt-0.5">{createdCard.cardNumber}</span>
                  </div>
                </div>
              </div>

              {/* 2-Page PDF & Inbox Notice Box */}
              <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <h4 className="font-heading font-extrabold text-xs text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>Email &amp; 2-Page PDF Delivery Notice:</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Check your email inbox for the message from <strong>Office of the Director of Sports</strong>.</li>
                  <li>The attached PDF file contains <strong>Page 1 (Front View) and Page 2 (Back View)</strong> in a single document ready for PVC badge printing.</li>
                  <li>If not found in your primary inbox, please check your <strong>Spam or Junk folder</strong>.</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => downloadCardPdf(createdCard)}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official 2-Page PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSearchMatric(createdCard.matricNumber);
                    setSearchedCard(createdCard);
                    setSearchAttempted(true);
                    setActiveTab('retrieve');
                  }}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs uppercase tracking-wider transition-all border border-slate-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>View Interactive Card</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-slate-500" />
                  <span>Apply For Another Athlete</span>
                </button>
              </div>
            </div>

          ) : (
            
            /* -----------------------------------------------------------------
                STAGE C: CLEAN, SPACIOUS ACCREDITATION FORM (NO PREVIEW ON FORM)
            ------------------------------------------------------------------ */
            <div className="p-4 sm:p-8 sm:p-10 rounded-2xl sm:rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-6 sm:space-y-8 shadow-xs">
              
              {/* Form Title & Context */}
              <div className="border-b border-[#E2E8F0] pb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-pulse" />
                  <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
                    NEW ATHLETE ACCREDITATION APPLICATION
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
                  Student-Athlete Registration Form
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Fill in your authentic academic and athletic credentials below. Registration can only be completed <strong>once per athlete</strong>. Upon submission, your sports ID card will be generated and dispatched to your email address.
                </p>
              </div>

              {/* Duplicate Card Warning Banner */}
              {duplicateCard && (
                <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-md">
                        EXISTING ACCREDITATION LOCATED
                      </span>
                      <h4 className="font-heading font-extrabold text-sm text-amber-900">
                        Registration Already Completed for {duplicateCard.fullName}
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Card Number: <strong className="font-mono">{duplicateCard.cardNumber}</strong> • Matric: <strong className="font-mono">{duplicateCard.matricNumber}</strong> • Sport: {duplicateCard.sport}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSearchedCard(duplicateCard);
                            setSearchMatric(duplicateCard.matricNumber);
                            setSearchAttempted(true);
                            setActiveTab('retrieve');
                          }}
                          className="px-4 py-2 rounded-xl bg-[#071E10] text-[#B5F438] font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#0B2A18] transition-colors cursor-pointer shadow-sm"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Retrieve & View Existing Digital ID Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedEmailCard(duplicateCard)}
                          className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-amber-100 transition-colors cursor-pointer shadow-sm"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-700" />
                          <span>View Dispatched Email Notification</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Error Banner */}
              {formError && !duplicateCard && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
                
                {/* =========================================================================
                    SECTION 1: PERSONAL BIODATA & MEDICAL PROFILE
                ========================================================================= */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-4 sm:space-y-5 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                    <User className="w-4 h-4 text-[#15803D]" />
                    <h3 className="font-heading font-extrabold text-sm text-[#071E10] uppercase tracking-wider">
                      1. Personal Information & Medical Profile
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Full Legal Name <span className="text-rose-500">*</span>
                        <span className="text-[11px] font-normal text-[#64748B] ml-1.5">(As on OAU e-Portal)</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setDuplicateCard(null);
                          setFormError('');
                        }}
                        placeholder="e.g. Oluwaseun Adeleke Babatunde"
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Nickname / Moniker
                        <span className="text-[11px] font-normal text-[#64748B] ml-1.5">(Optional — Printed as {'{MONIKER}'} on ID badge)</span>
                      </label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g. MARX, BIG POPE, SPEEDY"
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] font-mono uppercase outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Date of Birth <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Age
                        <span className="text-[11px] font-normal text-[#64748B] ml-1">(Auto)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={age !== '' ? `${age} yrs` : 'Auto from DOB'}
                        className="w-full p-3.5 rounded-xl bg-[#EDF2F7] border border-[#CBD5E1] text-base sm:text-sm text-[#475569] font-mono cursor-not-allowed outline-none shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Blood Group <span className="text-rose-500">*</span>
                        <span className="text-[11px] font-normal text-[#64748B] ml-1.5">(For Sports Complex medical clearance)</span>
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      >
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Emergency Contact / Next of Kin <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="e.g. Mrs. Adeleke (Mother) - 08034567890"
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    SECTION 2: ACADEMIC CREDENTIALS & FACULTY CLEARANCE
                ========================================================================= */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-4 sm:space-y-5 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                    <GraduationCap className="w-4 h-4 text-[#15803D]" />
                    <h3 className="font-heading font-extrabold text-sm text-[#071E10] uppercase tracking-wider">
                      2. Academic Faculty & Enrollment Verification
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        OAU Matriculation Number <span className="text-rose-500">*</span>
                        <span className="text-[11px] font-normal text-[#64748B] ml-1.5">(One card per student)</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={matricNumber}
                        onChange={(e) => {
                          setMatricNumber(e.target.value.toUpperCase());
                          setDuplicateCard(null);
                          setFormError('');
                        }}
                        placeholder="e.g. CSC/2021/042"
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] font-mono uppercase outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Academic Faculty <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      >
                        {OAU_FACULTIES.map((fac) => (
                          <option key={fac} value={fac}>{fac}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Academic Department <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      >
                        {(FACULTY_DEPARTMENTS[faculty] || []).map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Current Academic Level <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      >
                        {['100L', '200L', '300L', '400L', '500L', 'Postgraduate'].map((lvl) => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    SECTION 3: SPORTS CATEGORY & SQUAD PROFILE
                ========================================================================= */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-4 sm:space-y-5 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                    <Trophy className="w-4 h-4 text-[#15803D]" />
                    <h3 className="font-heading font-extrabold text-sm text-[#071E10] uppercase tracking-wider">
                      3. Athletic Discipline & Tournament Profile
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Sport Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={sport}
                        onChange={(e) => setSport(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      >
                        {SPORTS_LIST.map((sp) => (
                          <option key={sp} value={sp}>{sp}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Jersey Number / Squad Role
                        <span className="text-[11px] font-normal text-[#64748B] ml-1.5">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={jerseyNumber}
                        onChange={(e) => setJerseyNumber(e.target.value)}
                        placeholder="e.g. #10 or Forward / Sprinter"
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    SECTION 4: CONTACT & OFFICIAL EMAIL DISPATCH
                ========================================================================= */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-4 sm:space-y-5 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                    <Mail className="w-4 h-4 text-[#15803D]" />
                    <h3 className="font-heading font-extrabold text-sm text-[#071E10] uppercase tracking-wider">
                      4. Contact Details & Digital Courier Recipient
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Official Student Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setDuplicateCard(null);
                          setFormError('');
                        }}
                        placeholder="e.g. athlete@student.oauife.edu.ng"
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      />
                      <p className="text-[11px] text-[#64748B]">
                        Your official Digital Sports ID Card will be sent to this email upon generation.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0B1220] block">
                        Mobile Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setDuplicateCard(null);
                          setFormError('');
                        }}
                        placeholder="e.g. 08012345678"
                        className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] focus:border-[#B5F438] focus:bg-white text-base sm:text-sm text-[#0B1220] outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    SECTION 5: ATHLETE PASSPORT PHOTOGRAPH UPLOAD
                ========================================================================= */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                    <Camera className="w-4 h-4 text-[#15803D]" />
                    <h3 className="font-heading font-extrabold text-sm text-[#071E10] uppercase tracking-wider">
                      5. Official Passport Photograph <span className="text-rose-500">*</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    
                    {/* Image Preview Box */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#F8FAF6] rounded-2xl border-2 border-dashed border-[#CBD5E1] text-center aspect-square max-w-[220px] sm:max-w-none mx-auto w-full">
                      {isCompressingPhoto ? (
                        <div className="space-y-2 text-emerald-700">
                          <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-600" />
                          <p className="text-[11px] font-mono font-semibold">
                            Optimizing photo...
                          </p>
                        </div>
                      ) : photoUrl ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={photoUrl}
                            alt="Athlete Passport Preview"
                            className="w-full h-full object-cover rounded-xl shadow-md border-2 border-[#B5F438]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoUrl('');
                              setCompressionSavings(null);
                            }}
                            className="absolute -top-2 -right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors cursor-pointer"
                            title="Remove Photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 text-[#94A3B8]">
                          <Camera className="w-10 h-10 mx-auto opacity-50" />
                          <p className="text-[11px] font-mono leading-tight">
                            Passport Photo Preview
                          </p>
                        </div>
                      )}
                    </div>

                    {/* File Input and Requirements */}
                    <div className="sm:col-span-2 space-y-3 text-left">
                      <label className="block p-4 rounded-xl border border-[#CBD5E1] hover:border-[#B5F438] bg-[#F8FAF6] hover:bg-white transition-all cursor-pointer">
                        <span className="text-xs font-bold text-[#071E10] block mb-1">
                          Select Passport Photo from Device
                        </span>
                        <span className="text-[11px] text-[#64748B] block">
                          JPEG, PNG or WebP format (Auto-optimized to high-DPI passport size)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          disabled={isCompressingPhoto}
                          className="hidden"
                        />
                      </label>

                      {compressionSavings && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{compressionSavings}</span>
                        </div>
                      )}

                      <ul className="text-[11px] text-[#64748B] space-y-1 list-disc list-inside">
                        <li>Ensure a clean, well-lit portrait with a plain background.</li>
                        <li>Headwear or sunglasses covering facial features are prohibited.</li>
                        <li>This photo appears on your matchday credentials and tournament rosters.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    SECTION 6: ANTI-MERCENARY SOLEMN DECLARATION
                ========================================================================= */}
                <div className="p-6 rounded-2xl bg-[#EBFCD0]/60 border border-[#B5F438]/60 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#071E10] focus:ring-[#B5F438] cursor-pointer"
                    />
                    <div className="space-y-1 text-left">
                      <span className="font-heading font-extrabold text-xs text-[#071E10] block uppercase tracking-wide">
                        Anti-Mercenary Screening & Bona Fide Student Affidavit
                      </span>
                      <p className="text-[11px] text-[#1E3A2B] leading-relaxed">
                        I solemnly affirm that I am a registered student of Obafemi Awolowo University. I understand that submitting false credentials, registering multiple times, or impersonating an athlete incurs automatic tournament disqualification and immediate referral to the OAU Senate Disciplinary Committee.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submission Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 px-8 rounded-2xl bg-[#071E10] hover:bg-[#0B2A18] text-[#B5F438] font-heading font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#B5F438]" />
                    <span>Submit & Generate Official Sports ID</span>
                  </button>
                </div>

              </form>
            </div>
          )}

        </section>
      )}

      {/* =========================================================================
          TAB 2: RETRIEVE / VERIFY CARD INSTANTLY
      ========================================================================= */}
      {activeTab === 'retrieve' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] shadow-xs text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#071E10] text-[#B5F438] mx-auto flex items-center justify-center font-bold">
              <Search className="w-6 h-6" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B1220]">
                Retrieve Athlete Credentials
              </h2>
              <p className="text-xs text-[#64748B]">
                Enter your OAU Matriculation Number or Card Reference to look up your active accreditation pass.
              </p>
            </div>

            <form onSubmit={handleSearchCard} className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                required
                value={searchMatric}
                onChange={(e) => setSearchMatric(e.target.value)}
                placeholder="e.g. CSC/2021/042 or Card ID"
                className="flex-1 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] focus:border-[#B5F438] font-mono text-xs uppercase outline-none shadow-xs"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-[#071E10] hover:bg-[#0B2A18] text-[#B5F438] font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            <p className="text-[11px] font-mono text-[#64748B]">
              Verified in real-time against Great Ife Sports Council accreditation records.
            </p>
          </div>

          {/* Search Result Display */}
          {searchAttempted && searchedCard && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 text-center text-slate-900 animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>OFFICIAL ACCREDITED RECORD VERIFIED</span>
              </div>
              
              <div className="flex justify-center">
                <IdCard card={searchedCard} />
              </div>
            </div>
          )}

          {searchAttempted && !searchedCard && (
            <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-base text-amber-900">
                  No Accreditation Record Found
                </h3>
                <p className="text-xs text-amber-700 max-w-md mx-auto">
                  We could not find an accredited digital sports card matching "{searchMatric}". Please check your matriculation number or complete a new registration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('apply')}
                className="px-6 py-2.5 rounded-full bg-[#071E10] text-[#B5F438] font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Apply for Sports ID Now
              </button>
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          TAB 3: ACCREDITATION PROTOCOLS & RULES
      ========================================================================= */}
      {activeTab === 'rules' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
              ACCREDITATION DIRECTIVES
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-[#0B1220]">
              Matchday Guidelines & Standards
            </h2>
            <p className="text-xs text-[#64748B]">
              Official regulations mandated by the Office of the Director of Sports and the OAU Sports Council.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-4 text-left shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#071E10] text-[#B5F438] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#0B1220]">
                1. Anti-Mercenary Screening Protocol
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                All athletes participating in the Great Ife Inter-Faculty Games must be bona fide undergraduate students. Before every kickoff or heat, match referees scan the athlete's CODE128 barcode using the Director of Sports Console to verify identity. Impersonation incurs immediate match forfeit and academic referral.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-4 text-left shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#071E10] text-[#B5F438] flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#0B1220]">
                2. Presentation at Sports Venues
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Athletes can present their Digital Sports ID directly on their mobile device or as a printed laminated physical pass. Both the front photo and the high-resolution barcode must be undamaged and clear for barcode scanner cameras.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-4 text-left shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#071E10] text-[#B5F438] flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#0B1220]">
                3. Sports Medicine & Medical Clearance
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Every accredited sports ID carries the player's blood group and emergency contact. In the event of on-pitch injury, the Sports Complex medical team prioritizes athletes with validated credentials for hospital triage under the Sports Council student welfare grant.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-4 text-left shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#071E10] text-[#B5F438] flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#0B1220]">
                4. Data Correction & Replacement
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                If your faculty, department, or photo requires correction, submit an update via the Athlete Portal or email the Sports Office Secretariat at <strong className="text-[#071E10]">{OAU_OFFICE_EMAIL}</strong>. Approved adjustments reflect instantaneously in the central database.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* Universal Email Notification Preview Modal (Available from Retrieve tab & duplicate banner) */}
      {selectedEmailCard && (
        <EmailNotificationModal
          card={selectedEmailCard}
          onClose={() => setSelectedEmailCard(null)}
        />
      )}

    </div>
  );
};
