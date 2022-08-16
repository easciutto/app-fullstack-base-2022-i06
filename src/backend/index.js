//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');
//datos mios a depurar
var bodyParser = require('body-parser');


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

/*let persona = require('./datos1.js');
console.log(persona.nombre + ' ' + persona.apellido); */

var dispositivos = require('./datos.js');

//console.log(dispositivos[2].description);

// Funcion que me permite buscar un valor de la clave "id" en el objeto dispositivos
function getVal(id) {
    let obj = dispositivos.filter(item => item.id === id);
    return obj[0];
    };

/*let valor = getVal(1);
console.log(valor);
console.log(typeof valor); */



// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================
app.post("/actualizar",function(req,res){
    console.log("Llegue al servidor");
    //console.log(Object.keys(req.body).length); //para validar cantidad de keys que vienen en el body.
        
    if(req.body.id!=undefined&& req.body.state!=undefined){
        console.log(req.body.state);
        let id = parseInt(req.body.id);
        let dispo = getVal(id);
        dispo.state = req.body.state;
        /*for (let i in dispositivos){
            if (dispositivos[i].id === id) {
                console.log("iteracion "+ i);
                dispositivos[i].state = dispo.state;
                
            }
        }*/
        res.send("actualizo");
    }else{
        res.send("ERROR");
    }

   
});
app.get('/devices/', function(req, res) {
   
    console.log("Alguien pidio devices!");
    setTimeout(function(){
        res.send(JSON.stringify(dispositivos)).status(200);
    }, 2000);

// Ejercicio 5: Crear un método GET que reciba por parámetro un id y devuelva un JSON
// con el dispositivo que tenga ese id
app.get('/devices/:Id_input', function (req, res, next) { 
    let id = parseInt(req.params.Id_input);
    console.log(id);
    console.log(typeof id);
    let dispo = getVal(id);
    console.log(dispo);
    //console.log(typeof valor);
    res.send(JSON.stringify(dispo)).status(200);
    }); 


});
app.listen(PORT, function () {
    console.log('API levantada en http://localhost:', PORT);
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
