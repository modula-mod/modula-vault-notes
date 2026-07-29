# Migrations

Vault Notes 1.0 uses generic module-record persistence. It does not require
Vault Notes-specific application tables.

The host may need generic platform migrations for module record revisions,
version snapshots, export jobs, search entity types and health state. Such
migrations must use generic table names and must be applied and rolled back only
against disposable databases during this block.
