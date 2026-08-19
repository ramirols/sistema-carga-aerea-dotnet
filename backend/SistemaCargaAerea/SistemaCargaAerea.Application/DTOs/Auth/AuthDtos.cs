using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Auth
{
    public record LoginRequest
    {
        [Required(ErrorMessage = "El nombre de usuario es obligatorio.")]
        public string NombreUsuario { get; init; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        public string Password { get; init; } = string.Empty;
    }
    public record LoginResponse
    {
        public string Token { get; init; } = string.Empty;
        public DateTime ExpiraEn { get; init; }
        public string NombreUsuario { get; init; } = string.Empty;
        public string Rol { get; init; } = string.Empty;
    }
}
