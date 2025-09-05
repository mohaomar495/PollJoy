# Supabase Migrations

This directory contains SQL migrations for the Supabase database.

## Transaction Functions

The `20240501_add_transaction_functions.sql` file adds three functions to support transactions in the Supabase database:

1. `begin_transaction()` - Starts a new transaction
2. `commit_transaction()` - Commits the current transaction
3. `rollback_transaction()` - Rolls back the current transaction

These functions are used by the poll service to ensure data consistency when updating polls and their options.

## Applying Migrations

To apply these migrations to your Supabase project:

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link your project (if not already linked):
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply the migrations:
   ```bash
   supabase db push
   ```

Alternatively, you can manually execute the SQL in the Supabase dashboard:

1. Go to the Supabase dashboard
2. Select your project
3. Go to the SQL Editor
4. Copy and paste the contents of the migration file
5. Run the SQL