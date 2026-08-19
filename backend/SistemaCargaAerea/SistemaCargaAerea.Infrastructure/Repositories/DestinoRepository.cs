using Microsoft.EntityFrameworkCore;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Repositories
{
    public class DestinoRepository : IDestinoRepository
    {
        private readonly AppDbContext _context;

        public DestinoRepository(AppDbContext context) => _context = context;

        public Task<Destino?> ObtenerPorIdAsync(long id, CancellationToken ct) =>
            _context.Destinos.FirstOrDefaultAsync(x => x.Id == id, ct);

        public Task<List<Destino>> ObtenerTodosAsync(CancellationToken ct) =>
            _context.Destinos.AsNoTracking().OrderBy(x => x.Nombre).ToListAsync(ct);

        public Task<bool> ExisteCodigoIATAAsync(string codigoIATA, long? idExcluir, CancellationToken ct)
        {
            var codigo = codigoIATA.Trim().ToUpperInvariant();
            return _context.Destinos.AnyAsync(
                x => x.CodigoIATA == codigo && (!idExcluir.HasValue || x.Id != idExcluir.Value), ct);
        }

        public void Agregar(Destino destino) => _context.Destinos.Add(destino);

        public void Eliminar(Destino destino) => _context.Destinos.Remove(destino);
    }
}
