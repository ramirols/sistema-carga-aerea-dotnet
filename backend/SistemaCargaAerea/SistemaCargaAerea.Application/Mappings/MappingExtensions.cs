using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Application.DTOs.Vuelos;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Mappings
{
    public static class MappingExtensions
    {
        public static VueloResponse ToResponse(this Vuelo vuelo)
        {
            return new VueloResponse(
                vuelo.Id,
                vuelo.CodigoVuelo,
                vuelo.Destino,
                vuelo.FechaVuelo,
                vuelo.HoraVuelo,
                vuelo.PesoMaximo,
                vuelo.PesoActual,
                vuelo.PesoDisponible,
                vuelo.Estado);
        }

        public static EncomiendaResponse ToResponse(
            this Encomienda encomienda)
        {
            return new EncomiendaResponse(
                encomienda.Id,
                encomienda.Codigo,
                encomienda.Descripcion,
                encomienda.Peso,
                encomienda.Remitente,
                encomienda.Destinatario,
                encomienda.Estado,
                encomienda.VueloId,
                encomienda.Vuelo?.CodigoVuelo);
        }
    }
}
