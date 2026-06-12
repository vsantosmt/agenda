const { Router } = require('express');
const atendimentosController = require('../controllers/atendimentosController');

const router = Router();

router.get('/', atendimentosController.listar);
router.get('/agendamento/:agendamentoId', atendimentosController.buscarPorAgendamento);
router.get('/:id', atendimentosController.buscarPorId);
router.post('/', atendimentosController.criar);
router.put('/:id', atendimentosController.atualizar);
router.delete('/:id', atendimentosController.excluir);

module.exports = router;
