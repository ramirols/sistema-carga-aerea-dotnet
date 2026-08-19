using SistemaCargaAerea.Application.DTOs.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IUsuarioService
    {
        Task<UsuarioResponse> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<UsuarioResponse>> ObtenerTodosAsync(CancellationToken ct);
        Task<UsuarioResponse> CrearAsync(CrearUsuarioRequest request, CancellationToken ct);
        Task CambiarPasswordAsync(long id, CambiarPasswordRequest request, CancellationToken ct);
        Task CambiarRolAsync(long id, CambiarRolUsuarioRequest request, CancellationToken ct);
        Task ActivarAsync(long id, CancellationToken ct);
        Task DesactivarAsync(long id, CancellationToken ct);
    }
}
