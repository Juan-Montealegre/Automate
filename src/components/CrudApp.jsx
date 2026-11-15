/**
 * Módulo de Operaciones, Inventarios, Consultas, CRUD y Facturación
 * Consume los endpoints REST reales del servidor Express.js mediante helpFetch().
 */

import React, { useEffect, useMemo, useState } from 'react';
import CrudForm from './CrudForm';
import CrudTable from './CrudTable';
import { formatCurrencyCOP, helpFetch } from '../helpers/helpFetch';

const ENTITY_TABS = [
  { id: 'productos', label: 'Productos e Inventario', icon: 'bi-box-seam' },
  { id: 'clientes', label: 'Clientes', icon: 'bi-people' },
  { id: 'proveedores', label: 'Proveedores', icon: 'bi-truck' },
  { id: 'compras', label: 'Compras', icon: 'bi-bag' },
  { id: 'ventas', label: 'Ventas', icon: 'bi-graph-up-arrow' },
  { id: 'facturas', label: 'Facturas', icon: 'bi-receipt' },
];

export default function CrudApp({
  initialEntity = 'productos',
  onDataMutated,
  onOpenFacturaModal,
}) {
  const api = helpFetch();
  const [entity, setEntity] = useState(initialEntity);
  const [dbList, setDbList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [dataToEdit, setDataToEdit] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setEntity(initialEntity);
  }, [initialEntity]);

  const loadEntityData = async (targetEntity) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const items = await api.get(`/api/${targetEntity}`);
      setDbList(Array.isArray(items) ? items : []);
    } catch (err) {
      setErrorMsg(err.statusText || 'Error al consultar el servidor Express.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDataToEdit(null);
    setSearchTerm('');
    setStockFilter('all');
    loadEntityData(entity);
  }, [entity]);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const createData = async (newItem) => {
    try {
      const created = await api.post(`/api/${entity}`, { body: newItem });
      setDbList((prev) => [created, ...prev]);
      notifySuccess('Registro creado y guardado en la base de datos.');
      if (onDataMutated) await onDataMutated();
    } catch (err) {
      setErrorMsg(err.statusText || 'No se pudo crear el registro.');
    }
  };

  const updateData = async (updatedItem) => {
    try {
      const saved = await api.put(`/api/${entity}/${updatedItem.id}`, { body: updatedItem });
      setDbList((prev) => prev.map((it) => (String(it.id) === String(saved.id) ? saved : it)));
      setDataToEdit(null);
      notifySuccess('Registro actualizado correctamente.');
      if (onDataMutated) await onDataMutated();
    } catch (err) {
      setErrorMsg(err.statusText || 'No se pudo actualizar el registro.');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await api.del(`/api/${entity}/${pendingDelete.id}`);
      setDbList((prev) => prev.filter((it) => String(it.id) !== String(pendingDelete.id)));
      setPendingDelete(null);
      notifySuccess('Registro eliminado de la base de datos.');
      if (onDataMutated) await onDataMutated();
    } catch (err) {
      setErrorMsg(err.statusText || 'No se pudo eliminar el registro.');
      setPendingDelete(null);
    }
  };

  const handleAdjustStock = async (id, delta) => {
    try {
      const updated = await api.patch(`/api/productos/${id}/stock`, { body: { delta } });
      setDbList((prev) => prev.map((it) => (String(it.id) === String(updated.id) ? updated : it)));
      notifySuccess(`Inventario actualizado: ${updated.nombre} (${updated.stock} uds).`);
      if (onDataMutated) await onDataMutated();
    } catch (err) {
      setErrorMsg(err.statusText || 'No se pudo ajustar el stock.');
    }
  };

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return dbList.filter((item) => {
      if (entity === 'productos') {
        const stock = Number(item.stock ?? 0);
        const min = Number(item.stockMinimo ?? 2);
        if (stockFilter === 'low' && !(stock > 0 && stock <= min)) return false;
        if (stockFilter === 'out' && stock !== 0) return false;
      }
      if (!q) return true;
      return Object.values(item).some((v) => String(v ?? '').toLowerCase().includes(q));
    });
  }, [dbList, searchTerm, stockFilter, entity]);

  const inventorySummary = useMemo(() => {
    if (entity !== 'productos') return null;
    const totalUnits = dbList.reduce((acc, p) => acc + Number(p.stock ?? 0), 0);
    const totalValuation = dbList.reduce(
      (acc, p) => acc + Number(p.precio ?? 0) * Number(p.stock ?? 0),
      0
    );
    const lowCount = dbList.filter(
      (p) => Number(p.stock ?? 0) <= Number(p.stockMinimo ?? 2)
    ).length;
    return { totalUnits, totalValuation, lowCount };
  }, [dbList, entity]);

  return (
    <div className="container-xl py-4 py-lg-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="badge text-bg-dark mb-2">Gestión Empresarial & Base de Datos</span>
          <h1 className="h2 fw-bold mb-1">Inventario, Operaciones y Facturación</h1>
          <p className="text-secondary mb-0">
            Consultas en tiempo real, control de stock, administración CRUD y registro de facturas.
          </p>
        </div>
      </div>

      {/* Pestañas de Entidades */}
      <ul className="nav nav-pills gap-2 mb-4" role="tablist">
        {ENTITY_TABS.map((tab) => (
          <li key={tab.id} className="nav-item" role="presentation">
            <button
              type="button"
              className={`btn ${entity === tab.id ? 'btn-dark' : 'btn-outline-secondary'} btn-sm px-3 py-2 fw-semibold`}
              onClick={() => setEntity(tab.id)}
            >
              <i className={`bi ${tab.icon} me-2`} aria-hidden="true"></i>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* KPIs de Inventario para Productos */}
      {inventorySummary && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="aw-card p-3">
              <div className="small text-secondary fw-semibold">Unidades Totales en Stock</div>
              <div className="fs-4 fw-bold font-mono">{inventorySummary.totalUnits} uds</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="aw-card p-3">
              <div className="small text-secondary fw-semibold">Valoración Total de Inventario</div>
              <div className="fs-4 fw-bold font-mono">
                {formatCurrencyCOP(inventorySummary.totalValuation)}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="aw-card p-3">
              <div className="small text-secondary fw-semibold">Alertas de Stock Bajo / Agotado</div>
              <div
                className={`fs-4 fw-bold font-mono ${
                  inventorySummary.lowCount > 0 ? 'text-warning' : 'text-success'
                }`}
              >
                {inventorySummary.lowCount} productos
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario CRUD */}
      <div className="mb-4">
        <CrudForm
          entity={entity}
          createData={createData}
          updateData={updateData}
          dataToEdit={dataToEdit}
          setDataToEdit={setDataToEdit}
        />
      </div>

      {/* Barra de Consultas / Filtros */}
      <div className="aw-card p-3 mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <label htmlFor="crud-search" className="visually-hidden">
              Consultar registros
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search" aria-hidden="true"></i>
              </span>
              <input
                id="crud-search"
                type="search"
                className="form-control"
                placeholder={`Consultar en ${entity}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {entity === 'productos' && (
            <div className="col-md-4">
              <label htmlFor="stock-filter" className="visually-hidden">
                Filtrar por stock
              </label>
              <select
                id="stock-filter"
                className="form-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">Todos los niveles de stock</option>
                <option value="low">Stock bajo (reposición sugerida)</option>
                <option value="out">Agotados (0 unidades)</option>
              </select>
            </div>
          )}

          <div className="col-md-2 ms-auto text-md-end small text-secondary font-mono">
            {filteredData.length} registros
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Consultando registros...</span>
          </div>
        </div>
      ) : (
        <CrudTable
          entity={entity}
          data={filteredData}
          setDataToEdit={(item) => {
            setDataToEdit(item);
            const el = document.getElementById('crud-form-card');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onRequestDelete={(item) => setPendingDelete(item)}
          onAdjustStock={handleAdjustStock}
          onViewFactura={onOpenFacturaModal}
        />
      )}

      {/* Modal de Confirmación de Eliminación (sin window.confirm) */}
      {pendingDelete && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmDeleteLabel"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5 fw-bold" id="confirmDeleteLabel">
                    Confirmar Eliminación
                  </h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setPendingDelete(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  ¿Está seguro de eliminar el registro{' '}
                  <strong>
                    {pendingDelete.numero ||
                      pendingDelete.nombre ||
                      pendingDelete.cliente ||
                      pendingDelete.proveedor ||
                      pendingDelete.id}
                  </strong>
                  ? Esta acción no se puede deshacer.
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setPendingDelete(null)}
                  >
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                    Eliminar Definitivamente
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
