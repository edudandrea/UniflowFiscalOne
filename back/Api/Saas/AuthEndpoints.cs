using back.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace back.Api.Saas;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/auth")
            .WithTags("Auth");

        group.MapPost("/login", Login)
            .WithName("Login");

        return endpoints;
    }

    private static async Task<IResult> Login(
        LoginRequest request,
        UniFlowDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Results.BadRequest(new { error = "E-mail e obrigatorio." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await (
            from item in dbContext.Users.AsNoTracking()
            join company in dbContext.Empresas.AsNoTracking()
                on item.EmpresaId equals company.EmpresaId into companyGroup
            from company in companyGroup.DefaultIfEmpty()
            where item.Email == email && item.IsActive
            select new LoginResponse
            {
                Id = item.UserId,
                Nome = item.Name,
                Email = item.Email,
                Role = item.UserType,
                EmpresaId = item.EmpresaId,
                EmpresaNome = company == null ? string.Empty : company.nome
            })
            .FirstOrDefaultAsync(cancellationToken);

        return user is null
            ? Results.Unauthorized()
            : Results.Ok(user);
    }
}

public sealed class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}

public sealed class LoginResponse
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int EmpresaId { get; set; }
    public string EmpresaNome { get; set; } = string.Empty;
}
