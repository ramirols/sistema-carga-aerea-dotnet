using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Domain.Enums;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EncomiendasController : ControllerBase
    {
        private readonly IEncomiendaService _service;

        public EncomiendasController(IEncomiendaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<EncomiendaResponse>>> ObtenerTodos(CancellationToken ct) =>
            Ok(await _service.ObtenerTodosAsync(ct));

        [HttpGet("{id:long}")]
        public async Task<ActionResult<EncomiendaResponse>> ObtenerPorId(long id, CancellationToken ct) =>
            Ok(await _service.ObtenerPorIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<EncomiendaResponse>> Crear(
            [FromBody] CrearEncomiendaRequest request, CancellationToken ct)
        {
            var resultado = await _service.CrearAsync(request, ct);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Id }, resultado);
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult<EncomiendaResponse>> Actualizar(
            long id, [FromBody] ActualizarEncomiendaRequest request, CancellationToken ct) =>
            Ok(await _service.ActualizarAsync(id, request, ct));

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Eliminar(long id, CancellationToken ct)
        {
            await _service.EliminarAsync(id, ct);
            return NoContent();
        }

        [HttpDelete("{id:long}/vuelo")]
        public async Task<ActionResult<EncomiendaResponse>> LiberarDeVuelo(long id, CancellationToken ct) =>
            Ok(await _service.LiberarDeVueloAsync(id, ct));
    }
}
