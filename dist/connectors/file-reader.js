/**
 * File Reader - Read code files from disk for API analysis
 *
 * Globs for code files, respects common ignore patterns,
 * and enforces size limits for API submission.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, relative } from 'path';
const CODE_EXTENSIONS = new Set([
    '.py', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.go', '.java', '.rs', '.rb', '.php', '.kt', '.kts',
    '.swift', '.scala', '.cs', '.cpp', '.c', '.h', '.hpp',
    '.lua', '.ex', '.exs', '.clj', '.zig', '.nim', '.r',
    '.yaml', '.yml', '.toml', '.json', '.jsonc',
]);
const IGNORE_DIRS = new Set([
    'node_modules', '.git', '__pycache__', 'dist', 'build',
    '.next', '.nuxt', '.venv', 'venv', 'env', '.env',
    '.tox', '.mypy_cache', '.pytest_cache', '.ruff_cache',
    'target', 'out', 'bin', '.gradle', '.idea', '.vscode',
    'vendor', 'coverage', '.turbo', '.cache',
]);
const IGNORE_FILES = new Set([
    '.env', '.env.local', '.env.production', '.env.development',
    'credentials.json', 'secrets.yaml', 'secrets.json',
    '.DS_Store', 'Thumbs.db',
]);
const MAX_FILES = 50;
const MAX_FILE_SIZE = 50 * 1024; // 50KB per file
const MAX_TOTAL_SIZE = 500 * 1024; // 500KB total
function shouldIgnoreDir(name) {
    return IGNORE_DIRS.has(name) || name.startsWith('.');
}
function shouldIgnoreFile(name) {
    return IGNORE_FILES.has(name);
}
function isCodeFile(name) {
    return CODE_EXTENSIONS.has(extname(name).toLowerCase());
}
function walkDir(dir, basePath, files, totalSize) {
    if (files.length >= MAX_FILES || totalSize.value >= MAX_TOTAL_SIZE)
        return;
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true });
    }
    catch {
        return; // Skip unreadable directories
    }
    for (const entry of entries) {
        if (files.length >= MAX_FILES || totalSize.value >= MAX_TOTAL_SIZE)
            break;
        if (entry.isDirectory()) {
            if (!shouldIgnoreDir(entry.name)) {
                walkDir(join(dir, entry.name), basePath, files, totalSize);
            }
        }
        else if (entry.isFile()) {
            if (shouldIgnoreFile(entry.name) || !isCodeFile(entry.name))
                continue;
            const filePath = join(dir, entry.name);
            try {
                const stat = statSync(filePath);
                if (stat.size > MAX_FILE_SIZE)
                    continue;
                if (totalSize.value + stat.size > MAX_TOTAL_SIZE)
                    continue;
                const content = readFileSync(filePath, 'utf-8');
                const relativePath = relative(basePath, filePath);
                files.push({ path: relativePath, content });
                totalSize.value += stat.size;
            }
            catch {
                // Skip unreadable files
            }
        }
    }
}
export async function readCodeFiles(targetPath) {
    if (!existsSync(targetPath)) {
        throw new Error(`Path not found: ${targetPath}`);
    }
    const stat = statSync(targetPath);
    const files = [];
    const totalSize = { value: 0 };
    if (stat.isFile()) {
        // Single file
        if (stat.size > MAX_FILE_SIZE) {
            throw new Error(`File too large: ${targetPath} (${stat.size} bytes, max ${MAX_FILE_SIZE})`);
        }
        const content = readFileSync(targetPath, 'utf-8');
        files.push({ path: targetPath, content });
    }
    else if (stat.isDirectory()) {
        walkDir(targetPath, targetPath, files, totalSize);
    }
    if (files.length === 0) {
        throw new Error(`No code files found in: ${targetPath}`);
    }
    return files;
}
export const FILE_READER_LIMITS = {
    MAX_FILES,
    MAX_FILE_SIZE,
    MAX_TOTAL_SIZE,
};
//# sourceMappingURL=file-reader.js.map