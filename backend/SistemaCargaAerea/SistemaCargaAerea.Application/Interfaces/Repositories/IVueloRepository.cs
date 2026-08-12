using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IVueloRepository
    {
        Task<IReadOnlyCollection<Vuelo>> ListarAsync(
        string? destino = null,
        EstadoVuelo? estado = null,
        CancellationToken cancellationToken = default);

        Task<Vuelo?> ObtenerPorIdAsync(
            long id,
            bool incluirEncomiendas = false,
            CancellationToken cancellationToken = default);

        Task<bool> ExisteCodigoAsync(
            string codigo,
            long? idExcluir = null,
            CancellationToken cancellationToken = default);

        Task AgregarAsync(
            Vuelo vuelo,
            CancellationToken cancellationToken = default);

        void Eliminar(Vuelo vuelo);
    }
}
