using back.Domain.Pricing.Enums;

namespace back.Domain.Pricing.Entities;

public class PricePolicy
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal DesiredMargin { get; set; }
    public decimal MinimumMargin { get; set; }
    public decimal? MaximumDiscount { get; set; }
    public PriceRoundingType RoundingType { get; set; } = PriceRoundingType.TwoDecimals;
}
