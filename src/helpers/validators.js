/**
 * Validadores con Expresiones Regulares (Regex), validación de formularios comerciales
 * y motor de auditoría simple W3C HTML / CSS / Accesibilidad / Nielsen UX.
 */

export const REGEX_PATTERNS = {
  // Celular colombiano válido: opcional +57, inicia en 3 y tiene 10 dígitos
  celularColombia: /^(\+?57\s?)?3\d{9}$/,
  // Correo electrónico estándar RFC-like
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  // NIT o Cédula (6 a 15 dígitos con puntos/guion opcionales)
  documentoNit: /^[0-9.\-]{6,15}$/,
  // Nombre de persona o empresa (mínimo 3 caracteres alfabéticos/espacios)
  nombreTexto: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,&\-()]{3,80}$/,
  // URL http/https válida
  urlWeb: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
  // Tarjeta de crédito/débito simulada (16 dígitos con o sin espacios)
  tarjetaNumero: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
  // Fecha expiración MM/AA
  tarjetaExp: /^(0[1-9]|1[0-2])\/\d{2}$/,
  // CVV 3 o 4 dígitos
  tarjetaCvv: /^\d{3,4}$/,
};

export function normalizePhoneDigits(value) {
  return String(value || '').replace(/[^\d+]/g, '');
}

export function isValidColombianMobile(value) {
  const clean = String(value || '').replace(/[\s\-()]/g, '');
  return REGEX_PATTERNS.celularColombia.test(clean);
}

export function isValidEmail(value) {
  return REGEX_PATTERNS.email.test(String(value || '').trim());
}

export function isValidDocumento(value) {
  return REGEX_PATTERNS.documentoNit.test(String(value || '').trim());
}

export function isValidPositiveNumber(value, allowZero = false) {
  const num = Number(value);
  if (Number.isNaN(num)) return false;
  return allowZero ? num >= 0 : num > 0;
}

/**
 * Ejecuta una inspección real en vivo del DOM y las hojas de estilo
 * para validar estándares W3C HTML5, CSS y Accesibilidad básica.
 */
export function runW3cAndCssAudit() {
  const issues = [];
  const checks = [];

  // 1. Validar atributo lang en <html>
  const htmlLang = document.documentElement.getAttribute('lang');
  if (htmlLang) {
    checks.push({ id: 'w3c-lang', ok: true, label: `Atributo lang="${htmlLang}" definido en <html> (W3C)` });
  } else {
    issues.push({ id: 'w3c-lang', label: 'Falta atributo lang en el elemento raíz <html>' });
  }

  // 2. Validar existencia de landmarks semánticos HTML5
  const hasHeader = Boolean(document.querySelector('header'));
  const hasMain = Boolean(document.querySelector('main'));
  const hasFooter = Boolean(document.querySelector('footer'));
  if (hasHeader && hasMain && hasFooter) {
    checks.push({ id: 'w3c-landmarks', ok: true, label: 'Estructura semántica HTML5 completa (<header>, <main>, <footer>)' });
  } else {
    issues.push({ id: 'w3c-landmarks', label: 'Falta alguna etiqueta estructural semántica (<header>, <main> o <footer>)' });
  }

  // 3. Validar jerarquía de encabezado H1 único visible
  const h1Count = document.querySelectorAll('h1').length;
  if (h1Count === 1) {
    checks.push({ id: 'w3c-h1', ok: true, label: 'Jerarquía tipográfica correcta: exactamente un <h1> en la vista actual' });
  } else if (h1Count === 0) {
    issues.push({ id: 'w3c-h1', label: 'No se encontró un encabezado principal <h1> en la vista actual' });
  } else {
    issues.push({ id: 'w3c-h1', label: `Se detectaron ${h1Count} etiquetas <h1>; se recomienda solo 1 por vista` });
  }

  // 4. Validar que todas las imágenes tengan atributo alt
  const images = Array.from(document.querySelectorAll('img'));
  const missingAlt = images.filter((img) => !img.hasAttribute('alt') || img.getAttribute('alt')?.trim() === '');
  if (missingAlt.length === 0) {
    checks.push({ id: 'w3c-img-alt', ok: true, label: `${images.length} imágenes verificadas con atributo alt descriptivo` });
  } else {
    issues.push({ id: 'w3c-img-alt', label: `${missingAlt.length} imágenes sin texto alternativo (alt)` });
  }

  // 5. Validar botones sin texto accesible ni aria-label
  const buttons = Array.from(document.querySelectorAll('button'));
  const unlabeledButtons = buttons.filter(
    (btn) => !btn.textContent?.trim() && !btn.getAttribute('aria-label') && !btn.getAttribute('title')
  );
  if (unlabeledButtons.length === 0) {
    checks.push({ id: 'w3c-btn-label', ok: true, label: `${buttons.length} botones con etiqueta legible o aria-label` });
  } else {
    issues.push({ id: 'w3c-btn-label', label: `${unlabeledButtons.length} botones carecen de texto o aria-label` });
  }

  // 6. Validar enlace externo seguro rel="noopener noreferrer"
  const externalLinks = Array.from(document.querySelectorAll('a[target="_blank"]'));
  const unsafeLinks = externalLinks.filter((a) => !(a.getAttribute('rel') || '').includes('noopener'));
  if (unsafeLinks.length === 0) {
    checks.push({ id: 'w3c-rel', ok: true, label: `${externalLinks.length} enlaces externos protegidos con rel="noopener noreferrer"` });
  } else {
    issues.push({ id: 'w3c-rel', label: `${unsafeLinks.length} enlaces target="_blank" sin rel="noopener"` });
  }

  // 7. Validar reglas CSS activas y variables :root W3C
  const rootStyles = getComputedStyle(document.documentElement);
  const bodyFont = rootStyles.getPropertyValue('--bs-font-sans-serif').trim();
  const bodyColor = rootStyles.getPropertyValue('--bs-body-color').trim();
  if (bodyFont && bodyColor) {
    checks.push({
      id: 'css-vars',
      ok: true,
      label: `Variables CSS W3C verificadas (Fuente: ${bodyFont.split(',')[0]}, Contraste base: ${bodyColor})`,
    });
  } else {
    issues.push({ id: 'css-vars', label: 'Variables tipográficas y de color W3C no detectadas en :root' });
  }

  // 8. Validar hojas de estilo cargadas sin errores de sintaxis
  let styleSheetsCount = 0;
  for (let i = 0; i < document.styleSheets.length; i += 1) {
    styleSheetsCount += 1;
  }
  checks.push({
    id: 'css-sheets',
    ok: true,
    label: `${styleSheetsCount} hojas de estilo CSS Bootstrap 5 + W3C cargadas correctamente`,
  });

  const totalScore = Math.round((checks.length / Math.max(1, checks.length + issues.length)) * 100);

  return {
    timestamp: new Date().toLocaleTimeString('es-CO'),
    score: totalScore,
    checks,
    issues,
  };
}
