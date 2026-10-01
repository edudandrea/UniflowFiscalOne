using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class NCM
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public DateOnly DataInicioVigencia { get; set; }
        public DateOnly? DataFimVigencia { get; set; }
        
    }
}