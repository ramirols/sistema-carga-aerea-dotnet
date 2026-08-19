using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Estados
{
    public record CrearEstadoEncomiendaRequest
    {
        [Required(ErrorMessage = "El nombre del estado es obligatorio.")]
        [StringLength(80)]
        public string Nombre { get; init; } = string.Empty;
    }
    public record ActualizarEstadoEncomiendaRequest
    {
        [Required(ErrorMessage = "El nombre del estado es obligatorio.")]
        [StringLength(80)]
        public string Nombre { get; init; } = string.Empty;
    }
    public record EstadoEncomiendaResponse
    {
        public long Id { get; init; }
        public string Nombre { get; init; } = string.Empty;
        public bool EsDelSistema { get; init; }
    }
}
