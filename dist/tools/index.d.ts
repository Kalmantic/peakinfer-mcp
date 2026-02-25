/**
 * MCP Tools Registration
 *
 * Available tools:
 * - analyze: Analyze code for LLM inference issues via PeakInfer engine
 * - get_helicone_events: Fetch runtime events from Helicone
 * - get_langsmith_traces: Fetch traces from LangSmith
 * - get_inferencemax_benchmark: Get benchmark data for a model
 * - compare_to_baseline: Compare current analysis to historical baseline
 * - list_templates: List available optimization templates
 * - get_template: Get details of a specific template
 * - save_analysis: Save analysis results
 */
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare function registerTools(_server: Server): void;
export declare function getToolsList(): Tool[];
export declare function handleToolCall(name: string, args: Record<string, unknown>): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=index.d.ts.map