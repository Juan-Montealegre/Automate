/**
 * @license
 * Proyecto: Automate Webs
 * Módulo de Validaciones (HTML5, JavaScript y Expresiones Regulares)
 */

export const REGEX = {
  // Correo electrónico estándar RFC básico
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Celular colombiano (10 dígitos iniciando en 3, opcional +57 y espacios)
  CELULAR_CO: /^(\+?57\s?)?3\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
  // Teléfono o celular general (7 a 13 dígitos con prefijo opcional)
  TELEFONO_GENERAL: /^(\+?\d{1,3}[\s-]?)?\d{7,11}$/,
  // NIT o Cédula (5 a 12 dígitos, con dígito de verificación opcional -X)
  NIT_CC: /^\d{5,12}(-\d{1})?$/,
  // Nombre o razón social (mínimo 3 caracteres alfabéticos/números)
  NOMBRE_EMPRESA: /^[a-zA-ZÀ-ÿ0-9\s.&,-]{3,80}$/,
  // Nombre de persona (solo letras y espacios, mínimo 3 caracteres)
  NOMBRE_PERSONA: /^[a-zA-ZÀ-ÿ\s]{3,60}$/,
  // Tarjeta de crédito (16 dígitos con o sin espacios/guiones)
  TARJETA: /^(?:\d{4}[\s-]?){3}\d{4}$/,
  // Fecha de vencimiento MM/AA (01-12 / 25-39)
  VENCIMIENTO: /^(0[1-9]|1[0-2])\/(2[5-9]|3[0-9])$/,
  // CVV (3 o 4 dígitos)
  CVV: /^\d{3,4}$/,
  // URL válida http/https o ruta relativa /src/
  URL_O_RUTA: /^(https?:\/\/[^\s]+|\/src\/[^\s]+)$/,
};

export function validateEmail(email) {
  return REGEX.EMAIL.test(String(email || '').trim());
}

export function validateCelularCo(celular) {
  return REGEX.CELULAR_CO.test(String(celular || '').trim());
}

export function validateTelefono(tel) {
  return REGEX.TELEFONO_GENERAL.test(String(tel || '').trim());
}

export function validateNitOrDoc(doc) {
  return REGEX.NIT_CC.test(String(doc || '').trim().replace(/\./g, ''));
}

export function validateCardNumber(card) {
  const digits = String(card || '').replace(/[\s-]/g, '');
  if (!/^\d{16}$/.test(digits)) return false;
  // Validación adicional sencilla de dígitos
  return true;
}

export function validateExpiry(exp) {
  return REGEX.VENCIMIENTO.test(String(exp || '').trim());
}

export function validateCvv(cvv) {
  return REGEX.CVV.test(String(cvv || '').trim());
}

export function validateUrlOrAsset(val) {
  if (!val) return true;
  return REGEX.URL_O_RUTA.test(String(val).trim());
}

export function formatCOP(amount) {
  return `$${Number(amount || 0).toLocaleString('es-CO')}`;
}
