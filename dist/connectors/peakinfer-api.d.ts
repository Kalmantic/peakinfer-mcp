/**
 * PeakInfer API Connector
 *
 * Calls POST https://peakinfer.com/api/analyze with code files
 * for comprehensive 4D analysis (cost, latency, throughput, reliability).
 *
 * Auth modes:
 * - Bearer pk_live_xxx (PeakInfer token, costs credits)
 * - X-Anthropic-Api-Key sk-ant-xxx (BYOK mode, free)
 */
export interface AnalysisFile {
    path: string;
    content: string;
}
export interface AnalysisOptions {
    fixes?: boolean;
    benchmark?: boolean;
    outputFormat?: string;
}
export interface InferencePoint {
    id: string;
    file: string;
    line: number;
    provider: string;
    model: string;
    patterns: {
        streaming?: boolean;
        batching?: boolean;
        retry?: boolean;
        fallback?: boolean;
        timeout?: boolean;
        caching?: boolean;
        async?: boolean;
        max_tokens?: boolean;
    };
    issues: Array<{
        severity: 'critical' | 'warning' | 'info';
        type: string;
        message: string;
        impact?: string;
        fix?: string;
    }>;
    confidence: number;
}
export interface AnalysisResult {
    success: boolean;
    version: string;
    inference_points: InferencePoint[];
    summary: {
        files_scanned: number;
        total_callsites: number;
        providers: Record<string, number>;
        models: Record<string, number>;
        critical_issues: number;
        warnings: number;
        opportunities: number;
    };
    insights: Array<{
        type: string;
        severity: 'critical' | 'warning' | 'info';
        message: string;
        affected_files: string[];
    }>;
    optimizations: Array<{
        priority: number;
        issue: string;
        fix: string;
        impact: string;
        effort: string;
        files: string[];
        code_before?: string;
        code_after?: string;
    }>;
    benchmarks?: Array<{
        model: string;
        metric: string;
        benchmark_value: number;
        estimated_value?: number;
        gap_percent?: number;
    }>;
    credits_used?: number;
    error?: string;
    error_code?: string;
}
export declare class PeakInferAPIError extends Error {
    readonly code: string;
    readonly statusCode?: number | undefined;
    constructor(message: string, code: string, statusCode?: number | undefined);
}
export declare function analyzeViaAPI(params: {
    files: AnalysisFile[];
    token?: string;
    anthropicKey?: string;
    options?: AnalysisOptions;
}): Promise<AnalysisResult>;
//# sourceMappingURL=peakinfer-api.d.ts.map