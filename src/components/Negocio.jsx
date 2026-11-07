/**
 * @license
 * Proyecto: Automate Webs
 * Razón Social / Tagline: Desarrollo de Software y Automatización
 * Componente: Negocio.jsx
 * Diseño corporativo, sobrio, minimalista y de alto impacto comercial.
 */

import React from 'react';
import { EMPRESA_INFO } from '../data/initialData';

export default function Negocio({ onNavigateToCrud, stats }) {
  const {
    razonSocial,
    tagline,
    nit,
    sector,
    mision,
    vision,
    objetivoGeneral,
    objetivosEspecificos,
    direccion,
    telefono,
    email,
  } = EMPRESA_INFO;

  const ventasTotal = Number(stats?.ventasTotal || 0);
  const comprasTotal = Number(stats?.comprasTotal || 0);
  const margenNeto = ventasTotal - comprasTotal;

  const pilaresTecnicos = [
    {
      titulo: 'Desarrollo Web & Aplicaciones Cloud',
      desc: 'Plataformas web empresariales, arquitecturas escalables, portales autogestionables e interfaces de alto rendimiento.',
      icon: 'bi-window-stack',
    },
    {
      titulo: 'Automatización de Procesos RPA',
      desc: 'Bots de software para conciliaciones bancarias, procesamiento de documentos, facturación electrónica y tareas repetitivas.',
      icon: 'bi-robot',
    },
    {
      titulo: 'Microservicios & Pasarelas de Pago',
      desc: 'Integración fluida y segura de APIs RESTful, webhooks, pasarelas bancarias y sincronización de datos en tiempo real.',
      icon: 'bi-hdd-network',
    },
    {
      titulo: 'Soporte Continuo & Alta Disponibilidad',
      desc: 'Monitoreo preventivo 24/7, parches de seguridad, optimización de infraestructura y backups automatizados.',
      icon: 'bi-shield-check',
    },
  ];

  return (
    <div className="container py-5" style={{ maxWidth: '1200px' }}>
      {/* Hero Comercial Automate Webs */}
      <section className="mb-5 pb-4 border-bottom border-subtle-custom">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 inline-block"></span>
              {razonSocial} · {tagline} · NIT {nit}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 mb-3" style={{ textWrap: 'balance' }}>
              {razonSocial}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mb-4 font-normal">
              {mision}
            </p>

            {/* Acciones Rápidas */}
            <div className="d-flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                className="btn btn-dark btn-sm px-3.5 py-2 fw-medium rounded-md shadow-2xs d-inline-flex align-items-center gap-1.5"
                onClick={() => onNavigateToCrud('productos')}
              >
                <i className="bi bi-box-seam"></i>
                <span>Catálogo de Soluciones</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3.5 py-2 fw-medium rounded-md d-inline-flex align-items-center gap-1.5 bg-white"
                onClick={() => onNavigateToCrud('clientes')}
              >
                <i className="bi bi-people"></i>
                <span>Directorio de Clientes</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3.5 py-2 fw-medium rounded-md d-inline-flex align-items-center gap-1.5 bg-white"
                onClick={() => onNavigateToCrud('ventas')}
              >
                <i className="bi bi-graph-up"></i>
                <span>Control de Operaciones</span>
              </button>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card-minimal p-4 bg-white">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 font-mono">
                Ficha de Empresa
              </div>
              <dl className="text-xs space-y-2.5 mb-0">
                <div className="d-flex justify-content-between py-1 border-bottom border-slate-100">
                  <dt className="text-slate-500 font-normal">Proyecto</dt>
                  <dd className="font-bold text-slate-900 mb-0 text-end">{razonSocial}</dd>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-slate-100">
                  <dt className="text-slate-500 font-normal">Razón / Especialidad</dt>
                  <dd className="font-medium text-slate-900 mb-0 text-end">{tagline}</dd>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-slate-100">
                  <dt className="text-slate-500 font-normal">NIT Registrado</dt>
                  <dd className="font-mono text-slate-900 mb-0 text-end">{nit}</dd>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-slate-100">
                  <dt className="text-slate-500 font-normal">Sede Operativa</dt>
                  <dd className="text-slate-700 mb-0 text-end">{direccion}</dd>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <dt className="text-slate-500 font-normal">Contacto Oficial</dt>
                  <dd className="font-mono text-slate-900 mb-0 text-end">{email}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Indicadores Financieros & Operacionales */}
      <section className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0 font-mono">
            Balance Comercial y Operativo
          </h2>
          <span className="text-2xs text-slate-400 font-mono">
            Automate Webs Dashboard
          </span>
        </div>

        <div className="row g-3">
          <div className="col-sm-6 col-lg-3">
            <div
              className="card-minimal p-3.5 cursor-pointer bg-white"
              onClick={() => onNavigateToCrud('ventas')}
              role="button"
            >
              <div className="text-xs text-slate-500 mb-1">Facturación Total (Ventas)</div>
              <div className="text-xl font-bold font-mono text-slate-900">
                ${ventasTotal.toLocaleString('es-CO')}
              </div>
              <div className="text-xs text-slate-500 mt-1 d-flex align-items-center gap-1">
                <span className="font-mono font-semibold text-slate-700">{stats?.ventasCount || 0}</span> contratos ejecutados
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div
              className="card-minimal p-3.5 cursor-pointer bg-white"
              onClick={() => onNavigateToCrud('compras')}
              role="button"
            >
              <div className="text-xs text-slate-500 mb-1">Infraestructura & Software</div>
              <div className="text-xl font-bold font-mono text-slate-900">
                ${comprasTotal.toLocaleString('es-CO')}
              </div>
              <div className="text-xs text-slate-500 mt-1 d-flex align-items-center gap-1">
                <span className="font-mono font-semibold text-slate-700">{stats?.comprasCount || 0}</span> adquisiciones registradas
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card-minimal p-3.5 bg-white">
              <div className="text-xs text-slate-500 mb-1">Margen Operativo Neto</div>
              <div className={`text-xl font-bold font-mono ${margenNeto >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                ${margenNeto.toLocaleString('es-CO')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Rentabilidad positiva
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div
              className="card-minimal p-3.5 cursor-pointer bg-white"
              onClick={() => onNavigateToCrud('clientes')}
              role="button"
            >
              <div className="text-xs text-slate-500 mb-1">Cuentas Corporativas</div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {stats?.clientesCount || 0} Clientes
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {stats?.productosCount || 0} servicios en catálogo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares Tecnológicos de Automate Webs */}
      <section className="mb-5">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
          Líneas de Especialidad
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Servicios y Capacidades Técnicas
        </h2>

        <div className="row g-3">
          {pilaresTecnicos.map((pilar, i) => (
            <div className="col-md-6" key={i}>
              <div className="card-minimal p-4 h-100 bg-white">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className={`bi ${pilar.icon} text-slate-900 fs-5`}></i>
                  <h3 className="text-sm font-bold text-slate-900 mb-0">
                    {pilar.titulo}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-0 leading-relaxed">
                  {pilar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="mb-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card-minimal p-4 h-100 bg-white">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Propósito Empresarial
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Misión
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-0 font-normal">
                {mision}
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card-minimal p-4 h-100 bg-white">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Horizonte de Crecimiento
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Visión
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-0 font-normal">
                {vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objetivo General y Objetivos Específicos */}
      <section className="mb-5">
        <div className="card-minimal p-4 p-lg-5 bg-white">
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Estrategia y Alcance
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Objetivo General
            </h3>
            <p className="text-base text-slate-700 leading-relaxed mb-0">
              {objetivoGeneral}
            </p>
          </div>

          <div className="pt-4 border-top border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 font-mono">
              Objetivos Específicos de Ingeniería
            </div>

            <div className="row g-3">
              {objetivosEspecificos.map((obj, idx) => (
                <div className="col-md-6" key={idx}>
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200/70 h-100 d-flex align-items-start gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900 pt-0.5">
                      0{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 mb-0 font-medium leading-relaxed">
                      {obj}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banner Comercial Final Automate Webs */}
      <section className="card-minimal p-4 p-md-5 bg-slate-950 text-white">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Automate Webs · Enterprise Hub
            </div>
            <h4 className="text-lg sm:text-xl font-bold mb-1 text-white">
              Automatización de Procesos y Desarrollo Web de Alta Precisión
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mb-0 max-w-2xl">
              Centraliza la gestión de productos, clientes, compras y ventas con tecnología moderna y datos en tiempo real.
            </p>
          </div>

          <div className="col-lg-4 text-lg-end">
            <button
              type="button"
              className="btn btn-light btn-sm px-4 py-2 fw-medium text-slate-950 shadow-sm"
              onClick={() => onNavigateToCrud('productos')}
            >
              Comenzar Gestión <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
