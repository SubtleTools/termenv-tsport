[@tsports/termenv](../index.md) / ProfileUtils

# Variable: ProfileUtils

> `const` **ProfileUtils**: `object`

Defined in: profile.ts:21

Profile utility functions - matches Go profile.go interface

## Type declaration

### getName()

> **getName**(`profile`): `string`

Get the profile name as a string

#### Parameters

##### profile

[`Profile`](../enumerations/Profile.md)

#### Returns

`string`

### string()

> **string**(`profile`, ...`strings`): [`Style`](../classes/Style.md)

Create a new Style with the given profile and strings

#### Parameters

##### profile

[`Profile`](../enumerations/Profile.md)

##### strings

...`string`[]

#### Returns

[`Style`](../classes/Style.md)

### convert()

> **convert**(`profile`, `color`): [`Color`](../interfaces/Color.md)

Convert transforms a given Color to a Color supported within the Profile

#### Parameters

##### profile

[`Profile`](../enumerations/Profile.md)

##### color

[`Color`](../interfaces/Color.md)

#### Returns

[`Color`](../interfaces/Color.md)

### color()

> **color**(`profile`, `s`): `null` \| [`Color`](../interfaces/Color.md)

Create a Color from a string. Valid inputs are hex colors and ANSI color codes (0-255).

#### Parameters

##### profile

[`Profile`](../enumerations/Profile.md)

##### s

`string`

#### Returns

`null` \| [`Color`](../interfaces/Color.md)

### fromColor()

> **fromColor**(`profile`, `c`): [`Color`](../interfaces/Color.md)

Create a Color from a standard Color interface (mimics Go color.Color)

#### Parameters

##### profile

[`Profile`](../enumerations/Profile.md)

##### c

###### r

`number`

###### g

`number`

###### b

`number`

#### Returns

[`Color`](../interfaces/Color.md)
