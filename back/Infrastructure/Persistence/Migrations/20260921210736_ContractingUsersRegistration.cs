using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ContractingUsersRegistration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccessModules",
                schema: "saas",
                table: "users",
                type: "character varying(800)",
                maxLength: 800,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Cargo",
                schema: "saas",
                table: "users",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CriadoEm",
                schema: "saas",
                table: "users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now()");

            migrationBuilder.AddColumn<int>(
                name: "EmpresaId",
                schema: "saas",
                table: "users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                schema: "saas",
                table: "users",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserType",
                schema: "saas",
                table: "users",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessModules",
                schema: "saas",
                table: "users");

            migrationBuilder.DropColumn(
                name: "Cargo",
                schema: "saas",
                table: "users");

            migrationBuilder.DropColumn(
                name: "CriadoEm",
                schema: "saas",
                table: "users");

            migrationBuilder.DropColumn(
                name: "EmpresaId",
                schema: "saas",
                table: "users");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                schema: "saas",
                table: "users");

            migrationBuilder.DropColumn(
                name: "UserType",
                schema: "saas",
                table: "users");
        }
    }
}
