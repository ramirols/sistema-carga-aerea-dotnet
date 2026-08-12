using SistemaCargaAerea.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Entities
{
    public class Encomienda
    {
        public long Id { get; private set; }

        public string Codigo { get; private set; } = string.Empty;

        public string Descripcion { get; private set; } = string.Empty;

        public decimal Peso { get; private set; }

        public string Remitente { get; private set; } = string.Empty;

        public string Destinatario { get; private set; } = string.Empty;

        public EstadoEncomienda Estado { get; private set; }

        public long? VueloId { get; private set; }

        public Vuelo? Vuelo { get; private set; }

        public DateTime FechaRegistro { get; private set; }

        public DateTime? FechaActualizacion { get; private set; }

        public byte[] Version { get; private set; } = [];

        private Encomienda()
        {
        }

        public Encomienda(
            string codigo,
            string descripcion,
            decimal peso,
            string remitente,
            string destinatario)
        {
            CambiarCodigo(codigo);
            CambiarDatos(descripcion, peso, remitente, destinatario);

            Estado = EstadoEncomienda.EnAlmacen;
            FechaRegistro = DateTime.UtcNow;
        }

        public void Actualizar(
            string codigo,
            string descripcion,
            decimal peso,
            string remitente,
            string destinatario)
        {
            if (Estado != EstadoEncomienda.EnAlmacen)
                throw new InvalidOperationException(
                    "Solo se pueden modificar encomiendas que estén en almacén.");

            CambiarCodigo(codigo);
            CambiarDatos(descripcion, peso, remitente, destinatario);
            FechaActualizacion = DateTime.UtcNow;
        }

        public void AsignarAVuelo(long vueloId)
        {
            if (Estado != EstadoEncomienda.EnAlmacen)
                throw new InvalidOperationException(
                    "La encomienda no está disponible en almacén.");

            VueloId = vueloId;
            Estado = EstadoEncomienda.Asignada;
            FechaActualizacion = DateTime.UtcNow;
        }

        public void LiberarDeVuelo()
        {
            if (Estado == EstadoEncomienda.Embarcada)
                throw new InvalidOperationException(
                    "Una encomienda embarcada no puede liberarse.");

            VueloId = null;
            Estado = EstadoEncomienda.EnAlmacen;
            FechaActualizacion = DateTime.UtcNow;
        }

        public void MarcarComoEmbarcada()
        {
            if (Estado != EstadoEncomienda.Asignada || VueloId is null)
                throw new InvalidOperationException(
                    "La encomienda debe estar asignada a un vuelo.");

            Estado = EstadoEncomienda.Embarcada;
            FechaActualizacion = DateTime.UtcNow;
        }

        private void CambiarCodigo(string codigo)
        {
            if (string.IsNullOrWhiteSpace(codigo))
                throw new ArgumentException(
                    "El código de la encomienda es obligatorio.");

            Codigo = codigo.Trim().ToUpperInvariant();
        }

        private void CambiarDatos(
            string descripcion,
            decimal peso,
            string remitente,
            string destinatario)
        {
            if (string.IsNullOrWhiteSpace(descripcion))
                throw new ArgumentException(
                    "La descripción es obligatoria.");

            if (peso <= 0)
                throw new ArgumentException(
                    "El peso debe ser mayor que cero.");

            if (string.IsNullOrWhiteSpace(remitente))
                throw new ArgumentException(
                    "El remitente es obligatorio.");

            if (string.IsNullOrWhiteSpace(destinatario))
                throw new ArgumentException(
                    "El destinatario es obligatorio.");

            Descripcion = descripcion.Trim();
            Peso = peso;
            Remitente = remitente.Trim();
            Destinatario = destinatario.Trim();
        }
    }
}
