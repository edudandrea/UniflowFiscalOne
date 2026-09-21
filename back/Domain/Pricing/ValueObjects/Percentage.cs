namespace back.Domain.Pricing.ValueObjects;

public readonly record struct Percentage(decimal Value)
{
    public decimal AsRate => Value / 100m;

    public static Percentage FromRate(decimal rate) => new(rate * 100m);

    public Percentage EnsureBetweenZeroAndOneHundred(string fieldName)
    {
        if (Value < 0 || Value >= 100)
        {
            throw new ArgumentOutOfRangeException(fieldName, "Percentage must be greater than or equal to 0 and lower than 100.");
        }

        return this;
    }
}
