/**
 * Módulo de PQR (Peticiones, Quejas, Reclamos y Sugerencias) y Ubicación en Google Maps
 * Implementa @vis.gl/react-google-maps con AdvancedMarker, mapId="DEMO_MAP_ID"
 * y internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}.
 */

import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { EMPRESA_INFO } from '../data/initialData';
import { helpFetch } from '../helpers/helpFetch';
import { isValidColombianMobile, isValidEmail } from '../helpers/validators';

function OfficeLocationMap({ apiKey }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);
  const position = EMPRESA_INFO.coordenadas;

  if (!apiKey) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center bg-light border rounded-3 p-4 text-center"
        style={{ height: '400px' }}
      >
        <i className="bi bi-geo-alt fs-1 text-secondary mb-2" aria-hidden="true"></i>
        <p className="fw-semibold mb-1">Mapa de Ubicación Corporativa</p>
        <p className="small text-secondary mb-2">{EMPRESA_INFO.direccion}</p>
        <span className="badge text-bg-light border font-mono">
          Lat: {position.lat} · Lng: {position.lng}
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-3 overflow-hidden border"
      style={{ width: '100%', height: '400px' }}
    >
      <APIProvider apiKey={apiKey} language="es" region="CO">
        <Map
          defaultCenter={position}
          defaultZoom={15}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="cooperative"
          style={{ width: '100%', height: '100%' }}
        >
          <AdvancedMarker
            ref={markerRef}
            position={position}
            title={EMPRESA_INFO.razonSocial}
            onClick={() => setInfoOpen((prev) => !prev)}
          >
            <Pin background="#0f172a" glyphColor="#ffffff" borderColor="#1d4ed8" />
          </AdvancedMarker>

          {infoOpen && marker && (
            <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)}>
              <div style={{ maxWidth: '240px', color: '#0f172a' }}>
                <div className="fw-bold mb-1">{EMPRESA_INFO.razonSocial}</div>
                <div className="small mb-1">{EMPRESA_INFO.direccion}</div>
                <div className="small text-secondary">{EMPRESA_INFO.horario}</div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

export default function PqrMapa({ mapsApiKey }) {
  const api = helpFetch();
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    tipo: 'Petición',
    nombre: '',
    correo: '',
    celular: '',
    asunto: '',
    mensaje: '',
    autorizaDatos: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    api
      .get('/api/pqr')
      .then((data) => setTickets(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const validatePqr = () => {
    const next = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 3) {
      next.nombre = 'Ingrese su nombre completo (mínimo 3 caracteres).';
    }
    if (!isValidEmail(form.correo)) {
      next.correo = 'Ingrese un correo electrónico válido.';
    }
    if (!isValidColombianMobile(form.celular)) {
      next.celular = 'Ingrese un número celular colombiano válido (ej. 3104829104).';
    }
    if (!form.asunto.trim() || form.asunto.trim().length < 5) {
      next.asunto = 'El asunto debe tener al menos 5 caracteres.';
    }
    if (!form.mensaje.trim() || form.mensaje.trim().length < 10) {
      next.mensaje = 'Describa su solicitud con al menos 10 caracteres.';
    }
    if (!form.autorizaDatos) {
      next.autorizaDatos = 'Debe autorizar el tratamiento de datos personales (Ley 1581).';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setCreatedTicket(null);
    if (!validatePqr()) return;

    setSubmitting(true);
    try {
      const saved = await api.post('/api/pqr', { body: form });
      setTickets((prev) => [saved, ...prev]);
      setCreatedTicket(saved);
      setForm({
        tipo: 'Petición',
        nombre: '',
        correo: '',
        celular: '',
        asunto: '',
        mensaje: '',
        autorizaDatos: false,
      });
    } catch (err) {
      setApiError(err.statusText || 'Error radicando la solicitud PQR.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-xl py-4 py-lg-5">
      <div className="mb-4">
        <span className="badge text-bg-dark mb-2">Atención al Ciudadano y Ubicación</span>
        <h1 className="h2 fw-bold mb-1">Formulario PQR y Sede Principal</h1>
        <p className="text-secondary mb-0">
          Radica peticiones, quejas, reclamos o sugerencias y ubica nuestra oficina en Bogotá mediante Google Maps.
        </p>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Formulario PQR */}
        <div className="col-lg-6">
          <div className="aw-card p-4 h-100">
            <h2 className="h4 fw-bold mb-3">Radicar Solicitud PQR</h2>

            {createdTicket && (
              <div className="alert alert-success">
                <strong>Solicitud radicada exitosamente.</strong> Código de seguimiento:{' '}
                <span className="font-mono fw-bold">{createdTicket.radicado}</span>
              </div>
            )}
            {apiError && <div className="alert alert-danger">{apiError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="pqr-tipo" className="form-label small fw-semibold">
                    Tipo de Solicitud
                  </label>
                  <select
                    id="pqr-tipo"
                    className="form-select"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  >
                    <option value="Petición">Petición</option>
                    <option value="Queja">Queja</option>
                    <option value="Reclamo">Reclamo</option>
                    <option value="Sugerencia">Sugerencia</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="pqr-nombre" className="form-label small fw-semibold">
                    Nombre Completo *
                  </label>
                  <input
                    id="pqr-nombre"
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="pqr-correo" className="form-label small fw-semibold">
                    Correo Electrónico *
                  </label>
                  <input
                    id="pqr-correo"
                    type="email"
                    className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  />
                  {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="pqr-celular" className="form-label small fw-semibold">
                    Celular (Colombia) *
                  </label>
                  <input
                    id="pqr-celular"
                    type="tel"
                    className={`form-control font-mono ${errors.celular ? 'is-invalid' : ''}`}
                    value={form.celular}
                    onChange={(e) => setForm({ ...form, celular: e.target.value })}
                    placeholder="3104829104"
                  />
                  {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
                </div>

                <div className="col-12">
                  <label htmlFor="pqr-asunto" className="form-label small fw-semibold">
                    Asunto *
                  </label>
                  <input
                    id="pqr-asunto"
                    type="text"
                    className={`form-control ${errors.asunto ? 'is-invalid' : ''}`}
                    value={form.asunto}
                    onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                  />
                  {errors.asunto && <div className="invalid-feedback">{errors.asunto}</div>}
                </div>

                <div className="col-12">
                  <label htmlFor="pqr-mensaje" className="form-label small fw-semibold">
                    Descripción Detallada *
                  </label>
                  <textarea
                    id="pqr-mensaje"
                    rows="4"
                    className={`form-control ${errors.mensaje ? 'is-invalid' : ''}`}
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  ></textarea>
                  {errors.mensaje && <div className="invalid-feedback">{errors.mensaje}</div>}
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      id="pqr-datos"
                      type="checkbox"
                      className={`form-check-input ${errors.autorizaDatos ? 'is-invalid' : ''}`}
                      checked={form.autorizaDatos}
                      onChange={(e) => setForm({ ...form, autorizaDatos: e.target.checked })}
                    />
                    <label htmlFor="pqr-datos" className="form-check-label small">
                      Autorizo a Automate Webs el tratamiento de mis datos personales (Ley 1581 de 2012) para dar respuesta a esta PQR.
                    </label>
                    {errors.autorizaDatos && (
                      <div className="invalid-feedback d-block">{errors.autorizaDatos}</div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark mt-3 px-4 py-2 fw-semibold"
                disabled={submitting}
              >
                {submitting ? 'Radicando...' : 'Enviar y Generar Radicado'}
              </button>
            </form>
          </div>
        </div>

        {/* Columna Derecha: Mapa de Google Maps + Últimos Radicados */}
        <div className="col-lg-6 d-flex flex-column gap-4">
          <div className="aw-card p-4">
            <h2 className="h4 fw-bold mb-1">Ubicación de Nuestra Oficina</h2>
            <p className="small text-secondary mb-3">{EMPRESA_INFO.direccion}</p>
            <OfficeLocationMap apiKey={mapsApiKey} />
          </div>

          <div className="aw-card p-4">
            <h2 className="h5 fw-bold mb-3">Últimos Radicados PQR</h2>
            <div className="table-responsive">
              <table className="table table-sm aw-table mb-0">
                <thead>
                  <tr>
                    <th>Radicado</th>
                    <th>Tipo</th>
                    <th>Asunto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 5).map((t) => (
                    <tr key={t.id}>
                      <td className="font-mono small fw-bold">{t.radicado}</td>
                      <td>
                        <span className="badge text-bg-light border text-dark">{t.tipo}</span>
                      </td>
                      <td className="small">{t.asunto}</td>
                      <td>
                        <span className="badge text-bg-primary">{t.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
