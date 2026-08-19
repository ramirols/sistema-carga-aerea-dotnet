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
    public class EncomiendaRepository : IEncomiendaRepository
    {
        private readonly AppDbContext _context;

        public EncomiendaRepository(AppDbContext context) => _context = context;

        public Task<Encomienda?> ObtenerPorIdAsync(long id, bool incluirRelaciones, CancellationToken ct)
        {
            var query = _context.Encomiendas.AsQueryable();
            if (incluirRelaciones)
                query = query
                    .Include(e => e.Remitente)
                    .Include(e => e.Destinatario)
                    .Include(e => e.Estado)
                    .Include(e => e.Vuelo);
            return query.FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public Task<List<Encomienda>> ObtenerPorIdsAsync(
            IEnumerable<long> ids, bool incluirRelaciones, CancellationToken ct)
        {
            var query = _context.Encomiendas
                .Where(e => ids.Contains(e.Id));
            if (incluirRelaciones)
                query = query
                    .Include(e => e.Remitente)
                    .Include(e => e.Destinatario)
                    .Include(e => e.Estado)
                    .Include(e => e.Vuelo);
            return query.ToListAsync(ct);
        }

        public Task<List<Encomienda>> ObtenerTodosAsync(CancellationToken ct) =>
            _context.Encomiendas
                .AsNoTracking()
                .Include(e => e.Remitente)
                .Include(e => e.Destinatario)
                .Include(e => e.Estado)
                .Include(e => e.Vuelo)
                .OrderByDescending(e => e.FechaRegistro)
                .ToListAsync(ct);

        public Task<bool> ExisteCodigoAsync(string codigo, long? idExcluir, CancellationToken ct)
        {
            var codigoNorm = codigo.Trim().ToUpperInvariant();
            return _context.Encomiendas.AnyAsync(
                x => x.Codigo == codigoNorm && (!idExcluir.HasValue || x.Id != idExcluir.Value), ct);
        }
        public Task<bool> ExisteConEstadoAsync(long estadoId, CancellationToken ct) =>
            _context.Encomiendas.AnyAsync(x => x.EstadoId == estadoId, ct);

        public Task<bool> ExisteConVueloAsync(long vueloId, CancellationToken ct) =>
            _context.Encomiendas.AnyAsync(x => x.VueloId == vueloId, ct);
        public void Agregar(Encomienda encomienda) => _context.Encomiendas.Add(encomienda);

        public void Eliminar(Encomienda encomienda) => _context.Encomiendas.Remove(encomienda);
    }
}
