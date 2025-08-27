# Publishing Guide

This guide covers version management and publishing for TSports packages.

## TSPort Versioning Strategy

TSports packages use **TSPort Versioning** to track both the original Go package version and TypeScript-specific patches.

### Version Format: `{go-version}-tsport[.{patch}]`

- `1.2.3-tsport` - Initial port of Go package v1.2.3
- `1.2.3-tsport.1` - First TypeScript-specific patch/fix
- `1.2.3-tsport.2` - Second TypeScript-specific patch/fix
- `1.3.0-tsport` - Updated to Go package v1.3.0

### Version Management Commands

The template includes scripts for managing versions:

```bash
# Update to new Go package version
bun run version:bump-go 1.3.0
# Result: 1.2.3-tsport.1 → 1.3.0-tsport

# Add TypeScript-specific patch
bun run version:bump-tsport  
# Result: 1.3.0-tsport → 1.3.0-tsport.1

# Moon tasks also available
moon run version:bump-go -- 1.3.0
moon run version:bump-tsport
```

## Publishing Workflows

### Publishing New Go Version Ports

When a new version of the original Go package is released:

1. **Update to new Go version:**
   ```bash
   # Example: Update to Go v1.3.0
   bun run version:bump-go 1.3.0
   ```

2. **Update source code:**
   - Pull latest Go package changes from reference submodule
   - Update TypeScript implementation to match new Go version
   - Update tests and examples
   - Update documentation if API changed

3. **Test thoroughly:**
   ```bash
   bun test                    # Run all tests
   bun run test:compatibility  # Test against Go reference
   bun run lint               # Check code quality
   bun run build              # Ensure clean build
   ```

4. **Commit and publish:**
   ```bash
   git add .
   git commit -m "feat: update to Go v1.3.0"
   git tag v1.3.0-tsport
   git push origin main v1.3.0-tsport
   ```

### Publishing TypeScript Fixes

For TypeScript-specific bugs, improvements, or build fixes:

1. **Make your changes:**
   - Fix the issue
   - Add tests if applicable
   - Update documentation if needed

2. **Bump TSPort version:**
   ```bash
   bun run version:bump-tsport
   ```

3. **Test changes:**
   ```bash
   bun test
   bun run lint
   bun run build
   ```

4. **Commit and publish:**
   ```bash
   git add .
   git commit -m "fix: resolve TypeScript compilation issue"
   git tag v1.2.3-tsport.1  # Use the version shown by bump-tsport
   git push origin main v1.2.3-tsport.1
   ```

## Version History Example

```bash
# Typical version progression:
1.2.3-tsport        # Initial port of Go v1.2.3
1.2.3-tsport.1      # Fixed TypeScript type issue
1.2.3-tsport.2      # Performance improvement in TS code
1.2.3-tsport.3      # Build configuration fix
1.3.0-tsport        # Updated to Go v1.3.0
1.3.0-tsport.1      # Fixed compatibility issue
2.0.0-tsport        # Updated to Go v2.0.0 (breaking changes)
```

## Automated Publishing (GitHub Actions)

Each repository includes automated publishing workflows:

### Release Workflow

- **Trigger**: Version tags (`v*`)
- **Actions**:
  - Run full test suite
  - Build package
  - Publish to npm registry
  - Create GitHub release with changelog

### Quality Gates

Before publishing, the workflow ensures:

- All tests pass (including compatibility tests)
- Code passes linting
- Package builds successfully
- No TypeScript errors
- Documentation builds correctly

### Triggering Automated Publish

```bash
# After bumping version and committing changes
git tag v1.2.3-tsport.1
git push origin v1.2.3-tsport.1

# GitHub Actions automatically:
# 1. Runs all quality checks
# 2. Builds the package  
# 3. Publishes to npm with correct tags
# 4. Creates GitHub release
# 5. Updates documentation
```

## Manual Publishing

If automated publishing fails or you need to publish manually:

```bash
# Ensure you're logged into npm
npm whoami

# Build the package
bun run build

# Publish (npm automatically handles prerelease tags)
npm publish

# For initial version or first prerelease
npm publish --tag latest
```

## Version Metadata

Each package includes tracking metadata in `package.json`:

```json
{
  "version": "1.2.3-tsport.1",
  "goSourceVersion": "v1.2.3",
  "portInfo": {
    "sourceRepo": "https://github.com/original/go-package",
    "sourceVersion": "v1.2.3",
    "tsportVersion": 1,
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

This metadata helps:

- Users understand what Go version is ported
- Maintainers track version history
- Automated tools understand the relationship between versions

## Best Practices

1. **Always test compatibility** before publishing Go version updates
2. **Use descriptive commit messages** following conventional commits
3. **Update documentation** when APIs change
4. **Test in multiple environments** (Node.js versions, platforms)
5. **Keep changelogs updated** for major version bumps
6. **Tag releases consistently** for automated workflows
7. **Communicate breaking changes** clearly in release notes

## Troubleshooting

### Version Script Fails

```bash
# If version scripts fail, check package.json format
cat package.json | jq .version

# Manually fix if needed, then re-run
bun run version:bump-tsport
```

### Publishing Fails

```bash
# Check npm authentication
npm whoami

# Check if version already exists
npm view @tsports/termenv versions --json

# Re-login if needed
npm login
```

### GitHub Actions Fail

1. Check workflow logs in GitHub Actions tab
2. Ensure `NPM_TOKEN` secret is configured in repository settings
3. Verify all tests pass locally before pushing tags
4. Check if npm registry is accessible

For additional help, see the main [Contributing Guide](../../CONTRIBUTING.md).
