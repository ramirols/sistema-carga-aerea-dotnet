using SistemaCargaAerea.Application.DTOs.Estados;
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
    public class EstadoVueloService : IEstadoVueloService
    {
        private readonly IUnitOfWork _uow;

        public EstadoVueloService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<EstadoVueloResponse> ObtenerPorIdAsync(long id, CancellationToken ct)
        {
            var estado = await _uow.EstadosVuelo.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(EstadoVuelo), id);

            return estado.ToResponse();
        }

        public async Task<List<EstadoVueloResponse>> ObtenerTodosAsync(CancellationToken ct)
        {
            var estados = await _uow.EstadosVuelo.ObtenerTodosAsync(ct);
            return estados.ToResponse();
        }

        public async Task<EstadoVueloResponse> CrearAsync(CrearEstadoVueloRequest request, CancellationToken ct)
        {
            var estado = new EstadoVuelo(request.Nombre);

            _uow.EstadosVuelo.Agregar(estado);
            await _uow.GuardarCambiosAsync(ct);

            return estado.ToResponse();
        }

        public async Task<EstadoVueloResponse> ActualizarAsync(long id, ActualizarEstadoVueloRequest request, CancellationToken ct)
        {
            var estado = await _uow.EstadosVuelo.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(EstadoVuelo), id);

            estado.Renombrar(request.Nombre);
            await _uow.GuardarCambiosAsync(ct);

            return estado.ToResponse();
        }

        public async Task EliminarAsync(long id, CancellationToken ct)
        {
            var estado = await _uow.EstadosVuelo.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(EstadoVuelo), id);

            estado.ValidarEliminable();

            if (await _uow.Vuelos.ExisteConEstadoAsync(id, ct))
                throw new InvalidOperationException(
                    $"No se puede eliminar el estado '{estado.Nombre}' porque tiene vuelos asociados.");

            _uow.EstadosVuelo.Eliminar(estado);
            await _uow.GuardarCambiosAsync(ct);
        }
    }
}
