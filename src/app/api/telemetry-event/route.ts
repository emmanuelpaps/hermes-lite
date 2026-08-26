import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BOT_TOKEN = "8539545294:AAHw5rsj7Z0Dg9dA6YiXaXU23uf_LnIYZUY";
const DEFAULT_CHAT_ID = "1813977310";

const EXCLUDED_IPS = [
  "187.188.65.131",
  "127.0.0.1",
  "::1",
  ...(process.env.EXCLUDED_IPS ? process.env.EXCLUDED_IPS.split(",").map(s => s.trim()) : [])
];

function safeDecode(val: string): string {
  if (!val) return "";
  try { return decodeURIComponent(val); } catch { return val; }
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      clientName = "Cliente",
      clientSlug = "",
      eventType = "interaction",
      details = "Interacción con propuesta",
      url = "",
    } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

    // Headers & IP Filter
    const userAgent = req.headers.get("user-agent") || "Desconocido";
    const rawXForwarded = req.headers.get("x-forwarded-for") || "";
    const rawRealIp = req.headers.get("x-real-ip") || "";
    const allIps = (rawXForwarded + "," + rawRealIp).split(",").map(s => s.trim()).filter(Boolean);
    const clientIp = allIps[0] || "IP no disponible";

    if (allIps.some(ip => EXCLUDED_IPS.includes(ip))) {
      return NextResponse.json({ success: true, bypassed: true, reason: "excluded_admin_ip" });
    }

    // Geolocation
    const rawCity = req.headers.get("x-vercel-ip-city") || "";
    const rawRegion = req.headers.get("x-vercel-ip-country-region") || "";
    const rawCountry = req.headers.get("x-vercel-ip-country") || "";
    const city = safeDecode(rawCity);
    const region = safeDecode(rawRegion);
    const country = safeDecode(rawCountry);
    const location = [city, region, country].filter(Boolean).join(", ") || "Ubicación no disponible";

    // Device
    let deviceType = "💻 Desktop";
    if (/iphone/i.test(userAgent)) deviceType = "📱 iPhone (iOS)";
    else if (/ipad/i.test(userAgent)) deviceType = "📱 iPad (iPadOS)";
    else if (/android/i.test(userAgent)) deviceType = "📱 Android";
    else if (/mobile/i.test(userAgent)) deviceType = "📱 Móvil";
    else if (/macintosh|mac os x/i.test(userAgent)) deviceType = "💻 Mac (macOS)";
    else if (/windows/i.test(userAgent)) deviceType = "💻 Windows PC";

    // Time
    const now = new Date();
    const formattedTime = new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Ciudad_Juarez",
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(now);

    let icon = "📡";
    if (eventType === "deep_reading") icon = "📖";
    else if (eventType === "widget_interaction") icon = "🕹️";
    else if (eventType === "modal_dropoff") icon = "⚠️";

    const lines = [
      `${icon} <b>RADAR DE INTENCIÓN // PROSPECTO ACTIVO</b>`,
      "",
      `🏥 <b>Cliente:</b> <code>${escapeHtml(clientName)}</code>`,
      `🎯 <b>Actividad:</b> <b>${escapeHtml(details)}</b>`,
      "",
      `📍 <b>Ubicación:</b> ${escapeHtml(location)}`,
      `📱 <b>Dispositivo:</b> ${escapeHtml(deviceType)}`,
      `🌐 <b>IP:</b> <code>${escapeHtml(clientIp)}</code>`,
      `⏰ <b>Hora:</b> ${escapeHtml(formattedTime)}`,
    ];

    const message = lines.join("\n");

    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
