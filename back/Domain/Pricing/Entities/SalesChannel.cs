namespace back.Domain.Pricing.Entities;

public class SalesChannel
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal CommissionRate { get; set; }
    public decimal FinancialFeeRate { get; set; }
    public decimal MarketplaceFeeRate { get; set; }
}
