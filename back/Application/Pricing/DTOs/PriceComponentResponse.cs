using back.Domain.Pricing.Enums;

namespace back.Application.Pricing.DTOs;

public sealed class PriceComponentResponse
{
    public PriceComponentType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal? Percentage { get; set; }
    public decimal Value { get; set; }
}
