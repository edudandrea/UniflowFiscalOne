using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class GrupoEconomico
    {
        public int GrupoId { get; set; }
        public string Razao_Social { get; set; } = string.Empty;
        public string Nome_fantazia { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;        
        public int InscricaoEstadual { get; set; } = 0;
        public int InscricaoMunicipal { get; set; } = 0;
        public string RegimeTributario { get; set; } = string.Empty;
        public string CNAE { get; set; } = string.Empty;
        public string OptanteSimplesNacional { get; set; } = string.Empty;
        public string UF { get; set; } = string.Empty;        
        public int TenantId { get; set; }
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public DateTime DataAtivacao { get; set; }
        public DateTime DataCancelamento { get; set; }
        public bool IsActive { get; set; }
    }
}