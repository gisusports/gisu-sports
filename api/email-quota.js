// Vercel Serverless Function: Live Email Quota & Brevo Account Status
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const brevoKey = process.env.BREVO_API_KEY;

    if (!brevoKey || brevoKey.includes('your_brevo')) {
      return res.status(200).json({
        success: true,
        live: false,
        brevo: { creditsRemaining: 300, creditsLimit: 300, creditsUsed: 0 },
        message: 'Brevo API key not configured',
      });
    }

    const brevoRes = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': brevoKey,
        'Accept': 'application/json',
      },
    });

    if (brevoRes.ok) {
      const accountData = await brevoRes.json();
      const freePlan = accountData.plan?.find((p) => p.creditsType === 'sendLimit' || p.type === 'free') || accountData.plan?.[0];
      const creditsRemaining = typeof freePlan?.credits === 'number' ? freePlan.credits : 300;
      const creditsLimit = 300;
      const creditsUsed = Math.max(0, creditsLimit - creditsRemaining);

      return res.status(200).json({
        success: true,
        live: true,
        brevo: {
          creditsRemaining,
          creditsLimit,
          creditsUsed,
          planType: freePlan?.type || 'free',
        },
        resend: { creditsLimit: 100, creditsRemaining: 100, creditsUsed: 0 },
        gmail: { creditsLimit: 500, creditsRemaining: 500, creditsUsed: 0 },
        totalRemaining: creditsRemaining + 100 + 500,
        totalLimit: 900,
        totalUsed: creditsUsed,
        syncedAt: new Date().toISOString(),
      });
    } else {
      const errJson = await brevoRes.json().catch(() => ({}));
      return res.status(brevoRes.status).json({
        success: false,
        live: false,
        error: errJson,
      });
    }
  } catch (err) {
    console.error('[GISU Quota API] Error fetching Brevo quota:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
}
