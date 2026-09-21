using back.Infrastructure.Persistence;
using back.Models;
using Microsoft.EntityFrameworkCore;

namespace back.Api.Saas;

public static class ContractingCompaniesEndpoints
{
    public static IEndpointRouteBuilder MapContractingCompaniesEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/contracting-companies")
            .WithTags("ContractingCompanies");

        group.MapGet("", GetList)
            .WithName("GetContractingCompanies");

        group.MapPost("", Create)
            .WithName("CreateContractingCompany");

        return endpoints;
    }

    private static async Task<IResult> GetList(UniFlowDbContext dbContext, CancellationToken cancellationToken)
    {
        var companies = await dbContext.Empresas
            .AsNoTracking()
            .OrderByDescending(company => company.EmpresaId)
            .Select(company => new ContractingCompanyResponse
            {
                Id = company.EmpresaId,
                RazaoSocial = company.nome,
                NomeFantasia = company.NomeFantasia,
                Cnpj = company.CNPJ,
                InscricaoEstadual = company.InscricaoEstadual,
                InscricaoMunicipal = company.InscricaoMunicipal,
                Segmento = company.Segmento,
                EmailPrincipal = company.EmailPrincipal,
                Telefone = company.Telefone,
                Site = company.Site,
                Uf = company.UF,
                Plano = company.Plano,
                Situacao = company.Situacao,
                CriadoEm = company.CriadoEm
            })
            .ToListAsync(cancellationToken);

        return Results.Ok(companies);
    }

    private static async Task<IResult> Create(
        SaveContractingCompanyRequest request,
        UniFlowDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.RazaoSocial))
        {
            return Results.BadRequest(new { error = "Razao social e obrigatoria." });
        }

        if (string.IsNullOrWhiteSpace(request.Cnpj))
        {
            return Results.BadRequest(new { error = "CNPJ e obrigatorio." });
        }

        if (string.IsNullOrWhiteSpace(request.EmailPrincipal))
        {
            return Results.BadRequest(new { error = "E-mail principal e obrigatorio." });
        }

        var cnpj = request.Cnpj.Trim();
        var exists = await dbContext.Empresas
            .AnyAsync(company => company.CNPJ == cnpj, cancellationToken);

        if (exists)
        {
            return Results.Conflict(new { error = "Ja existe uma empresa cadastrada com este CNPJ." });
        }

        var company = new Empresas
        {
            TenantId = request.TenantId ?? 0,
            GrupoEconomicoId = request.GrupoEconomicoId ?? 0,
            Tipo = "Contratante",
            CNPJ = cnpj,
            nome = request.RazaoSocial.Trim(),
            NomeFantasia = request.NomeFantasia?.Trim() ?? string.Empty,
            UF = request.Uf?.Trim().ToUpperInvariant() ?? string.Empty,
            MunicipioId = request.MunicipioId ?? 0,
            InscricaoEstadual = request.InscricaoEstadual?.Trim() ?? string.Empty,
            InscricaoMunicipal = request.InscricaoMunicipal?.Trim() ?? string.Empty,
            Segmento = request.Segmento?.Trim() ?? string.Empty,
            EmailPrincipal = request.EmailPrincipal.Trim(),
            Telefone = request.Telefone?.Trim() ?? string.Empty,
            Site = request.Site?.Trim() ?? string.Empty,
            Plano = request.Plano?.Trim() ?? string.Empty,
            Situacao = string.IsNullOrWhiteSpace(request.Situacao) ? "Ativa" : request.Situacao.Trim(),
            CriadoEm = DateTime.UtcNow
        };

        dbContext.Empresas.Add(company);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Created($"/api/contracting-companies/{company.EmpresaId}", new ContractingCompanyResponse
        {
            Id = company.EmpresaId,
            RazaoSocial = company.nome,
            NomeFantasia = company.NomeFantasia,
            Cnpj = company.CNPJ,
            InscricaoEstadual = company.InscricaoEstadual,
            InscricaoMunicipal = company.InscricaoMunicipal,
            Segmento = company.Segmento,
            EmailPrincipal = company.EmailPrincipal,
            Telefone = company.Telefone,
            Site = company.Site,
            Uf = company.UF,
            Plano = company.Plano,
            Situacao = company.Situacao,
            CriadoEm = company.CriadoEm
        });
    }
}

public sealed class SaveContractingCompanyRequest
{
    public int? TenantId { get; set; }
    public int? GrupoEconomicoId { get; set; }
    public int? MunicipioId { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public string? NomeFantasia { get; set; }
    public string Cnpj { get; set; } = string.Empty;
    public string? InscricaoEstadual { get; set; }
    public string? InscricaoMunicipal { get; set; }
    public string? Segmento { get; set; }
    public string EmailPrincipal { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Site { get; set; }
    public string? Uf { get; set; }
    public string? Plano { get; set; }
    public string? Situacao { get; set; }
}

public sealed class ContractingCompanyResponse
{
    public int Id { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public string NomeFantasia { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public string InscricaoEstadual { get; set; } = string.Empty;
    public string InscricaoMunicipal { get; set; } = string.Empty;
    public string Segmento { get; set; } = string.Empty;
    public string EmailPrincipal { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Site { get; set; } = string.Empty;
    public string Uf { get; set; } = string.Empty;
    public string Plano { get; set; } = string.Empty;
    public string Situacao { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
}
