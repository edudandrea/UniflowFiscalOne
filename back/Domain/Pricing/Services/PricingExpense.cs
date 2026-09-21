using back.Domain.Pricing.Enums;

namespace back.Domain.Pricing.Services;

public sealed class PricingExpense
{
    public PriceComponentType Type { get; set; } = PriceComponentType.OtherExpense;
    public string Description { get; set; } = string.Empty;
    public decimal? Percentage { get; set; }
    public decimal Value { get; set; }
}
