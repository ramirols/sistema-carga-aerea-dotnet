using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data.Configurations
{
    public class EstadoVueloConfiguration : IEntityTypeConfiguration<EstadoVuelo>
    {
        public void Configure(EntityTypeBuilder<EstadoVuelo> builder)
        {
            builder.ToTable("EstadosVuelo");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Nombre)
                .HasMaxLength(80)
                .IsRequired();

            builder.Property(x => x.Clave)
                .HasConversion<string>()
                .HasMaxLength(30);
        }
    }
}