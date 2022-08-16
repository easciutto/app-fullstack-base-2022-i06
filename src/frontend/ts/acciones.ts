// Interfaz que lista las acciones posibles a ser realizadas por:
// los administradores y los usuarios.

interface Acciones{

  consultar(): string;
  guardar(): string;
  modificar(): string;
  eliminar(): string;

}