[@tsports/termenv](../index.md) / Output

# Interface: Output

Defined in: types.ts:240

Output represents a terminal output.

## Properties

### profile

> **profile**: [`Profile`](../enumerations/Profile.md)

Defined in: types.ts:241

---

### environ

> **environ**: [`Environ`](Environ.md)

Defined in: types.ts:243

---

### assumeTTY

> **assumeTTY**: `boolean`

Defined in: types.ts:244

---

### unsafe

> **unsafe**: `boolean`

Defined in: types.ts:245

---

### cache

> **cache**: `boolean`

Defined in: types.ts:246

## Methods

### writer()

> **writer**(): `WriteStream` \| `WritableStream`

Defined in: types.ts:242

#### Returns

`WriteStream` \| `WritableStream`

---

### write()

> **write**(`data`): `Promise`\<`number`\>

Defined in: types.ts:249

Write data to the output

#### Parameters

##### data

`Uint8Array`

#### Returns

`Promise`\<`number`\>

---

### writeString()

> **writeString**(`s`): `Promise`\<`number`\>

Defined in: types.ts:250

#### Parameters

##### s

`string`

#### Returns

`Promise`\<`number`\>

---

### isTTY()

> **isTTY**(): `boolean`

Defined in: types.ts:253

Check if output is a TTY

#### Returns

`boolean`

---

### colorProfile()

> **colorProfile**(): [`Profile`](../enumerations/Profile.md)

Defined in: types.ts:256

Color profile and environment methods

#### Returns

[`Profile`](../enumerations/Profile.md)

---

### envColorProfile()

> **envColorProfile**(): [`Profile`](../enumerations/Profile.md)

Defined in: types.ts:257

#### Returns

[`Profile`](../enumerations/Profile.md)

---

### envNoColor()

> **envNoColor**(): `boolean`

Defined in: types.ts:258

#### Returns

`boolean`

---

### foregroundColor()

> **foregroundColor**(): [`Color`](Color.md)

Defined in: types.ts:259

#### Returns

[`Color`](Color.md)

---

### backgroundColor()

> **backgroundColor**(): [`Color`](Color.md)

Defined in: types.ts:260

#### Returns

[`Color`](Color.md)

---

### hasDarkBackground()

> **hasDarkBackground**(): `boolean`

Defined in: types.ts:261

#### Returns

`boolean`

---

### string()

> **string**(...`strings`): `unknown`

Defined in: types.ts:264

Create a styled string

#### Parameters

##### strings

...`string`[]

#### Returns

`unknown`

---

### color()

> **color**(`s`): `null` \| [`Color`](Color.md)

Defined in: types.ts:267

Create a Color from a string

#### Parameters

##### s

`string`

#### Returns

`null` \| [`Color`](Color.md)
