using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaCargaAerea.Domain.Entities
{
    public class Destino
    {
        public long Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string CodigoIATA { get; set; } = string.Empty;
        public string Pais { get; set; } = string.Empty;

        public Destino()
        {
            
        }
        public Destino(string nombre, string codigoIATA, string pais)
        {
            CambiarDatos(nombre, codigoIATA, pais);
        }

        public void Actualizar(string nombre, string codigoIATA, string pais)
        {
            CambiarDatos(nombre, codigoIATA, pais);
        }

        private void CambiarDatos(string nombre, string codigoIATA, string pais)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new ArgumentException("El nombre del destino es obligatorio.");

            if (string.IsNullOrWhiteSpace(codigoIATA))
                throw new ArgumentException("El código IATA es obligatorio.");

            if (codigoIATA.Trim().Length != 3)
                throw new ArgumentException("El código IATA debe tener exactamente 3 letras.");

            if (string.IsNullOrWhiteSpace(pais))
                throw new ArgumentException("El país es obligatorio.");

            Nombre = nombre.Trim();
            CodigoIATA = codigoIATA.Trim().ToUpperInvariant();
            Pais = pais.Trim();
        }
    }
}
