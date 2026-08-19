using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Entities
{
    public class EstadoVuelo
    {
        public long Id { get; private set; }
        public string Nombre { get; private set; } = string.Empty;
        public EstadoVueloClave? Clave { get; private set; }


        private EstadoVuelo()
        {
        }
        public EstadoVuelo(string nombre)
        {
            Nombre = ValidarNombre(nombre);
        }
        internal EstadoVuelo(string nombre, EstadoVueloClave clave)
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
                    $"El estado '{Nombre}' es un estado del sistema y no puede eliminarse.");
        }

        private static string ValidarNombre(string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new ArgumentException("El nombre del estado es obligatorio.");

            return nombre.Trim();
        }
    }
}
