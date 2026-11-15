/**
 * Vista corporativa principal de Automate Webs
 * Incluye carrusel publicitario de 5 imágenes, KPIs en vivo, Acordeón empresarial
 * (Misión, Visión, Objetivos), Tratamiento de Datos Personales y Redes Sociales.
 */

import React, { useState } from 'react';
import {
  EMPRESA_INFO,
  POLITICA_DATOS_INFO,
  PROMO_SLIDES,
  REDES_SOCIALES,
} from '../data/initialData';
import { resolveMediaAsset } from '../data/mediaAssets';
import { formatCurrencyCOP } from '../helpers/helpFetch';

export default function Negocio({ onNavigate, stats, onOpenW3cValidator }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? PROMO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === PROMO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container-xl py-4 py-lg-5">
      {/* Encabezado Comercial de Marca */}
      <section className="row align-items-center g-4 mb-4">
        <div className="col-lg-8">
          <span className="badge text-bg-dark text-uppercase mb-2 px-3 py-2">
            Ingeniería de Software · Bogotá D.C.
          </span>
          <h1 className="display-6 fw-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
            {EMPRESA_INFO.razonSocial}: {EMPRESA_INFO.tagline}
          </h1>
          <p className="lead text-secondary mb-0 fs-6">
            Diseñamos plataformas web escalables, automatización RPA, comercio electrónico con pagos locales e inteligencia artificial aplicada a tu inventario.
          </p>
        </div>
        <div className="col-lg-4 d-flex flex-wrap gap-2 justify-content-lg-end">
          <button
            type="button"
            className="btn btn-dark px-3 py-2 fw-semibold"
            onClick={() => onNavigate('tienda')}
          >
            <i className="bi bi-bag-check me-2" aria-hidden="true"></i>
            Ir a la Tienda
          </button>
          <button
            type="button"
            className="btn btn-outline-dark px-3 py-2 fw-semibold"
            onClick={() => onNavigate('ia')}
          >
            <i className="bi bi-stars me-2" aria-hidden="true"></i>
            Asistente IA
          </button>
        </div>
      </section>

      {/* Carrusel Publicitario de 5 Imágenes (Bootstrap 5) */}
      <section aria-label="Galería promocional de soluciones Automate Webs" className="mb-5">
        <div id="automateCarousel" className="carousel slide aw-carousel-frame shadow-sm">
          <div className="carousel-indicators">
            {PROMO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={idx === activeSlide ? 'active' : ''}
                aria-current={idx === activeSlide ? 'true' : 'false'}
                aria-label={`Diapositiva ${idx + 1}: ${slide.etiqueta}`}
                onClick={() => setActiveSlide(idx)}
              ></button>
            ))}
          </div>

          <div className="carousel-inner h-100">
            {PROMO_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`carousel-item h-100 ${idx === activeSlide ? 'active' : ''}`}
              >
                <img
                  src={resolveMediaAsset(slide.imagenKey)}
                  alt={`${slide.etiqueta} - ${slide.titulo}`}
                  className="aw-carousel-img"
                  referrerPolicy="no-referrer"
                />
                <div className="aw-carousel-scrim"></div>
                <div className="carousel-caption text-start d-flex flex-column justify-content-center h-100 start-0 end-0 px-4 px-md-5 pb-4">
                  <div style={{ maxWidth: '640px' }}>
                    <span className="badge text-bg-primary mb-2 px-3 py-2">
                      {slide.etiqueta} · {idx + 1} / {PROMO_SLIDES.length}
                    </span>
                    <h2 className="h2 fw-bold text-white mb-2">{slide.titulo}</h2>
                    <p className="text-light opacity-90 mb-3">{slide.descripcion}</p>
                    <button
                      type="button"
                      className="btn btn-light fw-semibold px-4 py-2"
                      onClick={() => onNavigate(slide.ctaVista)}
                    >
                      {slide.ctaTexto}
                      <i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            aria-label="Diapositiva anterior"
            onClick={handlePrevSlide}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            aria-label="Diapositiva siguiente"
            onClick={handleNextSlide}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </section>

      {/* Indicadores Operativos en Vivo */}
      <section aria-label="Indicadores comerciales" className="row g-3 mb-5">
        <div className="col-6 col-lg-3">
          <div className="aw-card p-3 h-100">
            <div className="text-secondary small fw-semibold mb-1">Soluciones en Tienda</div>
            <div className="fs-3 fw-bold font-mono">{stats.productosCount}</div>
            <div className="small text-success">
              <i className="bi bi-box-seam me-1" aria-hidden="true"></i>
              {stats.stockTotal} licencias en stock
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="aw-card p-3 h-100">
            <div className="text-secondary small fw-semibold mb-1">Clientes Corporativos</div>
            <div className="fs-3 fw-bold font-mono">{stats.clientesCount}</div>
            <div className="small text-secondary">Cobertura nacional</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="aw-card p-3 h-100">
            <div className="text-secondary small fw-semibold mb-1">Equipo de Ingeniería</div>
            <div className="fs-3 fw-bold font-mono">{stats.desarrolladoresCount}</div>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
              onClick={() => onNavigate('equipo')}
            >
              Ver perfiles y contactos <i className="bi bi-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="aw-card p-3 h-100">
            <div className="text-secondary small fw-semibold mb-1">Facturación Acumulada</div>
            <div className="fs-4 fw-bold font-mono">{formatCurrencyCOP(stats.ventasTotal)}</div>
            <div className="small text-secondary">{stats.facturasCount} facturas emitidas</div>
          </div>
        </div>
      </section>

      {/* Identidad Corporativa en Acordeón Bootstrap 5 + Datos Empresariales */}
      <section className="row g-4 mb-5 align-items-start">
        <div className="col-lg-7">
          <div className="aw-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="h4 fw-bold mb-1">Identidad Corporativa</h2>
                <p className="text-secondary small mb-0">
                  Misión, Visión y Objetivos Estratégicos de {EMPRESA_INFO.razonSocial}
                </p>
              </div>
              <span className="badge text-bg-light border font-mono">NIT {EMPRESA_INFO.nit}</span>
            </div>

            <div className="accordion" id="accordionEmpresa">
              <div className="accordion-item">
                <h3 className="accordion-header" id="headingMision">
                  <button
                    className="accordion-button fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseMision"
                    aria-expanded="true"
                    aria-controls="collapseMision"
                  >
                    <i className="bi bi-compass me-2 text-primary" aria-hidden="true"></i>
                    Misión Empresarial
                  </button>
                </h3>
                <div
                  id="collapseMision"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingMision"
                  data-bs-parent="#accordionEmpresa"
                >
                  <div className="accordion-body text-secondary">{EMPRESA_INFO.mision}</div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingVision">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseVision"
                    aria-expanded="false"
                    aria-controls="collapseVision"
                  >
                    <i className="bi bi-eye me-2 text-primary" aria-hidden="true"></i>
                    Visión 2030
                  </button>
                </h3>
                <div
                  id="collapseVision"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingVision"
                  data-bs-parent="#accordionEmpresa"
                >
                  <div className="accordion-body text-secondary">{EMPRESA_INFO.vision}</div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingObjGeneral">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseObjGeneral"
                    aria-expanded="false"
                    aria-controls="collapseObjGeneral"
                  >
                    <i className="bi bi-bullseye me-2 text-primary" aria-hidden="true"></i>
                    Objetivo General
                  </button>
                </h3>
                <div
                  id="collapseObjGeneral"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingObjGeneral"
                  data-bs-parent="#accordionEmpresa"
                >
                  <div className="accordion-body text-secondary">{EMPRESA_INFO.objetivoGeneral}</div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header" id="headingObjEsp">
                  <button
                    className="accordion-button collapsed fw-semibold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseObjEsp"
                    aria-expanded="false"
                    aria-controls="collapseObjEsp"
                  >
                    <i className="bi bi-list-check me-2 text-primary" aria-hidden="true"></i>
                    Objetivos Específicos ({EMPRESA_INFO.objetivosEspecificos.length})
                  </button>
                </h3>
                <div
                  id="collapseObjEsp"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingObjEsp"
                  data-bs-parent="#accordionEmpresa"
                >
                  <div className="accordion-body">
                    <ul className="mb-0 ps-3 text-secondary">
                      {EMPRESA_INFO.objetivosEspecificos.map((obj, idx) => (
                        <li key={idx} className="mb-2">
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canales Oficiales y Redes Sociales */}
        <div className="col-lg-5">
          <div className="aw-card p-4 h-100">
            <h2 className="h4 fw-bold mb-1">Redes Sociales y Atención</h2>
            <p className="text-secondary small mb-3">
              Conecta directamente con nuestros canales digitales oficiales y soporte comercial.
            </p>

            <div className="row g-2 mb-4">
              {REDES_SOCIALES.map((red) => (
                <div key={red.id} className="col-6">
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn ${red.colorClass} w-100 text-start d-flex align-items-center gap-2 py-2 px-3`}
                  >
                    <i className={`bi ${red.icono} fs-5`} aria-hidden="true"></i>
                    <span className="text-truncate">
                      <span className="d-block fw-semibold small">{red.nombre}</span>
                      <span className="d-block text-truncate" style={{ fontSize: '0.72rem' }}>
                        {red.handle}
                      </span>
                    </span>
                  </a>
                </div>
              ))}
            </div>

            <div className="border-top pt-3 small text-secondary">
              <div className="mb-2">
                <i className="bi bi-geo-alt-fill text-dark me-2" aria-hidden="true"></i>
                <strong>Sede Principal:</strong> {EMPRESA_INFO.direccion}
              </div>
              <div className="mb-2">
                <i className="bi bi-telephone-fill text-dark me-2" aria-hidden="true"></i>
                <strong>Línea de Atención:</strong> {EMPRESA_INFO.telefono} · {EMPRESA_INFO.celular}
              </div>
              <div className="mb-3">
                <i className="bi bi-clock-fill text-dark me-2" aria-hidden="true"></i>
                <strong>Horario:</strong> {EMPRESA_INFO.horario}
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => onNavigate('contacto')}
                >
                  <i className="bi bi-map me-1" aria-hidden="true"></i>
                  Ver Mapa y PQR
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={onOpenW3cValidator}
                >
                  <i className="bi bi-shield-check me-1" aria-hidden="true"></i>
                  Auditoría W3C y UX
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apartado de Manejo de Datos Personales */}
      <section
        id="politica-datos"
        aria-labelledby="titulo-datos-personales"
        className="aw-card p-4 p-lg-5 bg-white"
      >
        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <span className="badge text-bg-light border text-dark mb-2">
              Cumplimiento Normativo · Habeas Data
            </span>
            <h2 id="titulo-datos-personales" className="h4 fw-bold mb-2">
              Política de Tratamiento y Manejo de Datos Personales
            </h2>
            <p className="text-secondary small mb-3">
              En cumplimiento de la <strong>{POLITICA_DATOS_INFO.leyAplicable}</strong>,{' '}
              <strong>{POLITICA_DATOS_INFO.responsable}</strong> garantiza la protección, reserva y uso ético de la información personal recolectada en formularios de compra, facturación y PQR.
            </p>
            <div className="row g-3 small">
              <div className="col-md-6">
                <h3 className="h6 fw-bold mb-2">Finalidades del Tratamiento</h3>
                <ul className="ps-3 text-secondary mb-0">
                  {POLITICA_DATOS_INFO.finalidades.map((item, idx) => (
                    <li key={idx} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <h3 className="h6 fw-bold mb-2">Derechos del Titular (ARCO)</h3>
                <ul className="ps-3 text-secondary mb-0">
                  {POLITICA_DATOS_INFO.derechosArco.map((item, idx) => (
                    <li key={idx} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-3 rounded-3 bg-light border">
              <div className="fw-bold small mb-1">
                <i className="bi bi-lock-fill text-success me-2" aria-hidden="true"></i>
                Canal Oficial de Privacidad
              </div>
              <p className="small text-secondary mb-3">{POLITICA_DATOS_INFO.canalAtencion}</p>
              <button
                type="button"
                className="btn btn-dark btn-sm w-100"
                onClick={() => onNavigate('contacto')}
              >
                Ejercer Derechos ARCO vía PQR
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
