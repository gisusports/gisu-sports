import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, IdCardRecord, NewsItem, ComplaintRecord, MatchRecord, MatchEvent, SiteMediaAsset, NewsletterSubscriber, AudienceMember } from '../types';
import { INITIAL_ID_CARDS, INITIAL_NEWS, INITIAL_COMPLAINTS } from '../data/sportsData';
import { INITIAL_MATCHES } from '../data/matchesData';
import { 
  fetchCardsFromSupabase, 
  insertCardToSupabase, 
  insertCardWithUniqueNumber,
  checkSupabaseDuplicate,
  deleteCardFromSupabase, 
  updateCardStatusInSupabase, 
  authenticateExecutiveWithDb, 
  isSupabaseConfigured,
  fetchNewsletterSubscribersFromSupabase,
  insertNewsletterSubscriberToSupabase,
  deleteNewsletterSubscriberFromSupabase,
  getSupabaseCardsCount
} from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  setRole: (role: UserRole) => void;
  loginWithGoogle: () => void;
  loginWithCredentials: (email: string, passcode: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  idCards: IdCardRecord[];
  addIdCard: (card: Omit<IdCardRecord, 'id' | 'cardNumber' | 'issuedAt'>) => Promise<{ success: boolean; card?: IdCardRecord; error?: string; isDuplicate?: boolean }>;
  updateCardStatus: (cardId: string, status: IdCardRecord['status']) => void;
  deleteIdCard: (cardId: string) => void;
  refreshCardsFromCloud: () => Promise<void>;
  
  // Newsletter & Consolidated Audience State
  subscribers: NewsletterSubscriber[];
  subscribeToNewsletter: (email: string, name?: string) => Promise<{ success: boolean; message: string }>;
  deleteSubscriber: (email: string) => Promise<void>;
  getAllAudienceEmails: () => AudienceMember[];

  news: NewsItem[];
  addNewsItem: (news: Omit<NewsItem, 'id' | 'publishedAt' | 'slug'>) => void;
  deleteNewsItem: (id: string) => void;

  complaints: ComplaintRecord[];
  addComplaint: (complaint: Omit<ComplaintRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  respondToComplaint: (complaintId: string, response: string) => void;
  updateComplaintStatus: (complaintId: string, status: ComplaintRecord['status']) => void;

  getCardByNumber: (cardNo: string) => IdCardRecord | undefined;
  checkExistingCard: (matricNumber: string, email?: string) => IdCardRecord | undefined;

  // Media Console LiveScore Management
  matches: MatchRecord[];
  updateMatchScore: (matchId: string, homeScore: number, awayScore: number, minute?: number, status?: MatchRecord['status']) => void;
  updateMatchStatus: (matchId: string, status: MatchRecord['status'], minute?: number) => void;
  addMatchEvent: (matchId: string, event: Omit<MatchEvent, 'id'>) => void;
  deleteMatchEvent: (matchId: string, eventId: string) => void;
  addMatch: (match: Omit<MatchRecord, 'id'>) => MatchRecord;
  updateMatch: (match: MatchRecord) => void;
  deleteMatch: (matchId: string) => void;
  updateMatchStats: (matchId: string, stats: MatchRecord['stats']) => void;
  updateMatchLineups: (matchId: string, lineups: MatchRecord['lineups']) => void;

  // Media Console Site Image Management
  siteImages: SiteMediaAsset[];
  addImageAsset: (asset: Omit<SiteMediaAsset, 'id' | 'uploadedAt'>) => void;
  deleteImageAsset: (assetId: string) => void;
}

const INITIAL_SITE_IMAGES: SiteMediaAsset[] = [
  {
    id: 'img-00',
    title: 'OAU Sports Complex 4K Aerial Panorama',
    category: 'Campus Facilities',
    imageUrl: '/oau_sports_complex_aerial.jpg',
    uploadedAt: '2026-09-08T18:30:00Z',
    uploadedBy: 'Sports Media Unit',
    description: 'Breathtaking 4K drone aerial view of the OAU Sports Complex, athletics tartan track, soccer pitch, and Ile-Ife hills.',
  },
  {
    id: 'img-00b',
    title: 'OAU Central Boulevard & Sports Corridor 4K Aerial View',
    category: 'Campus Facilities',
    imageUrl: '/oau_campus_boulevard_aerial.jpg',
    uploadedAt: '2026-09-08T18:40:00Z',
    uploadedBy: 'Sports Media Unit',
    description: 'Wide-angle 4K aerial perspective along Road 1 boulevard with the Sports Complex on the left and academic core.',
  },
  {
    id: 'img-01',
    title: 'Main Bowl Arena Stadium Field',
    category: 'Hero & Banners',
    imageUrl: '/sports_stadium_bg.jpg',
    uploadedAt: '2026-09-01T10:00:00Z',
    uploadedBy: 'Media Secretariat',
    description: 'Cinematic wide-angle backdrop of the OAU Main Bowl pitch and tartan track.',
  },
  {
    id: 'img-02',
    title: 'Inter-Faculty Football Final Clash',
    category: 'Matchday Action',
    imageUrl: '/player_action.jpg',
    uploadedAt: '2026-09-02T14:30:00Z',
    uploadedBy: 'Sports Media Unit',
    description: 'Forward driving through defense during the Inter-Faculty quarterfinal.',
  },
  {
    id: 'img-03',
    title: 'University Olympic Swimming Pool',
    category: 'Campus Facilities',
    imageUrl: '/sports_stadium_bg.jpg',
    uploadedAt: '2026-09-02T16:00:00Z',
    uploadedBy: 'Media Secretariat',
    description: 'Olympic 50m aquatic training facility.',
  },
  {
    id: 'img-04',
    title: 'Basketball Championship Scrimmage',
    category: 'Matchday Action',
    imageUrl: '/player_kicking.jpg',
    uploadedAt: '2026-09-03T09:15:00Z',
    uploadedBy: 'Campus Photo Desk',
    description: 'Intense gameplay at the SUB Basketball Arena.',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gisu_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id === 'user-google-001' || parsed?.email === 'adeyemi.tobi@student.oauife.edu.ng') {
          localStorage.removeItem('gisu_user');
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('gisu_active_role') as UserRole;
    if (!currentUser) return 'athlete';
    return savedRole || currentUser?.role || 'athlete';
  });

  const [idCards, setIdCards] = useState<IdCardRecord[]>(() => {
    const saved = localStorage.getItem('gisu_id_cards');
    if (saved) {
      try {
        const parsed: IdCardRecord[] = JSON.parse(saved);
        const clean = parsed.filter(c => !c.id.startsWith('card-00') && c.matricNumber !== 'CSC/2021/042');
        return clean;
      } catch {
        return [];
      }
    }
    return INITIAL_ID_CARDS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem('gisu_news');
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [complaints, setComplaints] = useState<ComplaintRecord[]>(() => {
    const saved = localStorage.getItem('gisu_complaints');
    if (saved) {
      try {
        const parsed: ComplaintRecord[] = JSON.parse(saved);
        const clean = parsed.filter(c => !c.id.startsWith('comp-10'));
        return clean;
      } catch {
        return [];
      }
    }
    return INITIAL_COMPLAINTS;
  });

  // Global Live Matches state managed by Media Console
  const [matches, setMatches] = useState<MatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gisu_matches');
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  // Global Site Images state managed by Media Console
  const [siteImages, setSiteImages] = useState<SiteMediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem('gisu_site_images');
      return saved ? JSON.parse(saved) : INITIAL_SITE_IMAGES;
    } catch {
      return INITIAL_SITE_IMAGES;
    }
  });

  // Global Newsletter Subscribers state
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('gisu_newsletter_subscribers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gisu_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gisu_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gisu_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('gisu_id_cards', JSON.stringify(idCards));
  }, [idCards]);

  useEffect(() => {
    localStorage.setItem('gisu_newsletter_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  // Force manual refresh from Supabase bypassing cache
  const refreshCardsFromCloud = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const supabaseCards = await fetchCardsFromSupabase();
      if (supabaseCards && supabaseCards.length > 0) {
        setIdCards((prev) => {
          const seenMatrics = new Set(supabaseCards.map((c) => c.matricNumber.toUpperCase()));
          const localOnly = prev.filter((c) => !seenMatrics.has(c.matricNumber.toUpperCase()));
          return [...supabaseCards, ...localOnly];
        });
        localStorage.setItem('gisu_cards_last_fetched', Date.now().toString());
      }
    } catch (err) {
      console.warn('[Supabase Sync] Manual refresh warning:', err);
    }
  };

  // Load registered athlete cards from Supabase with smart caching to strictly manage 5GB monthly egress
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const CACHE_TTL_MS = 15 * 60 * 1000; // 15-minute client cache window
    const lastCardFetch = localStorage.getItem('gisu_cards_last_fetched');
    const isCardCacheFresh = lastCardFetch ? Date.now() - parseInt(lastCardFetch, 10) < CACHE_TTL_MS : false;

    // Use zero-body HTTP HEAD count check (<100 bytes egress)
    getSupabaseCardsCount().then((remoteCount) => {
      const localRealCards = idCards.filter((c) => !c.id.startsWith('card-00'));

      // If cache is fresh and local count matches remote database count, DO NOT download table!
      if (isCardCacheFresh && remoteCount !== null && remoteCount === localRealCards.length) {
        // Conserves 100% of table download egress
        return;
      }

      // If count differs or cache is stale, fetch fresh cards
      fetchCardsFromSupabase().then((supabaseCards) => {
        if (supabaseCards && supabaseCards.length > 0) {
          setIdCards((prev) => {
            const seenMatrics = new Set(supabaseCards.map((c) => c.matricNumber.toUpperCase()));
            const localOnly = prev.filter((c) => !seenMatrics.has(c.matricNumber.toUpperCase()));
            return [...supabaseCards, ...localOnly];
          });
          localStorage.setItem('gisu_cards_last_fetched', Date.now().toString());
        }
      });
    });

    // Smart caching for newsletter subscribers (15-min TTL)
    const lastSubFetch = localStorage.getItem('gisu_subscribers_last_fetched');
    const isSubCacheFresh = lastSubFetch ? Date.now() - parseInt(lastSubFetch, 10) < CACHE_TTL_MS : false;

    if (!isSubCacheFresh || subscribers.length === 0) {
      fetchNewsletterSubscribersFromSupabase().then((subData) => {
        if (subData && subData.length > 0) {
          setSubscribers((prev) => {
            const seen = new Set(subData.map((s) => s.email.toLowerCase()));
            const localOnly = prev.filter((s) => !seen.has(s.email.toLowerCase()));
            return [...subData, ...localOnly];
          });
          localStorage.setItem('gisu_subscribers_last_fetched', Date.now().toString());
        }
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gisu_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('gisu_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('gisu_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('gisu_site_images', JSON.stringify(siteImages));
  }, [siteImages]);

  const setRole = (role: UserRole) => {
    if (role === 'athlete') {
      setActiveRoleState('athlete');
      return;
    }
    // Only allow switching to executive roles if currentUser is authenticated and has clearance
    if (!currentUser) {
      console.warn('[Security] Unauthorized role switch without authenticated executive session');
      return;
    }
    if (currentUser.role === role || currentUser.email === 'marxmediahq@gmail.com') {
      setActiveRoleState(role);
    } else {
      console.warn(`[Security] Account ${currentUser.email} lacks authorization for role: ${role}`);
    }
  };

  const loginWithGoogle = () => {
    const user: UserProfile = {
      id: `user-google-${Date.now()}`,
      email: 'student@student.oauife.edu.ng',
      fullName: 'OAU Student Athlete',
      avatarUrl: '/gisu_logo.jpg',
      role: 'athlete',
    };
    setCurrentUser(user);
    setActiveRoleState('athlete');
  };

  const loginWithCredentials = async (
    email: string,
    passcode: string,
    role: UserRole = 'director'
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await authenticateExecutiveWithDb(email, passcode, role);
    if (!res.success || !res.user) {
      return { success: false, error: res.error || 'Access Denied: Invalid credentials.' };
    }

    setCurrentUser(res.user);
    setActiveRoleState(res.user.role);
    localStorage.setItem('gisu_user', JSON.stringify(res.user));
    localStorage.setItem('gisu_active_role', res.user.role);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRoleState('athlete');
    localStorage.removeItem('gisu_user');
    localStorage.removeItem('gisu_active_role');
  };

  const checkExistingCard = (matricNumber: string, email?: string): IdCardRecord | undefined => {
    const cleanMatric = matricNumber.trim().toUpperCase();
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    return idCards.find(
      (c) =>
        (cleanMatric && c.matricNumber.toUpperCase() === cleanMatric) ||
        (cleanEmail && c.email.toLowerCase() === cleanEmail)
    );
  };

  const addIdCard = async (
    cardData: Omit<IdCardRecord, 'id' | 'cardNumber' | 'issuedAt'>
  ): Promise<{ success: boolean; card?: IdCardRecord; error?: string; isDuplicate?: boolean }> => {
    // 1. Strict Duplicate Check locally
    const existingLocal = checkExistingCard(cardData.matricNumber, cardData.email);
    if (existingLocal) {
      return {
        success: false,
        card: existingLocal,
        isDuplicate: true,
        error: `An official athlete accreditation already exists for this student (${existingLocal.matricNumber} • Card: ${existingLocal.cardNumber}). Duplicate registrations are prohibited.`,
      };
    }

    // 2. Strict Duplicate Check in Cloud Database
    if (isSupabaseConfigured()) {
      const existingCloud = await checkSupabaseDuplicate(
        cardData.matricNumber,
        cardData.email,
        cardData.phone
      );
      if (existingCloud) {
        // Sync into local state for visibility
        setIdCards((prev) => {
          if (prev.some((c) => c.matricNumber.toUpperCase() === existingCloud.matricNumber.toUpperCase())) {
            return prev;
          }
          return [existingCloud, ...prev];
        });
        return {
          success: false,
          card: existingCloud,
          isDuplicate: true,
          error: `An official athlete accreditation already exists in the central registry for ${existingCloud.matricNumber} (Card: ${existingCloud.cardNumber}). Duplicate registrations are prohibited.`,
        };
      }
    }

    // 3. Atomically allocate guaranteed unique card number and persist to Supabase
    const result = await insertCardWithUniqueNumber(cardData, idCards);
    if (!result.success || !result.card) {
      return {
        success: false,
        error: result.error || 'Failed to securely register sports ID. Please check your connection and try again.',
      };
    }

    const finalCard = result.card;

    // 4. Update local state immediately so Athlete Roster, Console, and Verify reflect it
    setIdCards((prev) => {
      const filtered = prev.filter(
        (c) => c.matricNumber.toUpperCase() !== finalCard.matricNumber.toUpperCase()
      );
      return [finalCard, ...filtered];
    });
    localStorage.removeItem('gisu_cards_last_fetched');

    return { success: true, card: finalCard };
  };

  const updateCardStatus = (cardId: string, status: IdCardRecord['status']) => {
    localStorage.removeItem('gisu_cards_last_fetched');
    let targetCard: IdCardRecord | undefined;
    setIdCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId || c.cardNumber === cardId) {
          targetCard = { ...c, status };
          return targetCard;
        }
        return c;
      })
    );

    if (isSupabaseConfigured() && targetCard) {
      updateCardStatusInSupabase(targetCard.id, status, targetCard.cardNumber).catch((err) =>
        console.warn('[Supabase] Failed to update card status:', err)
      );
    }
  };

  const deleteIdCard = (cardId: string) => {
    localStorage.removeItem('gisu_cards_last_fetched');
    let deletedCard: IdCardRecord | undefined;
    setIdCards((prev) => {
      const target = prev.find((c) => c.id === cardId || c.cardNumber === cardId);
      if (target) {
        deletedCard = target;
      }
      const filtered = prev.filter((c) => c.id !== cardId && c.cardNumber !== cardId);
      localStorage.setItem('gisu_id_cards', JSON.stringify(filtered));
      return filtered;
    });

    if (isSupabaseConfigured() && deletedCard) {
      deleteCardFromSupabase(deletedCard.id, deletedCard.cardNumber).catch((err) =>
        console.warn('[Supabase] Failed to delete card:', err)
      );
    }
  };

  const getCardByNumber = (cardNo: string): IdCardRecord | undefined => {
    const cleanSearch = cardNo.trim().toUpperCase();
    return idCards.find(
      (c) =>
        c.cardNumber.toUpperCase() === cleanSearch ||
        c.matricNumber.toUpperCase() === cleanSearch
    );
  };

  const addNewsItem = (item: Omit<NewsItem, 'id' | 'publishedAt' | 'slug'>) => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      publishedAt: new Date().toISOString(),
    };
    setNews((prev) => [newItem, ...prev]);
  };

  const deleteNewsItem = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  const addComplaint = (data: Omit<ComplaintRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newComp: ComplaintRecord = {
      ...data,
      id: `CMP-${Date.now().toString().slice(-6)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComp, ...prev]);
  };

  const respondToComplaint = (complaintId: string, response: string) => {
    setComplaints((prev) =>
      prev.map((comp) => {
        if (comp.id === complaintId) {
          return {
            ...comp,
            officeResponse: response,
            status: 'Resolved',
            respondedBy: currentUser?.fullName || 'Sports Office Secretariat',
            respondedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return comp;
      })
    );
  };

  const updateComplaintStatus = (complaintId: string, status: ComplaintRecord['status']) => {
    setComplaints((prev) =>
      prev.map((comp) =>
        comp.id === complaintId
          ? { ...comp, status, updatedAt: new Date().toISOString() }
          : comp
      )
    );
  };

  // LiveScore mutation methods for Media Console
  const updateMatchScore = (matchId: string, homeScore: number, awayScore: number, minute?: number, status?: MatchRecord['status']) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            homeTeam: { ...m.homeTeam, score: Math.max(0, homeScore) },
            awayTeam: { ...m.awayTeam, score: Math.max(0, awayScore) },
            minute: minute !== undefined ? minute : m.minute,
            status: status || m.status,
          };
        }
        return m;
      })
    );
  };

  const updateMatchStatus = (matchId: string, status: MatchRecord['status'], minute?: number) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            status,
            minute: minute !== undefined ? minute : m.minute,
          };
        }
        return m;
      })
    );
  };

  const addMatchEvent = (matchId: string, event: Omit<MatchEvent, 'id'>) => {
    const newEv: MatchEvent = {
      ...event,
      id: `ev-${Date.now()}`,
    };

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const currentEvents = m.events || [];
          let updatedHomeScore = m.homeTeam.score;
          let updatedAwayScore = m.awayTeam.score;

          if (event.type === 'goal') {
            if (event.team === 'home') updatedHomeScore += 1;
            else updatedAwayScore += 1;
          }

          return {
            ...m,
            homeTeam: { ...m.homeTeam, score: updatedHomeScore },
            awayTeam: { ...m.awayTeam, score: updatedAwayScore },
            events: [...currentEvents, newEv],
          };
        }
        return m;
      })
    );
  };

  const deleteMatchEvent = (matchId: string, eventId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const evToDelete = m.events?.find((e) => e.id === eventId);
          let updatedHomeScore = m.homeTeam.score;
          let updatedAwayScore = m.awayTeam.score;

          if (evToDelete && evToDelete.type === 'goal') {
            if (evToDelete.team === 'home') updatedHomeScore = Math.max(0, updatedHomeScore - 1);
            else updatedAwayScore = Math.max(0, updatedAwayScore - 1);
          }

          return {
            ...m,
            homeTeam: { ...m.homeTeam, score: updatedHomeScore },
            awayTeam: { ...m.awayTeam, score: updatedAwayScore },
            events: m.events?.filter((e) => e.id !== eventId) || [],
          };
        }
        return m;
      })
    );
  };

  const addMatch = (matchData: Omit<MatchRecord, 'id'>): MatchRecord => {
    const newMatch: MatchRecord = {
      ...matchData,
      id: `match-${Date.now()}`,
    };
    setMatches((prev) => [newMatch, ...prev]);
    return newMatch;
  };

  const updateMatch = (updatedMatch: MatchRecord) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
    );
  };

  const deleteMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  const updateMatchStats = (matchId: string, stats: MatchRecord['stats']) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, stats } : m))
    );
  };

  const updateMatchLineups = (matchId: string, lineups: MatchRecord['lineups']) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, lineups } : m))
    );
  };

  // Site Image mutation methods for Media Console
  const addImageAsset = (asset: Omit<SiteMediaAsset, 'id' | 'uploadedAt'>) => {
    const newAsset: SiteMediaAsset = {
      ...asset,
      id: `asset-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setSiteImages((prev) => [newAsset, ...prev]);
  };

  const deleteImageAsset = (assetId: string) => {
    setSiteImages((prev) => prev.filter((a) => a.id !== assetId));
  };

  // Newsletter subscription and consolidated audience methods
  const subscribeToNewsletter = async (
    email: string,
    name?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const existing = subscribers.find((s) => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: true, message: 'You are already subscribed to Great Ife Sports announcements!' };
    }

    const newSubscriber: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      name: name?.trim() || undefined,
      source: 'public_newsletter_optin',
      status: 'Active',
      subscribedAt: new Date().toISOString(),
    };

    setSubscribers((prev) => [newSubscriber, ...prev]);

    if (isSupabaseConfigured()) {
      await insertNewsletterSubscriberToSupabase(newSubscriber).catch((err) =>
        console.warn('[Supabase] Failed to sync subscriber:', err)
      );
    }

    return { success: true, message: 'Successfully subscribed to Great Ife Sports announcements!' };
  };

  const deleteSubscriber = async (email: string) => {
    const clean = email.trim().toLowerCase();
    setSubscribers((prev) => prev.filter((s) => s.email.toLowerCase() !== clean));
    if (isSupabaseConfigured()) {
      deleteNewsletterSubscriberFromSupabase(clean).catch(() => {});
    }
  };

  const getAllAudienceEmails = (): AudienceMember[] => {
    const audienceMap = new Map<string, AudienceMember>();

    // 1. Registered Student Athletes (priority: have legal names and athlete biodata)
    idCards.forEach((card) => {
      if (card.email && card.email.includes('@')) {
        const cleanEmail = card.email.trim().toLowerCase();
        audienceMap.set(cleanEmail, {
          email: cleanEmail,
          name: card.fullName.trim(),
          source: 'Athlete Registration',
          matricNumber: card.matricNumber,
          sport: card.sport,
          faculty: card.faculty,
        });
      }
    });

    // 2. Public Newsletter Opt-in Subscribers (only add if not already in map, so athlete name is preserved)
    subscribers.forEach((sub) => {
      if (sub.email && sub.email.includes('@') && sub.status === 'Active') {
        const cleanEmail = sub.email.trim().toLowerCase();
        if (!audienceMap.has(cleanEmail)) {
          audienceMap.set(cleanEmail, {
            email: cleanEmail,
            name: sub.name?.trim() || undefined,
            source: 'Newsletter Opt-in',
          });
        }
      }
    });

    return Array.from(audienceMap.values());
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        activeRole,
        setRole,
        loginWithGoogle,
        loginWithCredentials,
        logout,
        idCards,
        addIdCard,
        updateCardStatus,
        deleteIdCard,
        refreshCardsFromCloud,
        subscribers,
        subscribeToNewsletter,
        deleteSubscriber,
        getAllAudienceEmails,
        news,
        addNewsItem,
        deleteNewsItem,
        complaints,
        addComplaint,
        respondToComplaint,
        updateComplaintStatus,
        getCardByNumber,
        checkExistingCard,
        matches,
        updateMatchScore,
        updateMatchStatus,
        addMatchEvent,
        deleteMatchEvent,
        addMatch,
        updateMatch,
        deleteMatch,
        updateMatchStats,
        updateMatchLineups,
        siteImages,
        addImageAsset,
        deleteImageAsset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
