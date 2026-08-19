using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SistemaCargaAerea.Application.Interfaces.Security;
using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SistemaCargaAerea.Infrastructure.Security
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config) => _config = config;

        public (string token, DateTime expiraEn) Generar(Usuario usuario)
        {
            var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key no configurado.");
            var issuer = _config["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer no configurado.");
            var aud = _config["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience no configurado.");
            var mins = int.Parse(_config["Jwt:ExpirationMinutes"] ?? "60");

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub,  usuario.Id.ToString()),
                new(JwtRegisteredClaimNames.Name, usuario.NombreUsuario),
                // ClaimTypes.Role es lo que lee [Authorize(Roles = "...")] en ASP.NET Core
                new(ClaimTypes.Role, usuario.Rol!.Clave.ToString()!)
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var expiraEn = DateTime.UtcNow.AddMinutes(mins);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: aud,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expiraEn,
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));

            return (new JwtSecurityTokenHandler().WriteToken(token), expiraEn);
        }
    }
}