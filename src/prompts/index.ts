/**
 * MCP Prompts Registration
 *
 * Available prompts:
 * - analyze-inference: Guide for analyzing LLM inference patterns
 * - optimize-costs: Guide for reducing inference costs
 * - detect-drift: Guide for detecting runtime drift
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { Prompt, PromptArgument } from '@modelcontextprotocol/sdk/types.js';

// Prompt definitions
const prompts: Prompt[] = [
  {
    name: 'analyze-inference',
    description: 'Analyze LLM inference patterns in a codebase',
    arguments: [
      {
        name: 'target',
        description: 'Directory or file to analyze',
        required: true,
      },
      {
        name: 'focus',
        description: 'Focus area: cost, latency, reliability, or all (default: all)',
        required: false,
      },
    ] as PromptArgument[],
  },
  {
    name: 'optimize-costs',
    description: 'Get recommendations for reducing LLM inference costs',
    arguments: [
      {
        name: 'current_spend',
        description: 'Current monthly LLM spend (e.g., "$5000")',
        required: false,
      },
      {
        name: 'providers',
        description: 'LLM providers in use (e.g., "openai, anthropic")',
        required: false,
      },
    ] as PromptArgument[],
  },
  {
    name: 'detect-drift',
    description: 'Detect drift between code patterns and runtime behavior',
    arguments: [
      {
        name: 'runtime_source',
        description: 'Runtime data source: helicone, langsmith',
        required: true,
      },
      {
        name: 'baseline_date',
        description: 'Compare to baseline from date (ISO format)',
        required: false,
      },
    ] as PromptArgument[],
  },
  {
    name: 'benchmark-comparison',
    description: 'Compare your inference performance to InferenceMAX benchmarks',
    arguments: [
      {
        name: 'model',
        description: 'Model to benchmark (e.g., gpt-4o, claude-3-5-sonnet)',
        required: true,
      },
      {
        name: 'your_p95_latency',
        description: 'Your P95 latency in ms',
        required: false,
      },
      {
        name: 'your_throughput',
        description: 'Your throughput in tokens/second',
        required: false,
      },
    ] as PromptArgument[],
  },
];

export function registerPrompts(_server: Server): void {
  // Prompts are registered via the ListPrompts and GetPrompt handlers
}

export function getPromptsList(): Prompt[] {
  return prompts;
}

export async function handlePromptGet(
  name: string,
  args: Record<string, string>
): Promise<{ messages: Array<{ role: string; content: { type: string; text: string } }> }> {
  switch (name) {
    case 'analyze-inference':
      return getAnalyzeInferencePrompt(args);
    case 'optimize-costs':
      return getOptimizeCostsPrompt(args);
    case 'detect-drift':
      return getDetectDriftPrompt(args);
    case 'benchmark-comparison':
      return getBenchmarkComparisonPrompt(args);
    default:
      return {
        messages: [{
          role: 'user',
          content: { type: 'text', text: `Unknown prompt: ${name}` },
        }],
      };
  }
}

function getAnalyzeInferencePrompt(args: Record<string, string>) {
  const target = args.target || '.';
  const focus = args.focus || 'all';

  const focusInstructions = {
    cost: `Focus on cost optimization opportunities:
- Identify overpowered models (GPT-4 for simple tasks)
- Find missing caching opportunities
- Detect redundant API calls
- Suggest model downgrades where appropriate`,
    latency: `Focus on latency optimization:
- Identify sequential calls that could be parallel
- Find missing streaming implementations
- Detect unnecessary round-trips
- Suggest batching opportunities`,
    reliability: `Focus on reliability patterns:
- Identify missing retry logic
- Find missing fallback models
- Detect timeout configurations
- Suggest circuit breaker patterns`,
    all: `Analyze all dimensions:
1. Cost: Model selection, caching, redundancy
2. Latency: Parallelization, streaming, batching
3. Reliability: Retries, fallbacks, timeouts
4. Throughput: Rate limits, queuing, scaling`,
  };

  return {
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Analyze the LLM inference patterns in: ${target}

${focusInstructions[focus as keyof typeof focusInstructions] || focusInstructions.all}

Use the PeakInfer MCP tools to:
1. Read the InferenceMap schema from peakinfer://schema/inference-map
2. Scan the codebase for inference callsites
3. Compare to InferenceMAX benchmarks using get_inferencemax_benchmark
4. Save your analysis using save_analysis

For each issue found, provide:
- File and line number
- Current pattern
- Recommended fix
- Estimated impact (cost/latency/reliability)

Output format: Generate an InferenceMap JSON following the schema.`,
      },
    }],
  };
}

function getOptimizeCostsPrompt(args: Record<string, string>) {
  const currentSpend = args.current_spend || 'unknown';
  const providers = args.providers || 'unknown';

  return {
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Help me reduce my LLM inference costs.

Current situation:
- Monthly spend: ${currentSpend}
- Providers: ${providers}

Please analyze my codebase and provide specific recommendations:

1. **Model Right-Sizing**
   - Find GPT-4/Claude calls that could use cheaper models
   - Use get_inferencemax_benchmark to compare model capabilities
   - Suggest specific model swaps with expected savings

2. **Caching Opportunities**
   - Identify repeated prompts with same/similar inputs
   - Suggest semantic caching implementations
   - Estimate cache hit rate potential

3. **Batching & Parallelization**
   - Find sequential calls that could be batched
   - Identify independent calls that could use batch APIs
   - Calculate potential throughput gains

4. **Provider Optimization**
   - Compare pricing across providers for each use case
   - Suggest provider switches where cost-effective
   - Consider self-hosted options for high-volume cases

For each recommendation, provide:
- Current cost estimate
- Proposed change
- New cost estimate
- Implementation effort (low/medium/high)
- Risk level

Use the list_templates tool to find optimization templates.`,
      },
    }],
  };
}

function getDetectDriftPrompt(args: Record<string, string>) {
  const runtimeSource = args.runtime_source;
  const baselineDate = args.baseline_date;

  const baselineInstructions = baselineDate
    ? `Compare to baseline from: ${baselineDate}`
    : `Compare to latest baseline in .peakinfer/runs/ if available`;

  return {
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Detect drift between code patterns and runtime behavior.

Runtime source: ${runtimeSource}
${baselineInstructions}

Use the PeakInfer MCP tools:
1. Fetch runtime data using get_${runtimeSource}_events or get_${runtimeSource}_traces
2. Analyze code patterns in the codebase
3. Compare using compare_to_baseline
4. Get benchmark data using get_inferencemax_benchmark

Look for these drift patterns:

**Model Drift**
- Code specifies model X, runtime shows model Y
- Version mismatches (gpt-4-0125 vs gpt-4-1106)
- Provider switches not reflected in code

**Performance Drift**
- P95 latency increased vs baseline
- Throughput decreased
- Error rate changes

**Usage Drift**
- Token consumption changes
- Request volume anomalies
- Cost per request increases

**Pattern Drift**
- Streaming enabled in code but not used
- Retry logic present but never triggered
- Caching configured but low hit rate

For each drift detected, provide:
- Drift type and severity
- Evidence from code vs runtime
- Recommended action
- Impact if unaddressed`,
      },
    }],
  };
}

function getBenchmarkComparisonPrompt(args: Record<string, string>) {
  const model = args.model;
  const yourP95 = args.your_p95_latency;
  const yourThroughput = args.your_throughput;

  const metricsProvided = yourP95 || yourThroughput;
  const metricsSection = metricsProvided
    ? `Your reported metrics:
- P95 Latency: ${yourP95 || 'not provided'}
- Throughput: ${yourThroughput || 'not provided'}`
    : `No metrics provided - will fetch from runtime source if available.`;

  return {
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Compare inference performance to InferenceMAX benchmarks.

Model: ${model}
${metricsSection}

Use the PeakInfer MCP tools:
1. Get benchmark data: get_inferencemax_benchmark for ${model}
2. Read benchmark summary: peakinfer://benchmarks/summary
3. If runtime source configured, fetch actual metrics

Analysis to perform:

**Latency Analysis**
- Compare your P50/P95/P99 to benchmark
- Identify if you're above/below optimal
- Calculate gap percentage

**Throughput Analysis**
- Compare tokens/second to benchmark
- Identify bottlenecks if below benchmark
- Suggest optimizations

**Cost Efficiency**
- Calculate cost per 1K tokens
- Compare to benchmark pricing
- Identify savings opportunities

**Recommendations**
Based on the gap analysis:
- If latency > benchmark: Check network, streaming, batching
- If throughput < benchmark: Check parallelization, rate limits
- If cost > benchmark: Check model selection, caching

Output a comparison table:
| Metric | Your Value | Benchmark | Gap | Status |
|--------|-----------|-----------|-----|--------|
| P95 Latency | ... | ... | ... | OK/WARN |
| Throughput | ... | ... | ... | OK/WARN |
| Cost/1K | ... | ... | ... | OK/WARN |`,
      },
    }],
  };
}
