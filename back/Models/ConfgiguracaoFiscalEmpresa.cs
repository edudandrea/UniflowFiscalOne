using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class ConfgiguracaoFiscalEmpresa
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int EmpresaId { get; set; }
        public string RegimeTributario { get; set; } = string.Empty;
        public DateOnly DataInicio { get; set; }
        public DateOnly? DataFim { get; set; }
        public string ContribuinteICMS { get; set; } = string.Empty;
        public string ContribuinteISS { get; set; } = string.Empty;
        public bool IsAtivo { get; set; }
    }
}