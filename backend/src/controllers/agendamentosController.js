const agendamentosService = require('../services/agendamentosService');

const agendamentosController = {
  listar: (req, res, next) => {
    try {
      const { dataInicio, dataFim, clienteId, status } = req.query;
      const agendamentos = agendamentosService.listar({ dataInicio, dataFim, clienteId, status });
      res.json(agendamentos);
    } catch (err) {
      next(err);
    }
  },

  buscarPorId: (req, res, next) => {
    try {
      res.json(agendamentosService.buscarPorId(req.params.id));
    } catch (err) {
      if (err.message === 'Agendamento não encontrado') res.status(404);
      next(err);
    }
  },

  criar: (req, res, next) => {
    try {
      const agendamento = agendamentosService.criar(req.body);
      res.status(201).json(agendamento);
    } catch (err) {
      res.status(400);
      next(err);
    }
  },

  atualizar: (req, res, next) => {
    try {
      const agendamento = agendamentosService.atualizar(req.params.id, req.body);
      res.json(agendamento);
    } catch (err) {
      if (err.message === 'Agendamento não encontrado') res.status(404);
      else res.status(400);
      next(err);
    }
  },

  excluir: (req, res, next) => {
    try {
      agendamentosService.excluir(req.params.id);
      res.status(204).end();
    } catch (err) {
      if (err.message === 'Agendamento não encontrado') res.status(404);
      next(err);
    }
  },
};

module.exports = agendamentosController;
