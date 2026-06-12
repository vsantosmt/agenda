const servicosService = require('../services/servicosService');

const servicosController = {
  listar: (req, res, next) => {
    try {
      res.json(servicosService.listar());
    } catch (err) {
      next(err);
    }
  },

  buscarPorId: (req, res, next) => {
    try {
      res.json(servicosService.buscarPorId(req.params.id));
    } catch (err) {
      if (err.message === 'Serviço não encontrado') res.status(404);
      next(err);
    }
  },

  criar: (req, res, next) => {
    try {
      const servico = servicosService.criar(req.body);
      res.status(201).json(servico);
    } catch (err) {
      res.status(400);
      next(err);
    }
  },

  atualizar: (req, res, next) => {
    try {
      const servico = servicosService.atualizar(req.params.id, req.body);
      res.json(servico);
    } catch (err) {
      if (err.message === 'Serviço não encontrado') res.status(404);
      else res.status(400);
      next(err);
    }
  },

  excluir: (req, res, next) => {
    try {
      servicosService.excluir(req.params.id);
      res.status(204).end();
    } catch (err) {
      if (err.message === 'Serviço não encontrado') res.status(404);
      next(err);
    }
  },
};

module.exports = servicosController;
