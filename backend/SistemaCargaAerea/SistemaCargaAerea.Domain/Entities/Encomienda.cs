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
        public long RemitenteId { get; private set; }
        public Persona? Remitente { get; private set; }
        public long DestinatarioId { get; private set; }
        public Persona? Destinatario { get; private set; }
        public long EstadoId { get; private set; }
        public EstadoEncomienda? Estado { get; private set; }
        public long? VueloId { get; private set; }
        public Vuelo? Vuelo { get; private set; }
        public DateTime FechaRegistro { get; private set; }


        private Encomienda()
        {
        }
        public Encomienda(string codigo, string descripcion, decimal peso, long remitenteId, long destinatarioId, EstadoEncomienda estadoInicial)
        {
            if (estadoInicial.Clave != EstadoEncomiendaClave.EnAlmacen)
                throw new ArgumentException(
                    "Una encomienda nueva debe crearse en estado 'En almacén'.", nameof(estadoInicial));

            CambiarCodigo(codigo);
            CambiarDatos(descripcion, peso, remitenteId, destinatarioId);

            EstadoId = estadoInicial.Id;
            Estado = estadoInicial;
            FechaRegistro = DateTime.UtcNow;
        }

        public void Actualizar(
            string codigo,
            string descripcion,
            decimal peso,
            long remitenteId,
            long destinatarioId)
        {
            ValidarModificable();

            CambiarCodigo(codigo);
            CambiarDatos(descripcion, peso, remitenteId, destinatarioId);
        }

        public void AsignarAVuelo(Vuelo vuelo, EstadoEncomienda estadoAsignada)
        {
            ValidarClaveEsperada(estadoAsignada, EstadoEncomiendaClave.Asignada);

            if (Estado?.Clave != EstadoEncomiendaClave.EnAlmacen)
                throw new InvalidOperationException("La encomienda no está disponible en almacén.");

            VueloId = vuelo.Id;
            Vuelo = vuelo;
            EstadoId = estadoAsignada.Id;
            Estado = estadoAsignada;
        }

        public void LiberarDeVuelo(EstadoEncomienda estadoEnAlmacen)
        {
            ValidarClaveEsperada(estadoEnAlmacen, EstadoEncomiendaClave.EnAlmacen);

            if (Estado?.Clave == EstadoEncomiendaClave.Embarcada)
                throw new InvalidOperationException("Una encomienda embarcada no puede liberarse.");

            VueloId = null;
            Vuelo = null;
            EstadoId = estadoEnAlmacen.Id;
            Estado = estadoEnAlmacen;
        }

        public void MarcarComoEmbarcada(EstadoEncomienda estadoEmbarcada)
        {
            ValidarClaveEsperada(estadoEmbarcada, EstadoEncomiendaClave.Embarcada);

            if (Estado?.Clave != EstadoEncomiendaClave.Asignada || VueloId is null)
                throw new InvalidOperationException("La encomienda debe estar asignada a un vuelo.");

            EstadoId = estadoEmbarcada.Id;
            Estado = estadoEmbarcada;
        }

        private void ValidarModificable()
        {
            if (Estado?.Clave != EstadoEncomiendaClave.EnAlmacen)
                throw new InvalidOperationException(
                    "Solo se pueden modificar encomiendas que estén en almacén.");
        }

        private static void ValidarClaveEsperada(EstadoEncomienda estado, EstadoEncomiendaClave esperada)
        {
            if (estado.Clave != esperada)
                throw new ArgumentException(
                    $"El estado provisto debe tener la clave '{esperada}'.", nameof(estado));
        }

        private void CambiarCodigo(string codigo)
        {
            if (string.IsNullOrWhiteSpace(codigo))
                throw new ArgumentException("El código de la encomienda es obligatorio.");

            Codigo = codigo.Trim().ToUpperInvariant();
        }

        private void CambiarDatos(
            string descripcion,
            decimal peso,
            long remitenteId,
            long destinatarioId)
        {
            if (string.IsNullOrWhiteSpace(descripcion))
                throw new ArgumentException("La descripción es obligatoria.");

            if (peso <= 0)
                throw new ArgumentException("El peso debe ser mayor que cero.");

            if (remitenteId <= 0)
                throw new ArgumentException("El remitente es obligatorio.");

            if (destinatarioId <= 0)
                throw new ArgumentException("El destinatario es obligatorio.");

            if (remitenteId == destinatarioId)
                throw new ArgumentException("El remitente y el destinatario no pueden ser la misma persona.");

            Descripcion = descripcion.Trim();
            Peso = peso;
            RemitenteId = remitenteId;
            DestinatarioId = destinatarioId;
        }
    }
}
