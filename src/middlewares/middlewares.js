const { bancodedados } = require('../bancodedados')
const senhaCubos = bancodedados.banco.senha

const verificarSenha = (req, res, next) => {
    try {
        const { senha } = req.query;

        if (senha) {
            if (senha === senhaCubos) {
                next();
            } else {
                res.status(401).json("Entrada não autorizada: senha incorreta");
            }
        } else {
            next();
        }
    } catch (error) {
        console.error(`Erro na passagem do middleware. Erro: ${error}`);
    }
};

module.exports = verificarSenha;