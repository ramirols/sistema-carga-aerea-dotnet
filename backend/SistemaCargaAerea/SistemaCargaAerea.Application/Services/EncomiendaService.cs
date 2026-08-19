using SistemaCargaAerea.Application.DTOs.Encomiendas;
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
    public class EncomiendaService : IEncomiendaService
    {
        private readonly IUnitOfWork _uow;

        public EncomiendaService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<EncomiendaResponse> ObtenerPorIdAsync(long id, CancellationToken ct)
        {
            var encomienda = await _uow.Encomiendas.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Encomienda), id);

            return encomienda.ToResponse();
        }

        public async Task<List<EncomiendaResponse>> ObtenerTodosAsync(CancellationToken ct)
        {
            var encomiendas = await _uow.Encomiendas.ObtenerTodosAsync(ct);
            return encomiendas.ToResponse();
        }

        public async Task<EncomiendaResponse> CrearAsync(CrearEncomiendaRequest request, CancellationToken ct)
        {
            if (await _uow.Encomiendas.ExisteCodigoAsync(request.Codigo, idExcluir: null, ct))
                throw new InvalidOperationException(
                    $"Ya existe una encomienda con el código '{request.Codigo}'.");

            _ = await _uow.Personas.ObtenerPorIdAsync(request.RemitenteId, ct)
                ?? throw new NotFoundException(nameof(Persona), request.RemitenteId);

            _ = await _uow.Personas.ObtenerPorIdAsync(request.DestinatarioId, ct)
                ?? throw new NotFoundException(nameof(Persona), request.DestinatarioId);

            var estadoEnAlmacen = await _uow.EstadosEncomienda
                .ObtenerPorClaveAsync(EstadoEncomiendaClave.EnAlmacen, ct);

            var encomienda = new Encomienda(
                request.Codigo,
                request.Descripcion,
                request.Peso,
                request.RemitenteId,
                request.DestinatarioId,
                estadoEnAlmacen);

            _uow.Encomiendas.Agregar(encomienda);
            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Encomiendas.ObtenerPorIdAsync(encomienda.Id, incluirRelaciones: true, ct))!
                .ToResponse();
        }

        public async Task<EncomiendaResponse> ActualizarAsync(long id, ActualizarEncomiendaRequest request, CancellationToken ct)
        {
            var encomienda = await _uow.Encomiendas.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Encomienda), id);

            if (await _uow.Encomiendas.ExisteCodigoAsync(request.Codigo, idExcluir: id, ct))
                throw new InvalidOperationException(
                    $"Ya existe otra encomienda con el código '{request.Codigo}'.");

            _ = await _uow.Personas.ObtenerPorIdAsync(request.RemitenteId, ct)
                ?? throw new NotFoundException(nameof(Persona), request.RemitenteId);

            _ = await _uow.Personas.ObtenerPorIdAsync(request.DestinatarioId, ct)
                ?? throw new NotFoundException(nameof(Persona), request.DestinatarioId);

            encomienda.Actualizar(
                request.Codigo,
                request.Descripcion,
                request.Peso,
                request.RemitenteId,
                request.DestinatarioId);

            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Encomiendas.ObtenerPorIdAsync(id, incluirRelaciones: true, ct))!
                .ToResponse();
        }

        public async Task EliminarAsync(long id, CancellationToken ct)
        {
            var encomienda = await _uow.Encomiendas.ObtenerPorIdAsync(id, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Encomienda), id);

            if (encomienda.Estado?.Clave != EstadoEncomiendaClave.EnAlmacen)
                throw new InvalidOperationException(
                    "Solo se pueden eliminar encomiendas en estado 'En almacén'.");

            _uow.Encomiendas.Eliminar(encomienda);
            await _uow.GuardarCambiosAsync(ct);
        }

        public async Task<VueloResponse> AsignarAVueloAsync(
            long vueloId,
            AsignarEncomiendasRequest request,
            CancellationToken ct)
        {
            var vuelo = await _uow.Vuelos.ObtenerPorIdAsync(vueloId, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Vuelo), vueloId);

            var ids = request.EncomiendaIds.Distinct().ToList();

            var encomiendas = await _uow.Encomiendas.ObtenerPorIdsAsync(ids, incluirRelaciones: true, ct);

            if (encomiendas.Count != ids.Count)
                throw new NotFoundException("Una o más encomiendas no fueron encontradas.", 0);

            var estadoAsignada = await _uow.EstadosEncomienda
                .ObtenerPorClaveAsync(EstadoEncomiendaClave.Asignada, ct);

            foreach (var encomienda in encomiendas)
            {
                vuelo.AgregarPeso(encomienda.Peso);
                encomienda.AsignarAVuelo(vuelo, estadoAsignada);
            }

            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Vuelos.ObtenerPorIdAsync(vueloId, incluirRelaciones: true, ct))!
                .ToResponse();
        }

        public async Task<EncomiendaResponse> LiberarDeVueloAsync(long encomiendaId, CancellationToken ct)
        {
            var encomienda = await _uow.Encomiendas.ObtenerPorIdAsync(encomiendaId, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Encomienda), encomiendaId);

            if (encomienda.VueloId is null)
                throw new InvalidOperationException("La encomienda no está asignada a ningún vuelo.");

            var vuelo = await _uow.Vuelos.ObtenerPorIdAsync(encomienda.VueloId.Value, incluirRelaciones: true, ct)
                ?? throw new NotFoundException(nameof(Vuelo), encomienda.VueloId.Value);

            var estadoEnAlmacen = await _uow.EstadosEncomienda
                .ObtenerPorClaveAsync(EstadoEncomiendaClave.EnAlmacen, ct);

            vuelo.QuitarPeso(encomienda.Peso);
            encomienda.LiberarDeVuelo(estadoEnAlmacen);

            await _uow.GuardarCambiosAsync(ct);

            return (await _uow.Encomiendas.ObtenerPorIdAsync(encomiendaId, incluirRelaciones: true, ct))!
                .ToResponse();
        }


        public async Task MarcarEncomiendasComoEmbarcadasAsync(long vueloId, CancellationToken ct)
        {
            var encomiendas = await _uow.Encomiendas.ObtenerPorIdsAsync(
                await ObtenerIdsAsignadasAlVueloAsync(vueloId, ct),
                incluirRelaciones: true,
                ct);

            var estadoEmbarcada = await _uow.EstadosEncomienda
                .ObtenerPorClaveAsync(EstadoEncomiendaClave.Embarcada, ct);

            foreach (var encomienda in encomiendas)
                encomienda.MarcarComoEmbarcada(estadoEmbarcada);
        }

        private async Task<List<long>> ObtenerIdsAsignadasAlVueloAsync(long vueloId, CancellationToken ct)
        {
            var todas = await _uow.Encomiendas.ObtenerTodosAsync(ct);
            return todas
                .Where(e => e.VueloId == vueloId && e.Estado?.Clave == EstadoEncomiendaClave.Asignada)
                .Select(e => e.Id)
                .ToList();
        }
    }
}
