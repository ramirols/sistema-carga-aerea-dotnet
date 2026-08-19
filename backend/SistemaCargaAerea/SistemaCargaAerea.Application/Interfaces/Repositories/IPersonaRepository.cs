using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IPersonaRepository
    {
        Task<Persona?> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<Persona?> ObtenerPorDocumentoAsync(string documento, CancellationToken ct);
        Task<List<Persona>> ObtenerTodosAsync(CancellationToken ct);
        void Agregar(Persona persona);
    }
}
