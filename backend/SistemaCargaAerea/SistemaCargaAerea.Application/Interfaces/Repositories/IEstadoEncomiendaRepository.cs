using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IEstadoEncomiendaRepository
    {
        Task<EstadoEncomienda?> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<EstadoEncomienda> ObtenerPorClaveAsync(EstadoEncomiendaClave clave, CancellationToken ct);
        Task<List<EstadoEncomienda>> ObtenerTodosAsync(CancellationToken ct);
        void Agregar(EstadoEncomienda estado);
        void Eliminar(EstadoEncomienda estado);
    }
}
