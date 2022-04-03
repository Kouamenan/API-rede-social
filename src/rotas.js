const express = require('express');
const login  = require('./controladores/login');
const postagens = require('./controladores/postagens');
const usuarios = require('./controladores/usuarios');
const verificarLogin = require('./filtros/verificaLogin')

const rotas = express();

// cadastro de usuario
rotas.post('/usuarios' , usuarios.cadastrarUsuario)

//login
rotas.post('/login', login.login)

// feed principal
rotas.get ('/', postagens.listarPostagem )

// filtro
rotas.use(verificarLogin);

// postagem
rotas.get ('/postagens', postagens.postagensUsuario )
rotas.post ('/postagens', postagens.cadastrarPostagem )
rotas.patch ('/postagens/:id', postagens.atualizarPostagem )
rotas.delete ('/postagens/:id', postagens.excluirPostagem )

module.exports = rotas;