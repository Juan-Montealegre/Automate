/**
 * Tienda Comercial Automate Webs
 * Permite filtrar productos por categoría, texto o precio, verificar stock en tiempo real
 * y agregar soluciones al carrito de compras.
 */

import React, { useMemo, useState } from 'react';
import { resolveMediaAsset } from '../data/mediaAssets';
import { formatCurrencyCOP } from '../helpers/helpFetch';

export default function TiendaCatalogo({
  productos,
  loading,
  cart,
  onAddToCart,
  onOpenCart,
  onNavigate,
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortOrder, setSortOrder] = useState('default');
  const [feedbackId, setFeedbackId] = useState(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean)));
    return ['Todas', ...unique];
  }, [productos]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = productos.filter((p) => {
      const matchesCat =
        selectedCategory === 'Todas' ||
        String(p.categoria || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !term ||
        String(p.nombre || '').toLowerCase().includes(term) ||
        String(p.descripcion || '').toLowerCase().includes(term) ||
        String(p.sku || '').toLowerCase().includes(term) ||
        String(p.tecnologia || '').toLowerCase().includes(term);
      return matchesCat && matchesSearch;
    });

    if (sortOrder === 'price-asc') {
      list = [...list].sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (sortOrder === 'price-desc') {
      list = [...list].sort((a, b) => Number(b.precio) - Number(a.precio));
    }
    return list;
  }, [productos, search, selectedCategory, sortOrder]);

  const totalCartItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const handleAdd = (product) => {
    const ok = onAddToCart(product);
    if (ok) {
      setFeedbackId(product.id);
      setTimeout(() => setFeedbackId(null), 1100);
    }
  };

  return (
    <div className="container-xl py-4 py-lg-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="badge text-bg-dark mb-2">Catálogo Comercial</span>
          <h1 className="h2 fw-bold mb-1">Tienda de Software y Automatización</h1>
          <p className="text-secondary mb-0">
            Adquiere soluciones listas para implementar con stock verificado y facturación inmediata.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => onNavigate('ia')}
          >
            <i className="bi bi-stars me-1" aria-hidden="true"></i>
            Pedir Recomendación IA
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenCart}>
            <i className="bi bi-cart3 me-2" aria-hidden="true"></i>
            Carrito ({totalCartItems})
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="aw-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <label htmlFor="store-search" className="visually-hidden">
              Buscar solución o SKU
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search" aria-hidden="true"></i>
              </span>
              <input
                id="store-search"
                type="search"
                className="form-control"
                placeholder="Buscar por nombre, SKU o tecnología..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <label htmlFor="store-category" className="visually-hidden">
              Filtrar por categoría
            </label>
            <select
              id="store-category"
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Categoría: {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="store-sort" className="visually-hidden">
              Ordenar por precio
            </label>
            <select
              id="store-sort"
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Orden destacado</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Cargando catálogo...</span>
          </div>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="alert alert-light border text-center py-4">
          <i className="bi bi-inbox fs-3 d-block mb-2 text-secondary" aria-hidden="true"></i>
          No se encontraron productos con los filtros seleccionados.
        </div>
      )}

      {/* Grid de Productos */}
      <div className="row g-4">
        {filteredProducts.map((product) => {
          const stock = Number(product.stock ?? 0);
          const inCartQty =
            cart.find((item) => String(item.id) === String(product.id))?.cantidad || 0;
          const remainingStock = Math.max(0, stock - inCartQty);
          const isOut = stock <= 0;

          return (
            <div key={product.id} className="col-md-6 col-lg-4">
              <article className="aw-card aw-card-hover h-100 d-flex flex-column">
                <img
                  src={resolveMediaAsset(product.imagenKey || product.imagen, 'slide_web')}
                  alt={product.nombre}
                  className="aw-product-img"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
                    <span className="badge text-bg-light border text-dark">
                      {product.categoria}
                    </span>
                    <span className="font-mono small text-secondary">{product.sku}</span>
                  </div>

                  <h2 className="h5 fw-bold mb-2">{product.nombre}</h2>
                  <p className="small text-secondary mb-3 flex-grow-1">{product.descripcion}</p>

                  <div className="small text-secondary mb-3 border-top pt-2">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Implementación:</span>
                      <strong className="text-dark">{product.plazo}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Stack:</span>
                      <span className="font-mono text-truncate" style={{ maxWidth: '65%' }}>
                        {product.tecnologia}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Disponibilidad:</span>
                      {isOut ? (
                        <span className="badge text-bg-danger">Agotado (0 uds)</span>
                      ) : stock <= 3 ? (
                        <span className="badge text-bg-warning text-dark">
                          Últimas {stock} uds
                        </span>
                      ) : (
                        <span className="badge text-bg-success">Disponible ({stock} uds)</span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-2 pt-2 border-top">
                    <div>
                      <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                        Precio sin IVA
                      </div>
                      <div className="fs-5 fw-bold font-mono">
                        {formatCurrencyCOP(product.precio)}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`btn ${
                        feedbackId === product.id ? 'btn-success' : 'btn-dark'
                      } px-3 py-2 fw-semibold`}
                      disabled={isOut || remainingStock <= 0}
                      onClick={() => handleAdd(product)}
                    >
                      {isOut ? (
                        'Sin Stock'
                      ) : remainingStock <= 0 ? (
                        'Máx. en Carrito'
                      ) : feedbackId === product.id ? (
                        <>
                          <i className="bi bi-check2 me-1" aria-hidden="true"></i>
                          Agregado
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-plus me-1" aria-hidden="true"></i>
                          Agregar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
