namespace back.Domain.Pricing.ValueObjects;

public readonly record struct Money(decimal Value, string Currency = "BRL")
{
    public static Money Zero => new(0m);

    public Money EnsurePositiveOrZero(string fieldName)
    {
        if (Value < 0)
        {
            throw new ArgumentOutOfRangeException(fieldName, "Monetary values cannot be negative.");
        }

        return this;
    }
}
