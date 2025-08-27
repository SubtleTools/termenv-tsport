#!/usr/bin/env node

/**
 * Simple Node.js version of the workspace dependency replacement script
 * This version uses only Node.js built-ins for maximum compatibility
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';

// CLI argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
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
        parsed.strategy = strategy;
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
  node scripts/replace-workspace-deps.js [options]

Options:
  --dry-run         Show what would be changed without making changes
  --strategy        Version strategy: 'exact', 'caret', 'tilde' (default: 'caret')
  --registry        NPM registry URL (default: https://registry.npmjs.org)
  --include-dev     Also replace workspace deps in devDependencies
  --backup          Create backup of original package.json
  --help            Show this help message

Examples:
  node scripts/replace-workspace-deps.js --dry-run
  node scripts/replace-workspace-deps.js --strategy exact --backup
  npm run replace-workspace-deps -- --dry-run
`);
}

// HTTP request helper
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    client.get(url, (res) => {
      if (res.statusCode === 404) {
        resolve(null); // Package not found
        return;
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function getLatestVersion(packageName, registry) {
  try {
    const data = await fetchJson(`${registry}/${packageName}/latest`);
    return data ? data.version : null;
  } catch (error) {
    console.error(`❌ Failed to fetch version for ${packageName}:`, error.message);
    return null;
  }
}

function formatVersion(version, strategy) {
  switch (strategy) {
    case 'exact': return version;
    case 'caret': return `^${version}`;
    case 'tilde': return `~${version}`;
    default: return version;
  }
}

function findWorkspaceDependencies(packageJson, includeDev) {
  const deps = [];
  
  if (packageJson.dependencies) {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      if (version.startsWith('workspace:')) {
        deps.push(name);
      }
    }
  }

  if (includeDev && packageJson.devDependencies) {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      if (version.startsWith('workspace:')) {
        deps.push(name);
      }
    }
  }

  return deps;
}

async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    return;
  }

  console.log('🔄 Replace Workspace Dependencies\\n');

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found in current directory');
    process.exit(1);
  }

  console.log(`📦 Reading package.json from: ${packageJsonPath}`);

  // Read package.json
  let packageJson;
  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to read/parse package.json:', error.message);
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
  const versionMap = new Map();
  
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

  if (versionMap.size === 0) {
    console.error('❌ No versions could be fetched. Aborting.');
    process.exit(1);
  }

  // Show changes
  console.log('📝 Changes to be made:');
  
  if (packageJson.dependencies) {
    for (const [name, currentVersion] of Object.entries(packageJson.dependencies)) {
      if (currentVersion.startsWith('workspace:') && versionMap.has(name)) {
        const newVersion = versionMap.get(name);
        console.log(`   dependencies.${name}: ${currentVersion} → ${newVersion}`);
      }
    }
  }

  if (args.includeDev && packageJson.devDependencies) {
    for (const [name, currentVersion] of Object.entries(packageJson.devDependencies)) {
      if (currentVersion.startsWith('workspace:') && versionMap.has(name)) {
        const newVersion = versionMap.get(name);
        console.log(`   devDependencies.${name}: ${currentVersion} → ${newVersion}`);
      }
    }
  }

  console.log();

  if (args.dryRun) {
    console.log('🔍 Dry run complete - no changes made');
    return;
  }

  // Create backup
  if (args.backup) {
    const backupPath = `${packageJsonPath}.backup.${Date.now()}`;
    try {
      fs.copyFileSync(packageJsonPath, backupPath);
      console.log(`💾 Backup created: ${backupPath}`);
    } catch (error) {
      console.error('❌ Failed to create backup:', error.message);
      process.exit(1);
    }
  }

  // Apply changes
  console.log('✏️  Applying changes...');
  
  try {
    // Update dependencies
    if (packageJson.dependencies) {
      for (const [name, currentVersion] of Object.entries(packageJson.dependencies)) {
        if (currentVersion.startsWith('workspace:') && versionMap.has(name)) {
          packageJson.dependencies[name] = versionMap.get(name);
        }
      }
    }

    // Update devDependencies if requested
    if (args.includeDev && packageJson.devDependencies) {
      for (const [name, currentVersion] of Object.entries(packageJson.devDependencies)) {
        if (currentVersion.startsWith('workspace:') && versionMap.has(name)) {
          packageJson.devDependencies[name] = versionMap.get(name);
        }
      }
    }

    // Write updated package.json
    const updatedContent = JSON.stringify(packageJson, null, 2) + '\\n';
    fs.writeFileSync(packageJsonPath, updatedContent, 'utf-8');
    
    console.log('✅ package.json updated successfully');
    
    console.log();
    console.log('📊 Summary:');
    console.log(`   - Updated ${versionMap.size} dependencies`);
    console.log(`   - Strategy: ${args.strategy}`);
    console.log(`   - Registry: ${args.registry}`);
    if (args.includeDev) console.log('   - Included devDependencies');
    if (args.backup) console.log('   - Backup created');
    
  } catch (error) {
    console.error('❌ Failed to write package.json:', error.message);
    process.exit(1);
  }

  console.log();
  console.log('🎉 Workspace dependencies successfully replaced with published versions!');
  console.log();
  console.log('💡 Next steps:');
  console.log('   1. Review the changes in package.json');  
  console.log('   2. Run tests to ensure everything still works');
  console.log('   3. Update lock files (npm install / bun install)');
}

if (import.meta.main) {
  main().catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}