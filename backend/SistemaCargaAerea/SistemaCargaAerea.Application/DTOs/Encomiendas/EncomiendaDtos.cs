using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Encomiendas;

public sealed record EncomiendaResponse(
    long Id,
    string Codigo,
    string Descripcion,
    decimal Peso,
    string Remitente,
    string Destinatario,
    EstadoEncomiendaClave Estado,
    long? VueloId,
    string? CodigoVuelo);

public sealed record CrearEncomiendaRequest(
    [Required, StringLength(20)] string Codigo,
    [Required, StringLength(250)] string Descripcion,
    [Range(0.01, double.MaxValue)] decimal Peso,
    [Required, StringLength(150)] string Remitente,
    [Required, StringLength(150)] string Destinatario);

public sealed record ActualizarEncomiendaRequest(
    [Required, StringLength(20)] string Codigo,
    [Required, StringLength(250)] string Descripcion,
    [Range(0.01, double.MaxValue)] decimal Peso,
    [Required, StringLength(150)] string Remitente,
    [Required, StringLength(150)] string Destinatario);

public sealed record AsignarEncomiendasRequest(
    [Required] IReadOnlyCollection<long> EncomiendaIds);