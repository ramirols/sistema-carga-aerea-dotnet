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
    public class EstadoEncomiendaRepository : IEstadoEncomiendaRepository
    {
        private readonly AppDbContext _context;

        public EstadoEncomiendaRepository(AppDbContext context) => _context = context;

        public Task<EstadoEncomienda?> ObtenerPorIdAsync(long id, CancellationToken ct) =>
            _context.EstadosEncomienda.FirstOrDefaultAsync(x => x.Id == id, ct);

        public async Task<EstadoEncomienda> ObtenerPorClaveAsync(EstadoEncomiendaClave clave, CancellationToken ct)
        {
            return await _context.EstadosEncomienda
                .FirstOrDefaultAsync(e => e.Clave == clave, ct)
                ?? throw new InvalidOperationException(
                    $"Estado de encomienda con clave '{clave}' no encontrado. Verifique el seeding.");
        }

        public Task<List<EstadoEncomienda>> ObtenerTodosAsync(CancellationToken ct) =>
            _context.EstadosEncomienda.AsNoTracking().ToListAsync(ct);

        public void Agregar(EstadoEncomienda estado) => _context.EstadosEncomienda.Add(estado);

        public void Eliminar(EstadoEncomienda estado) => _context.EstadosEncomienda.Remove(estado);
    }
}