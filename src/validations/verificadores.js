const { bancodedados } = require('../bancodedados')

const verificaPropriedadesObrigatorias = (req) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return false;
    }
    return { nome, cpf, data_nascimento, telefone, email, senha };
};

const tamanhoCpf = (cpf) => {
    return cpf.length === 11;
}

const cpfOuEmail = (usuarioInserido) => {
    const { cpf, email } = usuarioInserido
    const cpfRepetido = bancodedados.contas.some((conta) => conta.usuario.cpf === cpf)
    const emailRepetido = bancodedados.contas.some((conta) => conta.usuario.email === email)
    if (cpfRepetido) {
        return { mensagem: "O CPF informado já está cadastrado!" }
    }
    if (emailRepetido)
        return { mensagem: "O email informado já está cadastrado!" }
    return null
}

const verificaContaExistente = (numeroConta) => {
    const conta = bancodedados.contas.find((conta) => conta.numero === numeroConta);
    return conta;
};

const verificaSenha = (conta, senhaInformada) => {
    return conta.usuario.senha === senhaInformada;
};

module.exports = {
    verificaPropriedadesObrigatorias,
    tamanhoCpf,
    cpfOuEmail,
    verificaContaExistente,
    verificaSenha
}
