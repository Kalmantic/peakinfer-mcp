/**
 * PeakInfer CLI Connector (Fallback)
 *
 * Falls back to the local `peakinfer` CLI binary if installed.
 * Runs: peakinfer analyze <path> --output json
 *
 * Returns null if CLI is not installed (allows graceful fallback).
 */
import type { AnalysisResult } from './peakinfer-api.js';
export declare function analyzeViaCLI(params: {
    path: string;
    options?: {
        fixes?: boolean;
        benchmark?: boolean;
    };
}): Promise<AnalysisResult | null>;
//# sourceMappingURL=peakinfer-cli.d.ts.map