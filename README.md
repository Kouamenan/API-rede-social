# Construção de uma API de rede social

Nesse projeto fiz a construção de uma API de rede social conectando ela a um banco de dados (PostgreSQL).

Essa API vai possibilitar que o usuario se conecte, faça um login e a partir dai permitir que ele faça postagens numa determinada rede social.

Tambem foi criada uma middleware como filtro de autenticação para bloquear algumas rotas para que elas possam ser utilizadas apenas por usuarios autenticados recebendo o token no header da API.
