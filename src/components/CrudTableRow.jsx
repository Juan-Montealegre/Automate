/**
 * Fila individual de tabla CRUD con soporte de ajuste rápido de stock e inspección de factura.
 */

import React from 'react';
import { formatCurrencyCOP } from '../helpers/helpFetch';

export default function CrudTableRow({
  entity,
  item,
  setDataToEdit,
  onRequestDelete,
  onAdjustStock,
  onViewFactura,
}) {
  return (
    <tr>
      {entity === 'productos' && (
        <>
          <td className="font-mono small">{item.sku || `AW-${item.id}`}</td>
          <td>
            <div className="fw-semibold">{item.nombre}</div>
            <div className="small text-secondary">{item.categoria}</div>
          </td>
          <td className="font-mono fw-semibold">{formatCurrencyCOP(item.precio)}</td>
          <td>
            <div className="d-flex align-items-center gap-2">
              <span
                className={`badge font-mono ${
                  Number(item.stock ?? 0) === 0
                    ? 'text-bg-danger'
                    : Number(item.stock ?? 0) <= Number(item.stockMinimo ?? 2)
                    ? 'text-bg-warning text-dark'
                    : 'text-bg-success'
                }`}
              >
                {item.stock ?? 0} uds
              </span>
              <div className="btn-group btn-group-sm" role="group" aria-label="Ajustar stock">
                <button
                  type="button"
                  className="btn btn-outline-secondary py-0 px-2"
                  title="Descontar 1 unidad"
                  aria-label={`Descontar 1 unidad de ${item.nombre}`}
                  onClick={() => onAdjustStock(item.id, -1)}
                >
                  -1
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary py-0 px-2"
                  title="Reabastecer 5 unidades"
                  aria-label={`Agregar 5 unidades a ${item.nombre}`}
                  onClick={() => onAdjustStock(item.id, 5)}
                >
                  +5
                </button>
              </div>
            </div>
          </td>
          <td>
            <span
              className={`badge ${
                item.estado === 'Agotado' ? 'text-bg-danger' : 'text-bg-light border text-dark'
              }`}
            >
              {item.estado}
            </span>
          </td>
        </>
      )}

      {entity === 'clientes' && (
        <>
          <td>
            <div className="fw-semibold">{item.nombre}</div>
            <div className="small text-secondary">{item.contacto}</div>
          </td>
          <td className="font-mono small">{item.nit}</td>
          <td className="small">{item.email}</td>
          <td className="font-mono small">{item.telefono}</td>
          <td className="small">{item.ciudad}</td>
        </>
      )}

      {entity === 'proveedores' && (
        <>
          <td className="fw-semibold">{item.nombre}</td>
          <td className="small">{item.servicio}</td>
          <td className="small">{item.email}</td>
          <td className="font-mono small">{item.telefono}</td>
          <td className="small">{item.pais}</td>
        </>
      )}

      {entity === 'compras' && (
        <>
          <td className="font-mono small">{item.fecha}</td>
          <td className="fw-semibold">{item.proveedor}</td>
          <td className="small">{item.concepto}</td>
          <td className="font-mono fw-semibold">{formatCurrencyCOP(item.costo)}</td>
          <td>
            <span
              className={`badge ${
                item.estado === 'Pagado' ? 'text-bg-success' : 'text-bg-warning text-dark'
              }`}
            >
              {item.estado}
            </span>
          </td>
        </>
      )}

      {entity === 'ventas' && (
        <>
          <td className="font-mono small">{item.fecha}</td>
          <td className="fw-semibold">{item.cliente}</td>
          <td className="small">{item.producto}</td>
          <td className="font-mono fw-semibold">{formatCurrencyCOP(item.valor)}</td>
          <td>
            <span className="badge text-bg-light border text-dark">{item.estado}</span>
          </td>
        </>
      )}

      {entity === 'facturas' && (
        <>
          <td className="font-mono fw-bold">{item.numero}</td>
          <td className="font-mono small">{item.fecha}</td>
          <td>
            <div className="fw-semibold">{item.clienteNombre}</div>
            <div className="small text-secondary font-mono">{item.clienteDocumento}</div>
          </td>
          <td className="small">{item.metodoPago}</td>
          <td className="font-mono fw-bold text-primary">{formatCurrencyCOP(item.total)}</td>
        </>
      )}

      <td className="text-end text-nowrap">
        {entity === 'facturas' ? (
          <button
            type="button"
            className="btn btn-sm btn-outline-dark me-1"
            onClick={() => onViewFactura(item)}
          >
            <i className="bi bi-receipt me-1" aria-hidden="true"></i>
            Ver / Imprimir
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-outline-primary me-1"
            aria-label={`Editar ${item.nombre || item.cliente || item.proveedor || item.id}`}
            onClick={() => setDataToEdit(item)}
          >
            <i className="bi bi-pencil" aria-hidden="true"></i>
          </button>
        )}
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          aria-label={`Eliminar registro ${item.numero || item.nombre || item.cliente || item.id}`}
          onClick={() => onRequestDelete(item)}
        >
          <i className="bi bi-trash" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
  );
}
