[@tsports/termenv](../index.md) / ANSI256Color

# Class: ANSI256Color

Defined in: types.ts:98

ANSI256Color is a color (16-255) as defined by the ANSI Standard.

## Implements

- [`Color`](../interfaces/Color.md)

## Constructors

### Constructor

> **new ANSI256Color**(`value`): `ANSI256Color`

Defined in: types.ts:99

#### Parameters

##### value

`number`

#### Returns

`ANSI256Color`

## Properties

### value

> **value**: `number`

Defined in: types.ts:99

## Methods

### sequence()

> **sequence**(`bg`): `string`

Defined in: types.ts:101

Returns the ANSI Sequence for the color

#### Parameters

##### bg

`boolean`

#### Returns

`string`

#### Implementation of

[`Color`](../interfaces/Color.md).[`sequence`](../interfaces/Color.md#sequence)

---

### toString()

> **toString**(): `string`

Defined in: types.ts:106

String representation of the color

#### Returns

`string`

#### Implementation of

[`Color`](../interfaces/Color.md).[`toString`](../interfaces/Color.md#tostring)
