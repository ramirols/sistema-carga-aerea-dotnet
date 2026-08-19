using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IVueloRepository
    {
        Task<Vuelo?> ObtenerPorIdAsync(long id, bool incluirRelaciones, CancellationToken ct);
        Task<List<Vuelo>> ObtenerTodosAsync(CancellationToken ct);
        Task<bool> ExisteCodigoVueloAsync(string codigoVuelo, long? idExcluir, CancellationToken ct);
        Task<bool> ExisteConDestinoAsync(long destinoId, CancellationToken ct);
        Task<bool> ExisteConEstadoAsync(long estadoId, CancellationToken ct);
        void Agregar(Vuelo vuelo);
        void Eliminar(Vuelo vuelo);
    }
}
