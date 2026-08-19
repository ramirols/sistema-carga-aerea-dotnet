using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Roles;
using SistemaCargaAerea.Application.Interfaces.Services;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly IRolService _service;

        public RolesController(IRolService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<RolResponse>>> ObtenerTodos(CancellationToken ct) =>
            Ok(await _service.ObtenerTodosAsync(ct));

        [HttpGet("{id:long}")]
        public async Task<ActionResult<RolResponse>> ObtenerPorId(long id, CancellationToken ct) =>
            Ok(await _service.ObtenerPorIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<RolResponse>> Crear(
            [FromBody] CrearRolRequest request, CancellationToken ct)
        {
            var resultado = await _service.CrearAsync(request, ct);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Id }, resultado);
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult<RolResponse>> Actualizar(
            long id, [FromBody] ActualizarRolRequest request, CancellationToken ct) =>
            Ok(await _service.ActualizarAsync(id, request, ct));

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Eliminar(long id, CancellationToken ct)
        {
            await _service.EliminarAsync(id, ct);
            return NoContent();
        }
    }
}