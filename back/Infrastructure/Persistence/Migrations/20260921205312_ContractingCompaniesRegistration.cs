using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ContractingCompaniesRegistration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE catalog.companies
                ALTER COLUMN "InscricaoMunicipal" TYPE character varying(30)
                USING "InscricaoMunicipal"::text;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE catalog.companies
                ALTER COLUMN "InscricaoEstadual" TYPE character varying(30)
                USING "InscricaoEstadual"::text;
                """);

            migrationBuilder.AddColumn<DateTime>(
                name: "CriadoEm",
                schema: "catalog",
                table: "companies",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now()");

            migrationBuilder.AddColumn<string>(
                name: "EmailPrincipal",
                schema: "catalog",
                table: "companies",
                type: "character varying(180)",
                maxLength: 180,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NomeFantasia",
                schema: "catalog",
                table: "companies",
                type: "character varying(180)",
                maxLength: 180,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Plano",
                schema: "catalog",
                table: "companies",
                type: "character varying(80)",
                maxLength: 80,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Segmento",
                schema: "catalog",
                table: "companies",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Site",
                schema: "catalog",
                table: "companies",
                type: "character varying(240)",
                maxLength: 240,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Situacao",
                schema: "catalog",
                table: "companies",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                schema: "catalog",
                table: "companies",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CriadoEm",
                schema: "catalog",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "EmailPrincipal",
                schema: "catalog",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "NomeFantasia",
                schema: "catalog",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "Plano",
                schema: "catalog",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "Segmento",
                schema: "catalog",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "Site",
                schema: "catalog",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "Situacao",
                schema: "catalog",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "Telefone",
                schema: "catalog",
                table: "companies");

            migrationBuilder.Sql("""
                ALTER TABLE catalog.companies
                ALTER COLUMN "InscricaoMunicipal" TYPE integer
                USING COALESCE(NULLIF(regexp_replace("InscricaoMunicipal", '\D', '', 'g'), '')::integer, 0);
                """);

            migrationBuilder.Sql("""
                ALTER TABLE catalog.companies
                ALTER COLUMN "InscricaoEstadual" TYPE integer
                USING COALESCE(NULLIF(regexp_replace("InscricaoEstadual", '\D', '', 'g'), '')::integer, 0);
                """);
        }
    }
}
