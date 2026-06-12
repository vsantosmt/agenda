const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');

const servicosRepository = {
  findAll: () => [...db.servicos],

  findById: (id) => db.servicos.find((s) => s.id === id) || null,

  create: (data) => {
    const novo = { id: uuidv4(), ...data };
    db.servicos.push(novo);
    return novo;
  },

  update: (id, data) => {
    const idx = db.servicos.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    db.servicos[idx] = { ...db.servicos[idx], ...data };
    return db.servicos[idx];
  },

  delete: (id) => {
    const idx = db.servicos.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    db.servicos.splice(idx, 1);
    return true;
  },
};

module.exports = servicosRepository;
