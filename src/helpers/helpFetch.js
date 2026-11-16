/**
 * Helper HTTP reutilizable para peticiones REST contra el backend Express.js.
 * Extrae siempre mensajes de error como cadenas seguras (evita React Error #31)
 * y ofrece respaldo automático solo cuando el entorno estático responde 404 sin servidor Express.
 */

import { STATIC_FALLBACK_SEED } from '../data/initialData';

const FALLBACK_KEY = 'AUTOMATE_WEBS_STATIC_STORE_V1';

function extractErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.error === 'string') return data.error;
  if (data.error && typeof data.error === 'object' && typeof data.error.message === 'string') {
    return data.error.message;
  }
  if (typeof data.message === 'string') return data.message;
  return fallback;
}

function readFallbackDb() {
  try {
    const raw = window.localStorage.getItem(FALLBACK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignorar error de acceso a storage
  }
  const cloned = JSON.parse(JSON.stringify(STATIC_FALLBACK_SEED));
  try {
    window.localStorage.setItem(FALLBACK_KEY, JSON.stringify(cloned));
  } catch {
    // Ignorar
  }
  return cloned;
}

function writeFallbackDb(db) {
  try {
    window.localStorage.setItem(FALLBACK_KEY, JSON.stringify(db));
  } catch {
    // Ignorar
  }
}

function handleStaticFallback(endpoint, method, rawBody) {
  const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody || {};
  const cleanPath = endpoint.split('?')[0];

  if (cleanPath === '/api/config') {
    return {
      mapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      aiEnabled: false,
    };
  }

  if (cleanPath === '/api/checkout' && method === 'POST') {
    const db = readFallbackDb();
    const { cliente, metodoPago, referenciaPago, items } = body;
    const today = new Date().toISOString().split('T')[0];
    const verifiedItems = [];

    for (const item of items || []) {
      const prod = db.productos.find((p) => String(p.id) === String(item.id));
      if (!prod) {
        return Promise.reject({ err: true, status: 404, statusText: 'Producto no encontrado.' });
      }
      const qty = Number(item.cantidad || 1);
      if (Number(prod.stock || 0) < qty) {
        return Promise.reject({
          err: true,
          status: 409,
          statusText: `Stock insuficiente para "${prod.nombre}".`,
        });
      }
      prod.stock = Math.max(0, Number(prod.stock) - qty);
      if (prod.stock === 0) prod.estado = 'Agotado';

      const sub = Number(prod.precio) * qty;
      verifiedItems.push({
        id: prod.id,
        sku: prod.sku,
        nombre: prod.nombre,
        cantidad: qty,
        precioUnitario: Number(prod.precio),
        subtotal: sub,
      });

      db.ventas.unshift({
        id: `v-${Date.now()}-${prod.id}`,
        fecha: today,
        cliente: cliente.nombre,
        producto: prod.nombre,
        cantidad: qty,
        valor: sub,
        formaPago: metodoPago || 'Pasarela Web',
        estado: 'Facturado',
        responsable: 'Tienda Online Automate Webs',
      });
    }

    const subtotal = verifiedItems.reduce((acc, it) => acc + it.subtotal, 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;
    const newFactura = {
      id: `fac-${Date.now()}`,
      numero: `FAC-2026-${String(db.facturas.length + 1).padStart(4, '0')}`,
      fecha: today,
      clienteNombre: cliente.nombre,
      clienteDocumento: cliente.documento,
      clienteCorreo: cliente.correo,
      clienteCelular: cliente.celular,
      metodoPago: metodoPago || 'Tarjeta',
      referenciaPago: referenciaPago || `AW-TX-${Math.floor(100000 + Math.random() * 900000)}`,
      items: verifiedItems,
      subtotal,
      iva,
      total,
      estado: 'Pagada',
    };
    db.facturas.unshift(newFactura);
    writeFallbackDb(db);
    return { ok: true, factura: newFactura };
  }

  const stockMatch = cleanPath.match(/^\/api\/productos\/([^/]+)\/stock$/);
  if (stockMatch && method === 'PATCH') {
    const db = readFallbackDb();
    const prod = db.productos.find((p) => String(p.id) === String(stockMatch[1]));
    if (!prod) {
      return Promise.reject({ err: true, status: 404, statusText: 'Producto no encontrado.' });
    }
    const nextStock =
      typeof body.stock === 'number'
        ? Math.max(0, body.stock)
        : Math.max(0, Number(prod.stock || 0) + Number(body.delta || 0));
    prod.stock = nextStock;
    prod.estado = nextStock === 0 ? 'Agotado' : 'Activo';
    writeFallbackDb(db);
    return prod;
  }

  const entityMatch = cleanPath.match(/^\/api\/([a-z]+)(?:\/([^/]+))?$/);
  if (entityMatch) {
    const [, entity, id] = entityMatch;
    const db = readFallbackDb();
    if (!Array.isArray(db[entity])) return null;

    if (method === 'GET') {
      return db[entity];
    }
    if (method === 'POST') {
      const record = {
        ...body,
        id: body.id ? String(body.id) : `${entity.slice(0, 3)}-${Date.now()}`,
      };
      if (entity === 'pqr') {
        record.radicado = `PQR-2026-${1001 + db.pqr.length}`;
        record.fecha = new Date().toISOString().split('T')[0];
        record.estado = 'Radicado';
      }
      if (entity === 'productos') {
        record.sku = record.sku || `AW-SKU-${100 + db.productos.length + 1}`;
        record.stock = Math.max(0, Number(record.stock ?? 5));
        record.estado = record.stock === 0 ? 'Agotado' : 'Activo';
      }
      db[entity].unshift(record);
      writeFallbackDb(db);
      return record;
    }
    if (method === 'PUT' && id) {
      const idx = db[entity].findIndex((it) => String(it.id) === String(id));
      if (idx === -1) return null;
      db[entity][idx] = { ...db[entity][idx], ...body, id };
      writeFallbackDb(db);
      return db[entity][idx];
    }
    if (method === 'DELETE' && id) {
      db[entity] = db[entity].filter((it) => String(it.id) !== String(id));
      writeFallbackDb(db);
      return { success: true, id };
    }
  }

  return null;
}

export const helpFetch = () => {
  const customFetch = async (endpoint, options = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const controller = new AbortController();
    const fetchOptions = {
      ...options,
      method: options.method || 'GET',
      signal: controller.signal,
      headers: options.headers
        ? { ...defaultHeaders, ...options.headers }
        : defaultHeaders,
    };

    const rawBody = fetchOptions.body;
    if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(endpoint, fetchOptions);
      clearTimeout(timeoutId);

      // Si el frontend corre en preview estático sin servidor Express (404), usar respaldo local sin romper la UI
      if (response.status === 404 && !endpoint.startsWith('/api/ai/')) {
        const fallbackResult = handleStaticFallback(endpoint, fetchOptions.method, rawBody);
        if (fallbackResult !== null) {
          return fallbackResult;
        }
      }

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : null;

      if (!response.ok) {
        return Promise.reject({
          err: true,
          status: response.status || '00',
          statusText: extractErrorMessage(
            data,
            response.status === 404 && endpoint.startsWith('/api/ai/')
              ? 'El Consultor IA requiere el servidor Node/Express activo.'
              : response.statusText || 'Ocurrió un error en la petición HTTP'
          ),
        });
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error && error.err) {
        return Promise.reject({
          ...error,
          statusText: extractErrorMessage(error.statusText, 'Error en la solicitud'),
        });
      }
      return Promise.reject({
        err: true,
        status: '00',
        statusText:
          error?.name === 'AbortError'
            ? 'Tiempo de espera agotado al conectar con el servidor'
            : String(error?.message || 'Error de conexión con el servidor Express'),
      });
    }
  };

  return {
    get: (url, options = {}) => customFetch(url, options),
    post: (url, options = {}) => customFetch(url, { ...options, method: 'POST' }),
    put: (url, options = {}) => customFetch(url, { ...options, method: 'PUT' }),
    patch: (url, options = {}) => customFetch(url, { ...options, method: 'PATCH' }),
    del: (url, options = {}) => customFetch(url, { ...options, method: 'DELETE' }),
  };
};

export const formatCurrencyCOP = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(num);
};
