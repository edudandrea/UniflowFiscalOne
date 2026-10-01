using back.Domain.Pricing.Entities;
using back.Models;
using Microsoft.EntityFrameworkCore;

namespace back.Infrastructure.Persistence;

public sealed class UniFlowDbContext : DbContext
{
    public UniFlowDbContext(DbContextOptions<UniFlowDbContext> options)
        : base(options)
    {
    }

    public DbSet<Empresas> Empresas => Set<Empresas>();
    public DbSet<Enderecos> Enderecos => Set<Enderecos>();
    public DbSet<Produtos> Produtos => Set<Produtos>();
    public DbSet<Servicos> Servicos => Set<Servicos>();
    public DbSet<Empresa_Config_Fiscal> EmpresasConfigFiscal => Set<Empresa_Config_Fiscal>();

    public DbSet<PriceFormation> PriceFormations => Set<PriceFormation>();
    public DbSet<PriceComponent> PriceComponents => Set<PriceComponent>();
    public DbSet<PricePolicy> PricePolicies => Set<PricePolicy>();
    public DbSet<SalesChannel> SalesChannels => Set<SalesChannel>();
    public DbSet<PriceHistory> PriceHistory => Set<PriceHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("public");
        ConfigureCatalog(modelBuilder);
        ConfigurePricing(modelBuilder);
    }

    private static void ConfigureCatalog(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Empresas>(entity =>
        {
            entity.ToTable("companies", "catalog");
            entity.HasKey(item => item.EmpresaId);
            entity.Property(item => item.Tipo).HasMaxLength(40);
            entity.Property(item => item.CNPJ).HasMaxLength(18);
            entity.Property(item => item.nome).HasMaxLength(180);
            entity.Property(item => item.NomeFantasia).HasMaxLength(180);
            entity.Property(item => item.UF).HasMaxLength(2);
            entity.Property(item => item.InscricaoEstadual).HasMaxLength(30);
            entity.Property(item => item.InscricaoMunicipal).HasMaxLength(30);
            entity.Property(item => item.Segmento).HasMaxLength(120);
            entity.Property(item => item.EmailPrincipal).HasMaxLength(180);
            entity.Property(item => item.Telefone).HasMaxLength(32);
            entity.Property(item => item.Site).HasMaxLength(240);
            entity.Property(item => item.Plano).HasMaxLength(80);
            entity.Property(item => item.Situacao).HasMaxLength(40);
            entity.Property(item => item.CriadoEm).HasDefaultValueSql("now()");
        });

        modelBuilder.Entity<Enderecos>(entity =>
        {
            entity.ToTable("addresses", "catalog");
            entity.HasKey(item => item.EnderecoId);
            entity.Property(item => item.Tipo).HasMaxLength(40);
            entity.Property(item => item.Logradouro).HasMaxLength(180);
            entity.Property(item => item.Numero).HasMaxLength(30);
            entity.Property(item => item.Complemento).HasMaxLength(120);
            entity.Property(item => item.Bairro).HasMaxLength(120);
            entity.Property(item => item.Cidade).HasMaxLength(120);
            entity.Property(item => item.Estado).HasMaxLength(2);
            entity.Property(item => item.CEP).HasMaxLength(12);
        });

        modelBuilder.Entity<Produtos>(entity =>
        {
            entity.ToTable("products", "catalog");
            entity.HasKey(item => item.ProdutoId);
            entity.Property(item => item.Nome).HasMaxLength(180);
            entity.Property(item => item.Codigo).HasMaxLength(60);
            entity.Property(item => item.Descricao).HasMaxLength(500);
            entity.Property(item => item.OrigemMercadoria).HasMaxLength(80);
        });

        modelBuilder.Entity<Servicos>(entity =>
        {
            entity.ToTable("services", "catalog");
            entity.HasKey(item => item.ServicoId);
            entity.Property(item => item.Nome).HasMaxLength(180);
            entity.Property(item => item.Codigo).HasMaxLength(60);
            entity.Property(item => item.Descricao).HasMaxLength(500);
        });

        modelBuilder.Entity<Empresa_Config_Fiscal>(entity =>
        {
            entity.ToTable("company_fiscal_config", "catalog");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.RegimeTributario).HasMaxLength(80);
        });
    }

    private static void ConfigurePricing(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PriceFormation>(entity =>
        {
            entity.ToTable("price_formations", "pricing");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.BaseCost).HasPrecision(18, 4);
            entity.Property(item => item.EffectiveCost).HasPrecision(18, 4);
            entity.Property(item => item.CurrentPrice).HasPrecision(18, 4);
            entity.Property(item => item.MinimumPrice).HasPrecision(18, 4);
            entity.Property(item => item.SuggestedPrice).HasPrecision(18, 4);
            entity.Property(item => item.TargetPrice).HasPrecision(18, 4);
            entity.Property(item => item.DesiredMargin).HasPrecision(9, 4);
            entity.Property(item => item.CalculatedMargin).HasPrecision(9, 4);
            entity.Property(item => item.Markup).HasPrecision(9, 4);
            entity.HasMany(item => item.Components)
                .WithOne()
                .HasForeignKey(item => item.PriceFormationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PriceComponent>(entity =>
        {
            entity.ToTable("price_components", "pricing");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Description).HasMaxLength(180);
            entity.Property(item => item.Percentage).HasPrecision(9, 4);
            entity.Property(item => item.Value).HasPrecision(18, 4);
        });

        modelBuilder.Entity<PricePolicy>(entity =>
        {
            entity.ToTable("price_policies", "pricing");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Name).HasMaxLength(120);
            entity.Property(item => item.DesiredMargin).HasPrecision(9, 4);
            entity.Property(item => item.MinimumMargin).HasPrecision(9, 4);
            entity.Property(item => item.MaximumDiscount).HasPrecision(9, 4);
        });

        modelBuilder.Entity<SalesChannel>(entity =>
        {
            entity.ToTable("sales_channels", "pricing");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Name).HasMaxLength(120);
            entity.Property(item => item.CommissionRate).HasPrecision(9, 4);
            entity.Property(item => item.FinancialFeeRate).HasPrecision(9, 4);
            entity.Property(item => item.MarketplaceFeeRate).HasPrecision(9, 4);
        });

        modelBuilder.Entity<PriceHistory>(entity =>
        {
            entity.ToTable("price_history", "pricing");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.PreviousPrice).HasPrecision(18, 4);
            entity.Property(item => item.NewPrice).HasPrecision(18, 4);
            entity.Property(item => item.PreviousMargin).HasPrecision(9, 4);
            entity.Property(item => item.NewMargin).HasPrecision(9, 4);
            entity.Property(item => item.Reason).HasMaxLength(300);
            entity.Property(item => item.ApprovedBy).HasMaxLength(160);
        });
    }
}
