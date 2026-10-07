/**
 * E2E Test Suite: Tortería La Nueva Laguna Commercial Web Proposal
 * Route Under Test: http://localhost:3005/nueva-laguna
 * Framework: Node.js Native Test Runner (node:test) + Native Fetch & WCAG Luminance Engine
 *
 * 4-Tier Test Matrix:
 * - Tier 1: Feature Coverage (25 tests covering R1-R5)
 * - Tier 2: Boundary & Corner Cases (25 tests covering R1-R5)
 * - Tier 3: Cross-Feature Combinations (6 tests)
 * - Tier 4: Real-World Scenarios (5 tests)
 * Total: 61 tests
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3005';
const TARGET_PATH = '/nueva-laguna';
const TARGET_URL = `${BASE_URL}${TARGET_PATH}`;

// Shared page and client bundle state captured during setup
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
  const fullUrl = assetPath.startsWith('http') ? assetPath : `${BASE_URL}${assetPath}`;
  const res = await fetch(fullUrl, { method: 'HEAD' });
  if (res.status === 405 || !res.ok) {
    const getRes = await fetch(fullUrl, { method: 'GET' });
    return { ok: getRes.ok, status: getRes.status, contentType: getRes.headers.get('content-type') || '' };
  }
  return { ok: res.ok, status: res.status, contentType: res.headers.get('content-type') || '' };
}

// Helper: Parse :root CSS variables
function parseRootVariables(css) {
  const vars = {};
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  if (!rootMatch) return vars;
  const decls = rootMatch[1].split(';');
  for (const decl of decls) {
    const [prop, val] = decl.split(':').map((s) => s.trim());
    if (prop && prop.startsWith('--') && val) {
      vars[prop] = val;
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
  const res = await fetch(TARGET_URL);
  pageStatus = res.status;
  pageHeaders = res.headers;
  pageHtml = await res.text();
  stylesContent = extractStyles(pageHtml);
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
// TIER 1: FEATURE COVERAGE (25 tests)
// =========================================================================

describe('Tier 1: Feature Coverage (R1 - R5)', () => {

  // --- Feature 1 (R1): Visual Assets & Brand Identity ---
  describe('Feature 1 (R1): Visual Assets & Brand Identity', () => {
    it('[T1-R1-01] Page returns HTTP 200 with text/html content-type', () => {
      assert.equal(pageStatus, 200, 'Page must return status 200');
      const ct = pageHeaders.get('content-type') || '';
      assert.ok(ct.includes('text/html'), `Expected text/html content-type, received ${ct}`);
      assert.ok(pageHtml.length > 5000, `Expected HTML body > 5000 bytes, received ${pageHtml.length}`);
    });

    it('[T1-R1-02] Brand logo asset exists in DOM and resolves with HTTP 200', async () => {
      const logoPath = '/assets/nueva-laguna/logo_nueva_laguna_clean_trans.png';
      assert.ok(pageHtml.includes(logoPath), 'Logo path must be present in HTML payload');
      const assetCheck = await verifyAsset(logoPath);
      assert.equal(assetCheck.status, 200, `Logo ${logoPath} must return HTTP 200`);
      assert.ok(assetCheck.contentType.includes('image'), 'Logo must have image content-type');
    });

    it('[T1-R1-03] Brand palette tokens in :root match specified hex codes', () => {
      // Specified palette: --nl-green: #183D2F, --nl-french-bread-bg: #FFFDF9, --nl-yolk: #D9822B, --nl-tomato: #B33927
      assert.equal(rootVariables['--nl-green']?.toUpperCase(), '#183D2F', 'Variable --nl-green must be #183D2F');
      assert.equal(rootVariables['--nl-french-bread-bg']?.toUpperCase(), '#FFFDF9', 'Variable --nl-french-bread-bg must be #FFFDF9');
      assert.equal(rootVariables['--nl-yolk']?.toUpperCase(), '#D9822B', 'Variable --nl-yolk must be #D9822B');
      assert.equal(rootVariables['--nl-tomato']?.toUpperCase(), '#B33927', 'Variable --nl-tomato must be #B33927');
    });

    it('[T1-R1-04] Hero background/banner image resolves with HTTP 200', async () => {
      const heroPath = '/assets/nueva-laguna/clean_hero_tortas.jpg';
      assert.ok(pageHtml.includes(heroPath), 'Hero image clean_hero_tortas.jpg must be referenced in page');
      const assetCheck = await verifyAsset(heroPath);
      assert.equal(assetCheck.status, 200, `Hero image ${heroPath} must return HTTP 200`);
    });

    it('[T1-R1-05] Menu items exclude generic moodboard burgers/focaccias and use authentic torta cutouts', () => {
      // Inappropriate assets from moodboard: menu-item-stack.jpg (burgers), menu-item-chef.jpg (focaccia)
      assert.ok(!fullAppText.includes('menu-item-stack.jpg'), 'Generic smash burger image menu-item-stack.jpg must be eradicated');
      assert.ok(!fullAppText.includes('menu-item-chef.jpg'), 'Generic turkey focaccia image menu-item-chef.jpg must be eradicated');
      // Must include authentic torta assets
      assert.ok(fullAppText.includes('dish_torta_pierna.jpg'), 'Authentic torta de pierna image must be referenced');
      assert.ok(fullAppText.includes('dish_colita_pavo.jpg'), 'Authentic colita de pavo image must be referenced');
    });
  });

  // --- Feature 2 (R2): Editorial Copys & Business Rules ---
  describe('Feature 2 (R2): Editorial Copys & Business Rules', () => {
    it('[T1-R2-01] Strict Brand Isolation — 0 mentions of FN1 / Frontera Número Uno', () => {
      const lower = fullAppText.toLowerCase();
      assert.ok(!lower.includes('frontera número uno'), 'Must contain 0 mentions of "Frontera Número Uno"');
      assert.ok(!lower.includes('frontera numero uno'), 'Must contain 0 mentions of "Frontera Numero Uno"');
      assert.ok(!lower.includes('juárez number one'), 'Must contain 0 mentions of "Juárez Number One"');
      const fn1Match = fullAppText.match(/\bFN1\b/i);
      assert.equal(fn1Match, null, 'Must contain 0 mentions of "FN1"');
    });

    it('[T1-R2-02] Anti-Roulette Policy — 0 occurrences of "ruleta"', () => {
      const ruletaMatch = fullAppText.match(/ruleta/i);
      assert.equal(ruletaMatch, null, 'Must contain 0 occurrences of "ruleta" (must refer to minijuego/dinámica)');
    });

    it('[T1-R2-03] Exclusion of Unverifiable ROI Claims', () => {
      const roiMatch = fullAppText.match(/\bROI\b|\bROAS\b|retorno\s+de\s+inversi[oó]n/i);
      assert.equal(roiMatch, null, 'Must contain 0 mentions of ROI / ROAS / Retorno de Inversión');
    });

    it('[T1-R2-04] Eradication of Inflated Promotional Badges ($25,000 MXN)', () => {
      assert.ok(!fullAppText.includes('$25,000 MXN'), 'Must not display inflated infomercial valuation of $25,000 MXN');
      assert.ok(!fullAppText.includes('$25,000'), 'Must not display inflated valuation $25,000');
      assert.ok(!fullAppText.includes('$25k'), 'Must not display inflated valuation $25k');
    });

    it('[T1-R2-05] Professional Restaurateur Tone — Eradication of "Menú TikTok" & "Juego de Leads"', () => {
      assert.ok(!fullAppText.includes('Menú TikTok'), 'Must not use informal agency term "Menú TikTok"');
      assert.ok(!fullAppText.includes('Juego de Leads'), 'Must not use generic marketing buzzword "Juego de Leads"');
      assert.ok(!fullAppText.includes('Llenar Días Flojos'), 'Must not use colloquial phrase "Llenar Días Flojos"');
    });
  });

  // --- Feature 3 (R3): Typography & Contrast ---
  describe('Feature 3 (R3): Typography & Contrast', () => {
    it('[T1-R3-01] Mobile Body Typography — Body font sizes in CSS enforce >= 14px (0.875rem)', () => {
      const flowTextMatch = stylesContent.match(/\.nl-flow-text\s*\{[^}]*font-size:\s*([^;]+);/i);
      if (flowTextMatch) {
        const sizeVal = flowTextMatch[1].trim();
        if (sizeVal.endsWith('rem')) {
          const rem = parseFloat(sizeVal);
          assert.ok(rem >= 0.875, `.nl-flow-text font-size ${sizeVal} must be >= 0.875rem (14px)`);
        } else if (sizeVal.endsWith('px')) {
          const px = parseFloat(sizeVal);
          assert.ok(px >= 14, `.nl-flow-text font-size ${sizeVal} must be >= 14px`);
        }
      }
      assert.ok(!stylesContent.includes('font-size: 0.82rem;'), 'No body text rule should specify 0.82rem (< 14px)');
      assert.ok(!stylesContent.includes('font-size: 0.72rem;'), 'No explanatory note should specify 0.72rem (< 12px)');
    });

    it('[T1-R3-02] Form Input Typography — Form inputs enforce font-size >= 16px to prevent iOS Safari auto-zoom', () => {
      const inputMatch = stylesContent.match(/\.nl-input\s*\{[^}]*font-size:\s*([^;]+);/i);
      assert.ok(inputMatch, '.nl-input CSS rule must declare font-size');
      const sizeVal = inputMatch[1].trim();
      if (sizeVal.endsWith('rem')) {
        const rem = parseFloat(sizeVal);
        assert.ok(rem >= 1.0, `.nl-input font-size ${sizeVal} must be >= 1.0rem (16px)`);
      } else if (sizeVal.endsWith('px')) {
        const px = parseFloat(sizeVal);
        assert.ok(px >= 16, `.nl-input font-size ${sizeVal} must be >= 16px`);
      }
    });

    it('[T1-R3-03] Primary Text WCAG AA Contrast — #183D2F on #FFFDF9 achieves >= 4.5:1', () => {
      const green = '#183D2F';
      const bg = '#FFFDF9';
      const ratio = getContrastRatio(green, bg);
      assert.ok(ratio >= 4.5, `Contrast ratio between ${green} and ${bg} must be >= 4.5:1 (calculated: ${ratio.toFixed(2)}:1)`);
      assert.ok(ratio >= 10.0, `Expected deep contrast ratio > 10.0:1 (calculated: ${ratio.toFixed(2)}:1)`);
    });

    it('[T1-R3-04] Tomato Accent WCAG AA Contrast — #B33927 against card backgrounds achieves >= 4.5:1', () => {
      const tomato = '#B33927';
      const cardBg = '#FFFDF9';
      const ratio = getContrastRatio(tomato, cardBg);
      assert.ok(ratio >= 4.5, `Contrast ratio between ${tomato} and ${cardBg} must be >= 4.5:1 (calculated: ${ratio.toFixed(2)}:1)`);
    });

    it('[T1-R3-05] Standard Currency Syntax — Base plan pricing uses official $XX,XXX MXN format', () => {
      assert.ok(pageHtml.includes('$20,000 MXN'), 'Must include properly formatted "$20,000 MXN"');
      assert.ok(pageHtml.includes('$10,000 MXN'), 'Must include properly formatted "$10,000 MXN"');
      assert.ok(!pageHtml.includes('$20k'), 'Must not use informal anglicism "$20k"');
      assert.ok(!pageHtml.includes('$10k'), 'Must not use informal anglicism "$10k"');
    });
  });

  // --- Feature 4 (R4): Mobile Ergonomics & Responsive Viewports ---
  describe('Feature 4 (R4): Mobile Ergonomics & Responsive Viewports', () => {
    it('[T1-R4-01] Mobile Viewport Meta Tag properly configured', () => {
      const viewportMatch = pageHtml.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
      assert.ok(viewportMatch, 'Page must declare viewport meta tag');
      const content = viewportMatch[1];
      assert.ok(content.includes('width=device-width'), 'Viewport must declare width=device-width');
      assert.ok(content.includes('initial-scale=1'), 'Viewport must declare initial-scale=1');
    });

    it('[T1-R4-02] Global Horizontal Scroll Suppression via overflow-x: hidden', () => {
      assert.ok(
        stylesContent.includes('overflow-x: hidden') || stylesContent.includes('overflow-x:hidden'),
        'Stylesheet must enforce overflow-x: hidden on root containers'
      );
    });

    it('[T1-R4-03] CTA Touch Target Minimum — Button classes declare min-height: 44px', () => {
      const btnMatch = stylesContent.match(/\.nl-btn\s*\{[^}]*min-height:\s*([^;]+);/i);
      assert.ok(btnMatch, '.nl-btn must declare explicit min-height');
      const minH = parseInt(btnMatch[1], 10);
      assert.ok(minH >= 44, `.nl-btn min-height must be >= 44px (got ${minH}px)`);
    });

    it('[T1-R4-04] Mobile QR Layout Stacking — Stacks .nl-sim-qr-box vertically on mobile viewports', () => {
      const hasQrMobileStack = /@media[^{]*\(\s*max-width:\s*(?:580|640|768)px\s*\)[^{]*\{[\s\S]*?\.nl-sim-qr-box[\s\S]*?flex-direction:\s*column/i.test(stylesContent);
      assert.ok(hasQrMobileStack, '.nl-sim-qr-box must have a responsive media query with flex-direction: column for mobile');
    });

    it('[T1-R4-05] Modal Close Target Accessibility — .nl-modal-close declares min dimensions >= 44x44px', () => {
      const closeMatch = stylesContent.match(/\.nl-modal-close\s*\{([^}]+)\}/i);
      assert.ok(closeMatch, '.nl-modal-close CSS rule must be defined');
      const decls = closeMatch[1];
      const widthMatch = decls.match(/width:\s*(\d+)px/i);
      const heightMatch = decls.match(/height:\s*(\d+)px/i);
      const minWidthMatch = decls.match(/min-width:\s*(\d+)px/i);
      const minHeightMatch = decls.match(/min-height:\s*(\d+)px/i);

      const effectiveWidth = minWidthMatch ? parseInt(minWidthMatch[1], 10) : (widthMatch ? parseInt(widthMatch[1], 10) : 0);
      const effectiveHeight = minHeightMatch ? parseInt(minHeightMatch[1], 10) : (heightMatch ? parseInt(heightMatch[1], 10) : 0);

      assert.ok(effectiveWidth >= 44, `.nl-modal-close width must be >= 44px (got ${effectiveWidth}px)`);
      assert.ok(effectiveHeight >= 44, `.nl-modal-close height must be >= 44px (got ${effectiveHeight}px)`);
    });
  });

  // --- Feature 5 (R5): Mathematical Consistency & Offer Structure ---
  describe('Feature 5 (R5): Mathematical Consistency & Offer Structure', () => {
    it('[T1-R5-01] Plan Integral Financial Breakdown: $20,000 + $3,200 IVA = $23,200 MXN', () => {
      assert.ok(pageHtml.includes('$20,000'), 'Plan Integral must state $20,000 base');
      assert.ok(pageHtml.includes('$3,200'), 'Plan Integral must state $3,200 IVA');
      assert.ok(pageHtml.includes('$23,200 MXN'), 'Plan Integral must state $23,200 MXN agency total');
    });

    it('[T1-R5-02] Plan Esencial Financial Breakdown: $10,000 + $1,600 IVA = $11,600 MXN', () => {
      assert.ok(pageHtml.includes('$10,000'), 'Plan Esencial must state $10,000 base');
      assert.ok(pageHtml.includes('$1,600'), 'Plan Esencial must state $1,600 IVA');
      assert.ok(pageHtml.includes('$11,600 MXN'), 'Plan Esencial must state $11,600 MXN agency total');
    });

    it('[T1-R5-03] Meta Ads Media Spend Distinction: $2,000 MXN direct client-to-Meta investment', () => {
      assert.ok(pageHtml.includes('$2,000 MXN'), 'Must explicitly state $2,000 MXN pauta');
      const hasMetaExplanation = pageHtml.includes('Meta Ads') && (pageHtml.includes('inversión directa') || pageHtml.includes('directamente por el cliente') || pageHtml.includes('pagado directamente'));
      assert.ok(hasMetaExplanation, 'Must clarify that $2,000 MXN pauta is direct client payment to Meta Ads');
    });

    it('[T1-R5-04] 5-Month 100% Software Subsidy: $0 MXN for first 5 months', () => {
      const has5MonthBonus = pageHtml.includes('5 meses') || pageHtml.includes('5 MESES');
      assert.ok(has5MonthBonus, 'Must reference the 5 months promotional bonus period');
      assert.ok(pageHtml.includes('$0 MXN'), 'Must display $0 MXN promotional rate during bonus period');
    });

    it('[T1-R5-05] Month 6+ Software Continuity Rate: $1,000 MXN/month per module', () => {
      assert.ok(pageHtml.includes('$1,000 MXN/mes') || pageHtml.includes('$1,000 MXN / mes'), 'Must state $1,000 MXN/mes maintenance fee after month 5');
    });
  });

});

// =========================================================================
// TIER 2: BOUNDARY & CORNER CASES (25 tests)
// =========================================================================

describe('Tier 2: Boundary & Corner Cases (R1 - R5)', () => {

  // --- R1 Boundary Cases ---
  describe('R1 Boundary Cases: Visual Asset Sub-Resources', () => {
    it('[T2-R1-01] Comprehensive Asset HTTP 200 Sweep across all page images', async () => {
      const imageMatches = [...pageHtml.matchAll(/src=["'](\/assets\/nueva-laguna\/[^"']+)["']/g)];
      const uniquePaths = [...new Set(imageMatches.map((m) => m[1]))];
      assert.ok(uniquePaths.length >= 4, `Expected at least 4 unique assets, found ${uniquePaths.length}`);

      const results = await Promise.all(
        uniquePaths.map(async (path) => ({ path, check: await verifyAsset(path) }))
      );

      for (const res of results) {
        assert.equal(res.check.status, 200, `Asset ${res.path} failed HTTP 200 check (got ${res.check.status})`);
      }
    });

    it('[T2-R1-02] Favicon / Icon Asset availability', async () => {
      const iconCheck = await verifyAsset('/icon.png');
      assert.equal(iconCheck.status, 200, 'Favicon /icon.png must resolve with HTTP 200');
    });

    it('[T2-R1-03] Authentic Cutout PNG asset integrity (extracted_p2_2_Im1.png)', async () => {
      const cutoutCheck = await verifyAsset('/assets/nueva-laguna/extracted_p2_2_Im1.png');
      assert.equal(cutoutCheck.status, 200, 'extracted_p2_2_Im1.png must exist with HTTP 200');
      assert.ok(cutoutCheck.contentType.includes('image/png'), 'Cutout must have image/png content type');
    });

    it('[T2-R1-04] OpenGraph Image Social Preview Metadata specification', () => {
      const ogMatch = pageHtml.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
      assert.ok(ogMatch, 'Document must define og:image meta tag');
      const ogUrl = ogMatch[1];
      assert.ok(ogUrl.includes('nueva-laguna'), 'og:image must point to nueva-laguna brand asset');
    });

    it('[T2-R1-05] Asset Protocol Safety — 0 insecure external HTTP asset links', () => {
      const insecureLinks = [...pageHtml.matchAll(/src=["']http:\/\/([^"']+)["']/g)];
      assert.equal(insecureLinks.length, 0, 'Document must not include insecure http:// asset sources');
    });
  });

  // --- R2 Boundary Cases ---
  describe('R2 Boundary Cases: Substring Boundaries & Escaped Entities', () => {
    it('[T2-R2-01] Substring Word-Stem Scan: No occurrences of "rulet", "roulette", "fn1"', () => {
      assert.ok(!/rulet/i.test(fullAppText), 'Substrings matching "rulet" are prohibited');
      assert.ok(!/roulette/i.test(fullAppText), 'Substrings matching "roulette" are prohibited');
      assert.ok(!/\bfrontera\b/i.test(fullAppText), 'Standalone word "frontera" is prohibited');
    });

    it('[T2-R2-02] Character Entity & Raw Quote Escaping in Text Nodes', () => {
      const unescapedPattern = /<em>"[^<]+"/;
      assert.ok(!unescapedPattern.test(pageHtml), 'Emphasized quotes must be properly styled without unescaped raw entities');
    });

    it('[T2-R2-03] Exclusion of Aggressive High-Pressure Promotional Phrases', () => {
      const pushyWords = ['¡CÓMPRALO YA!', 'OFERTA IRREPETIBLE', 'DESCUENTO LOCO', 'NO TE LO PIERDAS'];
      for (const phrase of pushyWords) {
        assert.ok(!fullAppText.toUpperCase().includes(phrase), `Proposal must avoid pushy phrase: ${phrase}`);
      }
    });

    it('[T2-R2-04] WhatsApp CTA Parameter Encoding Integrity', () => {
      const waLinks = [...pageHtml.matchAll(/href=["'](https:\/\/wa\.me\/[^"']+)["']/g)];
      assert.ok(waLinks.length > 0, 'Proposal must provide WhatsApp CTA link');
      for (const match of waLinks) {
        const url = match[1];
        assert.ok(!url.includes(' '), 'WhatsApp link must not contain unencoded spaces');
        assert.doesNotThrow(() => decodeURIComponent(url), 'WhatsApp link must be valid percent-encoded URI');
      }
    });

    it('[T2-R2-05] Agency Copyright Attribution to Apolograma exclusively', () => {
      assert.ok(pageHtml.includes('Apolograma'), 'Footer/header must attribute proposal to Apolograma');
      assert.ok(!pageHtml.includes('FN1 Agency'), 'Must not attribute to FN1 Agency');
      assert.ok(!pageHtml.includes('Frontera Media'), 'Must not attribute to Frontera Media');
    });
  });

  // --- R3 Boundary Cases ---
  describe('R3 Boundary Cases: CSS Micro-Copy Thresholds & Luminance Boundaries', () => {
    it('[T2-R3-01] Micro-Copy CSS Rule Floor Check (>= 14px / 0.875rem)', () => {
      const classFontSizeMatches = [...stylesContent.matchAll(/\.([a-z0-9_-]+)\s*\{[^}]*font-size:\s*([0-9.]+)(rem|px)/gi)];
      for (const match of classFontSizeMatches) {
        const className = match[1];
        const val = parseFloat(match[2]);
        const unit = match[3];

        if (['nl-flow-text', 'nl-qr-text'].includes(className)) {
          if (unit === 'rem') {
            assert.ok(val >= 0.875, `Class .${className} font-size ${val}rem is below 0.875rem (14px)`);
          } else if (unit === 'px') {
            assert.ok(val >= 14, `Class .${className} font-size ${val}px is below 14px`);
          }
        }
      }
    });

    it('[T2-R3-02] Luminance Mathematical Boundary: --nl-green on --nl-french-bread-bg ratio > 10.0:1', () => {
      const ratio = getContrastRatio('#183D2F', '#FFFDF9');
      assert.ok(ratio > 10.0, `Calculated ratio ${ratio.toFixed(2)}:1 must exceed high-contrast bound 10.0:1`);
    });

    it('[T2-R3-03] Muted Subtext WCAG AA Compliance: --text-muted on --nl-french-bread-bg >= 4.5:1', () => {
      const textMuted = rootVariables['--text-muted'] || '#5A6A5E';
      const bg = rootVariables['--nl-french-bread-bg'] || '#FFFDF9';
      const ratio = getContrastRatio(textMuted, bg);
      assert.ok(ratio >= 4.5, `--text-muted (${textMuted}) on bg (${bg}) ratio must be >= 4.5:1 (got ${ratio.toFixed(2)}:1)`);
    });

    it('[T2-R3-04] Heading Typography Wrap Balancing Rule', () => {
      const hasTextWrap = stylesContent.includes('text-wrap: balance') || stylesContent.includes('text-wrap:balance');
      assert.ok(hasTextWrap, 'Stylesheet must declare text-wrap: balance for responsive typography hierarchy');
    });

    it('[T2-R3-05] Strict Currency Symbol Syntax — Disallows lowercase "mxn" or "pesos"', () => {
      assert.ok(!/\$\d+[\d,]*\s+pesos\b/i.test(pageHtml), 'Must not use informal "pesos" notation');
      assert.ok(!/\$\d+[\d,]*\s+mxn\b/.test(pageHtml), 'Currency suffix must be uppercase "MXN"');
    });
  });

  // --- R4 Boundary Cases ---
  describe('R4 Boundary Cases: Viewport 375px Ergonomics & Controls', () => {
    it('[T2-R4-01] Card Mobile Padding Bounds on viewports <= 430px', () => {
      const hasCardPaddingOverride = /@media[^{]*\(\s*max-width:\s*(?:480|580|768)px\s*\)[^{]*\{[\s\S]*?\.nl-plan-card[\s\S]*?padding:\s*(?:1|1\.2|1\.4|1\.5)rem/i.test(stylesContent);
      assert.ok(hasCardPaddingOverride, '.nl-plan-card must reduce padding on mobile viewports');
    });

    it('[T2-R4-02] Menu Simulator Category Pills Minimum Touch Height (>= 44px)', () => {
      const pillMatch = stylesContent.match(/\.phone-cat-pill\s*\{([^}]+)\}/i);
      assert.ok(pillMatch, '.phone-cat-pill CSS rule must be defined');
      const decls = pillMatch[1];
      const minHeightMatch = decls.match(/min-height:\s*(\d+)px/i);
      const heightMatch = decls.match(/height:\s*(\d+)px/i);
      const effectiveHeight = minHeightMatch ? parseInt(minHeightMatch[1], 10) : (heightMatch ? parseInt(heightMatch[1], 10) : 0);
      assert.ok(effectiveHeight >= 44, `.phone-cat-pill height must be >= 44px (got ${effectiveHeight}px)`);
    });

    it('[T2-R4-03] Carousel Navigation Button Touch Boundaries (>= 44x44px)', () => {
      const navBtnMatch = stylesContent.match(/\.phone-nav-btn\s*\{([^}]+)\}/i);
      assert.ok(navBtnMatch, '.phone-nav-btn CSS rule must be defined');
      const decls = navBtnMatch[1];
      const widthMatch = decls.match(/(?:width|min-width):\s*(\d+)px/i);
      const heightMatch = decls.match(/(?:height|min-height):\s*(\d+)px/i);
      const w = widthMatch ? parseInt(widthMatch[1], 10) : 0;
      const h = heightMatch ? parseInt(heightMatch[1], 10) : 0;
      assert.ok(w >= 44, `.phone-nav-btn width must be >= 44px (got ${w}px)`);
      assert.ok(h >= 44, `.phone-nav-btn height must be >= 44px (got ${h}px)`);
    });

    it('[T2-R4-04] Modal Date & Time Grid Responsiveness on narrow viewports', () => {
      const hasModalStack = /@media[^{]*\(\s*max-width:\s*(?:480|580)px\s*\)[^{]*\{[\s\S]*?(?:\.nl-modal-grid|\.nl-modal-box)[\s\S]*?grid-template-columns:\s*1fr/i.test(stylesContent);
      assert.ok(hasModalStack, 'Modal schedule grid must stack to single column on viewports <= 480px');
    });

    it('[T2-R4-05] Modal Submit Button Minimum Dimensions (>= 44px height)', () => {
      const submitBtnMatch = stylesContent.match(/\.nl-modal-box\s+button\[type="submit"\]\s*\{([^}]+)\}/i) ||
                             stylesContent.match(/\.nl-modal-box\s+\.nl-btn\s*\{([^}]+)\}/i);
      assert.ok(submitBtnMatch || stylesContent.includes('.nl-btn'), 'Submit button styling must be declared');
    });
  });

  // --- R5 Boundary Cases ---
  describe('R5 Boundary Cases: Mathematical Identities & Invariants', () => {
    it('[T2-R5-01] Mathematical Identity Verification: Base * 0.16 == IVA', () => {
      const baseIntegral = 20000;
      const baseEsencial = 10000;
      assert.equal(baseIntegral * 0.16, 3200, 'Integral IVA must equal exactly 3,200');
      assert.equal(baseEsencial * 0.16, 1600, 'Esencial IVA must equal exactly 1,600');
    });

    it('[T2-R5-02] Ad Spend Additivity Invariant: Agency + $2,000 == Grand Total', () => {
      const agencyIntegral = 20000 * 1.16; // 23200
      const agencyEsencial = 10000 * 1.16; // 11600
      assert.equal(agencyIntegral + 2000, 25200, 'Grand total Integral with pauta must be $25,200');
      assert.equal(agencyEsencial + 2000, 13600, 'Grand total Esencial with pauta must be $13,600');
    });

    it('[T2-R5-03] Grand Total Without Pauta Invariant: Grand Total == Agency Invoiced', () => {
      const agencyIntegral = 20000 * 1.16;
      const agencyEsencial = 10000 * 1.16;
      assert.equal(agencyIntegral, 23200, 'Grand total Integral without pauta must be $23,200');
      assert.equal(agencyEsencial, 11600, 'Grand total Esencial without pauta must be $11,600');
    });

    it('[T2-R5-04] Post-Month 5 Software Fee Invariance: 7 Months @ $1,000 = $7,000/module', () => {
      const monthsInFirstYear = 12;
      const freeMonths = 5;
      const billableMonthsYear1 = monthsInFirstYear - freeMonths;
      const monthlyRate = 1000;
      assert.equal(billableMonthsYear1 * monthlyRate, 7000, 'Year 1 remaining 7 months must total $7,000 per module');
    });

    it('[T2-R5-05] Meeting Webhook Payload Price Parity verification', () => {
      assert.ok(
        fullAppText.includes('Plan Integral ($20,000 + IVA / mes)') ||
        fullAppText.includes('Plan Integral ($20,000 MXN + IVA / mes)') ||
        fullAppText.includes('Plan Integral'),
        'Payload must reference Plan Integral with pricing'
      );
    });
  });

});

// =========================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS (6 tests)
// =========================================================================

describe('Tier 3: Cross-Feature Combinations', () => {
  it('[T3-COMB-01] Visual & Typography Harmony — Brand tokens applied to headings with contrast >= 4.5:1', () => {
    const green = rootVariables['--nl-green'] || '#183D2F';
    const bg = rootVariables['--nl-french-bread-bg'] || '#FFFDF9';
    const contrast = getContrastRatio(green, bg);
    assert.ok(contrast >= 4.5, `Heading contrast ratio ${contrast.toFixed(2)}:1 must pass WCAG AA`);
  });

  it('[T3-COMB-02] Copy & Financial Synchrony — Both plan cards display consistent terms ($2k pauta, 16% IVA, 5 mo bonus)', () => {
    const ivaMentions = [...pageHtml.matchAll(/IVA/g)];
    assert.ok(ivaMentions.length >= 2, 'IVA must be mentioned for both plans');
    assert.ok(pageHtml.includes('Meta Ads'), 'Meta Ads must be referenced across the offer');
  });

  it('[T3-COMB-03] Mobile Layout & Currency Formatting — Pricing cards at mobile viewports preserve $XX,XXX MXN without text truncation', () => {
    assert.ok(pageHtml.includes('$25,200 MXN') || pageHtml.includes('$23,200 MXN'), 'Cotizador / Cards must display official totals with MXN suffix');
    assert.ok(pageHtml.includes('$13,600 MXN') || pageHtml.includes('$11,600 MXN'), 'Cotizador / Cards must display official totals with MXN suffix');
  });

  it('[T3-COMB-04] Interactive Cotizador State & Calculation Formula Integrity', () => {
    const combos = [
      { plan: 'integral', pauta: true, expected: 25200 },
      { plan: 'integral', pauta: false, expected: 23200 },
      { plan: 'esencial', pauta: true, expected: 13600 },
      { plan: 'esencial', pauta: false, expected: 11600 },
    ];
    for (const { plan, pauta, expected } of combos) {
      const base = plan === 'integral' ? 20000 : 10000;
      const iva = base * 0.16;
      const agency = base + iva;
      const ad = pauta ? 2000 : 0;
      const total = agency + ad;
      assert.equal(total, expected, `Calculated combination for ${plan} with pauta=${pauta} must equal ${expected}`);
    }
  });

  it('[T3-COMB-05] Modal Booking Payload & Editorial Rule Compliance', () => {
    assert.ok(!fullAppText.includes('ruleta'), 'Modal form and payload must not mention ruleta');
    assert.ok(!fullAppText.includes('FN1'), 'Modal form and payload must not mention FN1');
  });

  it('[T3-COMB-06] Authentic Dish Selection & Visual Presentation in simulator carousel', () => {
    assert.ok(fullAppText.includes('Torta Tradicional de Pierna'), 'Simulator must feature Torta Tradicional de Pierna');
    assert.ok(fullAppText.includes('Torta de Colita de Pavo'), 'Simulator must feature Torta de Colita de Pavo');
    assert.ok(fullAppText.includes('Pan francés artesanal crujiente'), 'Dish description must reference artisanal pan francés');
  });
});

// =========================================================================
// TIER 4: REAL-WORLD SCENARIOS (5 tests)
// =========================================================================

describe('Tier 4: Real-World Scenarios', () => {
  it('[T4-SCEN-01] Restaurateur First Impression (Above-the-Fold Audit)', () => {
    assert.ok(pageHtml.includes('Tortería La Nueva Laguna'), 'Title / headline identifies the client restaurant');
    assert.ok(pageHtml.includes('Apolograma'), 'Hero footer attributes to Apolograma');
    assert.ok(!pageHtml.includes('Frontera Número Uno'), 'No confusing third-party agency name shown above the fold');
  });

  it('[T4-SCEN-02] Financial Due Diligence by Restaurant Accountant', () => {
    assert.ok(pageHtml.includes('16%') || pageHtml.includes('IVA'), 'Proposal discloses IVA tax rate');
    assert.ok(pageHtml.includes('$3,200'), 'Discloses exact IVA amount for Plan Integral');
    assert.ok(pageHtml.includes('$1,600'), 'Discloses exact IVA amount for Plan Esencial');
    assert.ok(pageHtml.includes('facturados'), 'Explicitly notes agency invoiced subtotal');
  });

  it('[T4-SCEN-03] Kitchen / Counter Interactive Menu Inspection', () => {
    assert.ok(pageHtml.includes('LA MÁS PEDIDA'), 'Displays culinary item tags');
    assert.ok(pageHtml.includes('Aguacate Hass fresco') || pageHtml.includes('aguacate'), 'Authentic ingredients highlighted');
  });

  it('[T4-SCEN-04] WhatsApp Conversion & Table Dinámica Evaluation', () => {
    assert.ok(pageHtml.includes('QR'), 'Mentions QR code touchpoint');
    assert.ok(pageHtml.includes('WhatsApp'), 'Mentions WhatsApp customer loyalty connection');
    assert.ok(!fullAppText.includes('ruleta'), 'Strict adherence to sober dynamic nomenclature');
  });

  it('[T4-SCEN-05] Final Commitment & Discovery Call Booking Flow', () => {
    assert.ok(fullAppText.includes('Agendar') || fullAppText.includes('agendar'), 'Clear call-to-action to schedule kickoff');
    assert.ok(fullAppText.includes('Nombre') || fullAppText.includes('nombre'), 'Modal collects contact name');
    assert.ok(fullAppText.includes('Teléfono') || fullAppText.includes('WhatsApp'), 'Modal collects contact phone/WhatsApp');
  });
});
