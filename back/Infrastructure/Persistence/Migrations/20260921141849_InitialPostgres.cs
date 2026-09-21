using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace back.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "catalog");

            migrationBuilder.EnsureSchema(
                name: "saas");

            migrationBuilder.EnsureSchema(
                name: "pricing");

            migrationBuilder.CreateTable(
                name: "addresses",
                schema: "catalog",
                columns: table => new
                {
                    EnderecoId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    GrupoEconomicoId = table.Column<int>(type: "integer", nullable: false),
                    Tipo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Logradouro = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Numero = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Complemento = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Bairro = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Cidade = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Estado = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    CEP = table.Column<string>(type: "character varying(12)", maxLength: 12, nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_addresses", x => x.EnderecoId);
                });

            migrationBuilder.CreateTable(
                name: "companies",
                schema: "catalog",
                columns: table => new
                {
                    EmpresaId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    GrupoEconomicoId = table.Column<int>(type: "integer", nullable: false),
                    Tipo = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CNPJ = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                    nome = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    UF = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    MunicipioId = table.Column<int>(type: "integer", nullable: false),
                    InscricaoEstadual = table.Column<int>(type: "integer", nullable: false),
                    InscricaoMunicipal = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_companies", x => x.EmpresaId);
                });

            migrationBuilder.CreateTable(
                name: "company_fiscal_config",
                schema: "catalog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    GrupoEconomicoId = table.Column<int>(type: "integer", nullable: false),
                    RegimeTributario = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    ContribuinteICMS = table.Column<bool>(type: "boolean", nullable: false),
                    ContribuinteISS = table.Column<bool>(type: "boolean", nullable: false),
                    UtilizaCreditoCBS = table.Column<bool>(type: "boolean", nullable: false),
                    UtilizaCreditoIBS = table.Column<bool>(type: "boolean", nullable: false),
                    DataInicioVigencia = table.Column<DateOnly>(type: "date", nullable: false),
                    DataFimVigencia = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_company_fiscal_config", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "economic_groups",
                schema: "saas",
                columns: table => new
                {
                    GrupoId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Razao_Social = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Nome_fantazia = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    CNPJ = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                    Email = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    InscricaoEstadual = table.Column<int>(type: "integer", nullable: false),
                    InscricaoMunicipal = table.Column<int>(type: "integer", nullable: false),
                    RegimeTributario = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    CNAE = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    OptanteSimplesNacional = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    UF = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataAtivacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataCancelamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_economic_groups", x => x.GrupoId);
                });

            migrationBuilder.CreateTable(
                name: "plans",
                schema: "saas",
                columns: table => new
                {
                    PlanoId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PlanoNome = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Limite_Usuarios = table.Column<int>(type: "integer", nullable: false),
                    Limita_Documentos = table.Column<int>(type: "integer", nullable: false),
                    UsaIA = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plans", x => x.PlanoId);
                });

            migrationBuilder.CreateTable(
                name: "price_formations",
                schema: "pricing",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    EstablishmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    SalesChannelId = table.Column<Guid>(type: "uuid", nullable: true),
                    PricePolicyId = table.Column<Guid>(type: "uuid", nullable: true),
                    BaseCost = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    EffectiveCost = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    CurrentPrice = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    MinimumPrice = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    SuggestedPrice = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    TargetPrice = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    DesiredMargin = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    CalculatedMargin = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    Markup = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    CalculationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_formations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "price_history",
                schema: "pricing",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    SalesChannelId = table.Column<Guid>(type: "uuid", nullable: true),
                    PriceFormationId = table.Column<Guid>(type: "uuid", nullable: false),
                    PreviousPrice = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    NewPrice = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false),
                    PreviousMargin = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    NewMargin = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    Reason = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    ApprovedBy = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_history", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "price_policies",
                schema: "pricing",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    DesiredMargin = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    MinimumMargin = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    MaximumDiscount = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: true),
                    RoundingType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_policies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "products",
                schema: "catalog",
                columns: table => new
                {
                    ProdutoId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    GrupoEconomicoId = table.Column<int>(type: "integer", nullable: false),
                    Nome = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Codigo = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    NCMId = table.Column<int>(type: "integer", nullable: false),
                    CESTId = table.Column<int>(type: "integer", nullable: false),
                    UnidadeId = table.Column<int>(type: "integer", nullable: false),
                    OrigemMercadoria = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.ProdutoId);
                });

            migrationBuilder.CreateTable(
                name: "sales_channels",
                schema: "pricing",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    CommissionRate = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    FinancialFeeRate = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false),
                    MarketplaceFeeRate = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sales_channels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "services",
                schema: "catalog",
                columns: table => new
                {
                    ServicoId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    GrupoEconomicoId = table.Column<int>(type: "integer", nullable: false),
                    Nome = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Codigo = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    NBSId = table.Column<int>(type: "integer", nullable: false),
                    CodServicoMunicipal = table.Column<int>(type: "integer", nullable: false),
                    CNAE = table.Column<int>(type: "integer", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_services", x => x.ServicoId);
                });

            migrationBuilder.CreateTable(
                name: "tenants",
                schema: "saas",
                columns: table => new
                {
                    TenantId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Razao_Social = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Nome_fantazia = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    CNPJ = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                    Email = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    PlanoId = table.Column<int>(type: "integer", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataAtivacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataCancelamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenants", x => x.TenantId);
                });

            migrationBuilder.CreateTable(
                name: "users",
                schema: "saas",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Email = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    PassHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "price_components",
                schema: "pricing",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PriceFormationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric(9,4)", precision: 9, scale: 4, nullable: true),
                    Value = table.Column<decimal>(type: "numeric(18,4)", precision: 18, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_components", x => x.Id);
                    table.ForeignKey(
                        name: "FK_price_components_price_formations_PriceFormationId",
                        column: x => x.PriceFormationId,
                        principalSchema: "pricing",
                        principalTable: "price_formations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_price_components_PriceFormationId",
                schema: "pricing",
                table: "price_components",
                column: "PriceFormationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "addresses",
                schema: "catalog");

            migrationBuilder.DropTable(
                name: "companies",
                schema: "catalog");

            migrationBuilder.DropTable(
                name: "company_fiscal_config",
                schema: "catalog");

            migrationBuilder.DropTable(
                name: "economic_groups",
                schema: "saas");

            migrationBuilder.DropTable(
                name: "plans",
                schema: "saas");

            migrationBuilder.DropTable(
                name: "price_components",
                schema: "pricing");

            migrationBuilder.DropTable(
                name: "price_history",
                schema: "pricing");

            migrationBuilder.DropTable(
                name: "price_policies",
                schema: "pricing");

            migrationBuilder.DropTable(
                name: "products",
                schema: "catalog");

            migrationBuilder.DropTable(
                name: "sales_channels",
                schema: "pricing");

            migrationBuilder.DropTable(
                name: "services",
                schema: "catalog");

            migrationBuilder.DropTable(
                name: "tenants",
                schema: "saas");

            migrationBuilder.DropTable(
                name: "users",
                schema: "saas");

            migrationBuilder.DropTable(
                name: "price_formations",
                schema: "pricing");
        }
    }
}
