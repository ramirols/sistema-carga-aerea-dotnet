using SistemaCargaAerea.Application.DTOs.Vuelos;
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
    public class VueloService : IVueloService
    {
        private readonly IVueloRepository _vueloRepository;
        private readonly IEncomiendaRepository _encomiendaRepository;
        private readonly IUnitOfWork _unitOfWork;

        public VueloService(
            IVueloRepository vueloRepository,
            IEncomiendaRepository encomiendaRepository,
            IUnitOfWork unitOfWork)
        {
            _vueloRepository = vueloRepository;
            _encomiendaRepository = encomiendaRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IReadOnlyCollection<VueloResponse>>
            ListarAsync(
                string? destino,
                EstadoVuelo? estado,
                CancellationToken cancellationToken)
        {
            var vuelos = await _vueloRepository.ListarAsync(
                destino,
                estado,
                cancellationToken);

            return vuelos
                .Select(x => x.ToResponse())
                .ToList();
        }

        public async Task<VueloResponse> ObtenerAsync(
            long id,
            CancellationToken cancellationToken)
        {
            var vuelo = await ObtenerVueloAsync(
                id,
                false,
                cancellationToken);

            return vuelo.ToResponse();
        }

        public async Task<VueloResponse> CrearAsync(
            CrearVueloRequest request,
            CancellationToken cancellationToken)
        {
            if (await _vueloRepository.ExisteCodigoAsync(
                    request.CodigoVuelo,
                    cancellationToken: cancellationToken))
            {
                throw new InvalidOperationException(
                    "Ya existe un vuelo con ese código.");
            }

            var vuelo = new Vuelo(
                request.CodigoVuelo,
                request.Destino,
                request.FechaVuelo,
                request.HoraVuelo,
                request.PesoMaximo);

            await _vueloRepository.AgregarAsync(
                vuelo,
                cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return vuelo.ToResponse();
        }

        public async Task<VueloResponse> ActualizarAsync(
            long id,
            ActualizarVueloRequest request,
            CancellationToken cancellationToken)
        {
            var vuelo = await ObtenerVueloAsync(
                id,
                false,
                cancellationToken);

            if (await _vueloRepository.ExisteCodigoAsync(
                    request.CodigoVuelo,
                    id,
                    cancellationToken))
            {
                throw new InvalidOperationException(
                    "Ya existe otro vuelo con ese código.");
            }

            vuelo.Actualizar(
                request.CodigoVuelo,
                request.Destino,
                request.FechaVuelo,
                request.HoraVuelo,
                request.PesoMaximo);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return vuelo.ToResponse();
        }

        public async Task EliminarAsync(
            long id,
            CancellationToken cancellationToken)
        {
            var vuelo = await ObtenerVueloAsync(
                id,
                true,
                cancellationToken);

            if (vuelo.Encomiendas.Count != 0)
            {
                throw new InvalidOperationException(
                    "No se puede eliminar un vuelo con encomiendas.");
            }

            _vueloRepository.Eliminar(vuelo);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task AsignarEncomiendasAsync(
            long vueloId,
            IReadOnlyCollection<long> encomiendaIds,
            CancellationToken cancellationToken)
        {
            if (encomiendaIds.Count == 0)
                throw new ArgumentException(
                    "Debe seleccionar al menos una encomienda.");

            var idsSinDuplicados = encomiendaIds
                .Distinct()
                .ToArray();

            await _unitOfWork.EjecutarEnTransaccionAsync(
                async ct =>
                {
                    var vuelo = await ObtenerVueloAsync(
                        vueloId,
                        true,
                        ct);

                    var encomiendas =
                        await _encomiendaRepository.ObtenerPorIdsAsync(
                            idsSinDuplicados,
                            ct);

                    if (encomiendas.Count != idsSinDuplicados.Length)
                    {
                        throw new NotFoundException(
                            "Una o más encomiendas no existen.");
                    }

                    var pesoTotal = encomiendas.Sum(x => x.Peso);

                    vuelo.AgregarPeso(pesoTotal);

                    foreach (var encomienda in encomiendas)
                        encomienda.AsignarAVuelo(vuelo.Id);
                },
                cancellationToken);
        }

        public async Task AutorizarDespachoAsync(
            long vueloId,
            CancellationToken cancellationToken)
        {
            await _unitOfWork.EjecutarEnTransaccionAsync(
                async ct =>
                {
                    var vuelo = await ObtenerVueloAsync(
                        vueloId,
                        true,
                        ct);

                    vuelo.AutorizarDespacho();

                    foreach (var encomienda in vuelo.Encomiendas)
                        encomienda.MarcarComoEmbarcada();
                },
                cancellationToken);
        }

        public async Task CancelarAsync(
            long vueloId,
            CancellationToken cancellationToken)
        {
            await _unitOfWork.EjecutarEnTransaccionAsync(
                async ct =>
                {
                    var vuelo = await ObtenerVueloAsync(
                        vueloId,
                        true,
                        ct);

                    vuelo.Cancelar();

                    var pesoLiberado = vuelo.Encomiendas
                        .Where(x =>
                            x.Estado == EstadoEncomienda.Asignada)
                        .Sum(x => x.Peso);

                    foreach (var encomienda in vuelo.Encomiendas
                                 .Where(x =>
                                     x.Estado == EstadoEncomienda.Asignada))
                    {
                        encomienda.LiberarDeVuelo();
                    }

                    if (pesoLiberado > 0)
                        vuelo.RetirarPeso(pesoLiberado);
                },
                cancellationToken);
        }

        private async Task<Vuelo> ObtenerVueloAsync(
            long id,
            bool incluirEncomiendas,
            CancellationToken cancellationToken)
        {
            return await _vueloRepository.ObtenerPorIdAsync(
                       id,
                       incluirEncomiendas,
                       cancellationToken)
                   ?? throw new NotFoundException(
                       $"No se encontró el vuelo {id}.");
        }
    }
}
