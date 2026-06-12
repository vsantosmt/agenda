const faturamentoService = require('../services/faturamentoService');

const faturamentoController = {
  getResumo: (req, res, next) => {
    try {
      res.json(faturamentoService.getResumo());
    } catch (err) {
      next(err);
    }
  },

  getDiario: (req, res, next) => {
    try {
      const { dataInicio, dataFim } = req.query;
      res.json(faturamentoService.getDiario({ dataInicio, dataFim }));
    } catch (err) {
      next(err);
    }
  },

  getMensal: (req, res, next) => {
    try {
      const { ano } = req.query;
      res.json(faturamentoService.getMensal({ ano }));
    } catch (err) {
      next(err);
    }
  },

  getDetalhado: (req, res, next) => {
    try {
      const { dataInicio, dataFim } = req.query;
      res.json(faturamentoService.getDetalhado({ dataInicio, dataFim }));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = faturamentoController;
