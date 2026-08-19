using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Encomiendas
{
    public abstract record EncomiendaRequestBase
    {
        [Required(ErrorMessage = "El código de la encomienda es obligatorio.")]
        [StringLength(30)]
        public string Codigo { get; init; } = string.Empty;

        [Required(ErrorMessage = "La descripción es obligatoria.")]
        [StringLength(120)]
        public string Descripcion { get; init; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "El peso debe ser mayor que cero.")]
        public decimal Peso { get; init; }

        [Range(1, long.MaxValue, ErrorMessage = "Debe indicar un remitente válido.")]
        public long RemitenteId { get; init; }

        [Range(1, long.MaxValue, ErrorMessage = "Debe indicar un destinatario válido.")]
        public long DestinatarioId { get; init; }
    }

    public record CrearEncomiendaRequest : EncomiendaRequestBase;

    public record ActualizarEncomiendaRequest : EncomiendaRequestBase;

    public record EncomiendaResponse
    {
        public long Id { get; init; }
        public string Codigo { get; init; } = string.Empty;
        public string Descripcion { get; init; } = string.Empty;
        public decimal Peso { get; init; }
        public string Remitente { get; init; } = string.Empty;
        public string Destinatario { get; init; } = string.Empty;
        public string Estado { get; init; } = string.Empty;
        public string? VueloCodigo { get; init; }
        public DateTime FechaRegistro { get; init; }
    }

    public record AsignarEncomiendasRequest
    {
        [MinLength(1, ErrorMessage = "Debe indicar al menos una encomienda.")]
        public List<long> EncomiendaIds { get; init; } = [];
    }
}