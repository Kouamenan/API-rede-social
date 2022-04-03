const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo')

const listarPostagem = async (req, res) => {
    try {
        const postagens = await conexao.query('select * from postagens')

        return res.status(200).json(postagens.rows)
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const postagensUsuario = async (req, res) =>{
    const {usuario} = req;
    
    try {
        const postagens = await conexao.query('select * from postagens where usuario_id = $1', [usuario.id])

        return res.status(200).json(postagens.rows)
    } catch (error) {
        return res.status(400).json(error.message)
    }

}

const cadastrarPostagem = async (req, res) => {
    const {texto} =  req.body;
    const {usuario} = req;

    if(!texto){
        return res.status(404).json('Adicione um texto na postgem.')
    }

    try {
       
        const queryPostagem = 'insert into postagens (usuario_id, texto) values ($1, $2)' ;
        const postagem = await conexao.query(queryPostagem, [usuario.id, texto])

        if (postagem.rowCount === 0){
            return res.status(404).json('A postagem não foi cadastrada.')
        }

        return res.status(200).json('Postagem cadastrada com sucesso!')
    } catch (error) {
        return res.status(400).json(error.message)
    }


}

const atualizarPostagem =async (req, res) => {
    const {texto} =  req.body;
    const {usuario} = req;
    const {id: idPostagem} = req.params;

    if(!texto){
        return res.status(404).json('Adicione um texto na postgem.')
    }


    try {
        const queryPostagemExistente = 'select * from postagens where id = $1 and usuario_id = $2'
        const postagemExistente = await conexao.query(queryPostagemExistente, [idPostagem, usuario.id])
        
        if(postagemExistente.rowCount === 0){
            return res.status(404).json('A postagem não foi encontrado.')
        }

        
        const queryAtualizarPostagem = 'update postagens set texto = $1 where id = $2 and usuario_id = $3' ;
        const postagem = await conexao.query(queryAtualizarPostagem, [texto, idPostagem,usuario.id])

        if (postagem.rowCount === 0){
            return res.status(404).json('A postagem não foi atualizada.')
        }

        return res.status(200).json('Postagem atualizada com sucesso!')
    } catch (error) {
        return res.status(400).json(error.message)
    }

}

const excluirPostagem = async (req, res) => {
    const {usuario} = req;
    const {id} = req.params;

    try {
        const queryPostagemExistente = 'select * from postagens where id = $1 and usuario_id = $2'
        const postagemExistente = await conexao.query(queryPostagemExistente, [id, usuario.id])
        
        if(postagemExistente.rowCount === 0){
            return res.status(404).json('A postagem não foi encontrado.')
        }

        const {rowCount} = await conexao.query('delete from postagens where id = $1', [id]);

        if(rowCount === 0) {
            return res.status(400).json('Não foi possivel excluir a postagem.')
        }
        
        return res.status(200).json('Postagem excluida com sucesso!')
    } catch (error) {
        return res.status(400).json(error.message)
    }

}

module.exports={
    cadastrarPostagem,
    atualizarPostagem,
    excluirPostagem,
    listarPostagem,
    postagensUsuario
}