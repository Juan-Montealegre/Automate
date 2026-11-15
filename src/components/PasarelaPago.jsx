/**
 * Pasarela de Pago Simulada + Emisión de Factura Electrónica
 * Valida campos mediante expresiones regulares, descuenta stock en Express
 * y genera factura imprimible.
 */

import React, { useState } from 'react';
import { EMPRESA_INFO } from '../data/initialData';
import { formatCurrencyCOP, helpFetch } from '../helpers/helpFetch';
import {
  isValidColombianMobile,
  isValidDocumento,
  isValidEmail,
  REGEX_PATTERNS,
} from '../helpers/validators';

export default function PasarelaPago({
  isOpen,
  onClose,
  cart,
  existingFactura,
  onPaymentSuccess,
}) {
  const api = helpFetch();
  const [cliente, setCliente] = useState({
    nombre: '',
    documento: '',
    correo: '',
    celular: '',
    ciudad: 'Bogotá D.C.',
  });
  const [metodoPago, setMetodoPago] = useState('Tarjeta de Crédito / Débito');
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    titular: '',
    expiracion: '',
    cvv: '',
  });
  const [bancoPse, setBancoPse] = useState('Bancolombia');
  const [celularBilletera, setCelularBilletera] = useState('');
  const [aceptaPolitica, setAceptaPolitica] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [generatedFactura, setGeneratedFactura] = useState(existingFactura || null);

  if (!isOpen) return null;

  const activeFactura = existingFactura || generatedFactura;
  const subtotal = cart.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  const validateCheckout = () => {
    const nextErrors = {};

    if (!REGEX_PATTERNS.nombreTexto.test(cliente.nombre.trim())) {
      nextErrors.nombre = 'Ingrese un nombre o razón social válido (mínimo 3 caracteres).';
    }
    if (!isValidDocumento(cliente.documento)) {
      nextErrors.documento = 'Ingrese un NIT o Cédula válido (6 a 15 dígitos).';
    }
    if (!isValidEmail(cliente.correo)) {
      nextErrors.correo = 'Ingrese un correo electrónico válido.';
    }
    if (!isValidColombianMobile(cliente.celular)) {
      nextErrors.celular = 'Ingrese un celular colombiano válido (ej. 3104829104 o +57 3104829104).';
    }
    if (!aceptaPolitica) {
      nextErrors.aceptaPolitica = 'Debe autorizar el tratamiento de datos para emitir la factura.';
    }

    if (metodoPago === 'Tarjeta de Crédito / Débito') {
      if (!REGEX_PATTERNS.tarjetaNumero.test(tarjeta.numero.trim())) {
        nextErrors.tarjetaNumero = 'Número de tarjeta inválido (16 dígitos).';
      }
      if (tarjeta.titular.trim().length < 4) {
        nextErrors.tarjetaTitular = 'Ingrese el nombre del titular de la tarjeta.';
      }
      if (!REGEX_PATTERNS.tarjetaExp.test(tarjeta.expiracion.trim())) {
        nextErrors.tarjetaExp = 'Formato requerido MM/AA (ej. 09/29).';
      }
      if (!REGEX_PATTERNS.tarjetaCvv.test(tarjeta.cvv.trim())) {
        nextErrors.tarjetaCvv = 'CVV inválido (3 o 4 dígitos).';
      }
    } else if (metodoPago === 'Nequi / Daviplata') {
      if (!isValidColombianMobile(celularBilletera)) {
        nextErrors.celularBilletera = 'Ingrese el número celular registrado en Nequi o Daviplata (3XXXXXXXXX).';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateCheckout()) return;

    setSubmitting(true);
    try {
      const referencia =
        metodoPago === 'PSE'
          ? `PSE-${bancoPse.slice(0, 4).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
          : `AW-PAY-${Math.floor(100000 + Math.random() * 900000)}`;

      const result = await api.post('/api/checkout', {
        body: {
          cliente,
          metodoPago: metodoPago === 'PSE' ? `PSE (${bancoPse})` : metodoPago,
          referenciaPago: referencia,
          items: cart.map((item) => ({ id: item.id, cantidad: item.cantidad })),
        },
      });

      setGeneratedFactura(result.factura);
      if (onPaymentSuccess) {
        await onPaymentSuccess(result.factura);
      }
    } catch (err) {
      setApiError(err.statusText || 'Error al procesar el pago.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pasarelaModalTitle"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header no-print">
              <h2 className="modal-title h5 fw-bold" id="pasarelaModalTitle">
                {activeFactura ? (
                  <>
                    <i className="bi bi-receipt-cutoff text-success me-2" aria-hidden="true"></i>
                    Comprobante y Factura Electrónica
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-lock text-primary me-2" aria-hidden="true"></i>
                    Pasarela de Pago Simulada · Automate Webs
                  </>
                )}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar pasarela"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body p-4">
              {activeFactura ? (
                <div>
                  <div className="alert alert-success d-flex align-items-center justify-content-between no-print">
                    <div>
                      <strong>Pago aprobado exitosamente.</strong> Referencia:{' '}
                      <span className="font-mono">{activeFactura.referenciaPago}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => window.print()}
                    >
                      <i className="bi bi-printer me-1" aria-hidden="true"></i>
                      Imprimir Factura
                    </button>
                  </div>

                  <div className="border rounded-3 p-4 bg-white">
                    <div className="d-flex flex-wrap justify-content-between align-items-start border-bottom pb-3 mb-3 gap-3">
                      <div>
                        <h3 className="h5 fw-bold mb-1">{EMPRESA_INFO.razonSocial}</h3>
                        <div className="small text-secondary">NIT: {EMPRESA_INFO.nit}</div>
                        <div className="small text-secondary">{EMPRESA_INFO.direccion}</div>
                        <div className="small text-secondary">{EMPRESA_INFO.email}</div>
                      </div>
                      <div className="text-md-end">
                        <div className="badge text-bg-dark font-mono fs-6 mb-1">
                          {activeFactura.numero}
                        </div>
                        <div className="small text-secondary">Fecha: {activeFactura.fecha}</div>
                        <div className="small text-success fw-semibold">
                          Estado: {activeFactura.estado}
                        </div>
                      </div>
                    </div>

                    <div className="row g-2 small mb-3 bg-light p-3 rounded-2">
                      <div className="col-md-6">
                        <strong>Cliente:</strong> {activeFactura.clienteNombre}
                      </div>
                      <div className="col-md-6">
                        <strong>NIT / Cédula:</strong> {activeFactura.clienteDocumento}
                      </div>
                      <div className="col-md-6">
                        <strong>Correo:</strong> {activeFactura.clienteCorreo}
                      </div>
                      <div className="col-md-6">
                        <strong>Celular:</strong> {activeFactura.clienteCelular}
                      </div>
                      <div className="col-12">
                        <strong>Medio de Pago:</strong> {activeFactura.metodoPago} (Ref:{' '}
                        <span className="font-mono">{activeFactura.referenciaPago}</span>)
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-sm aw-table mb-3">
                        <thead>
                          <tr>
                            <th>SKU</th>
                            <th>Descripción</th>
                            <th className="text-center">Cant.</th>
                            <th className="text-end">Unitario</th>
                            <th className="text-end">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeFactura.items.map((it, idx) => (
                            <tr key={idx}>
                              <td className="font-mono">{it.sku}</td>
                              <td>{it.nombre}</td>
                              <td className="text-center font-mono">{it.cantidad}</td>
                              <td className="text-end font-mono">
                                {formatCurrencyCOP(it.precioUnitario)}
                              </td>
                              <td className="text-end font-mono fw-semibold">
                                {formatCurrencyCOP(it.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="ms-auto" style={{ maxWidth: '300px' }}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span>Subtotal:</span>
                        <span className="font-mono">
                          {formatCurrencyCOP(activeFactura.subtotal)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between small mb-2">
                        <span>IVA (19%):</span>
                        <span className="font-mono">{formatCurrencyCOP(activeFactura.iva)}</span>
                      </div>
                      <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2">
                        <span>Total Pagado:</span>
                        <span className="font-mono">
                          {formatCurrencyCOP(activeFactura.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePaySubmit} noValidate>
                  {apiError && <div className="alert alert-danger">{apiError}</div>}

                  <div className="alert alert-light border small mb-3">
                    <strong>Ambiente de demostración comercial:</strong> Los pagos son simulados para validar facturación y descuento real de inventario en la base de datos.
                  </div>

                  <h3 className="h6 fw-bold mb-3">1. Datos de Facturación</h3>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label htmlFor="pay-nombre" className="form-label small fw-semibold">
                        Nombre o Razón Social *
                      </label>
                      <input
                        id="pay-nombre"
                        type="text"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        value={cliente.nombre}
                        onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                        placeholder="Ej. Innovación Digital S.A.S."
                      />
                      {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="pay-doc" className="form-label small fw-semibold">
                        NIT o Cédula *
                      </label>
                      <input
                        id="pay-doc"
                        type="text"
                        className={`form-control font-mono ${errors.documento ? 'is-invalid' : ''}`}
                        value={cliente.documento}
                        onChange={(e) => setCliente({ ...cliente, documento: e.target.value })}
                        placeholder="Ej. 901.482.391-4"
                      />
                      {errors.documento && (
                        <div className="invalid-feedback">{errors.documento}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="pay-correo" className="form-label small fw-semibold">
                        Correo Electrónico *
                      </label>
                      <input
                        id="pay-correo"
                        type="email"
                        className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                        value={cliente.correo}
                        onChange={(e) => setCliente({ ...cliente, correo: e.target.value })}
                        placeholder="facturacion@empresa.co"
                      />
                      {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="pay-celular" className="form-label small fw-semibold">
                        Celular de Contacto (Colombia) *
                      </label>
                      <input
                        id="pay-celular"
                        type="tel"
                        className={`form-control font-mono ${errors.celular ? 'is-invalid' : ''}`}
                        value={cliente.celular}
                        onChange={(e) => setCliente({ ...cliente, celular: e.target.value })}
                        placeholder="+57 3104829104"
                      />
                      {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
                    </div>
                  </div>

                  <h3 className="h6 fw-bold mb-3">2. Método de Pago</h3>
                  <div className="btn-group w-100 mb-3" role="group" aria-label="Método de pago">
                    {['Tarjeta de Crédito / Débito', 'PSE', 'Nequi / Daviplata'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        className={`btn ${
                          metodoPago === method ? 'btn-dark' : 'btn-outline-dark'
                        } btn-sm py-2`}
                        onClick={() => {
                          setMetodoPago(method);
                          setErrors({});
                        }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>

                  {metodoPago === 'Tarjeta de Crédito / Débito' && (
                    <div className="row g-3 p-3 bg-light rounded-3 border mb-3">
                      <div className="col-md-6">
                        <label htmlFor="card-num" className="form-label small fw-semibold">
                          Número de Tarjeta (16 dígitos) *
                        </label>
                        <input
                          id="card-num"
                          type="text"
                          className={`form-control font-mono ${
                            errors.tarjetaNumero ? 'is-invalid' : ''
                          }`}
                          value={tarjeta.numero}
                          onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                          placeholder="4532 1234 5678 9010"
                          maxLength={19}
                        />
                        {errors.tarjetaNumero && (
                          <div className="invalid-feedback">{errors.tarjetaNumero}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="card-holder" className="form-label small fw-semibold">
                          Titular de la Tarjeta *
                        </label>
                        <input
                          id="card-holder"
                          type="text"
                          className={`form-control ${errors.tarjetaTitular ? 'is-invalid' : ''}`}
                          value={tarjeta.titular}
                          onChange={(e) => setTarjeta({ ...tarjeta, titular: e.target.value })}
                          placeholder="Nombre como figura en tarjeta"
                        />
                        {errors.tarjetaTitular && (
                          <div className="invalid-feedback">{errors.tarjetaTitular}</div>
                        )}
                      </div>
                      <div className="col-6">
                        <label htmlFor="card-exp" className="form-label small fw-semibold">
                          Vencimiento (MM/AA) *
                        </label>
                        <input
                          id="card-exp"
                          type="text"
                          className={`form-control font-mono ${
                            errors.tarjetaExp ? 'is-invalid' : ''
                          }`}
                          value={tarjeta.expiracion}
                          onChange={(e) => setTarjeta({ ...tarjeta, expiracion: e.target.value })}
                          placeholder="08/29"
                          maxLength={5}
                        />
                        {errors.tarjetaExp && (
                          <div className="invalid-feedback">{errors.tarjetaExp}</div>
                        )}
                      </div>
                      <div className="col-6">
                        <label htmlFor="card-cvv" className="form-label small fw-semibold">
                          Código CVV *
                        </label>
                        <input
                          id="card-cvv"
                          type="password"
                          className={`form-control font-mono ${
                            errors.tarjetaCvv ? 'is-invalid' : ''
                          }`}
                          value={tarjeta.cvv}
                          onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.tarjetaCvv && (
                          <div className="invalid-feedback">{errors.tarjetaCvv}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {metodoPago === 'PSE' && (
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <label htmlFor="pse-bank" className="form-label small fw-semibold">
                        Entidad Bancaria PSE
                      </label>
                      <select
                        id="pse-bank"
                        className="form-select"
                        value={bancoPse}
                        onChange={(e) => setBancoPse(e.target.value)}
                      >
                        <option value="Bancolombia">Bancolombia</option>
                        <option value="Banco de Bogotá">Banco de Bogotá</option>
                        <option value="Davivienda">Davivienda</option>
                        <option value="BBVA Colombia">BBVA Colombia</option>
                        <option value="Banco de Occidente">Banco de Occidente</option>
                      </select>
                    </div>
                  )}

                  {metodoPago === 'Nequi / Daviplata' && (
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <label htmlFor="wallet-phone" className="form-label small fw-semibold">
                        Celular registrado en Nequi o Daviplata *
                      </label>
                      <input
                        id="wallet-phone"
                        type="tel"
                        className={`form-control font-mono ${
                          errors.celularBilletera ? 'is-invalid' : ''
                        }`}
                        value={celularBilletera}
                        onChange={(e) => setCelularBilletera(e.target.value)}
                        placeholder="3104829104"
                      />
                      {errors.celularBilletera && (
                        <div className="invalid-feedback">{errors.celularBilletera}</div>
                      )}
                    </div>
                  )}

                  <div className="form-check mb-3">
                    <input
                      id="pay-policy"
                      type="checkbox"
                      className={`form-check-input ${errors.aceptaPolitica ? 'is-invalid' : ''}`}
                      checked={aceptaPolitica}
                      onChange={(e) => setAceptaPolitica(e.target.checked)}
                    />
                    <label htmlFor="pay-policy" className="form-check-label small">
                      Autorizo el tratamiento de mis datos personales según la Ley 1581 de 2012 para facturación.
                    </label>
                    {errors.aceptaPolitica && (
                      <div className="invalid-feedback d-block">{errors.aceptaPolitica}</div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center bg-light border rounded-3 p-3">
                    <div>
                      <div className="small text-secondary">
                        Subtotal {formatCurrencyCOP(subtotal)} + IVA {formatCurrencyCOP(iva)}
                      </div>
                      <div className="fs-5 fw-bold font-mono">
                        Total: {formatCurrencyCOP(total)}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success px-4 py-2 fw-semibold"
                      disabled={submitting}
                    >
                      {submitting ? 'Procesando...' : 'Confirmar y Pagar'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="modal-footer no-print">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
