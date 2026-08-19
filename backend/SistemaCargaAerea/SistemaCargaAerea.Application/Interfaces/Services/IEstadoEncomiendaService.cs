using SistemaCargaAerea.Application.DTOs.Estados;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IEstadoEncomiendaService
    {
        Task<EstadoEncomiendaResponse> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<EstadoEncomiendaResponse>> ObtenerTodosAsync(CancellationToken ct);
        Task<EstadoEncomiendaResponse> CrearAsync(CrearEstadoEncomiendaRequest request, CancellationToken ct);
        Task<EstadoEncomiendaResponse> ActualizarAsync(long id, ActualizarEstadoEncomiendaRequest request, CancellationToken ct);
        Task EliminarAsync(long id, CancellationToken ct);
    }
}
