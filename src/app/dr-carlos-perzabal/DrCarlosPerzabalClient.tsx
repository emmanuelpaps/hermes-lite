'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Activity,
  Award,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ChevronRight,
  Send,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Smartphone,
  Cpu,
  Layers,
  FileCheck,
  AlertCircle,
  X,
  RefreshCw,
  Globe,
  Sliders,
  DollarSign,
  HeartPulse,
  Compass,
  Users,
  LayoutDashboard,
  BookOpen,
  Filter,
  ArrowUpRight,
  Database,
} from 'lucide-react';

// ==========================================
// 1. TRIAGE SIMULATOR DATA & TYPES
// ==========================================

interface TriageOption {
  label: string;
  nextNode: string;
  value?: string;
}

interface TriageStep {
  id: string;
  botMessage: string;
  options: TriageOption[];
  field?: 'procedure' | 'bmiRange' | 'comorbidity' | 'priorSurgery' | 'hasUltrasound' | 'urgency' | 'location';
}

const TRIAGE_TREE: Record<string, TriageStep> = {
  root: {
    id: 'root',
    botMessage:
      'Hola. Soy el Asistente Clínico y de Triaje del Dr. Carlos Tadeo Perzabal Avilez (Cirujano General, Bariátrico y Robótico en Ciudad Juárez). Para brindarle una orientación médica precisa, ¿cuál es el motivo principal de su consulta?',
    options: [
      { label: 'Bariatría / Pérdida de Peso', nextNode: 'bar_imc', value: 'Cirugía Bariátrica / Pérdida de Peso' },
      { label: 'Vesícula Biliar', nextNode: 'ves_us', value: 'Cirugía de Vesícula Biliar' },
      { label: 'Hernia Abdominal / Inguinal', nextNode: 'her_type', value: 'Reparación de Hernia Abdominal' },
      { label: 'Cirugía Robótica Da Vinci', nextNode: 'rob_spec', value: 'Cirugía Robótica Da Vinci' },
    ],
    field: 'procedure',
  },
  // Branch: Bariatric
  bar_imc: {
    id: 'bar_imc',
    botMessage:
      'El Dr. Carlos Perzabal valora a cada paciente bajo los consensos internacionales ASMBS/IFSO 2022. Para evaluar si es candidato a Manga o Bypass Gástrico, ¿en qué rango se encuentra su Índice de Masa Corporal (IMC)?',
    options: [
      { label: 'IMC 30 - 34.9 (Obesidad Grado I)', nextNode: 'bar_comorb', value: 'IMC 30-34.9' },
      { label: 'IMC 35 - 39.9 (Obesidad Grado II)', nextNode: 'bar_comorb', value: 'IMC 35-39.9' },
      { label: 'IMC >= 40 (Obesidad Severa)', nextNode: 'bar_comorb', value: 'IMC >= 40' },
      { label: 'No conozco mi IMC (Deseo calcularlo en cita)', nextNode: 'bar_comorb', value: 'IMC por calcular' },
    ],
    field: 'bmiRange',
  },
  bar_comorb: {
    id: 'bar_comorb',
    botMessage:
      '¿Cuenta con diagnóstico o tratamiento de alguna de las siguientes condiciones metabólicas asociadas?',
    options: [
      { label: 'Diabetes Tipo 2 / Resistencia a Insulina', nextNode: 'bar_prior', value: 'Diabetes Tipo 2 / Resistencia a Insulina' },
      { label: 'Reflujo Severo (ERGE) / Hernia Hiatal', nextNode: 'bar_prior', value: 'Reflujo Severo (ERGE)' },
      { label: 'Hipertensión / Apnea del Sueño', nextNode: 'bar_prior', value: 'Hipertensión / Apnea' },
      { label: 'Ninguna condición metabólica diagnosticada', nextNode: 'bar_prior', value: 'Sin comorbilidades diagnosticadas' },
    ],
    field: 'comorbidity',
  },
  bar_prior: {
    id: 'bar_prior',
    botMessage:
      '¿Se ha realizado previamente alguna cirugía de pérdida de peso o del aparato digestivo?',
    options: [
      { label: 'Primera vez (Procedimiento primario)', nextNode: 'geo_origin', value: 'Procedimiento primario' },
      { label: 'Sí, busco Cirugía de Revisión', nextNode: 'geo_origin', value: 'Cirugía de Revisión' },
      { label: 'Cirugía abdominal previa no bariátrica', nextNode: 'geo_origin', value: 'Cirugía previa no bariátrica' },
    ],
    field: 'priorSurgery',
  },
  // Branch: Vesícula
  ves_us: {
    id: 'ves_us',
    botMessage:
      'El Dr. Perzabal realiza Colecistectomía Laparoscópica de Mínima Invasión con técnica de Visión Crítica de Seguridad Strasberg (CVS). ¿Cuenta con estudio de Ultrasonido reciente de hígado y vías biliares?',
    options: [
      { label: 'Sí, cuento con Ultrasonido reciente', nextNode: 'ves_urgency', value: 'Con Ultrasonido previo' },
      { label: 'No, requiero orden para realizarlo', nextNode: 'ves_urgency', value: 'Sin Ultrasonido' },
      { label: 'Tengo dolor agudo bajo la costilla derecha', nextNode: 'ves_urgency', value: 'Dolor agudo presente' },
    ],
    field: 'hasUltrasound',
  },
  ves_urgency: {
    id: 'ves_urgency',
    botMessage:
      '¿Presenta actualmente cólico biliar recurrente tras consumir grasas, náuseas, fiebre o coloración amarilla en ojos?',
    options: [
      { label: 'Episodios frecuentes de dolor tras comer', nextNode: 'geo_origin', value: 'Cólico biliar recurrente' },
      { label: 'Asintomático / Hallazgo incidental', nextNode: 'geo_origin', value: 'Hallazgo incidental' },
      { label: 'Dolor leve u ocasional', nextNode: 'geo_origin', value: 'Dolor leve' },
    ],
    field: 'urgency',
  },
  // Branch: Hernia
  her_type: {
    id: 'her_type',
    botMessage:
      'El Dr. Perzabal realiza reparación laparoscópica y robótica de pared abdominal (TAPP/TEP) con malla anatómica sin tensión. ¿Qué tipo de hernia requiere valorar?',
    options: [
      { label: 'Hernia Inguinal (ingle)', nextNode: 'her_symp', value: 'Hernia Inguinal' },
      { label: 'Hernia Umbilical (ombligo)', nextNode: 'her_symp', value: 'Hernia Umbilical' },
      { label: 'Hernia Incisional (cirugía previa)', nextNode: 'her_symp', value: 'Hernia Incisional' },
    ],
    field: 'comorbidity',
  },
  her_symp: {
    id: 'her_symp',
    botMessage:
      '¿Presenta dolor al esfuerzo físico o dificultad para que el abultamiento regrese a su cavidad?',
    options: [
      { label: 'Reducible sin dolor incapacitante', nextNode: 'geo_origin', value: 'Reducible sin dolor agudo' },
      { label: 'Molestia o dolor moderado al esfuerzo', nextNode: 'geo_origin', value: 'Dolor al esfuerzo' },
      { label: 'Aumento progresivo de volumen', nextNode: 'geo_origin', value: 'Crecimiento progresivo' },
    ],
    field: 'urgency',
  },
  // Branch: Robotic Da Vinci
  rob_spec: {
    id: 'rob_spec',
    botMessage:
      'El Dr. Carlos Tadeo Perzabal está certificado en consola quirúrgica Da Vinci, ofreciendo visión tridimensional 3D-HD y articulación EndoWrist de 540°. ¿En qué área busca abordaje robótico?',
    options: [
      { label: 'Cirugía Bariátrica Robótica', nextNode: 'geo_origin', value: 'Bariatría Robótica' },
      { label: 'Reconstrucción de Pared Abdominal', nextNode: 'geo_origin', value: 'Pared Abdominal Robótica' },
      { label: 'Segunda Opinión Quirúrgica Especializada', nextNode: 'geo_origin', value: 'Segunda Opinión Robótica' },
    ],
    field: 'comorbidity',
  },
  // Branch: Origin / Logistics
  geo_origin: {
    id: 'geo_origin',
    botMessage:
      'Para coordinar los tiempos de valoración, estudios preoperatorios y logística hospitalaria, ¿desde dónde nos contacta?',
    options: [
      { label: 'Ciudad Juárez / Estado de Chihuahua', nextNode: 'summary', value: 'Ciudad Juárez' },
      { label: 'El Paso, TX / Las Cruces, NM / Texas', nextNode: 'summary', value: 'El Paso, TX / Texas' },
      { label: 'Otra ciudad de México o EE.UU.', nextNode: 'summary', value: 'Foráneo / Otro' },
    ],
    field: 'location',
  },
};

// ==========================================
// 2. CONFIGURATOR DATA (SUITE MODULAR APOLOGRAMA)
// ==========================================

export interface ServiceModuleItem {
  id: string;
  name: string;
  price: number;
  period: 'setup' | 'monthly';
  tag: string;
  badge: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  imageBadge: string;
}

export const SETUP_MODULES: ServiceModuleItem[] = [
  {
    id: 'branding',
    name: 'Identidad Visual & Branding Médico de Alto Nivel',
    price: 12000,
    period: 'setup',
    tag: 'Arquitectura de Prestigio',
    badge: 'Setup Inicial',
    image: '/assets/dr-carlos-perzabal/modulo_branding_identidad.jpg',
    imageAlt: 'Mockup de Papelería Médica y Monograma Quirúrgico Dr. Carlos Perzabal',
    imageBadge: 'DIRECCIÓN DE ARTE',
    description:
      'Sistema visual quirúrgico sobrio, monograma institucional del Dr. Carlos Perzabal, tipografía clínica, manual de aplicación de marca y papelería médica para consultorio (recetarios, hojas membretadas y consentimientos informados). Erradica cualquier estigma visual de clínica low-cost.',
    bullets: [
      'Monograma y firma quirúrgica oficial Dr. Carlos Tadeo Perzabal Avilez',
      'Papelería médica de consultorio y consentimientos quirúrgicos informados',
      'Dirección de arte sobria: Deep Slate, Surgical Cyan y Clinical Gold',
      'Cero ilustraciones de IA especulativas ni estigma de clínica low-cost',
    ],
  },
  {
    id: 'desarrollo_web',
    name: 'Desarrollo Web / Webapp Quirúrgica Binacional',
    price: 24000,
    period: 'setup',
    tag: 'Infraestructura Tecnológica',
    badge: 'Setup Inicial',
    image: '/assets/dr-carlos-perzabal/modulo_webapp_binacional.jpg',
    imageAlt: 'Portal Quirúrgico Multi-Dispositivo MacBook Pro e iPad Pro',
    imageBadge: 'WEBAPP MULTI-DEVICE',
    description:
      'Portal web médico de alta velocidad (<1.2s en Vercel Edge) con arquitectura bilateral (Juárez · El Paso, TX), fichas técnicas interactivas con esquemas quirúrgicos vectoriales (Manga LSG, Bypass LRYGB, Vesícula CVS, Hernias TAPP y Consola Da Vinci), calculadoras clínicas y marco de turismo médico para eludir deducibles de EE.UU.',
    bullets: [
      'Fichas de procedimientos con esquemas vectoriales: Manga, Bypass, Vesícula CVS, Hernias, Da Vinci',
      'Marco de turismo médico binacional (elusión de deducibles de $5k–$10k USD en Texas)',
      'Optimización mobile-first de máxima velocidad (<1.2s) con 0px de desbordamiento horizontal',
      'Respaldos institucionales: Hospital General de Cd. Juárez, UACJ, CMCOEM',
    ],
  },
];

export const MONTHLY_MODULES: ServiceModuleItem[] = [
  {
    id: 'marketing_mensual',
    name: 'Marketing y Planeación Mensual de Autoridad',
    price: 10000,
    period: 'monthly',
    tag: 'Dirección Editorial Continua',
    badge: 'Iguala Mensual',
    image: '/assets/dr-carlos-perzabal/modulo_marketing_autoridad.jpg',
    imageAlt: 'Tablero de Producción Audiovisual y Calendario Quirúrgico',
    imageBadge: 'PRODUCCIÓN CLÍNICA',
    description:
      'Estrategia y dirección editorial continua: calendario mensual de contenidos clínicos, educación médica sobre patologías digestivas, preparación preoperatoria, desmitificación de bariatría y casos clínicos éticos. Cero promociones vulgares ni lenguaje de liquidación.',
    bullets: [
      'Calendario editorial mensual con 4 pilares de rigor científico y autoridad médica',
      'Educación clínica de síntomas, preparación prequirúrgica y prevención digestiva',
      'Supervisión editorial médica estricta sin tácticas comerciales devaluatorias',
      'Presentación ética de casos clínicos y tecnología quirúrgica avanzada',
    ],
  },
  {
    id: 'pauta_meta',
    name: 'Pauta Meta Ads Quirúrgica Hipersegmentada',
    price: 7000,
    period: 'monthly',
    tag: 'Gestión de Medios Digitales',
    badge: 'Iguala Mensual',
    image: '/assets/dr-carlos-perzabal/modulo_pauta_meta.jpg',
    imageAlt: 'Consola Meta Ads Manager con Geofencing Binacional El Paso Juárez',
    imageBadge: 'META ADS MANAGER',
    description:
      'Gestión avanzada de campañas en Meta Business Suite hipersegmentadas en Ciudad Juárez y el condado de El Paso (Texas). Embudos de tráfico calificado hacia pacientes con necesidad de bariatría, colecistectomía o cirugía robótica. *(Inversión de pauta pagada directamente por el cliente a Meta).*',
    bullets: [
      'Segmentación médica precisa en Ciudad Juárez y condado de El Paso / Las Cruces',
      'Campañas segmentadas por patología (bariatría, dolor vesicular, hernias, robótica)',
      'Métricas puramente técnicas de tráfico calificado, CTR y tasa de conversión',
      'Optimización semanal de pauta publicitaria en Facebook e Instagram',
    ],
  },
  {
    id: 'bot_whatsapp',
    name: 'Bot de WhatsApp con Triaje Clínico 24/7',
    price: 5000,
    period: 'monthly',
    tag: 'Automatización Clínica',
    badge: 'Iguala Mensual',
    image: '/assets/dr-carlos-perzabal/modulo_bot_whatsapp.jpg',
    imageAlt: 'iPhone 16 Pro con Chat Clínico Verificado y Triaje ASMBS',
    imageBadge: 'WHATSAPP CLOUD API',
    description:
      'Asistente inteligente sobre WhatsApp Cloud API disponible 24/7 con árbol de triaje de 4 ramas (Bariatría bajo guías ASMBS 2022, Vesícula, Hernia y Robótica), cálculo preliminar y despacho automático de la ficha del paciente al consultorio.',
    bullets: [
      'Árbol clínico de 4 ramas (Bariatría, Vesícula, Hernia, Cirugía Robótica)',
      'Filtro previo de elegibilidad médica y cálculo de IMC',
      'Despacho automático de ficha prequirúrgica al WhatsApp del consultorio (+52 656 311 7565)',
      'Atención continua 24/7 para canalización inmediata de prospectos calificados locales y foráneos',
    ],
  },
  {
    id: 'crm_medico',
    name: 'CRM Quirúrgico para Médicos',
    price: 4000,
    period: 'monthly',
    tag: 'Pipeline Clínico de Pacientes',
    badge: 'Iguala Mensual',
    image: '/assets/dr-carlos-perzabal/modulo_crm_quirurgico.jpg',
    imageAlt: 'Dashboard SaaS de Pipeline Quirúrgico Kanban 5 Etapas',
    imageBadge: 'PIPELINE SAAS KANBAN',
    description:
      'Plataforma de gestión centralizada y pipeline de pacientes: trazabilidad desde el primer contacto (Lead Web / WhatsApp) hasta la consulta de valoración, programación de quirófano y seguimiento postoperatorio, optimizando el flujo de prospectos calificados.',
    bullets: [
      'Tablero kanban médico con 5 etapas de conversión clínica',
      'Expedientes digitales rápidos de prospectos con ficha de triaje integrada',
      'Seguimiento automatizado para confirmación de consulta presencial',
      'Control de pacientes postoperados y recordatorios de citas de revisión',
    ],
  },
];

// CRM Mockup Data
export interface CrmPatient {
  id: string;
  name: string;
  origin: string;
  procedure: string;
  stage: 'lead' | 'triage' | 'cita' | 'quirofano' | 'postop';
  stageLabel: string;
  clinicalNote: string;
  badgeColor: string;
  date: string;
  details: {
    bmi?: string;
    ultrasound?: string;
    insurance?: string;
    scheduledDate?: string;
    nextFollowup?: string;
  };
}

export const CRM_PATIENTS: CrmPatient[] = [
  {
    id: 'p1',
    name: 'Mariana R.',
    origin: 'El Paso, TX',
    procedure: 'Manga Gástrica por Laparoscopía (LSG)',
    stage: 'triage',
    stageLabel: 'Triaje Precalificado',
    clinicalNote: 'IMC 36.8 con reflujo leve. Califica bajo guías ASMBS 2022. Desea eludir deducible de $8,500 USD en Texas.',
    badgeColor: '#00A3E0',
    date: 'Hoy, 09:14 AM',
    details: {
      bmi: '36.8 (Candidata Quirúrgica Primaria)',
      insurance: 'Sin cobertura bariátrica en EE.UU.',
      scheduledDate: 'En espera de elección de fecha en agenda',
    },
  },
  {
    id: 'p2',
    name: 'Roberto S.',
    origin: 'Ciudad Juárez, Chih.',
    procedure: 'Colecistectomía Laparoscópica (CVS Strasberg)',
    stage: 'cita',
    stageLabel: 'Cita en Consultorio Agendada',
    clinicalNote: 'Dolor en hipocondrio derecho postprandial. Ultrasonido con litiasis de 14mm sin engrosamiento mural severo.',
    badgeColor: '#38BDF8',
    date: 'Lunes, 11:30 AM',
    details: {
      ultrasound: 'Confirmado con colelitiasis sintomática',
      scheduledDate: 'Lunes 11:30 AM (Centro Médico Especialidades)',
    },
  },
  {
    id: 'p3',
    name: 'Ing. Carlos V.',
    origin: 'Ciudad Juárez, Chih.',
    procedure: 'Hernioplastía Inguinal Robótica Da Vinci',
    stage: 'quirofano',
    stageLabel: 'Cirugía Programada',
    clinicalNote: 'Hernia inguinal bilateral indirecta recurrente. Prefiere abordaje robótico Da Vinci por retorno laboral acelerado.',
    badgeColor: '#D4AF37',
    date: 'Jueves, 08:00 AM',
    details: {
      scheduledDate: 'Jueves 08:00 AM (Quirófano 3)',
      nextFollowup: 'Protocolo de estancia corta / ambulatorio',
    },
  },
  {
    id: 'p4',
    name: 'Patricia G.',
    origin: 'Las Cruces, NM',
    procedure: 'Bypass Gástrico en Y de Roux (LRYGB)',
    stage: 'postop',
    stageLabel: 'Seguimiento Postoperatorio',
    clinicalNote: 'Día 14 post-quirúrgico. Evolución hemodinámica favorable (-8.2 kg, remisión temprana de hiperglicemia).',
    badgeColor: '#10B981',
    date: 'Día 14 Post-Op',
    details: {
      bmi: 'Pre-op 41.2 -> Actual 38.1',
      nextFollowup: 'Consulta telemédica bilingüe Viernes 4:00 PM',
    },
  },
  {
    id: 'p5',
    name: 'Esteban L.',
    origin: 'El Paso, TX',
    procedure: 'Reparación de Hernia Hiatal / ERGE Severo',
    stage: 'lead',
    stageLabel: 'Lead Captado (Meta Ads)',
    clinicalNote: 'Ingresó vía anuncio de Autoridad Quirúrgica en Facebook (Texas). Refiere ardor retroesternal crónico resistente a IBP.',
    badgeColor: '#94A3B8',
    date: 'Ayer, 07:45 PM',
    details: {
      insurance: 'Auto-pay binacional',
      nextFollowup: 'Canalizado al Bot de WhatsApp para triaje clínico',
    },
  },
];

// Marketing Authority Pillars
export const MARKETING_PILLARS = [
  {
    id: 'pil_1',
    number: '01',
    title: 'Técnica Quirúrgica & Evidencia Científica',
    subtitle: 'Rigor y Maestría en Quirófano',
    description:
      'Contenidos que exponen la precisión técnica del Dr. Perzabal: Visión Crítica de Seguridad Strasberg (CVS) para proteger la vía biliar, uso de consola robótica Da Vinci y prueba de hermeticidad en bariatría. Demuestra por qué la cirugía debe realizarse con un cirujano de alta especialidad.',
    highlights: [
      'Visión Crítica de Seguridad (CVS) en Colecistectomía',
      'Articulación 360° y visión 3D 10x de Cirugía Robótica Da Vinci',
      'Calibración con bujía 36 Fr y sutura invaginante en Manga Gástrica',
      'Cero improvisaciones: infraestructura con UCI y Banco de Sangre',
    ],
  },
  {
    id: 'pil_2',
    number: '02',
    title: 'Consensos Clínicos & Educación Bariátrica',
    subtitle: 'Desmitificación con Respaldos Médicos',
    description:
      'Artículos y piezas explicativas bajo las guías internacionales ASMBS / IFSO 2022. Explicamos al paciente por qué la obesidad es una enfermedad metabólica y cómo la cirugía modula hormonas como la grelina y GLP-1, alejándonos de culpabilizaciones y dietas milagro.',
    highlights: [
      'Criterios ASMBS 2022: Cirugía desde IMC 30 con comorbilidades',
      'Regulación hormonal del apetito: grelina, GLP-1 y saciedad real',
      'Diferencias clínicas objetivas entre Manga y Bypass Gástrico',
      'Acompañamiento multidisciplinario: nutrición y psicología clínica',
    ],
  },
  {
    id: 'pil_3',
    number: '03',
    title: 'Prevención Digestiva & Síntomas de Alarma',
    subtitle: 'Triaje Educativo Oportuno',
    description:
      'Alertas educativas para la población sobre complicaciones comunes: riesgos de postergar una colecistectomía (pancreatitis biliar, hidrocolecisto) o complicaciones de hernias no tratadas (estrangulamiento e incarceración). Fomenta la consulta programada antes de una urgencia.',
    highlights: [
      'Dolor cólico en hipocondrio derecho vs indigestión común',
      'Por qué los medicamentos no disuelven los cálculos vesiculares',
      'Riesgo de estrangulamiento en hernias inguinales y umbilicales',
      'Indicaciones para colocación de malla laparoscópica de alta densidad',
    ],
  },
  {
    id: 'pil_4',
    number: '04',
    title: 'Atención Binacional & Turismo Quirúrgico Ético',
    subtitle: 'Seguridad Fronteriza para Texas',
    description:
      'Contenidos en inglés y español para el paciente de El Paso, Las Cruces y suroeste de EE.UU. que busca eludir deducibles hospitalarios de $5,000–$10,000 USD sin sacrificar estándares hospitalarios ni seguridad clínica a 15 minutos del puente internacional.',
    highlights: [
      'Logística de cruce y consultorio a 15 min de Puentes Internacionales',
      'Hospital con Unidad de Cuidados Intensivos (UCI) y Banco de Sangre',
      'Resumen quirúrgico y notas postoperatorias bilingües oficiales',
      'Ahorro de hasta el 65% respecto al costo hospitalario out-of-pocket en Texas',
    ],
  },
];

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function DrCarlosPerzabalClient() {
  // Configurator state: ALL 6 modules active by default (Hybrid Setup + Monthly)
  const [activeModules, setActiveModules] = useState<Record<string, boolean>>({
    branding: true,
    desarrollo_web: true,
    marketing_mensual: true,
    pauta_meta: true,
    bot_whatsapp: true,
    crm_medico: true,
  });

  // CRM Interactive Pipeline State
  const [selectedCrmPatient, setSelectedCrmPatient] = useState<CrmPatient>(CRM_PATIENTS[0]);
  const [crmFilter, setCrmFilter] = useState<string>('todos');

  // Marketing Authority Pillars State
  const [activePillarId, setActivePillarId] = useState<string>('pil_1');

  // Triage state
  const [triageHistory, setTriageHistory] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: TRIAGE_TREE.root.botMessage,
    },
  ]);
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [collectedData, setCollectedData] = useState<Record<string, string>>({});
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Procedure tabs state
  const [activeProcTab, setActiveProcTab] = useState<'manga' | 'bypass' | 'vesicula' | 'hernia' | 'robot'>('manga');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const [modalForm, setModalForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '10:30 AM',
  });

  // CLABE copy state
  const [copiedClabe, setCopiedClabe] = useState<boolean>(false);

  // Admin bypass state (triple-click on brand logo)
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Initialize Telemetry on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const hasAdminParam = urlParams.get('admin') === '1' || urlParams.get('bypass') === '1';
        const isLocal =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';
        const hasAdminCookie = localStorage.getItem('apolo_admin_device') === '1';

        if (hasAdminParam || hasAdminCookie) {
          setIsAdminMode(true);
          localStorage.setItem('apolo_admin_device', '1');
        }

        if (!isLocal && !hasAdminParam && !hasAdminCookie) {
          const sessionKey = 'apolo_open_dr_carlos_perzabal';
          const lastNotified = sessionStorage.getItem(sessionKey);
          if (!lastNotified || Date.now() - parseInt(lastNotified, 10) >= 300000) {
            sessionStorage.setItem(sessionKey, Date.now().toString());
            fetch('/api/notify-open', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                clientName: 'Dr. Carlos Tadeo Perzabal Avilez',
                clientSlug: 'dr-carlos-perzabal',
                url: window.location.href,
                referrer: document.referrer || 'Directo',
                screenResolution: `${window.screen.width}x${window.screen.height}`,
              }),
              keepalive: true,
            }).catch(() => {});
          }
        }

        const glow = document.getElementById('ambient-cursor-glow');
        const onMouseMove = (e: MouseEvent) => {
          if (glow) {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
          }
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => {
          window.removeEventListener('mousemove', onMouseMove);
        };
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Handle Logo Triple Click for Admin Toggle
  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 3) {
      const newStatus = !isAdminMode;
      setIsAdminMode(newStatus);
      if (newStatus) {
        localStorage.setItem('apolo_admin_device', '1');
        alert('Modo Administrador Apolograma ACTIVADO (Telemetría silenciada)');
      } else {
        localStorage.removeItem('apolo_admin_device');
        alert('Modo Administrador Apolograma DESACTIVADO');
      }
      setLogoClicks(0);
    }
  };

  // Auto-scroll triage chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [triageHistory, isTyping]);

  // Handle Triage Option Click
  const handleSelectTriageOption = (opt: TriageOption) => {
    if (isTyping) return;

    const currentStep = TRIAGE_TREE[currentNodeId];
    if (currentStep && currentStep.field && opt.value) {
      setCollectedData((prev) => ({
        ...prev,
        [currentStep.field as string]: opt.value as string,
      }));
    }

    // Append user selection
    setTriageHistory((prev) => [...prev, { sender: 'user', text: opt.label }]);

    if (opt.nextNode === 'summary') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentNodeId('summary');
        const summaryText =
          `📋 **Ficha de Orientación Quirúrgica Generada:**\n` +
          `• Motivo: ${collectedData.procedure || opt.value || 'Valoración Quirúrgica'}\n` +
          (collectedData.bmiRange ? `• Perfil IMC: ${collectedData.bmiRange}\n` : '') +
          (collectedData.comorbidity ? `• Condición: ${collectedData.comorbidity}\n` : '') +
          (collectedData.hasUltrasound ? `• Ultrasonido: ${collectedData.hasUltrasound}\n` : '') +
          `• Procedencia: ${opt.value || 'Ciudad Juárez'}\n` +
          `• Especialista: Dr. Carlos Tadeo Perzabal Avilez (CMCOEM & Da Vinci)\n\n` +
          `⚡ Orientación médica preliminar. No sustituye la consulta médica formal.`;

        setTriageHistory((prev) => [...prev, { sender: 'bot', text: summaryText }]);
      }, 750);
      return;
    }

    const nextStep = TRIAGE_TREE[opt.nextNode];
    if (nextStep) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentNodeId(opt.nextNode);
        setTriageHistory((prev) => [...prev, { sender: 'bot', text: nextStep.botMessage }]);
      }, 750);
    }
  };

  // Reset Triage
  const handleResetTriage = () => {
    setTriageHistory([{ sender: 'bot', text: TRIAGE_TREE.root.botMessage }]);
    setCurrentNodeId('root');
    setCollectedData({});
    setIsTyping(false);
  };

  // Build WhatsApp Dispatch URL for Triage
  const triageWhatsAppUrl = useMemo(() => {
    const phone = '526563117565';
    const lines = [
      'Hola Dr. Carlos Perzabal, completé el triaje interactivo en su portal médico:',
      '',
      '📋 FICHA DE ORIENTACIÓN QUIRÚRGICA:',
      `• Especialidad: ${collectedData.procedure || 'Cirugía General y Bariátrica'}`,
      collectedData.bmiRange ? `• Perfil / IMC: ${collectedData.bmiRange}` : '',
      collectedData.comorbidity ? `• Condición: ${collectedData.comorbidity}` : '',
      collectedData.hasUltrasound ? `• Ultrasonido: ${collectedData.hasUltrasound}` : '',
      collectedData.urgency ? `• Sintomatología: ${collectedData.urgency}` : '',
      `• Origen del Paciente: ${collectedData.location || 'Ciudad Juárez'}`,
      '',
      'Solicito agendar consulta de valoración especializada con el Dr. Carlos Tadeo Perzabal Avilez.',
    ].filter(Boolean);

    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [collectedData]);

  // Toggle Modular Service Item
  const toggleModule = (moduleId: string) => {
    setActiveModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Calculate Investment Math (Hybrid Setup + Monthly Retainer)
  const investmentMath = useMemo(() => {
    let setupSubtotal = 0;
    SETUP_MODULES.forEach((m) => {
      if (activeModules[m.id]) {
        setupSubtotal += m.price;
      }
    });
    const setupIva = Math.round(setupSubtotal * 0.16);
    const setupTotal = setupSubtotal + setupIva;

    let monthlySubtotal = 0;
    MONTHLY_MODULES.forEach((m) => {
      if (activeModules[m.id]) {
        monthlySubtotal += m.price;
      }
    });
    const monthlyIva = Math.round(monthlySubtotal * 0.16);
    const monthlyTotal = monthlySubtotal + monthlyIva;
    const monthlyDaily = Math.round(monthlyTotal / 30);

    const initialGrandTotal = setupTotal + monthlyTotal;

    return {
      setupSubtotal,
      setupIva,
      setupTotal,
      monthlySubtotal,
      monthlyIva,
      monthlyTotal,
      monthlyDaily,
      initialGrandTotal,
    };
  }, [activeModules]);

  // Copy CLABE
  const handleCopyClabe = async () => {
    try {
      await navigator.clipboard.writeText('058164657492400290');
      setCopiedClabe(true);
      setTimeout(() => setCopiedClabe(false), 2500);
    } catch {
      setCopiedClabe(true);
      setTimeout(() => setCopiedClabe(false), 2500);
    }
  };

  // Meeting Modal Date Validation (Excludes Weekends)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      setModalForm((prev) => ({ ...prev, date: '' }));
      return;
    }
    const [y, m, d] = val.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const day = dateObj.getDay();

    if (day === 0 || day === 6) {
      setModalError('Las sesiones ejecutivas se agendan exclusivamente de Lunes a Viernes en días hábiles.');
      setModalForm((prev) => ({ ...prev, date: '' }));
      return;
    }
    setModalError('');
    setModalForm((prev) => ({ ...prev, date: val }));
  };

  // Open Modal with Default Date (Next Business Day)
  const openModal = () => {
    const now = new Date();
    const target = new Date(now);
    target.setDate(target.getDate() + 1);
    if (target.getDay() === 6) target.setDate(target.getDate() + 2);
    else if (target.getDay() === 0) target.setDate(target.getDate() + 1);

    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');

    setModalForm((prev) => ({
      ...prev,
      date: prev.date || `${yyyy}-${mm}-${dd}`,
    }));
    setModalSuccess(false);
    setModalError('');
    setIsModalOpen(true);
  };

  // Submit Meeting Form
  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.phone.trim() || !modalForm.date) {
      setModalError('Por favor complete su nombre, teléfono y fecha hábil.');
      return;
    }

    setModalLoading(true);
    setModalError('');

    const selectedModulesList: string[] = [];
    SETUP_MODULES.forEach((m) => {
      if (activeModules[m.id]) {
        selectedModulesList.push(`[Setup] ${m.name}`);
      }
    });
    MONTHLY_MODULES.forEach((m) => {
      if (activeModules[m.id]) {
        selectedModulesList.push(`[Mensual] ${m.name}`);
      }
    });

    try {
      const res = await fetch('/api/schedule-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: 'Dr. Carlos Tadeo Perzabal Avilez',
          clientSlug: 'dr-carlos-perzabal',
          attendeeName: modalForm.name,
          phone: modalForm.phone,
          date: modalForm.date,
          time: modalForm.time,
          selectedModules: selectedModulesList,
          url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      if (res.ok) {
        setModalSuccess(true);
      } else {
        setModalSuccess(true); // Graceful recovery
      }
    } catch {
      setModalSuccess(true); // Offline fallback
    } finally {
      setModalLoading(false);
    }
  };

  // Format Currency
  const formatMxn = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Dynamic WhatsApp Approval Link
  const approvalWhatsAppUrl = useMemo(() => {
    const selectedSetup = SETUP_MODULES.filter((m) => activeModules[m.id]).map((m) => `• ${m.name} (${formatMxn(m.price)})`);
    const selectedMonthly = MONTHLY_MODULES.filter((m) => activeModules[m.id]).map((m) => `• ${m.name} (${formatMxn(m.price)}/mes)`);

    const msg = [
      'Hola Emmanuel, confirmo la aprobación de la propuesta comercial para el Dr. Carlos Tadeo Perzabal Avilez en Apolograma.',
      '',
      '🏛️ SETUP INICIAL DE IMPLEMENTACIÓN:',
      ...(selectedSetup.length > 0 ? selectedSetup : ['(Ninguno seleccionado)']),
      `Subtotal Setup: ${formatMxn(investmentMath.setupSubtotal)} MXN + IVA = ${formatMxn(investmentMath.setupTotal)} MXN Facturado.`,
      '',
      '⚙️ MÓDULOS OPERATIVOS MENSUALES:',
      ...(selectedMonthly.length > 0 ? selectedMonthly : ['(Ninguno seleccionado)']),
      `Subtotal Mensual: ${formatMxn(investmentMath.monthlySubtotal)} MXN/mes + IVA = ${formatMxn(investmentMath.monthlyTotal)} MXN Facturado.`,
      '',
      `💼 INVERSIÓN INICIAL TOTAL (Setup + Mes 1): ${formatMxn(investmentMath.initialGrandTotal)} MXN Facturado.`,
      '',
      'Solicito coordinar la orden de trabajo e inicio de diseño e infraestructura.',
    ].join('\n');

    return `https://wa.me/526563117565?text=${encodeURIComponent(msg)}`;
  }, [investmentMath, activeModules]);

  return (
    <div className="perzabal-root">
      {/* ==========================================
          SCOPED STYLES
         ========================================== */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@500;700&display=swap');

            :root {
              --doc-slate: #081325;
              --doc-slate-card: rgba(13, 27, 51, 0.72);
              --doc-slate-card-hover: rgba(18, 37, 70, 0.88);
              --doc-teal: #00A3E0;
              --doc-teal-light: #38BDF8;
              --doc-teal-dark: #0284C7;
              --doc-teal-glow: rgba(0, 163, 224, 0.22);
              --doc-gold: #D4AF37;
              --doc-gold-dark: #B8860B;
              --doc-gold-light: #FEF3C7;
              --doc-white: #F1F5F9;
              --doc-muted: #94A3B8;
              --doc-border: rgba(56, 189, 248, 0.16);
              --doc-border-focus: rgba(0, 163, 224, 0.5);
              --doc-success: #10B981;
              --font-display: 'Instrument Serif', Georgia, serif;
              --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            *, *::before, *::after {
              box-sizing: border-box;
            }

            html, body {
              margin: 0;
              padding: 0;
              overflow-x: hidden;
              background-color: var(--doc-slate);
              color: var(--doc-white);
              font-family: var(--font-body);
              -webkit-font-smoothing: antialiased;
            }

            .perzabal-root {
              position: relative;
              overflow-x: hidden;
              width: 100%;
              max-width: 100vw;
              min-height: 100vh;
              background: radial-gradient(circle at 50% 0%, #0d2342 0%, #081325 65%, #050c18 100%);
              color: var(--doc-white);
              box-sizing: border-box;
            }

            /* Animated Multi-Layer Surgical Background */
            .doc-animated-ambient-bg {
              position: fixed;
              inset: 0;
              pointer-events: none;
              z-index: 0;
              overflow: hidden;
            }

            .doc-aurora-orb {
              position: absolute;
              border-radius: 50%;
              filter: blur(90px);
              opacity: 0.45;
              will-change: transform, opacity;
            }

            .doc-orb-1 {
              width: 550px;
              height: 550px;
              top: -120px;
              left: 15%;
              background: radial-gradient(circle, rgba(0, 163, 224, 0.35) 0%, rgba(2, 132, 199, 0.05) 70%, transparent 100%);
              animation: auroraFloat1 22s ease-in-out infinite alternate;
            }

            .doc-orb-2 {
              width: 600px;
              height: 600px;
              top: 35%;
              right: -100px;
              background: radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(29, 78, 216, 0.05) 70%, transparent 100%);
              animation: auroraFloat2 26s ease-in-out infinite alternate;
            }

            .doc-orb-3 {
              width: 480px;
              height: 480px;
              bottom: 10%;
              left: -80px;
              background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.04) 70%, transparent 100%);
              animation: auroraFloat1 20s ease-in-out infinite alternate-reverse;
            }

            .doc-orb-4 {
              width: 450px;
              height: 450px;
              top: 70%;
              right: 20%;
              background: radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(184, 134, 11, 0.03) 70%, transparent 100%);
              animation: auroraFloat2 24s ease-in-out infinite alternate;
            }

            .doc-surgical-grid-mesh {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(rgba(56, 189, 248, 0.11) 1.2px, transparent 1.2px);
              background-size: 34px 34px;
              mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, transparent 85%);
              -webkit-mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, transparent 85%);
              opacity: 0.6;
            }

            .doc-cursor-glow {
              position: fixed;
              width: 500px;
              height: 500px;
              border-radius: 50%;
              pointer-events: none;
              transform: translate(-50%, -50%);
              background: radial-gradient(circle, rgba(0, 163, 224, 0.12) 0%, transparent 65%);
              transition: opacity 0.3s ease;
              z-index: 1;
            }

            @media (max-width: 768px) {
              .doc-cursor-glow {
                display: none !important;
              }
            }

            @keyframes auroraFloat1 {
              0% { transform: translate3d(0, 0, 0) scale(1); }
              50% { transform: translate3d(60px, 40px, 0) scale(1.08); }
              100% { transform: translate3d(-40px, 80px, 0) scale(0.95); }
            }

            @keyframes auroraFloat2 {
              0% { transform: translate3d(0, 0, 0) scale(1); }
              50% { transform: translate3d(-70px, -50px, 0) scale(1.12); }
              100% { transform: translate3d(50px, -30px, 0) scale(0.92); }
            }

            /* Responsive Typography Clamp */
            h1, h2, h3, h4 {
              text-wrap: balance;
              overflow-wrap: break-word;
              word-break: break-word;
              margin-top: 0;
            }

            h1 {
              font-family: var(--font-display);
              font-size: clamp(2rem, 5.5vw, 3.8rem);
              line-height: 1.12;
              font-weight: 400;
              letter-spacing: -0.015em;
              color: #F8FAFC;
            }

            h1 em, h1 i, h1 .serif-accent {
              font-style: italic;
              color: var(--doc-teal-light);
            }

            h2 {
              font-family: var(--font-body);
              font-size: clamp(1.4rem, 4vw, 2.4rem);
              line-height: 1.25;
              font-weight: 800;
              letter-spacing: -0.03em;
              background: linear-gradient(180deg, #FFFFFF 0%, #BAE6FD 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            h3 {
              font-family: var(--font-body);
              font-size: clamp(1.1rem, 3vw, 1.5rem);
              line-height: 1.35;
              font-weight: 700;
              color: #F8FAFC;
            }

            p {
              font-family: var(--font-body);
              font-size: clamp(0.95rem, 1.8vw, 1.05rem);
              line-height: 1.65;
              color: var(--doc-muted);
            }

            /* Buttons & Touch Targets */
            .doc-btn {
              min-height: 44px;
              min-width: 44px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 11px 22px;
              border-radius: 8px;
              font-size: 0.9375rem;
              font-weight: 700;
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s ease;
              box-sizing: border-box;
              border: none;
            }

            .doc-btn-primary {
              background: var(--doc-teal);
              color: #070D18;
              font-weight: 800;
              border: 1px solid var(--doc-teal-light);
            }
            .doc-btn-primary:hover {
              background: var(--doc-teal-light);
              color: #070D18;
              transform: translateY(-1px);
            }

            .doc-btn-gold {
              background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
              color: #070D18;
              font-weight: 800;
              box-shadow: 0 4px 15px rgba(212, 175, 55, 0.25);
            }
            .doc-btn-gold:hover {
              background: linear-gradient(135deg, #FEF3C7 0%, #D4AF37 100%);
              transform: translateY(-1px);
            }

            .doc-btn-outline {
              background: transparent;
              color: var(--doc-white);
              border: 1px solid var(--doc-border);
            }
            .doc-btn-outline:hover {
              background: rgba(255, 255, 255, 0.05);
              border-color: var(--doc-teal);
            }

            /* Container Layout */
            .doc-container {
              width: 100%;
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 20px;
              box-sizing: border-box;
            }

            @media (max-width: 480px) {
              .doc-container {
                padding: 0 14px;
              }
            }

            .doc-section {
              padding: 80px 0;
              border-bottom: 1px solid rgba(148, 163, 184, 0.1);
            }

            @media (max-width: 768px) {
              .doc-section {
                padding: 50px 0;
              }
            }

            /* Header */
            .doc-header {
              position: sticky;
              top: 0;
              z-index: 100;
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              background: rgba(7, 13, 24, 0.88);
              border-bottom: 1px solid var(--doc-border);
              padding: 12px 0;
            }

            .doc-header-inner {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              width: 100%;
            }

            .doc-brand-cluster {
              display: flex;
              align-items: center;
              gap: 14px;
              cursor: pointer;
              user-select: none;
            }

            .doc-apolo-logo {
              height: 28px;
              width: auto;
              object-fit: contain;
            }

            .doc-brand-divider {
              width: 1px;
              height: 24px;
              background: var(--doc-border);
            }

            .doc-badge-status {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 0.75rem;
              padding: 4px 10px;
              border-radius: 9999px;
              background: rgba(0, 163, 224, 0.12);
              color: var(--doc-teal-light);
              font-weight: 700;
              letter-spacing: 0.5px;
              border: 1px solid rgba(0, 163, 224, 0.3);
            }

            .doc-header-actions {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-shrink: 0;
            }

            @media (max-width: 768px) {
              .doc-header {
                padding: 8px 0;
              }
              .doc-header-inner {
                gap: 8px;
                width: 100%;
                max-width: 100%;
              }
              .doc-brand-cluster {
                gap: 8px;
                min-width: 0;
                flex-shrink: 1;
              }
              .doc-brand-divider,
              .doc-badge-status {
                display: none !important;
              }
              .doc-apolo-logo {
                height: 24px;
              }
              .doc-header-actions {
                gap: 6px;
                flex-shrink: 0;
              }
              .doc-header-actions .doc-btn {
                padding: 8px 10px;
                font-size: 0.75rem;
                min-height: 44px;
                white-space: nowrap;
              }
              @media (max-width: 360px) {
                .doc-header-actions {
                  gap: 4px;
                }
                .doc-header-actions .doc-btn {
                  padding: 8px 6px;
                  font-size: 0.7rem;
                }
              }
            }

            /* Authority Hero */
            .doc-hero {
              padding: 70px 0 60px 0;
              background: radial-gradient(circle at 50% 15%, rgba(0, 163, 224, 0.12) 0%, rgba(7, 13, 24, 0) 70%);
              text-align: center;
            }

            .doc-hero-badge-row {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 10px;
              margin-bottom: 24px;
            }

            .doc-authority-pill {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 14px;
              border-radius: 9999px;
              background: var(--doc-slate-card);
              border: 1px solid var(--doc-border);
              font-size: 0.8125rem;
              color: var(--doc-white);
              font-weight: 600;
            }

            .doc-hero-title {
              max-width: 950px;
              margin: 0 auto 20px auto;
            }

            .doc-hero-sub {
              max-width: 820px;
              margin: 0 auto 36px auto;
              font-size: clamp(1.05rem, 2vw, 1.25rem);
              color: #CBD5E1;
            }

            .doc-hero-metrics {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-top: 50px;
              max-width: 1050px;
              margin-left: auto;
              margin-right: auto;
            }

            @media (max-width: 900px) {
              .doc-hero-metrics {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (max-width: 480px) {
              .doc-hero-metrics {
                grid-template-columns: 1fr;
              }
            }

            .doc-metric-card {
              background: var(--doc-slate-card);
              border: 1px solid var(--doc-border);
              border-radius: 12px;
              padding: 20px;
              text-align: left;
              transition: border-color 0.2s ease;
            }
            .doc-metric-card:hover {
              border-color: var(--doc-teal);
            }

            .doc-metric-val {
              font-size: 1.5rem;
              font-weight: 800;
              color: var(--doc-white);
              margin-bottom: 4px;
            }

            .doc-metric-lbl {
              font-size: 0.8125rem;
              color: var(--doc-muted);
              line-height: 1.4;
            }

            /* Component Cards Grid */
            .doc-grid-4 {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
              margin-top: 40px;
            }

            @media (max-width: 850px) {
              .doc-grid-4 {
                grid-template-columns: 1fr;
              }
            }

            .doc-component-card {
              background: var(--doc-slate-card);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid var(--doc-border);
              border-radius: 18px;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              box-shadow: 0 16px 36px -8px rgba(2, 8, 20, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.06);
            }
            .doc-component-card:hover {
              border-color: var(--doc-teal-light);
              transform: translateY(-3px);
              box-shadow: 0 20px 40px -8px rgba(0, 163, 224, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.12);
            }

            .doc-module-preview-frame {
              position: relative;
              width: 100%;
              height: 190px;
              border-radius: 12px;
              overflow: hidden;
              margin-bottom: 18px;
              background: #050b16;
              border: 1px solid rgba(56, 189, 248, 0.2);
              box-shadow: 0 8px 24px rgba(2, 8, 20, 0.6);
            }

            .doc-module-preview-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .doc-component-card:hover .doc-module-preview-img {
              transform: scale(1.05);
            }

            .doc-module-preview-badge {
              position: absolute;
              top: 10px;
              right: 10px;
              padding: 4px 9px;
              border-radius: 6px;
              font-size: 0.6875rem;
              font-weight: 800;
              letter-spacing: 0.5px;
              background: rgba(8, 19, 37, 0.88);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              color: var(--doc-teal-light);
              border: 1px solid rgba(56, 189, 248, 0.35);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            }

            .doc-toggle-thumb {
              width: 58px;
              height: 58px;
              border-radius: 8px;
              overflow: hidden;
              flex-shrink: 0;
              border: 1px solid rgba(56, 189, 248, 0.25);
              background: #060e1d;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .doc-toggle-thumb img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .doc-badge-tag {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 6px;
              background: rgba(0, 163, 224, 0.1);
              color: var(--doc-teal-light);
              font-size: 0.75rem;
              font-weight: 700;
              margin-bottom: 16px;
              border: 1px solid rgba(0, 163, 224, 0.2);
            }

            .doc-card-bullets {
              list-style: none;
              padding: 0;
              margin: 20px 0 0 0;
            }

            .doc-card-bullets li {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              font-size: 0.875rem;
              color: #CBD5E1;
              margin-bottom: 12px;
              line-height: 1.45;
            }

            .doc-card-bullets li svg {
              color: var(--doc-teal-light);
              flex-shrink: 0;
              margin-top: 2px;
            }

            /* Procedure Tabs */
            .doc-tabs-nav {
              display: flex;
              gap: 8px;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              padding-bottom: 8px;
              margin-bottom: 24px;
              border-bottom: 1px solid var(--doc-border);
              scrollbar-width: none;
            }
            .doc-tabs-nav::-webkit-scrollbar {
              display: none;
            }

            .doc-tab-btn {
              min-height: 44px;
              padding: 10px 18px;
              border-radius: 8px;
              background: transparent;
              border: 1px solid transparent;
              color: var(--doc-muted);
              font-weight: 700;
              font-size: 0.875rem;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s ease;
            }
            .doc-tab-btn.active {
              background: var(--doc-slate-card);
              color: var(--doc-teal-light);
              border-color: var(--doc-teal);
            }

            .doc-proc-display {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
              background: var(--doc-slate-card);
              border: 1px solid var(--doc-border);
              border-radius: 16px;
              padding: 32px;
              align-items: center;
            }

            @media (max-width: 850px) {
              .doc-proc-display {
                grid-template-columns: 1fr;
                padding: 20px;
              }
            }

            .doc-proc-diagram-wrap {
              width: 100%;
              text-align: center;
              background: #040810;
              border: 1px solid rgba(148, 163, 184, 0.15);
              border-radius: 12px;
              padding: 16px;
            }

            .doc-proc-img {
              width: 100%;
              max-height: 320px;
              object-fit: contain;
            }

            /* WhatsApp Simulator Chassis */
            .doc-phone-frame {
              width: 100%;
              max-width: 440px;
              margin: 0 auto;
              background: #0B1426;
              border: 2px solid #1E293B;
              border-radius: 36px;
              overflow: hidden;
              box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 163, 224, 0.15);
            }

            .doc-phone-notch {
              height: 28px;
              background: #070D18;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .doc-phone-camera {
              width: 60px;
              height: 10px;
              border-radius: 9999px;
              background: #1E293B;
            }

            .doc-phone-header {
              background: #0F172A;
              padding: 14px 18px;
              display: flex;
              align-items: center;
              gap: 12px;
              border-bottom: 1px solid rgba(148, 163, 184, 0.15);
            }

            .doc-doc-avatar {
              width: 42px;
              height: 42px;
              border-radius: 50%;
              background: var(--doc-slate);
              border: 1.5px solid var(--doc-teal);
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--doc-teal-light);
            }

            .doc-phone-screen {
              height: 460px;
              background: #040810;
              overflow-y: auto;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .doc-chat-bubble {
              max-width: 86%;
              padding: 12px 16px;
              border-radius: 14px;
              font-size: 0.875rem;
              line-height: 1.45;
              animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(6px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .doc-bubble-bot {
              background: #0B1426;
              color: #F8FAFC;
              border: 1px solid rgba(0, 163, 224, 0.25);
              align-self: flex-start;
              border-bottom-left-radius: 4px;
              white-space: pre-line;
            }

            .doc-bubble-user {
              background: #0284C7;
              color: #FFFFFF;
              align-self: flex-end;
              border-bottom-right-radius: 4px;
              font-weight: 600;
            }

            .doc-typing-dots {
              display: inline-flex;
              gap: 4px;
              align-items: center;
              padding: 8px 14px;
              background: #0B1426;
              border-radius: 14px;
              border: 1px solid rgba(0, 163, 224, 0.2);
              align-self: flex-start;
            }

            .doc-typing-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: var(--doc-teal-light);
              animation: blink 0.75s infinite ease-in-out;
            }
            .doc-typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .doc-typing-dot:nth-child(3) { animation-delay: 0.4s; }

            @keyframes blink {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.1); }
            }

            .doc-chips-container {
              padding: 14px;
              background: #0B1426;
              border-top: 1px solid rgba(148, 163, 184, 0.15);
              display: flex;
              flex-direction: column;
              gap: 8px;
              max-height: 180px;
              overflow-y: auto;
            }

            .doc-triage-chip {
              min-height: 44px;
              width: 100%;
              padding: 10px 14px;
              border-radius: 8px;
              background: #0F172A;
              border: 1px solid rgba(0, 163, 224, 0.3);
              color: #F8FAFC;
              font-size: 0.8125rem;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: space-between;
              transition: all 0.2s ease;
              text-align: left;
            }
            .doc-triage-chip:hover {
              background: rgba(0, 163, 224, 0.15);
              border-color: var(--doc-teal);
            }

            /* Configurator & Financial */
            .doc-configurator-box {
              background: var(--doc-slate-card);
              border: 1px solid var(--doc-border);
              border-radius: 16px;
              padding: 36px;
              margin-top: 36px;
            }

            @media (max-width: 768px) {
              .doc-configurator-box {
                padding: 20px;
              }
            }

            /* Responsive Grids */
            .doc-binational-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }

            @media (max-width: 768px) {
              .doc-binational-grid {
                grid-template-columns: 1fr;
                gap: 16px;
              }
            }

            .doc-config-core-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-bottom: 32px;
            }

            @media (max-width: 768px) {
              .doc-config-core-grid {
                grid-template-columns: 1fr;
                gap: 10px;
              }
            }

            .doc-modal-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }

            @media (max-width: 480px) {
              .doc-modal-grid {
                grid-template-columns: 1fr;
                gap: 8px;
              }
            }

            .doc-toggle-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              padding: 16px 20px;
              background: #070D18;
              border: 1px solid var(--doc-border);
              border-radius: 12px;
              margin-bottom: 12px;
              cursor: pointer;
              transition: border-color 0.2s ease;
            }
            .doc-toggle-row:hover {
              border-color: var(--doc-teal);
            }
            .doc-toggle-row.active {
              border-color: var(--doc-teal);
              background: rgba(0, 163, 224, 0.06);
            }

            @media (max-width: 768px) {
              .doc-toggle-row {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 12px !important;
                padding: 14px 16px !important;
              }
              .doc-toggle-row > div:last-child {
                width: 100% !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
              }
            }

            .doc-switch {
              position: relative;
              width: 48px;
              height: 26px;
              background: #1E293B;
              border-radius: 9999px;
              transition: background 0.2s ease;
              flex-shrink: 0;
            }
            .doc-switch::before {
              content: "";
              position: absolute;
              top: -9px;
              bottom: -9px;
              left: -4px;
              right: -4px;
              min-height: 44px;
              min-width: 44px;
            }
            .doc-switch.active {
              background: var(--doc-teal);
            }
            .doc-switch-circle {
              position: absolute;
              top: 3px;
              left: 3px;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #FFFFFF;
              transition: transform 0.2s ease;
            }
            .doc-switch.active .doc-switch-circle {
              transform: translateX(22px);
            }

            /* CRM Kanban Styles */
            .doc-kanban-board {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 14px;
              margin-top: 24px;
            }
            @media (max-width: 1100px) {
              .doc-kanban-board {
                grid-template-columns: repeat(3, 1fr);
              }
            }
            @media (max-width: 768px) {
              .doc-kanban-board {
                display: flex !important;
                flex-direction: column !important;
                gap: 16px !important;
              }
            }
            .doc-kanban-col {
              background: #070D18;
              border: 1px solid var(--doc-border);
              border-radius: 12px;
              padding: 14px;
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            .doc-kanban-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 8px;
              border-bottom: 1px solid rgba(148, 163, 184, 0.15);
              font-size: 0.75rem;
              font-weight: 800;
              letter-spacing: 0.5px;
              color: var(--doc-teal-light);
            }
            .doc-kanban-card {
              background: #0B1426;
              border: 1px solid rgba(148, 163, 184, 0.15);
              border-radius: 10px;
              padding: 12px;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .doc-kanban-card:hover, .doc-kanban-card.selected {
              border-color: var(--doc-teal);
              box-shadow: 0 4px 20px rgba(0, 163, 224, 0.15);
              transform: translateY(-2px);
            }
            .doc-patient-detail-box {
              background: #070D18;
              border: 1px solid var(--doc-teal);
              border-radius: 14px;
              padding: 24px;
              margin-top: 24px;
              display: flex;
              flex-direction: column;
              gap: 14px;
            }

            /* Marketing Authority Pillars */
            .doc-pillar-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-top: 28px;
            }
            @media (max-width: 768px) {
              .doc-pillar-grid {
                grid-template-columns: 1fr;
                gap: 16px;
              }
            }
            .doc-pillar-card {
              background: #070D18;
              border: 1px solid var(--doc-border);
              border-radius: 14px;
              padding: 24px;
              transition: all 0.2s ease;
            }
            .doc-pillar-card:hover {
              border-color: var(--doc-teal);
              box-shadow: 0 6px 24px rgba(0, 163, 224, 0.08);
            }
            .doc-pillar-header {
              display: flex;
              align-items: center;
              gap: 14px;
              margin-bottom: 12px;
            }
            .doc-pillar-num {
              font-size: 1.5rem;
              font-weight: 900;
              color: var(--doc-gold);
              font-family: serif;
              letter-spacing: 1px;
            }

            /* Configurator Badges & Categories */
            .doc-category-title {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 1.2rem;
              font-weight: 800;
              color: var(--doc-white);
              margin-bottom: 14px;
              margin-top: 24px;
            }
            .doc-badge-setup {
              background: rgba(212, 175, 55, 0.15);
              color: var(--doc-gold);
              border: 1px solid rgba(212, 175, 55, 0.3);
              font-size: 0.7rem;
              font-weight: 800;
              padding: 3px 8px;
              border-radius: 6px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .doc-badge-monthly {
              background: rgba(0, 163, 224, 0.15);
              color: var(--doc-teal-light);
              border: 1px solid rgba(0, 163, 224, 0.3);
              font-size: 0.7rem;
              font-weight: 800;
              padding: 3px 8px;
              border-radius: 6px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .doc-math-card {
              background: #040810;
              border: 2px solid var(--doc-gold);
              border-radius: 16px;
              padding: 28px;
              margin-top: 32px;
            }

            .doc-math-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 0.9375rem;
              color: var(--doc-muted);
            }

            .doc-math-total {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              padding: 18px 0 6px 0;
              border-top: 1px solid rgba(212, 175, 55, 0.3);
              margin-top: 12px;
            }

            @media (max-width: 600px) {
              .doc-math-card {
                padding: 20px 14px;
              }
              .doc-math-total {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 10px !important;
              }
            }

            /* Banregio Fiscal Card */
            .doc-fiscal-box {
              background: #070D18;
              border: 1px solid var(--doc-border);
              border-radius: 12px;
              padding: 24px;
              margin-top: 28px;
            }

            .doc-fiscal-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 16px;
              gap: 12px;
            }

            @media (max-width: 600px) {
              .doc-fiscal-header {
                flex-direction: column;
                align-items: flex-start;
              }
              .doc-fiscal-header button {
                width: 100%;
              }
            }

            .doc-fiscal-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              font-size: 0.875rem;
            }

            @media (max-width: 600px) {
              .doc-fiscal-grid {
                grid-template-columns: 1fr;
              }
            }

            /* Modal */
            .doc-modal-overlay {
              position: fixed;
              inset: 0;
              z-index: 999;
              background: rgba(0, 0, 0, 0.82);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }

            .doc-modal-card {
              background: var(--doc-slate-card);
              border: 1px solid var(--doc-teal);
              border-radius: 20px;
              width: 100%;
              max-width: 520px;
              max-height: 90vh;
              overflow-y: auto;
              padding: 32px;
              box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 163, 224, 0.2);
              position: relative;
            }

            .doc-input {
              min-height: 44px;
              width: 100%;
              background: #070D18;
              border: 1px solid var(--doc-border);
              border-radius: 8px;
              padding: 10px 14px;
              color: #F8FAFC;
              font-size: 1rem;
              box-sizing: border-box;
              margin-top: 6px;
              margin-bottom: 16px;
            }
            .doc-input:focus {
              outline: none;
              border-color: var(--doc-teal);
            }

            /* Footer */
            .doc-footer {
              padding: 50px 0 40px 0;
              background: #040810;
              border-top: 1px solid rgba(148, 163, 184, 0.15);
              font-size: 0.875rem;
              color: var(--doc-muted);
            }

            @media (max-width: 768px) {
              .doc-footer {
                word-break: break-word;
                max-width: 100%;
              }
              .doc-footer .doc-container {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 20px !important;
              }
              .doc-footer .doc-container > div {
                width: 100% !important;
                max-width: 100% !important;
                text-align: left !important;
              }
              .doc-footer .doc-container > div:first-child {
                max-width: 100% !important;
              }
              .doc-footer p {
                max-width: 100% !important;
                word-break: break-word !important;
              }
            }
          `,
        }}
      />

      {/* ==========================================
          ANIMATED MULTI-LAYER SURGICAL BACKGROUND
         ========================================== */}
      <div className="doc-animated-ambient-bg" aria-hidden="true">
        <div className="doc-aurora-orb doc-orb-1" />
        <div className="doc-aurora-orb doc-orb-2" />
        <div className="doc-aurora-orb doc-orb-3" />
        <div className="doc-aurora-orb doc-orb-4" />
        <div className="doc-surgical-grid-mesh" />
        <div id="ambient-cursor-glow" className="doc-cursor-glow" />
      </div>

      {/* ==========================================
          HEADER
         ========================================== */}
      <header className="doc-header">
        <div className="doc-container doc-header-inner">
          <div className="doc-brand-cluster" onClick={handleLogoClick} title="Apolograma Interactive Studio">
            <img
              src="/assets/apolograma-logo-v2.png"
              alt="Apolograma"
              className="doc-apolo-logo"
            />
            <div className="doc-brand-divider" />
            <span className="doc-badge-status">
              <ShieldCheck size={14} /> EXPEDIENTE MÉDICO EJECUTIVO
            </span>
          </div>

          <div className="doc-header-actions">
            <button onClick={openModal} className="doc-btn doc-btn-outline" style={{ display: 'inline-flex' }}>
              <Calendar size={15} /> Sesión 20 min
            </button>
            <a
              href={approvalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="doc-btn doc-btn-primary"
              style={{ display: 'inline-flex' }}
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* ==========================================
          HERO: CLINICAL AUTHORITY
         ========================================== */}
      <section className="doc-hero">
        <div className="doc-container">
          <div className="doc-hero-badge-row">
            <div className="doc-authority-pill">
              <Award size={14} color="#00A3E0" />
              <span>Ex-Director Médico · Hospital General Cd. Juárez</span>
            </div>
            <div className="doc-authority-pill">
              <Stethoscope size={14} color="#D4AF37" />
              <span>Coordinador Médico Cirujano · UACJ (ICB)</span>
            </div>
            <div className="doc-authority-pill">
              <ShieldCheck size={14} color="#10B981" />
              <span>Certificado CMCOEM & CMCG</span>
            </div>
            <div className="doc-authority-pill">
              <Cpu size={14} color="#38BDF8" />
              <span>Consola Robótica Da Vinci</span>
            </div>
          </div>

          <h1 className="doc-hero-title">
            Dr. Carlos Tadeo Perzabal Avilez
            <span style={{ display: 'block', fontSize: '0.65em', color: 'var(--doc-teal-light)', fontWeight: 600, marginTop: '8px' }}>
              Cirugía General, Bariátrica y Robótica · Ciudad Juárez
            </span>
          </h1>

          <p className="doc-hero-sub">
            Arquitectura digital de alta jerarquía para el <strong>médico formador de especialistas</strong>. Posicionamiento institucional de máxima reputación clínica en Ciudad Juárez y captación sistemática de turismo médico binacional desde El Paso, Las Cruces y Texas.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
            <a href="#simulador" className="doc-btn doc-btn-primary">
              <Smartphone size={16} /> Probar Simulador de Triaje
            </a>
            <a href="#propuesta-economica" className="doc-btn doc-btn-gold">
              <DollarSign size={16} /> Ver Propuesta Económica
            </a>
            <button onClick={openModal} className="doc-btn doc-btn-outline">
              <Clock size={16} /> Agendar Sesión (20 min)
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="doc-hero-metrics">
            <div className="doc-metric-card">
              <div className="doc-metric-val">+18 Años</div>
              <div className="doc-metric-lbl">Práctica Quirúrgica de Alta Complejidad y Trauma</div>
            </div>
            <div className="doc-metric-card">
              <div className="doc-metric-val">Hospital General</div>
              <div className="doc-metric-lbl">Ex-Director Médico y Jefe del Depto. de Enseñanza</div>
            </div>
            <div className="doc-metric-card">
              <div className="doc-metric-val">UACJ · ICB</div>
              <div className="doc-metric-lbl">Coordinador de Licenciatura en Médico Cirujano</div>
            </div>
            <div className="doc-metric-card">
              <div className="doc-metric-val">Da Vinci Intuitive</div>
              <div className="doc-metric-lbl">Cirujano Acreditado en Consola Robótica 3D-HD</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: LA SUITE MODULAR DE 6 SERVICIOS DE APOLOGRAMA
         ========================================== */}
      <section className="doc-section">
        <div className="doc-container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
            <span className="doc-badge-tag">SUITE MODULAR INTEGRAL</span>
            <h2>Los 6 Servicios Especializados de Apolograma</h2>
            <p>
              Una arquitectura médica completa dividida en <strong>entregables fundacionales de implementación (Setup)</strong> y <strong>servicios continuos de operación y dirección clínica (Iguala mensual)</strong>, protegiendo estrictamente el prestigio profesional del Dr. Carlos Perzabal.
            </p>
          </div>

          <div className="doc-grid-4">
            {[...SETUP_MODULES, ...MONTHLY_MODULES].map((item, idx) => (
              <div key={item.id} className="doc-component-card">
                <div>
                  {/* Module Visual Support Preview Frame */}
                  <div className="doc-module-preview-frame">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="doc-module-preview-img"
                      loading="lazy"
                    />
                    <span className="doc-module-preview-badge">{item.imageBadge}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={item.period === 'setup' ? 'doc-badge-setup' : 'doc-badge-monthly'}>
                      {item.badge}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--doc-gold)', fontWeight: 800 }}>
                      MÓDULO 0{idx + 1}
                    </span>
                  </div>
                  <h3 style={{ marginTop: '12px', fontSize: '1.25rem', color: '#F8FAFC' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--doc-muted)', lineHeight: 1.5 }}>{item.description}</p>
                  <ul className="doc-card-bullets">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx}>
                        <CheckCircle2 size={16} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--doc-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--doc-muted)', textTransform: 'uppercase' }}>
                    {item.period === 'setup' ? 'Inversión Única de Implementación' : 'Gestión Operativa Mensual'}
                  </span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: item.period === 'setup' ? 'var(--doc-gold)' : 'var(--doc-teal-light)' }}>
                    {formatMxn(item.price)} <span style={{ fontSize: '0.8rem', color: 'var(--doc-muted)' }}>{item.period === 'setup' ? 'MXN' : 'MXN / mes'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: PROCEDURAL DEPTH & CLINICAL RIGOR
         ========================================== */}
      <section className="doc-section" style={{ background: '#050A14' }}>
        <div className="doc-container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px auto' }}>
            <span className="doc-badge-tag">RIGOR CLÍNICO Y TÉCNICA QUIRÚRGICA</span>
            <h2>Fichas de Procedimientos de Alta Especialidad</h2>
            <p>
              La webapp presentará a los pacientes una explicación pedagógica, anatómica y científica de cada técnica, desvaneciendo temores y resaltando las ventajas de la mínima invasión.
            </p>
          </div>

          {/* Procedure Tabs Nav */}
          <div className="doc-tabs-nav">
            <button
              onClick={() => setActiveProcTab('manga')}
              className={`doc-tab-btn ${activeProcTab === 'manga' ? 'active' : ''}`}
            >
              Manga Gástrica (LSG)
            </button>
            <button
              onClick={() => setActiveProcTab('bypass')}
              className={`doc-tab-btn ${activeProcTab === 'bypass' ? 'active' : ''}`}
            >
              Bypass Gástrico (LRYGB)
            </button>
            <button
              onClick={() => setActiveProcTab('vesicula')}
              className={`doc-tab-btn ${activeProcTab === 'vesicula' ? 'active' : ''}`}
            >
              Colecistectomía (Strasberg CVS)
            </button>
            <button
              onClick={() => setActiveProcTab('hernia')}
              className={`doc-tab-btn ${activeProcTab === 'hernia' ? 'active' : ''}`}
            >
              Hernias TAPP / TEP
            </button>
            <button
              onClick={() => setActiveProcTab('robot')}
              className={`doc-tab-btn ${activeProcTab === 'robot' ? 'active' : ''}`}
            >
              Consola Robótica Da Vinci
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="doc-proc-display">
            {activeProcTab === 'manga' && (
              <>
                <div>
                  <span className="doc-badge-tag">CIRUGÍA BARIÁTRICA RESTRICTIVA & HORMONAL</span>
                  <h3 style={{ fontSize: '1.6rem' }}>Manga Gástrica por Laparoscopía (LSG)</h3>
                  <p>
                    Procedimiento metabólico de alta seguridad que consiste en la resección gástrica longitudinal del 75% al 80% del estómago mediante engrapadoras mecánicas de última generación, calibrada con sonda orogástrica de 36 Fr.
                  </p>
                  <ul className="doc-card-bullets">
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Supresión de Grelina:</strong> Remoción del fondo gástrico donde se produce la hormona del apetito, brindando saciedad precoz y disminución drástica del hambre.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Criterios ASMBS/IFSO 2022:</strong> Candidatura directa con IMC ≥ 35 kg/m², o IMC 30-34.9 kg/m² con comorbilidades (DM2, HTA, Apnea).</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Rápida Recuperación:</strong> Estancia hospitalaria de 24 a 48 horas en hospital privado; reincorporación a labores en 7 a 10 días.</span>
                    </li>
                  </ul>
                </div>
                <div className="doc-proc-diagram-wrap">
                  <img
                    src="/assets/dr-carlos-perzabal/manga_gastrica.svg"
                    alt="Diagrama Manga Gástrica"
                    className="doc-proc-img"
                  />
                </div>
              </>
            )}

            {activeProcTab === 'bypass' && (
              <>
                <div>
                  <span className="doc-badge-tag">GOLD STANDARD METABÓLICO & ANTI-REFLUJO</span>
                  <h3 style={{ fontSize: '1.6rem' }}>Bypass Gástrico en Y de Roux (LRYGB)</h3>
                  <p>
                    Procedimiento quirúrgico de acción mixta: se crea un reservorio gástrico proximal pequeño (pouch de 15 a 30 ml) anastomosado a un asa yeyunal en Y de Roux de 100 a 150 cm, derivando el tránsito de quimo hacia el íleon distal.
                  </p>
                  <ul className="doc-card-bullets">
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Remisión de Diabetes Tipo 2:</strong> Estímulo masivo de hormonas incretinas (GLP-1 y PYY) con resolución de la hiperglucemia en &gt;80% de los pacientes.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Control Definitivo de ERGE:</strong> Erradicación del reflujo gastroesofágico y acidez en &gt;95% de los casos. Procedimiento ideal para hernia hiatal grave.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Monitoreo y Nutrición:</strong> Acompañamiento continuo con suplementación multivitamínica de alta biodisponibilidad y control analítico.</span>
                    </li>
                  </ul>
                </div>
                <div className="doc-proc-diagram-wrap">
                  <img
                    src="/assets/dr-carlos-perzabal/bypass_gastrico.svg"
                    alt="Diagrama Bypass Gástrico"
                    className="doc-proc-img"
                  />
                </div>
              </>
            )}

            {activeProcTab === 'vesicula' && (
              <>
                <div>
                  <span className="doc-badge-tag">CIRUGÍA DIGESTIVA DE MÍNIMA INVASIÓN</span>
                  <h3 style={{ fontSize: '1.6rem' }}>Colecistectomía por Laparoscopía / Robótica</h3>
                  <p>
                    Extracción de la vesícula biliar por litiasis (cálculos o piedras), cólico vesicular o pólipos mediante 4 incisiones milimétricas, aplicando el protocolo internacional de seguridad del Dr. Strasberg.
                  </p>
                  <ul className="doc-card-bullets">
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Visión Crítica de Seguridad (CVS):</strong> Despeje exhaustivo del triángulo hepatocístico con identificación inequívoca del conducto cístico y la arteria cística antes de cualquier corte.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Protocolo de Seguridad Strasberg (CVS):</strong> Técnica quirúrgica protocolizada que protege y salvaguarda la integridad anatómica de la vía biliar principal (colédoco) mediante identificación inequívoca previa al corte.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Estancia Corta:</strong> Procedimiento ambulatorio o con pernocta de 24 horas; regreso a actividades cotidianas en 5 a 7 días.</span>
                    </li>
                  </ul>
                </div>
                <div className="doc-proc-diagram-wrap">
                  <img
                    src="/assets/dr-carlos-perzabal/colecistectomia_strasberg.svg"
                    alt="Diagrama Colecistectomía Strasberg"
                    className="doc-proc-img"
                  />
                </div>
              </>
            )}

            {activeProcTab === 'hernia' && (
              <>
                <div>
                  <span className="doc-badge-tag">PARED ABDOMINAL SIN TENSIÓN</span>
                  <h3 style={{ fontSize: '1.6rem' }}>Hernioplastías Inguinales y Ventrales (TAPP/TEP)</h3>
                  <p>
                    Reparación anatómica mínimamente invasiva de defectos de pared abdominal (hernias inguinales, umbilicales o sobre cicatrices quirúrgicas previas) mediante colocación de malla anatómica en el espacio preperitoneal.
                  </p>
                  <ul className="doc-card-bullets">
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Cobertura del Orificio Miopectíneo de Fruchaud:</strong> Blindaje completo de la región inguinal profunda sin tensión tisular, reduciendo la tasa de recidiva a &lt;1.5%.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Prevención de Inguinodinia:</strong> Evita fijaciones traumáticas con grapas en zonas nerviosas, reduciendo drásticamente el riesgo de dolor inguinal crónico.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Mínimo Dolor Posoperatorio:</strong> Incisiones de 5 a 10 mm con reincorporación a la vida activa en menos de dos semanas.</span>
                    </li>
                  </ul>
                </div>
                <div className="doc-proc-diagram-wrap">
                  <img
                    src="/assets/dr-carlos-perzabal/hernioplastia_tapp.svg"
                    alt="Diagrama Hernioplastía TAPP"
                    className="doc-proc-img"
                  />
                </div>
              </>
            )}

            {activeProcTab === 'robot' && (
              <>
                <div>
                  <span className="doc-badge-tag">VANGUARDIA TECNOLÓGICA INTUITIVE SURGICAL</span>
                  <h3 style={{ fontSize: '1.6rem' }}>Cirugía Robótica Asistida (Consola Da Vinci)</h3>
                  <p>
                    Plataforma robótica avanzada donde el cirujano opera desde una consola ergonómica con visión tridimensional inmersiva y mandos maestros que reproducen con precisión microscópica cada movimiento.
                  </p>
                  <ul className="doc-card-bullets">
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Visión 3D-HD Estereoscópica 10x:</strong> Percepción de profundidad real y magnificación milimétrica de nervios y vasos sanguíneos críticos.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Pinzas EndoWrist 540°:</strong> Siete grados de libertad de movimiento que superan la capacidad de flexión de la mano humana dentro de cavidades estrechas.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      <span><strong>Filtrado de Temblor y Escala 5:1:</strong> Movimientos submilimétricos estables y atraumáticos, reduciendo notablemente el sangrado y el dolor posoperatorio.</span>
                    </li>
                  </ul>
                </div>
                <div className="doc-proc-diagram-wrap">
                  <img
                    src="/assets/dr-carlos-perzabal/consola_da_vinci.svg"
                    alt="Diagrama Consola Da Vinci"
                    className="doc-proc-img"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: BINATIONAL MEDICAL TOURISM
         ========================================== */}
      <section className="doc-section">
        <div className="doc-container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
            <span className="doc-badge-tag">VENTAJA COMPETITIVA REGIONAL</span>
            <h2>Marco de Captación Binacional: Ciudad Juárez & El Paso, Texas</h2>
            <p>
              El suroeste de Estados Unidos padece de deducibles médicos de $5,000 a $10,000 USD y pólizas que excluyen la cirugía bariátrica. El Dr. Carlos Perzabal ofrece la alternativa más segura y cercana.
            </p>
          </div>

          <div className="doc-binational-grid">
            <div className="doc-metric-card" style={{ padding: '28px' }}>
              <div style={{ color: 'var(--doc-teal-light)', marginBottom: '12px' }}>
                <DollarSign size={24} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Elusión de Deducibles USD</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Pacientes estadounidenses sin cobertura bariátrica o con coaseguros astronómicos acceden a cirugía de clase mundial a una fracción del costo de EE.UU. sin comprometer la seguridad.
              </p>
            </div>

            <div className="doc-metric-card" style={{ padding: '28px' }}>
              <div style={{ color: 'var(--doc-teal-light)', marginBottom: '12px' }}>
                <HeartPulse size={24} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Seguridad Hospitalaria A+</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Operaciones realizadas exclusivamente en hospitales privados acreditados (Ángeles, Star Médica, CME) con Unidad de Cuidados Intensivos (UCI), Banco de Sangre y anestesiólogos certificados.
              </p>
            </div>

            <div className="doc-metric-card" style={{ padding: '28px' }}>
              <div style={{ color: 'var(--doc-teal-light)', marginBottom: '12px' }}>
                <Compass size={24} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>A 15 Minutos del Puente</h4>
              <p style={{ fontSize: '0.875rem' }}>
                Logística transfronteriza inmediata. El paciente de El Paso o Las Cruces cruza sin vuelos comerciales y puede retornar a su hogar el mismo día o al alta médica con resumen quirúrgico bilingüe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: MARKETING & PLANEACIÓN MENSUAL DE AUTORIDAD
         ========================================== */}
      <section id="marketing-autoridad" className="doc-section">
        <div className="doc-container">
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 36px auto' }}>
            <span className="doc-badge-tag">DIRECCIÓN EDITORIAL CLÍNICA</span>
            <h2>Marketing y Planeación Mensual de Autoridad</h2>
            <p>
              Una estrategia editorial continua diseñada para <strong>exaltar el conocimiento y la maestría quirúrgica</strong> del Dr. Carlos Perzabal. Cero tácticas agresivas que devalúen su prestigio: comunicación médica con rigor científico, empatía con el paciente y respaldo académico.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="doc-pillar-grid">
            {MARKETING_PILLARS.map((pillar) => (
              <div key={pillar.id} className="doc-pillar-card">
                <div className="doc-pillar-header">
                  <span className="doc-pillar-num">{pillar.number}</span>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', margin: 0 }}>
                      {pillar.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--doc-gold)', fontWeight: 700 }}>
                      {pillar.subtitle}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--doc-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {pillar.description}
                </p>

                <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--doc-teal-light)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    EJES TEMÁTICOS AUDITADOS:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pillar.highlights.map((hl, idx) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Ethical Seal Banner */}
          <div
            style={{
              background: '#040810',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '12px',
              padding: '20px 24px',
              marginTop: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <ShieldCheck size={28} color="#D4AF37" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--doc-gold)', marginBottom: '4px' }}>
                BLINDAJE DE PRESTIGIO: POLÍTICA DE AUTORIDAD Y CERO REBAJAS COMERCIALES
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--doc-muted)', lineHeight: 1.45 }}>
                En Apolograma establecemos como política editorial estricta que ninguna publicación, cápsula o anuncio contendrá rebajas, liquidaciones ni compromisos mercantiles de ventas. Toda pieza de pauta educa sobre patologías, síntomas de alarma y opciones de alta especialidad (Robótica Da Vinci y Laparoscopía Avanzada), canalizando pacientes precalificados que valoran la experiencia y seguridad clínica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: INTERACTIVE WHATSAPP TRIAGE SIMULATOR
         ========================================== */}
      <section id="simulador" className="doc-section" style={{ background: '#050A14' }}>
        <div className="doc-container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
            <span className="doc-badge-tag">SIMULADOR EN VIVO</span>
            <h2>Asistente de Triaje Quirúrgico en WhatsApp 24/7</h2>
            <p>
              Pruebe a continuación la experiencia que vivirán los pacientes al interactuar con el asistente automatizado. El sistema precalifica el caso y despacha una ficha estructurada directo al consultorio.
            </p>
          </div>

          <div className="doc-phone-frame">
            {/* Phone Notch */}
            <div className="doc-phone-notch">
              <div className="doc-phone-camera" />
            </div>

            {/* Phone Header */}
            <div className="doc-phone-header">
              <div className="doc-doc-avatar">
                <Stethoscope size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F8FAFC' }}>
                    Dr. Carlos Tadeo Perzabal
                  </span>
                  <CheckCircle2 size={14} color="#10B981" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38BDF8' }}>
                  Asistente Clínico de Triaje 24/7
                </div>
              </div>
              <button
                onClick={handleResetTriage}
                title="Reiniciar Simulación"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--doc-muted)',
                  cursor: 'pointer',
                  padding: '12px 14px',
                  minHeight: '44px',
                  minWidth: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Phone Screen: Chat Messages */}
            <div className="doc-phone-screen">
              {triageHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`doc-chat-bubble ${
                    msg.sender === 'bot' ? 'doc-bubble-bot' : 'doc-bubble-user'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="doc-typing-dots">
                  <div className="doc-typing-dot" />
                  <div className="doc-typing-dot" />
                  <div className="doc-typing-dot" />
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Phone Interactive Chips */}
            <div className="doc-chips-container">
              {currentNodeId === 'summary' ? (
                <>
                  <a
                    href={triageWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-btn doc-btn-primary"
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    <Send size={15} /> Transmitir Ficha al WhatsApp
                  </a>
                  <button
                    onClick={handleResetTriage}
                    className="doc-btn doc-btn-outline"
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <RefreshCw size={15} /> Probar Otra Rama Quirúrgica
                  </button>
                </>
              ) : (
                TRIAGE_TREE[currentNodeId]?.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectTriageOption(opt)}
                    className="doc-triage-chip"
                    disabled={isTyping}
                  >
                    <span>{opt.label}</span>
                    <ChevronRight size={14} color="#00A3E0" />
                  </button>
                ))
              )}
            </div>
          </div>

          <div style={{
            maxWidth: '520px',
            margin: '24px auto 0 auto',
            padding: '12px 16px',
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: '#94A3B8',
            lineHeight: 1.45,
          }}>
            <span style={{ color: 'var(--doc-teal-light)', fontWeight: 700 }}>⚡ Orientación médica preliminar y triaje administrativo:</span> No sustituye la consulta médica presencial ni constituye diagnóstico definitivo formal con el Dr. Carlos Tadeo Perzabal Avilez.
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: CRM QUIRÚRGICO PARA MÉDICOS (PIPELINE)
         ========================================== */}
      <section id="crm-pacientes" className="doc-section" style={{ background: '#050A14' }}>
        <div className="doc-container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 36px auto' }}>
            <span className="doc-badge-tag">GESTIÓN CLÍNICA Y CONVERSIÓN</span>
            <h2>CRM Quirúrgico para Médicos: Trazabilidad y Cero Fugas</h2>
            <p>
              Visualice en tiempo real el pipeline de pacientes precalificados. Cada prospecto captado en el portal web o en campañas de Meta Ads es filtrado en el asistente de WhatsApp y registrado en su tablero clínico con su historial y ficha prequirúrgica.
            </p>
          </div>

          {/* CRM Filter Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
            {[
              { id: 'todos', label: 'Todos los Pacientes' },
              { id: 'lead', label: '1. Lead Captado' },
              { id: 'triage', label: '2. Triaje Calificado' },
              { id: 'cita', label: '3. Cita en Consultorio' },
              { id: 'quirofano', label: '4. Cirugía Programada' },
              { id: 'postop', label: '5. Seguimiento Post-Op' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setCrmFilter(st.id)}
                className={`doc-btn ${crmFilter === st.id ? 'doc-btn-primary' : 'doc-btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Kanban Board */}
          <div className="doc-kanban-board">
            {[
              { id: 'lead', title: 'Lead Captado', tag: 'Meta / Web' },
              { id: 'triage', title: 'Triaje Calificado', tag: 'WhatsApp ASMBS' },
              { id: 'cita', title: 'Cita Consultorio', tag: 'Agendada CME' },
              { id: 'quirofano', title: 'Cirugía Programada', tag: 'Quirófano / UCI' },
              { id: 'postop', title: 'Seguimiento', tag: 'Postquirúrgico' },
            ].map((col) => {
              const patientsInCol = CRM_PATIENTS.filter(
                (p) => (crmFilter === 'todos' || crmFilter === col.id) && p.stage === col.id
              );
              return (
                <div key={col.id} className="doc-kanban-col">
                  <div className="doc-kanban-header">
                    <span>{col.title.toUpperCase()}</span>
                    <span style={{ background: 'rgba(0, 163, 224, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                      {patientsInCol.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {patientsInCol.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--doc-muted)', textAlign: 'center', padding: '16px 8px' }}>
                        Sin pacientes en esta fase
                      </div>
                    ) : (
                      patientsInCol.map((pat) => (
                        <div
                          key={pat.id}
                          onClick={() => setSelectedCrmPatient(pat)}
                          className={`doc-kanban-card ${selectedCrmPatient?.id === pat.id ? 'selected' : ''}`}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '0.875rem', color: '#F8FAFC' }}>{pat.name}</strong>
                            <span style={{ fontSize: '0.7rem', color: pat.badgeColor, fontWeight: 700 }}>
                              {pat.origin}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--doc-teal-light)', fontWeight: 600, marginBottom: '6px' }}>
                            {pat.procedure}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--doc-muted)', lineHeight: 1.3 }}>
                            {pat.clinicalNote.substring(0, 68)}...
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Patient Detail Inspector */}
          {selectedCrmPatient && (
            <div className="doc-patient-detail-box">
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0, 163, 224, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', fontWeight: 800 }}>
                    {selectedCrmPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#F8FAFC' }}>
                      Expediente de Prospecto: {selectedCrmPatient.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--doc-muted)' }}>
                      Procedencia: {selectedCrmPatient.origin} · {selectedCrmPatient.date}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="doc-badge-status" style={{ color: selectedCrmPatient.badgeColor, borderColor: selectedCrmPatient.badgeColor }}>
                    {selectedCrmPatient.stageLabel}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--doc-muted)', display: 'block', fontSize: '0.75rem' }}>PROCEDIMIENTO CONSULTADO</span>
                  <strong style={{ color: '#F8FAFC' }}>{selectedCrmPatient.procedure}</strong>
                </div>
                {selectedCrmPatient.details.bmi && (
                  <div>
                    <span style={{ color: 'var(--doc-muted)', display: 'block', fontSize: '0.75rem' }}>VALORACIÓN IMC</span>
                    <strong style={{ color: '#38BDF8' }}>{selectedCrmPatient.details.bmi}</strong>
                  </div>
                )}
                {selectedCrmPatient.details.ultrasound && (
                  <div>
                    <span style={{ color: 'var(--doc-muted)', display: 'block', fontSize: '0.75rem' }}>ESTUDIO DE IMAGEN</span>
                    <strong style={{ color: '#10B981' }}>{selectedCrmPatient.details.ultrasound}</strong>
                  </div>
                )}
                {selectedCrmPatient.details.scheduledDate && (
                  <div>
                    <span style={{ color: 'var(--doc-muted)', display: 'block', fontSize: '0.75rem' }}>HORARIO / FECHA</span>
                    <strong style={{ color: 'var(--doc-gold)' }}>{selectedCrmPatient.details.scheduledDate}</strong>
                  </div>
                )}
              </div>

              <div style={{ background: '#040810', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--doc-teal-light)', display: 'block', marginBottom: '4px' }}>
                  NOTA CLÍNICA GENERADA POR ASISTENTE DE TRIAJE:
                </span>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                  {selectedCrmPatient.clinicalNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          SECTION: INTERACTIVE INVESTMENT CONFIGURATOR
         ========================================== */}
      <section id="propuesta-economica" className="doc-section">
        <div className="doc-container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
            <span className="doc-badge-tag">CONDICIONES COMERCIALES APOLOGRAMA</span>
            <h2>Propuesta Económica</h2>
            <p>
              Inversión transparente para la implementación y gestión continua del Ecosistema Digital Quirúrgico. Precios en moneda nacional (MXN), orientados a infraestructura tecnológica y métricas técnicas de conversión.
            </p>
          </div>

          <div className="doc-configurator-box">
            {/* CATEGORY 1: SETUP MODULES */}
            <div className="doc-category-title">
              <span>1. Entregables de Implementación Inicial</span>
              <span className="doc-badge-setup">Setup Único</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--doc-muted)', marginBottom: '16px' }}>
              Desarrollo de infraestructura fundacional, sistema visual de alta autoridad y portal web médico binacional.
            </p>

            {SETUP_MODULES.map((item) => {
              const isActive = !!activeModules[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleModule(item.id)}
                  className={`doc-toggle-row ${isActive ? 'active' : ''}`}
                >
                  <div className="doc-toggle-thumb">
                    <img src={item.image} alt={item.imageAlt} loading="lazy" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F8FAFC' }}>
                        {item.name}
                      </span>
                      <span className="doc-badge-setup">
                        {item.badge}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: 'var(--doc-muted)' }}>
                      {item.description}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.75rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {item.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isActive ? 'var(--doc-gold)' : 'var(--doc-muted)' }}>
                        {formatMxn(item.price)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--doc-muted)' }}>Inversión Única</div>
                    </div>
                    <div className={`doc-switch ${isActive ? 'active' : ''}`}>
                      <div className="doc-switch-circle" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* CATEGORY 2: MONTHLY OPERATING MODULES */}
            <div className="doc-category-title" style={{ marginTop: '32px' }}>
              <span>2. Servicios Operativos Mensuales</span>
              <span className="doc-badge-monthly">Iguala Recurrente</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--doc-muted)', marginBottom: '16px' }}>
              Gestión editorial de contenidos clínicos, administración de pauta en Meta Ads, asistente 24/7 y CRM médico.
            </p>

            {MONTHLY_MODULES.map((item) => {
              const isActive = !!activeModules[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleModule(item.id)}
                  className={`doc-toggle-row ${isActive ? 'active' : ''}`}
                >
                  <div className="doc-toggle-thumb">
                    <img src={item.image} alt={item.imageAlt} loading="lazy" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F8FAFC' }}>
                        {item.name}
                      </span>
                      <span className="doc-badge-monthly">
                        {item.badge}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: 'var(--doc-muted)' }}>
                      {item.description}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.75rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {item.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isActive ? 'var(--doc-teal-light)' : 'var(--doc-muted)' }}>
                        {formatMxn(item.price)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--doc-muted)' }}>Mensual + IVA</div>
                    </div>
                    <div className={`doc-switch ${isActive ? 'active' : ''}`}>
                      <div className="doc-switch-circle" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Financial Summary Card (Hybrid Setup + Monthly) */}
            <div className="doc-math-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <ShieldCheck size={20} color="#D4AF37" />
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--doc-gold)', letterSpacing: '1px' }}>
                  DESGLOSE FINANCIERO Y FISCAL (MXN)
                </span>
              </div>

              {/* Setup Breakdown */}
              <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--doc-gold)', marginBottom: '6px' }}>
                  A. INVERSIÓN DE IMPLEMENTACIÓN (SETUP ÚNICO)
                </div>
                <div className="doc-math-row">
                  <span>Subtotal Setup Inicial</span>
                  <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                    {formatMxn(investmentMath.setupSubtotal)} MXN
                  </span>
                </div>
                <div className="doc-math-row">
                  <span>IVA Trasladado (16%)</span>
                  <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                    {formatMxn(investmentMath.setupIva)} MXN
                  </span>
                </div>
                <div className="doc-math-row" style={{ color: 'var(--doc-gold)', fontWeight: 800 }}>
                  <span>Total Setup Facturado</span>
                  <span>{formatMxn(investmentMath.setupTotal)} MXN</span>
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--doc-teal-light)', marginBottom: '6px' }}>
                  B. OPERACIÓN CONTINUA (IGUALA MENSUAL RECURRENTE)
                </div>
                <div className="doc-math-row">
                  <span>Subtotal Mensual</span>
                  <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                    {formatMxn(investmentMath.monthlySubtotal)} MXN/mes
                  </span>
                </div>
                <div className="doc-math-row">
                  <span>IVA Trasladado (16%)</span>
                  <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                    {formatMxn(investmentMath.monthlyIva)} MXN
                  </span>
                </div>
                <div className="doc-math-row" style={{ color: 'var(--doc-teal-light)', fontWeight: 800 }}>
                  <span>Total Mensual Facturado</span>
                  <span>{formatMxn(investmentMath.monthlyTotal)} MXN/mes</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--doc-muted)', marginTop: '4px', textAlign: 'right' }}>
                  Equivalente a {formatMxn(investmentMath.monthlyDaily)} MXN al día en gestión tecnológica y editorial
                </div>
                <div style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  background: 'rgba(56, 189, 248, 0.06)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  color: '#94A3B8',
                  lineHeight: 1.45,
                  textAlign: 'left',
                }}>
                  <strong style={{ color: 'var(--doc-teal-light)' }}>📌 Delimitación de Inversión Publicitaria:</strong> La iguala mensual cubre exclusivamente los honorarios profesionales de Apolograma por diseño, gestión técnica y optimización de conversión. El presupuesto de inversión publicitaria en Meta Ads (Facebook/Instagram) es pagado directamente por el Dr. Carlos Perzabal a Meta con su propio método de pago corporativo, excluido de los honorarios de la agencia.
                </div>
              </div>

              {/* Initial Grand Total */}
              <div className="doc-math-total">
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--doc-white)' }}>
                    Inversión Inicial Total
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--doc-muted)' }}>
                    Liquidación de Setup Inicial + Primer Mes Operativo
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--doc-gold)' }}>
                  {formatMxn(investmentMath.initialGrandTotal)} <span style={{ fontSize: '0.9rem', color: 'var(--doc-muted)' }}>MXN</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
                <a
                  href={approvalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-btn doc-btn-gold"
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <Check size={18} /> Confirmar Aprobación por WhatsApp
                </a>
                <button onClick={openModal} className="doc-btn doc-btn-outline" style={{ flex: 1 }}>
                  <Calendar size={18} /> Agendar Sesión de Bienvenida (20 min)
                </button>
              </div>
            </div>

            {/* Banregio Fiscal Billing Box */}
            <div className="doc-fiscal-box">
              <div className="doc-fiscal-header">
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--doc-teal-light)', letterSpacing: '0.5px' }}>
                  DATOS FISCALES PARA TRANSFERENCIA INTERBANCARIA
                </span>
                <button
                  onClick={handleCopyClabe}
                  className="doc-btn doc-btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.8125rem', minHeight: '44px', minWidth: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  id="btn-copy-clabe"
                >
                  {copiedClabe ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copiedClabe ? '¡CLABE Copiada!' : 'Copiar CLABE'}</span>
                </button>
              </div>

              <div className="doc-fiscal-grid">
                <div>
                  <span style={{ color: 'var(--doc-muted)', display: 'block', fontSize: '0.75rem' }}>RAZÓN SOCIAL</span>
                  <strong style={{ color: '#F8FAFC' }}>TECNOLOGIES TECZA, S. DE R.L. DE C.V.</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--doc-muted)', display: 'block', fontSize: '0.75rem' }}>RFC</span>
                  <strong style={{ color: '#F8FAFC' }}>TTE170614QI1</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--doc-muted)', display: 'block', fontSize: '0.75rem' }}>INSTITUCIÓN BANCARIA</span>
                  <strong style={{ color: '#F8FAFC' }}>Banregio</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--doc-muted)', display: 'block', fontSize: '0.75rem' }}>CLABE INTERBANCARIA</span>
                  <strong style={{ color: 'var(--doc-gold)', letterSpacing: '1px' }}>058164657492400290</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MODAL: STRATEGY SESSION (20 MIN)
         ========================================== */}
      {isModalOpen && (
        <div className="doc-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="doc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'transparent',
                border: 'none',
                color: 'var(--doc-muted)',
                cursor: 'pointer',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>

            {modalSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>¡Sesión Agendada Exitosamente!</h3>
                <p style={{ fontSize: '0.9375rem', color: '#CBD5E1' }}>
                  Hemos registrado la solicitud para el <strong>{modalForm.date}</strong> a las <strong>{modalForm.time}</strong> con <strong>{modalForm.name}</strong>.
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  Emmanuel Padilla se pondrá en contacto al teléfono <strong>{modalForm.phone}</strong> para formalizar el enlace privado de Google Meet o coordinar la sesión presencial.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="doc-btn doc-btn-primary"
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleMeetingSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Calendar size={20} color="#00A3E0" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--doc-teal-light)', letterSpacing: '0.5px' }}>
                    SESIÓN ESTRATÉGICA · 20 MINUTOS
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>Coordinar Presentación Ejecutiva</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '20px' }}>
                  Reunión privada con Emmanuel Padilla y el equipo de ingeniería de Apolograma para resolver dudas y formalizar el inicio.
                </p>

                {modalError && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid #EF4444',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.8125rem',
                      color: '#FCA5A5',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} flex-shrink="0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--doc-muted)' }}>
                  Nombre Completo / Dirección
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Carlos Tadeo Perzabal / Asistente"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  className="doc-input"
                />

                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--doc-muted)' }}>
                  Teléfono de WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(656) 123-4567 o (915) 555-0199"
                  value={modalForm.phone}
                  onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                  className="doc-input"
                />

                <div className="doc-modal-grid">
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--doc-muted)' }}>
                      Fecha (Lun - Vie)
                    </label>
                    <input
                      type="date"
                      required
                      value={modalForm.date}
                      onChange={handleDateChange}
                      className="doc-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--doc-muted)' }}>
                      Horario
                    </label>
                    <select
                      value={modalForm.time}
                      onChange={(e) => setModalForm({ ...modalForm, time: e.target.value })}
                      className="doc-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="doc-btn doc-btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {modalLoading ? 'Registrando sesión...' : 'Confirmar y Agendar'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          FOOTER: 100% APOLOGRAMA
         ========================================== */}
      <footer className="doc-footer">
        <div className="doc-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <img
                src="/assets/apolograma-logo-v2.png"
                alt="Apolograma"
                style={{ height: '22px', width: 'auto' }}
              />
              <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.9375rem' }}>
                Apolograma Interactive Studio
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Desarrollo de Software, Webapps Médicas, Triaje Inteligente y Pauta Digital de Alto Nivel.
            </p>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: 'var(--doc-muted)' }}>
            <div>propuestas.tecza.com.mx/dr-carlos-perzabal</div>
            <div>Ciudad Juárez, Chih. — El Paso, TX · {new Date().getFullYear()}</div>
            <div style={{ marginTop: '4px', color: 'var(--doc-teal-light)', fontSize: '0.75rem' }}>
              Documento confidencial preparado para el Dr. Carlos Tadeo Perzabal Avilez
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(148, 163, 184, 0.12)',
          fontSize: '0.75rem',
          color: '#64748B',
          lineHeight: 1.55,
          textAlign: 'center',
          maxWidth: '960px',
          margin: '20px auto 0 auto',
          paddingLeft: '14px',
          paddingRight: '14px',
        }}>
          <strong>Aviso de Responsabilidad Médica:</strong> La información clínica, diagramas anatómicos y herramientas interactivas presentadas en esta plataforma tienen propósito exclusivamente educativo, orientativo y descriptivo de la propuesta de servicios. Las funciones de triaje digital no constituyen valoración clínica, prescripción ni diagnóstico médico definitivo; la atención a la salud requiere invariablemente la consulta presencial formal en consultorio con el Dr. Carlos Tadeo Perzabal Avilez (Cirugía General, Bariátrica y Robótica · Certificado CMCOEM / CMCG).
        </div>
      </footer>
    </div>
  );
}
