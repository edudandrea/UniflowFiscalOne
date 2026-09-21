using back.Domain.Pricing.Enums;

namespace back.Application.Pricing.Costs;

public sealed class ProductCostResult
{
    public ProductCostSource Source { get; set; }
    public decimal AcquisitionCost { get; set; }
    public decimal Freight { get; set; }
    public decimal Insurance { get; set; }
    public decimal OtherCosts { get; set; }
}
