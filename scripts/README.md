# Scripts

This directory contains utility scripts for managing the `@tsports/termenv` package.

## Replace Workspace Dependencies

The `replace-workspace-deps` scripts help convert workspace dependencies to their published versions, which is essential for publishing packages to npm.

### Overview

When developing in a monorepo with workspace dependencies like:

```json
{
  "dependencies": {
    "@tsports/go-colorful": "workspace:*",
    "@tsports/uniseg": "workspace:*"
  }
}
```

These need to be replaced with actual published versions before publishing:

```json
{
  "dependencies": {
    "@tsports/go-colorful": "^1.2.3",
    "@tsports/uniseg": "^2.1.0"
  }
}
```

### Available Scripts

There are multiple scripts provided:

1. **TypeScript version** (`replace-workspace-deps.ts`) - Main implementation using modern APIs
2. **Node.js version** (`replace-workspace-deps.js`) - Fallback using only Node.js built-ins
3. **Comprehensive script** (`prepare-for-publish.sh`) - Complete workflow including tests and build

### Usage

#### NPM Scripts (Recommended)

**Individual Replacement Scripts:**

```bash
# Dry run - see what would change without making changes
npm run replace-workspace-deps:dry-run

# Replace with caret versions (^1.2.3) and create backup
npm run replace-workspace-deps:backup

# Replace with exact versions (1.2.3)  
npm run replace-workspace-deps:exact

# Basic replacement with caret versions
npm run replace-workspace-deps
```

**Comprehensive Preparation Scripts:**

```bash
# Complete dry run (shows all steps without changes)
npm run prepare-for-publish:dry-run

# Prepare for publish (replace deps, test, build, restore deps)
npm run prepare-for-publish

# Prepare and automatically publish
npm run prepare-for-publish:and-publish
```

#### Direct Script Usage

```bash
# Node.js version
node scripts/replace-workspace-deps.js --dry-run
node scripts/replace-workspace-deps.js --backup --strategy exact

# Bun/TypeScript version  
bun run scripts/replace-workspace-deps.ts --dry-run
bun run scripts/replace-workspace-deps.ts --include-dev
```

### Options

- `--dry-run` - Show what would be changed without making changes
- `--strategy <type>` - Version strategy:
  - `exact`: Use exact version `1.2.3`
  - `caret`: Use caret range `^1.2.3` (default - allows minor/patch updates)
  - `tilde`: Use tilde range `~1.2.3` (allows patch updates only)
- `--registry <url>` - Custom npm registry (default: https://registry.npmjs.org)
- `--include-dev` - Also replace workspace deps in devDependencies
- `--backup` - Create timestamped backup of original package.json
- `--help` - Show help message

## Comprehensive Publishing Workflow

The `prepare-for-publish.sh` script provides a complete end-to-end workflow:

### Workflow Steps

1. **Check git status** - Warns about uncommitted changes
2. **Replace workspace dependencies** - Converts to published versions
3. **Update lock files** - Runs `bun install` to update dependencies
4. **Run tests** - Ensures everything still works with real dependencies
5. **Build package** - Creates distribution files
6. **Optionally publish** - Publishes to npm registry
7. **Restore workspace dependencies** - Returns to development state

### Usage Options

```bash
# See what the full workflow would do
npm run prepare-for-publish:dry-run

# Full preparation (recommended)
npm run prepare-for-publish

# Full preparation + automatic publishing
npm run prepare-for-publish:and-publish

# Advanced usage with options
scripts/prepare-for-publish.sh --strategy exact --publish --skip-tests
```

### Advanced Options

- `--dry-run` - Show all steps without making changes
- `--publish` - Automatically publish after preparation
- `--skip-tests` - Skip running tests (not recommended)
- `--skip-build` - Skip building the package
- `--strategy <type>` - Version strategy (exact, caret, tilde)

## Individual Script Workflow

### Recommended Workflow

If you prefer manual control, when preparing to publish the package:

1. **First, do a dry run to see what will change:**
   ```bash
   npm run replace-workspace-deps:dry-run
   ```

2. **Make the changes with a backup:**
   ```bash
   npm run replace-workspace-deps:backup
   ```

3. **Verify the changes look correct:**
   ```bash
   git diff package.json
   ```

4. **Update lock files:**
   ```bash
   npm install
   # or
   bun install
   ```

5. **Run tests to make sure everything still works:**
   ```bash
   npm test
   ```

6. **Publish the package:**
   ```bash
   npm publish
   ```

7. **Restore workspace dependencies for development:**
   ```bash
   git checkout package.json
   npm install
   ```

### Error Handling

The scripts handle common issues gracefully:

- **Package not found in registry**: Warns and skips the package
- **Network errors**: Shows error message and continues with other packages
- **Permission errors**: Shows clear error message and exits
- **Invalid JSON**: Shows parsing error and exits

### Examples

#### Basic Usage

```bash
# See what would change
$ npm run replace-workspace-deps:dry-run

🔄 Replace Workspace Dependencies

📦 Reading package.json from: /path/to/package.json
🔍 Found 2 workspace dependencies:
   - @tsports/go-colorful
   - @tsports/uniseg

🌐 Fetching latest versions...
   @tsports/go-colorful... ✅ ^1.2.3
   @tsports/uniseg... ✅ ^2.1.0

📝 Changes to be made:
   dependencies.@tsports/go-colorful: workspace:* → ^1.2.3
   dependencies.@tsports/uniseg: workspace:* → ^2.1.0

🔍 Dry run complete - no changes made
```

#### With Backup

```bash
$ npm run replace-workspace-deps:backup

🔄 Replace Workspace Dependencies

📦 Reading package.json from: /path/to/package.json  
🔍 Found 2 workspace dependencies:
   - @tsports/go-colorful
   - @tsports/uniseg

🌐 Fetching latest versions...
   @tsports/go-colorful... ✅ ^1.2.3
   @tsports/uniseg... ✅ ^2.1.0

📝 Changes to be made:
   dependencies.@tsports/go-colorful: workspace:* → ^1.2.3
   dependencies.@tsports/uniseg: workspace:* → ^2.1.0

💾 Backup created: package.json.backup.1703123456789
✏️  Applying changes...
✅ package.json updated successfully

📊 Summary:
   - Updated 2 dependencies
   - Strategy: caret
   - Registry: https://registry.npmjs.org
   - Backup created

🎉 Workspace dependencies successfully replaced with published versions!

💡 Next steps:
   1. Review the changes in package.json
   2. Run tests to ensure everything still works  
   3. Update lock files (npm install / bun install)
```

### Troubleshooting

#### Package Not Found

If a workspace dependency hasn't been published yet:

```
⚠️  Package not found in registry: @tsports/my-package
```

You need to publish that package first, or temporarily remove it from dependencies.

#### Network Issues

```
❌ Failed to fetch version for @tsports/go-colorful: Network error
```

Check your internet connection and npm registry accessibility.

#### Permission Errors

```
❌ Failed to write package.json: EACCES permission denied
```

Ensure you have write permissions to the package.json file.
