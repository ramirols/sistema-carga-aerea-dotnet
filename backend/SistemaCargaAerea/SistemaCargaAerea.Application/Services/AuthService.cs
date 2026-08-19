using SistemaCargaAerea.Application.DTOs.Auth;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Application.Interfaces.Security;
using SistemaCargaAerea.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _uow;
        private readonly IPasswordHasher _hasher;
        private readonly ITokenService _tokenService;

        public AuthService(IUnitOfWork uow, IPasswordHasher hasher, ITokenService tokenService)
        {
            _uow = uow;
            _hasher = hasher;
            _tokenService = tokenService;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct)
        {
            var usuario = await _uow.Usuarios.ObtenerPorNombreUsuarioAsync(
                request.NombreUsuario.Trim().ToLowerInvariant(),
                incluirRol: true,
                ct);

            if (usuario is null || !_hasher.Verificar(request.Password, usuario.PasswordHash))
                throw new InvalidOperationException("Credenciales inválidas.");

            if (!usuario.PuedeAutenticarse())
                throw new InvalidOperationException("El usuario está desactivado.");

            var (token, expiraEn) = _tokenService.Generar(usuario);

            return new LoginResponse
            {
                Token = token,
                ExpiraEn = expiraEn,
                NombreUsuario = usuario.NombreUsuario,
                Rol = usuario.Rol!.Nombre
            };
        }
    }
}