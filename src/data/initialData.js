/**
 * Datos institucionales y corporativos de Automate Webs
 * Incluye información empresarial, redes sociales, slides publicitarios,
 * política de tratamiento de datos (Ley 1581 de 2012) y 10 heurísticas de Nielsen.
 */

export const EMPRESA_INFO = {
  razonSocial: 'Automate Webs',
  tagline: 'Desarrollo de Software y Automatización',
  nit: '901.482.391-4',
  sector: 'Ingeniería de Software, Cloud y Automatización RPA',
  direccion: 'Calle 53 # 10-60, Edificio Corporativo Chapinero, Bogotá D.C., Colombia',
  coordenadas: { lat: 4.6422, lng: -74.0658 },
  telefono: '+57 (601) 382 1000',
  celular: '+57 3104829104',
  email: 'contacto@automatewebs.co',
  sitioWeb: 'https://automatewebs.co',
  horario: 'Lunes a Viernes · 8:00 a.m. - 6:00 p.m.',
  mision:
    'Desarrollar soluciones de software innovadoras, seguras y de alta calidad que ayuden a empresas y emprendedores a digitalizar y automatizar sus procesos, ofreciendo productos personalizados que impulsen su crecimiento y competitividad a través de su plataforma web.',
  vision:
    'Ser una empresa reconocida a nivel nacional e internacional por la excelencia en el desarrollo de software y la innovación tecnológica, destacándonos por brindar soluciones eficientes, confiables y adaptadas a las necesidades reales de nuestros clientes.',
  objetivoGeneral:
    'Diseñar, desarrollar e implementar soluciones de software y aplicaciones web que mejoren la eficiencia operativa y la transformación digital sostenible de nuestros clientes.',
  objetivosEspecificos: [
    'Desarrollar aplicaciones web modernas, seguras y escalables bajo estándares W3C.',
    'Automatizar procesos empresariales repetitivos para reducir tiempos operativos y errores humanos.',
    'Brindar soporte técnico, monitoreo continuo y evolución constante a las soluciones desplegadas.',
    'Implementar tecnologías emergentes e inteligencia artificial aplicada que mejoren la experiencia de usuario.',
    'Mantener altos estándares de calidad, seguridad de datos y rendimiento en cada proyecto.',
    'Fomentar la innovación y la capacitación continua dentro del equipo de ingeniería.',
  ],
};

export const REDES_SOCIALES = [
  {
    id: 'instagram',
    nombre: 'Instagram',
    handle: '@automatewebs.co',
    url: 'https://www.instagram.com/',
    icono: 'bi-instagram',
    colorClass: 'btn-outline-danger',
  },
  {
    id: 'facebook',
    nombre: 'Facebook',
    handle: 'Automate Webs Oficial',
    url: 'https://www.facebook.com/',
    icono: 'bi-facebook',
    colorClass: 'btn-outline-primary',
  },
  {
    id: 'whatsapp',
    nombre: 'WhatsApp',
    handle: '+57 310 482 9104',
    url: 'https://wa.me/573104829104?text=Hola%20Automate%20Webs,%20deseo%20informaci%C3%B3n%20sobre%20sus%20soluciones.',
    icono: 'bi-whatsapp',
    colorClass: 'btn-outline-success',
  },
  {
    id: 'linkedin',
    nombre: 'LinkedIn',
    handle: 'Automate Webs S.A.S.',
    url: 'https://www.linkedin.com/',
    icono: 'bi-linkedin',
    colorClass: 'btn-outline-info',
  },
];

export const PROMO_SLIDES = [
  {
    id: 'slide-1',
    imagenKey: 'slide_web',
    etiqueta: 'Ingeniería Web Corporativa',
    titulo: 'Plataformas Web y ERP hechos para escalar tu operación',
    descripcion: 'Digitaliza inventarios, facturación y reportes financieros con arquitectura React + Express.js de alto desempeño.',
    ctaTexto: 'Explorar Tienda',
    ctaVista: 'tienda',
  },
  {
    id: 'slide-2',
    imagenKey: 'slide_rpa',
    etiqueta: 'Automatización RPA',
    titulo: 'Elimina tareas manuales con robots de software 24/7',
    descripcion: 'Conciliación bancaria, envío de facturas y sincronización entre sistemas sin errores humanos.',
    ctaTexto: 'Consultar con IA',
    ctaVista: 'ia',
  },
  {
    id: 'slide-3',
    imagenKey: 'slide_cloud',
    etiqueta: 'Seguridad y Cloud',
    titulo: 'Infraestructura blindada con alta disponibilidad',
    descripcion: 'Arquitecturas protegidas contra ataques DDoS, cifrado SSL extremo a extremo y respaldos automatizados.',
    ctaTexto: 'Ver Inventario y Stock',
    ctaVista: 'operaciones',
  },
  {
    id: 'slide-4',
    imagenKey: 'slide_ecommerce',
    etiqueta: 'Comercio Electrónico y Pagos',
    titulo: 'Vende en línea con pasarelas PSE, Tarjetas y Nequi',
    descripcion: 'Catálogos dinámicos con carrito en tiempo real, cálculo de IVA y generación instantánea de comprobantes.',
    ctaTexto: 'Ir al Catálogo',
    ctaVista: 'tienda',
  },
  {
    id: 'slide-5',
    imagenKey: 'slide_ai',
    etiqueta: 'Consultoría e Inteligencia Artificial',
    titulo: 'Asesores inteligentes integrados a tu catálogo empresarial',
    descripcion: 'Conecta modelos generativos con tu inventario real para orientar compras y acelerar cierres comerciales.',
    ctaTexto: 'Probar Asistente IA',
    ctaVista: 'ia',
  },
];

export const POLITICA_DATOS_INFO = {
  leyAplicable: 'Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013 (Colombia)',
  responsable: 'Automate Webs S.A.S. · NIT 901.482.391-4',
  finalidades: [
    'Gestionar órdenes de compra, emisión de facturas y entregas de soluciones tecnológicas.',
    'Atender peticiones, quejas, reclamos y sugerencias (PQR) dentro de los términos legales.',
    'Mantener comunicación comercial técnica sobre soporte, garantías y actualizaciones autorizadas.',
    'Cumplir obligaciones contables, tributarias y contractuales ante autoridades competentes.',
  ],
  derechosArco: [
    'Conocer, actualizar y rectificar sus datos personales frente a Automate Webs.',
    'Solicitar prueba de la autorización otorgada para el tratamiento de sus datos.',
    'Ser informado respecto al uso que se le ha dado a su información personal.',
    'Revocar la autorización y/o solicitar la supresión del dato cuando no exista deber legal vigente.',
  ],
  canalAtencion: 'protecciondatos@automatewebs.co · Calle 53 # 10-60, Bogotá D.C.',
};

export const NIELSEN_HEURISTICS = [
  {
    num: 1,
    nombre: 'Visibilidad del estado del sistema',
    aplicacion: 'Indicadores de carga al consultar la API, insignia dinámica del carrito, estado de stock en tiempo real y notificaciones de éxito/error.',
  },
  {
    num: 2,
    nombre: 'Correspondencia entre el sistema y el mundo real',
    aplicacion: 'Lenguaje comercial colombiano claro (COP, IVA 19%, PSE, Nequi, PQR, Radicado) e iconos familiares de Bootstrap Icons.',
  },
  {
    num: 3,
    nombre: 'Control y libertad del usuario',
    aplicacion: 'Botones para cancelar edición en CRUD, cerrar modales/drawers, ajustar o vaciar el carrito y restablecer accesibilidad.',
  },
  {
    num: 4,
    nombre: 'Consistencia y estándares',
    aplicacion: 'Sistema uniforme Bootstrap 5 en botones, tablas, formularios, validaciones e iconografía en toda la aplicación.',
  },
  {
    num: 5,
    nombre: 'Prevención de errores',
    aplicacion: 'Validaciones con expresiones regulares antes de enviar, bloqueo de compra si el stock llega a 0 y confirmación al eliminar registros.',
  },
  {
    num: 6,
    nombre: 'Reconocimiento antes que recuerdo',
    aplicacion: 'Menú superior siempre visible, etiquetas claras en formularios, pistas rápidas en Asistente IA y encabezados descriptivos.',
  },
  {
    num: 7,
    nombre: 'Flexibilidad y eficiencia de uso',
    aplicacion: 'Buscadores instantáneos, filtros por categoría, ajuste rápido de stock (+1 / +5) y atajos de navegación directa.',
  },
  {
    num: 8,
    nombre: 'Diseño estético y minimalista',
    aplicacion: 'Jerarquía limpia con amplios espacios en blanco, tarjetas corporativas sobrias y datos financieros tabulares legibles.',
  },
  {
    num: 9,
    nombre: 'Ayuda al usuario a reconocer, diagnosticar y recuperarse de errores',
    aplicacion: 'Mensajes específicos en rojo Bootstrap (is-invalid / invalid-feedback) indicando el formato exacto esperado (ej. celular 3XXXXXXXXX).',
  },
  {
    num: 10,
    nombre: 'Ayuda y documentación',
    aplicacion: 'Apartado empresarial con Acordeón de Misión/Visión, Política de Datos Personales, Asistente IA y Auditor W3C/UX accesible desde el pie de página.',
  },
];
