using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Estados;
using SistemaCargaAerea.Application.Interfaces.Services;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/estados-encomienda")]
    [Authorize]
    public class EstadosEncomiendaController : ControllerBase
    {
        private readonly IEstadoEncomiendaService _service;

        public EstadosEncomiendaController(IEstadoEncomiendaService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<EstadoEncomiendaResponse>>> ObtenerTodos(CancellationToken ct) =>
            Ok(await _service.ObtenerTodosAsync(ct));

        [HttpGet("{id:long}")]
        public async Task<ActionResult<EstadoEncomiendaResponse>> ObtenerPorId(long id, CancellationToken ct) =>
            Ok(await _service.ObtenerPorIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<EstadoEncomiendaResponse>> Crear(
            [FromBody] CrearEstadoEncomiendaRequest request, CancellationToken ct)
        {
            var resultado = await _service.CrearAsync(request, ct);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Id }, resultado);
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult<EstadoEncomiendaResponse>> Actualizar(
            long id, [FromBody] ActualizarEstadoEncomiendaRequest request, CancellationToken ct) =>
            Ok(await _service.ActualizarAsync(id, request, ct));

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Eliminar(long id, CancellationToken ct)
        {
            await _service.EliminarAsync(id, ct);
            return NoContent();
        }
    }
}