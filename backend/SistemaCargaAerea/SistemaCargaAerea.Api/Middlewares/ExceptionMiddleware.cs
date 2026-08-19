using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaCargaAerea.Application.Exceptions;
namespace SistemaCargaAerea.Api.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                await ResponderErrorAsync(context, exception);
            }
        }

        private async Task ResponderErrorAsync(
            HttpContext context,
            Exception exception)
        {
            var statusCode = exception switch
            {
                NotFoundException =>
                    StatusCodes.Status404NotFound,

                ArgumentException =>
                    StatusCodes.Status400BadRequest,

                InvalidOperationException =>
                    StatusCodes.Status409Conflict,

                DbUpdateConcurrencyException =>
                    StatusCodes.Status409Conflict,

                DbUpdateException =>
                    StatusCodes.Status409Conflict,

                _ =>
                    StatusCodes.Status500InternalServerError
            };

            if (statusCode == StatusCodes.Status500InternalServerError)
                _logger.LogError(exception, "Error interno no controlado");
            else
                _logger.LogWarning(exception, "Solicitud rechazada");

            var problem = new ProblemDetails
            {
                Status = statusCode,
                Title = ObtenerTitulo(statusCode),
                Detail = statusCode ==
                         StatusCodes.Status500InternalServerError
                    ? "Ocurrió un error interno en el servidor."
                    : exception.Message,
                Instance = context.Request.Path
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsJsonAsync(problem);
        }

        private static string ObtenerTitulo(int statusCode)
        {
            return statusCode switch
            {
                400 => "Solicitud inválida",
                404 => "Recurso no encontrado",
                409 => "Conflicto con la operación",
                _ => "Error interno"
            };
        }
    }
}
