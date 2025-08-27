# @tsports/termenv v1.0.0-tsport

@tsports/termenv - TypeScript port of termenv

This is the main export file for the TypeScript-native API.
Port of github.com/muesli/termenv Go package to TypeScript.

## Version

1.0.0

## Author

TSports Team

## Since

1.0.0

## Example

```typescript
import { colorProfile, string, rgbColor } from '@tsports/termenv';

const profile = colorProfile();
const styled = string('Hello World')
  .foreground(rgbColor('#FF0000'))
  .bold();
console.log(styled.toString());
```

## Enumerations

- [Profile](enumerations/Profile.md)

## Classes

- [OutputImpl](classes/OutputImpl.md)
- [Style](classes/Style.md)
- [TermEnvError](classes/TermEnvError.md)
- [InvalidColorError](classes/InvalidColorError.md)
- [StatusReportError](classes/StatusReportError.md)
- [NoColor](classes/NoColor.md)
- [ANSIColor](classes/ANSIColor.md)
- [ANSI256Color](classes/ANSI256Color.md)
- [RGBColor](classes/RGBColor.md)

## Interfaces

- [Color](interfaces/Color.md)
- [Environ](interfaces/Environ.md)
- [Output](interfaces/Output.md)
- [File](interfaces/File.md)

## Type Aliases

- [OutputOption](type-aliases/OutputOption.md)

## Variables

- [ProfileUtils](variables/ProfileUtils.md)
- [ANSIBlack](variables/ANSIBlack.md)
- [ANSIRed](variables/ANSIRed.md)
- [ANSIGreen](variables/ANSIGreen.md)
- [ANSIYellow](variables/ANSIYellow.md)
- [ANSIBlue](variables/ANSIBlue.md)
- [ANSIMagenta](variables/ANSIMagenta.md)
- [ANSICyan](variables/ANSICyan.md)
- [ANSIWhite](variables/ANSIWhite.md)
- [ANSIBrightBlack](variables/ANSIBrightBlack.md)
- [ANSIBrightRed](variables/ANSIBrightRed.md)
- [ANSIBrightGreen](variables/ANSIBrightGreen.md)
- [ANSIBrightYellow](variables/ANSIBrightYellow.md)
- [ANSIBrightBlue](variables/ANSIBrightBlue.md)
- [ANSIBrightMagenta](variables/ANSIBrightMagenta.md)
- [ANSIBrightCyan](variables/ANSIBrightCyan.md)
- [ANSIBrightWhite](variables/ANSIBrightWhite.md)

## Functions

- [string](functions/string.md)
- [colorProfile](functions/colorProfile.md)
- [envColorProfile](functions/envColorProfile.md)
- [envNoColor](functions/envNoColor.md)
- [hasDarkBackground](functions/hasDarkBackground.md)
- [foregroundColor](functions/foregroundColor.md)
- [backgroundColor](functions/backgroundColor.md)
- [noColor](functions/noColor.md)
- [ansiColor](functions/ansiColor.md)
- [ansi256Color](functions/ansi256Color.md)
- [rgbColor](functions/rgbColor.md)
- [color](functions/color.md)
- [profileName](functions/profileName.md)
- [newOutput](functions/newOutput.md)
- [withProfile](functions/withProfile.md)
- [withColorCache](functions/withColorCache.md)
- [withEnvironment](functions/withEnvironment.md)
- [withTTY](functions/withTTY.md)
- [withUnsafe](functions/withUnsafe.md)
- [defaultOutputInstance](functions/defaultOutputInstance.md)
- [setDefaultOutput](functions/setDefaultOutput.md)
- [convertToRGB](functions/convertToRGB.md)
