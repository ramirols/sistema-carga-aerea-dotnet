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

        public VueloRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyCollection<Vuelo>> ListarAsync(
            string? destino = null,
            EstadoVuelo? estado = null,
            CancellationToken cancellationToken = default)
        {
            IQueryable<Vuelo> query = _context.Vuelos
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(destino))
            {
                query = query.Where(x =>
                    x.Destino.Contains(destino));
            }

            if (estado.HasValue)
            {
                query = query.Where(x =>
                    x.Estado == estado.Value);
            }

            return await query
                .OrderBy(x => x.FechaVuelo)
                .ThenBy(x => x.HoraVuelo)
                .ToListAsync(cancellationToken);
        }

        public Task<Vuelo?> ObtenerPorIdAsync(
            long id,
            bool incluirEncomiendas = false,
            CancellationToken cancellationToken = default)
        {
            IQueryable<Vuelo> query = _context.Vuelos;

            if (incluirEncomiendas)
                query = query.Include(x => x.Encomiendas);

            return query.FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
        }

        public Task<bool> ExisteCodigoAsync(
            string codigo,
            long? idExcluir = null,
            CancellationToken cancellationToken = default)
        {
            var codigoNormalizado = codigo.Trim().ToUpper();

            return _context.Vuelos.AnyAsync(
                x => x.CodigoVuelo == codigoNormalizado &&
                     (!idExcluir.HasValue || x.Id != idExcluir.Value),
                cancellationToken);
        }

        public Task AgregarAsync(
            Vuelo vuelo,
            CancellationToken cancellationToken = default)
        {
            return _context.Vuelos
                .AddAsync(vuelo, cancellationToken)
                .AsTask();
        }

        public void Eliminar(Vuelo vuelo)
        {
            _context.Vuelos.Remove(vuelo);
        }
    }
}
