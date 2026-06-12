const { Router } = require('express');
const faturamentoController = require('../controllers/faturamentoController');

const router = Router();

router.get('/resumo', faturamentoController.getResumo);
router.get('/diario', faturamentoController.getDiario);
router.get('/mensal', faturamentoController.getMensal);
router.get('/detalhado', faturamentoController.getDetalhado);

module.exports = router;
