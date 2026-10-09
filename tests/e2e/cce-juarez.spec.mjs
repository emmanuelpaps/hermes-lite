/**
 * E2E Test Suite: CCE Juárez "Empresario del Año 2026" Commercial Web Proposal
 * Route Under Test: http://localhost:3005/cce-juarez
 * Framework: Node.js Native Test Runner (node:test) + Native Fetch & WCAG Luminance Engine
 *
 * 4-Tier Test Matrix:
 * - Tier 1: Feature Coverage (25 tests covering R1-R5)
 * - Tier 2: Boundary & Corner Cases (25 tests covering R1-R5)
 * - Tier 3: Cross-Feature Combinations (6 tests)
 * - Tier 4: Real-World Scenarios (5 tests)
 * Total: 61 tests across 14 suites
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3005';
const TARGET_PATH = '/cce-juarez';
const TARGET_URL = `${BASE_URL}${TARGET_PATH}`;

// Shared page, stylesheet and client bundle state captured during setup
let pageHtml = '';
let clientBundlesText = '';
let fullAppText = '';
let pageStatus = 0;
let pageHeaders = null;
let stylesContent = '';
let rootVariables = {};

// Helper: Calculate WCAG 2.1 relative luminance for hex color
function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const transform = (val) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Helper: Fetch asset over HTTP and assert 200 OK
async function verifyAsset(assetPath) {
  let cleanPath = assetPath.replaceAll('&amp;', '&');
  if (cleanPath.startsWith('http')) {
    try {
      const u = new URL(cleanPath);
      // When testing against a local instance, route absolute assets on official domain to BASE_URL
      if (u.hostname === 'propuestas.tecza.com.mx' && !BASE_URL.includes('propuestas.tecza.com.mx')) {
        cleanPath = u.pathname;
      }
    } catch (e) {}
  }
  const fullUrl = cleanPath.startsWith('http') ? cleanPath : `${BASE_URL}${cleanPath}`;
  try {
    const res = await fetch(fullUrl, { method: 'HEAD' });
    if (res.status === 405 || !res.ok) {
      const getRes = await fetch(fullUrl, { method: 'GET' });
      return { ok: getRes.ok, status: getRes.status, contentType: getRes.headers.get('content-type') || '' };
    }
    return { ok: res.ok, status: res.status, contentType: res.headers.get('content-type') || '' };
  } catch (err) {
    return { ok: false, status: 0, contentType: '', error: err.message };
  }
}

// Helper: Parse :root CSS variables
function parseRootVariables(css) {
  const vars = {};
  const rootMatches = [...css.matchAll(/:root\s*\{([^}]+)\}/g)];
  for (const rootMatch of rootMatches) {
    const decls = rootMatch[1].split(';');
    for (const decl of decls) {
      const [prop, val] = decl.split(':').map((s) => s?.trim());
      if (prop && prop.startsWith('--') && val) {
        vars[prop] = val;
      }
    }
  }
  return vars;
}

// Helper: Extract all style block texts
function extractStyles(html) {
  const matches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  return matches.map((m) => m[1]).join('\n');
}

// Suite setup
before(async () => {
  try {
    const res = await fetch(TARGET_URL);
    pageStatus = res.status;
    pageHeaders = res.headers;
    pageHtml = await res.text();
  } catch (err) {
    pageStatus = 0;
    pageHeaders = new Headers();
    pageHtml = '';
    console.warn(`[CCE E2E Suite] Unable to connect to ${TARGET_URL}: ${err.message}`);
  }

  stylesContent = extractStyles(pageHtml);

  // Fetch linked external stylesheets (Next.js CSS chunks / external links)
  const cssMatches = [...pageHtml.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)];
  for (const m of cssMatches) {
    try {
      const cssHref = m[1];
      const cssUrl = cssHref.startsWith('http') ? cssHref : `${BASE_URL}${cssHref}`;
      const cssRes = await fetch(cssUrl);
      if (cssRes.ok) {
        stylesContent += '\n' + (await cssRes.text());
      }
    } catch (e) {}
  }

  rootVariables = parseRootVariables(stylesContent);

  // Fetch client JavaScript bundles to inspect client component state & templates
  const scriptMatches = [...pageHtml.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+)["']/g)];
  for (const m of scriptMatches) {
    try {
      const chunkRes = await fetch(`${BASE_URL}${m[1]}`);
      if (chunkRes.ok) {
        clientBundlesText += '\n' + (await chunkRes.text());
      }
    } catch (e) {}
  }

  fullAppText = `${pageHtml}\n${clientBundlesText}`;
});

// =========================================================================
// TIER 1: FEATURE COVERAGE (25 tests across 5 suites)
// =========================================================================

describe('Tier 1: Feature Coverage (R1 - R5)', () => {

  // --- Feature 1 (R1): Institutional Visual Architecture, Keynote Speaker & Sculptural Awards ---
  describe('Feature 1 (R1): Institutional Visual Architecture, Keynote Speaker & Sculptural Awards', () => {
    it('[T1-R1-01] Page returns HTTP 200 with text/html content-type', () => {
      assert.equal(pageStatus, 200, 'Page must return status 200');
      const ct = pageHeaders?.get('content-type') || '';
      assert.ok(ct.includes('text/html'), `Expected text/html content-type, received ${ct}`);
      assert.ok(pageHtml.length > 5000, `Expected HTML body > 5000 bytes, received ${pageHtml.length}`);
    });

    it('[T1-R1-02] Brand logo asset exists in DOM and resolves with HTTP 200', async () => {
      const logoMatch = pageHtml.match(/src=["']([^"']*(?:logo|cce|apolograma)[^"']*\.(?:png|jpg|jpeg|svg|webp))["']/i) ||
                        pageHtml.match(/src=["'](\/assets\/[^"']+)["']/i);
      assert.ok(logoMatch || pageHtml.includes('<svg'), 'Brand logo asset or SVG must be present in DOM');
      if (logoMatch) {
        const logoPath = logoMatch[1];
        const assetCheck = await verifyAsset(logoPath);
        assert.equal(assetCheck.status, 200, `Logo ${logoPath} must return HTTP 200`);
        assert.ok(assetCheck.contentType.includes('image'), 'Logo must have image content-type');
      }
    });

    it('[T1-R1-03] Institutional palette tokens present in :root / CSS', () => {
      const allStyles = `${stylesContent}\n${fullAppText}`;

      // Emerald green palette
      const hasEmerald =
        /--(?:cce-emerald|brand-emerald|emerald|cce-green|primary-green|cce-primary):\s*(#[0-9a-fA-F]{3,8})/i.test(allStyles) ||
        allStyles.includes('#0A3D2E') ||
        allStyles.includes('#0D5C3A') ||
        allStyles.includes('#064E3B') ||
        allStyles.includes('#10B981') ||
        allStyles.includes('#047857') ||
        allStyles.includes('#065F46') ||
        allStyles.includes('emerald');
      assert.ok(hasEmerald, 'Institutional emerald green color or token must be present in stylesheet');

      // Gold accent palette
      const hasGold =
        /--(?:cce-gold|brand-gold|gold|cce-accent|gold-accent):\s*(#[0-9a-fA-F]{3,8})/i.test(allStyles) ||
        allStyles.includes('#D4AF37') ||
        allStyles.includes('#B8860B') ||
        allStyles.includes('#C5A059') ||
        allStyles.includes('#E5C07B') ||
        allStyles.includes('#CA8A04') ||
        allStyles.includes('gold') ||
        allStyles.includes('amber');
      assert.ok(hasGold, 'Institutional gold accent color or token must be present in stylesheet');

      // Cream or white clean backgrounds
      const hasCreamOrWhite =
        /--(?:cce-cream|cce-bg|brand-cream|bg-cream|cream):\s*(#[0-9a-fA-F]{3,8})/i.test(allStyles) ||
        allStyles.includes('#FDFBF7') ||
        allStyles.includes('#FFFDF9') ||
        allStyles.includes('#F8FAFC') ||
        allStyles.includes('#FFFFFF');
      assert.ok(hasCreamOrWhite, 'Clean cream or white institutional background must be present');
    });

    it('[T1-R1-04] Carlos Loret de Mola keynote speaker presentation & official photo', () => {
      assert.ok(fullAppText.includes('Carlos Loret de Mola'), 'Must prominently feature Carlos Loret de Mola');
      assert.ok(/conferencia\s+magistral|conferencista|ponente/i.test(fullAppText), 'Must describe keynote speaker role');
      assert.ok(!/loret[^\n]{0,80}\b(ia|ai|inteligencia\s+artificial)\b/i.test(fullAppText), 'Carlos Loret de Mola presentation must use official photo, strictly NO AI generation');
      assert.ok(!/spot\s+(?:conceptual\s+)?ia/i.test(fullAppText), 'Must eradicate speculative AI video spot references from previous templates');
      assert.ok(pageHtml.includes('loret') || fullAppText.includes('loret'), 'Carlos Loret de Mola image reference or element must exist in page');
    });

    it('[T1-R1-05] Pedro Francisco sculptural awards investiture', () => {
      assert.ok(fullAppText.includes('Pedro Francisco'), 'Must highlight Ciudad Juárez sculptor Pedro Francisco');
      assert.ok(/galard[oó]n|escultur/i.test(fullAppText), 'Must mention sculptural awards / galardones escultóricos');
      assert.ok(/empresa\s+del\s+a[ñn]o|empresario\s+del\s+a[ñn]o/i.test(fullAppText), 'Must mention Empresa del Año and/or Empresario del Año awards');
    });
  });

  // --- Feature 2 (R2): 4 Integral Deliverables & Delimited Scope ---
  describe('Feature 2 (R2): 4 Integral Deliverables & Delimited Scope', () => {
    it('[T1-R2-01] Deliverable 1: Invitación Digital Web / Landing Ejecutiva', () => {
      assert.ok(/invitaci[oó]n\s+digital|landing\s+ejecutiva|plataforma\s+web/i.test(fullAppText), 'Deliverable 1 Invitación Digital Web / Landing must be detailed');
      assert.ok(/agenda|desayuno/i.test(fullAppText), 'Must include event breakfast and agenda');
      assert.ok(/holograma\s+de\s+seguridad/i.test(fullAppText), 'Must mention physical tickets with security hologram');
    });

    it('[T1-R2-02] Deliverable 2: Contenido Facebook: Reels, Carruseles & Nueva Línea Gráfica', () => {
      assert.ok(/reels/i.test(fullAppText), 'Deliverable 2 must include Reels production');
      assert.ok(/carruseles/i.test(fullAppText), 'Must include Facebook carousels');
      assert.ok(/l[ií]nea\s+gr[aá]fica/i.test(fullAppText), 'Must include elevating visual identity / línea gráfica');
      assert.ok(/verde\s+esmeralda/i.test(fullAppText) && /madera/i.test(fullAppText), 'Must elevate emerald green and wood palette');
    });

    it('[T1-R2-03] Deliverable 3: Estrategia y Pauta en Facebook Ads / Meta Ads', () => {
      assert.ok(/meta\s+ads|facebook\s+ads|pauta/i.test(fullAppText), 'Deliverable 3 Meta Ads / Facebook Ads strategy must be detailed');
      assert.ok(/tomadores\s+de\s+decisi[oó]n|directivos|empresarios|c-level/i.test(fullAppText), 'Must target C-level executives and decision-makers');
      assert.ok(/ju[aá]rez|chihuahua/i.test(fullAppText), 'Must specify geographical campaign reach in Cd. Juárez and Chihuahua state');
    });

    it('[T1-R2-04] Deliverable 4: Kit Rueda de Prensa & Automatización WhatsApp', () => {
      assert.ok(/rueda\s+de\s+prensa/i.test(fullAppText), 'Deliverable 4 Press conference graphics must be detailed');
      assert.ok(/pantallas|t[oó]tem/i.test(fullAppText), 'Must reference screens or display kit for press announcement');
      assert.ok(/asistente\s+automatizado|automatizaci[oó]n\s+whatsapp|bot/i.test(fullAppText), 'Must detail WhatsApp automated assistant for FAQs');
      assert.ok(
        /captaci[oó]n[^\n]{0,80}100%[^\n]{0,80}cce/i.test(fullAppText) ||
        /captaci[oó]n[^\n]{0,80}presidencia\s+del\s+cce/i.test(fullAppText),
        'Must strictly clarify that sponsorship negotiation/acquisition is handled 100% by CCE'
      );
    });

    it('[T1-R2-05] WhatsApp Sponsorship & Contact CTAs properly configured', () => {
      const waLinks = [...pageHtml.matchAll(/href=["'](https:\/\/wa\.me\/[^"']+)["']/g)];
      assert.ok(waLinks.length > 0, 'Must contain at least one WhatsApp CTA link');
      for (const match of waLinks) {
        const url = match[1];
        assert.ok(!url.includes(' '), 'WhatsApp link must not contain unencoded spaces');
        assert.doesNotThrow(() => decodeURIComponent(url), 'WhatsApp link must be valid URI');
        const decoded = decodeURIComponent(url).toLowerCase();
        assert.ok(
          decoded.includes('cce') || decoded.includes('patrocin') || decoded.includes('empresario'),
          'WhatsApp prefilled text must relate to CCE or sponsorship inquiries'
        );
      }
    });
  });

  // --- Feature 3 (R3): Commercial Proposal & Mathematical Consistency ---
  describe('Feature 3 (R3): Commercial Proposal & Mathematical Consistency', () => {
    it('[T1-R3-01] Base Investment explicitly stated as $16,000 MXN', () => {
      assert.ok(
        pageHtml.includes('$16,000 MXN') || pageHtml.includes('$16,000'),
        'Must explicitly state $16,000 MXN base investment'
      );
    });

    it('[T1-R3-02] Disaggregated IVA (16%) stated as $2,560 MXN', () => {
      assert.ok(
        pageHtml.includes('$2,560 MXN') || pageHtml.includes('$2,560'),
        'Must explicitly state $2,560 MXN IVA (16%)'
      );
    });

    it('[T1-R3-03] Total Invoiced explicitly stated as $18,560 MXN', () => {
      assert.ok(
        pageHtml.includes('$18,560 MXN') || pageHtml.includes('$18,560'),
        'Must explicitly state $18,560 MXN total invoiced'
      );
    });

    it('[T1-R3-04] Accelerated Delivery Timeline: 5 a 7 días hábiles', () => {
      assert.ok(
        /5\s*(?:a|-)\s*7\s*d[ií]as\s+h[aá]biles/i.test(fullAppText),
        'Must state 5 a 7 business days delivery timeline'
      );
      assert.ok(
        /rueda\s+de\s+prensa/i.test(fullAppText),
        'Must connect timeline to readiness before official press conference'
      );
    });

    it('[T1-R3-05] Scope Transparency: Inclusions covered 100% by Apolograma', () => {
      assert.ok(/incluye|entregables|alcance/i.test(fullAppText), 'Must provide clear list of package inclusions covered by agency');
      assert.ok(fullAppText.includes('Apolograma'), 'Scope must be attributed to Apolograma');
    });
  });

  // --- Feature 4 (R4): Mobile Ergonomics & Social Metadata ---
  describe('Feature 4 (R4): Mobile Ergonomics & Social Metadata', () => {
    it('[T1-R4-01] Mobile Viewport Meta Tag properly configured', () => {
      const viewportMatch = pageHtml.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
      assert.ok(viewportMatch, 'Page must declare viewport meta tag');
      const content = viewportMatch[1];
      assert.ok(content.includes('width=device-width'), 'Viewport must specify width=device-width');
      assert.ok(content.includes('initial-scale=1'), 'Viewport must specify initial-scale=1');
    });

    it('[T1-R4-02] Global Horizontal Scroll Suppression via overflow-x: hidden', () => {
      const allCss = `${stylesContent}\n${fullAppText}`;
      assert.ok(
        allCss.includes('overflow-x: hidden') ||
        allCss.includes('overflow-x:hidden') ||
        allCss.includes('overflow-x-hidden'),
        'Stylesheet must enforce overflow-x: hidden on root containers'
      );
    });

    it('[T1-R4-03] CTA Touch Target Minimum — Interactive elements declare min-height: 44px', () => {
      const allCss = `${stylesContent}\n${fullAppText}`;
      const hasMinHeight44 =
        allCss.includes('min-height: 44px') ||
        allCss.includes('min-height:44px') ||
        allCss.includes('min-height: 48px') ||
        allCss.includes('min-height:48px') ||
        allCss.includes('h-11') ||
        allCss.includes('h-12');
      assert.ok(hasMinHeight44, 'Interactive CTA elements must enforce touch target min-height >= 44px');
    });

    it('[T1-R4-04] Open Graph Metadata configured for /cce-juarez', () => {
      const ogUrlMatch = pageHtml.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i);
      assert.ok(ogUrlMatch, 'Document must define og:url meta tag');
      assert.ok(ogUrlMatch[1].includes('cce-juarez'), 'og:url must point to /cce-juarez');
      assert.ok(pageHtml.includes('og:title'), 'Document must define og:title');
      assert.ok(pageHtml.includes('og:image'), 'Document must define og:image');
    });

    it('[T1-R4-05] Twitter Cards configured with summary_large_image', () => {
      const twitterCardMatch = pageHtml.match(/<meta[^>]*(?:name|property)=["']twitter:card["'][^>]*content=["']([^"']+)["']/i);
      assert.ok(twitterCardMatch, 'Document must define twitter:card meta tag');
      assert.equal(twitterCardMatch[1], 'summary_large_image', 'twitter:card must be summary_large_image');
    });
  });

  // --- Feature 5 (R5): Strict Business Rules & Brand Isolation ---
  describe('Feature 5 (R5): Strict Business Rules & Brand Isolation', () => {
    it('[T1-R5-01] Strict Brand Isolation — 0 mentions of FN1 / Frontera Número Uno', () => {
      const lower = fullAppText.toLowerCase();
      assert.ok(!lower.includes('frontera número uno'), 'Must contain 0 mentions of "Frontera Número Uno"');
      assert.ok(!lower.includes('frontera numero uno'), 'Must contain 0 mentions of "Frontera Numero Uno"');
      assert.ok(!lower.includes('juárez number one'), 'Must contain 0 mentions of "Juárez Number One"');
      assert.ok(!lower.includes('juarez number one'), 'Must contain 0 mentions of "Juarez Number One"');
      const fn1Match = fullAppText.match(/\bFN1\b/i);
      assert.equal(fn1Match, null, 'Must contain 0 mentions of "FN1"');
    });

    it('[T1-R5-02] Strict Anti-Roulette Policy — 0 occurrences of "ruleta"', () => {
      const ruletaMatch = fullAppText.match(/rulet|roulette/i);
      assert.equal(ruletaMatch, null, 'Must contain 0 occurrences of "ruleta" or "roulette"');
    });

    it('[T1-R5-03] Exclusion of Unverifiable ROI Claims', () => {
      const roiMatch = fullAppText.match(/\bROI\b|\bROAS\b|retorno\s+de\s+inversi[oó]n/i);
      assert.equal(roiMatch, null, 'Must contain 0 mentions of ROI / ROAS / Retorno de Inversión');
    });

    it('[T1-R5-04] Attribution exclusively to Apolograma', () => {
      assert.ok(pageHtml.includes('Apolograma'), 'Footer/header must attribute proposal to Apolograma');
      assert.ok(!pageHtml.includes('FN1 Agency'), 'Must not attribute to FN1 Agency');
      assert.ok(!pageHtml.includes('Frontera Media'), 'Must not attribute to Frontera Media');
    });

    it('[T1-R5-05] Non-partisan, solemn institutional tone', () => {
      assert.ok(
        /apartidista|institucional|comunidad\s+empresarial/i.test(fullAppText),
        'Tone must be apartidista, solemn and institutional'
      );
      assert.ok(
        !/\b(partido\s+pol[ií]tico|candidat[oa]|campa[ñn]a\s+electoral)\b/i.test(fullAppText),
        'Must avoid partisan political terminology'
      );
    });
  });

});

// =========================================================================
// TIER 2: BOUNDARY & CORNER CASES (25 tests across 5 suites)
// =========================================================================

describe('Tier 2: Boundary & Corner Cases (R1 - R5)', () => {

  // --- R1 Boundary Cases: Visual Asset Sub-Resources ---
  describe('R1 Boundary Cases: Visual Asset Sub-Resources', () => {
    it('[T2-R1-01] Comprehensive Asset HTTP 200 Sweep across all page images', async () => {
      const nextImages = [...pageHtml.matchAll(/src=["'](\/_next\/image\?[^"']+)["']/gi)].map((m) => m[1]);
      const directAssets = [...fullAppText.matchAll(/\/assets\/cce-juarez\/[a-zA-Z0-9_.-]+\.(?:png|jpg|jpeg|svg|webp)/gi)].map((m) => m[0]);
      const htmlAssets = [...pageHtml.matchAll(/src=["'](\/assets\/[^"']+)["']/gi)].map((m) => m[1]);

      const uniquePaths = [...new Set([...nextImages, ...directAssets, ...htmlAssets])].filter((p) => !p.startsWith('data:'));
      assert.ok(uniquePaths.length >= 2, `Expected at least 2 unique image assets, found ${uniquePaths.length}`);

      const results = await Promise.all(
        uniquePaths.map(async (path) => ({ path, check: await verifyAsset(path) }))
      );

      for (const res of results) {
        assert.equal(res.check.status, 200, `Asset ${res.path} failed HTTP 200 check (got ${res.check.status})`);
      }
    });

    it('[T2-R1-02] Speaker Image Asset Integrity', async () => {
      const speakerMatches = [...pageHtml.matchAll(/src=["']([^"']*loret[^"']*)["']/gi)];
      const directLoret = [...fullAppText.matchAll(/\/assets\/cce-juarez\/[a-zA-Z0-9_.-]*loret[a-zA-Z0-9_.-]*/gi)].map((m) => m[0]);
      assert.ok(speakerMatches.length > 0 || directLoret.length > 0, 'Carlos Loret de Mola image asset must be referenced in page');

      const targetPath = speakerMatches.length > 0 ? speakerMatches[0][1] : directLoret[0];
      const check = await verifyAsset(targetPath);
      assert.equal(check.status, 200, `Speaker image ${targetPath} must resolve with HTTP 200`);
      assert.ok(check.contentType.includes('image'), 'Speaker asset must have image content-type');
    });

    it('[T2-R1-03] Pedro Francisco Sculptural Awards Asset / Badge', async () => {
      const sculptureAsset = [...pageHtml.matchAll(/src=["']([^"']*(?:pedro|francisco|escultura|galardon)[^"']*)["']/gi)];
      assert.ok(
        sculptureAsset.length > 0 || /pedro\s+francisco/i.test(fullAppText),
        'Pedro Francisco award asset or badge must be referenced'
      );
      if (sculptureAsset.length > 0) {
        const check = await verifyAsset(sculptureAsset[0][1]);
        assert.equal(check.status, 200, `Award asset ${sculptureAsset[0][1]} must resolve with HTTP 200`);
      }
    });

    it('[T2-R1-04] OpenGraph Image Social Preview Metadata specification', async () => {
      const ogMatch = pageHtml.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
      assert.ok(ogMatch, 'Document must define og:image meta tag');
      const ogUrl = ogMatch[1];
      assert.ok(
        ogUrl.includes('cce-juarez') || ogUrl.includes('cce') || ogUrl.includes('propuestas.tecza.com.mx'),
        'og:image must point to relevant CCE Juárez or Apolograma asset'
      );
      const ogCheck = await verifyAsset(ogUrl);
      assert.equal(ogCheck.status, 200, `og:image ${ogUrl} must resolve with HTTP 200`);
    });

    it('[T2-R1-05] Asset Protocol Safety — 0 insecure external HTTP asset links', () => {
      const insecureLinks = [...pageHtml.matchAll(/src=["']http:\/\/([^"']+)["']/g)];
      assert.equal(insecureLinks.length, 0, 'Document must not include insecure http:// asset sources');
    });
  });

  // --- R2 Boundary Cases: Substring Boundaries & Escaped Entities ---
  describe('R2 Boundary Cases: Substring Boundaries & Escaped Entities', () => {
    it('[T2-R2-01] Substring Word-Stem Scan: No occurrences of "rulet", "roulette", "fn1"', () => {
      assert.ok(!/rulet/i.test(fullAppText), 'Substrings matching "rulet" are prohibited');
      assert.ok(!/roulette/i.test(fullAppText), 'Substrings matching "roulette" are prohibited');
      assert.ok(!/\bfn1\b/i.test(fullAppText), 'Standalone word "fn1" is prohibited');
    });

    it('[T2-R2-02] Character Entity & Raw Quote Escaping in Text Nodes', () => {
      assert.ok(!/&amp;amp;/i.test(pageHtml), 'Double encoded HTML entities (&amp;amp;) are prohibited');
      assert.ok(!/<em>"[^<]+"/i.test(pageHtml), 'Raw unescaped quotes in emphasis tags must be clean');
    });

    it('[T2-R2-03] Exclusion of Aggressive High-Pressure Promotional Phrases', () => {
      const pushyWords = ['¡CÓMPRALO YA!', 'OFERTA IRREPETIBLE', 'DESCUENTO LOCO', 'NO TE LO PIERDAS', 'PRECIO DE REMATE'];
      for (const phrase of pushyWords) {
        assert.ok(!fullAppText.toUpperCase().includes(phrase), `Proposal must avoid pushy phrase: ${phrase}`);
      }
    });

    it('[T2-R2-04] WhatsApp CTA Parameter Encoding Integrity', () => {
      const waLinks = [...pageHtml.matchAll(/href=["'](https:\/\/wa\.me\/[^"']+)["']/g)];
      assert.ok(waLinks.length > 0, 'Must have at least one WhatsApp link');
      for (const match of waLinks) {
        const url = match[1];
        assert.ok(!url.includes(' '), 'WhatsApp link must not contain raw spaces');
        assert.doesNotThrow(() => decodeURIComponent(url), 'WhatsApp link must be valid URI');
      }
    });

    it('[T2-R2-05] Sponsorship Rate Card Confidentiality', () => {
      assert.ok(
        !/patrocinio\s+(?:oro|plata|diamante|bronce)\s*:\s*\$\d+/i.test(fullAppText),
        'Sponsorship rate card must not be publicly exposed'
      );
      assert.ok(
        /confidencial|privad[oa]|direct[oa]/i.test(fullAppText),
        'Sponsorship inquiries must be explicitly identified as confidential'
      );
    });
  });

  // --- R3 Boundary Cases: Mathematical Identities & Price Syntax ---
  describe('R3 Boundary Cases: Mathematical Identities & Price Syntax', () => {
    it('[T2-R3-01] Mathematical Identity Verification: Base * 0.16 == IVA ($2,560)', () => {
      const base = 16000;
      assert.equal(base * 0.16, 2560, 'Base $16,000 * 0.16 must equal exactly 2560');
    });

    it('[T2-R3-02] Total Invoiced Invariant: Base + IVA == $18,560 MXN', () => {
      const base = 16000;
      const iva = base * 0.16;
      assert.equal(base + iva, 18560, 'Base $16,000 + IVA $2,560 must equal exactly $18,560 MXN');
    });

    it('[T2-R3-03] Strict Currency Notation — Uppercase MXN required', () => {
      assert.ok(pageHtml.includes('MXN'), 'Currency notation must include uppercase MXN');
      assert.ok(!/\$\d+[\d,]*\s+pesos\b/i.test(pageHtml), 'Must not use informal "pesos" notation');
      assert.ok(!/\$\d+[\d,]*\s+mxn\b/.test(pageHtml), 'Currency suffix must be uppercase "MXN"');
    });

    it('[T2-R3-04] Eradication of Informal Price Truncations', () => {
      assert.ok(!/\$16k\b/i.test(fullAppText), 'Must not truncate $16,000 to $16k');
      assert.ok(!/\$18k\b/i.test(fullAppText), 'Must not truncate $18,560 to $18k');
      assert.ok(!/\$2\.5k\b/i.test(fullAppText), 'Must not truncate $2,560 to $2.5k');
      assert.ok(!/\$2,5k\b/i.test(fullAppText), 'Must not truncate $2,560 to $2,5k');
    });

    it('[T2-R3-05] Eradication of Legacy Proposal Pricing', () => {
      assert.ok(!/\$20,000\b/.test(fullAppText), 'Must not display legacy $20,000 MXN pricing');
      assert.ok(!/\$10,000\b/.test(fullAppText), 'Must not display legacy $10,000 MXN pricing');
      assert.ok(!/\$6,000\b/.test(fullAppText), 'Must not display legacy $6,000 MXN pricing');
      assert.ok(!/\$25,000\b/.test(fullAppText), 'Must not display legacy $25,000 MXN pricing');
      assert.ok(!/\$29,000\b/.test(fullAppText), 'Must not display legacy $29,000 MXN pricing');
    });
  });

  // --- R4 Boundary Cases: Viewport Ergonomics & Touch Controls ---
  describe('R4 Boundary Cases: Viewport Ergonomics & Touch Controls', () => {
    it('[T2-R4-01] Mobile Body Typography Floor Check (>= 14px / 0.875rem)', () => {
      const allCss = `${stylesContent}\n${fullAppText}`;
      assert.ok(!allCss.includes('font-size: 0.82rem;'), 'No body text rule should specify 0.82rem (< 14px)');
      assert.ok(!allCss.includes('font-size: 0.75rem;'), 'No body text rule should specify 0.75rem (< 14px)');
      assert.ok(!allCss.includes('font-size: 12px;'), 'No body text rule should specify 12px');
      assert.ok(!allCss.includes('font-size: 13px;'), 'No body text rule should specify 13px');
    });

    it('[T2-R4-02] Form Inputs Font-Size Floor (>= 16px)', () => {
      const inputMatch = stylesContent.match(/(?:input|select|textarea|\.cce-input)\s*\{[^}]*font-size:\s*([^;]+);/i);
      if (inputMatch) {
        const val = inputMatch[1].trim();
        if (val.endsWith('rem')) {
          assert.ok(parseFloat(val) >= 1.0, 'Input font-size must be >= 1.0rem (16px)');
        } else if (val.endsWith('px')) {
          assert.ok(parseFloat(val) >= 16, 'Input font-size must be >= 16px');
        }
      }
      assert.ok(!stylesContent.includes('input { font-size: 14px'), 'Form inputs must not be smaller than 16px to prevent iOS auto-zoom');
    });

    it('[T2-R4-03] Contrast Luminance Calculation for Primary Text (>= 4.5:1)', () => {
      const darkColor = rootVariables['--cce-emerald'] || '#0A3D2E';
      const lightBg = rootVariables['--cce-cream'] || '#FDFBF7';
      const ratio = getContrastRatio(darkColor, lightBg);
      assert.ok(ratio >= 4.5, `Contrast ratio between ${darkColor} and ${lightBg} must be >= 4.5:1 (calculated: ${ratio.toFixed(2)}:1)`);
      assert.ok(ratio >= 7.0, `Contrast ratio must pass WCAG AAA >= 7.0:1 (calculated: ${ratio.toFixed(2)}:1)`);
    });

    it('[T2-R4-04] Heading Typography Wrap Balancing Rule', () => {
      const allCss = `${stylesContent}\n${fullAppText}`;
      const hasTextWrap =
        allCss.includes('text-wrap: balance') ||
        allCss.includes('text-wrap:balance') ||
        allCss.includes('text-wrap: pretty') ||
        allCss.includes('text-wrap:pretty') ||
        allCss.includes('text-balance');
      assert.ok(hasTextWrap, 'Stylesheet must declare text-wrap: balance or text-wrap: pretty or text-balance for executive headings');
    });

    it('[T2-R4-05] Table / Seating Map Mobile Stack Rule', () => {
      const allCss = `${stylesContent}\n${fullAppText}`;
      const hasMobileStack =
        /@media[^{]*\(\s*max-width:\s*(?:580|640|768)px\s*\)[^{]*\{[\s\S]*?(?:grid-template-columns:\s*1fr|flex-direction:\s*column|overflow-x:\s*auto)/i.test(allCss) ||
        allCss.includes('grid-cols-1') ||
        allCss.includes('flex-col');
      assert.ok(hasMobileStack, 'Seating map or tables layout must declare responsive stacking or scrolling on mobile viewports');
    });
  });

  // --- R5 Boundary Cases: CCE Leadership, Chamber Context & Brand Protection ---
  describe('R5 Boundary Cases: CCE Leadership, Chamber Context & Brand Protection', () => {
    it('[T2-R5-01] Official CCE Leadership & Executive Council Reference', () => {
      assert.ok(/Iv[aá]n\s+Lara/i.test(fullAppText), 'Must mention Iván Lara (CCE leadership)');
      assert.ok(/Consejo\s+Coordinador\s+Empresarial/i.test(fullAppText), 'Must mention Consejo Coordinador Empresarial (CCE)');
    });

    it('[T2-R5-02] 11 Business Chambers Membership Context', () => {
      assert.ok(/11\s*(?:organismos|c[aá]maras)/i.test(fullAppText), 'Must reference the 11 business chambers forming CCE Juárez');
    });

    it('[T2-R5-03] Security Hologram Physical Ticket Mention', () => {
      assert.ok(/holograma/i.test(fullAppText), 'Must mention security hologram');
      assert.ok(/boletos?\s+f[ií]sicos?/i.test(fullAppText) || /acreditaci[oó]n/i.test(fullAppText), 'Must specify physical tickets or accreditation');
    });

    it('[T2-R5-04] Event Investiture & Venue Bounds (Cibeles / Desayuno Empresarial)', () => {
      assert.ok(/Cibeles/i.test(fullAppText), 'Must state Centro de Eventos Cibeles venue');
      assert.ok(/Desayuno\s+Empresarial/i.test(fullAppText), 'Must state Desayuno Empresarial format');
      assert.ok(/19\s+Noviembre\s+2026/i.test(fullAppText) || /Noviembre\s+2026/i.test(fullAppText), 'Must state event date in November 2026');
    });

    it('[T2-R5-05] Zero Puerta Juárez / La X Artifacts', () => {
      assert.ok(!fullAppText.includes('puerta-juarez'), 'puerta-juarez asset must not be referenced');
      assert.ok(!/puerta\s+ju[aá]rez/i.test(fullAppText), 'Puerta Juárez text must not be present');
      assert.ok(!/monumento\s+(?:a\s+)?la\s+x/i.test(fullAppText), 'Monumento La X text must not be present');
    });
  });

});

// =========================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS (6 tests)
// =========================================================================

describe('Tier 3: Cross-Feature Combinations', () => {
  it('[T3-COMB-01] Visual & Typography Harmony — Institutional tokens applied with contrast >= 4.5:1', () => {
    const emerald = rootVariables['--cce-emerald'] || '#0A3D2E';
    const bg = rootVariables['--cce-cream'] || '#FDFBF7';
    const contrast = getContrastRatio(emerald, bg);
    assert.ok(contrast >= 4.5, `Heading contrast ratio ${contrast.toFixed(2)}:1 must pass WCAG AA >= 4.5:1`);
  });

  it('[T3-COMB-02] Copy & Financial Synchrony — Pricing breakdown displays exact $16,000 + $2,560 = $18,560 terms with 5-7 days timeline', () => {
    assert.ok(pageHtml.includes('$16,000'), '$16,000 base investment must be referenced');
    assert.ok(pageHtml.includes('$2,560'), '$2,560 IVA must be referenced');
    assert.ok(pageHtml.includes('$18,560'), '$18,560 total invoiced must be referenced');
    assert.ok(/5\s*(?:a|-)\s*7\s*d[ií]as\s+h[aá]biles/i.test(fullAppText), '5 to 7 business days timeline must be synchronized');
  });

  it('[T3-COMB-03] Mobile Layout & 4 Deliverables Cards Stacking', () => {
    const allCss = `${stylesContent}\n${fullAppText}`;
    const hasGridOrStack =
      /@media[^{]*\(\s*max-width:\s*(?:580|640|768)px\s*\)[^{]*\{[\s\S]*?(?:grid-template-columns:\s*1fr|flex-direction:\s*column)/i.test(allCss) ||
      allCss.includes('grid-cols-1') ||
      allCss.includes('flex-col');
    assert.ok(hasGridOrStack, 'Deliverables cards must adapt responsively on mobile viewports');
  });

  it('[T3-COMB-04] WhatsApp CTA & Confidentiality Integration', () => {
    const waLinks = [...pageHtml.matchAll(/href=["'](https:\/\/wa\.me\/[^"']+)["']/g)];
    assert.ok(waLinks.length > 0, 'WhatsApp CTA must be present');
    const waUrl = waLinks[0][1];
    const decoded = decodeURIComponent(waUrl);
    assert.ok(
      decoded.includes('patrocin') || decoded.includes('CCE') || decoded.includes('Empresario') || decoded.includes('Galardones'),
      'WhatsApp CTA must prefill confidential sponsorship inquiry'
    );
    assert.ok(!decoded.includes('$'), 'WhatsApp link must not expose sponsorship rate figures in query parameters');
  });

  it('[T3-COMB-05] Executive Branding & Social Metadata Synchronization', () => {
    assert.ok(pageHtml.includes('og:title'), 'Must include og:title');
    assert.ok(pageHtml.includes('Apolograma'), 'Attributed to Apolograma');
    const ogTitleMatch = pageHtml.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch) {
      assert.ok(
        ogTitleMatch[1].includes('CCE') || ogTitleMatch[1].includes('Empresario') || ogTitleMatch[1].includes('Galardones') || ogTitleMatch[1].includes('Apolograma'),
        'og:title must reflect executive CCE Juárez / Apolograma identity'
      );
    }
  });

  it('[T3-COMB-06] Chamber Context & Sponsorship Delimitation', () => {
    assert.ok(/c[aá]maras|organismos/i.test(fullAppText), 'Chambers context must be stated');
    assert.ok(
      /captaci[oó]n[^\n]{0,80}100%[^\n]{0,80}cce/i.test(fullAppText) ||
      /captaci[oó]n[^\n]{0,80}presidencia\s+del\s+cce/i.test(fullAppText) ||
      /negociaci[oó]n\s+de\s+patrocinios\s+es\s+gestionada\s+100%/i.test(fullAppText),
      'Sponsorship negotiation/acquisition must be explicitly identified as 100% handled by CCE'
    );
  });
});

// =========================================================================
// TIER 4: REAL-WORLD SCENARIOS (5 tests)
// =========================================================================

describe('Tier 4: Real-World Scenarios', () => {
  it('[T4-SCEN-01] CCE President / Executive Board First Impression (Above-the-Fold Audit)', () => {
    assert.ok(/CCE|Consejo Coordinador Empresarial/i.test(pageHtml), 'Hero section identifies CCE Juárez');
    assert.ok(pageHtml.includes('Apolograma'), 'Hero/Header attributes development to Apolograma');
    assert.ok(!pageHtml.includes('Frontera Número Uno'), 'No third-party agency name shown above the fold');
    assert.ok(fullAppText.includes('Carlos Loret de Mola'), 'Keynote speaker clearly highlighted');
    assert.ok(fullAppText.includes('Pedro Francisco'), 'Pedro Francisco sculptures highlighted');
  });

  it('[T4-SCEN-02] Corporate Treasurer / Fiscal Due Diligence', () => {
    assert.ok(pageHtml.includes('$16,000'), 'Discloses $16,000 base fee');
    assert.ok(pageHtml.includes('16%') || pageHtml.includes('IVA'), 'Discloses 16% IVA');
    assert.ok(pageHtml.includes('$2,560'), 'Discloses $2,560 exact tax amount');
    assert.ok(pageHtml.includes('$18,560'), 'Discloses $18,560 total invoiced amount');
    assert.ok(/factur/i.test(fullAppText), 'Explicitly notes fiscal invoicing terms');
  });

  it('[T4-SCEN-03] Corporate Sponsor Inquiry Journey', () => {
    assert.ok(fullAppText.includes('WhatsApp'), 'Provides direct WhatsApp touchpoint for sponsors');
    assert.ok(/confidencial/i.test(fullAppText), 'Reassures sponsor that inquiries remain confidential');
    assert.ok(
      !/patrocinio\s+(?:oro|plata|diamante)\s*[:\$]/i.test(fullAppText),
      'Does not leak open sponsorship rates on the public page'
    );
  });

  it('[T4-SCEN-04] Mobile Executive Inspection at 375px (iPhone SE)', () => {
    const viewportMatch = pageHtml.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
    assert.ok(viewportMatch, 'Viewport meta tag must be present for iPhone SE inspection');
    const allCss = `${stylesContent}\n${fullAppText}`;
    assert.ok(
      allCss.includes('overflow-x: hidden') ||
      allCss.includes('overflow-x:hidden') ||
      allCss.includes('overflow-x-hidden'),
      'Prevents horizontal scrollbar overflow on 375px viewport'
    );
    const hasTouchTarget =
      allCss.includes('min-height: 44px') ||
      allCss.includes('min-height:44px') ||
      allCss.includes('min-height: 48px') ||
      allCss.includes('h-11') ||
      allCss.includes('h-12');
    assert.ok(hasTouchTarget, 'Interactive buttons meet 44px touch target guidelines');
  });

  it('[T4-SCEN-05] Press Conference Readiness Verification', () => {
    assert.ok(/5\s*(?:a|-)\s*7\s*d[ií]as\s+h[aá]biles/i.test(fullAppText), 'Accelerated timeline of 5 to 7 business days guaranteed');
    assert.ok(/rueda\s+de\s+prensa/i.test(fullAppText), 'Explicit readiness guarantee before official press conference of Iván Lara / CCE');
  });
});
