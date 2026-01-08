# PeakInfer MCP Server

**Achieve peak inference performance in Claude Desktop and Claude Code.**

PeakInfer helps you run AI inference at peak performance by correlating what no one else sees together: your **code**, **runtime behavior**, **benchmarks**, and **evals**.

## The Problem

Your code says `streaming: true`. Runtime shows 0% actual streams. That's drift—and it's killing your latency.

**Peak Inference Performance means:** Improving latency, throughput, reliability, and cost *without changing evaluated behavior*.

## Features

- **Drift Detection**: Find mismatches between code declarations and runtime behavior
- **Runtime Connectors**: Fetch events from Helicone and Langfuse
- **Benchmark Comparison**: Compare your metrics to InferenceMAX benchmarks (15+ models)
- **Template Library**: Access 43 optimization templates
- **Analysis History**: Track and compare performance over time

## Installation

### Via npx (Recommended)

```bash
npx @kalmantic/peakinfer-mcp
```

### Via npm (Global)

```bash
npm install -g @kalmantic/peakinfer-mcp
peakinfer-mcp
```

### Claude Desktop Configuration

Add to `~/.config/claude/claude_desktop_config.json` (macOS) or `%APPDATA%\claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "peakinfer": {
      "command": "npx",
      "args": ["@kalmantic/peakinfer-mcp"],
      "env": {
        "HELICONE_API_KEY": "your-key-here",
        "LANGFUSE_PUBLIC_KEY": "your-public-key-here",
        "LANGFUSE_SECRET_KEY": "your-secret-key-here"
      }
    }
  }
}
```

### Claude Code Configuration

Add to `~/.config/claude/mcp.json` (macOS/Linux) or `%APPDATA%\Claude\mcp.json` (Windows):

```json
{
  "mcpServers": {
    "peakinfer": {
      "command": "npx",
      "args": ["@kalmantic/peakinfer-mcp"],
      "env": {
        "HELICONE_API_KEY": "your-key-here",
        "LANGFUSE_PUBLIC_KEY": "your-public-key-here",
        "LANGFUSE_SECRET_KEY": "your-secret-key-here"
      }
    }
  }
}
```

**Note:** If the `~/.config/claude/` directory doesn't exist, create it first. After saving the configuration, restart Claude Code to apply the changes.

### Build from Source

```bash
git clone https://github.com/Kalmantic/peakinfer-mcp.git
cd peakinfer-mcp
npm install
npm run build
```

## Available Tools

### Runtime Data

| Tool | Description |
|------|-------------|
| `get_helicone_events` | Fetch LLM events from Helicone |
| `get_langfuse_traces` | Fetch traces from Langfuse |

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
| `LANGFUSE_PUBLIC_KEY` | Public key for Langfuse integration |
| `LANGFUSE_SECRET_KEY` | Secret key for Langfuse integration |
| `LANGFUSE_HOST` | (Optional) Custom Langfuse host for self-hosted instances |

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

### Server not appearing in Claude Desktop/Code

**For Claude Desktop:**
1. Check the path to `dist/index.js` is absolute (if using local build)
2. Verify `npm run build` completed successfully (if using local build)
3. Restart Claude Desktop after config changes

**For Claude Code:**
1. Verify the `mcp.json` file exists at `~/.config/claude/mcp.json` (macOS/Linux) or `%APPDATA%\Claude\mcp.json` (Windows)
2. Check the JSON syntax is valid
3. Ensure `npx` is available in your PATH
4. Restart Claude Code after config changes

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
