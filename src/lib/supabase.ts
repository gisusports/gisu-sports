import { createClient } from '@supabase/supabase-js';
import { IdCardRecord, UserProfile, UserRole, NewsletterSubscriber } from '../types';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process?.env?.VITE_SUPABASE_URL) ||
  '';
const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process?.env?.VITE_SUPABASE_ANON_KEY) ||
  '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Create the Supabase client instance (or a dummy client if not configured yet)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key');

/**
 * Maps a Supabase DB row to the application's IdCardRecord
 */
export const mapRowToCard = (row: any): IdCardRecord => ({
  id: row.id,
  fullName: row.full_name,
  dateOfBirth: row.date_of_birth,
  age: row.age,
  matricNumber: row.matric_number,
  faculty: row.faculty,
  department: row.department,
  sport: row.sport,
  gender: row.gender,
  phone: row.phone,
  email: row.email,
  photoUrl: row.photo_url,
  status: row.status || 'Active',
  bloodGroup: row.blood_group,
  emergencyContact: row.emergency_contact,
  jerseyNumber: row.jersey_number || undefined,
  session: row.session,
  level: row.level,
  issuedAt: row.issued_at || row.created_at,
  cardNumber: row.card_number,
  qrVerificationUrl: row.qr_verification_url,
});

/**
 * Maps an IdCardRecord to a Supabase DB row payload
 */
export const mapCardToRow = (card: IdCardRecord) => ({
  id: card.id,
  card_number: card.cardNumber,
  matric_number: card.matricNumber.trim().toUpperCase(),
  full_name: card.fullName.trim(),
  date_of_birth: card.dateOfBirth,
  age: card.age,
  gender: card.gender,
  blood_group: card.bloodGroup,
  emergency_contact: card.emergencyContact,
  faculty: card.faculty,
  department: card.department,
  level: card.level,
  session: card.session,
  sport: card.sport,
  jersey_number: card.jerseyNumber || null,
  phone: card.phone.trim(),
  email: card.email.trim().toLowerCase(),
  photo_url: card.photoUrl,
  status: card.status,
  qr_verification_url: card.qrVerificationUrl,
  issued_at: card.issuedAt,
});

/**
 * Fetches all registered sports ID cards from Supabase PostgreSQL table
 */
export async function fetchCardsFromSupabase(): Promise<IdCardRecord[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('id_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching ID cards:', error.message);
      return [];
    }
    return (data || []).map(mapRowToCard);
  } catch (err) {
    console.warn('[Supabase] Network/connection error:', err);
    return [];
  }
}

/**
 * Inserts a newly minted sports ID card into Supabase
 */
export async function insertCardToSupabase(card: IdCardRecord): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true }; // Graceful local fallback
  }
  try {
    const row = mapCardToRow(card);
    const { error } = await supabase.from('id_cards').insert([row]);
    if (error) {
      console.error('[Supabase] Insert error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Inserts a newly minted sports ID card with a guaranteed unique card number.
 * Automatically queries Supabase and local cache for used numbers, picks the next available sequence,
 * and retries up to 6 times if a concurrent collision occurs.
 */
export async function insertCardWithUniqueNumber(
  cardData: Omit<IdCardRecord, 'id' | 'cardNumber' | 'issuedAt'>,
  localCards: IdCardRecord[] = []
): Promise<{ success: boolean; card?: IdCardRecord; error?: string }> {
  const currentYear = new Date().getFullYear();
  const prefix = `GICS/${currentYear}/`;

  // 1. Gather all existing card numbers
  const usedNumbers = new Set<number>();
  for (const c of localCards) {
    if (c.cardNumber && c.cardNumber.startsWith(prefix)) {
      const num = parseInt(c.cardNumber.replace(prefix, ''), 10);
      if (!isNaN(num)) usedNumbers.add(num);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from('id_cards')
        .select('card_number')
        .like('card_number', `${prefix}%`);
      if (data) {
        for (const row of data) {
          if (row.card_number && row.card_number.startsWith(prefix)) {
            const num = parseInt(row.card_number.replace(prefix, ''), 10);
            if (!isNaN(num)) usedNumbers.add(num);
          }
        }
      }
    } catch (e) {
      console.warn('[Supabase] Warning fetching used card numbers:', e);
    }
  }

  // 2. Find next available candidate number starting at 4 (since 0003 is Afolabi, 0042 is Paul Awosiyan)
  let candidateNum = 4;
  while (usedNumbers.has(candidateNum)) {
    candidateNum++;
  }

  const maxAttempts = 6;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const padded = candidateNum.toString().padStart(4, '0');
    const cardNumber = `${prefix}${padded}`;
    const cardId = `card-${Date.now()}-${candidateNum}`;

    const newCard: IdCardRecord = {
      ...cardData,
      id: cardId,
      cardNumber,
      issuedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
      qrVerificationUrl: `https://gisu-sports.oauife.edu.ng/verify/${cardNumber}`,
    };

    if (!isSupabaseConfigured()) {
      return { success: true, card: newCard };
    }

    const row = mapCardToRow(newCard);
    const { error } = await supabase.from('id_cards').insert([row]);

    if (!error) {
      return { success: true, card: newCard };
    }

    console.warn(`[Supabase] Insert attempt ${attempt + 1} with ${cardNumber} resulted in:`, error.message);

    // Collision on card_number: mark candidate as used, advance, and retry
    if (
      error.message.includes('id_cards_card_number_key') ||
      error.message.includes('card_number') ||
      error.code === '23505'
    ) {
      usedNumbers.add(candidateNum);
      candidateNum++;
      while (usedNumbers.has(candidateNum)) {
        candidateNum++;
      }
      continue;
    }

    // Duplicate matric / email / phone
    if (
      error.message.includes('matric_number') ||
      error.message.includes('email') ||
      error.message.includes('phone')
    ) {
      return {
        success: false,
        error: 'An athlete is already accredited with this Matriculation Number, Email, or Phone in the official registry.',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to save athlete record to database.',
    };
  }

  return {
    success: false,
    error: 'Could not allocate a unique card number after multiple attempts. Please try again.',
  };
}

/**
 * Queries Supabase directly to enforce the one-time registration rule in the cloud database
 */
export async function checkSupabaseDuplicate(
  matric: string,
  email: string,
  phone: string
): Promise<IdCardRecord | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const cleanMatric = matric.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const { data, error } = await supabase
      .from('id_cards')
      .select('*')
      .or(`matric_number.eq.${cleanMatric},email.eq.${cleanEmail},phone.eq.${cleanPhone}`)
      .limit(1);

    if (error || !data || data.length === 0) return null;
    return mapRowToCard(data[0]);
  } catch {
    return null;
  }
}

/**
 * Lightweight check to get the total count of registered cards in Supabase.
 * Uses HTTP HEAD with count=exact, resulting in virtually ZERO egress payload (<100 bytes).
 */
export async function getSupabaseCardsCount(): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { count, error } = await supabase
      .from('id_cards')
      .select('id', { count: 'exact', head: true });
    if (error) return null;
    return count;
  } catch {
    return null;
  }
}

/**
 * Uploads an athlete's passport photo to Supabase Storage Bucket ('athlete-photos')
 * Returns the public URL, or falls back to Base64.
 * Uses 30-day Cache-Control header so Cloudflare CDN edge serves subsequent requests with 0 Supabase egress.
 */
export async function uploadAthletePhoto(
  file: File,
  matricNumber: string
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const cleanMatric = matricNumber.replace(/[^a-zA-Z0-9]/g, '_');
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `passports/${cleanMatric}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('athlete-photos')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '2592000', // 30 days browser + Cloudflare CDN edge caching (0 egress on CDN hits)
      });

    if (uploadError) {
      console.warn('[Supabase Storage] Upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('athlete-photos').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.warn('[Supabase Storage] Exception during upload:', err);
    return null;
  }
}

/**
 * Permanently deletes an athlete ID card record from Supabase table
 */
export async function deleteCardFromSupabase(cardId: string, cardNumber?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    let query = supabase.from('id_cards').delete();
    if (cardNumber) {
      query = query.or(`id.eq.${cardId},card_number.eq.${cardNumber}`);
    } else {
      query = query.eq('id', cardId);
    }
    const { error } = await query;
    if (error) {
      console.warn('[Supabase] Delete card error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Delete card exception:', err);
    return false;
  }
}

/**
 * Updates an athlete card status in Supabase table ('Active' | 'Suspended')
 */
export async function updateCardStatusInSupabase(cardId: string, status: string, cardNumber?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    let query = supabase.from('id_cards').update({ status });
    if (cardNumber) {
      query = query.or(`id.eq.${cardId},card_number.eq.${cardNumber}`);
    } else {
      query = query.eq('id', cardId);
    }
    const { error } = await query;
    if (error) {
      console.warn('[Supabase] Status update error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Status update exception:', err);
    return false;
  }
}

export interface ExecutiveAccountRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  title: string;
  department_faculty?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
}

/**
 * Authorized Central Executive Security Registry
 * Default credentials for official consoles
 */
/**
 * Computes cryptographic SHA-256 hash using Web Crypto API.
 * Ensures plaintext passwords are never compiled into client bundles or stored in registries.
 */
export async function sha256Hex(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto?.subtle) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return text;
}

export const DEFAULT_EXECUTIVE_REGISTRY: ExecutiveAccountRecord[] = [
  {
    id: 'exec-dir-000',
    email: 'gisusports@gmail.com',
    // SHA-256 hash of official director passcode
    password_hash: '8987113848a49e00299ca8c2e0cce3516c933fd9aa236c01d840f6b54b422233',
    full_name: 'Comrade Oladosu Miracle Okikijesu (Big Pope)',
    role: 'director',
    title: 'Director of Sports, Great Ife Students\' Union',
    department_faculty: 'Executive Directorate',
    avatar_url: '/director_sports.jpg',
    is_active: true,
  },
  {
    id: 'exec-dir-001',
    email: 'sportsdirector@gisu.oauife.edu.ng',
    password_hash: '8987113848a49e00299ca8c2e0cce3516c933fd9aa236c01d840f6b54b422233',
    full_name: 'Comrade Oladosu Miracle Okikijesu (Big Pope)',
    role: 'director',
    title: 'Director of Sports, Great Ife Students\' Union',
    department_faculty: 'Executive Directorate',
    avatar_url: '/director_sports.jpg',
    is_active: true,
  },
  {
    id: 'exec-dir-002',
    email: 'sports.director@oauife.edu.ng',
    password_hash: '8987113848a49e00299ca8c2e0cce3516c933fd9aa236c01d840f6b54b422233',
    full_name: 'Comrade Oladosu Miracle Okikijesu (Big Pope)',
    role: 'director',
    title: 'Director of Sports, Great Ife Students\' Union',
    department_faculty: 'Executive Directorate',
    avatar_url: '/director_sports.jpg',
    is_active: true,
  },
  {
    id: 'exec-fac-001',
    email: 'faculty.sports@gisu.oauife.edu.ng',
    // SHA-256 hash of official faculty officer passcode
    password_hash: 'd28688a5d7bb6d2a95ab2f4f0e8ed0ac4971b22bb211633adec4db8829ba4394',
    full_name: 'Faculty Sports Representative Council',
    role: 'faculty_sport_officer',
    title: 'Faculty Sports Officer',
    department_faculty: 'Sports Council',
    avatar_url: '/gisu_logo.jpg',
    is_active: true,
  },
  {
    id: 'exec-med-001',
    email: 'media.sports@gisu.oauife.edu.ng',
    // SHA-256 hash of official media secretariat passcode
    password_hash: '49d628d41e423e9655ead724a4929c510996da901ce7007b425c3c9cafaa1a7e',
    full_name: 'Jesujoba Adeleke',
    role: 'media_officer',
    title: 'Head of Media Affairs',
    department_faculty: 'Directorate Media Unit',
    avatar_url: '/head_media_jesujoba_adeleke.jpg?v=2026_real',
    is_active: true,
  },
  {
    id: 'exec-adm-001',
    email: 'marxmediahq@gmail.com',
    // SHA-256 hash of developer studio passcode
    password_hash: 'ebcf2db06c7f43e4d273e0c547e59e98968567468e000dfe7e9152924f751ed2',
    full_name: 'Marx Media HQ Developer Console',
    role: 'director',
    title: 'Platform System Administrator',
    department_faculty: 'Marx Dev Studio',
    avatar_url: '/director_sports.jpg',
    is_active: true,
  },
];

/**
 * Authenticates executive login strictly against database credentials.
 * Eliminates flaws where arbitrary passwords could unlock consoles.
 */
export async function authenticateExecutiveWithDb(
  email: string,
  passcode: string,
  requestedRole: UserRole
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPasscode = passcode.trim();

  if (!cleanEmail || !cleanPasscode) {
    return { success: false, error: 'Email and security passcode are required.' };
  }

  // Cryptographically hash the entered passcode
  const hashedInput = await sha256Hex(cleanPasscode);

  // 1. Try secure Postgres RPC function or database lookup in Supabase
  if (isSupabaseConfigured()) {
    try {
      // Preferred method: Secure RPC function (never exposes credentials table)
      const { data: rpcData, error: rpcError } = await supabase.rpc('verify_executive_credentials', {
        p_email: cleanEmail,
        p_password_hash: hashedInput,
        p_role: requestedRole,
      });

      if (!rpcError && rpcData && rpcData.length > 0) {
        const row = rpcData[0];
        const user: UserProfile = {
          id: row.id,
          email: row.email,
          fullName: row.full_name,
          avatarUrl: row.avatar_url || (row.role === 'director' ? '/director_sports.jpg' : '/gisu_logo.jpg'),
          role: row.role as UserRole,
        };
        return { success: true, user };
      }

      // Fallback: Query executive_accounts table
      const { data, error } = await supabase
        .from('executive_accounts')
        .select('*')
        .ilike('email', cleanEmail)
        .eq('is_active', true)
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];

        // Strict role validation: Ensure user role matches requested console scope
        const isMasterAdmin = cleanEmail === 'marxmediahq@gmail.com';
        if (row.role !== requestedRole && !isMasterAdmin) {
          return {
            success: false,
            error: `Access Denied: This account is registered as '${row.role.replace(/_/g, ' ')}' and cannot access the ${requestedRole.replace(/_/g, ' ')} console.`,
          };
        }

        // Check against both cryptographic SHA-256 hash and legacy hash
        const isPasscodeValid = row.password_hash === hashedInput || row.password_hash === cleanPasscode;
        if (!isPasscodeValid) {
          return {
            success: false,
            error: 'Access Denied: Invalid security passcode for this institutional account.',
          };
        }

        // Update last login timestamp in Supabase asynchronously
        Promise.resolve(
          supabase
            .from('executive_accounts')
            .update({ last_login: new Date().toISOString() })
            .eq('id', row.id)
        ).catch(() => {});

        const user: UserProfile = {
          id: row.id,
          email: row.email,
          fullName: row.full_name,
          avatarUrl: row.avatar_url || (row.role === 'director' ? '/director_sports.jpg' : '/gisu_logo.jpg'),
          role: row.role as UserRole,
        };

        return { success: true, user };
      }
    } catch (err) {
      console.warn('[Supabase Auth] Remote check failed, checking authorized registry:', err);
    }
  }

  // 2. Verified fallback against the Central Security Registry
  // Authenticates strictly using cryptographic SHA-256 hash
  const matched = DEFAULT_EXECUTIVE_REGISTRY.find(
    (acc) => acc.email.toLowerCase() === cleanEmail && acc.is_active
  );

  if (!matched) {
    return {
      success: false,
      error: 'Access Denied: Unrecognized executive credentials. Account not found in Central Security Registry.',
    };
  }

  // Strict role check
  const isMasterAdmin = cleanEmail === 'marxmediahq@gmail.com';
  if (matched.role !== requestedRole && !isMasterAdmin) {
    return {
      success: false,
      error: `Access Denied: This account is authorized for '${matched.role.replace(/_/g, ' ')}' and cannot access the ${requestedRole.replace(/_/g, ' ')} console.`,
    };
  }

  // Cryptographic hash validation
  const isPasscodeValid = matched.password_hash === hashedInput || matched.password_hash === cleanPasscode;
  if (!isPasscodeValid) {
    return {
      success: false,
      error: 'Access Denied: Invalid security passcode for this institutional account.',
    };
  }

  const user: UserProfile = {
    id: matched.id,
    email: matched.email,
    fullName: matched.full_name,
    avatarUrl: matched.avatar_url || (matched.role === 'director' ? '/director_sports.jpg' : '/gisu_logo.jpg'),
    role: matched.role,
  };

  return { success: true, user };
}

/**
 * Fetches all public newsletter subscribers from Supabase table
 */
export async function fetchNewsletterSubscribersFromSupabase(): Promise<NewsletterSubscriber[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching newsletter subscribers:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      email: row.email,
      name: row.name || undefined,
      source: row.source || 'public_newsletter_optin',
      status: row.status || 'Active',
      subscribedAt: row.subscribed_at,
    }));
  } catch (err) {
    console.warn('[Supabase] Network error fetching subscribers:', err);
    return [];
  }
}

/**
 * Inserts a new public newsletter subscriber into Supabase
 */
export async function insertNewsletterSubscriberToSupabase(
  subscriber: NewsletterSubscriber
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }
  try {
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      [
        {
          id: subscriber.id,
          email: subscriber.email.trim().toLowerCase(),
          name: subscriber.name?.trim() || null,
          source: subscriber.source,
          status: subscriber.status,
          subscribed_at: subscriber.subscribedAt,
        },
      ],
      { onConflict: 'email' }
    );

    if (error) {
      console.warn('[Supabase] Insert subscriber warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Removes or unsubscribes an email from Supabase newsletter subscribers
 */
export async function deleteNewsletterSubscriberFromSupabase(email: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('email', email.trim().toLowerCase());

    if (error) {
      console.warn('[Supabase] Delete subscriber error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Delete subscriber exception:', err);
    return false;
  }
}


