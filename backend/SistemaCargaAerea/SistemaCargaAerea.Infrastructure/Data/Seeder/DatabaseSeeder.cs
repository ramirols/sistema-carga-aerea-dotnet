using Microsoft.EntityFrameworkCore;
using SistemaCargaAerea.Application.Interfaces.Security;
using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data.Seeding
{
    public class DatabaseSeeder
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher _hasher;

        public DatabaseSeeder(AppDbContext context, IPasswordHasher hasher)
        {
            _context = context;
            _hasher = hasher;
        }

        public async Task SembrarAsync(CancellationToken ct = default)
        {
            await _context.Database.MigrateAsync(ct);

            await SembrarEstadosEncomiendaAsync(ct);
            await SembrarEstadosVueloAsync(ct);
            await SembrarRolesAsync(ct);
            await SembrarAdminAsync(ct);

            await _context.SaveChangesAsync(ct);
        }

        private async Task SembrarEstadosEncomiendaAsync(CancellationToken ct)
        {
            if (await _context.EstadosEncomienda.AnyAsync(ct)) return;

            _context.EstadosEncomienda.AddRange(
                new EstadoEncomienda("En almacén", EstadoEncomiendaClave.EnAlmacen),
                new EstadoEncomienda("Asignada", EstadoEncomiendaClave.Asignada),
                new EstadoEncomienda("Embarcada", EstadoEncomiendaClave.Embarcada));
        }

        private async Task SembrarEstadosVueloAsync(CancellationToken ct)
        {
            if (await _context.EstadosVuelo.AnyAsync(ct)) return;

            _context.EstadosVuelo.AddRange(
                new EstadoVuelo("Programado", EstadoVueloClave.Programado),
                new EstadoVuelo("En vuelo", EstadoVueloClave.EnVuelo),
                new EstadoVuelo("Aterrizado", EstadoVueloClave.Aterrizado),
                new EstadoVuelo("Cancelado", EstadoVueloClave.Cancelado));
        }

        private async Task SembrarRolesAsync(CancellationToken ct)
        {
            if (await _context.Roles.AnyAsync(ct)) return;

            _context.Roles.AddRange(
                new Rol("Administrador", RolClave.Admin),
                new Rol("Operador", RolClave.Operador));
        }

        private async Task SembrarAdminAsync(CancellationToken ct)
        {
            if (await _context.Usuarios.AnyAsync(ct)) return;

            var rolAdmin = _context.ChangeTracker
                .Entries<Rol>()
                .Select(e => e.Entity)
                .First(r => r.Clave == RolClave.Admin);

            var hash = _hasher.Hash("Admin1234!");

            var admin = new Usuario("admin", hash, rolAdmin);
            _context.Usuarios.Add(admin);
        }
    }
}