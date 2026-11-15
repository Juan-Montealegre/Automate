/**
 * Formulario Dinámico CRUD con Validación por Expresiones Regulares (Bootstrap 5)
 * Soporta Productos/Inventario, Clientes, Proveedores, Compras y Ventas.
 */

import React, { useEffect, useState } from 'react';
import {
  isValidColombianMobile,
  isValidDocumento,
  isValidEmail,
  isValidPositiveNumber,
} from '../helpers/validators';

const INITIAL_FORMS = {
  productos: {
    sku: '',
    nombre: '',
    categoria: 'Desarrollo Web',
    descripcion: '',
    precio: '',
    stock: '5',
    stockMinimo: '2',
    plazo: '4 semanas',
    estado: 'Activo',
    tecnologia: '',
    imagenKey: 'slide_web',
  },
  clientes: {
    nombre: '',
    nit: '',
    contacto: '',
    email: '',
    telefono: '',
    ciudad: 'Bogotá D.C.',
    sector: '',
    estado: 'Activo',
  },
  proveedores: {
    nombre: '',
    servicio: '',
    contacto: '',
    email: '',
    telefono: '',
    pais: 'Colombia',
    estado: 'Activo',
  },
  compras: {
    fecha: new Date().toISOString().split('T')[0],
    proveedor: '',
    concepto: '',
    categoria: 'Infraestructura Cloud',
    costo: '',
    metodoPago: 'Transferencia Bancaria',
    estado: 'Pagado',
  },
  ventas: {
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    producto: '',
    cantidad: '1',
    valor: '',
    formaPago: 'PSE Empresarial',
    estado: 'Facturado',
    responsable: '',
  },
};

export default function CrudForm({
  entity,
  createData,
  updateData,
  dataToEdit,
  setDataToEdit,
}) {
  const [form, setForm] = useState(INITIAL_FORMS[entity] || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    if (dataToEdit) {
      setForm({ ...INITIAL_FORMS[entity], ...dataToEdit });
    } else {
      setForm(INITIAL_FORMS[entity] || {});
    }
  }, [dataToEdit, entity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (entity === 'productos') {
      if (!String(form.nombre || '').trim() || String(form.nombre).trim().length < 3) {
        nextErrors.nombre = 'El nombre del producto debe tener al menos 3 caracteres.';
      }
      if (!isValidPositiveNumber(form.precio, false)) {
        nextErrors.precio = 'Ingrese un precio válido mayor a 0.';
      }
      if (!isValidPositiveNumber(form.stock, true)) {
        nextErrors.stock = 'El stock debe ser un número mayor o igual a 0.';
      }
    }

    if (entity === 'clientes') {
      if (!String(form.nombre || '').trim() || String(form.nombre).trim().length < 3) {
        nextErrors.nombre = 'Ingrese la razón social o nombre del cliente.';
      }
      if (!isValidDocumento(form.nit)) {
        nextErrors.nit = 'NIT/Documento inválido (6 a 15 dígitos).';
      }
      if (!isValidEmail(form.email)) {
        nextErrors.email = 'Correo electrónico inválido.';
      }
      if (!isValidColombianMobile(form.telefono)) {
        nextErrors.telefono = 'Celular colombiano inválido (ej. +57 3104829104).';
      }
    }

    if (entity === 'proveedores') {
      if (!String(form.nombre || '').trim() || String(form.nombre).trim().length < 3) {
        nextErrors.nombre = 'Ingrese el nombre del proveedor.';
      }
      if (!String(form.servicio || '').trim()) {
        nextErrors.servicio = 'Describa el servicio o insumo suministrado.';
      }
      if (!isValidEmail(form.email)) {
        nextErrors.email = 'Correo electrónico inválido.';
      }
      if (!isValidColombianMobile(form.telefono)) {
        nextErrors.telefono = 'Teléfono móvil inválido (ej. +57 3001234567).';
      }
    }

    if (entity === 'compras') {
      if (!String(form.proveedor || '').trim()) {
        nextErrors.proveedor = 'Indique el proveedor.';
      }
      if (!String(form.concepto || '').trim()) {
        nextErrors.concepto = 'Indique el concepto de la compra.';
      }
      if (!isValidPositiveNumber(form.costo, false)) {
        nextErrors.costo = 'Ingrese un valor mayor a 0.';
      }
    }

    if (entity === 'ventas') {
      if (!String(form.cliente || '').trim()) {
        nextErrors.cliente = 'Indique el nombre del cliente.';
      }
      if (!String(form.producto || '').trim()) {
        nextErrors.producto = 'Indique el producto o servicio vendido.';
      }
      if (!isValidPositiveNumber(form.valor, false)) {
        nextErrors.valor = 'Ingrese un monto de venta mayor a 0.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...form };
    if (payload.precio !== undefined) payload.precio = Number(payload.precio);
    if (payload.stock !== undefined) payload.stock = Number(payload.stock);
    if (payload.stockMinimo !== undefined) payload.stockMinimo = Number(payload.stockMinimo);
    if (payload.costo !== undefined) payload.costo = Number(payload.costo);
    if (payload.valor !== undefined) payload.valor = Number(payload.valor);
    if (payload.cantidad !== undefined) payload.cantidad = Number(payload.cantidad);

    if (dataToEdit) {
      updateData(payload);
    } else {
      createData(payload);
      setForm(INITIAL_FORMS[entity] || {});
    }
  };

  const handleReset = () => {
    setErrors({});
    setForm(INITIAL_FORMS[entity] || {});
    setDataToEdit(null);
  };

  if (entity === 'facturas') {
    return (
      <div className="aw-card p-4">
        <h2 className="h5 fw-bold mb-2">Historial de Facturación</h2>
        <p className="small text-secondary mb-0">
          Las facturas electrónicas se generan automáticamente al completar compras en la Tienda y Pasarela de Pago. Selecciona cualquier factura de la tabla para ver o imprimir su comprobante.
        </p>
      </div>
    );
  }

  return (
    <div id="crud-form-card" className="aw-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <h2 className="h5 fw-bold mb-0">
          {dataToEdit ? 'Editar Registro' : 'Nuevo Registro'} ·{' '}
          <span className="text-capitalize">{entity}</span>
        </h2>
        {dataToEdit && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={handleReset}
          >
            Cancelar Edición
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {entity === 'productos' && (
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="prod-sku" className="form-label small fw-semibold">
                SKU
              </label>
              <input
                id="prod-sku"
                name="sku"
                type="text"
                className="form-control font-mono"
                value={form.sku || ''}
                onChange={handleChange}
                placeholder="AW-SKU-007"
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="prod-nombre" className="form-label small fw-semibold">
                Nombre del Producto / Solución *
              </label>
              <input
                id="prod-nombre"
                name="nombre"
                type="text"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                value={form.nombre || ''}
                onChange={handleChange}
                placeholder="Ej. Módulo BI Automatizado"
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="prod-categoria" className="form-label small fw-semibold">
                Categoría
              </label>
              <select
                id="prod-categoria"
                name="categoria"
                className="form-select"
                value={form.categoria || 'Desarrollo Web'}
                onChange={handleChange}
              >
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="Automatización RPA">Automatización RPA</option>
                <option value="APIs & Microservicios">APIs & Microservicios</option>
                <option value="Infraestructura Cloud">Infraestructura Cloud</option>
                <option value="Inteligencia Artificial">Inteligencia Artificial</option>
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="prod-precio" className="form-label small fw-semibold">
                Precio COP *
              </label>
              <input
                id="prod-precio"
                name="precio"
                type="number"
                className={`form-control font-mono ${errors.precio ? 'is-invalid' : ''}`}
                value={form.precio || ''}
                onChange={handleChange}
                placeholder="4500000"
              />
              {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
            </div>
            <div className="col-md-2">
              <label htmlFor="prod-stock" className="form-label small fw-semibold">
                Stock *
              </label>
              <input
                id="prod-stock"
                name="stock"
                type="number"
                min="0"
                className={`form-control font-mono ${errors.stock ? 'is-invalid' : ''}`}
                value={form.stock ?? ''}
                onChange={handleChange}
              />
              {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
            </div>
            <div className="col-md-2">
              <label htmlFor="prod-stockmin" className="form-label small fw-semibold">
                Stock Mín.
              </label>
              <input
                id="prod-stockmin"
                name="stockMinimo"
                type="number"
                min="1"
                className="form-control font-mono"
                value={form.stockMinimo ?? '2'}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="prod-plazo" className="form-label small fw-semibold">
                Plazo
              </label>
              <input
                id="prod-plazo"
                name="plazo"
                type="text"
                className="form-control"
                value={form.plazo || ''}
                onChange={handleChange}
                placeholder="4 semanas"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="prod-tech" className="form-label small fw-semibold">
                Tecnología
              </label>
              <input
                id="prod-tech"
                name="tecnologia"
                type="text"
                className="form-control"
                value={form.tecnologia || ''}
                onChange={handleChange}
                placeholder="React, Express, Node.js"
              />
            </div>
            <div className="col-12">
              <label htmlFor="prod-desc" className="form-label small fw-semibold">
                Descripción Comercial
              </label>
              <textarea
                id="prod-desc"
                name="descripcion"
                rows="2"
                className="form-control"
                value={form.descripcion || ''}
                onChange={handleChange}
                placeholder="Detalle funcional de la solución..."
              ></textarea>
            </div>
          </div>
        )}

        {entity === 'clientes' && (
          <div className="row g-3">
            <div className="col-md-5">
              <label htmlFor="cli-nombre" className="form-label small fw-semibold">
                Razón Social / Nombre *
              </label>
              <input
                id="cli-nombre"
                name="nombre"
                type="text"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                value={form.nombre || ''}
                onChange={handleChange}
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>
            <div className="col-md-3">
              <label htmlFor="cli-nit" className="form-label small fw-semibold">
                NIT / Cédula *
              </label>
              <input
                id="cli-nit"
                name="nit"
                type="text"
                className={`form-control font-mono ${errors.nit ? 'is-invalid' : ''}`}
                value={form.nit || ''}
                onChange={handleChange}
                placeholder="900.123.456-7"
              />
              {errors.nit && <div className="invalid-feedback">{errors.nit}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="cli-contacto" className="form-label small fw-semibold">
                Persona de Contacto
              </label>
              <input
                id="cli-contacto"
                name="contacto"
                type="text"
                className="form-control"
                value={form.contacto || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="cli-email" className="form-label small fw-semibold">
                Correo Electrónico *
              </label>
              <input
                id="cli-email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={form.email || ''}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="cli-tel" className="form-label small fw-semibold">
                Celular Colombia *
              </label>
              <input
                id="cli-tel"
                name="telefono"
                type="tel"
                className={`form-control font-mono ${errors.telefono ? 'is-invalid' : ''}`}
                value={form.telefono || ''}
                onChange={handleChange}
                placeholder="+57 3104829104"
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="cli-ciudad" className="form-label small fw-semibold">
                Ciudad
              </label>
              <input
                id="cli-ciudad"
                name="ciudad"
                type="text"
                className="form-control"
                value={form.ciudad || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {entity === 'proveedores' && (
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="prov-nombre" className="form-label small fw-semibold">
                Nombre del Proveedor *
              </label>
              <input
                id="prov-nombre"
                name="nombre"
                type="text"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                value={form.nombre || ''}
                onChange={handleChange}
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="prov-serv" className="form-label small fw-semibold">
                Servicio Suministrado *
              </label>
              <input
                id="prov-serv"
                name="servicio"
                type="text"
                className={`form-control ${errors.servicio ? 'is-invalid' : ''}`}
                value={form.servicio || ''}
                onChange={handleChange}
              />
              {errors.servicio && <div className="invalid-feedback">{errors.servicio}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="prov-contacto" className="form-label small fw-semibold">
                Contacto
              </label>
              <input
                id="prov-contacto"
                name="contacto"
                type="text"
                className="form-control"
                value={form.contacto || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="prov-email" className="form-label small fw-semibold">
                Correo Electrónico *
              </label>
              <input
                id="prov-email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={form.email || ''}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="prov-tel" className="form-label small fw-semibold">
                Celular *
              </label>
              <input
                id="prov-tel"
                name="telefono"
                type="tel"
                className={`form-control font-mono ${errors.telefono ? 'is-invalid' : ''}`}
                value={form.telefono || ''}
                onChange={handleChange}
                placeholder="+57 3101234567"
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="prov-pais" className="form-label small fw-semibold">
                País
              </label>
              <input
                id="prov-pais"
                name="pais"
                type="text"
                className="form-control"
                value={form.pais || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {entity === 'compras' && (
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="comp-fecha" className="form-label small fw-semibold">
                Fecha
              </label>
              <input
                id="comp-fecha"
                name="fecha"
                type="date"
                className="form-control font-mono"
                value={form.fecha || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="comp-prov" className="form-label small fw-semibold">
                Proveedor *
              </label>
              <input
                id="comp-prov"
                name="proveedor"
                type="text"
                className={`form-control ${errors.proveedor ? 'is-invalid' : ''}`}
                value={form.proveedor || ''}
                onChange={handleChange}
              />
              {errors.proveedor && <div className="invalid-feedback">{errors.proveedor}</div>}
            </div>
            <div className="col-md-5">
              <label htmlFor="comp-conc" className="form-label small fw-semibold">
                Concepto *
              </label>
              <input
                id="comp-conc"
                name="concepto"
                type="text"
                className={`form-control ${errors.concepto ? 'is-invalid' : ''}`}
                value={form.concepto || ''}
                onChange={handleChange}
              />
              {errors.concepto && <div className="invalid-feedback">{errors.concepto}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="comp-costo" className="form-label small fw-semibold">
                Costo COP *
              </label>
              <input
                id="comp-costo"
                name="costo"
                type="number"
                className={`form-control font-mono ${errors.costo ? 'is-invalid' : ''}`}
                value={form.costo || ''}
                onChange={handleChange}
              />
              {errors.costo && <div className="invalid-feedback">{errors.costo}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="comp-pago" className="form-label small fw-semibold">
                Método de Pago
              </label>
              <select
                id="comp-pago"
                name="metodoPago"
                className="form-select"
                value={form.metodoPago || 'Transferencia Bancaria'}
                onChange={handleChange}
              >
                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                <option value="Tarjeta Corporativa">Tarjeta Corporativa</option>
                <option value="PSE">PSE</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="comp-estado" className="form-label small fw-semibold">
                Estado
              </label>
              <select
                id="comp-estado"
                name="estado"
                className="form-select"
                value={form.estado || 'Pagado'}
                onChange={handleChange}
              >
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        )}

        {entity === 'ventas' && (
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="ven-fecha" className="form-label small fw-semibold">
                Fecha
              </label>
              <input
                id="ven-fecha"
                name="fecha"
                type="date"
                className="form-control font-mono"
                value={form.fecha || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="ven-cliente" className="form-label small fw-semibold">
                Cliente *
              </label>
              <input
                id="ven-cliente"
                name="cliente"
                type="text"
                className={`form-control ${errors.cliente ? 'is-invalid' : ''}`}
                value={form.cliente || ''}
                onChange={handleChange}
              />
              {errors.cliente && <div className="invalid-feedback">{errors.cliente}</div>}
            </div>
            <div className="col-md-5">
              <label htmlFor="ven-producto" className="form-label small fw-semibold">
                Producto / Servicio *
              </label>
              <input
                id="ven-producto"
                name="producto"
                type="text"
                className={`form-control ${errors.producto ? 'is-invalid' : ''}`}
                value={form.producto || ''}
                onChange={handleChange}
              />
              {errors.producto && <div className="invalid-feedback">{errors.producto}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="ven-valor" className="form-label small fw-semibold">
                Valor Total COP *
              </label>
              <input
                id="ven-valor"
                name="valor"
                type="number"
                className={`form-control font-mono ${errors.valor ? 'is-invalid' : ''}`}
                value={form.valor || ''}
                onChange={handleChange}
              />
              {errors.valor && <div className="invalid-feedback">{errors.valor}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="ven-pago" className="form-label small fw-semibold">
                Forma de Pago
              </label>
              <select
                id="ven-pago"
                name="formaPago"
                className="form-select"
                value={form.formaPago || 'PSE Empresarial'}
                onChange={handleChange}
              >
                <option value="PSE Empresarial">PSE Empresarial</option>
                <option value="Tarjeta Corporativa">Tarjeta Corporativa</option>
                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                <option value="Contado">Contado</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="ven-estado" className="form-label small fw-semibold">
                Estado
              </label>
              <select
                id="ven-estado"
                name="estado"
                className="form-select"
                value={form.estado || 'Facturado'}
                onChange={handleChange}
              >
                <option value="Facturado">Facturado</option>
                <option value="En Desarrollo">En Desarrollo</option>
                <option value="Implementado">Implementado</option>
                <option value="En Cotización">En Cotización</option>
              </select>
            </div>
          </div>
        )}

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-dark px-4 fw-semibold">
            <i className="bi bi-save me-2" aria-hidden="true"></i>
            {dataToEdit ? 'Guardar Cambios' : 'Registrar'}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
