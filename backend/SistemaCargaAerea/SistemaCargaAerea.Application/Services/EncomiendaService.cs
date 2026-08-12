using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Application.Mappings;
using SistemaCargaAerea.Domain.Entities;
using SistemaCargaAerea.Domain.Enums;
using SistemaCargaAerea.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Services
{
    public class EncomiendaService : IEncomiendaService
    {
        private readonly IEncomiendaRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public EncomiendaService(
            IEncomiendaRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IReadOnlyCollection<EncomiendaResponse>>
            ListarAsync(
                EstadoEncomienda? estado,
                long? vueloId,
                CancellationToken cancellationToken)
        {
            var encomiendas = await _repository.ListarAsync(
                estado,
                vueloId,
                cancellationToken);

            return encomiendas
                .Select(x => x.ToResponse())
                .ToList();
        }

        public async Task<EncomiendaResponse> ObtenerAsync(
            long id,
            CancellationToken cancellationToken)
        {
            var encomienda =
                await _repository.ObtenerPorIdAsync(
                    id,
                    cancellationToken)
                ?? throw new NotFoundException(
                    $"No se encontró la encomienda {id}.");

            return encomienda.ToResponse();
        }

        public async Task<EncomiendaResponse> CrearAsync(
            CrearEncomiendaRequest request,
            CancellationToken cancellationToken)
        {
            if (await _repository.ExisteCodigoAsync(
                    request.Codigo,
                    cancellationToken: cancellationToken))
            {
                throw new InvalidOperationException(
                    "Ya existe una encomienda con ese código.");
            }

            var encomienda = new Encomienda(
                request.Codigo,
                request.Descripcion,
                request.Peso,
                request.Remitente,
                request.Destinatario);

            await _repository.AgregarAsync(
                encomienda,
                cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return encomienda.ToResponse();
        }

        public async Task<EncomiendaResponse> ActualizarAsync(
            long id,
            ActualizarEncomiendaRequest request,
            CancellationToken cancellationToken)
        {
            var encomienda =
                await _repository.ObtenerPorIdAsync(
                    id,
                    cancellationToken)
                ?? throw new NotFoundException(
                    $"No se encontró la encomienda {id}.");

            if (await _repository.ExisteCodigoAsync(
                    request.Codigo,
                    id,
                    cancellationToken))
            {
                throw new InvalidOperationException(
                    "Ya existe otra encomienda con ese código.");
            }

            encomienda.Actualizar(
                request.Codigo,
                request.Descripcion,
                request.Peso,
                request.Remitente,
                request.Destinatario);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return encomienda.ToResponse();
        }

        public async Task EliminarAsync(
            long id,
            CancellationToken cancellationToken)
        {
            var encomienda =
                await _repository.ObtenerPorIdAsync(
                    id,
                    cancellationToken)
                ?? throw new NotFoundException(
                    $"No se encontró la encomienda {id}.");

            if (encomienda.Estado != EstadoEncomienda.EnAlmacen)
            {
                throw new InvalidOperationException(
                    "Solo se pueden eliminar encomiendas en almacén.");
            }

            _repository.Eliminar(encomienda);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
