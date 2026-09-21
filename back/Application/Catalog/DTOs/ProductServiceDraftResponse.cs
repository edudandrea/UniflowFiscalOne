namespace back.Application.Catalog.DTOs;

public sealed class ProductServiceDraftResponse
{
    public ProductServiceGeneralDto General { get; set; } = new();
    public ProductServiceFiscalDto Fiscal { get; set; } = new();
    public ProductServiceCostDto Cost { get; set; } = new();
    public ProductServiceSettingsDto Settings { get; set; } = new();
    public IReadOnlyCollection<CostHistoryDto> CostHistory { get; set; } = [];
}

public sealed class ProductServiceGeneralDto
{
    public Guid? Id { get; set; }
    public string ItemType { get; set; } = "Product";
    public string InternalCode { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public bool Active { get; set; } = true;
}

public sealed class ProductServiceFiscalDto
{
    public string Ncm { get; set; } = string.Empty;
    public string NcmDescription { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Cest { get; set; } = string.Empty;
    public string AnpCode { get; set; } = string.Empty;
    public string TaxClassification { get; set; } = string.Empty;
    public string TaxCoreStatus { get; set; } = string.Empty;
}

public sealed class ProductServiceCostDto
{
    public string CostSource { get; set; } = "Manual";
    public decimal CurrentCost { get; set; }
    public decimal FreightCost { get; set; }
    public decimal InsuranceCost { get; set; }
    public decimal OtherCosts { get; set; }
}

public sealed class ProductServiceSettingsDto
{
    public bool ParticipatesInPricing { get; set; } = true;
    public bool AllowTaxSimulation { get; set; } = true;
    public bool MonitorCostChanges { get; set; } = true;
    public bool AlertBelowMinimumMargin { get; set; } = true;
    public string DefaultPricePolicy { get; set; } = string.Empty;
    public string DefaultSalesChannel { get; set; } = string.Empty;
    public decimal DesiredMargin { get; set; }
    public decimal MinimumMargin { get; set; }
}

public sealed class CostHistoryDto
{
    public DateOnly Date { get; set; }
    public decimal Cost { get; set; }
    public decimal? Variation { get; set; }
}

public sealed class ProductServiceListItemDto
{
    public Guid Id { get; set; }
    public string InternalCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ItemType { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Ncm { get; set; } = string.Empty;
    public decimal CurrentCost { get; set; }
    public string Status { get; set; } = string.Empty;
    public string TaxCoreStatus { get; set; } = string.Empty;
}
