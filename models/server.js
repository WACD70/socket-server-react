const express = require('express');
const http = require('http')
const socketio = require('socket.io')
const path = require('path');

const cors = require('cors')

const Sockets = require('./sockets');
class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT

        //http server
        this.server = http.createServer(this.app)

        //configuracion de sockets
        this.io = socketio(this.server, {cors: {
            origin: "*",
            methods: ["GET", "POST"]
          }});
        
    }

    middlewares() {
        //desplegar el directorio publico
        this.app.use(express.static(path.resolve(__dirname,'../public')))

        
        //cors
        this.app.use(cors());

        
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            next();
          });
    
    }

    configurarSockets(){
        new Sockets(this.io);
    }

    execute() {

        //inicializar middlewares
        this.middlewares();

        //configuracion scokets
        this.configurarSockets();

        //inicializar el server
        this.server.listen(this.port, () => {
            console.log("Server corriendo en puerto: ", this.port);
        });
    }
}

module.exports = Server