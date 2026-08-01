# AI Provider Independence

Vault Notes declares product actions, prompts, schemas, permissions, and context limits. The host resolves providers and models through Greenfield policy and runtime configuration.

Vault Notes 1.1 does not contain provider IDs, model IDs, provider URLs, API keys, provider payloads, or provider-specific response parsing.

The module remains usable when no provider is configured, the provider is unavailable, quota is exhausted, AI capability is disabled, or AI permissions are denied.
