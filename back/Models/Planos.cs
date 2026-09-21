using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class Planos
    {
        public int PlanoId { get; set; }
        public string PlanoNome { get; set; } = string.Empty;
        public int Limite_Usuarios { get; set; }
        public int Limita_Documentos { get; set; }
        public int UsaIA { get; set; }
        

    }
}