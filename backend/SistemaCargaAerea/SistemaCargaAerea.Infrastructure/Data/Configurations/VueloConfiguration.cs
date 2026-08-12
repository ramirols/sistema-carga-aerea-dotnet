using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data.Configurations
{
    public class VueloConfiguration : IEntityTypeConfiguration<Vuelo>
    {
        public void Configure(EntityTypeBuilder<Vuelo> builder)
        {
            builder.ToTable("Vuelos");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.CodigoVuelo)
                .HasMaxLength(10)
                .IsRequired();

            builder.HasIndex(x => x.CodigoVuelo)
                .IsUnique();

            builder.Property(x => x.Destino)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.FechaVuelo)
                .HasColumnType("date")
                .IsRequired();

            builder.Property(x => x.HoraVuelo)
                .HasColumnType("time")
                .IsRequired();

            builder.Property(x => x.PesoMaximo)
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(x => x.PesoActual)
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(x => x.Estado)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.FechaCreacion)
                .IsRequired();

            builder.Property(x => x.Version)
                .IsRowVersion();

            builder.Ignore(x => x.PesoDisponible);

            builder.HasMany(x => x.Encomiendas)
                .WithOne(x => x.Vuelo)
                .HasForeignKey(x => x.VueloId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
