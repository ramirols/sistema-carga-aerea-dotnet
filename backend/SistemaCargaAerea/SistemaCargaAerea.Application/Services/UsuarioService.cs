using SistemaCargaAerea.Application.DTOs.Usuarios;
using SistemaCargaAerea.Application.Exceptions;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Application.Interfaces.Security;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Application.Mappings;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUnitOfWork _uow;
        private readonly IPasswordHasher _hasher;

        public UsuarioService(IUnitOfWork uow, IPasswordHasher hasher)
        {
            _uow = uow;
            _hasher = hasher;
        }

        public async Task<UsuarioResponse> ObtenerPorIdAsync(long id, CancellationToken ct)
        {
            var usuario = await _uow.Usuarios.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Usuario), id);

            return usuario.ToResponse();
        }

        public async Task<List<UsuarioResponse>> ObtenerTodosAsync(CancellationToken ct)
        {
            var usuarios = await _uow.Usuarios.ObtenerTodosAsync(ct);
            return usuarios.ToResponse();
        }

        public async Task<UsuarioResponse> CrearAsync(CrearUsuarioRequest request, CancellationToken ct)
        {
            var rol = await _uow.Roles.ObtenerPorIdAsync(request.RolId, ct)
                ?? throw new NotFoundException(nameof(Rol), request.RolId);

            var nombreNormalizado = request.NombreUsuario.Trim().ToLowerInvariant();
            if (await _uow.Usuarios.ExisteNombreUsuarioAsync(nombreNormalizado, ct))
                throw new InvalidOperationException(
                    $"Ya existe un usuario con el nombre '{request.NombreUsuario}'.");

            var hash = _hasher.Hash(request.Password);
            var usuario = new Usuario(nombreNormalizado, hash, request.RolId);

            _uow.Usuarios.Agregar(usuario);
            await _uow.GuardarCambiosAsync(ct);

            return usuario.ToResponse();
        }

        public async Task CambiarPasswordAsync(long id, CambiarPasswordRequest request, CancellationToken ct)
        {
            var usuario = await _uow.Usuarios.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Usuario), id);

            if (!_hasher.Verificar(request.PasswordActual, usuario.PasswordHash))
                throw new InvalidOperationException("La contraseña actual es incorrecta.");

            var nuevoHash = _hasher.Hash(request.PasswordNueva);
            usuario.CambiarPassword(nuevoHash);

            await _uow.GuardarCambiosAsync(ct);
        }

        public async Task CambiarRolAsync(long id, CambiarRolUsuarioRequest request, CancellationToken ct)
        {
            var usuario = await _uow.Usuarios.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Usuario), id);

            _ = await _uow.Roles.ObtenerPorIdAsync(request.RolId, ct)
                ?? throw new NotFoundException(nameof(Rol), request.RolId);

            usuario.CambiarRol(request.RolId);
            await _uow.GuardarCambiosAsync(ct);
        }

        public async Task ActivarAsync(long id, CancellationToken ct)
        {
            var usuario = await _uow.Usuarios.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Usuario), id);

            usuario.Activar();
            await _uow.GuardarCambiosAsync(ct);
        }

        public async Task DesactivarAsync(long id, CancellationToken ct)
        {
            var usuario = await _uow.Usuarios.ObtenerPorIdAsync(id, ct)
                ?? throw new NotFoundException(nameof(Usuario), id);

            usuario.Desactivar();
            await _uow.GuardarCambiosAsync(ct);
        }
    }
}