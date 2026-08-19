using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Estados
{
    public record CrearEstadoVueloRequest
    {
        [Required(ErrorMessage = "El nombre del estado es obligatorio.")]
        [StringLength(80)]
        public string Nombre { get; init; } = string.Empty;
    }
    public record ActualizarEstadoVueloRequest
    {
        [Required(ErrorMessage = "El nombre del estado es obligatorio.")]
        [StringLength(80)]
        public string Nombre { get; init; } = string.Empty;
    }
    public record EstadoVueloResponse
    {
        public long Id { get; init; }
        public string Nombre { get; init; } = string.Empty;
        public bool EsDelSistema { get; init; }
    }
}
