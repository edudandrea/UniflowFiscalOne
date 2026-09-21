namespace back.TaxCore;

public sealed class TaxCalculationResult
{
    public static TaxCalculationResult Empty => new();

    public decimal CbsRate { get; set; }
    public decimal CbsValue { get; set; }
    public decimal IbsRate { get; set; }
    public decimal IbsValue { get; set; }
    public decimal IsRate { get; set; }
    public decimal IsValue { get; set; }
    public decimal TotalTaxes { get; set; }
    public decimal TaxCredits { get; set; }
}
