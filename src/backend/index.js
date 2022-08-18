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

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//==========[comandos para hacer debugs y pruebas]===============================

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

/*//Método POST utilizando archivo datos.js en vez de DB
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

/*utils.query('INSERT INTO Devices (name, description, state, type) VALUES ("test2", "test", 1, 1)',function(err,respuesta){
    if (err){
        return;
    }
    console.log(respuesta);
});*/

/*utils.query('Select * from Devices',function(err,respuesta){
    if (err){
        return;
    }
    console.log(respuesta);
});*/

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
        console.log(respuesta);
    });
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
            console.log(respuesta);
        });
    };
});

//Método POST que procesa una solicitud de MODIFICACION de parámetros
app.post("/modificar",function(req,res){
    console.log("Se recibe solicitud POST para MODIFICAR infomación de dispositivos");
    if(req.body.id==undefined || req.body.state==undefined || req.body.name==undefined || req.body.description==undefined){
        res.send("ERROR");
    } else {
    
        //console.log(Object.keys(req.body).length); //para validar cantidad de keys que vienen en el body.
        utils.query('Update Devices set name=?, description=?, state=?, type=? where id=?',[req.body.name, req.body.description, req.body.state, req.body.type, req.body.id],function(err,respuesta){
            if (err){
                res.send(err).status(400);
                return;
            }
            //console.log(respuesta);

            res.send("actualizo").status(200);
            console.log(respuesta);
        });
    };
});

//Método POST que procesa una solicitud de ALTA de un nuevo dispositivo
app.post("/crear",function(req,res){
    console.log("Se recibe solicitud POST para ALTA de dispositivo");
    /*if(req.body.id==undefined || req.body.state==undefined || req.body.name==undefined || req.body.description==undefined){
        res.send("ERROR");
    } else{*/
        console.log(typeof(req.body.name));
        
        //console.log(Object.keys(req.body).length); //para validar cantidad de keys que vienen en el body.
        utils.query('INSERT INTO Devices (name, description, state, type) VALUES (?,?,?,?)',[req.body.name, req.body.description, req.body.state, req.body.type],function(err,respuesta){
            if (err){
                console.log(err);
                res.send(err).status(400);
                return;
            }
            console.log(respuesta);

            res.send("actualizo").status(200);
        });
    //};
});

//Método POST que procesa una solicitud de BORRAR un dispositivo
app.post("/borrar",function(req,res){
    console.log("Se recibe solicitud POST para BORRAR un dispositivo");
    if(req.body.id==undefined){
        res.send("ERROR");
    } else {
    
        //console.log(Object.keys(req.body).length); //para validar cantidad de keys que vienen en el body.
        utils.query('Delete from Devices where id=?',[req.body.id],function(err,respuesta){
            if (err){
                console.log(err);
                res.send(err).status(400);
                return;
            }
            console.log(respuesta);

            res.send("actualizo").status(200);
        });
    };
});


app.listen(PORT, function () {
    console.log('API levantada en http://localhost:', PORT);
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
