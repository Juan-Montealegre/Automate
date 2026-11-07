/**
 * @license
 * Razón Social: Desarrollo de software y Automatización
 * Componente: index.jsx
 * Orquestador principal con navegación comercial sobria y minimalista.
 */

import React, { useState } from 'react';
import Negocio from './components/Negocio';
import CrudApp from './components/CrudApp';
import { EMPRESA_INFO } from './data/initialData';

export default function IndexApp() {
  const [activeView, setActiveView] = useState('negocio');
  const [crudInitialEntity, setCrudInitialEntity] = useState('productos');
  const [stats, setStats] = useState({
    productosCount: 6,
    clientesCount: 5,
    proveedoresCount: 5,
    ventasCount: 5,
    comprasCount: 5,
    ventasTotal: 28000000,
    comprasTotal: 6020000,
  });

  const handleNavigateToCrud = (target) => {
    setCrudInitialEntity(target);
    setActiveView('crud');
  };

  const navItems = [
    { id: 'negocio', label: 'Empresa', isCrud: false },
    { id: 'productos', label: 'Productos', isCrud: true },
    { id: 'clientes', label: 'Clientes', isCrud: true },
    { id: 'proveedores', label: 'Proveedores', isCrud: true },
    { id: 'compras', label: 'Compras', isCrud: true },
    { id: 'ventas', label: 'Ventas', isCrud: true },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-slate-50">
      {/* Top Bar Minimalista y Comercial */}
      <header className="bg-white border-bottom border-subtle-custom sticky-top z-30">
        <div className="container-fluid px-4 py-2.5 d-flex align-items-center justify-content-between gap-4" style={{ maxWidth: '1440px' }}>
          {/* Zone 1: Marca Corporativa */}
          <button
            type="button"
            className="text-start border-0 bg-transparent p-0 d-inline-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setActiveView('negocio')}
          >
            <span className="w-7 h-7 rounded bg-slate-900 text-white d-flex align-items-center justify-content-center text-xs font-mono font-bold">
              DA
            </span>
            <div className="d-flex flex-col">
              <span className="text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
                {EMPRESA_INFO.razonSocial}
              </span>
            </div>
          </button>

          {/* Zone 2: Menú de Navegación Comercial */}
          <nav className="d-none md:d-flex align-items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive =
                (item.id === 'negocio' && activeView === 'negocio') ||
                (item.isCrud && activeView === 'crud' && crudInitialEntity === item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors border-0 ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 bg-transparent hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  onClick={() => {
                    if (item.id === 'negocio') {
                      setActiveView('negocio');
                    } else {
                      setCrudInitialEntity(item.id);
                      setActiveView('crud');
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Acción Principal */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-dark btn-sm px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap d-inline-flex align-items-center gap-1.5"
              onClick={() => {
                if (activeView !== 'crud') {
                  setCrudInitialEntity('productos');
                  setActiveView('crud');
                } else {
                  const formEl = document.getElementById('crud-form-card');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Nuevo Registro</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="d-md-none border-top border-slate-100 px-3 py-1.5 d-flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              (item.id === 'negocio' && activeView === 'negocio') ||
              (item.isCrud && activeView === 'crud' && crudInitialEntity === item.id);

            return (
              <button
                key={item.id}
                type="button"
                className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap border-0 ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 bg-transparent'
                }`}
                onClick={() => {
                  if (item.id === 'negocio') {
                    setActiveView('negocio');
                  } else {
                    setCrudInitialEntity(item.id);
                    setActiveView('crud');
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Viewport Principal */}
      <main className="flex-grow-1">
        {activeView === 'negocio' && (
          <Negocio onNavigateToCrud={handleNavigateToCrud} stats={stats} />
        )}

        {activeView === 'crud' && (
          <CrudApp
            key={crudInitialEntity}
            initialEntity={crudInitialEntity}
            onStatsUpdate={setStats}
          />
        )}
      </main>

      {/* Footer Minimalista Comercial */}
      <footer className="border-top border-subtle-custom bg-white py-3 mt-auto">
        <div className="container-fluid px-4 d-flex flex-wrap justify-content-between align-items-center gap-2 text-xs text-slate-500" style={{ maxWidth: '1440px' }}>
          <div>
            <span className="font-medium text-slate-700">{EMPRESA_INFO.razonSocial}</span>
            <span className="mx-2">·</span>
            <span>NIT: {EMPRESA_INFO.nit}</span>
            <span className="mx-2">·</span>
            <span>{EMPRESA_INFO.sector}</span>
          </div>
          <div className="text-slate-400">
            {EMPRESA_INFO.direccion} · Tel: {EMPRESA_INFO.telefono}
          </div>
        </div>
      </footer>
    </div>
  );
}
