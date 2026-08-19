using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Personas
{
    public abstract record PersonaRequestBase
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(150)]
        public string Nombre { get; init; } = string.Empty;

        [StringLength(30)]
        public string? Telefono { get; init; }

        [EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
        [StringLength(150)]
        public string? Email { get; init; }

        [StringLength(250)]
        public string? Direccion { get; init; }
    }
    public record CrearPersonaRequest : PersonaRequestBase
    {
        [Required(ErrorMessage = "El documento es obligatorio.")]
        [StringLength(20)]
        public string Documento { get; init; } = string.Empty;
    }
    public record ActualizarPersonaRequest : PersonaRequestBase;
    public record PersonaResponse
    {
        public long Id { get; init; }
        public string Nombre { get; init; } = string.Empty;
        public string Documento { get; init; } = string.Empty;
        public string? Telefono { get; init; }
        public string? Email { get; init; }
        public string? Direccion { get; init; }
    }
}
