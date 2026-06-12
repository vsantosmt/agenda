const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');

const agendamentosRepository = {
  findAll: (filtros = {}) => {
    let lista = [...db.agendamentos];

    if (filtros.dataInicio) {
      lista = lista.filter(
        (a) => new Date(a.dataHora) >= new Date(filtros.dataInicio)
      );
    }
    if (filtros.dataFim) {
      lista = lista.filter(
        (a) => new Date(a.dataHora) <= new Date(filtros.dataFim)
      );
    }
    if (filtros.clienteId) {
      lista = lista.filter((a) => a.clienteId === filtros.clienteId);
    }
    if (filtros.status) {
      lista = lista.filter((a) => a.status === filtros.status);
    }

    return lista.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
  },

  findById: (id) => db.agendamentos.find((a) => a.id === id) || null,

  findByAgendamentoId: (agendamentoId) =>
    db.agendamentos.filter((a) => a.id === agendamentoId),

  create: (data) => {
    const novo = { id: uuidv4(), status: 'agendado', ...data };
    db.agendamentos.push(novo);
    return novo;
  },

  update: (id, data) => {
    const idx = db.agendamentos.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    db.agendamentos[idx] = { ...db.agendamentos[idx], ...data };
    return db.agendamentos[idx];
  },

  delete: (id) => {
    const idx = db.agendamentos.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    db.agendamentos.splice(idx, 1);
    return true;
  },
};

module.exports = agendamentosRepository;
