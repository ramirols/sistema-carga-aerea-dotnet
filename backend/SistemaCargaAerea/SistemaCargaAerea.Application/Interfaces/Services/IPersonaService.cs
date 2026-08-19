using SistemaCargaAerea.Application.DTOs.Personas;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Services
{
    public interface IPersonaService
    {
        Task<PersonaResponse> ObtenerPorIdAsync(long id, CancellationToken ct);
        Task<List<PersonaResponse>> ObtenerTodosAsync(CancellationToken ct);
        Task<PersonaResponse> CrearAsync(CrearPersonaRequest request, CancellationToken ct);
        Task<PersonaResponse> ActualizarAsync(long id, ActualizarPersonaRequest request, CancellationToken ct);
    }
}
