using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Application.Interfaces.Repositories
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        Task EjecutarEnTransaccionAsync(
            Func<CancellationToken, Task> operacion,
            CancellationToken cancellationToken = default);
    }
}
