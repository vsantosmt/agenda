const { Router } = require('express');
const agendamentosController = require('../controllers/agendamentosController');

const router = Router();

router.get('/', agendamentosController.listar);
router.get('/:id', agendamentosController.buscarPorId);
router.post('/', agendamentosController.criar);
router.put('/:id', agendamentosController.atualizar);
router.delete('/:id', agendamentosController.excluir);

module.exports = router;
