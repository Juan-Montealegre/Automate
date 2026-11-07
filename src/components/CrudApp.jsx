/**
 * @license
 * Proyecto: Automate Webs
 * Razón Social / Tagline: Desarrollo de Software y Automatización
 * Componente: CrudApp.jsx
 * Orquestador central de operaciones CRUD con diseño sobrio y minimalista.
 */

import React, { useState, useEffect } from 'react';
import { mockJsonServer } from '../helpers/helpFetch';
import { INITIAL_DATA } from '../data/initialData';
import CrudTable from './CrudTable';
import CrudForm from './CrudForm';

export default function CrudApp({ initialEntity = 'productos', onStatsUpdate }) {
  const [entity, setEntity] = useState(initialEntity);
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    mockJsonServer.initDb(INITIAL_DATA);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setDataToEdit(null);

    mockJsonServer
      .get(entity, 80)
      .then((res) => {
        setDb(res || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setDb([]);
        setLoading(false);
      });
  }, [entity]);

  useEffect(() => {
    if (onStatsUpdate) {
      const fullDb = mockJsonServer.getDb() || INITIAL_DATA;
      const ventasTotal = (fullDb.ventas || []).reduce(
        (acc, curr) => acc + (Number(curr.valor) || 0),
        0
      );
      const comprasTotal = (fullDb.compras || []).reduce(
        (acc, curr) => acc + (Number(curr.costo) || 0),
        0
      );

      onStatsUpdate({
        productosCount: (fullDb.productos || []).length,
        clientesCount: (fullDb.clientes || []).length,
        proveedoresCount: (fullDb.proveedores || []).length,
        ventasCount: (fullDb.ventas || []).length,
        comprasCount: (fullDb.compras || []).length,
        ventasTotal,
        comprasTotal,
      });
    }
  }, [db, entity, onStatsUpdate]);

  useEffect(() => {
    if (dataToEdit) {
      setShowForm(true);
      const formCard = document.getElementById('crud-form-card');
      if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dataToEdit]);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // CREATE (POST)
  const createData = async (data) => {
    try {
      setLoading(true);
      const newItem = await mockJsonServer.post(entity, data, 100);
      setDb((prev) => [...prev, newItem]);
      setLoading(false);
      setShowForm(false);
      showFeedback(`Registro guardado exitosamente.`, 'success');
    } catch (err) {
      setLoading(false);
      showFeedback(`Error al guardar: ${err.message || 'Error de conexión'}`, 'danger');
    }
  };

  // UPDATE (PUT)
  const updateData = async (data) => {
    try {
      setLoading(true);
      const updated = await mockJsonServer.put(entity, data, 100);
      setDb((prev) => prev.map((item) => (item.id === data.id ? updated : item)));
      setDataToEdit(null);
      setShowForm(false);
      setLoading(false);
      showFeedback(`Registro actualizado correctamente.`, 'info');
    } catch (err) {
      setLoading(false);
      showFeedback(`Error al actualizar: ${err.message}`, 'danger');
    }
  };

  // DELETE (DELETE)
  const deleteData = async (id, itemName) => {
    const isConfirm = window.confirm(`¿Confirmas la eliminación de "${itemName}"?`);
    if (isConfirm) {
      try {
        setLoading(true);
        await mockJsonServer.del(entity, id, 90);
        setDb((prev) => prev.filter((item) => item.id !== id));
        if (dataToEdit && dataToEdit.id === id) {
          setDataToEdit(null);
          setShowForm(false);
        }
        setLoading(false);
        showFeedback(`Registro eliminado correctamente.`, 'warning');
      } catch (err) {
        setLoading(false);
        showFeedback(`Error al eliminar: ${err.message}`, 'danger');
      }
    }
  };

  const exportToCsv = () => {
    if (!db || db.length === 0) {
      alert('No hay registros para exportar.');
      return;
    }
    const keys = Object.keys(db[0]);
    const csvContent = [
      keys.join(','),
      ...db.map((row) =>
        keys
          .map((k) => `"${String(row[k] || '').replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `automate_webs_${entity}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetEntity = () => {
    if (window.confirm(`¿Restablecer datos originales de "${entity}"?`)) {
      const fullDb = mockJsonServer.getDb() || {};
      fullDb[entity] = INITIAL_DATA[entity] || [];
      mockJsonServer.saveDb(fullDb);
      setDb(INITIAL_DATA[entity] || []);
      showFeedback(`Datos de "${entity}" restablecidos a valores originales.`, 'secondary');
    }
  };

  const entityMetadata = {
    productos: { label: 'Catálogo de Soluciones & Software', short: 'Productos', icon: 'bi-box-seam' },
    clientes: { label: 'Directorio de Clientes Corporativos', short: 'Clientes', icon: 'bi-people' },
    proveedores: { label: 'Proveedores de Infraestructura TI', short: 'Proveedores', icon: 'bi-truck' },
    compras: { label: 'Inversión & Compras Operativas', short: 'Compras', icon: 'bi-cart-check' },
    ventas: { label: 'Contratos & Ventas Formalizadas', short: 'Ventas', icon: 'bi-cash-stack' },
  };

  return (
    <div className="container py-4" style={{ maxWidth: '1240px' }}>
      {/* Selector de Módulos Automate Webs */}
      <div className="d-flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center gap-3 mb-4">
        <div>
          <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
            Automate Webs · Centro de Operaciones
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0">
            {entityMetadata[entity]?.label}
          </h2>
        </div>

        {/* Segmented Control */}
        <div className="d-inline-flex p-1 bg-white border border-subtle-custom rounded-lg shadow-2xs gap-1 overflow-x-auto">
          {Object.keys(entityMetadata).map((key) => (
            <button
              key={key}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors border-0 ${
                entity === key
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 bg-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
              onClick={() => {
                setEntity(key);
                setShowForm(false);
                setDataToEdit(null);
              }}
            >
              <i className={`bi ${entityMetadata[key].icon} me-1.5`}></i>
              {entityMetadata[key].short}
            </button>
          ))}
        </div>
      </div>

      {/* Alerta de Feedback Sutil */}
      {feedback && (
        <div
          className={`px-3 py-2 rounded-md text-xs font-medium mb-3 d-flex align-items-center justify-content-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : feedback.type === 'info'
              ? 'bg-sky-50 text-sky-800 border border-sky-200'
              : feedback.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedback.msg}</span>
          <button
            type="button"
            className="btn-close p-0 ms-2"
            style={{ fontSize: '0.65rem' }}
            onClick={() => setFeedback(null)}
          ></button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-md text-xs mb-3">
          <strong>Error:</strong> {error.statusText || 'No se pudo comunicar con el servicio de datos.'}
        </div>
      )}

      {/* Franja de Control Superior: Acciones Rápidas */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex align-items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="font-semibold text-slate-800">{db.length}</span> registros en base de datos
        </div>

        <div className="d-flex items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-2.5 py-1 text-xs d-inline-flex align-items-center gap-1.5 bg-white"
            onClick={exportToCsv}
          >
            <i className="bi bi-download"></i>
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-2.5 py-1 text-xs d-inline-flex align-items-center gap-1.5 bg-white"
            onClick={handleResetEntity}
            title="Restablecer datos originales"
          >
            <i className="bi bi-arrow-clockwise"></i>
            <span>Restablecer</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm px-3 py-1 text-xs font-medium rounded-md d-inline-flex align-items-center gap-1.5 ${
              showForm ? 'btn-outline-dark bg-white' : 'btn-dark'
            }`}
            onClick={() => {
              if (showForm && dataToEdit) {
                setDataToEdit(null);
              }
              setShowForm(!showForm);
            }}
          >
            <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'}`}></i>
            <span>{showForm ? 'Cerrar Formulario' : 'Nuevo Registro'}</span>
          </button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div id="crud-form-card" className="mb-4">
          <CrudForm
            entity={entity}
            createData={createData}
            updateData={updateData}
            dataToEdit={dataToEdit}
            setDataToEdit={(val) => {
              setDataToEdit(val);
              if (!val) setShowForm(false);
            }}
            entityTitle={entityMetadata[entity]?.label}
          />
        </div>
      )}

      {/* Tabla de Registros */}
      <CrudTable
        entity={entity}
        data={db}
        setDataToEdit={setDataToEdit}
        deleteData={deleteData}
        loading={loading}
        title={entityMetadata[entity]?.label}
        onAddNew={() => setShowForm(true)}
      />
    </div>
  );
}
