//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

var bodyParser = require('body-parser');


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//var dispositivos = require('./datos.js');
//console.log(dispositivos[2].description);

/*// Funcion que me permite buscar un valor de la clave "id" en el objeto dispositivos
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


/* utils.query('Update Devices set type=? where id=?',[2,2],function(err,respuesta){
    if (err){
        return;
    }
    console.log(respuesta);
}); */



//=======[ Main module code ]==================================================

// Método GET que devuelve la lista de dispositivos
app.get('/devices/', function(req, res) {
    console.log("Se recibe solicitud de dispositivos");

    // query: sentencia SQL - callback
    utils.query('SELECT * FROM Devices', function(err,respuesta){
        if (err){
            res.send(err).status(400);
            return;
        }
        setTimeout(function(){
            res.send(JSON.stringify(respuesta)).status(200);
        }, 1000);

    });
    

// Método GET que recibe por parámetro un id y devuelve un string con el dispositivo que tenga ese id
app.get('/devices/:Id_input', function (req, res, next) { 
    let id = parseInt(req.params.Id_input);
    //console.log(id);
    //console.log(typeof id);
    // query: sentencia SQL - [parámetros] - callback
    utils.query('SELECT * FROM Devices where id=?',[id],function(err,respuesta){
        if (err){
            res.send(err).status(400);
            return;
        }
        console.log(respuesta);
        res.send(JSON.stringify(respuesta)).status(200);
    });
});

    /*let dispo = getVal(id);
    //console.log(dispo);
    if(dispo!=undefined){
        res.send(JSON.stringify(dispo)).status(200);
    }else{ 
        res.send("Id de dispositivo erróneo").status(400)}
    }); */

//Método POST que espera recibir {id:1,state:1/0}, impacta el cambio y devuelve respuesta
app.post("/actualizar",function(req,res){
    console.log("Se recibe solicitud POST");
    if(req.body.id==undefined || req.body.state==undefined){
        res.send("ERROR");
    } else {
    
        //console.log(Object.keys(req.body).length); //para validar cantidad de keys que vienen en el body.
        utils.query('Update Devices set state=? where id=?',[req.body.state, req.body.id],function(err,respuesta){
            if (err){
                res.send(err).status(400);
                return;
            }
            //console.log(respuesta);
            res.send("actualizo").status(200);
        });
    };
});


/*//Método POST que espera recibir {id:1,state:1/0}, impacta el cambio y devuelve respuesta
app.post("/actualizar",function(req,res){
    console.log("Se recibe solicitud POST");
    //console.log(Object.keys(req.body).length); //para validar cantidad de keys que vienen en el body.
        
    if(req.body.id!=undefined&& req.body.state!=undefined){
        console.log(req.body.state);
        let id = parseInt(req.body.id);
        let dispo = getVal(id);
        dispo.state = req.body.state;
        
        res.send("actualizo");
    }else{
        res.send("ERROR");
    }

   
});
*/

});
app.listen(PORT, function () {
    console.log('API levantada en http://localhost:', PORT);
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
