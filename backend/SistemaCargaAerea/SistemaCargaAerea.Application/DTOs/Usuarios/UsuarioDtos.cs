using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Usuarios
{
    public record CrearUsuarioRequest
    {
        [Required(ErrorMessage = "El nombre de usuario es obligatorio.")]
        [StringLength(50, MinimumLength = 3)]
        public string NombreUsuario { get; init; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")]
        public string Password { get; init; } = string.Empty;

        [Range(1, long.MaxValue, ErrorMessage = "Debe indicar un rol válido.")]
        public long RolId { get; init; }
    }

    public record CambiarRolUsuarioRequest
    {
        [Range(1, long.MaxValue, ErrorMessage = "Debe indicar un rol válido.")]
        public long RolId { get; init; }
    }

    public record CambiarPasswordRequest
    {
        [Required(ErrorMessage = "Debe indicar la contraseña actual.")]
        public string PasswordActual { get; init; } = string.Empty;

        [Required(ErrorMessage = "La nueva contraseña es obligatoria.")]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")]
        public string PasswordNueva { get; init; } = string.Empty;
    }

    public record UsuarioResponse
    {
        public long Id { get; init; }
        public string NombreUsuario { get; init; } = string.Empty;
        public string Rol { get; init; } = string.Empty;
        public bool Activo { get; init; }
        public DateTime FechaCreacion { get; init; }
    }
}
