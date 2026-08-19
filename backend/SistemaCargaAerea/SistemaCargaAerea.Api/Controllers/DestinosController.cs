using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Destinos;
using SistemaCargaAerea.Application.Interfaces.Services;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DestinosController : ControllerBase
    {
        private readonly IDestinoService _service;

        public DestinosController(IDestinoService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<DestinoResponse>>> ObtenerTodos(CancellationToken ct) =>
            Ok(await _service.ObtenerTodosAsync(ct));

        [HttpGet("{id:long}")]
        public async Task<ActionResult<DestinoResponse>> ObtenerPorId(long id, CancellationToken ct) =>
            Ok(await _service.ObtenerPorIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<DestinoResponse>> Crear(
            [FromBody] CrearDestinoRequest request, CancellationToken ct)
        {
            var resultado = await _service.CrearAsync(request, ct);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Id }, resultado);
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult<DestinoResponse>> Actualizar(
            long id, [FromBody] ActualizarDestinoRequest request, CancellationToken ct) =>
            Ok(await _service.ActualizarAsync(id, request, ct));

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Eliminar(long id, CancellationToken ct)
        {
            await _service.EliminarAsync(id, ct);
            return NoContent();
        }
    }
}