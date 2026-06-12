const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');

const atendimentosRepository = {
  findAll: () => [...db.atendimentos],

  findById: (id) => db.atendimentos.find((a) => a.id === id) || null,

  findByAgendamentoId: (agendamentoId) =>
    db.atendimentos.find((a) => a.agendamentoId === agendamentoId) || null,

  create: (data) => {
    const novo = { id: uuidv4(), fotos: [], ...data };
    db.atendimentos.push(novo);
    return novo;
  },

  update: (id, data) => {
    const idx = db.atendimentos.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    db.atendimentos[idx] = { ...db.atendimentos[idx], ...data };
    return db.atendimentos[idx];
  },

  delete: (id) => {
    const idx = db.atendimentos.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    db.atendimentos.splice(idx, 1);
    return true;
  },
};

module.exports = atendimentosRepository;
