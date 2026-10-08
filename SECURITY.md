# Security

Report Vault Notes security issues through the Modula private security channel.

Vault Notes 2.0 RC stores note content as account-scoped module records. Events,
diagnostics, audit metadata and error envelopes must not include complete note
content. Permanent deletion requires explicit confirmation. Cross-account reads
or mutations are release-blocking defects. Stale updates must fail on revision
conflict, replayed mutations must be idempotent through the generic action path,
and sensitive notes must fail closed when local intelligence is unavailable.

The module stores attachment metadata and opaque asset identifiers, never a
native filesystem path. GreenField/host media authorization remains mandatory
before attachment bytes can be retrieved.
