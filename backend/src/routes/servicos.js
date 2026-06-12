const { Router } = require('express');
const servicosController = require('../controllers/servicosController');

const router = Router();

router.get('/', servicosController.listar);
router.get('/:id', servicosController.buscarPorId);
router.post('/', servicosController.criar);
router.put('/:id', servicosController.atualizar);
router.delete('/:id', servicosController.excluir);

module.exports = router;
