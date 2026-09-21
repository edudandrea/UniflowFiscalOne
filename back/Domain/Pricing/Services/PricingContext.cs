using back.Domain.Pricing.Enums;
using back.TaxCore;

namespace back.Domain.Pricing.Services;

public sealed class PricingContext
{
    public decimal AcquisitionCost { get; set; }
    public decimal FreightCost { get; set; }
    public decimal InsuranceCost { get; set; }
    public decimal OtherCosts { get; set; }
    public decimal TaxCredits { get; set; }
    public decimal DesiredMargin { get; set; }
    public decimal MinimumMargin { get; set; }
    public PriceRoundingType RoundingType { get; set; } = PriceRoundingType.TwoDecimals;
    public IReadOnlyCollection<PricingExpense> Expenses { get; set; } = [];
    public TaxCalculationResult Taxes { get; set; } = TaxCalculationResult.Empty;
}
