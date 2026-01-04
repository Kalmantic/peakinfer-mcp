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

// Resource definitions
const resources: Resource[] = [
  {
    uri: 'peakinfer://schema/inference-map',
    name: 'InferenceMap Schema',
    description: 'JSON Schema for PeakInfer InferenceMap v0.1 format',
    mimeType: 'application/json',
  },
  {
    uri: 'peakinfer://benchmarks/summary',
    name: 'InferenceMAX Benchmarks',
    description: 'Summary of available benchmark data for LLM models',
    mimeType: 'application/json',
  },
  {
    uri: 'peakinfer://templates/index',
    name: 'Template Catalog',
    description: 'Index of available PeakInfer optimization templates',
    mimeType: 'application/json',
  },
];

export function registerResources(_server: Server): void {
  // Resources are registered via the ListResources and ReadResource handlers
}

export function getResourcesList(): Resource[] {
  return resources;
}

export async function handleResourceRead(
  uri: string
): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
  switch (uri) {
    case 'peakinfer://schema/inference-map':
      return await getInferenceMapSchema();
    case 'peakinfer://benchmarks/summary':
      return await getBenchmarksSummary();
    case 'peakinfer://templates/index':
      return await getTemplatesIndex();
    default:
      return {
        contents: [{
          uri,
          mimeType: 'text/plain',
          text: `Unknown resource: ${uri}`,
        }],
      };
  }
}

async function getInferenceMapSchema() {
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'InferenceMap',
    version: '0.1',
    type: 'object',
    required: ['version', 'root', 'generatedAt', 'summary', 'callsites'],
    properties: {
      version: { type: 'string', const: '0.1' },
      root: { type: 'string', description: 'Root directory analyzed' },
      generatedAt: { type: 'string', format: 'date-time' },
      metadata: {
        type: 'object',
        properties: {
          absolutePath: { type: 'string' },
          promptId: { type: 'string' },
          promptVersion: { type: 'string' },
          llmProvider: { type: 'string' },
          llmModel: { type: 'string' },
        },
      },
      summary: {
        type: 'object',
        properties: {
          totalCallsites: { type: 'number' },
          providers: { type: 'array', items: { type: 'string' } },
          models: { type: 'array', items: { type: 'string' } },
          patterns: { type: 'object' },
        },
      },
      callsites: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'file', 'line'],
          properties: {
            id: { type: 'string' },
            file: { type: 'string' },
            line: { type: 'number' },
            provider: { type: 'string' },
            model: { type: 'string' },
            framework: { type: 'string' },
            patterns: {
              type: 'object',
              properties: {
                streaming: { type: 'boolean' },
                batching: { type: 'boolean' },
                retries: { type: 'boolean' },
                caching: { type: 'boolean' },
                fallback: { type: 'boolean' },
              },
            },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
      },
    },
  };

  return {
    contents: [{
      uri: 'peakinfer://schema/inference-map',
      mimeType: 'application/json',
      text: JSON.stringify(schema, null, 2),
    }],
  };
}

async function getBenchmarksSummary() {
  try {
    const { listBenchmarks, getBenchmarkVersion } = await import('../benchmarks/index.js');

    const benchmarks = listBenchmarks();
    const version = getBenchmarkVersion();

    const summary = {
      version: version.version,
      lastUpdated: version.lastUpdated,
      totalModels: benchmarks.length,
      models: benchmarks.map((b: { model: string; provider: string; framework: string; hardware: string; metrics: { p95_latency_ms: number; throughput_tps: number } }) => ({
        model: b.model,
        provider: b.provider,
        framework: b.framework,
        hardware: b.hardware,
        p95_latency_ms: b.metrics.p95_latency_ms,
        throughput_tps: b.metrics.throughput_tps,
      })),
    };

    return {
      contents: [{
        uri: 'peakinfer://benchmarks/summary',
        mimeType: 'application/json',
        text: JSON.stringify(summary, null, 2),
      }],
    };
  } catch (error) {
    return {
      contents: [{
        uri: 'peakinfer://benchmarks/summary',
        mimeType: 'application/json',
        text: JSON.stringify({ error: 'Failed to load benchmarks' }),
      }],
    };
  }
}

async function getTemplatesIndex() {
  const { readdirSync, existsSync } = await import('fs');
  const { join, dirname } = await import('path');
  const { fileURLToPath } = await import('url');

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const templatesDir = join(__dirname, '../../../../templates');

  const templates: Array<{ name: string; category: string; path: string }> = [];

  if (existsSync(templatesDir)) {
    // Insights templates
    const insightsDir = join(templatesDir, 'insights');
    if (existsSync(insightsDir)) {
      for (const file of readdirSync(insightsDir)) {
        if (file.endsWith('.yaml')) {
          templates.push({
            name: file.replace('.yaml', ''),
            category: 'insights',
            path: `templates/insights/${file}`,
          });
        }
      }
    }

    // Optimizations templates
    const optimizationsDir = join(templatesDir, 'optimizations');
    if (existsSync(optimizationsDir)) {
      for (const file of readdirSync(optimizationsDir)) {
        if (file.endsWith('.yaml')) {
          templates.push({
            name: file.replace('.yaml', ''),
            category: 'optimizations',
            path: `templates/optimizations/${file}`,
          });
        }
      }
    }
  }

  return {
    contents: [{
      uri: 'peakinfer://templates/index',
      mimeType: 'application/json',
      text: JSON.stringify({
        totalTemplates: templates.length,
        categories: {
          insights: templates.filter(t => t.category === 'insights').length,
          optimizations: templates.filter(t => t.category === 'optimizations').length,
        },
        templates,
      }, null, 2),
    }],
  };
}
