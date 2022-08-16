// Clase que define las propiedades del objeto Persona.

class Persona{
  public nombre: string;
  private edad: number;


  constructor(nombre: string, edad: number) {
    this.nombre = nombre;
    this.edad = edad;
  }

//Método mostrar, para poder recuperar las propiedades de un objeto clase Persona.
  
  public mostrar() :string {
    return `Nombre =  ${this.nombre}  Edad= ${this.edad}`;
  }
}