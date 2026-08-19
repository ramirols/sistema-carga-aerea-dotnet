using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IEstadoVueloRepository
    {
        Task<EstadoVuelo?> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<EstadoVuelo> ObtenerPorClaveAsync(EstadoVueloClave clave, CancellationToken ct);
        Task<List<EstadoVuelo>> ObtenerTodosAsync(CancellationToken ct);
        void Agregar(EstadoVuelo estado);
        void Eliminar(EstadoVuelo estado);
    }
}
