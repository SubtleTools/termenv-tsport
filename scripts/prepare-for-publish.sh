#!/bin/bash

# Prepare for Publish Script
# This script prepares the package for publishing by:
# 1. Replacing workspace dependencies with published versions
# 2. Running tests to ensure everything works
# 3. Building the package
# 4. Optionally publishing
# 5. Restoring workspace dependencies for development

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
AUTO_PUBLISH=false
SKIP_TESTS=false
SKIP_BUILD=false
STRATEGY="caret"

# Help function
show_help() {
    echo -e "${BLUE}🚀 Prepare for Publish${NC}"
    echo ""
    echo "This script prepares the package for publishing by replacing workspace"
    echo "dependencies, running tests, building, and optionally publishing."
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --dry-run         Show what would happen without making changes"
    echo "  --publish         Automatically publish after preparation"
    echo "  --skip-tests      Skip running tests"
    echo "  --skip-build      Skip building the package"
    echo "  --strategy <type> Version strategy (exact, caret, tilde)"
    echo "  --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --dry-run                  # See what would happen"
    echo "  $0                            # Prepare but don't publish"
    echo "  $0 --publish                  # Prepare and publish"
    echo "  $0 --strategy exact --publish # Use exact versions and publish"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --publish)
            AUTO_PUBLISH=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --strategy)
            STRATEGY="$2"
            shift 2
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Header
echo -e "${BLUE}🚀 Prepare for Publish${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Run this script from the package root.${NC}"
    exit 1
fi

# Get package name and version
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}📦 Package:${NC} $PACKAGE_NAME@$PACKAGE_VERSION"
echo ""

# Step 1: Check for uncommitted changes
echo -e "${YELLOW}🔍 Checking for uncommitted changes...${NC}"
if git rev-parse --git-dir > /dev/null 2>&1 && git rev-parse HEAD > /dev/null 2>&1; then
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}⚠️  You have uncommitted changes. Consider committing them first.${NC}"
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  Not in a git repository or no commits yet.${NC}"
    echo ""
fi

# Step 2: Replace workspace dependencies
echo -e "${YELLOW}🔄 Replacing workspace dependencies...${NC}"
if [ "$DRY_RUN" = true ]; then
    bun run scripts/replace-workspace-deps.ts --dry-run --strategy "$STRATEGY"
else
    # Create a backup first
    cp package.json package.json.pre-publish-backup
    bun run scripts/replace-workspace-deps.ts --strategy "$STRATEGY"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to replace workspace dependencies${NC}"
        # Restore backup
        mv package.json.pre-publish-backup package.json
        exit 1
    fi
fi

if [ "$DRY_RUN" = true ]; then
    echo -e "${GREEN}✅ Dry run complete${NC}"
    exit 0
fi

# Step 3: Update lock files
echo -e "${YELLOW}📦 Updating lock files...${NC}"
bun install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to update lock files${NC}"
    # Restore backup
    mv package.json.pre-publish-backup package.json
    exit 1
fi

# Step 4: Run tests
if [ "$SKIP_TESTS" = false ]; then
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    npm test
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Tests failed${NC}"
        # Restore backup
        mv package.json.pre-publish-backup package.json
        bun install  # Restore lock file too
        exit 1
    fi
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping tests${NC}"
fi

# Step 5: Build package
if [ "$SKIP_BUILD" = false ]; then
    echo -e "${YELLOW}🏗️  Building package...${NC}"
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build failed${NC}"
        # Restore backup
        mv package.json.pre-publish-backup package.json
        bun install
        exit 1
    fi
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping build${NC}"
fi

# Step 6: Show final package.json diff
echo -e "${YELLOW}📝 Changes made to package.json:${NC}"
echo "$(git --no-pager diff --no-index package.json.pre-publish-backup package.json || true)"
echo ""

# Step 7: Publish (if requested)
if [ "$AUTO_PUBLISH" = true ]; then
    echo -e "${YELLOW}📤 Publishing package...${NC}"
    npm publish
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Publish failed${NC}"
        # Restore backup
        mv package.json.pre-publish-backup package.json
        bun install
        exit 1
    fi
    echo -e "${GREEN}✅ Package published successfully${NC}"
else
    echo -e "${BLUE}💡 Package is ready for publishing!${NC}"
    echo "   Run 'npm publish' to publish the package"
fi

# Step 8: Restore workspace dependencies
echo -e "${YELLOW}🔄 Restoring workspace dependencies for development...${NC}"
mv package.json.pre-publish-backup package.json
bun install

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Failed to restore development dependencies, but publish was successful${NC}"
else
    echo -e "${GREEN}✅ Development dependencies restored${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}🎉 Process complete!${NC}"
echo ""

if [ "$AUTO_PUBLISH" = true ]; then
    echo -e "${BLUE}📊 Summary:${NC}"
    echo "   ✅ Workspace dependencies replaced"
    echo "   ✅ Tests passed (or skipped)"  
    echo "   ✅ Build successful (or skipped)"
    echo "   ✅ Package published"
    echo "   ✅ Development dependencies restored"
    echo ""
    echo -e "${BLUE}💡 Next steps:${NC}"
    echo "   - Check that the package is available on npm"
    echo "   - Update dependent packages if needed"
    echo "   - Consider creating a release tag"
else
    echo -e "${BLUE}📊 Summary:${NC}"
    echo "   ✅ Package prepared for publishing"
    echo "   ✅ Tests passed (or skipped)"
    echo "   ✅ Build successful (or skipped)"
    echo "   ✅ Development dependencies restored"
    echo ""
    echo -e "${BLUE}💡 Next steps:${NC}"
    echo "   - Review the package is ready: npm pack"
    echo "   - Publish the package: npm publish"
fi