using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Security
{
    public interface IPasswordHasher
    {
        string Hash(string password);
        bool Verificar(string password, string hash);
    }
}
