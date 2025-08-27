[@tsports/termenv](../index.md) / ANSIColor

# Class: ANSIColor

Defined in: types.ts:77

ANSIColor is a color (0-15) as defined by the ANSI Standard.

## Implements

- [`Color`](../interfaces/Color.md)

## Constructors

### Constructor

> **new ANSIColor**(`value`): `ANSIColor`

Defined in: types.ts:78

#### Parameters

##### value

`number`

#### Returns

`ANSIColor`

## Properties

### value

> **value**: `number`

Defined in: types.ts:78

## Methods

### sequence()

> **sequence**(`bg`): `string`

Defined in: types.ts:80

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

Defined in: types.ts:90

String representation of the color

#### Returns

`string`

#### Implementation of

[`Color`](../interfaces/Color.md).[`toString`](../interfaces/Color.md#tostring)
