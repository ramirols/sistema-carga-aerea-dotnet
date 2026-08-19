using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Estados;
using SistemaCargaAerea.Application.Interfaces.Services;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/estados-vuelo")]
    [Authorize]
    public class EstadosVueloController : ControllerBase
    {
        private readonly IEstadoVueloService _service;

        public EstadosVueloController(IEstadoVueloService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<EstadoVueloResponse>>> ObtenerTodos(CancellationToken ct) =>
            Ok(await _service.ObtenerTodosAsync(ct));

        [HttpGet("{id:long}")]
        public async Task<ActionResult<EstadoVueloResponse>> ObtenerPorId(long id, CancellationToken ct) =>
            Ok(await _service.ObtenerPorIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<EstadoVueloResponse>> Crear(
            [FromBody] CrearEstadoVueloRequest request, CancellationToken ct)
        {
            var resultado = await _service.CrearAsync(request, ct);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Id }, resultado);
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult<EstadoVueloResponse>> Actualizar(
            long id, [FromBody] ActualizarEstadoVueloRequest request, CancellationToken ct) =>
            Ok(await _service.ActualizarAsync(id, request, ct));

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Eliminar(long id, CancellationToken ct)
        {
            await _service.EliminarAsync(id, ct);
            return NoContent();
        }
    }
}