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
        public string PassHash { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int RoleId { get; set; }
        public DateTime LastLogin { get; set; }
    }
}