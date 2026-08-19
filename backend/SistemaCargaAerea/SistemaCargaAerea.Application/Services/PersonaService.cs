using SistemaCargaAerea.Application.DTOs.Personas;
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
    public class PersonaService : IPersonaService
    {
        private readonly IUnitOfWork _uow;

        public PersonaService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<PersonaResponse> ObtenerPorIdAsync(long id, CancellationToken ct)
        {
            var persona = await _uow.Personas.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Persona), id);

            return persona.ToResponse();
        }

        public async Task<List<PersonaResponse>> ObtenerTodosAsync(CancellationToken ct)
        {
            var personas = await _uow.Personas.ObtenerTodosAsync(ct);
            return personas.ToResponse();
        }

        public async Task<PersonaResponse> CrearAsync(CrearPersonaRequest request, CancellationToken ct)
        {
            var documentoExiste = await _uow.Personas.ObtenerPorDocumentoAsync(
                request.Documento, ct);

            if (documentoExiste is not null)
                throw new InvalidOperationException(
                    $"Ya existe una persona registrada con el documento '{request.Documento}'.");

            var persona = new Persona(
                request.Nombre,
                request.Documento,
                request.Telefono,
                request.Email,
                request.Direccion);

            _uow.Personas.Agregar(persona);
            await _uow.GuardarCambiosAsync(ct);

            return persona.ToResponse();
        }

        public async Task<PersonaResponse> ActualizarAsync(long id, ActualizarPersonaRequest request, CancellationToken ct)
        {
            var persona = await _uow.Personas.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Persona), id);

            persona.Actualizar(
                request.Nombre,
                request.Telefono,
                request.Email,
                request.Direccion);

            await _uow.GuardarCambiosAsync(ct);

            return persona.ToResponse();
        }
    }
}
