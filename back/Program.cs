using back.Api.Pricing;
using back.Api.Catalog;
using back.Api.Saas;
using back.Application.Pricing;
using back.Application.Pricing.Costs;
using back.Domain.Pricing.Services;
using back.Infrastructure;
using back.TaxCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<CalculateProductPriceService>();
builder.Services.AddSingleton<IPricingEngine, PricingEngine>();
builder.Services.AddScoped<IProductCostService, InMemoryProductCostService>();
builder.Services.AddScoped<ITaxCalculationService, SimpleTaxCalculationService>();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("LocalAngular");
app.MapProductServicesEndpoints();
app.MapPricingEndpoints();
app.MapContractingCompaniesEndpoints();
app.MapContractingUsersEndpoints();
app.MapAuthEndpoints();

app.Run();
