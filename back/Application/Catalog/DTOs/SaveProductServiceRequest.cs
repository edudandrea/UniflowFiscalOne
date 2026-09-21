namespace back.Application.Catalog.DTOs;

public sealed class SaveProductServiceRequest
{
    public ProductServiceGeneralDto General { get; set; } = new();
    public ProductServiceFiscalDto Fiscal { get; set; } = new();
    public ProductServiceCostDto Cost { get; set; } = new();
    public ProductServiceSettingsDto Settings { get; set; } = new();
}
