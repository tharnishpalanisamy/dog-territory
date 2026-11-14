# Integration test database

Integration and E2E tests require a separately provisioned PostgreSQL database
named `dog_territory_test`. The pytest fixtures never create or drop a database
and never use the application's `DB_NAME` as a fallback.

Create the database explicitly using a PostgreSQL administrator connection:

```sql
CREATE DATABASE dog_territory_test;
```

Then set `TEST_DATABASE_URL` for the test process. For PowerShell:

```powershell
$env:TEST_DATABASE_URL = "postgresql+asyncpg://<test_user>:<password>@<host>:5432/dog_territory_test"
```

Run from `backend/`:

```powershell
python -m pytest
```

At first integration test use, the fixture creates missing tables inside this
dedicated database. Each test runs in an outer transaction; commits issued by
application sessions are contained by savepoints and rolled back at teardown.
The test URL is rejected unless it is PostgreSQL and names exactly
`dog_territory_test`. It is also rejected when its host, port, and database
match the development target configured in the backend `.env` or process
environment.
