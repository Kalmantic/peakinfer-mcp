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
// Tool definitions
const tools = [
    {
        name: 'analyze',
        description: 'Analyze code for LLM inference issues using PeakInfer engine. Returns detailed report on latency, cost, throughput, and reliability with actionable fixes.',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the code directory or file to analyze',
                },
                files: {
                    type: 'array',
                    description: 'Pre-read files array [{path, content}]. If provided, skips reading from disk.',
                    items: {
                        type: 'object',
                        properties: {
                            path: { type: 'string' },
                            content: { type: 'string' },
                        },
                        required: ['path', 'content'],
                    },
                },
                fixes: {
                    type: 'boolean',
                    description: 'Include code fix suggestions (default: true)',
                    default: true,
                },
                benchmark: {
                    type: 'boolean',
                    description: 'Include benchmark comparisons (default: true)',
                    default: true,
                },
            },
            required: [],
        },
    },
    {
        name: 'get_helicone_events',
        description: 'Fetch LLM runtime events from Helicone for drift detection analysis',
        inputSchema: {
            type: 'object',
            properties: {
                api_key: {
                    type: 'string',
                    description: 'Helicone API key (or set HELICONE_API_KEY env var)',
                },
                days: {
                    type: 'number',
                    description: 'Number of days of data to fetch (default: 7)',
                    default: 7,
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of events to fetch (default: 1000)',
                    default: 1000,
                },
            },
            required: [],
        },
    },
    {
        name: 'get_langsmith_traces',
        description: 'Fetch LLM traces from LangSmith for runtime analysis',
        inputSchema: {
            type: 'object',
            properties: {
                api_key: {
                    type: 'string',
                    description: 'LangSmith API key (or set LANGSMITH_API_KEY env var)',
                },
                days: {
                    type: 'number',
                    description: 'Number of days of data to fetch (default: 7)',
                    default: 7,
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of traces to fetch (default: 1000)',
                    default: 1000,
                },
            },
            required: [],
        },
    },
    {
        name: 'get_inferencemax_benchmark',
        description: 'Get InferenceMAX benchmark data for a specific model to compare performance',
        inputSchema: {
            type: 'object',
            properties: {
                model: {
                    type: 'string',
                    description: 'Model name (e.g., gpt-4o, claude-3-5-sonnet, llama-3.1-70b)',
                },
                framework: {
                    type: 'string',
                    description: 'Framework: api, vllm, tgi, sglang (default: api)',
                    default: 'api',
                },
                hardware: {
                    type: 'string',
                    description: 'Hardware: api, h100, a100 (default: api)',
                    default: 'api',
                },
            },
            required: ['model'],
        },
    },
    {
        name: 'compare_to_baseline',
        description: 'Compare current analysis results to a historical baseline',
        inputSchema: {
            type: 'object',
            properties: {
                current_analysis: {
                    type: 'object',
                    description: 'Current analysis results (InferenceMap format)',
                },
                baseline_path: {
                    type: 'string',
                    description: 'Path to baseline JSON file',
                },
            },
            required: ['current_analysis'],
        },
    },
    {
        name: 'list_templates',
        description: 'List available PeakInfer optimization templates',
        inputSchema: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: 'Filter by category: insights, optimizations, all (default: all)',
                    default: 'all',
                },
            },
            required: [],
        },
    },
    {
        name: 'get_template',
        description: 'Get details of a specific optimization template',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Template name (e.g., overpowered-model, streaming-drift)',
                },
            },
            required: ['name'],
        },
    },
    {
        name: 'save_analysis',
        description: 'Save analysis results to PeakInfer history',
        inputSchema: {
            type: 'object',
            properties: {
                analysis: {
                    type: 'object',
                    description: 'Analysis results to save (InferenceMap format)',
                },
                path: {
                    type: 'string',
                    description: 'Path to save results (default: .peakinfer/runs/)',
                },
            },
            required: ['analysis'],
        },
    },
];
export function registerTools(_server) {
    // Tools are registered via the ListTools and CallTool handlers
}
export function getToolsList() {
    return tools;
}
// Error codes for MCP tool responses
const ErrorCodes = {
    UNKNOWN_TOOL: 'ERR_UNKNOWN_TOOL',
    MISSING_API_KEY: 'ERR_MISSING_API_KEY',
    NETWORK_ERROR: 'ERR_NETWORK',
    RATE_LIMITED: 'ERR_RATE_LIMITED',
    NOT_FOUND: 'ERR_NOT_FOUND',
    INVALID_INPUT: 'ERR_INVALID_INPUT',
    FILE_ERROR: 'ERR_FILE_ERROR',
    INTERNAL_ERROR: 'ERR_INTERNAL',
};
function formatError(error) {
    const lines = [
        `Error [${error.code}]: ${error.message}`,
    ];
    if (error.suggestion) {
        lines.push(`Suggestion: ${error.suggestion}`);
    }
    return {
        content: [{ type: 'text', text: lines.join('\n') }],
    };
}
function classifyError(error) {
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        // Network errors
        if (msg.includes('fetch') || msg.includes('network') || msg.includes('econnrefused')) {
            return {
                code: ErrorCodes.NETWORK_ERROR,
                message: error.message,
                suggestion: 'Check your network connection and try again.',
            };
        }
        // Rate limiting
        if (msg.includes('rate limit') || msg.includes('429') || msg.includes('too many requests')) {
            return {
                code: ErrorCodes.RATE_LIMITED,
                message: error.message,
                suggestion: 'Wait a moment and try again, or reduce request frequency.',
            };
        }
        // File errors
        if (msg.includes('enoent') || msg.includes('no such file') || msg.includes('not found')) {
            return {
                code: ErrorCodes.FILE_ERROR,
                message: error.message,
                suggestion: 'Check that the file path is correct and the file exists.',
            };
        }
        // Invalid input
        if (msg.includes('invalid') || msg.includes('required')) {
            return {
                code: ErrorCodes.INVALID_INPUT,
                message: error.message,
                suggestion: 'Check the input parameters and try again.',
            };
        }
        return {
            code: ErrorCodes.INTERNAL_ERROR,
            message: error.message,
        };
    }
    return {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
    };
}
export async function handleToolCall(name, args) {
    try {
        switch (name) {
            case 'analyze':
                return await handleAnalyze(args);
            case 'get_helicone_events':
                return await handleGetHeliconeEvents(args);
            case 'get_langsmith_traces':
                return await handleGetLangSmithTraces(args);
            case 'get_inferencemax_benchmark':
                return await handleGetBenchmark(args);
            case 'compare_to_baseline':
                return await handleCompareToBaseline(args);
            case 'list_templates':
                return await handleListTemplates(args);
            case 'get_template':
                return await handleGetTemplate(args);
            case 'save_analysis':
                return await handleSaveAnalysis(args);
            default:
                return formatError({
                    code: ErrorCodes.UNKNOWN_TOOL,
                    message: `Unknown tool: ${name}`,
                    suggestion: `Available tools: analyze, get_helicone_events, get_langsmith_traces, get_inferencemax_benchmark, compare_to_baseline, list_templates, get_template, save_analysis`,
                });
        }
    }
    catch (error) {
        return formatError(classifyError(error));
    }
}
// Tool handlers
async function handleAnalyze(args) {
    const path = args.path;
    const preReadFiles = args.files;
    const fixes = args.fixes ?? true;
    const benchmark = args.benchmark ?? true;
    // Step 1: Get files to analyze
    let files;
    if (preReadFiles && preReadFiles.length > 0) {
        files = preReadFiles;
    }
    else if (path) {
        try {
            const { readCodeFiles } = await import('../connectors/file-reader.js');
            files = await readCodeFiles(path);
        }
        catch (error) {
            return formatError({
                code: ErrorCodes.FILE_ERROR,
                message: error instanceof Error ? error.message : 'Failed to read files',
                suggestion: 'Check that the path exists and contains code files (.py, .ts, .js, etc.)',
            });
        }
    }
    else {
        return formatError({
            code: ErrorCodes.INVALID_INPUT,
            message: 'Either path or files must be provided',
            suggestion: 'Provide a path to a code directory or file, or pass pre-read files.',
        });
    }
    // Step 2: Try CLI first (free, local, fast)
    if (path) {
        try {
            const { analyzeViaCLI } = await import('../connectors/peakinfer-cli.js');
            const result = await analyzeViaCLI({ path, options: { fixes, benchmark } });
            if (result) {
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        }],
                };
            }
        }
        catch (error) {
            console.error(`PeakInfer CLI error (falling back to API): ${error instanceof Error ? error.message : 'Unknown'}`);
        }
    }
    // Step 3: Try API fallback (if auth is available)
    const apiToken = process.env.PEAKINFER_API_TOKEN;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (apiToken || anthropicKey) {
        try {
            const { analyzeViaAPI } = await import('../connectors/peakinfer-api.js');
            const result = await analyzeViaAPI({
                files,
                token: apiToken,
                anthropicKey,
                options: { fixes, benchmark },
            });
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    }],
            };
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown API error';
            console.error(`PeakInfer API error: ${errorMsg}`);
        }
    }
    // Step 4: No analysis method available - return setup instructions
    const setupLines = [
        'PeakInfer CLI not found and no API token configured.',
        '',
        'Option 1: Install PeakInfer CLI (recommended, free)',
        '  npm install -g peakinfer',
        '',
        'Option 2: Set up PeakInfer API token (cloud analysis)',
        '  Get a token at: https://peakinfer.com/dashboard',
        '  Add to your MCP config:',
        '  {',
        '    "mcpServers": {',
        '      "peakinfer": {',
        '        "command": "npx",',
        '        "args": ["-y", "@peakinfer/mcp"],',
        '        "env": {',
        '          "PEAKINFER_API_TOKEN": "pk_live_YOUR_TOKEN_HERE"',
        '        }',
        '      }',
        '    }',
        '  }',
        '',
        'Option 3: Use BYOK mode (free, no credits needed)',
        '  Add ANTHROPIC_API_KEY to your MCP config env.',
        '',
        `Files found: ${files.length} code files ready for analysis.`,
    ];
    return {
        content: [{
                type: 'text',
                text: setupLines.join('\n'),
            }],
    };
}
async function handleGetHeliconeEvents(args) {
    const apiKey = args.api_key || process.env.HELICONE_API_KEY;
    if (!apiKey) {
        return {
            content: [{
                    type: 'text',
                    text: 'Error: Helicone API key required. Provide via api_key argument or HELICONE_API_KEY env var.',
                }],
        };
    }
    const days = args.days || 7;
    const limit = args.limit || 1000;
    // Import the bundled connector
    const { fetchHeliconeEvents } = await import('../connectors/helicone.js');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const result = await fetchHeliconeEvents({
        apiKey,
        startDate: startDate.toISOString(),
        limit,
    });
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({
                    events_count: result.events.length,
                    summary: result.summary,
                    metadata: result.metadata,
                    events: result.events.slice(0, 10), // First 10 for preview
                }, null, 2),
            }],
    };
}
async function handleGetLangSmithTraces(args) {
    const apiKey = args.api_key || process.env.LANGSMITH_API_KEY;
    if (!apiKey) {
        return {
            content: [{
                    type: 'text',
                    text: 'Error: LangSmith API key required. Provide via api_key argument or LANGSMITH_API_KEY env var.',
                }],
        };
    }
    const days = args.days || 7;
    const limit = args.limit || 1000;
    const { fetchLangSmithTraces } = await import('../connectors/langsmith.js');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const result = await fetchLangSmithTraces({
        apiKey,
        startDate: startDate.toISOString(),
        limit,
    });
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({
                    traces_count: result.events.length,
                    summary: result.summary,
                    metadata: result.metadata,
                    events: result.events.slice(0, 10), // First 10 for preview
                }, null, 2),
            }],
    };
}
async function handleGetBenchmark(args) {
    const model = args.model;
    const framework = args.framework || 'api';
    const hardware = args.hardware || 'api';
    const { getBenchmark } = await import('../benchmarks/index.js');
    const benchmark = getBenchmark(model, framework, hardware);
    if (!benchmark) {
        return {
            content: [{
                    type: 'text',
                    text: `No benchmark data found for model: ${model}. Available models include: gpt-4o, gpt-4o-mini, claude-3-5-sonnet, claude-3-5-haiku, gemini-2.0-flash, llama-3.1-70b, mistral-large`,
                }],
        };
    }
    return {
        content: [{
                type: 'text',
                text: JSON.stringify(benchmark, null, 2),
            }],
    };
}
async function handleCompareToBaseline(args) {
    const currentAnalysis = args.current_analysis;
    const baselinePath = args.baseline_path;
    // If no baseline path, compare to latest in history
    let baseline = null;
    if (baselinePath) {
        const { readFileSync, existsSync } = await import('fs');
        if (!existsSync(baselinePath)) {
            return {
                content: [{
                        type: 'text',
                        text: `Baseline file not found: ${baselinePath}`,
                    }],
            };
        }
        baseline = JSON.parse(readFileSync(baselinePath, 'utf-8'));
    }
    // Simple comparison - count differences in callsites
    const currentCallsites = currentAnalysis.callsites?.length || 0;
    const baselineCallsites = baseline ? baseline.callsites?.length || 0 : 0;
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({
                    current: { callsites: currentCallsites },
                    baseline: baseline ? { callsites: baselineCallsites } : null,
                    delta: {
                        callsites: currentCallsites - baselineCallsites,
                    },
                }, null, 2),
            }],
    };
}
async function handleListTemplates(args) {
    const category = args.category || 'all';
    // List templates from the templates directory
    const { readdirSync, existsSync } = await import('fs');
    const { join, dirname } = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const templatesDir = join(__dirname, '../../../../templates');
    const templates = [];
    if (existsSync(templatesDir)) {
        if (category === 'all' || category === 'insights') {
            const insightsDir = join(templatesDir, 'insights');
            if (existsSync(insightsDir)) {
                for (const file of readdirSync(insightsDir)) {
                    if (file.endsWith('.yaml')) {
                        templates.push({ name: file.replace('.yaml', ''), category: 'insights' });
                    }
                }
            }
        }
        if (category === 'all' || category === 'optimizations') {
            const optimizationsDir = join(templatesDir, 'optimizations');
            if (existsSync(optimizationsDir)) {
                for (const file of readdirSync(optimizationsDir)) {
                    if (file.endsWith('.yaml')) {
                        templates.push({ name: file.replace('.yaml', ''), category: 'optimizations' });
                    }
                }
            }
        }
    }
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ templates, count: templates.length }, null, 2),
            }],
    };
}
async function handleGetTemplate(args) {
    const name = args.name;
    const { readFileSync, existsSync } = await import('fs');
    const { join, dirname } = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const templatesDir = join(__dirname, '../../../../templates');
    // Search in both directories
    const paths = [
        join(templatesDir, 'insights', `${name}.yaml`),
        join(templatesDir, 'optimizations', `${name}.yaml`),
    ];
    for (const path of paths) {
        if (existsSync(path)) {
            const content = readFileSync(path, 'utf-8');
            return {
                content: [{
                        type: 'text',
                        text: content,
                    }],
            };
        }
    }
    return {
        content: [{
                type: 'text',
                text: `Template not found: ${name}`,
            }],
    };
}
async function handleSaveAnalysis(args) {
    const analysis = args.analysis;
    const customPath = args.path;
    const { writeFileSync, mkdirSync, existsSync } = await import('fs');
    const { join } = await import('path');
    const runsDir = customPath || '.peakinfer/runs';
    if (!existsSync(runsDir)) {
        mkdirSync(runsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `analysis-${timestamp}.json`;
    const filepath = join(runsDir, filename);
    writeFileSync(filepath, JSON.stringify(analysis, null, 2));
    return {
        content: [{
                type: 'text',
                text: `Analysis saved to: ${filepath}`,
            }],
    };
}
//# sourceMappingURL=index.js.map