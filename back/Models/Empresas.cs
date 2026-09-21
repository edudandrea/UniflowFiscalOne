using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class Empresas
    {
        public int EmpresaId { get; set; }
        public int TenantId { get; set; }
        public int GrupoEconomicoId { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public string nome { get; set; } = string.Empty;
        public string UF { get; set; } = string.Empty;
        public int MunicipioId { get; set; }
        public int InscricaoEstadual { get; set; }
        public int InscricaoMunicipal { get; set; }
    }
}