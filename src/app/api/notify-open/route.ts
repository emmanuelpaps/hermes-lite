import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BOT_TOKEN = '8539545294:AAHw5rsj7Z0Dg9dA6YiXaXU23uf_LnIYZUY';
const DEFAULT_CHAT_ID = '1813977310';

// Excluded Admin IPs (Agency / Creator connections)
const EXCLUDED_IPS = [
  '187.188.65.131', // Emmanuel Padilla Office / Studio IP (Ciudad Juárez)
  '127.0.0.1',
  '::1',
  ...(process.env.EXCLUDED_IPS ? process.env.EXCLUDED_IPS.split(',').map(s => s.trim()) : [])
];

function safeDecode(val: string): string {
  if (!val) return '';
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      clientName = 'Cliente',
      clientSlug = '',
      url = '',
      referrer = '',
      screenResolution = '',
    } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

    // Extract headers
    const userAgent = req.headers.get('user-agent') || 'Desconocido';
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'IP no disponible';
    
    // Check if the request comes from an excluded admin IP
    if (EXCLUDED_IPS.includes(clientIp)) {
      return NextResponse.json({ success: true, bypassed: true, reason: 'excluded_admin_ip' });
    }

    // Vercel Geolocation headers with clean UTF-8 decoding
    const rawCity = req.headers.get('x-vercel-ip-city') || '';
    const rawRegion = req.headers.get('x-vercel-ip-country-region') || '';
    const rawCountry = req.headers.get('x-vercel-ip-country') || '';

    const city = safeDecode(rawCity);
    const region = safeDecode(rawRegion);
    const country = safeDecode(rawCountry);
    const location = [city, region, country].filter(Boolean).join(', ') || 'Ubicación no disponible';

    // Device parser
    let deviceType = '💻 Desktop';
    if (/iphone/i.test(userAgent)) deviceType = '📱 iPhone (iOS)';
    else if (/ipad/i.test(userAgent)) deviceType = '📱 iPad (iPadOS)';
    else if (/android/i.test(userAgent)) deviceType = '📱 Android';
    else if (/mobile/i.test(userAgent)) deviceType = '📱 Móvil';
    else if (/macintosh|mac os x/i.test(userAgent)) deviceType = '💻 Mac (macOS)';
    else if (/windows/i.test(userAgent)) deviceType = '💻 Windows PC';

    // Formatted Mexico Time (America/Ciudad_Juarez / UTC-6)
    const now = new Date();
    const formattedTime = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Ciudad_Juarez',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(now);

    const proposalUrl = url || (clientSlug ? `https://propuestas.tecza.com.mx/${clientSlug}` : 'https://propuestas.tecza.com.mx');

    // Build Telegram HTML message
    const lines = [
      `🔔 <b>¡PROSPECTO ABRIÓ LA PROPUESTA!</b>`,
      ``,
      `👤 <b>Cliente:</b> <code>${escapeHtml(clientName)}</code>`,
      `🔗 <b>Enlace:</b> <a href="${escapeHtml(proposalUrl)}">${escapeHtml(proposalUrl)}</a>`,
      `📱 <b>Dispositivo:</b> ${escapeHtml(deviceType)}`,
      `📍 <b>Ubicación:</b> ${escapeHtml(location)}`,
      `🌐 <b>IP:</b> <code>${escapeHtml(clientIp)}</code>`,
    ];

    if (screenResolution) {
      lines.push(`📐 <b>Pantalla:</b> ${escapeHtml(screenResolution)}`);
    }

    if (referrer && referrer !== 'Directo') {
      lines.push(`🧭 <b>Referrer:</b> <code>${escapeHtml(referrer)}</code>`);
    }

    lines.push(`⏰ <b>Hora local:</b> ${escapeHtml(formattedTime)}`);
    lines.push(``);
    lines.push(`⚡ <i>El cliente está interactuando con la propuesta en este instante.</i>`);

    const message = lines.join('\n');

    // Send to Telegram
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      console.error('Error sending Telegram alert:', errText);
      return NextResponse.json({ success: false, error: errText }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Exception in notify-open API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
