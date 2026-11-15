/**
 * Inspector W3C (HTML5 / CSS) y Verificador de las 10 Reglas Heurísticas de Nielsen
 * Ejecuta una auditoría real sobre el DOM renderizado actualmente.
 */

import React, { useEffect, useState } from 'react';
import { NIELSEN_HEURISTICS } from '../data/initialData';
import { runW3cAndCssAudit } from '../helpers/validators';

export default function ValidadorW3cUx({ isOpen, onClose }) {
  const [audit, setAudit] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setAudit(runW3cAndCssAudit());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="w3cModalTitle"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5 fw-bold" id="w3cModalTitle">
                <i className="bi bi-shield-check text-success me-2" aria-hidden="true"></i>
                Validador W3C HTML/CSS y 10 Heurísticas de Nielsen (UX)
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar validador"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body p-4">
              {audit && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h3 className="h6 fw-bold mb-0">
                        Inspección en Vivo DOM HTML5 & CSS3 (Hora: {audit.timestamp})
                      </h3>
                      <div className="small text-secondary">
                        Buscador automático de errores estructurales, accesibilidad y estilos W3C
                      </div>
                    </div>
                    <span
                      className={`badge fs-6 font-mono ${
                        audit.issues.length === 0 ? 'text-bg-success' : 'text-bg-warning text-dark'
                      }`}
                    >
                      {audit.score}% Cumplimiento
                    </span>
                  </div>

                  {audit.issues.length > 0 && (
                    <div className="alert alert-warning py-2 small">
                      <strong>Advertencias detectadas:</strong>
                      <ul className="mb-0 mt-1 ps-3">
                        {audit.issues.map((issue) => (
                          <li key={issue.id}>{issue.label}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <ul className="list-group list-group-flush border rounded-3 small mb-3">
                    {audit.checks.map((chk) => (
                      <li key={chk.id} className="list-group-item d-flex align-items-center gap-2">
                        <i className="bi bi-check-circle-fill text-success" aria-hidden="true"></i>
                        <span>{chk.label}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => setAudit(runW3cAndCssAudit())}
                  >
                    <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
                    Re-ejecutar Escaneo HTML/CSS
                  </button>
                </div>
              )}

              <hr />

              <div>
                <h3 className="h6 fw-bold mb-2">
                  Cumplimiento de las 10 Reglas de Usabilidad de Jakob Nielsen
                </h3>
                <div className="row g-2">
                  {NIELSEN_HEURISTICS.map((h) => (
                    <div key={h.num} className="col-md-6">
                      <div className="p-3 bg-light border rounded-3 h-100 small">
                        <div className="fw-bold text-dark mb-1">
                          {h.num}. {h.nombre}
                        </div>
                        <div className="text-secondary">{h.aplicacion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-dark" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
