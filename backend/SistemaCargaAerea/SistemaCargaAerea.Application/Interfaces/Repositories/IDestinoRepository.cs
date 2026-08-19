using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IDestinoRepository
    {
        Task<Destino?> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<Destino>> ObtenerTodosAsync(CancellationToken ct);
        Task<bool> ExisteCodigoIATAAsync(string codigoIATA, long? idExcluir, CancellationToken ct);
        void Agregar(Destino destino);
        void Eliminar(Destino destino);
    }
}
