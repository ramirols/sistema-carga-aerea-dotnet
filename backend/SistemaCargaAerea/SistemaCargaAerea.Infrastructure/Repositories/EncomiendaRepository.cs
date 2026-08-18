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

        public EncomiendaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyCollection<Encomienda>> ListarAsync(
            EstadoEncomiendaClave? estado = null,
            long? vueloId = null,
            CancellationToken cancellationToken = default)
        {
            IQueryable<Encomienda> query = _context.Encomiendas
                .AsNoTracking()
                .Include(x => x.Vuelo);

            if (estado.HasValue)
            {
                query = query.Where(x =>
                    x.Estado == estado.Value);
            }

            if (vueloId.HasValue)
            {
                query = query.Where(x =>
                    x.VueloId == vueloId.Value);
            }

            return await query
                .OrderByDescending(x => x.FechaRegistro)
                .ToListAsync(cancellationToken);
        }

        public Task<Encomienda?> ObtenerPorIdAsync(
            long id,
            CancellationToken cancellationToken = default)
        {
            return _context.Encomiendas
                .Include(x => x.Vuelo)
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken);
        }

        public async Task<IReadOnlyCollection<Encomienda>>
            ObtenerPorIdsAsync(
                IReadOnlyCollection<long> ids,
                CancellationToken cancellationToken = default)
        {
            return await _context.Encomiendas
                .Where(x => ids.Contains(x.Id))
                .ToListAsync(cancellationToken);
        }

        public Task<bool> ExisteCodigoAsync(
            string codigo,
            long? idExcluir = null,
            CancellationToken cancellationToken = default)
        {
            var codigoNormalizado = codigo.Trim().ToUpper();

            return _context.Encomiendas.AnyAsync(
                x => x.Codigo == codigoNormalizado &&
                     (!idExcluir.HasValue || x.Id != idExcluir.Value),
                cancellationToken);
        }

        public Task AgregarAsync(
            Encomienda encomienda,
            CancellationToken cancellationToken = default)
        {
            return _context.Encomiendas
                .AddAsync(encomienda, cancellationToken)
                .AsTask();
        }

        public void Eliminar(Encomienda encomienda)
        {
            _context.Encomiendas.Remove(encomienda);
        }
    }
}
