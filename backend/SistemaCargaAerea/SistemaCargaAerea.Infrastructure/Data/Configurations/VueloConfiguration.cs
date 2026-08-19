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

            builder.Property(x => x.FechaVuelo)
                .HasColumnType("date")
                .IsRequired();

            builder.Property(x => x.HoraVuelo)
                .HasColumnType("time")
                .IsRequired();

            builder.Property(x => x.PesoMaximo)
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(x => x.PesoAsignado)
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(x => x.FechaCreacion)
                .IsRequired();

            builder.Property(x => x.Version)
                .IsRowVersion();

            builder.HasOne(x => x.Destino)
                .WithMany()
                .HasForeignKey(x => x.DestinoId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Estado)
                .WithMany()
                .HasForeignKey(x => x.EstadoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
