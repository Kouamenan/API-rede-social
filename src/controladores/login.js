const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo')

const login = async (req, res) => {
    const {email, senha} = req.body;

    if(!email) {
        return res.status(404).json('O campo email é obrigatorio.')
    }

    if(!senha) {
        return res.status(404).json('O campo senha é obrigatorio.')
    }

    try {

        const queryVerificarEmail = 'select * from usuarios where email = $1'
        const {rows, rowCount} = await conexao.query(queryVerificarEmail, [email])

        if(rowCount === 0) {
            return res.status(404).json('Usuário não encontrado.')
        }

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if(!senhaVerificada) {
            return res.status(400).json('Usuário ou senha invalido.')
        }

        // Agora que sabemos que a senha esta valida vamos gerar o token

        const token = jwt.sign({id: usuario.id}, segredo, { expiresIn: '1d'});
        

        const {senha : senhaUsuario, ...dadosUsuario} = usuario;

        return res.status(200).json({
            usuraio: dadosUsuario,
            token
        })
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports ={
    login
}