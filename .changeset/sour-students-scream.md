---
'@graphql-inspector/core': minor
---

include meta data in the changes that are machine processable. This is useful if you want to efficiently store the changes in some database and later-on reconstruct the full change objects.

```ts
export type FieldDescriptionChangedChange = {
  type: ChangeType.FieldDescriptionChanged;
  meta: {
    typeName: string;
    fieldName: string;
    oldDescription: string;
    newDescription: string;
  };
};
```

You can construct the full `Change` object from the `type` and `meta` properties.

```ts
import { ChangeType, fieldDescriptionChangedFromMeta } from '@graphql-inspector/core';

console.log(
  fieldDescriptionChangedFromMeta({
    type: ChangeType.FieldDescriptionChanged,
    meta: {
      typeName: "Foo",
      fieldName: "bar",
      oldDescription: "This is the old description",
      newDescription: "This is the new description",
    }
  })
);
```

console.log output:

```ts
{
  type: 'FIELD_DESCRIPTION_CHANGED',
  criticality: { level: 'NON_BREAKING' },
  message: "Field 'Foo.bar' description changed from 'This is the old description' to 'This is the new description'",
  meta: {
    typeName: 'Foo',
    fieldName: 'bar',
    oldDescription: 'This is the old description',
    newDescription: 'This is the new description'
  },
  path: 'Foo.bar'
}
```
