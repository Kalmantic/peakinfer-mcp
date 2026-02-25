/**
 * Shared types for runtime data connectors
 *
 * These types define the normalized format for runtime events
 * from various sources (Helicone, LangSmith, etc.)
 *
 * NOTE: This is a bundled copy for MCP server distribution.
 * Source: peakinfer/src/connectors/types.ts
 */
export interface NormalizedEvent {
    id: string;
    timestamp: string;
    model: string;
    provider: string;
    latency_ms: number;
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    cost_usd?: number;
    success: boolean;
    error?: string;
    streaming?: boolean;
    trace_id?: string;
    span_id?: string;
    parent_span_id?: string;
    request_path?: string;
    user_id?: string;
    session_id?: string;
    raw?: Record<string, unknown>;
}
export interface ConnectorSummary {
    total_requests: number;
    total_cost_usd: number;
    avg_latency_ms: number;
    p50_latency_ms: number;
    p95_latency_ms: number;
    p99_latency_ms: number;
    error_rate: number;
    streaming_rate: number;
    by_model: Record<string, {
        count: number;
        cost: number;
        avg_latency_ms: number;
        p95_latency_ms: number;
        error_rate: number;
    }>;
    by_provider: Record<string, {
        count: number;
        cost: number;
    }>;
    time_range: {
        start: string;
        end: string;
    };
}
export interface ConnectorResult {
    events: NormalizedEvent[];
    summary: ConnectorSummary;
    metadata: {
        source: 'helicone' | 'langsmith';
        fetched_at: string;
        total_fetched: number;
        truncated: boolean;
        api_version?: string;
    };
}
export interface ConnectorConfig {
    apiKey: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
    filter?: {
        model?: string;
        provider?: string;
        success?: boolean;
    };
}
export declare class ConnectorError extends Error {
    readonly source: 'helicone' | 'langsmith';
    readonly statusCode?: number | undefined;
    readonly code?: string | undefined;
    constructor(message: string, source: 'helicone' | 'langsmith', statusCode?: number | undefined, code?: string | undefined);
}
export declare function calculatePercentile(values: number[], percentile: number): number;
export declare function calculateSummary(events: NormalizedEvent[]): ConnectorSummary;
//# sourceMappingURL=types.d.ts.map