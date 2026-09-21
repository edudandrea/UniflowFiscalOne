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
        public string NomeFantasia { get; set; } = string.Empty;
        public string UF { get; set; } = string.Empty;
        public int MunicipioId { get; set; }
        public string InscricaoEstadual { get; set; } = string.Empty;
        public string InscricaoMunicipal { get; set; } = string.Empty;
        public string Segmento { get; set; } = string.Empty;
        public string EmailPrincipal { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Site { get; set; } = string.Empty;
        public string Plano { get; set; } = string.Empty;
        public string Situacao { get; set; } = "Ativa";
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    }
}
