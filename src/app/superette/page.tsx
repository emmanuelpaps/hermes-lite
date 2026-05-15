"use client";

import React, { useEffect } from 'react';
import Head from 'next/head';

export default function SuperettePage() {
  useEffect(() => {
    // Scroll Reveal Animation
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          if (entry.target.querySelector('#counter') && !(window as any).counterAnimated) {
            animateValue("counter", 0, 235400, 1500);
            (window as any).counterAnimated = true;
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    function animateValue(id: string, start: number, end: number, duration: number) {
      const obj = document.getElementById(id);
      if (!obj) return;
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.floor(easeProgress * (end - start) + start);
        obj.innerHTML = currentVal.toLocaleString('en-US');
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --bg-color: #0b140e;
          --surface-color: rgba(255, 255, 255, 0.95);
          --primary-color: #059669; /* Green from the gradient */
          --primary-dark: #047857;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border-color: #e2e8f0;
          --font-body: 'Inter', sans-serif;
          --font-heading: 'PaperTigerSerif', serif;
        }

        body {
          background-color: var(--bg-color);
          background-image: url('/assets/superette/Superette_Green_Gradient.png');
          background-size: cover;
          background-attachment: fixed;
          background-position: center;
          color: var(--text-main);
          font-family: var(--font-body);
          margin: 0;
          padding: 3rem 1.5rem;
          line-height: 1.7;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          background: var(--surface-color);
          backdrop-filter: blur(10px);
          padding: 4rem;
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          border-top: 8px solid var(--primary-color);
        }

        .hero-logo { height: 90px; max-width: 100%; object-fit: contain; margin: 0 auto 2rem; display: block; }
        
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        
        .header { text-align: center; margin-bottom: 4rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border-color); }
        .header h1 { font-family: var(--font-heading); font-size: 3.5rem; font-weight: normal; color: var(--text-main); letter-spacing: 1px; margin: 0 0 1rem 0; line-height: 1.1; }
        .header p { font-size: 1.25rem; color: var(--text-muted); margin: 0 auto; max-width: 700px; }

        .chapter { margin-bottom: 5rem; }
        .chapter-title { font-size: 1.8rem; font-weight: 700; color: var(--text-main); border-bottom: 2px solid var(--primary-color); padding-bottom: 0.8rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
        .chapter-title span { color: var(--primary-color); }

        .highlight-box { background: rgba(5, 150, 105, 0.05); border-left: 4px solid var(--primary-color); padding: 1.8rem; margin: 2rem 0; border-radius: 0 8px 8px 0; }
        .highlight-box strong { color: var(--primary-dark); font-size: 1.1rem; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0; }
        
        .card { background: #fff; padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(5, 150, 105, 0.1); }
        .card h4 { color: var(--primary-color); margin-top: 0; font-size: 1.1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        ul { padding-left: 1.2rem; margin-top: 0.5rem; }
        li { margin-bottom: 0.8rem; color: var(--text-main); }

        table { width: 100%; border-collapse: collapse; margin: 2rem 0; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); }
        th, td { text-align: left; padding: 1.5rem; border-bottom: 1px solid var(--border-color); }
        th { background: #f8fafc; color: var(--text-main); font-weight: 600; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background-color: rgba(5, 150, 105, 0.02); }
        .price-highlight { color: var(--primary-color); font-weight: 700; font-size: 1.2rem; }

        .cta-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #25D366;
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
          transition: transform 0.3s;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cta-btn:hover { transform: scale(1.05); }

        @media (max-width: 768px) {
          body { padding: 1rem 0; }
          .container { padding: 1.5rem; border-radius: 0; border-top: 6px solid var(--primary-color); }
          .header h1 { font-size: 2.2rem; }
          .grid-2 { grid-template-columns: 1fr; }
          table { display: block; overflow-x: auto; white-space: normal; }
          .cta-btn { bottom: 1rem; right: 1rem; padding: 0.8rem 1.5rem; font-size: 1rem; }
        }
      `}</style>

      <a href="https://wa.me/526566575959?text=Hola%20Jesús,%20revisé%20la%20propuesta%20de%20Superette%20y%20estamos%20listos%20para%20avanzar." target="_blank" rel="noreferrer" className="cta-btn">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Aprobar Propuesta
      </a>

      <div className="container">
        <img src="/assets/superette/Superette_Red.png" alt="Superette Logo" className="hero-logo reveal" />
        
        <div className="header">
          <h1>Transformación Operativa Gráfica</h1>
          <p>Propuesta Ejecutiva de Célula de Maquila y Optimización de Tráfico para Superette</p>
        </div>

        <div className="chapter reveal">
          <div className="chapter-title"><span>01.</span> El Desafío del Volumen</div>
          <p>Con más de 35 sucursales operando en el ritmo más exigente de retail en la ciudad, entendemos que la mercadotecnia de Superette no se trata simplemente de "diseñar postales"; se trata de sostener una <strong>maquinaria industrial de comunicación</strong>.</p>
          <p>Al auditar sus necesidades operativas, identificamos la gestión simultánea de múltiples frentes de trabajo crítico (Lonas, Prensas, Etiquetas, Embudos Digitales). Este volumen masivo exige más que creatividad: exige precisión matemática.</p>

          <div className="highlight-box">
            <strong>Diagnóstico Operativo:</strong><br/><br/>
            Sabemos que el volumen actual de entregables genera cuellos de botella naturales. Cuando la carga de trabajo supera la capacidad instalada interna, el riesgo de errores tipográficos y fallas en los medios impresos aumenta drásticamente, lo cual se traduce en fricción operativa. Nuestro objetivo es erradicar ese dolor de raíz.
          </div>
        </div>

        <div className="chapter reveal">
          <div className="chapter-title"><span>02.</span> La Solución: Célula Dedicada</div>
          <p>Proponemos la instalación de una <strong>Célula de Operación Gráfica y Digital</strong> que funcione como un brazo externo de su empresa.</p>
          <p>Alinearemos una capacidad instalada equivalente a <strong>6 posiciones de tiempo completo</strong>, asumiendo la carga laboral, los costos de licencias, y la curva de estrés para darles absoluta paz mental.</p>

          <div className="grid-2">
            <div className="card">
              <h4>Estructura de la Célula</h4>
              <ul>
                <li><strong>Dirección de Arte:</strong> Control de calidad visual.</li>
                <li><strong>Revisión para Imprenta:</strong> Reducción estricta de errores críticos antes de producción.</li>
                <li><strong>Diseñadores de Adaptación:</strong> Velocidad para lonas y folletos.</li>
                <li><strong>Gestión de Pauta (Publicidad):</strong> Optimización diaria de campañas.</li>
                <li><strong>Equipo Audiovisual:</strong> Producción en piso de venta.</li>
              </ul>
            </div>
            <div className="card">
              <h4>Acuerdos de Servicio (SLAs)</h4>
              <p>Velocidad garantizada (Lun - Vie, 8 AM a 5 PM):</p>
              <ul>
                <li><strong>Lonas Express:</strong> 24h a 36h hábiles.</li>
                <li><strong>Planas de Prensa:</strong> 48h hábiles.</li>
                <li><strong>Volantes Digitales:</strong> 24h hábiles.</li>
                <li><strong>Videografía (Reels):</strong> 4 días hábiles post-llamado.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="chapter reveal">
          <div className="chapter-title"><span>03.</span> El Ecosistema de Entregables</div>
          <p>Nuestra célula asumirá la gestión integral de sus necesidades gráficas hasta cubrir el techo operativo proyectado de <strong>~197 entregables mensuales</strong>, absorbiendo su operación actual.</p>

          <table>
            <thead>
              <tr>
                <th>Centro de Costo</th>
                <th>Volumen Operativo (Mensual)</th>
                <th>Inversión</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Maquila Gráfica y Revisión de Imprenta</strong><br/><span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Impresos, Gran Formato y BTL</span></td>
                <td><strong>~118 Artes:</strong> Incluye 54 Lonas, 36 adaptaciones POP, 16 Planas de Periódico y 12 Tótems. Incluye filtro anti-errores.</td>
                <td className="price-highlight">$116,400 MXN</td>
              </tr>
              <tr>
                <td><strong>2. Ecosistema Digital Masivo</strong><br/><span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Ofertas Flash y Redes Sociales</span></td>
                <td><strong>~71 Entregables:</strong> 48 Volantes Digitales, 15 Posts Estáticos, 8 Banners.</td>
                <td className="price-highlight">$49,000 MXN</td>
              </tr>
              <tr>
                <td><strong>3. Producción Premium y Gestión de Pauta</strong><br/><span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Audiovisual y Meta Ads</span></td>
                <td><strong>8 Entregables Core:</strong> 4 Notas PR, 2 Reels In-Situ, 2 Lives. Incluye el Fee de Gestión de Campañas.</td>
                <td className="price-highlight">$70,000 MXN</td>
              </tr>
              <tr>
                <td><strong>4. Servicios Especiales (Fuera de Iguala)</strong><br/><span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Campañas Anuales</span></td>
                <td>Desarrollo y creación de campañas macro (Aniversarios, Navidades). Se cotizan por proyecto.</td>
                <td className="price-highlight">Por Cotizar</td>
              </tr>
              <tr>
                <td colSpan={2} style={{textAlign:'right', fontWeight:700}}>INVERSIÓN TOTAL MENSUAL</td>
                <td className="price-highlight" style={{fontSize:'1.4rem'}}>$<span id="counter">0</span> MXN</td>
              </tr>
            </tbody>
          </table>
          <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right'}}>*Nota: El presupuesto de pauta publicitaria (Ad Spend) corre a cuenta de Superette.</p>
        </div>

        <div className="chapter reveal">
          <div className="chapter-title"><span>04.</span> Transición y Métricas de Éxito</div>
          
          <p>Sabemos que la operación no puede detenerse. Proponemos un <strong>Plan de Transición Exprés de 15 Días</strong> para auditar sus archivos y realizar operación en paralelo. Adicionalmente, 2 de nuestros especialistas participarán en sus instalaciones durante 2 jornadas completas para empaparse del ADN de la empresa.</p>

          <div className="highlight-box" style={{marginTop: '1rem'}}>
            <strong>Métricas de Éxito Comerciales:</strong><br/><br/>
            Nuestra gestión no se evalúa por vanidad, sino por tráfico a piso de venta. Mediremos nuestro impacto a través de:
            <ul>
              <li><strong>Costo Por Clic (CPC):</strong> Optimización para abaratar la distribución de volantes digitales.</li>
              <li><strong>Alcance Geolocalizado (Reach):</strong> Impactos a un radio de 3KM de cada sucursal.</li>
              <li><strong>Retención Audiovisual:</strong> Engagement en nuestras producciones In-Situ.</li>
            </ul>
          </div>
        </div>

      </div>
    </>
  );
}
