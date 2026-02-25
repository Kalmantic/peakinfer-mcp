/**
 * MCP Resources Registration
 *
 * Available resources:
 * - peakinfer://schema/inference-map: InferenceMap JSON Schema
 * - peakinfer://benchmarks/summary: InferenceMAX benchmark summary
 * - peakinfer://templates/index: Template catalog
 */
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { Resource } from '@modelcontextprotocol/sdk/types.js';
export declare function registerResources(_server: Server): void;
export declare function getResourcesList(): Resource[];
export declare function handleResourceRead(uri: string): Promise<{
    contents: Array<{
        uri: string;
        mimeType: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=index.d.ts.map