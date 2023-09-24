// iniciando fecth para requisição MQTT
//var dado;
var user;

// importando o modulo mysql
const databs = require('mysql2');
const mqtt = require('mqtt');

// configurando a conexão com o BROKER
const brokerUrl = '192.168.1.112';

// configurando a conexão com o banco de dados
const connection = databs.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'vynidb'
})

// iniciando a conexão
connection.connect();
const protocol = 'mqtt'
const host = '192.168.1.112'
const port = '1883'
const clientId = `vini_Node`
const connectUrl = `${protocol}://${host}:${port}`

// fazendo a requisição MQTT e fazendo a query do dado para o banco de dados
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'vini2131',
    password: 'vini2131',
    reconnectPeriod: 1000,
})

function mqttzinho(){
    client.on('connect', () => {
        console.log(client.connected);
        console.log(client.pingResp);
        console.log('Conectado ao broker MQTT');
        client.subscribe('test', (err) => {
            if(!err){
                //client.publish('test', 'me');
            }
        });
    });
    client.on('message', (topic, message) => {
        console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
        if(message == "beleza ne"){
            user = "vynizinho";
            const sql = 'INSERT INTO userr (usuario, mensagem) VALUES (?, ?)'
            const values = [user, message];
            console.log("Beleza ne o vyni");
            connection.query(sql, values, (err, result) => {
                if(err) throw err;
                console.log('usuário e mensagem inserida com sucesso!');
                connection.end();    // encerando a conexão com o banco de dados
            });
        }
    });
    client.on('error', (err) => {
        console.error(`Erro: ${err}`);
        // Reconectar após um tempo
        setTimeout(mqttzinho, 5000); // Espera 5 segundos antes de tentar se reconectar
    });
    
    client.on('close', () => {
        console.log('Conexão fechada');
        // Reconectar após um tempo
        setTimeout(mqttzinho, 5000); // Espera 5 segundos antes de tentar se reconectar
    });
}
mqttzinho()