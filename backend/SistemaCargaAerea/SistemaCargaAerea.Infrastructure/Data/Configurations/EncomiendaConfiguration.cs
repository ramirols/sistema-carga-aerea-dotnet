using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data.Configurations
{
    public class EncomiendaConfiguration : IEntityTypeConfiguration<Encomienda>
    {
        public void Configure(EntityTypeBuilder<Encomienda> builder)
        {
            builder.ToTable("Encomiendas");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Codigo)
                .HasMaxLength(30)
                .IsRequired();

            builder.HasIndex(x => x.Codigo)
                .IsUnique();

            builder.Property(x => x.Descripcion)
                .HasMaxLength(120)
                .IsRequired();

            builder.Property(x => x.Peso)
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(x => x.FechaRegistro)
                .IsRequired();

            builder.HasOne(x => x.Remitente)
                .WithMany()
                .HasForeignKey(x => x.RemitenteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Destinatario)
                .WithMany()
                .HasForeignKey(x => x.DestinatarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Estado)
                .WithMany()
                .HasForeignKey(x => x.EstadoId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Vuelo)
                .WithMany()
                .HasForeignKey(x => x.VueloId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
