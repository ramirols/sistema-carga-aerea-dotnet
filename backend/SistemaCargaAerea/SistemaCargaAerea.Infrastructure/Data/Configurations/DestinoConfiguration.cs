using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data.Configurations
{
    public class DestinoConfiguration : IEntityTypeConfiguration<Destino>
    {
        public void Configure(EntityTypeBuilder<Destino> builder)
        {
            builder.ToTable("Destinos");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Nombre)
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(x => x.CodigoIATA)
                .HasMaxLength(3)
                .IsRequired();

            builder.HasIndex(x => x.CodigoIATA)
                .IsUnique();

            builder.Property(x => x.Pais)
                .HasMaxLength(100)
                .IsRequired();
        }
    }
}