using SistemaCargaAerea.Application.DTOs.Destinos;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IDestinoService
    {
        Task<DestinoResponse> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<DestinoResponse>> ObtenerTodosAsync(CancellationToken ct);
        Task<DestinoResponse> CrearAsync(CrearDestinoRequest request, CancellationToken ct);
        Task<DestinoResponse> ActualizarAsync(long id, ActualizarDestinoRequest request, CancellationToken ct);
        Task EliminarAsync(long id, CancellationToken ct);
    }
}
