/**
 * Helper HTTP reutilizable para peticiones REST contra el backend Express.js
 * Implementa AbortController para timeout, manejo estructurado de errores y métodos GET, POST, PUT, PATCH, DELETE.
 */

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

    if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(endpoint, fetchOptions);
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : null;

      if (!response.ok) {
        return Promise.reject({
          err: true,
          status: response.status || '00',
          statusText:
            (data && (data.error || data.message)) ||
            response.statusText ||
            'Ocurrió un error en la petición HTTP',
        });
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error && error.err) {
        return Promise.reject(error);
      }
      return Promise.reject({
        err: true,
        status: '00',
        statusText:
          error?.name === 'AbortError'
            ? 'Tiempo de espera agotado al conectar con el servidor'
            : error?.message || 'Error de conexión con el servidor Express',
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
