/**
 * @license
 * Razón Social: Desarrollo de software y Automatización
 * Componente: CrudTableRow.jsx
 * Fila sobria y minimalista con números tabulares y controles limpios.
 */

import React from 'react';

export default function CrudTableRow({ entity, el, setDataToEdit, deleteData }) {
  const formatCurrency = (val) => {
    return `$${Number(val || 0).toLocaleString('es-CO')}`;
  };

  const renderCells = () => {
    switch (entity) {
      case 'productos':
        return (
          <>
            <td className="font-medium text-slate-900">{el.nombre}</td>
            <td className="text-slate-600 text-xs">{el.categoria}</td>
            <td className="text-slate-500 text-xs truncate" style={{ maxWidth: '240px' }} title={el.descripcion}>
              {el.descripcion}
            </td>
            <td className="font-mono text-slate-900 text-end font-semibold">
              {formatCurrency(el.precio)}
            </td>
            <td className="text-slate-600 font-mono text-xs">{el.plazo}</td>
            <td>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  el.estado === 'Activo'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {el.estado || 'Activo'}
              </span>
            </td>
          </>
        );

      case 'clientes':
        return (
          <>
            <td className="font-medium text-slate-900">{el.nombre}</td>
            <td className="font-mono text-xs text-slate-600">{el.nit}</td>
            <td className="text-slate-700 text-xs">{el.contacto}</td>
            <td className="font-mono text-xs text-slate-500">{el.email}</td>
            <td className="font-mono text-xs text-slate-600">{el.telefono}</td>
            <td className="text-slate-600 text-xs">{el.ciudad}</td>
            <td className="text-slate-700 text-xs">{el.sector}</td>
          </>
        );

      case 'proveedores':
        return (
          <>
            <td className="font-medium text-slate-900">{el.nombre}</td>
            <td className="text-slate-700 text-xs font-medium">{el.servicio}</td>
            <td className="text-slate-600 text-xs">{el.contacto}</td>
            <td className="font-mono text-xs text-slate-500">{el.email}</td>
            <td className="font-mono text-xs text-slate-600">{el.telefono}</td>
            <td className="text-slate-500 text-xs">{el.pais || 'Colombia'}</td>
          </>
        );

      case 'compras':
        return (
          <>
            <td className="font-mono text-xs text-slate-500">{el.fecha}</td>
            <td className="font-medium text-slate-900 text-xs">{el.proveedor}</td>
            <td className="text-slate-600 text-xs truncate" style={{ maxWidth: '240px' }} title={el.concepto}>
              {el.concepto}
            </td>
            <td className="text-slate-500 text-xs">{el.categoria}</td>
            <td className="font-mono text-end font-semibold text-rose-700">
              {formatCurrency(el.costo)}
            </td>
            <td className="text-slate-600 text-xs">{el.metodoPago}</td>
            <td>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  el.estado === 'Pagado'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {el.estado || 'Pagado'}
              </span>
            </td>
          </>
        );

      case 'ventas':
        return (
          <>
            <td className="font-mono text-xs text-slate-500">{el.fecha}</td>
            <td className="font-medium text-slate-900 text-xs">{el.cliente}</td>
            <td className="text-slate-700 text-xs">{el.producto}</td>
            <td className="font-mono text-end font-semibold text-emerald-700">
              {formatCurrency(el.valor)}
            </td>
            <td className="text-slate-500 text-xs">{el.formaPago}</td>
            <td>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  el.estado === 'Implementado' || el.estado === 'Facturado'
                    ? 'bg-emerald-50 text-emerald-700'
                    : el.estado === 'En Desarrollo'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {el.estado}
              </span>
            </td>
            <td className="text-slate-500 text-xs">{el.responsable}</td>
          </>
        );

      default:
        return <td>{JSON.stringify(el)}</td>;
    }
  };

  return (
    <tr>
      <td className="font-mono text-center text-slate-400 text-xs">{el.id}</td>
      {renderCells()}
      <td className="text-end whitespace-nowrap">
        <div className="d-inline-flex gap-1">
          <button
            type="button"
            className="btn btn-link btn-sm text-slate-600 hover:text-slate-900 p-1 text-xs text-decoration-none"
            onClick={() => setDataToEdit(el)}
            title="Editar registro"
          >
            <i className="bi bi-pencil me-1"></i>Editar
          </button>
          <button
            type="button"
            className="btn btn-link btn-sm text-slate-400 hover:text-rose-600 p-1 text-xs text-decoration-none"
            onClick={() => deleteData(el.id, el.nombre || el.concepto || el.producto || 'este registro')}
            title="Eliminar registro"
          >
            <i className="bi bi-trash3 me-1"></i>Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
