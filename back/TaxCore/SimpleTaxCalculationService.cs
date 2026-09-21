namespace back.TaxCore;

public sealed class SimpleTaxCalculationService : ITaxCalculationService
{
    private const decimal DefaultCbsRate = 0.90m;
    private const decimal DefaultIbsRate = 17.70m;

    public Task<TaxCalculationResult> CalculateAsync(
        TaxCalculationContext context,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var operationValue = Math.Max(0m, context.OperationValue);
        var cbsValue = RoundMoney(operationValue * (DefaultCbsRate / 100m));
        var ibsValue = RoundMoney(operationValue * (DefaultIbsRate / 100m));

        return Task.FromResult(new TaxCalculationResult
        {
            CbsRate = DefaultCbsRate,
            CbsValue = cbsValue,
            IbsRate = DefaultIbsRate,
            IbsValue = ibsValue,
            IsRate = 0m,
            IsValue = 0m,
            TotalTaxes = cbsValue + ibsValue,
            TaxCredits = 0m
        });
    }

    private static decimal RoundMoney(decimal value)
    {
        return Math.Round(value, 2, MidpointRounding.AwayFromZero);
    }
}
