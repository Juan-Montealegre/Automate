/**
 * Componente de Inteligencia Artificial: Consultor Comercial y Técnico Automate Webs
 * Consume la ruta segura del servidor Express (/api/ai/consult) respaldada por @google/genai.
 */

import React, { useState } from 'react';
import { helpFetch } from '../helpers/helpFetch';

const QUICK_PROMPTS = [
  '¿Qué solución me recomiendas para automatizar conciliación bancaria y facturación?',
  'Necesito montar una tienda B2B con pagos en línea, ¿cuál es el precio y plazo?',
  '¿Cómo protegen la infraestructura web frente a ataques DDoS y fallos?',
  'Tengo un presupuesto de $10.000.000 COP, ¿qué paquete de productos me sugieres?',
];

export default function AsistenteIA({ onNavigate }) {
  const api = helpFetch();
  const [prompt, setPrompt] = useState('');
  const [contextType, setContextType] = useState('Asesoría Comercial y Presupuesto');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Bienvenido al Consultor Inteligente de Automate Webs. Puedo recomendarte productos de nuestro catálogo en tiempo real, estimar plazos de entrega o orientarte sobre arquitectura web y automatización RPA.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sendConsultation = async (textToSend) => {
    const clean = String(textToSend || '').trim();
    if (!clean || loading) return;

    setErrorMsg('');
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: clean }]);
    setPrompt('');
    setLoading(true);

    try {
      const data = await api.post('/api/ai/consult', {
        body: { prompt: clean, contextType },
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.reply || 'Consulta procesada.',
        },
      ]);
    } catch (err) {
      setErrorMsg(
        err.statusText || 'No fue posible conectar con el asistente IA en este momento.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendConsultation(prompt);
  };

  return (
    <div className="container-xl py-4 py-lg-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span className="badge text-bg-dark mb-2">Inteligencia Artificial Aplicada</span>
          <h1 className="h2 fw-bold mb-1">Asistente Comercial y Arquitecto IA</h1>
          <p className="text-secondary mb-0">
            Consulta en lenguaje natural sobre nuestras soluciones, precios en COP y stock disponible en catálogo.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={() => onNavigate('tienda')}
        >
          <i className="bi bi-bag-check me-2" aria-hidden="true"></i>
          Ir al Catálogo de Tienda
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="aw-card p-4 h-100">
            <h2 className="h5 fw-bold mb-3">Consultas Frecuentes</h2>
            <div className="mb-3">
              <label htmlFor="ai-context" className="form-label small fw-semibold">
                Enfoque de la consulta
              </label>
              <select
                id="ai-context"
                className="form-select form-select-sm"
                value={contextType}
                onChange={(e) => setContextType(e.target.value)}
              >
                <option value="Asesoría Comercial y Presupuesto">
                  Asesoría Comercial y Presupuesto
                </option>
                <option value="Arquitectura Web y Seguridad">
                  Arquitectura Web y Seguridad
                </option>
                <option value="Automatización RPA de Procesos">
                  Automatización RPA de Procesos
                </option>
              </select>
            </div>

            <div className="d-grid gap-2">
              {QUICK_PROMPTS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn btn-outline-secondary btn-sm text-start py-2 px-3"
                  disabled={loading}
                  onClick={() => sendConsultation(q)}
                >
                  <i className="bi bi-chat-dots me-2" aria-hidden="true"></i>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="aw-card p-4 d-flex flex-column" style={{ minHeight: '460px' }}>
            <div
              className="flex-grow-1 overflow-auto pe-2 mb-3"
              style={{ maxHeight: '360px' }}
              aria-live="polite"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex mb-3 ${
                    msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-3 small ${
                      msg.role === 'user'
                        ? 'bg-dark text-white'
                        : 'bg-light border text-dark'
                    }`}
                    style={{ maxWidth: '85%', whiteSpace: 'pre-line' }}
                  >
                    <div className="fw-bold mb-1" style={{ fontSize: '0.75rem' }}>
                      {msg.role === 'user' ? 'Tú' : 'Consultor Automate Webs IA'}
                    </div>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="d-flex align-items-center gap-2 text-secondary small">
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                  <span>Analizando catálogo y redactando recomendación...</span>
                </div>
              )}
            </div>

            {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="mt-auto">
              <label htmlFor="ai-prompt-input" className="visually-hidden">
                Escribe tu consulta para el asistente IA
              </label>
              <div className="input-group">
                <input
                  id="ai-prompt-input"
                  type="text"
                  className="form-control"
                  placeholder="Describe tu necesidad empresarial o pregunta por un producto..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn btn-dark px-4 fw-semibold"
                  disabled={loading || !prompt.trim()}
                >
                  <i className="bi bi-send me-1" aria-hidden="true"></i>
                  Consultar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
