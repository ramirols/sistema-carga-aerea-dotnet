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
            : base(options)
        {
        }

        public DbSet<Vuelo> Vuelos => Set<Vuelo>();

        public DbSet<Encomienda> Encomiendas => Set<Encomienda>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly);
        }
    }
}
