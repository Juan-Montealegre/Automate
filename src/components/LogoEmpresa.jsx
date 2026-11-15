/**
 * @license
 * Proyecto: Automate Webs
 * Componente: LogoEmpresa.jsx
 * Logotipo vectorial corporativo diseñado para Automate Webs (Desarrollo de Software y Automatización).
 */

import React from 'react';

export default function LogoEmpresa({ size = 38, showText = true, light = false }) {
  return (
    <div className="d-inline-flex align-items-center gap-2 text-decoration-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Logotipo corporativo Automate Webs"
      >
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="10"
          fill={light ? '#ffffff' : '#0f172a'}
          stroke={light ? '#cbd5e1' : '#1e293b'}
          strokeWidth="2"
        />
        {/* Trayectoria de automatización e interconexión */}
        <path
          d="M11 32L18 15L24 27L30 15L37 32"
          stroke={light ? '#0f172a' : '#ffffff'}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Nodos de circuito */}
        <circle cx="18" cy="15" r="2.7" fill="#0d6efd" />
        <circle cx="30" cy="15" r="2.7" fill="#0d6efd" />
        <circle cx="24" cy="27" r="2.7" fill="#38bdf8" />
        <line
          x1="14"
          y1="36"
          x2="34"
          y2="36"
          stroke="#0d6efd"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="d-flex flex-column text-start lh-1">
          <span className={`fw-bold fs-6 tracking-tight ${light ? 'text-white' : 'text-dark'}`}>
            Automate Webs
          </span>
          <span
            className={`${light ? 'text-white-50' : 'text-secondary'}`}
            style={{ fontSize: '0.7rem' }}
          >
            Software &amp; Automatización
          </span>
        </div>
      )}
    </div>
  );
}
