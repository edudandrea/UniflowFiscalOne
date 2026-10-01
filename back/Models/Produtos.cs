using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back.Enums;


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
        public NCM NCM { get; set; } = null!;
        public int? CESTId { get; set; }
        public CEST? CEST { get; set; } 
        public int UnidadeId { get; set; }
        public Unidade Unidade { get; set; } = null!;
        public int OrigemMercadoriaId { get; set; }
        public OrigemMercadoria OrigemMercadoria { get; set; } = null!;
        public bool IsAtivo { get; set; }
    }
}