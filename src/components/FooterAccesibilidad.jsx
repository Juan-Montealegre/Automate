/**
 * Pie de página corporativo con enlaces a 4 redes sociales,
 * acceso a Política de Datos Personales, controles rápidos y Validador W3C/UX.
 */

import React from 'react';
import { EMPRESA_INFO, REDES_SOCIALES } from '../data/initialData';

export default function FooterAccesibilidad({ onNavigate, onOpenValidator }) {
  return (
    <footer className="border-top bg-white mt-auto py-4 no-print">
      <div className="container-xl">
        <div className="row g-4 align-items-center">
          <div className="col-lg-5">
            <div className="fw-bold text-dark">{EMPRESA_INFO.razonSocial}</div>
            <div className="small text-secondary">
              {EMPRESA_INFO.tagline} · NIT {EMPRESA_INFO.nit}
            </div>
            <div className="small text-secondary mt-1">
              {EMPRESA_INFO.direccion} · {EMPRESA_INFO.telefono}
            </div>
          </div>

          <div className="col-lg-4 d-flex flex-wrap gap-2 justify-content-lg-center">
            {REDES_SOCIALES.map((red) => (
              <a
                key={red.id}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${red.nombre} de Automate Webs`}
                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
              >
                <i className={`bi ${red.icono}`} aria-hidden="true"></i>
                <span>{red.nombre}</span>
              </a>
            ))}
          </div>

          <div className="col-lg-3 d-flex flex-wrap gap-2 justify-content-lg-end">
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none text-dark px-2"
              onClick={() => onNavigate('inicio')}
            >
              Tratamiento de Datos
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              onClick={onOpenValidator}
            >
              <i className="bi bi-shield-check me-1" aria-hidden="true"></i>
              Validador W3C & UX
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
