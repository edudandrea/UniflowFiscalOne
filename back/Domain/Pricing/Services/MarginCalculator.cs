namespace back.Domain.Pricing.Services;

public static class MarginCalculator
{
    public static decimal CalculateMarginPercentage(decimal price, decimal totalCost)
    {
        if (price <= 0)
        {
            return 0m;
        }

        return Math.Round(((price - totalCost) / price) * 100m, 4, MidpointRounding.AwayFromZero);
    }

    public static decimal CalculateMarkupPercentage(decimal price, decimal effectiveCost)
    {
        if (effectiveCost <= 0)
        {
            return 0m;
        }

        return Math.Round(((price / effectiveCost) - 1m) * 100m, 4, MidpointRounding.AwayFromZero);
    }
}
