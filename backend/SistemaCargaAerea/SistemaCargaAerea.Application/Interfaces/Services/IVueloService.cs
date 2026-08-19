using SistemaCargaAerea.Application.DTOs.Vuelos;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IVueloService
    {
        Task<VueloResponse> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<VueloResponse>> ObtenerTodosAsync(CancellationToken ct);
        Task<VueloResponse> CrearAsync(CrearVueloRequest request, CancellationToken ct);
        Task<VueloResponse> ActualizarAsync(long id, ActualizarVueloRequest request, CancellationToken ct);
        Task EliminarAsync(long id, CancellationToken ct);
        Task<VueloResponse> IniciarVueloAsync(long id, CancellationToken ct);
        Task<VueloResponse> AterrizarAsync(long id, CancellationToken ct);
        Task<VueloResponse> CancelarAsync(long id, CancellationToken ct);
    }
}
