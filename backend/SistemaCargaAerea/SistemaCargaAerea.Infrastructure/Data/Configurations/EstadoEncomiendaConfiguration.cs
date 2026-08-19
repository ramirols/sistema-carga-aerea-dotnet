using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data.Configurations
{
    public class EstadoEncomiendaConfiguration : IEntityTypeConfiguration<EstadoEncomienda>
    {
        public void Configure(EntityTypeBuilder<EstadoEncomienda> builder)
        {
            builder.ToTable("EstadosEncomienda");
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