using back.Application.Catalog.DTOs;

namespace back.Api.Catalog;

public static class ProductServicesEndpoints
{
    public static IEndpointRouteBuilder MapProductServicesEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/product-services")
            .WithTags("ProductServices");

        group.MapGet("", GetList)
            .WithName("GetProductServices");

        group.MapGet("/draft", GetDraft)
            .WithName("GetProductServiceDraft");

        group.MapPost("", Save)
            .WithName("SaveProductService");

        return endpoints;
    }

    private static IResult GetList()
    {
        ProductServiceListItemDto[] items =
        [
            new()
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                InternalCode = "000154",
                Description = "Oleo Motor Sintetico 5W30",
                ItemType = "Produto",
                Category = "Lubrificantes",
                Ncm = "2710.19.32",
                CurrentCost = 106m,
                Status = "Ativo",
                TaxCoreStatus = "Validado"
            }
        ];

        return Results.Ok(items);
    }

    private static IResult GetDraft()
    {
        return Results.Ok(new ProductServiceDraftResponse
        {
            General = new ProductServiceGeneralDto
            {
                ItemType = "Product",
                InternalCode = "000154",
                Barcode = "7891234567890",
                Description = "Oleo Motor Sintetico 5W30",
                Category = "Lubrificantes",
                Brand = "Shell",
                Unit = "UN",
                Active = true
            },
            Fiscal = new ProductServiceFiscalDto
            {
                Ncm = "2710.19.32",
                NcmDescription = "Oleos lubrificantes derivados de petroleo.",
                Origin = "0 - Nacional",
                Cest = "06.007.00",
                AnpCode = "620501001",
                TaxClassification = "Classificacao automatica pelo TaxCore",
                TaxCoreStatus = "Classificacao fiscal validada"
            },
            Cost = new ProductServiceCostDto
            {
                CostSource = "Manual",
                CurrentCost = 100m,
                FreightCost = 4m,
                InsuranceCost = 0.50m,
                OtherCosts = 1.50m
            },
            Settings = new ProductServiceSettingsDto
            {
                ParticipatesInPricing = true,
                AllowTaxSimulation = true,
                MonitorCostChanges = true,
                AlertBelowMinimumMargin = true,
                DefaultPricePolicy = "Varejo padrao",
                DefaultSalesChannel = "Balcao",
                DesiredMargin = 30m,
                MinimumMargin = 20m
            },
            CostHistory =
            [
                new() { Date = new DateOnly(2026, 8, 28), Cost = 106m, Variation = 6.0m },
                new() { Date = new DateOnly(2026, 7, 15), Cost = 100m, Variation = 2.1m },
                new() { Date = new DateOnly(2026, 6, 2), Cost = 97.94m }
            ]
        });
    }

    private static IResult Save(SaveProductServiceRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.General.InternalCode) ||
            string.IsNullOrWhiteSpace(request.General.Description))
        {
            return Results.BadRequest(new { error = "Codigo interno e descricao sao obrigatorios." });
        }

        if (string.IsNullOrWhiteSpace(request.Fiscal.Ncm))
        {
            return Results.BadRequest(new { error = "NCM e obrigatorio para produtos." });
        }

        return Results.Ok(new SaveProductServiceResponse
        {
            Id = request.General.Id ?? Guid.NewGuid(),
            InternalCode = request.General.InternalCode,
            Description = request.General.Description,
            Status = request.General.Active ? "Ativo" : "Inativo",
            SavedAt = DateTime.UtcNow
        });
    }
}
