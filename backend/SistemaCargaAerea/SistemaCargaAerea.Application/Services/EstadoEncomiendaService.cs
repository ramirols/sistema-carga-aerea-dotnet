using SistemaCargaAerea.Application.DTOs.Estados;
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
    public class EstadoEncomiendaService : IEstadoEncomiendaService
    {
        private readonly IUnitOfWork _uow;

        public EstadoEncomiendaService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<EstadoEncomiendaResponse> ObtenerPorIdAsync(long id, CancellationToken ct)
        {
            var estado = await _uow.EstadosEncomienda.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(EstadoEncomienda), id);

            return estado.ToResponse();
        }

        public async Task<List<EstadoEncomiendaResponse>> ObtenerTodosAsync(CancellationToken ct)
        {
            var estados = await _uow.EstadosEncomienda.ObtenerTodosAsync(ct);
            return estados.ToResponse();
        }

        public async Task<EstadoEncomiendaResponse> CrearAsync(CrearEstadoEncomiendaRequest request, CancellationToken ct)
        {
            var estado = new EstadoEncomienda(request.Nombre);

            _uow.EstadosEncomienda.Agregar(estado);
            await _uow.GuardarCambiosAsync(ct);

            return estado.ToResponse();
        }

        public async Task<EstadoEncomiendaResponse> ActualizarAsync(long id, ActualizarEstadoEncomiendaRequest request, CancellationToken ct)
        {
            var estado = await _uow.EstadosEncomienda.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(EstadoEncomienda), id);

            estado.Renombrar(request.Nombre);
            await _uow.GuardarCambiosAsync(ct);

            return estado.ToResponse();
        }

        public async Task EliminarAsync(long id, CancellationToken ct)
        {
            var estado = await _uow.EstadosEncomienda.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(EstadoEncomienda), id);

            estado.ValidarEliminable();

            if (await _uow.Encomiendas.ExisteConEstadoAsync(id, ct))
                throw new InvalidOperationException(
                    $"No se puede eliminar el estado '{estado.Nombre}' porque tiene encomiendas asociadas.");

            _uow.EstadosEncomienda.Eliminar(estado);
            await _uow.GuardarCambiosAsync(ct);
        }
    }
}
