const { Router } = require('express');
const clientesController = require('../controllers/clientesController');

const router = Router();

router.get('/', clientesController.listar);
router.get('/:id', clientesController.buscarPorId);
router.post('/', clientesController.criar);
router.put('/:id', clientesController.atualizar);
router.delete('/:id', clientesController.excluir);

module.exports = router;
