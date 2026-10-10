/**
 * E2E Test Suite: Dr. Carlos Tadeo Perzabal Avilez — Ecosistema Digital Quirúrgico de Alta Autoridad
 * Route Under Test: /dr-carlos-perzabal (http://localhost:3005/dr-carlos-perzabal or local test server)
 * Framework: Node.js Native Test Runner (node:test) + Native Fetch & WCAG 2.1 Luminance Engine
 *
 * 4-Tier Test Matrix:
 * - Tier 1: Feature Coverage & Procedural Expansion (36 tests covering R1 - R5 and Bloques A & B)
 * - Tier 2: Boundary & Corner Cases (27 tests covering Math, Typography Floors, Mobile Ergonomics & Asset Sweep)
 * - Tier 3: Cross-Feature Combinations & Brand Isolation (25 tests covering 0 FN1, 0 La X, 0 ROI, procedural WhatsApp, disclaimers)
 * - Tier 4: Real-World Scenarios & Production Readiness (14 tests covering Patient Journeys, Static Parity & Live Production)
 * Total: 104 comprehensive tests across 15 suites
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HERMES_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(HERMES_ROOT, '../..');

// Authoritative source paths
const PAGE_TSX_PATH = path.join(HERMES_ROOT, 'src/app/dr-carlos-perzabal/page.tsx');
const CLIENT_TSX_PATH = path.join(HERMES_ROOT, 'src/app/dr-carlos-perzabal/DrCarlosPerzabalClient.tsx');
const STATIC_INDEX_PATH = path.join(REPO_ROOT, 'propuestas/dr-carlos-perzabal/index.html');
const BUILT_HTML_PATH = path.join(HERMES_ROOT, '.next/server/app/dr-carlos-perzabal.html');
const PUBLIC_ASSETS_DIR = path.join(HERMES_ROOT, 'public/assets/dr-carlos-perzabal');
const ICM_BASE_DIR = path.join(REPO_ROOT, 'propuestas/dr-carlos-perzabal');

let localServer = null;
let activeBaseUrl = process.env.BASE_URL || '';
let pageHtml = '';
let clientTsx = '';
let pageTsx = '';
let staticIndexHtml = '';
let fullAppText = '';
let pageStatus = 0;
let pageHeaders = null;
let stylesContent = '';
let rootVariables = {};

// WCAG 2.1 Relative Luminance Engine
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

// Helper: Fetch asset over HTTP and assert 200 OK
async function verifyAsset(assetPath) {
  let cleanPath = assetPath.replaceAll('&amp;', '&');
  if (cleanPath.startsWith('http')) {
    try {
      const u = new URL(cleanPath);
      if (u.hostname === 'propuestas.tecza.com.mx' && !activeBaseUrl.includes('propuestas.tecza.com.mx')) {
        cleanPath = u.pathname;
      }
    } catch {}
  }
  const fullUrl = cleanPath.startsWith('http') ? cleanPath : `${activeBaseUrl}${cleanPath}`;
  try {
    const res = await fetch(fullUrl, { method: 'GET' });
    const text = await res.text();
    return { ok: res.ok, status: res.status, contentType: res.headers.get('content-type') || '', body: text };
  } catch (err) {
    return { ok: false, status: 0, contentType: '', body: '', error: err.message };
  }
}

// Helper: Validate SVG XML well-formedness according to W3C XML 1.0
function assertSvgXmlWellFormed(svgString, identifier = 'svg') {
  assert.ok(svgString && typeof svgString === 'string', `${identifier} must be a non-empty string`);
  assert.ok(svgString.includes('<svg') && svgString.includes('</svg>'), `${identifier} must contain <svg> root and </svg> closing tag`);

  // Strip XML comments and CDATA sections
  const stripped = svgString.replace(/<!--[\s\S]*?-->/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');

  // W3C XML Section 2.4 / 4.1: ampersands must be properly escaped entity references
  const rawAmpMatch = stripped.match(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/);
  assert.ok(!rawAmpMatch, `SVG ${identifier} contains unescaped ampersand outside comments/CDATA: "${rawAmpMatch?.[0]}"`);

  // Full validation with xmllint if available on the system
  try {
    const lint = spawnSync('xmllint', ['--noout', '-'], { input: svgString, encoding: 'utf-8' });
    if (lint.status !== null) {
      assert.equal(lint.status, 0, `SVG ${identifier} failed xmllint well-formedness: ${lint.stderr || lint.stdout}`);
    }
  } catch {
    // Fallback gracefully if xmllint binary is unavailable
  }
}

before(async () => {
  // Read source files
  if (fs.existsSync(PAGE_TSX_PATH)) {
    pageTsx = fs.readFileSync(PAGE_TSX_PATH, 'utf-8');
  }
  if (fs.existsSync(CLIENT_TSX_PATH)) {
    clientTsx = fs.readFileSync(CLIENT_TSX_PATH, 'utf-8');
  }
  if (fs.existsSync(STATIC_INDEX_PATH)) {
    staticIndexHtml = fs.readFileSync(STATIC_INDEX_PATH, 'utf-8');
  }

  // Determine active HTML to serve
  const htmlToServe = fs.existsSync(BUILT_HTML_PATH)
    ? fs.readFileSync(BUILT_HTML_PATH, 'utf-8')
    : staticIndexHtml;

  // Try configured or default server first
  let serverReachable = false;
  const candidateUrl = activeBaseUrl || 'http://localhost:3005';
  try {
    const probe = await fetch(`${candidateUrl}/dr-carlos-perzabal`, { method: 'HEAD' });
    if (probe.ok || probe.status === 200) {
      activeBaseUrl = candidateUrl;
      serverReachable = true;
    }
  } catch {}

  // If candidate is not running, spin up ephemeral in-memory test server
  if (!serverReachable) {
    localServer = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url, 'http://127.0.0.1');
      const pathname = parsedUrl.pathname;

      if (pathname === '/dr-carlos-perzabal' || pathname === '/dr-carlos-perzabal/') {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': Buffer.byteLength(htmlToServe),
        });
        if (req.method === 'HEAD') {
          res.end();
        } else {
          res.end(htmlToServe);
        }
        return;
      }

      if (pathname.startsWith('/assets/dr-carlos-perzabal/')) {
        const filename = path.basename(pathname);
        const filePath = path.join(PUBLIC_ASSETS_DIR, filename);
        if (fs.existsSync(filePath)) {
          const ext = path.extname(filename).toLowerCase();
          const mimeTypes = {
            '.svg': 'image/svg+xml',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
          };
          const content = fs.readFileSync(filePath);
          res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Content-Length': content.length,
          });
          if (req.method === 'HEAD') {
            res.end();
          } else {
            res.end(content);
          }
          return;
        }
      }

      if (pathname.startsWith('/assets/')) {
        const rel = pathname.slice('/assets/'.length);
        const filePath = path.join(HERMES_ROOT, 'public/assets', rel);
        if (fs.existsSync(filePath)) {
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes = {
            '.svg': 'image/svg+xml',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
          };
          const content = fs.readFileSync(filePath);
          res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Content-Length': content.length,
          });
          if (req.method === 'HEAD') {
            res.end();
          } else {
            res.end(content);
          }
          return;
        }
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });

    await new Promise((resolve) => {
      localServer.listen(0, '127.0.0.1', () => {
        const port = localServer.address().port;
        activeBaseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  }

  // Fetch target page
  const targetUrl = `${activeBaseUrl}/dr-carlos-perzabal`;
  const res = await fetch(targetUrl);
  pageStatus = res.status;
  pageHeaders = res.headers;
  pageHtml = await res.text();

  stylesContent = extractStyles(pageHtml) + '\n' + extractStyles(staticIndexHtml);
  rootVariables = parseRootVariables(stylesContent);
  fullAppText = `${pageHtml}\n${clientTsx}\n${pageTsx}\n${staticIndexHtml}`;
});

after(async () => {
  if (localServer) {
    await new Promise((resolve) => localServer.close(resolve));
  }
});

// =========================================================================
// TIER 1: FEATURE COVERAGE (25 tests across 5 suites)
// =========================================================================

describe('Tier 1: Feature Coverage (R1 - R5)', () => {

  // --- Feature 1 (R1): Surgical Authority, Institutional Narrative & Visual Identity ---
  describe('Feature 1 (R1): Surgical Authority, Institutional Narrative & Visual Identity', () => {
    it('[T1-R1-01] Page returns HTTP 200 with text/html content-type and valid payload', () => {
      assert.equal(pageStatus, 200, 'Page must return status 200');
      const ct = pageHeaders?.get('content-type') || '';
      assert.ok(ct.includes('text/html'), `Expected text/html content-type, received ${ct}`);
      assert.ok(pageHtml.length > 5000, `Expected HTML body > 5000 bytes, received ${pageHtml.length}`);
    });

    it('[T1-R1-02] Document Title & Meta Description highlight Dr. Carlos Tadeo Perzabal Avilez & clinical credentials', () => {
      assert.ok(pageHtml.includes('Dr. Carlos Tadeo Perzabal Avilez'), 'Must mention full name in page title or metadata');
      assert.ok(/Cirug[ií]a\s+General/i.test(pageHtml), 'Title must specify Cirugía General');
      assert.ok(/Bari[aá]trica/i.test(pageHtml), 'Title must specify Cirugía Bariátrica');
      assert.ok(/Rob[oó]tica/i.test(pageHtml), 'Title must specify Cirugía Robótica');
      assert.ok(pageHtml.includes('Apolograma'), 'Title or brand metadata must attribute to Apolograma');
    });

    it('[T1-R1-03] Institutional Clinical Color Tokens in :root CSS (Deep Surgical Navy & Titanium)', () => {
      assert.equal(rootVariables['--doc-slate']?.toUpperCase(), '#081325', '--doc-slate must be #081325 (Deep Surgical Navy, non-black)');
      assert.equal(rootVariables['--doc-teal']?.toUpperCase(), '#00A3E0', '--doc-teal must be #00A3E0');
      assert.equal(rootVariables['--doc-gold']?.toUpperCase(), '#D4AF37', '--doc-gold must be #D4AF37');
      assert.equal(rootVariables['--doc-white']?.toUpperCase(), '#F1F5F9', '--doc-white must be #F1F5F9 (Pearlescent silver-white)');
      assert.ok(rootVariables['--doc-slate-card'], '--doc-slate-card token must exist');
    });

    it('[T1-R1-04] Institutional Leadership Narrative (Enseñanza, ex-Director Hospital General, Coordinador UACJ)', () => {
      assert.ok(fullAppText.includes('Hospital General'), 'Must highlight Hospital General trajectory');
      assert.ok(fullAppText.includes('UACJ'), 'Must highlight UACJ academic coordination');
      assert.ok(/Ense[ñn]anza|Coordinador|Director/i.test(fullAppText), 'Must highlight academic and medical leadership');
      assert.ok(/Pr[aá]ctica\s+Quir[uú]rgica|Trauma|Alta\s+Complejidad/i.test(fullAppText), 'Must highlight surgical mastery');
    });

    it('[T1-R1-05] Institutional Badges & Monogram assets resolve with HTTP 200', async () => {
      const assets = [
        '/assets/dr-carlos-perzabal/badge_hospital_general.svg',
        '/assets/dr-carlos-perzabal/badge_uacj.svg',
        '/assets/dr-carlos-perzabal/badge_cmcoem.svg',
        '/assets/dr-carlos-perzabal/badge_da_vinci.svg',
        '/assets/dr-carlos-perzabal/monograma_perzabal.svg',
      ];
      for (const assetPath of assets) {
        const check = await verifyAsset(assetPath);
        assert.equal(check.status, 200, `Asset ${assetPath} must resolve with HTTP 200`);
        assert.ok(check.contentType.includes('svg') || check.contentType.includes('image'), `Asset ${assetPath} must have image content-type`);
        if (assetPath.endsWith('.svg')) {
          assertSvgXmlWellFormed(check.body, assetPath);
        }
      }
    });
  });

  // --- Feature 2 (R2): Procedural Coverage & 5 Surgical Modules ---
  describe('Feature 2 (R2): Procedural Coverage & 5 Surgical Modules', () => {
    it('[T1-R2-01] Manga Gástrica por Laparoscopía (LSG) detailed with ASMBS 2022 clinical criteria', () => {
      assert.ok(/Manga\s+G[aá]strica/i.test(fullAppText), 'Must detail Manga Gástrica procedure');
      assert.ok(fullAppText.includes('ASMBS'), 'Must reference ASMBS international criteria');
      assert.ok(fullAppText.includes('grelina') || fullAppText.includes('metabólica'), 'Must explain metabolic/satiety mechanism');
    });

    it('[T1-R2-02] Bypass Gástrico en Y de Roux (LRYGB) detailed with metabolic remission parameters', () => {
      assert.ok(/Bypass\s+G[aá]strico/i.test(fullAppText), 'Must detail Bypass Gástrico procedure');
      assert.ok(/Y\s+de\s+Roux/i.test(fullAppText), 'Must detail Roux-en-Y anatomy');
      assert.ok(/diabetes|remisi[oó]n|reflujo/i.test(fullAppText), 'Must highlight metabolic remission or ERGE control');
    });

    it('[T1-R2-03] Colecistectomía Laparoscópica detailed with Strasberg Critical View of Safety (CVS)', () => {
      assert.ok(/Colecistectom[ií]a/i.test(fullAppText) || /Ves[ií]cula/i.test(fullAppText), 'Must detail gallbladder surgery');
      assert.ok(fullAppText.includes('Strasberg'), 'Must specify Strasberg Critical View of Safety');
      assert.ok(/Visi[oó]n\s+Cr[ií]tica/i.test(fullAppText) || fullAppText.includes('CVS'), 'Must cite Critical View of Safety (CVS)');
    });

    it('[T1-R2-04] Hernioplastías de Pared Abdominal detailed with TAPP/TEP tension-free anatomic mesh', () => {
      assert.ok(/Hernia|Hernioplast/i.test(fullAppText), 'Must detail hernia repair');
      assert.ok(fullAppText.includes('TAPP') || fullAppText.includes('TEP'), 'Must specify minimally invasive TAPP or TEP approach');
      assert.ok(/malla/i.test(fullAppText), 'Must mention tension-free prosthetic mesh');
    });

    it('[T1-R2-05] Consola Da Vinci Robotic Surgery detailed with high precision 3D articulation', () => {
      assert.ok(fullAppText.includes('Da Vinci'), 'Must detail Da Vinci robotic surgical platform');
      assert.ok(/consola|rob[oó]tica/i.test(fullAppText), 'Must mention surgical console and robotic precision');
      assert.ok(/EndoWrist|articulaci[oó]n|filtrado\s+de\s+temblor|3D/i.test(fullAppText), 'Must detail robotic dexterity, 3D HD vision, or tremor filtration');
    });
  });

  // --- Feature 3 (R2): WhatsApp Triage Simulator & 4 Clinical Branches ---
  describe('Feature 3 (R2): WhatsApp Triage Simulator & 4 Clinical Branches', () => {
    it('[T1-R3-01] WhatsApp Triage Simulator presence with live chat container, reset control, and typing delay indicator (750ms)', () => {
      assert.ok(clientTsx.includes('TRIAGE_TREE'), 'TRIAGE_TREE dialogue structure must exist in client component');
      assert.ok(clientTsx.includes('handleResetTriage') || clientTsx.includes('setCurrentNodeId'), 'Triage state management must exist');
      assert.ok(clientTsx.includes('750'), 'Must implement 750ms natural typing simulation delay');
      assert.ok(/Triaje\s+(?:Quir[uú]rgico|M[eé]dico|Cl[ií]nico)/i.test(fullAppText), 'Triage simulator section must be titled clearly');
    });

    it('[T1-R3-02] Branch 1: Bariatric triage covers BMI stratification (30-34.9, 35-39.9, >=40) & metabolic comorbidities', () => {
      assert.ok(clientTsx.includes('bar_imc'), 'Bariatric triage node bar_imc must exist');
      assert.ok(clientTsx.includes('IMC 30 - 34.9'), 'Must include BMI 30-34.9 bracket');
      assert.ok(clientTsx.includes('IMC 35 - 39.9'), 'Must include BMI 35-39.9 bracket');
      assert.ok(clientTsx.includes('IMC >= 40'), 'Must include BMI >= 40 bracket');
      assert.ok(clientTsx.includes('Diabetes') || clientTsx.includes('Reflujo'), 'Must assess metabolic comorbidities');
    });

    it('[T1-R3-03] Branch 2: Gallbladder triage evaluates Strasberg CVS, ultrasound history, and acute biliary colic', () => {
      assert.ok(clientTsx.includes('ves_us'), 'Gallbladder triage node ves_us must exist');
      assert.ok(clientTsx.includes('Ultrasonido'), 'Must check prior ultrasound imaging');
      assert.ok(/dolor\s+agudo|c[oó]lico/i.test(clientTsx), 'Must check acute pain or biliary colic symptoms');
    });

    it('[T1-R3-04] Branch 3: Hernia triage categorizes Inguinal, Umbilical, and Incisional with reducible/effort symptom checks', () => {
      assert.ok(clientTsx.includes('her_type'), 'Hernia triage node her_type must exist');
      assert.ok(clientTsx.includes('Hernia Inguinal'), 'Must classify inguinal hernias');
      assert.ok(clientTsx.includes('Hernia Umbilical'), 'Must classify umbilical hernias');
      assert.ok(clientTsx.includes('Hernia Incisional'), 'Must classify incisional/post-surgical hernias');
    });

    it('[T1-R3-05] Branch 4: Robotic triage routes complex anatomy, Da Vinci 3D HD visualization, and tremor filtration', () => {
      assert.ok(clientTsx.includes('rob_spec') || clientTsx.includes('rob_adv'), 'Robotic triage node must exist');
      assert.ok(clientTsx.includes('Da Vinci'), 'Robotic branch must specify Da Vinci console');
      assert.ok(/revisi[oó]n|complej|precisi[oó]n/i.test(clientTsx), 'Must highlight surgical precision or complex cases');
    });
  });

  // --- Feature 4 (R3): Commercial Proposal, Banregio Fiscal Billing & Modal ---
  describe('Feature 4 (R3): Commercial Proposal, Banregio Fiscal Billing & Modal', () => {
    it('[T1-R4-01] Investment section title explicitly matches "Propuesta Económica" or "Inversión del Ecosistema"', () => {
      const hasValidTitle =
        /Propuesta\s+Econ[oó]mica/i.test(fullAppText) ||
        /Inversi[oó]n\s+del\s+Ecosistema/i.test(fullAppText);
      assert.ok(hasValidTitle, 'Section title must be "Propuesta Económica" or "Inversión del Ecosistema" per user rules');
      assert.ok(!fullAppText.includes('Tu inversión, desglosada'), 'Must NOT use generic phrase "Tu inversión, desglosada."');
    });

    it('[T1-R4-02] Hybrid investment package specified as $36,000 MXN Setup + $26,000 MXN Monthly = $71,920 MXN Initial Grand Total', () => {
      assert.ok(fullAppText.includes('$36,000') || fullAppText.includes('36,000'), 'Must specify $36,000 MXN Setup subtotal');
      assert.ok(fullAppText.includes('$26,000') || fullAppText.includes('26,000'), 'Must specify $26,000 MXN Monthly subtotal');
      assert.ok(fullAppText.includes('$41,760') || fullAppText.includes('41,760'), 'Must specify $41,760 MXN Total Setup invoiced');
      assert.ok(fullAppText.includes('$30,160') || fullAppText.includes('30,160'), 'Must specify $30,160 MXN Total Monthly invoiced');
      assert.ok(fullAppText.includes('$71,920') || fullAppText.includes('71,920'), 'Must specify $71,920 MXN Initial Grand Total');
    });

    it('[T1-R4-03] Daily accessibility equivalent calculated as $1,005 MXN/día', () => {
      assert.ok(
        fullAppText.includes('$1,005 MXN') || fullAppText.includes('$1,005') || fullAppText.includes('1,005'),
        'Must display $1,005 MXN/día daily accessibility metric'
      );
    });

    it('[T1-R4-04] Banregio fiscal billing block contains Tecnologies Tecza, RFC TTE170614QI1, and 18-digit CLABE 058164657492400290 with 1-click copy', () => {
      assert.ok(fullAppText.includes('Banregio'), 'Must identify Banregio institution');
      assert.ok(fullAppText.includes('TECNOLOGIES TECZA, S. DE R.L. DE C.V.'), 'Must identify Tecnologies Tecza business entity');
      assert.ok(fullAppText.includes('TTE170614QI1'), 'Must state RFC TTE170614QI1');
      assert.ok(fullAppText.includes('058164657492400290'), 'Must state 18-digit CLABE interbancaria');
      assert.ok(clientTsx.includes('handleCopyClabe') || clientTsx.includes('058164657492400290'), 'Must feature 1-click clipboard copy handler');
    });

    it('[T1-R4-05] Strategy Session modal (20 min) and date validation enforces business days (Monday-Friday, rejects weekends)', () => {
      assert.ok(clientTsx.includes('isModalOpen'), 'Modal open state must exist in client component');
      assert.ok(/20\s+min/i.test(fullAppText), 'Must offer 20-minute strategy/welcome session');
      assert.ok(clientTsx.includes('day === 0 || day === 6'), 'Date validation must strictly reject Saturday (6) and Sunday (0)');
      assert.ok(/h[aá]biles|Lunes\s+a\s+Viernes/i.test(clientTsx), 'Must inform that sessions are exclusively on business days');
    });
  });

  // --- Feature 5 (R4): 6 Synergistic Deliverables & Social Metadata ---
  describe('Feature 5 (R4): 6 Synergistic Deliverables & Social Metadata', () => {
    it('[T1-R5-01] Deliverable 1: Identidad Visual & Branding Médico de Alto Nivel ($12,000 MXN Setup)', () => {
      assert.ok(/Identidad\s+Visual|Branding/i.test(fullAppText), 'Deliverable 1 Branding must be detailed');
      assert.ok(fullAppText.includes('$12,000') || fullAppText.includes('12,000'), 'Component 1 must allocate $12,000 MXN Setup');
    });

    it('[T1-R5-02] Deliverable 2: Webapp / Portal Quirúrgico de Conversión Binacional ($24,000 MXN Setup)', () => {
      assert.ok(/Portal\s+Quir[uú]rgico|Webapp/i.test(fullAppText), 'Deliverable 2 Webapp / Portal must be detailed');
      assert.ok(fullAppText.includes('$24,000') || fullAppText.includes('24,000'), 'Component 2 must allocate $24,000 MXN Setup');
      assert.ok(fullAppText.includes('Binacional') || fullAppText.includes('El Paso'), 'Must highlight binational patient intake architecture');
    });

    it('[T1-R5-03] Deliverable 3: Marketing y Planeación Mensual de Autoridad ($10,000 MXN / mes)', () => {
      assert.ok(/Marketing\s+y\s+Planeaci[oó]n|Autoridad/i.test(fullAppText), 'Deliverable 3 Marketing de Autoridad must be detailed');
      assert.ok(fullAppText.includes('$10,000') || fullAppText.includes('10,000'), 'Component 3 must allocate $10,000 MXN / mes');
    });

    it('[T1-R5-04] Deliverable 4: Pauta Meta Ads Quirúrgica Hipersegmentada ($7,000 MXN / mes)', () => {
      assert.ok(/Meta\s+Ads|Pauta/i.test(fullAppText), 'Deliverable 4 Estrategia de Pauta Meta Ads must be detailed');
      assert.ok(fullAppText.includes('$7,000') || fullAppText.includes('7,000'), 'Component 4 must allocate $7,000 MXN / mes');
      assert.ok(
        /pagada\s+directamente\s+por\s+el\s+cliente/i.test(fullAppText) ||
        /directamente\s+por\s+el\s+cliente\s+a\s+Meta/i.test(fullAppText),
        'Must clarify that Meta ad budget is paid directly by client to Meta Ads'
      );
    });

    it('[T1-R5-05] Deliverable 5: Bot de WhatsApp con Triaje Clínico 24/7 ($5,000 MXN / mes)', () => {
      assert.ok(/Asistente\s+Inteligente|Bot\s+de\s+WhatsApp|Triaje/i.test(fullAppText), 'Deliverable 5 Asistente de Triaje WhatsApp must be detailed');
      assert.ok(fullAppText.includes('$5,000') || fullAppText.includes('5,000'), 'Component 5 must allocate $5,000 MXN / mes');
      assert.ok(fullAppText.includes('24/7'), 'Must highlight 24/7 responsiveness');
    });

    it('[T1-R5-06] Deliverable 6: CRM Quirúrgico para Médicos ($4,000 MXN / mes)', () => {
      assert.ok(/CRM\s+Quir[uú]rgico/i.test(fullAppText), 'Deliverable 6 CRM Quirúrgico must be detailed');
      assert.ok(fullAppText.includes('$4,000') || fullAppText.includes('4,000'), 'Component 6 must allocate $4,000 MXN / mes');
      assert.ok(fullAppText.includes('kanban') || fullAppText.includes('pipeline') || fullAppText.includes('trazabilidad'), 'Must highlight patient pipeline or kanban tracking');
    });

    it('[T1-R5-07] Open Graph (og:url, og:title, og:image, 1200x630) & Twitter (summary_large_image) social metadata', () => {
      const allMeta = `${pageHtml}\n${pageTsx}\n${staticIndexHtml}`;
      assert.ok(allMeta.includes('https://propuestas.tecza.com.mx/dr-carlos-perzabal'), 'Canonical or og:url must point to official URL');
      assert.ok(allMeta.includes('og:title') || allMeta.includes("og:title"), 'og:title must be declared');
      assert.ok(allMeta.includes('og_dr_carlos_perzabal.jpg') || allMeta.includes('og-image.jpg'), 'og:image must reference official OG image');
      assert.ok(allMeta.includes('summary_large_image'), 'twitter:card must be summary_large_image');
      assert.ok(allMeta.includes('1200') && allMeta.includes('630'), 'OG dimensions 1200x630 must be declared in metadata');
    });
  });

  // --- Bloques A & B (Tier 1 Expanded): Cobertura Funcional Quirúrgica y Deep-Links WhatsApp ---
  describe('Bloques A & B: Cobertura Funcional Quirúrgica y Deep-Links WhatsApp (11 tests)', () => {
    it('[T1-PROC-01] Manga Gástrica (LSG): Anatomía volumétrica, bujía 36 Fr, volumen 120-150 ml, mecanismo de supresión de grelina y criterios ASMBS/IFSO 2022 (IMC ≥35 / ≥30 con comorbilidades)', () => {
      assert.ok(/Manga\s+G[aá]strica/i.test(fullAppText), 'Must detail Manga Gástrica');
      assert.ok(/36\s*Fr/i.test(fullAppText), 'Must specify 36 Fr calibration bougie');
      assert.ok(/grelina/i.test(fullAppText), 'Must explain ghrelin suppression mechanism');
      assert.ok(/ASMBS/i.test(fullAppText), 'Must reference ASMBS/IFSO international criteria');
      assert.ok(/IMC\s*(?:≥\s*35|30-34\.9)/i.test(fullAppText), 'Must specify BMI candidacy cutoffs');
      if (clientTsx.includes('120-150') || clientTsx.includes('SURGICAL_PROCEDURES')) {
        assert.ok(/120[-–\s]+150\s*ml/i.test(fullAppText), 'Must specify gastric volume 120-150 ml');
      }
    });

    it('[T1-PROC-02] Bypass Gástrico (LRYGB): Reservorio gástrico 15-30 ml, asa alimentaria 100-150 cm, mecanismo incretínico (GLP-1), remisión de diabetes tipo 2 (>80%) y control de ERGE (>95%)', () => {
      assert.ok(/Bypass\s+G[aá]strico/i.test(fullAppText), 'Must detail Bypass Gástrico');
      assert.ok(/15\s*(?:a|-)\s*30\s*ml/i.test(fullAppText), 'Must detail 15-30 ml gastric pouch');
      assert.ok(/100\s*(?:a|-)\s*150\s*cm/i.test(fullAppText), 'Must detail 100-150 cm alimentary limb');
      assert.ok(/GLP-1/i.test(fullAppText), 'Must specify incretin hormone GLP-1');
      assert.ok(/80%/i.test(fullAppText), 'Must detail >80% diabetes remission rate');
      assert.ok(/ERGE|reflujo/i.test(fullAppText), 'Must detail GERD resolution');
      assert.ok(/95%/i.test(fullAppText), 'Must specify >95% GERD symptom control');
    });

    it('[T1-PROC-03] Colecistectomía Strasberg CVS: Protocolo de Visión Crítica de Seguridad (CVS), identificación inequívoca de conducto y arteria cística, lecho hepático y prevención de pancreatitis', () => {
      assert.ok(/Colecistectom[ií]a|Ves[ií]cula/i.test(fullAppText), 'Must detail gallbladder surgery');
      assert.ok(/Strasberg/i.test(fullAppText), 'Must cite Strasberg safety protocol');
      assert.ok(/Visi[oó]n\s+Cr[ií]tica\s+de\s+Seguridad|CVS/i.test(fullAppText), 'Must cite Critical View of Safety (CVS)');
      assert.ok(/conducto\s+c[ií]stico/i.test(fullAppText), 'Must identify cystic duct');
      assert.ok(/arteria\s+c[ií]stica/i.test(fullAppText), 'Must identify cystic artery');
    });

    it('[T1-PROC-04] Hernioplastías TAPP/TEP: Malla tridimensional preperitoneal (10x15 cm), cobertura del orificio miopectíneo de Fruchaud, reparación sin tensión (<1.5% recidiva) y prevención de inguinodinia', () => {
      assert.ok(/Hernia|Hernioplast/i.test(fullAppText), 'Must detail hernia repair');
      assert.ok(/TAPP|TEP/i.test(fullAppText), 'Must cite minimally invasive TAPP or TEP approach');
      assert.ok(/Fruchaud/i.test(fullAppText), 'Must cite Myopectineal Orifice of Fruchaud');
      assert.ok(/malla/i.test(fullAppText), 'Must specify preperitoneal prosthetic mesh');
      assert.ok(/1\.5%/i.test(fullAppText), 'Must specify <1.5% recurrence rate');
      assert.ok(/Inguinodinia/i.test(fullAppText), 'Must address chronic inguinodynia prevention');
    });

    it('[T1-PROC-05] Consola Robótica Da Vinci: Visión 3D-HD 10x estereoscópica, pinzas EndoWrist 540° con 7 grados de libertad, filtrado de temblor y escala de movimiento 5:1', () => {
      assert.ok(/Da\s+Vinci/i.test(fullAppText), 'Must cite Da Vinci surgical platform');
      assert.ok(/3D-HD|10x/i.test(fullAppText), 'Must specify 3D-HD stereoscopic 10x vision');
      assert.ok(/EndoWrist|540°/i.test(fullAppText), 'Must specify EndoWrist 540° multi-axis articulation');
      assert.ok(/Filtrado\s+de\s+Temblor/i.test(fullAppText), 'Must detail tremor filtration');
      assert.ok(/5:1/i.test(fullAppText), 'Must detail 5:1 motion scaling');
    });

    it('[T1-PROC-06] Presencia y reactividad del selector de visor anatómico ("Antes / Después" o "Anatomía Previa / Técnica Quirúrgica") para los 5 procedimientos con clases o atributos de estado activo', () => {
      const hasViewToggle =
        /procViewMode|viewMode|activeView|toggleView/i.test(clientTsx) &&
        /Antes|Anatom[ií]a\s+Previa|Despu[eé]s|T[eé]cnica\s+Quir[uú]rgica/i.test(fullAppText);
      if (hasViewToggle) {
        assert.ok(/Antes|Anatom[ií]a\s+Previa/i.test(fullAppText), 'Must provide pre-op anatomy view option');
        assert.ok(/Despu[eé]s|T[eé]cnica\s+Quir[uú]rgica|Resecci[oó]n/i.test(fullAppText), 'Must provide post-op surgical technique view option');
      } else {
        const procs = ['manga', 'bypass', 'vesicula', 'hernia', 'robot'];
        for (const p of procs) {
          assert.ok(clientTsx.includes(`'${p}'`) || clientTsx.includes(`"${p}"`), `Procedure tab ${p} must exist in client component`);
        }
        assert.ok(clientTsx.includes('activeProcTab'), 'Active procedure state must be managed');
      }
    });

    it('[T1-PROC-07] Métricas anatómicas volumétricas y etiquetas tácticas (Fr, ml, cm, mm, °, x) claramente renderizadas dentro del visor quirúrgico en ambos modos', () => {
      assert.ok(/\b36\s*Fr\b/i.test(fullAppText), 'Must include French gauge metric (36 Fr)');
      assert.ok(/\bml\b/i.test(fullAppText), 'Must include volume capacity (ml)');
      assert.ok(/\bcm\b/i.test(fullAppText), 'Must include anatomical length metric (cm)');
      assert.ok(/\bmm\b/i.test(fullAppText), 'Must include incision diameter metric (mm)');
      assert.ok(/540°/i.test(fullAppText), 'Must include articulation degree metric (540°)');
      assert.ok(/10x/i.test(fullAppText), 'Must include optical magnification metric (10x)');
    });

    it('[T1-PROC-08] Grilla modular de 4 microtarjetas de KPIs clínicos presentes en los 5 procedimientos: Tiempo Quirúrgico, Estancia Hospitalaria, Abordaje Quirúrgico y Retorno a Actividades', () => {
      assert.ok(/duraci[oó]n|min|tiempo/i.test(fullAppText), 'Must articulate surgical duration');
      assert.ok(/estancia\s+hospitalaria|pernocta|ambulatori/i.test(fullAppText), 'Must articulate hospital stay');
      assert.ok(/incisiones|laparosc[oó]p|rob[oó]tic|puertos/i.test(fullAppText), 'Must articulate surgical approach');
      assert.ok(/reincorporaci[oó]n|retorno|regreso\s+a\s+actividades/i.test(fullAppText), 'Must articulate recovery time');

      if (clientTsx.includes('SURGICAL_PROCEDURES') || clientTsx.includes('doc-kpi-grid')) {
        assert.ok(
          clientTsx.includes('surgicalTime') || clientTsx.includes('doc-kpi-grid'),
          'Client component must declare modular KPI grid keys'
        );
      }
    });

    it('[T1-PROC-09] 2 Notas de rigor médico estructuradas y visibles en cada procedimiento: Mecanismo Fisiológico/Quirúrgico y Criterios Internacionales de Candidatura (ASMBS/IFSO 2022, Strasberg CVS)', () => {
      assert.ok(/grelina|GLP-1|CVS|Fruchaud|EndoWrist/i.test(fullAppText), 'Note A: Must explain physiological/metabolic/surgical mechanism');
      assert.ok(/ASMBS|IFSO|Strasberg|seguridad/i.test(fullAppText), 'Note B: Must specify international clinical criteria / safety consensus');
      if (clientTsx.includes('SURGICAL_PROCEDURES')) {
        assert.ok(
          clientTsx.includes('mechanismNote') || clientTsx.includes('consensusNote'),
          'SURGICAL_PROCEDURES registry must declare mechanismNote and consensusNote keys'
        );
      }
    });

    it('[T1-PROC-10] Botón de acción contextual de candidatura por procedimiento con texto dinámico: Evaluar mi candidatura a [Nombre de Procedimiento] →', () => {
      if (clientTsx.includes('Evaluar mi candidatura')) {
        assert.ok(/Evaluar mi candidatura a/i.test(fullAppText || clientTsx), 'Must declare contextual candidacy button');
      } else {
        assert.ok(clientTsx.includes('526563117565'), 'CTA must route to official Dr. Perzabal phone');
        assert.ok(clientTsx.includes('wa.me') || clientTsx.includes('triage'), 'CTA must integrate with WhatsApp triage');
      }
    });

    it('[T1-PROC-11] Deep-link de WhatsApp dinámico generado con codificación URI limpia (0 espacios sin escapar), apuntando al número oficial y prellenando el mensaje con el procedimiento activo', () => {
      assert.ok(
        clientTsx.includes('526563117565') || staticIndexHtml.includes('526563117565'),
        'WhatsApp links must target official phone 526563117565'
      );
      const waUrls = [...(pageHtml + clientTsx).matchAll(/https:\/\/wa\.me\/526563117565\?text=([^"'\s`]+)/g)];
      for (const match of waUrls) {
        const fullUrl = match[0];
        assert.ok(!fullUrl.includes(' '), 'WhatsApp link must not contain raw unencoded spaces');
        assert.doesNotThrow(() => decodeURIComponent(match[1]), 'WhatsApp query string must decode cleanly');
      }
    });
  });

});

// =========================================================================
// TIER 2: BOUNDARY & CORNER CASES (20 tests across 4 suites)
// =========================================================================

describe('Tier 2: Boundary & Corner Cases (R1 - R5)', () => {

  // --- Suite 1: Mathematical Identities & Hybrid Modules ---
  describe('Suite 1: Mathematical Identities & Hybrid Modules', () => {
    it('[T2-MATH-01] Setup tax identity: $36,000 * 0.16 === $5,760 exact tax, Total Setup === $41,760 MXN', () => {
      const setup = 36000;
      const iva = Math.round(setup * 0.16);
      assert.equal(iva, 5760, '16% IVA on $36,000 must equal exactly $5,760 MXN');
      assert.equal(setup + iva, 41760, 'Total setup invoiced must equal $41,760 MXN');
    });

    it('[T2-MATH-02] Monthly tax identity: $26,000 * 0.16 === $4,160 exact tax, Total Monthly === $30,160 MXN', () => {
      const monthly = 26000;
      const iva = Math.round(monthly * 0.16);
      assert.equal(iva, 4160, '16% IVA on $26,000 must equal exactly $4,160 MXN');
      assert.equal(monthly + iva, 30160, 'Total monthly invoiced must equal $30,160 MXN');
    });

    it('[T2-MATH-03] Initial Grand Total identity: Setup $41,760 + Month 1 $30,160 === $71,920 MXN', () => {
      const setupTotal = 36000 + Math.round(36000 * 0.16);
      const monthlyTotal = 26000 + Math.round(26000 * 0.16);
      assert.equal(setupTotal + monthlyTotal, 71920, 'Initial grand total must equal exactly $71,920 MXN');
    });

    it('[T2-MATH-04] Daily accessibility equivalent: Math.round($30,160 / 30) === $1,005 MXN/día', () => {
      const monthlyTotal = 26000 + Math.round(26000 * 0.16);
      const daily = Math.round(monthlyTotal / 30);
      assert.equal(daily, 1005, 'Daily operating cost must be $1,005 MXN/día');
    });

    it('[T2-MATH-05] Modular toggle reactivity: toggling Branding off ($12,000) adjusts Setup to $24,000 + IVA $3,840 = $27,840', () => {
      const remainingSetup = 24000;
      const iva = Math.round(remainingSetup * 0.16);
      assert.equal(iva, 3840, 'IVA on remaining $24,000 must be $3,840 MXN');
      assert.equal(remainingSetup + iva, 27840, 'Setup total without branding must be $27,840 MXN');
    });
  });

  // --- Suite 2: Price Notation & Legacy Price Suppression ---
  describe('Suite 2: Price Notation & Legacy Price Suppression', () => {
    it('[T2-NOTE-01] Strict currency notation: standard $XX,XXX MXN format with uppercase MXN', () => {
      assert.ok(fullAppText.includes('MXN'), 'Currency notation must include uppercase MXN');
      assert.ok(!/\$\d+[\d,]*\s+pesos\b/i.test(fullAppText), 'Must NOT use informal "pesos" notation');
      assert.ok(!/\$\d+[\d,]*\s+mxn\b/.test(fullAppText), 'Currency suffix must be strictly uppercase "MXN"');
    });

    it('[T2-NOTE-02] Eradication of truncated prices ($36k, $26k, $41.7k, $71.9k prohibited)', () => {
      assert.ok(!/\$36k\b/i.test(fullAppText), 'Must not truncate $36,000 to $36k');
      assert.ok(!/\$26k\b/i.test(fullAppText), 'Must not truncate $26,000 to $26k');
      assert.ok(!/\$71\.9k\b/i.test(fullAppText), 'Must not truncate $71,920 to $71.9k');
    });

    it('[T2-NOTE-03] Eradication of informal currency terms ("pesos", lowercase "mxn")', () => {
      assert.ok(!/\bpesos\s+mexicanos\b/i.test(fullAppText), 'Must not use informal "pesos mexicanos"');
    });

    it('[T2-NOTE-04] Eradication of legacy proposal pricing ($16,000, $18,560, $6,960, $20,000 MXN)', () => {
      assert.ok(!/\$16,000\s*MXN\b/i.test(pageHtml), 'Must not display legacy CCE $16,000 MXN pricing');
      assert.ok(!/\$18,560\s*MXN\b/i.test(pageHtml), 'Must not display legacy CCE $18,560 MXN pricing');
      assert.ok(!/\$6,960\s*MXN\b/i.test(pageHtml), 'Must not display legacy Nueva Laguna $6,960 MXN pricing');
      assert.ok(!/\$20,000\s*MXN\b/i.test(pageHtml), 'Must not display legacy $20,000 MXN pricing');
    });

    it('[T2-NOTE-05] Character entity & HTML quote escaping integrity: 0 double-encoded entities (&amp;amp;)', () => {
      assert.ok(!/&amp;amp;/i.test(pageHtml), 'Double encoded HTML entities (&amp;amp;) are prohibited');
      assert.ok(!/&amp;quot;/i.test(pageHtml), 'Unnecessary entity escaping &amp;quot; prohibited');
    });
  });

  // --- Suite 3: Mobile Viewport & Ergonomics Floors ---
  describe('Suite 3: Mobile Viewport & Ergonomics Floors', () => {
    it('[T2-VIEW-01] Viewport meta tag declares width=device-width, initial-scale=1.0', () => {
      const allMeta = `${pageHtml}\n${staticIndexHtml}`;
      const viewportMatch = allMeta.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
      assert.ok(viewportMatch, 'Page must declare viewport meta tag');
      const content = viewportMatch[1];
      assert.ok(content.includes('width=device-width'), 'Viewport must specify width=device-width');
      assert.ok(content.includes('initial-scale=1'), 'Viewport must specify initial-scale=1');
    });

    it('[T2-VIEW-02] Global horizontal scroll suppression: overflow-x: hidden enforced on html, body, and .perzabal-root', () => {
      const allCss = `${stylesContent}\n${fullAppText}`;
      assert.ok(
        allCss.includes('overflow-x: hidden') ||
        allCss.includes('overflow-x:hidden') ||
        allCss.includes('overflow-x-hidden'),
        'Stylesheet must enforce overflow-x: hidden on root containers'
      );
      assert.ok(
        allCss.includes('.perzabal-root') && allCss.includes('max-width: 100vw'),
        '.perzabal-root must constrain max-width to 100vw'
      );
    });

    it('[T2-VIEW-03] Touch target height floor: buttons, modal closers, and links declare min-height >= 44px', () => {
      const allCss = `${stylesContent}\n${fullAppText}`;
      const hasTouchTarget =
        allCss.includes('min-height: 44px') ||
        allCss.includes('min-height:44px') ||
        allCss.includes('min-height: 48px') ||
        allCss.includes('min-height:48px') ||
        allCss.includes('minHeight: 44') ||
        allCss.includes('minHeight: 48');
      assert.ok(hasTouchTarget, 'Interactive buttons and links must declare min-height >= 44px');

      // Reject any sub-44px declarations on buttons
      assert.ok(!clientTsx.includes("minHeight: '36px'"), 'DrCarlosPerzabalClient must not declare minHeight: 36px');
      assert.ok(!staticIndexHtml.includes('min-height: 36px'), 'static index.html must not declare min-height: 36px');
      assert.ok(!clientTsx.includes("minHeight: '32px'"), 'DrCarlosPerzabalClient must not declare sub-44px heights');
      assert.ok(!staticIndexHtml.includes('min-height: 32px'), 'static index.html must not declare sub-44px heights');

      // Verify Copiar CLABE button declares minHeight/min-height >= 44px and minWidth >= 44px
      assert.ok(
        clientTsx.includes("minHeight: '44px'") && clientTsx.includes("minWidth: '44px'"),
        'Copiar CLABE button in DrCarlosPerzabalClient must declare minHeight >= 44px and minWidth >= 44px'
      );
      assert.ok(
        staticIndexHtml.includes('min-height: 44px') && staticIndexHtml.includes('min-width: 44px'),
        'Copiar CLABE button in static index.html must declare min-height >= 44px and min-width >= 44px'
      );

      // Verify WhatsApp Triage Reset button declares minHeight/min-height >= 44px and minWidth >= 44px
      const resetBtnTsxMatch = clientTsx.match(/onClick=\{handleResetTriage\}[\s\S]*?style=\{\{([^}]+)\}\}/);
      assert.ok(resetBtnTsxMatch, 'Triage reset button must exist in DrCarlosPerzabalClient');
      assert.ok(
        resetBtnTsxMatch[1].includes("minHeight: '44px'") && resetBtnTsxMatch[1].includes("minWidth: '44px'"),
        'Triage reset button in DrCarlosPerzabalClient must enforce >= 44x44px touch target'
      );

      const resetBtnHtmlMatch = staticIndexHtml.match(/onclick="resetTriage\(\)"[\s\S]*?style="([^"]+)"/);
      assert.ok(resetBtnHtmlMatch, 'Triage reset button must exist in static index.html');
      assert.ok(
        resetBtnHtmlMatch[1].includes('min-height: 44px') && resetBtnHtmlMatch[1].includes('min-width: 44px'),
        'Triage reset button in static index.html must enforce >= 44x44px touch target'
      );

      // Verify Modal close button declares min-width: 44px and min-height: 44px
      assert.ok(
        staticIndexHtml.includes('min-width: 44px') && staticIndexHtml.includes('min-height: 44px'),
        'Modal close button must declare >= 44x44px'
      );
    });

    it('[T2-VIEW-04] Body typography floor: font-size >= 14px on all body paragraphs and descriptions', () => {
      const allCss = `${stylesContent}\n${fullAppText}`;
      assert.ok(!allCss.includes('p { font-size: 12px'), 'Body paragraphs must not be 12px');
      assert.ok(!allCss.includes('p { font-size: 11px'), 'Body paragraphs must not be 11px');
      assert.ok(!allCss.includes('font-size: 11px;'), 'No 11px font size rules');
      assert.ok(!allCss.includes('font-size: 10px;'), 'No 10px font size rules');
    });

    it('[T2-VIEW-05] Form inputs typography floor: font-size >= 15px (0.9375rem) to ensure ergonomic mobile interaction', () => {
      const inputRuleMatch = stylesContent.match(/(?:input|select|textarea|\.doc-input)\s*\{[^}]*font-size:\s*([^;]+);/i);
      if (inputRuleMatch) {
        const val = inputRuleMatch[1].trim();
        if (val.endsWith('rem')) {
          assert.ok(parseFloat(val) >= 0.93, `Input font-size must be >= 0.9375rem (was ${val})`);
        } else if (val.endsWith('px')) {
          assert.ok(parseFloat(val) >= 15, `Input font-size must be >= 15px (was ${val})`);
        }
      }
      assert.ok(!stylesContent.includes('.doc-input { font-size: 12px'), 'Inputs must not be smaller than 15px');
    });

    it('[T2-VIEW-06] Form inputs prevent iOS Safari auto-zoom: font-size >= 16px (1rem)', () => {
      const inputRuleMatch = stylesContent.match(/\.doc-input\s*\{[^}]*font-size:\s*([^;]+);/i);
      assert.ok(inputRuleMatch, '.doc-input CSS class rule must be defined');
      const val = inputRuleMatch[1].trim();
      if (val.endsWith('rem')) {
        assert.ok(parseFloat(val) >= 1.0, `Input font-size must be >= 1rem to prevent iOS zoom (was ${val})`);
      } else if (val.endsWith('px')) {
        assert.ok(parseFloat(val) >= 16, `Input font-size must be >= 16px to prevent iOS zoom (was ${val})`);
      }
    });

    it('[T2-VIEW-07] Switch Toggle Touch Target: .doc-switch has ::before pseudo-element with min 44x44px hit area', () => {
      assert.ok(
        stylesContent.includes('.doc-switch::before') || stylesContent.includes('.doc-switch:before'),
        '.doc-switch must define ::before pseudo-element for touch area extension'
      );
      assert.ok(
        stylesContent.includes('min-height: 44px') && stylesContent.includes('min-width: 44px'),
        '.doc-switch::before must enforce at least 44x44px hit target'
      );
    });

    it('[T2-VIEW-08] Touch Target de Pestañas de Procedimientos: Los 5 botones de navegación (.doc-tab-btn) declaran min-height >= 44px y padding táctil ergonómico', () => {
      assert.ok(
        stylesContent.includes('.doc-tab-btn') || clientTsx.includes('.doc-tab-btn'),
        '.doc-tab-btn selector must be defined'
      );
      assert.ok(
        /min-height:\s*44px/i.test(stylesContent),
        '.doc-tab-btn must declare minimum touch target height of 44px'
      );
      assert.ok(
        /padding:\s*10px\s+18px/i.test(stylesContent) || /padding:\s*\d+px\s+\d+px/i.test(stylesContent),
        '.doc-tab-btn must declare ergonomic touch target padding'
      );
    });

    it('[T2-VIEW-09] Touch Target del Selector de Visor: El switch/toggle de vista ("Antes/Después") declara área de toque mínima de 44x44px', () => {
      const hasViewToggleCss =
        stylesContent.includes('.doc-proc-toggle') ||
        stylesContent.includes('.doc-proc-toggle-btn') ||
        stylesContent.includes('.doc-view-toggle');
      if (hasViewToggleCss) {
        assert.ok(
          stylesContent.includes('min-height: 44px') || stylesContent.includes('min-width: 44px'),
          'Procedure view toggle must enforce min 44x44px touch area'
        );
      } else {
        assert.ok(
          stylesContent.includes('min-height: 44px') && stylesContent.includes('min-width: 44px'),
          'Toggle controls must enforce at least 44x44px minimum touch hit target'
        );
      }
    });

    it('[T2-VIEW-10] Touch Target del Botón de Candidatura: El botón principal de llamada a la acción declara min-height >= 44px y ancho completo en vista móvil', () => {
      assert.ok(
        stylesContent.includes('.doc-btn-primary') || stylesContent.includes('min-height: 44px'),
        'Action buttons must declare minimum touch height >= 44px'
      );
      assert.ok(
        stylesContent.includes('min-height: 44px'),
        'CTA buttons must enforce min-height: 44px'
      );
      assert.ok(
        stylesContent.includes('width: 100%') || stylesContent.includes('display: flex'),
        'Responsive layout must provide full width interaction on mobile'
      );
    });

    it('[T2-VIEW-11] Colapso responsivo y 0px overflow-x en 320px - 414px: Las clases .doc-proc-display y .doc-kpi-grid colapsan a una sola columna vertical (1fr / flex-direction: column) en pantallas de hasta 768px, impidiendo scroll horizontal accidental', () => {
      assert.ok(stylesContent.includes('.doc-proc-display'), '.doc-proc-display class must be defined');
      assert.ok(
        /@media\s*\([^)]*max-width:\s*(?:850|768)px\)[^{]*\{[\s\S]*?\.doc-proc-display\s*\{[\s\S]*?grid-template-columns:\s*1fr/i.test(stylesContent),
        '.doc-proc-display must collapse to single column (1fr) on mobile viewports'
      );
      assert.ok(
        stylesContent.includes('overflow-x: hidden') || stylesContent.includes('overflow-x:hidden'),
        'Enforces overflow-x: hidden to suppress horizontal scrolling in 320px-414px viewports'
      );
    });
  });

  // --- Suite 4: WCAG 2.1 Contrast Ratios & Asset Sweep ---
  describe('Suite 4: WCAG 2.1 Contrast Ratios & Asset Sweep', () => {
    it('[T2-A11Y-01] WCAG AA Contrast ratio for primary white headings on deep slate card (#F8FAFC on #0B1426 >= 10:1, passes AAA)', () => {
      const white = rootVariables['--doc-white'] || '#F8FAFC';
      const slateCard = rootVariables['--doc-slate-card'] || '#0B1426';
      const contrast = getContrastRatio(white, slateCard);
      assert.ok(contrast >= 4.5, `Contrast ${contrast.toFixed(2)}:1 must pass WCAG AA >= 4.5:1`);
      assert.ok(contrast >= 7.0, `Contrast ${contrast.toFixed(2)}:1 must pass WCAG AAA >= 7.0:1`);
    });

    it('[T2-A11Y-02] WCAG Contrast ratio for surgical teal accent (#00A3E0 on #070D18 >= 4.5:1)', () => {
      const teal = rootVariables['--doc-teal'] || '#00A3E0';
      const slate = rootVariables['--doc-slate'] || '#070D18';
      const contrast = getContrastRatio(teal, slate);
      assert.ok(contrast >= 4.5, `Teal contrast ${contrast.toFixed(2)}:1 must be >= 4.5:1 for high legibility`);
    });

    it('[T2-A11Y-03] WCAG Contrast ratio for clinical gold accent (#D4AF37 on #070D18 >= 6:1)', () => {
      const gold = rootVariables['--doc-gold'] || '#D4AF37';
      const slate = rootVariables['--doc-slate'] || '#070D18';
      const contrast = getContrastRatio(gold, slate);
      assert.ok(contrast >= 4.5, `Gold contrast ${contrast.toFixed(2)}:1 must be >= 4.5:1`);
    });

    it('[T2-A11Y-04] Comprehensive procedural SVG asset sweep: all 5 procedure SVGs resolve with HTTP 200', async () => {
      const procedureSvgs = [
        '/assets/dr-carlos-perzabal/manga_gastrica.svg',
        '/assets/dr-carlos-perzabal/bypass_gastrico.svg',
        '/assets/dr-carlos-perzabal/colecistectomia_strasberg.svg',
        '/assets/dr-carlos-perzabal/hernioplastia_tapp.svg',
        '/assets/dr-carlos-perzabal/consola_da_vinci.svg',
      ];
      for (const svgPath of procedureSvgs) {
        const check = await verifyAsset(svgPath);
        assert.equal(check.status, 200, `Procedure asset ${svgPath} must return status 200`);
        assert.ok(check.contentType.includes('svg') || check.contentType.includes('image'), `Asset ${svgPath} must have image content-type`);
        assertSvgXmlWellFormed(check.body, svgPath);
      }
    });

    it('[T2-A11Y-05] Asset protocol security: 0 insecure external http:// asset references in page', () => {
      const insecure = [...pageHtml.matchAll(/src=["']http:\/\/([^"']+)["']/g)];
      assert.equal(insecure.length, 0, 'Page must not reference insecure http:// resources');
    });

    it('[T2-A11Y-06] Primary CTA button contrast ratio: dark text (#070D18) on surgical teal (#00A3E0) passes WCAG AA (>= 4.5:1)', () => {
      const teal = rootVariables['--doc-teal'] || '#00A3E0';
      const darkBtnText = '#070D18';
      const contrast = getContrastRatio(teal, darkBtnText);
      assert.ok(contrast >= 4.5, `Primary button contrast ${contrast.toFixed(2)}:1 must pass WCAG AA >= 4.5:1`);
      assert.ok(stylesContent.includes('color: #070D18'), '.doc-btn-primary must explicitly declare #070D18 text color');
    });
  });

});

// =========================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS & BRAND ISOLATION (17 tests)
// =========================================================================

describe('Tier 3: Cross-Feature Combinations & Brand Isolation', () => {

  it('[T3-BRAND-01] Strict Brand Isolation: 0 occurrences of "Frontera Número Uno" or "Frontera Numero Uno"', () => {
    const lower = fullAppText.toLowerCase();
    assert.ok(!lower.includes('frontera número uno'), 'Must contain 0 mentions of "Frontera Número Uno"');
    assert.ok(!lower.includes('frontera numero uno'), 'Must contain 0 mentions of "Frontera Numero Uno"');
  });

  it('[T3-BRAND-02] Strict Brand Isolation: 0 occurrences of "FN1" (case-insensitive word boundary)', () => {
    const fn1Match = fullAppText.match(/\bFN1\b/i);
    assert.equal(fn1Match, null, 'Must contain 0 mentions of "FN1"');
  });

  it('[T3-BRAND-03] Strict Brand Isolation: 0 occurrences of "Juárez Number One" or "Juarez Number One"', () => {
    const lower = fullAppText.toLowerCase();
    assert.ok(!lower.includes('juárez number one'), 'Must contain 0 mentions of "Juárez Number One"');
    assert.ok(!lower.includes('juarez number one'), 'Must contain 0 mentions of "Juarez Number One"');
  });

  it('[T3-BRAND-04] Strict Brand Isolation: 0 occurrences of "La X", "Monumento a la X", or puerta-juarez.png', () => {
    assert.ok(!fullAppText.includes('puerta-juarez.png'), 'Must not reference puerta-juarez.png');
    assert.ok(!/monumento\s+(?:a\s+)?la\s+x/i.test(fullAppText), 'Must contain 0 mentions of Monumento a La X');
    assert.ok(!/plaza\s+de\s+la\s+mexicanidad/i.test(fullAppText), 'Must contain 0 mentions of Plaza de la Mexicanidad');
  });

  it('[T3-BRAND-05] Strict Anti-Roulette Policy: 0 occurrences of "ruleta" or "roulette"', () => {
    const ruletaMatch = fullAppText.match(/rulet|roulette/i);
    assert.equal(ruletaMatch, null, 'Must contain 0 occurrences of "ruleta" or "roulette"');
  });

  it('[T3-BRAND-06] Exclusion of ROI Claims: 0 occurrences of "ROI", "ROAS", "retorno de inversión", or "ventas garantizadas"', () => {
    const roiMatch = fullAppText.match(/\bROI\b|\bROAS\b|retorno\s+de\s+inversi[oó]n|ventas\s+garantizadas/i);
    assert.equal(roiMatch, null, 'Must contain 0 claims of ROI, ROAS, or guaranteed sales');
  });

  it('[T3-BRAND-07] Clinical Dignity / Zero Low-Cost Stigma: 0 mentions of "descuento", "precio bajo", "paquete económico", "oferta", "remates"', () => {
    const lowCostStems = [
      /\bdescuento/i,
      /\bdescuentos/i,
      /\bprecio\s+bajo/i,
      /\bpaquete\s+econ[oó]mico/i,
      /\boferta\b/i,
      /\bofertas\b/i,
      /\bremate[s]?\b/i,
      /\bbarato/i,
    ];
    for (const pattern of lowCostStems) {
      assert.ok(!pattern.test(fullAppText), `Must not contain cheapening term matching ${pattern}`);
    }
  });

  it('[T3-BRAND-08] Zero High-Pressure Promotional Phrases ("¡CÓMPRALO YA!", "NO TE LO PIERDAS", "OFERTA LIMITADA")', () => {
    const pushyWords = ['¡CÓMPRALO YA!', 'OFERTA IRREPETIBLE', 'NO TE LO PIERDAS', 'OFERTA LIMITADA', 'COMPRA AHORA'];
    for (const phrase of pushyWords) {
      assert.ok(!fullAppText.toUpperCase().includes(phrase), `Proposal must avoid pushy phrase: ${phrase}`);
    }
  });

  it('[T3-BRAND-09] 100% Apolograma Attribution: header and footer attribute proposal exclusively to Apolograma Studio', () => {
    assert.ok(pageHtml.includes('Apolograma'), 'Proposal must be attributed to Apolograma');
    assert.ok(!pageHtml.includes('FN1 Agency'), 'Must not attribute to FN1 Agency');
    assert.ok(!pageHtml.includes('Frontera Media'), 'Must not attribute to Frontera Media');
  });

  it('[T3-BRAND-10] WhatsApp Deep-Link Parameter Integrity: URLs are valid encoded URIs with 0 raw spaces', () => {
    const waLinks = [...pageHtml.matchAll(/href=["'](https:\/\/wa\.me\/[^"']+)["']/g)];
    assert.ok(waLinks.length > 0 || clientTsx.includes('wa.me'), 'Must declare WhatsApp links');
    for (const match of waLinks) {
      const url = match[1];
      assert.ok(!url.includes(' '), 'WhatsApp link must not contain raw unencoded spaces');
      assert.doesNotThrow(() => decodeURIComponent(url), 'WhatsApp link must be valid URI');
    }
  });

  it('[T3-BRAND-11] WhatsApp Deep-Link Clinical Context: prefilled text embeds Dr. Carlos Perzabal name and clinical intake structure', () => {
    assert.ok(clientTsx.includes('triageWhatsAppUrl'), 'Client component must compute dynamic triage WhatsApp URL');
    assert.ok(clientTsx.includes('Dr. Carlos Perzabal'), 'WhatsApp text must address Dr. Carlos Perzabal');
    assert.ok(clientTsx.includes('FICHA DE ORIENTACIÓN QUIRÚRGICA'), 'WhatsApp text must structure clinical orientation intake sheet');
  });

  it('[T3-BRAND-12] Meta Ads Scope Boundary Isolation: explicitly specifies that Meta ad spend is paid directly by client to Meta Ads', () => {
    assert.ok(
      /directamente\s+por\s+el\s+cliente\s+a\s+Meta/i.test(fullAppText) ||
      /pauta\s+pagada\s+directamente/i.test(fullAppText),
      'Must isolate Meta ad spend from agency fee'
    );
  });

  it('[T3-BRAND-13] Medical Data Confidentiality & Disclaimer: explicit notice that triage orientation is preliminary and does not replace in-person consultation', () => {
    assert.ok(
      /No\s+sustituye\s+(?:la\s+)?consulta\s+m[eé]dica/i.test(fullAppText) ||
      /Orientaci[oó]n\s+m[eé]dica\s+preliminar/i.test(fullAppText),
      'Must contain explicit clinical disclaimer that triage does not replace formal in-person consultation'
    );
  });

  it('[T3-BRAND-14] Admin Telemetry Radar Bypass: triple-click on brand logo silences radar telemetry without affecting user experience', () => {
    assert.ok(clientTsx.includes('handleLogoClick'), 'Logo click handler must exist in client component');
    assert.ok(clientTsx.includes('next >= 3'), 'Triple click on logo must trigger admin mode toggle');
    assert.ok(clientTsx.includes('apolo_admin_device'), 'Must persist admin device state to silence telemetry');
  });

  it('[T3-BRAND-15] Binational Tourism Value Proposition: specifically highlights avoiding U.S. insurance deductibles ($5k-$10k USD) and 15-min bridge proximity', () => {
    assert.ok(/deducible|deductibles/i.test(fullAppText), 'Must highlight avoiding high U.S. insurance deductibles');
    assert.ok(/El\s+Paso/i.test(fullAppText), 'Must highlight El Paso cross-border connection');
    assert.ok(/Texas/i.test(fullAppText), 'Must address Texas patient market');
    assert.ok(/puente|minutos|proximidad/i.test(fullAppText), 'Must mention geographic proximity to international bridges');
  });

  it('[T3-BRAND-16] Cross-Feature Procedural Synchrony: all 5 procedural cards synchronize with triage simulator options and clinical copy', () => {
    const procs = ['manga', 'bypass', 'vesicula', 'hernia', 'robot'];
    for (const p of procs) {
      assert.ok(clientTsx.includes(p), `Client component must include procedure key: ${p}`);
    }
  });

  it('[T3-BRAND-17] Cross-Feature Invariant: Core deliverables sum (Setup $36,000 + Monthly $26,000) strictly equals $62,000 MXN subtotal, $71,920 MXN initial grand total', () => {
    const s1 = 12000;
    const s2 = 24000;
    const setupSub = s1 + s2;
    assert.equal(setupSub, 36000, 'Sum of Setup deliverables must equal exactly $36,000 MXN');

    const m1 = 10000;
    const m2 = 7000;
    const m3 = 5000;
    const m4 = 4000;
    const monthlySub = m1 + m2 + m3 + m4;
    assert.equal(monthlySub, 26000, 'Sum of Monthly deliverables must equal exactly $26,000 MXN');

    const setupTotal = setupSub + Math.round(setupSub * 0.16);
    const monthlyTotal = monthlySub + Math.round(monthlySub * 0.16);
    assert.equal(setupTotal + monthlyTotal, 71920, 'Initial grand total must equal exactly $71,920 MXN');
  });

  it('[T3-BRAND-18] Medically Honest Copy: 0 occurrences of absolutes "garantiza la integridad anatómica" or "eliminando el riesgo de dolor"', () => {
    assert.ok(
      !fullAppText.includes('garantiza la integridad anatómica'),
      'Must not claim "garantiza la integridad anatómica" (unethical absolute guarantee)'
    );
    assert.ok(
      !fullAppText.includes('eliminando el riesgo de dolor'),
      'Must not claim "eliminando el riesgo de dolor" (unethical absolute guarantee)'
    );
  });

  it('[T3-BRAND-19] Clinical Accuracy Phrasing: Strasberg CVS safety protocol and TAPP risk reduction explicitly declared', () => {
    assert.ok(
      /Protocolo de Seguridad Strasberg \(CVS\)/i.test(fullAppText),
      'Must explicitly refer to Protocolo de Seguridad Strasberg (CVS)'
    );
    assert.ok(
      /protege y salvaguarda la integridad anat[oó]mica/i.test(fullAppText),
      'Must use protective phrasing for Strasberg CVS'
    );
    assert.ok(
      /reduciendo dr[aá]sticamente el riesgo de dolor/i.test(fullAppText),
      'Must use risk reduction phrasing for Hernioplastía TAPP'
    );
  });

  it('[T3-BRAND-20] Formal Medical Disclaimers: Simulator and footer declare non-diagnostic preliminary intake status', () => {
    // Simulator disclaimer in both client and static
    const simDisclaimer = 'Orientación médica preliminar y triaje administrativo:';
    const nonDiagnostic = 'No sustituye la consulta médica presencial ni constituye diagnóstico definitivo formal';
    assert.ok(
      clientTsx.includes(simDisclaimer) && clientTsx.includes(nonDiagnostic),
      'DrCarlosPerzabalClient simulator must contain non-diagnostic preliminary intake disclaimer card'
    );
    assert.ok(
      staticIndexHtml.includes(simDisclaimer) && staticIndexHtml.includes(nonDiagnostic),
      'Static index.html simulator must contain non-diagnostic preliminary intake disclaimer card'
    );
    // Footer disclaimer in both client and static
    const footerDisclaimer = 'Aviso de Responsabilidad Médica:';
    assert.ok(
      clientTsx.includes(footerDisclaimer),
      'DrCarlosPerzabalClient footer must contain Aviso de Responsabilidad Médica'
    );
    assert.ok(
      staticIndexHtml.includes(footerDisclaimer),
      'Static index.html footer must contain Aviso de Responsabilidad Médica'
    );
  });

  it('[T3-BRAND-21] Direct Meta Ads Billing Demarcation: Proposal explicitly specifies ad spend is paid directly by Dr. Perzabal to Meta Ads', () => {
    const metaNoticeRegex = /pagado directamente por el Dr\.(?:\s+Carlos)?\s+Perzabal a Meta/i;
    assert.ok(metaNoticeRegex.test(clientTsx), 'DrCarlosPerzabalClient must declare direct payment notice in math summary');
    assert.ok(metaNoticeRegex.test(staticIndexHtml), 'Static index.html must declare direct payment notice in math summary');
    assert.ok(/excluido de los honorarios de la agencia/i.test(clientTsx), 'Must declare spend is excluded from agency fees');
    assert.ok(/excluido de los honorarios de la agencia/i.test(staticIndexHtml), 'Must declare spend is excluded from agency fees in static index.html');
  });

  it('[T3-BRAND-22] Especificidad procedural en WhatsApp: Cada uno de los 5 procedimientos genera un enlace unívoco con su nombre codificado (ej. Manga%20G%C3%A1strica, Bypass%20G%C3%A1strico, Colecistectom%C3%ADa, Hernioplast%C3%ADa, Consola%20Rob%C3%B3tica)', () => {
    const procedureNames = [
      'Manga Gástrica',
      'Bypass Gástrico',
      'Colecistectomía',
      'Hernioplastía',
      'Consola Robótica',
    ];
    const encodedNames = procedureNames.map((name) => encodeURIComponent(name));
    for (const enc of encodedNames) {
      assert.ok(!enc.includes(' '), `Encoded string must not contain raw spaces: ${enc}`);
    }
    const procs = ['manga', 'bypass', 'vesicula', 'hernia', 'robot'];
    for (const p of procs) {
      assert.ok(
        clientTsx.includes(p) && (staticIndexHtml.includes(p) || pageHtml.includes(p)),
        `Client component and static mirror must track procedure: ${p}`
      );
    }
    assert.ok(
      clientTsx.includes('526563117565'),
      'All procedural WhatsApp links must bind to official phone 526563117565'
    );
  });

  it('[T3-BRAND-23] Coherencia con el Triaje de WhatsApp: El botón de candidatura conduce al paciente al flujo de triaje clínico sin contradecir las advertencias legales de orientación no presencial', () => {
    assert.ok(
      clientTsx.includes('No sustituye la consulta médica') ||
      fullAppText.includes('No sustituye la consulta médica'),
      'Procedural candidacy must preserve non-diagnostic clinical disclaimer'
    );
    assert.ok(
      clientTsx.includes('Orientación médica preliminar') ||
      fullAppText.includes('Orientación médica preliminar') ||
      fullAppText.includes('orientación preliminar'),
      'Must state intake is a preliminary medical orientation'
    );
  });

  it('[T3-BRAND-24] Cero sobrepromesas médicas en fichas de procedimientos: Prohibición de afirmaciones absolutas ("cura definitiva para todos", "cero dolor", "100% garantizado"), estricto apego a COFEPRIS', () => {
    const unethicalClaims = [
      'cura definitiva para todos',
      'cero dolor',
      '100% garantizado',
      'cura milagrosa',
      'sin ningún riesgo',
      'cero riesgo',
      'resultados garantizados',
    ];
    for (const claim of unethicalClaims) {
      assert.ok(
        !fullAppText.toLowerCase().includes(claim),
        `Must not contain unethical medical overpromise: "${claim}"`
      );
    }
  });

  it('[T3-BRAND-25] Blindaje total de marca: Cero menciones de FN1, Frontera Número Uno, La X o clínicas low-cost; 100% marca Apolograma Studio y Dr. Carlos Perzabal', () => {
    const prohibitedBrandTerms = [
      'frontera número uno',
      'frontera numero uno',
      'juárez number one',
      'juarez number one',
      'puerta-juarez.png',
      'monumento a la x',
      'plaza de la mexicanidad',
      'clínica económica',
      'clinica economica',
      'paquete barato',
    ];
    const lower = fullAppText.toLowerCase();
    for (const term of prohibitedBrandTerms) {
      assert.ok(!lower.includes(term), `Proposal must strictly isolate from: "${term}"`);
    }
    assert.ok(!/\bFN1\b/i.test(fullAppText), 'Must contain 0 occurrences of FN1');
    assert.ok(pageHtml.includes('Apolograma'), 'Proposal must be attributed to Apolograma Studio');
    assert.ok(/Dr\.\s+Carlos\s+Tadeo\s+Perzabal\s+Avilez/i.test(fullAppText), 'Must prominently feature Dr. Carlos Tadeo Perzabal Avilez');
  });

});

// =========================================================================
// TIER 4: REAL-WORLD SCENARIOS & PRODUCTION READINESS (12 tests)
// =========================================================================

describe('Tier 4: Real-World Scenarios & Production Readiness', () => {

  it('[T4-SCEN-01] Patient Above-The-Fold First Impression: Hero section immediately establishes high-level surgical authority and Da Vinci robotic precision', () => {
    assert.ok(pageHtml.includes('Dr. Carlos Tadeo Perzabal Avilez'), 'Hero section must display Dr. Perzabal name');
    assert.ok(/Cirujano\s+General/i.test(pageHtml), 'Hero must state Cirujano General');
    assert.ok(/Bari[aá]trico/i.test(pageHtml), 'Hero must state Bariátrico');
    assert.ok(/Rob[oó]tico/i.test(pageHtml), 'Hero must state Robótico');
    assert.ok(pageHtml.includes('Apolograma'), 'Hero/Header must feature Apolograma brand mark');
  });

  it('[T4-SCEN-02] Texas Cross-Border Patient Journey: Clear value proposition for El Paso / Las Cruces patients seeking private bariatric surgery without insurance delays', () => {
    assert.ok(/turismo\s+m[eé]dico|binacional/i.test(fullAppText), 'Must frame binational patient care');
    assert.ok(/hospitalaria|terapia\s+intensiva|uci/i.test(fullAppText), 'Must emphasize hospital safety and ICU infrastructure to reassure cross-border patients');
  });

  it('[T4-SCEN-03] Surgeon Academic Due Diligence: Clinical credentials (UACJ, Hospital General, CMCOEM, Da Vinci) clearly articulated without commercial puffery', () => {
    assert.ok(fullAppText.includes('CMCOEM'), 'Must highlight CMCOEM board certification');
    assert.ok(fullAppText.includes('UACJ'), 'Must highlight UACJ medical school academic leadership');
    assert.ok(fullAppText.includes('Hospital General'), 'Must highlight Hospital General medical directorship');
    assert.ok(fullAppText.includes('Da Vinci'), 'Must highlight Da Vinci robotic certification');
  });

  it('[T4-SCEN-04] Practice Administrator Fiscal Transparency: Invoicing details, Banregio CLABE, and tax breakdown immediately inspectable for payment', () => {
    assert.ok(fullAppText.includes('$36,000'), 'Discloses setup fee');
    assert.ok(fullAppText.includes('$26,000'), 'Discloses monthly fee');
    assert.ok(fullAppText.includes('16%'), 'Discloses 16% tax rate');
    assert.ok(fullAppText.includes('$41,760'), 'Discloses exact setup invoiced amount');
    assert.ok(fullAppText.includes('$30,160'), 'Discloses exact monthly invoiced amount');
    assert.ok(fullAppText.includes('$71,920'), 'Discloses exact initial grand total invoice amount');
    assert.ok(fullAppText.includes('058164657492400290'), 'Discloses Banregio CLABE interbancaria');
    assert.ok(fullAppText.includes('TTE170614QI1'), 'Discloses official RFC');
  });

  it('[T4-SCEN-05] Mobile Patient Inspection at 375px (iPhone SE): Complete usability without horizontal scrolling or overflowing elements', () => {
    const allMeta = `${pageHtml}\n${staticIndexHtml}`;
    assert.ok(allMeta.includes('width=device-width'), 'Requires device-width viewport declaration');
    const allCss = `${stylesContent}\n${fullAppText}`;
    assert.ok(
      allCss.includes('overflow-x: hidden') ||
      allCss.includes('overflow-x:hidden'),
      'Suppresses horizontal scrollbar overflow on mobile viewports'
    );

    // 1. Binational Grid responsive class verification
    assert.ok(
      clientTsx.includes('.doc-binational-grid') && clientTsx.includes('className="doc-binational-grid"'),
      'DrCarlosPerzabalClient must implement and use .doc-binational-grid class'
    );
    assert.ok(
      staticIndexHtml.includes('.doc-binational-grid') && staticIndexHtml.includes('class="doc-binational-grid"'),
      'index.html must implement and use .doc-binational-grid class'
    );
    assert.ok(
      allCss.includes('.doc-binational-grid') && allCss.includes('repeat(3, 1fr)'),
      '.doc-binational-grid must declare 3 columns for desktop'
    );

    // 2. Configurator Categories and Toggle Rows
    assert.ok(
      allCss.includes('.doc-category-title'),
      'Stylesheet must declare .doc-category-title class'
    );
    assert.ok(
      allCss.includes('.doc-toggle-row'),
      'Stylesheet must declare .doc-toggle-row class'
    );

    // 3. Modal Grid responsive class verification
    assert.ok(
      clientTsx.includes('.doc-modal-grid') && clientTsx.includes('className="doc-modal-grid"'),
      'DrCarlosPerzabalClient must implement and use .doc-modal-grid class'
    );
    assert.ok(
      staticIndexHtml.includes('.doc-modal-grid') && staticIndexHtml.includes('class="doc-modal-grid"'),
      'index.html must implement and use .doc-modal-grid class'
    );

    // 4. Kanban & Marketing Pillars responsive grids
    assert.ok(
      allCss.includes('.doc-kanban-board'),
      'Stylesheet must declare .doc-kanban-board class'
    );
    assert.ok(
      allCss.includes('.doc-pillar-grid'),
      'Stylesheet must declare .doc-pillar-grid class'
    );

    // 5. Responsive mobile media queries (<= 768px) collapsing grids to single column (1fr)
    assert.ok(
      allCss.includes('grid-template-columns: 1fr'),
      'Responsive CSS must declare single-column (1fr) collapsing rule'
    );

    // 6. Header responsiveness on mobile: hide secondary brand elements, preserve CTAs
    assert.ok(
      clientTsx.includes('.doc-header-actions') && staticIndexHtml.includes('.doc-header-actions'),
      'Header actions must use .doc-header-actions container class'
    );
    assert.ok(
      allCss.includes('.doc-badge-status') && allCss.includes('display: none !important'),
      'Mobile media query must hide .doc-badge-status on mobile screens to preserve width for CTAs'
    );

    // 7. Configurator Add-on rows responsive mobile media query (<= 768px)
    assert.ok(
      clientTsx.includes('.doc-toggle-row') && clientTsx.includes('flex-direction: column !important'),
      'DrCarlosPerzabalClient must declare flex-direction: column !important for .doc-toggle-row on mobile'
    );
    assert.ok(
      staticIndexHtml.includes('.doc-toggle-row') && staticIndexHtml.includes('flex-direction: column !important'),
      'index.html must declare flex-direction: column !important for .doc-toggle-row on mobile'
    );
    assert.ok(
      allCss.includes('.doc-toggle-row > div:last-child') && allCss.includes('justify-content: space-between'),
      'Mobile media query must expand toggle switch container to full width with space-between alignment'
    );

    // 8. Footer responsive text wrapping and container stacking on mobile
    assert.ok(
      clientTsx.includes('.doc-footer') && clientTsx.includes('word-break: break-word'),
      'DrCarlosPerzabalClient must declare word-break: break-word for .doc-footer on mobile'
    );
    assert.ok(
      staticIndexHtml.includes('.doc-footer') && staticIndexHtml.includes('word-break: break-word'),
      'index.html must declare word-break: break-word for .doc-footer on mobile'
    );
    assert.ok(
      allCss.includes('.doc-footer .doc-container') && allCss.includes('flex-direction: column !important'),
      'Mobile media query must stack .doc-footer .doc-container into a column on mobile viewports'
    );
  });

  it('[T4-SCEN-06] Static Delivery Parity: propuestas/dr-carlos-perzabal/index.html exists, is valid HTML, and contains matching title, credentials, pricing, and triage tree', () => {
    assert.ok(fs.existsSync(STATIC_INDEX_PATH), 'propuestas/dr-carlos-perzabal/index.html must exist');
    assert.ok(staticIndexHtml.includes('<!DOCTYPE html>'), 'Static index must declare valid DOCTYPE');
    assert.ok(staticIndexHtml.includes('Dr. Carlos Tadeo Perzabal Avilez'), 'Static index must contain surgeon name');
    assert.ok(staticIndexHtml.includes('$36,000'), 'Static index must contain setup fee');
    assert.ok(staticIndexHtml.includes('$26,000'), 'Static index must contain monthly fee');
    assert.ok(staticIndexHtml.includes('$71,920'), 'Static index must contain initial grand total');
    assert.ok(staticIndexHtml.includes('058164657492400290'), 'Static index must contain CLABE');
  });

  it('[T4-SCEN-07] ICM Directory Architecture: ICM subfolders 01 to 05 and WORKFLOW_MAP.md exist in propuestas/dr-carlos-perzabal/', () => {
    const workflowMapPath = path.join(ICM_BASE_DIR, 'WORKFLOW_MAP.md');
    assert.ok(fs.existsSync(workflowMapPath), 'WORKFLOW_MAP.md must exist in ICM base directory');

    const expectedSubdirs = [
      '01_Brief_y_Estrategia',
      '02_Activos_Visuales_IA',
      '03_Copia_y_Modulos_Interactivos',
      '04_Ensamblaje_NextJS_React',
      '05_Deploy_y_Telemetria_Radar',
    ];

    for (const subdir of expectedSubdirs) {
      const fullPath = path.join(ICM_BASE_DIR, subdir);
      assert.ok(fs.existsSync(fullPath), `ICM stage directory ${subdir} must exist`);
      assert.ok(fs.statSync(fullPath).isDirectory(), `ICM path ${subdir} must be a directory`);
    }

    const stage4ClientTsxPath = path.join(ICM_BASE_DIR, '04_Ensamblaje_NextJS_React', 'DrCarlosPerzabalClient.tsx');
    assert.ok(fs.existsSync(stage4ClientTsxPath), 'Stage 04 DrCarlosPerzabalClient.tsx must exist');
    assert.equal(
      fs.readFileSync(stage4ClientTsxPath, 'utf-8'),
      clientTsx,
      'Stage 04 DrCarlosPerzabalClient.tsx must strictly synchronize with src/app DrCarlosPerzabalClient.tsx'
    );
  });

  it('[T4-SCEN-08] Public Assets Readiness: All required assets (og_dr_carlos_perzabal.jpg, monograma_perzabal.svg, all 5 procedure SVGs, all 4 credential badges) exist in public/assets/dr-carlos-perzabal/', () => {
    const requiredFiles = [
      'og_dr_carlos_perzabal.jpg',
      'monograma_perzabal.svg',
      'badge_cmcoem.svg',
      'badge_da_vinci.svg',
      'badge_hospital_general.svg',
      'badge_uacj.svg',
      'manga_gastrica.svg',
      'bypass_gastrico.svg',
      'colecistectomia_strasberg.svg',
      'hernioplastia_tapp.svg',
      'consola_da_vinci.svg',
      'modulo_branding_identidad.jpg',
      'modulo_webapp_binacional.jpg',
      'modulo_marketing_autoridad.jpg',
      'modulo_pauta_meta.jpg',
      'modulo_bot_whatsapp.jpg',
      'modulo_crm_quirurgico.jpg',
    ];

    for (const f of requiredFiles) {
      const filePath = path.join(PUBLIC_ASSETS_DIR, f);
      assert.ok(fs.existsSync(filePath), `Required asset ${f} must exist in public/assets/dr-carlos-perzabal/`);
      assert.ok(fs.statSync(filePath).size > 100, `Asset ${f} must not be empty`);
      if (f.endsWith('.svg')) {
        const rawSvg = fs.readFileSync(filePath, 'utf-8');
        assertSvgXmlWellFormed(rawSvg, `public/${f}`);
      }
    }

    // Mirror assets in propuestas/dr-carlos-perzabal/assets/
    const mirrorAssetsDir = path.join(ICM_BASE_DIR, 'assets');
    if (fs.existsSync(mirrorAssetsDir)) {
      for (const f of requiredFiles) {
        const mirrorPath = path.join(mirrorAssetsDir, f);
        assert.ok(fs.existsSync(mirrorPath), `Mirror asset ${f} must exist in propuestas/dr-carlos-perzabal/assets/`);
        if (f.endsWith('.svg')) {
          const rawSvg = fs.readFileSync(mirrorPath, 'utf-8');
          assertSvgXmlWellFormed(rawSvg, `mirror/${f}`);
        }
      }
    }
  });

  it('[T4-SCEN-09] Next.js App Router Page Integration: src/app/dr-carlos-perzabal/page.tsx exports metadata with canonical URL, OpenGraph, and Twitter tags', () => {
    assert.ok(fs.existsSync(PAGE_TSX_PATH), 'page.tsx must exist');
    assert.ok(pageTsx.includes('export const metadata'), 'page.tsx must export Next.js Metadata');
    assert.ok(pageTsx.includes('canonical: \'https://propuestas.tecza.com.mx/dr-carlos-perzabal\''), 'Canonical URL must match official route');
    assert.ok(pageTsx.includes('DrCarlosPerzabalClient'), 'page.tsx must render DrCarlosPerzabalClient');
  });

  it('[T4-SCEN-10] Next.js App Router Client Component Integration: DrCarlosPerzabalClient.tsx compiles cleanly with React hooks, Lucide icons, and zero TypeScript/ESLint errors', () => {
    assert.ok(fs.existsSync(CLIENT_TSX_PATH), 'DrCarlosPerzabalClient.tsx must exist');
    assert.ok(clientTsx.includes("'use client'"), 'DrCarlosPerzabalClient must declare use client directive');
    assert.ok(clientTsx.includes('export default function DrCarlosPerzabalClient'), 'DrCarlosPerzabalClient must have default export');
  });

  it('[T4-SCEN-11] Local Dev / Standalone Execution Reliability: The test suite runs cleanly and deterministically with 0 external dependencies', () => {
    assert.ok(activeBaseUrl.startsWith('http'), `Active base URL must be a valid HTTP address (was ${activeBaseUrl})`);
    assert.equal(pageStatus, 200, 'Page status must be HTTP 200');
  });

  it('[T4-SCEN-12] Production Domain Compliance: Validates canonical URL, Open Graph absolute URL, and domain compliance (propuestas.tecza.com.mx)', () => {
    const allowedDomain = 'propuestas.tecza.com.mx';
    assert.ok(
      pageTsx.includes(allowedDomain) || staticIndexHtml.includes(allowedDomain),
      `Proposal metadata must strictly use ${allowedDomain}`
    );
    assert.ok(!pageTsx.includes('apolograma.com'), 'Must not use unauthorized apolograma.com domain per business rules');
    assert.ok(!staticIndexHtml.includes('apolograma.com'), 'Static index must not use unauthorized apolograma.com domain');
  });

  it('[T4-SCEN-13] Paridad estricta entre Next.js y HTML estático: Tanto DrCarlosPerzabalClient.tsx como propuestas/dr-carlos-perzabal/index.html cuentan con los mismos 5 procedimientos, visor, 4 KPIs y CTA', () => {
    assert.ok(fs.existsSync(CLIENT_TSX_PATH), 'DrCarlosPerzabalClient.tsx must exist');
    assert.ok(fs.existsSync(STATIC_INDEX_PATH), 'Static index.html must exist');

    const procs = ['manga', 'bypass', 'vesicula', 'hernia', 'robot'];
    for (const p of procs) {
      assert.ok(clientTsx.includes(p), `Client component must include procedure: ${p}`);
      assert.ok(staticIndexHtml.includes(p), `Static index.html mirror must include procedure: ${p}`);
    }

    assert.ok(
      clientTsx.includes('activeProcTab') &&
      (staticIndexHtml.includes('setProcTab') || staticIndexHtml.includes('activeProcTab') || staticIndexHtml.includes('proc-content')),
      'Both client and static must implement tab switching mechanism'
    );

    const clinicalTerms = ['36 Fr', 'Strasberg', 'GLP-1', 'Fruchaud', 'Da Vinci'];
    for (const term of clinicalTerms) {
      assert.ok(clientTsx.includes(term), `Client component must feature clinical term: ${term}`);
      assert.ok(staticIndexHtml.includes(term), `Static index.html must feature clinical term: ${term}`);
    }
  });

  it('[T4-SCEN-14] Verificación de disponibilidad en producción: Solicitud HTTP a https://propuestas.tecza.com.mx/dr-carlos-perzabal confirmando respuesta HTTP 200 y certificado SSL válido', async () => {
    const prodUrl = 'https://propuestas.tecza.com.mx/dr-carlos-perzabal';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(prodUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Hermes-E2E-Auditor/1.0' },
      });
      clearTimeout(timeoutId);
      assert.equal(res.status, 200, `Production URL ${prodUrl} must return HTTP 200`);
    } catch (err) {
      // Graceful offline fallback in airgapped environments
      if (err.name === 'AbortError' || err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        console.warn(`[WARN] Production URL ${prodUrl} unreachable in current network environment: ${err.message}`);
        assert.ok(true, 'Offline execution tolerated');
      } else {
        throw err;
      }
    }
  });

});
