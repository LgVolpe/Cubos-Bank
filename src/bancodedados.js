const bancodedados = {
    banco: {
        nome: 'Cubos Bank',
        numero: '123',
        agencia: '0001',
        senha: 'Cubos123Bank'
    },
    contas: [
    ],
    saques: [],
    depositos: [],
    transferencias: [],
    proximoNumeroDeConta: 1,
};

function gerarNumeroConta() {
    const numero = bancodedados.proximoNumeroDeConta.toString();
    bancodedados.proximoNumeroDeConta++;
    return numero;
}

module.exports = {
    bancodedados,
    gerarNumeroConta
};