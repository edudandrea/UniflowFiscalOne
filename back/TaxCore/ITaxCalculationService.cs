namespace back.TaxCore;

public interface ITaxCalculationService
{
    Task<TaxCalculationResult> CalculateAsync(
        TaxCalculationContext context,
        CancellationToken cancellationToken);
}
