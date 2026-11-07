# DESARROLLO DE SOFTWARE Y AUTOMATIZACIÓN
## Plataforma de Gestión Empresarial y Arquitectura CRUD REST

---

## 1. Contexto del Proyecto

Sistema integral de gestión comercial y operacional para la empresa **Desarrollo de software y Automatización**. La plataforma implementa un diseño minimalista, sobrio y corporativo para la administración centralizada de datos de negocio (**productos/servicios**, **clientes**, **proveedores**, **compras** y **ventas**), consumiendo una API REST simulada (`json-server`) con sincronización persistente en `localStorage` a través del helper `helpFetch` y hooks de React (`useState`, `useEffect`).

---

## 2. Identidad Corporativa del Negocio

### Razón Social
**Desarrollo de software y Automatización**

### Misión
> Desarrollar soluciones de software innovadoras, seguras y de alta calidad que ayuden a empresas y emprendedores a digitalizar y automatizar sus procesos, ofreciendo productos personalizados que impulsen su crecimiento y competitividad a base de su página web.

### Visión
> Ser una empresa reconocida a nivel nacional e internacional por la excelencia en el desarrollo de software y la innovación tecnológica, destacándonos por brindar soluciones eficientes, confiables y adaptadas a las necesidades de nuestros clientes.

### Objetivo General
- Diseñar, desarrollar e implementar soluciones de software y aplicaciones web que mejoren la eficiencia operativa y la transformación digital de nuestros clientes.

### Objetivos Específicos
1. Desarrollar aplicaciones web modernas, seguras y escalables.
2. Automatizar procesos empresariales para reducir tiempos y costos.
3. Brindar soporte técnico y mantenimiento continuo a las soluciones desarrolladas.
4. Implementar tecnologías innovadoras que mejoren la experiencia del usuario.
5. Mantener altos estándares de calidad, seguridad y rendimiento en cada proyecto.
6. Fomentar la innovación y el aprendizaje continuo dentro del equipo de trabajo.

---

## 3. Arquitectura y Fundamento Técnico

- **Arquitectura de Red y Puertos**:
  - **Puerto Público (3000)**: Cliente React SPA con maquetación sobria y minimalista.
  - **Puerto Privado (5000)**: API REST ficticia con persistencia local y soporte para códigos HTTP (200, 201, 204, 404).
- **Helper helpFetch**: Módulo de peticiones HTTP con control de excepciones, timeouts y abort controller.
- **Operaciones CRUD**:
  - `POST` (Create): Registro de nuevos productos, cuentas, proveedores, compras y ventas.
  - `GET` (Read): Consulta reactiva filtrable por búsqueda en tiempo real.
  - `PUT` (Update): Modificación en sitio de registros existentes.
  - `DELETE` (Delete): Eliminación con confirmación y retroalimentación de estado.

---

## 4. Módulos del Sistema

| Módulo | Alcance Comercial |
| :--- | :--- |
| **Empresa (Negocio.jsx)** | Visión estratégica, KPIs financieros y resumen de operaciones. |
| **Productos** | Catálogo de servicios de software, bots RPA y soluciones cloud. |
| **Clientes** | Directorio corporativo de empresas aliadas y contactos. |
| **Proveedores** | Proveedores de infraestructura cloud (AWS, Azure, Cloudflare). |
| **Compras** | Registro de gastos operacionales e inversiones en tecnología. |
| **Ventas** | Contratos de desarrollo web formalizados y cartera. |
| **Consola API** | Monitor de red HTTP y visor de la base de datos `db.json`. |

