# PeakInfer MCP Server

**Achieve peak inference performance in Claude Desktop and Claude Code.**

PeakInfer helps you run AI inference at peak performance by correlating what no one else sees together: your **code**, **runtime behavior**, **benchmarks**, and **evals**.

## The Problem

Your code says `streaming: true`. Runtime shows 0% actual streams. That's drift—and it's killing your latency.

**Peak Inference Performance means:** Improving latency, throughput, reliability, and cost *without changing evaluated behavior*.

## Features

- **Drift Detection**: Find mismatches between code declarations and runtime behavior
- **Runtime Connectors**: Fetch events from Helicone and LangSmith
- **Benchmark Comparison**: Compare your metrics to InferenceMAX benchmarks (15+ models)
- **Template Library**: Access 43 optimization templates
- **Analysis History**: Track and compare performance over time

## Installation

### Claude Desktop

Add to `~/.config/claude/claude_desktop_config.json` (macOS) or `%APPDATA%\claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "peakinfer": {
      "command": "node",
      "args": ["/path/to/peakinfer-mcp/dist/index.js"],
      "env": {
        "HELICONE_API_KEY": "your-key-here",
        "LANGSMITH_API_KEY": "your-key-here"
      }
    }
  }
}
```

### Build from Source

```bash
cd peakinfer-mcp
npm install
npm run build
```

## Available Tools

### Runtime Data

| Tool | Description |
|------|-------------|
| `get_helicone_events` | Fetch LLM events from Helicone |
| `get_langsmith_traces` | Fetch traces from LangSmith |

### Benchmarks

| Tool | Description |
|------|-------------|
| `get_inferencemax_benchmark` | Get benchmark data for a model |
| `compare_to_baseline` | Compare current analysis to historical baseline |

### Templates

| Tool | Description |
|------|-------------|
| `list_templates` | List available optimization templates |
| `get_template` | Get details of a specific template |

### Analysis

| Tool | Description |
|------|-------------|
| `save_analysis` | Save analysis results to history |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `HELICONE_API_KEY` | API key for Helicone integration |
| `LANGSMITH_API_KEY` | API key for LangSmith integration |

## Example Usage

In Claude Desktop or Claude Code:

```
Fetch the last 7 days of events from Helicone and identify any drift between my code and runtime behavior.
```

```
Compare my current p95 latency to InferenceMAX benchmarks for gpt-4o.
```

```
Show me optimization templates for improving throughput without changing model behavior.
```

## Resources

The server also exposes MCP resources:

- `peakinfer://templates` - Optimization templates (43 total)
- `peakinfer://benchmarks` - InferenceMAX benchmark data (15+ models)
- `peakinfer://history` - Analysis run history

## Prompts

Available prompt templates:

- `analyze-file` - Analyze a file for LLM inference points
- `compare-benchmarks` - Compare your metrics to peak benchmarks
- `suggest-optimizations` - Get optimization recommendations that preserve behavior

## The Four Dimensions

PeakInfer analyzes every inference point across 4 dimensions:

| Dimension | What We Find |
|-----------|--------------|
| **Latency** | Missing streaming, blocking calls, p95 vs benchmark gaps |
| **Throughput** | Sequential bottlenecks, batch opportunities |
| **Reliability** | Missing retries, timeouts, fallbacks |
| **Cost** | Right-sized model selection, token optimization |

## Troubleshooting

### Server not appearing in Claude Desktop

1. Check the path to `dist/index.js` is absolute
2. Verify `npm run build` completed successfully
3. Restart Claude Desktop after config changes

### API key errors

1. Verify API keys are set in config `env` section
2. Check keys are valid at provider's dashboard
3. Ensure no trailing whitespace in key values

## Links

- [PeakInfer CLI](https://github.com/Kalmantic/peakinfer)
- [Documentation](https://github.com/Kalmantic/peakinfer#readme)
- [Report Issues](https://github.com/Kalmantic/peakinfer-mcp/issues)

## License

Apache-2.0
