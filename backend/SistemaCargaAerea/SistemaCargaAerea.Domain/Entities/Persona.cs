using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Entities
{
    public class Persona
    {
        public long Id { get; private set; }
        public string Nombre { get; private set; } = string.Empty;
        public string Documento { get; private set; } = string.Empty;
        public string? Telefono { get; private set; }
        public string? Email { get; private set; }
        public string? Direccion { get; private set; }

        private Persona()
        {
        }
        public Persona(string nombre, string documento, string? telefono, string? email, string? direccion)
        {
            CambiarDatos(nombre, documento, telefono, email, direccion);
        }

        public void Actualizar(string nombre, string? telefono, string? email, string? direccion)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new ArgumentException("El nombre es obligatorio.");

            Nombre = nombre.Trim();
            Telefono = string.IsNullOrWhiteSpace(telefono) ? null : telefono.Trim();
            Email = string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant();
            Direccion = string.IsNullOrWhiteSpace(direccion) ? null : direccion.Trim();
        }

        private void CambiarDatos(string nombre, string documento, string? telefono, string? email, string? direccion)
        {
            if (string.IsNullOrWhiteSpace(documento))
                throw new ArgumentException("El documento es obligatorio.");

            Documento = documento.Trim();
            Actualizar(nombre, telefono, email, direccion);
        }
    }
}
