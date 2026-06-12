import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message || 'Erro ao conectar com o servidor';
    return Promise.reject(new Error(message));
  }
);

// ── Clientes ────────────────────────────────────────────────
export const clientesApi = {
  listar: (nome) => api.get('/clientes', { params: nome ? { nome } : {} }),
  buscarPorId: (id) => api.get(`/clientes/${id}`),
  criar: (data) => api.post('/clientes', data),
  atualizar: (id, data) => api.put(`/clientes/${id}`, data),
  excluir: (id) => api.delete(`/clientes/${id}`),
};

// ── Serviços ────────────────────────────────────────────────
export const servicosApi = {
  listar: () => api.get('/servicos'),
  buscarPorId: (id) => api.get(`/servicos/${id}`),
  criar: (data) => api.post('/servicos', data),
  atualizar: (id, data) => api.put(`/servicos/${id}`, data),
  excluir: (id) => api.delete(`/servicos/${id}`),
};

// ── Agendamentos ─────────────────────────────────────────────
export const agendamentosApi = {
  listar: (params) => api.get('/agendamentos', { params }),
  buscarPorId: (id) => api.get(`/agendamentos/${id}`),
  criar: (data) => api.post('/agendamentos', data),
  atualizar: (id, data) => api.put(`/agendamentos/${id}`, data),
  excluir: (id) => api.delete(`/agendamentos/${id}`),
};

// ── Atendimentos ─────────────────────────────────────────────
export const atendimentosApi = {
  listar: () => api.get('/atendimentos'),
  buscarPorId: (id) => api.get(`/atendimentos/${id}`),
  buscarPorAgendamento: (agendamentoId) =>
    api.get(`/atendimentos/agendamento/${agendamentoId}`),
  criar: (data) => api.post('/atendimentos', data),
  atualizar: (id, data) => api.put(`/atendimentos/${id}`, data),
  excluir: (id) => api.delete(`/atendimentos/${id}`),
};

// ── Faturamento ──────────────────────────────────────────────
export const faturamentoApi = {
  getResumo: () => api.get('/faturamento/resumo'),
  getDiario: (params) => api.get('/faturamento/diario', { params }),
  getMensal: (params) => api.get('/faturamento/mensal', { params }),
  getDetalhado: (params) => api.get('/faturamento/detalhado', { params }),
};

export default api;
