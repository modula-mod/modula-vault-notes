# Security

Report Vault Notes security issues through the Modula private security channel.

Vault Notes 1.0 stores note content as account-scoped module records. Events,
diagnostics, audit metadata and error envelopes must not include complete note
content. Permanent deletion requires explicit confirmation. Cross-account reads
or mutations are release-blocking defects.
