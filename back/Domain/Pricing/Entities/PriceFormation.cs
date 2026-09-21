using back.Domain.Pricing.Enums;

namespace back.Domain.Pricing.Entities;

public class PriceFormation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid CompanyId { get; set; }
    public Guid EstablishmentId { get; set; }
    public Guid ProductId { get; set; }
    public Guid? SalesChannelId { get; set; }
    public Guid? PricePolicyId { get; set; }
    public decimal BaseCost { get; set; }
    public decimal EffectiveCost { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal MinimumPrice { get; set; }
    public decimal SuggestedPrice { get; set; }
    public decimal TargetPrice { get; set; }
    public decimal DesiredMargin { get; set; }
    public decimal CalculatedMargin { get; set; }
    public decimal Markup { get; set; }
    public DateTime CalculationDate { get; set; } = DateTime.UtcNow;
    public PriceFormationStatus Status { get; set; } = PriceFormationStatus.Draft;
    public ICollection<PriceComponent> Components { get; set; } = [];
}
