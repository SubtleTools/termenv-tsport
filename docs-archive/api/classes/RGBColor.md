[@tsports/termenv](../index.md) / RGBColor

# Class: RGBColor

Defined in: types.ts:114

RGBColor is a hex-encoded color, e.g. "#abcdef".

## Implements

- [`Color`](../interfaces/Color.md)

## Constructors

### Constructor

> **new RGBColor**(`hex`): `RGBColor`

Defined in: types.ts:115

#### Parameters

##### hex

`string`

#### Returns

`RGBColor`

## Properties

### hex

> **hex**: `string`

Defined in: types.ts:115

## Methods

### sequence()

> **sequence**(`bg`): `string`

Defined in: types.ts:117

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

Defined in: types.ts:180

String representation of the color

#### Returns

`string`

#### Implementation of

[`Color`](../interfaces/Color.md).[`toString`](../interfaces/Color.md#tostring)
