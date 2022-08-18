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
        this.listaPersonas.push(new Administrador("Eduardo", 47));
        this.listaPersonas.push(new Persona("S", 12));
        this.etidadesAcciones.push(new Usuario("Juan", 12, "jPerez"));
        this.etidadesAcciones.push(new Administrador("Juan", 12));

    }

    //=======[ Lister GET para traer los dispositivos a la pantalla ]========================

    public handlerResponse(status: number, response: string) {
        if (status == 200) {
            let respuestaString: string = response;
            let respuesta: Array<Device> = JSON.parse(respuestaString); //Asigno a una lista de Devices la respuesta convertida a JSON
            console.log(respuesta);
            let cajaDiv = document.getElementById("caja"); // recupero el elemento id "caja" de la pagina html y le asigno un objeto cajaDiv
            //Dentro de éste contenedor se incorporará la lista de dispositivos recupeada del servidor backend    
            cajaDiv.setAttribute("class", "talcoa");//seteo a cajaDiv la clase "talcoa"
            cajaDiv.setAttribute("id", "otro"); //cambio el id html de cajaDiv, pasa de "caja" a "otro"
            cajaDiv.setAttribute("miAtt", "123"); //seteo un atributo propio
            let valor= cajaDiv.getAttribute("miAtt");// para recuperar el valor de un atributo de la pantalla html
            let listaDispositivos:string = `<ul class="collection">`
            for (let disp of respuesta) {
                let estadoSwitch ="";
                if (disp.state == 1){ estadoSwitch = "checked"};

                listaDispositivos += ` <li class="collection-item avatar">`;
                if (disp.type == 0) {  //se asigna una imagen distinta, según el tipo de dispositivo.
                    listaDispositivos += `<img src="../static/images/velador.png" alt="" class="circle">`;
                } else if (disp.type == 1) {  
                    listaDispositivos += `<img src="../static/images/window.png" alt="" class="circle">`;
                } else if (disp.type == 2) {
                    listaDispositivos += `<img src="../static/images/lightbulb.png" alt="" class="circle">`;
                }
                

                //nombreDisp es un estilo definido por nosotros en stlyes.css que incorporo a la clase para éste tramo del string.
                //Se asigna un id a cada switch asociado al id de cada dispositivo.
                listaDispositivos += `<span class="title nombreDisp">${disp.name}</span> 
                <p>${disp.description}
                </p>`;
                if (disp.type == 0 || disp.type == 2){
                    listaDispositivos += 
                    `<a href="#!" class="secondary-content">
                        <div class="switch">
                            <label>
                                Off
                                    <input type="checkbox" id="cb_${disp.id}" ${estadoSwitch} >
                                    <span class="lever" ></span>
                                On
                            </label>
                        </div>
                    </a>
                </li>`;
                } else if (disp.type == 1){
                    listaDispositivos += 
                    `<div class="secondary-content"> 
                        <form action="#"> 
                            <p class="range-field"> 
                                <input type="range" id="rg_${disp.id}" min="0" value="${disp.state}" max="5" /> 
                            </p> 
                        </form> 
                    </div>
                </li>`;
                }
            }
            listaDispositivos += `</ul>`;       
        
            //Finalizada la concatenación del string, éste se incrusta entre la etiqueda de apertura y cierre del elemento cajaDiv en la pagina HTML.
            cajaDiv.innerHTML = listaDispositivos;

            for (let disp of respuesta) {
                let checkbox = document.getElementById("cb_" + disp.id);
                let range = document.getElementById("rg_" + disp.id);
               
                if (disp.type == 1){
                    range.addEventListener("click",this);
                } else {
                    checkbox.addEventListener("click",this)};
            };
        
        } else {
            alert("Algo salio mal")
        };
    };

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

        //==[Evento para cargar la pantalla con el listado y estado de los dispositivos ]=======

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
        }

        else if (e.type == "click" && objetoEvento.id.startsWith("rg_")) {
            //Se discrimina el evento click de cada elemento range de dispositivo.
            //console.log(objetoEvento.id,objetoEvento.value);
            console.log("Se ajustó rango");
    
            //Construcción del JSON para enviar al servidor.
            let id = objetoEvento.id.substring(3);
            let estado = (document.getElementById("rg_" + id) as HTMLInputElement).value;
            let datos = { "id": objetoEvento.id.substring(3), "state": estado };
            //con substring(3)corto los 3 primeros caracteres "cb_" de "objetoEvento.id"
    
            this.framework.ejecutarRequest("POST","http://localhost:8000/actualizar", this,datos);           
        }
        //=======[Evento para "Modificar" un dispositivo ]========================================== 
        
        else if (e.type == "click" && objetoEvento.id == "btnmod") {  
            console.log("Se solicita modificación de dispositivo");
    
            //Captura y validación de datos ingresados.
            let idMod = <HTMLInputElement>this.framework.recuperarElemento("mod_id");
            let nombreMod = <HTMLInputElement>this.framework.recuperarElemento("mod_nombre");
            let descripMod = <HTMLInputElement>this.framework.recuperarElemento("mod_descrip");
            let tipoMod = <HTMLInputElement>this.framework.recuperarElemento("mod_tipo");
            //console.log(idMod.value);

            if (idMod.value != null && nombreMod.value != null && descripMod.value != null && tipoMod.value != null){
            //Construcción del JSON para enviar al servidor. Estado por dafault en 0
                let datos = { "id": parseInt(idMod.value), "name": nombreMod.value, "description": descripMod.value, "state": 0, "type": parseInt(tipoMod.value)};
                //console.log(datos);
                this.framework.ejecutarRequest("POST","http://localhost:8000/modificar", this,datos); 
            }
            else {alert("datos ingresados incompletos")};
        }
        
        //=======[Evento para "Crear" un dispositivo ]========================================== 
        
        else if (e.type == "click" && objetoEvento.id == "btncreate") {             
            console.log("Se solicita creación de un dispositivo");

            //Captura y validación de datos ingresados.
            let nombreCre = <HTMLInputElement>this.framework.recuperarElemento("cre_nombre");
            let descripCre = <HTMLInputElement>this.framework.recuperarElemento("cre_descrip");
            let tipoCre = <HTMLInputElement>this.framework.recuperarElemento("cre_tipo");

            //Construcción del JSON para enviar al servidor. Estado por dafault en 0
            if (nombreCre.value == "" || descripCre.value == "" ){
                alert("datos ingresados incompletos")
            } else{
            let datos = {"name": nombreCre.value, "description": descripCre.value, "state": 0, "type": parseInt(tipoCre.value)};
            console.log(datos);
            this.framework.ejecutarRequest("POST","http://localhost:8000/crear", this,datos);
            }
            
        }

        //=======[Evento para "Borrar" un dispositivo ]========================================== 
        
        else if (e.type == "click" && objetoEvento.id == "btndel") {             
            console.log("Se solicita borrar un dispositivo");

            //Captura y validación de datos ingresados.
            let idDel = <HTMLInputElement>this.framework.recuperarElemento("del_id");
            
            //Construcción del JSON para enviar al servidor.
            if (idDel.value == ""){
                alert("datos ingresados incompletos")
            } else{
            let datos = {"id": parseInt(idDel.value)};
            console.log(datos);
            this.framework.ejecutarRequest("POST","http://localhost:8000/borrar", this,datos);
            }  
        }

        //=======[Evento de desborde al darse un click ]========================================== 
        
        else if (e.type == "click") {
            console.log("click de desborde")
            let test_2 = <HTMLInputElement>this.framework.recuperarElemento("input1");
            //let test_2 = document.getElementById("input1");
            console.log(test_2.value);
            if (test_2.value == this.listaPersonas[1].nombre){
                alert("Hola " +  this.listaPersonas[1].nombre +", " + this.listaPersonas[1].mostrar())


            } else{ alert("Hola " +  test_2.value +", no eres un usuario registrado")};

            //let test_2 = <HTMLElement>this.framework.recuperarElemento("test");
            //console.log(test_2.childNodes);
            
        } 

        //=======[Evento de de prueba del dobleclik ]========================================== 
        
        else if(e.type == "dblclick" && objetoEvento.id == "btnDoble") {
            alert("Se solicita Test de dobleclick");
            let elemento = <HTMLInputElement>this.framework.recuperarElemento("input1");
            if (elemento.value.length>5) {
                console.log(elemento.value);
                M.toast({html: 'se cargo la info'})
            } else {
                alert("falta cargar el nombre o es menor a 5"); 
            }
        }     
    }
}


//=======[Se espera a que se termine de cargar la página htlm para recuperar elementos]========================

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select'); //se incorpora para utilizar elementos de Materialize que requieren inicialización.
    var instances = M.FormSelect.init(elems,"");     //se incorpora para utilizar elementos de Materialize que requieren inicialización.
    M.updateTextFields();                            //se incorpora para utilizar elementos de Materialize que requieren inicialización.
    var elems1 = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems1, "");
    //Recupero elementos de pantalla.
    let btnmod = document.getElementById("btnmod");
    let btncre = document.getElementById("btncreate");
    let btndel = document.getElementById("btndel");
    let btn2 = document.getElementById("btnDoble");
    let btntest =document.getElementById("btntest");
    let texto = document.getElementById("textarea_1");
    
    let main: Main = new Main();
    main.nombre = "Eduardo";

    //Asociación de tipo de evento con la referencia de la función a ejecutar para cada botón.
    btn2.addEventListener("dblclick", main);
    btnmod.addEventListener("click", main);
    btncre.addEventListener("click", main);
    btndel.addEventListener("click", main);
    btntest.addEventListener("click", main);

    //==== [Pruebas de debug] ==================
    //texto.innerHTML = main.listaPersonas[0].mostrar();
    /*for (let i in main.etidadesAcciones) {
        texto.innerHTML += JSON.stringify(main.etidadesAcciones[i]);    
    }; 
   for (let i in main.listaPersonas) {
        texto.innerHTML += main.listaPersonas[i].mostrar();    
    };*/
    
});