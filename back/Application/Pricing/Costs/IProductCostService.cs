using back.Domain.Pricing.Enums;

namespace back.Application.Pricing.Costs;

public interface IProductCostService
{
    Task<ProductCostResult> GetCostAsync(
        Guid companyId,
        Guid establishmentId,
        Guid productId,
        ProductCostSource source,
        decimal? manualAcquisitionCost,
        CancellationToken cancellationToken);
}
