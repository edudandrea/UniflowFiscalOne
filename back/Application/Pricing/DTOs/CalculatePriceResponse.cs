using back.Domain.Pricing.Enums;

namespace back.Application.Pricing.DTOs;

public sealed class CalculatePriceResponse
{
    public Guid FormationId { get; set; }
    public PriceFormationStatus Status { get; set; }
    public decimal EffectiveCost { get; set; }
    public decimal MinimumPrice { get; set; }
    public decimal SuggestedPrice { get; set; }
    public decimal TargetPrice { get; set; }
    public decimal Margin { get; set; }
    public decimal Markup { get; set; }
    public IReadOnlyCollection<PriceComponentResponse> Components { get; set; } = [];
}
