using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IEncomiendaRepository
    {
        Task<Encomienda?> ObtenerPorIdAsync(long id, bool incluirRelaciones, CancellationToken ct);
        Task<List<Encomienda>> ObtenerPorIdsAsync(IEnumerable<long> ids, bool incluirRelaciones, CancellationToken ct);
        Task<List<Encomienda>> ObtenerTodosAsync(CancellationToken ct);
        Task<bool> ExisteCodigoAsync(string codigo, long? idExcluir, CancellationToken ct);
        Task<bool> ExisteConEstadoAsync(long estadoId, CancellationToken ct);
        Task<bool> ExisteConVueloAsync(long vueloId, CancellationToken ct);
        void Agregar(Encomienda encomienda);
        void Eliminar(Encomienda encomienda);
    }
}
