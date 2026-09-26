export type UserRole = 'athlete' | 'director' | 'faculty_sport_officer' | 'media_officer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  facultyAssigned?: string;
}

export interface IdCardRecord {
  id: string;
  cardNumber: string; // GICS/YYYY/NNNN
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  age: number;
  matricNumber: string;
  faculty: string;
  department: string;
  sport: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  photoUrl: string;
  issuedAt: string;
  status: 'Active' | 'Pending Approval' | 'Suspended' | 'Revoked';
  qrVerificationUrl?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  jerseyNumber?: string;
  session?: string;
  level?: string;
  nickname?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: 'Tournament' | 'Trials' | 'Office Update' | 'Facilities' | 'General';
  publishedAt: string;
  authorName: string;
  authorRole: string;
  imageUrl?: string;
  isPinned?: boolean;
}

export interface ComplaintRecord {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteMatric: string;
  faculty: string;
  category: 'Equipment' | 'Facility Reservation' | 'Allowance & Grants' | 'Officiating' | 'General Suggestion';
  subject: string;
  details: string;
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Dismissed';
  createdAt: string;
  updatedAt: string;
  officeResponse?: string;
  respondedBy?: string;
  respondedAt?: string;
}

export interface FacilityItem {
  id: string;
  name: string;
  location: string;
  status: 'Operational' | 'Under Maintenance' | 'Reserved';
  capacity: string;
  description: string;
  image: string;
}

export interface ExecutiveOfficer {
  name: string;
  title: string;
  role: string;
  email: string;
  phone: string;
  photo: string;
  bio: string;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'point' | 'sub';
  team: 'home' | 'away';
  player: string;
  detail?: string;
}

export interface LineupPlayer {
  number: number;
  name: string;
  position: string; // 'GK' | 'DEF' | 'MID' | 'FWD' | 'G' | 'F' | 'C'
  isCaptain?: boolean;
}

export interface MatchLineups {
  homeStartingXI: LineupPlayer[];
  homeSubs: LineupPlayer[];
  awayStartingXI: LineupPlayer[];
  awaySubs: LineupPlayer[];
}

export interface MatchRecord {
  id: string;
  competition: string;
  sport: string; // 'Football' | 'Basketball' | 'Volleyball' | 'Table Tennis' | 'Handball'
  stage: string; // 'Group Stage', 'Quarter-Final', 'Semi-Final', 'Final'
  date: string; // '2026-09-02' | '2026-09-03' | '2026-09-04'
  time: string; // '14:00', '16:00'
  status: 'LIVE' | 'FT' | 'SCHEDULED' | 'HT';
  minute?: number;
  venue: string;
  referee?: string;
  attendance?: string;
  homeTeam: {
    name: string;
    faculty: string;
    shortName: string;
    score: number;
    halfTimeScore?: number;
    crestColor: string;
  };
  awayTeam: {
    name: string;
    faculty: string;
    shortName: string;
    score: number;
    halfTimeScore?: number;
    crestColor: string;
  };
  events?: MatchEvent[];
  stats?: {
    possession?: [number, number]; // e.g. [55, 45]
    shotsOnTarget?: [number, number]; // e.g. [6, 4]
    shotsOffTarget?: [number, number];
    fouls?: [number, number];
    corners?: [number, number];
    yellowCards?: [number, number];
    redCards?: [number, number];
  };
  lineups?: MatchLineups;
}

export interface SiteMediaAsset {
  id: string;
  title: string;
  category: 'Matchday Action' | 'Campus Facilities' | 'Athlete Profiles' | 'Hero & Banners';
  imageUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  source: 'athlete_registration' | 'public_newsletter_optin';
  status: 'Active' | 'Unsubscribed';
  subscribedAt: string;
}

export interface AudienceMember {
  email: string;
  name?: string;
  source: 'Athlete Registration' | 'Newsletter Opt-in';
  matricNumber?: string;
  sport?: string;
  faculty?: string;
}

export interface NewsletterBroadcastPayload {
  subject: string;
  headline: string;
  category: 'Director Notice' | 'Tournament Bulletin' | 'Trial Accreditation' | 'Sports Welfare' | 'General Update';
  content: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface BroadcastHistoryRecord {
  id: string;
  subject: string;
  headline: string;
  category: string;
  dispatchedAt: string;
  totalRecipients: number;
  athleteRecipients: number;
  newsletterRecipients: number;
  trackingId: string;
  content: string;
}
