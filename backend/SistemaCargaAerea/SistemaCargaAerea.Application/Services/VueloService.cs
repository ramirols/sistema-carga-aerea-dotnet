using SistemaCargaAerea.Application.DTOs.Vuelos;
using SistemaCargaAerea.Application.Exceptions;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Application.Mappings;
using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Services
{
    public class VueloService : IVueloService
    {
        private readonly IUnitOfWork _uow;
        private readonly IEncomiendaService _encomiendaService;

        public VueloService(IUnitOfWork uow, IEncomiendaService encomiendaService)
        {
            _uow = uow;
            _encomiendaService = encomiendaService;
        }

        public async Task<VueloResponse> ObtenerPorIdAsync(long id, CancellationToken ct)
        {
            var vuelo = await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Vuelo), id);

            return vuelo.ToResponse();
        }

        public async Task<List<VueloResponse>> ObtenerTodosAsync(CancellationToken ct)
        {
            var vuelos = await _uow.Vuelos.ObtenerTodosAsync(ct);
            return vuelos.ToResponse();
        }

        public async Task<VueloResponse> CrearAsync(CrearVueloRequest request, CancellationToken ct)
        {
            if (await _uow.Vuelos.ExisteCodigoVueloAsync(request.CodigoVuelo, idExcluir: null, ct))
                throw new InvalidOperationException(
                    $"Ya existe un vuelo con el código '{request.CodigoVuelo}'.");

            _ = await _uow.Destinos.ObtenerPorIdAsync(request.DestinoId, ct)
                ?? throw new NotFoundException(nameof(Destino), request.DestinoId);

            var estadoProgramado = await _uow.EstadosVuelo
                .ObtenerPorClaveAsync(EstadoVueloClave.Programado, ct);

            var vuelo = new Vuelo(
                request.CodigoVuelo,
                request.DestinoId,
                request.FechaVuelo,
                request.HoraVuelo,
                request.PesoMaximo,
                estadoProgramado);

            _uow.Vuelos.Agregar(vuelo);
            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Vuelos.ObtenerPorIdAsync(vuelo.Id, incluirRelaciones: true, ct))!
                .ToResponse();
        }

        public async Task<VueloResponse> ActualizarAsync(long id, ActualizarVueloRequest request, CancellationToken ct)
        {
            var vuelo = await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Vuelo), id);

            if (await _uow.Vuelos.ExisteCodigoVueloAsync(request.CodigoVuelo, idExcluir: id, ct))
                throw new InvalidOperationException(
                    $"Ya existe otro vuelo con el código '{request.CodigoVuelo}'.");

            _ = await _uow.Destinos.ObtenerPorIdAsync(request.DestinoId, ct)
                ?? throw new NotFoundException(nameof(Destino), request.DestinoId);

            vuelo.Actualizar(
                request.CodigoVuelo,
                request.DestinoId,
                request.FechaVuelo,
                request.HoraVuelo,
                request.PesoMaximo);

            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct))!
                .ToResponse();
        }

        public async Task EliminarAsync(long id, CancellationToken ct)
        {
            var vuelo = await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Vuelo), id);

            if (vuelo.Estado?.Clave != EstadoVueloClave.Programado)
                throw new InvalidOperationException(
                    "Solo se puede eliminar un vuelo en estado 'Programado'.");

            if (await _uow.Encomiendas.ExisteConVueloAsync(id, ct))
                throw new InvalidOperationException(
                    "No se puede eliminar el vuelo porque tiene encomiendas asignadas.");

            _uow.Vuelos.Eliminar(vuelo);
            await _uow.GuardarCambiosAsync(ct);
        }

        public async Task<VueloResponse> IniciarVueloAsync(long id, CancellationToken ct)
        {
            var vuelo = await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Vuelo), id);

            var estadoEnVuelo = await _uow.EstadosVuelo
                .ObtenerPorClaveAsync(EstadoVueloClave.EnVuelo, ct);

            vuelo.IniciarVuelo(estadoEnVuelo);

            await _encomiendaService.MarcarEncomiendasComoEmbarcadasAsync(id, ct);

            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct))!
                .ToResponse();
        }

        public async Task<VueloResponse> AterrizarAsync(long id, CancellationToken ct)
        {
            var vuelo = await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Vuelo), id);

            var estadoAterrizado = await _uow.EstadosVuelo
                .ObtenerPorClaveAsync(EstadoVueloClave.Aterrizado, ct);

            vuelo.Aterrizar(estadoAterrizado);
            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct))!
                .ToResponse();
        }

        public async Task<VueloResponse> CancelarAsync(long id, CancellationToken ct)
        {
            var vuelo = await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Vuelo), id);

            var estadoCancelado = await _uow.EstadosVuelo
                .ObtenerPorClaveAsync(EstadoVueloClave.Cancelado, ct);

            vuelo.Cancelar(estadoCancelado);
            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Vuelos.ObtenerPorIdAsync(id, incluirRelaciones: true, ct))!
                .ToResponse();
        }
    }
}
