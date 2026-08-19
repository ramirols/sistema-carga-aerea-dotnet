using Microsoft.EntityFrameworkCore;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using SistemaCargaAerea.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Repositories
{
    public class VueloRepository : IVueloRepository
    {
        private readonly AppDbContext _context;

        public VueloRepository(AppDbContext context) => _context = context;

        public Task<Vuelo?> ObtenerPorIdAsync(long id, bool incluirRelaciones, CancellationToken ct)
        {
            var query = _context.Vuelos.AsQueryable();
            if (incluirRelaciones)
                query = query
                    .Include(v => v.Destino)
                    .Include(v => v.Estado);
            return query.FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public Task<List<Vuelo>> ObtenerTodosAsync(CancellationToken ct) =>
            _context.Vuelos
                .AsNoTracking()
                .Include(v => v.Destino)
                .Include(v => v.Estado)
                .OrderBy(v => v.FechaVuelo)
                .ThenBy(v => v.HoraVuelo)
                .ToListAsync(ct);

        public Task<bool> ExisteCodigoVueloAsync(string codigoVuelo, long? idExcluir, CancellationToken ct)
        {
            var codigo = codigoVuelo.Trim().ToUpperInvariant();
            return _context.Vuelos.AnyAsync(
                x => x.CodigoVuelo == codigo && (!idExcluir.HasValue || x.Id != idExcluir.Value), ct);
        }
        public Task<bool> ExisteConEstadoAsync(long estadoId, CancellationToken ct) =>
            _context.Vuelos.AnyAsync(x => x.EstadoId == estadoId, ct);
        public void Agregar(Vuelo vuelo) => _context.Vuelos.Add(vuelo);

        public void Eliminar(Vuelo vuelo) => _context.Vuelos.Remove(vuelo);

        public Task<bool> ExisteConDestinoAsync(long destinoId, CancellationToken ct) =>
                    _context.Vuelos.AnyAsync(x => x.DestinoId == destinoId, ct);
    }
}
