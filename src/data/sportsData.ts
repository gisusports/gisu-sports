import { IdCardRecord, NewsItem, ComplaintRecord, FacilityItem, ExecutiveOfficer } from '../types';

export const OAU_OFFICE_EMAIL = 'gisusports@gmail.com';

export const OAU_FACULTIES = [
  'Faculty of Technology',
  'Faculty of Science',
  'Faculty of Administration',
  'Faculty of Arts',
  'Faculty of Law',
  'Faculty of Social Sciences',
  'Faculty of Education',
  'Faculty of Environmental Design & Management',
  'Faculty of Agriculture',
  'Faculty of Clinical Sciences',
  'Faculty of Basic Medical Sciences',
  'Faculty of Pharmacy',
  'Faculty of Dentistry',
  'Faculty of Computing',
  'Faculty of Nursing Science',
];

export const FACULTY_DEPARTMENTS: Record<string, string[]> = {
  'Faculty of Technology': [
    'Computer Science & Engineering',
    'Electronic & Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Agricultural Engineering',
    'Food Science & Technology',
    'Materials Science & Engineering',
  ],
  'Faculty of Science': [
    'Biochemistry',
    'Microbiology',
    'Physics & Engineering Physics',
    'Chemistry',
    'Mathematics',
    'Geology',
    'Zoology',
    'Botany',
  ],
  'Faculty of Administration': [
    'Public Administration',
    'Management & Accounting',
    'International Relations',
    'Local Government Studies',
  ],
  'Faculty of Arts': [
    'Dramatic Arts',
    'English Language',
    'History',
    'Philosophy',
    'Religious Studies',
    'Foreign Languages',
    'Linguistics & African Languages',
  ],
  'Faculty of Law': [
    'Jurisprudence & Private Law',
    'Public Law',
    'International Law',
    'Business Law',
  ],
  'Faculty of Social Sciences': [
    'Economics',
    'Political Science',
    'Sociology & Anthropology',
    'Psychology',
    'Geography',
  ],
  'Faculty of Education': [
    'Physical & Health Education',
    'Educational Foundations',
    'Educational Technology',
    'Special Education',
  ],
  'Faculty of Environmental Design & Management': [
    'Architecture',
    'Building',
    'Estate Management',
    'Urban & Regional Planning',
    'Quantity Surveying',
  ],
  'Faculty of Agriculture': [
    'Agricultural Economics',
    'Animal Sciences',
    'Crop Production & Protection',
    'Soil Science',
  ],
  'Faculty of Clinical Sciences': ['Medicine & Surgery'],
  'Faculty of Basic Medical Sciences': ['Anatomy', 'Physiology', 'Medical Rehabilitation'],
  'Faculty of Pharmacy': ['Pharmacy'],
  'Faculty of Dentistry': ['Dentistry'],
  'Faculty of Computing': ['Computer Science', 'Cybersecurity', 'Software Engineering', 'Information Systems'],
  'Faculty of Nursing Science': ['Nursing Science', 'Community Health Nursing', 'Maternal & Child Health Nursing'],
};

export const SPORTS_LIST = [
  'Football',
  'Volleyball',
  'Basketball',
  'Handball',
  'Badminton',
  'Squash',
  'Table Tennis',
  'Lawn Tennis',
  'Hockey',
  'Cricket',
  'Track and Field Athletics',
  'Taekwondo',
  'Swimming',
  'Chess and Scrabble',
  'Judo',
];

export const INITIAL_ID_CARDS: IdCardRecord[] = [
  {
    id: 'card-official-001',
    matricNumber: 'ADM/2022/042',
    fullName: 'AWOSIYAN PAUL',
    nickname: 'MARX',
    email: 'gisusports@gmail.com',
    phone: '+2348105742618',
    faculty: 'Administration',
    department: 'Accounting',
    sport: 'Football',
    bloodGroup: 'O+',
    level: '300L',
    photoUrl: '/athlete_top_right.jpg',
    cardNumber: 'GICS/2026/0042',
    issuedAt: '2026-02-15T10:00:00Z',
    dateOfBirth: '2003-05-14',
    age: 23,
    gender: 'Male',
    status: 'Active',
  },
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-001',
    title: "Great Ife Inter-Faculty Games 2026 Registration Now Open!",
    slug: 'inter-faculty-games-2026-registration',
    excerpt: 'The Office of the Director of Sports announces official registrations for the annual Inter-Faculty Sports Festival across 15 sports categories.',
    content: `The Office of the Director of Sports, Great Ife Students' Union, Obafemi Awolowo University is proud to announce that entry submissions for the **2026 Great Ife Inter-Faculty Games** are now officially open.

All Faculty Sports Directors and Athlete Captains are instructed to ensure all participating athletes complete their **Digital Sports ID Card Application** on this platform before the registration deadline of **March 15, 2026**.

### Key Event Highlights:
- **15 Competitive Categories**: Football, Basketball, Athletics, Swimming, Badminton, Chess, Taekwondo, and more.
- **Main Bowl Ceremonies**: The opening ceremony will feature the Vice-Chancellor, Sports Officials, and live performances.
- **Digital Accreditation**: Only verified athletes with valid Digital Sports ID Cards (scannable via barcode) will be eligible to compete.

For inquiries or faculty team registration details, visit the Sports Complex Office or email **gisusports@gmail.com**.`,
    category: 'Tournament',
    publishedAt: '2026-02-12T08:00:00Z',
    authorName: 'Media Secretariat',
    authorRole: 'Media Officer',
    imageUrl: '/player_action.jpg',
    isPinned: true,
  },
  {
    id: 'news-002',
    title: 'NUGA Trials: Athletics and Football Trials Scheduled for OAU Sports Complex',
    slug: 'nuga-trials-athletics-football',
    excerpt: 'Open trials for student athletes aspiring to represent Great Ife at the upcoming Nigerian Universities Games (NUGA).',
    content: `Attention all elite student athletes! The Sports Office will host mandatory open screening and trials for the **OAU Giants Varsity Teams** ahead of the regional NUGA qualifiers.

### Trial Schedule:
- **Athletics (Sprints & Field Events)**: Saturday, Feb 21 — 7:00 AM @ Main Bowl Track
- **Male & Female Football**: Monday, Feb 23 — 4:00 PM @ Main Bowl Pitch 1
- **Indoor Sports (Table Tennis & Chess)**: Tuesday, Feb 24 — 2:00 PM @ Indoor Sports Hall

All participating athletes must bring their student ID and register for their digital sports ID badge prior to screening.`,
    category: 'Trials',
    publishedAt: '2026-02-10T14:30:00Z',
    authorName: 'Comrade Director of Sports',
    authorRole: 'Director of Sports',
    imageUrl: '/player_kicking.jpg',
    isPinned: true,
  },
  {
    id: 'news-003',
    title: 'Upgraded Lighting Installed at OAU Outdoor Basketball & Volleyball Courts',
    slug: 'upgraded-lighting-basketball-courts',
    excerpt: 'Night training sessions are now fully operational following the installation of high-intensity solar floodlights.',
    content: `In line with our commitment to athletic excellence and facility safety, the Director of Sports is pleased to announce the successful installation of modern floodlight towers at the Sports Complex outdoor courts.

Students can now schedule evening practice sessions up to 9:00 PM under official supervision.`,
    category: 'Facilities',
    publishedAt: '2026-02-04T11:20:00Z',
    authorName: 'Director of Sports',
    authorRole: 'Director of Sports',
    imageUrl: '/sports_stadium_bg.jpg',
  },
];

export const INITIAL_COMPLAINTS: ComplaintRecord[] = [];

export const FACILITIES_LIST: FacilityItem[] = [
  {
    id: 'fac-1',
    name: 'OAU Sports Complex Main Bowl',
    location: 'Central Campus Road, opposite SUB',
    status: 'Operational',
    capacity: '10,000 Spectators',
    description: 'Standard 8-lane tartan track, full grass football pitch, spectator grandstands, and official commentary box.',
    image: '/oau_sports_complex_aerial.jpg',
  },
  {
    id: 'fac-2',
    name: 'Indoor Sports Hall',
    location: 'Sports Complex Wing B',
    status: 'Operational',
    capacity: '1,500 Spectators',
    description: 'Multi-purpose indoor arena equipped for Badminton, Table Tennis, Taekwondo, Judo, and Chess championships.',
    image: '/player_action.jpg',
  },
  {
    id: 'fac-3',
    name: 'Outdoor Basketball & Volleyball Courts',
    location: 'Behind Students Union Building (SUB)',
    status: 'Operational',
    capacity: '800 Spectators',
    description: 'Acrylic-surfaced courts with nocturnal solar floodlighting and electronic scoreboard.',
    image: '/player_kicking.jpg',
  },
  {
    id: 'fac-4',
    name: 'Olympic Swimming Pool Complex',
    location: 'Sports Complex Aquatic Pavilion',
    status: 'Under Maintenance',
    capacity: '600 Spectators',
    description: '50-meter 10-lane competition pool and diving facility currently undergoing filtration upgrade.',
    image: '/sports_stadium_bg.jpg',
  },
];

export const EXECUTIVE_OFFICERS: ExecutiveOfficer[] = [
  {
    name: 'Comrade Oladosu Miracle Okikijesu (Big Pope)',
    title: 'Director of Sports',
    role: 'Head of Sports Office, Great Ife Students\' Union',
    email: 'gisusports@gmail.com',
    phone: '+234 814 000 9921',
    photo: '/director_miracle_okikijesu.jpg?v=2026_4k',
    bio: 'Popularly known as Big Pope, Comrade Oladosu Miracle Okikijesu is leading the strategic revolution, tournament accreditation, facility revitalization, and student-athlete welfare for Great Ife Sports.',
  },
  {
    name: 'Abdul Yekeen Muiz Olayinka',
    title: 'Personal Assistant to the Director of Sports',
    role: 'Executive Secretariat & Athlete Liaison',
    email: 'pa.director@gisu.oauife.edu.ng',
    phone: '+234 812 345 6789',
    photo: '/pa_director_abdul_muiz.jpg?v=2026_real',
    bio: 'Managing executive scheduling, sports council correspondence, athlete accreditation inquiries, and special athletic initiatives for the Office of the Director of Sports.',
  },
  {
    name: 'Omolere Emmanuel Opemiposi',
    title: 'Chief of Staff to the Director of Sports',
    role: 'Directorate Operations & Strategic Administration',
    email: 'chiefofstaff.sports@gisu.oauife.edu.ng',
    phone: '+234 813 550 8820',
    photo: '/chief_of_staff.jpg?v=2026_real',
    bio: 'Directing executive operations, administrative synergy across sports council committees, faculty athletic liaisons, and strategic execution of the Directorate of Sports agenda.',
  },
  {
    name: 'Faozan Olamilekan Owolabi',
    title: 'Head of Administrative Affairs',
    role: 'Directorate Administration, Secretarial Governance & Logistics',
    email: 'admin.sports@gisu.oauife.edu.ng',
    phone: '+234 814 620 4492',
    photo: '/head_admin_affairs.jpg?v=2026_real',
    bio: 'Coordinating executive correspondence, secretarial documentation, inter-faculty logistics, council records, and administrative governance for Great Ife Sports.',
  },
  {
    name: 'Jesujoba Adeleke',
    title: 'Head of Media Affairs',
    role: 'Directorate Press, Broadcasting & Digital Media',
    email: 'media.sports@gisu.oauife.edu.ng',
    phone: '+234 810 882 1944',
    photo: '/head_media_jesujoba_adeleke.jpg?v=2026_real',
    bio: 'Directing sports council broadcast journalism, matchday photography, tournament publicity, social media broadcasting, and official press releases for Great Ife Sports.',
  },
];
