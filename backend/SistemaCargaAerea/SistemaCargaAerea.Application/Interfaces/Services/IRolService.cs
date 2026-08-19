using SistemaCargaAerea.Application.DTOs.Estados;
using SistemaCargaAerea.Application.DTOs.Personas;
using SistemaCargaAerea.Application.DTOs.Roles;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IRolService
    {
        Task<RolResponse> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<RolResponse>> ObtenerTodosAsync(CancellationToken ct);
        Task<RolResponse> CrearAsync(CrearRolRequest request, CancellationToken ct);
        Task<RolResponse> ActualizarAsync(long id, ActualizarRolRequest request, CancellationToken ct);
        Task EliminarAsync(long id, CancellationToken ct);

    }
}
