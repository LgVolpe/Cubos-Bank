const { Router } = require('express');
const router = Router();
const middleware = require('../middlewares/middlewares')

const controladorContas = require('../controllers/accountsControllers')
const controladorTransacoes = require('../controllers/transactionsControllers');

router.get('/contas', middleware, controladorContas.listarContas);
router.post('/contas', controladorContas.criarConta);
router.put('/contas/:numeroConta/usuario', controladorContas.atualizarConta);
router.delete('/contas/:numeroConta', controladorContas.excluirConta);
router.post('/transacoes/depositar', controladorTransacoes.depositar);
router.post('/transacoes/sacar', controladorTransacoes.sacar);
router.post('/transacoes/transferir/', controladorTransacoes.transferir);
router.get('/contas/saldo', controladorContas.obterSaldo);
router.get('/contas/extrato', controladorContas.obterExtrato);

module.exports = router;
