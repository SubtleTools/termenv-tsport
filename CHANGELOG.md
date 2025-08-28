# Changelog

## [0.16.0-tsport] - 2025-08-28

### Added

- Initial complete TypeScript port of muesli/termenv v0.16.0
- 100% API compatibility with Go version
- Support for TrueColor, ANSI256, ANSI, and ASCII profiles
- Terminal control functions (cursor, screen, mouse)
- Hyperlink support (OSC 8)
- Notification support (OSC 777, OSC 9)
- Style chaining with immutable objects
- Go-compatible PascalCase method aliases
- Comprehensive test suite with Go comparison tests

### Technical

- TypeScript with strict type checking
- ESM module support
- Bun runtime optimized
- Pre-push hooks for code quality
- Automated CI/CD pipeline
- npm publishing workflow

### Dependencies

- @tsports/go-colorful: RGB color manipulation
- @tsports/uniseg: Unicode text segmentation (fallback implementation temporarily)

### Note

This is a complete port maintaining full compatibility with the original Go API.
