using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Data.Configurations
{
    public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("Usuarios");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.NombreUsuario)
                .HasMaxLength(50)
                .IsRequired();

            builder.HasIndex(x => x.NombreUsuario)
                .IsUnique();

            builder.Property(x => x.PasswordHash)
                .HasMaxLength(256)
                .IsRequired();

            builder.Property(x => x.Activo)
                .IsRequired();

            builder.Property(x => x.FechaCreacion)
                .IsRequired();

            builder.HasOne(x => x.Rol)
                .WithMany()
                .HasForeignKey(x => x.RolId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}