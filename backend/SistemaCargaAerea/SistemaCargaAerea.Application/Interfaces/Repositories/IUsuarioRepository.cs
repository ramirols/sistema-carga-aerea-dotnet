using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<Usuario?> ObtenerPorNombreUsuarioAsync(string nombreUsuario, bool incluirRol, CancellationToken ct);
        Task<bool> ExisteNombreUsuarioAsync(string nombreUsuario, CancellationToken ct);
        Task<bool> ExisteConRolAsync(long rolId, CancellationToken ct);

        Task<List<Usuario>> ObtenerTodosAsync(CancellationToken ct);
        void Agregar(Usuario usuario);
    }
}
