using Microsoft.EntityFrameworkCore;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Destino> Destinos => Set<Destino>();
        public DbSet<Persona> Personas => Set<Persona>();
        public DbSet<EstadoEncomienda> EstadosEncomienda => Set<EstadoEncomienda>();
        public DbSet<EstadoVuelo> EstadosVuelo => Set<EstadoVuelo>();
        public DbSet<Rol> Roles => Set<Rol>();
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Vuelo> Vuelos => Set<Vuelo>();
        public DbSet<Encomienda> Encomiendas => Set<Encomienda>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
