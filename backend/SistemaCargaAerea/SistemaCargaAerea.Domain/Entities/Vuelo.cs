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

        public string Destino { get; private set; } = string.Empty;

        public DateOnly FechaVuelo { get; private set; }

        public TimeOnly HoraVuelo { get; private set; }

        public decimal PesoMaximo { get; private set; }

        public decimal PesoActual { get; private set; }

        public EstadoVuelo Estado { get; private set; }

        public DateTime FechaCreacion { get; private set; }

        public DateTime? FechaActualizacion { get; private set; }

        public byte[] Version { get; private set; } = [];

        public ICollection<Encomienda> Encomiendas { get; private set; }
            = new List<Encomienda>();

        private Vuelo()
        {
        }

        public Vuelo(
            string codigoVuelo,
            string destino,
            DateOnly fechaVuelo,
            TimeOnly horaVuelo,
            decimal pesoMaximo)
        {
            CambiarCodigo(codigoVuelo);
            CambiarDatos(destino, fechaVuelo, horaVuelo, pesoMaximo);

            PesoActual = 0;
            Estado = EstadoVuelo.Programado;
            FechaCreacion = DateTime.UtcNow;
        }

        public decimal PesoDisponible => PesoMaximo - PesoActual;

        public void Actualizar(
            string codigoVuelo,
            string destino,
            DateOnly fechaVuelo,
            TimeOnly horaVuelo,
            decimal pesoMaximo)
        {
            ValidarModificable();
            CambiarCodigo(codigoVuelo);
            CambiarDatos(destino, fechaVuelo, horaVuelo, pesoMaximo);
            FechaActualizacion = DateTime.UtcNow;
        }

        public void AgregarPeso(decimal peso)
        {
            ValidarModificable();

            if (peso <= 0)
                throw new ArgumentException("El peso debe ser mayor que cero.");

            if (PesoActual + peso > PesoMaximo)
                throw new InvalidOperationException(
                    "El peso de la carga excede la capacidad disponible del vuelo.");

            PesoActual += peso;
            FechaActualizacion = DateTime.UtcNow;
        }

        public void RetirarPeso(decimal peso)
        {
            if (peso <= 0)
                throw new ArgumentException("El peso debe ser mayor que cero.");

            if (peso > PesoActual)
                throw new InvalidOperationException(
                    "No se puede retirar un peso mayor al peso actual.");

            PesoActual -= peso;
            FechaActualizacion = DateTime.UtcNow;
        }

        public void AutorizarDespacho()
        {
            ValidarModificable();

            if (Encomiendas.Count == 0)
                throw new InvalidOperationException(
                    "No se puede despachar un vuelo sin encomiendas.");

            Estado = EstadoVuelo.Despachado;
            FechaActualizacion = DateTime.UtcNow;
        }

        public void Cancelar()
        {
            if (Estado == EstadoVuelo.Despachado)
                throw new InvalidOperationException(
                    "Un vuelo despachado no puede cancelarse.");

            if (Estado == EstadoVuelo.Cancelado)
                throw new InvalidOperationException(
                    "El vuelo ya se encuentra cancelado.");

            Estado = EstadoVuelo.Cancelado;
            FechaActualizacion = DateTime.UtcNow;
        }

        private void ValidarModificable()
        {
            if (Estado != EstadoVuelo.Programado)
                throw new InvalidOperationException(
                    "Solo se pueden modificar vuelos programados.");
        }

        private void CambiarCodigo(string codigoVuelo)
        {
            if (string.IsNullOrWhiteSpace(codigoVuelo))
                throw new ArgumentException(
                    "El código del vuelo es obligatorio.");

            CodigoVuelo = codigoVuelo.Trim().ToUpperInvariant();
        }

        private void CambiarDatos(
            string destino,
            DateOnly fechaVuelo,
            TimeOnly horaVuelo,
            decimal pesoMaximo)
        {
            if (string.IsNullOrWhiteSpace(destino))
                throw new ArgumentException(
                    "El destino es obligatorio.");

            if (pesoMaximo <= 0)
                throw new ArgumentException(
                    "El peso máximo debe ser mayor que cero.");

            if (pesoMaximo < PesoActual)
                throw new InvalidOperationException(
                    "El peso máximo no puede ser menor al peso ya asignado.");

            Destino = destino.Trim();
            FechaVuelo = fechaVuelo;
            HoraVuelo = horaVuelo;
            PesoMaximo = pesoMaximo;
        }
    }
}
