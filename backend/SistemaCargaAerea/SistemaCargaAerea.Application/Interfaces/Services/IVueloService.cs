using SistemaCargaAerea.Application.DTOs.Vuelos;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IVueloService
    {
        Task<IReadOnlyCollection<VueloResponse>> ListarAsync(
            string? destino,
            EstadoVuelo? estado,
            CancellationToken cancellationToken);

        Task<VueloResponse> ObtenerAsync(
            long id,
            CancellationToken cancellationToken);

        Task<VueloResponse> CrearAsync(
            CrearVueloRequest request,
            CancellationToken cancellationToken);

        Task<VueloResponse> ActualizarAsync(
            long id,
            ActualizarVueloRequest request,
            CancellationToken cancellationToken);

        Task EliminarAsync(
            long id,
            CancellationToken cancellationToken);

        Task AsignarEncomiendasAsync(
            long vueloId,
            IReadOnlyCollection<long> encomiendaIds,
            CancellationToken cancellationToken);

        Task AutorizarDespachoAsync(
            long vueloId,
            CancellationToken cancellationToken);

        Task CancelarAsync(
            long vueloId,
            CancellationToken cancellationToken);
    }
}
