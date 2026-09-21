using back.Domain.Pricing.Entities;
using back.Domain.Pricing.Enums;

namespace back.Domain.Pricing.Services;

public sealed class PricingEngine : IPricingEngine
{
    public PricingResult Calculate(PricingContext context)
    {
        Validate(context);

        var components = BuildComponents(context);
        var effectiveCost = context.AcquisitionCost
            + context.FreightCost
            + context.InsuranceCost
            + context.OtherCosts
            - context.TaxCredits;

        var fixedExpenses = context.Expenses.Where(expense => expense.Percentage is null).Sum(expense => expense.Value);
        var percentageExpensesRate = context.Expenses
            .Where(expense => expense.Percentage is not null)
            .Sum(expense => expense.Percentage!.Value) / 100m;

        var knownCost = effectiveCost + context.Taxes.TotalTaxes + fixedExpenses;
        var suggestedPrice = CalculatePrice(knownCost, context.DesiredMargin / 100m, percentageExpensesRate);
        var minimumPrice = CalculatePrice(knownCost, context.MinimumMargin / 100m, percentageExpensesRate);
        var targetPrice = ApplyRounding(suggestedPrice, context.RoundingType);

        var variableExpenseValue = targetPrice * percentageExpensesRate;
        AddPercentageExpenses(components, context, targetPrice);

        var totalCostAtTargetPrice = knownCost + variableExpenseValue;
        var margin = MarginCalculator.CalculateMarginPercentage(targetPrice, totalCostAtTargetPrice);
        var markup = MarginCalculator.CalculateMarkupPercentage(targetPrice, effectiveCost);

        return new PricingResult(
            RoundMoney(effectiveCost),
            ApplyRounding(minimumPrice, context.RoundingType),
            RoundMoney(suggestedPrice),
            targetPrice,
            margin,
            markup,
            components);
    }

    private static List<PriceComponent> BuildComponents(PricingContext context)
    {
        var components = new List<PriceComponent>
        {
            CreateComponent(PriceComponentType.ProductCost, "Custo de aquisição", null, context.AcquisitionCost),
            CreateComponent(PriceComponentType.Freight, "Frete", null, context.FreightCost),
            CreateComponent(PriceComponentType.Insurance, "Seguro", null, context.InsuranceCost),
            CreateComponent(PriceComponentType.OtherCost, "Outros custos", null, context.OtherCosts),
            CreateComponent(PriceComponentType.TaxCredit, "Créditos tributários", null, -context.TaxCredits),
            CreateComponent(PriceComponentType.Cbs, "CBS", context.Taxes.CbsRate, context.Taxes.CbsValue),
            CreateComponent(PriceComponentType.Ibs, "IBS", context.Taxes.IbsRate, context.Taxes.IbsValue),
            CreateComponent(PriceComponentType.SelectiveTax, "Imposto Seletivo", context.Taxes.IsRate, context.Taxes.IsValue)
        };

        components.AddRange(context.Expenses
            .Where(expense => expense.Percentage is null)
            .Select(expense => CreateComponent(expense.Type, expense.Description, null, expense.Value)));

        return components.Where(component => component.Value != 0 || component.Percentage is not null).ToList();
    }

    private static void AddPercentageExpenses(List<PriceComponent> components, PricingContext context, decimal targetPrice)
    {
        foreach (var expense in context.Expenses.Where(expense => expense.Percentage is not null))
        {
            var value = RoundMoney(targetPrice * (expense.Percentage!.Value / 100m));
            components.Add(CreateComponent(expense.Type, expense.Description, expense.Percentage, value));
        }
    }

    private static PriceComponent CreateComponent(PriceComponentType type, string description, decimal? percentage, decimal value)
    {
        return new PriceComponent
        {
            Type = type,
            Description = description,
            Percentage = percentage,
            Value = RoundMoney(value)
        };
    }

    private static decimal CalculatePrice(decimal knownCost, decimal marginRate, decimal percentageExpensesRate)
    {
        var denominator = 1m - marginRate - percentageExpensesRate;
        if (denominator <= 0)
        {
            throw new InvalidOperationException("The sum of desired margin and percentage expenses must be lower than 100%.");
        }

        return RoundMoney(knownCost / denominator);
    }

    private static decimal ApplyRounding(decimal price, PriceRoundingType roundingType)
    {
        return roundingType switch
        {
            PriceRoundingType.None => price,
            PriceRoundingType.NearestFiveCents => Math.Round(price / 0.05m, 0, MidpointRounding.AwayFromZero) * 0.05m,
            PriceRoundingType.EndsWithNinety => Math.Max(0.90m, Math.Ceiling(price) - 0.10m),
            _ => RoundMoney(price)
        };
    }

    private static decimal RoundMoney(decimal value)
    {
        return Math.Round(value, 2, MidpointRounding.AwayFromZero);
    }

    private static void Validate(PricingContext context)
    {
        if (context.AcquisitionCost < 0 || context.FreightCost < 0 || context.InsuranceCost < 0 || context.OtherCosts < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(context), "Costs cannot be negative.");
        }

        if (context.TaxCredits < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(context), "Tax credits cannot be negative.");
        }

        if (context.DesiredMargin < 0 || context.DesiredMargin >= 100 || context.MinimumMargin < 0 || context.MinimumMargin >= 100)
        {
            throw new ArgumentOutOfRangeException(nameof(context), "Margins must be greater than or equal to 0 and lower than 100.");
        }
    }
}
