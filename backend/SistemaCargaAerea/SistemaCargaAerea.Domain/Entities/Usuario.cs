using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Entities
{
    public class Usuario
    {
        public long Id { get; private set; }
        public string NombreUsuario { get; private set; } = string.Empty;
        public string PasswordHash { get; private set; } = string.Empty;
        public long RolId { get; private set; }
        public Rol? Rol { get; private set; }
        public bool Activo { get; private set; }
        public DateTime FechaCreacion { get; private set; }


        private Usuario() {

        }
        public Usuario(string nombreUsuario, string passwordHash, long rolId)
        {
            if (string.IsNullOrWhiteSpace(nombreUsuario))
                throw new ArgumentException("El nombre de usuario es obligatorio.");

            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("El hash de la contraseña es obligatorio.");

            if (rolId <= 0)
                throw new ArgumentException("El hash de la contaseña es obligatorio.");

            NombreUsuario = nombreUsuario.Trim().ToLowerInvariant();
            PasswordHash = passwordHash;
            RolId = rolId;
            Activo = true;
            FechaCreacion = DateTime.UtcNow;
        }

        internal Usuario(string nombreUsuario, string passwordHash, Rol rol)
        {
            if (string.IsNullOrWhiteSpace(nombreUsuario))
                throw new ArgumentException("El nombre de usuario es obligatorio");
            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("El hash de la contraseña es obligatorio.");

            NombreUsuario = nombreUsuario.Trim().ToLowerInvariant();
            PasswordHash = passwordHash;
            RolId = rol.Id;
            Rol = rol;
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
            if (nuevoRolId <= 0)
                throw new ArgumentException("El rol es obligatorio.");

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
