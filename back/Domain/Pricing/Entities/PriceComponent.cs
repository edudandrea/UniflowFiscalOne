using back.Domain.Pricing.Enums;

namespace back.Domain.Pricing.Entities;

public class PriceComponent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PriceFormationId { get; set; }
    public PriceComponentType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal? Percentage { get; set; }
    public decimal Value { get; set; }
}
