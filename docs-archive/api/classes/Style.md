[@tsports/termenv](../index.md) / Style

# Class: Style

Defined in: style.ts:24

Style is a string that various rendering styles can be applied to.
Direct port of Go Style struct

## Constructors

### Constructor

> **new Style**(`profile`, `text?`): `Style`

Defined in: style.ts:29

#### Parameters

##### profile

[`Profile`](../enumerations/Profile.md)

##### text?

`string`

#### Returns

`Style`

## Properties

### profile

> **profile**: [`Profile`](../enumerations/Profile.md)

Defined in: style.ts:25

---

### string

> **string**: `string`

Defined in: style.ts:26

---

### styles

> **styles**: `string`[]

Defined in: style.ts:27

## Methods

### toString()

> **toString**(): `string`

Defined in: style.ts:38

String returns the styled string

#### Returns

`string`

---

### String()

> **String**(): `string`

Defined in: style.ts:45

String returns the styled string - Go-compatible method name

#### Returns

`string`

---

### styled()

> **styled**(`s`): `string`

Defined in: style.ts:52

Styled renders s with all applied styles - matches Go Styled method

#### Parameters

##### s

`string`

#### Returns

`string`

---

### foreground()

> **foreground**(`c`): `Style`

Defined in: style.ts:71

Foreground sets a foreground color - matches Go Foreground method

#### Parameters

##### c

`null` | [`Color`](../interfaces/Color.md)

#### Returns

`Style`

---

### background()

> **background**(`c`): `Style`

Defined in: style.ts:84

Background sets a background color - matches Go Background method

#### Parameters

##### c

`null` | [`Color`](../interfaces/Color.md)

#### Returns

`Style`

---

### bold()

> **bold**(): `Style`

Defined in: style.ts:97

Bold enables bold rendering - matches Go Bold method

#### Returns

`Style`

---

### faint()

> **faint**(): `Style`

Defined in: style.ts:106

Faint enables faint rendering - matches Go Faint method

#### Returns

`Style`

---

### italic()

> **italic**(): `Style`

Defined in: style.ts:115

Italic enables italic rendering - matches Go Italic method

#### Returns

`Style`

---

### underline()

> **underline**(): `Style`

Defined in: style.ts:124

Underline enables underline rendering - matches Go Underline method

#### Returns

`Style`

---

### overline()

> **overline**(): `Style`

Defined in: style.ts:133

Overline enables overline rendering - matches Go Overline method

#### Returns

`Style`

---

### blink()

> **blink**(): `Style`

Defined in: style.ts:142

Blink enables blink mode - matches Go Blink method

#### Returns

`Style`

---

### reverse()

> **reverse**(): `Style`

Defined in: style.ts:151

Reverse enables reverse color mode - matches Go Reverse method

#### Returns

`Style`

---

### crossOut()

> **crossOut**(): `Style`

Defined in: style.ts:160

CrossOut enables crossed-out rendering - matches Go CrossOut method

#### Returns

`Style`

---

### width()

> **width**(): `number`

Defined in: style.ts:170

Width returns the width required to print all runes in Style
Uses @tsports/uniseg for width calculation like Go version

#### Returns

`number`

---

### Foreground()

> **Foreground**(`c`): `Style`

Defined in: style.ts:188

Foreground sets a foreground color - Go-compatible method name

#### Parameters

##### c

`null` | [`Color`](../interfaces/Color.md)

#### Returns

`Style`

---

### Background()

> **Background**(`c`): `Style`

Defined in: style.ts:195

Background sets a background color - Go-compatible method name

#### Parameters

##### c

`null` | [`Color`](../interfaces/Color.md)

#### Returns

`Style`

---

### Bold()

> **Bold**(): `Style`

Defined in: style.ts:202

Bold enables bold rendering - Go-compatible method name

#### Returns

`Style`

---

### Faint()

> **Faint**(): `Style`

Defined in: style.ts:209

Faint enables faint rendering - Go-compatible method name

#### Returns

`Style`

---

### Italic()

> **Italic**(): `Style`

Defined in: style.ts:216

Italic enables italic rendering - Go-compatible method name

#### Returns

`Style`

---

### Underline()

> **Underline**(): `Style`

Defined in: style.ts:223

Underline enables underline rendering - Go-compatible method name

#### Returns

`Style`

---

### Overline()

> **Overline**(): `Style`

Defined in: style.ts:230

Overline enables overline rendering - Go-compatible method name

#### Returns

`Style`

---

### Blink()

> **Blink**(): `Style`

Defined in: style.ts:237

Blink enables blink mode - Go-compatible method name

#### Returns

`Style`

---

### Reverse()

> **Reverse**(): `Style`

Defined in: style.ts:244

Reverse enables reverse color mode - Go-compatible method name

#### Returns

`Style`

---

### CrossOut()

> **CrossOut**(): `Style`

Defined in: style.ts:251

CrossOut enables crossed-out rendering - Go-compatible method name

#### Returns

`Style`

---

### Width()

> **Width**(): `number`

Defined in: style.ts:258

Width returns the width required to print all runes in Style - Go-compatible method name

#### Returns

`number`
