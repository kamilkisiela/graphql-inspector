# @graphql-inspector/core

## 6.3.0

### Minor Changes

- [#2838](https://github.com/kamilkisiela/graphql-inspector/pull/2838)
  [`416a9ce`](https://github.com/kamilkisiela/graphql-inspector/commit/416a9ce9b44ba3859388dd625026067aba1f0a49)
  Thanks [@egoodwinx](https://github.com/egoodwinx)! - Updated removing field message to contain
  more information on why its a breaking change such as if the field is a union or indirectly
  referenced.

## 6.2.1

### Patch Changes

- [#2831](https://github.com/kamilkisiela/graphql-inspector/pull/2831)
  [`5854b64`](https://github.com/kamilkisiela/graphql-inspector/commit/5854b64ca37e3aace4f831d28e8ce19e018bab99)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Change CriticalityLevel to Dangerous when
  directive removed

## 6.2.0

### Minor Changes

- [#2827](https://github.com/kamilkisiela/graphql-inspector/pull/2827)
  [`60d674d`](https://github.com/kamilkisiela/graphql-inspector/commit/60d674d1a72ed61cfc5ffbd44d46f87e54ddb858)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Added missing types to Change type and fix
  typo "DirectiveUsageInputObjectdRemovedChange" to "DirectiveUsageInputObjectRemovedChange"

## 6.1.0

### Minor Changes

- [#2775](https://github.com/kamilkisiela/graphql-inspector/pull/2775)
  [`0e40ebd`](https://github.com/kamilkisiela/graphql-inspector/commit/0e40ebd046dafa2d4542b837c69ba221c73cf873)
  Thanks [@DanteUkraine](https://github.com/DanteUkraine)! - Fix: coverage calculation improvements:
  Covered Queries & Covered Mutations & Covered Subscriptions

- [#2773](https://github.com/kamilkisiela/graphql-inspector/pull/2773)
  [`6e3ccc9`](https://github.com/kamilkisiela/graphql-inspector/commit/6e3ccc900c4589025e3b77079b828ea5a725a33b)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Fix export `ChangeType` from core package.

### Patch Changes

- [#2765](https://github.com/kamilkisiela/graphql-inspector/pull/2765)
  [`27edee1`](https://github.com/kamilkisiela/graphql-inspector/commit/27edee15d838856228855fb5e481149aa27b3de9)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency
    [`dependency-graph@1.0.0` ↗︎](https://www.npmjs.com/package/dependency-graph/v/1.0.0) (from
    `0.11.0`, in `dependencies`)

## 6.0.1

### Patch Changes

- [#2747](https://github.com/kamilkisiela/graphql-inspector/pull/2747)
  [`9c36138`](https://github.com/kamilkisiela/graphql-inspector/commit/9c3613806803343af8e3081ffc6fea243cea72b2)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - dependencies updates:
  - Updated dependency
    [`object-inspect@1.13.1` ↗︎](https://www.npmjs.com/package/object-inspect/v/1.13.1) (from
    `1.12.3`, in `dependencies`)

## 6.0.0

### Major Changes

- [#2719](https://github.com/kamilkisiela/graphql-inspector/pull/2719)
  [`50874f2`](https://github.com/kamilkisiela/graphql-inspector/commit/50874f2d35d0d5ffda133bb35bb7ce0f8cdb64c3)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Upgrade the Node version from 16 to 18, as
  the minimum required version is now 18. Additionally, ensure that GraphQL Yoga is upgraded to
  version 5.

## 5.1.0

### Minor Changes

- [#2673](https://github.com/kamilkisiela/graphql-inspector/pull/2673)
  [`831703cc`](https://github.com/kamilkisiela/graphql-inspector/commit/831703cc503bb91972776fb888db60911da3eb99)
  Thanks [@kamilkisiela](https://github.com/kamilkisiela)! - Add metadata (with change field in it)
  to checkUsage function of ConsiderUsage rule

- [#2667](https://github.com/kamilkisiela/graphql-inspector/pull/2667)
  [`06581e0d`](https://github.com/kamilkisiela/graphql-inspector/commit/06581e0d0e992f09c5f321adb73a30fe9b378f34)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Replace ChangeType enum with const strings

## 5.0.2

### Patch Changes

- [#2638](https://github.com/kamilkisiela/graphql-inspector/pull/2638)
  [`533ebfd4`](https://github.com/kamilkisiela/graphql-inspector/commit/533ebfd43a3b66dc55ff0789ae5b574e3802de11)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - dependencies updates:

  - Updated dependency [`tslib@2.6.2` ↗︎](https://www.npmjs.com/package/tslib/v/2.6.2) (from
    `2.6.0`, in `dependencies`)

- [#2638](https://github.com/kamilkisiela/graphql-inspector/pull/2638)
  [`533ebfd4`](https://github.com/kamilkisiela/graphql-inspector/commit/533ebfd43a3b66dc55ff0789ae5b574e3802de11)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Patch update - dependencies

## 5.0.1

### Patch Changes

- [#2569](https://github.com/kamilkisiela/graphql-inspector/pull/2569)
  [`bed4c437`](https://github.com/kamilkisiela/graphql-inspector/commit/bed4c4375ce1b9012ee57cb56e5472df97ea8734)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - dependencies updates:

  - Updated dependency [`tslib@2.6.0` ↗︎](https://www.npmjs.com/package/tslib/v/2.6.0) (from
    `2.5.3`, in `dependencies`)

- [#2569](https://github.com/kamilkisiela/graphql-inspector/pull/2569)
  [`bed4c437`](https://github.com/kamilkisiela/graphql-inspector/commit/bed4c4375ce1b9012ee57cb56e5472df97ea8734)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Update dependencies for all packages.

## 5.0.0

### Major Changes

- [#2510](https://github.com/kamilkisiela/graphql-inspector/pull/2510)
  [`7944118e`](https://github.com/kamilkisiela/graphql-inspector/commit/7944118e8497bf8d6aabc9c31e3ea329bdcf3236)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Update major dependcies & drop node 14

### Patch Changes

- [#2510](https://github.com/kamilkisiela/graphql-inspector/pull/2510)
  [`7944118e`](https://github.com/kamilkisiela/graphql-inspector/commit/7944118e8497bf8d6aabc9c31e3ea329bdcf3236)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - dependencies updates:

  - Updated dependency [`tslib@2.5.3` ↗︎](https://www.npmjs.com/package/tslib/v/2.5.3) (from
    `2.5.0`, in `dependencies`)

- [#2425](https://github.com/kamilkisiela/graphql-inspector/pull/2425)
  [`cc303a99`](https://github.com/kamilkisiela/graphql-inspector/commit/cc303a99829c6fbe7800a7259a69ef8e04e88c8b)
  Thanks [@jirikuncar](https://github.com/jirikuncar)! - Fix typo for numFiledsCovered to
  numFieldsCovered

## 4.2.2

### Patch Changes

- [#2452](https://github.com/kamilkisiela/graphql-inspector/pull/2452)
  [`1b1b954c`](https://github.com/kamilkisiela/graphql-inspector/commit/1b1b954ca7b67a86f4eeef82737559e09fff09c1)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Add a new stats display for coverage
  command + display new Total queries / mutations / Sub

## 4.2.1

### Patch Changes

- [#2461](https://github.com/kamilkisiela/graphql-inspector/pull/2461)
  [`53dae663`](https://github.com/kamilkisiela/graphql-inspector/commit/53dae6636ef99d35ba2d4606b5000580983c9230)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Fix complexity importing for validate

## 4.2.0

### Minor Changes

- [#2210](https://github.com/kamilkisiela/graphql-inspector/pull/2210)
  [`1180f761`](https://github.com/kamilkisiela/graphql-inspector/commit/1180f7614f2cf8c68410be07e1a7615c8bb83625)
  Thanks [@taitruong007](https://github.com/taitruong007)! - Support validate by complexity score

## 4.1.1

### Patch Changes

- [#2435](https://github.com/kamilkisiela/graphql-inspector/pull/2435)
  [`09214509`](https://github.com/kamilkisiela/graphql-inspector/commit/09214509bf938cfc9472288d08cea92cad116857)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - dependencies updates:

  - Updated dependency [`tslib@2.5.0` ↗︎](https://www.npmjs.com/package/tslib/v/2.5.0) (from
    `^2.0.0`, in `dependencies`)

- [#2435](https://github.com/kamilkisiela/graphql-inspector/pull/2435)
  [`09214509`](https://github.com/kamilkisiela/graphql-inspector/commit/09214509bf938cfc9472288d08cea92cad116857)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Update dependencies

## 4.1.0

### Minor Changes

- [#2392](https://github.com/kamilkisiela/graphql-inspector/pull/2392)
  [`3184249b`](https://github.com/kamilkisiela/graphql-inspector/commit/3184249bc3a912ca04e934efd0fb5b978eb95ce7)
  Thanks [@n1ru4l](https://github.com/n1ru4l)! - Wrap string values in quotes, so they can be
  differentiated from types.

  ```diff
  - Input field 'Foo.b' default value changed from 'undefined' to 'Bbb'
  + Input field 'Foo.b' default value changed from 'undefined' to '"Bbb"'
  ```

- [#2392](https://github.com/kamilkisiela/graphql-inspector/pull/2392)
  [`3184249b`](https://github.com/kamilkisiela/graphql-inspector/commit/3184249bc3a912ca04e934efd0fb5b978eb95ce7)
  Thanks [@n1ru4l](https://github.com/n1ru4l)! - Add `isSafeBasedOnUsage` to `Criticality` type.
  This value is set to `true` in case the criticality is set to `CriticalityLevel.Dangerous` based
  on usage. This is helpful for statistics.

- [#2392](https://github.com/kamilkisiela/graphql-inspector/pull/2392)
  [`3184249b`](https://github.com/kamilkisiela/graphql-inspector/commit/3184249bc3a912ca04e934efd0fb5b978eb95ce7)
  Thanks [@n1ru4l](https://github.com/n1ru4l)! - include meta data in the changes that are machine
  processable. This is useful if you want to efficiently store the changes in some database and
  later-on reconstruct the full change objects.

  ```ts
  export type FieldDescriptionChangedChange = {
    type: ChangeType.FieldDescriptionChanged
    meta: {
      typeName: string
      fieldName: string
      oldDescription: string
      newDescription: string
    }
  }
  ```

  You can construct the full `Change` object from the `type` and `meta` properties.

  ```ts
  import { ChangeType, fieldDescriptionChangedFromMeta } from '@graphql-inspector/core'

  console.log(
    fieldDescriptionChangedFromMeta({
      type: ChangeType.FieldDescriptionChanged,
      meta: {
        typeName: 'Foo',
        fieldName: 'bar',
        oldDescription: 'This is the old description',
        newDescription: 'This is the new description'
      }
    })
  )
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

## 4.0.3

### Patch Changes

- [#2419](https://github.com/kamilkisiela/graphql-inspector/pull/2419)
  [`34f84e8f`](https://github.com/kamilkisiela/graphql-inspector/commit/34f84e8f58a083f56d2d049a3b865d4fdfa468bc)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - Update `bob` version -> change the way we
  build the packages (Dist folder build now esm and cjs versions)

## 4.0.2

### Patch Changes

- [#2412](https://github.com/kamilkisiela/graphql-inspector/pull/2412)
  [`5b275450`](https://github.com/kamilkisiela/graphql-inspector/commit/5b2754500d44771582310822fce629bb44d56528)
  Thanks [@dotansimha](https://github.com/dotansimha)! - Bump all packages to fix issues with
  previous release

## 4.0.1

### Patch Changes

- [#2393](https://github.com/kamilkisiela/graphql-inspector/pull/2393)
  [`c00cb09b`](https://github.com/kamilkisiela/graphql-inspector/commit/c00cb09b8576efe13745300456679bda0b2675aa)
  Thanks [@TuvalSimha](https://github.com/TuvalSimha)! - dependencies updates:

  - Updated dependency
    [`graphql@^13.0.0 || ^14.0.0 || ^15.0.0 || ^16.0.0` ↗︎](https://www.npmjs.com/package/graphql/v/13.0.0)
    (from `^0.13.0 || ^14.0.0 || ^15.0.0 || ^16.0.0`, in `peerDependencies`)

- [#2404](https://github.com/kamilkisiela/graphql-inspector/pull/2404)
  [`948981ef`](https://github.com/kamilkisiela/graphql-inspector/commit/948981ef61f2c72e31db982f2547f7ef6b9b48f8)
  Thanks [@dotansimha](https://github.com/dotansimha)! - dependencies updates:
  - Updated dependency
    [`graphql@^14.0.0 || ^15.0.0 || ^16.0.0` ↗︎](https://www.npmjs.com/package/graphql/v/14.0.0)
    (from `^13.0.0 || ^14.0.0 || ^15.0.0 || ^16.0.0`, in `peerDependencies`)

## 4.0.0

### Major Changes

- [#2341](https://github.com/kamilkisiela/graphql-inspector/pull/2341)
  [`b17ee0a3`](https://github.com/kamilkisiela/graphql-inspector/commit/b17ee0a380a7153bf4c0a1a23e5a725726e51d0f)
  Thanks [@velias](https://github.com/velias)! - fix: core bump to patch coverage

## 3.5.1

### Patch Changes

- [#2302](https://github.com/kamilkisiela/graphql-inspector/pull/2302)
  [`dd840130`](https://github.com/kamilkisiela/graphql-inspector/commit/dd8401300512497adb4301e1f2004865941b132f)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency
    [`object-inspect@1.12.3` ↗︎](https://www.npmjs.com/package/object-inspect/v/1.12.3) (from
    `1.10.3`, in `dependencies`)

## 3.5.0

### Minor Changes

- [#2240](https://github.com/kamilkisiela/graphql-inspector/pull/2240)
  [`ca29cdd1`](https://github.com/kamilkisiela/graphql-inspector/commit/ca29cdd11287c44480f1f06d8577f4f1ee1a5d96)
  Thanks [@Tohaker](https://github.com/Tohaker)! - suppressRemovalOfDeprecatedField rule will now
  mark removed types as dangerous
