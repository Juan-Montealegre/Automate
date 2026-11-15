/**
 * @license
 * Automate Webs - Servidor Backend Express.js
 * Persistencia en base de datos JSON (/data/database.json), CRUD REST,
 * Inventarios, Facturación electrónica simulada, PQR, API de Desarrolladores y Asistente IA (@google/genai).
 */

import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  productos: Array<Record<string, any>>;
  clientes: Array<Record<string, any>>;
  proveedores: Array<Record<string, any>>;
  compras: Array<Record<string, any>>;
  ventas: Array<Record<string, any>>;
  desarrolladores: Array<Record<string, any>>;
  pqr: Array<Record<string, any>>;
  facturas: Array<Record<string, any>>;
}

const ALLOWED_ENTITIES = new Set<keyof DatabaseSchema>([
  'productos',
  'clientes',
  'proveedores',
  'compras',
  'ventas',
  'desarrolladores',
  'pqr',
  'facturas',
]);

function getSeedDatabase(): DatabaseSchema {
  return {
    productos: [
      {
        id: '1',
        sku: 'AW-ERP-001',
        nombre: 'Plataforma Web ERP a Medida',
        categoria: 'Desarrollo Web',
        descripcion: 'Sistema web integral para gestión de inventarios, facturación electrónica y analítica financiera en tiempo real.',
        precio: 8500000,
        stock: 8,
        stockMinimo: 2,
        plazo: '8 semanas',
        estado: 'Activo',
        tecnologia: 'React, Node.js, PostgreSQL',
        imagenKey: 'slide_web',
      },
      {
        id: '2',
        sku: 'AW-RPA-002',
        nombre: 'Bot RPA para Conciliación Bancaria',
        categoria: 'Automatización RPA',
        descripcion: 'Robot de software que descarga extractos, cruza movimientos contables y emite alertas automáticas.',
        precio: 5200000,
        stock: 12,
        stockMinimo: 3,
        plazo: '4 semanas',
        estado: 'Activo',
        tecnologia: 'Python, UiPath, Playwright',
        imagenKey: 'slide_rpa',
      },
      {
        id: '3',
        sku: 'AW-PAY-003',
        nombre: 'API Microservicio de Pagos',
        categoria: 'APIs & Microservicios',
        descripcion: 'Integración segura de pasarela de pagos multi-canal (PSE, tarjetas, Nequi) con webhooks cifrados.',
        precio: 3800000,
        stock: 15,
        stockMinimo: 4,
        plazo: '3 semanas',
        estado: 'Activo',
        tecnologia: 'Express.js, JWT, Redis',
        imagenKey: 'slide_ecommerce',
      },
      {
        id: '4',
        sku: 'AW-B2B-004',
        nombre: 'Portal E-commerce B2B Escalable',
        categoria: 'Desarrollo Web',
        descripcion: 'Tienda en línea corporativa con cotizador automático, control de inventarios y panel de clientes.',
        precio: 6400000,
        stock: 6,
        stockMinimo: 2,
        plazo: '6 semanas',
        estado: 'Activo',
        tecnologia: 'React, Bootstrap 5, Express',
        imagenKey: 'slide_ecommerce',
      },
      {
        id: '5',
        sku: 'AW-CLD-005',
        nombre: 'Arquitectura Cloud & Seguridad WAF',
        categoria: 'Infraestructura Cloud',
        descripcion: 'Despliegue en alta disponibilidad con balanceo de carga, firewall WAF, SSL y monitoreo continuo.',
        precio: 4100000,
        stock: 10,
        stockMinimo: 3,
        plazo: '3 semanas',
        estado: 'Activo',
        tecnologia: 'Docker, AWS, Cloudflare',
        imagenKey: 'slide_cloud',
      },
      {
        id: '6',
        sku: 'AW-IA-006',
        nombre: 'Asistente IA & Soporte 24/7',
        categoria: 'Inteligencia Artificial',
        descripcion: 'Implementación de copiloto inteligente conectado a catálogo propio con monitoreo y soporte SLA.',
        precio: 2900000,
        stock: 20,
        stockMinimo: 5,
        plazo: '2 semanas',
        estado: 'Activo',
        tecnologia: 'Gemini API, Node.js, Grafana',
        imagenKey: 'slide_ai',
      },
    ],
    clientes: [
      {
        id: '1',
        nombre: 'Logística Andina S.A.S.',
        nit: '900.512.441-2',
        contacto: 'Carlos Mario Restrepo',
        email: 'gerencia@logisticaandina.co',
        telefono: '+57 3104558899',
        ciudad: 'Bogotá D.C.',
        sector: 'Transporte y Logística',
        estado: 'Activo',
      },
      {
        id: '2',
        nombre: 'Distribuidora Farmacéutica del Valle',
        nit: '890.301.884-6',
        contacto: 'Dra. Marcela Cardona',
        email: 'compras@farmavalle.com.co',
        telefono: '+57 3158872341',
        ciudad: 'Cali',
        sector: 'Salud y Farmacia',
        estado: 'Activo',
      },
      {
        id: '3',
        nombre: 'Constructora El Roble & Asociados',
        nit: '901.120.765-9',
        contacto: 'Ing. Roberto Gómez',
        email: 'rgomez@constructoraelroble.com',
        telefono: '+57 3206719043',
        ciudad: 'Medellín',
        sector: 'Construcción e Inmobiliario',
        estado: 'Activo',
      },
      {
        id: '4',
        nombre: 'Café Gourmet Origen Colombiano',
        nit: '900.993.411-0',
        contacto: 'Valentina Morales',
        email: 'vmorales@origengourmet.com',
        telefono: '+57 3129043321',
        ciudad: 'Manizales',
        sector: 'Agroindustria y Exportación',
        estado: 'Activo',
      },
      {
        id: '5',
        nombre: 'Finanzas & Créditos del Oriente',
        nit: '901.442.109-8',
        contacto: 'Esteban Cárdenas',
        email: 'operaciones@fincoriente.co',
        telefono: '+57 3183341122',
        ciudad: 'Bucaramanga',
        sector: 'Fintech y Servicios Financieros',
        estado: 'Activo',
      },
    ],
    proveedores: [
      {
        id: '1',
        nombre: 'Amazon Web Services (AWS Latam)',
        servicio: 'Infraestructura Cloud y Servidores EC2',
        contacto: 'Soporte Empresarial AWS',
        email: 'billing-latam@amazon.com',
        telefono: '+57 3002209000',
        pais: 'Colombia / EE. UU.',
        estado: 'Activo',
      },
      {
        id: '2',
        nombre: 'Microsoft Cloud & Azure AI',
        servicio: 'Servicios Cloud y Licenciamiento Empresarial',
        contacto: 'Partnership Colombia',
        email: 'soporte.azure@microsoft.com',
        telefono: '+57 3105189000',
        pais: 'Colombia',
        estado: 'Activo',
      },
      {
        id: '3',
        nombre: 'Cloudflare Inc.',
        servicio: 'CDN, Mitigación DDoS y Certificados SSL',
        contacto: 'Enterprise Sales',
        email: 'billing@cloudflare.com',
        telefono: '+57 3119935273',
        pais: 'Estados Unidos',
        estado: 'Activo',
      },
      {
        id: '4',
        nombre: 'UiPath Automation Platform',
        servicio: 'Licencias RPA Orchestrator y Studio',
        contacto: 'Licenciamiento Corporativo',
        email: 'licensing@uipath.com',
        telefono: '+57 3145603450',
        pais: 'Estados Unidos',
        estado: 'Activo',
      },
      {
        id: '5',
        nombre: 'Twilio Communications',
        servicio: 'APIs de SMS, WhatsApp Business y Notificaciones',
        contacto: 'Accounts Team',
        email: 'accounts@twilio.com',
        telefono: '+57 3178894546',
        pais: 'Estados Unidos',
        estado: 'Activo',
      },
    ],
    compras: [
      {
        id: '1',
        fecha: '2026-10-15',
        proveedor: 'Amazon Web Services (AWS Latam)',
        concepto: 'Instancias EC2 y bases de datos administradas para producción',
        categoria: 'Infraestructura Cloud',
        costo: 1850000,
        metodoPago: 'Tarjeta Corporativa',
        estado: 'Pagado',
      },
      {
        id: '2',
        fecha: '2026-10-22',
        proveedor: 'Microsoft Cloud & Azure AI',
        concepto: 'Licencias de productividad y herramientas DevOps',
        categoria: 'Licenciamiento de Software',
        costo: 1240000,
        metodoPago: 'Transferencia Bancaria',
        estado: 'Pagado',
      },
      {
        id: '3',
        fecha: '2026-10-28',
        proveedor: 'Cloudflare Inc.',
        concepto: 'Plan Pro de CDN con firewall WAF y protección DDoS',
        categoria: 'Seguridad Web',
        costo: 480000,
        metodoPago: 'Tarjeta Corporativa',
        estado: 'Pagado',
      },
      {
        id: '4',
        fecha: '2026-11-02',
        proveedor: 'UiPath Automation Platform',
        concepto: 'Renovación de runtime unattended para robot RPA',
        categoria: 'Herramientas de Automatización',
        costo: 2100000,
        metodoPago: 'Transferencia Bancaria',
        estado: 'Pendiente',
      },
      {
        id: '5',
        fecha: '2026-11-05',
        proveedor: 'Twilio Communications',
        concepto: 'Recarga de saldo para alertas automáticas de WhatsApp',
        categoria: 'Comunicaciones & SMS',
        costo: 350000,
        metodoPago: 'Tarjeta Corporativa',
        estado: 'Pagado',
      },
    ],
    ventas: [
      {
        id: '1',
        fecha: '2026-10-10',
        cliente: 'Logística Andina S.A.S.',
        producto: 'Plataforma Web ERP a Medida',
        cantidad: 1,
        valor: 8500000,
        formaPago: 'PSE Empresarial',
        estado: 'Facturado',
        responsable: 'Equipo Web Senior',
      },
      {
        id: '2',
        fecha: '2026-10-18',
        cliente: 'Distribuidora Farmacéutica del Valle',
        producto: 'Bot RPA para Conciliación Bancaria',
        cantidad: 1,
        valor: 5200000,
        formaPago: 'Tarjeta Corporativa',
        estado: 'Implementado',
        responsable: 'Ingeniero de Automatización',
      },
      {
        id: '3',
        fecha: '2026-10-25',
        cliente: 'Constructora El Roble & Asociados',
        producto: 'Portal E-commerce B2B Escalable',
        cantidad: 1,
        valor: 6400000,
        formaPago: 'Transferencia Bancaria',
        estado: 'En Desarrollo',
        responsable: 'Equipo Full-Stack',
      },
      {
        id: '4',
        fecha: '2026-11-01',
        cliente: 'Café Gourmet Origen Colombiano',
        producto: 'Arquitectura Cloud & Seguridad WAF',
        cantidad: 1,
        valor: 4100000,
        formaPago: 'PSE Empresarial',
        estado: 'Facturado',
        responsable: 'Arquitecto Cloud',
      },
      {
        id: '5',
        fecha: '2026-11-04',
        cliente: 'Finanzas & Créditos del Oriente',
        producto: 'API Microservicio de Pagos',
        cantidad: 1,
        valor: 3800000,
        formaPago: 'Tarjeta Corporativa',
        estado: 'Facturado',
        responsable: 'Arquitecto de Software',
      },
    ],
    desarrolladores: [
      {
        id: 'dev-1',
        nombre: 'Mateo Valderrama López',
        rol: 'Arquitecto Full-Stack & Líder Técnico',
        especialidad: 'React, Express.js, Microservicios y Cloud',
        celular: '+57 3104829104',
        correo: 'mvalderrama@automatewebs.co',
        github: 'https://github.com/automatewebs-mateo',
        linkedin: 'https://www.linkedin.com/in/automatewebs-mateo',
        ciudad: 'Bogotá D.C.',
        experiencia: '5 años',
        bio: 'Ingeniero de sistemas especializado en arquitecturas web de alta disponibilidad, diseño de APIs REST y optimización de rendimiento.',
        fotoKey: 'dev_1',
      },
      {
        id: 'dev-2',
        nombre: 'Camila Andrea Rojas',
        rol: 'Ingeniera Frontend & Accesibilidad UX',
        especialidad: 'Bootstrap 5, Estándares W3C, Heurísticas UX y React',
        celular: '+57 3157392041',
        correo: 'crojas@automatewebs.co',
        github: 'https://github.com/automatewebs-camila',
        linkedin: 'https://www.linkedin.com/in/automatewebs-camila',
        ciudad: 'Bogotá D.C.',
        experiencia: '4 años',
        bio: 'Especialista en interfaces comerciales accesibles, diseño centrado en el usuario bajo las 10 heurísticas de Nielsen y validación semántica W3C.',
        fotoKey: 'dev_2',
      },
      {
        id: 'dev-3',
        nombre: 'Julián Esteban Mora',
        rol: 'Ingeniero de Automatización RPA & IA',
        especialidad: 'Automatización de procesos, Bots RPA e Integración IA',
        celular: '+57 3209145582',
        correo: 'jmora@automatewebs.co',
        github: 'https://github.com/automatewebs-julian',
        linkedin: 'https://www.linkedin.com/in/automatewebs-julian',
        ciudad: 'Bogotá D.C.',
        experiencia: '4 años',
        bio: 'Desarrollador enfocado en automatización robótica de procesos, integración de pasarelas de pago y asistentes conversacionales con IA generativa.',
        fotoKey: 'dev_3',
      },
    ],
    pqr: [
      {
        id: 'pqr-1',
        radicado: 'PQR-2026-1001',
        tipo: 'Petición',
        nombre: 'Carlos Mario Restrepo',
        correo: 'gerencia@logisticaandina.co',
        celular: '+57 3104558899',
        asunto: 'Ampliación de módulos ERP para sucursal Medellín',
        mensaje: 'Solicitamos cotización técnica para habilitar dos bodegas adicionales dentro de la plataforma ERP.',
        estado: 'En Revisión',
        fecha: '2026-11-08',
        autorizaDatos: true,
      },
      {
        id: 'pqr-2',
        radicado: 'PQR-2026-1002',
        tipo: 'Sugerencia',
        nombre: 'Dra. Marcela Cardona',
        correo: 'compras@farmavalle.com.co',
        celular: '+57 3158872341',
        asunto: 'Reporte automático semanal en PDF',
        mensaje: 'Sería ideal recibir el resumen de conciliación bancaria todos los lunes a las 7:00 a.m.',
        estado: 'Resuelto',
        fecha: '2026-11-10',
        autorizaDatos: true,
      },
    ],
    facturas: [
      {
        id: 'fac-1',
        numero: 'FAC-2026-0001',
        fecha: '2026-11-04',
        clienteNombre: 'Finanzas & Créditos del Oriente',
        clienteDocumento: '901.442.109-8',
        clienteCorreo: 'operaciones@fincoriente.co',
        clienteCelular: '+57 3183341122',
        metodoPago: 'Tarjeta Corporativa',
        referenciaPago: 'PAY-AW-894210',
        items: [
          {
            id: '3',
            sku: 'AW-PAY-003',
            nombre: 'API Microservicio de Pagos',
            cantidad: 1,
            precioUnitario: 3800000,
            subtotal: 3800000,
          },
        ],
        subtotal: 3800000,
        iva: 722000,
        total: 4522000,
        estado: 'Pagada',
      },
    ],
  };
}

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const seed = getSeedDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    const seed = getSeedDatabase();
    const merged: DatabaseSchema = {
      productos: Array.isArray(parsed.productos) ? parsed.productos : seed.productos,
      clientes: Array.isArray(parsed.clientes) ? parsed.clientes : seed.clientes,
      proveedores: Array.isArray(parsed.proveedores) ? parsed.proveedores : seed.proveedores,
      compras: Array.isArray(parsed.compras) ? parsed.compras : seed.compras,
      ventas: Array.isArray(parsed.ventas) ? parsed.ventas : seed.ventas,
      desarrolladores: Array.isArray(parsed.desarrolladores) ? parsed.desarrolladores : seed.desarrolladores,
      pqr: Array.isArray(parsed.pqr) ? parsed.pqr : seed.pqr,
      facturas: Array.isArray(parsed.facturas) ? parsed.facturas : seed.facturas,
    };
    return merged;
  } catch {
    const seed = getSeedDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function saveDb(db: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

async function startServer() {
  ensureDb();
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Salud del servidor
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, service: 'Automate Webs API', timestamp: new Date().toISOString() });
  });

  // Configuración pública segura (sin exponer llaves secretas de servidor)
  app.get('/api/config', (_req: Request, res: Response) => {
    res.json({
      mapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
      aiEnabled: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Restaurar base de datos inicial
  app.post('/api/db/reset', (_req: Request, res: Response) => {
    const seed = getSeedDatabase();
    saveDb(seed);
    res.json({ ok: true, message: 'Base de datos restablecida', db: seed });
  });

  // Checkout y facturación electrónica simulada con descuento real de inventario
  app.post('/api/checkout', (req: Request, res: Response) => {
    const { cliente, metodoPago, referenciaPago, items } = req.body || {};

    if (!cliente || !cliente.nombre || !cliente.correo || !cliente.celular || !cliente.documento) {
      res.status(400).json({ error: 'Datos completos del cliente son obligatorios para facturar.' });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'El carrito está vacío.' });
      return;
    }

    const db = ensureDb();

    // Validar disponibilidad de stock antes de modificar
    const verifiedItems: Array<{
      id: string;
      sku: string;
      nombre: string;
      cantidad: number;
      precioUnitario: number;
      subtotal: number;
    }> = [];

    for (const cartItem of items) {
      const qty = Number(cartItem.cantidad);
      if (!Number.isInteger(qty) || qty <= 0) {
        res.status(400).json({ error: 'Cantidad inválida en el carrito.' });
        return;
      }

      const prod = db.productos.find((p) => String(p.id) === String(cartItem.id));
      if (!prod) {
        res.status(404).json({ error: `Producto ID ${cartItem.id} no encontrado en catálogo.` });
        return;
      }

      const currentStock = Number(prod.stock ?? 0);
      if (currentStock < qty) {
        res.status(409).json({
          error: `Stock insuficiente para "${prod.nombre}". Disponible: ${currentStock}, solicitado: ${qty}.`,
        });
        return;
      }

      const precioUnitario = Number(prod.precio || 0);
      verifiedItems.push({
        id: String(prod.id),
        sku: String(prod.sku || `AW-${prod.id}`),
        nombre: String(prod.nombre),
        cantidad: qty,
        precioUnitario,
        subtotal: precioUnitario * qty,
      });
    }

    // Descontar inventario y registrar ventas
    const today = new Date().toISOString().split('T')[0];
    for (const vItem of verifiedItems) {
      const prod = db.productos.find((p) => String(p.id) === vItem.id);
      if (prod) {
        const nextStock = Math.max(0, Number(prod.stock ?? 0) - vItem.cantidad);
        prod.stock = nextStock;
        if (nextStock === 0) {
          prod.estado = 'Agotado';
        }
      }

      db.ventas.unshift({
        id: `v-${Date.now()}-${vItem.id}`,
        fecha: today,
        cliente: cliente.nombre,
        producto: vItem.nombre,
        cantidad: vItem.cantidad,
        valor: vItem.subtotal,
        formaPago: metodoPago || 'Pasarela Web',
        estado: 'Facturado',
        responsable: 'Tienda Online Automate Webs',
      });
    }

    // Registrar cliente si es nuevo
    const existingClient = db.clientes.find(
      (c) =>
        String(c.email || '').toLowerCase() === String(cliente.correo).toLowerCase() ||
        String(c.nit || '') === String(cliente.documento)
    );
    if (!existingClient) {
      db.clientes.unshift({
        id: `cli-${Date.now()}`,
        nombre: cliente.nombre,
        nit: cliente.documento,
        contacto: cliente.nombre,
        email: cliente.correo,
        telefono: cliente.celular,
        ciudad: cliente.ciudad || 'Bogotá D.C.',
        sector: 'Cliente Tienda Digital',
        estado: 'Activo',
      });
    }

    const subtotal = verifiedItems.reduce((acc, it) => acc + it.subtotal, 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;
    const nextInvoiceNum = `FAC-2026-${String(db.facturas.length + 1).padStart(4, '0')}`;

    const newFactura = {
      id: `fac-${Date.now()}`,
      numero: nextInvoiceNum,
      fecha: today,
      clienteNombre: cliente.nombre,
      clienteDocumento: cliente.documento,
      clienteCorreo: cliente.correo,
      clienteCelular: cliente.celular,
      metodoPago: metodoPago || 'Tarjeta de Crédito / Débito',
      referenciaPago: referenciaPago || `AW-TX-${Math.floor(100000 + Math.random() * 900000)}`,
      items: verifiedItems,
      subtotal,
      iva,
      total,
      estado: 'Pagada',
      createdAt: new Date().toISOString(),
    };

    db.facturas.unshift(newFactura);
    saveDb(db);

    res.status(201).json({ ok: true, factura: newFactura });
  });

  // Ajuste directo de stock / reabastecimiento
  app.patch('/api/productos/:id/stock', (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { delta, stock } = req.body || {};
    const db = ensureDb();
    const index = db.productos.findIndex((p) => String(p.id) === id);

    if (index === -1) {
      res.status(404).json({ error: `Producto ${id} no encontrado.` });
      return;
    }

    const current = db.productos[index];
    let nextStock = Number(current.stock ?? 0);

    if (typeof stock === 'number' && !Number.isNaN(stock)) {
      nextStock = Math.max(0, Math.floor(stock));
    } else if (typeof delta === 'number' && !Number.isNaN(delta)) {
      nextStock = Math.max(0, nextStock + Math.floor(delta));
    } else {
      res.status(400).json({ error: 'Debe enviar "delta" o "stock" numérico.' });
      return;
    }

    current.stock = nextStock;
    current.estado = nextStock === 0 ? 'Agotado' : 'Activo';
    current.updatedAt = new Date().toISOString();
    saveDb(db);

    res.json(current);
  });

  // Consultor Comercial y Técnico con IA (Gemini API servidor)
  app.post('/api/ai/consult', async (req: Request, res: Response) => {
    const { prompt, contextType } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Debe ingresar una consulta para el asistente.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'El servicio de Inteligencia Artificial no está configurado en el servidor (falta GEMINI_API_KEY).',
      });
      return;
    }

    try {
      const db = ensureDb();
      const catalogSummary = db.productos
        .map(
          (p) =>
            `- [${p.sku}] ${p.nombre} (${p.categoria}): $${Number(p.precio).toLocaleString('es-CO')} COP | Stock: ${p.stock} uds | Plazo: ${p.plazo} | Tech: ${p.tecnologia}`
        )
        .join('\n');

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt.trim(),
        config: {
          systemInstruction: `Eres el Consultor de Arquitectura y Soluciones de Automate Webs (Desarrollo de Software y Automatización en Bogotá, Colombia).
Responde siempre en español profesional, claro, directo y comercialmente útil.
Ayuda al visitante o cliente a elegir productos del catálogo real, estimar plazos, calcular beneficios de automatización RPA, integración de pagos o arquitectura web.
Catálogo activo y stock en tiempo real:
${catalogSummary}
Enfoque actual de consulta: ${contextType || 'Asesoría comercial y técnica'}.
No inventes productos fuera del catálogo al dar precios exactos; si el usuario requiere algo a medida, sugiere el producto más cercano del catálogo y recomienda radicar una solicitud en la sección de Contacto/PQR. Sé conciso (máximo 180 palabras).`,
        },
      });

      res.json({
        reply: response.text || 'No fue posible generar una respuesta en este momento.',
        model: 'gemini-4-hydrogen',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error consultando Gemini API';
      console.error('Error /api/ai/consult:', message);
      res.status(500).json({
        error: 'No se pudo completar la consulta con el asistente de IA. Intente nuevamente en unos segundos.',
      });
    }
  });

  // Endpoints CRUD genéricos para todas las entidades
  app.get('/api/:entity', (req: Request, res: Response) => {
    const entity = req.params.entity as keyof DatabaseSchema;
    if (!ALLOWED_ENTITIES.has(entity)) {
      res.status(404).json({ error: `Entidad "${entity}" no soportada.` });
      return;
    }

    const db = ensureDb();
    let list = [...(db[entity] || [])];

    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const categoria = typeof req.query.categoria === 'string' ? req.query.categoria.trim().toLowerCase() : '';

    if (categoria && categoria !== 'todas') {
      list = list.filter((item) => String(item.categoria || '').toLowerCase() === categoria);
    }

    if (q) {
      list = list.filter((item) =>
        Object.values(item).some((val) => String(val ?? '').toLowerCase().includes(q))
      );
    }

    res.json(list);
  });

  app.post('/api/:entity', (req: Request, res: Response) => {
    const entity = req.params.entity as keyof DatabaseSchema;
    if (!ALLOWED_ENTITIES.has(entity)) {
      res.status(404).json({ error: `Entidad "${entity}" no soportada.` });
      return;
    }

    const payload = req.body || {};
    const db = ensureDb();
    const list = db[entity] || [];

    const newRecord: Record<string, any> = {
      ...payload,
      id: payload.id ? String(payload.id) : `${entity.slice(0, 3)}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (entity === 'pqr') {
      newRecord.radicado = payload.radicado || `PQR-2026-${1001 + list.length}`;
      newRecord.fecha = payload.fecha || new Date().toISOString().split('T')[0];
      newRecord.estado = payload.estado || 'Radicado';
    }

    if (entity === 'productos') {
      newRecord.sku = payload.sku || `AW-SKU-${100 + list.length + 1}`;
      newRecord.stock = Math.max(0, Number(payload.stock ?? 5));
      newRecord.stockMinimo = Math.max(1, Number(payload.stockMinimo ?? 2));
      newRecord.precio = Math.max(0, Number(payload.precio ?? 0));
      newRecord.estado = newRecord.stock === 0 ? 'Agotado' : (payload.estado || 'Activo');
    }

    list.unshift(newRecord);
    db[entity] = list;
    saveDb(db);

    res.status(201).json(newRecord);
  });

  app.put('/api/:entity/:id', (req: Request, res: Response) => {
    const entity = req.params.entity as keyof DatabaseSchema;
    const id = String(req.params.id);
    if (!ALLOWED_ENTITIES.has(entity)) {
      res.status(404).json({ error: `Entidad "${entity}" no soportada.` });
      return;
    }

    const db = ensureDb();
    const list = db[entity] || [];
    const idx = list.findIndex((item) => String(item.id) === id);

    if (idx === -1) {
      res.status(404).json({ error: `Registro ${id} no encontrado en ${entity}.` });
      return;
    }

    const updated = {
      ...list[idx],
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    };

    if (entity === 'productos' && updated.stock !== undefined) {
      updated.stock = Math.max(0, Number(updated.stock));
      if (updated.stock === 0) updated.estado = 'Agotado';
    }

    list[idx] = updated;
    db[entity] = list;
    saveDb(db);

    res.json(updated);
  });

  app.delete('/api/:entity/:id', (req: Request, res: Response) => {
    const entity = req.params.entity as keyof DatabaseSchema;
    const id = String(req.params.id);
    if (!ALLOWED_ENTITIES.has(entity)) {
      res.status(404).json({ error: `Entidad "${entity}" no soportada.` });
      return;
    }

    const db = ensureDb();
    const list = db[entity] || [];
    const nextList = list.filter((item) => String(item.id) !== id);

    if (nextList.length === list.length) {
      res.status(404).json({ error: `Registro ${id} no encontrado en ${entity}.` });
      return;
    }

    db[entity] = nextList;
    saveDb(db);

    res.json({ success: true, id });
  });

  // Vite middleware en desarrollo o archivos estáticos en producción
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Automate Webs Express + Vite ejecutándose en http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error fatal al iniciar el servidor:', err);
  process.exit(1);
});
