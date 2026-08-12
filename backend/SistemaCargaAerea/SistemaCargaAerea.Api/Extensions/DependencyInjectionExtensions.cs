using Microsoft.EntityFrameworkCore;
using SistemaCargaAerea.Application.Interfaces.Repositories;
using SistemaCargaAerea.Application.Interfaces.Services;
using SistemaCargaAerea.Application.Services;
using SistemaCargaAerea.Infrastructure.Data;
using SistemaCargaAerea.Infrastructure.Repositories;

namespace SistemaCargaAerea.Api.Extensions
{
    public static class DependencyInjectionExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddScoped<IVueloService, VueloService>();
            services.AddScoped<IEncomiendaService, EncomiendaService>();

            return services;
        }

        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString =
                configuration.GetConnectionString(
                    "DefaultConnection")
                ?? throw new InvalidOperationException(
                    "No se encontró la cadena DefaultConnection.");

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddScoped<IVueloRepository, VueloRepository>();
            services.AddScoped<IEncomiendaRepository,
                EncomiendaRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
