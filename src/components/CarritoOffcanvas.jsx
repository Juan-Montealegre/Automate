/**
 * Carrito de Compras Deslizante (Bootstrap Offcanvas controlado por React)
 * Calcula Subtotal, IVA (19%), Total y valida límites contra stock disponible.
 */

import React from 'react';
import { formatCurrencyCOP } from '../helpers/helpFetch';

export default function CarritoOffcanvas({
  isOpen,
  onClose,
  cart,
  productos,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  return (
    <>
      <div
        className="offcanvas-backdrop fade show"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className="offcanvas offcanvas-end show"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="carritoOffcanvasLabel"
        style={{ visibility: 'visible', width: 'min(440px, 100vw)' }}
      >
        <div className="offcanvas-header border-bottom">
          <h2 className="offcanvas-title h5 fw-bold" id="carritoOffcanvasLabel">
            <i className="bi bi-cart3 me-2" aria-hidden="true"></i>
            Carrito de Compras
          </h2>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar carrito"
            onClick={onClose}
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {cart.length === 0 ? (
            <div className="text-center my-auto py-5 text-secondary">
              <i className="bi bi-bag-x fs-1 d-block mb-3" aria-hidden="true"></i>
              <p className="mb-1 fw-semibold text-dark">Tu carrito está vacío</p>
              <p className="small mb-0">
                Explora la tienda para agregar licencias y soluciones empresariales.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-grow-1 overflow-auto pe-1">
                {cart.map((item) => {
                  const liveProd = productos.find(
                    (p) => String(p.id) === String(item.id)
                  );
                  const maxStock = Number(liveProd?.stock ?? item.stock ?? 1);

                  return (
                    <div key={item.id} className="aw-card p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div>
                          <div className="fw-bold small">{item.nombre}</div>
                          <div className="font-mono text-secondary" style={{ fontSize: '0.75rem' }}>
                            {item.sku} · Stock disp: {maxStock}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          aria-label={`Eliminar ${item.nombre} del carrito`}
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <i className="bi bi-trash" aria-hidden="true"></i>
                        </button>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group btn-group-sm" role="group" aria-label="Cantidad">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            aria-label="Disminuir cantidad"
                            onClick={() => onUpdateQty(item.id, item.cantidad - 1)}
                          >
                            -
                          </button>
                          <span className="btn btn-light border font-mono disabled text-dark">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            aria-label="Aumentar cantidad"
                            disabled={item.cantidad >= maxStock}
                            onClick={() => onUpdateQty(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>

                        <div className="fw-bold font-mono">
                          {formatCurrencyCOP(Number(item.precio) * item.cantidad)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between small text-secondary mb-1">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrencyCOP(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between small text-secondary mb-2">
                  <span>IVA (19%)</span>
                  <span className="font-mono">{formatCurrencyCOP(iva)}</span>
                </div>
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                  <span>Total a Pagar</span>
                  <span className="font-mono text-primary">{formatCurrencyCOP(total)}</span>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-dark fw-semibold py-2"
                    onClick={onProceedToCheckout}
                  >
                    <i className="bi bi-credit-card me-2" aria-hidden="true"></i>
                    Pagar en Pasarela Segura
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={onClearCart}
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
