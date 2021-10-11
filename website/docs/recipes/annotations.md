---
title: Annotations
---

GitHub offers in-code annotations and GraphQL Inspector, both App and Action enables you to use them.

It's a nice and clean way to understand what have really changed, how it looked before and after.

![Annotations](/assets/img/cli/github.jpg)

## Disabling annotations

Annotations are enabled by default.

**Single environment setup:**

```yaml
diff:
  annotations: false
```

**Multiple environment setup:**

```yaml
# Per environment
env:
  production:
    branch: 'master'
    diff:
      annotations: false

# Or globally

diff:
  annotations: false
env:
  production:
    branch: 'master'
```
