using Microsoft.EntityFrameworkCore;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Repositories
{
    public class PersonaRepository : IPersonaRepository
    {
        private readonly AppDbContext _context;

        public PersonaRepository(AppDbContext context) => _context = context;

        public Task<Persona?> ObtenerPorIdAsync(long id, CancellationToken ct) =>
            _context.Personas.FirstOrDefaultAsync(x => x.Id == id, ct);

        public Task<Persona?> ObtenerPorDocumentoAsync(string documento, CancellationToken ct) =>
            _context.Personas.FirstOrDefaultAsync(
                x => x.Documento == documento.Trim(), ct);

        public Task<List<Persona>> ObtenerTodosAsync(CancellationToken ct) =>
            _context.Personas.AsNoTracking().OrderBy(x => x.Nombre).ToListAsync(ct);

        public void Agregar(Persona persona) => _context.Personas.Add(persona);
    }
}