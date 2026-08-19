using SistemaCargaAerea.Application.DTOs.Roles;
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
    public class RolService : IRolService
    {
        private readonly IUnitOfWork _uow;

        public RolService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<RolResponse> ObtenerPorIdAsync(long id, CancellationToken ct)
        {
            var rol = await _uow.Roles.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Rol), id);

            return rol.ToResponse();
        }

        public async Task<List<RolResponse>> ObtenerTodosAsync(CancellationToken ct)
        {
            var roles = await _uow.Roles.ObtenerTodosAsync(ct);
            return roles.ToResponse();
        }

        public async Task<RolResponse> CrearAsync(CrearRolRequest request, CancellationToken ct)
        {
            var rol = new Rol(request.Nombre);

            _uow.Roles.Agregar(rol);
            await _uow.GuardarCambiosAsync(ct);

            return rol.ToResponse();
        }

        public async Task<RolResponse> ActualizarAsync(long id, ActualizarRolRequest request, CancellationToken ct)
        {
            var rol = await _uow.Roles.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Rol), id);

            rol.Renombrar(request.Nombre);
            await _uow.GuardarCambiosAsync(ct);

            return rol.ToResponse();
        }

        public async Task EliminarAsync(long id, CancellationToken ct)
        {
            var rol = await _uow.Roles.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Rol), id);

            rol.ValidarEliminable();

            if (await _uow.Usuarios.ExisteConRolAsync(id, ct))
                throw new InvalidOperationException(
                    $"No se puede eliminar el rol '{rol.Nombre}' porque tiene usuarios asociados.");

            _uow.Roles.Eliminar(rol);
            await _uow.GuardarCambiosAsync(ct);
        }
    }
}
