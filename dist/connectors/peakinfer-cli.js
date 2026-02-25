/**
 * PeakInfer CLI Connector (Fallback)
 *
 * Falls back to the local `peakinfer` CLI binary if installed.
 * Runs: peakinfer analyze <path> --output json
 *
 * Returns null if CLI is not installed (allows graceful fallback).
 */
import { execSync } from 'child_process';
const CLI_TIMEOUT = 120_000; // 120 seconds
function isCLIInstalled() {
    // Fast detection only — no npx (slow, downloads packages)
    const checks = ['command -v peakinfer', 'which peakinfer'];
    for (const cmd of checks) {
        try {
            execSync(cmd, { stdio: 'pipe', timeout: 3_000 });
            return true;
        }
        catch {
            continue;
        }
    }
    return false;
}
export async function analyzeViaCLI(params) {
    if (!isCLIInstalled()) {
        return null;
    }
    const { path, options } = params;
    const args = ['analyze', path, '--output', 'json'];
    if (options?.fixes) {
        args.push('--fixes');
    }
    if (options?.benchmark) {
        args.push('--benchmark');
    }
    // Try direct CLI first, then npx
    const commands = [
        `peakinfer ${args.join(' ')}`,
        `npx peakinfer ${args.join(' ')}`,
    ];
    for (const cmd of commands) {
        try {
            const output = execSync(cmd, {
                timeout: CLI_TIMEOUT,
                stdio: ['pipe', 'pipe', 'pipe'],
                encoding: 'utf-8',
                maxBuffer: 10 * 1024 * 1024, // 10MB
            });
            const result = JSON.parse(output);
            return result;
        }
        catch {
            continue; // Try next command
        }
    }
    return null;
}
//# sourceMappingURL=peakinfer-cli.js.map