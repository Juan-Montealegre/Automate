/**
 * @license
 * Razón Social: Desarrollo de software y Automatización
 * Componente: Negocio.jsx
 * Diseño corporativo, sobrio y minimalista para presentación empresarial y comercial.
 */

import React from 'react';
import { EMPRESA_INFO } from '../data/initialData';

export default function Negocio({ onNavigateToCrud, stats }) {
  const {
    razonSocial,
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

  return (
    <div className="container py-5" style={{ maxWidth: '1200px' }}>
      {/* Hero Comercial Minimalista */}
      <section className="mb-5 pb-4 border-bottom border-subtle-custom">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium tracking-wide uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 inline-block"></span>
              Razón Social Registrada · NIT {nit}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-3" style={{ textWrap: 'balance' }}>
              {razonSocial}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mb-4 font-normal">
              {mision}
            </p>

            {/* Accesos directos a los módulos comerciales */}
            <div className="d-flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                className="btn btn-dark btn-sm px-3 py-2 fw-medium rounded-md shadow-xs d-inline-flex align-items-center gap-1.5"
                onClick={() => onNavigateToCrud('productos')}
              >
                <i className="bi bi-box-seam"></i>
                <span>Catálogo de Servicios</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 py-2 fw-medium rounded-md d-inline-flex align-items-center gap-1.5"
                onClick={() => onNavigateToCrud('clientes')}
              >
                <i className="bi bi-people"></i>
                <span>Directorio de Clientes</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 py-2 fw-medium rounded-md d-inline-flex align-items-center gap-1.5"
                onClick={() => onNavigateToCrud('ventas')}
              >
                <i className="bi bi-graph-up"></i>
                <span>Operaciones & Ventas</span>
              </button>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card-minimal p-4 bg-white">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Identificación Corporativa
              </div>
              <dl className="text-xs space-y-2 mb-0">
                <div className="d-flex justify-content-between py-1 border-bottom border-slate-100">
                  <dt className="text-slate-500 font-normal">Razón Social</dt>
                  <dd className="font-medium text-slate-900 mb-0 text-end">{razonSocial}</dd>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-slate-100">
                  <dt className="text-slate-500 font-normal">Sector Económico</dt>
                  <dd className="font-medium text-slate-900 mb-0 text-end">{sector}</dd>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-slate-100">
                  <dt className="text-slate-500 font-normal">Sede Principal</dt>
                  <dd className="text-slate-700 mb-0 text-end">{direccion}</dd>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-slate-100">
                  <dt className="text-slate-500 font-normal">Teléfono Comercial</dt>
                  <dd className="font-mono text-slate-700 mb-0 text-end">{telefono}</dd>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <dt className="text-slate-500 font-normal">Contacto</dt>
                  <dd className="font-mono text-slate-900 mb-0 text-end">{email}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Franja de Indicadores Comerciales y Operativos (KPIs Sobrios) */}
      <section className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-0">
            Resumen Operativo del Negocio
          </h2>
          <span className="text-xs text-slate-400">
            Métricas actualizadas
          </span>
        </div>

        <div className="row g-3">
          <div className="col-sm-6 col-lg-3">
            <div
              className="card-minimal p-3.5 cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => onNavigateToCrud('ventas')}
              role="button"
            >
              <div className="text-xs text-slate-500 mb-1">Facturación Total (Ventas)</div>
              <div className="text-xl font-bold font-mono text-slate-900">
                ${ventasTotal.toLocaleString('es-CO')}
              </div>
              <div className="text-xs text-slate-500 mt-1 d-flex align-items-center gap-1">
                <span className="font-mono">{stats?.ventasCount || 0}</span> contratos formalizados
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div
              className="card-minimal p-3.5 cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => onNavigateToCrud('compras')}
              role="button"
            >
              <div className="text-xs text-slate-500 mb-1">Costos de Infraestructura</div>
              <div className="text-xl font-bold font-mono text-slate-900">
                ${comprasTotal.toLocaleString('es-CO')}
              </div>
              <div className="text-xs text-slate-500 mt-1 d-flex align-items-center gap-1">
                <span className="font-mono">{stats?.comprasCount || 0}</span> adquisiciones cloud y licencias
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card-minimal p-3.5">
              <div className="text-xs text-slate-500 mb-1">Margen Operativo Neto</div>
              <div className={`text-xl font-bold font-mono ${margenNeto >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                ${margenNeto.toLocaleString('es-CO')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Rendimiento comercial positivo
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div
              className="card-minimal p-3.5 cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => onNavigateToCrud('clientes')}
              role="button"
            >
              <div className="text-xs text-slate-500 mb-1">Cartera de Clientes</div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {stats?.clientesCount || 0} Empresas
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {stats?.productosCount || 0} soluciones activas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares Estratégicos: Misión, Visión y Objetivo General */}
      <section className="mb-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card-minimal p-4 h-100 bg-white">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Dirección Estratégica
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
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Proyección de Futuro
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
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Marco de Ejecución
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Objetivo General
            </h3>
            <p className="text-base text-slate-700 leading-relaxed mb-0">
              {objetivoGeneral}
            </p>
          </div>

          <div className="pt-4 border-top border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Objetivos Específicos de Negocio e Ingeniería
            </div>

            <div className="row g-3">
              {objetivosEspecificos.map((obj, idx) => (
                <div className="col-md-6" key={idx}>
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200/70 h-100 d-flex align-items-start gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 pt-0.5">
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

      {/* Banner de Contacto y Soluciones */}
      <section className="card-minimal p-4 bg-slate-900 text-white">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              Transformación Digital Empresarial
            </div>
            <h4 className="text-base font-semibold mb-1 text-white">
              Soluciones Integrales de Software, Nube y Automatización de Procesos
            </h4>
            <p className="text-xs text-slate-400 mb-0 max-w-2xl">
              Plataformas web a medida, bots RPA, integración segura de pagos y arquitectura cloud de alta disponibilidad para organizaciones en crecimiento.
            </p>
          </div>

          <div className="col-lg-4 text-lg-end">
            <button
              type="button"
              className="btn btn-light btn-sm px-3 py-2 fw-medium text-slate-900"
              onClick={() => onNavigateToCrud('productos')}
            >
              Explorar Catálogo <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
