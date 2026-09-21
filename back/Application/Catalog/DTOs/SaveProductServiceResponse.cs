namespace back.Application.Catalog.DTOs;

public sealed class SaveProductServiceResponse
{
    public Guid Id { get; set; }
    public string InternalCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime SavedAt { get; set; }
}
