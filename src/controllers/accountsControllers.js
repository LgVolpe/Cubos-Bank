const { bancodedados, gerarNumeroConta } = require('../bancodedados');
const { verificaPropriedadesObrigatorias, tamanhoCpf, cpfOuEmail, verificaContaExistente, verificaSenha } = require('../validations/verificadores')

const listarContas = (req, res) => {
    const senhaBanco = req.query.senha_banco;
    if (senhaBanco !== bancodedados.banco.senha) {
        return res.status(401).json({ mensagem: 'A senha do banco informada é inválida!' });
    }
    const contas = bancodedados.contas;
    res.status(200).json(bancodedados.contas);
};

const criarConta = (req, res) => {
    try {
        const usuarioInserido = verificaPropriedadesObrigatorias(req);
        if (!usuarioInserido) {
            return res.status(400).json({ mensagem: "Insira todas as propriedades obrigatórias!" });
        }
        if (!tamanhoCpf(usuarioInserido.cpf)) {
            return res.status(400).json({ mensagem: "Tamanho do CPF inválido" });
        }
        const repetido = cpfOuEmail(usuarioInserido);
        if (repetido) {
            return res.status(400).json(repetido);
        }
        const novoNumeroConta = gerarNumeroConta(bancodedados.contas);
        const novaConta = {
            numero: novoNumeroConta,
            saldo: 0,
            usuario: usuarioInserido,
        };
        bancodedados.contas.push(novaConta);
        return res.status(201).json();
    } catch (error) {
        console.log(`Erro ao inserir conta. Erro: ${error}`);
        return res.status(500).json({ mensagem: "Internal Server Error" });
    }
};

const atualizarConta = (req, res) => {
    try {
        const { numeroConta } = req.params;
        const contaAtualizar = bancodedados.contas.find((conta) => conta.numero === numeroConta);
        if (!contaAtualizar) {
            return res.status(404).json({ mensagem: "Conta não encontrada" });
        }
        const { cpf, email } = req.body;
        const cpfExistente = bancodedados.contas.some((conta) => conta.usuario.cpf === cpf);

        if (cpfExistente) {
            return res.status(400).json({ mensagem: "O CPF informado já está cadastrado em outra conta." });
        }
        const emailExistente = bancodedados.contas.some((conta) => conta.usuario.email === email);
        if (emailExistente) {
            return res.status(400).json({ mensagem: "O e-mail informado já está cadastrado em outra conta." });
        }
        return res.status(200).json({ mensagem: "Conta atualizada com sucesso" });
    } catch (error) {
        console.error(`Erro ao atualizar conta. Erro: ${error}`);
        return res.status(500).json({ mensagem: "Internal Server Error" });
    }
};

const excluirConta = (req, res) => {
    try {
        const { numeroConta } = req.params;
        const contaASerExcluida = bancodedados.contas.find(conta => conta.numero === numeroConta);
        if (!contaASerExcluida) {
            return res.status(400).json({ mensagem: 'Conta não encontrada' });
        }
        if (contaASerExcluida.saldo !== 0) {
            return res.status(400).json({ mensagem: 'O saldo da conta não é zero, não é possível excluir' });
        }
        const indiceConta = bancodedados.contas.indexOf(contaASerExcluida);
        bancodedados.contas.splice(indiceConta, 1);
        return res.status(204).json();
    } catch (error) {
        console.error(`Erro ao excluir conta. Erro: ${error}`);
        return res.status(500).json({ mensagem: 'Internal Server Error' });
    }
};

const obterSaldo = (req, res) => {
    try {
        const { numero_conta, senha } = req.query;
        if (!numero_conta || !senha) {
            return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios!' });
        }
        const conta = verificaContaExistente(numero_conta);
        if (!conta) {
            return res.status(404).json({ mensagem: 'Conta não encontrada' });
        }
        if (!verificaSenha(conta, senha)) {
            return res.status(401).json({ mensagem: 'Senha inválida' });
        }
        return res.status(200).json({ saldo: conta.saldo });
    } catch (error) {
        console.error(`Erro ao obter o saldo da conta. Erro: ${error}`);
        return res.status(500).json({ mensagem: 'Internal Server Error' });
    }
};

const obterExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios" });
    }
    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }
    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha inválida" });
    }
    const transferenciasEnviadas = bancodedados.transferencias.filter((transacao) => transacao.numero_conta_origem === numero_conta);
    const transferenciasRecebidas = bancodedados.transferencias.filter((transacao) => transacao.numero_conta_destino === numero_conta);

    const extrato = {
        transferenciasEnviadas,
        transferenciasRecebidas,
        depositos: bancodedados.depositos.filter((transacao) => transacao.numero_conta === numero_conta),
        saques: bancodedados.saques.filter((transacao) => transacao.numero_conta === numero_conta),
    };
    return res.status(200).json(extrato);
};

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    obterSaldo,
    obterExtrato
};