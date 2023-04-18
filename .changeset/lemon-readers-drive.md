---
'@graphql-inspector/core': minor
---

Wrap string values in quotes, so they can be differentiated from types.

```diff
- Input field 'Foo.b' default value changed from 'undefined' to 'Bbb'
+ Input field 'Foo.b' default value changed from 'undefined' to '"Bbb"'
```
