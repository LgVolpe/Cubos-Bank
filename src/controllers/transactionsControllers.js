const { bancodedados } = require('../bancodedados');
const { verificaContaExistente } = require('../validations/verificadores')

const depositar = (req, res) => {
    try {
        const { numero_conta, valor } = req.body;
        if (!numero_conta || valor === undefined || valor <= 0) {
            return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios e devem ser maiores que zero." });
        }
        const conta = verificaContaExistente(numero_conta);
        if (!conta) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada." });
        }
        conta.saldo += valor;
        const transacao = {
            data: new Date().toISOString(),
            numero_conta,
            valor,
        };
        bancodedados.depositos.push(transacao);
        return res.status(204).send();
    } catch (error) {
        console.error(`Erro ao realizar depósito. Erro: ${error}`);
        return res.status(500).json({ mensagem: "Internal Server Error" });
    }
};

const sacar = (req, res) => {
    try {
        const { numero_conta, valor, senha } = req.body;
        if (!numero_conta || !valor || !senha) {
            return res.status(400).json({ mensagem: "Número da conta, valor do saque e senha são obrigatórios!" });
        }
        const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);
        if (!conta) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
        }
        if (senha !== conta.usuario.senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" });
        }
        if (valor <= 0 || valor > conta.saldo) {
            return res.status(400).json({ mensagem: "Valor de saque inválido ou saldo insuficiente!" });
        }
        conta.saldo -= valor;
        const transacao = {
            data: new Date().toISOString(),
            numero_conta,
            valor,
        };
        bancodedados.saques.push(transacao);
        return res.status(204).send();
    } catch (error) {
        console.error(`Erro ao realizar saque. Erro: ${error}`);
        return res.status(500).json({ mensagem: "Internal Server Error" });
    }
};

const transferir = (req, res) => {
    try {
        const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
        if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
            return res.status(400).json({ mensagem: "Número da conta de origem, conta de destino, valor da transferência e senha são obrigatórios!" });
        }
        const contaOrigem = bancodedados.contas.find((conta) => conta.numero === numero_conta_origem);
        if (!contaOrigem) {
            return res.status(404).json({ mensagem: "Conta bancária de origem não encontrada!" });
        }
        const contaDestino = bancodedados.contas.find((conta) => conta.numero === numero_conta_destino);
        if (!contaDestino) {
            return res.status(404).json({ mensagem: "Conta bancária de destino não encontrada!" });
        }
        if (senha !== contaOrigem.usuario.senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" });
        }
        if (valor <= 0 || valor > contaOrigem.saldo || contaOrigem.saldo === 0) {
            return res.status(400).json({ mensagem: "Valor da transferência inválido ou saldo insuficiente!" });
        }
        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;
        const transacao = {
            data: new Date().toISOString(),
            numero_conta_origem,
            numero_conta_destino,
            valor,
        };
        bancodedados.transferencias.push(transacao);
        return res.status(204).send();
    } catch (error) {
        console.error(`Erro ao realizar transferência. Erro: ${error}`);
        return res.status(500).json({ mensagem: "Internal Server Error" });
    }
};

module.exports = {
    depositar,
    sacar,
    transferir
};