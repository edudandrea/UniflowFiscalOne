using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace back.Infrastructure.Persistence;

public sealed class UniFlowDbContextFactory : IDesignTimeDbContextFactory<UniFlowDbContext>
{
    public UniFlowDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not configured.");

        var optionsBuilder = new DbContextOptionsBuilder<UniFlowDbContext>();
        optionsBuilder.UseNpgsql(connectionString, options =>
        {
            options.MigrationsHistoryTable("__ef_migrations_history", "public");
        });

        return new UniFlowDbContext(optionsBuilder.Options);
    }
}
