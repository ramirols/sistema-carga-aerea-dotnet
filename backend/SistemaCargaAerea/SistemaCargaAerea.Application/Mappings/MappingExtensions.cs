using SistemaCargaAerea.Application.DTOs.Destinos;
using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Application.DTOs.Estados;
using SistemaCargaAerea.Application.DTOs.Personas;
using SistemaCargaAerea.Application.DTOs.Roles;
using SistemaCargaAerea.Application.DTOs.Usuarios;
using SistemaCargaAerea.Application.DTOs.Vuelos;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Mappings
{
    public static class MappingExtensions
    {
        public static DestinoResponse ToResponse(this Destino destino) =>
            new()
            {
                Id = destino.Id,
                Nombre = destino.Nombre,
                CodigoIATA = destino.CodigoIATA,
                Pais = destino.Pais
            };

        public static PersonaResponse ToResponse(this Persona persona) =>
            new()
            {
                Id = persona.Id,
                Nombre = persona.Nombre,
                Documento = persona.Documento,
                Telefono = persona.Telefono,
                Email = persona.Email,
                Direccion = persona.Direccion
            };

        public static EstadoEncomiendaResponse ToResponse(this EstadoEncomienda estado) =>
            new()
            {
                Id = estado.Id,
                Nombre = estado.Nombre,
                EsDelSistema = estado.Clave is not null
            };

        public static EstadoVueloResponse ToResponse(this EstadoVuelo estado) =>
            new()
            {
                Id = estado.Id,
                Nombre = estado.Nombre,
                EsDelSistema = estado.Clave is not null
            };

        public static RolResponse ToResponse(this Rol rol) =>
            new()
            {
                Id = rol.Id,
                Nombre = rol.Nombre,
                EsDelSistema = rol.Clave is not null
            };

        public static UsuarioResponse ToResponse(this Usuario usuario) =>
            new()
            {
                Id = usuario.Id,
                NombreUsuario = usuario.NombreUsuario,
                Rol = usuario.Rol?.Nombre ?? string.Empty,
                Activo = usuario.Activo,
                FechaCreacion = usuario.FechaCreacion
            };

        public static VueloResponse ToResponse(this Vuelo vuelo) =>
            new()
            {
                Id = vuelo.Id,
                CodigoVuelo = vuelo.CodigoVuelo,
                Destino = vuelo.Destino?.Nombre ?? string.Empty,
                FechaVuelo = vuelo.FechaVuelo,
                HoraVuelo = vuelo.HoraVuelo,
                PesoMaximo = vuelo.PesoMaximo,
                PesoAsignado = vuelo.PesoAsignado,
                PesoDisponible = vuelo.PesoMaximo - vuelo.PesoAsignado,
                Estado = vuelo.Estado?.Nombre ?? string.Empty
            };

        public static EncomiendaResponse ToResponse(this Encomienda encomienda) =>
            new()
            {
                Id = encomienda.Id,
                Codigo = encomienda.Codigo,
                Descripcion = encomienda.Descripcion,
                Peso = encomienda.Peso,
                Remitente = encomienda.Remitente?.Nombre ?? string.Empty,
                Destinatario = encomienda.Destinatario?.Nombre ?? string.Empty,
                Estado = encomienda.Estado?.Nombre ?? string.Empty,
                VueloCodigo = encomienda.Vuelo?.CodigoVuelo,
                FechaRegistro = encomienda.FechaRegistro
            };

        // ── LISTAS ──
        public static List<DestinoResponse> ToResponse(this IEnumerable<Destino> destinos) =>
            destinos.Select(d => d.ToResponse()).ToList();

        public static List<PersonaResponse> ToResponse(this IEnumerable<Persona> personas) =>
            personas.Select(p => p.ToResponse()).ToList();

        public static List<EstadoEncomiendaResponse> ToResponse(this IEnumerable<EstadoEncomienda> estados) =>
            estados.Select(e => e.ToResponse()).ToList();

        public static List<EstadoVueloResponse> ToResponse(this IEnumerable<EstadoVuelo> estados) =>
            estados.Select(e => e.ToResponse()).ToList();

        public static List<RolResponse> ToResponse(this IEnumerable<Rol> roles) =>
            roles.Select(r => r.ToResponse()).ToList();

        public static List<UsuarioResponse> ToResponse(this IEnumerable<Usuario> usuarios) =>
            usuarios.Select(u => u.ToResponse()).ToList();

        public static List<VueloResponse> ToResponse(this IEnumerable<Vuelo> vuelos) =>
            vuelos.Select(v => v.ToResponse()).ToList();

        public static List<EncomiendaResponse> ToResponse(this IEnumerable<Encomienda> encomiendas) =>
            encomiendas.Select(e => e.ToResponse()).ToList();
    }
}
