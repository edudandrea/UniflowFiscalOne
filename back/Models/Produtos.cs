using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class Produtos
    {
        public int ProdutoId { get; set; }
        public int TenantId { get; set; }
        public int GrupoEconomicoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int NCMId { get; set; }
        public int CESTId { get; set; }
        public int UnidadeId { get; set; }
        public string OrigemMercadoria { get; set; } = string.Empty;
        public bool Active { get; set; }
    }
}