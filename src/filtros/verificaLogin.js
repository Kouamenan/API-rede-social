const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const verificaLogin = async (req, res, next) => {
    const { authorization} =  req.headers;

    if(!authorization){
        return res.status(404).json('Token não informado');
    }

    try {
        const token = authorization.replace('Bearer', '').trim();
         // No token temos apenan o id do usuario. isso foi determinado na pasta login (const token = jwt.sign({id}) )
         const { id } = jwt.verify(token, segredo);
        
         const query = 'select * from usuarios where id = $1'
         const { rows, rowCount} = await conexao.query(query, [id])
 
         if(rowCount === 0){
             return res.status(404).json('Usuário nao encontrado.')
         }
 
         const {senha, ...usuario} = rows[0];

         req.usuario = usuario;

         next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verificaLogin;