using Microsoft.AspNetCore.Mvc;
using SistemaCargaAerea.Application.DTOs.Encomiendas;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Domain.Enums;

namespace SistemaCargaAerea.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EncomiendasController : ControllerBase
    {
        private readonly IEncomiendaService _service;

        public EncomiendasController(IEncomiendaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult> Listar(
            [FromQuery] EstadoEncomiendaClave? estado,
            [FromQuery] long? vueloId,
            CancellationToken cancellationToken)
        {
            return Ok(await _service.ListarAsync(
                estado,
                vueloId,
                cancellationToken));
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
            [FromBody] CrearEncomiendaRequest request,
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
            [FromBody] ActualizarEncomiendaRequest request,
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
    }
}
