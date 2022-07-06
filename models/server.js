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
        this.io = socketio(this.server, {
            cors: {
            origin: "*",
           
          }});
        
    }

    middlewares() {
        //desplegar el directorio publico
        this.app.use(express.static(path.resolve(__dirname,'../public')))

        
        //cors
        this.app.use(cors());

    
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