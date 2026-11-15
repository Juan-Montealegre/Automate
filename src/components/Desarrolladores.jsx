/**
 * Directorio de Desarrolladores y CRUD sobre API Virtual (/api/desarrolladores)
 * Muestra perfil completo, foto, número de celular, correo y enlaces profesionales,
 * permitiendo crear, consultar, editar y eliminar desarrolladores con validación regex.
 */

import React, { useEffect, useState } from 'react';
import { resolveMediaAsset } from '../data/mediaAssets';
import { helpFetch } from '../helpers/helpFetch';
import {
  isValidColombianMobile,
  isValidEmail,
  REGEX_PATTERNS,
} from '../helpers/validators';

const EMPTY_DEV = {
  nombre: '',
  rol: '',
  especialidad: '',
  celular: '',
  correo: '',
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  ciudad: 'Bogotá D.C.',
  experiencia: '3 años',
  bio: '',
  fotoKey: 'dev_1',
};

export default function Desarrolladores({ onDataMutated }) {
  const api = helpFetch();
  const [devs, setDevs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDev, setSelectedDev] = useState(null);
  const [showCrudForm, setShowCrudForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_DEV);
  const [errors, setErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [apiError, setApiError] = useState('');

  const loadDevs = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/desarrolladores');
      setDevs(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiError(err.statusText || 'Error cargando desarrolladores desde la API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevs();
  }, []);

  const validateDev = () => {
    const next = {};
    if (!String(form.nombre || '').trim() || String(form.nombre).trim().length < 3) {
      next.nombre = 'Ingrese el nombre completo del desarrollador.';
    }
    if (!String(form.rol || '').trim()) {
      next.rol = 'Indique el rol técnico dentro del equipo.';
    }
    if (!isValidColombianMobile(form.celular)) {
      next.celular = 'Celular colombiano inválido (ej. +57 3104829104).';
    }
    if (!isValidEmail(form.correo)) {
      next.correo = 'Correo electrónico corporativo o personal inválido.';
    }
    if (form.github && !REGEX_PATTERNS.urlWeb.test(form.github.trim())) {
      next.github = 'Ingrese una URL válida iniciando con https://';
    }
    if (form.linkedin && !REGEX_PATTERNS.urlWeb.test(form.linkedin.trim())) {
      next.linkedin = 'Ingrese una URL válida iniciando con https://';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateDev()) return;

    try {
      if (editingId) {
        const updated = await api.put(`/api/desarrolladores/${editingId}`, { body: form });
        setDevs((prev) => prev.map((d) => (String(d.id) === String(updated.id) ? updated : d)));
        setFeedback('Perfil del desarrollador actualizado en la API.');
      } else {
        const created = await api.post('/api/desarrolladores', { body: form });
        setDevs((prev) => [created, ...prev]);
        setFeedback('Nuevo desarrollador registrado en la API.');
      }
      setForm(EMPTY_DEV);
      setEditingId(null);
      setShowCrudForm(false);
      if (onDataMutated) await onDataMutated();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setApiError(err.statusText || 'No se pudo guardar el desarrollador.');
    }
  };

  const handleEdit = (dev) => {
    setForm({ ...EMPTY_DEV, ...dev });
    setEditingId(dev.id);
    setErrors({});
    setShowCrudForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await api.del(`/api/desarrolladores/${pendingDelete.id}`);
      setDevs((prev) => prev.filter((d) => String(d.id) !== String(pendingDelete.id)));
      if (selectedDev && String(selectedDev.id) === String(pendingDelete.id)) {
        setSelectedDev(null);
      }
      setPendingDelete(null);
      setFeedback('Desarrollador eliminado de la API.');
      if (onDataMutated) await onDataMutated();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setApiError(err.statusText || 'No se pudo eliminar el registro.');
      setPendingDelete(null);
    }
  };

  return (
    <div className="container-xl py-4 py-lg-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="badge text-bg-dark mb-2">Talento Humano & API CRUD</span>
          <h1 className="h2 fw-bold mb-1">Equipo de Desarrolladores</h1>
          <p className="text-secondary mb-0">
            Consulta perfiles individuales, foto, número de celular y gestiona el directorio mediante nuestra API REST.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-dark fw-semibold"
          onClick={() => {
            setForm(EMPTY_DEV);
            setEditingId(null);
            setErrors({});
            setShowCrudForm((prev) => !prev);
          }}
        >
          <i className={`bi ${showCrudForm ? 'bi-x-lg' : 'bi-person-plus'} me-2`} aria-hidden="true"></i>
          {showCrudForm ? 'Ocultar Formulario' : 'Registrar Desarrollador'}
        </button>
      </div>

      {feedback && <div className="alert alert-success">{feedback}</div>}
      {apiError && <div className="alert alert-danger">{apiError}</div>}

      {/* Formulario CRUD de Desarrolladores */}
      {showCrudForm && (
        <div className="aw-card p-4 mb-4">
          <h2 className="h5 fw-bold mb-3">
            {editingId ? 'Editar Perfil de Desarrollador' : 'Nuevo Desarrollador'}
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="dev-nombre" className="form-label small fw-semibold">
                  Nombre Completo *
                </label>
                <input
                  id="dev-nombre"
                  type="text"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              <div className="col-md-4">
                <label htmlFor="dev-rol" className="form-label small fw-semibold">
                  Rol Técnico *
                </label>
                <input
                  id="dev-rol"
                  type="text"
                  className={`form-control ${errors.rol ? 'is-invalid' : ''}`}
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  placeholder="Ej. Desarrollador Backend Senior"
                />
                {errors.rol && <div className="invalid-feedback">{errors.rol}</div>}
              </div>

              <div className="col-md-4">
                <label htmlFor="dev-celular" className="form-label small fw-semibold">
                  Número de Celular (Colombia) *
                </label>
                <input
                  id="dev-celular"
                  type="tel"
                  className={`form-control font-mono ${errors.celular ? 'is-invalid' : ''}`}
                  value={form.celular}
                  onChange={(e) => setForm({ ...form, celular: e.target.value })}
                  placeholder="+57 3104829104"
                />
                {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
              </div>

              <div className="col-md-4">
                <label htmlFor="dev-correo" className="form-label small fw-semibold">
                  Correo Electrónico *
                </label>
                <input
                  id="dev-correo"
                  type="email"
                  className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                />
                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
              </div>

              <div className="col-md-4">
                <label htmlFor="dev-esp" className="form-label small fw-semibold">
                  Especialidad / Stack
                </label>
                <input
                  id="dev-esp"
                  type="text"
                  className="form-control"
                  value={form.especialidad}
                  onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                  placeholder="React, Express.js, SQL, RPA"
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="dev-foto" className="form-label small fw-semibold">
                  Fotografía de Perfil
                </label>
                <select
                  id="dev-foto"
                  className="form-select"
                  value={form.fotoKey || 'dev_1'}
                  onChange={(e) => setForm({ ...form, fotoKey: e.target.value })}
                >
                  <option value="dev_1">Retrato Corporativo 1</option>
                  <option value="dev_2">Retrato Corporativo 2</option>
                  <option value="dev_3">Retrato Corporativo 3</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="dev-github" className="form-label small fw-semibold">
                  Enlace GitHub
                </label>
                <input
                  id="dev-github"
                  type="url"
                  className={`form-control ${errors.github ? 'is-invalid' : ''}`}
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
                {errors.github && <div className="invalid-feedback">{errors.github}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="dev-linkedin" className="form-label small fw-semibold">
                  Enlace LinkedIn
                </label>
                <input
                  id="dev-linkedin"
                  type="url"
                  className={`form-control ${errors.linkedin ? 'is-invalid' : ''}`}
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                />
                {errors.linkedin && <div className="invalid-feedback">{errors.linkedin}</div>}
              </div>

              <div className="col-12">
                <label htmlFor="dev-bio" className="form-label small fw-semibold">
                  Resumen de Perfil Profesional
                </label>
                <textarea
                  id="dev-bio"
                  rows="2"
                  className="form-control"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-dark px-4 fw-semibold">
                {editingId ? 'Actualizar Desarrollador' : 'Guardar en API'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowCrudForm(false);
                  setEditingId(null);
                  setForm(EMPTY_DEV);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Cargando desarrolladores...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {devs.map((dev) => (
            <div key={dev.id} className="col-md-6 col-lg-4">
              <article className="aw-card aw-card-hover p-4 h-100 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img
                    src={resolveMediaAsset(dev.fotoKey || dev.foto, 'dev_1')}
                    alt={`Fotografía de ${dev.nombre}`}
                    className="aw-dev-avatar"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="h5 fw-bold mb-1">{dev.nombre}</h2>
                    <div className="small text-primary fw-semibold">{dev.rol}</div>
                    <div className="small text-secondary">{dev.ciudad}</div>
                  </div>
                </div>

                <p className="small text-secondary mb-3 flex-grow-1">
                  {dev.bio || dev.especialidad}
                </p>

                <div className="bg-light border rounded-3 p-3 small mb-3">
                  <div className="mb-1">
                    <i className="bi bi-phone-fill text-dark me-2" aria-hidden="true"></i>
                    <strong>Celular:</strong>{' '}
                    <a
                      href={`tel:${String(dev.celular).replace(/\s/g, '')}`}
                      className="font-mono text-decoration-none"
                    >
                      {dev.celular}
                    </a>
                  </div>
                  <div className="text-truncate">
                    <i className="bi bi-envelope-fill text-dark me-2" aria-hidden="true"></i>
                    <strong>Correo:</strong> {dev.correo}
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-dark fw-semibold"
                    onClick={() => setSelectedDev(dev)}
                  >
                    <i className="bi bi-person-vcard me-1" aria-hidden="true"></i>
                    Ver Perfil Completo
                  </button>

                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      aria-label={`Editar perfil de ${dev.nombre}`}
                      onClick={() => handleEdit(dev)}
                    >
                      <i className="bi bi-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      aria-label={`Eliminar perfil de ${dev.nombre}`}
                      onClick={() => setPendingDelete(dev)}
                    >
                      <i className="bi bi-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Perfil Detallado (Link de perfil solicitado) */}
      {selectedDev && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="devProfileModalLabel"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5 fw-bold" id="devProfileModalLabel">
                    Perfil del Desarrollador
                  </h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar perfil"
                    onClick={() => setSelectedDev(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="text-center mb-3">
                    <img
                      src={resolveMediaAsset(selectedDev.fotoKey || selectedDev.foto, 'dev_1')}
                      alt={selectedDev.nombre}
                      className="aw-dev-avatar mb-2"
                      style={{ width: '112px', height: '112px' }}
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="h4 fw-bold mb-0">{selectedDev.nombre}</h3>
                    <div className="text-primary fw-semibold small">{selectedDev.rol}</div>
                    <div className="text-secondary small">
                      {selectedDev.ciudad} · Experiencia: {selectedDev.experiencia || '4 años'}
                    </div>
                  </div>

                  <p className="small text-secondary mb-3">{selectedDev.bio}</p>

                  <ul className="list-group list-group-flush small border rounded-3 mb-3">
                    <li className="list-group-item">
                      <strong>Especialidad:</strong> {selectedDev.especialidad}
                    </li>
                    <li className="list-group-item">
                      <strong>Celular Directo:</strong>{' '}
                      <span className="font-mono">{selectedDev.celular}</span>
                    </li>
                    <li className="list-group-item">
                      <strong>Correo Corporativo:</strong> {selectedDev.correo}
                    </li>
                  </ul>

                  <div className="d-flex gap-2">
                    <a
                      href={selectedDev.github || 'https://github.com/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-dark btn-sm flex-fill"
                    >
                      <i className="bi bi-github me-1" aria-hidden="true"></i>
                      GitHub
                    </a>
                    <a
                      href={selectedDev.linkedin || 'https://www.linkedin.com/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm flex-fill"
                    >
                      <i className="bi bi-linkedin me-1" aria-hidden="true"></i>
                      LinkedIn
                    </a>
                    <a
                      href={`https://wa.me/${String(selectedDev.celular || '').replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success btn-sm flex-fill"
                    >
                      <i className="bi bi-whatsapp me-1" aria-hidden="true"></i>
                      WhatsApp
                    </a>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedDev(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Confirmación Eliminación */}
      {pendingDelete && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5 fw-bold">Eliminar Desarrollador</h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setPendingDelete(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  ¿Desea eliminar el perfil de <strong>{pendingDelete.nombre}</strong> de la API?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setPendingDelete(null)}
                  >
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
