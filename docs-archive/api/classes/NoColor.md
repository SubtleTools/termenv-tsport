[@tsports/termenv](../index.md) / NoColor

# Class: NoColor

Defined in: types.ts:64

NoColor is a nop for terminals that don't support colors.

## Implements

- [`Color`](../interfaces/Color.md)

## Constructors

### Constructor

> **new NoColor**(): `NoColor`

#### Returns

`NoColor`

## Methods

### sequence()

> **sequence**(`_bg`): `string`

Defined in: types.ts:65

Returns the ANSI Sequence for the color

#### Parameters

##### \_bg

`boolean`

#### Returns

`string`

#### Implementation of

[`Color`](../interfaces/Color.md).[`sequence`](../interfaces/Color.md#sequence)

---

### toString()

> **toString**(): `string`

Defined in: types.ts:69

String representation of the color

#### Returns

`string`

#### Implementation of

[`Color`](../interfaces/Color.md).[`toString`](../interfaces/Color.md#tostring)
