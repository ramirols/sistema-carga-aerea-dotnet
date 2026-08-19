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
    public class EstadoVueloRepository : IEstadoVueloRepository
    {
        private readonly AppDbContext _context;

        public EstadoVueloRepository(AppDbContext context) => _context = context;

        public Task<EstadoVuelo?> ObtenerPorIdAsync(long id, CancellationToken ct) =>
            _context.EstadosVuelo.FirstOrDefaultAsync(x => x.Id == id, ct);

        public async Task<EstadoVuelo> ObtenerPorClaveAsync(EstadoVueloClave clave, CancellationToken ct)
        {
            return await _context.EstadosVuelo
                .FirstOrDefaultAsync(e => e.Clave == clave, ct)
                ?? throw new InvalidOperationException(
                    $"Estado de vuelo con clave '{clave}' no encontrado. Verifique el seeding.");
        }

        public Task<List<EstadoVuelo>> ObtenerTodosAsync(CancellationToken ct) =>
            _context.EstadosVuelo.AsNoTracking().ToListAsync(ct);

        public void Agregar(EstadoVuelo estado) => _context.EstadosVuelo.Add(estado);

        public void Eliminar(EstadoVuelo estado) => _context.EstadosVuelo.Remove(estado);
    }
}