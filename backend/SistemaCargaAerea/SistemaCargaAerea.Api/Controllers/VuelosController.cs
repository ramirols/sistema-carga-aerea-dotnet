using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Application.DTOs.Vuelos;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Domain.Enums;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VuelosController : ControllerBase
    {
        private readonly IVueloService _service;

        public VuelosController(IVueloService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult> Listar(
            [FromQuery] string? destino,
            [FromQuery] EstadoVuelo? estado,
            CancellationToken cancellationToken)
        {
            var resultado = await _service.ListarAsync(
                destino,
                estado,
                cancellationToken);

            return Ok(resultado);
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult> Obtener(
            long id,
            CancellationToken cancellationToken)
        {
            return Ok(await _service.ObtenerAsync(
                id,
                cancellationToken));
        }

        [HttpPost]
        public async Task<ActionResult> Crear(
            [FromBody] CrearVueloRequest request,
            CancellationToken cancellationToken)
        {
            var resultado = await _service.CrearAsync(
                request,
                cancellationToken);

            return CreatedAtAction(
                nameof(Obtener),
                new { id = resultado.Id },
                resultado);
        }

        [HttpPut("{id:long}")]
        public async Task<ActionResult> Actualizar(
            long id,
            [FromBody] ActualizarVueloRequest request,
            CancellationToken cancellationToken)
        {
            return Ok(await _service.ActualizarAsync(
                id,
                request,
                cancellationToken));
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Eliminar(
            long id,
            CancellationToken cancellationToken)
        {
            await _service.EliminarAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpPost("{id:long}/encomiendas")]
        public async Task<IActionResult> AsignarEncomiendas(
            long id,
            [FromBody] AsignarEncomiendasRequest request,
            CancellationToken cancellationToken)
        {
            await _service.AsignarEncomiendasAsync(
                id,
                request.EncomiendaIds,
                cancellationToken);

            return NoContent();
        }

        [HttpPost("{id:long}/despachar")]
        public async Task<IActionResult> AutorizarDespacho(
            long id,
            CancellationToken cancellationToken)
        {
            await _service.AutorizarDespachoAsync(
                id,
                cancellationToken);

            return NoContent();
        }

        [HttpPost("{id:long}/cancelar")]
        public async Task<IActionResult> Cancelar(
            long id,
            CancellationToken cancellationToken)
        {
            await _service.CancelarAsync(
                id,
                cancellationToken);

            return NoContent();
        }
    }
}
