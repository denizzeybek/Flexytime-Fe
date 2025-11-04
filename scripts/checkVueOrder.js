#!/usr/bin/env node

/**
 * Vue Composition API Order Checker
 *
 * Checks the following order in <script setup>:
 * 1. Imports
 * 2. Interfaces and Types (interface IProps, interface IEmits, type definitions)
 * 3. defineProps (uses interfaces defined above)
 * 4. defineEmits (uses interfaces defined above)
 * 5. Composables and stores
 * 6. Reactive references (ref)
 * 7. Computed properties
 * 8. Functions (arrow functions)
 * 9. Watchers
 * 10. Lifecycle hooks (onMounted, etc.)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORDER_RULES = {
  IMPORTS: 0,
  INTERFACES_TYPES: 1,
  DEFINE_PROPS: 2,
  DEFINE_EMITS: 3,
  COMPOSABLES: 4,
  REF: 5,
  COMPUTED: 6,
  FUNCTIONS: 7,
  WATCHERS: 8,
  LIFECYCLE: 9,
  UNKNOWN: 999,
};

const ORDER_NAMES = {
  [ORDER_RULES.IMPORTS]: 'Imports',
  [ORDER_RULES.INTERFACES_TYPES]: 'Interfaces and Types (IProps, IEmits, type definitions)',
  [ORDER_RULES.DEFINE_PROPS]: 'defineProps',
  [ORDER_RULES.DEFINE_EMITS]: 'defineEmits',
  [ORDER_RULES.COMPOSABLES]: 'Composables and stores',
  [ORDER_RULES.REF]: 'Reactive references (ref)',
  [ORDER_RULES.COMPUTED]: 'Computed properties',
  [ORDER_RULES.FUNCTIONS]: 'Functions',
  [ORDER_RULES.WATCHERS]: 'Watchers',
  [ORDER_RULES.LIFECYCLE]: 'Lifecycle hooks',
  [ORDER_RULES.UNKNOWN]: 'Unknown',
};

const PATTERNS = {
  IMPORT: /^import\s+/,
  INTERFACE_OR_TYPE: /^(interface\s+|type\s+)/,
  DEFINE_PROPS: /^(const\s+props\s*=\s*(defineProps|withDefaults)|withDefaults\(defineProps|defineProps\()/,
  DEFINE_EMITS: /^(const\s+\w+\s*=\s*defineEmits|defineEmits\()/,
  COMPOSABLE: /^const\s+.*=\s*use[A-Z]\w*\(/,
  REF: /^const\s+\w+\s*=\s*ref\(/,
  COMPUTED: /^const\s+\w+\s*=\s*computed\(/,
  FUNCTION: /^const\s+\w+\s*=\s*(\(.*\)|async\s*\(.*\))\s*=>/,
  WATCHER: /^(watch|watchEffect)\(/,
  LIFECYCLE: /^on[A-Z]\w*\(/,
};

const detectStatementType = (line) => {
  const trimmed = line.trim();

  if (PATTERNS.IMPORT.test(trimmed)) return ORDER_RULES.IMPORTS;
  if (PATTERNS.INTERFACE_OR_TYPE.test(trimmed)) return ORDER_RULES.INTERFACES_TYPES;
  if (PATTERNS.DEFINE_PROPS.test(trimmed)) return ORDER_RULES.DEFINE_PROPS;
  if (PATTERNS.DEFINE_EMITS.test(trimmed)) return ORDER_RULES.DEFINE_EMITS;
  if (PATTERNS.COMPOSABLE.test(trimmed)) return ORDER_RULES.COMPOSABLES;
  if (PATTERNS.REF.test(trimmed)) return ORDER_RULES.REF;
  if (PATTERNS.COMPUTED.test(trimmed)) return ORDER_RULES.COMPUTED;
  if (PATTERNS.FUNCTION.test(trimmed)) return ORDER_RULES.FUNCTIONS;
  if (PATTERNS.WATCHER.test(trimmed)) return ORDER_RULES.WATCHERS;
  if (PATTERNS.LIFECYCLE.test(trimmed)) return ORDER_RULES.LIFECYCLE;

  return null;
};

const extractScriptSetup = (content) => {
  // Match both <script setup> and <script lang="ts" setup>
  const scriptSetupRegex = /<script\s+(?:[^>]*\s+)?setup(?:\s+[^>]*)?>([\s\S]*?)<\/script>/;
  const match = content.match(scriptSetupRegex);
  if (!match) return null;

  const startIndex = match.index + match[0].indexOf(match[1]);
  return {
    content: match[1],
    fullMatch: match[0],
    startIndex,
    endIndex: startIndex + match[1].length,
  };
};

const parseScriptContent = (scriptContent) => {
  const lines = scriptContent.split('\n');
  const blocks = [];
  let currentBlock = null;
  let blockContent = [];
  let bracketCount = 0;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Track bracket depth
    const openBrackets = (line.match(/[{([]/g) || []).length;
    const closeBrackets = (line.match(/[})\]]/g) || []).length;
    bracketCount += openBrackets - closeBrackets;

    // Detect statement type on first line
    const type = detectStatementType(line);

    if (type !== null && blockContent.length === 0) {
      // Start a new block
      if (currentBlock !== null && blockContent.length > 0) {
        blocks.push({
          type: currentBlock,
          lines: [...blockContent],
        });
        blockContent = [];
      }
      currentBlock = type;
      blockContent.push(line);
    } else if (currentBlock !== null) {
      // Continue current block
      blockContent.push(line);

      // If brackets are balanced and line is not empty, potentially end block
      if (bracketCount === 0 && trimmed && !trimmed.startsWith('//')) {
        // Check if next statement might start
        const nextIndex = index + 1;
        if (nextIndex < lines.length) {
          const nextType = detectStatementType(lines[nextIndex]);
          if (nextType !== null) {
            // End current block
            blocks.push({
              type: currentBlock,
              lines: [...blockContent],
            });
            blockContent = [];
            currentBlock = null;
          }
        }
      }
    } else {
      // Not in a block, might be comment or empty line
      if (trimmed) {
        // Unknown content, keep it
        blocks.push({
          type: ORDER_RULES.UNKNOWN,
          lines: [line],
        });
      }
    }
  });

  // Add the last block
  if (currentBlock !== null && blockContent.length > 0) {
    blocks.push({
      type: currentBlock,
      lines: blockContent,
    });
  }

  return blocks;
};

const reorderBlocks = (blocks) => {
  // Separate known blocks from unknown
  const knownBlocks = blocks.filter((b) => b.type !== ORDER_RULES.UNKNOWN);
  const unknownBlocks = blocks.filter((b) => b.type === ORDER_RULES.UNKNOWN);

  // Sort known blocks by order rules
  const sortedBlocks = [...knownBlocks].sort((a, b) => a.type - b.type);

  // Build result with proper spacing
  const result = [];
  let lastType = null;

  sortedBlocks.forEach((block) => {
    // Add empty line between different types (except for first block and imports)
    if (lastType !== null && lastType !== block.type && result.length > 0) {
      result.push('');
    }

    result.push(...block.lines);
    lastType = block.type;
  });

  // Add unknown blocks at the end if any
  if (unknownBlocks.length > 0) {
    if (result.length > 0) result.push('');
    unknownBlocks.forEach((block) => {
      result.push(...block.lines);
    });
  }

  return result;
};

const fixFileOrder = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const scriptInfo = extractScriptSetup(content);

  if (!scriptInfo) {
    return { fixed: false, reason: 'No script setup block found' };
  }

  const blocks = parseScriptContent(scriptInfo.content);

  // Check if reordering is needed
  let needsReorder = false;
  let lastOrder = -1;
  for (const block of blocks) {
    if (block.type !== ORDER_RULES.UNKNOWN && block.type < lastOrder) {
      needsReorder = true;
      break;
    }
    if (block.type !== ORDER_RULES.UNKNOWN) {
      lastOrder = block.type;
    }
  }

  if (!needsReorder) {
    return { fixed: false, reason: 'Already in correct order' };
  }

  // Reorder blocks
  const reorderedLines = reorderBlocks(blocks);
  const newScriptContent = reorderedLines.join('\n');

  // Replace script content
  const before = content.substring(0, scriptInfo.startIndex);
  const after = content.substring(scriptInfo.endIndex);
  const newContent = before + newScriptContent + after;

  fs.writeFileSync(filePath, newContent, 'utf-8');

  return { fixed: true };
};

const checkFileOrder = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const scriptInfo = extractScriptSetup(content);

  if (!scriptInfo) return { valid: true, errors: [] };

  const lines = scriptInfo.content.split('\n');
  const statements = [];
  let currentOrder = -1;
  const errors = [];

  lines.forEach((line, index) => {
    const type = detectStatementType(line);
    if (type !== null) {
      statements.push({ line: index + 1, type, content: line.trim() });

      if (type < currentOrder) {
        errors.push({
          line: index + 1,
          message: `${ORDER_NAMES[type]} should come before ${ORDER_NAMES[currentOrder]}`,
          expected: ORDER_NAMES[type],
          actual: ORDER_NAMES[currentOrder],
        });
      }
      currentOrder = type;
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    statements,
  };
};

const findVueFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        findVueFiles(filePath, fileList);
      }
    } else if (file.endsWith('.vue')) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

const main = () => {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');

  const srcDir = path.resolve(__dirname, '../src');
  const vueFiles = findVueFiles(srcDir);

  let totalErrors = 0;
  let filesWithErrors = 0;
  let filesFixed = 0;

  if (shouldFix) {
    console.log('🔧 Fixing Vue Composition API order...\n');
  } else {
    console.log('🔍 Checking Vue Composition API order...\n');
  }

  vueFiles.forEach((filePath) => {
    if (shouldFix) {
      const result = fixFileOrder(filePath);
      if (result.fixed) {
        filesFixed++;
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`✅ Fixed: ${relativePath}`);
      }
    } else {
      const result = checkFileOrder(filePath);
      if (!result.valid) {
        filesWithErrors++;
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`❌ ${relativePath}`);

        result.errors.forEach((error) => {
          console.log(`   Line ${error.line}: ${error.message}`);
          totalErrors++;
        });
        console.log('');
      }
    }
  });

  if (shouldFix) {
    console.log(`\n📊 Summary:`);
    console.log(`   Total files checked: ${vueFiles.length}`);
    console.log(`   Files fixed: ${filesFixed}`);
    console.log('');
    if (filesFixed > 0) {
      console.log('✨ All files have been reordered!\n');
    } else {
      console.log('✅ All files were already in correct order!\n');
    }
  } else {
    if (totalErrors === 0) {
      console.log('✅ All Vue files follow the correct order!\n');
      console.log(`📊 Checked ${vueFiles.length} Vue files\n`);
    } else {
      console.log(`\n📊 Summary:`);
      console.log(`   Total files checked: ${vueFiles.length}`);
      console.log(`   Files with errors: ${filesWithErrors}`);
      console.log(`   Total order violations: ${totalErrors}\n`);
      console.log('💡 Expected order:');
      Object.entries(ORDER_NAMES)
        .filter(([order]) => parseInt(order) !== ORDER_RULES.UNKNOWN)
        .forEach(([order, name]) => {
          console.log(`   ${parseInt(order) + 1}. ${name}`);
        });
      console.log('\n💡 Run with --fix to automatically reorder files:\n');
      console.log('   yarn lint:order\n');
      process.exit(1);
    }
  }
};

main();
