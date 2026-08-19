using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Application.DTOs.Vuelos;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IEncomiendaService
    {
        Task<EncomiendaResponse> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<EncomiendaResponse>> ObtenerTodosAsync(CancellationToken ct);
        Task<EncomiendaResponse> CrearAsync(CrearEncomiendaRequest request, CancellationToken ct);
        Task<EncomiendaResponse> ActualizarAsync(long id, ActualizarEncomiendaRequest request, CancellationToken ct);
        Task EliminarAsync(long id, CancellationToken ct);
        Task<VueloResponse> AsignarAVueloAsync(long vueloId, AsignarEncomiendasRequest request, CancellationToken ct);
        Task<EncomiendaResponse> LiberarDeVueloAsync(long encomiendaId, CancellationToken ct);
        Task MarcarEncomiendasComoEmbarcadasAsync(long vueloId, CancellationToken ct);
    }
}
