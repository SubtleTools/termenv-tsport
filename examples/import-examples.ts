/**
 * Example demonstrating all the different import patterns supported by @tsports/termenv
 * 
 * This file shows how to import from different module paths and use the various APIs.
 */

// ============================================================================
// Main Package Imports (TypeScript-native API)
// ============================================================================

// Import main functions and types from the root
import { 
  initializeLibrary,
  type LibraryOptions,
  type LibraryResult,
  LibraryError 
} from '@tsports/termenv';

// ============================================================================
// Go-Compatible API Imports
// ============================================================================

// Import Go-style API with PascalCase naming
import { 
  InitializeLibrary,
  type LibraryOptions as GoLibraryOptions 
} from '@tsports/termenv/go-style';

// ============================================================================
// Types-Only Imports
// ============================================================================

// Import only types from the types module
import type { 
  OperationMode,
  LibraryOptions as TypesLibraryOptions,
  LibraryResult as TypesLibraryResult
} from '@tsports/termenv/types';

// ============================================================================
// Usage Examples
// ============================================================================

async function demonstrateTypeScriptAPI() {
  console.log('=== TypeScript-Native API ===');
  
  // Use TypeScript-style camelCase API
  const options: LibraryOptions = {
    enableLogging: true,
    timeout: 5000,
    config: { debug: true }
  };
  
  try {
    await initializeLibrary('TypeScript API Demo');
    console.log('✅ TypeScript API initialized successfully');
  } catch (error) {
    if (error instanceof LibraryError) {
      console.error('❌ Library error:', error.message, error.code);
    }
  }
}

function demonstrateGoAPI() {
  console.log('=== Go-Compatible API ===');
  
  // Use Go-style PascalCase API (matches original Go package exactly)
  const goOptions: GoLibraryOptions = {
    enableLogging: true,
    timeout: 5000,
    config: { Debug: true } // Note: Go-style capitalization
  };
  
  try {
    InitializeLibrary('Go API Demo');
    console.log('✅ Go API initialized successfully');
  } catch (error) {
    console.error('❌ Go API error:', error);
  }
}

function demonstrateTypeUsage() {
  console.log('=== Type Usage Examples ===');
  
  // Use imported union types
  const modes: OperationMode[] = ['sync', 'async', 'streaming'];
  console.log('Available modes:', modes);
  
  // Use imported interface types
  const result: TypesLibraryResult = {
    success: true,
    data: 'Operation completed',
    timestamp: Date.now()
  };
  console.log('Result:', result);
  
  // Create configuration objects
  const config: TypesLibraryOptions = {
    enableLogging: false,
    timeout: 3000
  };
  console.log('Configuration:', config);
}

// ============================================================================
// Advanced Import Patterns
// ============================================================================

// Dynamic imports for code splitting
async function dynamicImportExample() {
  console.log('=== Dynamic Import Example ===');
  
  // Dynamic import of the main module
  const { initializeLibrary: dynamicInit } = await import('@tsports/termenv');
  await dynamicInit('Dynamic import demo');
  
  // Dynamic import of Go-style API
  const { InitializeLibrary: DynamicGoInit } = await import('@tsports/termenv/go-style');
  DynamicGoInit('Dynamic Go import demo');
  
  // Dynamic import of types (types are erased at runtime, so this is mainly for code organization)
  const types = await import('@tsports/termenv/types');
  console.log('Types module loaded:', typeof types);
}

// ============================================================================
// Module Resolution Examples  
// ============================================================================

// These imports work with both package.json imports and tsconfig.json paths
import { initializeLibrary as srcAliasedInit } from '#src/index.js'; // Via #src/* import
import { LibraryError as SrcLibraryError } from '#src/types.js'; // Via #src/* import

// Legacy aliases (still supported)
import { initializeLibrary as atAliasedInit } from '@/index.js'; // Via @/* alias
// import { testHelper } from '~/test/utils/comparison.js'; // Via ~/test/* alias

// Test utilities using #test import
// import { comparison } from '#test/utils/comparison.js'; // Via #test/* import

function demonstrateAliases() {
  console.log('=== Path Alias Examples ===');
  
  // Use function imported via #src alias  
  srcAliasedInit('Package imports (#src) demo');
  console.log('✅ Package imports (#src/*) working');
  
  // Use function imported via @ alias
  atAliasedInit('Legacy alias (@) demo');
  console.log('✅ Legacy alias imports (@/*) working');
  
  // Test error class from #src import
  const srcError = new SrcLibraryError('Test error', 'TEST_SRC');
  console.log('✅ Types from #src/* imports working:', srcError.code);
}

// ============================================================================
// Run All Examples
// ============================================================================

export async function runAllExamples() {
  console.log('🚀 Running import examples for @tsports/termenv\n');
  
  await demonstrateTypeScriptAPI();
  console.log();
  
  demonstrateGoAPI();
  console.log();
  
  demonstrateTypeUsage();
  console.log();
  
  await dynamicImportExample();
  console.log();
  
  demonstrateAliases();
  console.log();
  
  console.log('✅ All import examples completed successfully!');
}

// Run if this file is executed directly
if (import.meta.main) {
  runAllExamples().catch(console.error);
}