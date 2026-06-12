/**
 * Repositório de Clientes
 * Camada de acesso a dados — troque as implementações abaixo por queries
 * de banco de dados (ex: Prisma, Knex, TypeORM) sem alterar services/controllers.
 */

const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');

const clientesRepository = {
  findAll: () => [...db.clientes],

  findById: (id) => db.clientes.find((c) => c.id === id) || null,

  findByNome: (nome) =>
    db.clientes.filter((c) =>
      c.nome.toLowerCase().includes(nome.toLowerCase())
    ),

  create: (data) => {
    const novo = { id: uuidv4(), ...data };
    db.clientes.push(novo);
    return novo;
  },

  update: (id, data) => {
    const idx = db.clientes.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    db.clientes[idx] = { ...db.clientes[idx], ...data };
    return db.clientes[idx];
  },

  delete: (id) => {
    const idx = db.clientes.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    db.clientes.splice(idx, 1);
    return true;
  },
};

module.exports = clientesRepository;
