const atendimentosService = require('../services/atendimentosService');

const atendimentosController = {
  listar: (req, res, next) => {
    try {
      res.json(atendimentosService.listar());
    } catch (err) {
      next(err);
    }
  },

  buscarPorId: (req, res, next) => {
    try {
      res.json(atendimentosService.buscarPorId(req.params.id));
    } catch (err) {
      if (err.message === 'Atendimento não encontrado') res.status(404);
      next(err);
    }
  },

  buscarPorAgendamento: (req, res, next) => {
    try {
      const atendimento = atendimentosService.buscarPorAgendamento(req.params.agendamentoId);
      if (!atendimento) return res.status(404).json({ message: 'Atendimento não encontrado' });
      res.json(atendimento);
    } catch (err) {
      next(err);
    }
  },

  criar: (req, res, next) => {
    try {
      const atendimento = atendimentosService.criar(req.body);
      res.status(201).json(atendimento);
    } catch (err) {
      res.status(400);
      next(err);
    }
  },

  atualizar: (req, res, next) => {
    try {
      const atendimento = atendimentosService.atualizar(req.params.id, req.body);
      res.json(atendimento);
    } catch (err) {
      if (err.message === 'Atendimento não encontrado') res.status(404);
      else res.status(400);
      next(err);
    }
  },

  excluir: (req, res, next) => {
    try {
      atendimentosService.excluir(req.params.id);
      res.status(204).end();
    } catch (err) {
      if (err.message === 'Atendimento não encontrado') res.status(404);
      next(err);
    }
  },
};

module.exports = atendimentosController;
