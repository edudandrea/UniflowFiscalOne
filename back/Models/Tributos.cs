using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back.Enums;

namespace back.Models
{
    public class Tributos
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Nome { get; set; } =  string.Empty;        
        public EsferaTributaria Esfera { get; set; }
        public TipoTributo Tipo { get; set; }
        public bool IsAtivo { get; set; }
    }
}