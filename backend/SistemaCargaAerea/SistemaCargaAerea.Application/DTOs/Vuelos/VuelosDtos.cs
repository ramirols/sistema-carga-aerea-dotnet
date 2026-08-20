using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Vuelos
{
    public abstract record VueloRequestBase
    {
        [Required(ErrorMessage = "El código del vuelo es obligatorio.")]
        [StringLength(10)]
        public string CodigoVuelo { get; init; } = string.Empty;

        [Range(1, long.MaxValue, ErrorMessage = "Debe indicar un destino válido.")]
        public long DestinoId { get; init; }

        [Required(ErrorMessage = "La fecha del vuelo es obligatoria.")]
        public DateOnly FechaVuelo { get; init; }

        [Required(ErrorMessage = "La hora del vuelo es obligatoria.")]
        public TimeOnly HoraVuelo { get; init; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El peso máximo debe ser mayor que cero.")]
        public decimal PesoMaximo { get; init; }
    }

    public record CrearVueloRequest : VueloRequestBase;
    public record ActualizarVueloRequest : VueloRequestBase;
    public record VueloResponse
    {
        public long Id { get; init; }
        public string CodigoVuelo { get; init; } = string.Empty;
        public long DestinoId { get; init; }
        public string Destino { get; init; } = string.Empty;
        
        public DateOnly FechaVuelo { get; init; }
        public TimeOnly HoraVuelo { get; init; }
        public decimal PesoMaximo { get; init; }
        public decimal PesoAsignado { get; init; }
        public decimal PesoDisponible { get; init; }
        public string Estado { get; init; } = string.Empty;
    }
}