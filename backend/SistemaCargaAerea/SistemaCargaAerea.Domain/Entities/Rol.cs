using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Entities
{
    public class Rol
    {
        public long Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public RolClave? Clave { get; set; }


        private Rol(){

        }
        public Rol(string nombre)
        {
            Nombre = ValidarNombre(nombre);
        }
        internal Rol(string nombre, RolClave clave)
        {
            Nombre = ValidarNombre(nombre);
            Clave = clave;
        }


        public void Renombrar(string nombre)
        {
            Nombre = ValidarNombre(nombre);
        }

        public void ValidarEliminable()
        {
            if (Clave is not null)
                throw new InvalidOperationException(
                    $"El rol '{Nombre}' es un rol del sistema y no puede eliminarse.");
        }

        private static string ValidarNombre(string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new ArgumentException("El nombre del rol es obligatorio.");

            return nombre.Trim();
        }
    }
}
