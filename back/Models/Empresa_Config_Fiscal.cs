using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class Empresa_Config_Fiscal
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int GrupoEconomicoId { get; set; }
        public string RegimeTributario { get; set; } = string.Empty;
        public bool ContribuinteICMS { get; set; } = false;
        public bool ContribuinteISS { get; set; } = false;
        public bool UtilizaCreditoCBS { get; set; } = false;
        public bool UtilizaCreditoIBS { get; set; } = false;
        public DateOnly DataInicioVigencia { get; set; }
        public DateOnly DataFimVigencia { get; set; }



    }
}