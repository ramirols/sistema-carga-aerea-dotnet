using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Roles
{
    public record CrearRolRequest
    {
        [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
        [StringLength(80)]
        public string Nombre { get; init; } = string.Empty;
    }
    public record ActualizarRolRequest
    {
        [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
        [StringLength(80)]
        public string Nombre { get; init; } = string.Empty;
    }
    public record RolResponse
    {
        public long Id { get; init; }
        public string Nombre { get; init; } = string.Empty;
        public bool EsDelSistema { get; init; }
    }
}
