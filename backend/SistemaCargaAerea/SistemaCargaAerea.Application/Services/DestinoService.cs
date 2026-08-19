using SistemaCargaAerea.Application.DTOs.Destinos;
using SistemaCargaAerea.Application.Exceptions;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Application.Mappings;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Services
{
    public class DestinoService : IDestinoService
    {
        private readonly IUnitOfWork _uow;

        public DestinoService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<DestinoResponse> ObtenerPorIdAsync(long id, CancellationToken ct)
        {
            var destino = await _uow.Destinos.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Destino), id);

            return destino.ToResponse();
        }

        public async Task<List<DestinoResponse>> ObtenerTodosAsync(CancellationToken ct)
        {
            var destinos = await _uow.Destinos.ObtenerTodosAsync(ct);
            return destinos.ToResponse();
        }

        public async Task<DestinoResponse> CrearAsync(CrearDestinoRequest request, CancellationToken ct)
        {
            var codigoExiste = await _uow.Destinos.ExisteCodigoIATAAsync(
                request.CodigoIATA, idExcluir: null, ct);

            if (codigoExiste)
                throw new InvalidOperationException(
                    $"Ya existe un destino con el código IATA '{request.CodigoIATA}'.");

            var destino = new Destino(request.Nombre, request.CodigoIATA, request.Pais);

            _uow.Destinos.Agregar(destino);
            await _uow.GuardarCambiosAsync(ct);

            return destino.ToResponse();
        }

        public async Task<DestinoResponse> ActualizarAsync(long id, ActualizarDestinoRequest request, CancellationToken ct)
        {
            var destino = await _uow.Destinos.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Destino), id);

            var codigoExiste = await _uow.Destinos.ExisteCodigoIATAAsync(
                request.CodigoIATA, idExcluir: id, ct);

            if (codigoExiste)
                throw new InvalidOperationException(
                    $"Ya existe un destino con el código IATA '{request.CodigoIATA}'.");

            destino.Actualizar(request.Nombre, request.CodigoIATA, request.Pais);
            await _uow.GuardarCambiosAsync(ct);

            return destino.ToResponse();
        }

        public async Task EliminarAsync(long id, CancellationToken ct)
        {
            var destino = await _uow.Destinos.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Destino), id);

            if (await _uow.Vuelos.ExisteConDestinoAsync(id, ct))
                throw new InvalidOperationException(
                    "No se puede eliminar el destino porque tiene vuelos asociados.");

            _uow.Destinos.Eliminar(destino);
            await _uow.GuardarCambiosAsync(ct);
        }
    }
}
