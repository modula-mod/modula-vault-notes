# Permissions

Vault Notes 1.0 requests only the minimum permissions needed for the release:

- `module.records.read`
- `module.records.write`
- `module.records.delete`
- `module.settings.read`
- `module.settings.write`
- `module.search.publish`
- `module.events.emit`
- `module.export.create`

Future permissions such as `ai.request`, `automations.register`,
`files.attach`, `posts.saved.read` and connector access are not requested in
1.0. Any later permission expansion requires update review.
