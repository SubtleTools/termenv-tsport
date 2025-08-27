#!/usr/bin/env bun

/**
 * Replace Workspace Dependencies Script
 * 
 * This script replaces workspace dependencies in package.json with their latest published versions.
 * It's useful for preparing packages for publication by converting workspace references to real versions.
 * 
 * Usage:
 *   bun run scripts/replace-workspace-deps.ts [options]
 * 
 * Options:
 *   --dry-run         Show what would be changed without making changes
 *   --strategy        Version strategy: 'exact', 'caret', 'tilde' (default: 'caret')
 *   --registry        NPM registry URL (default: https://registry.npmjs.org)
 *   --include-dev     Also replace workspace deps in devDependencies
 *   --backup          Create backup of original package.json
 *   --help            Show help message
 * 
 * Examples:
 *   bun run scripts/replace-workspace-deps.ts --dry-run
 *   bun run scripts/replace-workspace-deps.ts --strategy exact
 *   bun run scripts/replace-workspace-deps.ts --backup --include-dev
 */

import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// CLI argument parsing
interface CliArgs {
  dryRun: boolean;
  strategy: 'exact' | 'caret' | 'tilde';
  registry: string;
  includeDev: boolean;
  backup: boolean;
  help: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const parsed: CliArgs = {
    dryRun: false,
    strategy: 'caret',
    registry: 'https://registry.npmjs.org',
    includeDev: false,
    backup: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dry-run':
        parsed.dryRun = true;
        break;
      case '--strategy':
        const strategy = args[++i];
        if (!['exact', 'caret', 'tilde'].includes(strategy)) {
          console.error('❌ Invalid strategy. Use: exact, caret, or tilde');
          process.exit(1);
        }
        parsed.strategy = strategy as any;
        break;
      case '--registry':
        parsed.registry = args[++i];
        break;
      case '--include-dev':
        parsed.includeDev = true;
        break;
      case '--backup':
        parsed.backup = true;
        break;
      case '--help':
        parsed.help = true;
        break;
      default:
        console.error(`❌ Unknown argument: ${arg}`);
        process.exit(1);
    }
  }

  return parsed;
}

function showHelp() {
  console.log(`
🔄 Replace Workspace Dependencies

Replace workspace dependencies in package.json with their latest published versions.

Usage:
  bun run scripts/replace-workspace-deps.ts [options]

Options:
  --dry-run         Show what would be changed without making changes
  --strategy        Version strategy: 'exact', 'caret', 'tilde' (default: 'caret')
  --registry        NPM registry URL (default: https://registry.npmjs.org)
  --include-dev     Also replace workspace deps in devDependencies
  --backup          Create backup of original package.json
  --help            Show this help message

Version Strategies:
  exact    Use exact version: "1.2.3"
  caret    Use caret range: "^1.2.3" (allows patch and minor updates)
  tilde    Use tilde range: "~1.2.3" (allows patch updates only)

Examples:
  bun run scripts/replace-workspace-deps.ts --dry-run
  bun run scripts/replace-workspace-deps.ts --strategy exact --backup
  bun run scripts/replace-workspace-deps.ts --include-dev --registry https://custom-registry.com
`);
}

// NPM registry API functions
async function getLatestVersion(packageName: string, registry: string): Promise<string | null> {
  try {
    const response = await fetch(`${registry}/${packageName}/latest`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`⚠️  Package not found in registry: ${packageName}`);
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as { version: string };
    return data.version;
  } catch (error) {
    console.error(`❌ Failed to fetch version for ${packageName}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

function formatVersion(version: string, strategy: CliArgs['strategy']): string {
  switch (strategy) {
    case 'exact':
      return version;
    case 'caret':
      return `^${version}`;
    case 'tilde':
      return `~${version}`;
    default:
      return version;
  }
}

// Package.json manipulation
interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}

function findWorkspaceDependencies(packageJson: PackageJson, includeDev: boolean): string[] {
  const deps: string[] = [];
  
  // Check dependencies
  if (packageJson.dependencies) {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      if (version.startsWith('workspace:')) {
        deps.push(name);
      }
    }
  }

  // Check devDependencies if requested
  if (includeDev && packageJson.devDependencies) {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      if (version.startsWith('workspace:')) {
        deps.push(name);
      }
    }
  }

  return deps;
}

async function replaceWorkspaceDependencies(
  packageJson: PackageJson,
  versionMap: Map<string, string>,
  includeDev: boolean
): Promise<PackageJson> {
  const result = { ...packageJson };

  // Replace in dependencies
  if (result.dependencies) {
    result.dependencies = { ...result.dependencies };
    for (const [name, version] of Object.entries(result.dependencies)) {
      if (version.startsWith('workspace:') && versionMap.has(name)) {
        result.dependencies[name] = versionMap.get(name)!;
      }
    }
  }

  // Replace in devDependencies if requested
  if (includeDev && result.devDependencies) {
    result.devDependencies = { ...result.devDependencies };
    for (const [name, version] of Object.entries(result.devDependencies)) {
      if (version.startsWith('workspace:') && versionMap.has(name)) {
        result.devDependencies[name] = versionMap.get(name)!;
      }
    }
  }

  return result;
}

// Main execution
async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    return;
  }

  console.log('🔄 Replace Workspace Dependencies\n');

  // Find package.json
  const packageJsonPath = join(process.cwd(), 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.error('❌ package.json not found in current directory');
    process.exit(1);
  }

  console.log(`📦 Reading package.json from: ${packageJsonPath}`);

  // Read and parse package.json
  let packageJson: PackageJson;
  try {
    const content = await readFile(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to read/parse package.json:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Find workspace dependencies
  const workspaceDeps = findWorkspaceDependencies(packageJson, args.includeDev);
  
  if (workspaceDeps.length === 0) {
    console.log('✅ No workspace dependencies found');
    return;
  }

  console.log(`🔍 Found ${workspaceDeps.length} workspace dependencies:`);
  workspaceDeps.forEach(dep => console.log(`   - ${dep}`));
  console.log();

  // Fetch latest versions
  console.log('🌐 Fetching latest versions...');
  const versionMap = new Map<string, string>();
  
  for (const dep of workspaceDeps) {
    process.stdout.write(`   ${dep}... `);
    const version = await getLatestVersion(dep, args.registry);
    
    if (version) {
      const formattedVersion = formatVersion(version, args.strategy);
      versionMap.set(dep, formattedVersion);
      console.log(`✅ ${formattedVersion}`);
    } else {
      console.log('❌ Failed');
    }
  }

  console.log();

  // Check if we have any successful version fetches
  if (versionMap.size === 0) {
    console.error('❌ No versions could be fetched. Aborting.');
    process.exit(1);
  }

  // Show what will be changed
  console.log('📝 Changes to be made:');
  
  // Show dependencies changes
  if (packageJson.dependencies) {
    for (const [name, currentVersion] of Object.entries(packageJson.dependencies)) {
      if (currentVersion.startsWith('workspace:') && versionMap.has(name)) {
        const newVersion = versionMap.get(name)!;
        console.log(`   dependencies.${name}: ${currentVersion} → ${newVersion}`);
      }
    }
  }

  // Show devDependencies changes
  if (args.includeDev && packageJson.devDependencies) {
    for (const [name, currentVersion] of Object.entries(packageJson.devDependencies)) {
      if (currentVersion.startsWith('workspace:') && versionMap.has(name)) {
        const newVersion = versionMap.get(name)!;
        console.log(`   devDependencies.${name}: ${currentVersion} → ${newVersion}`);
      }
    }
  }

  console.log();

  // Dry run check
  if (args.dryRun) {
    console.log('🔍 Dry run complete - no changes made');
    return;
  }

  // Create backup if requested
  if (args.backup) {
    const backupPath = `${packageJsonPath}.backup.${Date.now()}`;
    try {
      await copyFile(packageJsonPath, backupPath);
      console.log(`💾 Backup created: ${backupPath}`);
    } catch (error) {
      console.error('❌ Failed to create backup:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  // Apply changes
  console.log('✏️  Applying changes...');
  
  try {
    const updatedPackageJson = await replaceWorkspaceDependencies(packageJson, versionMap, args.includeDev);
    
    // Write updated package.json with pretty formatting
    const updatedContent = JSON.stringify(updatedPackageJson, null, 2) + '\\n';
    await writeFile(packageJsonPath, updatedContent, 'utf-8');
    
    console.log('✅ package.json updated successfully');
    
    // Show summary
    console.log();
    console.log('📊 Summary:');
    console.log(`   - Updated ${versionMap.size} dependencies`);
    console.log(`   - Strategy: ${args.strategy}`);
    console.log(`   - Registry: ${args.registry}`);
    if (args.includeDev) {
      console.log('   - Included devDependencies');
    }
    if (args.backup) {
      console.log('   - Backup created');
    }
    
  } catch (error) {
    console.error('❌ Failed to write package.json:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log();
  console.log('🎉 Workspace dependencies successfully replaced with published versions!');
  console.log();
  console.log('💡 Next steps:');
  console.log('   1. Review the changes in package.json');
  console.log('   2. Run tests to ensure everything still works');
  console.log('   3. Update lock files if needed (bun install)');
  console.log('   4. Consider running a clean install to verify dependencies');
}

// Run the script
if (import.meta.main) {
  main().catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}