using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Entities
{
    public class Vuelo
    {
        public long Id { get; private set; }
        public string CodigoVuelo { get; private set; } = string.Empty;
        public long DestinoId { get; private set; }
        public Destino? Destino { get; private set; }
        public DateOnly FechaVuelo { get; private set; }
        public TimeOnly HoraVuelo { get; private set; }
        public decimal PesoMaximo { get; private set; }
        public decimal PesoAsignado { get; private set; }
        public long EstadoId { get; private set; }
        public EstadoVuelo? Estado { get; private set; }
        public DateTime FechaCreacion { get; private set; }
        public DateTime? FechaActualizacion { get; private set; }
        public byte[] Version { get; private set; } = [];
        

        private Vuelo()
        {
        }

        public Vuelo(string codigoVuelo, long destinoId, DateOnly fechaVuelo, TimeOnly horaVuelo, decimal pesoMaximo, EstadoVuelo estadoInicial)
        {
            if (estadoInicial.Clave != EstadoVueloClave.Programado)
                throw new ArgumentException(
                    "Un vuelo nuevo debe crearse en estado 'Programado'.", nameof(estadoInicial));

            CambiarCodigo(codigoVuelo);
            CambiarDestino(destinoId);
            CambiarProgramacion(fechaVuelo, horaVuelo);
            CambiarPesoMaximo(pesoMaximo);

            EstadoId = estadoInicial.Id;
            Estado = estadoInicial;
            PesoAsignado = 0;
            FechaCreacion = DateTime.UtcNow;
        }
        public void Actualizar(
            string codigoVuelo,
            long destinoId,
            DateOnly fechaVuelo,
            TimeOnly horaVuelo,
            decimal pesoMaximo)
        {
            ValidarModificable();

            if (pesoMaximo < PesoAsignado)
                throw new InvalidOperationException(
                    "El nuevo peso máximo no puede ser menor al peso ya asignado.");

            CambiarCodigo(codigoVuelo);
            CambiarDestino(destinoId);
            CambiarProgramacion(fechaVuelo, horaVuelo);
            CambiarPesoMaximo(pesoMaximo);
            FechaActualizacion = DateTime.UtcNow;
        }
        public void AgregarPeso(decimal peso)
        {
            if (peso <= 0)
                throw new ArgumentException("El peso a agregar debe ser mayor que cero.");

            ValidarModificable();

            if (PesoAsignado + peso > PesoMaximo)
                throw new InvalidOperationException(
                    "El peso excede la capacidad máxima disponible del vuelo.");

            PesoAsignado += peso;
            FechaActualizacion = DateTime.UtcNow;
        }
        public void QuitarPeso(decimal peso)
        {
            if (peso <= 0)
                throw new ArgumentException("El peso a quitar debe ser mayor que cero.");

            if (peso > PesoAsignado)
                throw new InvalidOperationException(
                    "No se puede quitar más peso del que está asignado.");

            PesoAsignado -= peso;
            FechaActualizacion = DateTime.UtcNow;
        }
        public void IniciarVuelo(EstadoVuelo nuevoEstado)
        {
            ValidarClaveEsperada(nuevoEstado, EstadoVueloClave.EnVuelo);

            if (Estado?.Clave != EstadoVueloClave.Programado)
                throw new InvalidOperationException("Solo un vuelo 'Programado' puede iniciar.");

            CambiarEstado(nuevoEstado);
        }
        public void Aterrizar(EstadoVuelo nuevoEstado)
        {
            ValidarClaveEsperada(nuevoEstado, EstadoVueloClave.Aterrizado);

            if (Estado?.Clave != EstadoVueloClave.EnVuelo)
                throw new InvalidOperationException("Solo un vuelo 'En vuelo' puede aterrizar.");

            CambiarEstado(nuevoEstado);
        }
        public void Cancelar(EstadoVuelo nuevoEstado)
        {
            ValidarClaveEsperada(nuevoEstado, EstadoVueloClave.Cancelado);

            if (Estado?.Clave is EstadoVueloClave.Aterrizado or EstadoVueloClave.Cancelado)
                throw new InvalidOperationException(
                    "Un vuelo aterrizado o ya cancelado no puede cancelarse.");

            CambiarEstado(nuevoEstado);
        }
        private void ValidarModificable()
        {
            if (Estado?.Clave != EstadoVueloClave.Programado)
                throw new InvalidOperationException(
                    "Solo se puede modificar un vuelo en estado 'Programado'.");
        }
        private static void ValidarClaveEsperada(EstadoVuelo estado, EstadoVueloClave esperada)
        {
            if (estado.Clave != esperada)
                throw new ArgumentException(
                    $"El estado provisto debe tener la clave '{esperada}'.", nameof(estado));
        }
        private void CambiarEstado(EstadoVuelo nuevoEstado)
        {
            EstadoId = nuevoEstado.Id;
            Estado = nuevoEstado;
            FechaActualizacion = DateTime.UtcNow;
        }
        private void CambiarCodigo(string codigoVuelo)
        {
            if (string.IsNullOrWhiteSpace(codigoVuelo))
                throw new ArgumentException("El código del vuelo es obligatorio.");

            CodigoVuelo = codigoVuelo.Trim().ToUpperInvariant();
        }

        private void CambiarDestino(long destinoId)
        {
            if (destinoId <= 0)
                throw new ArgumentException("El destino es obligatorio.");

            DestinoId = destinoId;
        }

        private void CambiarProgramacion(DateOnly fechaVuelo, TimeOnly horaVuelo)
        {
            FechaVuelo = fechaVuelo;
            HoraVuelo = horaVuelo;
        }

        private void CambiarPesoMaximo(decimal pesoMaximo)
        {
            if (pesoMaximo <= 0)
                throw new ArgumentException("El peso máximo debe ser mayor que cero.");

            PesoMaximo = pesoMaximo;
        }
    }
}
