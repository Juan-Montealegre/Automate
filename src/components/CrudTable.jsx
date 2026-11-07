/**
 * @license
 * Proyecto: Automate Webs
 * Componente: CrudTable.jsx
 * Tabla comercial sobria y minimalista para visualización y gestión de datos.
 */

import React, { useState } from 'react';
import CrudTableRow from './CrudTableRow';

export default function CrudTable({
  entity,
  data,
  setDataToEdit,
  deleteData,
  loading,
  title,
  onAddNew,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const getHeaders = () => {
    switch (entity) {
      case 'productos':
        return ['ID', 'Servicio / Software', 'Categoría', 'Alcance Técnico', 'Precio (COP)', 'Plazo', 'Estado', 'Acciones'];
      case 'clientes':
        return ['ID', 'Razón Social / Cliente', 'NIT / CC', 'Contacto', 'Email', 'Teléfono', 'Ciudad', 'Sector', 'Acciones'];
      case 'proveedores':
        return ['ID', 'Proveedor', 'Servicio Tecnológico', 'Contacto', 'Email', 'Teléfono', 'País', 'Acciones'];
      case 'compras':
        return ['ID', 'Fecha', 'Proveedor', 'Concepto / Insumo', 'Categoría', 'Costo (COP)', 'Método', 'Estado', 'Acciones'];
      case 'ventas':
        return ['ID', 'Fecha', 'Cliente', 'Servicio Contratado', 'Valor (COP)', 'Forma de Pago', 'Estado', 'Responsable', 'Acciones'];
      default:
        return ['ID', 'Datos', 'Acciones'];
    }
  };

  const headers = getHeaders();

  const filteredData = (data || []).filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(term)
    );
  });

  return (
    <div className="card-minimal overflow-hidden bg-white">
      {/* Header de la Tabla: Título, Conteo y Buscador Minimalista */}
      <div className="p-3.5 border-bottom border-subtle-custom d-flex flex-wrap align-items-center justify-content-between gap-3 bg-white">
        <div className="d-flex align-items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 mb-0">
            {title}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ({filteredData.length} de {(data || []).length})
          </span>
        </div>

        {/* Buscador sutil */}
        <div className="d-flex align-items-center gap-2" style={{ maxWidth: '300px', width: '100%' }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-slate-50 border-subtle-custom border-end-0 text-slate-400">
              <i className="bi bi-search text-xs"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm bg-slate-50 border-subtle-custom border-start-0 text-xs"
              placeholder={`Filtrar ${entity}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary btn-sm bg-slate-50 border-subtle-custom"
                type="button"
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="table-responsive">
        <table className="table table-custom mb-0">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={
                    h.includes('(COP)')
                      ? 'text-end'
                      : h === 'ID'
                      ? 'text-center'
                      : h === 'Acciones'
                      ? 'text-end'
                      : ''
                  }
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-5 text-slate-400 text-xs">
                  <div className="spinner-border spinner-border-sm me-2 text-slate-700" role="status"></div>
                  Cargando datos...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((el) => (
                <CrudTableRow
                  key={el.id}
                  entity={entity}
                  el={el}
                  setDataToEdit={setDataToEdit}
                  deleteData={deleteData}
                />
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-5">
                  <div className="text-slate-400 mb-2">
                    <i className="bi bi-inbox fs-2"></i>
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mb-1">
                    No se encontraron registros
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {searchTerm
                      ? `No hay coincidencias para "${searchTerm}".`
                      : 'La base de datos no contiene elementos en esta sección.'}
                  </p>
                  {!searchTerm && onAddNew && (
                    <button
                      type="button"
                      className="btn btn-dark btn-sm px-3 py-1.5 text-xs font-medium"
                      onClick={onAddNew}
                    >
                      <i className="bi bi-plus-lg me-1"></i>Crear Primer Registro
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer sobrio */}
      <div className="px-4 py-2.5 bg-slate-50 border-top border-subtle-custom d-flex justify-content-between align-items-center text-xs text-slate-400">
        <div>
          <span>Registro y control centralizado</span>
        </div>
        <div>
          <span>{filteredData.length} registros</span>
        </div>
      </div>
    </div>
  );
}
