using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Destinos
{
    public abstract record DestinoRequestBase
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(150)]
        public string Nombre { get; init; } = string.Empty;

        [Required(ErrorMessage = "El código IATA es obligatorio.")]
        [StringLength(3, MinimumLength = 3, ErrorMessage = "El código IATA debe tener 3 letras.")]
        public string CodigoIATA { get; init; } = string.Empty;

        [Required(ErrorMessage = "El país es obligatorio.")]
        [StringLength(100)]
        public string Pais { get; init; } = string.Empty;
    }
    public record CrearDestinoRequest : DestinoRequestBase;
    public record ActualizarDestinoRequest : DestinoRequestBase;
    public record DestinoResponse
    {
        public long Id { get; init; }
        public string Nombre { get; init; } = string.Empty;
        public string CodigoIATA { get; init; } = string.Empty;
        public string Pais { get; init; } = string.Empty;
    }
}
