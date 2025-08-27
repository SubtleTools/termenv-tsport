#!/bin/bash
#
# Setup Git hooks for @tsports/termenv
# Run this after cloning the repository to install pre-push hooks
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo "${BLUE}==>${NC} $1"
}

print_success() {
    echo "${GREEN}✅${NC} $1"
}

print_error() {
    echo "${RED}❌${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root."
    exit 1
fi

if ! grep -q '"name": "@tsports/termenv"' package.json; then
    print_error "This doesn't appear to be the @tsports/termenv package."
    exit 1
fi

print_status "Setting up Git hooks for @tsports/termenv..."

# Create the pre-push hook
PRE_PUSH_HOOK=".git/hooks/pre-push"

if [ -f "$PRE_PUSH_HOOK" ]; then
    print_status "Backing up existing pre-push hook..."
    mv "$PRE_PUSH_HOOK" "$PRE_PUSH_HOOK.backup"
fi

# Copy our pre-push hook template
cat > "$PRE_PUSH_HOOK" << 'EOF'
#!/bin/sh
#
# Pre-push hook for @tsports/termenv
# Runs code formatting and linting before allowing pushes
#

set -e

echo "🔍 Running pre-push checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo "${BLUE}==>${NC} $1"
}

print_success() {
    echo "${GREEN}✅${NC} $1"
}

print_warning() {
    echo "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo "${RED}❌${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if this is the termenv package
if ! grep -q '"name": "@tsports/termenv"' package.json; then
    print_error "This doesn't appear to be the @tsports/termenv package."
    exit 1
fi

print_status "Running Biome formatter and linter..."

# Run biome check with --fix to auto-fix issues
if command -v bun >/dev/null 2>&1; then
    if ! bun run lint; then
        print_error "Biome linting failed. Please fix the issues before pushing."
        exit 1
    fi
    print_success "Biome checks passed"
else
    print_warning "Bun not found, skipping biome checks"
fi

print_status "Running dprint formatter..."

# Check if dprint is available and run formatting
if command -v dprint >/dev/null 2>&1; then
    if ! dprint fmt; then
        print_error "dprint formatting failed. Please fix the issues before pushing."
        exit 1
    fi
    print_success "dprint formatting completed"
else
    # Fallback to package.json script if dprint binary not available
    if command -v bun >/dev/null 2>&1; then
        if ! bun run format:check; then
            print_warning "dprint format check failed. Running formatter..."
            if grep -q '"format".*dprint' package.json; then
                bun run format 2>/dev/null || true
                print_success "dprint formatting completed via bun"
            fi
        else
            print_success "dprint formatting is up to date"
        fi
    else
        print_warning "Neither dprint nor bun found, skipping dprint checks"
    fi
fi

print_status "Checking for staged changes after formatting..."

# Check if formatting created any changes
if ! git diff --quiet; then
    print_warning "Formatting created changes. Please review and commit them:"
    git diff --name-only
    print_error "Commit the formatting changes and push again."
    exit 1
fi

print_status "Running TypeScript compilation check..."

# Run build to ensure everything compiles
if command -v bun >/dev/null 2>&1; then
    if ! bun run build >/dev/null 2>&1; then
        print_error "TypeScript compilation failed. Please fix build errors before pushing."
        exit 1
    fi
    print_success "TypeScript compilation successful"
else
    print_warning "Bun not found, skipping build check"
fi

print_success "All pre-push checks passed! 🚀"
echo ""
EOF

# Make the hook executable
chmod +x "$PRE_PUSH_HOOK"

print_success "Pre-push hook installed successfully!"
print_status "The hook will now run automatically before each git push"
print_status "It will check:"
echo "  • Biome linting and formatting"
echo "  • dprint formatting"
echo "  • TypeScript compilation"
echo ""
print_status "To test the hook, try: git push --dry-run"