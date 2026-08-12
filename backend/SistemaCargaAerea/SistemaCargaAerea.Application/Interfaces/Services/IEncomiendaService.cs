using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IEncomiendaService
    {
        Task<IReadOnlyCollection<EncomiendaResponse>> ListarAsync(
            EstadoEncomienda? estado,
            long? vueloId,
            CancellationToken cancellationToken);

        Task<EncomiendaResponse> ObtenerAsync(
            long id,
            CancellationToken cancellationToken);

        Task<EncomiendaResponse> CrearAsync(
            CrearEncomiendaRequest request,
            CancellationToken cancellationToken);

        Task<EncomiendaResponse> ActualizarAsync(
            long id,
            ActualizarEncomiendaRequest request,
            CancellationToken cancellationToken);

        Task EliminarAsync(
            long id,
            CancellationToken cancellationToken);
    }
}
