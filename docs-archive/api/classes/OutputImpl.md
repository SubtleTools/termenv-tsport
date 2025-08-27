[@tsports/termenv](../index.md) / OutputImpl

# Class: OutputImpl

Defined in: output.ts:30

Output implementation class - direct port of Go Output struct

## Implements

- [`Output`](../interfaces/Output.md)

## Constructors

### Constructor

> **new OutputImpl**(`writer`, ...`opts`): `OutputImpl`

Defined in: output.ts:43

#### Parameters

##### writer

`WriteStream` | `WritableStream`

##### opts

...[`OutputOption`](../type-aliases/OutputOption.md)\<`OutputImpl`\>[]

#### Returns

`OutputImpl`

## Properties

### profile

> **profile**: [`Profile`](../enumerations/Profile.md)

Defined in: output.ts:31

#### Implementation of

[`Output`](../interfaces/Output.md).[`profile`](../interfaces/Output.md#profile)

---

### assumeTTY

> **assumeTTY**: `boolean` = `false`

Defined in: output.ts:32

#### Implementation of

[`Output`](../interfaces/Output.md).[`assumeTTY`](../interfaces/Output.md#assumetty)

---

### unsafe

> **unsafe**: `boolean` = `false`

Defined in: output.ts:33

#### Implementation of

[`Output`](../interfaces/Output.md).[`unsafe`](../interfaces/Output.md#unsafe)

---

### cache

> **cache**: `boolean` = `false`

Defined in: output.ts:34

#### Implementation of

[`Output`](../interfaces/Output.md).[`cache`](../interfaces/Output.md#cache)

---

### environ

> **environ**: [`Environ`](../interfaces/Environ.md)

Defined in: output.ts:35

#### Implementation of

[`Output`](../interfaces/Output.md).[`environ`](../interfaces/Output.md#environ)

## Methods

### writer()

> **writer**(): `WriteStream` \| `WritableStream`

Defined in: output.ts:62

#### Returns

`WriteStream` \| `WritableStream`

#### Implementation of

[`Output`](../interfaces/Output.md).[`writer`](../interfaces/Output.md#writer)

---

### write()

> **write**(`data`): `Promise`\<`number`\>

Defined in: output.ts:66

Write data to the output

#### Parameters

##### data

`Uint8Array`

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`Output`](../interfaces/Output.md).[`write`](../interfaces/Output.md#write)

---

### writeString()

> **writeString**(`s`): `Promise`\<`number`\>

Defined in: output.ts:75

#### Parameters

##### s

`string`

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`Output`](../interfaces/Output.md).[`writeString`](../interfaces/Output.md#writestring)

---

### string()

> **string**(...`strings`): [`Style`](Style.md)

Defined in: output.ts:79

Create a styled string

#### Parameters

##### strings

...`string`[]

#### Returns

[`Style`](Style.md)

#### Implementation of

[`Output`](../interfaces/Output.md).[`string`](../interfaces/Output.md#string)

---

### String()

> **String**(...`strings`): [`Style`](Style.md)

Defined in: output.ts:84

#### Parameters

##### strings

...`string`[]

#### Returns

[`Style`](Style.md)

---

### Color()

> **Color**(`s`): `null` \| [`Color`](../interfaces/Color.md)

Defined in: output.ts:88

#### Parameters

##### s

`string`

#### Returns

`null` \| [`Color`](../interfaces/Color.md)

---

### ColorProfile()

> **ColorProfile**(): [`Profile`](../enumerations/Profile.md)

Defined in: output.ts:92

#### Returns

[`Profile`](../enumerations/Profile.md)

---

### EnvColorProfile()

> **EnvColorProfile**(): [`Profile`](../enumerations/Profile.md)

Defined in: output.ts:96

#### Returns

[`Profile`](../enumerations/Profile.md)

---

### EnvNoColor()

> **EnvNoColor**(): `boolean`

Defined in: output.ts:100

#### Returns

`boolean`

---

### HasDarkBackground()

> **HasDarkBackground**(): `boolean`

Defined in: output.ts:104

#### Returns

`boolean`

---

### ForegroundColor()

> **ForegroundColor**(): [`Color`](../interfaces/Color.md)

Defined in: output.ts:108

#### Returns

[`Color`](../interfaces/Color.md)

---

### BackgroundColor()

> **BackgroundColor**(): [`Color`](../interfaces/Color.md)

Defined in: output.ts:112

#### Returns

[`Color`](../interfaces/Color.md)

---

### isTTY()

> **isTTY**(): `boolean`

Defined in: output.ts:116

Check if output is a TTY

#### Returns

`boolean`

#### Implementation of

[`Output`](../interfaces/Output.md).[`isTTY`](../interfaces/Output.md#istty)

---

### colorProfile()

> **colorProfile**(): [`Profile`](../enumerations/Profile.md)

Defined in: output.ts:135

Color profile and environment methods

#### Returns

[`Profile`](../enumerations/Profile.md)

#### Implementation of

[`Output`](../interfaces/Output.md).[`colorProfile`](../interfaces/Output.md#colorprofile)

---

### envColorProfile()

> **envColorProfile**(): [`Profile`](../enumerations/Profile.md)

Defined in: output.ts:196

#### Returns

[`Profile`](../enumerations/Profile.md)

#### Implementation of

[`Output`](../interfaces/Output.md).[`envColorProfile`](../interfaces/Output.md#envcolorprofile)

---

### envNoColor()

> **envNoColor**(): `boolean`

Defined in: output.ts:209

#### Returns

`boolean`

#### Implementation of

[`Output`](../interfaces/Output.md).[`envNoColor`](../interfaces/Output.md#envnocolor)

---

### foregroundColor()

> **foregroundColor**(): [`Color`](../interfaces/Color.md)

Defined in: output.ts:221

#### Returns

[`Color`](../interfaces/Color.md)

#### Implementation of

[`Output`](../interfaces/Output.md).[`foregroundColor`](../interfaces/Output.md#foregroundcolor)

---

### backgroundColor()

> **backgroundColor**(): [`Color`](../interfaces/Color.md)

Defined in: output.ts:232

#### Returns

[`Color`](../interfaces/Color.md)

#### Implementation of

[`Output`](../interfaces/Output.md).[`backgroundColor`](../interfaces/Output.md#backgroundcolor)

---

### hasDarkBackground()

> **hasDarkBackground**(): `boolean`

Defined in: output.ts:293

#### Returns

`boolean`

#### Implementation of

[`Output`](../interfaces/Output.md).[`hasDarkBackground`](../interfaces/Output.md#hasdarkbackground)

---

### color()

> **color**(`s`): `null` \| [`Color`](../interfaces/Color.md)

Defined in: output.ts:309

Color creates a Color from a string. Valid inputs are hex colors, as well as
ANSI color codes (0-15, 16-255).
This method is a direct port of the Go Profile.Color method, adapted for Output.

#### Parameters

##### s

`string`

#### Returns

`null` \| [`Color`](../interfaces/Color.md)

#### Implementation of

[`Output`](../interfaces/Output.md).[`color`](../interfaces/Output.md#color)
