---
name: generating-fake-data
description: Generate realistic test fixtures, database seed data, demo content, and mock payloads, or anonymize datasets with consistent replacement values. Use when fixing unstable generated data or preserving relationships across transformed records.
---

# Generating Fake Data

Use [`@snaplet/copycat`](https://github.com/supabase-community/copycat) for fake values and consistent data substitution. Prefer its generators over handwritten samples, custom masking, or random generation when repeatability matters.

Pass stable record identifiers or source values to generators. With unchanged configuration, the same input maps to the same output independently of call order:

```ts
import { copycat } from '@snaplet/copycat'

const user = {
  name: copycat.fullName('user-42'),
  email: copycat.email('user-42', { domain: 'example.com' }),
}
```

Reuse the same input, generator, and options wherever a value must match across records. Choose separate inputs where fields should vary independently. Constrain generated values to the target schema.

For sensitive inputs, follow the [PII guidance](https://github.com/supabase-community/copycat#working-with-pii-personal-identifiable-information): configure a secret hash key with `generateHashKey` and `setHashKey`, and keep it separate from exported data. Replacing selected fields alone does not establish complete anonymization.

Check uniqueness constraints explicitly. The [uniqueness helpers](https://github.com/supabase-community/copycat#copycatuniqueinput-method-store-options) are stateful and have retry limits. Consult the [API reference](https://github.com/supabase-community/copycat#api-reference) for generators, constraints, and installed-version behavior.
