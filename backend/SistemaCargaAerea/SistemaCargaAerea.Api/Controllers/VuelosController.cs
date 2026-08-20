using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Application.DTOs.Vuelos;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Domain.Enums;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VuelosController : ControllerBase
    {
        private readonly IVueloService _service;
        private readonly IEncomiendaService _encomiendaService;

        public VuelosController(IVueloService service, IEncomiendaService encomiendaService)
        {
            _service = service;
            _encomiendaService = encomiendaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<VueloResponse>>> ObtenerTodos(CancellationToken ct) =>
            Ok(await _service.ObtenerTodosAsync(ct));

        [HttpGet("{id:long}")]
        public async Task<ActionResult<VueloResponse>> ObtenerPorId(long id, CancellationToken ct) =>
            Ok(await _service.ObtenerPorIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<VueloResponse>> Crear(
            [FromBody] CrearVueloRequest request, CancellationToken ct)
        {
            var resultado = await _service.CrearAsync(request, ct);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.Id }, resultado);
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult<VueloResponse>> Actualizar(
            long id, [FromBody] ActualizarVueloRequest request, CancellationToken ct) =>
            Ok(await _service.ActualizarAsync(id, request, ct));

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Eliminar(long id, CancellationToken ct)
        {
            await _service.EliminarAsync(id, ct);
            return NoContent();
        }

        [HttpPost("{id:long}/iniciar")]
        public async Task<ActionResult<VueloResponse>> Iniciar(long id, CancellationToken ct) =>
            Ok(await _service.IniciarVueloAsync(id, ct));

        [HttpPost("{id:long}/aterrizar")]
        public async Task<ActionResult<VueloResponse>> Aterrizar(long id, CancellationToken ct) =>
            Ok(await _service.AterrizarAsync(id, ct));

        [HttpPost("{id:long}/cancelar")]
        public async Task<ActionResult<VueloResponse>> Cancelar(long id, CancellationToken ct) =>
            Ok(await _service.CancelarAsync(id, ct));

        [HttpPost("{id:long}/encomiendas")]
        public async Task<ActionResult<VueloResponse>> AsignarEncomiendas(
            long id,
            [FromBody] AsignarEncomiendasRequest request,
            CancellationToken ct)
        {
            var encomiendaService = HttpContext.RequestServices.GetRequiredService<IEncomiendaService>();
            var resultado = await encomiendaService.AsignarAVueloAsync(id, request, ct);
            return Ok(resultado);
        }
    }
}
