using SistemaCargaAerea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Security
{
    public interface ITokenService
    {
        (string token, DateTime expiraEn) Generar(Usuario usuario);
    }
}
