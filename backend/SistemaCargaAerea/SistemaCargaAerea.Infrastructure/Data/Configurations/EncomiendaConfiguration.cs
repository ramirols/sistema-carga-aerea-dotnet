using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data.Configurations
{
    public class EncomiendaConfiguration
    : IEntityTypeConfiguration<Encomienda>
    {
        public void Configure(EntityTypeBuilder<Encomienda> builder)
        {
            builder.ToTable("Encomiendas");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Codigo)
                .HasMaxLength(20)
                .IsRequired();

            builder.HasIndex(x => x.Codigo)
                .IsUnique();

            builder.Property(x => x.Descripcion)
                .HasMaxLength(250)
                .IsRequired();

            builder.Property(x => x.Peso)
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(x => x.Remitente)
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(x => x.Destinatario)
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(x => x.Estado)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.FechaRegistro)
                .IsRequired();

            builder.Property(x => x.Version)
                .IsRowVersion();

            builder.HasIndex(x => x.Estado);

            builder.HasIndex(x => x.VueloId);
        }
    }
}
