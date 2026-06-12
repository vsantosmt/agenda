const clientesService = require('../services/clientesService');

const clientesController = {
  listar: (req, res, next) => {
    try {
      const { nome } = req.query;
      const clientes = clientesService.listar(nome);
      res.json(clientes);
    } catch (err) {
      next(err);
    }
  },

  buscarPorId: (req, res, next) => {
    try {
      const cliente = clientesService.buscarPorId(req.params.id);
      res.json(cliente);
    } catch (err) {
      if (err.message === 'Cliente não encontrado') res.status(404);
      next(err);
    }
  },

  criar: (req, res, next) => {
    try {
      const cliente = clientesService.criar(req.body);
      res.status(201).json(cliente);
    } catch (err) {
      res.status(400);
      next(err);
    }
  },

  atualizar: (req, res, next) => {
    try {
      const cliente = clientesService.atualizar(req.params.id, req.body);
      res.json(cliente);
    } catch (err) {
      if (err.message === 'Cliente não encontrado') res.status(404);
      else res.status(400);
      next(err);
    }
  },

  excluir: (req, res, next) => {
    try {
      clientesService.excluir(req.params.id);
      res.status(204).end();
    } catch (err) {
      if (err.message === 'Cliente não encontrado') res.status(404);
      next(err);
    }
  },
};

module.exports = clientesController;
