import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Newspaper,
  MessageSquare,
  Trash2,
  Send,
  CheckCircle2,
  AlertCircle,
  Search,
  Camera,
  QrCode,
  RefreshCw,
  Award,
  ShieldAlert,
  Radio,
  Image as ImageIcon,
  Plus,
  Clock,
  Zap,
  ArrowRightLeft,
  X,
  MapPin,
  Calendar,
  Sparkles,
  Upload,
  Copy,
  Check,
  BarChart3,
  Sliders,
  UserCheck,
  UserPlus,
  Mail,
  Eye,
  Filter,
  History,
  Server
} from 'lucide-react';
import { IdCard } from '../components/IdCard';
import { EmailNotificationModal } from '../components/EmailNotificationModal';
import { IdCardRecord, MatchRecord, MatchEvent, SiteMediaAsset, LineupPlayer, MatchLineups, NewsletterBroadcastPayload, BroadcastHistoryRecord, AudienceMember } from '../types';
import { SPORTS_LIST } from '../data/sportsData';
import { 
  sendAccountDeletionEmail, 
  sendAccountSuspensionEmail, 
  sendAccountReinstatementEmail,
  broadcastNewsletterToAudience,
  getDailyQuotaStatus,
  fetchLiveBrevoQuota,
  DailyQuotaStatus
} from '../services/emailService';
import { generateNewsletterBroadcastEmail, AccreditationEmailData } from '../utils/emailNotification';

export const ConsolePage: React.FC = () => {
  const {
    activeRole,
    idCards,
    updateCardStatus,
    deleteIdCard,
    complaints,
    respondToComplaint,
    news,
    addNewsItem,
    deleteNewsItem,
    getCardByNumber,
    matches,
    updateMatchScore,
    updateMatchStatus,
    addMatchEvent,
    deleteMatchEvent,
    addMatch,
    deleteMatch,
    updateMatchStats,
    updateMatchLineups,
    siteImages,
    addImageAsset,
    deleteImageAsset,
    subscribers,
    deleteSubscriber,
    getAllAudienceEmails,
  } = useAuth();

  const isDirector = activeRole === 'director';
  const isFacultyOfficer = activeRole === 'faculty_sport_officer';
  const isMediaOfficer = activeRole === 'media_officer';

  // Consolidated Audience for Newsletter Broadcasts
  const allAudience = getAllAudienceEmails();
  const athletesAudienceCount = allAudience.filter((a) => a.source === 'Athlete Registration').length;
  const newsletterAudienceCount = allAudience.filter((a) => a.source === 'Newsletter Opt-in').length;

  // Default active tab based on role
  const [activeConsoleTab, setActiveConsoleTab] = useState<'livescore' | 'images' | 'news' | 'athletes' | 'verify' | 'complaints' | 'newsletter'>(() => {
    if (isMediaOfficer) return 'livescore';
    return 'athletes';
  });

  // Newsletter & Announcement Broadcast states
  const [broadcastFormData, setBroadcastFormData] = useState<NewsletterBroadcastPayload>({
    subject: '',
    headline: '',
    category: 'Director Notice',
    content: '',
    ctaText: '',
    ctaUrl: '',
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState<{ current: number; total: number; channel?: string } | null>(null);
  const [quotaStatus, setQuotaStatus] = useState<DailyQuotaStatus>(() => getDailyQuotaStatus());
  const [isSyncingQuota, setIsSyncingQuota] = useState(false);

  const handleSyncQuota = async () => {
    setIsSyncingQuota(true);
    try {
      await fetchLiveBrevoQuota();
      setQuotaStatus(getDailyQuotaStatus());
    } catch (err) {
      console.warn('Manual live quota sync notice:', err);
    } finally {
      setIsSyncingQuota(false);
    }
  };

  useEffect(() => {
    const updateQuota = () => setQuotaStatus(getDailyQuotaStatus());
    window.addEventListener('gisu_quota_updated', updateQuota);
    const interval = setInterval(updateQuota, 15000);

    // Synchronize live Brevo Cloud quota on mount
    fetchLiveBrevoQuota().catch((err) => console.warn('Brevo quota sync notice:', err));

    return () => {
      window.removeEventListener('gisu_quota_updated', updateQuota);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (activeConsoleTab === 'newsletter') {
      fetchLiveBrevoQuota().catch((err) => console.warn('Brevo newsletter tab sync notice:', err));
    }
  }, [activeConsoleTab]);

  const [previewEmailData, setPreviewEmailData] = useState<AccreditationEmailData | null>(null);
  const [previewSalutationType, setPreviewSalutationType] = useState<'athlete' | 'subscriber'>('athlete');
  const [audienceSearch, setAudienceSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<'all' | 'athletes' | 'newsletter'>('all');
  const [broadcastHistory, setBroadcastHistory] = useState<BroadcastHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gisu_broadcast_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [athleteSearch, setAthleteSearch] = useState('');

  // Card verification scanner states (Internal to Director / Officer Console)
  const [verifyInput, setVerifyInput] = useState('');
  const [searchedCard, setSearchedCard] = useState<IdCardRecord | null | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Athlete Deletion & Suspension Management States (Director Console)
  const [cardToDelete, setCardToDelete] = useState<IdCardRecord | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [cardToSuspend, setCardToSuspend] = useState<IdCardRecord | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [isSuspending, setIsSuspending] = useState(false);

  // Match Operations Command Center Modal states
  const [selectedMatchForManager, setSelectedMatchForManager] = useState<MatchRecord | null>(null);
  const [managerTab, setManagerTab] = useState<'events' | 'stats' | 'lineups'>('events');
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [copiedImageId, setCopiedImageId] = useState<string | null>(null);
  const [saveFeedbackToast, setSaveFeedbackToast] = useState<string | null>(null);

  // Event creation form state
  const [eventFormData, setEventFormData] = useState<{
    type: 'goal' | 'yellow_card' | 'red_card' | 'sub';
    team: 'home' | 'away';
    player: string;
    minute: number;
    detail: string;
    subIn?: string;
  }>({
    type: 'yellow_card',
    team: 'home',
    player: '',
    minute: 45,
    detail: '',
    subIn: '',
  });

  // Stats edit form state
  const [statsFormData, setStatsFormData] = useState<{
    possessionHome: number;
    shotsOnTargetHome: number;
    shotsOnTargetAway: number;
    shotsOffTargetHome: number;
    shotsOffTargetAway: number;
    foulsHome: number;
    foulsAway: number;
    cornersHome: number;
    cornersAway: number;
  }>({
    possessionHome: 50,
    shotsOnTargetHome: 3,
    shotsOnTargetAway: 3,
    shotsOffTargetHome: 2,
    shotsOffTargetAway: 2,
    foulsHome: 4,
    foulsAway: 5,
    cornersHome: 3,
    cornersAway: 2,
  });

  // Lineup management state
  const [lineupTeamTab, setLineupTeamTab] = useState<'home' | 'away'>('home');
  const [newLineupPlayer, setNewLineupPlayer] = useState<{
    number: number;
    name: string;
    position: string;
    isCaptain: boolean;
    isStarting: boolean;
  }>({
    number: 10,
    name: '',
    position: 'MID',
    isCaptain: false,
    isStarting: true,
  });

  // Match creation form state
  const [newMatchFormData, setNewMatchFormData] = useState({
    sport: 'Football',
    competition: 'Great Ife Inter-Faculty Dean’s Cup 2026',
    stage: 'Group Stage Matchday',
    date: '2026-09-03',
    time: '16:00',
    venue: 'OAU Sports Complex Main Bowl Stadium',
    homeTeamName: 'Faculty of Technology',
    homeTeamFaculty: 'Technology',
    homeTeamShort: 'TECH',
    homeCrest: '#071E10',
    awayTeamName: 'Faculty of Administration',
    awayTeamFaculty: 'Administration',
    awayTeamShort: 'ADMIN',
    awayCrest: '#15803D',
  });

  // Site Image upload form state
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [newImageFormData, setNewImageFormData] = useState({
    title: '',
    category: 'Matchday Action' as SiteMediaAsset['category'],
    imageUrl: '',
    description: '',
  });

  // Announcement publisher form state
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNewsFormData, setNewNewsFormData] = useState({
    title: '',
    category: 'Tournament' as 'Tournament' | 'Trials' | 'Office Update' | 'Facilities' | 'General',
    excerpt: '',
    content: '',
    authorName: 'Media Secretariat',
    authorRole: 'Sports Council Media Unit',
    imageUrl: '',
  });

  // Open match command center and sync current stats / lineups
  const handleOpenMatchManager = (match: MatchRecord, tab: 'events' | 'stats' | 'lineups' = 'events') => {
    setSelectedMatchForManager(match);
    setManagerTab(tab);

    // Sync stats form
    const currentStats = match.stats || {};
    setStatsFormData({
      possessionHome: currentStats.possession ? currentStats.possession[0] : 50,
      shotsOnTargetHome: currentStats.shotsOnTarget ? currentStats.shotsOnTarget[0] : 0,
      shotsOnTargetAway: currentStats.shotsOnTarget ? currentStats.shotsOnTarget[1] : 0,
      shotsOffTargetHome: currentStats.shotsOffTarget ? currentStats.shotsOffTarget[0] : 0,
      shotsOffTargetAway: currentStats.shotsOffTarget ? currentStats.shotsOffTarget[1] : 0,
      foulsHome: currentStats.fouls ? currentStats.fouls[0] : 0,
      foulsAway: currentStats.fouls ? currentStats.fouls[1] : 0,
      cornersHome: currentStats.corners ? currentStats.corners[0] : 0,
      cornersAway: currentStats.corners ? currentStats.corners[1] : 0,
    });

    setEventFormData((prev) => ({
      ...prev,
      minute: match.minute || 45,
    }));
  };

  const handleSendResponse = (complaintId: string) => {
    if (!responseText.trim()) return;
    respondToComplaint(complaintId, responseText);
    setSelectedComplaintId(null);
    setResponseText('');
  };

  // Permanently delete athlete account, vacate ID, and dispatch official deletion notice email
  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;
    setIsDeleting(true);
    try {
      // 1. Dispatch official account deletion notification email
      await sendAccountDeletionEmail(cardToDelete, deleteReason);

      // 2. Permanently delete from local storage & Supabase (vacating the ID)
      deleteIdCard(cardToDelete.id);

      showToast(`Account & ID ${cardToDelete.cardNumber} deleted and vacated. Deletion notice sent to ${cardToDelete.email}.`);
      setCardToDelete(null);
      setDeleteReason('');
    } catch (err) {
      console.error('Error deleting account:', err);
      showToast(`Error deleting account: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Place athlete pass on suspension and dispatch official suspension notice email
  const handleConfirmSuspend = async () => {
    if (!cardToSuspend) return;
    setIsSuspending(true);
    try {
      // 1. Dispatch official suspension notification email
      await sendAccountSuspensionEmail(cardToSuspend, suspensionReason);

      // 2. Update status in local storage & Supabase
      updateCardStatus(cardToSuspend.id, 'Suspended');

      showToast(`Sports pass for ${cardToSuspend.fullName} suspended. Suspension notice sent to ${cardToSuspend.email}.`);
      setCardToSuspend(null);
      setSuspensionReason('');
    } catch (err) {
      console.error('Error suspending account:', err);
      showToast(`Error suspending account: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSuspending(false);
    }
  };

  // Re-activate suspended athlete pass and dispatch official reinstatement notice email
  const handleReactivateCard = async (card: IdCardRecord) => {
    try {
      updateCardStatus(card.id, 'Active');
      await sendAccountReinstatementEmail(card);
      showToast(`Sports pass for ${card.fullName} reinstated to Active. Notice sent to ${card.email}.`);
    } catch (err) {
      console.error('Error reinstating account:', err);
      showToast(`Pass reinstated to Active for ${card.fullName}.`);
    }
  };

  // Newsletter & Announcement Broadcast handlers
  const handleOpenBroadcastPreview = (recipientType?: 'athlete' | 'subscriber') => {
    const type = recipientType || previewSalutationType;
    const sampleRecipient = type === 'athlete'
      ? { email: 'athlete.sample@student.oauife.edu.ng', name: 'Boluwatife Adeleke' }
      : { email: 'subscriber.sample@gmail.com', name: undefined };

    const emailData = generateNewsletterBroadcastEmail(sampleRecipient, broadcastFormData);
    setPreviewEmailData(emailData);
  };

  const handleOpenSingleRecipientPreview = (recipient: AudienceMember) => {
    const emailData = generateNewsletterBroadcastEmail(
      { email: recipient.email, name: recipient.name },
      broadcastFormData
    );
    setPreviewEmailData(emailData);
  };

  const handleDispatchBroadcast = async () => {
    if (!broadcastFormData.subject.trim() || !broadcastFormData.content.trim()) {
      showToast('Please provide a subject line and announcement content.');
      return;
    }

    if (allAudience.length === 0) {
      showToast('No recipients found in audience registry.');
      return;
    }

    setIsBroadcasting(true);
    setBroadcastProgress({ current: 0, total: allAudience.length, channel: 'brevo' });

    try {
      const result = await broadcastNewsletterToAudience(
        allAudience.map((a) => ({ email: a.email, name: a.name })),
        broadcastFormData,
        (current, total, activeChannel) => setBroadcastProgress({ current, total, channel: activeChannel })
      );

      const savedHistory = localStorage.getItem('gisu_broadcast_history');
      if (savedHistory) {
        try {
          setBroadcastHistory(JSON.parse(savedHistory));
        } catch {
          // Fallback if parsing fails
        }
      }

      setQuotaStatus(getDailyQuotaStatus());

      const channelSummary = `Brevo: ${result.channelsUsed.brevo}, Resend: ${result.channelsUsed.resend}, SMTP: ${result.channelsUsed.smtp}`;
      showToast(`Bulletin dispatched to ${result.total} inboxes (${result.successful} delivered). [${channelSummary}]`);
    } catch (err) {
      console.error('Broadcast error:', err);
      showToast('Error during broadcast dispatch.');
    } finally {
      setIsBroadcasting(false);
      setBroadcastProgress(null);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    const card = getCardByNumber(verifyInput);
    setSearchedCard(card);
    setHasSearched(true);
  };

  const handleSimulateScan = (cardNo: string) => {
    setIsScanning(true);
    setVerifyInput(cardNo);
    setTimeout(() => {
      const card = getCardByNumber(cardNo);
      setSearchedCard(card);
      setHasSearched(true);
      setIsScanning(false);
    }, 700);
  };

  // Submit Match Event (Goal, Yellow Card, Red Card, Sub)
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForManager || !eventFormData.player.trim()) return;

    let detail = eventFormData.detail.trim();
    if (eventFormData.type === 'sub' && eventFormData.subIn) {
      detail = `Off: ${eventFormData.player.trim()} • On: ${eventFormData.subIn.trim()}`;
    }

    addMatchEvent(selectedMatchForManager.id, {
      type: eventFormData.type,
      team: eventFormData.team,
      player: eventFormData.type === 'sub' && eventFormData.subIn ? eventFormData.subIn.trim() : eventFormData.player.trim(),
      minute: Number(eventFormData.minute),
      detail: detail || undefined,
    });

    // Update selected match in modal state
    const updated = matches.find((m) => m.id === selectedMatchForManager.id);
    if (updated) setSelectedMatchForManager(updated);

    // Reset event form
    setEventFormData({
      type: 'yellow_card',
      team: 'home',
      player: '',
      minute: selectedMatchForManager.minute || 45,
      detail: '',
      subIn: '',
    });

    showToast('Match event successfully recorded and published!');
  };

  // Save Stats
  const handleSaveStatsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForManager) return;

    const possessionAway = 100 - statsFormData.possessionHome;
    const stats: MatchRecord['stats'] = {
      possession: [statsFormData.possessionHome, possessionAway],
      shotsOnTarget: [statsFormData.shotsOnTargetHome, statsFormData.shotsOnTargetAway],
      shotsOffTarget: [statsFormData.shotsOffTargetHome, statsFormData.shotsOffTargetAway],
      fouls: [statsFormData.foulsHome, statsFormData.foulsAway],
      corners: [statsFormData.cornersHome, statsFormData.cornersAway],
    };

    updateMatchStats(selectedMatchForManager.id, stats);
    showToast('Live match statistics saved successfully!');
  };

  // Add player to lineups
  const handleAddPlayerToLineup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForManager || !newLineupPlayer.name.trim()) return;

    const currentLineups = selectedMatchForManager.lineups || {
      homeStartingXI: [],
      homeSubs: [],
      awayStartingXI: [],
      awaySubs: [],
    };

    const newPlayer: LineupPlayer = {
      number: Number(newLineupPlayer.number),
      name: newLineupPlayer.name.trim(),
      position: newLineupPlayer.position,
      isCaptain: newLineupPlayer.isCaptain,
    };

    let updatedLineups: MatchLineups = { ...currentLineups };

    if (lineupTeamTab === 'home') {
      if (newLineupPlayer.isStarting) {
        updatedLineups.homeStartingXI = [...(updatedLineups.homeStartingXI || []), newPlayer];
      } else {
        updatedLineups.homeSubs = [...(updatedLineups.homeSubs || []), newPlayer];
      }
    } else {
      if (newLineupPlayer.isStarting) {
        updatedLineups.awayStartingXI = [...(updatedLineups.awayStartingXI || []), newPlayer];
      } else {
        updatedLineups.awaySubs = [...(updatedLineups.awaySubs || []), newPlayer];
      }
    }

    updateMatchLineups(selectedMatchForManager.id, updatedLineups);
    setSelectedMatchForManager({
      ...selectedMatchForManager,
      lineups: updatedLineups,
    });

    setNewLineupPlayer({
      number: Number(newLineupPlayer.number) + 1,
      name: '',
      position: 'MID',
      isCaptain: false,
      isStarting: true,
    });

    showToast(`Added ${newPlayer.name} to ${lineupTeamTab === 'home' ? selectedMatchForManager.homeTeam.shortName : selectedMatchForManager.awayTeam.shortName} roster!`);
  };

  // Remove player from lineup
  const handleRemovePlayerFromLineup = (number: number, listType: 'homeStart' | 'homeSub' | 'awayStart' | 'awaySub') => {
    if (!selectedMatchForManager?.lineups) return;
    const current = selectedMatchForManager.lineups;
    let updated = { ...current };

    if (listType === 'homeStart') updated.homeStartingXI = updated.homeStartingXI.filter((p) => p.number !== number);
    if (listType === 'homeSub') updated.homeSubs = updated.homeSubs.filter((p) => p.number !== number);
    if (listType === 'awayStart') updated.awayStartingXI = updated.awayStartingXI.filter((p) => p.number !== number);
    if (listType === 'awaySub') updated.awaySubs = updated.awaySubs.filter((p) => p.number !== number);

    updateMatchLineups(selectedMatchForManager.id, updated);
    setSelectedMatchForManager({
      ...selectedMatchForManager,
      lineups: updated,
    });
  };

  // Prepopulate standard squad
  const handleLoadStandardSquad = () => {
    if (!selectedMatchForManager) return;
    const standardLineups: MatchLineups = {
      homeStartingXI: [
        { number: 1, name: 'B. Alade', position: 'GK' },
        { number: 2, name: 'S. Adeleke', position: 'DEF' },
        { number: 4, name: 'O. Fashola', position: 'DEF' },
        { number: 5, name: 'C. Okonkwo', position: 'DEF', isCaptain: true },
        { number: 3, name: 'T. Bakare', position: 'DEF' },
        { number: 6, name: 'E. Chukwu', position: 'MID' },
        { number: 8, name: 'A. Tobi', position: 'MID' },
        { number: 10, name: 'K. Babatunde', position: 'MID' },
        { number: 7, name: 'D. Ojo', position: 'FWD' },
        { number: 9, name: 'S. Balogun', position: 'FWD' },
        { number: 11, name: 'M. Salami', position: 'FWD' },
      ],
      homeSubs: [
        { number: 12, name: 'J. Ayodele', position: 'GK' },
        { number: 14, name: 'F. Idowu', position: 'DEF' },
        { number: 17, name: 'G. Ibrahim', position: 'MID' },
        { number: 19, name: 'P. Eke', position: 'FWD' },
      ],
      awayStartingXI: [
        { number: 1, name: 'M. Usman', position: 'GK' },
        { number: 2, name: 'Y. Bello', position: 'DEF' },
        { number: 3, name: 'I. Danjuma', position: 'DEF' },
        { number: 5, name: 'R. Adeleke', position: 'DEF', isCaptain: true },
        { number: 6, name: 'L. Eze', position: 'DEF' },
        { number: 4, name: 'C. Okoro', position: 'MID' },
        { number: 8, name: 'H. Sanusi', position: 'MID' },
        { number: 10, name: 'W. Olatunji', position: 'MID' },
        { number: 7, name: 'N. Lawal', position: 'FWD' },
        { number: 9, name: 'A. Ogundipe', position: 'FWD' },
        { number: 11, name: 'K. Jimoh', position: 'FWD' },
      ],
      awaySubs: [
        { number: 13, name: 'S. Alabi', position: 'GK' },
        { number: 15, name: 'E. Nnamdi', position: 'DEF' },
        { number: 16, name: 'B. Yusuf', position: 'MID' },
        { number: 20, name: 'T. Afolabi', position: 'FWD' },
      ],
    };

    updateMatchLineups(selectedMatchForManager.id, standardLineups);
    setSelectedMatchForManager({
      ...selectedMatchForManager,
      lineups: standardLineups,
    });
    showToast('Standard 4-3-3 faculty starting XIs and substitutes loaded!');
  };

  const showToast = (msg: string) => {
    setSaveFeedbackToast(msg);
    setTimeout(() => setSaveFeedbackToast(null), 3000);
  };

  // Submit New Match Fixture
  const handleCreateMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMatch({
      competition: newMatchFormData.competition,
      sport: newMatchFormData.sport,
      stage: newMatchFormData.stage,
      date: newMatchFormData.date,
      time: newMatchFormData.time,
      status: 'SCHEDULED',
      venue: newMatchFormData.venue,
      homeTeam: {
        name: newMatchFormData.homeTeamName,
        faculty: newMatchFormData.homeTeamFaculty,
        shortName: newMatchFormData.homeTeamShort,
        score: 0,
        crestColor: newMatchFormData.homeCrest,
      },
      awayTeam: {
        name: newMatchFormData.awayTeamName,
        faculty: newMatchFormData.awayTeamFaculty,
        shortName: newMatchFormData.awayTeamShort,
        score: 0,
        crestColor: newMatchFormData.awayCrest,
      },
      events: [],
      stats: {
        possession: [50, 50],
        shotsOnTarget: [0, 0],
        shotsOffTarget: [0, 0],
        fouls: [0, 0],
        corners: [0, 0],
      },
    });
    setShowAddMatchModal(false);
  };

  // Submit Image Asset
  const handleAddImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageFormData.title.trim() || !newImageFormData.imageUrl.trim()) return;
    addImageAsset({
      title: newImageFormData.title.trim(),
      category: newImageFormData.category,
      imageUrl: newImageFormData.imageUrl.trim(),
      uploadedBy: 'Media Secretariat',
      description: newImageFormData.description.trim() || undefined,
    });
    setShowAddImageModal(false);
    setNewImageFormData({
      title: '',
      category: 'Matchday Action',
      imageUrl: '',
      description: '',
    });
  };

  // Submit Announcement
  const handleAddNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsFormData.title.trim() || !newNewsFormData.content.trim()) return;
    addNewsItem({
      title: newNewsFormData.title.trim(),
      category: newNewsFormData.category,
      excerpt: newNewsFormData.excerpt.trim() || newNewsFormData.content.slice(0, 120),
      content: newNewsFormData.content.trim(),
      authorName: newNewsFormData.authorName,
      authorRole: newNewsFormData.authorRole,
      imageUrl: newNewsFormData.imageUrl.trim() || undefined,
    });
    setShowAddNewsModal(false);
    setNewNewsFormData({
      title: '',
      category: 'Tournament',
      excerpt: '',
      content: '',
      authorName: 'Media Secretariat',
      authorRole: 'Sports Council Media Unit',
      imageUrl: '',
    });
  };

  const copyImageUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedImageId(id);
    setTimeout(() => setCopiedImageId(null), 2500);
  };

  const filteredCards = idCards.filter((c) =>
    c.fullName.toLowerCase().includes(athleteSearch.toLowerCase()) ||
    c.matricNumber.toLowerCase().includes(athleteSearch.toLowerCase()) ||
    c.cardNumber.toLowerCase().includes(athleteSearch.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-24 text-left bg-[#FFFFFF]">
      
      {/* Toast Notification */}
      {saveFeedbackToast && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-[#071E10] text-[#B5F438] border border-[#B5F438] shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#B5F438]" />
          <span className="text-xs font-mono font-bold">{saveFeedbackToast}</span>
        </div>
      )}

      {/* 1. HERO HEADER BANNER */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20 bg-[#071E10] text-white overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#B5F438]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#15803D]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#B5F438]/40 text-[#B5F438] text-xs font-mono font-bold uppercase tracking-wider">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>EXECUTIVE GOVERNANCE CONSOLE</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {isMediaOfficer ? (
                  <>Media Secretariat <span className="text-[#B5F438]">Console</span></>
                ) : (
                  <>Sports Office <span className="text-[#B5F438]">Administration</span></>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#CBD5E1] max-w-2xl leading-relaxed font-normal">
                {isMediaOfficer
                  ? 'Official media command centre in charge of real-time LiveScores, yellow/red cards, substitutions, Starting XIs, site image assets, and press bulletins.'
                  : 'Role-gated executive management console for card accreditation, official ID verification scanner, disputes adjudication, and media management.'}
              </p>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shrink-0 shadow-lg">
              <ShieldCheck className="w-6 h-6 text-[#B5F438]" />
              <div>
                <span className="text-[10px] text-[#94A3B8] font-mono block uppercase">Active Authorization Scope</span>
                <span className="text-sm font-heading font-extrabold text-[#B5F438] capitalize">
                  {activeRole.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="font-heading font-extrabold text-3xl text-rose-500 block">
                {matches.filter((m) => m.status === 'LIVE').length}
              </span>
              <span className="text-xs text-[#94A3B8]">Live Matches Now</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="font-heading font-extrabold text-3xl text-[#B5F438] block">{matches.length}</span>
              <span className="text-xs text-[#94A3B8]">Total Match Fixtures</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="font-heading font-extrabold text-3xl text-[#38BDF8] block">{siteImages.length}</span>
              <span className="text-xs text-[#94A3B8]">Media Asset Photos</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="font-heading font-extrabold text-3xl text-amber-400 block">{news.length}</span>
              <span className="text-xs text-[#94A3B8]">Published Bulletins</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONSOLE TABS & CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] shadow-xs">
          
          {/* MEDIA CONSOLE PRIMARY TABS */}
          {(isMediaOfficer || isDirector) && (
            <button
              onClick={() => setActiveConsoleTab('livescore')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold font-heading uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeConsoleTab === 'livescore'
                  ? 'bg-[#071E10] text-[#B5F438] shadow-md'
                  : 'text-[#64748B] hover:text-[#071E10]'
              }`}
            >
              <Radio className="w-4 h-4 text-[#B5F438]" />
              <span>LiveScore Operations (Coming Soon)</span>
            </button>
          )}

          {(isMediaOfficer || isDirector) && (
            <button
              onClick={() => setActiveConsoleTab('images')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold font-heading uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeConsoleTab === 'images'
                  ? 'bg-[#071E10] text-[#B5F438] shadow-md'
                  : 'text-[#64748B] hover:text-[#071E10]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Site Images & Media Hub ({siteImages.length})</span>
            </button>
          )}

          {(isMediaOfficer || isDirector) && (
            <button
              onClick={() => setActiveConsoleTab('news')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold font-heading uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeConsoleTab === 'news'
                  ? 'bg-[#071E10] text-[#B5F438] shadow-md'
                  : 'text-[#64748B] hover:text-[#071E10]'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Announcements & Bulletins ({news.length})</span>
            </button>
          )}

          {/* DIRECTOR & FACULTY OFFICER TABS */}
          {(isDirector || isFacultyOfficer) && (
            <button
              onClick={() => setActiveConsoleTab('athletes')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold font-heading uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeConsoleTab === 'athletes'
                  ? 'bg-[#071E10] text-[#B5F438] shadow-md'
                  : 'text-[#64748B] hover:text-[#071E10]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Athlete ID Registry ({idCards.length})</span>
            </button>
          )}

          {(isDirector || isFacultyOfficer) && (
            <button
              onClick={() => setActiveConsoleTab('verify')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold font-heading uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeConsoleTab === 'verify'
                  ? 'bg-[#071E10] text-[#B5F438] shadow-md'
                  : 'text-[#64748B] hover:text-[#071E10]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Card Scanner</span>
            </button>
          )}

          {(isDirector || isFacultyOfficer) && (
            <button
              onClick={() => setActiveConsoleTab('complaints')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold font-heading uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeConsoleTab === 'complaints'
                  ? 'bg-[#071E10] text-[#B5F438] shadow-md'
                  : 'text-[#64748B] hover:text-[#071E10]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Disputes & Grievances ({complaints.length})</span>
            </button>
          )}

          {/* NEWSLETTER & BROADCAST TAB */}
          {(isDirector || isMediaOfficer) && (
            <button
              onClick={() => setActiveConsoleTab('newsletter')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold font-heading uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeConsoleTab === 'newsletter'
                  ? 'bg-[#071E10] text-[#B5F438] shadow-md'
                  : 'text-[#64748B] hover:text-[#071E10]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Newsletter & Broadcasts ({allAudience.length})</span>
            </button>
          )}

        </div>

        {/* TAB 1: LIVESCORE OPERATIONS CENTRE (MEDIA CONSOLE) */}
        {activeConsoleTab === 'livescore' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Top Action Bar */}
            <div className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
                  REAL-TIME MATCH CONTROL CENTRE
                </span>
                <h2 className="font-heading text-2xl font-extrabold text-[#0B1220]">
                  LiveScore Operations & Match Desk
                </h2>
                <p className="text-xs text-[#64748B]">
                  Full broadcasting desk to update live scores, log yellow/red cards, substitutions, edit match stats (possession/shots), and manage Starting XIs.
                </p>
              </div>

              <button
                onClick={() => setShowAddMatchModal(true)}
                className="px-6 py-3 rounded-2xl bg-[#071E10] hover:bg-[#0B2A18] text-[#B5F438] font-heading font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Fixture</span>
              </button>
            </div>

            {/* Pre-Season Staging Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>
                <strong>PRE-SEASON STAGING • COMING SOON:</strong> The public LiveScore Tracker is currently in <em>"Coming Soon • Anticipate"</em> mode. Any fixtures managed here will activate on the public match tracker once official tournament kickoff is declared.
              </span>
            </div>

            {/* Matches Management Cards List */}
            <div className="space-y-5">
              {matches.map((m) => {
                const isLive = m.status === 'LIVE';
                const eventsCount = m.events?.length || 0;
                const homeStartingCount = m.lineups?.homeStartingXI?.length || 0;

                return (
                  <div
                    key={m.id}
                    className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all space-y-5"
                  >
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#071E10] text-[#B5F438] font-bold text-[10px]">
                          {m.sport}
                        </span>
                        <strong className="text-[#0B1220]">{m.competition}</strong>
                        <span className="text-[#64748B]">• {m.stage}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[#64748B] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {m.date} at {m.time}
                        </span>
                        <span className="text-[#64748B]">({m.venue})</span>
                      </div>
                    </div>

                    {/* Interactive Scoreboard Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Teams & Score Controller */}
                      <div className="lg:col-span-6 grid grid-cols-5 items-center gap-4 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8F0]">
                        
                        {/* Home Team */}
                        <div className="col-span-2 text-center space-y-1">
                          <span className="font-heading font-extrabold text-sm sm:text-base text-[#0B1220] block">
                            {m.homeTeam.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#64748B]">({m.homeTeam.shortName})</span>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <button
                              onClick={() => updateMatchScore(m.id, m.homeTeam.score - 1, m.awayTeam.score)}
                              className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] text-[#0B1220] font-mono font-bold hover:bg-[#E2E8F0] cursor-pointer"
                              title="Decrease score"
                            >
                              -
                            </button>
                            <span className="font-mono text-xl font-extrabold text-[#071E10] w-6 text-center">
                              {m.homeTeam.score}
                            </span>
                            <button
                              onClick={() => updateMatchScore(m.id, m.homeTeam.score + 1, m.awayTeam.score)}
                              className="w-7 h-7 rounded-lg bg-[#071E10] text-[#B5F438] font-mono font-bold hover:bg-[#0B2A18] cursor-pointer"
                              title="Increase score"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Middle Status / Minute */}
                        <div className="col-span-1 text-center space-y-2">
                          <div className="font-mono font-extrabold text-2xl text-[#0B1220]">
                            {m.homeTeam.score} - {m.awayTeam.score}
                          </div>
                          {isLive ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                                {m.minute}' LIVE
                              </span>
                              <div className="flex justify-center gap-1">
                                <button
                                  onClick={() => updateMatchScore(m.id, m.homeTeam.score, m.awayTeam.score, (m.minute || 0) + 1)}
                                  className="px-1.5 py-0.5 rounded bg-white border text-[10px] font-mono font-bold hover:bg-gray-100 cursor-pointer"
                                  title="Add 1 minute"
                                >
                                  +1'
                                </button>
                                <button
                                  onClick={() => updateMatchScore(m.id, m.homeTeam.score, m.awayTeam.score, (m.minute || 0) + 5)}
                                  className="px-1.5 py-0.5 rounded bg-white border text-[10px] font-mono font-bold hover:bg-gray-100 cursor-pointer"
                                  title="Add 5 minutes"
                                >
                                  +5'
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-[#64748B] text-xs font-mono font-bold">
                              {m.status}
                            </span>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="col-span-2 text-center space-y-1">
                          <span className="font-heading font-extrabold text-sm sm:text-base text-[#0B1220] block">
                            {m.awayTeam.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#64748B]">({m.awayTeam.shortName})</span>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <button
                              onClick={() => updateMatchScore(m.id, m.homeTeam.score, m.awayTeam.score - 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] text-[#0B1220] font-mono font-bold hover:bg-[#E2E8F0] cursor-pointer"
                              title="Decrease score"
                            >
                              -
                            </button>
                            <span className="font-mono text-xl font-extrabold text-[#071E10] w-6 text-center">
                              {m.awayTeam.score}
                            </span>
                            <button
                              onClick={() => updateMatchScore(m.id, m.homeTeam.score, m.awayTeam.score + 1)}
                              className="w-7 h-7 rounded-lg bg-[#071E10] text-[#B5F438] font-mono font-bold hover:bg-[#0B2A18] cursor-pointer"
                              title="Increase score"
                            >
                              +
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Status Buttons & Direct Action Launchers */}
                      <div className="lg:col-span-6 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
                        
                        {/* Status Toggle */}
                        <div className="flex items-center gap-1 bg-[#F8FAF6] p-1.5 rounded-xl border border-[#E2E8F0] shrink-0">
                          {(['SCHEDULED', 'LIVE', 'FT'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateMatchStatus(m.id, st, st === 'LIVE' ? (m.minute || 1) : m.minute)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                m.status === st
                                  ? st === 'LIVE'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-[#071E10] text-[#B5F438]'
                                  : 'text-[#64748B] hover:text-[#0B1220]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        {/* Delete Fixture */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${m.homeTeam.shortName} vs ${m.awayTeam.shortName}?`)) {
                              deleteMatch(m.id);
                            }
                          }}
                          className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors shrink-0"
                          title="Delete match fixture"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* PROMINENT ACTION BUTTONS FOR EVENTS, STATS & STARTING XIs */}
                    <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Button 1: Events (Yellow/Red Cards, Goals, Subs) */}
                      <button
                        onClick={() => handleOpenMatchManager(m, 'events')}
                        className="p-3 rounded-2xl bg-[#071E10] text-[#B5F438] hover:bg-[#0B2A18] font-mono text-xs font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer border border-[#B5F438]/30"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#B5F438]" />
                          <span>Cards, Goals & Subs</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-[#B5F438] text-[#071E10] text-[10px] font-black">
                          {eventsCount} Logged
                        </span>
                      </button>

                      {/* Button 2: Match Live Stats (Possession, Shots, Fouls, Corners) */}
                      <button
                        onClick={() => handleOpenMatchManager(m, 'stats')}
                        className="p-3 rounded-2xl bg-[#F8FAF6] hover:bg-[#EBFCD0] text-[#0B1220] hover:text-[#15803D] font-mono text-xs font-bold flex items-center justify-between border border-[#E2E8F0] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-[#15803D]" />
                          <span>Live Stats & Possession</span>
                        </div>
                        <span className="text-[10px] text-[#64748B]">
                          {m.stats?.possession ? `${m.stats.possession[0]}% - ${m.stats.possession[1]}%` : 'Edit Stats'}
                        </span>
                      </button>

                      {/* Button 3: Starting XIs & Substitutes Bench */}
                      <button
                        onClick={() => handleOpenMatchManager(m, 'lineups')}
                        className="p-3 rounded-2xl bg-[#F8FAF6] hover:bg-[#EBFCD0] text-[#0B1220] hover:text-[#15803D] font-mono text-xs font-bold flex items-center justify-between border border-[#E2E8F0] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#15803D]" />
                          <span>Starting XIs & Lineups</span>
                        </div>
                        <span className="text-[10px] text-[#64748B]">
                          {homeStartingCount > 0 ? `${homeStartingCount} Players In` : 'Set Lineups'}
                        </span>
                      </button>

                    </div>

                    {/* Quick Events Preview Bar */}
                    {m.events && m.events.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="text-[#64748B] font-bold">Recent Events:</span>
                        {m.events.map((ev) => (
                          <span
                            key={ev.id}
                            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 ${
                              ev.type === 'yellow_card'
                                ? 'bg-amber-50 border-amber-300 text-amber-900'
                                : ev.type === 'red_card'
                                ? 'bg-rose-50 border-rose-300 text-rose-900'
                                : ev.type === 'goal'
                                ? 'bg-[#EBFCD0] border-[#B5F438] text-[#15803D]'
                                : 'bg-blue-50 border-blue-200 text-blue-900'
                            }`}
                          >
                            <strong className="font-extrabold">{ev.minute}'</strong>
                            <span className="uppercase text-[10px] font-bold">[{ev.type.replace('_', ' ')}]</span>
                            <span>{ev.player}</span>
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: SITE IMAGES & MEDIA HUB (MEDIA CONSOLE) */}
        {activeConsoleTab === 'images' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
                  CAMPUS SPORTS MEDIA LIBRARY
                </span>
                <h2 className="font-heading text-2xl font-extrabold text-[#0B1220]">
                  Site Image & Photography Assets Hub
                </h2>
                <p className="text-xs text-[#64748B]">
                  Upload and organize matchday action photos, campus athletic facilities, and tournament banners used across the platform.
                </p>
              </div>

              <button
                onClick={() => setShowAddImageModal(true)}
                className="px-6 py-3 rounded-2xl bg-[#071E10] hover:bg-[#0B2A18] text-[#B5F438] font-heading font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Media Asset</span>
              </button>
            </div>

            {/* Media Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteImages.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-3xl border border-[#E2E8F0] overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={asset.imageUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/sports_stadium_bg.jpg';
                      }}
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#071E10]/80 backdrop-blur-md text-[#B5F438] font-mono text-[10px] font-bold border border-white/20">
                      {asset.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-heading font-extrabold text-base text-[#0B1220] leading-snug">
                        {asset.title}
                      </h3>
                      {asset.description && (
                        <p className="text-xs text-[#64748B] line-clamp-2">{asset.description}</p>
                      )}
                      <span className="text-[10px] font-mono text-[#94A3B8] block pt-1">
                        By {asset.uploadedBy} • {new Date(asset.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                      <button
                        onClick={() => copyImageUrl(asset.imageUrl, asset.id)}
                        className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] hover:border-[#071E10] text-xs font-mono font-bold text-[#0B1220] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {copiedImageId === asset.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete image "${asset.title}"?`)) {
                            deleteImageAsset(asset.id);
                          }
                        }}
                        className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: ANNOUNCEMENTS & BULLETINS (MEDIA CONSOLE) */}
        {activeConsoleTab === 'news' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
                  PRESS & PUBLIC RELATIONS DESK
                </span>
                <h2 className="font-heading text-2xl font-extrabold text-[#0B1220]">
                  Official Campus Bulletins & Announcements Desk
                </h2>
                <p className="text-xs text-[#64748B]">
                  Create, publish, and manage official sports notices, screening schedules, and tournament advisories.
                </p>
              </div>

              <button
                onClick={() => setShowAddNewsModal(true)}
                className="px-6 py-3 rounded-2xl bg-[#071E10] hover:bg-[#0B2A18] text-[#B5F438] font-heading font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Announcement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item) => (
                <div key={item.id} className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EBFCD0] text-[#15803D] font-mono font-bold text-[10px]">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-lg text-[#0B1220] leading-snug">{item.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">{item.content}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#64748B]">Author: <strong className="text-[#0B1220]">{item.authorName}</strong></span>
                    <button
                      onClick={() => deleteNewsItem(item.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ATHLETES ID REGISTRY (DIRECTOR & FACULTY OFFICER) */}
        {activeConsoleTab === 'athletes' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0]">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  value={athleteSearch}
                  onChange={(e) => setAthleteSearch(e.target.value)}
                  placeholder="Search card ID, athlete name, matric..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-xs text-[#0B1220] outline-none"
                />
              </div>
              <span className="text-xs font-mono text-[#64748B]">Showing {filteredCards.length} athletes</span>
            </div>

            <div className="rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm bg-[#FFFFFF]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#071E10] text-white font-mono uppercase text-[11px]">
                    <tr>
                      <th className="p-4">Card ID</th>
                      <th className="p-4">Athlete Details</th>
                      <th className="p-4">Academic Division</th>
                      <th className="p-4">Discipline</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredCards.map((card) => (
                      <tr key={card.id} className="hover:bg-[#F8FAF6] transition-colors">
                        <td className="p-4 font-mono font-bold text-[#071E10]">
                          {card.cardNumber}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={card.photoUrl} alt={card.fullName} className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0]" />
                            <div>
                              <strong className="text-sm font-heading font-extrabold text-[#0B1220] block">{card.fullName}</strong>
                              <span className="text-[11px] font-mono text-[#64748B]">{card.matricNumber}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[#64748B]">
                          <strong className="text-[#0B1220] block">{card.faculty}</strong>
                          <span className="text-[11px]">{card.department}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBFCD0] text-[#15803D] font-mono font-bold text-[10px]">
                            {card.sport}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            card.status === 'Active'
                              ? 'bg-[#EBFCD0] text-[#15803D]'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {card.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {card.status === 'Active' ? (
                              <button
                                onClick={() => {
                                  setCardToSuspend(card);
                                  setSuspensionReason('');
                                }}
                                className="px-2.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                                title="Suspend Athlete Credential"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReactivateCard(card)}
                                className="px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                                title="Reactivate Athlete Credential"
                              >
                                Activate
                              </button>
                            )}

                            {isDirector && (
                              <button
                                onClick={() => {
                                  setCardToDelete(card);
                                  setDeleteReason('');
                                }}
                                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                title="Permanently Delete Account & Vacate ID"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DIRECTOR VERIFY CARD & BARCODE SCANNER */}
        {activeConsoleTab === 'verify' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="p-8 rounded-3xl bg-[#F8FAF6] border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="space-y-1 border-b border-[#E2E8F0] pb-4">
                <span className="text-xs font-mono font-bold text-[#15803D] uppercase tracking-wider bg-[#EBFCD0] px-3 py-1 rounded-full border border-[#B5F438]/40">
                  OFFICIAL ATHLETE ACCREDITATION VALIDATION
                </span>
                <h2 className="font-heading text-2xl font-extrabold text-[#0B1220] mt-2">
                  Institutional Barcode & Credential Scanner
                </h2>
                <p className="text-xs text-[#64748B]">
                  Dedicated sports director screening tool to validate athlete cards or matriculation records prior to tournament fixtures.
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <input
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="Enter Card Number (GICS/2026/0001) or Matric No."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#B5F438] text-[#0B1220] font-mono text-sm placeholder-[#94A3B8] outline-none shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScanning}
                  className="px-8 py-3.5 rounded-2xl bg-[#071E10] hover:bg-[#0B2A18] text-[#B5F438] font-heading font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#B5F438]" />
                      <span>Scanning Registry...</span>
                    </>
                  ) : (
                    <>
                      <span>Scan & Validate</span>
                      <ShieldCheck className="w-4 h-4 text-[#B5F438]" />
                    </>
                  )}
                </button>
              </form>

              {idCards.length > 0 && (
                <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2 text-xs font-mono text-[#64748B]">
                  <span className="flex items-center gap-1 text-[#071E10] font-bold">
                    <Camera className="w-3.5 h-3.5 text-[#15803D]" />
                    Simulate Scanner:
                  </span>
                  {idCards.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSimulateScan(c.cardNumber)}
                      className="px-3 py-1 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#B5F438] text-xs font-mono font-bold text-[#0B1220] cursor-pointer"
                    >
                      {c.cardNumber}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {hasSearched && (
              <div className="space-y-6 animate-in fade-in">
                {searchedCard ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-6 p-7 rounded-3xl bg-[#F8FAF6] border-2 border-[#16A34A] space-y-6 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBFCD0] border border-[#B5F438] text-[#15803D] flex items-center justify-center shrink-0 shadow-sm">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="px-3 py-0.5 rounded-full bg-[#EBFCD0] text-[#15803D] text-[11px] font-mono font-bold">
                            STATUS: ACTIVE & ACCREDITED
                          </span>
                          <h3 className="font-heading text-2xl font-extrabold text-[#0B1220] mt-1">
                            Athlete Cleared for Fixtures
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
                        <div className="flex justify-between py-1">
                          <span className="text-[#64748B]">Sport Discipline:</span>
                          <strong className="text-[#15803D] font-bold">{searchedCard.sport}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-[#15803D] bg-[#EBFCD0] p-3 rounded-xl border border-[#B5F438]/50">
                        <Award className="w-4 h-4 shrink-0" />
                        <span>Eligible for all Great Ife Inter-Faculty and NUGA screening fixtures.</span>
                      </div>
                    </div>

                    <div className="lg:col-span-6 flex justify-center">
                      <IdCard card={searchedCard} />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-[#FEF2F2] border-2 border-[#EF4444] space-y-3 text-center">
                    <ShieldAlert className="w-10 h-10 text-rose-600 mx-auto" />
                    <h3 className="font-heading text-xl font-extrabold text-rose-800">
                      Unverified / Ineligible Credential
                    </h3>
                    <p className="text-xs text-rose-700 max-w-md mx-auto">
                      No matching accreditation record was found for "{verifyInput}". Mercenary or ineligible student entry flag raised.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: DISPUTES & GRIEVANCES ADJUDICATION */}
        {activeConsoleTab === 'complaints' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 gap-4">
              {complaints.map((comp) => (
                <div key={comp.id} className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-[#EBFCD0] text-[#15803D] font-mono font-bold text-[10px]">
                        {comp.category}
                      </span>
                      <span className="text-xs text-[#64748B] font-mono">ID: {comp.id}</span>
                    </div>
                    <span className="text-xs text-[#64748B] font-mono">{new Date(comp.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-extrabold text-lg text-[#0B1220]">{comp.subject}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">{comp.details}</p>
                    <p className="text-[11px] font-mono text-[#0B1220] pt-1">
                      Submitted by: <strong>{comp.athleteName}</strong> ({comp.athleteMatric}) • {comp.faculty}
                    </p>
                  </div>

                  {comp.officeResponse ? (
                    <div className="p-4 rounded-2xl bg-[#EBFCD0]/60 border border-[#B5F438]/40 space-y-1 text-xs">
                      <span className="font-heading font-bold text-[#15803D]">Official Resolution Response:</span>
                      <p className="text-[#071E10] font-normal leading-relaxed">{comp.officeResponse}</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      {selectedComplaintId === comp.id ? (
                        <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0]">
                          <textarea
                            rows={3}
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Type official response to athlete..."
                            className="w-full p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#0B1220] outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedComplaintId(null)}
                              className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0B1220] cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendResponse(comp.id)}
                              className="px-5 py-2 rounded-xl bg-[#071E10] text-[#B5F438] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Dispatch Response</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedComplaintId(comp.id)}
                          className="px-4 py-2 rounded-xl bg-[#071E10] text-[#B5F438] text-xs font-bold font-mono hover:bg-[#0B2A18] transition-colors cursor-pointer"
                        >
                          Respond to Athlete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: NEWSLETTER & BROADCAST COMMAND CENTER */}
        {activeConsoleTab === 'newsletter' && (
          <div className="space-y-8 animate-in fade-in text-left">
            
            {/* Header & KPI Summary */}
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                    <span className="text-xs sm:text-sm font-semibold text-[#15803D] uppercase tracking-wider">
                      Directorate Dispatch Desk &bull; Central Bulletin
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
                    Newsletter &amp; Official Directorate Broadcasts
                  </h2>
                  <p className="text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
                    Compose, preview, and broadcast official Directorate communications to accredited student-athletes and subscribed campus sports community members.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-semibold text-[#94A3B8] block uppercase tracking-wider">Sender Channel</span>
                    <span className="text-sm font-bold text-[#071E10]">gisusports@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Progress indicator during dispatch */}
              {isBroadcasting && broadcastProgress && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#071E10] text-white border border-[#B5F438]/30 space-y-2.5 text-sm font-sans">
                  <div className="flex items-center justify-between text-[#B5F438]">
                    <span className="flex items-center gap-2 font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        Transmitting via {broadcastProgress.channel === 'resend' ? 'Resend Relay' : broadcastProgress.channel === 'smtp' ? 'Gmail SMTP Relay' : 'Brevo API'}...
                      </span>
                    </span>
                    <span className="font-semibold">{broadcastProgress.current} / {broadcastProgress.total} inboxes</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                    <div 
                      className="h-full bg-[#B5F438] transition-all duration-200" 
                      style={{ width: `${(broadcastProgress.current / broadcastProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Refined Executive KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-1.5">
                  <span className="text-xs sm:text-sm font-bold text-[#64748B] uppercase tracking-wider block">Total Audience</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0B1220]">{allAudience.length}</strong>
                    <span className="text-xs sm:text-sm text-[#15803D] font-semibold">Active Inboxes</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] pt-1">Consolidated delivery reach</p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-1.5">
                  <span className="text-xs sm:text-sm font-bold text-[#64748B] uppercase tracking-wider block">Student-Athletes</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0B1220]">{athletesAudienceCount}</strong>
                    <span className="text-xs sm:text-sm text-[#15803D] font-semibold">Registered</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] pt-1">Personalized by legal name</p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-1.5">
                  <span className="text-xs sm:text-sm font-bold text-[#64748B] uppercase tracking-wider block">Public Subscribers</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0B1220]">{newsletterAudienceCount}</strong>
                    <span className="text-xs sm:text-sm text-sky-700 font-semibold">Opt-in</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] pt-1">General sports followers</p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-1.5">
                  <span className="text-xs sm:text-sm font-bold text-[#64748B] uppercase tracking-wider block">Broadcasts Sent</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0B1220]">{broadcastHistory.length}</strong>
                    <span className="text-xs sm:text-sm text-slate-600 font-semibold">Logged</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] pt-1">Preserved in Directorate archive</p>
                </div>
              </div>
            </div>

            {/* EXECUTIVE DELIVERY QUOTA & MULTI-PROVIDER RELAY POOL (STRATEGIES 1, 2 & 3) */}
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Server className="w-4 h-4 text-[#15803D]" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Multi-Provider Relay Pool &bull; Live Quota Monitor
                    </span>
                    {quotaStatus.isLiveSynced ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBFCD0] text-[#15803D] border border-[#B5F438]/60">
                        <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                        Brevo Cloud Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-700" />
                        Local Estimation
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1220]">
                    Combined Delivery Capacity (900 Free Inboxes / Day)
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Automatic failover cascade across Brevo API, Resend API, and Direct Gmail SMTP Relay (<strong>gisusports@gmail.com</strong>).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSyncQuota}
                    disabled={isSyncingQuota}
                    title="Query live Brevo Cloud API to fetch real-time remaining credits"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#15803D] hover:bg-[#F8FAF6] text-xs font-bold text-slate-700 hover:text-[#15803D] shadow-2xs transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#15803D] ${isSyncingQuota ? 'animate-spin' : ''}`} />
                    <span>{isSyncingQuota ? 'Syncing Brevo...' : 'Refresh Live Quota'}</span>
                  </button>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] text-xs sm:text-sm font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Resets at 01:00 AM WAT (in {quotaStatus.formattedCountdown})</span>
                  </div>
                </div>
              </div>

              {/* Overall Capacity Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-sans">
                  <span className="font-bold text-slate-800">
                    Daily Pool Usage: <strong className="text-slate-900">{quotaStatus.totalUsed} / {quotaStatus.totalLimit} Inboxes Used</strong>
                  </span>
                  <span className={`font-bold ${quotaStatus.totalRemaining > 150 ? 'text-[#15803D]' : 'text-amber-700'}`}>
                    {quotaStatus.totalRemaining} Inboxes Available Today ({100 - quotaStatus.percentUsed}% Headroom)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      quotaStatus.percentUsed > 85 ? 'bg-rose-500' : quotaStatus.percentUsed > 60 ? 'bg-amber-500' : 'bg-[#15803D]'
                    }`}
                    style={{ width: `${Math.max(quotaStatus.percentUsed, 3)}%` }}
                  />
                </div>
              </div>

              {/* Provider Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Channel 1: Brevo API */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Channel 1: Brevo API</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBFCD0] text-[#15803D] border border-[#B5F438]/40">
                      Primary &bull; Live
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{quotaStatus.brevoUsed} / {quotaStatus.brevoLimit}</span>
                    <span className="text-xs font-semibold text-[#15803D]">{quotaStatus.brevoRemaining} left</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {quotaStatus.isLiveSynced 
                      ? `Live Brevo Cloud balance: ${quotaStatus.brevoRemaining} left out of ${quotaStatus.brevoLimit} daily sends.`
                      : 'Official Directorate transactional dispatch API (300/day allowance).'}
                  </p>
                </div>

                {/* Channel 2: Resend API */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Channel 2: Resend API</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                      Failover 1
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{quotaStatus.resendUsed} / {quotaStatus.resendLimit}</span>
                    <span className="text-xs font-semibold text-sky-700">{quotaStatus.resendRemaining} left</span>
                  </div>
                  <p className="text-xs text-slate-500">Auto-engages if Brevo 300 quota is filled (100/day allowance).</p>
                </div>

                {/* Channel 3: Gmail SMTP Relay */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Channel 3: Gmail SMTP</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      Failover 2
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{quotaStatus.gmailUsed} / {quotaStatus.gmailLimit}</span>
                    <span className="text-xs font-semibold text-purple-700">{quotaStatus.gmailRemaining} left</span>
                  </div>
                  <p className="text-xs text-slate-500">Direct Google Relay for gisusports@gmail.com (+500/day allowance).</p>
                </div>
              </div>
            </div>

            {/* Announcement Composer Card */}
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-5">
                <div>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1220]">
                    Compose Directorate Bulletin
                  </h3>
                  <p className="text-sm text-[#64748B] mt-1">
                    Draft announcement contents. Official letterhead, signatories, and institutional footer are attached automatically upon dispatch.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 text-sm">
                  <span className="text-[#64748B] hidden sm:inline font-medium">Preview As:</span>
                  <button
                    type="button"
                    onClick={() => handleOpenBroadcastPreview('athlete')}
                    className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] hover:border-[#071E10] text-[#071E10] text-sm font-semibold transition-colors cursor-pointer bg-white hover:bg-slate-50 flex items-center gap-2 shadow-2xs"
                  >
                    <Eye className="w-4 h-4 text-[#15803D]" />
                    <span>Athlete Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenBroadcastPreview('subscriber')}
                    className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] hover:border-[#071E10] text-[#071E10] text-sm font-semibold transition-colors cursor-pointer bg-white hover:bg-slate-50 flex items-center gap-2 shadow-2xs"
                  >
                    <Eye className="w-4 h-4 text-sky-600" />
                    <span>Subscriber Preview</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6 text-sm font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="text-[#071E10] font-bold block mb-2 text-sm">
                      Bulletin Category
                    </label>
                    <select
                      value={broadcastFormData.category}
                      onChange={(e) => setBroadcastFormData({ ...broadcastFormData, category: e.target.value as any })}
                      className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] text-[#0B1220] text-sm sm:text-base font-semibold outline-none focus:bg-white focus:border-[#071E10] transition-colors"
                    >
                      <option value="Director Notice">Director Notice</option>
                      <option value="Tournament Bulletin">Tournament Bulletin</option>
                      <option value="Trial Accreditation">Trial Accreditation</option>
                      <option value="Sports Welfare">Sports Welfare</option>
                      <option value="General Update">General Update</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[#071E10] font-bold block mb-2 text-sm">
                      Email Subject Line
                    </label>
                    <input
                      type="text"
                      required
                      value={broadcastFormData.subject}
                      onChange={(e) => setBroadcastFormData({ ...broadcastFormData, subject: e.target.value })}
                      placeholder="e.g. Official Notice: Dean's Cup Matchday Schedule & Accreditation Protocol"
                      className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] text-[#0B1220] text-sm sm:text-base outline-none focus:bg-white focus:border-[#071E10] transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#071E10] font-bold block mb-2 text-sm">
                    Headline Banner Title
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastFormData.headline}
                    onChange={(e) => setBroadcastFormData({ ...broadcastFormData, headline: e.target.value })}
                    placeholder="e.g. 2026 Inter-Faculty Games Accreditation Guidelines Released"
                    className="w-full p-3.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] text-[#0B1220] text-sm sm:text-base font-bold outline-none focus:bg-white focus:border-[#071E10] transition-colors placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[#071E10] font-bold text-sm">
                      Announcement Body Content
                    </label>
                    <span className="text-xs sm:text-sm text-[#94A3B8]">Separate paragraphs with blank lines</span>
                  </div>
                  <textarea
                    rows={7}
                    required
                    value={broadcastFormData.content}
                    onChange={(e) => setBroadcastFormData({ ...broadcastFormData, content: e.target.value })}
                    placeholder="Type official communiqué text here. Content will be cleanly formatted into paragraphs with institutional typography, dual crest letterhead, and executive signatures..."
                    className="w-full p-4 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] text-[#0B1220] font-sans text-sm sm:text-base leading-relaxed outline-none focus:bg-white focus:border-[#071E10] transition-colors placeholder:text-slate-400 min-h-[160px]"
                  />
                </div>

                {/* Optional Call to Action Section */}
                <div className="p-5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] space-y-3.5">
                  <span className="text-sm font-bold text-[#071E10] uppercase tracking-wider block">
                    Optional Action Button (Call to Action)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#64748B] block mb-1.5 text-xs sm:text-sm font-medium">Button Label</label>
                      <input
                        type="text"
                        value={broadcastFormData.ctaText || ''}
                        onChange={(e) => setBroadcastFormData({ ...broadcastFormData, ctaText: e.target.value })}
                        placeholder="e.g. View Fixtures & LiveScores"
                        className="w-full p-3 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1220] outline-none focus:border-[#071E10]"
                      />
                    </div>
                    <div>
                      <label className="text-[#64748B] block mb-1.5 text-xs sm:text-sm font-medium">Destination URL or Page Route</label>
                      <input
                        type="text"
                        value={broadcastFormData.ctaUrl || ''}
                        onChange={(e) => setBroadcastFormData({ ...broadcastFormData, ctaUrl: e.target.value })}
                        placeholder="e.g. /livescore or https://..."
                        className="w-full p-3 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0B1220] outline-none focus:border-[#071E10]"
                      />
                    </div>
                  </div>
                </div>

                {/* Smart Multi-Provider Cascade & Batching Advisory */}
                {allAudience.length > 0 && allAudience.length > quotaStatus.brevoRemaining && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-900 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-amber-950">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Smart Multi-Provider Relay Cascade Active</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                      Target audience ({allAudience.length} inboxes) exceeds Brevo&apos;s remaining daily allowance ({quotaStatus.brevoRemaining} left). The platform will automatically cascade remaining transmissions across the Resend API and Gmail SMTP relay to deliver all inboxes safely today.
                    </p>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F1F5F9]">
                  <div className="text-sm text-[#64748B]">
                    <span>Target audience: <strong className="text-[#071E10]">{allAudience.length} inboxes</strong> ({athletesAudienceCount} athletes with full names, {newsletterAudienceCount} public subscribers).</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isBroadcasting}
                      onClick={handleDispatchBroadcast}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#071E10] hover:bg-[#0F351C] text-[#B5F438] font-heading font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-md transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isBroadcasting ? 'Dispatching Broadcast...' : `Dispatch Announcement (${allAudience.length})`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Consolidated Audience Directory Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-5">
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1220]">
                    Consolidated Audience Registry
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Active mailing directory comprising verified student-athletes and opt-in sports subscribers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-sm">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={audienceSearch}
                      onChange={(e) => setAudienceSearch(e.target.value)}
                      placeholder="Search recipient, email, matric..."
                      className="pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8FAF6] border border-[#E2E8F0] text-sm text-[#0B1220] outline-none focus:bg-white focus:border-[#071E10] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-[#F8FAF6] p-1 rounded-xl border border-[#E2E8F0]">
                    <button
                      onClick={() => setAudienceFilter('all')}
                      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                        audienceFilter === 'all' ? 'bg-[#071E10] text-[#B5F438] shadow-xs' : 'text-[#64748B] hover:text-[#071E10]'
                      }`}
                    >
                      All ({allAudience.length})
                    </button>
                    <button
                      onClick={() => setAudienceFilter('athletes')}
                      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                        audienceFilter === 'athletes' ? 'bg-[#071E10] text-[#B5F438] shadow-xs' : 'text-[#64748B] hover:text-[#071E10]'
                      }`}
                    >
                      Athletes ({athletesAudienceCount})
                    </button>
                    <button
                      onClick={() => setAudienceFilter('newsletter')}
                      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                        audienceFilter === 'newsletter' ? 'bg-[#071E10] text-[#B5F438] shadow-xs' : 'text-[#64748B] hover:text-[#071E10]'
                      }`}
                    >
                      Subscribers ({newsletterAudienceCount})
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0]">
                <table className="w-full text-left text-sm font-sans divide-y divide-[#E2E8F0]">
                  <thead className="bg-[#F8FAF6] text-[#475569] uppercase font-bold text-xs tracking-wider border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-4">Recipient Identity</th>
                      <th className="p-4">Verified Email</th>
                      <th className="p-4">Salutation In Email</th>
                      <th className="p-4">Registry Source</th>
                      <th className="p-4">Discipline / Faculty</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {allAudience
                      .filter((member) => {
                        if (audienceFilter === 'athletes' && member.source !== 'Athlete Registration') return false;
                        if (audienceFilter === 'newsletter' && member.source !== 'Newsletter Opt-in') return false;
                        if (audienceSearch) {
                          const q = audienceSearch.toLowerCase();
                          const matchName = member.name?.toLowerCase().includes(q);
                          const matchEmail = member.email.toLowerCase().includes(q);
                          const matchMatric = member.matricNumber?.toLowerCase().includes(q);
                          return Boolean(matchName || matchEmail || matchMatric);
                        }
                        return true;
                      })
                      .map((member) => {
                        const isAthlete = member.source === 'Athlete Registration';
                        const salutationBadge = isAthlete
                          ? `Dear ${member.name},`
                          : 'Hi,';

                        return (
                          <tr key={member.email} className="hover:bg-[#F8FAF6] transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-[#0F172A] text-sm sm:text-base">
                                {member.name || 'Public Community Subscriber'}
                              </div>
                              {member.matricNumber && (
                                <span className="text-xs text-[#64748B] block mt-0.5">{member.matricNumber}</span>
                              )}
                            </td>
                            <td className="p-4 text-sm font-medium text-[#071E10]">
                              {member.email}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                isAthlete
                                  ? 'bg-[#EBFCD0] text-[#15803D] border border-[#B5F438]/40'
                                  : 'bg-sky-50 text-sky-800 border border-sky-200'
                              }`}>
                                {salutationBadge}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                                isAthlete
                                  ? 'bg-[#071E10] text-[#B5F438]'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {member.source}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-[#64748B]">
                              {member.sport ? `${member.sport} (${member.faculty || ''})` : 'General Public Subscriber'}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenSingleRecipientPreview(member)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#071E10] transition-colors cursor-pointer"
                                  title={`Preview email addressed to ${member.name || member.email}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {!isAthlete && (
                                  <button
                                    type="button"
                                    onClick={() => deleteSubscriber(member.email)}
                                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Unsubscribe from newsletter"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Broadcast History & Dispatch Audit Log */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-5">
                <div className="flex items-center gap-2.5">
                  <History className="w-5 h-5 text-[#071E10]" />
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B1220]">
                    Broadcast Dispatch Ledger
                  </h3>
                </div>
                <span className="text-sm font-medium text-[#64748B]">
                  {broadcastHistory.length} Transmissions Archived
                </span>
              </div>

              {broadcastHistory.length === 0 ? (
                <div className="p-8 sm:p-10 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] text-center space-y-1.5">
                  <p className="text-sm font-bold text-[#475569]">
                    No broadcast transmissions recorded yet.
                  </p>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">
                    New announcements dispatched via the composer above will be permanently archived in this ledger with delivery references.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {broadcastHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-[#F8FAF6] border border-[#E2E8F0] hover:border-[#071E10] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-sans"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-md bg-[#071E10] text-[#B5F438] text-xs font-bold uppercase">
                            {item.category}
                          </span>
                          <strong className="text-base sm:text-lg font-heading font-extrabold text-[#0B1220]">
                            {item.headline}
                          </strong>
                        </div>
                        <p className="text-sm text-[#64748B]">
                          Subject: {item.subject} &bull; Reference: {item.trackingId}
                        </p>
                        <span className="text-xs sm:text-sm text-[#94A3B8] block">
                          Dispatched on {new Date(item.dispatchedAt).toLocaleString('en-NG')} &bull; Reach: {item.totalRecipients} inboxes ({item.athleteRecipients} Athletes, {item.newsletterRecipients} Newsletter Opt-ins)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const sample = { email: 'sample@oauife.edu.ng', name: 'Boluwatife Adeleke' };
                          const emailData = generateNewsletterBroadcastEmail(sample, {
                            subject: item.subject,
                            headline: item.headline,
                            category: item.category as any,
                            content: item.content,
                          });
                          setPreviewEmailData(emailData);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white border border-[#CBD5E1] hover:bg-[#071E10] hover:text-[#B5F438] text-[#071E10] text-sm font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-2 shadow-2xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Communiqué</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </section>

      {/* =========================================================================
          MATCH OPERATIONS COMMAND CENTER MODAL (EVENTS, STATS & STARTING XIs)
      ========================================================================= */}
      {selectedMatchForManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-[#071E10] border border-white/20 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white space-y-6 relative shadow-2xl max-h-[92vh] overflow-y-auto my-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMatchForManager(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Match Title */}
            <div className="space-y-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#B5F438] text-[#071E10] font-mono font-bold text-xs uppercase">
                  {selectedMatchForManager.sport} BROADCAST DESK
                </span>
                <span className="text-xs font-mono text-white/60">• {selectedMatchForManager.competition}</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                {selectedMatchForManager.homeTeam.name} vs {selectedMatchForManager.awayTeam.name}
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono text-[#B5F438]">
                <span>Score: <strong>{selectedMatchForManager.homeTeam.score} - {selectedMatchForManager.awayTeam.score}</strong></span>
                <span>Status: <strong>{selectedMatchForManager.status} ({selectedMatchForManager.minute || 0}')</strong></span>
                <span>Venue: <strong>{selectedMatchForManager.venue}</strong></span>
              </div>
            </div>

            {/* Sub-Tabs: Events, Live Stats, Starting XIs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0B2A18] border border-white/10">
              <button
                onClick={() => setManagerTab('events')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  managerTab === 'events'
                    ? 'bg-[#B5F438] text-[#071E10] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Cards, Goals & Subs</span>
              </button>

              <button
                onClick={() => setManagerTab('stats')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  managerTab === 'stats'
                    ? 'bg-[#B5F438] text-[#071E10] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Live Match Stats</span>
              </button>

              <button
                onClick={() => setManagerTab('lineups')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  managerTab === 'lineups'
                    ? 'bg-[#B5F438] text-[#071E10] shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Starting XIs & Lineups</span>
              </button>
            </div>

            {/* TAB CONTENT 1: LIVE EVENTS (YELLOW/RED CARDS, GOALS, SUBS) */}
            {managerTab === 'events' && (
              <div className="space-y-6">
                
                {/* Quick Event Selector Buttons */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-white/60 block">1. Select Event Type to Log:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'yellow_card', label: 'Yellow Card', color: 'bg-amber-400 text-amber-950 hover:bg-amber-300' },
                      { id: 'red_card', label: 'Red Card', color: 'bg-rose-600 text-white hover:bg-rose-500' },
                      { id: 'goal', label: 'Goal Event', color: 'bg-emerald-500 text-white hover:bg-emerald-400' },
                      { id: 'sub', label: 'Substitution', color: 'bg-blue-600 text-white hover:bg-blue-500' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setEventFormData({ ...eventFormData, type: btn.id as any })}
                        className={`p-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          eventFormData.type === btn.id
                            ? `${btn.color} ring-2 ring-white`
                            : 'bg-[#0B2A18] text-white/80 border border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form to submit selected event */}
                <form onSubmit={handleAddEventSubmit} className="p-5 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/60 block mb-1">Target Team</label>
                      <select
                        value={eventFormData.team}
                        onChange={(e) => setEventFormData({ ...eventFormData, team: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white outline-none"
                      >
                        <option value="home">{selectedMatchForManager.homeTeam.name} (Home)</option>
                        <option value="away">{selectedMatchForManager.awayTeam.name} (Away)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/60 block mb-1">Match Minute</label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        required
                        value={eventFormData.minute}
                        onChange={(e) => setEventFormData({ ...eventFormData, minute: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white outline-none"
                      />
                    </div>
                  </div>

                  {eventFormData.type === 'sub' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-rose-400 block mb-1">Player Substituted Out (Leaving)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. S. Balogun"
                          value={eventFormData.player}
                          onChange={(e) => setEventFormData({ ...eventFormData, player: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-emerald-400 block mb-1">Player Substituted In (Entering)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. P. Eke"
                          value={eventFormData.subIn || ''}
                          onChange={(e) => setEventFormData({ ...eventFormData, subIn: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 block mb-1">
                          {eventFormData.type === 'goal' ? 'Scorer Name' : 'Player Penalized'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Player Name"
                          value={eventFormData.player}
                          onChange={(e) => setEventFormData({ ...eventFormData, player: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 block mb-1">
                          {eventFormData.type === 'goal' ? 'Assist / Detail (Optional)' : 'Foul / Incident Reason'}
                        </label>
                        <input
                          type="text"
                          placeholder={eventFormData.type === 'goal' ? 'e.g. Penalty, Assist by Ojo' : 'e.g. Tactical foul, Dissent'}
                          value={eventFormData.detail}
                          onChange={(e) => setEventFormData({ ...eventFormData, detail: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Dispatch & Publish Event</span>
                  </button>
                </form>

                {/* Logged Events Timeline */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-white/60 block">Logged Timeline Events ({selectedMatchForManager.events?.length || 0}):</span>
                  {selectedMatchForManager.events && selectedMatchForManager.events.length > 0 ? (
                    <div className="space-y-2">
                      {selectedMatchForManager.events.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-3 rounded-xl bg-[#0B2A18] border border-white/10 flex items-center justify-between text-xs font-mono"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              ev.type === 'yellow_card'
                                ? 'bg-amber-400 text-amber-950'
                                : ev.type === 'red_card'
                                ? 'bg-rose-600 text-white'
                                : ev.type === 'goal'
                                ? 'bg-[#B5F438] text-[#071E10]'
                                : 'bg-blue-500 text-white'
                            }`}>
                              {ev.minute}'
                            </span>
                            <div>
                              <strong className="text-white block">{ev.player}</strong>
                              <span className="text-white/60 text-[10px]">
                                {ev.team === 'home' ? selectedMatchForManager.homeTeam.shortName : selectedMatchForManager.awayTeam.shortName} • {ev.type.replace('_', ' ')} {ev.detail ? `(${ev.detail})` : ''}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              deleteMatchEvent(selectedMatchForManager.id, ev.id);
                              const updated = matches.find((m) => m.id === selectedMatchForManager.id);
                              if (updated) setSelectedMatchForManager(updated);
                              showToast('Event removed');
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                            title="Delete this event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-white/40 p-4 rounded-xl bg-[#0B2A18] text-center">
                      No match events recorded yet. Use the form above to log goals, cards, and substitutions.
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: LIVE MATCH STATS (POSSESSION, SHOTS, FOULS, CORNERS) */}
            {managerTab === 'stats' && (
              <form onSubmit={handleSaveStatsSubmit} className="space-y-6">
                
                {/* Possession Slider */}
                <div className="p-5 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-bold">Ball Possession Percentage</span>
                    <span className="text-[#B5F438] font-extrabold text-sm">
                      {selectedMatchForManager.homeTeam.shortName} {statsFormData.possessionHome}% - {100 - statsFormData.possessionHome}% {selectedMatchForManager.awayTeam.shortName}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={10}
                    max={90}
                    value={statsFormData.possessionHome}
                    onChange={(e) => setStatsFormData({ ...statsFormData, possessionHome: Number(e.target.value) })}
                    className="w-full accent-[#B5F438] cursor-pointer"
                  />

                  <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden flex">
                    <div
                      style={{ width: `${statsFormData.possessionHome}%` }}
                      className="bg-[#B5F438] transition-all"
                    />
                    <div
                      style={{ width: `${100 - statsFormData.possessionHome}%` }}
                      className="bg-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Steppers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  
                  {/* Shots on Target */}
                  <div className="p-4 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-3">
                    <span className="font-bold text-white block">Shots on Target</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, shotsOnTargetHome: Math.max(0, statsFormData.shotsOnTargetHome - 1) })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-[#B5F438]">{statsFormData.shotsOnTargetHome}</span>
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, shotsOnTargetHome: statsFormData.shotsOnTargetHome + 1 })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white/40">vs</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, shotsOnTargetAway: Math.max(0, statsFormData.shotsOnTargetAway - 1) })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-blue-400">{statsFormData.shotsOnTargetAway}</span>
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, shotsOnTargetAway: statsFormData.shotsOnTargetAway + 1 })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Shots off Target */}
                  <div className="p-4 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-3">
                    <span className="font-bold text-white block">Shots off Target</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, shotsOffTargetHome: Math.max(0, statsFormData.shotsOffTargetHome - 1) })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-[#B5F438]">{statsFormData.shotsOffTargetHome}</span>
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, shotsOffTargetHome: statsFormData.shotsOffTargetHome + 1 })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white/40">vs</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, shotsOffTargetAway: Math.max(0, statsFormData.shotsOffTargetAway - 1) })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-blue-400">{statsFormData.shotsOffTargetAway}</span>
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, shotsOffTargetAway: statsFormData.shotsOffTargetAway + 1 })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Fouls Committed */}
                  <div className="p-4 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-3">
                    <span className="font-bold text-white block">Fouls Committed</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, foulsHome: Math.max(0, statsFormData.foulsHome - 1) })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-[#B5F438]">{statsFormData.foulsHome}</span>
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, foulsHome: statsFormData.foulsHome + 1 })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white/40">vs</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, foulsAway: Math.max(0, statsFormData.foulsAway - 1) })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-blue-400">{statsFormData.foulsAway}</span>
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, foulsAway: statsFormData.foulsAway + 1 })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Corner Kicks */}
                  <div className="p-4 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-3">
                    <span className="font-bold text-white block">Corner Kicks</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, cornersHome: Math.max(0, statsFormData.cornersHome - 1) })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-[#B5F438]">{statsFormData.cornersHome}</span>
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, cornersHome: statsFormData.cornersHome + 1 })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white/40">vs</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, cornersAway: Math.max(0, statsFormData.cornersAway - 1) })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-blue-400">{statsFormData.cornersAway}</span>
                        <button
                          type="button"
                          onClick={() => setStatsFormData({ ...statsFormData, cornersAway: statsFormData.cornersAway + 1 })}
                          className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Save & Publish Match Statistics</span>
                </button>
              </form>
            )}

            {/* TAB CONTENT 3: STARTING XIs & LINEUPS */}
            {managerTab === 'lineups' && (
              <div className="space-y-6">
                
                {/* Team Switcher & Prepopulate button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLineupTeamTab('home')}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        lineupTeamTab === 'home'
                          ? 'bg-[#B5F438] text-[#071E10]'
                          : 'bg-[#0B2A18] text-white/70 hover:text-white'
                      }`}
                    >
                      {selectedMatchForManager.homeTeam.name} (Home)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLineupTeamTab('away')}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        lineupTeamTab === 'away'
                          ? 'bg-[#B5F438] text-[#071E10]'
                          : 'bg-[#0B2A18] text-white/70 hover:text-white'
                      }`}
                    >
                      {selectedMatchForManager.awayTeam.name} (Away)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleLoadStandardSquad}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#B5F438] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Standard 4-3-3 Lineups</span>
                  </button>
                </div>

                {/* Add Player Form */}
                <form onSubmit={handleAddPlayerToLineup} className="p-4 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-3 font-mono text-xs">
                  <span className="text-[#B5F438] font-bold block">
                    + Add Player to {lineupTeamTab === 'home' ? selectedMatchForManager.homeTeam.shortName : selectedMatchForManager.awayTeam.shortName}
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div>
                      <label className="text-white/60 block mb-1">Jersey #</label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        required
                        value={newLineupPlayer.number}
                        onChange={(e) => setNewLineupPlayer({ ...newLineupPlayer, number: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white outline-none"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-white/60 block mb-1">Player Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Player Name"
                        value={newLineupPlayer.name}
                        onChange={(e) => setNewLineupPlayer({ ...newLineupPlayer, name: e.target.value })}
                        className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-white/60 block mb-1">Position</label>
                      <select
                        value={newLineupPlayer.position}
                        onChange={(e) => setNewLineupPlayer({ ...newLineupPlayer, position: e.target.value })}
                        className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white outline-none"
                      >
                        <option value="GK">Goalkeeper (GK)</option>
                        <option value="DEF">Defender (DEF)</option>
                        <option value="MID">Midfielder (MID)</option>
                        <option value="FWD">Forward (FWD)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/60 block mb-1">Squad Role</label>
                      <select
                        value={newLineupPlayer.isStarting ? 'start' : 'sub'}
                        onChange={(e) => setNewLineupPlayer({ ...newLineupPlayer, isStarting: e.target.value === 'start' })}
                        className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white outline-none"
                      >
                        <option value="start">Starting XI</option>
                        <option value="sub">Substitutes Bench</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-white/80">
                      <input
                        type="checkbox"
                        checked={newLineupPlayer.isCaptain}
                        onChange={(e) => setNewLineupPlayer({ ...newLineupPlayer, isCaptain: e.target.checked })}
                        className="accent-[#B5F438]"
                      />
                      <span>Team Captain (C)</span>
                    </label>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#B5F438] text-[#071E10] font-heading font-extrabold cursor-pointer hover:bg-[#C5FA54]"
                    >
                      + Add Player to Roster
                    </button>
                  </div>
                </form>

                {/* Starting XI List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B5F438]">
                      Starting XI ({lineupTeamTab === 'home' ? selectedMatchForManager.lineups?.homeStartingXI?.length || 0 : selectedMatchForManager.lineups?.awayStartingXI?.length || 0} / 11)
                    </span>
                    <span className="text-[11px] font-mono text-white/50">Formation: 4-3-3</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(lineupTeamTab === 'home'
                      ? selectedMatchForManager.lineups?.homeStartingXI || []
                      : selectedMatchForManager.lineups?.awayStartingXI || []
                    ).map((player) => (
                      <div
                        key={player.number}
                        className="p-2.5 rounded-xl bg-[#0B2A18] border border-white/10 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-[#B5F438] text-[#071E10] font-bold flex items-center justify-center text-[11px]">
                            {player.number}
                          </span>
                          <div>
                            <strong className="text-white block">
                              {player.name} {player.isCaptain ? '(C)' : ''}
                            </strong>
                            <span className="text-[10px] text-white/50">{player.position}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePlayerFromLineup(player.number, lineupTeamTab === 'home' ? 'homeStart' : 'awayStart')}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes Bench List */}
                <div className="space-y-3 pt-2">
                  <span className="font-mono text-xs font-bold text-white/80 block">
                    Substitutes Bench ({lineupTeamTab === 'home' ? selectedMatchForManager.lineups?.homeSubs?.length || 0 : selectedMatchForManager.lineups?.awaySubs?.length || 0})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(lineupTeamTab === 'home'
                      ? selectedMatchForManager.lineups?.homeSubs || []
                      : selectedMatchForManager.lineups?.awaySubs || []
                    ).map((player) => (
                      <div
                        key={player.number}
                        className="p-2.5 rounded-xl bg-[#0B2A18] border border-white/10 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-white/20 text-white font-bold flex items-center justify-center text-[11px]">
                            {player.number}
                          </span>
                          <div>
                            <strong className="text-white block">{player.name}</strong>
                            <span className="text-[10px] text-white/50">{player.position}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePlayerFromLineup(player.number, lineupTeamTab === 'home' ? 'homeSub' : 'awaySub')}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE NEW MATCH FIXTURE */}
      {showAddMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#071E10] border border-white/20 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddMatchModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#B5F438] uppercase">FIXTURES DESK</span>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                Schedule New Tournament Match
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Create a verified match fixture for the official campus LiveScore schedule.
              </p>
            </div>

            <form onSubmit={handleCreateMatchSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Sport Discipline</label>
                  <select
                    value={newMatchFormData.sport}
                    onChange={(e) => setNewMatchFormData({ ...newMatchFormData, sport: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                  >
                    {SPORTS_LIST.map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#94A3B8] block mb-1">Match Stage</label>
                  <input
                    type="text"
                    value={newMatchFormData.stage}
                    onChange={(e) => setNewMatchFormData({ ...newMatchFormData, stage: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Competition / Tournament</label>
                <input
                  type="text"
                  required
                  value={newMatchFormData.competition}
                  onChange={(e) => setNewMatchFormData({ ...newMatchFormData, competition: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                />
              </div>

              {/* Home Team */}
              <div className="p-3.5 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-3">
                <span className="font-bold text-[#B5F438] block">Home Team Configuration</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[#94A3B8] block mb-1">Team Name</label>
                    <input
                      type="text"
                      required
                      value={newMatchFormData.homeTeamName}
                      onChange={(e) => setNewMatchFormData({ ...newMatchFormData, homeTeamName: e.target.value })}
                      className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] block mb-1">Short (e.g. TECH)</label>
                    <input
                      type="text"
                      required
                      value={newMatchFormData.homeTeamShort}
                      onChange={(e) => setNewMatchFormData({ ...newMatchFormData, homeTeamShort: e.target.value })}
                      className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Away Team */}
              <div className="p-3.5 rounded-2xl bg-[#0B2A18] border border-white/10 space-y-3">
                <span className="font-bold text-[#B5F438] block">Away Team Configuration</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[#94A3B8] block mb-1">Team Name</label>
                    <input
                      type="text"
                      required
                      value={newMatchFormData.awayTeamName}
                      onChange={(e) => setNewMatchFormData({ ...newMatchFormData, awayTeamName: e.target.value })}
                      className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] block mb-1">Short (e.g. ADMIN)</label>
                    <input
                      type="text"
                      required
                      value={newMatchFormData.awayTeamShort}
                      onChange={(e) => setNewMatchFormData({ ...newMatchFormData, awayTeamShort: e.target.value })}
                      className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Date, Time, Venue */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newMatchFormData.date}
                    onChange={(e) => setNewMatchFormData({ ...newMatchFormData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Kickoff Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 16:30"
                    value={newMatchFormData.time}
                    onChange={(e) => setNewMatchFormData({ ...newMatchFormData, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={newMatchFormData.venue}
                  onChange={(e) => setNewMatchFormData({ ...newMatchFormData, venue: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMatchModal(false)}
                  className="px-4 py-2.5 rounded-xl text-white/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B5F438] text-[#071E10] font-heading font-extrabold cursor-pointer hover:bg-[#C5FA54]"
                >
                  Publish Fixture to LiveScore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD SITE MEDIA ASSET */}
      {showAddImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#071E10] border border-white/20 rounded-3xl max-w-md w-full p-6 text-white space-y-5 relative shadow-2xl">
            <button
              onClick={() => setShowAddImageModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#B5F438] uppercase">MEDIA UPLOADER</span>
              <h3 className="font-heading font-extrabold text-xl text-white">
                Upload New Image Asset
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Add photos for tournament match coverage, facility directories, and banners.
              </p>
            </div>

            <form onSubmit={handleAddImageSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#94A3B8] block mb-1">Image Title</label>
                <input
                  type="text"
                  required
                  value={newImageFormData.title}
                  onChange={(e) => setNewImageFormData({ ...newImageFormData, title: e.target.value })}
                  placeholder="e.g. Inter-Faculty Finals Trophy Lift"
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Category</label>
                <select
                  value={newImageFormData.category}
                  onChange={(e) => setNewImageFormData({ ...newImageFormData, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                >
                  <option value="Matchday Action">Matchday Action</option>
                  <option value="Campus Facilities">Campus Facilities</option>
                  <option value="Athlete Profiles">Athlete Profiles</option>
                  <option value="Hero & Banners">Hero & Banners</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={newImageFormData.imageUrl}
                  onChange={(e) => setNewImageFormData({ ...newImageFormData, imageUrl: e.target.value })}
                  placeholder="e.g. /sports_stadium_bg.jpg or HTTPS URL"
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                />
                <div className="flex gap-2 pt-1 text-[10px] text-[#B5F438]">
                  <span>Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setNewImageFormData({ ...newImageFormData, imageUrl: '/sports_stadium_bg.jpg' })}
                    className="hover:underline"
                  >
                    Stadium
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setNewImageFormData({ ...newImageFormData, imageUrl: '/player_action.jpg' })}
                    className="hover:underline"
                  >
                    Football
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setNewImageFormData({ ...newImageFormData, imageUrl: '/player_kicking.jpg' })}
                    className="hover:underline"
                  >
                    Action
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newImageFormData.description}
                  onChange={(e) => setNewImageFormData({ ...newImageFormData, description: e.target.value })}
                  placeholder="Brief photo credit or tournament caption..."
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddImageModal(false)}
                  className="px-4 py-2.5 rounded-xl text-white/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B5F438] text-[#071E10] font-heading font-extrabold cursor-pointer hover:bg-[#C5FA54]"
                >
                  Save Image Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PUBLISH ANNOUNCEMENT */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#071E10] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white space-y-5 relative shadow-2xl">
            <button
              onClick={() => setShowAddNewsModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#B5F438] uppercase">CAMPUS BULLETIN DESK</span>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                Publish Campus Announcement
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Broadcast official sports news to all students and faculty sports directors.
              </p>
            </div>

            <form onSubmit={handleAddNewsSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#94A3B8] block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newNewsFormData.title}
                  onChange={(e) => setNewNewsFormData({ ...newNewsFormData, title: e.target.value })}
                  placeholder="e.g. Schedule for 2026 Inter-Faculty Dean’s Cup Released"
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Category</label>
                  <select
                    value={newNewsFormData.category}
                    onChange={(e) => setNewNewsFormData({ ...newNewsFormData, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                  >
                    <option value="Tournament">Tournament</option>
                    <option value="Trials">Trials</option>
                    <option value="Office Update">Office Update</option>
                    <option value="Facilities">Facilities</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#94A3B8] block mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={newNewsFormData.authorName}
                    onChange={(e) => setNewNewsFormData({ ...newNewsFormData, authorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Brief Excerpt</label>
                <input
                  type="text"
                  value={newNewsFormData.excerpt}
                  onChange={(e) => setNewNewsFormData({ ...newNewsFormData, excerpt: e.target.value })}
                  placeholder="One sentence summary..."
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Official Bulletin Content</label>
                <textarea
                  rows={4}
                  required
                  value={newNewsFormData.content}
                  onChange={(e) => setNewNewsFormData({ ...newNewsFormData, content: e.target.value })}
                  placeholder="Enter full communiqué body..."
                  className="w-full p-2.5 rounded-xl bg-[#0B2A18] border border-white/20 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-4 py-2.5 rounded-xl text-white/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B5F438] text-[#071E10] font-heading font-extrabold cursor-pointer hover:bg-[#C5FA54]"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL (DIRECTOR ONLY) */}
      {cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#071E10] border border-rose-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                if (!isDeleting) {
                  setCardToDelete(null);
                  setDeleteReason('');
                }
              }}
              disabled={isDeleting}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-500 text-rose-300 text-xs font-mono font-bold uppercase">
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>DIRECTOR ACTION &bull; PERMANENT DELETION</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                Delete Athlete Account & Vacate ID?
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                This action will permanently delete this student-athlete's accreditation profile from the database. The ID number (<strong className="font-mono text-[#B5F438]">{cardToDelete.cardNumber}</strong>) will become vacant, and an official Deletion Notice email will be dispatched to <strong className="text-white">{cardToDelete.email}</strong>.
              </p>
            </div>

            {/* Target Card Summary */}
            <div className="p-4 rounded-2xl bg-[#0B2A18] border border-white/15 text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Card ID:</span>
                <strong className="text-[#B5F438]">{cardToDelete.cardNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Student Athlete:</span>
                <strong className="text-white">{cardToDelete.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Matriculation:</span>
                <strong className="text-white">{cardToDelete.matricNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Faculty & Sport:</span>
                <strong className="text-white">{cardToDelete.faculty} &bull; {cardToDelete.sport}</strong>
              </div>
            </div>

            {/* Reason input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-white/90 block">
                Administrative Reason for Deletion (Sent in Notification Email)
              </label>
              <textarea
                rows={2}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g. Ineligible student-athlete / Graduated student / Duplicate entry / Requested data purge"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white text-xs outline-none focus:border-rose-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setCardToDelete(null);
                  setDeleteReason('');
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Purging & Dispatching Notice...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirm &amp; Delete Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND ACCOUNT CONFIRMATION MODAL */}
      {cardToSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#071E10] border border-amber-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                if (!isSuspending) {
                  setCardToSuspend(null);
                  setSuspensionReason('');
                }
              }}
              disabled={isSuspending}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-500 text-amber-300 text-xs font-mono font-bold uppercase">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>EXECUTIVE ACTION &bull; PASS SUSPENSION</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                Suspend Athlete Sports Accreditation?
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                The athlete's barcode scanner pass will be flagged as <strong className="text-amber-400">SUSPENDED / INELIGIBLE</strong> at matchday gates, barring match participation until cleared. An official Suspension Notice email will be dispatched to <strong className="text-white">{cardToSuspend.email}</strong>.
              </p>
            </div>

            {/* Target Card Summary */}
            <div className="p-4 rounded-2xl bg-[#0B2A18] border border-white/15 text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Card ID:</span>
                <strong className="text-[#B5F438]">{cardToSuspend.cardNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Student Athlete:</span>
                <strong className="text-white">{cardToSuspend.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Matriculation:</span>
                <strong className="text-white">{cardToSuspend.matricNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Faculty &amp; Sport:</span>
                <strong className="text-white">{cardToSuspend.faculty} &bull; {cardToSuspend.sport}</strong>
              </div>
            </div>

            {/* Reason input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-white/90 block">
                Reason for Suspension (Sent in Notification Email)
              </label>
              <textarea
                rows={2}
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="e.g. Pending cardiovascular medical clearance / Disciplinary inquiry / Officiating dispute"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isSuspending}
                onClick={() => {
                  setCardToSuspend(null);
                  setSuspensionReason('');
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSuspending}
                onClick={handleConfirmSuspend}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#071E10] font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSuspending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Suspending & Dispatching Notice...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Confirm &amp; Suspend Pass</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEWSLETTER & OFFICIAL BULLETIN PREVIEW MODAL */}
      {previewEmailData && (
        <EmailNotificationModal
          customEmailData={previewEmailData}
          title="Official Newsletter Broadcast Preview"
          onClose={() => setPreviewEmailData(null)}
        />
      )}

    </div>
  );
};
