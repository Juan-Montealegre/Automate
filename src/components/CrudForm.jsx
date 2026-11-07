/**
 * @license
 * Proyecto: Automate Webs
 * Componente: CrudForm.jsx
 * Formulario de creación y edición sobrio, minimalista y comercial.
 */

import React, { useState, useEffect } from 'react';

export default function CrudForm({
  entity,
  createData,
  updateData,
  dataToEdit,
  setDataToEdit,
  entityTitle,
}) {
  const getInitialForm = () => {
    switch (entity) {
      case 'productos':
        return {
          id: null,
          nombre: '',
          categoria: 'Desarrollo Web',
          descripcion: '',
          precio: '',
          plazo: '4 semanas',
          estado: 'Activo',
        };
      case 'clientes':
        return {
          id: null,
          nombre: '',
          nit: '',
          contacto: '',
          email: '',
          telefono: '',
          ciudad: 'Bogotá D.C.',
          sector: 'Tecnología',
        };
      case 'proveedores':
        return {
          id: null,
          nombre: '',
          servicio: 'Infraestructura Cloud',
          contacto: '',
          email: '',
          telefono: '',
          pais: 'Colombia',
        };
      case 'compras':
        return {
          id: null,
          fecha: new Date().toISOString().split('T')[0],
          proveedor: '',
          concepto: '',
          categoria: 'Infraestructura Cloud',
          costo: '',
          metodoPago: 'Transferencia Bancaria',
          estado: 'Pagado',
        };
      case 'ventas':
        return {
          id: null,
          fecha: new Date().toISOString().split('T')[0],
          cliente: '',
          producto: '',
          valor: '',
          formaPago: '50% Anticipo / 50% Entrega',
          estado: 'En Desarrollo',
          responsable: 'Equipo de Desarrollo',
        };
      default:
        return { id: null };
    }
  };

  const [form, setForm] = useState(getInitialForm());
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (dataToEdit) {
      setForm(dataToEdit);
      setErrorMessage('');
    } else {
      setForm(getInitialForm());
    }
  }, [dataToEdit, entity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setForm(getInitialForm());
    setDataToEdit(null);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (entity === 'productos' && (!form.nombre.trim() || !form.precio)) {
      setErrorMessage('Ingresa el nombre del software/servicio y el precio.');
      return;
    }
    if (entity === 'clientes' && (!form.nombre.trim() || !form.nit.trim())) {
      setErrorMessage('Ingresa la razón social y el NIT o documento del cliente.');
      return;
    }
    if (entity === 'proveedores' && (!form.nombre.trim() || !form.contacto.trim())) {
      setErrorMessage('Ingresa el nombre del proveedor y contacto comercial.');
      return;
    }
    if (entity === 'compras' && (!form.concepto.trim() || !form.costo)) {
      setErrorMessage('Ingresa el concepto del gasto y el costo total.');
      return;
    }
    if (entity === 'ventas' && (!form.cliente.trim() || !form.valor)) {
      setErrorMessage('Ingresa el nombre del cliente y el valor del contrato.');
      return;
    }

    setErrorMessage('');

    if (form.id === null) {
      createData(form);
    } else {
      updateData(form);
    }

    handleReset();
  };

  return (
    <div className="card-minimal p-4 bg-white border border-slate-200">
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-0">
            {dataToEdit ? `Editar Registro (ID: ${dataToEdit.id})` : `Nuevo Registro en ${entityTitle || entity}`}
          </h4>
        </div>

        <button
          type="button"
          className="btn-close"
          style={{ fontSize: '0.7rem' }}
          onClick={handleReset}
          title="Cerrar formulario"
        ></button>
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-md text-xs mb-3">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Productos */}
        {entity === 'productos' && (
          <div className="row g-3">
            <div className="col-md-5">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Software / Servicio *</label>
              <input
                type="text"
                name="nombre"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: Plataforma CRM a Medida"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Categoría *</label>
              <select
                name="categoria"
                className="form-select form-select-sm form-select-minimal"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="Automatización RPA">Automatización RPA</option>
                <option value="APIs & Microservicios">APIs & Microservicios</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Soporte Continuo">Soporte Continuo</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Precio (COP) *</label>
              <input
                type="number"
                name="precio"
                className="form-control form-control-sm form-control-minimal font-mono"
                placeholder="0"
                value={form.precio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Plazo Entrega</label>
              <input
                type="text"
                name="plazo"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: 4 semanas"
                value={form.plazo}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-9">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Alcance Técnico & Descripción</label>
              <input
                type="text"
                name="descripcion"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Entregables principales, stack tecnológico..."
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Estado</label>
              <select
                name="estado"
                className="form-select form-select-sm form-select-minimal"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="Activo">Activo</option>
                <option value="En Pausa">En Pausa</option>
                <option value="Descontinuado">Descontinuado</option>
              </select>
            </div>
          </div>
        )}

        {/* Clientes */}
        {entity === 'clientes' && (
          <div className="row g-3">
            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Razón Social / Nombre *</label>
              <input
                type="text"
                name="nombre"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: Logística Andina S.A.S."
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">NIT o Documento *</label>
              <input
                type="text"
                name="nit"
                className="form-control form-control-sm form-control-minimal font-mono"
                placeholder="900.000.000-1"
                value={form.nit}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Persona de Contacto</label>
              <input
                type="text"
                name="contacto"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Nombre contacto"
                value={form.contacto}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-sm form-control-minimal font-mono"
                placeholder="contacto@empresa.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="form-control form-control-sm form-control-minimal font-mono"
                placeholder="+57 300 000 0000"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Bogotá, Medellín..."
                value={form.ciudad}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Sector</label>
              <select
                name="sector"
                className="form-select form-select-sm form-select-minimal"
                value={form.sector}
                onChange={handleChange}
              >
                <option value="Tecnología">Tecnología</option>
                <option value="Salud y Farmacia">Salud y Farmacia</option>
                <option value="Transporte y Logística">Transporte y Logística</option>
                <option value="Construcción e Inmobiliario">Construcción e Inmobiliario</option>
                <option value="Fintech & Finanzas">Fintech & Finanzas</option>
                <option value="Agroindustria">Agroindustria</option>
              </select>
            </div>
          </div>
        )}

        {/* Proveedores */}
        {entity === 'proveedores' && (
          <div className="row g-3">
            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Proveedor *</label>
              <input
                type="text"
                name="nombre"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: AWS Latam"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Servicio Tecnológico *</label>
              <input
                type="text"
                name="servicio"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: Servidores Cloud EC2"
                value={form.servicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Contacto</label>
              <input
                type="text"
                name="contacto"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Nombre o área"
                value={form.contacto}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-sm form-control-minimal font-mono"
                placeholder="billing@proveedor.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="form-control form-control-sm form-control-minimal font-mono"
                placeholder="+1 800..."
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">País / Región</label>
              <input
                type="text"
                name="pais"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Colombia, EE.UU."
                value={form.pais}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Compras */}
        {entity === 'compras' && (
          <div className="row g-3">
            <div className="col-md-2">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Fecha *</label>
              <input
                type="date"
                name="fecha"
                className="form-control form-control-sm form-control-minimal font-mono"
                value={form.fecha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Proveedor *</label>
              <input
                type="text"
                name="proveedor"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: AWS"
                value={form.proveedor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Concepto / Insumo *</label>
              <input
                type="text"
                name="concepto"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: Instancias EC2 Producción"
                value={form.concepto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Costo Total (COP) *</label>
              <input
                type="number"
                name="costo"
                className="form-control form-control-sm form-control-minimal font-mono"
                placeholder="0"
                value={form.costo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Categoría</label>
              <select
                name="categoria"
                className="form-select form-select-sm form-select-minimal"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="Infraestructura Cloud">Infraestructura Cloud</option>
                <option value="Licenciamiento de Software">Licenciamiento de Software</option>
                <option value="Seguridad Web">Seguridad Web</option>
                <option value="Herramientas de Automatización">Herramientas de Automatización</option>
                <option value="Comunicaciones & SMS">Comunicaciones & SMS</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Método de Pago</label>
              <select
                name="metodoPago"
                className="form-select form-select-sm form-select-minimal"
                value={form.metodoPago}
                onChange={handleChange}
              >
                <option value="Tarjeta Corporativa">Tarjeta Corporativa</option>
                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                <option value="Factura a 30 Días">Factura a 30 Días</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Estado del Pago</label>
              <select
                name="estado"
                className="form-select form-select-sm form-select-minimal"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Anulado">Anulado</option>
              </select>
            </div>
          </div>
        )}

        {/* Ventas */}
        {entity === 'ventas' && (
          <div className="row g-3">
            <div className="col-md-2">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Fecha *</label>
              <input
                type="date"
                name="fecha"
                className="form-control form-control-sm form-control-minimal font-mono"
                value={form.fecha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Cliente *</label>
              <input
                type="text"
                name="cliente"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: Constructora El Roble"
                value={form.cliente}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Servicio Contratado *</label>
              <input
                type="text"
                name="producto"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: Plataforma Web ERP"
                value={form.producto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Valor Contrato (COP) *</label>
              <input
                type="number"
                name="valor"
                className="form-control form-control-sm form-control-minimal font-mono"
                placeholder="0"
                value={form.valor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Forma de Pago</label>
              <select
                name="formaPago"
                className="form-select form-select-sm form-select-minimal"
                value={form.formaPago}
                onChange={handleChange}
              >
                <option value="Contado">Contado</option>
                <option value="50% Anticipo / 50% Entrega">50% Anticipo / 50% Entrega</option>
                <option value="3 Cuotas Hitos">3 Cuotas Hitos</option>
                <option value="Mensual Recurrente">Mensual Recurrente</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Estado del Proyecto</label>
              <select
                name="estado"
                className="form-select form-select-sm form-select-minimal"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="En Cotización">En Cotización</option>
                <option value="En Desarrollo">En Desarrollo</option>
                <option value="Implementado">Implementado</option>
                <option value="Facturado">Facturado</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="text-xs font-medium text-slate-600 mb-1 d-block">Responsable</label>
              <input
                type="text"
                name="responsable"
                className="form-control form-control-sm form-control-minimal"
                placeholder="Ej: Equipo Full-Stack"
                value={form.responsable}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-slate-100">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-3 py-1.5 text-xs"
            onClick={handleReset}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-dark btn-sm px-4 py-1.5 text-xs font-medium"
          >
            {dataToEdit ? 'Actualizar Registro' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
}
