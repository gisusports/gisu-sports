import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowUpRight,
  Play,
  Users,
  Trophy,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Activity,
  HeartPulse,
  Award,
  CheckCircle2,
  Target,
  Shield,
  Sparkles,
  ChevronDown,
  Building,
  Stethoscope,
  Quote,
  Flame,
  BookOpen,
  Compass,
  Scale,
  Check,
  Search,
  Building2,
  Landmark,
  GraduationCap,
  Gavel,
  Medal,
  HeartHandshake,
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const { matches } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [aerialView, setAerialView] = useState<'arena' | 'boulevard'>('arena');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [facultyFilter, setFacultyFilter] = useState<string>('all');
  const [facultySearch, setFacultySearch] = useState<string>('');

  // Architectural Hotspots plotted on the 4K Aerial perspectives
  const arenaHotspots = [
    {
      id: 'stadium',
      label: 'Main Athletics Bowl',
      top: '62%',
      left: '58%',
      specs: '10,000 Capacity • 400m Tartan Oval • Natural Grass Football Pitch',
      category: 'TRACK & FIELD / SOCCER',
    },
    {
      id: 'aquatics',
      label: 'Olympic Aquatics Pavilion',
      top: '61%',
      left: '41%',
      specs: '50m 10-Lane Competition Pool • Diving Platform • Spectator Seating',
      category: 'SWIMMING & AQUATICS',
    },
    {
      id: 'tennis',
      label: 'Racket & Tennis Hardcourts',
      top: '73%',
      left: '30%',
      specs: 'Collegiate Acrylic Hardcourts • Tournament Floodlighting',
      category: 'TENNIS & SQUASH',
    },
    {
      id: 'sub-courts',
      label: 'SUB Basketball Arena',
      top: '89%',
      left: '31%',
      specs: '4 Floodlit Multi-Sport Hardcourts • Inter-Hall Collegiate League',
      category: 'BASKETBALL & VOLLEYBALL',
    },
    {
      id: 'hills-backdrop',
      label: 'Sacred Hills of Ile-Ife',
      top: '30%',
      left: '35%',
      specs: 'Iconic Rolling Mountain Ridges • University Canopy & Landscape',
      category: 'CAMPUS HORIZON',
    },
  ];

  const boulevardHotspots = [
    {
      id: 'road1-main',
      label: 'Central Campus Boulevard (Road 1)',
      top: '75%',
      left: '48%',
      specs: 'Dual-Carriageway Arterial Avenue with Central Green Median',
      category: 'CAMPUS BOULEVARD',
    },
    {
      id: 'nexus-roundabout',
      label: 'Triangular Park & Nexus',
      top: '51%',
      left: '48%',
      specs: 'Landscaped Entrance Nexus Connecting Gate to Academic Core',
      category: 'CAMPUS LANDMARK',
    },
    {
      id: 'complex-west',
      label: 'OAU Sports Complex (West Flank)',
      top: '72%',
      left: '22%',
      specs: '400m Tartan Oval & Collegiate Football Grounds',
      category: 'ATHLETIC ARENA',
    },
    {
      id: 'academic-core',
      label: 'University Academic Core',
      top: '40%',
      left: '43%',
      specs: 'Oduduwa Hall, Senate Building & Faculty Complexes',
      category: 'ACADEMIC HERITAGE',
    },
    {
      id: 'ife-mountains',
      label: 'Ile-Ife Mountain Horizon',
      top: '18%',
      left: '33%',
      specs: 'Lush Tropical Foothills of Obafemi Awolowo University',
      category: 'NATURAL PANORAMA',
    },
  ];

  const tickerItems = [
    'Digital Sports ID Verification',
    'Real-Time LiveScores (Anticipate)',
    '15 Accredited OAU Faculties',
    'Anti-Mercenary Code128 Protocol',
    'NUGA & WAUG Varsity Representation',
    'Dean\'s Cup Championship 2026',
    '10,000 Capacity Main Bowl',
  ];

  // The 15 Accredited Faculties of Obafemi Awolowo University
  const facultiesList = [
    {
      name: 'Faculty of Technology',
      shortName: 'TECH',
      division: 'tech',
      nickname: 'Tech Tigers / Engineers',
      colors: 'Emerald Green & White',
      heritage: 'Dean\'s Cup powerhouse renowned for high-intensity football, tactical volleyball, and dominant athletics sprint relay teams.',
      sportsStronghold: 'Football, Athletics, Table Tennis',
      squadCount: '180+ Athletes',
      colorBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      name: 'Faculty of Administration',
      shortName: 'ADMIN',
      division: 'social',
      nickname: 'Admin Stallions / Strategists',
      colors: 'Royal Blue & Gold',
      heritage: 'Defending football champions with exceptional tactical depth in mid-court basketball and competitive collegiate badminton.',
      sportsStronghold: 'Football, Basketball, Chess',
      squadCount: '160+ Athletes',
      colorBadge: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      name: 'Faculty of Clinical Sciences',
      shortName: 'HEALTH',
      division: 'health',
      nickname: 'Clinical Giants / Healers',
      colors: 'Crimson Red & White',
      heritage: 'Balancing rigorous medical studies with collegiate basketball supremacy and elite long-distance track endurance.',
      sportsStronghold: 'Basketball, Track & Field, Swimming',
      squadCount: '140+ Athletes',
      colorBadge: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      name: 'Faculty of Social Sciences',
      shortName: 'SOC',
      division: 'social',
      nickname: 'Social Giants / Economists',
      colors: 'Maroon & Cream',
      heritage: 'Massive student fanbase with perennial strength in sprinting, handball, and high-intensity inter-faculty derbies.',
      sportsStronghold: 'Handball, 100m Sprint, Football',
      squadCount: '175+ Athletes',
      colorBadge: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      name: 'Faculty of Law',
      shortName: 'LAW',
      division: 'humanities',
      nickname: 'Law Jurists / Advocates',
      colors: 'Imperial Purple & Gold',
      heritage: 'Historic champions in lawn tennis, table tennis, and strategic mind games with passionate stadium cheering delegations.',
      sportsStronghold: 'Lawn Tennis, Scrabble, Table Tennis',
      squadCount: '120+ Athletes',
      colorBadge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      name: 'Faculty of Computing',
      shortName: 'COMP',
      division: 'tech',
      nickname: 'Computing Cyber Strikers',
      colors: 'Cyan & Dark Navy',
      heritage: 'OAU\'s vanguard computing college, excelling in rapid analytical play, tactical indoor mind games, and inter-faculty basketball.',
      sportsStronghold: 'Chess & Scrabble, Basketball, Table Tennis',
      squadCount: '135+ Athletes',
      colorBadge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    },
    {
      name: 'Faculty of Nursing Science',
      shortName: 'NURS',
      division: 'health',
      nickname: 'Nightingale Titans / Care Vanguards',
      colors: 'Pure White & Medical Teal',
      heritage: 'Autonomous healthcare college celebrated for athletic resilience, endurance track relays, and collegiate volleyball.',
      sportsStronghold: 'Volleyball, 4x100m Relay, Badminton',
      squadCount: '120+ Athletes',
      colorBadge: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      name: 'Faculty of Pharmacy',
      shortName: 'PHARM',
      division: 'health',
      nickname: 'Pharmacy Elixirs',
      colors: 'Deep Green & Violet',
      heritage: 'Pioneers in collegiate badminton, martial arts discipline, and disciplined sports medicine adherence.',
      sportsStronghold: 'Badminton, Taekwondo, Volleyball',
      squadCount: '110+ Athletes',
      colorBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      name: 'Faculty of Science',
      shortName: 'SCI',
      division: 'health',
      nickname: 'Science Quantum Strikers',
      colors: 'Cobalt Blue & Silver',
      heritage: 'OAU\'s largest science contingent with elite swimming competitors, distance runners, and inter-faculty judokas.',
      sportsStronghold: 'Swimming, Judo, Cross-Country',
      squadCount: '190+ Athletes',
      colorBadge: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      name: 'Faculty of Agriculture',
      shortName: 'AGRIC',
      division: 'education',
      nickname: 'Agric Green Vanguards',
      colors: 'Forest Green & Gold',
      heritage: 'Formidable physical prowess in collegiate rugby, field hockey, shotput, and decathlon events.',
      sportsStronghold: 'Field Events, Hockey, Football',
      squadCount: '150+ Athletes',
      colorBadge: 'bg-lime-50 text-lime-800 border-lime-200',
    },
    {
      name: 'Faculty of Environmental Design & Management',
      shortName: 'EDM',
      division: 'tech',
      nickname: 'EDM Builders / Architects',
      colors: 'Architectural Orange & Black',
      heritage: 'Known for tactical sports architecture, rapid counter-attacking football, and passionate inter-departmental leagues.',
      sportsStronghold: 'Football, Basketball, Volleyball',
      squadCount: '145+ Athletes',
      colorBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      name: 'Faculty of Arts',
      shortName: 'ARTS',
      division: 'humanities',
      nickname: 'Arts Gladiators / Cultural Warriors',
      colors: 'Burgundy & Bronze',
      heritage: 'Rich athletic heritage in combat sports, martial arts, and spirited track cheering traditions that electrify the Main Bowl.',
      sportsStronghold: 'Combat Sports, Sprinting, Drama Trophy',
      squadCount: '165+ Athletes',
      colorBadge: 'bg-red-50 text-red-800 border-red-200',
    },
    {
      name: 'Faculty of Education',
      shortName: 'EDU',
      division: 'education',
      nickname: 'Education Pioneers',
      colors: 'Royal Amber & Navy',
      heritage: 'Pioneering physical education specialists producing university varsity trainers, coaches, and athletics referees.',
      sportsStronghold: 'Track & Field, Volleyball, Fitness',
      squadCount: '155+ Athletes',
      colorBadge: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    },
    {
      name: 'Faculty of Basic Medical Sciences',
      shortName: 'BMS',
      division: 'health',
      nickname: 'Med-Sci Phantoms',
      colors: 'Teal & Deep Navy',
      heritage: 'Specialists in sports physiology, athletic conditioning, collegiate squash, and sprint relays.',
      sportsStronghold: 'Squash, Relays, Table Tennis',
      squadCount: '125+ Athletes',
      colorBadge: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      name: 'Faculty of Dentistry',
      shortName: 'DENT',
      division: 'health',
      nickname: 'Dental Titans',
      colors: 'Cyan & Pure White',
      heritage: 'Close-knit athletic unit with precision performance in collegiate racket sports, badminton, and chess tournaments.',
      sportsStronghold: 'Table Tennis, Badminton, Chess',
      squadCount: '95+ Athletes',
      colorBadge: 'bg-slate-50 text-slate-800 border-slate-200',
    },
  ];

  // Filter faculties based on selected division and search query
  const filteredFaculties = useMemo(() => {
    return facultiesList.filter((fac) => {
      const matchesDivision =
        facultyFilter === 'all' || fac.division === facultyFilter;
      const matchesSearch =
        facultySearch.trim() === '' ||
        fac.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
        fac.shortName.toLowerCase().includes(facultySearch.toLowerCase()) ||
        fac.sportsStronghold.toLowerCase().includes(facultySearch.toLowerCase()) ||
        fac.nickname.toLowerCase().includes(facultySearch.toLowerCase());
      return matchesDivision && matchesSearch;
    });
  }, [facultyFilter, facultySearch]);

  // 4-Step Accreditation Protocol
  const accreditationSteps = [
    {
      step: '01',
      title: 'Matriculation Verification',
      desc: 'Automatic student matriculation validation confirming active academic enrollment across any of the 15 accredited OAU faculties.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Fitness & Medical Compliance',
      desc: 'Verification of resting medical fitness adhering to Obafemi Awolowo University Health Centre athletic safety standards.',
      icon: HeartPulse,
    },
    {
      step: '03',
      title: 'Cryptographic Barcode Issuance',
      desc: 'The Sports Directorate generates a unique registration code with CODE128 barcode encryption for instant matchday scanning.',
      icon: Target,
    },
    {
      step: '04',
      title: 'Official Dual-Seal Digital Pass',
      desc: 'Instant generation of verified digital sports credentials bearing authenticated GISU and OAU university seals.',
      icon: ShieldCheck,
    },
  ];

  // Campus Sports Facilities
  const campusFacilities = [
    {
      name: 'Main Bowl Stadium',
      category: 'TRACK & FOOTBALL ARENA',
      specs: '10,000 Capacity • 400m Tartan Oval • Natural Grass',
      status: 'Matchday Ready',
      desc: 'Home of the Inter-Faculty Dean\'s Cup finals, varsity athletics screenings, and collegiate track fixtures.',
    },
    {
      name: 'Olympic Swimming Pavilion',
      category: 'AQUATICS CENTRE',
      specs: '50m Olympic Pool • 10-Lane Diving Tower • Spectator Stands',
      status: 'Open for Training',
      desc: 'Collegiate aquatics facility designed for varsity swim meets, water polo, and student conditioning sessions.',
    },
    {
      name: 'Indoor Sports Gymnasium',
      category: 'MULTI-COURT ARENA',
      specs: 'Hardwood Flooring • Electronic Scoreboard • Combat Area',
      status: 'Open for Training',
      desc: 'Dedicated indoor pavilion for Table Tennis, Badminton, Judo, Taekwondo, and combat sports trials.',
    },
    {
      name: 'SUB Multi-Sport Hardcourts',
      category: 'OUTDOOR HARDCOURTS',
      specs: '4 Floodlit Courts • Basketball, Volleyball & Tennis',
      status: 'Open Access',
      desc: 'High-energy student hardcourts adjacent to the Students\' Union Building for evening inter-hall basketball.',
    },
  ];

  // Varsity Hall of Fame Athletes (Demo Showcase - Directorate Executive Leadership)
  const hallOfFameAthletes = [
    {
      name: 'Abdul Yekeen Muiz Olayinka',
      faculty: 'Faculty of Administration',
      department: 'Public Administration',
      sport: 'Football (Central Midfield)',
      honor: 'Dean\'s Cup Golden Ball',
      record: 'Varsity Squad Lead • Demo Profile',
      avatar: '/pa_director_abdul_muiz.jpg?v=2026_real',
    },
    {
      name: 'Omolere Emmanuel Opemiposi',
      faculty: 'Faculty of Technology',
      department: 'Mechanical Engineering',
      sport: 'Basketball (Point Guard)',
      honor: 'NUGA Finals MVP',
      record: 'Team Captain, OAU Giants • Demo Profile',
      avatar: '/chief_of_staff.jpg?v=2026_real',
    },
    {
      name: 'Jesujoba Adeleke',
      faculty: 'Faculty of Arts',
      department: 'Dramatic Arts',
      sport: 'Athletics (100m & 200m Sprint)',
      honor: '2x NUGA Gold Medalist',
      record: '10.24s Record Holder • Demo Profile',
      avatar: '/head_media_jesujoba_adeleke.jpg?v=2026_real',
    },
    {
      name: 'Faozan Olamilekan Owolabi',
      faculty: 'Faculty of Science',
      department: 'Computer Science',
      sport: 'Table Tennis (Singles & Doubles)',
      honor: 'WAUG West African Champion',
      record: 'Unbeaten in 14 Matches • Demo Profile',
      avatar: '/head_admin_affairs.jpg?v=2026_real',
    },
  ];

  // FAQs
  const faqs = [
    {
      q: 'What is the mandate of the Great Ife Students\' Union (GISU) Sports Council?',
      a: 'The GISU Sports Council is established under the Great Ife Students\' Union Constitution to manage student athletic welfare, coordinate competitive tournaments across all 15 faculties, allocate sporting facilities, and advocate for student athletes in collaboration with the university administration.',
    },
    {
      q: 'How does the Inter-Faculty Dean\'s Cup tournament operate across the 15 faculties?',
      a: 'The Dean\'s Cup is the premier annual sports festival at Obafemi Awolowo University. All 15 accredited faculties enter verified student squads across 15 sanctioned sports disciplines. Group stages lead into knockout derbies held at the Main Bowl Stadium.',
    },
    {
      q: 'Who is eligible to apply for the Great Ife Digital Sports ID?',
      a: 'All fully matriculated undergraduate and postgraduate students of Obafemi Awolowo University (OAU) across all 15 faculties are eligible. Simply enter your verified matric number, faculty, department, and sport discipline.',
    },
    {
      q: 'How does anti-mercenary barcode verification work on matchday?',
      a: 'Each issued ID card carries a cryptographic CODE128 barcode registered in the central sports registry. Match officials scan the code using the Director of Sports Console to verify identity and eliminate ineligible mercenaries.',
    },
    {
      q: 'How does the Sports Council Tribunal resolve match protests and appeals?',
      a: 'Faculty sports directors can lodge petitions through the Sports Office portal. The Directorate of Sports and Tribunal review match official reports, video evidence, and athlete credentials before issuing written, binding resolutions.',
    },
    {
      q: 'How can student societies or residential halls book campus sports venues?',
      a: 'Facility booking requests can be submitted through the Sports Office Support portal on this platform or in person at the Sports Complex Secretariat, Obafemi Awolowo University, Ile-Ife.',
    },
  ];

  return (
    <div className="text-left bg-[#FFFFFF]">
      
      {/* =========================================================================
          CHAPTER 1: THE CALL TO GREATNESS (HERO SECTION & TICKER)
      ========================================================================= */}
      <section className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between overflow-hidden text-white bg-[#071E10] pt-16 sm:pt-20">
        
        {/* Full-Bleed Sports Field Stadium Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src="/sports_stadium_bg.jpg"
            alt="University Sports Arena Field"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center transform scale-105"
          />
        </div>

        {/* Deep Green Cinematic Gradient Overlay (Optimized for Mobile Vertical Legibility & Desktop Horizontal Bleed) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071E10]/95 via-[#071E10]/85 to-[#071E10] lg:bg-gradient-to-r lg:from-[#071E10] lg:via-[#071E10]/90 lg:to-[#071E10]/30 z-10" />
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 right-1/4 w-[420px] h-[420px] bg-[#B5F438]/10 rounded-full blur-3xl z-10 pointer-events-none" />

        {/* Center Hero Viewport Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center relative z-20 py-4 sm:py-8 lg:py-12">
          
          {/* =================================================================
              MOBILE VIEW (< lg screens) - CENTER-ALIGNED, SLEEK, ERGONOMIC
          ================================================================= */}
          <div className="flex lg:hidden flex-col items-center justify-center space-y-4 xs:space-y-5 w-full max-w-lg mx-auto py-2 text-center">
            
            {/* Mobile Eyebrow Pill */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-[#B5F438] shadow-xs">
                <Shield className="w-3.5 h-3.5 text-[#B5F438]" />
                <span>GISU • DIRECTORATE OF SPORTS</span>
              </div>
            </div>

            {/* Mobile Headline with Dynamic Accent */}
            <h1 className="font-heading text-[2.2rem] xs:text-[2.6rem] font-bold text-white tracking-tight leading-[1.08] text-center">
              Empower your <br />
              <span className="text-white">athletic future</span> <br />
              <span className="text-[#B5F438] relative inline-block">
                today.
                <svg
                  className="absolute -bottom-1 left-0 w-full h-2 text-[#B5F438] pointer-events-none"
                  viewBox="0 0 220 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 14C60 4 160 4 216 10"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Mobile Subtitle */}
            <p className="text-slate-200 text-xs xs:text-sm leading-relaxed font-normal text-center max-w-md mx-auto">
              Official athletic accreditation &amp; tournament governance for Obafemi Awolowo University. Verified student-athlete passes across all 15 faculties.
            </p>

            {/* Mobile Fast-Stat Institutional Strip */}
            <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm w-full max-w-md mx-auto text-center">
              <div className="text-center">
                <span className="font-heading font-extrabold text-sm xs:text-base text-white block leading-none">
                  15
                </span>
                <span className="text-[10px] font-mono text-[#B5F438] uppercase tracking-wider block mt-1">
                  Faculties
                </span>
              </div>
              <div className="text-center border-l border-white/10">
                <span className="font-heading font-extrabold text-sm xs:text-base text-white block leading-none">
                  15
                </span>
                <span className="text-[10px] font-mono text-[#B5F438] uppercase tracking-wider block mt-1">
                  Varsity Sports
                </span>
              </div>
              <div className="text-center border-l border-white/10">
                <span className="font-heading font-extrabold text-sm xs:text-base text-white block leading-none">
                  100%
                </span>
                <span className="text-[10px] font-mono text-[#B5F438] uppercase tracking-wider block mt-1">
                  Verified Athletes
                </span>
              </div>
            </div>

            {/* Mobile Actions Stack */}
            <div className="space-y-2.5 pt-1 w-full max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('sport-id')}
                className="w-full bg-[#B5F438] hover:bg-[#C5FA54] active:scale-[0.99] text-[#071E10] font-heading font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-full flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer"
              >
                <span>Apply for Digital Sports ID</span>
                <div className="w-6 h-6 rounded-full bg-[#071E10] text-[#B5F438] flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab('livescore')}
                className="w-full bg-white/10 hover:bg-white/15 active:scale-[0.99] text-white font-heading font-semibold text-xs tracking-wider py-3.5 px-5 rounded-full border border-white/15 flex items-center justify-center gap-2.5 backdrop-blur-md cursor-pointer transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#B5F438] flex items-center justify-center text-[#071E10] shrink-0">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>LiveScores</span>
                <span className="text-[10px] font-mono font-bold bg-[#B5F438]/20 text-[#B5F438] px-2 py-0.5 rounded border border-[#B5F438]/30">
                  ANTICIPATE
                </span>
              </button>
            </div>

          </div>

          {/* =================================================================
              DESKTOP VIEW (>= lg screens) - 100% UNCHANGED CURRENT DESIGN
          ================================================================= */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Institutional Eyebrow Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-semibold text-[#B5F438]">
                <Shield className="w-3.5 h-3.5" />
                <span>GREAT IFE STUDENTS' UNION • DIRECTORATE OF SPORTS</span>
              </div>

              {/* Main Headline - Balanced & Disciplined */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
                Empower your <br />
                <span className="text-white">athletic future</span> <br />
                <span className="text-[#B5F438] relative inline-block">
                  today.
                  <svg
                    className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full h-2.5 sm:h-3 text-[#B5F438] pointer-events-none"
                    viewBox="0 0 220 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 14C60 4 160 4 216 10"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtitle - Professional, Clear, Legible */}
              <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
                Official athletic accreditation and collegiate tournament governance for Obafemi Awolowo University. Verified digital athlete credentials, match telemetry, and student welfare across all 15 faculties.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('sport-id')}
                  className="w-full sm:w-auto bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-bold text-sm px-6 py-3.5 rounded-full flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-0.5"
                >
                  <span>Apply for Digital ID Card</span>
                  <div className="w-6 h-6 rounded-full bg-[#071E10] text-[#B5F438] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('livescore')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 text-white font-heading font-semibold text-sm hover:text-[#B5F438] transition-colors cursor-pointer group bg-white/10 hover:bg-white/15 backdrop-blur-md px-5 py-3.5 rounded-full border border-white/20"
                >
                  <div className="w-6 h-6 rounded-full bg-[#B5F438] flex items-center justify-center text-[#071E10] group-hover:scale-105 transition-transform shadow-xs shrink-0">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <span className="flex items-center gap-2">
                    <span>LiveScores</span>
                    <span className="text-[11px] font-mono font-bold bg-[#B5F438]/20 text-[#B5F438] px-2 py-0.5 rounded border border-[#B5F438]/30">ANTICIPATE</span>
                  </span>
                </button>
              </div>

            </div>

            {/* Right Hero Space - 4K Aerial Perspective Preview Card */}
            <div className="lg:col-span-4 flex justify-end items-end h-full">
              <div className="p-4 rounded-2xl bg-[#071E10]/95 backdrop-blur-xl border border-white/15 text-white max-w-sm shadow-xl space-y-3.5">
                {/* 4K Live Aerial Mini Preview */}
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/15 group shadow-inner">
                  <img
                    src="/oau_sports_complex_aerial.jpg"
                    alt="OAU Sports Complex 4K Aerial View"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071E10] via-transparent to-transparent opacity-85" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071E10]/90 backdrop-blur-md text-[#B5F438] text-[11px] font-mono font-bold border border-[#B5F438]/40 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5F438] animate-pulse" />
                    <span>AERIAL 4K // OAU SPORTS ARENA</span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-left">
                    <span className="text-xs font-mono text-white/90 font-medium block truncate">
                      Main Bowl • 400m Tartan Oval • 10,000 Cap.
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-left px-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#B5F438]">
                    <Trophy className="w-3.5 h-3.5 text-[#B5F438]" />
                    <span>INTER-FACULTY DEAN'S CUP 2026</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-white">
                    Collegiate Arena of Champions
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Governing 15 sanctioned sports disciplines across all 15 accredited faculties.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('about')}
                  className="w-full py-2.5 rounded-lg bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs group"
                >
                  <span>Explore Complex & Facilities</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Ticker Bar */}
        <div className="bg-[#071E10]/95 backdrop-blur-md border-t border-white/10 py-3 overflow-hidden z-20 relative shrink-0">
          <div className="flex items-center gap-10 whitespace-nowrap animate-[marquee_28s_linear_infinite]">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-10 shrink-0">
                <svg className="w-3.5 h-3.5 text-[#B5F438] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L12 2Z" />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide font-mono">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* =========================================================================
          SUBSEQUENT CHAPTERS CONTAINER
      ========================================================================= */}
      <div className="space-y-20 sm:space-y-24 pb-24">
      <section className="relative bg-[#FAFAFA] border-b border-slate-200/80 py-16 sm:py-20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Institutional Eyebrow & Lead Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
              <Landmark className="w-3.5 h-3.5 text-emerald-700" />
              <span>OBAFEMI AWOLOWO UNIVERSITY • ATHLETIC HERITAGE SINCE 1962</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              The Citadel of Champions: For Learning, Culture & Athletic Glory
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              At Obafemi Awolowo University, collegiate athletics represents character development, student solidarity, and physical excellence. Under the historic motto <strong className="text-slate-900 font-semibold">"For Learning and Culture"</strong>, Great Ife sports has shaped African champions and national record-breakers for over six decades.
            </p>
          </div>

          {/* Two-Column Editorial Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: The 3 Institutional Foundational Pillars as an Editorial Charter */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="border-l-2 border-emerald-700 pl-4 py-1 text-slate-700 italic text-sm sm:text-base leading-relaxed">
                "Here, the lecture theatre and the athletic grounds are indivisible. Every student who takes the pitch carries both scholarly discipline and the pride of Great Ife."
              </div>

              {/* Editorial Charter Points (Numbered, Mature, Non-boxed) */}
              <div className="space-y-6 pt-2">
                
                {/* Principle 01 */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                  <span className="font-mono text-base font-bold text-emerald-800 shrink-0 mt-0.5">
                    01
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      Academic & Athletic Synergy
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Great Ife athletes are genuine scholar-athletes. Students representing their faculties and the university varsity roster hail from demanding academic colleges—Medicine, Engineering, Law, Pharmacy, Sciences, and Administration—proving that intellectual discipline and physical supremacy walk hand in hand.
                    </p>
                    <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-mono text-emerald-700 font-semibold">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>100% Matriculated Undergraduate & Postgraduate Scholar Roster</span>
                    </div>
                  </div>
                </div>

                {/* Principle 02 */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                  <span className="font-mono text-base font-bold text-emerald-800 shrink-0 mt-0.5">
                    02
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      The Spirit of Great Ife Solidarity
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Collegiate sport is the heartbeat of campus unity. From the thunderous drumming delegations of Awolowo Hall to the stadium chants reverberating across the Main Bowl during the Inter-Faculty Dean's Cup, athletics unites our 35,000+ student body in unmatched solidarity and university pride.
                    </p>
                    <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-mono text-emerald-700 font-semibold">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Unbroken Campus Camaraderie Across All 15 Faculties</span>
                    </div>
                  </div>
                </div>

                {/* Principle 03 */}
                <div className="flex items-start gap-4">
                  <span className="font-mono text-base font-bold text-emerald-800 shrink-0 mt-0.5">
                    03
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      Meritocracy & Anti-Mercenary Integrity
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      The Great Ife Students' Union enforces absolute zero tolerance for mercenary or unregistered athletes. Every student competitor undergoes mandatory academic verification and medical clearance before being issued a cryptographic CODE128 barcode credential, ensuring the purity and honour of university competition.
                    </p>
                    <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-mono text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Cryptographic Verification & Health Centre Medical Screening</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Institutional Heritage Matte & Archival Photo */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Archival Campus Grounds Photograph */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm group">
                <div className="h-56 sm:h-64 overflow-hidden relative">
                  <img
                    src="/oau_sports_complex_aerial.jpg"
                    alt="Great Ife Sports Complex & Main Bowl Stadium"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-mono font-bold text-[#B5F438] uppercase tracking-wider block">
                      CAMPUS ATHLETIC GROUNDS • ILE-IFE
                    </span>
                    <span className="text-xs font-medium text-slate-200 leading-snug block">
                      Main Bowl Stadium & Olympic Pavilion framed by the sacred hills of Ile-Ife
                    </span>
                  </div>
                </div>

                {/* Authenticated Dual Crests Banner */}
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-2 shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-700 bg-[#4A0E17] shadow-xs z-10 p-0.5">
                        <img src="/gisu_logo.jpg" alt="GISU Seal" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 bg-white shadow-xs z-0 p-1">
                        <img src="/oau_logo.jpg" alt="OAU Seal" loading="lazy" decoding="async" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-heading font-bold text-slate-900 block leading-tight">
                        Great Ife Students' Union
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        Official Directorate of Sports Charter
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 shrink-0">
                    SANCTIONED
                  </span>
                </div>
              </div>

              {/* Historic Milestones Grid (Integrated & Refined) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <span className="text-2xl font-mono font-bold text-emerald-800 block">1962</span>
                  <span className="text-xs font-heading font-semibold text-slate-900 block">Collegiate Inception</span>
                  <p className="text-[11px] text-slate-500 leading-tight">Founding of university athletics tradition</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <span className="text-2xl font-mono font-bold text-emerald-800 block">2x Host</span>
                  <span className="text-xs font-heading font-semibold text-slate-900 block">NUGA Games Host</span>
                  <p className="text-[11px] text-slate-500 leading-tight">Host of the Nigerian University Games</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <span className="text-2xl font-mono font-bold text-emerald-800 block">15</span>
                  <span className="text-xs font-heading font-semibold text-slate-900 block">Sanctioned Sports</span>
                  <p className="text-[11px] text-slate-500 leading-tight">Official sports regulated by GISU</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <span className="text-2xl font-mono font-bold text-emerald-800 block">35,000+</span>
                  <span className="text-xs font-heading font-semibold text-slate-900 block">Student Body</span>
                  <p className="text-[11px] text-slate-500 leading-tight">Represented across all 15 faculties</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE GREAT IFE COLLEGIATE LEAGUE ARCHITECTURE
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5 text-left">
            <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              COLLEGIATE LEAGUE ARCHITECTURE
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The Great Ife Competitive Pyramid
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              An institutional tournament ecosystem structured to discover freshmen talent, ignite inter-faculty passion, and field elite OAU Giants varsity squads for continental honors.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('livescore')}
            className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Tournament Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Pillars of the Collegiate Pyramid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Level 1: Inter-Faculty Dean's Cup */}
          <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-600 hover:bg-white hover:shadow-md transition-all space-y-3.5 text-left flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  TIER 1 • INTER-FACULTY
                </span>
                <Trophy className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                The Dean's Cup Championship
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                The pinnacle of campus competition. Contested across all 15 faculties in 15 sports, drawing over 10,000 spectators to the Main Bowl for legendary derbies.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs font-mono text-slate-700 font-semibold">
              15 Faculties • 15 Disciplines
            </div>
          </div>

          {/* Level 2: Inter-Hall Championship */}
          <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-600 hover:bg-white hover:shadow-md transition-all space-y-3.5 text-left flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  TIER 2 • RESIDENTIAL
                </span>
                <Flame className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                Inter-Hall Sports Clash
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Contested under floodlights at the SUB Hardcourts. Historic rivalries between Awolowo, Angola, Fajuyi, ETF, Moremi, and Mozambique.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs font-mono text-slate-700 font-semibold">
              8 Halls of Residence • Evening Leagues
            </div>
          </div>

          {/* Level 3: OAU Giants Varsity Program */}
          <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-600 hover:bg-white hover:shadow-md transition-all space-y-3.5 text-left flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  TIER 3 • VARSITY ELITE
                </span>
                <Medal className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                OAU Giants Varsity Squad
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                The elite representation program of Obafemi Awolowo University. Scouts select top performers to compete at NUGA, WAUG, and FASU championships.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs font-mono text-slate-700 font-semibold">
              NUGA & WAUG Qualifiers
            </div>
          </div>

          {/* Level 4: Freshers' Discovery */}
          <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-600 hover:bg-white hover:shadow-md transition-all space-y-3.5 text-left flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  TIER 4 • GRASSROOTS
                </span>
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                Freshers' Fiesta & Unity Derby
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Grassroots talent identification for 100-level matriculants, alongside the Staff-Student Unity Derby fostering campus camaraderie across departments.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs font-mono text-slate-700 font-semibold">
              100L Talent Discovery & Staff Unity
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE 15 ACCREDITED FACULTIES OF OBAFEMI AWOLOWO UNIVERSITY
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5 text-left">
            <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              FACULTY ATHLETIC CONSTITUENTS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The 15 Accredited Faculties of Great Ife
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Every student athlete competes under their accredited faculty. Explore squad monikers, colors, and athletic specializations across all 15 colleges.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('community')}
            className="text-xs sm:text-sm font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Athlete Directory by Faculty</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Division Filter Bar & Search Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Division Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-mono">
            {[
              { id: 'all', label: 'All 15 Faculties' },
              { id: 'tech', label: 'Tech & Engineering' },
              { id: 'health', label: 'Health & Sciences' },
              { id: 'social', label: 'Admin & Social' },
              { id: 'humanities', label: 'Law & Arts' },
              { id: 'education', label: 'Education & Agric' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFacultyFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                  facultyFilter === tab.id
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Filter Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              placeholder="Search faculty or sport..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>
        </div>

        {/* 15 Faculty Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculties.map((fac, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab('community')}
              className="p-5 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer space-y-3 text-left flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${fac.colorBadge}`}>
                    {fac.shortName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {fac.colors}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {fac.name}
                  </h3>
                  <span className="text-xs font-mono text-emerald-700 font-semibold block mt-0.5">
                    "{fac.nickname}"
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {fac.heritage}
                </p>

                <div className="pt-2.5 border-t border-slate-100 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Stronghold:</span>
                    <strong className="text-slate-800 font-semibold truncate ml-2">{fac.sportsStronghold}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Roster:</span>
                    <strong className="text-emerald-700 font-semibold">{fac.squadCount}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                <span>View Faculty Roster</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: GISU SPORTS COUNCIL & DEMOCRATIC GOVERNANCE FRAMEWORK
      ========================================================================= */}
      <section className="relative bg-[#FAFAFA] border-y border-slate-200/80 py-16 sm:py-20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Institutional Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>STUDENT-LED DEMOCRATIC GOVERNANCE • GISU CONSTITUTIONAL CHARTER</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Great Ife Students' Union Sports Council
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Operating under the democratic constitution of the Great Ife Students' Union, the Directorate of Sports exercises a participatory governance model that safeguards student-athlete welfare, allocates university facilities, and guarantees transparent adjudication across all 15 faculties.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('feedback')}
              className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Lodge Tribunal Petition</span>
              <Gavel className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Two-Column Editorial Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: The 4 Democratic Governance Pillars (Numbered Editorial List) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="border-l-2 border-emerald-700 pl-4 py-1 text-slate-700 italic text-sm sm:text-base leading-relaxed">
                "The Sports Council operates as an autonomous, student-led institution ensuring that campus athletics is managed with transparency, accountability, and the authentic voice of all 15 faculties."
              </div>

              <div className="space-y-5 pt-2">
                
                {/* Pillar 01 */}
                <div className="flex items-start gap-4 pb-5 border-b border-slate-200">
                  <span className="font-mono text-base font-bold text-emerald-800 shrink-0 mt-0.5">
                    01
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      Directorate Executive Mandate
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Headed by the elected Director of Sports to coordinate equipment disbursements, tournament fixtures, training pitch allocations, and official varsity representation at NUGA and WAUG qualifiers.
                    </p>
                    <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-mono text-emerald-700 font-semibold">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Executive Directorate • Sports Secretariat Desk</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 02 */}
                <div className="flex items-start gap-4 pb-5 border-b border-slate-200">
                  <span className="font-mono text-base font-bold text-emerald-800 shrink-0 mt-0.5">
                    02
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      Sports Tribunal & Disciplinary Appeals
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      An autonomous student-led judicial panel adjudicating matchday fouls, red card appeals, officiating grievances, and athlete eligibility protests with published, binding written verdicts.
                    </p>
                    <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-mono text-emerald-700 font-semibold">
                      <Gavel className="w-3.5 h-3.5" />
                      <span>Independent Judicial Bench • Binding Written Rulings</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 03 */}
                <div className="flex items-start gap-4 pb-5 border-b border-slate-200">
                  <span className="font-mono text-base font-bold text-emerald-800 shrink-0 mt-0.5">
                    03
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      Faculty Sports Directors' Forum (15-Council Senate)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      A bi-weekly consultative senate uniting elected sports directors from all 15 faculties to deliberate and vote on competition schedules, tournament rules, and prize allocations.
                    </p>
                    <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-mono text-emerald-700 font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      <span>Democratic Senate • Equal Franchise Across 15 Faculties</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 04 */}
                <div className="flex items-start gap-4">
                  <span className="font-mono text-base font-bold text-emerald-800 shrink-0 mt-0.5">
                    04
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      Athlete Welfare & Emergency Medical Grants
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Managing nutritional allowances during competitions, student athlete emergency injury aid, and subsidized tournament kit distribution for underprivileged varsity players.
                    </p>
                    <div className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-mono text-emerald-700 font-semibold">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Welfare Trust • Medical Emergency Support</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Governance Plaque & Tribunal Desk */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Official Tribunal Petition Protocol Card */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5 text-left">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    DISPUTE RESOLUTION PROTOCOL
                  </span>
                  <h4 className="font-heading font-bold text-lg text-slate-900">
                    Official Tribunal Grievance Tracking
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Any faculty director or registered player can submit an officiating protest or athlete eligibility challenge. Every petition is recorded and adjudicated transparently.
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs font-mono">
                  <div className="flex items-start gap-2 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <span>Lodge formal petition within 48 hours of match completion.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <span>Directorate reviews referee reports & match video evidence.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <span>Binding written resolution published to all 15 faculty directors.</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('feedback')}
                  className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Formal Grievance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Governance Standards Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1 text-left">
                  <span className="text-2xl font-mono font-bold text-emerald-800 block">15</span>
                  <span className="text-xs font-heading font-semibold text-slate-900 block">Voting Directors</span>
                  <p className="text-[11px] text-slate-500 leading-tight">Equal democratic representation</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1 text-left">
                  <span className="text-2xl font-mono font-bold text-emerald-800 block">48 hrs</span>
                  <span className="text-xs font-heading font-semibold text-slate-900 block">Appeal Turnaround</span>
                  <p className="text-[11px] text-slate-500 leading-tight">Rapid tribunal resolution window</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1 text-left">
                  <span className="text-2xl font-mono font-bold text-emerald-800 block">100%</span>
                  <span className="text-xs font-heading font-semibold text-slate-900 block">Student Oversight</span>
                  <p className="text-[11px] text-slate-500 leading-tight">Under GISU parliamentary rule</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1 text-left">
                  <span className="text-2xl font-mono font-bold text-emerald-800 block">Zero</span>
                  <span className="text-xs font-heading font-semibold text-slate-900 block">Mercenary Athletes</span>
                  <p className="text-[11px] text-slate-500 leading-tight">CODE128 barcode verified roster</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: OFFICIAL ACCREDITATION PROTOCOL (4-STEP STUDENT REGISTRY)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5 text-left">
            <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              OFFICIAL ACCREDITATION PROTOCOL
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Four Steps to Verified Tournament Eligibility
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Standardized by the Great Ife Students' Union Sports Council to guarantee merit, transparency, and zero mercenary athletes across all 15 faculties.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('sport-id')}
            className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Begin Registration</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Clean Institutional Sequential Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {accreditationSteps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all space-y-3 text-left flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      STEP {st.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-mono text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mandatory Clearance</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CORE DIRECTORATE SPORTS PORTALS (EMBLEM CARDS)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            DIRECTORATE DIGITAL INFRASTRUCTURE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Institutional Athletics Portals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Centralized digital systems built for student-athletes, faculty sports directors, and collegiate tournament administrators across Obafemi Awolowo University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {[
            {
              id: 'sport-id',
              badge: 'ACCREDITATION',
              title: 'Student-Athlete ID Portal',
              desc: 'Official registration engine validating student matriculation, assigning faculty squad numbers, and generating CODE128 matchday barcodes.',
              icon: ShieldCheck,
              iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              cta: 'Launch ID Portal',
              bullets: ['Instant Digital ID Card', 'Anti-Mercenary Barcode', 'Print-Ready Pass'],
            },
            {
              id: 'livescore',
              badge: 'TELEMETRY',
              title: 'Tournament LiveScores',
              desc: 'Official match telemetry, whistle alerts, starting lineups, and dynamic league standings across all 15 sanctioned sports disciplines.',
              icon: Activity,
              iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
              cta: 'Matchday Hub',
              bullets: ['Pitchside Score Updates', 'Verified Starting Lineups', 'Dean\'s Cup Standings'],
            },
            {
              id: 'community',
              badge: 'DIRECTORY',
              title: 'Verified Athlete Directory',
              desc: 'Publicly accessible directory of verified collegiate athletes representing all 15 OAU faculties, searchable by matric number and sport.',
              icon: Users,
              iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
              cta: 'Browse Athlete Roster',
              bullets: ['15 Faculties Indexed', '15 Disciplines Covered', 'Public Verification'],
            },
            {
              id: 'feedback',
              badge: 'GOVERNANCE',
              title: 'Tribunal & Support Desk',
              desc: 'Direct communication channel to the Director of Sports for match protests, facility reservations, equipment, and medical support.',
              icon: Scale,
              iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
              cta: 'Lodge Official Petition',
              bullets: ['Dispute Adjudication', 'Facility Reservations', 'Medical Welfare Aid'],
            },
          ].map((portal, idx) => {
            const Icon = portal.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(portal.id)}
                className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-600 hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group text-left"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                      {portal.badge}
                    </span>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${portal.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {portal.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {portal.desc}
                  </p>

                  <div className="pt-2 space-y-1.5 border-t border-slate-200/60">
                    {portal.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-1.5 text-xs font-mono text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {portal.cta}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#071E10] text-[#B5F438] flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: CAMPUS SPORTS FACILITIES & ARCHITECTURAL OVERVIEW
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5 text-left">
            <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              CAMPUS GROUNDS & ARENAS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Collegiate Facilities & Stadiums
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Architectural perspectives of the premier athletic grounds, Olympic swimming pavilion, and tournament stadiums at Obafemi Awolowo University.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('about')}
            className="text-xs sm:text-sm font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Grounds Specifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4K ARCHITECTURAL AERIAL VIEWER */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-[#071E10] group text-left">
          
          {/* Viewport Canvas */}
          <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] overflow-hidden bg-black">
            
            {/* Aerial Photograph */}
            <img
              key={aerialView}
              src={aerialView === 'arena' ? '/oau_sports_complex_aerial.jpg' : '/oau_campus_boulevard_aerial.jpg'}
              alt={aerialView === 'arena' ? 'Aerial Panorama of OAU Sports Complex' : 'Aerial View of OAU Central Boulevard and Sports Complex'}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-101 transition-transform duration-700 ease-out"
            />

            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

            {/* Top Architectural Lens Control Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#071E10]/90 backdrop-blur-md border border-white/20 text-[#B5F438] text-xs font-mono font-semibold shadow-md">
                <Building2 className="w-3.5 h-3.5" />
                <span>ARCHITECTURAL OVERVIEW • 4K HIGH RESOLUTION</span>
              </div>

              {/* View Selector Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAerialView('arena');
                    setActiveHotspot(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    aerialView === 'arena'
                      ? 'bg-[#B5F438] text-[#071E10] shadow-xs font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Main Arena</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAerialView('boulevard');
                    setActiveHotspot(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    aerialView === 'boulevard'
                      ? 'bg-[#B5F438] text-[#071E10] shadow-xs font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Road 1 Boulevard</span>
                </button>
              </div>
            </div>

            {/* Hotspot Radar Pins Plotted on Aerial View */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {(aerialView === 'arena' ? arenaHotspots : boulevardHotspots).map((spot, sIdx) => {
                const isSelected = activeHotspot === spot.id;
                return (
                  <div
                    key={spot.id}
                    style={{ top: spot.top, left: spot.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group/pin"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(isSelected ? null : spot.id)}
                      className="relative flex items-center justify-center cursor-pointer p-1.5"
                    >
                      <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#071E10] border-2 border-[#B5F438] text-[#B5F438] text-xs font-mono font-bold shadow-xl group-hover/pin:scale-110 transition-transform">
                        {sIdx + 1}
                      </span>
                    </button>

                    {/* Popover Venue Info Card */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 sm:w-72 p-3.5 rounded-xl bg-[#071E10]/95 backdrop-blur-xl border border-[#B5F438]/50 shadow-xl transition-all duration-300 pointer-events-none z-30 ${
                        isSelected
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-2 group-hover/pin:opacity-100 group-hover/pin:translate-y-0'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold text-[#071E10] bg-[#B5F438] px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1">
                        {spot.category}
                      </span>
                      <h5 className="font-heading font-bold text-sm text-white leading-tight">
                        {spot.label}
                      </h5>
                      <p className="text-xs text-slate-300 font-sans mt-1 leading-snug">
                        {spot.specs}
                      </p>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#071E10] rotate-45 border-r border-b border-[#B5F438]/50" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs font-mono text-white/90 pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                {aerialView === 'arena'
                  ? 'PERSPECTIVE: Main Bowl 10,000-Cap Stadium & Olympic Aquatics Pool'
                  : 'PERSPECTIVE: Central Campus Boulevard & OAU Sports Corridor Entrance'}
              </span>
              <span className="hidden sm:inline-block bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[#B5F438]">
                Click numbered markers to view venue specs
              </span>
            </div>
          </div>

          {/* Institutional Specs Strip Below Aerial */}
          <div className="p-6 sm:p-8 bg-[#071E10] border-t border-white/10 text-white space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-3xl text-left">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {aerialView === 'arena'
                    ? 'The Collegiate Colosseum of Great Ife Champions'
                    : 'The Grand Boulevard & Historic Entrance Nexus'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {aerialView === 'arena'
                    ? 'Capturing the 10,000-capacity Main Bowl stadium, precision 8-lane tartan oval, Olympic swimming pavilion, and multi-sport hardcourts nestled against the rolling mountains of Obafemi Awolowo University.'
                    : 'Panoramic flight overlooking the primary university boulevard (Road 1)—connecting the campus entrance nexus with the athletic complex, Oduduwa Hall, Senate Building, and academic core.'}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('about')}
                className="px-6 py-3 rounded-full bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Full Grounds Directory</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>

        {/* 4 Detailed Collegiate Facility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {campusFacilities.map((fac, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all space-y-3 text-left flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {fac.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {fac.status}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {fac.name}
                </h3>
                <p className="text-xs font-mono text-slate-800 font-semibold">
                  {fac.specs}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {fac.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  OAU Campus
                </span>
                <button
                  onClick={() => setActiveTab('about')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Venue Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: DIRECTORATE OF SPORTS EXECUTIVE LEADERSHIP & COMMUNIQUÉ
      ========================================================================= */}
      <section className="relative w-full bg-[#071E10] border-y border-emerald-900/60 py-16 sm:py-24 text-white text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Directorate Eyebrow */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#B5F438] uppercase tracking-wider bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
              <Shield className="w-3.5 h-3.5 text-[#B5F438]" />
              <span>OFFICIAL EXECUTIVE COMMUNIQUÉ • GREAT IFE STUDENTS' UNION</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="font-semibold text-white">DIRECTORATE OF SPORTS</span>
              <span>•</span>
              <span>OBAFEMI AWOLOWO UNIVERSITY</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Official Executive Portrait & Museum-Grade Matte */}
            <div className="lg:col-span-5 space-y-4 pt-3 sm:pt-5 lg:pt-10">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-b from-[#0B2A18] to-[#071E10] shadow-2xl group">
                
                {/* Real High-Resolution Portrait with Studio Contrast & Crisp Framing */}
                <div className="h-[440px] sm:h-[490px] overflow-hidden relative bg-black/40">
                  <img
                    src="/director_miracle_okikijesu.jpg?v=2026_4k"
                    alt="Comrade Oladosu Miracle Okikijesu (Big Pope) - Executive Director of Sports"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = '/director_miracle_4k.jpg';
                      }
                    }}
                    className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-700"
                  />
                  {/* Top Status Pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071E10]/90 backdrop-blur-md text-[#B5F438] font-mono font-bold text-[10px] uppercase tracking-wider border border-[#B5F438]/40 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B5F438] animate-pulse" />
                      <span>EXECUTIVE LEADER • 2025/2026</span>
                    </span>
                  </div>
                </div>

                {/* Engraved Directorate Accreditation Plaque */}
                <div className="p-5 bg-[#0B2A18] border-t border-white/10 space-y-3.5 text-left">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono font-bold text-[#B5F438] uppercase tracking-wider block">
                      DIRECTOR OF SPORTS
                    </span>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                      Comrade Oladosu Miracle Okikijesu
                    </h3>
                    <p className="text-xs font-mono text-slate-300 font-semibold">
                      "Big Pope" • Great Ife Students' Union
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-2 shrink-0">
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#B5F438] bg-[#4A0E17] shadow-sm z-10 p-0.5">
                          <img src="/gisu_logo.jpg" alt="GISU Seal" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm z-0 p-0.5">
                          <img src="/oau_logo.jpg" alt="OAU Seal" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-white block leading-tight">
                          Sports Complex Secretariat
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Road 1, OAU Campus, Ile-Ife
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-[#071E10] bg-[#B5F438] px-2.5 py-1 rounded uppercase tracking-wider shrink-0 shadow-xs">
                      VERIFIED MANDATE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: The Communiqué Address & Key Mandate Pillars */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#B5F438] uppercase tracking-wider">
                  DIRECTORIAL PROCLAMATION • POLICY FOCUS
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  "Compete With Honor, Support With Passion, and Keep Great Ife First."
                </h2>
              </div>

              <div className="border-l-2 border-[#B5F438] pl-5 py-1 text-slate-200 italic text-sm sm:text-base leading-relaxed">
                "Collegiate athletics at Obafemi Awolowo University is a sacred trust. Under our mandate, we have eliminated the era of bureaucratic delays and mercenary players by instituting digital athlete accreditation and real-time tournament tracking. Every student stepping onto the pitch carries the unbroken pride and integrity of Great Ife."
              </div>

              {/* Numbered Executive Mandate Commitments */}
              <div className="space-y-4 pt-2">
                
                <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
                  <span className="font-mono text-sm font-bold text-[#B5F438] shrink-0 mt-0.5">
                    01
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                      Zero-Tolerance Anti-Mercenary Accreditation
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Every competitor across all 15 faculties must hold verified matriculation credentials and a CODE128 barcode sports pass. Unregistered or external mercenaries face immediate tournament disqualification.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
                  <span className="font-mono text-sm font-bold text-[#B5F438] shrink-0 mt-0.5">
                    02
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                      Equitable Tournament Access Across All 15 Faculties
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Guaranteeing scheduled access to the Main Bowl stadium, Olympic swimming pool, and floodlit hardcourts for all accredited collegiate squads with non-negotiable transparency in officiating.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="font-mono text-sm font-bold text-[#B5F438] shrink-0 mt-0.5">
                    03
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                      Student Athlete Welfare & Direct Health Centre Backing
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Pitchside paramedics, dedicated health centre ambulance coverage at the Main Bowl, and student athlete rehabilitation support for varsity competitors injured in the line of collegiate duty.
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom Directorate Action & Contact Strip */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs font-mono text-slate-300">
                  Official Office Email: <strong className="text-white">gisusports@gmail.com</strong>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('about')}
                    className="px-5 py-2.5 rounded-full bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Governance Charter Details</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 10: VARSITY CHAMPIONS & HALL OF FAME SPOTLIGHT
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5 text-left">
            <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              HALL OF FAME
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Elite Varsity Athlete Spotlight
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Celebrating Great Ife student-athletes excelling at collegiate, NUGA, and national competitive tiers.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs sm:text-sm font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>Verified Athlete Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hallOfFameAthletes.map((ath, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all space-y-3 text-center group"
            >
              <div className="relative w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-emerald-700 shadow-xs">
                <img src={ath.avatar} alt={ath.name} loading="lazy" decoding="async" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform" />
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                  <Award className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                  {ath.name}
                </h3>
                <span className="text-xs font-mono text-emerald-700 block font-semibold">
                  {ath.sport}
                </span>
                <span className="text-xs text-slate-500 block">
                  {ath.faculty} • {ath.department}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-200">
                  {ath.honor}
                </span>
                <p className="text-[11px] font-mono text-slate-500">
                  {ath.record}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: SPORTS MEDICINE COUNCIL & HEALTH CENTRE PARTNERSHIP
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-6 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-200 pb-5">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ATHLETE HEALTH & WELFARE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                Sports Medicine & Welfare Council
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Partnered with the Obafemi Awolowo University Health Centre to safeguard the cardiovascular and physical health of all student athletes.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0">
              <Stethoscope className="w-8 h-8 text-emerald-700" />
              <div>
                <span className="text-[11px] font-mono text-slate-500 block uppercase font-bold">Clinical Partner</span>
                <strong className="text-sm font-heading font-bold text-slate-900">OAU Health Centre</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Cardiovascular Clearance',
                desc: 'Mandatory pre-tournament resting fitness validation prior to matchday accreditation.',
                icon: HeartPulse,
              },
              {
                title: 'Pitchside Emergency Aid',
                desc: 'Rapid paramedic deployment and dedicated ambulance coverage at the Main Bowl stadium.',
                icon: Activity,
              },
              {
                title: 'Physiotherapy & Rehab',
                desc: 'Rehabilitation support for verified athletes recovering from collegiate sports injuries.',
                icon: ShieldCheck,
              },
              {
                title: 'Academic & Sport Balance',
                desc: 'Workshops assisting student-athletes in balancing training schedules with academic GPAs.',
                icon: BookOpen,
              },
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200/80 space-y-2.5 text-left shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900">{srv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{srv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: INSTITUTIONAL ATHLETIC SCALE
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1 text-left">
            <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              CAMPUS FOOTPRINT
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Institutional Athletics Scale
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed text-left">
            A comprehensive collegiate sports governance ecosystem serving student-athletes across Great Ife.
          </p>
        </div>

        <div className="bg-[#071E10] rounded-2xl p-6 sm:p-10 divide-y md:divide-y-0 md:divide-x divide-white/10 grid grid-cols-1 md:grid-cols-4 gap-6 shadow-xl border border-emerald-900/60 text-white">
          
          <div className="space-y-2 md:pr-4 text-left">
            <span className="text-xs font-mono font-semibold text-slate-300 block">ACCREDITED FACULTIES</span>
            <div className="font-heading font-bold text-3xl sm:text-4xl text-[#B5F438] tracking-tight font-mono">
              15
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              100% collegiate representation across every academic faculty at Obafemi Awolowo University.
            </p>
          </div>

          <div className="space-y-2 md:px-4 pt-4 md:pt-0 text-left">
            <span className="text-xs font-mono font-semibold text-slate-300 block">SANCTIONED DISCIPLINES</span>
            <div className="font-heading font-bold text-3xl sm:text-4xl text-[#B5F438] tracking-tight font-mono">
              15
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Official collegiate sports program spanning track, field, aquatics, combat, racket, and mind games.
            </p>
          </div>

          <div className="space-y-2 md:px-4 pt-4 md:pt-0 text-left">
            <span className="text-xs font-mono font-semibold text-slate-300 block">STADIUM BOWL CAPACITY</span>
            <div className="font-heading font-bold text-3xl sm:text-4xl text-[#B5F438] tracking-tight font-mono">
              10,000+
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Main Bowl capacity hosting the Inter-Faculty Dean's Cup championship and varsity tournaments.
            </p>
          </div>

          <div className="space-y-2 md:pl-4 pt-4 md:pt-0 text-left">
            <span className="text-xs font-mono font-semibold text-slate-300 block">MERITOCRACY STANDARD</span>
            <div className="font-heading font-bold text-3xl sm:text-4xl text-[#B5F438] tracking-tight font-mono">
              100%
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Barcode-verified student eligibility eliminating mercenaries across all collegiate fixtures.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 13: KNOWLEDGE BASE & FREQUENTLY ASKED QUESTIONS
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            KNOWLEDGE BASE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear institutional answers regarding athlete accreditation, fixtures, eligibility, and facility bookings across all 15 faculties.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs text-left"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-slate-900">
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-[#071E10] text-[#B5F438] rotate-180' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 14: COLLEGIATE AFFILIATIONS & ATHLETIC GOVERNING BODIES
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
            COLLEGIATE AFFILIATIONS & GOVERNING BODIES
          </span>
          <h3 className="font-heading font-bold text-xl text-slate-900">
            Recognized & Supported By Athletic Governing Authorities
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
          {[
            { name: 'OAU Alumni Sports Foundation', role: 'Endowment Partner', badge: 'Alumni' },
            { name: 'NUGA Games Association', role: 'National University Games', badge: 'Collegiate' },
            { name: 'WAUG Games Federation', role: 'West African Collegiate', badge: 'Regional' },
            { name: 'Ministry of Youth & Sports', role: 'Federal Republic of Nigeria', badge: 'Federal' },
            { name: 'GISU Endowment Trust', role: 'Student Welfare Fund', badge: 'Campus' },
          ].map((part, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5 shadow-xs"
            >
              <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded inline-block">
                {part.badge}
              </span>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                {part.name}
              </h4>
              <span className="text-[11px] font-mono text-slate-500 block">
                {part.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 15: EXECUTIVE ENROLLMENT BANNER & SECRETARIAT DESK
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071E10] rounded-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl border border-emerald-900/60 text-white space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B5F438]" />
                <span className="text-xs font-mono font-semibold text-[#B5F438] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  OFFICIAL ATHLETIC ENROLLMENT • 2025/2026
                </span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Represent Your Faculty. Compete for Great Ife.
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-normal">
                Accreditation is open to all matriculated undergraduate and postgraduate students across all 15 faculties. Secure your verified sports credentials, join your faculty squad, and represent Obafemi Awolowo University in collegiate competitions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('sport-id')}
                  className="px-6 py-3 rounded-full bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Apply for Sports ID Card</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => setActiveTab('livescore')}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-heading font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Tournament Center</span>
                </button>
              </div>
            </div>

            {/* University Seals & Authority Emblem Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0B2A18] border border-white/10 text-center space-y-3.5 shadow-md">
              <div className="flex items-center justify-center -space-x-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#B5F438] bg-[#4A0E17] shadow-md z-10 p-0.5">
                  <img src="/gisu_logo.jpg" alt="GISU Seal" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-white shadow-md z-0 p-1">
                  <img src="/oau_logo.jpg" alt="OAU Seal" loading="lazy" decoding="async" className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                  Great Ife Students' Union
                </h4>
                <p className="text-xs font-mono text-[#B5F438] font-bold">
                  Directorate of Sports Secretariat
                </p>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                  Obafemi Awolowo University, Ile-Ife
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/10 w-full text-xs font-mono text-slate-300">
                Official Email: <strong className="text-white">gisusports@gmail.com</strong>
              </div>
            </div>
          </div>

          {/* Secretariat Contact Strip */}
          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-[#B5F438]" />
              <span>Sports Complex Secretariat, Obafemi Awolowo University, Ile-Ife</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>Secretariat Hours: Mon – Fri (08:00 – 17:00 WAT)</span>
            </div>
          </div>

        </div>
      </section>

      </div>
    </div>
  );
};
