//Clase Administrador: hereda la clase Persona e implementa la interfaz Acciones.

class Administrador extends Persona implements Acciones{
  public tipo: string;

  //Por herencia de la clase Persona, se puede utilizar el método mostrar() para recuperar una propiedad del objeto.

  public mostrar(): string {
   
    return "eres usuario administador ("+super.mostrar() + ")";
  }

  //Se define una respuesta para cada una de las funciones de la interfaz Acciones.

  consultar(): string{
    return "Puede";
  }
  guardar(): string{
    return "Puede";
  }
  modificar(): string{
    return "Puede";
  }
  eliminar(): string{
    return "Puede";
  }
}