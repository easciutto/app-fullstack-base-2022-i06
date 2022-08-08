/*function hacerTarea(nombre, callback) {
  console.log(`Comenzando la tarea ${nombre}.`);
    callback();
    }
    function tareaTerminada(){
    console.log('Fin de la tarea');
    }
    hacerTarea('Programación', tareaTerminada);*/

var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send('Hola Mundo');
})
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("API levantada en http://%s:%s", host, port)
})