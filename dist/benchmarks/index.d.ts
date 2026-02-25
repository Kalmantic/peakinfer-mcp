/**
 * InferenceMAX Benchmark Integration
 *
 * Provides benchmark comparison for LLM inference performance.
 * Data sourced from the InferenceMAX benchmark suite.
 *
 * NOTE: This is a bundled copy for MCP server distribution.
 * Source: peakinfer/src/benchmarks/index.ts
 */
interface BenchmarkMetrics {
    ttft_ms: number;
    p50_latency_ms: number;
    p95_latency_ms: number;
    p99_latency_ms: number;
    throughput_tps: number;
    cost_per_1k_input: number;
    cost_per_1k_output: number;
}
interface BenchmarkEntry {
    model: string;
    provider: string;
    framework: string;
    hardware: string;
    metrics: BenchmarkMetrics;
    optimal_config?: Record<string, unknown>;
    notes?: string;
}
export interface BenchmarkComparison {
    pointId: string;
    model: string;
    framework: string;
    hardware: string;
    your_metrics: {
        p95_latency_ms?: number;
        ttft_ms?: number;
        throughput_tps?: number;
    };
    benchmark_metrics: BenchmarkMetrics;
    gaps: {
        p95_latency?: {
            value: number;
            percent: number;
            description: string;
        };
        ttft?: {
            value: number;
            percent: number;
            description: string;
        };
        throughput?: {
            value: number;
            percent: number;
            description: string;
        };
    };
    overall_gap: string;
    optimal_config?: Record<string, unknown>;
}
/**
 * Get benchmark for a specific model
 */
export declare function getBenchmark(model: string, framework?: string, hardware?: string): BenchmarkEntry | null;
/**
 * Compare user metrics to benchmark
 */
export declare function compareToBenchmark(pointId: string, model: string, userMetrics: {
    p95_latency_ms?: number;
    ttft_ms?: number;
    throughput_tps?: number;
}, framework?: string, hardware?: string): BenchmarkComparison | null;
/**
 * Get all available benchmarks
 */
export declare function listBenchmarks(): BenchmarkEntry[];
/**
 * Get benchmark data version
 */
export declare function getBenchmarkVersion(): {
    version: string;
    lastUpdated: string;
};
/**
 * Check if benchmark data is available for a model
 */
export declare function hasBenchmark(model: string): boolean;
/**
 * Format benchmark comparison for display
 */
export declare function formatBenchmarkComparison(comparison: BenchmarkComparison): string;
export {};
//# sourceMappingURL=index.d.ts.map