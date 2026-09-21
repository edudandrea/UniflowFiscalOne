namespace back.Application.Pricing.DTOs;

public sealed class PricingWorkspaceResponse
{
    public ProductPricingResponse Product { get; set; } = new();
    public ScenarioPricingResponse Scenario { get; set; } = new();
    public LastUpdateResponse LastUpdate { get; set; } = new();
    public IReadOnlyCollection<SalesChannelPricingResponse> Channels { get; set; } = [];
    public CalculatePriceRequest CalculationRequest { get; set; } = new();
}

public sealed class ProductPricingResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Ncm { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public sealed class ScenarioPricingResponse
{
    public string Company { get; set; } = string.Empty;
    public string Branch { get; set; } = string.Empty;
    public string SelectedChannel { get; set; } = string.Empty;
    public DateOnly OperationDate { get; set; }
}

public sealed class LastUpdateResponse
{
    public DateTime UpdatedAt { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;
}

public sealed class SalesChannelPricingResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal CurrentPrice { get; set; }
    public decimal Multiplier { get; set; } = 1m;
    public string Status { get; set; } = string.Empty;
}
