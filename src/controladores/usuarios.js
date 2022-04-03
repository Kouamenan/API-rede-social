const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha} = req.body;

    if(!nome) {
        return res.status(404).json('O campo nome é obrigatorio.')
    }

    if(!email) {
        return res.status(404).json('O campo email é obrigatorio.')
    }

    if(!senha) {
        return res.status(404).json('O campo senha é obrigatorio.')
    }

    try {
        const queryConsultaDeEmail = 'select * from usuarios where email = $1 '
        const { rowCount : quantidadesUsuarios} = await conexao.query(queryConsultaDeEmail, [email]);

        if(quantidadesUsuarios > 0) {
            return res.status(400).json('O email informado já existe.')
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = `insert into usuarios
        (nome, email, senha)
        values
        ($1, $2, $3)
        `;
        const usuarioCadastrado = await conexao.query(query, [nome, email, senhaCriptografada]);

        if(usuarioCadastrado.rowCount === 0){
            return res.status(400).json('O Usuario não foi cadastrado.')
        }

        return res.status(200).json('Usuario cadastrado com sucesso!')
    } catch (error) {
        return res.status(error.message);
    }
}

module.exports ={
    cadastrarUsuario
}