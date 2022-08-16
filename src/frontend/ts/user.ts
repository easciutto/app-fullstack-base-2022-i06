//Clase Usuario: hereda la clase Persona e implementa la interfaz Acciones.

class Usuario extends Persona implements Acciones{
  private userName: string;
  
// Las propiedades de un objeto clase Usuario son: 
//nombre y edad (heredados de la clase Persona) y nombre de usuario.

  constructor(nombre: string, edad: number,userName:string) {
    super(nombre, edad);
    this.userName = userName;

  }
  //Por herencia de la clase Persona, se puede utilizar el método mostrar() para recuperar una propiedad del objeto
  public mostrar(): string {
    return "Soy " + this.userName;
  }

  //Se define una respuesta para cada una de las funciones de la interfaz Acciones.

  consultar(): string{
    return "puede";
  }
  guardar(): string{
    return "puede";
  }
  modificar(): string{
    return "No puede";
  }
  eliminar(): string{
    return "No puede";
  }
}


