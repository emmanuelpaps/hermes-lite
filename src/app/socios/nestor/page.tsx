"use client";

import React, { useState, useRef, useEffect } from "react";
import { Lock, FileText, CheckCircle2, RotateCcw, PenTool, Printer } from "lucide-react";
import styles from "./page.module.css";

export default function NestorComisionesPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [nombre, setNombre] = useState("");
  const [rfc, setRfc] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [signatureData, setSignatureData] = useState("");
  const [signingDate, setSigningDate] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Intentar cargar la firma guardada anteriormente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem("nestor_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }

      const savedNombre = localStorage.getItem("nestor_nombre");
      const savedRfc = localStorage.getItem("nestor_rfc");
      const savedSignature = localStorage.getItem("nestor_signature");
      const savedDate = localStorage.getItem("nestor_date");

      if (savedSignature && savedNombre && savedRfc) {
        setNombre(savedNombre);
        setRfc(savedRfc);
        setSignatureData(savedSignature);
        setSigningDate(savedDate || "");
        setIsSigned(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = "nestor-fn1-2026";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nestor_auth", "true");
      }
      setAuthError("");
    } else {
      setAuthError("Clave incorrecta. Por favor, intenta de nuevo.");
    }
  };

  // Funciones del Canvas de Dibujo
  useEffect(() => {
    if (isAuthenticated && !isSigned && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }

      // Ajustar tamaño del canvas al contenedor físico
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (ctx) {
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, [isAuthenticated, isSigned]);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Eventos táctiles
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    // Eventos de ratón
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSaveSignature = () => {
    if (!nombre.trim() || !rfc.trim()) {
      alert("Por favor introduce tu Nombre Completo y tu RFC antes de firmar.");
      return;
    }
    if (!hasDrawn || !canvasRef.current) {
      alert("Por favor dibuja tu firma en el recuadro.");
      return;
    }

    const dataUrl = canvasRef.current.toDataURL("image/png");
    const today = new Date();
    const dateString = today.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + ` a las ${today.getHours().toString().padStart(2, "0")}:${today.getMinutes().toString().padStart(2, "0")} hrs`;

    setSignatureData(dataUrl);
    setSigningDate(dateString);
    setIsSigned(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("nestor_nombre", nombre);
      localStorage.setItem("nestor_rfc", rfc);
      localStorage.setItem("nestor_signature", dataUrl);
      localStorage.setItem("nestor_date", dateString);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetSignature = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar la firma actual y firmar de nuevo?")) {
      setIsSigned(false);
      setSignatureData("");
      setSigningDate("");
      setHasDrawn(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("nestor_nombre");
        localStorage.removeItem("nestor_rfc");
        localStorage.removeItem("nestor_signature");
        localStorage.removeItem("nestor_date");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={`${styles.container} ${styles.passwordScreen}`}>
          <div className={styles.lockIcon}>
            <Lock size={48} />
          </div>
          <h2>Portal de Comisiones</h2>
          <p>Introduce tu clave de acceso autorizada para visualizar tu tabulador comercial y firmar el acuerdo.</p>
          <form onSubmit={handleLogin} className={styles.passwordForm}>
            <input
              type="password"
              placeholder="Clave de acceso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              autoFocus
            />
            <button type="submit" className={styles.loginBtn}>
              Desbloquear Documento
            </button>
          </form>
          {authError && <p className={styles.errorMsg}>{authError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Cabecera para previsualización e Impresión en PDF */}
        <div className={styles.printHeader}>
          <div className={styles.printHeaderLeft}>
            <h2>FRONTERA NÚMERO UNO S. DE R.L. DE C.V.</h2>
            <p>Esquema Comercial y Acuerdo de Comisiones 2026</p>
          </div>
          <div className={styles.printHeaderRight}>
            <p>Fecha de Impresión: {new Date().toLocaleDateString("es-MX")}</p>
            <p>Estado: {isSigned ? "FIRMADO DE CONFORMIDAD" : "PENDIENTE DE FIRMA"}</p>
          </div>
        </div>

        <div className={styles.header}>
          <div className={styles.logoRow}>
            {/* Logotipo o Acento Textual de Frontera */}
            <span className={styles.badge}>Doc. Oficial y Privado</span>
          </div>
          <h1>Esquema de Comisiones y Políticas Comerciales</h1>
          <p>Socio Comercial Comisionista: <strong>Néstor Ligan</strong></p>
        </div>

        {/* 1. Naturaleza de la Relación */}
        <div className={styles.section}>
          <h2>
            <FileText size={20} />
            1. Naturaleza de la Relación Comercial
          </h2>
          <ul className={styles.textList}>
            <li>
              <strong>Modelo de Trabajo:</strong> Néstor Ligan actúa exclusivamente como comisionista externo e independiente, sin relación de subordinación, exclusividad, sueldo fijo ni prestaciones de ley.
            </li>
            <li>
              <strong>Costo de Operación:</strong> La empresa no cubre viáticos, comidas, transportación ni apoyo de gasolina. Toda la labor comercial se realiza a cuenta y riesgo del comisionista.
            </li>
            <li>
              <strong>Enfoque de Ventas:</strong> Captación en frío de marcas y anunciantes nuevos para difusión en medios propios de <strong>Frontera Número Uno (FN1)</strong> y diseño/desarrollo de software con <strong>Apolograma</strong>.
            </li>
          </ul>
        </div>

        {/* 2. Tabulador Escalable */}
        <div className={styles.section}>
          <h2>
            <FileText size={20} />
            2. Tabulador de Comisiones Escalable (Mensual)
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1rem" }}>
            El porcentaje de comisión de medios (FN1 y JN1) escala mensualmente de manera automática con base en la facturación total acumulada y cobrada de tus ventas en ese mes. La comisión de Apolograma es fija.
          </p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Venta Mensual Acumulada (FN1)</th>
                  <th style={{ textAlign: "center" }}>Comisión FN1 (Medios)</th>
                  <th style={{ textAlign: "center" }}>Comisión Apolograma (Web)</th>
                  <th>Operación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.priceCol}>$1.00 a $10,000.00 MXN</td>
                  <td style={{ textAlign: "center", fontWeight: "700" }} className={styles.commissionCol}>20%</td>
                  <td style={{ textAlign: "center", fontWeight: "700" }}>20%</td>
                  <td>Nivel de entrada. Venta de 1 o 2 notas.</td>
                </tr>
                <tr>
                  <td className={styles.priceCol}>$10,001.00 a $20,000.00 MXN</td>
                  <td style={{ textAlign: "center", fontWeight: "700" }} className={styles.commissionCol}>25%</td>
                  <td style={{ textAlign: "center", fontWeight: "700" }}>20%</td>
                  <td>Nivel avanzado. Venta de 3 o 4 notas.</td>
                </tr>
                <tr>
                  <td className={styles.priceCol}>$20,001.00 MXN o más</td>
                  <td style={{ textAlign: "center", fontWeight: "700" }} className={styles.commissionCol}>30%</td>
                  <td style={{ textAlign: "center", fontWeight: "700" }}>20%</td>
                  <td>Nivel Élite. Venta de 5 o más notas, o igualas.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.callout}>
            <div className={styles.calloutTitle}>💡 Nota sobre el tope de Apolograma:</div>
            <p>
              Debido a los costos y márgenes apretados en el desarrollo de software y diseño, la comisión de Apolograma se mantiene fija al 20% y no escala al 30% bajo ninguna circunstancia.
            </p>
          </div>
        </div>

        {/* 3. Políticas de Control */}
        <div className={styles.section}>
          <h2>
            <FileText size={20} />
            3. Políticas de Control y Protección de Márgenes
          </h2>
          <ul className={styles.textList}>
            <li>
              <strong>Descuentos Proporcionales:</strong> Si otorgas un descuento para cerrar la venta, el porcentaje de descuento se restará directamente de tu porcentaje de comisión de ese producto.
              <div style={{ fontStyle: "italic", background: "rgba(255,255,255,0.03)", padding: "0.5rem 1rem", borderRadius: "6px", margin: "0.5rem 0", borderLeft: "2px solid #555" }}>
                Fórmula: % Comisión Final = % Comisión del Nivel - % Descuento Otorgado
              </div>
              *Ejemplo:* Si estás en Nivel Élite (30% comisión) y otorgas un 10% de descuento a un cliente, tu comisión baja al **20%** sobre la venta real facturada.
            </li>
            <li>
              <strong>Recurrencia en Igualas (Retainers):</strong> En contratos mensuales recurrentes, la comisión se pagará **únicamente sobre los primeros 3 meses de servicio**. El pago de los meses 2 y 3 está condicionado a que el cliente pague su factura.
            </li>
            <li>
              <strong>Cálculo sobre Neto:</strong> Las comisiones se calculan sobre el precio neto de la venta (antes de IVA, retenciones de impuestos, y descontando presupuestos directos de pauta en Meta/Google).
            </li>
            <li>
              <strong>Condición de Pago:</strong> Las comisiones se consideran devengadas y se pagan en la quincena inmediata posterior a que el cobro se vea efectivamente reflejado en la cuenta bancaria de la empresa.
            </li>
          </ul>
        </div>

        {/* 4. Tarifario y Comisiones Detalladas */}
        <div className={styles.section}>
          <h2>
            <FileText size={20} />
            4. Tarifario Oficial y Comisiones Estimadas en Pesos (MXN)
          </h2>

          <h3 style={{ fontSize: "1.1rem", margin: "1.5rem 0 0.5rem 0", color: "#fff" }}>A) Frontera Número Uno (Medio Premium)</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto / Servicio</th>
                  <th>Precio Lista</th>
                  <th>Comisión 20%</th>
                  <th>Comisión 25%</th>
                  <th>Comisión 30%</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: "rgba(255,255,255,0.01)" }}>
                  <td style={{ fontWeight: "700" }} colSpan={5}>I. Igualas de Difusión (Contratos Mensuales - Pagaderos a 3 meses)</td>
                </tr>
                <tr>
                  <td>Tier 1 (Presencia Base)</td>
                  <td className={styles.priceCol}>$14,000.00</td>
                  <td className={styles.commissionCol}>$2,800.00</td>
                  <td className={styles.commissionCol}>$3,500.00</td>
                  <td className={styles.commissionCol}>$4,200.00</td>
                </tr>
                <tr>
                  <td>Tier 2 (Embajador de Marca)</td>
                  <td className={styles.priceCol}>$19,500.00</td>
                  <td className={styles.commissionCol}>$3,900.00</td>
                  <td className={styles.commissionCol}>$4,875.00</td>
                  <td className={styles.commissionCol}>$5,850.00</td>
                </tr>
                <tr>
                  <td>Tier 3 (Dominio Viral)</td>
                  <td className={styles.priceCol}>$32,000.00</td>
                  <td className={styles.commissionCol}>$6,400.00</td>
                  <td className={styles.commissionCol}>$8,000.00</td>
                  <td className={styles.commissionCol}>$9,600.00</td>
                </tr>
                <tr style={{ background: "rgba(255,255,255,0.01)" }}>
                  <td style={{ fontWeight: "700" }} colSpan={5}>II. Productos Sueltos (One-Offs)</td>
                </tr>
                <tr>
                  <td>FN1 Hit (Videoreel)</td>
                  <td className={styles.priceCol}>$13,000.00</td>
                  <td className={styles.commissionCol}>$2,600.00</td>
                  <td className={styles.commissionCol}>$3,250.00</td>
                  <td className={styles.commissionCol}>$3,900.00</td>
                </tr>
                <tr>
                  <td>FN1 Original (FB/IG)</td>
                  <td className={styles.priceCol}>$7,500.00</td>
                  <td className={styles.commissionCol}>$1,500.00</td>
                  <td className={styles.commissionCol}>$1,875.00</td>
                  <td className={styles.commissionCol}>$2,250.00</td>
                </tr>
                <tr>
                  <td>Transmisión en Vivo</td>
                  <td className={styles.priceCol}>$6,500.00</td>
                  <td className={styles.commissionCol}>$1,300.00</td>
                  <td className={styles.commissionCol}>$1,625.00</td>
                  <td className={styles.commissionCol}>$1,950.00</td>
                </tr>
                <tr>
                  <td>Publicación Solo FB</td>
                  <td className={styles.priceCol}>$4,500.00</td>
                  <td className={styles.commissionCol}>$900.00</td>
                  <td className={styles.commissionCol}>$1,125.00</td>
                  <td className={styles.commissionCol}>$1,350.00</td>
                </tr>
                <tr>
                  <td>FN1 Historia</td>
                  <td className={styles.priceCol}>$2,000.00</td>
                  <td className={styles.commissionCol}>$400.00</td>
                  <td className={styles.commissionCol}>$500.00</td>
                  <td className={styles.commissionCol}>$600.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: "1.1rem", margin: "1.5rem 0 0.5rem 0", color: "#fff" }}>B) Juárez Number One (Medio PyME)</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto / Servicio</th>
                  <th>Precio Lista</th>
                  <th>Comisión 20%</th>
                  <th>Comisión 25%</th>
                  <th>Comisión 30%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JN1 Publicación FB</td>
                  <td className={styles.priceCol}>$2,000.00</td>
                  <td className={styles.commissionCol}>$400.00</td>
                  <td className={styles.commissionCol}>$500.00</td>
                  <td className={styles.commissionCol}>$600.00</td>
                </tr>
                <tr>
                  <td>JN1 Historia</td>
                  <td className={styles.priceCol}>$500.00</td>
                  <td className={styles.commissionCol}>$100.00</td>
                  <td className={styles.commissionCol}>$125.00</td>
                  <td className={styles.commissionCol}>$150.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.pageBreak} />

          <h3 style={{ fontSize: "1.1rem", margin: "1.5rem 0 0.5rem 0", color: "#fff" }}>C) Apolograma (Desarrollo Web y Branding)</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Proyecto / Servicio</th>
                  <th>Precio Lista</th>
                  <th>Comisión Fija</th>
                  <th>Tu Ganancia (Pesos)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Branding Básico</td>
                  <td className={styles.priceCol}>$20,000.00</td>
                  <td style={{ color: "#94a3b8" }}>20%</td>
                  <td className={styles.commissionCol}>$4,000.00</td>
                </tr>
                <tr>
                  <td>Branding Corporativo</td>
                  <td className={styles.priceCol}>$40,000.00</td>
                  <td style={{ color: "#94a3b8" }}>20%</td>
                  <td className={styles.commissionCol}>$8,000.00</td>
                </tr>
                <tr>
                  <td>Landing Page</td>
                  <td className={styles.priceCol}>$18,000.00</td>
                  <td style={{ color: "#94a3b8" }}>20%</td>
                  <td className={styles.commissionCol}>$3,600.00</td>
                </tr>
                <tr>
                  <td>Sitio Corporativo</td>
                  <td className={styles.priceCol}>$35,000.00</td>
                  <td style={{ color: "#94a3b8" }}>20%</td>
                  <td className={styles.commissionCol}>$7,000.00</td>
                </tr>
                <tr>
                  <td>E-Commerce Web</td>
                  <td className={styles.priceCol}>$60,000.00</td>
                  <td style={{ color: "#94a3b8" }}>20%</td>
                  <td className={styles.commissionCol}>$12,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Firma Digital */}
        <div className={`${styles.section} ${styles.noPrint}`}>
          {!isSigned ? (
            <div className={styles.signatureSection}>
              <h2 style={{ borderLeftColor: "#10b981", marginBottom: "1rem" }}>
                <PenTool size={20} />
                Aceptación de Conformidad
              </h2>
              <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Dibuja tu firma con tu dedo o puntero en el cuadro blanco de abajo e ingresa tus datos para firmar digitalmente este acuerdo de comisiones.
              </p>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre Completo del Comisionista</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Ej. Néstor Ligan"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={styles.inputField}
                    style={{ textAlign: "left", fontSize: "0.95rem", padding: "0.6rem 0.8rem" }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="rfc">RFC del Comisionista</label>
                  <input
                    type="text"
                    id="rfc"
                    placeholder="Ej. LINNXXXXXX"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                    className={styles.inputField}
                    style={{ textAlign: "left", fontSize: "0.95rem", padding: "0.6rem 0.8rem" }}
                  />
                </div>
              </div>

              <div className={styles.signatureArea}>
                <span className={styles.signatureLabel}>Firma Digital Táctil</span>
                <div className={styles.canvasContainer}>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className={styles.canvas}
                  />
                  {!hasDrawn && (
                    <div className={styles.canvasPlaceholder}>
                      Firme aquí con su dedo o mouse
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.signatureActions}>
                <button onClick={clearCanvas} className={styles.clearBtn}>
                  <RotateCcw size={16} style={{ marginRight: "0.25rem", verticalAlign: "middle" }} />
                  Limpiar
                </button>
                <button
                  onClick={handleSaveSignature}
                  disabled={!hasDrawn || !nombre.trim() || !rfc.trim()}
                  className={styles.signBtn}
                >
                  Confirmar y Firmar
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={64} />
              </div>
              <h2>¡Acuerdo Firmado de Conformidad!</h2>
              <p>
                Tu firma se ha registrado localmente el día <strong>{signingDate}</strong>.<br />
                Haz clic en el botón de abajo para generar y guardar el documento en PDF con tu firma digital integrada.
              </p>
              <div className={styles.downloadRow}>
                <button onClick={handlePrint} className={styles.downloadBtn}>
                  <Printer size={18} />
                  Guardar / Imprimir PDF
                </button>
                <button onClick={handleResetSignature} className={styles.clearBtn}>
                  Firmar de Nuevo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sección de Firma Acumulada (Visible en impresión o si está firmado) */}
        {isSigned && (
          <div className={styles.signedDocumentFooter}>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center", fontStyle: "italic", marginBottom: "2rem" }} className={styles.noPrint}>
              * Vista previa del pie de página firmado que se incluirá en el PDF.
            </p>
            <div className={styles.signatureGrid}>
              <div className={styles.signatureColumn}>
                <div className={styles.signatureLine}>
                  {signatureData && (
                    <img
                      src={signatureData}
                      alt="Firma Néstor Ligan"
                      className={styles.signatureImage}
                    />
                  )}
                </div>
                <p className={styles.signatureTitle}>{nombre || "NÉSTOR LIGAN"}</p>
                <p className={styles.signatureSubtitle}>Comisionista Independiente</p>
                <p className={styles.signatureSubtitle} style={{ fontSize: "0.75rem" }}>RFC: {rfc}</p>
                <p className={styles.signatureSubtitle} style={{ fontSize: "0.7rem", fontStyle: "italic" }}>Firmado digitalmente: {signingDate}</p>
              </div>
              <div className={styles.signatureColumn}>
                <div className={styles.signatureLine} style={{ height: "90px", borderBottom: "1px solid rgba(255,255,255,0.3)" }}>
                  {/* Espacio para firma de Emmanuel / Representante de Tecza */}
                </div>
                <p className={styles.signatureTitle}>TECNOLOGIES TECZA S. DE R.L. DE C.V.</p>
                <p className={styles.signatureSubtitle}>Representante Autorizado</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
