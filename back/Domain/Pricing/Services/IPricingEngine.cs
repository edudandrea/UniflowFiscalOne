namespace back.Domain.Pricing.Services;

public interface IPricingEngine
{
    PricingResult Calculate(PricingContext context);
}
