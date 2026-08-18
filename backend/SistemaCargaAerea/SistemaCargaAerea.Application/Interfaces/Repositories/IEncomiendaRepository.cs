using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IEncomiendaRepository
    {
        Task<IReadOnlyCollection<Encomienda>> ListarAsync(
        EstadoEncomiendaClave? estado = null,
        long? vueloId = null,
        CancellationToken cancellationToken = default);

        Task<Encomienda?> ObtenerPorIdAsync(
            long id,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyCollection<Encomienda>> ObtenerPorIdsAsync(
            IReadOnlyCollection<long> ids,
            CancellationToken cancellationToken = default);

        Task<bool> ExisteCodigoAsync(
            string codigo,
            long? idExcluir = null,
            CancellationToken cancellationToken = default);

        Task AgregarAsync(
            Encomienda encomienda,
            CancellationToken cancellationToken = default);

        void Eliminar(Encomienda encomienda);
    }
}
