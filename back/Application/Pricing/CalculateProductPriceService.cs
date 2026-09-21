using back.Application.Pricing.Costs;
using back.Application.Pricing.DTOs;
using back.Domain.Pricing.Entities;
using back.Domain.Pricing.Enums;
using back.Domain.Pricing.Services;
using back.TaxCore;

namespace back.Application.Pricing;

public sealed class CalculateProductPriceService
{
    private readonly IProductCostService _costService;
    private readonly ITaxCalculationService _taxService;
    private readonly IPricingEngine _pricingEngine;

    public CalculateProductPriceService(
        IProductCostService costService,
        ITaxCalculationService taxService,
        IPricingEngine pricingEngine)
    {
        _costService = costService;
        _taxService = taxService;
        _pricingEngine = pricingEngine;
    }

    public async Task<CalculatePriceResponse> CalculateAsync(
        CalculatePriceRequest request,
        CancellationToken cancellationToken)
    {
        var cost = await _costService.GetCostAsync(
            request.CompanyId,
            request.EstablishmentId,
            request.ProductId,
            request.CostSource,
            request.ManualAcquisitionCost,
            cancellationToken);

        var taxableBase = request.TaxableBase > 0
            ? request.TaxableBase
            : request.CurrentPrice;

        var taxes = await _taxService.CalculateAsync(
            new TaxCalculationContext
            {
                CompanyId = request.CompanyId,
                EstablishmentId = request.EstablishmentId,
                ProductId = request.ProductId,
                OperationDate = request.OperationDate,
                OriginState = request.OriginState,
                DestinationState = request.DestinationState,
                DestinationCityCode = request.DestinationCityCode,
                Ncm = request.Ncm,
                OperationValue = taxableBase
            },
            cancellationToken);

        var result = _pricingEngine.Calculate(new PricingContext
        {
            AcquisitionCost = cost.AcquisitionCost,
            FreightCost = request.FreightCost + cost.Freight,
            InsuranceCost = request.InsuranceCost + cost.Insurance,
            OtherCosts = request.OtherCosts + cost.OtherCosts,
            TaxCredits = taxes.TaxCredits,
            DesiredMargin = request.DesiredMargin,
            MinimumMargin = request.MinimumMargin,
            RoundingType = request.RoundingType,
            Expenses = request.Expenses,
            Taxes = taxes
        });

        var formation = CreateCalculatedFormation(request, result, cost.AcquisitionCost);

        return new CalculatePriceResponse
        {
            FormationId = formation.Id,
            Status = formation.Status,
            EffectiveCost = result.EffectiveCost,
            MinimumPrice = result.MinimumPrice,
            SuggestedPrice = result.SuggestedPrice,
            TargetPrice = result.TargetPrice,
            Margin = result.Margin,
            Markup = result.Markup,
            Components = result.Components.Select(component => new PriceComponentResponse
            {
                Type = component.Type,
                Description = component.Description,
                Percentage = component.Percentage,
                Value = component.Value
            }).ToArray()
        };
    }

    private static PriceFormation CreateCalculatedFormation(
        CalculatePriceRequest request,
        PricingResult result,
        decimal baseCost)
    {
        var formationId = Guid.NewGuid();

        return new PriceFormation
        {
            Id = formationId,
            TenantId = request.TenantId,
            CompanyId = request.CompanyId,
            EstablishmentId = request.EstablishmentId,
            ProductId = request.ProductId,
            SalesChannelId = request.SalesChannelId,
            BaseCost = baseCost,
            EffectiveCost = result.EffectiveCost,
            CurrentPrice = request.CurrentPrice,
            MinimumPrice = result.MinimumPrice,
            SuggestedPrice = result.SuggestedPrice,
            TargetPrice = result.TargetPrice,
            DesiredMargin = request.DesiredMargin,
            CalculatedMargin = result.Margin,
            Markup = result.Markup,
            Status = PriceFormationStatus.Calculated,
            Components = result.Components
                .Select(component =>
                {
                    component.PriceFormationId = formationId;
                    return component;
                })
                .ToArray()
        };
    }
}
