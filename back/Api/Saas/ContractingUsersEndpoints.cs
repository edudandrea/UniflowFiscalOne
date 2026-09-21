using back.Infrastructure.Persistence;
using back.Models;
using Microsoft.EntityFrameworkCore;

namespace back.Api.Saas;

public static class ContractingUsersEndpoints
{
    public static IEndpointRouteBuilder MapContractingUsersEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/contracting-users")
            .WithTags("ContractingUsers");

        group.MapGet("", GetList)
            .WithName("GetContractingUsers");

        group.MapPost("", Create)
            .WithName("CreateContractingUser");

        return endpoints;
    }

    private static async Task<IResult> GetList(UniFlowDbContext dbContext, CancellationToken cancellationToken)
    {
        var users = await (
            from user in dbContext.Users.AsNoTracking()
            join company in dbContext.Empresas.AsNoTracking()
                on user.EmpresaId equals company.EmpresaId into companyGroup
            from company in companyGroup.DefaultIfEmpty()
            orderby user.UserId descending
            select new ContractingUserResponse
            {
                Id = user.UserId,
                Nome = user.Name,
                Email = user.Email,
                Telefone = user.PhoneNumber,
                Cargo = user.Cargo,
                EmpresaId = user.EmpresaId,
                EmpresaNome = company == null ? string.Empty : company.nome,
                TipoAcesso = user.UserType,
                ModulosAcesso = user.AccessModules,
                Ativo = user.IsActive,
                CriadoEm = user.CriadoEm
            })
            .ToListAsync(cancellationToken);

        return Results.Ok(users);
    }

    private static async Task<IResult> Create(
        SaveContractingUserRequest request,
        UniFlowDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Nome))
        {
            return Results.BadRequest(new { error = "Nome completo e obrigatorio." });
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Results.BadRequest(new { error = "E-mail e obrigatorio." });
        }

        if (request.EmpresaId <= 0)
        {
            return Results.BadRequest(new { error = "Selecione uma empresa contratante." });
        }

        var companyExists = await dbContext.Empresas
            .AnyAsync(company => company.EmpresaId == request.EmpresaId, cancellationToken);

        if (!companyExists)
        {
            return Results.BadRequest(new { error = "Empresa contratante nao encontrada." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var exists = await dbContext.Users
            .AnyAsync(user => user.Email == email, cancellationToken);

        if (exists)
        {
            return Results.Conflict(new { error = "Ja existe um usuario cadastrado com este e-mail." });
        }

        var userType = request.TipoAcesso == "UsuarioComum" ? "UsuarioComum" : "EmpresaAdmin";
        var user = new Users
        {
            Name = request.Nome.Trim(),
            Email = email,
            TenantId = request.TenantId ?? 0,
            EmpresaId = request.EmpresaId,
            PhoneNumber = request.Telefone?.Trim() ?? string.Empty,
            Cargo = request.Cargo?.Trim() ?? string.Empty,
            UserType = userType,
            AccessModules = string.Join(",", request.ModulosAcesso ?? []),
            PassHash = string.Empty,
            IsActive = true,
            RoleId = userType == "EmpresaAdmin" ? 2 : 3,
            LastLogin = DateTime.MinValue,
            CriadoEm = DateTime.UtcNow
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        var companyName = await dbContext.Empresas
            .Where(company => company.EmpresaId == user.EmpresaId)
            .Select(company => company.nome)
            .FirstAsync(cancellationToken);

        return Results.Created($"/api/contracting-users/{user.UserId}", new ContractingUserResponse
        {
            Id = user.UserId,
            Nome = user.Name,
            Email = user.Email,
            Telefone = user.PhoneNumber,
            Cargo = user.Cargo,
            EmpresaId = user.EmpresaId,
            EmpresaNome = companyName,
            TipoAcesso = user.UserType,
            ModulosAcesso = user.AccessModules,
            Ativo = user.IsActive,
            CriadoEm = user.CriadoEm
        });
    }
}

public sealed class SaveContractingUserRequest
{
    public int? TenantId { get; set; }
    public int EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Cargo { get; set; }
    public string TipoAcesso { get; set; } = "EmpresaAdmin";
    public IReadOnlyCollection<string> ModulosAcesso { get; set; } = [];
    public bool EnviarEmailBoasVindas { get; set; }
}

public sealed class ContractingUserResponse
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public int EmpresaId { get; set; }
    public string EmpresaNome { get; set; } = string.Empty;
    public string TipoAcesso { get; set; } = string.Empty;
    public string ModulosAcesso { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
}
