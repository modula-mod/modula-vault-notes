# AI Context And Privacy

Vault Notes AI context is limited to the current authorised note, selected text or blocks, non-sensitive note metadata, requested transformation, and authorised module settings.

The module must not send unrelated notes, deleted notes, version-history snapshots, other accounts' records, attachment contents, connector credentials, user secrets, or internal audit metadata.

Note content is untrusted data. Prompt instructions explicitly prohibit following note-embedded attempts to change policy, request secrets, invoke undeclared tools, access other records, or alter output schemas.
