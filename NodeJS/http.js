// iniciando fecth para requisição HTTP
var dado;
var user;

// importando o modulo mysql
const databs = require('mysql2')

// configurando a conexão com o banco de dados
const connection = databs.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'vynidb'
})

// iniciando a conexão
connection.connect();

// fazendo a requisição HTTP e fazendo a query do dado para o banco de dados 
const espFetch = () => {
    const url = 'http://192.168.1.106/dado'                 // url da requisição
    fetch(url)
        .then(response => response.json())
        .then(resposta => {
            dado = resposta.dado;                           // recuperando o dado
            user = resposta.user;                           // recuperando o user
            console.log(dado)
            console.log(user)

            //inserindo os dados no banco de dados
            const sql = 'INSERT INTO userr (usuario, dado) VALUES (?, ?)';
            const values = [user, dado];
            connection.query(sql, values, (err, result) => {
                if(err) throw err;
                console.log('usuário e dado inserido com sucesso!');
                connection.end();                           // encerando a conexão com o banco de dados
            });})
        .catch(error => console.error('Error:', error));    // printando caso dê algum erro
}

// chamando a função e tratando o resultado
espFetch()