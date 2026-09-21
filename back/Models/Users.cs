using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class Users
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TenantId { get; set; }
        public int EmpresaId { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string Cargo { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public string AccessModules { get; set; } = string.Empty;
        public string PassHash { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int RoleId { get; set; }
        public DateTime LastLogin { get; set; }
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    }
}
