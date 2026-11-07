/**
 * @license
 * Universidad Libre - Facultad de Ingeniería
 * Programación Web - Semestre VI · 2026-II
 * Laboratorio IV: React - Manejo de CRUD con helper helpFetch y API ficticia (json-server / localStorage)
 */

const STORAGE_KEY = 'UNILIBRE_CRUD_DB_V1';

/**
 * Helper HTTP reutilizable para peticiones Fetch con soporte de abort controller,
 * timeout y simulación de API REST local-storage para json-server.
 */
export const helpFetch = () => {
  const customFetch = async (endpoint, options = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const controller = new AbortController();
    options.signal = controller.signal;

    options.method = options.method || 'GET';
    options.headers = options.headers
      ? { ...defaultHeaders, ...options.headers }
      : defaultHeaders;

    options.body = JSON.stringify(options.body) || false;
    if (!options.body) delete options.body;

    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(endpoint, options);
      clearTimeout(timeoutId);
      if (!response.ok) {
        return Promise.reject({
          err: true,
          status: response.status || '00',
          statusText: response.statusText || 'Ocurrió un error en la petición HTTP',
        });
      }
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      return Promise.reject({
        err: true,
        status: error.status || '00',
        statusText: error.statusText || error.message || 'Error de conexión con la API',
      });
    }
  };

  const get = (url, options = {}) => customFetch(url, options);

  const post = (url, options = {}) => {
    options.method = 'POST';
    return customFetch(url, options);
  };

  const put = (url, options = {}) => {
    options.method = 'PUT';
    return customFetch(url, options);
  };

  const del = (url, options = {}) => {
    options.method = 'DELETE';
    return customFetch(url, options);
  };

  return {
    get,
    post,
    put,
    del,
  };
};

// Historial de peticiones HTTP en memoria
const listeners = new Set();
const requestLogs = [];

export const subscribeToHttpLogs = (callback) => {
  listeners.add(callback);
  callback([...requestLogs]);
  return () => listeners.delete(callback);
};

const notifyLogs = (logEntry) => {
  requestLogs.unshift(logEntry);
  if (requestLogs.length > 50) requestLogs.pop();
  listeners.forEach((fn) => fn([...requestLogs]));
};

/**
 * Cliente de API Ficticia (Mock json-server) persistente en localStorage.
 * Simula respuestas REST con código de estado HTTP (200, 201, 204, 404),
 * retardo de red configurable y persistencia local.
 */
export const mockJsonServer = {
  // Inicializa la base de datos si no existe
  initDb(seedData) {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    try {
      return JSON.parse(existing);
    } catch (e) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
  },

  getDb() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  saveDb(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  },

  resetDb(seedData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    notifyLogs({
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      method: 'SYSTEM',
      endpoint: '/db/reset',
      status: 200,
      message: 'Base de datos restaurada con datos iniciales',
    });
    return seedData;
  },

  // GET /:entity
  async get(entity, latency = 120) {
    await new Promise((res) => setTimeout(res, latency));
    const db = this.getDb() || {};
    const items = db[entity] || [];

    notifyLogs({
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      method: 'GET',
      endpoint: `http://localhost:5000/${entity}`,
      status: 200,
      count: items.length,
      duration: `${latency}ms`,
    });

    return items;
  },

  // POST /:entity
  async post(entity, newItem, latency = 160) {
    await new Promise((res) => setTimeout(res, latency));
    const db = this.getDb() || {};
    const items = db[entity] || [];

    const itemWithId = {
      ...newItem,
      id: newItem.id ? String(newItem.id) : String(Date.now()),
      createdAt: newItem.createdAt || new Date().toISOString(),
    };

    items.push(itemWithId);
    db[entity] = items;
    this.saveDb(db);

    notifyLogs({
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      endpoint: `http://localhost:5000/${entity}`,
      status: 201,
      payload: itemWithId,
      duration: `${latency}ms`,
    });

    return itemWithId;
  },

  // PUT /:entity/:id
  async put(entity, updatedItem, latency = 150) {
    await new Promise((res) => setTimeout(res, latency));
    const db = this.getDb() || {};
    const items = db[entity] || [];
    const index = items.findIndex((it) => String(it.id) === String(updatedItem.id));

    if (index === -1) {
      notifyLogs({
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        method: 'PUT',
        endpoint: `http://localhost:5000/${entity}/${updatedItem.id}`,
        status: 404,
        error: 'Elemento no encontrado',
        duration: `${latency}ms`,
      });
      throw new Error(`Elemento con ID ${updatedItem.id} no encontrado`);
    }

    const merged = { ...items[index], ...updatedItem, updatedAt: new Date().toISOString() };
    items[index] = merged;
    db[entity] = items;
    this.saveDb(db);

    notifyLogs({
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      method: 'PUT',
      endpoint: `http://localhost:5000/${entity}/${updatedItem.id}`,
      status: 200,
      payload: merged,
      duration: `${latency}ms`,
    });

    return merged;
  },

  // DELETE /:entity/:id
  async del(entity, id, latency = 140) {
    await new Promise((res) => setTimeout(res, latency));
    const db = this.getDb() || {};
    const items = db[entity] || [];
    const filtered = items.filter((it) => String(it.id) !== String(id));

    if (filtered.length === items.length) {
      notifyLogs({
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        method: 'DELETE',
        endpoint: `http://localhost:5000/${entity}/${id}`,
        status: 404,
        duration: `${latency}ms`,
      });
      throw new Error(`Elemento con ID ${id} no encontrado`);
    }

    db[entity] = filtered;
    this.saveDb(db);

    notifyLogs({
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      method: 'DELETE',
      endpoint: `http://localhost:5000/${entity}/${id}`,
      status: 204,
      duration: `${latency}ms`,
    });

    return { success: true, id };
  },
};
