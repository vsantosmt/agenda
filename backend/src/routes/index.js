const { Router } = require('express');
const clientesRoutes = require('./clientes');
const servicosRoutes = require('./servicos');
const agendamentosRoutes = require('./agendamentos');
const atendimentosRoutes = require('./atendimentos');
const faturamentoRoutes = require('./faturamento');

const router = Router();

router.use('/clientes', clientesRoutes);
router.use('/servicos', servicosRoutes);
router.use('/agendamentos', agendamentosRoutes);
router.use('/atendimentos', atendimentosRoutes);
router.use('/faturamento', faturamentoRoutes);

module.exports = router;
