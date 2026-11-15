/**
 * Tabla Responsiva Bootstrap 5 para consultas y listados CRUD
 */

import React from 'react';
import CrudTableRow from './CrudTableRow';

const TABLE_HEADERS = {
  productos: ['SKU', 'Producto y Categoría', 'Precio COP', 'Stock e Inventario', 'Estado', 'Acciones'],
  clientes: ['Cliente', 'NIT / Cédula', 'Correo', 'Celular', 'Ciudad', 'Acciones'],
  proveedores: ['Proveedor', 'Servicio', 'Correo', 'Teléfono', 'País', 'Acciones'],
  compras: ['Fecha', 'Proveedor', 'Concepto', 'Costo COP', 'Estado', 'Acciones'],
  ventas: ['Fecha', 'Cliente', 'Solución Vendida', 'Valor COP', 'Estado', 'Acciones'],
  facturas: ['Número', 'Fecha', 'Cliente', 'Método de Pago', 'Total con IVA', 'Acciones'],
};

export default function CrudTable({
  entity,
  data,
  setDataToEdit,
  onRequestDelete,
  onAdjustStock,
  onViewFactura,
}) {
  const headers = TABLE_HEADERS[entity] || [];

  return (
    <div className="aw-card overflow-hidden">
      <div className="table-responsive">
        <table className="table aw-table mb-0">
          <thead>
            <tr>
              {headers.map((head, idx) => (
                <th
                  key={head}
                  className={idx === headers.length - 1 ? 'text-end' : ''}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-4 text-secondary">
                  No se encontraron registros que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <CrudTableRow
                  key={item.id}
                  entity={entity}
                  item={item}
                  setDataToEdit={setDataToEdit}
                  onRequestDelete={onRequestDelete}
                  onAdjustStock={onAdjustStock}
                  onViewFactura={onViewFactura}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
