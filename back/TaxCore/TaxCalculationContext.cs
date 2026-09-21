namespace back.TaxCore;

public sealed class TaxCalculationContext
{
    public Guid CompanyId { get; set; }
    public Guid EstablishmentId { get; set; }
    public Guid ProductId { get; set; }
    public DateOnly OperationDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public string OriginState { get; set; } = string.Empty;
    public string DestinationState { get; set; } = string.Empty;
    public int DestinationCityCode { get; set; }
    public string Ncm { get; set; } = string.Empty;
    public decimal OperationValue { get; set; }
}
