/**
 * Punto de entrada Serverless para Vercel (/api/*)
 * Reutiliza la aplicación Express.js compartida de backend/createApp.ts.
 */

import { createExpressApp } from '../backend/createApp';

const app = createExpressApp();

export default app;
