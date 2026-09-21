using back.Domain.Pricing.Enums;

namespace back.Application.Pricing.Costs;

public sealed class InMemoryProductCostService : IProductCostService
{
    public Task<ProductCostResult> GetCostAsync(
        Guid companyId,
        Guid establishmentId,
        Guid productId,
        ProductCostSource source,
        decimal? manualAcquisitionCost,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        return Task.FromResult(new ProductCostResult
        {
            Source = source,
            AcquisitionCost = manualAcquisitionCost ?? 0m,
            Freight = 0m,
            Insurance = 0m,
            OtherCosts = 0m
        });
    }
}
