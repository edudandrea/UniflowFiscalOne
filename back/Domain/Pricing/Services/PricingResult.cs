using back.Domain.Pricing.Entities;

namespace back.Domain.Pricing.Services;

public sealed record PricingResult(
    decimal EffectiveCost,
    decimal MinimumPrice,
    decimal SuggestedPrice,
    decimal TargetPrice,
    decimal Margin,
    decimal Markup,
    IReadOnlyCollection<PriceComponent> Components);
