class FrameWork{
  
// Se aplica tecnología Ajax para realizar una petición asíncrona al servidor backend
//mediante el objeto XMLHttpRequest.
//Lister es a quien le va a responder el servidor cuando esté lista la respuesta
  
  public ejecutarRequest(metodo: string, url: string,lister:ResponseLister,data?:any) {
    let xmlHttp: XMLHttpRequest = new XMLHttpRequest();
    
    //=======[ Método a ejecutarse cuando el servidor envía una respuesta ]==================
    
    xmlHttp.onreadystatechange = () => {

      if (xmlHttp.readyState == 4) { 
        //readyState == 4 implica que el servidor tiene la información lista para ser consumida.
        if (metodo == "GET") {
          lister.handlerResponse(xmlHttp.status,xmlHttp.responseText); 
          //Se recibe un número como status y un string con la info de los dispositivos.
          //console.log(xmlHttp.responseText); // verifico por consola la respuesta al método GET
        } else { 
          // Se trata de un método POST.
          lister.handlerResponseActualizar(xmlHttp.status,xmlHttp.responseText);
        }
      }
    }
  
    //=======[ Método a ejecutarse cuando se envia un request al servidor ]==================
    
    // Se abre la conexión definiendo el método, la URL del servidor y el parámetro 'true' 
    //para que la conexión sea asíncrona.

    xmlHttp.open(metodo, url, true);
      if (metodo == "POST") {   // Si es POST, indicar el tipo de la información a enviar.
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(JSON.stringify(data)); // se envía la request POST al servidor en formato string.
      }
      else {
        //Se envía la solicitud GET al servidor.
        xmlHttp.send();  
       }        
  }

  //=======[ Método para recuperar elemento de la pantalla ]==================================
  public recuperarElemento(id: string): HTMLElement{
    let element = document.getElementById(id);
    return element;
  }
}