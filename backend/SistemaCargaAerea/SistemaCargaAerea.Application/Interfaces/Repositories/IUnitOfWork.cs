using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IUnitOfWork
    {
        IDestinoRepository Destinos { get; }
        IPersonaRepository Personas { get; }
        IEstadoEncomiendaRepository EstadosEncomienda { get; }
        IEstadoVueloRepository EstadosVuelo { get; }
        IRolRepository Roles { get; }
        IUsuarioRepository Usuarios { get; }
        IVueloRepository Vuelos { get; }
        IEncomiendaRepository Encomiendas { get; }
        Task<int> GuardarCambiosAsync(CancellationToken ct);
    }
}
