/**
 * @license
 * Automate Webs · Desarrollo de Software y Automatización
 * Raíz principal del proyecto React (src/index.jsx) con Bootstrap 5.3,
 * control global de accesibilidad, carrito de compras y defensa de cuota Google Maps.
 */

import React, { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

import Negocio from './components/Negocio';
import TiendaCatalogo from './components/TiendaCatalogo';
import CrudApp from './components/CrudApp';
import Desarrolladores from './components/Desarrolladores';
import PqrMapa from './components/PqrMapa';
import AsistenteIA from './components/AsistenteIA';
import CarritoOffcanvas from './components/CarritoOffcanvas';
import PasarelaPago from './components/PasarelaPago';
import ValidadorW3cUx from './components/ValidadorW3cUx';
import FooterAccesibilidad from './components/FooterAccesibilidad';
import { EMPRESA_INFO } from './data/initialData';
import { MEDIA_ASSETS } from './data/mediaAssets';
import { helpFetch } from './helpers/helpFetch';

// Defensa de cuota Nivel 1 para Google Maps Platform (Demo Key) antes del montaje de React
if (typeof window !== 'undefined') {
  window.gm_authFailure = () => {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  };
  const origError = console.error;
  console.error = (...args) => {
    origError.apply(console, args);
    const msg = args.map((a) => String(a)).join(' ');
    if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
  };
}

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: 'bi-building' },
  { id: 'tienda', label: 'Tienda', icon: 'bi-bag-check' },
  { id: 'operaciones', label: 'Inventario y CRUD', icon: 'bi-kanban' },
  { id: 'equipo', label: 'Desarrolladores', icon: 'bi-people' },
  { id: 'contacto', label: 'PQR y Mapa', icon: 'bi-geo-alt' },
  { id: 'ia', label: 'Asistente IA', icon: 'bi-stars' },
];

export default function IndexApp() {
  const api = helpFetch();

  const [activeView, setActiveView] = useState('inicio');
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [stats, setStats] = useState({
    productosCount: 0,
    stockTotal: 0,
    clientesCount: 0,
    desarrolladoresCount: 0,
    facturasCount: 0,
    ventasTotal: 0,
  });

  // Carrito y Pasarela de Pago
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [inspectedFactura, setInspectedFactura] = useState(null);

  // Configuración Maps + Cuota Demo Key
  const [mapsApiKey, setMapsApiKey] = useState(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  // Validador W3C / Nielsen UX
  const [validatorOpen, setValidatorOpen] = useState(false);

  // Controles de Accesibilidad (W3C / WCAG)
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const onQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuota);
  }, []);

  // Aplicar preferencias de accesibilidad al elemento raíz <html>
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${fontScale}%`;
    root.classList.toggle('a11y-high-contrast', highContrast);
    root.classList.toggle('a11y-grayscale', grayscale);
    root.classList.toggle('a11y-readable-font', readableFont);
  }, [fontScale, highContrast, grayscale, readableFont]);

  const refreshGlobalData = useCallback(async () => {
    try {
      const [prods, clis, devs, vens, facs] = await Promise.all([
        api.get('/api/productos'),
        api.get('/api/clientes'),
        api.get('/api/desarrolladores'),
        api.get('/api/ventas'),
        api.get('/api/facturas'),
      ]);

      const safeProds = Array.isArray(prods) ? prods : [];
      const safeVens = Array.isArray(vens) ? vens : [];

      setProductos(safeProds);
      setStats({
        productosCount: safeProds.length,
        stockTotal: safeProds.reduce((acc, p) => acc + Number(p.stock ?? 0), 0),
        clientesCount: Array.isArray(clis) ? clis.length : 0,
        desarrolladoresCount: Array.isArray(devs) ? devs.length : 0,
        facturasCount: Array.isArray(facs) ? facs.length : 0,
        ventasTotal: safeVens.reduce((acc, v) => acc + Number(v.valor ?? 0), 0),
      });
    } catch {
      // Silencio seguro si el servidor aún está iniciando
    } finally {
      setLoadingProductos(false);
    }
  }, []);

  useEffect(() => {
    refreshGlobalData();
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      api
        .get('/api/config')
        .then((cfg) => {
          if (cfg && cfg.mapsApiKey) setMapsApiKey(cfg.mapsApiKey);
        })
        .catch(() => {});
    }
  }, [refreshGlobalData]);

  const handleAddToCart = (product) => {
    const maxStock = Number(product.stock ?? 0);
    if (maxStock <= 0) return false;

    let added = false;
    setCart((prev) => {
      const existing = prev.find((it) => String(it.id) === String(product.id));
      if (existing) {
        if (existing.cantidad >= maxStock) return prev;
        added = true;
        return prev.map((it) =>
          String(it.id) === String(product.id)
            ? { ...it, cantidad: it.cantidad + 1 }
            : it
        );
      }
      added = true;
      return [
        ...prev,
        {
          id: product.id,
          sku: product.sku,
          nombre: product.nombre,
          precio: Number(product.precio),
          stock: maxStock,
          cantidad: 1,
        },
      ];
    });
    return added;
  };

  const handleUpdateCartQty = (id, nextQty) => {
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((it) => String(it.id) !== String(id)));
      return;
    }
    const prod = productos.find((p) => String(p.id) === String(id));
    const maxStock = Number(prod?.stock ?? nextQty);
    const boundedQty = Math.min(nextQty, maxStock);

    setCart((prev) =>
      prev.map((it) =>
        String(it.id) === String(id) ? { ...it, cantidad: boundedQty } : it
      )
    );
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const mainText = document.querySelector('main')?.innerText?.slice(0, 600) || EMPRESA_INFO.mision;
    const utterance = new SpeechSynthesisUtterance(
      `${EMPRESA_INFO.razonSocial}. ${mainText}`
    );
    utterance.lang = 'es-CO';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleResetA11y = () => {
    setFontScale(100);
    setHighContrast(false);
    setGrayscale(false);
    setReadableFont(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const totalCartItems = cart.reduce((acc, it) => acc + it.cantidad, 0);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* Banner requerido por Google Maps Platform Demo Key si excede cuota */}
      {gmpQuotaExceeded && (
        <div className="aw-gmp-quota-banner" role="alert">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="fw-semibold text-decoration-underline"
              style={{ color: '#451a03' }}
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Barra Superior de Accesibilidad (W3C / WCAG) */}
      <div className="bg-dark text-white py-1 px-3 small no-print">
        <div className="container-xl d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-none d-md-block text-light opacity-75">
            {EMPRESA_INFO.razonSocial} · {EMPRESA_INFO.tagline}
          </div>
          <div
            className="d-flex flex-wrap align-items-center gap-1 ms-auto"
            role="group"
            aria-label="Herramientas de accesibilidad web"
          >
            <span className="me-1 opacity-75">Accesibilidad:</span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm py-0 px-2"
              aria-label="Reducir tamaño de fuente"
              onClick={() => setFontScale((prev) => Math.max(85, prev - 10))}
            >
              A-
            </button>
            <button
              type="button"
              className="btn btn-outline-light btn-sm py-0 px-2"
              aria-label="Aumentar tamaño de fuente"
              onClick={() => setFontScale((prev) => Math.min(130, prev + 10))}
            >
              A+
            </button>
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 ${
                highContrast ? 'btn-warning text-dark fw-bold' : 'btn-outline-light'
              }`}
              aria-pressed={highContrast}
              onClick={() => setHighContrast((prev) => !prev)}
            >
              <i className="bi bi-circle-half me-1" aria-hidden="true"></i>
              Contraste
            </button>
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 ${
                grayscale ? 'btn-light text-dark fw-bold' : 'btn-outline-light'
              }`}
              aria-pressed={grayscale}
              onClick={() => setGrayscale((prev) => !prev)}
            >
              Escala Grises
            </button>
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 ${
                readableFont ? 'btn-info text-dark fw-bold' : 'btn-outline-light'
              }`}
              aria-pressed={readableFont}
              onClick={() => setReadableFont((prev) => !prev)}
            >
              Lectura Fácil
            </button>
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 ${
                speaking ? 'btn-success' : 'btn-outline-light'
              }`}
              aria-pressed={speaking}
              onClick={handleToggleSpeech}
            >
              <i className="bi bi-volume-up me-1" aria-hidden="true"></i>
              {speaking ? 'Detener Voz' : 'Leer'}
            </button>
            <button
              type="button"
              className="btn btn-link btn-sm text-light py-0 px-2 text-decoration-none"
              aria-label="Restablecer accesibilidad"
              onClick={handleResetA11y}
            >
              Restablecer
            </button>
          </div>
        </div>
      </div>

      {/* Navbar Principal Bootstrap 5 */}
      <header className="bg-white border-bottom sticky-top no-print">
        <nav className="navbar navbar-expand-lg navbar-light py-2" aria-label="Navegación principal">
          <div className="container-xl">
            <button
              type="button"
              className="navbar-brand btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 border-0"
              onClick={() => setActiveView('inicio')}
            >
              <img
                src={MEDIA_ASSETS.logo}
                alt="Logotipo oficial de Automate Webs"
                className="aw-logo-img"
                referrerPolicy="no-referrer"
              />
              <span className="text-start">
                <span className="d-block fw-bold text-dark lh-1 fs-5">
                  {EMPRESA_INFO.razonSocial}
                </span>
                <span className="d-block text-secondary" style={{ fontSize: '0.72rem' }}>
                  Software & Automatización
                </span>
              </span>
            </button>

            <div className="d-flex align-items-center gap-2 order-lg-3">
              <button
                type="button"
                className="btn btn-dark btn-sm position-relative px-3 py-2 fw-semibold"
                onClick={() => setCartOpen(true)}
                aria-label={`Abrir carrito de compras (${totalCartItems} artículos)`}
              >
                <i className="bi bi-cart3 me-1" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">Carrito</span>
                {totalCartItems > 0 && (
                  <span className="badge rounded-pill text-bg-primary ms-2 font-mono">
                    {totalCartItems}
                  </span>
                )}
              </button>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavbarContent"
                aria-controls="mainNavbarContent"
                aria-expanded="false"
                aria-label="Mostrar menú"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse order-lg-2" id="mainNavbarContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id} className="nav-item">
                    <button
                      type="button"
                      className={`nav-link btn btn-link border-0 px-3 py-2 text-nowrap ${
                        activeView === item.id
                          ? 'fw-bold text-dark bg-light rounded-2'
                          : 'text-secondary'
                      }`}
                      onClick={() => setActiveView(item.id)}
                    >
                      <i className={`bi ${item.icon} me-1`} aria-hidden="true"></i>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main id="contenido-principal" className="flex-grow-1">
        {activeView === 'inicio' && (
          <Negocio
            onNavigate={(view) => setActiveView(view)}
            stats={stats}
            onOpenW3cValidator={() => setValidatorOpen(true)}
          />
        )}

        {activeView === 'tienda' && (
          <TiendaCatalogo
            productos={productos}
            loading={loadingProductos}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setCartOpen(true)}
            onNavigate={(view) => setActiveView(view)}
          />
        )}

        {activeView === 'operaciones' && (
          <CrudApp
            initialEntity="productos"
            onDataMutated={refreshGlobalData}
            onOpenFacturaModal={(factura) => {
              setInspectedFactura(factura);
              setCheckoutOpen(true);
            }}
          />
        )}

        {activeView === 'equipo' && (
          <Desarrolladores onDataMutated={refreshGlobalData} />
        )}

        {activeView === 'contacto' && <PqrMapa mapsApiKey={mapsApiKey} />}

        {activeView === 'ia' && (
          <AsistenteIA onNavigate={(view) => setActiveView(view)} />
        )}
      </main>

      <FooterAccesibilidad
        onNavigate={(view) => setActiveView(view)}
        onOpenValidator={() => setValidatorOpen(true)}
      />

      <CarritoOffcanvas
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        productos={productos}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={(id) =>
          setCart((prev) => prev.filter((it) => String(it.id) !== String(id)))
        }
        onClearCart={() => setCart([])}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setInspectedFactura(null);
          setCheckoutOpen(true);
        }}
      />

      <PasarelaPago
        isOpen={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
          setInspectedFactura(null);
        }}
        cart={cart}
        existingFactura={inspectedFactura}
        onPaymentSuccess={async () => {
          setCart([]);
          await refreshGlobalData();
        }}
      />

      <ValidadorW3cUx
        isOpen={validatorOpen}
        onClose={() => setValidatorOpen(false)}
      />
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <IndexApp />
    </StrictMode>
  );
}
