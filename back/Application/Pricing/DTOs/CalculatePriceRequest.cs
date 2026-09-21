using back.Domain.Pricing.Enums;
using back.Domain.Pricing.Services;

namespace back.Application.Pricing.DTOs;

public sealed class CalculatePriceRequest
{
    public Guid TenantId { get; set; }
    public Guid CompanyId { get; set; }
    public Guid EstablishmentId { get; set; }
    public Guid ProductId { get; set; }
    public Guid? SalesChannelId { get; set; }
    public DateOnly OperationDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public string OriginState { get; set; } = string.Empty;
    public string DestinationState { get; set; } = string.Empty;
    public int DestinationCityCode { get; set; }
    public string Ncm { get; set; } = string.Empty;
    public decimal? ManualAcquisitionCost { get; set; }
    public decimal FreightCost { get; set; }
    public decimal InsuranceCost { get; set; }
    public decimal OtherCosts { get; set; }
    public decimal DesiredMargin { get; set; } = 30m;
    public decimal MinimumMargin { get; set; } = 20m;
    public decimal CurrentPrice { get; set; }
    public decimal TaxableBase { get; set; }
    public PriceRoundingType RoundingType { get; set; } = PriceRoundingType.TwoDecimals;
    public ProductCostSource CostSource { get; set; } = ProductCostSource.Manual;
    public IReadOnlyCollection<PricingExpense> Expenses { get; set; } = [];
}
