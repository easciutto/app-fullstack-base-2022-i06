//=======[ Declaraciones & Implementaciones ]===========================================

declare const M; //Declaro objeto de Materialize para poder inicializar componentes que lo requieren.
//Se debe implementar la interfaz EventListenerObject para que se pueda ejecutar un objeto de la 
//clase Main cuando un elemento de pantalla html produce un evento.

class Main implements EventListenerObject, ResponseLister {
    public listaPersonas: Array<Persona> = new Array();
    public etidadesAcciones: Array<Acciones> = new Array();
    public nombre: string;
    public framework: FrameWork = new FrameWork();
    
    //=======[ Constructor ]================================================================
    
    constructor() {
        
        this.framework.ejecutarRequest("GET", "http://localhost:8000/devices", this)
 
        this.listaPersonas.push(new Usuario("Juan", 12, "jPerez"));
        this.listaPersonas.push(new Administrador("Pedro", 35));
        this.listaPersonas.push(new Persona("S", 12));
        this.etidadesAcciones.push(new Usuario("Juan", 12, "jPerez"));
        this.etidadesAcciones.push(new Administrador("Juan", 12));

    }

    //=======[ Lister GET para traer los dispositivos a la pantalla ]========================

    public handlerResponse(status: number, response: string) {
        if (status == 200) {
            let resputaString: string = response;
            let resputa: Array<Device> = JSON.parse(resputaString); //Asigno a una lista de Device la respuesta convertida a JSON
            alert (resputaString);
            let cajaDiv = document.getElementById("caja"); // recupero el elemento id "caja" de la pagina html y le asigno un objeto cajaDiv
            //Dentro de éste contenedor se incorporará la lista de dispositivos recupeada del servidor backend    
            cajaDiv.setAttribute("class", "talcoa");//seteo a cajaDiv la clase "talcoa"
            cajaDiv.setAttribute("id", "otro"); //cambio el id html de cajaDiv, pasa de "caja" a "otro"
            cajaDiv.setAttribute("miAtt", "123"); //seteo un atributo propio
            let valor= cajaDiv.getAttribute("miAtt");// para recuperar el valor de un atributo de la pantalla html
            let listaDispositivos:string = `<ul class="collection">`
            for (let disp of resputa) {
                listaDispositivos += ` <li class="collection-item avatar">`;
                if (disp.type == 1) {  //se asigna una imagen distinta, según el tipo de dispositivo.
                    listaDispositivos += `<img src="../static/images/lightbulb.png" alt="" class="circle">`;
                } else if (disp.type == 2) {
                    listaDispositivos += `<img src="../static/images/window.png" alt="" class="circle">`;
                }
                let estadoSwitch ="";
                if (disp.state == 1){
                    estadoSwitch = "checked"
                }

                //nombreDisp es un estilo definido por nosotros en stlyes.css que incorporo a la clase para éste tramo del string.
                //Se asigna un id a cada switch asociado al id de cada dispositivo.
                listaDispositivos += `<span class="title nombreDisp">${disp.name}</span> 
                <p>${disp.description}
                </p>
                <a href="#!" class="secondary-content">
                    <div class="switch">
                        <label>
                            Off
                                <input type="checkbox" id="cb_${disp.id}" ${estadoSwitch} >
                                <span class="lever" ></span>
                            On
                        </label>
                    </div>
                </a>
              </li>`
            }
            listaDispositivos += `</ul>`         
        
            //Finalizada la concatenación del string, éste se incrusta entre la etiqueda de apertura y cierre del elemento cajaDiv en la pagina HTML.
            cajaDiv.innerHTML = listaDispositivos;

            for (let disp of resputa) {
                let checkbox = document.getElementById("cb_" + disp.id);
                checkbox.addEventListener("click",this)
            }
        
        } else {
            alert("Algo salio mal")
        }
    }

    //=======[ Lister para recibir respuesta del servidor al POST de actualización de los dispositivos ]=====

    handlerResponseActualizar(status: number, response: string) {
        if (status == 200) {
            alert("Se actuatlizó correctamente")    
        } else {
            alert("Error - no fue posible actualizar")    
        }
    }

    //=======[ Método para gestionar eventos producidos desde la pantalla frontend]===============
    
    //Método requerido por la interfaz EventListenerObject.

    public handleEvent(e:Event): void {
        
    /*Con el parámetro e.target se puede identificar el objeto de pantalla que produjo el evento
      y con e.type se puede identificar el tipo de evento que se produjo. */

        //console.log(e.target);
        //console.log(e.type);
        let objetoEvento = <HTMLInputElement>e.target;
        
        if (e.type == "click" && objetoEvento.id.startsWith("cb_")) {
        //Se discrimina el evento click de cada elemento switch de dispositivo.
            console.log(objetoEvento.id,objetoEvento.checked);
            console.log("Se hizo click para prender o apagar");

            //Construcción del JSON para enviar al servidor.
            let estado :number = 0;
            if (objetoEvento.checked == true){
                estado = 1;
            }
            let datos = { "id": objetoEvento.id.substring(3), "state": estado };
            //con substring(3)corto los 3 primeros caracteres "cb_" de "objetoEvento.id"

            this.framework.ejecutarRequest("POST","http://localhost:8000/actualizar", this,datos);
            
        }else if (e.type == "click") {
      
            
            alert("Hola " +  this.listaPersonas[1].nombre +" ");    
        } else {
            
            let elemento = <HTMLInputElement>this.framework.recuperarElemento("input1");
            if (elemento.value.length>5) {
                
                
                M.toast({html: 'se cargo la info'})
            } else {
                alert("falta cargar el nombre o es menor a 5");    
            }

            
        }
    }
}

//=======[  ]========================

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select'); //se incorpora para utilizar elementos de Materialize que requieren inicialización.
    var instances = M.FormSelect.init(elems,"");     //se incorpora para utilizar elementos de Materialize que requieren inicialización.
    M.updateTextFields();                            //se incorpora para utilizar elementos de Materialize que requieren inicialización.
    var elems1 = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems1, "");
    //Recupero elementos de pantalla.
    let btn = document.getElementById("btnSaludar");
    let btn2 = document.getElementById("btnDoble");
    
    let main: Main = new Main();
    main.nombre = "Eduardo";
    
    let texto = document.getElementById("textarea_1");
    //texto.innerHTML = main.listaPersonas[0].mostrar();
    /*for (let i in main.etidadesAcciones) {
        texto.innerHTML += JSON.stringify(main.etidadesAcciones[i]);    
    }; 
   for (let i in main.listaPersonas) {
        texto.innerHTML += main.listaPersonas[i].mostrar();    
    };*/
   
   

    //Asociación de tipo de evento con la referencia de la función a ejecutar para cada botón.
    btn2.addEventListener("dblclick", main);
    btn.addEventListener("click", main);

});