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
    public class RolRepository : IRolRepository
    {
        private readonly AppDbContext _context;

        public RolRepository(AppDbContext context) => _context = context;

        public Task<Rol?> ObtenerPorIdAsync(long id, CancellationToken ct) =>
            _context.Roles.FirstOrDefaultAsync(x => x.Id == id, ct);

        public async Task<Rol> ObtenerPorClaveAsync(RolClave clave, CancellationToken ct)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(r => r.Clave == clave, ct)
                ?? throw new InvalidOperationException(
                    $"Rol con clave '{clave}' no encontrado. Verifique el seeding.");
        }

        public Task<List<Rol>> ObtenerTodosAsync(CancellationToken ct) =>
            _context.Roles.AsNoTracking().ToListAsync(ct);

        public void Agregar(Rol rol) => _context.Roles.Add(rol);

        public void Eliminar(Rol rol) => _context.Roles.Remove(rol);
    }
}