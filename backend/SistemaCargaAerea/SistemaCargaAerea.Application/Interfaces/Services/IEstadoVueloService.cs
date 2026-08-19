using SistemaCargaAerea.Application.DTOs.Estados;
using SistemaCargaAerea.Application.DTOs.Personas;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IEstadoVueloService
    {
        Task<EstadoVueloResponse> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<EstadoVueloResponse>> ObtenerTodosAsync(CancellationToken ct);
        Task<EstadoVueloResponse> CrearAsync(CrearEstadoVueloRequest request, CancellationToken ct);
        Task<EstadoVueloResponse> ActualizarAsync(long id, ActualizarEstadoVueloRequest request, CancellationToken ct);
        Task EliminarAsync(long id, CancellationToken ct);

    }
}
