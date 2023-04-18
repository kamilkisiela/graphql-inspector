---
'@graphql-inspector/core': minor
---

Add `isSafeBasedOnUsage` to `Criticality` type. This value is set to `true` in case the criticality
is set to `CriticalityLevel.Dangerous` based on usage. This is helpful for statistics.
