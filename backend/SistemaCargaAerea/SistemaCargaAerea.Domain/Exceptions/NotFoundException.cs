using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string mensaje)
            : base(mensaje)
        {
        }
    }
}
