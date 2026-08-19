using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IRolRepository
    {
        Task<Rol?> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<Rol> ObtenerPorClaveAsync(RolClave clave, CancellationToken ct);
        Task<List<Rol>> ObtenerTodosAsync(CancellationToken ct);
        void Agregar(Rol rol);
        void Eliminar(Rol rol);
    }
}
