using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SistemaCargaAerea.Application.DTOs.Vuelos;

public sealed record VueloResponse(
    long Id,
    string CodigoVuelo,
    string Destino,
    DateOnly FechaVuelo,
    TimeOnly HoraVuelo,
    decimal PesoMaximo,
    decimal PesoActual,
    decimal PesoDisponible,
    EstadoVueloClave Estado);

public sealed record CrearVueloRequest(
    [Required, StringLength(10)] string CodigoVuelo,
    [Required, StringLength(100)] string Destino,
    DateOnly FechaVuelo,
    TimeOnly HoraVuelo,
    [Range(0.01, double.MaxValue)] decimal PesoMaximo);

public sealed record ActualizarVueloRequest(
    [Required, StringLength(10)] string CodigoVuelo,
    [Required, StringLength(100)] string Destino,
    DateOnly FechaVuelo,
    TimeOnly HoraVuelo,
    [Range(0.01, double.MaxValue)] decimal PesoMaximo);