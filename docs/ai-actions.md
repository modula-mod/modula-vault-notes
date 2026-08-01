# Vault Notes AI Actions

Vault Notes 1.1 declares five optional, user-triggered AI product actions:

- `vault-notes.ai.summarise`
- `vault-notes.ai.suggest-title`
- `vault-notes.ai.rewrite-selection`
- `vault-notes.ai.extract-action-items`
- `vault-notes.ai.suggest-tags`

The actions reference immutable prompt IDs and JSON schemas. Vault Notes does not declare providers, models, API keys, provider URLs, provider payloads, or provider-specific response parsing.

AI suggestions never mutate records automatically. Accepted changes must be applied through the normal note update path with an expected revision.
