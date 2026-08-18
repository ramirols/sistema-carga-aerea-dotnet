using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Entities
{
    public class Usuario
    {
        public long Id { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public long RolId { get; set; }
        public Rol? Rol { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }


        private Usuario() {

        }
        public Usuario(string nombreUsuario, string passwordHash, long rolId)
        {
            if (string.IsNullOrWhiteSpace(nombreUsuario))
                throw new ArgumentException("El nombre de usuario es obligatorio.");

            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("El hash de la contraseña es obligatorio.");

            NombreUsuario = nombreUsuario.Trim().ToLowerInvariant();
            PasswordHash = passwordHash;
            RolId = rolId;
            Activo = true;
            FechaCreacion = DateTime.UtcNow;
        }

        public void CambiarPassword(string nuevoPasswordHash)
        {
            if (string.IsNullOrWhiteSpace(nuevoPasswordHash))
                throw new ArgumentException("El hash de la contraseña es obligatorio.");

            PasswordHash = nuevoPasswordHash;
        }
        public void CambiarRol(long nuevoRolId)
        {
            RolId = nuevoRolId;
        }
        public void Desactivar()
        {
            if (!Activo)
                throw new InvalidOperationException("El usuario ya está desactivado.");

            Activo = false;
        }
        public void Activar()
        {
            if (Activo)
                throw new InvalidOperationException("El usuario ya está activo.");

            Activo = true;
        }
        public bool PuedeAutenticarse() => Activo;
    }
}
