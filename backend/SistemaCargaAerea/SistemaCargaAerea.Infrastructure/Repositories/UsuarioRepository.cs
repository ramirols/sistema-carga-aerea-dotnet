using Microsoft.EntityFrameworkCore;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context) => _context = context;

        public Task<Usuario?> ObtenerPorIdAsync(long id, CancellationToken ct) =>
            _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(x => x.Id == id, ct);

        public Task<Usuario?> ObtenerPorNombreUsuarioAsync(
            string nombreUsuario, bool incluirRol, CancellationToken ct)
        {
            var query = _context.Usuarios.AsQueryable();
            if (incluirRol) query = query.Include(u => u.Rol);
            return query.FirstOrDefaultAsync(x => x.NombreUsuario == nombreUsuario, ct);
        }

        public Task<bool> ExisteNombreUsuarioAsync(string nombreUsuario, CancellationToken ct) =>
            _context.Usuarios.AnyAsync(x => x.NombreUsuario == nombreUsuario, ct);

        public Task<bool> ExisteConRolAsync(long rolId, CancellationToken ct) =>
            _context.Usuarios.AnyAsync(x => x.RolId == rolId, ct);
        public Task<List<Usuario>> ObtenerTodosAsync(CancellationToken ct) =>
            _context.Usuarios
                .AsNoTracking()
                .Include(u => u.Rol)
                .OrderBy(u => u.NombreUsuario)
                .ToListAsync(ct);

        public void Agregar(Usuario usuario) => _context.Usuarios.Add(usuario);
    }
}