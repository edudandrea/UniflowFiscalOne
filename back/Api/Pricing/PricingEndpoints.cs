using back.Application.Pricing;
using back.Application.Pricing.DTOs;
using back.Domain.Pricing.Enums;
using back.Domain.Pricing.Services;

namespace back.Api.Pricing;

public static class PricingEndpoints
{
    public static IEndpointRouteBuilder MapPricingEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/pricing")
            .WithTags("Pricing");

        group.MapPost("/calculate", CalculateAsync)
            .WithName("CalculateProductPrice");

        group.MapPost("/simulate", CalculateAsync)
            .WithName("SimulateProductPrice");

        group.MapGet("/products/{productId:guid}/workspace", GetWorkspace)
            .WithName("GetProductPricingWorkspace");

        return endpoints;
    }

    private static IResult GetWorkspace(Guid productId)
    {
        var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var companyId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var establishmentId = Guid.Parse("33333333-3333-3333-3333-333333333333");

        return Results.Ok(new PricingWorkspaceResponse
        {
            Product = new ProductPricingResponse
            {
                Id = productId,
                Name = "Oleo Motor 5W30",
                Code = "000154",
                Status = "Ativo",
                Ncm = "27101932",
                Brand = "Shell",
                Category = "Lubrificantes"
            },
            Scenario = new ScenarioPricingResponse
            {
                Company = "Empresa Alfa Ltda",
                Branch = "Matriz - Caxias do Sul/RS",
                SelectedChannel = "Balcao",
                OperationDate = new DateOnly(2026, 9, 21)
            },
            LastUpdate = new LastUpdateResponse
            {
                UpdatedAt = new DateTime(2026, 9, 21, 10, 24, 0, DateTimeKind.Utc),
                UpdatedBy = "Eduardo Almeida"
            },
            Channels =
            [
                new() { Id = Guid.Parse("44444444-4444-4444-4444-444444444441"), Name = "Balcao", CurrentPrice = 159.90m, Multiplier = 1.00m, Status = "Atualizado" },
                new() { Id = Guid.Parse("44444444-4444-4444-4444-444444444442"), Name = "E-commerce", CurrentPrice = 169.90m, Multiplier = 1.07m, Status = "Simular" },
                new() { Id = Guid.Parse("44444444-4444-4444-4444-444444444443"), Name = "Marketplace", CurrentPrice = 189.90m, Multiplier = 1.19m, Status = "Simular" },
                new() { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Atacado", CurrentPrice = 149.90m, Multiplier = 0.93m, Status = "Simular" }
            ],
            CalculationRequest = new CalculatePriceRequest
            {
                TenantId = tenantId,
                CompanyId = companyId,
                EstablishmentId = establishmentId,
                ProductId = productId,
                SalesChannelId = Guid.Parse("44444444-4444-4444-4444-444444444441"),
                OperationDate = new DateOnly(2026, 9, 21),
                OriginState = "RS",
                DestinationState = "RS",
                DestinationCityCode = 4305108,
                Ncm = "27101932",
                ManualAcquisitionCost = 100m,
                FreightCost = 4m,
                InsuranceCost = 0.50m,
                OtherCosts = 1.50m,
                DesiredMargin = 30m,
                MinimumMargin = 22m,
                CurrentPrice = 159.90m,
                TaxableBase = 159.90m,
                RoundingType = PriceRoundingType.EndsWithNinety,
                CostSource = ProductCostSource.Manual,
                Expenses =
                [
                    new PricingExpense { Type = PriceComponentType.Commission, Description = "Comissao vendedor", Percentage = 3.00m },
                    new PricingExpense { Type = PriceComponentType.FinancialFee, Description = "Taxa cartao", Percentage = 2.49m },
                    new PricingExpense { Type = PriceComponentType.OtherExpense, Description = "Outras despesas", Percentage = 0.50m }
                ]
            }
        });
    }

    private static async Task<IResult> CalculateAsync(
        CalculatePriceRequest request,
        CalculateProductPriceService service,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await service.CalculateAsync(request, cancellationToken);
            return Results.Ok(result);
        }
        catch (ArgumentOutOfRangeException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
    }
}
