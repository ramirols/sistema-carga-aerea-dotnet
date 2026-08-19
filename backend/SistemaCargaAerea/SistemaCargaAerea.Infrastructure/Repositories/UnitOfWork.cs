using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IDestinoRepository Destinos { get; }
        public IPersonaRepository Personas { get; }
        public IEstadoEncomiendaRepository EstadosEncomienda { get; }
        public IEstadoVueloRepository EstadosVuelo { get; }
        public IRolRepository Roles { get; }
        public IUsuarioRepository Usuarios { get; }
        public IVueloRepository Vuelos { get; }
        public IEncomiendaRepository Encomiendas { get; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Destinos = new DestinoRepository(context);
            Personas = new PersonaRepository(context);
            EstadosEncomienda = new EstadoEncomiendaRepository(context);
            EstadosVuelo = new EstadoVueloRepository(context);
            Roles = new RolRepository(context);
            Usuarios = new UsuarioRepository(context);
            Vuelos = new VueloRepository(context);
            Encomiendas = new EncomiendaRepository(context);
        }

        public Task<int> GuardarCambiosAsync(CancellationToken ct = default) =>
            _context.SaveChangesAsync(ct);
    }
}
