"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform, AnimatePresence, animate, useInView } from "framer-motion";
import styles from "./page.module.css";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ViralChart = dynamic(() => import("./EcosystemAnimations").then(mod => mod.ViralChart));
const ApologramaShowcase = dynamic(() => import("./EcosystemAnimations").then(mod => mod.ApologramaShowcase));
const PremiumAudienceCard = dynamic(() => import("./EcosystemAnimations").then(mod => mod.PremiumAudienceCard));
const InsightCard = dynamic(() => import("./EcosystemAnimations").then(mod => mod.InsightCard));
import { CursorSpotlight } from "./CursorSpotlight";
import Image from "next/image";

// --- Countdown Banner ---
const CountdownBanner = ({ targetDate, label, isLight, primaryColor }: { targetDate: string; label: string; isLight: boolean; primaryColor: string }) => {
  const [days, setDays] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
      setDays(diff);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        margin: '3rem auto',
        padding: '2rem 2.5rem',
        borderRadius: '16px',
        background: isLight 
          ? `linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}05 100%)` 
          : `linear-gradient(135deg, ${primaryColor}20 0%, rgba(0,0,0,0.3) 100%)`,
        border: `1px solid ${primaryColor}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        maxWidth: '700px',
        boxShadow: `0 0 60px ${primaryColor}15`,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          style={{ 
            fontSize: '3.5rem', 
            fontWeight: 900, 
            color: primaryColor, 
            lineHeight: 1,
            textShadow: `0 0 30px ${primaryColor}50`
          }}
        >
          {days}
        </motion.div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7, marginTop: '0.3rem' }}>
          días
        </div>
      </div>
      <div style={{ textAlign: 'left', flex: 1, minWidth: '200px' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: isLight ? '#222' : '#fff', marginBottom: '0.3rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.85rem', color: isLight ? '#666' : '#999', lineHeight: 1.4 }}>
          Tus competidores ya están invirtiendo. La pregunta no es si debes actuar, sino cuánto mercado perderás si no lo haces hoy.
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedPrice = ({ value, locale = 'es-MX', currency = 'MXN' }: { value: number, locale?: string, currency?: string }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(val) {
        node.textContent = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
      }
    });
    return controls.stop;
  }, [value, isInView, locale, currency]);

  return <span ref={nodeRef}>{new Intl.NumberFormat(locale, { style: 'currency', currency }).format(0)}</span>;
}

interface Service {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  bullets?: string[];
  image?: string;
  badge?: string;
}

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

interface AccordionProps {
  service: Service;
  formatPrice: (n:number)=>string;
  variants: Variants;
  isOpen: boolean;
  onToggle?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  priceSuffix?: string;
  selectionType?: 'radio' | 'checkbox';
  disableAccordion?: boolean;
}

const bulletContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const bulletItemVariants: Variants = {
  hidden: { opacity: 0, x: -15, y: 5 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 14 
    }
  }
};

const AccordionCard = ({ service, formatPrice, variants, isOpen, onToggle, isSelectable, isSelected, onSelect, priceSuffix, selectionType = 'radio', disableAccordion }: AccordionProps) => {
  const showOpen = isOpen || disableAccordion;
  return (
    <motion.div 
      layout
      className={`${styles.serviceItem} ${showOpen ? styles.serviceItemActive : 'glass'}`}
      onClick={disableAccordion ? (isSelectable ? onSelect : undefined) : onToggle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      style={{ 
        cursor: disableAccordion ? (isSelectable ? 'pointer' : 'default') : 'pointer',
        position: 'relative', zIndex: showOpen ? 45 : 1,
        ...(isSelectable && isSelected ? { 
          borderColor: 'var(--primary-color, #4ade80)',
          boxShadow: '0 0 20px rgba(74, 222, 128, 0.15)'
        } : {})
      }}
    >
      <motion.div layout className={styles.serviceHeader}>
        <div className={styles.serviceInfo}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {service.name}
            {service.badge && (
              <span style={{ 
                fontSize: '0.6rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
                padding: '0.25rem 0.6rem', 
                borderRadius: '20px', 
                background: 'rgba(168, 85, 247, 0.15)', 
                border: '1px solid rgba(168, 85, 247, 0.3)', 
                color: '#a855f7', 
                marginLeft: '0.75rem',
                verticalAlign: 'middle'
              }}>{service.badge}</span>
            )}
            {!disableAccordion && onToggle && (
              <motion.div 
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'inline-block', marginLeft: '0.75rem' }}
              >
                ▼
              </motion.div>
            )}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className={styles.servicePrice} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
            {service.originalPrice && (
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', marginBottom: '0.15rem' }}>
                {formatPrice(service.originalPrice)}
              </span>
            )}
            <span style={{ fontWeight: 700 }}>{formatPrice(service.price)}</span>
            {priceSuffix && <span style={{ fontSize: '0.65rem', color: 'var(--muted-text)', marginTop: '0.1rem', textTransform: 'uppercase', fontWeight: 600 }}>{priceSuffix}</span>}
          </div>
          {isSelectable && (
            <div 
              onClick={(e) => { e.stopPropagation(); onSelect && onSelect(); }}
              style={{
                width: '22px', height: '22px', 
                borderRadius: selectionType === 'checkbox' ? '6px' : '50%',
                border: `2px solid ${isSelected ? 'var(--primary-color, #4ade80)' : 'var(--muted-text)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                transition: 'all 0.2s ease',
                background: isSelected && selectionType === 'checkbox' ? 'var(--primary-color, #4ade80)' : 'transparent',
                opacity: isSelected ? 1 : 0.5
              }}
            >
              {isSelected && (
                selectionType === 'checkbox' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <div style={{width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color, #4ade80)'}} />
                )
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={styles.accordionContent}
          >
            {service.image && (
              <Image src={service.image} alt={service.name} className={styles.accordionImage} width={200} height={200} />
            )}
            <div className={styles.accordionText}>
              <p style={{ marginBottom: service.bullets ? "1.5rem" : "0" }}>
                {service.description}
              </p>
              
              {service.bullets && (
                <motion.ul 
                  className={styles.bulletList}
                  variants={bulletContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {service.bullets.map((bullet, idx) => (
                    <motion.li 
                      key={idx} 
                      className={styles.bulletItem}
                      variants={bulletItemVariants}
                      whileHover={{ scale: 1.015, x: 4 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '0.8rem 1.2rem',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        transition: 'border-color 0.2s, background 0.2s',
                        cursor: 'default',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span className={styles.bulletCheck} style={{ color: 'var(--primary-color, #a855f7)', fontSize: '1.1rem', marginRight: '0.2rem' }}>✦</span>
                      <span style={{ color: 'var(--text-color)', fontSize: '0.95rem', fontWeight: 400 }}>{bullet}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface ClientData {
  clientName: string;
  clientLogo: string;
  industry: string;
  heroTitle?: string;
  heroText: string;
  themeTemplate?: string;
  hero?: {
    headline?: string;
    subheadline?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
  };
  contact?: {
    phone?: string;
    name?: string;
    message?: string;
  };
  config?: {
    currency?: string;
    locale?: string;
    priceSuffix?: string;
    agency?: 'both' | 'apolograma' | 'fn1';
    ivaPercent?: number;
    exchangeRate?: number;
    enableCurrencyToggle?: boolean;
  };
  campaignDeepDive?: {
    title: string;
    subtitle: string;
    influencerSection: {
      image: string;
      description: string;
    };
    timelines: { 
      title: string; 
      steps: { step: string; description: string }[] 
    }[];
    budgetTable: {
      concept: string;
      responsibility: string;
      cost: string;
    }[];
    impactProjection: string;
  };
  features?: {
    showEcosystem?: boolean;
    showAudiences?: boolean;
    showPricing?: boolean;
    exclusivePackages?: boolean;
    disableSelection?: boolean;
    disableAccordion?: boolean;
    pillsLayout?: boolean;
    hideModularMethodology?: boolean;
  };
  storytelling?: {
    narrative?: { title: string; content: string; image?: string }[];
    challenge?: string;
    countdownDate?: string;
    countdownLabel?: string;
    pillars: { title: string; description: string; image?: string }[];
    justification?: { title: string; content: string; points?: string[] };
  };
  packages: {
    title?: string;
    subtitle?: string;
    methodologyText?: string;
    fn1: Service[];
    apolograma: Service[];
    blocks?: { name: string; services: Service[] }[];
  };
  discountPercent: number;
  hideTotal?: boolean;
  footerVideo?: string;
  theme?: {
    name?: string;
    mode?: 'dark' | 'light';
    primary?: string;
    primaryColor?: string;
    fontHeading?: string;
    fontBody?: string;
    fontDisplay?: string;
    fontDisplayStyle?: string;
    textColor?: string;
    mutedText?: string;
    textGradient?: string;
    clientLogoRaw?: boolean;
    clientLogoStyle?: 'circle' | 'square' | 'raw' | 'split';
    bgColor?: string;
    surfaceGlass?: string;
    glassBorder?: string;
    shadowElevation1?: string;
    shadowElevation2?: string;
    borderRadius?: string;
  };
}
export default function MediaKitView({ data }: { data: ClientData }) {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  useEffect(() => {
    if (!isAutoplayActive) return;
    
    // Start highlighting segment 0 after drawing animation completes (1.5s)
    const timeout = setTimeout(() => {
      setHoveredSegment(0);
    }, 1500);

    const interval = setInterval(() => {
      setHoveredSegment((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % 4;
      });
    }, 3200); // 3.2 seconds per segment

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isAutoplayActive]);
  
  const isExclusive = data.features?.exclusivePackages === true;
  const [selectedApoIdx, setSelectedApoIdx] = useState<number>(0);
  
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    if (data.packages.fn1) {
      data.packages.fn1.forEach(s => {
        initialState[s.name] = !(s.name.includes('(Opcional)') || s.name.includes('(Opcionales)'));
      });
    }
    if (data.packages.blocks) {
      data.packages.blocks.forEach(b => {
        const isBlockOptional = b.name.toLowerCase().includes('opcional') || b.name.toLowerCase().includes('adicional');
        const isRadioBlock = !isBlockOptional && (
          b.name.toLowerCase().includes('opción') || 
          b.name.toLowerCase().includes('opcion') || 
          b.name.toLowerCase().includes('iguala') ||
          b.name.toLowerCase().includes('plan')
        );
        b.services.forEach((s, idx) => {
          if (isBlockOptional) {
            initialState[s.name] = false;
          } else if (isRadioBlock) {
            initialState[s.name] = idx === 0;
          } else {
            initialState[s.name] = !(s.name.includes('(Opcional)') || s.name.includes('(Opcionales)'));
          }
        });
      });
    }
    if (!isExclusive && data.packages.apolograma) {
      data.packages.apolograma.forEach(s => {
        initialState[s.name] = !(s.name.includes('(Opcional)') || s.name.includes('(Opcionales)'));
      });
    }
    return initialState;
  });

  const toggleServiceSelection = (name: string) => {
    setSelectedServices(prev => {
      const next = { ...prev, [name]: !prev[name] };
      if (data.packages.blocks) {
        data.packages.blocks.forEach(block => {
          const serviceNames = block.services.map(s => s.name);
          if (serviceNames.includes(name)) {
            const isBlockOptional = block.name.toLowerCase().includes('opcional') || block.name.toLowerCase().includes('adicional');
            const isRadioBlock = !isBlockOptional && (
              block.name.toLowerCase().includes('opción') || 
              block.name.toLowerCase().includes('opcion') || 
              block.name.toLowerCase().includes('iguala') ||
              block.name.toLowerCase().includes('plan')
            );
            if (isRadioBlock) {
              if (!next[name]) {
                next[name] = true; // Radio button cannot be deselected to empty
              } else {
                serviceNames.forEach(otherName => {
                  if (otherName !== name) {
                    next[otherName] = false;
                  }
                });
              }
            }
          }
        });
      }
      return next;
    });
  };

  const fn1Total = data.packages.fn1 ? data.packages.fn1.reduce((acc, curr) => acc + (selectedServices[curr.name] ? curr.price : 0), 0) : 0;
  
  const apoTotal = isExclusive 
    ? (data.packages.apolograma && data.packages.apolograma.length > 0 ? data.packages.apolograma[selectedApoIdx].price : 0)
    : (data.packages.apolograma ? data.packages.apolograma.reduce((acc, curr) => acc + (selectedServices[curr.name] ? curr.price : 0), 0) : 0);
    
  const blocksTotal = data.packages.blocks ? data.packages.blocks.reduce((acc, block) => acc + block.services.reduce((sum, s) => sum + (selectedServices[s.name] ? s.price : 0), 0), 0) : 0;
  
  const subtotal = fn1Total + apoTotal + blocksTotal;
  const discountPercent = data.discountPercent || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  // Calculate total original subtotal for selected services
  const selectedOriginalTotal = Object.keys(selectedServices)
    .filter(name => selectedServices[name])
    .reduce((sum, name) => {
      let service = data.packages.fn1?.find(s => s.name === name);
      if (!service && data.packages.apolograma) {
        service = data.packages.apolograma.find(s => s.name === name);
      }
      if (!service && data.packages.blocks) {
        for (const block of data.packages.blocks) {
          const found = block.services.find(s => s.name === name);
          if (found) {
            service = found;
            break;
          }
        }
      }
      return sum + (service?.originalPrice || service?.price || 0);
    }, 0);

  const totalSavings = selectedOriginalTotal - subtotal;

  const [selectedCurrency, setSelectedCurrency] = useState(data.config?.currency || "MXN");
  const [circadianState, setCircadianState] = useState<'rise' | 'focus' | 'balance' | 'unwind'>('balance');
  const [kodiDemoMode, setKodiDemoMode] = useState<'quiz' | 'chat'>('quiz');
  
  // Quiz Minigame State
  const [quizStep, setQuizStep] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<{ goal?: string; energyDrop?: string; sleep?: string }>({});
  const [selectedOptionTemp, setSelectedOptionTemp] = useState<string | null>(null);
  const [isQuizAnalyzing, setIsQuizAnalyzing] = useState<boolean>(false);

  // Chatbot Live State
  const [chatMessages, setChatMessages] = useState<Array<{
    id: number;
    sender: 'bot' | 'user';
    text: string;
    productCard?: {
      tag: string;
      title: string;
      dose: string;
      color: string;
      singlePrice: string;
      subPrice: string;
    };
  }>>([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola! Soy tu Asesor Biológico Kodi dose (IA) 🧬. Estoy conectado a la base científica de ingredientes, cronobiología y planes de suscripción. ¿Qué objetivo de salud te gustaría optimizar hoy?',
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  const renderFormattedChatMessage = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: '#160B3F', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('•')) {
        return (
          <div key={lIdx} style={{ display: 'flex', gap: '8px', alignItems: 'baseline', margin: '4px 0 4px 6px' }}>
            <span style={{ color: '#7044EC', fontSize: '9px' }}>●</span>
            <span>{formattedLine}</span>
          </div>
        );
      }

      return (
        <div key={lIdx} style={{ margin: line.trim() === '' ? '4px 0' : '2px 0' }}>
          {formattedLine}
        </div>
      );
    });
  };

  const handleSelectQuizOption = (key: 'goal' | 'energyDrop' | 'sleep', value: string) => {
    setSelectedOptionTemp(value);
    const updated = { ...quizAnswers, [key]: value };
    setQuizAnswers(updated);
    
    setTimeout(() => {
      setSelectedOptionTemp(null);
      if (quizStep === 1) {
        setQuizStep(2);
      } else if (quizStep === 2) {
        setQuizStep(3);
      } else if (quizStep === 3) {
        setIsQuizAnalyzing(true);
        setTimeout(() => {
          setIsQuizAnalyzing(false);
          setQuizStep(4);
        }, 1400);
      }
    }, 220);
  };

  const handleResetQuiz = () => {
    setQuizStep(1);
    setQuizAnswers({});
    setSelectedOptionTemp(null);
    setIsQuizAnalyzing(false);
  };

  const handleSwitchToChatWithContext = () => {
    setKodiDemoMode('chat');
    const goalText = quizAnswers.goal || 'tu bienestar integral';
    setTimeout(() => {
      handleSendChatMessage(`Hola, acabo de realizar mi test circadiano enfocado en "${goalText}". ¿Por qué me conviene pedir el stack en suscripción mensual?`);
    }, 300);
  };

  const handleAddToCartSimulated = (productName: string) => {
    setCartNotification(`✅ "${productName}" añadido con 15% OFF por suscripción`);
    setTimeout(() => setCartNotification(null), 3500);
  };

  const handleSendChatMessage = (textToSend?: string) => {
    const messageText = (textToSend || chatInput).trim();
    if (!messageText) return;

    const userMsgId = Date.now();
    setChatMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: messageText }
    ]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      const lower = messageText.toLowerCase();
      let botResponse = '';
      let productCard: any = null;

      if (lower.includes('suscrip') || lower.includes('recurrente') || lower.includes('mes') || lower.includes('descuento') || lower.includes('pausar') || lower.includes('cancelar')) {
        botResponse = '✨ **Ventajas del Modelo de Suscripción Kodi dose™:**\n• **15% de Descuento Permanente** en cada entrega.\n• **Envío Prioritario Gratuito** directo a tu puerta cada 30 días.\n• **Flexibilidad Total:** Puedes pausar, adelantar o cancelar en 1 clic desde tu cuenta sin penalizaciones ni contratos forzosos.';
        productCard = {
          tag: 'Suscripción Inteligente',
          title: 'Full Circadian Stack (3 Fórmulas)',
          dose: 'Entrega Cada 30 Días · Envío Gratis Incluido',
          singlePrice: '$2,200 MXN',
          subPrice: '$1,870 MXN / mes',
          color: 'radial-gradient(circle, #7044EC 0%, #B8A7EA 70%)'
        };
      } else if (lower.includes('green') || lower.includes('ayuna') || lower.includes('mañana') || lower.includes('despertar') || lower.includes('rise')) {
        botResponse = '🌿 **Green Start™ (Dose 05) · Protocolo Matutino:**\nFormulado con **Matcha Ceremonial Uji, Clorofila micronizada, Espirulina orgánica y Adaptógenos (Rhodiola)**.\n\nTomarlo en ayunas con agua templada sincroniza tu curva natural de cortisol matutino, alcaliniza el tracto gastrointestinal y provee hasta **6 horas de energía cognitiva limpia** sin temblor ni el posterior crash de la cafeína tradicional.';
        productCard = {
          tag: 'Energía Limpia Matutina',
          title: 'Green Start™ (Dose 05)',
          dose: 'Polvo Micronizado · 400g (30 Tomas)',
          singlePrice: '$790 MXN',
          subPrice: '$670 MXN / mes',
          color: 'radial-gradient(circle, #EF5126 0%, #FFA843 70%)'
        };
      } else if (lower.includes('daily') || lower.includes('balance') || lower.includes('vitamina') || lower.includes('ingrediente')) {
        botResponse = '🧬 **Daily Balance™ (Dose 01) · Nutrición & Homeostasis:**\nContiene **24 micronutrientes bio-quelados** de absorción celular inmediata: Complejo B metilado (B12 Metilcobalamina), Vitamina D3+K2 para fijación ósea y Zinc quelado.\n\nDiseñado para tomarse con el almuerzo para sostener la inmunidad, evitar la pesadez digestiva y neutralizar radicales libres.';
        productCard = {
          tag: 'Nutrición Celular & Homeostasis',
          title: 'Daily Balance™ Multivitamínico',
          dose: 'Dose 01 · 60 Cápsulas Veganas Gastro-resistentes',
          singlePrice: '$690 MXN',
          subPrice: '$585 MXN / mes',
          color: 'radial-gradient(circle, #073B3A 0%, #74D7B8 70%)'
        };
      } else if (lower.includes('sueño') || lower.includes('dormir') || lower.includes('noche') || lower.includes('descans') || lower.includes('unwind') || lower.includes('calma') || lower.includes('rest')) {
        botResponse = '🌙 **Restorative Rest™ (Dose 04) · Al Alma Calma:**\nFórmula nootrópica nocturna con **Bisglicinato de Magnesio de alta absorción, L-Teanina pura y Extracto estandarizado de Melisa**.\n\nDesactiva el sistema nervioso simpático 30 minutos antes de dormir, induciendo fases de **sueño REM profundo y reparación celular tisular** sin generar dependencia ni letargo matutino.';
        productCard = {
          tag: 'Reparación Celular Nocturna',
          title: 'Restorative Rest™ (Dose 04)',
          dose: 'Al Alma Calma · 60 Cápsulas',
          singlePrice: '$720 MXN',
          subPrice: '$610 MXN / mes',
          color: 'radial-gradient(circle, #23155B 0%, #B8A7EA 70%)'
        };
      } else if (lower.includes('envio') || lower.includes('envío') || lower.includes('mexico') || lower.includes('méxico') || lower.includes('donde') || lower.includes('dónde') || lower.includes('tiempo')) {
        botResponse = '📦 **Logística y Envíos a todo México:**\nRealizamos despachos diarios asegurados a cualquier código postal del país vía FedEx y DHL Express. Los envíos tardan de 2 a 4 días hábiles. En todas las suscripciones recurrentes el costo de envío es **$0.00 MXN (100% Gratuito)**.';
      } else {
        botResponse = `✨ Gracias por tu pregunta sobre "${messageText}". En Kodi dose™ sincronizamos cada bio-activo con tu ritmo circadiano (Rise, Focus, Balance, Unwind). ¿Te gustaría que armemos tu stack personalizado con 15% de descuento por suscripción?`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          productCard: productCard || undefined
        }
      ]);
      setIsBotTyping(false);
    }, 700);
  };

  const exchangeRate = data.config?.exchangeRate || 20;

  const convertPrice = (num: number) => {
    if (data.config?.enableCurrencyToggle && selectedCurrency === "USD") {
      return num / exchangeRate;
    }
    return num;
  };

  const currency = data.config?.currency || "MXN";
  const locale = data.config?.locale || "es-MX";

  const formatPrice = (num: number) => {
    const converted = convertPrice(num);
    const curr = data.config?.enableCurrencyToggle ? selectedCurrency : currency;
    const loc = curr === "USD" ? "en-US" : locale;
    return new Intl.NumberFormat(loc, { style: 'currency', currency: curr }).format(converted);
  };

  const getWhatsAppMessage = () => {
    if (data.contact?.message) return data.contact.message;
    const selectedNames = Object.keys(selectedServices).filter(name => selectedServices[name]);
    const cleanClientName = data.clientName || 'la propuesta';
    if (selectedNames.length === 0) {
      return `Hola, revisé la propuesta de ${cleanClientName} y me gustaría platicar al respecto.`;
    }
    const selectedPlans = selectedNames.filter(name => !name.toLowerCase().includes('adicional') && !name.toLowerCase().includes('extra'));
    const selectedAdditionals = selectedNames.filter(name => name.toLowerCase().includes('adicional') || name.toLowerCase().includes('extra'));
    let message = `¡Hola! Revisé la propuesta de ${cleanClientName} y me gustaría iniciar con el proyecto.\n\n`;
    if (selectedPlans.length > 0) {
      message += `📋 *Plan Seleccionado:*\n`;
      selectedPlans.forEach(plan => {
        message += `- ${plan}\n`;
      });
    }
    if (selectedAdditionals.length > 0) {
      message += `\n➕ *Servicios Adicionales:*\n`;
      selectedAdditionals.forEach(add => {
        message += `- ${add}\n`;
      });
    }
    const totalWithIva = total * (1 + (data.config?.ivaPercent !== undefined ? data.config.ivaPercent : 16) / 100);
    message += `\n💰 *Total Estimado:* ${formatPrice(totalWithIva)} (con IVA incluido)`;
    return message;
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const isLight = data.theme?.mode === 'light';

  const customTheme = data.theme ? {
    '--font-heading': data.theme.fontHeading || 'Space Grotesk, sans-serif',
    '--font-body': data.theme.fontBody || 'Inter, sans-serif',
    '--font-display': data.theme.fontDisplay || 'var(--font-heading)',
    '--font-display-style': data.theme.fontDisplayStyle || 'normal',
    '--primary-gradient': `linear-gradient(135deg, ${data.theme.primaryColor || data.theme.primary || '#a855f7'} 0%, ${isLight ? '#990000' : '#000'} 100%)`,
    '--primary-color': data.theme.primaryColor || data.theme.primary || '#d4b895',
    '--text-gradient': data.theme.textGradient || (isLight ? 'linear-gradient(to right, #222, #555)' : 'linear-gradient(to right, #fff, #888)'),
    '--bg-color': data.theme.bgColor || (isLight ? '#fdfcfb' : '#050505'),
    '--text-color': data.theme.textColor || (isLight ? '#111111' : '#ffffff'),
    '--muted-text': data.theme.mutedText || (isLight ? '#555555' : '#888888'),
    '--card-bg': data.theme.surfaceGlass || (isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.05)'),
    '--glass-border': data.theme.glassBorder || (isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'),
    '--header-bg': data.theme.surfaceGlass || (isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'),
    '--shadow-elevation-1': data.theme.shadowElevation1 || '0 4px 12px rgba(0,0,0,0.05)',
    '--shadow-elevation-2': data.theme.shadowElevation2 || '0 8px 32px rgba(0,0,0,0.08)',
    '--border-radius': data.theme.borderRadius || '16px',
  } as unknown as React.CSSProperties : {};

  const isDell1996 = data.themeTemplate === 'dell-1996' || data.theme?.name?.toLowerCase().includes('dell') || data.theme?.name?.toLowerCase().includes('1996');

  if (isDell1996) {
    const narrativeBadges = ['⚡ SIN DESCARGAS DE APPS', '🔒 AUDITORÍA ANTIFRAUDE', '📺 100% PLUG & PLAY (LAPTOP + TV)'];
    const narrativePills = ['FRONTEND PWA', 'PANEL SAAS', 'STREAM ENGINE'];

    return (
      <div className={styles.dellFrame}>
        {/* Top Banner */}
        <div className={styles.dellTopBanner}>
          <div className={styles.dellBannerLeft}>
            <span className={styles.dellStatusDot}></span>
            <span style={{ color: '#34D399', fontWeight: 800 }}>LISTO PARA DESPLIEGUE</span>
            <span style={{ opacity: 0.4 }}>//</span>
            <span>{data.clientName?.toUpperCase()} · SISTEMA DE SORTEOS Y PROMOCIONES</span>
          </div>
          <div className={styles.dellBannerRight}>
            <span className={styles.dellYellowSticker}>
              <span className={styles.dellPurpleStripe}>APOLOGRAMA</span> INFRAESTRUCTURA PROPIETARIA
            </span>
            <a href={`tel:${data.contact?.phone || '526561031571'}`} className={styles.dellPhoneCallout}>
              📞 1-800-PROMOS ({data.contact?.phone || '656-103-1571'})
            </a>
          </div>
        </div>

        <div className={styles.dellContainer}>
          {/* Eyebrow Header */}
          <div className={styles.dellEyebrowBlock}>
            <h1 className={styles.dellEyebrowTitle}>
              {data.hero?.headline || data.heroTitle || `PROPUESTA PARA ${data.clientName?.toUpperCase()}`}
            </h1>
            <span className={styles.dellYellowSticker} style={{ fontSize: '12px', padding: '4px 10px' }}>
              FASE PILOTO
            </span>
          </div>

          {/* Hero Section with Infinite Ken Burns Zoom + Client Logo Box */}
          <div className={styles.dellHeroSection}>
            {data.hero?.backgroundImage && (
              <motion.div 
                initial={{ scale: 1.0 }}
                animate={{ scale: [1.0, 1.12, 1.0] }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={styles.dellHeroBgZoom}
                style={{
                  backgroundImage: `url(${data.hero.backgroundImage})`,
                  transformOrigin: 'center center',
                }}
              />
            )}
            <div className={styles.dellHeroOverlay} />
            
            <div className={styles.dellHeroContent}>
              <div className={styles.dellHeroLeft}>
                <div style={{ display: 'inline-block', backgroundColor: '#0d1a14', border: '1px solid #0A8244', color: '#34D399', padding: '4px 10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '14px', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  ★ INFRAESTRUCTURA PROPIETARIA
                </div>
                <h2 style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '22px', fontWeight: 800, margin: '0 0 14px 0', textTransform: 'uppercase', color: '#ffffff', lineHeight: 1.25, textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}>
                  {data.hero?.subheadline || data.heroText}
                </h2>
                {data.storytelling?.challenge && (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14.5px', lineHeight: 1.6, color: '#cbd5e1', margin: '0 0 20px 0', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                    {data.storytelling.challenge}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a href="#propuesta-economica" className={styles.dellButtonPrimary}>
                    VER PROPUESTA ECONÓMICA →
                  </a>
                  <a href={`https://wa.me/${data.contact?.phone || '526561031571'}?text=${encodeURIComponent(getWhatsAppMessage())}`} className={styles.dellButtonSecondary} target="_blank" rel="noopener noreferrer">
                    CONTACTAR ASESOR
                  </a>
                </div>
              </div>

              {/* Client Logo Card */}
              <div className={styles.dellHeroRight}>
                <div className={styles.dellHeroLogoCard}>
                  {data.clientLogo && (
                    <Image 
                      src={data.clientLogo} 
                      alt={data.clientName} 
                      width={220} 
                      height={90} 
                      className={styles.dellHeroLogoImg}
                      priority
                    />
                  )}
                  <div className={styles.dellHeroLogoBadge}>
                    <span className={styles.dellStatusDot}></span>
                    <span>PLATAFORMA OFICIAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Justification Box (Reutilizable Infrastructure) */}
          {data.storytelling?.justification && (
            <div className={styles.dellRibbonCard} style={{ marginBottom: '36px' }}>
              <div className={styles.dellRibbonTitle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#34D399' }}>●</span>
                  <span>{data.storytelling.justification.title}</span>
                </div>
                <span className={styles.dellYellowSticker}>INFRAESTRUCTURA REUTILIZABLE</span>
              </div>
              <div className={styles.dellRibbonBody} style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'rgba(10, 130, 68, 0.05)' }}>
                <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#e2e8f0', lineHeight: 1.6 }}>{data.storytelling.justification.content}</p>
                {data.storytelling.justification.points && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', width: '100%' }}>
                    {data.storytelling.justification.points.map((pt, pIdx) => (
                      <div key={pIdx} style={{ backgroundColor: '#070c14', border: '1px solid rgba(10, 130, 68, 0.35)', padding: '14px 16px', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#fcc20f', marginBottom: '6px', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          PUNTO CLAVE 0{pIdx + 1}
                        </div>
                        <div style={{ fontSize: '13.5px', lineHeight: 1.5, color: '#cbd5e1' }} dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffffff;">$1</strong>') }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Storytelling Narrative Ribbon Cards */}
          {data.storytelling?.narrative && data.storytelling.narrative.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <div className={styles.dellEyebrowBlock}>
                <h2 className={styles.dellEyebrowTitle} style={{ fontSize: '20px' }}>
                  ARQUITECTURA DE EXPERIENCIA Y OPERACIÓN
                </h2>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>3 MÓDULOS INTEGRADOS</span>
              </div>

              {data.storytelling.narrative.map((item, nIdx) => (
                <div key={nIdx} className={styles.dellRibbonCard}>
                  <div className={styles.dellRibbonTitle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ backgroundColor: '#0A8244', color: '#fff', fontSize: '10px', padding: '2px 6px', fontWeight: 800 }}>
                        {narrativePills[nIdx] || `MOD-0${nIdx + 1}`}
                      </span>
                      <span>MÓDULO {nIdx + 1}: {item.title}</span>
                    </div>
                    <span className={styles.dellYellowSticker}>
                      {narrativeBadges[nIdx] || 'ESPECIFICACIÓN OFICIAL'}
                    </span>
                  </div>
                  <div className={styles.dellRibbonBody}>
                    <div className={styles.dellRibbonText}>
                      <p style={{ margin: 0, fontSize: '15px', color: '#cbd5e1', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>
                    {item.image && (
                      <div className={styles.dellRibbonImageContainer}>
                        <motion.div
                          initial={{ scale: 1.0 }}
                          animate={{ scale: [1.0, 1.10, 1.0] }}
                          transition={{
                            duration: 14 + nIdx * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{ width: '100%', height: '100%', transformOrigin: 'center center' }}
                        >
                          <Image 
                            src={item.image} 
                            alt={item.title} 
                            width={360} 
                            height={270} 
                            className={styles.dellRibbonImage}
                          />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pricing & Package Section */}
          <div id="propuesta-economica" style={{ marginTop: '44px' }}>
            <div className={styles.dellEyebrowBlock}>
              <h2 className={styles.dellEyebrowTitle} style={{ fontSize: '20px' }}>
                {data.packages?.title?.toUpperCase() || 'PROPUESTA ECONÓMICA (FASE PILOTO)'}
              </h2>
              <span className={styles.dellYellowSticker}>LLAVE EN MANO</span>
            </div>
            
            {data.packages?.subtitle && (
              <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: '0 0 16px 0' }}>
                {data.packages.subtitle}
              </p>
            )}

            {data.packages?.blocks && data.packages.blocks.map((block, bIdx) => (
              <div key={bIdx} className={styles.dellRibbonCard}>
                <div className={styles.dellRibbonTitle} style={{ backgroundColor: '#070c14' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#fcc20f' }}>★</span>
                    <span>{block.name?.toUpperCase()}</span>
                  </div>
                  <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 800 }}>PUESTA EN MARCHA 30 DÍAS</span>
                </div>
                <div className={styles.dellRibbonBody} style={{ flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#05080e' }}>
                  {block.services.map((service, sIdx) => (
                    <div key={sIdx} style={{ width: '100%' }}>
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '17px', fontWeight: 800, margin: '0 0 10px 0', textTransform: 'uppercase', color: '#ffffff' }}>
                        {service.name}
                      </h3>
                      {service.description && (
                        <p style={{ margin: '0 0 14px 0', fontSize: '14.5px', color: '#cbd5e1' }}>
                          {service.description}
                        </p>
                      )}
                      {service.bullets && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px', marginTop: '12px' }}>
                          {service.bullets.map((bullet, buIdx) => (
                            <div key={buIdx} style={{ backgroundColor: '#080d16', border: '1px solid rgba(10, 130, 68, 0.3)', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <span style={{ color: '#34D399', fontWeight: 800 }}>✔</span>
                              <span style={{ fontSize: '13.5px', lineHeight: 1.4, color: '#e2e8f0' }}>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Red / Emerald High-Impact Investment Box */}
            <div className={styles.dellCtaBlockRed}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#fcc20f', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    INVERSIÓN TOTAL DE DESARROLLO Y CONFIGURACIÓN
                  </div>
                  <h3 className={styles.dellCtaTitle}>
                    {formatPrice(total)} <span style={{ fontSize: '16px', fontWeight: 400, color: '#cbd5e1' }}>(+ IVA)</span>
                  </h3>
                </div>
                <div style={{ backgroundColor: '#070c14', border: '1px solid #0A8244', padding: '8px 16px', textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Total con IVA Incluido (16%)</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#34D399', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    {formatPrice(total * 1.16)}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '14px', margin: '0 0 20px 0', color: '#cbd5e1', lineHeight: 1.5 }}>
                {data.packages?.methodologyText || "Propuesta aprobable de inmediato con confirmación vía WhatsApp."}
              </p>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <a 
                  href={`https://wa.me/${data.contact?.phone || '526561031571'}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                  className={styles.dellButtonPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  APROBAR PROPUESTA VÍA WHATSAPP →
                </a>
                <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                  Tiempo de respuesta: Inmediato · Vigencia: 30 días
                </span>
              </div>
            </div>
          </div>

          {/* Footer Band */}
          <footer className={styles.dellFooterBand}>
            <div className={styles.dellFooterNav}>
              <span>[ 🔍 ESPECIFICACIÓN TÉCNICA ]</span>
              <span>[ 📱 FLUJO QR ]</span>
              <span>[ 🏢 GESTIÓN DE SORTEOS ]</span>
              <span>[ 🛠️ SOPORTE APOLOGRAMA ]</span>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <a href="#" className={styles.dellClassicLink}>Términos de Servicio</a> · <a href="#" className={styles.dellClassicLink}>Soporte Apolograma</a> · <a href="#" className={styles.dellClassicLink}>Privacidad</a> · <a href={`tel:${data.contact?.phone || '526561031571'}`} className={styles.dellClassicLink}>Línea Directa 656-103-1571</a>
            </div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>
              © 2026 Apolograma / {data.clientName}. Todos los derechos reservados. Infraestructura desarrollada exclusivamente para Superette.
            </div>
          </footer>
        </div>
      </div>
    );
  }

  const isDoctorAura = data.themeTemplate === 'doctor-aura' || data.clientName?.toLowerCase().includes('elmo') || data.clientName?.toLowerCase().includes('aramburo');

  if (isDoctorAura) {
    const [billingOption, setBillingOption] = useState<'annual' | 'monthly'>('annual');

    const annualPrice = 120000;
    const monthlyPrice = 12000;
    const annualMonthlyEquiv = 10000;
    const annualSavings = 24000; // $144,000 - $120,000
    const annualSavingsPercent = 16.7;

    const currentPrice = billingOption === 'annual' ? annualPrice : monthlyPrice;
    const currentPriceWithIva = currentPrice * 1.16;

    const waMsg = billingOption === 'annual'
      ? '¡Hola Emmanuel! Revisamos la propuesta de Marketing Médico con IA para el Dr. Elmo Aramburo y nos interesa el Plan Anual ($120,000 MXN con 16.7% de descuento). ¿Cuáles son los siguientes pasos?'
      : '¡Hola Emmanuel! Revisamos la propuesta de Marketing Médico con IA para el Dr. Elmo Aramburo y nos interesa el Plan Mensual ($12,000 MXN/mes). ¿Cuáles son los siguientes pasos?';

    const waUrl = `https://wa.me/${data.contact?.phone || '526561031571'}?text=${encodeURIComponent(waMsg)}`;

    return (
      <div className={styles.docFrame}>
        {/* Ambient Medical Bio-Tech Aura Spheres */}
        <div className={styles.docAuraBgLayer}>
          <div className={`${styles.docOrb} ${styles.docOrbTeal}`} />
          <div className={`${styles.docOrb} ${styles.docOrbNavy}`} />
          <div className={`${styles.docOrb} ${styles.docOrbEmerald}`} />
        </div>

        <div className={styles.docContainer}>
          {/* Top Status Banner */}
          <div className={styles.docTopBanner}>
            <div className={styles.docBadgeLive}>
              <span className={styles.docStatusDot}></span>
              <span>DR. ELMO ARAMBURO · CIRUGÍA BARIÁTRICA & METABÓLICA · STAR MÉDICA</span>
            </div>
            <div className={styles.docTaglinePill}>
              ✨ Marketing Médico & Generación Visual con IA · Propuesta Exclusiva
            </div>
          </div>

          {/* Agency Navigation Header */}
          <header className={styles.docAgencyNav}>
            <div className={styles.docAgencyLogos}>
              <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={220} height={18} className={styles.docAgencyLogoApolograma} priority />
              <span className={styles.docCrossSeparator}>×</span>
              <Image src="/assets/fn1-logo-purple.png" alt="Frontera Número Uno" width={230} height={24} className={styles.docAgencyLogoFn1} priority />
            </div>
            <div className={styles.docClientLogoPill}>
              <Image src={data.clientLogo || '/assets/dr-elmo-aramburo/doctor-portrait.jpg'} alt="Dr. Elmo Aramburo" width={28} height={28} className={styles.docClientAvatar} />
              <span className={styles.docClientPillText}>DR. ELMO ARAMBURO</span>
            </div>
          </header>

          {/* Hero Section (2 Columns) */}
          <section className={styles.docHeroCard}>
            <div className={styles.docHeroContent}>
              <div className={styles.docEyebrowBadge}>
                <span>🩺 MARKETING DIGITAL & IA GENERATIVA · STAR MÉDICA</span>
              </div>
              <h1 className={styles.docHeroTitle}>
                Autoridad Médica <span className={styles.docEditorialSerif}>y Pacientes</span> con <span className={styles.docEditorialSerif}>Inteligencia Artificial</span>
              </h1>
              <p className={styles.docHeroSubtitle}>
                Estrategia de comunicación y crecimiento mensual: <strong>20 diseños educativos para Feed</strong>, <strong>20 adaptaciones verticales a Stories (9:16)</strong> y <strong>1 Reel mensual</strong>. Creación visual generada con los modelos de IA más potentes del mercado, supervisados y perfeccionados por directores de arte de Apolograma.
              </p>

              <div className={styles.docHeroActions}>
                <a href="#propuesta-economica" className={styles.docBtnPrimary}>
                  <span>VER OPCIONES DE INVERSIÓN</span>
                  <span>↓</span>
                </a>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.docBtnSecondary}>
                  <span>📱 CONTACTAR POR WHATSAPP</span>
                </a>
              </div>

              <div className={styles.docTrustBadges}>
                <div className={styles.docTrustBadgeItem}>
                  <span>🤖</span>
                  <span>Modelos de IA de Última Generación</span>
                </div>
                <div className={styles.docTrustBadgeItem}>
                  <span>🎨</span>
                  <span>20 Diseños + 20 Stories</span>
                </div>
                <div className={styles.docTrustBadgeItem}>
                  <span>🎬</span>
                  <span>1 Reel Mensual</span>
                </div>
                <div className={styles.docTrustBadgeItem}>
                  <span>🏥</span>
                  <span>Star Médica Juárez</span>
                </div>
              </div>
            </div>

            <div className={styles.docHeroVisual}>
              <div className={styles.docVisualWrapper}>
                <img src="/assets/dr-elmo-aramburo/doctor-portrait.jpg" alt="Dr. Elmo Aramburo" />
                <div className={styles.docFloatingBadgeTop}>
                  <span>👨‍⚕️</span>
                  <span>DR. ELMO ARAMBURO</span>
                </div>
                <div className={styles.docFloatingBadgeBottom}>
                  <div className={styles.docBadgeTitle}>Cirugía Bariátrica & Laparoscópica</div>
                  <div className={styles.docBadgeSubtitle}>Hospital Star Médica · Ciudad Juárez, Chih.</div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Pillars Section */}
          <section className={styles.docSection}>
            <div className={styles.docSectionHeader}>
              <div className={styles.docPillarBadge}>ESTRATEGIA MENSUAL DE CONTENIDOS</div>
              <h2 className={styles.docSectionTitle}>
                Los 4 Pilares del <span className={styles.docEditorialSerif}>Ecosistema de Marketing</span>
              </h2>
              <p className={styles.docSectionSubtext}>
                Un sistema integral diseñado para educar a pacientes sobre salud metabólica, desmitificar la cirugía bariátrica y generar consultas de valoración continuas:
              </p>
            </div>

            <div className={styles.docPillarsGrid}>
              <div className={styles.docPillarCard}>
                <div className={styles.docPillarCover}>
                  <img src="/assets/dr-elmo-aramburo/pillar-1-feed.jpg" alt="20 Diseños para Feed con IA" className={styles.docPillarCoverImg} />
                  <div className={styles.docPillarFormatBadge}>📐 4:5 FEED</div>
                </div>
                <div className={styles.docPillarNum}>PILAR 01</div>
                <h3 className={styles.docPillarTitle}>20 Diseños para Feed con IA Generativa</h3>
                <p className={styles.docPillarDesc}>
                  Infografías médicas fotorrealistas sobre manga gástrica, bypass, nutrición y derribo de mitos. Imágenes generadas con modelos de IA médica y retocadas por diseñadores.
                </p>
                <div className={styles.docPillarTag}>Formato 4:5 · 20 Posts/mes</div>
              </div>

              <div className={styles.docPillarCard}>
                <div className={styles.docPillarCover}>
                  <img src="/assets/dr-elmo-aramburo/pillar-2-stories.jpg" alt="20 Adaptaciones a Stories" className={styles.docPillarCoverImg} />
                  <div className={styles.docPillarFormatBadge}>📱 9:16 STORY</div>
                </div>
                <div className={styles.docPillarNum}>PILAR 02</div>
                <h3 className={styles.docPillarTitle}>20 Adaptaciones a Stories (9:16)</h3>
                <p className={styles.docPillarDesc}>
                  Contenido vertical diario con encuestas de síntomas, cajas de preguntas frecuentes, testimonios y botones directos para agendar valoración por WhatsApp.
                </p>
                <div className={styles.docPillarTag}>Formato 9:16 · 20 Stories/mes</div>
              </div>

              <div className={styles.docPillarCard}>
                <div className={styles.docPillarCover}>
                  <img src="/assets/dr-elmo-aramburo/pillar-3-reels.jpg" alt="1 Reel Mensual de Alta Retención" className={styles.docPillarCoverImg} />
                  <div className={styles.docPillarFormatBadge}>🎬 4K REEL</div>
                </div>
                <div className={styles.docPillarNum}>PILAR 03</div>
                <h3 className={styles.docPillarTitle}>1 Reel Mensual de Alta Retención</h3>
                <p className={styles.docPillarDesc}>
                  Producción y edición dinámica de video en formato corto para Instagram Reels, TikTok y YouTube Shorts, con tomas en Star Médica y subtítulos animados.
                </p>
                <div className={styles.docPillarTag}>Video 9:16 · 1 Reel/mes</div>
              </div>

              <div className={`${styles.docPillarCard} ${styles.docPillarCardFeatured}`}>
                <div className={styles.docPillarCover}>
                  <img src="/assets/dr-elmo-aramburo/pillar-4-ai.jpg" alt="Modelos de IA Supervisados" className={styles.docPillarCoverImg} />
                  <div className={styles.docPillarFormatBadge} style={{ background: 'rgba(13, 148, 136, 0.85)', color: '#FFFFFF' }}>🧬 AI-CORE 100%</div>
                </div>
                <div className={styles.docPillarNum} style={{ color: '#0D9488' }}>PILAR 04</div>
                <h3 className={styles.docPillarTitle}>Modelos de IA Supervisados</h3>
                <p className={styles.docPillarDesc}>
                  Uso de los modelos generativos más potentes (Midjourney v6, GPT Image, Flux) guiados por directores de arte para una estética médica exclusiva sin fotos de stock.
                </p>
                <div className={styles.docPillarTag} style={{ background: '#0D9488', color: '#FFFFFF' }}>Supervisión 100% Humana</div>
              </div>
            </div>

            {/* Crucial AI Clause Callout Box */}
            <div className={styles.docAiClauseCard}>
              <div className={styles.docAiClauseHeader}>
                <div className={styles.docAiBadge}>🧬 CLÁUSULA TECNOLÓGICA CLAVE</div>
                <h3 className={styles.docAiClauseTitle}>Metodología de Creación con Inteligencia Artificial</h3>
              </div>
              <p className={styles.docAiClauseText}>
                Todos los diseños, composiciones y adaptaciones visuales se desarrollan utilizando los <strong>modelos de Inteligencia Artificial generativa más potentes y avanzados de la industria</strong>, siendo rigurosamente <strong>supervisados, dirigidos y perfeccionados por el equipo de diseño y dirección de arte de Apolograma</strong>. Esto nos permite entregar fotorrealismo clínico impecable, precisión anatómica y una identidad médica vanguardista sin recurrir a bancos de imágenes genéricos.
              </p>
              <div className={styles.docAiFeaturesGrid}>
                <div className={styles.docAiFeatureItem}>
                  <span className={styles.docAiFeatureIcon}>✓</span>
                  <span className={styles.docAiFeatureText}>Modelos generativos de última generación (Midjourney v6, GPT Image, Flux).</span>
                </div>
                <div className={styles.docAiFeatureItem}>
                  <span className={styles.docAiFeatureIcon}>✓</span>
                  <span className={styles.docAiFeatureText}>Supervisión clínica, tipografía y retoque por diseñadores profesionales.</span>
                </div>
                <div className={styles.docAiFeatureItem}>
                  <span className={styles.docAiFeatureIcon}>✓</span>
                  <span className={styles.docAiFeatureText}>Propiedad intelectual y cesión de derechos 100% exclusiva para el doctor.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section with Annual vs Monthly Toggle */}
          <section id="propuesta-economica" className={styles.docPricingSection}>
            <div className={styles.docSectionHeader}>
              <div className={styles.docPillarBadge}>OPCIONES DE CONTRATACIÓN</div>
              <h2 className={styles.docSectionTitle}>
                Propuesta Económica <span className={styles.docEditorialSerif}>Transparente</span>
              </h2>
              <p className={styles.docSectionSubtext}>
                Selecciona la modalidad de pago que mejor se adapte al flujo y planeación del consultorio:
              </p>
            </div>

            {/* Interactive Billing Selector Toggle */}
            <div className={styles.docBillingToggleWrapper}>
              <div className={styles.docBillingToggleBox}>
                <button
                  onClick={() => setBillingOption('annual')}
                  className={`${styles.docBillingToggleBtn} ${billingOption === 'annual' ? styles.docBillingToggleBtnActive : ''}`}
                >
                  <span>⭐ PAGO ANUAL ANTICIPADO</span>
                  <span className={styles.docDiscountPill}>16.7% OFF</span>
                </button>
                <button
                  onClick={() => setBillingOption('monthly')}
                  className={`${styles.docBillingToggleBtn} ${billingOption === 'monthly' ? styles.docBillingToggleBtnActive : ''}`}
                >
                  <span>📅 PAGO MENSUAL RECURRENTE</span>
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className={styles.docPricingGrid}>
              {/* Option 1: Annual Plan (Featured) */}
              <div
                onClick={() => setBillingOption('annual')}
                className={`${styles.docPriceCard} ${styles.docPriceCardFeatured} ${billingOption === 'annual' ? styles.docPriceCardSelected : ''}`}
              >
                <div className={styles.docFeaturedRibbon}>
                  ⭐ MEJOR VALOR · RECOMENDADO
                </div>

                <div className={styles.docPriceHeader}>
                  <div>
                    <h3 className={styles.docPricePlanName}>Plan Anual Anticipado</h3>
                    <p className={styles.docPricePlanDesc}>Cobertura total de 12 meses de marketing médico continuo</p>
                  </div>
                  <div className={`${styles.docCustomRadio} ${billingOption === 'annual' ? styles.docCustomRadioChecked : ''}`}>
                    {billingOption === 'annual' && '✓'}
                  </div>
                </div>

                <div className={styles.docPriceAmountBox}>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span className={styles.docPriceNumber}>{formatPrice(annualPrice)}</span>
                    <span className={styles.docPricePeriod}>+ IVA / año</span>
                  </div>
                  <div className={styles.docPriceMonthlyEquiv}>
                    <span>⚡ Equivalente a:</span>
                    <strong>{formatPrice(annualMonthlyEquiv)} / mes</strong>
                  </div>
                  <div className={styles.docSavingsBadge}>
                    <span>🔥</span>
                    <span>Ahorro de $24,000.00 MXN al año ({annualSavingsPercent}% de Descuento)</span>
                  </div>
                </div>

                <div className={styles.docDeliverablesList}>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>20 Diseños Mensuales para Feed</strong> (Infografías médicas, salud metabólica, mitos y recetas).</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>20 Adaptaciones a Stories (9:16)</strong> optimizadas con llamados a agendar cita.</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>1 Reel Mensual</strong> Producido y Editado con subtítulos animados de alta retención.</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>Creación Visual con Modelos de IA</strong> generativa de última generación.</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>Supervisión y Retoque por Diseñadores</strong> profesionales de Apolograma.</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>Parrillas Quincenales</strong> de contenido para revisión y aprobación previa del doctor.</span>
                  </div>
                </div>

                <button className={styles.docBtnPrimary} style={{ width: '100%', justifyContent: 'center' }}>
                  <span>{billingOption === 'annual' ? 'OPCIÓN SELECCIONADA ✓' : 'SELECCIONAR PLAN ANUAL'}</span>
                </button>
              </div>

              {/* Option 2: Monthly Plan */}
              <div
                onClick={() => setBillingOption('monthly')}
                className={`${styles.docPriceCard} ${billingOption === 'monthly' ? styles.docPriceCardSelected : ''}`}
              >
                <div className={styles.docPriceHeader}>
                  <div>
                    <h3 className={styles.docPricePlanName}>Plan Mensual Recurrente</h3>
                    <p className={styles.docPricePlanDesc}>Flexibilidad mes a mes sin compromiso forzoso anual</p>
                  </div>
                  <div className={`${styles.docCustomRadio} ${billingOption === 'monthly' ? styles.docCustomRadioChecked : ''}`}>
                    {billingOption === 'monthly' && '✓'}
                  </div>
                </div>

                <div className={styles.docPriceAmountBox}>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span className={styles.docPriceNumber}>{formatPrice(monthlyPrice)}</span>
                    <span className={styles.docPricePeriod}>+ IVA / mes</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
                    Facturación recurrente mensual con CFDI
                  </div>
                </div>

                <div className={styles.docDeliverablesList}>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>20 Diseños Mensuales para Feed</strong> (Infografías médicas, salud metabólica, mitos y recetas).</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>20 Adaptaciones a Stories (9:16)</strong> optimizadas con llamados a agendar cita.</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>1 Reel Mensual</strong> Producido y Editado con subtítulos animados de alta retención.</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>Creación Visual con Modelos de IA</strong> generativa de última generación.</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>Supervisión y Retoque por Diseñadores</strong> profesionales de Apolograma.</span>
                  </div>
                  <div className={styles.docDeliverableItem}>
                    <span className={styles.docCheckIcon}>✓</span>
                    <span><strong>Flexibilidad</strong> de pago mes con mes sin plazos forzosos.</span>
                  </div>
                </div>

                <button className={styles.docBtnSecondary} style={{ width: '100%', justifyContent: 'center' }}>
                  <span>{billingOption === 'monthly' ? 'OPCIÓN SELECCIONADA ✓' : 'SELECCIONAR PLAN MENSUAL'}</span>
                </button>
              </div>
            </div>

            {/* Transparency Cards */}
            <div className={styles.docTermsGrid}>
              <div className={styles.docTermCard}>
                <div className={styles.docTermIconBubble}>🧬</div>
                <h4 className={styles.docTermTitle}>Supervisión de IA Humana</h4>
                <p className={styles.docTermText}>
                  Toda pieza visual es generada con los modelos más potentes de IA y perfeccionada manualmente por diseñadores.
                </p>
              </div>

              <div className={styles.docTermCard}>
                <div className={styles.docTermIconBubble}>📅</div>
                <h4 className={styles.docTermTitle}>Calendarios Quincenales</h4>
                <p className={styles.docTermText}>
                  Entregas organizadas con anticipación para revisión, retroalimentación y aprobación previa del Dr. Elmo Aramburo.
                </p>
              </div>

              <div className={styles.docTermCard}>
                <div className={styles.docTermIconBubble}>🛡️</div>
                <h4 className={styles.docTermTitle}>Derechos 100% Exclusivos</h4>
                <p className={styles.docTermText}>
                  Todos los artes, composiciones gráficas y videos son propiedad intelectual exclusiva de la marca del doctor.
                </p>
              </div>

              <div className={styles.docTermCard}>
                <div className={styles.docTermIconBubble}>🧾</div>
                <h4 className={styles.docTermTitle}>Facturación Fiscal (CFDI)</h4>
                <p className={styles.docTermText}>
                  Emisión formal de facturas fiscales deducibles al 100% como gastos de publicidad y mercadotecnia médica.
                </p>
              </div>
            </div>

            {/* Summary Box & WhatsApp Call to Action */}
            <div className={styles.docSummaryBox}>
              <div className={styles.docSummaryLeft}>
                <div className={styles.docSummaryBadge}>📋 RESUMEN DE MODALIDAD SELECCIONADA</div>
                <h3 className={styles.docSummaryTitle}>
                  {billingOption === 'annual' ? 'Plan Anual con 16.7% de Descuento' : 'Plan Mensual Recurrente'}
                </h3>
                <p className={styles.docSummaryDesc}>
                  {billingOption === 'annual'
                    ? 'Pago anual anticipado de $120,000 MXN (+ IVA). Incluye 240 diseños para Feed, 240 Stories y 12 Reels durante el año, ahorrando $24,000 MXN frente al esquema mensual.'
                    : 'Pago mensual de $12,000 MXN (+ IVA). Incluye 20 diseños para Feed, 20 Stories y 1 Reel mensual, con renovación y flexibilidad mes a mes.'}
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', color: '#5EEAD4' }}>✓ 20 Diseños Feed/mes</span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', color: '#5EEAD4' }}>✓ 20 Stories/mes</span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', color: '#5EEAD4' }}>✓ 1 Reel Mensual</span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', color: '#5EEAD4' }}>✓ IA Supervisada</span>
                </div>
              </div>

              <div className={styles.docSummaryRight}>
                <div>
                  <div className={styles.docSummaryTotalLabel}>INVERSIÓN TOTAL {billingOption === 'annual' ? 'ANUAL' : 'MENSUAL'}</div>
                  <div className={styles.docSummaryTotalValue}>{formatPrice(currentPrice)}</div>
                  <div className={styles.docSummaryTotalSub}>
                    Total con I.V.A. (16%): <strong>{formatPrice(currentPriceWithIva)}</strong>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.docWhatsAppBtn}
                >
                  <span>📱 APROBAR PLAN POR WHATSAPP</span>
                </a>
              </div>
            </div>
          </section>

          {/* Minimalist Medical Brand Footer */}
          <footer className={styles.docFooter}>
            <div className={styles.docFooterLinks}>
              <a href="#">Términos de Servicio</a>
              <span>·</span>
              <a href="#">Apolograma Medical Growth</a>
              <span>·</span>
              <a href="#">Frontera Número Uno</a>
              <span>·</span>
              <a href={`tel:${data.contact?.phone || '526561031571'}`}>Contacto Directo: 656-103-1571</a>
            </div>
            <p style={{ margin: 0, opacity: 0.7 }}>
              © 2026 Apolograma & Frontera Número Uno. Estrategia desarrollada exclusivamente para el Dr. Elmo Aramburo (Star Médica Juárez).
            </p>
          </footer>

          {/* Mobile Sticky Conversion Floating Bar */}
          <div className={styles.docStickyBottomBar}>
            <div className={styles.docStickyBarLeft}>
              <div className={styles.docStickyPlanName}>
                {billingOption === 'annual' ? 'Plan Anual · 16.7% OFF' : 'Plan Mensual'}
              </div>
              <div className={styles.docStickyPlanPrice}>
                {formatPrice(currentPrice)} <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>+ IVA</span>
              </div>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.docStickyWaBtn}>
              <span>💬 APROBAR POR WHATSAPP</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isKodiAura = data.themeTemplate === 'kodi-aura' || data.theme?.name?.toLowerCase().includes('kodi') || data.theme?.name?.toLowerCase().includes('aura');

  if (isKodiAura) {
    const circadianData = {
      rise: {
        name: 'RISE',
        time: '06:00 - 10:00',
        title: 'Inicios y Despertar',
        color: '#EF5126',
        gradient: 'radial-gradient(circle, #EF5126 0%, #FFA843 70%, transparent 100%)',
        chat: '🌅 Diagnóstico IA: Para optimizar tu curva de cortisol matutina y activar tu energía celular sin taquicardia ni picos de cafeína, tu fórmula ideal es el concentrado Green Start™ (Dose 05). ¿Programamos tu entrega mensual automatizada con 15% OFF?',
        product: 'Green Start™ Concentrado en Polvo (400 g)',
        tag: 'Energía Limpia & Digestión',
        dose: 'Dose 05 · Polvo Micronizado'
      },
      focus: {
        name: 'FOCUS',
        time: '10:00 - 16:00',
        title: 'Energía y Activación',
        color: '#D51B3A',
        gradient: 'radial-gradient(circle, #D51B3A 0%, #FF85A1 70%, transparent 100%)',
        chat: '⚡ Diagnóstico IA: Para tus bloques de alta demanda cognitiva en el trabajo y entrenamientos de alta intensidad, prescribimos Focus Blend Nootrópico. Claridad mental y neuroprotección sostenida.',
        product: 'Focus Blend Nootrópico Activo',
        tag: 'Cognición & Rendimiento',
        dose: 'Dose 03 · 60 Cápsulas'
      },
      balance: {
        name: 'BALANCE',
        time: '16:00 - 20:00',
        title: 'Equilibrio y Bienestar',
        color: '#073B3A',
        gradient: 'radial-gradient(circle, #073B3A 0%, #74D7B8 70%, transparent 100%)',
        chat: '🌿 Diagnóstico IA: Para mantener la homeostasis de tu organismo y cubrir tus requerimientos de micronutrientes diarios, tu dosis base obligatoria es el Multivitamínico Daily Balance™ (Dose 01). Cápsulas veganas de máxima absorción.',
        product: 'Daily Balance™ Multivitamínico (Dose 01)',
        tag: 'Nutrición Celular & Homeostasis',
        dose: 'Dose 01 · 60 Cápsulas Veganas'
      },
      unwind: {
        name: 'UNWIND',
        time: '20:00 - 02:00',
        title: 'Relajación y Descanso',
        color: '#23155B',
        gradient: 'radial-gradient(circle, #23155B 0%, #B8A7EA 70%, transparent 100%)',
        chat: '🌙 Diagnóstico IA: Para inducir la secreción natural de melatonina y alcanzar fases profundas de sueño REM reparador, tu dosis nocturna es Restorative Rest™ Calma. Despierta renovado y sin somnolencia residual.',
        product: 'Restorative Rest™ Al Alma Calma',
        tag: 'Sueño Reparador & Descompresión',
        dose: 'Dose 04 · 60 Cápsulas'
      }
    };

    const currentCircadian = circadianData[circadianState];
    const totalWithIva = total * 1.16;

    return (
      <div className={styles.kodiFrame}>
        {/* Background Aura Spheres */}
        <div className={styles.kodiAuraBgLayer}>
          <div className={`${styles.kodiOrb} ${styles.kodiOrbOrange}`} />
          <div className={`${styles.kodiOrb} ${styles.kodiOrbPurple}`} />
          <div className={`${styles.kodiOrb} ${styles.kodiOrbGreen}`} />
        </div>

        <div className={styles.kodiContainer}>
          {/* Top Status Banner */}
          <div className={styles.kodiTopBanner}>
            <div className={styles.kodiBadgeLive}>
              <span className={styles.kodiStatusDot}></span>
              <span>KODI DOSE™ · ECOSISTEMA DIGITAL & META ADS</span>
            </div>
            <div className={styles.kodiTaglinePill}>
              ✨ Nutre tu brillo interior · Propuesta Exclusiva
            </div>
          </div>

          {/* Agency Navigation Header */}
          <header className={styles.kodiAgencyNav}>
            <div className={styles.kodiAgencyLogos}>
              <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={160} height={32} className={styles.apologramaLogoImageLight} />
              <span style={{ opacity: 0.3, color: '#160B3F' }}>×</span>
              <Image src="/assets/fn1-logo-purple.png" alt="Frontera Número Uno" width={180} height={26} />
            </div>
            <div className={styles.kodiClientLogoPill}>
              {data.clientLogo && <Image src={data.clientLogo} alt={data.clientName || 'Kodi dose'} width={110} height={26} />}
            </div>
          </header>

          {/* Hero Section */}
          <section className={styles.kodiHeroCard}>
            <div className={styles.kodiHeroContent}>
              <div className={styles.kodiEyebrowBadge}>
                <span>🧬 BIENESTAR CIRCADIANO · NEXT.JS + STRIPE + META ADS</span>
              </div>
              <h1 className={styles.kodiHeroTitle}>
                Ciencia <span className={styles.kodiEditorialSerif}>Clara,</span> Bienestar <span className={styles.kodiEditorialSerif}>Real</span>
              </h1>
              <p className={styles.kodiHeroSubtitle}>
                {data.hero?.subheadline || data.heroText}
              </p>
              <div className={styles.kodiHeroActions}>
                <a href="#propuesta-economica" className={styles.kodiButtonPrimary}>
                  <span>VER PROPUESTA ECONÓMICA</span>
                  <span>↓</span>
                </a>
                <a href={`https://wa.me/${data.contact?.phone || '526561031571'}?text=${encodeURIComponent(getWhatsAppMessage())}`} target="_blank" rel="noopener noreferrer" className={styles.kodiButtonSecondary}>
                  <span>📱 CONTACTAR POR WHATSAPP</span>
                </a>
              </div>
              <div className={styles.kodiHeroTrustBadges}>
                <span>⚡ Next.js + Vercel</span>
                <span>•</span>
                <span>💳 Stripe Billing</span>
                <span>•</span>
                <span>🤖 Chatbot IA</span>
              </div>
            </div>

            <div className={styles.kodiHeroVisualArea}>
              <div className={styles.kodiHeroVisualCard}>
                <motion.div
                  initial={{ scale: 1.0 }}
                  animate={{ scale: [1.0, 1.06, 1.0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${data.hero?.backgroundImage || '/assets/kodi-dose/hero-bg.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className={styles.kodiHeroVisualTag}>
                  <span>KODI DOSE™ · BIO-TECH</span>
                </div>
              </div>
            </div>
          </section>

          {/* Strategic Narrative / Circadian System */}
          <section style={{ marginBottom: '48px' }}>
            <h2 className={styles.kodiSectionTitle}>
              El Sistema Biológico: <span className={styles.kodiEditorialSerif}>Ritmo Circadiano</span>
            </h2>
            <p className={styles.kodiSectionSubtext}>
              Kodi dose™ acompaña la fisiología del cuerpo a lo largo de las 24 horas. Cuatro estados accionables sincronizados con luz, energía y descanso:
            </p>

            <div className={styles.kodiCircadianGrid}>
              <div className={styles.kodiCircadianCard}>
                <div className={styles.kodiCircadianOrbPreview} style={{ background: 'radial-gradient(circle, #EF5126 0%, #FFA843 70%, transparent 100%)' }} />
                <div className={styles.kodiCircadianPillarName}>Rise</div>
                <div className={styles.kodiCircadianPillarTime}>06:00 - 10:00</div>
                <p className={styles.kodiCircadianPillarDesc}>Inicios y Despertar. Activación matutina y energía celular limpia.</p>
              </div>

              <div className={styles.kodiCircadianCard}>
                <div className={styles.kodiCircadianOrbPreview} style={{ background: 'radial-gradient(circle, #D51B3A 0%, #FF85A1 70%, transparent 100%)' }} />
                <div className={styles.kodiCircadianPillarName}>Focus</div>
                <div className={styles.kodiCircadianPillarTime}>10:00 - 16:00</div>
                <p className={styles.kodiCircadianPillarDesc}>Energía y Activación. Claridad cognitiva y neuroprotección sostenida.</p>
              </div>

              <div className={styles.kodiCircadianCard}>
                <div className={styles.kodiCircadianOrbPreview} style={{ background: 'radial-gradient(circle, #073B3A 0%, #74D7B8 70%, transparent 100%)' }} />
                <div className={styles.kodiCircadianPillarName}>Balance</div>
                <div className={styles.kodiCircadianPillarTime}>16:00 - 20:00</div>
                <p className={styles.kodiCircadianPillarDesc}>Equilibrio y Bienestar. Homeostasis, micronutrientes e inmunidad.</p>
              </div>

              <div className={styles.kodiCircadianCard}>
                <div className={styles.kodiCircadianOrbPreview} style={{ background: 'radial-gradient(circle, #23155B 0%, #B8A7EA 70%, transparent 100%)' }} />
                <div className={styles.kodiCircadianPillarName}>Unwind</div>
                <div className={styles.kodiCircadianPillarTime}>20:00 - 02:00</div>
                <p className={styles.kodiCircadianPillarDesc}>Relajación y Descanso. Secreción de melatonina y sueño REM profundo.</p>
              </div>
            </div>
          </section>

          {/* Interactive Demos: Circadian Quiz & Live Consultative Chatbot */}
          <section className={styles.kodiSimulatorContainer}>
            <div className={styles.kodiSimulatorHeader}>
              <div>
                <div className={styles.kodiPillarBadgeLive}>
                  <span className={styles.kodiLivePingDot} />
                  <span>SIMULADOR 100% OPERATIVO · PRUEBA EL FLUJO</span>
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#160B3F', margin: '6px 0 4px 0', letterSpacing: '-0.01em' }}>
                  Test Circadiano & <span className={styles.kodiEditorialSerif}>Asesor IA Consultivo</span>
                </h3>
                <p style={{ fontSize: '15px', color: '#5A5278', margin: 0, lineHeight: 1.5 }}>
                  Prueba la experiencia de usuario que convertirá visitas frías en suscriptores recurrentes:
                </p>
              </div>

              {/* Demo Switcher */}
              <div className={styles.kodiDemoSwitcher}>
                <button
                  type="button"
                  onClick={() => setKodiDemoMode('quiz')}
                  className={`${styles.kodiDemoSwitchBtn} ${kodiDemoMode === 'quiz' ? styles.kodiDemoSwitchBtnActive : ''}`}
                >
                  <span className={styles.kodiSwitchBtnIcon}>🧪</span>
                  <span>Test Circadiano (Minigame)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setKodiDemoMode('chat')}
                  className={`${styles.kodiDemoSwitchBtn} ${kodiDemoMode === 'chat' ? styles.kodiDemoSwitchBtnActive : ''}`}
                >
                  <span className={styles.kodiSwitchBtnIcon}>💬</span>
                  <span>Chatbot Vendedor IA</span>
                </button>
              </div>
            </div>

            {/* Interactive Callout Banner with Bounce */}
            <motion.div 
              className={styles.kodiInteractiveCallout}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className={styles.kodiCalloutLeft}>
                <span className={styles.kodiCalloutHandIcon}>⚡</span>
                <span><strong>Simulación en Vivo:</strong> {kodiDemoMode === 'quiz' ? 'Haz clic en una de las 4 opciones abajo para diagnosticar tu rutina:' : 'Escribe una duda de suplementación o haz clic en las sugerencias:'}</span>
              </div>
              <span className={styles.kodiCalloutPillBadge}>¡HAZ CLIC PARA PROBAR! 👇</span>
            </motion.div>

            {/* DEMO 1: QUIZ MINIGAME */}
            {kodiDemoMode === 'quiz' && (
              <div>
                {/* Progress bar and back button */}
                {quizStep < 4 && (
                  <div className={styles.kodiQuizProgressContainer}>
                    <div className={styles.kodiQuizProgressHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {quizStep > 1 && (
                          <button
                            type="button"
                            onClick={() => setQuizStep((prev) => Math.max(1, prev - 1))}
                            className={styles.kodiQuizBackBtn}
                          >
                            ← Anterior
                          </button>
                        )}
                        <span>Diagnóstico de Ritmo Biológico</span>
                      </div>
                      <span>Paso {quizStep} de 3 ({Math.round((quizStep / 3) * 100)}%)</span>
                    </div>
                    <div className={styles.kodiQuizProgressTrack}>
                      <div
                        className={styles.kodiQuizProgressBar}
                        style={{ width: `${(quizStep / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Step 1 */}
                {quizStep === 1 && (
                  <div>
                    <h4 className={styles.kodiQuizQuestionTitle}>1. ¿Cuál es tu principal objetivo biológico?</h4>
                    <p className={styles.kodiQuizQuestionSubtitle}>Selecciona la prioridad que deseas optimizar en tu rutina diaria:</p>
                    <div className={styles.kodiQuizOptionsGrid}>
                      {[
                        { icon: '🌅', title: 'Energía Limpia Matutina', desc: 'Despertar activo sin pesadez ni taquicardia por cafeína' },
                        { icon: '⚡', title: 'Claridad & Alto Enfoque', desc: 'Sostener concentración mental profunda durante el día' },
                        { icon: '🌿', title: 'Homeostasis & Longevidad', desc: 'Refuerzo de micronutrientes, salud digestiva e inmune' },
                        { icon: '🌙', title: 'Sueño REM & Descompresión', desc: 'Conciliar sueño rápido y reparar tejidos celulares' },
                      ].map((opt, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectQuizOption('goal', opt.title)}
                          className={`${styles.kodiQuizOptionCard} ${selectedOptionTemp === opt.title ? styles.kodiQuizOptionCardActive : ''}`}
                        >
                          <span className={styles.kodiQuizOptionIcon}>{opt.icon}</span>
                          <h5 className={styles.kodiQuizOptionTitle}>{opt.title}</h5>
                          <p className={styles.kodiQuizOptionDesc}>{opt.desc}</p>
                          {selectedOptionTemp === opt.title && (
                            <span style={{ position: 'absolute', top: '16px', right: '16px', color: '#7044EC', fontWeight: 800 }}>✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {quizStep === 2 && (
                  <div>
                    <h4 className={styles.kodiQuizQuestionTitle}>2. ¿En qué momento sientes tu mayor bajón de energía?</h4>
                    <p className={styles.kodiQuizQuestionSubtitle}>Identificamos el desfase en tu curva de cortisol y metabolismo:</p>
                    <div className={styles.kodiQuizOptionsGrid}>
                      {[
                        { icon: '⏰', title: 'Primeras 2 horas al despertar', desc: 'Sensación de aturdimiento y dificultad para arrancar' },
                        { icon: '☕', title: 'Media tarde (14:00 - 16:00)', desc: 'Niebla mental y somnolencia post-comida' },
                        { icon: '🌇', title: 'Al anochecer (18:00 - 21:00)', desc: 'Agotamiento acumulado que bloquea la vida personal' },
                        { icon: '📉', title: 'Fatiga constante sostenida', desc: 'Nivel bajo de energía a lo largo de toda la jornada' },
                      ].map((opt, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectQuizOption('energyDrop', opt.title)}
                          className={`${styles.kodiQuizOptionCard} ${selectedOptionTemp === opt.title ? styles.kodiQuizOptionCardActive : ''}`}
                        >
                          <span className={styles.kodiQuizOptionIcon}>{opt.icon}</span>
                          <h5 className={styles.kodiQuizOptionTitle}>{opt.title}</h5>
                          <p className={styles.kodiQuizOptionDesc}>{opt.desc}</p>
                          {selectedOptionTemp === opt.title && (
                            <span style={{ position: 'absolute', top: '16px', right: '16px', color: '#7044EC', fontWeight: 800 }}>✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {quizStep === 3 && !isQuizAnalyzing && (
                  <div>
                    <h4 className={styles.kodiQuizQuestionTitle}>3. ¿Cómo calificarías tu calidad de descanso nocturno?</h4>
                    <p className={styles.kodiQuizQuestionSubtitle}>El sueño regula la secreción hormonal y la recuperación celular:</p>
                    <div className={styles.kodiQuizOptionsGrid}>
                      {[
                        { icon: '🤯', title: 'Me cuesta apagar la mente', desc: 'Tardo más de 45 minutos en conciliar el sueño' },
                        { icon: '👀', title: 'Sueño ligero e interrumpido', desc: 'Despierto varias veces por ruidos o estrés' },
                        { icon: '⏳', title: 'Duermo menos de 6 horas', desc: 'Horarios exigentes y deuda crónica de descanso' },
                        { icon: '🔋', title: 'Duermo 7+ hrs pero despierto cansado', desc: 'Falta de fase REM y regeneración profunda' },
                      ].map((opt, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectQuizOption('sleep', opt.title)}
                          className={`${styles.kodiQuizOptionCard} ${selectedOptionTemp === opt.title ? styles.kodiQuizOptionCardActive : ''}`}
                        >
                          <span className={styles.kodiQuizOptionIcon}>{opt.icon}</span>
                          <h5 className={styles.kodiQuizOptionTitle}>{opt.title}</h5>
                          <p className={styles.kodiQuizOptionDesc}>{opt.desc}</p>
                          {selectedOptionTemp === opt.title && (
                            <span style={{ position: 'absolute', top: '16px', right: '16px', color: '#7044EC', fontWeight: 800 }}>✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analyzing animation */}
                {isQuizAnalyzing && (
                  <div className={styles.kodiQuizAnalyzingBox}>
                    <div className={styles.kodiQuizAnalyzingOrb} />
                    <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#160B3F', margin: '0 0 8px 0' }}>
                      Analizando biomarcadores y ritmo circadiano...
                    </h4>
                    <p style={{ fontSize: '13.5px', color: '#7044EC', fontWeight: 600 }}>
                      ✓ Evaluando curva de cortisol · ✓ Sincronizando dosis Rise, Balance y Unwind
                    </p>
                  </div>
                )}

                {/* Step 4: Result Deck */}
                {quizStep === 4 && (
                  <div className={styles.kodiQuizResultGrid}>
                    <div className={styles.kodiQuizResultSummary}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#7044EC', color: '#FFF', padding: '5px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '14px' }}>
                        🧬 Diagnóstico Bio-Tech Prescrito
                      </div>
                      <h4 style={{ fontSize: '22px', fontWeight: 800, color: '#160B3F', margin: '0 0 6px 0' }}>
                        Stack Circadiano: <span style={{ color: '#7044EC' }}>Bio-Equilibrio Integral</span>
                      </h4>
                      <p style={{ fontSize: '13.5px', color: '#5A5278', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                        Para tu objetivo de <strong>{quizAnswers.goal || 'Energía Limpia Matutina'}</strong>, este protocolo sincroniza tus 3 fases de absorción celular:
                      </p>

                      {/* Score metric bar */}
                      <div className={styles.kodiQuizScoreBox}>
                        <div className={styles.kodiQuizScoreHeader}>
                          <span style={{ color: '#5A5278' }}>Sincronización Actual: <strong style={{ color: '#EF5126' }}>62% (Desfasado)</strong></span>
                          <span style={{ color: '#7044EC' }}>Proyectada con Kodi: <strong>98% (Óptima)</strong></span>
                        </div>
                        <div className={styles.kodiQuizScoreTrack}>
                          <div className={styles.kodiQuizScoreFill} style={{ width: '98%' }} />
                        </div>
                      </div>

                      {/* 3 Intake Timeline Cards */}
                      <div className={styles.kodiQuizStackTimeline}>
                        <div className={styles.kodiTimelineItem}>
                          <div className={styles.kodiTimelineDot} style={{ background: '#EF5126' }} />
                          <div>
                            <div style={{ fontWeight: 800, color: '#160B3F', fontSize: '13.5px' }}>
                              07:30 AM · Fase Rise: Green Start™ (Dose 05)
                            </div>
                            <div style={{ fontSize: '12px', color: '#7044EC', fontWeight: 600, margin: '2px 0' }}>
                              Matcha Ceremonial + Clorofila + Adaptógenos (Rhodiola)
                            </div>
                            <div style={{ fontSize: '12px', color: '#5A5278' }}>
                              Tomar en ayunas. Alcaliniza y sincroniza cortisol sin temblor ni taquicardia.
                            </div>
                          </div>
                        </div>

                        <div className={styles.kodiTimelineItem}>
                          <div className={styles.kodiTimelineDot} style={{ background: '#073B3A' }} />
                          <div>
                            <div style={{ fontWeight: 800, color: '#160B3F', fontSize: '13.5px' }}>
                              01:30 PM · Fase Balance: Daily Balance™ (Dose 01)
                            </div>
                            <div style={{ fontSize: '12px', color: '#073B3A', fontWeight: 600, margin: '2px 0' }}>
                              24 Micronutrientes Quelados + Complejo B Metilado + D3/K2
                            </div>
                            <div style={{ fontSize: '12px', color: '#5A5278' }}>
                              Tomar con el almuerzo. Mantiene homeostasis celular y evita la niebla post-comida.
                            </div>
                          </div>
                        </div>

                        <div className={styles.kodiTimelineItem}>
                          <div className={styles.kodiTimelineDot} style={{ background: '#23155B' }} />
                          <div>
                            <div style={{ fontWeight: 800, color: '#160B3F', fontSize: '13.5px' }}>
                              10:00 PM · Fase Unwind: Restorative Rest™ (Dose 04)
                            </div>
                            <div style={{ fontSize: '12px', color: '#7044EC', fontWeight: 600, margin: '2px 0' }}>
                              Bisglicinato de Magnesio + L-Teanina Pura + Melisa
                            </div>
                            <div style={{ fontSize: '12px', color: '#5A5278' }}>
                              Tomar 30 min antes de dormir. Induce fase REM profunda y desactiva el estrés.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.kodiQuizActionRow}>
                        <button type="button" onClick={handleSwitchToChatWithContext} className={styles.kodiQuizAskAiBtn}>
                          💬 Consultar con el Asesor IA
                        </button>
                        <button type="button" onClick={handleResetQuiz} className={styles.kodiQuizResetBtn}>
                          ↺ Repetir Test
                        </button>
                      </div>
                    </div>

                    <div className={styles.kodiProductPreviewCard}>
                      <div className={styles.kodiCircadianOrbPreview} style={{ background: 'radial-gradient(circle, #7044EC 0%, #FFA843 50%, #74D7B8 100%)', width: '60px', height: '60px', marginBottom: '10px' }} />
                      <div className={styles.kodiProductPreviewTag}>Suscripción Recomendada</div>
                      <h4 className={styles.kodiProductPreviewTitle}>Full Circadian Stack</h4>
                      <div className={styles.kodiProductPreviewDose}>Green Start + Daily Balance + Restorative Rest</div>
                      
                      <div className={styles.kodiPriceCompareBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7A7298', textDecoration: 'line-through', marginBottom: '4px' }}>
                          <span>Compra Única:</span>
                          <span>$2,200.00 MXN</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#160B3F', fontWeight: 800, fontSize: '14px' }}>
                          <span>Plan Mensual (15% OFF):</span>
                          <span style={{ color: '#7044EC' }}>$1,870.00 MXN</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '4px' }}>
                          ✓ Envío gratis cada 30 días · Cancela cuando quieras
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCartSimulated('Full Circadian Stack')}
                        className={styles.kodiStripeCheckoutBtn}
                      >
                        <span>💳 Iniciar Suscripción ($1,870 MXN)</span>
                      </button>

                      {cartNotification && (
                        <div style={{ marginTop: '12px', fontSize: '12px', color: '#22C55E', fontWeight: 700, background: 'rgba(34, 197, 94, 0.1)', padding: '6px 12px', borderRadius: '100px' }}>
                          {cartNotification}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DEMO 2: LIVE CHATBOT IA */}
            {kodiDemoMode === 'chat' && (
              <div className={styles.kodiChatWindow}>
                <div className={styles.kodiChatHeader}>
                  <div className={styles.kodiChatHeaderLeft}>
                    <div className={styles.kodiChatAvatarCircle}>🧬</div>
                    <div>
                      <h4 className={styles.kodiChatTitle}>Asesor Biológico Kodi dose (IA)</h4>
                      <p className={styles.kodiChatSubtitle}>
                        <span className={styles.kodiChatStatusGreenDot} /> En Línea · Conectado a Base Científica y Stripe
                      </p>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '100px', fontWeight: 700 }}>
                    Vendedor Consultivo
                  </div>
                </div>

                <div className={styles.kodiChatMessagesArea}>
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={msg.sender === 'user' ? styles.kodiChatBubbleUser : styles.kodiChatBubbleBot}
                    >
                      <div>{renderFormattedChatMessage(msg.text)}</div>
                      {msg.productCard && (
                        <div className={styles.kodiChatProductCard}>
                          <div>
                            <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#7044EC', textTransform: 'uppercase' }}>
                              {msg.productCard.tag}
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#160B3F' }}>
                              {msg.productCard.title}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#5A5278', margin: '2px 0' }}>
                              {msg.productCard.dose}
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#160B3F' }}>
                              <span style={{ textDecoration: 'line-through', color: '#7A7298', marginRight: '6px' }}>{msg.productCard.singlePrice}</span>
                              <span style={{ color: '#7044EC' }}>{msg.productCard.subPrice}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddToCartSimulated(msg.productCard!.title)}
                            className={styles.kodiChatProductBtn}
                          >
                            💳 Añadir (15% OFF)
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {isBotTyping && (
                    <div className={styles.kodiChatTyping}>
                      <span className={styles.kodiTypingDot} />
                      <span className={styles.kodiTypingDot} />
                      <span className={styles.kodiTypingDot} />
                    </div>
                  )}
                </div>

                {cartNotification && (
                  <div style={{ margin: '0 20px 8px 20px', fontSize: '12px', color: '#22C55E', fontWeight: 700, background: 'rgba(34, 197, 94, 0.1)', padding: '6px 14px', borderRadius: '100px', textAlign: 'center' }}>
                    {cartNotification}
                  </div>
                )}

                {/* Quick Chips */}
                <div className={styles.kodiChatQuickChips}>
                  {[
                    '💡 ¿Por qué suscripción mensual?',
                    '🍵 ¿Cómo tomar Green Start en ayunas?',
                    '💊 ¿Qué vitaminas tiene Daily Balance?',
                    '🌙 ¿Cómo descansar mejor con Restorative Rest?',
                    '📦 ¿Tiempos de envío en México?',
                    '💳 ¿Puedo cancelar cuando quiera?',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendChatMessage(chip)}
                      className={styles.kodiChatChip}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className={styles.kodiChatInputArea}
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Escribe una pregunta sobre suplementación, ritmo circadiano o compras..."
                    className={styles.kodiChatTextInput}
                  />
                  <button type="submit" className={styles.kodiChatSendBtn}>
                    Enviar
                  </button>
                </form>
              </div>
            )}
          </section>

          {/* 3 Core Narrative Pillars */}
          <section className={styles.kodiNarrativeList}>
            {(data.storytelling?.narrative || []).map((narrative, idx) => (
              <div key={idx} className={styles.kodiNarrativeCard}>
                <div className={styles.kodiNarrativeContent}>
                  <div className={styles.kodiPillarBadge}>PILAR 0{idx + 1}</div>
                  <h3 className={styles.kodiNarrativeTitle}>{narrative.title}</h3>
                  <p className={styles.kodiNarrativeText}>{narrative.content}</p>
                </div>
                <div className={styles.kodiNarrativeImageArea}>
                  <motion.div
                    initial={{ scale: 1.0 }}
                    animate={{ scale: [1.0, 1.08, 1.0] }}
                    transition={{ duration: 14 + idx * 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${narrative.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Pricing & Investment Calculator */}
          <section id="propuesta-economica" className={styles.kodiPricingSection}>
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
              <div className={styles.kodiPillarBadge}>PROPUESTA ECONÓMICA MODULAR</div>
              <h2 className={styles.kodiSectionTitle}>
                Tu Inversión, <span className={styles.kodiEditorialSerif}>Estructurada y Transparente</span>
              </h2>
              <p className={styles.kodiSectionSubtext} style={{ margin: '0 auto' }}>
                Selecciona los componentes para personalizar tu plan. La Fase 1 cubre la ingeniería y puesta en marcha; la Fase 2 asegura la adquisición continua de clientes:
              </p>
            </div>

            <div className={styles.kodiPricingCardsGrid}>
              {(data.packages.blocks || []).map((block, bIdx) => {
                const service = block.services[0];
                if (!service) return null;
                const isSelected = !!selectedServices[service.name];

                return (
                  <div
                    key={bIdx}
                    onClick={() => toggleServiceSelection(service.name)}
                    className={`${styles.kodiPriceCard} ${isSelected ? styles.kodiPriceCardSelected : ''}`}
                  >
                    <div className={styles.kodiPriceCardHeader}>
                      <span className={`${styles.kodiPriceCardBadge} ${bIdx === 1 ? styles.kodiPriceCardBadgeSecondary : ''}`}>
                        {bIdx === 0 ? '⚡ FASE 1: SETUP ÚNICO' : '🚀 FASE 2: MENSUAL RECURRENTE'}
                      </span>
                      <div className={`${styles.kodiCustomCheckbox} ${isSelected ? styles.kodiCustomCheckboxChecked : ''}`}>
                        {isSelected && '✓'}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#160B3F', margin: '0 0 8px 0', lineHeight: 1.25 }}>
                      {service.name}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#5A5278', margin: '0 0 16px 0', lineHeight: 1.45 }}>
                      {service.description}
                    </p>

                    {bIdx === 0 ? (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7044EC', marginBottom: '2px' }}>
                          Anticipo de Arranque (50%):
                        </div>
                        <div className={styles.kodiPriceAmount}>
                          {formatPrice(service.price * 0.5)}
                        </div>
                        <div className={styles.kodiPricePeriod}>
                          + IVA para iniciar desarrollo
                        </div>
                        <div className={styles.kodiTotalProjectPill}>
                          <span>Inversión Total Fase 1: <strong>{formatPrice(service.price)} + IVA</strong></span>
                          <span style={{ fontSize: '11px', color: '#5A5278' }}>Diferido en 3 hitos (50% · 25% · 25%)</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7044EC', marginBottom: '2px' }}>
                          Inversión Mensual Recurrente:
                        </div>
                        <div className={styles.kodiPriceAmount}>
                          {formatPrice(service.price)}
                        </div>
                        <div className={styles.kodiPricePeriod} style={{ marginBottom: '18px' }}>
                          + IVA / mes (Tráfico pagado, 40 contenidos y soporte web)
                        </div>
                      </div>
                    )}

                    <ul className={styles.kodiBulletList}>
                      {(service.bullets || []).map((bullet, bullIdx) => (
                        <li key={bullIdx} className={styles.kodiBulletItem}>
                          <span className={styles.kodiBulletCheck}>✓</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Commercial Policies & Technical Specifications Section */}
            <div className={styles.kodiTermsSection}>
              <div className={styles.kodiTermsSectionHeader}>
                <div className={styles.kodiPillarBadge}>🛡️ CONDICIONES OPERATIVAS Y TRANSPARENCIA</div>
                <h3 className={styles.kodiTermsSectionTitle}>
                  Especificaciones Clave de la <span className={styles.kodiEditorialSerif}>Alianza y Servicios</span>
                </h3>
                <p className={styles.kodiTermsSectionSubtitle}>
                  Estructura transparente, sin letras pequeñas ni costos ocultos:
                </p>
              </div>

              <div className={styles.kodiTermsGrid}>
                {/* 1. Hitos de Pago */}
                <div className={styles.kodiTermCard}>
                  <div className={styles.kodiTermCardTop}>
                    <div className={styles.kodiTermIconBubble}>💳</div>
                    <div>
                      <span className={styles.kodiTermTag}>Fase 1 · Setup</span>
                      <h4 className={styles.kodiTermTitle}>Esquema de Pago por Hitos</h4>
                    </div>
                  </div>
                  <div className={styles.kodiMilestonesList}>
                    <div className={styles.kodiMilestoneItem}>
                      <span className={styles.kodiMilestonePercent}>50%</span>
                      <div>
                        <strong>$21,000 MXN</strong> · Arranque & Arquitectura UX/UI
                      </div>
                    </div>
                    <div className={styles.kodiMilestoneItem}>
                      <span className={styles.kodiMilestonePercent}>25%</span>
                      <div>
                        <strong>$10,500 MXN</strong> · 1ra Entrega Funcional (Test & Stripe)
                      </div>
                    </div>
                    <div className={styles.kodiMilestoneItem}>
                      <span className={styles.kodiMilestonePercent}>25%</span>
                      <div>
                        <strong>$10,500 MXN</strong> · Lanzamiento Final & CMS
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Consumo API IA */}
                <div className={styles.kodiTermCard}>
                  <div className={styles.kodiTermCardTop}>
                    <div className={styles.kodiTermIconBubble}>🧬</div>
                    <div>
                      <span className={styles.kodiTermTag}>Transparencia Médica</span>
                      <h4 className={styles.kodiTermTitle}>Consumo de API de IA</h4>
                    </div>
                  </div>
                  <p className={styles.kodiTermText}>
                    El motor de Inteligencia Artificial (OpenAI / Gemini) factura por cada palabra procesada. La cuenta oficial queda a nombre directo de <strong>Kodi dose™</strong>.
                  </p>
                  <div className={styles.kodiTermHighlightBox}>
                    <span style={{ fontSize: '11px', color: '#7044EC', fontWeight: 800 }}>⚡ CONSUMO ESTIMADO MENSUAL:</span>
                    <strong style={{ fontSize: '15px', color: '#160B3F' }}>$5 a $15 USD / mes</strong>
                    <span style={{ fontSize: '11px', color: '#5A5278' }}>Optimizado por código para máximo ahorro.</span>
                  </div>
                </div>

                {/* 3. Mantenimiento Web */}
                <div className={styles.kodiTermCard}>
                  <div className={styles.kodiTermCardTop}>
                    <div className={styles.kodiTermIconBubble}>🛠️</div>
                    <div>
                      <span className={styles.kodiTermTag}>Soporte & Uptime</span>
                      <h4 className={styles.kodiTermTitle}>Póliza de Mantenimiento Web</h4>
                    </div>
                  </div>
                  <p className={styles.kodiTermText}>
                    Vigilancia de pasarela Stripe, parches de seguridad, backups y soporte del catálogo en Firebase:
                  </p>
                  <div className={styles.kodiMaintenanceDual}>
                    <div className={styles.kodiMaintItemActive}>
                      <span>Con Fase 2 Activa:</span>
                      <strong>$0 MXN (Incluido)</strong>
                    </div>
                    <div className={styles.kodiMaintItem}>
                      <span>Póliza Standalone:</span>
                      <strong>$4,000 MXN / mes</strong>
                    </div>
                  </div>
                </div>

                {/* 4. Dominio & Servidores */}
                <div className={styles.kodiTermCard}>
                  <div className={styles.kodiTermCardTop}>
                    <div className={styles.kodiTermIconBubble}>🌐</div>
                    <div>
                      <span className={styles.kodiTermTag}>Infraestructura & Marca</span>
                      <h4 className={styles.kodiTermTitle}>Dominio (.com) & Servidores</h4>
                    </div>
                  </div>
                  <p className={styles.kodiTermText}>
                    La compra del dominio <strong>kodidose.com está 100% incluida por 1 año</strong>, gestionando la titularidad legal a su nombre.
                  </p>
                  <div className={styles.kodiServerBadges}>
                    <span>✓ Certificado SSL HTTPS</span>
                    <span>✓ DNS Apuntadas</span>
                    <span>✓ Hosting Serverless Vercel / Firebase</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Calculation & WhatsApp Call to Action */}
            <div className={styles.kodiSummaryBox}>
              <div className={styles.kodiSummaryLeft}>
                <div className={styles.kodiSummaryBadge}>📋 ALCANCE DEL PROYECTO</div>
                <h3 className={styles.kodiSummaryTitle}>Resumen de Inversión Seleccionada</h3>
                <p className={styles.kodiSummarySubtext}>
                  {data.packages.methodologyText || 'Infraestructura propietaria en Next.js/Firebase y pauta en Meta Ads administrada con presupuesto operativo del cliente.'}
                </p>

                <div className={styles.kodiSummarySelectedList}>
                  {data.packages.blocks?.map((block, bIdx) => {
                    const svc = block.services?.[0];
                    if (!svc || !selectedServices[svc.name]) return null;
                    return (
                      <div key={bIdx} className={styles.kodiSummarySelectedItem}>
                        <span className={styles.kodiSummarySelectedCheck}>✓</span>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#FFFFFF', fontSize: '13px' }}>{bIdx === 0 ? 'Fase 1 (Setup Inicial): ' : 'Fase 2 (Fee Mensual): '}</strong>
                          <span style={{ color: '#B8A7EA', fontSize: '12.5px' }}>{svc.name}</span>
                        </div>
                        <span style={{ color: '#74D7B8', fontWeight: 800, fontSize: '13px' }}>{formatPrice(svc.price)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.kodiSummaryNote}>
                  * Presupuestos directos de pauta publicitaria en Meta y costos de activaciones físicas en gimnasios/eventos son administrados con presupuesto adicional de Kodi dose™.
                </div>
              </div>

              <div className={styles.kodiSummaryRight}>
                <div className={styles.kodiSummaryCardInner}>
                  <div className={styles.kodiSummaryRow}>
                    <span style={{ color: '#B8A7EA', fontSize: '13px' }}>Subtotal Neto:</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>{formatPrice(total)}</span>
                  </div>
                  <div className={styles.kodiSummaryRow}>
                    <span style={{ color: '#B8A7EA', fontSize: '13px' }}>IVA Trasladado (16%):</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>{formatPrice(total * 0.16)}</span>
                  </div>
                  <div className={styles.kodiSummaryDivider} />
                  <div className={styles.kodiSummaryTotalRow}>
                    <div>
                      <div className={styles.kodiTotalLabel}>TOTAL ESTIMADO CON IVA</div>
                      <div className={styles.kodiTotalValue}>{formatPrice(totalWithIva)}</div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${data.contact?.phone || '526561031571'}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.kodiWhatsAppCta}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>CONFIRMAR POR WHATSAPP</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Minimalist Brand Footer */}
          <footer className={styles.kodiFooter}>
            <div className={styles.kodiFooterLinks}>
              <a href="#">Términos de Servicio</a>
              <span>·</span>
              <a href="#">Soporte Apolograma</a>
              <span>·</span>
              <a href="#">Frontera Número Uno</a>
              <span>·</span>
              <a href={`tel:${data.contact?.phone || '526561031571'}`}>Línea Directa: 656-103-1571</a>
            </div>
            <p style={{ margin: 0, opacity: 0.7 }}>
              © 2026 Apolograma & Frontera Número Uno. Desarrollado exclusivamente para Kodi dose™.
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <>
      <CursorSpotlight isLight={isLight} />
      
      <main className={styles.main} style={customTheme}>
      <AnimatePresence>
        {activeService && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className={styles.globalBackdrop} 
            onClick={() => setActiveService(null)}
          />
        )}
      </AnimatePresence>

      {/* Agency Header Navbar */}
      <header className={styles.header}>
        <div className={styles.agencyLogos}>
          {data.config?.agency !== 'fn1' && (
            <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={300} height={50} sizes="(max-width: 768px) 150px, 300px" className={isLight ? styles.apologramaLogoImageLight : styles.apologramaLogoImage} />
          )}
          {data.config?.agency !== 'apolograma' && (
            <Image src={isLight ? "/assets/fn1-logo-purple.png" : "/assets/fn1-logo-white.png"} alt="Frontera Número Uno" width={415} height={43} sizes="(max-width: 768px) 200px, 415px" className={styles.agencyLogoImage} />
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        {data.hero?.backgroundVideo ? (
          <>
            <video 
              src={data.hero.backgroundVideo} 
              autoPlay loop muted playsInline preload="auto"
              onCanPlay={(e) => { e.currentTarget.playbackRate = 0.5; }}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: 0.75,
                zIndex: 0,
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: isLight ? 'rgba(249, 246, 240, 0.40)' : 'rgba(5, 5, 5, 0.70)',
              zIndex: 1,
            }} />
            <div style={{
              position: 'absolute',
              bottom: -1, left: 0, width: '100%', height: '220px',
              background: 'linear-gradient(to bottom, transparent 0%, var(--bg-color) 100%)',
              zIndex: 2,
              pointerEvents: 'none'
            }} />
          </>
        ) : data.hero?.backgroundImage ? (
          <>
            <motion.div 
              initial={{ scale: 1.0 }}
              animate={{ scale: [1.0, 1.12, 1.0] }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${data.hero.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transformOrigin: 'center center',
                willChange: 'transform',
                zIndex: 0,
              }} 
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              background: isLight 
                ? 'radial-gradient(circle at center, rgba(249, 246, 240, 0.40) 0%, rgba(249, 246, 240, 0.90) 100%)' 
                : 'radial-gradient(circle at center, rgba(11, 12, 16, 0.20) 0%, rgba(11, 12, 16, 0.90) 100%)',
              backdropFilter: 'blur(1px)',
              zIndex: 1,
            }} />
            <div style={{
              position: 'absolute',
              bottom: -1, left: 0, width: '100%', height: '220px',
              background: 'linear-gradient(to bottom, transparent 0%, var(--bg-color) 100%)',
              zIndex: 2,
              pointerEvents: 'none'
            }} />
          </>
        ) : null}
        {!isLight && !data.hero?.backgroundImage && !data.hero?.backgroundVideo && (
          <>
            <div className={styles.heroBg} />
            <motion.div 
              className={styles.floating3D} 
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        {data.theme?.clientLogoStyle === 'split' ? (
          <div className={styles.heroSplitContent}>
            {/* Left Column: Headings */}
            <div className={styles.heroLeft}>
              <h1 
                className={`${styles.heroTitle} text-gradient`}
                style={{ 
                  margin: 0,
                  textAlign: 'left',
                  filter: isLight 
                    ? 'drop-shadow(0 4px 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 2px 4px rgba(255, 255, 255, 0.95))' 
                    : 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.95))',
                  fontWeight: 900
                }}
              >
                {data.hero?.headline || data.heroTitle || `Propuesta Estratégica para ${data.clientName}`}
              </h1>
              <p 
                className={styles.heroSubtitle}
                style={{ 
                  margin: 0,
                  textAlign: 'left',
                  color: isLight ? 'var(--text-color)' : '#ffffff',
                  textShadow: isLight ? '0 1px 4px rgba(255, 255, 255, 0.9)' : '0 2px 8px rgba(0, 0, 0, 0.95)',
                  fontWeight: 500
                }}
              >
                {data.hero?.subheadline || data.heroText}
              </p>
            </div>

            {/* Right Column: Metadata Card */}
            <div className={styles.heroRight}>
              {data.clientLogo && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  whileHover={{ scale: 1.02 }}
                  className={styles.heroMetaCard}
                >
                  <div className={styles.metaCardLogo}>
                    <Image 
                      src={data.clientLogo} 
                      alt={data.clientName} 
                      width={180}
                      height={180}
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className={styles.metaCardDetails}>
                    <div className={styles.metaCardRow}>
                      <span>Cliente:</span>
                      <span className={styles.metaCardValue}>{data.clientName}</span>
                    </div>
                    <div className={styles.metaCardRow}>
                      <span>Fecha:</span>
                      <span className={styles.metaCardValue}>Julio 2026</span>
                    </div>
                    <div className={styles.metaCardRow}>
                      <span>Propuesta:</span>
                      <span className={styles.metaCardValuePrimary}>Digital & PR</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div 
              className={styles.logoContainer}
              style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}
            >
              {data.clientLogo && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  style={data.theme?.clientLogoStyle === 'raw' || data.theme?.clientLogoRaw ? {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '160px',
                    height: '160px',
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))'
                  } : {
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1.5px solid var(--glass-border, rgba(120, 190, 32, 0.3))',
                    borderRadius: data.theme?.clientLogoStyle === 'square' ? '24px' : '50%',
                    padding: '1.8rem',
                    boxShadow: '0 0 45px rgba(120, 190, 32, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '160px',
                    height: '160px',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    cursor: 'pointer'
                  }}
                >
                  <Image 
                    src={data.clientLogo} 
                    alt={data.clientName} 
                    width={120}
                    height={120}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </motion.div>
              )}
            </div>
            
            <h1 
              className={`${styles.heroTitle} text-gradient`}
              style={{ 
                position: 'relative', 
                zIndex: 2,
                filter: isLight 
                  ? 'drop-shadow(0 4px 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 2px 4px rgba(255, 255, 255, 0.95))' 
                  : 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.95))',
                fontWeight: 900
              }}
            >
              {data.hero?.headline || data.heroTitle || `Propuesta Estratégica para ${data.clientName}`}
            </h1>
            
            <p 
              className={styles.heroSubtitle}
              style={{ 
                position: 'relative', 
                zIndex: 2,
                color: isLight ? 'var(--text-color)' : '#ffffff',
                textShadow: isLight ? '0 1px 4px rgba(255, 255, 255, 0.9)' : '0 2px 8px rgba(0, 0, 0, 0.95)',
                fontWeight: 500
              }}
            >
              {data.hero?.subheadline || data.heroText}
            </p>
          </>
        )}
      </section>

      {/* Brand Divider */}
      {data.config?.agency !== 'apolograma' && (
        <motion.div 
          className={styles.brandDivider}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <Image src="/assets/stickers/x-purple.png" alt="Frontera X" width={412} height={394} />
        </motion.div>
      )}

      {/* Storytelling: The Narrative & Challenge */}
      {data.storytelling && (
        <section className={styles.storySection}>
          {data.storytelling.justification && (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`${styles.narrativeCard} glass`}
              style={{
                maxWidth: '1000px',
                margin: '0 auto 4rem auto',
                padding: '2.5rem',
                border: '1.5px solid var(--glass-border, rgba(0, 114, 206, 0.15))',
                borderRadius: '24px',
                textAlign: 'left',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className={styles.justificationGrid}>
                <div className={styles.justificationInfo}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', background: data.theme?.textGradient || 'linear-gradient(to right, #a855f7, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
                    {data.storytelling.justification.title}
                  </h2>
                  <p style={{ fontSize: '1.15rem', color: isLight ? '#444' : '#ccc', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
                    {data.storytelling.justification.content}
                  </p>
                  {data.storytelling.justification.points && (
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {data.storytelling.justification.points.map((point: string, pIdx: number) => (
                        <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', fontSize: '1rem', color: isLight ? '#666' : '#9e9e9e' }}>
                          <span style={{ color: data.theme?.primary || '#a855f7', fontWeight: 'bold' }}>✓</span>
                          <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.justificationChartContainer}>
                  {(() => {
                    const segments = [
                      { label: 'Reputación B2B', value: 35, color: data.theme?.primary || '#0072CE', desc: 'Hitos operativos, escala logística e infraestructura en LinkedIn.' },
                      { label: 'Marca Empleadora', value: 30, color: '#FF4D6D', desc: 'Prestaciones, orgullo interno, bienestar y vacantes en LinkedIn/Facebook.' },
                      { label: 'Responsabilidad Social', value: 20, color: '#10B981', desc: 'Programas de ayuda comunitaria, ecología y patrocinios locales.' },
                      { label: 'Interacción y Comunidad', value: 15, color: '#FFB703', desc: 'Campañas de interacción local y cobertura proactiva en Facebook.' }
                    ];
                    const radius = 100;
                    
                    const getArcPath = (startPercent: number, endPercent: number, r: number) => {
                      const startAngle = (startPercent / 100) * 360 * (Math.PI / 180) - Math.PI / 2;
                      const endAngle = (endPercent / 100) * 360 * (Math.PI / 180) - Math.PI / 2;
                      
                      const x1 = 160 + r * Math.cos(startAngle);
                      const y1 = 160 + r * Math.sin(startAngle);
                      const x2 = 160 + r * Math.cos(endAngle);
                      const y2 = 160 + r * Math.sin(endAngle);
                      
                      const largeArcFlag = (endPercent - startPercent) > 50 ? 1 : 0;
                      
                      return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
                    };

                    let accumulatedPercent = 0;

                    return (
                      <>
                        <div 
                          className={styles.justificationChartWrapper}
                          onMouseEnter={() => setIsAutoplayActive(false)}
                          onMouseLeave={() => {
                            setIsAutoplayActive(true);
                            setHoveredSegment(null);
                          }}
                        >
                          <svg width="100%" height="100%" viewBox="0 0 320 320">
                            <circle cx="160" cy="160" r={radius} fill="transparent" stroke={isLight ? '#eee' : 'rgba(255, 255, 255, 0.05)'} strokeWidth="24" />
                            {segments.map((seg, idx) => {
                              const startPercent = accumulatedPercent;
                              accumulatedPercent += seg.value;
                              const endPercent = accumulatedPercent;
                              
                              const pathD = getArcPath(startPercent, endPercent, radius);

                              const pathVariants = {
                                hidden: { pathLength: 0 },
                                visible: { 
                                  pathLength: 1,
                                  transition: { duration: 1.2, ease: "easeOut", delay: 0.1 }
                                }
                              };

                              return (
                                <motion.path
                                  key={idx}
                                  d={pathD}
                                  fill="none"
                                  stroke={seg.color}
                                  strokeWidth={hoveredSegment === idx ? 30 : 24}
                                  variants={pathVariants as any}
                                  style={{
                                    cursor: 'pointer',
                                    opacity: hoveredSegment === null || hoveredSegment === idx ? 1 : 0.35,
                                    transition: 'opacity 0.2s, stroke-width 0.2s'
                                  }}
                                  onMouseEnter={() => setHoveredSegment(idx)}
                                  onMouseLeave={() => setHoveredSegment(null)}
                                />
                              );
                            })}
                          </svg>
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            pointerEvents: 'none',
                            width: '180px'
                          }}>
                            <span 
                              className={styles.chartCenterValue} 
                              style={{ color: hoveredSegment !== null ? segments[hoveredSegment].color : (isLight ? 'var(--text-color, #111)' : '#fff') }}
                            >
                              {hoveredSegment !== null ? `${segments[hoveredSegment].value}%` : '100%'}
                            </span>
                            <span 
                              className={styles.chartCenterLabel}
                              style={{ color: isLight ? '#666' : '#9e9e9e' }}
                            >
                              {hoveredSegment !== null ? segments[hoveredSegment].label : 'Mix Total'}
                            </span>
                          </div>
                        </div>

                        <div className={styles.chartDetailsBox}>
                          {hoveredSegment !== null ? (
                            <>
                              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 700, color: segments[hoveredSegment].color }}>
                                {segments[hoveredSegment].label} ({segments[hoveredSegment].value}%)
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: isLight ? '#555' : '#ccc', lineHeight: 1.35 }}>
                                {segments[hoveredSegment].desc}
                              </p>
                            </>
                          ) : (
                            <p style={{ margin: 0, fontSize: '0.85rem', color: isLight ? '#777' : '#888', lineHeight: 1.35, fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              Pasa el cursor sobre los segmentos del gráfico para ver la estrategia de parrilla.
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {data.storytelling.narrative ? (
            <div className={styles.narrativeContainer}>
              {data.storytelling.narrative.map((block, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div 
                    key={idx} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, margin: "-50px" }} 
                    variants={fadeUp}
                    className={`${styles.narrativeCard} glass`}
                  >
                    {block.image ? (
                      <div className={`${styles.narrativeSplit} ${isEven ? styles.narrativeSplitEven : styles.narrativeSplitOdd}`}>
                        <div className={styles.narrativeText}>
                          <h2 style={{ fontSize: '1.6rem', color: isLight ? '#222' : '#fff', marginBottom: '1.25rem', fontWeight: 800 }}>
                            {block.title}
                          </h2>
                          <p 
                            style={{ fontSize: '1.1rem', color: isLight ? '#444' : '#ccc', lineHeight: 1.65, margin: 0 }}
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        </div>
                        <div className={styles.narrativeImageContainer}>
                          <Image 
                            src={block.image} 
                            alt={block.title} 
                            width={450} 
                            height={338} 
                            className={styles.narrativeImage}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 style={{ fontSize: '1.5rem', color: isLight ? '#222' : '#fff', marginBottom: '1rem', fontWeight: 700 }}>
                          {block.title}
                        </h2>
                        <p 
                          style={{ fontSize: '1.1rem', color: isLight ? '#555' : '#aaa', lineHeight: 1.6 }}
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : data.storytelling.challenge && (
            <motion.h2 
              className={`${styles.storyChallenge} text-gradient`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              &quot;{data.storytelling.challenge}&quot;
            </motion.h2>
          )}

          {/* Countdown Banner */}
          {data.storytelling.countdownDate && (
            <CountdownBanner 
              targetDate={data.storytelling.countdownDate} 
              label={data.storytelling.countdownLabel || 'Para el evento'}
              isLight={isLight}
              primaryColor={data.theme?.primary || '#a855f7'}
            />
          )}

          <motion.div 
            className={styles.storyPillarsGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            {data.storytelling.pillars && data.storytelling.pillars.map((pillar, idx) => (
              <motion.div key={idx} variants={fadeUp} className={styles.storyPillarCard}>
                {pillar.image && (
                  pillar.image.endsWith('.mp4') || pillar.image.endsWith('.webm') ? (
                    <video 
                      src={pillar.image} 
                      className={styles.pillarImage} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                    />
                  ) : (
                    <Image src={pillar.image} alt={pillar.title} className={styles.pillarImage} width={509} height={380} />
                  )
                )}
                <div 
                  className={styles.pillarContent}
                  style={{ borderLeft: `4px solid ${data.theme?.primary || '#8a2be2'}` }}
                >
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* El Ecosistema - Presentación Base */}
      {data.features?.showEcosystem !== false && (
        <section className={styles.section}>
          <motion.h2 
            className={styles.sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          ¿Quién está detrás de esta propuesta?
        </motion.h2>
        <motion.p 
          className={styles.sectionSubtitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Dos empresas. Un solo objetivo: que tu marca sea imposible de ignorar.
        </motion.p>
        
        <div className={styles.statsGrid}>
          <TiltCard className={`${styles.ecosystemCard} glass`}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '2.5rem 2.5rem 0 2.5rem', flex: 1 }}>
                <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                  <Image 
                    src="/assets/apolograma-logo-v2.png" 
                    alt="Apolograma" 
                    width={200}
                    height={24}
                    style={{ 
                      height: '24px', 
                      width: 'auto',
                      objectFit: 'contain',
                      filter: isLight ? 'grayscale(100%) brightness(0)' : 'none', 
                      mixBlendMode: isLight ? 'multiply' : 'normal' 
                    }} 
                  />
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: isLight ? '#222' : '#eee', marginBottom: '0.5rem', lineHeight: 1.4 }}>Tu departamento de marketing externo.</p>
                <p style={{ fontSize: '0.9rem', color: isLight ? '#666' : '#999', marginBottom: '2rem' }}>Diseño gráfico, fotografía, estrategia y administración de redes sociales. Todo lo que necesitas, sin contratar un equipo interno.</p>
              </div>
              <div style={{ width: '100%', marginTop: 'auto' }}>
                <ApologramaShowcase isLight={isLight} />
              </div>
            </motion.div>
          </TiltCard>
          <TiltCard className={`${styles.ecosystemCard} glass`}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '2.5rem 2.5rem 0 2.5rem', flex: 1, position: 'relative', zIndex: 10 }}>
                <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                  <Image 
                    src={isLight ? "/assets/fn1-logo-purple.png" : "/assets/fn1-logo-white.png"} 
                    alt="Frontera Número Uno" 
                    width={170} height={18}
                    sizes="170px"
                    style={{ width: '170px', height: 'auto', objectFit: 'contain' }} 
                  />
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: isLight ? '#222' : '#eee', marginBottom: '0.5rem', lineHeight: 1.4 }}>La audiencia más grande de la frontera. Ya es tuya.</p>
                <p style={{ fontSize: '0.9rem', color: isLight ? '#666' : '#999', marginBottom: '1.5rem' }}>460,000 seguidores y 77 millones de visualizaciones listos para conocer tu marca.</p>
                
                {/* Odometer numbers moved here for Edge-to-Edge bleed */}
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isLight ? '#8a2be2' : '#a855f7', lineHeight: 1 }}>77.1M</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.6, marginTop: '0.2rem' }}>Visualizaciones</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isLight ? '#8a2be2' : '#a855f7', lineHeight: 1 }}>460K</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.6, marginTop: '0.2rem' }}>Seguidores Totales</div>
                  </div>
                </div>
              </div>
              <div style={{ width: '100%', marginTop: 'auto' }}>
                <ViralChart isLight={isLight} />
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </section>
      )}

      {/* Nuestras Audiencias (Restaurado con nuevos demográficos) */}
      {data.features?.showAudiences !== false && (
        <section className={styles.section}>
        <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Tu audiencia potencial
        </motion.h2>
        <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Estas son las personas que verán tu contenido desde el primer día.
        </motion.p>
        
        <div className={styles.statsGrid}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ height: '100%' }}>
            <PremiumAudienceCard
              platform="facebook"
              title="The Millennials"
              followers={406.6}
              ageRange="25-44 años"
              agePercent={68}
              juarezPercent={72}
              elPasoPercent={18}
              isLight={isLight}
            />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} style={{ height: '100%' }}>
            <PremiumAudienceCard
              platform="instagram"
              title="The Centennials"
              followers={69.8}
              ageRange="18-34 años"
              agePercent={65}
              juarezPercent={63}
              elPasoPercent={32}
              isLight={isLight}
            />
          </motion.div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.3 }} style={{ height: '100%' }}>
            <InsightCard 
              title="Visualizaciones" 
              value="72.7M" 
              increase="+30.1%" 
              isLight={isLight} 
            />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.4 }} style={{ height: '100%' }}>
            <InsightCard 
              title="Interacciones" 
              value="760.3K" 
              increase="+28.8%" 
              isLight={isLight} 
            />
          </motion.div>
        </div>
      </section>
      )}

      {/* Campaign Deep Dive (e.g. Phase 1 Expansion) */}
      {data.campaignDeepDive && (
        <section className={styles.section} style={{ marginTop: '2rem' }}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {data.campaignDeepDive.title}
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {data.campaignDeepDive.subtitle}
          </motion.p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '3rem' }}>
            {/* Influencer Roster */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Roster de Influencers</h3>
              <Image src={data.campaignDeepDive.influencerSection.image} alt="Influencers" width={800} height={600} style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.6 }}>{data.campaignDeepDive.influencerSection.description}</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Timelines (Multi-Video Support) */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {data.campaignDeepDive.timelines.map((tl, tlIdx) => (
                  <div key={tlIdx} className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>{tl.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {tl.steps.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '0.8rem' }}>{idx + 1}</div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-color)', marginBottom: '0.25rem' }}>{item.step}</strong>
                            <span style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.4 }}>{item.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* ROI & Budget */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Responsabilidad Presupuestal</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.campaignDeepDive.budgetTable.map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: idx === data.campaignDeepDive!.budgetTable.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: 'var(--text-color)', fontSize: '0.95rem' }}>{row.concept}</strong>
                          <span style={{ color: 'var(--muted-text)', fontSize: '0.8rem' }}>{row.responsibility}</span>
                        </div>
                        <div style={{ fontWeight: row.cost.includes('Incluido') ? 700 : 400, color: row.cost.includes('Incluido') ? '#4ade80' : 'var(--muted-text)', fontSize: '0.9rem' }}>
                          {row.cost}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📈</span> Proyección de ROAS
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-color)', lineHeight: 1.6, opacity: 0.9 }}>
                    {data.campaignDeepDive.impactProjection}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* FN1 Services */}
      {data.features?.showPricing !== false && data.packages.fn1.length > 0 && (
        <section className={styles.section}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Difusión y Alcance Masivo
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Tu marca en el medio digital más influyente de Juárez y El Paso.
          </motion.p>
          
          <motion.div 
            className={styles.servicesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {data.packages.fn1.map((service, idx) => (
              <AccordionCard 
                key={idx} 
                service={service} 
                formatPrice={formatPrice} 
                variants={fadeUp} 
                isOpen={true}
                isSelectable={!data.features?.disableSelection}
                isSelected={selectedServices[service.name]}
                onSelect={() => toggleServiceSelection(service.name)}
                selectionType="checkbox"
                priceSuffix={data.config?.priceSuffix}
                disableAccordion={data.features?.disableAccordion}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Apolograma Services (Legacy Flat List) */}
      {data.features?.showPricing !== false && data.packages.apolograma.length > 0 && (
        <section className={styles.section}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Producción de Contenido y Redes Sociales
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            Contenido profesional diseñado para convertir seguidores en clientes.
          </motion.p>
          
          <motion.div 
            className={styles.servicesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {data.packages.apolograma.map((service, idx) => (
              <AccordionCard 
                key={idx} 
                service={service} 
                formatPrice={formatPrice} 
                variants={fadeUp} 
                isOpen={activeService === service.name}
                onToggle={() => setActiveService(activeService === service.name ? null : service.name)}
                isSelectable={isExclusive}
                isSelected={selectedApoIdx === idx}
                onSelect={() => setSelectedApoIdx(idx)}
                priceSuffix={data.config?.priceSuffix}
                disableAccordion={data.features?.disableAccordion}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Propuesta Económica General Header */}
      {data.features?.showPricing !== false && data.packages.blocks && data.packages.blocks.length > 0 && (
        <section className={styles.section} style={{ paddingBottom: 0, overflow: 'hidden' }}>
          <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {data.packages.title || "Propuesta de Solución Modular"}
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {data.packages.subtitle || "Selecciona y personaliza los módulos del proyecto médico:"}
          </motion.p>
          {!data.features?.disableSelection && (
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                margin: '-1rem auto 2.5rem auto',
                background: 'rgba(0, 126, 255, 0.08)',
                border: '1px solid rgba(0, 126, 255, 0.18)',
                borderRadius: '50px',
                padding: '0.6rem 1.4rem',
                width: 'fit-content',
                fontSize: '0.85rem',
                color: 'var(--text-color)',
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(0, 126, 255, 0.05)'
              }}
            >
              <span style={{ fontSize: '1.05rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>💡</span>
              <span><strong>Instrucciones:</strong> Puedes activar o desactivar las casillas/círculos en el extremo derecho de cada servicio para personalizar tu inversión.</span>
            </motion.div>
          )}
        </section>
      )}

      {/* Blocks Structure */}
      {data.features?.showPricing !== false && data.packages.blocks && data.packages.blocks.map((block, blockIdx) => {
        const isStaggered = data.features?.disableSelection;
        const isBlockOptional = block.name.toLowerCase().includes('opcional') || block.name.toLowerCase().includes('adicional');
        const isRadioBlock = !isBlockOptional && (
          block.name.toLowerCase().includes('opción') || 
          block.name.toLowerCase().includes('opcion') || 
          block.name.toLowerCase().includes('iguala') ||
          block.name.toLowerCase().includes('plan')
        );
        
        return (
          <section key={`block-${blockIdx}`} className={styles.section} style={{ overflow: 'hidden' }}>
            <motion.h2 className={styles.sectionTitle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ marginBottom: isStaggered ? '5rem' : '4rem' }}>
              {block.name}
            </motion.h2>
            
            {isStaggered ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
                {block.services.map((service, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div 
                      key={`${blockIdx}-${idx}`}
                      className={isEven ? styles.staggeredRow : styles.staggeredRowReverse}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                      }}
                    >
                      {/* Image / Mockup Column */}
                      {service.image && (
                        <div className={styles.rowImageContainer}>
                          <motion.div
                            whileHover={{ scale: 1.025 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            style={{ width: '100%', maxWidth: '480px' }}
                          >
                            <Image 
                              src={service.image} 
                              alt={service.name} 
                              className={styles.rowImage}
                              width={480}
                              height={320}
                              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                            />
                          </motion.div>
                        </div>
                      )}
                      
                      {/* Text & Deliverables Column */}
                      <div className={styles.rowTextContainer}>
                        <h3 className={styles.rowTitle}>{service.name}</h3>
                        <p className={styles.rowDescription}>{service.description}</p>
                        
                        {service.bullets && (
                          <motion.ul 
                            className={styles.bulletList}
                            variants={bulletContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                          >
                            {service.bullets.map((bullet, bIdx) => (
                              <motion.li 
                                key={bIdx} 
                                className={styles.bulletItem}
                                variants={bulletItemVariants}
                                whileHover={{ scale: 1.015, x: 4 }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  border: '1px solid var(--glass-border)',
                                  borderRadius: '12px',
                                  padding: '0.8rem 1.2rem',
                                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.8rem',
                                  transition: 'border-color 0.2s, background 0.2s',
                                  cursor: 'default',
                                  width: '100%',
                                  boxSizing: 'border-box'
                                }}
                              >
                                <span className={styles.bulletCheck} style={{ color: 'var(--primary-color, #a855f7)', fontSize: '1.1rem', marginRight: '0.2rem' }}>✦</span>
                                <span style={{ color: 'var(--text-color)', fontSize: '0.95rem', fontWeight: 400 }}>{bullet}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : block.name.toLowerCase().includes('adicionales') || data.features?.pillsLayout ? (
              <div 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '1.25rem', 
                  justifyContent: 'center', 
                  width: '100%',
                  maxWidth: '1200px',
                  margin: '0 auto',
                  padding: '1.5rem 0'
                }}
              >
                {block.services.map((service, idx) => {
                  const primaryColor = data.theme?.primary || '#ff7f00';
                  return (
                    <motion.div
                      key={`${blockIdx}-${idx}`}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1.5px solid var(--glass-border, rgba(255, 255, 255, 0.08))',
                        borderRadius: '20px',
                        padding: '1.2rem 1.6rem',
                        flex: '1 1 280px',
                        maxWidth: '380px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(10px)',
                        textAlign: 'left',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Service Name & Price */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.6rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                          {service.name.replace(' (15% Descuento)', '')}
                        </span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: primaryColor }}>
                          {formatPrice(service.price)}
                        </span>
                      </div>

                      {/* Brief Description */}
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0, lineHeight: 1.45 }}>
                        {service.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div 
                className={styles.servicesGrid}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
              >
                {block.services.map((service, idx) => (
                  <AccordionCard 
                    key={`${blockIdx}-${idx}`} 
                    service={service} 
                    formatPrice={formatPrice} 
                    variants={fadeUp} 
                    isOpen={activeService === service.name}
                    onToggle={() => setActiveService(activeService === service.name ? null : service.name)}
                    isSelectable={!data.features?.disableSelection}
                    isSelected={selectedServices[service.name]}
                    onSelect={() => toggleServiceSelection(service.name)}
                    selectionType={isRadioBlock ? "radio" : "checkbox"}
                    priceSuffix={data.config?.priceSuffix}
                    disableAccordion={data.features?.disableAccordion}
                  />
                ))}
              </motion.div>
            )}
          </section>
        );
      })}

      {/* Footer Video */}
      {data.footerVideo && (
        <section className={styles.section} style={{ paddingBottom: 0 }}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}
          >
            <h2 className={styles.sectionTitle} style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              Nuestra Calidad Cinematográfica
            </h2>
            <video 
              src={data.footerVideo} 
              autoPlay
              muted
              loop
              controls
              playsInline
              style={{
                width: '100%',
                maxWidth: '350px',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                border: '1px solid var(--glass-border)'
              }}
            />
          </motion.div>
        </section>
      )}

      {/* Summary */}
      {data.features?.showPricing !== false && (
      <section className={styles.summarySection}>
        <motion.div 
          className={`${styles.summaryCard} glass`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>
            {data.packages.title || (data.packages.blocks && data.packages.blocks.length > 0 && !data.features?.disableSelection ? "Ejecución Modular" : "Tu inversión, desglosada.")}
          </h2>
          <p className={styles.sectionSubtitle} style={{marginBottom: "1rem"}}>
            {data.packages.subtitle || (isExclusive ? "Total basado en la opción seleccionada:" : (data.packages.blocks && data.packages.blocks.length > 0 && !data.features?.disableSelection ? "Inversión Total del Proyecto" : "Esto es exactamente lo que recibirás cada mes:"))}
          </p>

          {data.config?.enableCurrencyToggle && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: '1rem' }}>
              <button 
                onClick={() => setSelectedCurrency("MXN")}
                style={{
                  background: selectedCurrency === "MXN" ? 'var(--primary-color)' : 'transparent',
                  color: selectedCurrency === "MXN" ? '#fff' : 'var(--text-color)',
                  border: '1.5px solid var(--primary-color)',
                  borderRadius: '30px',
                  padding: '0.4rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  boxShadow: selectedCurrency === "MXN" ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                MXN (Pesos)
              </button>
              <button 
                onClick={() => setSelectedCurrency("USD")}
                style={{
                  background: selectedCurrency === "USD" ? 'var(--primary-color)' : 'transparent',
                  color: selectedCurrency === "USD" ? '#fff' : 'var(--text-color)',
                  border: '1.5px solid var(--primary-color)',
                  borderRadius: '30px',
                  padding: '0.4rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  boxShadow: selectedCurrency === "USD" ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                USD (Dólares)
              </button>
            </div>
          )}

          {data.packages.blocks && data.packages.blocks.length > 0 && !data.features?.disableSelection && !data.features?.hideModularMethodology && (
            <div style={{
              background: "rgba(168, 85, 247, 0.1)", 
              border: "1px solid rgba(168, 85, 247, 0.3)", 
              borderRadius: "8px", 
              padding: "1rem", 
              marginBottom: "2rem",
              color: "var(--text-color)",
              fontSize: "0.95rem",
              lineHeight: "1.5",
              textAlign: "left"
            }}>
              <strong>Metodología Flexible:</strong> {data.packages.methodologyText || (
                <>
                  Podemos ejecutar el ecosistema completo de forma simultánea, o bien, realizar un despliegue por bloques individuales <strong>(lapsos de 30 días naturales por bloque)</strong> para escalar la inversión a tu ritmo.
                </>
              )}
            </div>
          )}
          
          {!data.hideTotal && (
            <>
              <div style={{textAlign: "left", marginBottom: "1rem", color: "var(--muted-text)"}}>
                {subtotal > 0 && <p>Subtotal: {formatPrice(subtotal)}</p>}
                {data.discountPercent > 0 && <p style={{color: "#4ade80"}}>Descuento ({data.discountPercent}%): -{formatPrice(discountAmount)}</p>}
              </div>

              {(fn1Total > 0 && apoTotal > 0) && (
                <>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressAgency} style={{ width: `${(apoTotal / subtotal) * 100}%` }} />
                    <div className={styles.progressMedia} style={{ width: `${(fn1Total / subtotal) * 100}%` }} />
                  </div>
                  <div className={styles.progressLabels}>
                    <span style={{ color: "#a855f7" }}>Contenido y Redes ({Math.round((apoTotal/subtotal)*100)}%)</span>
                    <span style={{ color: "#3b82f6" }}>Difusión y Alcance ({Math.round((fn1Total/subtotal)*100)}%)</span>
                  </div>
                </>
              )}

              {totalSavings > 0 && (
                <div style={{
                  background: 'rgba(74, 222, 128, 0.08)',
                  border: '1.5px solid rgba(74, 222, 128, 0.25)',
                  borderRadius: '30px',
                  padding: '0.6rem 1.2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem',
                  marginBottom: '1.5rem',
                  color: '#4ade80',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ✦ ¡Ahorro de {formatPrice(totalSavings)} (30% Descuento) aplicado!
                </div>
              )}

              <div className={`${styles.totalPrice} text-gradient`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <AnimatedPrice 
                  value={data.config?.enableCurrencyToggle ? convertPrice(total) : total} 
                  locale={data.config?.enableCurrencyToggle && selectedCurrency === "USD" ? "en-US" : locale} 
                  currency={data.config?.enableCurrencyToggle ? selectedCurrency : currency} 
                />
                {data.config?.priceSuffix && (
                  <span style={{ fontSize: '1rem', color: 'var(--muted-text)', marginTop: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {data.config.priceSuffix}
                  </span>
                )}
              </div>
              
              <div style={{ 
                fontSize: '1.05rem', 
                color: 'var(--muted-text)', 
                opacity: 0.7, 
                marginTop: '0.5rem', 
                marginBottom: '1.5rem',
                fontWeight: 500,
                textAlign: 'center'
              }}>
                {formatPrice(total * (1 + (data.config?.ivaPercent !== undefined ? data.config.ivaPercent : 16) / 100))} con IVA incluido
              </div>
            </>
          )}
          
          <motion.a 
            href={`https://wa.me/${data.contact?.phone || '526561031571'}?text=${encodeURIComponent(getWhatsAppMessage())}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Aprobar Propuesta →
          </motion.a>
        </motion.div>
      </section>
      )}

      {/* Datos Bancarios */}
      {data.features?.showPricing !== false && (
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <motion.div 
            className="glass"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ 
              padding: '2rem', 
              borderRadius: '16px', 
              background: 'var(--card-bg)', 
              border: '1px solid var(--glass-border)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            <h3 style={{ color: 'var(--text-color)', marginTop: 0, fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              Datos Bancarios
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '1.1rem' }}>
              <div><strong style={{ color: 'var(--primary-color)' }}>Razón Social:</strong> <span style={{ color: 'var(--text-color)' }}>TECNOLOGIES TECZA, S. DE R.L. DE C.V.</span></div>
              <div><strong style={{ color: 'var(--primary-color)' }}>Banco:</strong> <span style={{ color: 'var(--text-color)' }}>Banregio</span></div>
              <div><strong style={{ color: 'var(--primary-color)' }}>Cuenta:</strong> <span style={{ color: 'var(--text-color)' }}>065-74924-002-9</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <strong style={{ color: 'var(--primary-color)' }}>CLABE:</strong> 
                <div 
                  onClick={() => {
                    navigator.clipboard.writeText("058164657492400290");
                    alert("¡CLABE copiada al portapapeles!");
                  }}
                  style={{ 
                    color: 'var(--text-color)', 
                    cursor: "pointer", 
                    background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)", 
                    padding: "6px 12px", 
                    borderRadius: "8px", 
                    border: `1px solid var(--primary-color)`, 
                    fontWeight: "bold", 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    transition: "all 0.2s ease" 
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.7"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                  title="Copiar CLABE"
                >
                  058164657492400290 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Sticky CTA */}
      <motion.a 
        href={`https://wa.me/${data.contact?.phone || '526561031571'}?text=${encodeURIComponent(getWhatsAppMessage())}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.stickyCta}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 100 }}
      >
        Iniciar Proyecto →
      </motion.a>

      <footer className={styles.footer}>
        {data.config?.agency !== 'apolograma' && (
          <motion.div 
            className={styles.footerDecoration}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Image src="/assets/puerta-juarez.png" alt="Puerta Juárez" className={isLight ? styles.footerDecorationImageLight : styles.footerDecorationImage} width={150} height={183} />
          </motion.div>
        )}
        
        <div className={styles.footerContent}>
          <div className={styles.footerAgencyLogos}>
            {data.config?.agency !== 'fn1' && (
              <Image src="/assets/apolograma-logo-v2.png" alt="Apolograma" width={300} height={50} sizes="(max-width: 768px) 150px, 300px" className={isLight ? styles.footerApologramaLogoLight : styles.footerApologramaLogo} />
            )}
            {data.config?.agency !== 'apolograma' && (
              <Image src={isLight ? "/assets/fn1-logo-purple.png" : "/assets/fn1-logo-white.png"} alt="Frontera Número Uno" width={415} height={43} sizes="(max-width: 768px) 200px, 415px" className={styles.agencyLogoImage} />
            )}
          </div>
          
          {data.config?.agency !== 'apolograma' && (
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
              <a href="https://www.facebook.com/fronteranumberone" target="_blank" rel="noopener noreferrer" style={{ color: isLight ? '#444' : '#fff', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/fronteranumero1/" target="_blank" rel="noopener noreferrer" style={{ color: isLight ? '#444' : '#fff', opacity: 0.8, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          )}

          <p style={{ color: isLight ? '#444' : '#ccc', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} {data.config?.agency === 'apolograma' ? 'Apolograma' : data.config?.agency === 'fn1' ? 'Frontera Número Uno' : 'Frontera Número Uno & Apolograma'}.
          </p>
          <p style={{ color: isLight ? '#444' : '#ccc', fontSize: '0.85rem' }}>
            Propuesta confidencial preparada exclusivamente para {data.clientName}. Vigencia: 30 días naturales.
          </p>
        </div>
      </footer>
    </main>
    </>
  );
}
