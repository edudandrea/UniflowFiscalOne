set -e

create_database_if_missing() {
  database="$1"

  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE $database'
    WHERE NOT EXISTS (
      SELECT FROM pg_database WHERE datname = '$database'
    )\gexec
EOSQL
}

create_database_if_missing "uniflow_fiscal_one_dev"
