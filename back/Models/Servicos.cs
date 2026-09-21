using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class Servicos
    {
        public int ServicoId { get; set; }
        public int TenantId { get; set; }
        public int GrupoEconomicoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int NBSId { get; set; }
        public int CodServicoMunicipal { get; set; }
        public int CNAE { get; set; }
        public bool Active { get; set; }
    }
}