// Interfaz para manejar las respuestas del servidor

interface ResponseLister{
    // Respuesta para cuando utilizo el método GET
    handlerResponse(status: number, response: string);

    // Respuesta para cuando utilizo el método POST
    handlerResponseActualizar(status:number,response:string);
}