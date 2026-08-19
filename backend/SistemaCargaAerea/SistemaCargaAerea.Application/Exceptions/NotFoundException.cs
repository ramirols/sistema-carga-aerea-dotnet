using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string entidad, object id)
            : base($"{entidad} con Id '{id}' no fue encontrado."){}
    }
}
