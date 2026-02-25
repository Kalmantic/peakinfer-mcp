/**
 * MCP Prompts Registration
 *
 * Available prompts:
 * - analyze-inference: Guide for analyzing LLM inference patterns
 * - optimize-costs: Guide for reducing inference costs
 * - detect-drift: Guide for detecting runtime drift
 */
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { Prompt } from '@modelcontextprotocol/sdk/types.js';
export declare function registerPrompts(_server: Server): void;
export declare function getPromptsList(): Prompt[];
export declare function handlePromptGet(name: string, args: Record<string, string>): Promise<{
    messages: Array<{
        role: string;
        content: {
            type: string;
            text: string;
        };
    }>;
}>;
//# sourceMappingURL=index.d.ts.map