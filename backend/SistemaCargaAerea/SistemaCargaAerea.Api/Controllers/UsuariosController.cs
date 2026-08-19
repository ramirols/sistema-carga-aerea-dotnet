using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Usuarios;
using SistemaCargaAerea.Application.Interfaces.Services;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _service;

        public UsuariosController(IUsuarioService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<UsuarioResponse>>> ObtenerTodos(CancellationToken ct) =>
            Ok(await _service.ObtenerTodosAsync(ct));

        [HttpGet("{id:long}")]
        public async Task<ActionResult<UsuarioResponse>> ObtenerPorId(long id, CancellationToken ct) =>
            Ok(await _service.ObtenerPorIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<UsuarioResponse>> Crear(
            [FromBody] CrearUsuarioRequest request, CancellationToken ct)
        {
            var resultado = await _service.CrearAsync(request, ct);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Id }, resultado);
        }

        [HttpPatch("{id:long}/password")]
        public async Task<IActionResult> CambiarPassword(
            long id, [FromBody] CambiarPasswordRequest request, CancellationToken ct)
        {
            await _service.CambiarPasswordAsync(id, request, ct);
            return NoContent();
        }

        [HttpPatch("{id:long}/rol")]
        public async Task<IActionResult> CambiarRol(
            long id, [FromBody] CambiarRolUsuarioRequest request, CancellationToken ct)
        {
            await _service.CambiarRolAsync(id, request, ct);
            return NoContent();
        }

        [HttpPost("{id:long}/activar")]
        public async Task<IActionResult> Activar(long id, CancellationToken ct)
        {
            await _service.ActivarAsync(id, ct);
            return NoContent();
        }

        [HttpPost("{id:long}/desactivar")]
        public async Task<IActionResult> Desactivar(long id, CancellationToken ct)
        {
            await _service.DesactivarAsync(id, ct);
            return NoContent();
        }
    }
}